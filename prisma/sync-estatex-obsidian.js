const fs = require('fs');

const content = `# RendoOS — EstateX Real Estate Portal Project Integration

**Date**: 2026-09-26  
**Project**: EstateX Premium Real Estate Portal (\`estatex\`)  
**Workspace**: \`D:\\FOR RENDO (ONLY )\\Personal Project\\Real-Estate\`  
**Hub Target**: RendoOs (\`d:\\FOR RENDO (ONLY )\\Personal Project\\RendoOs\`)

---

## 1. Executive Summary

The **EstateX Premium Real Estate Portal** has been added to the **RendoOs** projects catalog. This is a full-stack property marketplace tailored for Phnom Penh and luxury international properties:
- **Geospatial Map Search**: Zillow-style neighborhood navigation powered by Leaflet.
- **Virtual 3D Walkthroughs**: Three.js WebGL canvas enabling buyers to explore interior room layouts and 3D architectural models.
- **Unified Express + Vite Architecture**: Express.js 5 serves Vite in middleware mode on port \`5175\`, eliminating separate frontend/backend processes.
- **Media Optimization Pipeline**: Automated Sharp image transcoding to responsive WebP thumbnails.
- **Data Persistence**: Prisma ORM with PostgreSQL schema (Properties, Tiers, Media, Leads, 3D Models).

---

## 2. RendoOs Service Runner Configuration

| Setting | Value |
| :--- | :--- |
| **Folder Path** | \`D:\\FOR RENDO (ONLY )\\Personal Project\\Real-Estate\` |
| **Run Command** | \`cross-env PORT=5175 npm run dev\` |
| **Port** | \`5175\` (isolated from other local dev ports) |
| **Cover Asset** | \`/uploads/1790419003000-estatex.png\` |
`;

try {
  fs.writeFileSync('D:/AI/Obsidian/AI_Brain_Sync/RendoOS_EstateX_Project_Integration.md', content, 'utf8');
  console.log('Successfully written EstateX doc to Obsidian AI_Brain_Sync');
} catch (e) {
  console.error('Failed to write to Obsidian:', e.message);
}
