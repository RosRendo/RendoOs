import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

interface FlowFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  tech?: string[];
}

interface FlowStep {
  number: number;
  title: string;
  description: string;
}

interface FlowService {
  name: string;
  port?: number | null;
  tech: string;
  type: 'frontend' | 'backend' | 'database' | 'external';
  script?: string;
}

export interface FlowData {
  version: number;
  summary: string;
  steps: FlowStep[];
  features: FlowFeature[];
  services: FlowService[];
  pages: string[];
  apiRoutes: string[];
}

function safeRead(filePath: string): string {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return ''; }
}

function readJson(filePath: string): any {
  try { return JSON.parse(safeRead(filePath)); } catch { return null; }
}

function getApiRoutes(appDir: string): string[] {
  const routes: string[] = [];
  try {
    const scan = (dir: string, prefix: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name.startsWith('.')) continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) scan(full, prefix + '/' + e.name);
        else if (e.name === 'route.ts' || e.name === 'route.js') routes.push('/api' + prefix);
      }
    };
    const apiDir = path.join(appDir, 'api');
    if (fs.existsSync(apiDir)) scan(apiDir, '');
  } catch {}
  return routes;
}

function getPages(appDir: string): string[] {
  const pages: string[] = [];
  try {
    const scan = (dir: string, prefix: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name.startsWith('.') || e.name === 'api') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) scan(full, prefix + '/' + e.name);
        else if (['page.tsx', 'page.jsx', 'page.js'].includes(e.name)) {
          const p = prefix || '/';
          if (!pages.includes(p)) pages.push(p);
        }
      }
    };
    scan(appDir, '');
  } catch {}
  return pages;
}

function detectFeatures(folderPath: string, pkg: any): FlowFeature[] {
  const features: FlowFeature[] = [];
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  let id = 0;
  const add = (icon: string, title: string, desc: string, color: string, tech: string[] = []) =>
    features.push({ id: String(++id), icon, title, description: desc, color, tech });

  if (deps['socket.io'] || deps['socket.io-client'])
    add('zap', 'Real-Time Communication', 'Live bidirectional data sync via Socket.io WebSocket. State updates push instantly to all connected clients without polling.', 'amber', ['Socket.io']);
  if (deps['xterm'] || deps['xterm-addon-fit'])
    add('terminal', 'Embedded Terminal', 'Full browser-based terminal emulator via xterm.js. Supports interactive shell sessions streamed from the server.', 'emerald', ['xterm.js']);
  if (deps['@monaco-editor/react'] || deps['monaco-editor'])
    add('code-2', 'Code Editor', 'Monaco-powered in-browser editor with syntax highlighting, IntelliSense, and multi-language support.', 'sky', ['Monaco Editor']);
  if (deps['telegraf'] || deps['node-telegram-bot-api'])
    add('message-square', 'Telegram Bot', 'Integrated Telegram bot via Telegraf for notifications, commands, and remote control from your phone.', 'blue', ['Telegraf']);
  if (deps['stripe'] || deps['@stripe/stripe-js'])
    add('credit-card', 'Payment Processing', 'Secure checkout via Stripe Elements and Payment Intents. Handles card data, 3D Secure, and webhook events.', 'violet', ['Stripe']);
  if (deps['@prisma/client'] || deps['prisma'])
    add('database', 'Database Layer', 'Type-safe database queries via Prisma ORM. Schema-driven migrations keep data model in sync with code.', 'purple', ['Prisma ORM']);
  if (deps['next-auth'] || deps['@auth/core'])
    add('shield', 'Authentication', 'Full session management and OAuth login via NextAuth. Supports multiple providers with JWT or database sessions.', 'rose', ['NextAuth']);
  if (deps['openai'] || deps['@anthropic-ai/sdk'] || deps['@google/generative-ai'])
    add('sparkles', 'AI Integration', 'AI model integration for intelligent content generation, code analysis, or workflow automation.', 'fuchsia', ['AI SDK']);
  if (deps['node-pty'])
    add('cpu', 'Process Manager', 'Spawns and manages OS-level terminal processes (PTY). Enables real interactive shell control from the browser.', 'orange', ['node-pty']);
  if (deps['motion'] || deps['framer-motion'])
    add('play-circle', 'Animations', 'Smooth UI micro-animations and page transitions powered by Motion/Framer Motion.', 'sky', ['Motion']);
  if (deps['recharts'] || deps['chart.js'] || deps['d3'])
    add('bar-chart-2', 'Data Visualization', 'Interactive charts and graphs for displaying metrics, analytics, and time-series data.', 'teal', ['Charts']);
  if (deps['react-hook-form'] || deps['formik'])
    add('clipboard-list', 'Form Management', 'Validated, accessible forms with real-time error feedback and controlled submission flows.', 'amber', ['Form Library']);
  if (deps['zustand'] || deps['jotai'] || deps['redux'])
    add('layers', 'State Management', 'Client-side global state with atomic updates and persistence across component trees.', 'indigo', ['State Store']);

  // Scan components folder for names
  const componentsDir = path.join(folderPath, 'src', 'components');
  if (fs.existsSync(componentsDir) && features.length < 6) {
    try {
      const comps = fs.readdirSync(componentsDir)
        .filter(f => (f.endsWith('.tsx') || f.endsWith('.jsx')) && !f.startsWith('index'))
        .slice(0, 4);
      for (const comp of comps) {
        const name = comp.replace(/\.(tsx|jsx|ts|js)$/, '');
        const niceName = name.replace(/([A-Z])/g, ' $1').trim();
        if (!features.find(f => f.title.includes(name))) {
          features.push({ id: String(++id), icon: 'box', title: niceName, description: `Handles the ${niceName} UI concern as a reusable component.`, color: 'zinc' });
        }
      }
    } catch {}
  }

  return features.slice(0, 12);
}

