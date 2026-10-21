# Test Plan: RendoOS

**Build**: `2.0.0-cleanroom`  
**Date**: 2026-10-11  
**Environment**: Local Next.js server (`http://localhost:3000`), SQLite Prisma database

---

## 1. Test Cases Matrix

| Case ID | Flow | Type | Steps | Expected | Auto | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **F01-H1** | Morning Focus Loop | Happy | Open `/`, verify Today's Anchor renders primary project and milestone | Primary project title, target milestone, and progress bar visible | Yes | **PASS** |
| **F01-H2** | Task Completion | Happy | Toggle task status on Today checklist (`PATCH /api/tasks`) | Task status toggles between `TODO` and `DONE`, updates stats | Yes | **PASS** |
| **F01-E1** | Empty Tasks State | Edge | When no tasks are due today, verify empty state banner | Calm "No urgent tasks due today" message with emerald shield | Yes | **PASS** |
| **F01-E2** | Long Project Title | Edge | Render project with 50+ character title | Title truncates with ellipsis without breaking card layout | Yes | **PASS** |
| **F02-H1** | Quick Capture Task | Happy | Send task payload (`POST /api/tasks`) with `bucket: NOW`, `priority: HIGH` | Task created in database, returns 201/200 JSON | Yes | **PASS** |
| **F02-H2** | Quick Capture Idea | Happy | Send idea payload (`POST /api/ideas`) with title & category | Idea created and visible in ideas inbox | Yes | **PASS** |
| **F02-H3** | Quick Capture Blocker | Happy | Send blocker payload (`POST /api/blockers`) | Blocker logged and attached to project | Yes | **PASS** |
| **F02-N1** | Missing Title Validation | Negative | Post empty title to `/api/tasks` or `/api/ideas` | Returns 400 Bad Request error | Yes | **PASS** |
| **F03-H1** | Project Workspace Tabs | Happy | Request `/projects/[id]`, switch between Overview, Tasks, Milestones, Arch, DB | Correct tab panel renders, DB schema renders if present | Yes | **PASS** |
| **F03-H2** | Architecture Diagram | Happy | Verify Mermaid architecture string loads in project detail | Architecture diagram code returned in API | Yes | **PASS** |
| **F03-E1** | Non-existent Project ID | Negative | Request invalid slug/ID `/projects/nonexistent-id-999` | Handled gracefully with 404 / project not found | Yes | **PASS** |
| **F04-H1** | Inactive Repo Triage | Happy | Mark inactive project as `PAUSED` via `PATCH /api/projects/:id` | Status transitions to `PAUSED`, reflected in filters | Yes | **PASS** |
| **F04-H2** | Repo Archive & Restore | Happy | Transition project status `ACTIVE` -> `ARCHIVED` -> `ACTIVE` | Successfully archived, then restored to active | Yes | **PASS** |
| **F05-H1** | Shell Responsive Navigation | Happy | Toggle sidebar collapse state, test mobile drawer toggle | Sidebar expands/collapses cleanly, links navigate accurately | Yes | **PASS** |
| **F06-H1** | All Core Routes HTTP 200 | Happy | GET `/`, `/projects`, `/ideas`, `/review`, `/archive`, `/settings` | All pages respond with HTTP 200 OK without unhandled runtime exceptions | Yes | **PASS** |
