const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding StackGen AI to RendoOs database...');

  const imageRelPath = '/uploads/stackgen-logo.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', 'stackgen-logo.png');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'D:/FOR RENDO (ONLY )/Personal Project/Stackgen/frontend/public/logo.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied logo to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'stackgen' },
        { name: 'Stackgen' },
        { name: 'StackGen' },
        { name: 'StackGen AI' },
      ],
    },
  });

  const projectData = {
    name: 'StackGen AI',
    slug: 'stackgen',
    description: 'AI-powered SaaS CTO and full-stack architecture generator. Features visual node-based stack designer with @xyflow/react, Google Gemini code generation (@google/genai), production architecture checklists, GitHub repo scanner, Better-Auth security, and Paddle subscription billing.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 90,
    image: imageRelPath,
    currentMilestone: 'Gemini AI code generation & visual node architecture builder',
    overview: 'StackGen is a modern developer tool acting as an AI CTO for indie hackers and software engineering teams. It analyzes project requirements, recommends optimal tech stacks, renders visual node-based system topologies via @xyflow/react, performs repository readiness scans, and generates complete, downloadable production boilerplates (.zip) using Google Gemini AI, Better-Auth, and Paddle billing.',
    techStack: JSON.stringify({
      frontend: [
        'Next.js 16',
        'React 19',
        'Tailwind CSS 4',
        '@xyflow/react (React Flow)',
        '@hello-pangea/dnd',
        'Better-Auth',
        'Paddle.js',
        'Framer Motion',
        'Zustand',
        'JSZip / FileSaver',
      ],
      backend: [
        'NestJS 11',
        'TypeScript',
        '@google/genai (Gemini AI)',
        'Prisma 6 ORM',
        'Paddle Node SDK',
        'Better-Auth',
        'Resend',
        'Helmet & Throttler',
      ],
      database: [
        'PostgreSQL',
        'Prisma ORM',
      ],
      infrastructure: [
        'Docker',
        'GitHub Scanner Engine',
        'Paddle Billing Subscriptions',
      ],
    }),
    architecture: `graph TD
    subgraph Client["StackGen Frontend (Next.js 16 :3005)"]
        Hero["Marketing Hero & Project Wizard"]
        CanvasFlow["Visual Node Topology (@xyflow/react)"]
        DnD["Stack Configurator (@hello-pangea/dnd)"]
        Scanner["GitHub Repo Health & Security Scanner"]
        Checklist["Production Readiness Master Checklist"]
        ClientAuth["Better-Auth Client Session"]
    end

    subgraph BackendAPI["NestJS 11 Core Server (:3001)"]
        Throttler["Nest Throttler Rate Limiter (100 req/min)"]
        AuthModule["Better-Auth Gateway"]
        ProjectEngine["Project State & Architecture Orchestrator"]
        AiService["Google Gemini Service (@google/genai)"]
        ZipGenerator["JSZip / FileSaver Code Bundle Compiler"]
        PaddleService["Paddle Webhook & Subscription Checkout"]
    end

    subgraph External["External Cloud & Integrations"]
        GeminiAPI["Google Gemini LLM Cloud"]
        PaddleAPI["Paddle Payments Gateway"]
        ResendAPI["Resend Transactional Email Engine"]
        PostgresDB[("PostgreSQL Database (Prisma 6)")]
    end

    Hero --> CanvasFlow
    CanvasFlow --> ProjectEngine
    ClientAuth <--> AuthModule
    ProjectEngine --> AiService
    AiService <--> GeminiAPI
    ProjectEngine --> ZipGenerator
    CanvasFlow --> PaddleService
    PaddleService <--> PaddleAPI
    AuthModule --> ResendAPI
    ProjectEngine --> PostgresDB`,
    flowExplainer: `# How StackGen AI Works

### 1. Natural Language Idea to Architecture Topology
- Founders describe their application concept (*e.g., "Multi-tenant real estate CRM with WhatsApp notifications"*).
- Google Gemini AI parses functional and non-functional requirements to recommend the optimal language, framework, database, and auth patterns.

### 2. Visual Drag-and-Drop Node Canvas (\`@xyflow/react\`)
- Users visually connect services (Next.js frontend → NestJS backend → PostgreSQL → Redis → Paddle).
- Built with \`@xyflow/react\` and \`@hello-pangea/dnd\` with real-time validation ensuring compatible dependencies and port configurations.

### 3. Automated Code Generation & Instant ZIP Export
- Synthesizes fully typed boilerplate structures, Prisma schemas, Docker Compose setups, and authentication scaffolding.
- Bundled into a clean \`.zip\` download via \`jszip\` and \`file-saver\`.

### 4. Production Readiness Scanner & Master Checklist
- Inspects GitHub repositories or proposed architecture against 50+ enterprise production standards (rate limiting, security headers, database migrations, CI/CD).`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Stackgen\\frontend',
    repoUrl: 'https://github.com/ROS-RENDO/Stackgen',
    runScript: 'npm run dev -- -p 3005',
    port: 3005,
    isRunning: false,
    backendPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Stackgen\\backend',
    backendScript: 'npm run start:dev',
    backendPort: 3001,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing StackGen project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new StackGen project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Calibrate Gemini AI system prompt for multi-framework boilerplate generation',
      description: 'Optimize prompt scaffolding to output clean TypeScript, Prisma schema, and Docker config.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Implement interactive node connection validation in @xyflow/react canvas',
      description: 'Enforce connection compatibility rules between databases, backends, and frontend nodes.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Fine-tune GitHub repo scanner AST parser for dependency vulnerability detection',
      description: 'Inspect package.json and framework configurations for missing security headers or unpatched CVEs.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Complete Paddle webhook idempotency verification for subscription upgrades',
      description: 'Process subscription_created and transaction_completed events reliably with raw-body signatures.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Add Docker Compose and Kubernetes manifest auto-generation to ZIP bundle',
      description: 'Provide production deployment descriptors along with raw application source files.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 5,
    },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        ...t,
        projectId: project.id,
      },
    });
  }

  // Ensure links
  await prisma.link.deleteMany({ where: { projectId: project.id } });
  const links = [
    {
      title: 'StackGen Web App (:3005)',
      url: 'http://localhost:3005',
      type: 'PROD',
    },
    {
      title: 'NestJS Backend API (:3001)',
      url: 'http://localhost:3001',
      type: 'DOCS',
    },
  ];

  for (const l of links) {
    await prisma.link.create({
      data: {
        ...l,
        projectId: project.id,
      },
    });
  }

  console.log('StackGen AI project successfully added/updated!');
  console.log('Project ID:', project.id);
  console.log('Slug:', project.slug);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
