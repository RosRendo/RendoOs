import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // 1. Fetch logged activities
    const loggedActivities = await (prisma as any).activity.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // 2. Also fetch recently completed tasks to weave into a comprehensive timeline
    const completedTasks = await prisma.task.findMany({
      where: {
        status: 'DONE',
        ...(projectId ? { projectId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: 30,
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // 3. Merge into unified chronological events
    const timelineEvents: Array<{
      id: string;
      type: string;
      title: string;
      description?: string | null;
      timestamp: string;
      project?: { id: string; name: string; slug: string } | null;
    }> = [];

    for (const a of loggedActivities) {
      timelineEvents.push({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        timestamp: new Date(a.createdAt).toISOString(),
        project: a.project,
      });
    }

    for (const t of completedTasks) {
      timelineEvents.push({
        id: `task-${t.id}`,
        type: 'TASK_COMPLETED',
        title: `Completed task: ${t.title}`,
        description: t.description,
        timestamp: new Date(t.updatedAt).toISOString(),
        project: t.project,
      });
    }

    // Sort descending by timestamp
    timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(timelineEvents.slice(0, 50));
  } catch (error) {
    console.error('Error fetching activity timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch activity timeline' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type = 'NOTE_CREATED', title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const activity = await (prisma as any).activity.create({
      data: {
        projectId: projectId || null,
        type,
        title: title.trim(),
        description: description ? description.trim() : null,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
