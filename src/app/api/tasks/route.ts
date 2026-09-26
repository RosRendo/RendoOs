import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function updateProjectProgress(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    });
    if (tasks.length > 0) {
      const doneCount = tasks.filter((t) => t.status === 'DONE').length;
      const progress = Math.round((doneCount / tasks.length) * 100);
      await prisma.project.update({
        where: { id: projectId },
        data: { progress },
      });
    }
  } catch (err) {
    console.error('Failed to auto-update progress:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description, bucket, priority, dueDate, notes } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        bucket: bucket || 'NOW',
        priority: priority || 'MEDIUM',
        status: 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
      },
    });

    await updateProjectProgress(projectId);

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, bucket, priority, title, description, dueDate, notes, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (bucket !== undefined) updateData.bucket = bucket;
    if (priority !== undefined) updateData.priority = priority;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;
    if (order !== undefined) updateData.order = order;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    await updateProjectProgress(task.projectId);

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const task = await prisma.task.delete({
      where: { id },
    });

    await updateProjectProgress(task.projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
