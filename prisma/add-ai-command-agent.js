const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding AI-Command-Agent project to RendoOs database...');

  const imageRelPath = '/uploads/1790418680000-ai-command-agent.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', '1790418680000-ai-command-agent.png');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'C:/Users/ROS RENDO/.gemini/antigravity-ide/brain/f0cd9199-ad8f-43ae-b409-aae7fefcd336/.user_uploaded/media_1790418675432.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'ai-command-agent' },
        { slug: 'ai-os' },
        { name: 'AI Command Agent' },
        { name: 'Personal AI Operating System' },
      ],
    },
  });

  const projectData = {
    name: 'AI Command Agent',
    slug: 'ai-command-agent',
    description: 'Production desktop-first AI Command Center and engineering orchestration platform. Features a unified command cockpit (Ctrl+K), multi-agent handoff fleet (Codex, Hermes, QA workers), cross-project engineering playbook, gap analysis engine, and local Express bridge for terminal, Docker, and Obsidian vault orchestration.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 92,
    image: imageRelPath,
    currentMilestone: 'Cross-project Engineering Playbook extraction & automated multi-agent handoff chains',
    overview: 'Personal AI Operating System (AI OS) is an executive engineering command station and developer cockpit. It connects AI agent fleets, local terminal execution, Docker container monitoring, n8n workflow automations, and Obsidian markdown knowledge into a single unified workspace. Its signature differentiator is the Cross-Project Engineering Playbook, which captures validated architectural decisions (ADRs), security mitigations, and lessons learned across projects to accelerate new builds.',
    techStack: JSON.stringify({
      frontend: [
        'React 19',
        'Vite',
        'Lucide React',
        'Tailwind CSS',
        'Framer Motion',
        'Command Palette (Ctrl+K)',
        'Custom Multi-Pane Workspace',
      ],
      backend: [
        'Node.js',
        'Express.js 5',
        'Child Process Runner',
        'Local Bridge API',
        'File System Walker',
      ],
      database: [
        'Obsidian Vault (D:\\AI\\Obsidian)',
        'Local JSON Store',
        'System Audit Log',
      ],
      infrastructure: [
        'Docker Engine (8 Containers)',
        'n8n Workflow Hub',
        'Ollama / Local LLM',
        'Concurrently',
        'PowerShell Bridge',
      ],
    }),
    architecture: `graph TD
    subgraph Cockpit["AI OS Central Control Center (React 19 + Vite)"]
        TopBar["Top Navigation & Command Palette (Ctrl+K)"]
        HeroHUD["Central Control Center HUD & Active Focus"]
        ActionPrompt["What Do You Want To Do? Natural Prompt Box"]
        AttentionGrid["Attention & Gap Alerts (Rate Limiting, Backups, E2E)"]
        ActiveRunning["Active Running Daemons (Codex, Docker, n8n)"]
        RecentAchieve["Recent Achievements & Audit Stream"]
        PaneWorkspace["Multi-Pane Split Workspace (Terminal / Git / Code)"]
    end

    subgraph Intelligence["Cross-Project Engineering Core"]
        Playbook["Engineering Playbook & ADR Extractor"]
        GapEngine["'What Did I Forget?' Verification Engine"]
        AgentFleet["Agent Fleet Orchestrator (Codex, Hermes, QA)"]
        SkillsLib["Versioned Skills Library (18+ Tools)"]
    end

    subgraph LocalDaemon["Local Express Bridge Backend (:3001)"]
        ExpressCore["Express.js 5 Local Bridge Server"]
        TermRunner["Safe Terminal Process Execution"]
        FSTree["Workspace Directory Tree Walker"]
        ObsidianBridge["Obsidian Vault Sync Bridge"]
    end

    subgraph ExternalEcosystem["Connected Infrastructure"]
        Docker["Docker Engine (Container Stacks)"]
        N8N["n8n Workflow Engine"]
        Vault[("Obsidian Knowledge Vault D:\\AI\\Obsidian")]
        GitCLI["Local Git & PowerShell"]
    end

    Cockpit <-->|REST & Event Stream| LocalDaemon
    Cockpit --> Intelligence
    Intelligence --> Playbook
    Playbook <--> ObsidianBridge
    ObsidianBridge <--> Vault
    LocalDaemon --> TermRunner
    TermRunner --> GitCLI
    LocalDaemon --> Docker
    LocalDaemon --> N8N`,
    flowExplainer: `# How AI Command Agent (AI OS) Works

### 1. Executive Control Center & Cognitive Story Flow
- **Central Control Center HUD**: Live status readout displaying current project focus (*e.g., ServiceFinder*), system latency, and connectivity to external engines (Docker, n8n, Obsidian, OpenCode).
- **Natural Action Prompt**: Instant text execution interface (*"Deploy ServiceFinder to staging, run vitest specs, or ask Hermes to fix error..."*).
- **Quad Matrix Layout**:
  - **Attention (Gaps)**: High-priority architectural vulnerabilities (API rate limiting, automated DB backups, rollback procedures).
  - **Active Running**: Live monitor for background daemons (Codex Dev AI, Docker 8 containers, n8n workflow hub).
  - **Recent Achievements**: Real-time event log of PRD generation, branding generation, and webhook triggers.
  - **Quick Launch Docks**: Direct shortcuts to Desktop Workspace, Projects & Blueprints, Agent Fleet, and Obsidian Knowledge.

### 2. Signature Cross-Project Engineering Playbook
- Whenever an architectural decision (ADR) or bug fix is validated in one project (such as Stripe webhook idempotency or Next.js 16 caching caveats), the **Playbook Extraction Engine** catalogs the pattern.
- When spinning up or switching to a new project, AI OS automatically pre-loads validated configurations, anti-patterns, and prompt scaffolds.

### 3. Local Bridge Architecture (\`server.js\` on \`:3001\`)
- Runs a lightweight, zero-latency local Express API daemon.
- Provides secure endpoints for executing timed PowerShell commands, inspecting local workspace directory trees, monitoring Docker containers, and syncing Markdown notes directly into \`D:\\AI\\Obsidian\`.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\AI-Command-Agent',
    runScript: 'npm run dev',
    port: 3000,
    isRunning: false,
    backendPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\AI-Command-Agent',
    backendScript: 'node server.js',
    backendPort: 3001,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing AI Command Agent project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new AI Command Agent project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Build automated ADR extraction parser for Obsidian vault sync',
      description: 'Automatically parse decision logs into D:\\AI\\Obsidian\\AI_Brain_Sync.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Configure multi-agent handoff chains between Codex Dev AI and Hermes',
      description: 'Streamline code generation and AST verification across local agent workers.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Implement interactive architecture canvas with live service health indicators',
      description: 'Visual drag-and-drop node graph representing active Docker containers and API routes.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Add Sentry error intelligence feed and automated bug remediation trigger',
      description: 'Catch production stack traces and spawn background fix subagents immediately.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Deploy tamper-evident audit trail logger with cryptographic event hashes',
      description: 'Ensure immutable records of all automated agent terminal executions.',
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
      title: 'AI OS Command Center UI',
      url: 'http://localhost:3000',
      type: 'PROD',
    },
    {
      title: 'Local Express Bridge API (:3001)',
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

  console.log('AI Command Agent project successfully added/updated!');
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
