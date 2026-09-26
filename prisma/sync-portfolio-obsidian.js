const fs = require('fs');

const content = `# RendoOS — Ros Rendo Portfolio Project Integration

**Date**: 2026-09-26  
**Project**: Ros Rendo Developer Portfolio (\`portfolio\`)  
**Workspace**: \`D:\\FOR RENDO (ONLY )\\Portfolio\`  
**Hub Target**: RendoOs (\`d:\\FOR RENDO (ONLY )\\Personal Project\\RendoOs\`)

---

## 1. Executive Summary

The **Ros Rendo Portfolio** has been registered in the **RendoOs** projects catalog. This is the flagship personal engineering showcase highlighting production software architecture, quantitative trading engines, and modern full-stack systems:
- **Framework & Core**: Next.js 16.2.1 App Router + React 19.2.4 + TypeScript
- **Styling & Tokens**: Tailwind CSS 4 (\`@tailwindcss/postcss\`)
- **Interactive 3D WebGL**: Three.js + \`@react-three/fiber\` + \`@react-three/drei\` for the dynamic 3D surprise canvas
- **Kinetic Physics**: Lenis smooth inertial scrolling (\`@studio-freight/react-lenis\`) and Framer Motion micro-interactions
- **Sections**: Evidence-first hiring narrative (Hero, About, Projects Carousel, Journey Timeline, Live GitHub Activity, Engineering Lessons, Testimonials, Contact)

---

## 2. RendoOs Service Runner Configuration

| Setting | Value |
| :--- | :--- |
| **Folder Path** | \`D:\\FOR RENDO (ONLY )\\Portfolio\` |
| **Run Command** | \`npm run dev -- -p 3002\` |
| **Port** | \`3002\` (assigned to avoid collisions with RendoOs :3000) |
| **Cover Asset** | \`/uploads/1790417532998-portfolio-hero.png\` |
`;

try {
  fs.writeFileSync('D:/AI/Obsidian/AI_Brain_Sync/RendoOS_Portfolio_Project_Integration.md', content, 'utf8');
  console.log('Successfully written Portfolio doc to Obsidian AI_Brain_Sync');
} catch (e) {
  console.error('Failed to write to Obsidian:', e.message);
}
