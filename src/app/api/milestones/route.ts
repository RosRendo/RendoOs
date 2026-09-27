import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const where = projectId ? { projectId } : {};

    const milestones = await (prisma as any).milestone.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones', message: (error as any)?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, progress = 0, status = 'PENDING', dueDate, order = 0 } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    const milestone = await (prisma as any).milestone.create({
      data: {
        projectId,
        title: title.trim(),
        progress: Number(progress) || 0,
        status,
        order: Number(order) || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    // Log activity
    await (prisma as any).activity.create({
      data: {
        projectId,
        type: 'MILESTONE_CREATED',
        title: `Created milestone: ${title.trim()}`,
      },
    }).catch(() => {});

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, progress, status, dueDate, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (progress !== undefined) {
      data.progress = Math.min(100, Math.max(0, Number(progress)));
      if (data.progress === 100) data.status = 'COMPLETED';
    }
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (order !== undefined) data.order = Number(order);

    const updated = await (prisma as any).milestone.update({
      where: { id },
      data,
    });

    // If completed or updated, log activity
    if (data.progress === 100 || data.status === 'COMPLETED') {
      await (prisma as any).activity.create({
        data: {
          projectId: updated.projectId,
          type: 'MILESTONE_COMPLETED',
          title: `Completed milestone: ${updated.title}`,
        },
      }).catch(() => {});
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    await (prisma as any).milestone.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 });
  }
}
