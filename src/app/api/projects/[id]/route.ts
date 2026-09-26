import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        tasks: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
        blockers: {
          orderBy: { createdAt: 'desc' },
        },
        ideas: {
          orderBy: { createdAt: 'desc' },
        },
        links: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {};
    const allowedFields = [
      'name',
      'description',
      'status',
      'isPrimary',
      'progress',
      'image',
      'mobileImage',
      'currentMilestone',
      'overview',
      'techStack',
      'architecture',
      'repoUrl',
      'liveUrl',
      'health',
      'folderPath',
      'runScript',
      'port',
      'isRunning',
      'backendPath',
      'backendScript',
      'backendPort',
      'isBackendRunning',
      'extraPath',
      'extraScript',
      'extraPort',
      'extraName',
      'isExtraRunning',
      'slug',
      'flowExplainer',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'techStack' && typeof body[field] === 'object') {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // If setting isPrimary to true, unset others
    if (body.isPrimary === true) {
      await prisma.project.updateMany({
        where: { id: { not: id } },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
