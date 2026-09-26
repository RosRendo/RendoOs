import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const standaloneOnly = searchParams.get('standalone') === 'true';

    const where: any = {};
    if (projectId) {
      where.projectId = projectId;
    } else if (standaloneOnly) {
      where.projectId = null;
    }

    const ideas = await prisma.idea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, projectId, tags } = body;

    if (!title) {
      return NextResponse.json({ error: 'Idea title is required' }, { status: 400 });
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        projectId: projectId || null,
        tags,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, projectId, convertToProject } = body;

    if (!id) {
      return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
    }

    // Convert idea to a new project!
    if (convertToProject) {
      const existingIdea = await prisma.idea.findUnique({ where: { id } });
      if (!existingIdea) {
        return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
      }

      const baseSlug = existingIdea.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let slug = baseSlug || 'idea-project';
      let counter = 1;
      while (await prisma.project.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const newProject = await prisma.project.create({
        data: {
          name: existingIdea.title,
          slug,
          description: existingIdea.description || '',
          status: 'IDEA',
          overview: existingIdea.description || '',
        },
      });

      const updatedIdea = await prisma.idea.update({
        where: { id },
        data: {
          convertedToProjectId: newProject.id,
          projectId: newProject.id,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return NextResponse.json({ idea: updatedIdea, project: newProject });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (projectId !== undefined) updateData.projectId = projectId || null;

    const idea = await prisma.idea.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
    }

    await prisma.idea.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
