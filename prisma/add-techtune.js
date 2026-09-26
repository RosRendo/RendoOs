const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding TechTune Healer to RendoOs database...');

  const imageRelPath = '/uploads/techtune-mockups.jpg';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', 'techtune-mockups.jpg');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'D:/CamtechUniversity/ProgrammingYearIII/techtune-healer/images/figma_ui_mockups_1787556773988.jpg';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied mockups screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'techtune-healer' },
        { slug: 'techtune' },
        { name: 'TechTune Healer' },
      ],
    },
  });

  const projectData = {
    name: 'TechTune Healer',
    slug: 'techtune-healer',
    description: 'Full-stack automotive service platform for Cambodia connecting car owners with mechanics. Features Expo React Native mobile app with AI visual damage diagnostics, real-time GPS mechanic tracking via Socket.IO, Next.js 16 admin dashboard, and Express 5 + Prisma 7 backend.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 95,
    image: imageRelPath,
    mobileImage: imageRelPath,
    currentMilestone: 'Live mechanic GPS tracking with Socket.IO & AI damage diagnostic estimation',
    overview: 'TechTune Healer is an end-to-end automotive service ecosystem engineered for Cambodia. Car owners can diagnose vehicle damage using computer vision AI, book roadside emergency towing, schedule certified garage maintenance, and track dispatched mechanics live on a map. Features a cross-platform React Native / Expo mobile client, a Next.js 16 administrative web portal, and an Express 5 + Prisma 7 backend with MariaDB persistence.',
    techStack: JSON.stringify({
      frontend: [
        'Expo 57',
        'React Native 0.86',
        'Expo Router',
        'Next.js 16 (Admin Web)',
        'React 19',
        'Tailwind CSS 4',
        'react-native-maps',
        'Socket.io-client',
        'Zustand',
        'Reanimated',
      ],
      backend: [
        'Node.js',
        'Express.js 5',
        'TypeScript',
        'Prisma 7 ORM',
        'Socket.io Gateway',
        'JWT Authentication',
        'Multer Uploads',
      ],
      database: [
        'MariaDB / MySQL',
        'Prisma Client 7',
      ],
      infrastructure: [
        'Metro Bundler',
        'OSRM Route Engine',
        'Railway',
        'SonarQube Quality Gate',
      ],
    }),
    architecture: `graph TD
    subgraph Mobile["TechTune Mobile App (Expo ~57 / React Native 0.86)"]
        CustomerFlow["Customer Flow (Home, Vehicles, Appointments)"]
        ProviderFlow["Provider Flow (Bookings, Earnings, Shop)"]
        AiDiag["AI Visual Damage Diagnostics & Cost Estimator"]
        LiveMap["Live Mechanic Map & OSRM Route Navigation"]
        MobState["Zustand Store & AsyncStorage JWT"]
    end

    subgraph AdminPortal["Admin Operations Web (Next.js 16 :3004)"]
        AdminDashboard["Operations Cockpit & Metrics"]
        ProviderVerification["Provider KYC & Shop Verification"]
        DispatchMonitor["Active Roadside Emergency Dispatch Radar"]
    end

    subgraph BackendAPI["Backend Core (Express.js 5 :4000)"]
        ExpressRouter["Express 5 REST API Router"]
        SocketGateway["Socket.IO Live Location Gateway"]
        AuthService["JWT Auth & Bcrypt Hash (30-day tokens)"]
        UploadPipeline["Multer Media Pipeline (10MB Whitelist)"]
        PrismaClient["Prisma 7 ORM Client"]
    end

    subgraph StorageEngine["Persistence & External Services"]
        MariaDB[("MariaDB / MySQL Database (:3306)")]
        OSRM["OSRM Open Source Routing Machine"]
        StaticCDN["Static Image / Diagnostics Storage"]
    end

    CustomerFlow <-->|REST API| ExpressRouter
    ProviderFlow <-->|REST API| ExpressRouter
    LiveMap <-->|WebSocket Real-Time GPS| SocketGateway
    AdminPortal <-->|REST API| ExpressRouter
    ExpressRouter --> AuthService
    ExpressRouter --> UploadPipeline
    UploadPipeline --> StaticCDN
    LiveMap --> OSRM
    ExpressRouter --> PrismaClient
    SocketGateway --> PrismaClient
    PrismaClient --> MariaDB`,
    flowExplainer: `# How TechTune Healer Works

### 1. AI-Assisted Damage Diagnostics
- Customers snap a photo of bumper dents, scratches, or fluid leaks directly from their mobile camera.
- The computer vision engine highlights the detected damage bounding box and generates an instant repair estimate ($150 - $250) with severity ratings (*Minor, Moderate, Severe*).
- One-tap conversion from diagnostic scan directly to scheduled garage appointments.

### 2. Live Roadside Assistance & GPS Mechanic Tracking
- When a driver is stranded, the app broadcasts an emergency assistance alert with live GPS coordinates.
- Nearby registered mechanics receive push notifications and accept dispatch calls.
- Both parties monitor the approaching tow truck or mobile mechanic in real-time over Socket.IO with OSRM turn-by-turn route polylines.

### 3. Multi-Vehicle Garage & Maintenance History
- Users store multiple family vehicles (*e.g., 2020 Toyota RAV4, 2018 Honda Civic*).
- Service history, engine warning logs, oil changes, and parts receipts remain centralized for seamless ownership transfer.

### 4. Triple-Service Architecture in RendoOs
- **Admin Web (\`:3004\`)**: Next.js 16 operations dashboard for platform analytics and provider verification.
- **Backend API (\`:4000\`)**: Express.js 5 + Prisma 7 + Socket.IO handling transactions and real-time coordination.
- **Expo Mobile (\`:8081\`)**: React Native client powering both customer and mechanic mobile experiences.`,
    folderPath: 'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer\\admin-web',
    runScript: 'npm run dev -- -p 3004',
    port: 3004,
    isRunning: false,
    backendPath: 'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer\\backend',
    backendScript: 'npm run dev',
    backendPort: 4000,
    isBackendRunning: false,
    extraPath: 'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer',
    extraScript: 'npx expo start',
    extraPort: 8081,
    extraName: 'Expo Mobile',
    isExtraRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing TechTune Healer project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new TechTune Healer project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Test Socket.IO location gateway handshake with mechanic GPS simulation',
      description: 'Ensure stable live coordinate streaming between mobile driver and dispatch gateway.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Verify AI damage diagnostic prompt accuracy and bounding box rendering',
      description: 'Validate repair cost estimation bands across varied vehicle makes and paint colors.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Calibrate OSRM polyline route drawing on low-bandwidth mobile connections',
      description: 'Cache turn-by-turn waypoints locally to prevent visual map jitter.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Finalize Admin Web shop inventory management and provider payout ledger',
      description: 'Enable admin approval workflows for automotive parts listings and withdrawal requests.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Prepare final year internship report and demonstration presentation kit',
      description: 'Export system architecture diagrams, user journey walk-throughs, and code metrics.',
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
      title: 'Admin Web Dashboard (:3004)',
      url: 'http://localhost:3004',
      type: 'PROD',
    },
    {
      title: 'Express Backend API & Socket (:4000)',
      url: 'http://localhost:4000',
      type: 'OTHER',
    },
    {
      title: 'Expo Metro Bundler (:8081)',
      url: 'http://localhost:8081',
      type: 'OTHER',
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

  console.log('TechTune Healer project successfully added/updated!');
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
