# Rendo Hub Constitution

<!--
  Project Constitution for Rendo Hub
  Governs architectural standards, core principles, design system, and Spec-Driven Development (SDD) rules.
-->

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)
- Every new feature, non-trivial enhancement, or architectural refactor MUST begin with a specification in `specs/NNN-<feature>/`.
- The sequence is strictly:
  ```text
  Specify (spec.md) -> Plan (plan.md) -> Tasks (tasks.md) -> Implement -> Verify
  ```
- No speculative "vibe coding" without documented requirements and testable acceptance scenarios.
- Changes during implementation that alter architecture or scope must be reflected back into the spec and plan.

### II. Developer Mental Overhead Reduction
- Rendo Hub is a **personal developer command center**, NOT an enterprise SaaS, Jira clone, or bloated Notion database.
- It exists to answer five core questions at a glance:
  1. *What am I building and why?*
  2. *What does it look like and how does it work?*
  3. *What is finished vs. not finished?*
  4. *What should I work on next?*
  5. *What is blocked, and what can I safely ignore?*
- Every screen, card, and interaction must minimize cognitive friction. Keep controls immediate, visible, and low-latency.

### III. Master UI/UX Design System (Notion's Calmness + Linear's Precision)
- **Flow Over Components**: Design the information flow first; components exist to support the flow, not the other way around. Never force unrelated cards into arbitrary 4-column grids.
- **Content-First & Calm**: The user should look at any screen for 2–3 seconds and instantly understand: *Where am I? What is this area for? What matters right now? What can I do next?*
- **Restrained Semantic Palette**: 80–90% neutral foundation with 10–20% semantic accents. Color must have meaning:
  - **Indigo/Violet**: Primary interaction, system identity, active navigation.
  - **Blue**: Information, technical systems, infrastructure, links.
  - **Green**: Completed, healthy, active, successful.
  - **Amber**: Attention, pending, needs review.
  - **Rose/Red**: Destructive, error, blocked, critical.
  - **Purple**: AI, automation, intelligence.
  - **Cyan**: Integrations, external systems.
- **Surface & Form Craft**:
  - Warm, soft neutrals (deep charcoal `#0d1117` in dark mode, warm off-white in light mode). Never pure `#000000` or `#FFFFFF`.
  - Crisp 1px low-contrast borders; restrained shadows (only for dropdowns, popovers, and modals).
  - Consistent border radii: 6px controls, 8px buttons, 10–12px cards/containers, 16px dialogs. Avoid turning every button into a pill.
  - Quiet progress bars and subtle status dots (`●`).
- **Anti-AI-Slop & Anti-Bloat**:
  - Strictly avoid: neon glows, glassmorphism, gradient overloads, decorative emoji on every heading, fake KPI metric cards, and oversized hero sections.
  - Grayscale rule: If the visual hierarchy fails when viewed in grayscale without color and shadows, the layout is weak.

### IV. Technology Stack & Architectural Standards
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (Strict).
- **ORM & Database**: Prisma ORM with SQLite (`prisma/dev.db`), utilizing cascade deletions and indexed foreign keys.
- **Styling**: TailwindCSS with tailored CSS variables and utilities in `src/app/globals.css`.
- **API Routing**: Native Next.js Route Handlers (`src/app/api/`) returning structured JSON with proper HTTP status codes and error handling.
- **Server vs. Client Components**:
  - Keep pages and layouts as Server Components wherever possible for fast SSR.
  - Isolate client-side state (`'use client'`) to interactive leaves (modals, runners, checklists, quick capture).

### V. Independent & Testable User Stories
- Every feature specification must prioritize user stories (`P1`, `P2`, `P3...`).
- Each user story MUST be independently testable with clear **Given / When / Then** acceptance scenarios.
- Phase delivery follows MVP increments: shipping `P1` delivers usable value immediately before layering `P2` and `P3`.

### VI. Verification & Convergence
- Implementation is not complete until:
  - `npx tsc --noEmit` passes with 0 type errors.
  - `npm run build` succeeds without build or route generation warnings.
  - Endpoints and UI interactions are verified against the acceptance criteria defined in `spec.md`.
