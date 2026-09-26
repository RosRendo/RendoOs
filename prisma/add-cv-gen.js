const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding CareerPrepster (CV-Gen) to RendoOs database...');

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'cv-gen' },
        { slug: 'careerprepster' },
        { name: 'CV-Gen' },
        { name: 'CareerPrepster AI (CV-Gen)' },
      ],
    },
  });

  const projectData = {
    name: 'CV-Gen',
    slug: 'cv-gen',
    description: 'AI-powered resume builder and career studio featuring real-time ATS scoring, Google Gemini bullet-point optimizer, 10+ modern CV template archetypes, job URL scraper, and dynamic interview readiness studio.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 92,
    image: '/uploads/careerprepster.jpg',
    currentMilestone: 'Multi-template PDF compilation & AI reasoning job matching',
    overview: 'CareerPrepster (CV-Gen) is a comprehensive AI career suite that turns raw experience into tailored, high-converting resumes. It computes real-time ATS compliance scores across 4 pillars, optimizes bullet points with Google Gemini AI, scrapes live job URLs to generate compatibility fit scoreboards and obstacle triage queues, and exports crisp PDF documents across 10 distinct template archetypes.',
    techStack: JSON.stringify({
      frontend: [
        'Next.js 14',
        'React 18',
        'Tailwind CSS',
        '@react-pdf/renderer',
        'pdf-parse',
        'mammoth',
        'Lucide React',
        'Zod',
      ],
      backend: [
        'Express',
        'TypeScript',
        'Prisma 5 ORM',
        'Google Gemini AI (@google/generative-ai)',
        'Cheerio Web Scraper',
        'JWT Auth',
        'Multer',
        'Helmet & CORS',
      ],
      database: [
        'MySQL 8.0',
        'Prisma ORM',
      ],
      infrastructure: [
        'Docker',
        'Docker Compose',
        'Postman Collections',
        'Swagger OpenAPIs',
      ],
    }),
    architecture: `graph TD
    subgraph UI["CareerPrepster Web Studio (Next.js 14 :3006)"]
        Landing["Landing Showcase & Template Gallery"]
        CVEditor["Live Interactive CV Editor"]
        ATSGauge["4-Pillar ATS Scoring Engine (94%)"]
        JobMatcher["Job Description Matcher & Scraper Bar"]
        InterviewHub["Interview Prep Studio & Drill Modal"]
        PDFExport["Universal PDF Render Engine (@react-pdf)"]
    end

    subgraph BackendAPI["Express Core Server (:5000)"]
        AuthRoute["JWT & Google OAuth Router"]
        AtsEngine["ATS Keyword & Structure Analyzer"]
        GeminiService["Google Gemini Service (@google/generative-ai)"]
        ScraperService["Cheerio Job Scraper Engine"]
        InterviewService["Interview Question Generator"]
        PrismaORM["Prisma 5 ORM Client"]
    end

    subgraph DataStore["Persistence & External AI"]
        MySQLDB[("MySQL Database :3307")]
        GeminiAPI["Google Gemini LLM Cloud"]
    end

    Landing --> CVEditor
    CVEditor --> ATSGauge
    ATSGauge --> AtsEngine
    CVEditor --> GeminiService
    JobMatcher --> ScraperService
    InterviewHub --> InterviewService
    AtsEngine --> PrismaORM
    GeminiService <--> GeminiAPI
    ScraperService --> GeminiService
    PrismaORM <--> MySQLDB
    CVEditor --> PDFExport`,
    flowExplainer: `# How CareerPrepster (CV-Gen) Works

### 1. Interactive Resume Builder & Live Real-Time Preview
- Multi-section resume builder covering Contact, Experience, Education, Skills, and Custom dynamic sections.
- Real-time side-by-side preview with drag-and-drop section ordering and font/palette styling controls.

### 2. 10+ Modern Template Archetypes
- Supports diverse industry templates: Bento Grid, Swiss Grid, TechLead Columnar, Executive Banner, Contemporary Accent, DevPulse Timeline, and Classic ATS.
- Native, pixel-perfect PDF export powered by \`@react-pdf/renderer\` with exact page split calculations.

### 3. 4-Pillar ATS Scoring & Actionable Suggestions
- Automatically evaluates resumes across Content Completeness, Action Verbs, Measurable Impact, and Keyword Alignment.
- Google Gemini AI suggests high-impact bullet point rewrites in one click.

### 4. Job Matching Scraper & Evidence Matrix
- Ingests job posting URLs via Cheerio scraper.
- Compares requirements against candidate CV, displaying a match percentage scoreboard, skill gap matrix, and customized interview preparation drills.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\CV-Gen\\frontend',
    repoUrl: 'https://github.com/ROS-RENDO/CV-Gen',
    runScript: 'npm run dev -- -p 3006',
    port: 3006,
    isRunning: false,
    backendPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\CV-Gen\\backend',
    backendScript: 'npm run dev',
    backendPort: 5000,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing CV-Gen project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new CV-Gen project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Design 10+ distinct clean CV template archetypes (Bento, Swiss, TechLead, Executive)',
      description: 'Built distinct visual templates with customizable typography, colors, and layout structure.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
    },
    {
      title: 'Implement 4-pillar ATS scoring gauge and actionable feedback generator',
      description: 'Scores resumes across content, action verbs, metrics, and industry keywords.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
    },
    {
      title: 'Integrate Google Gemini AI for contextual bullet point rewriting',
      description: 'Provides instant high-impact suggestions with active verbs and quantifiable metrics.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
    },
    {
      title: 'Calibrate job description URL scraper and evidence matrix table',
      description: 'Scrapes live job postings via Cheerio and builds role alignment compatibility matrix.',
      status: 'IN_PROGRESS',
      bucket: 'NEXT',
      priority: 'MEDIUM',
    },
    {
      title: 'Automated mock interview question generator based on detected skill gaps',
      description: 'Synthesizes targeted behavioral and technical interview questions based on candidate resume.',
      status: 'TODO',
      bucket: 'LATER',
      priority: 'MEDIUM',
    },
  ];

  for (let i = 0; i < tasks.length; i++) {
    await prisma.task.create({
      data: {
        projectId: project.id,
        title: tasks[i].title,
        description: tasks[i].description,
        status: tasks[i].status,
        bucket: tasks[i].bucket,
        priority: tasks[i].priority,
        order: i,
      },
    });
  }

  console.log('Successfully configured CareerPrepster (CV-Gen) in RendoOs!');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
