import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function updateProjectHealth(projectId: string) {
  try {
    const unresolvedBlockers = await prisma.blocker.count({
      where: { projectId, resolved: false },
    });
    await prisma.project.update({
      where: { id: projectId },
      data: {
        health: unresolvedBlockers > 0 ? 'BLOCKED' : 'HEALTHY',
      },
    });
  } catch (err) {
    console.error('Failed to update project health:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    const blocker = await prisma.blocker.create({
      data: {
        projectId,
        title,
        description,
        resolved: false,
      },
    });

    await updateProjectHealth(projectId);

    return NextResponse.json(blocker, { status: 201 });
  } catch (error) {
    console.error('Error creating blocker:', error);
    return NextResponse.json({ error: 'Failed to create blocker' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, resolved, title, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blocker ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (resolved !== undefined) updateData.resolved = resolved;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const blocker = await prisma.blocker.update({
      where: { id },
      data: updateData,
    });

    await updateProjectHealth(blocker.projectId);

    return NextResponse.json(blocker);
  } catch (error) {
    console.error('Error updating blocker:', error);
    return NextResponse.json({ error: 'Failed to update blocker' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blocker ID is required' }, { status: 400 });
    }

    const blocker = await prisma.blocker.delete({
      where: { id },
    });

    await updateProjectHealth(blocker.projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blocker:', error);
    return NextResponse.json({ error: 'Failed to delete blocker' }, { status: 500 });
  }
}
