# RendoOS Recon Map

## Screen Inventory

| ID | Screen | Route | Purpose | Key Components | States Seen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S01 | Daily Command Center | `/` | Morning landing, proactive focus, today's priority task checklist, running services, and primary workbench | TodayCommandCenter, SpotlightWorkbench, RepositoriesGrid, RecentActivity | empty, loading, filled, running services |
| S02 | Repositories & Workspaces | `/projects` | Complete portfolio catalog with filters (Live, Active, Experiments, Paused) and quick actions | ProjectCardGrid, FilterRibbon, NewProjectModal, RunnerButton | empty, filtered, filled |
| S03 | Project Workspace | `/projects/[id]` | Deep workbench with progressive disclosure tabs: Overview, Architecture, Database, Milestones, Tasks, Notes | WorkspaceHeader, TabNavigation, ArchitectureViewer, DatabaseDesign, MilestonesList, TaskBoard | loading, tabbed, empty states |
| S04 | Captured Ideas Inbox | `/ideas` | Brain dump, idea triage, and conversion to projects/tasks | IdeaInbox, QuickCapture, CategoryFilter, ConvertAction | empty, filled, converting |
| S05 | Daily / Weekly Review | `/review` | Periodic reflection on completed tasks, touched repos, and upcoming priorities | ReviewSummary, CompletedTaskFeed, InactiveRepoTriage, GoalCheck | empty, filled, cycle done |
| S06 | Archived Repositories | `/archive` | Cold storage for completed or shelved codebases | ArchiveGrid, RestoreAction, DeleteAction | empty, filled |
| S07 | System Settings & Scanner | `/settings` | Global configurations, folder scanner, seed generator, and database studio links | SettingsGroup, ScanProjectModal, SeedManager, ThemePicker | ready, scanning, success |

---

## User Flows

### F01: Morning Command & Focus Loop
`S01 (Command Center) -> Check Today's Anchor -> Complete Today's Task -> Launch Primary Runner (FE/BE) -> Jump to S03 (Project Workspace)`
- **Happy path**: 2 clicks to start working on the highest priority task.

### F02: Quick Capture & Idea Routing
`Any Screen -> [Ctrl + K / ⌘K] -> Capture Modal (Task / Idea / Note / Blocker) -> Route to S01 / S03 / S04`
- **Happy path**: 1 hotkey, type, Enter.

### F03: Deep Project Architecture & Database Inspection
`S01 / S02 -> S03 (Project Workspace) -> Switch to 'Database' tab -> View Prisma Schema / Models -> Switch to 'Architecture' -> View Tech Stack`
- **Happy path**: Instant tab switching without full page reload.

### F04: Stale Repo Triage & Hygiene
`S01 (Needs Attention) or S05 (Review) -> 1-Click Triage ('Keep Active' / 'Pause' / 'Archive') -> Database updated`
- **Happy path**: 1 click to maintain clean portfolio state.

---

## Component Vocabulary (Design Primitives)
- **Navigation Shell**: Persistent, calm sidebar navigation with grouped sections (Home, Work, Knowledge, Skills, System).
- **Surface Containers**: 1px crisp borders (`border-zinc-200/80 dark:border-zinc-800/80`), 12px radii, `#0c0d12` dark card backgrounds.
- **Controls & Buttons**: 8px radii, 1 primary solid accent per view, neutral secondary outlines, ghost tertiary.
- **Status Indicators**: Micro status bullet (`●`) with subtle tone background (Emerald, Blue, Violet, Amber, Rose).
- **Typography & Metrics**: Inter / system sans-serif for content, monospaced tabular numerals for metrics, ports, and dates.
