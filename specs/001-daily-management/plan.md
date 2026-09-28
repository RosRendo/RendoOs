# Technical Implementation Plan: Daily Management & Command Center

**Feature Directory**: `specs/001-daily-management`  
**Date**: 2026-09-27  
**Spec Link**: [spec.md](spec.md)  
**Status**: Completed

---

## 1. Architecture Summary
Integrate a daily command center on the main dashboard (`/`), a global `Ctrl+K` capture modal, project-level milestone bars, date-grouped timeline feeds, and a `/review` screen. Backend utilizes Next.js App Router API routes backed by SQLite via Prisma ORM.

---

## 2. Data Model & Schema Changes
Added models to `prisma/schema.prisma`:
- `Milestone`: `id`, `projectId`, `title`, `progress` (Int), `status`, `dueDate`, `order`.
- `Activity`: `id`, `projectId`, `type`, `title`, `description`, `timestamp`.
- `Note`: `id`, `projectId`, `title`, `content`.

---

## 3. API Contracts
- `GET /api/today`: Returns primary focus project, today tasks (`bucket: NOW` or `dueDate <= today`), needs attention projects, and completed count.
- `GET/POST/PATCH/DELETE /api/milestones`: CRUD for milestone tracking with automatic status updates.
- `GET /api/activity`: Aggregates activity logs and completed tasks, sorted descending by timestamp.
- `GET/POST /api/notes`: Fast note capture and retrieval.
- `GET /api/review`: Aggregates 7-day review metrics and next week priority plan.

---

## 4. Components & Pages
- `src/components/TodayCommandCenter.tsx`: Main dashboard command center.
- `src/components/QuickCaptureModal.tsx`: Global capture modal triggered via `Ctrl+K`.
- `src/components/MilestonesViewer.tsx`: Milestone cards and progress stepper.
- `src/components/ActivityTimeline.tsx`: Grouped date activity feed.
- `src/app/review/page.tsx`: Full weekly review page.
