const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding EstateX Real Estate project to RendoOs database...');

  const imageRelPath = '/uploads/1790419003000-estatex.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', '1790419003000-estatex.png');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'C:/Users/ROS RENDO/.gemini/antigravity-ide/brain/f0cd9199-ad8f-43ae-b409-aae7fefcd336/.user_uploaded/media_1790418996213.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'estatex' },
        { slug: 'real-estate' },
        { name: 'EstateX' },
        { name: 'EstateX Real Estate Portal' },
      ],
    },
  });

  const projectData = {
    name: 'EstateX Real Estate Portal',
    slug: 'estatex',
    description: 'Full-stack luxury real estate portal featuring Zillow-like geospatial property search, interactive Three.js 3D walkthroughs, Leaflet map engine, AI property assistant, and unified Express + Vite middleware backend with Prisma ORM.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 90,
    image: imageRelPath,
    currentMilestone: 'Interactive Three.js 3D walkthrough tours & Leaflet geospatial neighborhood search',
    overview: 'EstateX is an end-to-end modern real estate portal built for Phnom Penh and international luxury properties. It features Zillow-like geospatial filtering, interactive 3D virtual home walkthroughs powered by Three.js, a Leaflet-driven map search, multi-tier listing management (Basic, Advanced, Premium), property valuation calculators, and an AI real estate assistant. Architected with an Express 5 + Vite SSR middleware server, Prisma ORM, and Sharp image optimization pipeline.',
    techStack: JSON.stringify({
      frontend: [
        'React 19',
        'Vite',
        'Three.js (3D Walkthrough)',
        'Leaflet (Map Engine)',
        'Lucide React',
        'Canvas Confetti',
      ],
      backend: [
        'Node.js',
        'Express.js 5',
        'Vite Middleware Server',
        'Prisma ORM',
        'Sharp Image Optimizer',
        'Zod Validation',
        'JWT & Bcrypt',
      ],
      database: [
        'PostgreSQL',
        'Prisma ORM',
      ],
      infrastructure: [
        'Docker Compose',
        'Multer Upload Pipeline',
        'Helmet Security',
        'Express Rate Limit',
      ],
    }),
    architecture: `graph TD
    subgraph UI["EstateX Client (React 19 + Vite)"]
        HeroSearch["Zillow-Style Hero & Filter Bar"]
        ListingCards["Tiered Property Cards (Basic / Advanced / Premium)"]
        ThreeWalkthrough["Three.js Interactive 3D Walkthrough"]
        LeafletMap["Leaflet Geospatial Map Explorer"]
        AiAgent["AI Real Estate Property Assistant"]
        SellerDash["Seller Wizard & Valuation Calculator"]
    end

    subgraph Server["Unified Express + Vite Backend Server (:5175)"]
        ExpressRouter["Express.js 5 API Router"]
        ViteMiddleware["Vite Dev Server Middleware"]
        AuthGuard["JWT / Bcrypt Security Middleware"]
        UploadSharp["Multer Uploads & Sharp Image Optimizer"]
        ZodValidator["Zod Request Schema Validation"]
    end

    subgraph Data["Persistence & Storage"]
        PrismaClient["Prisma ORM Client"]
        PostgresDB[("PostgreSQL Database (Docker / Remote)")]
        MediaStorage["Optimized Photos, 3D Models & Panorama 360"]
    end

    HeroSearch --> ExpressRouter
    ListingCards --> ExpressRouter
    ThreeWalkthrough --> MediaStorage
    LeafletMap --> ExpressRouter
    ExpressRouter --> AuthGuard
    ExpressRouter --> UploadSharp
    UploadSharp --> MediaStorage
    ExpressRouter --> ZodValidator
    ZodValidator --> PrismaClient
    PrismaClient --> PostgresDB`,
    flowExplainer: `# How EstateX Real Estate Portal Works

### 1. Zillow-Style Geospatial Discovery
- Traders and homebuyers search across target districts (*Phnom Penh, Sen Sok, Koh Pich, Chroy Changvar, BKK1*).
- Interactive Leaflet map renders dynamically clustered property pins with pricing tags, photos, and direct link modals.

### 2. Immersive Three.js 3D Virtual Walkthroughs
- Built with Three.js rendering interactive 3D floor plans and room walkthroughs directly in the browser.
- Buyers can explore spaces, inspect layout proportions, and switch between floor levels before booking physical viewing appointments.

### 3. Unified Express + Vite Middleware Architecture
- Eliminates separate frontend and backend dev server steps by hosting Vite inside an Express 5 middleware pipeline.
- Production-ready with Helmet headers, rate limiting, and Zod input validation on all lead forms and property inquiries.

### 4. Automated Image Optimization with Sharp
- Uploaded high-resolution photos and architectural renderings are automatically resized, compressed, and converted to modern WebP formats on ingestion to maintain sub-second page loads.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Real-Estate',
    runScript: 'cross-env PORT=5175 npm run dev',
    port: 5175,
    isRunning: false,
    backendPath: null,
    backendScript: null,
    backendPort: null,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing EstateX project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new EstateX project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Calibrate Three.js camera collision bounds for interior 3D room navigation',
      description: 'Ensure smooth orbit and first-person walkthrough without clipping through virtual walls.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Implement Leaflet dynamic polygon bounds query for Phnom Penh districts',
      description: 'Filter property listings by geospatial coordinates bounding box on map pan and zoom.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Optimize Sharp image thumbnail generation queue with WebP presets',
      description: 'Produce instant responsive thumbnails for high-resolution property photo galleries.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Integrate AI real estate assistant mortgage & repayment calculator',
      description: 'Provide contextual loan amortizations and interest estimates on property detail sheets.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Add automated buyer lead dispatch notifications via SMS / Telegram',
      description: 'Instantly notify verified listing agents when buyers schedule property viewings.',
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
      title: 'EstateX Web Portal (:5175)',
      url: 'http://localhost:5175',
      type: 'PROD',
    },
    {
      title: 'Properties REST API Endpoint',
      url: 'http://localhost:5175/api/properties',
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

  console.log('EstateX project successfully added/updated!');
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
