const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding Journex Dashboard & MT5 Bridge to RendoOs database...');

  const imageRelPath = '/uploads/journex-displaytable.png';
  const diskImagePath = path.join(__dirname, '..', 'public', 'uploads', 'journex-displaytable.png');

  if (!fs.existsSync(diskImagePath)) {
    const srcImg = 'D:/FOR RENDO (ONLY )/Personal Project/Dashboard/frontend/public/displaytable.png';
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, diskImagePath);
      console.log('Copied screenshot to', diskImagePath);
    }
  }

  const existing = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: 'journex' },
        { slug: 'dashboard' },
        { name: 'Journex Trading Dashboard' },
        { name: 'Dashboard' },
      ],
    },
  });

  const projectData = {
    name: 'Journex Trading Dashboard',
    slug: 'journex',
    description: 'High-performance quantitative trading station and automated trade journal featuring Next.js 16 Turbopack frontend, Express.js + Prisma backend, MetaTrader 5 (MT5) Python WebSocket bridge daemon, and AdaptiveICT algorithmic execution engine.',
    status: 'ACTIVE',
    isPrimary: false,
    progress: 88,
    image: imageRelPath,
    currentMilestone: 'Live MT5 telemetry bridge streaming & Terminal Cognitive Hierarchy execution gate',
    overview: 'Journex is a multi-tier quantitative trading station and execution terminal. It unites a real-time Next.js 16 frontend with TradingView lightweight charts, an Express.js backend managing PostgreSQL trade ledgers and risk analytics, and a local Python MetaTrader 5 bridge daemon streaming tick telemetry, account equity, and algorithmic signals from the AdaptiveICT EA.',
    techStack: JSON.stringify({
      frontend: [
        'Next.js 16',
        'React 19',
        'Turbopack',
        'Tailwind CSS 4',
        'Lightweight Charts',
        'Chart.js',
        'Recharts',
        'Framer Motion',
        'tldraw',
        'Radix UI',
      ],
      backend: [
        'Express.js',
        'Node.js',
        'TypeScript',
        'Prisma ORM',
        'PostgreSQL',
        'WebSockets',
        'MetaAPI Cloud SDK',
        'Dodo Payments',
        'Polar.sh',
      ],
      database: [
        'PostgreSQL',
        'Prisma ORM',
        'SQLite (ea_analytics.db)',
      ],
      infrastructure: [
        'Python MetaTrader 5 Bridge',
        'MQL5 (AdaptiveICT_EA)',
        'Docker Compose',
        'PM2',
        'Railway',
        'Vercel',
      ],
    }),
    architecture: `graph TD
    subgraph UI["Trading Cockpit (Next.js 16 Turbopack :3003)"]
        Hero["What's Now Signal Hero Card"]
        Confluence["Why? Confluence & Trade Readiness Gate"]
        Chart["Where? Lightweight Charts & TradingView Engine"]
        ExecGate["Can I Trade? Compliance & Risk Engine"]
        LiveJournal["Trade Journal & Performance Analytics"]
        UIWSClient["WebSocket Client"]
    end

    subgraph Backend["Core API Server (Express.js :5000)"]
        APIRouter["Express REST API"]
        WSBroker["WebSocket Event Broker (:5000)"]
        AuthModule["NextAuth / JWT Session Validator"]
        TradeLedger["Prisma ORM Trade Ledger"]
        AnalyticsEngine["Equity Curve & Win-Rate Processor"]
        MetaAPI["MetaAPI Cloud Gateway"]
    end

    subgraph DesktopBridge["Local MT5 Bridge Daemon (FastAPI :5003)"]
        BridgeAPI["Python FastAPI / WebSocket Bridge"]
        MT5Native["MetaTrader 5 Python SDK (MetaTrader5)"]
        ScreenshotGrab["Pillow ImageGrab Chart Capture"]
    end

    subgraph TerminalPlatform["Execution & Broker Environment"]
        MT5Terminal["MetaTrader 5 Client Terminal"]
        AdaptiveEA["AdaptiveICT_EA.mq5 Expert Advisor"]
        Broker["Liquidity Provider / Broker Gateway"]
    end

    subgraph Data["Persistence Layer"]
        PGDB[("PostgreSQL Database (Railway / Local)")]
        EADB[("SQLite ea_analytics.db")]
    end

    UI <-->|WebSocket & REST| Backend
    UI <-->|Local Low-Latency WS| DesktopBridge
    DesktopBridge <-->|IPC / DLL API| MT5Native
    MT5Native <--> MT5Terminal
    MT5Terminal <--> AdaptiveEA
    MT5Terminal <--> Broker
    Backend --> TradeLedger
    TradeLedger --> PGDB
    DesktopBridge --> EADB
    Backend <--> DesktopBridge`,
    flowExplainer: `# How Journex Trading Terminal & MT5 Bridge Works

### 1. Terminal Cognitive Hierarchy Decision Flow
The terminal guides the trader through 5 progressive decision gates before risking capital:
1. **What's Now?**: Real-time signal hero card (BUY, SELL, or NO TRADE) with live bias indicator.
2. **Why? (Confluence)**: Mathematical factor scores, validation checklist, and warning triggers.
3. **Where? (Market Structure)**: Break of Structure (BOS), Change of Character (CHoCH), Fair Value Gaps (FVG), Order Blocks, and Take-Profit/Stop-Loss levels rendered directly on TradingView charts.
4. **Can I Trade? (Readiness Gate)**: Hard-coded risk rule compliance check (spread check, maximum drawdown, daily trade limit, high-impact news filter).
5. **Execute & Manage**: Single-click order transmission routed directly to MetaTrader 5.

### 2. Triple-Service Local Orchestration
Journex consists of three specialized services:
- **Frontend Cockpit (\`:3003\`)**: Next.js 16 with Turbopack for high-frequency chart rendering and responsive telemetry views.
- **Backend API Server (\`:5000\`)**: Express.js handling trade logs, journal entries, authentication, and analytics computations.
- **MT5 Python Bridge (\`:5003\`)**: Native Windows \`mt5_bridge.py\` daemon with direct C-API hooks into MetaTrader 5 terminal, streaming tick feeds, open positions, balance/equity, and capturing automated trade screenshots.

### 3. Automated Trade Journaling & EA Analytics
- Every closed trade in MT5 is automatically captured over WebSocket, accompanied by an instant screenshot of the chart state at entry and exit.
- Performance statistics (Sharpe ratio, profit factor, max consecutive drawdown, time-of-day edge) calculate automatically and persist to PostgreSQL and \`ea_analytics.db\`.`,
    folderPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard\\frontend',
    runScript: 'npm run dev -- -p 3003',
    port: 3003,
    isRunning: false,
    backendPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard\\backend',
    backendScript: 'npm run dev',
    backendPort: 5000,
    isBackendRunning: false,
    extraPath: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard',
    extraScript: 'python mt5_bridge.py',
    extraPort: 5003,
    extraName: 'MT5 Bridge',
    isExtraRunning: false,
    health: 'HEALTHY',
  };

  let project;
  if (existing) {
    console.log('Updating existing Journex project (id:', existing.id, ')...');
    project = await prisma.project.update({
      where: { id: existing.id },
      data: projectData,
    });
  } else {
    console.log('Creating new Journex project...');
    project = await prisma.project.create({
      data: projectData,
    });
  }

  // Ensure tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  const tasks = [
    {
      title: 'Verify local MT5 IPC connection and live tick heartbeat in mt5_bridge.py',
      description: 'Ensure stable communication between Python FastAPI bridge daemon and MetaTrader 5 terminal.',
      status: 'DONE',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 1,
    },
    {
      title: 'Test Terminal Cognitive Hierarchy Trade Readiness gate with live XAUUSD feed',
      description: 'Validate spread, volatility, and trend filter checks before enabling execution button.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 2,
    },
    {
      title: 'Calibrate Dynamic Risk Management and Max R:R meter thresholds',
      description: 'Fine-tune lot sizing algorithms based on real-time account equity and stop loss distance.',
      status: 'TODO',
      bucket: 'NOW',
      priority: 'HIGH',
      order: 3,
    },
    {
      title: 'Automate post-trade screenshot capture on deal execution via PIL ImageGrab',
      description: 'Store entry and exit chart snapshots automatically linked to closed trade tickets.',
      status: 'TODO',
      bucket: 'NEXT',
      priority: 'MEDIUM',
      order: 4,
    },
    {
      title: 'Sync historical journaled trades to PostgreSQL and export automated PDF reports',
      description: 'Generate comprehensive trader analytics digests using jsPDF and chart.js.',
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
      title: 'Trading Terminal UI (:3003)',
      url: 'http://localhost:3003',
      type: 'PROD',
    },
    {
      title: 'Backend REST & WebSocket API (:5000)',
      url: 'http://localhost:5000',
      type: 'OTHER',
    },
    {
      title: 'Python MT5 Bridge Daemon (:5003)',
      url: 'http://localhost:5003',
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

  console.log('Journex project successfully added/updated!');
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
