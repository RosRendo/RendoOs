# RendoOS Architecture Plan

## 1. Stack & Runtime
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS with custom design system tokens (80-90% neutral foundation, 10-20% semantic accents)
- **Database**: SQLite via Prisma ORM (`prisma/schema.prisma`)
- **Icons**: Lucide React + custom SVG tech badges
- **Runner**: Node.js child_process daemon manager for 1-click project launching

---

## 2. App Shell Architecture
- **Persistent Calm Sidebar**:
  - `HOME`: Dashboard / Command Center (`/`)
  - `WORK`: Repositories (`/projects`), Review (`/review`)
  - `KNOWLEDGE`: Ideas Inbox (`/ideas`), Archive (`/archive`)
  - `SYSTEM`: Scanner & Settings (`/settings`)
  - Quick Project Switcher & Global Quick Capture (`⌘K`)
- **Content Area**: Centered, comfortable max-width container (`max-w-7xl` or `max-w-6xl`) with consistent padding.
- **Top Bar**: Minimal telemetry bar showing live active services count, quick capture trigger, scan trigger, and theme toggle.

---

## 3. Screen Build Sequence

1. **Step 1: The Shell (S00)**
   - Re-architect [src/app/layout.tsx](file:///d:/FOR%20RENDO%20%28ONLY%20%29/Personal%20Project/RendoOs/src/app/layout.tsx) with a responsive, calm sidebar navigation component (`src/components/Sidebar.tsx`) alongside the top bar.
2. **Step 2: Command Center Polish (S01)**
   - Verify continuous flow: Today's Horizon -> Live Services -> Primary Spotlight Workbench -> Repositories -> Recent Activity.
3. **Step 3: Repositories & Workspaces (S02)**
   - Polish `/projects` catalog page with filter tabs, clean cards, and runner buttons.
4. **Step 4: Content-First Project Workspace (S03)**
   - Polish `/projects/[id]` with progressive disclosure tabs: Overview, Architecture, Database, Milestones, Tasks, Notes.
5. **Step 5: Review & Reflection Flow (S05)**
   - Polish `/review` with completed task feed and triage actions.
