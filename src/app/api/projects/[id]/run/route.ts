import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { spawn, exec } from 'child_process';
import path from 'path';

// Global registry of running project child processes
interface RunningProcess {
  pid: number;
  child: any;
  startedAt: Date;
  folderPath: string;
  type: 'frontend' | 'backend' | 'extra';
}

const globalForRunner = globalThis as unknown as {
  runningProjects?: Map<string, RunningProcess>;
};

if (!globalForRunner.runningProjects) {
  globalForRunner.runningProjects = new Map();
}

const runningProjects = globalForRunner.runningProjects;

function stopProcess(key: string): boolean {
  if (runningProjects.has(key)) {
    const proc = runningProjects.get(key);
    if (proc?.pid) {
      if (process.platform === 'win32') {
        exec(`taskkill /pid ${proc.pid} /T /F`, (err) => {
          if (err) console.error(`Taskkill error for ${key}:`, err);
        });
      } else {
        try { proc.child.kill('SIGTERM'); } catch (kErr) { console.error(kErr); }
      }
    }
    runningProjects.delete(key);
    return true;
  }
  return false;
}

function spawnService(
  key: string,
  cwd: string,
  command: string,
  type: 'frontend' | 'backend' | 'extra',
  onExit: () => void
): number | null {
  stopProcess(key);
  const child = spawn(command, { cwd: path.resolve(cwd), shell: true, detached: false, stdio: 'pipe' });
  if (child.pid) {
    runningProjects.set(key, { pid: child.pid, child, startedAt: new Date(), folderPath: cwd, type });
    child.on('exit', () => { runningProjects.delete(key); onExit(); });
    return child.pid;
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const feKey = `${project.id}:frontend`;
    const beKey = `${project.id}:backend`;
    const exKey = `${project.id}:extra`;

    return NextResponse.json({
      id: project.id,
      isRunning: runningProjects.has(feKey),
      isFrontendRunning: runningProjects.has(feKey),
      isBackendRunning: runningProjects.has(beKey),
      isExtraRunning: runningProjects.has(exKey),
      frontendPort: project.port || 3000,
      backendPort: project.backendPort || null,
      extraPort: project.extraPort || null,
      frontendPid: runningProjects.get(feKey)?.pid || null,
      backendPid: runningProjects.get(beKey)?.pid || null,
      extraPid: runningProjects.get(exKey)?.pid || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || 'toggle'; // 'start', 'stop', 'toggle'
    const target = body.target || 'frontend'; // 'frontend', 'backend', 'extra', 'all'

    const project = await prisma.project.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const feKey = `${project.id}:frontend`;
    const beKey = `${project.id}:backend`;
    const exKey = `${project.id}:extra`;

    const wantsFe = target === 'frontend' || target === 'all';
    const wantsBe = target === 'backend' || target === 'all';
    const wantsEx = target === 'extra' || target === 'all';

    // ---------------------------------------------------------------
    // STOP ACTION
    // ---------------------------------------------------------------
    if (action === 'stop') {
      if (wantsFe) {
        stopProcess(feKey);
        await prisma.project.update({ where: { id: project.id }, data: { isRunning: false } });
      }
      if (wantsBe) {
        stopProcess(beKey);
        await prisma.project.update({ where: { id: project.id }, data: { isBackendRunning: false } });
      }
      if (wantsEx) {
        stopProcess(exKey);
        await prisma.project.update({ where: { id: project.id }, data: { isExtraRunning: false } });
      }

      return NextResponse.json({
        success: true,
        isFrontendRunning: runningProjects.has(feKey),
        isBackendRunning: runningProjects.has(beKey),
        isExtraRunning: runningProjects.has(exKey),
        isRunning: runningProjects.has(feKey),
        message: `${target} stopped.`,
      });
    }

    // ---------------------------------------------------------------
    // START ACTION
    // ---------------------------------------------------------------
    if (action === 'start') {
      const results: any = {};

      // Frontend
      if (wantsFe && project.folderPath) {
        const pid = spawnService(feKey, project.folderPath, project.runScript || 'npm run dev', 'frontend', async () => {
          try { await prisma.project.update({ where: { id: project.id }, data: { isRunning: false } }); } catch {}
        });
        if (pid) {
          await prisma.project.update({ where: { id: project.id }, data: { isRunning: true } });
          results.frontend = { pid, port: project.port };
        }
      } else if (wantsFe && target === 'frontend') {
        return NextResponse.json({ error: 'Frontend folder path not configured.' }, { status: 400 });
      }

      // Backend
      if (wantsBe && (project.backendPath || project.folderPath)) {
        const bePath = project.backendPath || project.folderPath!;
        const pid = spawnService(beKey, bePath, project.backendScript || 'npm run start:dev', 'backend', async () => {
          try { await prisma.project.update({ where: { id: project.id }, data: { isBackendRunning: false } }); } catch {}
        });
        if (pid) {
          await prisma.project.update({ where: { id: project.id }, data: { isBackendRunning: true } });
          results.backend = { pid, port: project.backendPort };
        }
      } else if (wantsBe && target === 'backend') {
        return NextResponse.json({ error: 'Backend folder path not configured.' }, { status: 400 });
      }

      // Extra (e.g. Expo / React Native)
      if (wantsEx && project.extraPath) {
        const pid = spawnService(exKey, project.extraPath, project.extraScript || 'npx expo start', 'extra', async () => {
          try { await prisma.project.update({ where: { id: project.id }, data: { isExtraRunning: false } }); } catch {}
        });
        if (pid) {
          await prisma.project.update({ where: { id: project.id }, data: { isExtraRunning: true } });
          results.extra = { pid, port: project.extraPort };
        }
      } else if (wantsEx && target === 'extra') {
        return NextResponse.json({ error: 'Extra service path not configured.' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        isFrontendRunning: runningProjects.has(feKey),
        isBackendRunning: runningProjects.has(beKey),
        isExtraRunning: runningProjects.has(exKey),
        isRunning: runningProjects.has(feKey),
        results,
      });
    }

    // ---------------------------------------------------------------
    // TOGGLE ACTION
    // ---------------------------------------------------------------
    if (action === 'toggle') {
      const isFeRunning = runningProjects.has(feKey);
      const isBeRunning = runningProjects.has(beKey);
      const isExRunning = runningProjects.has(exKey);

      let nextAction: string;
      if (target === 'frontend') nextAction = isFeRunning ? 'stop' : 'start';
      else if (target === 'backend') nextAction = isBeRunning ? 'stop' : 'start';
      else if (target === 'extra') nextAction = isExRunning ? 'stop' : 'start';
      else nextAction = (isFeRunning || isBeRunning || isExRunning) ? 'stop' : 'start'; // all

      return POST(
        new NextRequest(request.url, {
          method: 'POST',
          body: JSON.stringify({ action: nextAction, target }),
        }),
        { params }
      );
    }

    return NextResponse.json({ error: 'Invalid action or target' }, { status: 400 });
  } catch (error: any) {
    console.error('Runner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
