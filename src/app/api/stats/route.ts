import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch primary focus project
    let primaryProject = await prisma.project.findFirst({
      where: { isPrimary: true },
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
        links: true,
      },
    });

    // Fallback if none marked primary: find first active project
    if (!primaryProject) {
      primaryProject = await prisma.project.findFirst({
        where: { status: 'ACTIVE' },
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
          links: true,
        },
      });
    }

    // 2. Counts
    const [
      activeCount,
      experimentCount,
      pausedCount,
      archivedCount,
      ideasCount,
      allProjects,
      recentlyUpdatedProjects,
      recentlyCompletedTasks,
      recentlyAddedIdeas,
    ] = await Promise.all([
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.project.count({ where: { status: 'EXPERIMENT' } }),
      prisma.project.count({ where: { status: 'PAUSED' } }),
      prisma.project.count({ where: { status: 'ARCHIVED' } }),
      prisma.idea.count(),
      prisma.project.findMany({
        where: { status: { not: 'ARCHIVED' } },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          updatedAt: true,
          health: true,
          blockers: {
            where: { resolved: false },
            select: { id: true, title: true },
          },
          tasks: {
            where: { status: 'TODO' },
            select: { id: true, title: true, dueDate: true },
          },
        },
      }),
      // Recently touched projects (not archived)
      prisma.project.findMany({
        where: { status: { not: 'ARCHIVED' } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          progress: true,
          updatedAt: true,
          currentMilestone: true,
        },
      }),
      // Recently completed tasks
      prisma.task.findMany({
        where: { status: 'DONE' },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          bucket: true,
          priority: true,
          updatedAt: true,
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      // Recently added ideas
      prisma.idea.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    // 3. Alerts calculation
    const alerts: Array<{
      id: string;
      type: 'warning' | 'blocker' | 'info';
      title: string;
      message: string;
      projectId?: string;
    }> = [];

    const now = Date.now();

    for (const p of allProjects) {
      // Unresolved blockers
      if (p.blockers.length > 0) {
        alerts.push({
          id: `blocker-${p.id}`,
          type: 'blocker',
          title: `Blocked: ${p.name}`,
          message: `${p.blockers.length} blocker${p.blockers.length > 1 ? 's' : ''}: ${p.blockers.map((b) => b.title).join(', ')}`,
          projectId: p.id,
        });
      }

      // Not updated in 5+ days for active project
      const daysSince = Math.floor((now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (p.status === 'ACTIVE' && daysSince >= 5) {
        alerts.push({
          id: `stale-${p.id}`,
          type: 'warning',
          title: `Project needs update: ${p.name}`,
          message: `Hasn't been touched in ${daysSince} days. Check active tasks.`,
          projectId: p.id,
        });
      }

      // Overdue tasks
      const overdue = p.tasks.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < now);
      if (overdue.length > 0) {
        alerts.push({
          id: `overdue-${p.id}`,
          type: 'warning',
          title: `Overdue Tasks in ${p.name}`,
          message: `${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue.`,
          projectId: p.id,
        });
      }
    }

    return NextResponse.json({
      primaryProject,
      counts: {
        active: activeCount,
        experiment: experimentCount,
        paused: pausedCount,
        archived: archivedCount,
        ideas: ideasCount,
        total: activeCount + experimentCount + pausedCount,
      },
      recentActivity: {
        projects: recentlyUpdatedProjects,
        tasks: recentlyCompletedTasks,
        ideas: recentlyAddedIdeas,
      },
      alerts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