function generateSteps(pages: string[], apiRoutes: string[], pkg: any, project: any): FlowStep[] {
  const steps: FlowStep[] = [];
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };

  const pageLabels = pages
    .filter(p => !p.includes('[') || p.split('/').length <= 3)
    .map(p => {
      if (p === '/') return 'Home / Dashboard';
      return p.split('/').filter(Boolean)
        .map(s => s.replace(/[[\]]/g, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .join(' › ');
    }).slice(0, 5);

  steps.push({
    number: 1,
    title: 'Open the Application',
    description: `Navigate to localhost:${project.port || 3000}. The app initializes, loads initial data, and renders the main interface.`,
  });

  if (pageLabels.length > 1) {
    steps.push({
      number: 2,
      title: 'Navigate the Interface',
      description: `The app has ${pages.length} page${pages.length > 1 ? 's' : ''}: ${pageLabels.join(', ')}.`,
    });
  }

  if (project.backendPath) {
    steps.push({
      number: steps.length + 1,
      title: 'Frontend Talks to Backend',
      description: `The ${pkg?.dependencies?.next ? 'Next.js' : 'frontend'} makes requests to the backend API running on port ${project.backendPort || 'configured port'}. The backend handles business logic, auth, and data access.`,
    });
  } else if (apiRoutes.length > 0) {
    steps.push({
      number: steps.length + 1,
      title: 'API Routes Handle Logic',
      description: `The app has ${apiRoutes.length} API route${apiRoutes.length > 1 ? 's' : ''}: ${apiRoutes.slice(0, 3).join(', ')}${apiRoutes.length > 3 ? '...' : ''}.`,
    });
  }

  if (deps['@prisma/client'] || deps['prisma']) {
    steps.push({
      number: steps.length + 1,
      title: 'Data Saved to Database',
      description: 'Prisma ORM translates operations into SQL queries. Changes are persisted and reflected back to the UI.',
    });
  }

  if (deps['socket.io'] || deps['socket.io-client']) {
    steps.push({
      number: steps.length + 1,
      title: 'Live Updates via WebSocket',
      description: 'Socket.io pushes real-time events to connected clients. State changes appear instantly without page refresh.',
    });
  }

  if (deps['telegraf']) {
    steps.push({
      number: steps.length + 1,
      title: 'Telegram Bot Commands',
      description: 'Send commands from Telegram to trigger backend actions remotely. The bot responds with status updates.',
    });
  }

  if (deps['stripe'] || deps['@stripe/stripe-js']) {
    steps.push({
      number: steps.length + 1,
      title: 'Payment Flow',
      description: 'User selects items and proceeds to checkout. Stripe Elements collects card data securely. Payment Intent is confirmed server-side.',
    });
  }

  return steps;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const folderPath = project.folderPath;
    if (!folderPath || !fs.existsSync(folderPath)) {
      return NextResponse.json({ error: 'Folder path not configured or does not exist on disk.' }, { status: 400 });
    }

    const pkg = readJson(path.join(folderPath, 'package.json'));
    const readme = safeRead(path.join(folderPath, 'README.md'));
    const summary = readme.split('\n').find((l: string) => l.trim() && !l.startsWith('#') && l.length > 20)?.trim()
      || project.description || project.overview || '';

    const appDir = path.join(folderPath, 'src', 'app');
    const pages = fs.existsSync(appDir) ? getPages(appDir) : [];
    const apiRoutes = fs.existsSync(appDir) ? getApiRoutes(appDir) : [];

    // Services
    const services: FlowService[] = [];
    const feTech = pkg?.dependencies?.next ? 'Next.js' : pkg?.dependencies?.vite ? 'Vite' : pkg?.dependencies?.react ? 'React' : 'Web App';
    services.push({ name: 'Frontend', port: project.port, tech: feTech, type: 'frontend', script: project.runScript || undefined });

    if (project.backendPath && fs.existsSync(project.backendPath)) {
      const bePkg = readJson(path.join(project.backendPath, 'package.json'));
      const beTech = bePkg?.dependencies?.['@nestjs/core'] ? 'NestJS'
        : bePkg?.dependencies?.express ? 'Express'
        : bePkg?.dependencies?.fastify ? 'Fastify'
        : 'API Server';
      services.push({ name: 'Backend API', port: project.backendPort, tech: beTech, type: 'backend', script: project.backendScript || undefined });
    }

    let techStack: any = {};
    try { techStack = JSON.parse(project.techStack || '{}'); } catch {}
    const dbs = techStack.database || [];
    if (dbs.length > 0) services.push({ name: dbs[0], port: null, tech: dbs[0], type: 'database' });

    const features = detectFeatures(folderPath, pkg);
    const steps = generateSteps(pages, apiRoutes, pkg, project);

    const flowData: FlowData = { version: 2, summary, steps, features, services, pages, apiRoutes };
    return NextResponse.json(flowData);
  } catch (error: any) {
    console.error('scan-flow error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
