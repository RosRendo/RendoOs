# Tasks: [FEATURE_NAME]

**Feature Directory**: `specs/[NNN-feature-name]`  
**Prerequisites**: [spec.md](spec.md) (approved), [plan.md](plan.md) (approved)  
**Status**: [Not Started | In Progress | Completed]

---

## Notation & Conventions
- `[ ]`: Incomplete task
- `[x]`: Completed task
- `[P]`: Can be worked on in parallel (independent files / no blocking dependency)
- `[US1]`, `[US2]`: Indicates which prioritized user story this task delivers

---

## Phase 1: Setup & Foundational Prerequisites
*Prerequisites that MUST be completed before story implementations begin.*
- [ ] T001 Define TypeScript types and interfaces in `src/lib/types.ts`
- [ ] T002 Update `prisma/schema.prisma` with new models and relations
- [ ] T003 Execute `npx prisma db push` and `npx prisma generate`

---

## Phase 2: User Story 1 - [Title] (Priority: P1) 🎯 MVP
*Delivers the primary standalone working increment.*
- [ ] T004 [US1] Create backend API handler in `src/app/api/.../route.ts`
- [ ] T005 [US1] Create UI component in `src/components/...tsx`
- [ ] T006 [US1] Wire component into target page in `src/app/.../page.tsx`
- [ ] T007 [US1] Verify US1 independent acceptance scenarios

---

## Phase 3: User Story 2 - [Title] (Priority: P2)
*Secondary functionality and enhancements.*
- [ ] T008 [US2] Extend API handler or add action routes
- [ ] T009 [US2] Implement interactive UI states and error boundary
- [ ] T010 [US2] Verify US2 independent acceptance scenarios

---

## Phase 4: Polish, Optimization & Verification
*Convergence and quality assurance.*
- [ ] T011 Run `npx tsc --noEmit` and ensure 0 TypeScript errors
- [ ] T012 Run `npm run build` and ensure clean bundle generation
- [ ] T013 Verify visual aesthetics, dark mode contrast, and responsive layout
- [ ] T014 Auto-sync learning/architecture notes to Obsidian vault
