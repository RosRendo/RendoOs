const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding Portfolio project to RendoOs database...');

  const imageRelPath = '/uploads/1790417532998-portfolio-hero.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', '1790417532998-portfolio-hero.png');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'C:/Users/ROS RENDO/.gemini/antigravity-ide/brain/f0cd9199-ad8f-43ae-b409-aae7fefcd336/.user_uploaded/media_1790417532998.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'portfolio' },
        { name: 'Portfolio' },
        { name: 'Ros Rendo Portfolio' },
      ],
    },
  });

  const projectData = {
    name: 'Ros Rendo Portfolio',
    slug: 'portfolio',
    description: 'Flagship personal developer portfolio and interactive showcase featuring Next.js 16, React 19, Three.js WebGL 3D canvas, Lenis inertial smooth scroll, Framer Motion cybernetic aesthetics, and dynamic project showcases.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 90,
    image: imageRelPath,
    currentMilestone: 'Three.js 3D interactive surprise canvas & interactive career journey timeline',
    overview: 'The flagship personal engineering portfolio for Ros Rendo. Engineered with Next.js 16 App Router, React 19, Tailwind CSS 4, Three.js (@react-three/fiber), Lenis smooth scrolling, and Framer Motion micro-interactions. Designed with an evidence-first hiring manager narrative to showcase production software systems, quantitative trading engines, and full-stack architectures.',
    techStack: JSON.stringify({
      frontend: [
        'Next.js 16',
        'React 19',
        'TypeScript',
        'Tailwind CSS 4',
        'Three.js',
        'React Three Fiber',
        'Framer Motion',
        'Lenis Scroll',
        'Embla Carousel',
      ],
      backend: [
        'Next.js Server Actions',
        'Edge Runtime API',
      ],
      database: [
        'Local Content Graph',
      ],
      infrastructure: [
        'Vercel Edge Network',
        'GitHub Actions CI/CD',
      ],
    }),
    architecture: `graph TD
    subgraph Viewport["Client Viewport & Aesthetic Layer"]
        Lenis["Lenis Smooth Inertial Scroll"]
        Particles["Interactive Particle Background"]
        NeonStick["NeonStick Scroll Navigation"]
        Social["Floating Social Dock"]
    end

    subgraph Sections["Evidence-First Sections (React 19)"]
        Hero["Hero Section with TypeAnimation Cycle"]
        About["About & Core Engineering Philosophy"]
        Projects["Projects Showcase with Embla Carousel"]
        Journey["Career & Skill Journey Timeline"]
        TechGrid["Interactive Tech Stack Grid"]
        GH["GitHub Live Activity & Heatmap"]
        Lessons["Engineering Lessons & Failure Post-Mortems"]
        Testimonials["Peer & Client Endorsements"]
        Contact["Contact & Opportunity Form"]
    end

    subgraph Graphics3D["3D Visual WebGL Engine"]
        Canvas3D["React Three Fiber Canvas (@react-three/fiber)"]
        Drei3D["Three.js Helpers (@react-three/drei)"]
        SurpriseMesh["Dynamic Geometric 3D Shader Meshes"]
    end

    subgraph Framework["Next.js 16 App Router Core"]
        AppLayout["Root Layout with Font Optimizations"]
        Tailwind["Tailwind CSS 4 Modern Tokens"]
        Motion["Framer Motion Transition Orchestrator"]
    end

    Viewport --> Framework
    Framework --> Sections
    Projects --> Canvas3D
    Canvas3D --> Drei3D
    Drei3D --> SurpriseMesh`,
    flowExplainer: `# How the Ros Rendo Portfolio Works

### 1. Evidence-First Hiring Manager Architecture
- Crafted to address the specific priorities of tech leads and engineering hiring managers: direct proof of shipped projects, engineering trade-off documentation, and technical depth over generic marketing copy.
- Navigational hierarchy: **Hero** (identity & live status) → **About** → **Projects** (interactive proof) → **Journey** (growth trajectory) → **Engineering Lessons** (intellectual honesty) → **Contact**.

### 2. High-Performance Three.js 3D Visuals
- Integrated with \`@react-three/fiber\` and \`@react-three/drei\` for an interactive 3D WebGL experience without blocking main thread interactions or dropping 60fps frame rates.
- Gracefully degrades on mobile and low-power hardware.

### 3. Inertial Smooth Scrolling with Lenis
- Incorporates \`@studio-freight/react-lenis\` to synchronize physics-based wheel and touch deceleration across high-refresh-rate displays.
- Synchronized with \`NeonStick\` waypoint indicator showing active reading sections in real time.

### 4. Interactive Typist & Status Badges
- Live pill indicators reflecting current availability (\`Available for work\`) and active focus (\`Building ServiceFinder\`).
- Smooth automated typing animations highlighting multi-disciplinary competencies in quantitative trading, full-stack architectures, and autonomous AI tooling.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Portfolio',
    runScript: 'npm run dev -- -p 3002',
    port: 3002,
    isRunning: false,
    backendPath: null,
    backendScript: null,
    backendPort: null,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing Portfolio project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new Portfolio project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Optimize Lenis scroll wheel damping for ultra-smooth trackpad deceleration',
      description: 'Ensure buttery smooth section transitions without breaking native browser anchor links.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Update live featured projects cards with JARVIS and Apex POS links',
      description: 'Sync descriptions, tech badges, and direct links to live repositories and demos.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Fine-tune Three.js canvas particle density and frame rate on mobile viewports',
      description: 'Cap pixel ratio and reduce vertex counts dynamically on low-power devices.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Add dynamic GitHub commit stats and recent activity API fetching',
      description: 'Query GitHub GraphQL API to display authentic contribution heatmaps and commit velocity.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Connect contact form to transactional email endpoint (Resend / SendGrid)',
      description: 'Add server action with rate limiting, turnstile verification, and email dispatch.',
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
      title: 'Local Portfolio Preview (:3002)',
      url: 'http://localhost:3002',
      type: 'PROD',
    },
    {
      title: 'GitHub Profile',
      url: 'https://github.com/rendo',
      type: 'GITHUB',
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

  console.log('Portfolio project successfully added/updated!');
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
