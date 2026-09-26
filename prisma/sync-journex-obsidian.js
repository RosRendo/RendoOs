const fs = require('fs');

const content = `# RendoOS — Journex Trading Dashboard & MT5 Bridge Integration

**Date**: 2026-09-26  
**Project**: Journex Trading Dashboard & Terminal (\`journex\`)  
**Workspace**: \`D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard\`  
**Hub Target**: RendoOs (\`d:\\FOR RENDO (ONLY )\\Personal Project\\RendoOs\`)

---

## 1. Executive Summary

The **Journex Trading Dashboard & MT5 Bridge** has been integrated into the **RendoOs** projects catalog. This is a multi-service quantitative trading cockpit designed around the Terminal Cognitive Hierarchy (What's Now → Why → Where → Can I Trade → Execute → Manage).

---

## 2. Triple-Service Architecture & Runner Setup

| Service | Target Path | Command | Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Cockpit** | \`Dashboard\\frontend\` | \`npm run dev -- -p 3003\` | \`3003\` | Next.js 16 Turbopack, React 19, Lightweight Charts, Chart.js, Recharts, tldraw, Framer Motion |
| **Backend API** | \`Dashboard\\backend\` | \`npm run dev\` | \`5000\` | Express.js, TypeScript, Prisma ORM, PostgreSQL, WebSockets, MetaAPI SDK |
| **MT5 Bridge Daemon** | \`Dashboard\` | \`python mt5_bridge.py\` | \`5003\` | Native Windows MetaTrader 5 Python bridge, real-time tick streaming, account equity & automated trade chart snapshots |

---

## 3. Algorithmic Trading Integrations

- **MQL5 EA**: \`AdaptiveICT_EA.mq5\` / \`AdaptiveICT_EA.ex5\` for algorithmic and semi-automated order flow execution.
- **Analytics Store**: PostgreSQL for journal history, SQLite (\`ea_analytics.db\`) for local tick & EA telemetry.
- **Visual Evidence**: Trade Readiness Panel snapshot saved to \`/uploads/journex-displaytable.png\`.
`;

try {
  fs.writeFileSync('D:/AI/Obsidian/AI_Brain_Sync/RendoOS_Journex_Project_Integration.md', content, 'utf8');
  console.log('Successfully written Journex doc to Obsidian AI_Brain_Sync');
} catch (e) {
  console.error('Failed to write to Obsidian:', e.message);
}
