# Tasks: Daily Management & Command Center

**Feature Directory**: `specs/001-daily-management`  
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)  
**Status**: Completed

---

## Phase 1: Setup & Foundational Prerequisites
- [x] T001 Update `prisma/schema.prisma` with `Milestone`, `Activity`, and `Note` models
- [x] T002 Push schema to SQLite (`npx prisma db push`)
- [x] T003 Generate Prisma Client (`npx prisma generate`)
- [x] T004 Seed initial milestones and timeline events for active projects

---

## Phase 2: User Story 1 - Today Command Center (Priority: P1)
- [x] T005 [US1] Create `/api/today` route handler
- [x] T006 [US1] Build `TodayCommandCenter.tsx` component with primary focus banner and task toggles
- [x] T007 [US1] Integrate dormant project attention triage (`[Keep Active]`, `[Pause]`, `[Archive]`)
- [x] T008 [US1] Mount `TodayCommandCenter` atop `src/app/page.tsx`

---

## Phase 3: User Story 2 - Global Quick Capture (Priority: P1)
- [x] T009 [US2] Build `QuickCaptureModal.tsx` supporting Task, Idea, Note, and Blocker tabs
- [x] T010 [US2] Add global `Ctrl + K` / `Cmd + K` keyboard shortcut listener in `Navbar.tsx`
- [x] T011 [US2] Implement `Ctrl + Enter` fast submission handler

---

## Phase 4: User Story 3 & 4 - Milestones & Activity Timeline (Priority: P2)
- [x] T012 [US3] Create `/api/milestones` CRUD route handlers
- [x] T013 [US3] Build `MilestonesViewer.tsx` with 1-click step buttons
- [x] T014 [US4] Create `/api/activity` route handler
- [x] T015 [US4] Build `ActivityTimeline.tsx` with date grouping (`TODAY`, `YESTERDAY`)
- [x] T016 [US3/US4] Mount Milestones and Timeline tabs in `src/app/projects/[id]/page.tsx`

---

## Phase 5: User Story 5 - Weekly Review Screen (Priority: P3)
- [x] T017 [US5] Create `/api/review` aggregation route handler
- [x] T018 [US5] Build `/review` page with 4 metric cards and Next Week Priority Plan
- [x] T019 [US5] Add `Review` navigation link in `Navbar.tsx`

---

## Phase 6: Verification & Convergence
- [x] T020 Run `npx tsc --noEmit` (passed with 0 errors)
- [x] T021 Run `npm run build` (compiled all 23 routes cleanly)
- [x] T022 Commit and push to main (`010a8d5`)
