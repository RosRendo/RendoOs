const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding JARVIS project to RendoOs database...');

  const imageRelPath = '/uploads/1790416922672-jarvis-dashboard.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', '1790416922672-jarvis-dashboard.png');
  
  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'C:/Users/ROS RENDO/.gemini/antigravity-ide/brain/f0cd9199-ad8f-43ae-b409-aae7fefcd336/.user_uploaded/media_1790416922672.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'jarvis' },
        { name: 'JARVIS' },
      ],
    },
  });

  const projectData = {
    name: 'JARVIS',
    slug: 'jarvis',
    description: 'Cybernetic AI desktop assistant for Windows featuring an animated futuristic orb UI, multi-provider LLM gateway (Ollama, Gemini, OpenAI, Claude), real-time STT/TTS voice pipeline, controlled system automation tools, and bi-directional Obsidian vault knowledge integration.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 85,
    image: imageRelPath,
    currentMilestone: 'Voice pipeline calibration & multi-provider fallback orchestration',
    overview: 'JARVIS is an intelligent Windows desktop assistant engineered with a high-performance Python FastAPI backend daemon and a cybernetic React 19 + TypeScript (Vite) interface styled with Framer Motion. Built with a provider-agnostic AI Gateway (supporting local Ollama, Google Gemini, OpenAI, and Anthropic Claude), JARVIS provides ambient wake-word detection, hands-free voice conversation, controlled desktop automation tools, persistent runtime SQLite memory, and direct two-way synchronization with Obsidian Markdown vaults.',
    techStack: JSON.stringify({
      frontend: ['React 19', 'Vite', 'TypeScript', 'Framer Motion', 'Lucide React', 'Tailwind CSS', 'WebSockets'],
      backend: ['Python 3.11', 'FastAPI', 'Uvicorn', 'WebSockets', 'psutil', 'pyautogui', 'SpeechRecognition', 'pyttsx3 / edge-tts', 'faster-whisper'],
      database: ['SQLite (data/jarvis.db)', 'Obsidian Markdown Vault'],
      infrastructure: ['AI Gateway (Ollama / Gemini / OpenAI / Anthropic)', 'Windows Subprocess Runner', 'Wake Word Listener'],
    }),
    architecture: `graph TD
    subgraph UI["Cybernetic Dashboard (React 19 + Vite :5173)"]
        Orb["Animated Orb State (Framer Motion)"]
        AudioVis["Voice & Audio Visualizer"]
        Console["Conversation & Memory Viewer"]
        Telemetry["System Telemetry (CPU, RAM, GPU, Battery)"]
        WSClient["WebSocket Client"]
    end

    subgraph Backend["FastAPI Core Daemon (:8000)"]
        WSGateway["WebSocket Gateway & Dispatcher"]
        Brain["Assistant Brain & Prompt Engine"]
        Gateway["Provider-Agnostic AI Gateway"]
        VoicePipeline["Voice Engine (STT / TTS)"]
        ToolRouter["Controlled Tool Router"]
    end

    subgraph Providers["AI Providers & LLM Models"]
        Ollama["Local Ollama (llama3.2)"]
        Gemini["Google Gemini (1.5 Flash / Pro)"]
        OpenAI["OpenAI (GPT-4o / mini)"]
        Claude["Anthropic Claude (Haiku / Sonnet)"]
    end

    subgraph Tools["Desktop & System Tools"]
        AppTool["Application Launcher"]
        SysTool["System Controls (psutil / pyautogui)"]
        BrowserTool["Browser Automation"]
        NotesTool["Quick Notes & Reminders"]
        ObsidianTool["Obsidian Vault Sync"]
    end

    subgraph Storage["Persistence & Memory"]
        SQLiteDB[("SQLite Runtime DB (jarvis.db)")]
        ObsidianVault[("Obsidian Markdown Vault")]
    end

    UI <-->|WebSocket Stream| WSGateway
    WSGateway --> Brain
    Brain --> Gateway
    Gateway --> Ollama
    Gateway --> Gemini
    Gateway --> OpenAI
    Gateway --> Claude
    Brain --> ToolRouter
    ToolRouter --> AppTool
    ToolRouter --> SysTool
    ToolRouter --> BrowserTool
    ToolRouter --> NotesTool
    ToolRouter --> ObsidianTool
    ToolRouter --> SQLiteDB
    ObsidianTool --> ObsidianVault
    VoicePipeline <--> WSGateway`,
    flowExplainer: `# How JARVIS Works

### 1. Futuristic Cybernetic Interface & Live Telemetry
- The React + Vite frontend features a Framer Motion animated central orb reflecting 4 operational states: \`Idle\`, \`Listening\`, \`Thinking\`, and \`Speaking\`.
- Real-time system vitals (CPU load, RAM consumption, GPU load, Battery percentage, Network connection) stream continuously over a WebSocket connection to \`:8000\`.

### 2. Hands-Free Voice & Wake-Word Pipeline
- Ambient background listener detects the *"Hey JARVIS"* wake word.
- Audio capture is routed through SpeechRecognition or local \`faster-whisper\` for low-latency speech-to-text.
- Responses are synthesized via natural text-to-speech (\`pyttsx3\` or \`edge-tts\`) while streaming token audio visualizer state back to the UI.

### 3. Provider-Agnostic Multi-Model AI Gateway
- Switches seamlessly between local offline models (Ollama \`llama3.2\`) and cloud intelligence (Gemini 1.5, OpenAI GPT-4o, Anthropic Claude) via \`config/settings.json\`.
- Automatic fallback cascade ensures JARVIS never drops a prompt even if an external API key limits out.

### 4. Controlled & Sandboxed Tool Execution
- The LLM never runs untrusted arbitrary shell code; it outputs strictly validated JSON tool calls.
- The Python tool router executes dedicated handlers: launching apps, reading system metrics, opening browser URLs, and setting alarms.

### 5. Dual-Layer Storage: Fast Memory & Obsidian Knowledge Base
- **Runtime Memory (\`data/jarvis.db\`)**: Fast SQLite database storing short-term session context, conversation history, user preferences, and tool logs.
- **Deep Knowledge (\`Obsidian Vault\`)**: Automatically creates and references human-readable Markdown notes in the user's Obsidian vault (\`D:\\AI\\Obsidian\`), enabling long-term second-brain collaboration.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\JARVIS\\app\\ui',
    runScript: 'npm run dev',
    port: 5173,
    isRunning: false,
    backendPath: 'D:\\FOR RENDO (ONLY )\\JARVIS',
    backendScript: 'python -m uvicorn assistant.app:app --host 127.0.0.1 --port 8000',
    backendPort: 8000,
    isBackendRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing JARVIS project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new JARVIS project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Configure and calibrate local wake-word listener (openwakeword / porcupine)',
      description: 'Ensure low-power background detection of "Hey JARVIS" without microphone stutter or false positives.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Test multi-provider fallback cascade between local Ollama and Gemini API',
      description: 'Verify seamless failover when local Ollama daemon is offline or cold starting.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Integrate edge-tts neural voices for natural, low-latency audio responses',
      description: 'Replace standard pyttsx3 robotic synthesizer with cloud neural stream for lifelike speech feedback.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Expand controlled system tools for Windows workspace and multi-monitor management',
      description: 'Add commands to snap windows, toggle dark mode, query system temps, and switch virtual desktops.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Bi-directional Obsidian vault daily notes and knowledge graph synchronization',
      description: 'Sync action items, session summaries, and agent findings directly into D:\\AI\\Obsidian.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 5,
    },
    {
      title: 'Add client-side audio visualizer waveform rings to the central orb',
      description: 'Render responsive dynamic frequency rings around the Framer Motion orb based on microphone input.',
      status: 'TODO',
      bucket: 'LATER',
      priority: 'LOW',
      order: 6,
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
      title: 'JARVIS Frontend UI',
      url: 'http://localhost:5173',
      type: 'PROD',
    },
    {
      title: 'FastAPI Backend Core & WebSocket',
      url: 'http://localhost:8000',
      type: 'OTHER',
    },
    {
      title: 'FastAPI Swagger Docs',
      url: 'http://localhost:8000/docs',
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

  console.log('JARVIS project successfully added/updated!');
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
