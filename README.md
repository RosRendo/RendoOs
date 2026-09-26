# Rendo Hub ⚡

> **Personal command center for managing software projects, unfinished experiments, technical architecture, and ideas.**
> Focus on building instead of organizing.

---

## 🎯 The Problem Rendo Hub Solves
> *"I have many project folders and repositories, but I forget what each project is, why I created it, what technology it uses, what is unfinished, and what I should work on next."*

### 10 Core Questions Answered in Under 30 Seconds:
1. **What am I actively working on?** → Dedicated **Current Focus** hero on the dashboard with milestone progress.
2. **What projects do I have?** → Visual project grid across Active, Experiments, Paused, and Archive.
3. **What is each project?** → 1-sentence tagline + concise scope overview (What is this? Who is it for? Why does it exist?).
4. **What does each project look like?** → Visual snapshots, UI mockups, and screenshots with 1-click upload.
5. **What technology does it use?** → Categorized tech badges (Frontend, Backend, Database, Infrastructure).
6. **What is its architecture?** → Clean visual data flow diagrams (Clients → Gateway → Backend → DB → Integrations).
7. **What is unfinished?** → Organized task checklist segmented into **NOW**, **NEXT**, and **LATER**.
8. **What should I do next?** → Top 3 actionable tasks featured directly on the main dashboard with interactive checkboxes.
9. **What is blocked?** → Visible blockers banner (e.g. Bank approvals, webhook callbacks) with 1-click resolve.
10. **What ideas should I save for later?** → Frictionless Ideas inbox with 1-click "Convert to Project".

---

## 🧭 Navigation Structure (Strictly 5 Views)
- **Dashboard (`/`)**: Current Focus hero project, Top 3 Next tasks, Blockers, System alerts, and Project health badges.
- **Projects (`/projects`)**: Visual card grid with status filters (All, Active, Experiments, Paused, Archive) and instant search.
- **Ideas (`/ideas`)**: Zero-friction idea capture inbox with project tags and 1-click promotion to active/idea projects.
- **Archive (`/archive`)**: Cold storage for finished, paused, or retired projects with 1-click restoration.
- **Settings (`/settings`)**: Builder profile, SQLite engine status, and Obsidian vault mirror indicators.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + custom CSS variables (Dark/Light mode developer aesthetic)
- **Database**: SQLite (`prisma/dev.db`) via Prisma ORM v6 (Zero external server configuration required, easily swappable to PostgreSQL)
- **Icons**: Lucide React
- **Local Storage**: `public/uploads` for local image and diagram uploads
- **Obsidian Sync**: Synchronized architectural decisions to `D:\AI\Obsidian\AI_Brain_Sync\`

---

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Database Commands
```bash
# Push schema changes to SQLite
npm run db:push

# Reset & re-seed demo data (ServiceFinder, Orchestrator, etc.)
npm run db:seed

# Open Prisma Studio web inspector
npm run db:studio
```

---

## 📂 Project Structure
```text
├── prisma/
│   ├── schema.prisma       # Database models (User, Project, Task, Blocker, Idea, Link)
│   ├── dev.db              # SQLite local database
│   └── seed.js             # Sample data seeder (ServiceFinder demo)
├── public/
│   ├── projects/           # High-resolution project visuals & mockups
│   └── uploads/            # User-uploaded screenshots & architecture diagrams
├── src/
│   ├── app/
│   │   ├── api/            # REST API endpoints (/projects, /tasks, /blockers, /ideas, /stats, /upload)
│   │   ├── projects/       # Projects grid & Project Detail view (/projects/[id])
│   │   ├── ideas/          # Ideas inbox
│   │   ├── archive/        # Project archive & restoration
│   │   ├── settings/       # Settings & demo reseed
│   │   ├── globals.css     # Dark/light developer theme tokens
│   │   ├── layout.tsx      # Root layout & navigation header
│   │   └── page.tsx        # Dashboard (Current Focus & Task Checklist)
│   ├── components/         # Navbar, QuickAddModal, ThemeToggle
│   └── lib/                # Prisma client, types, health & progress helpers
```
