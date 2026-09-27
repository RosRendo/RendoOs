import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = Date.now();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      completedTasks,
      projectsTouched,
      allActiveProjects,
      newIdeas,
      primaryProject,
    ] = await Promise.all([
      // 1. Tasks completed in past 7 days
      prisma.task.findMany({
        where: {
          status: 'DONE',
          updatedAt: { gte: sevenDaysAgo },
        },
        include: {
          project: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),

      // 2. Projects touched in past 7 days
      prisma.project.findMany({
        where: {
          status: { not: 'ARCHIVED' },
          updatedAt: { gte: sevenDaysAgo },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          progress: true,
          currentMilestone: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),

      // 3. All non-archived projects to find inactive ones
      prisma.project.findMany({
        where: { status: { not: 'ARCHIVED' } },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          updatedAt: true,
        },
      }),

      // 4. New ideas in past 7 days
      prisma.idea.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        include: {
          project: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // 5. Current focus project
      prisma.project.findFirst({
        where: { isPrimary: true },
        include: {
          tasks: {
            where: { status: 'TODO' },
            orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          },
          blockers: {
            where: { resolved: false },
          },
        },
      }),
    ]);

    // Compute inactive projects (not touched in > 7 days)
    const inactiveProjects = allActiveProjects.filter((p) => {
      const daysSince = Math.floor((now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 7;
    });

    // Next week tasks (top NOW or NEXT tasks from focus or active projects)
    const nextWeekTasks = primaryProject
      ? primaryProject.tasks.slice(0, 6)
      : await prisma.task.findMany({
          where: {
            status: 'TODO',
            bucket: { in: ['NOW', 'NEXT'] },
          },
          include: {
            project: { select: { id: true, name: true, slug: true } },
          },
          take: 6,
        });

    return NextResponse.json({
      completedCount: completedTasks.length,
      completedTasks: completedTasks.slice(0, 10),
      projectsTouchedCount: projectsTouched.length,
      projectsTouched,
      inactiveProjectsCount: inactiveProjects.length,
      inactiveProjects,
      newIdeasCount: newIdeas.length,
      newIdeas: newIdeas.slice(0, 8),
      currentFocus: primaryProject,
      nextWeekTasks,
    });
  } catch (error) {
    console.error('Error fetching weekly review data:', error);
    return NextResponse.json({ error: 'Failed to fetch weekly review data' }, { status: 500 });
  }
}
