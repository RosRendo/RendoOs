# Tasks: Local Project Scanner & Intelligence

**Feature Directory**: `specs/002-project-scanner`  
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)  
**Status**: Ready for Implementation

---

## Phase 1: Setup & Foundational Scanner Engine
- [ ] T001 Create `src/lib/scanner.ts` with local filesystem inspection utilities (detecting `package.json`, `go.mod`, etc.)
- [ ] T002 Implement port connectivity prober (`net.Socket` check with timeout) in `src/lib/port-checker.ts`
- [ ] T003 [P] Add TypeScript interfaces for scan results and detected project metadata in `src/lib/types.ts`

---

## Phase 2: User Story 1 - 1-Click Directory Scan (Priority: P1) 🎯 MVP
- [ ] T004 [US1] Create `/api/scan/inspect` route handler to scan folders and detect frameworks
- [ ] T005 [US1] Create `/api/scan/import` route handler to register detected projects into Prisma SQLite
- [ ] T006 [US1] Build `src/components/ProjectScannerModal.tsx` with folder picker and project candidate preview
- [ ] T007 [US1] Add "Scan Projects" button on Dashboard and Projects page

---

## Phase 3: User Story 2 - Schema & Architecture Extraction (Priority: P2)
- [ ] T008 [US2] Implement Prisma schema parser to extract model names, fields, and relations
- [ ] T009 [US2] Auto-populate `databaseDesign` and `overview` when importing or syncing a project

---

## Phase 4: User Story 3 - Live Port Listener & Process Health Check (Priority: P2)
- [ ] T010 [US3] Create `/api/scan/health` batch TCP port probing endpoint
- [ ] T011 [US3] Build `LivePortBadge.tsx` displaying live pulse indicator (`🟢 Online (:3010)` vs `⚪ Offline`)
- [ ] T012 [US3] Embed `LivePortBadge` into Project cards and Project Details header

---

## Phase 5: Verification & Convergence
- [ ] T013 Verify type safety (`npx tsc --noEmit`)
- [ ] T014 Verify production build (`npm run build`)
- [ ] T015 Verify scan and import on local directories
- [ ] T016 Mark spec as completed and sync architecture to Obsidian vault
