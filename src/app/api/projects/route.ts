import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    } else if (!includeArchived) {
      where.status = { not: 'ARCHIVED' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { overview: { contains: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { isPrimary: 'desc' },
        { updatedAt: 'desc' },
      ],
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            bucket: true,
            priority: true,
          },
        },
        blockers: {
          where: { resolved: false },
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            blockers: true,
            ideas: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      status,
      techStack,
      overview,
      repoUrl,
      liveUrl,
      currentMilestone,
      image,
      folderPath,
      runScript,
      port,
      backendPath,
      backendScript,
      backendPort,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug || 'project';
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description: description || '',
        status: status || 'ACTIVE',
        techStack: typeof techStack === 'object' ? JSON.stringify(techStack) : techStack,
        overview,
        repoUrl,
        liveUrl,
        currentMilestone,
        image,
        folderPath,
        runScript: runScript || 'npm run dev',
        port: port ? parseInt(port, 10) : 3000,
        backendPath,
        backendScript: backendScript || 'npm run start:dev',
        backendPort: backendPort ? parseInt(backendPort, 10) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
