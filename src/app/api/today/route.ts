import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Fetch Primary Focus Project
    let primaryProject = await prisma.project.findFirst({
      where: { isPrimary: true },
      include: {
        tasks: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
        blockers: {
          where: { resolved: false },
        },
        links: true,
      },
    });

    if (!primaryProject) {
      primaryProject = await prisma.project.findFirst({
        where: { status: 'ACTIVE' },
        include: {
          tasks: {
            orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          },
          blockers: {
            where: { resolved: false },
          },
          links: true,
        },
      });
    }

    // 2. Fetch all active projects to compute reminders & needs attention
    const activeProjects = await prisma.project.findMany({
      where: { status: { not: 'ARCHIVED' } },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        updatedAt: true,
        progress: true,
        currentMilestone: true,
        tasks: {
          where: { status: 'TODO' },
          select: {
            id: true,
            title: true,
            bucket: true,
            priority: true,
            dueDate: true,
          },
        },
        blockers: {
          where: { resolved: false },
          select: { id: true, title: true },
        },
      },
    });

    // 3. Today's Tasks
    // A) Tasks due today (or overdue) across any project
    const dueOrOverdueTasks = await prisma.task.findMany({
      where: {
        status: 'TODO',
        dueDate: {
          lte: endOfToday,
        },
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 6,
    });

    // B) Top NOW tasks from current primary focus
    const focusNowTasks = primaryProject
      ? primaryProject.tasks
          .filter((t) => t.status === 'TODO' && t.bucket === 'NOW')
          .slice(0, 4)
          .map((t) => ({
            ...t,
            project: {
              id: primaryProject.id,
              name: primaryProject.name,
              slug: primaryProject.slug,
            },
          }))
      : [];

    // Combine without duplicates
    const seenIds = new Set<string>();
    const todayTasks: any[] = [];

    for (const t of [...focusNowTasks, ...dueOrOverdueTasks]) {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        todayTasks.push(t);
      }
    }

    // 4. Needs Attention & Reminders
    const needsAttention: Array<{
      id: string;
      type: 'overdue' | 'inactive' | 'blocker';
      projectId: string;
      projectName: string;
      projectSlug: string;
      title: string;
      message: string;
      daysInactive?: number;
      overdueCount?: number;
    }> = [];

    for (const p of activeProjects) {
      // Overdue tasks
      const overdue = p.tasks.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < now);
      if (overdue.length > 0) {
        needsAttention.push({
          id: `overdue-${p.id}`,
          type: 'overdue',
          projectId: p.id,
          projectName: p.name,
          projectSlug: p.slug,
          title: `${p.name} — ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`,
          message: `${overdue.map((t) => t.title).slice(0, 2).join(', ')}${overdue.length > 2 ? ` +${overdue.length - 2} more` : ''}`,
          overdueCount: overdue.length,
        });
      }

      // Inactivity reminder (no update for 10+ days on active project)
      const daysSince = Math.floor((now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (p.status === 'ACTIVE' && daysSince >= 10) {
        needsAttention.push({
          id: `inactive-${p.id}`,
          type: 'inactive',
          projectId: p.id,
          projectName: p.name,
          projectSlug: p.slug,
          title: `${p.name} — Inactive for ${daysSince} days`,
          message: `No code touches or task updates in ${daysSince} days. Review project status.`,
          daysInactive: daysSince,
        });
      }

      // Unresolved blockers
      if (p.blockers.length > 0) {
        needsAttention.push({
          id: `blocker-${p.id}`,
          type: 'blocker',
          projectId: p.id,
          projectName: p.name,
          projectSlug: p.slug,
          title: `Blocked: ${p.name}`,
          message: `${p.blockers.map((b) => b.title).join(', ')}`,
        });
      }
    }

    // 5. Tasks completed today
    const completedTodayCount = await prisma.task.count({
      where: {
        status: 'DONE',
        updatedAt: {
          gte: startOfToday,
        },
      },
    });

    return NextResponse.json({
      primaryProject,
      todayTasks,
      needsAttention,
      completedTodayCount,
    });
  } catch (error) {
    console.error('Error fetching today dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch today data' }, { status: 500 });
  }
}
