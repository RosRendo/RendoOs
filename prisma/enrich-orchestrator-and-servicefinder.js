const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Enriching Orchestrator and Service Finder in Prisma database...');

  // 1. Enrich Service Finder
  const sf = await prisma.project.findFirst({
    where: { slug: 'service-finder' },
  });

  if (sf) {
    console.log('Updating Service Finder...');
    await prisma.project.update({
      where: { id: sf.id },
      data: {
        progress: 75,
        currentMilestone: 'Live contractor GPS tracking & dispatch settlement engine',
        flowExplainer: `# How Service Finder Works

### 1. Consumer Service Discovery & Booking Flow
- Customers browse vetted service categories (*AC repair, deep cleaning, electrical, plumbing, handyman*).
- Dynamic pricing calculation based on service tiers, square footage, and urgent dispatch surcharges.
- Time-slot reservation and instant mobile OTP verification.

### 2. Intelligent Geo-Dispatch Engine
- When an urgent repair order is created, the NestJS dispatch engine calculates geo-proximity to active contractor coordinates.
- Pushes real-time alerts to the contractor mobile app via Socket.IO and Firebase Cloud Messaging.
- Once accepted, customer map tracks the approaching technician live using Mapbox / Leaflet.

### 3. Enterprise Backend & Security Architecture
- Built with NestJS, strictly typed TypeScript, and Prisma ORM backed by PostgreSQL.
- Fast session and real-time state caching using Redis (\`ioredis\`, \`socket.io-redis-adapter\`).
- Cloudinary integration for KYC contractor documents and service completion proof photos.
- Secured with Helmet, bcrypt password hashing, JWT guards, and aggressive rate limiting.`,
        health: 'HEALTHY',
      },
    });

    // Populate Tasks if none
    const sfTasksCount = await prisma.task.count({ where: { projectId: sf.id } });
    if (sfTasksCount === 0) {
      console.log('Adding tasks for Service Finder...');
      const sfTasks = [
        {
          title: 'Implement customer booking creation & address validation',
          description: 'Validate customer location, booking slot availability, and tier pricing table.',
          status: 'DONE',
          bucket: 'NOW',
          priority: 'HIGH',
          order: 1,
        },
        {
          title: 'Connect contractor auto-dispatch algorithm over Socket.IO',
          description: 'Ping closest verified active contractors within 5km radius upon booking submission.',
          status: 'TODO',
          bucket: 'NOW',
          priority: 'HIGH',
          order: 2,
        },
        {
          title: 'Live technician GPS broadcast and customer map tracking',
          description: 'Stream live location coordinates from React Native Expo driver app to Next.js portal.',
          status: 'TODO',
          bucket: 'NOW',
          priority: 'HIGH',
          order: 3,
        },
        {
          title: 'Integrate ABA PayWay sandbox payment gateway & webhook verifier',
          description: 'Process credit card and KHQR transactions with idempotent webhook handling.',
          status: 'TODO',
          bucket: 'NEXT',
          priority: 'MEDIUM',
          order: 4,
        },
        {
          title: 'Deploy Redis pub/sub queue for background push notification dispatch',
          description: 'Offload booking state transitions from main thread to Redis job workers.',
          status: 'TODO',
          bucket: 'NEXT',
          priority: 'MEDIUM',
          order: 5,
        },
      ];

      for (const t of sfTasks) {
        await prisma.task.create({
          data: { ...t, projectId: sf.id },
        });
      }
    }

    // Populate Links if none
    const sfLinksCount = await prisma.link.count({ where: { projectId: sf.id } });
    if (sfLinksCount === 0) {
      console.log('Adding links for Service Finder...');
      const sfLinks = [
        {
          title: 'Customer Web Portal (:3001)',
          url: 'http://localhost:3001',
          type: 'PROD',
        },
        {
          title: 'NestJS Backend API & Swagger (:5000)',
          url: 'http://localhost:5000/api',
          type: 'DOCS',
        },
        {
          title: 'Contractor Expo Mobile App (:8081)',
          url: 'http://localhost:8081',
          type: 'OTHER',
        },
      ];

      for (const l of sfLinks) {
        await prisma.link.create({
          data: { ...l, projectId: sf.id },
        });
      }
    }
  }

  // 2. Enrich Orchestrator
  const orch = await prisma.project.findFirst({
    where: { slug: 'orchestrator' },
  });

  if (orch) {
    console.log('Updating Orchestrator...');
    await prisma.project.update({
      where: { id: orch.id },
      data: {
        progress: 65,
        currentMilestone: 'Terminal socket streaming & session persistence',
        flowExplainer: `# How Orchestrator Works

### 1. Unified Developer Cockpit
- Next.js 16 web dashboard featuring embedded \`xterm.js\` terminal emulators and Monaco Code Editor.
- Single interface to monitor multiple long-running terminal runners, subagents, and development servers.

### 2. NestJS PTY Daemon & WebSocket Gateway
- Local NestJS backend listening on port \`3005\` managing pseudo-terminal (\`node-pty\`) instances across PowerShell and Bash.
- Low-latency socket streaming allows interactive keyboard inputs, resizing events, and ANSI color escape rendering in the browser.

### 3. Agent Coordination & Task Queue
- Direct integration with local AI subagents, Telegram bot notifications via Telegraf, and automated n8n workflow triggers.
- Session persistence allows terminal outputs to resume smoothly across browser refreshes.`,
        health: 'HEALTHY',
      },
    });

    const orchLinksCount = await prisma.link.count({ where: { projectId: orch.id } });
    if (orchLinksCount === 0) {
      console.log('Adding links for Orchestrator...');
      const orchLinks = [
        {
          title: 'Developer Cockpit (:3010)',
          url: 'http://localhost:3010',
          type: 'PROD',
        },
        {
          title: 'NestJS PTY Daemon & WebSockets (:3005)',
          url: 'http://localhost:3005',
          type: 'OTHER',
        },
      ];

      for (const l of orchLinks) {
        await prisma.link.create({
          data: { ...l, projectId: orch.id },
        });
      }
    }
  }

  console.log('Enrichment complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
