# Spec-Driven Development (SDD) Rule

## Overview
This repository uses **Spec-Driven Development (SDD)** governed by **GitHub Spec Kit**.
All feature development must be spec-first, plan-backed, and task-driven to eliminate ambiguity and prevent "vibe coding".

---

## Mandatory SDD Workflow

Whenever the user asks you to implement a new feature, a major enhancement, or a system refactor:

### 1. Constitution Verification
- Read `.specify/memory/constitution.md` to adhere to core product principles, design aesthetics, and technical constraints.

### 2. Feature Specification (`specs/NNN-<feature>/spec.md`)
- If the feature has not been specified yet, create `specs/NNN-<feature>/spec.md` using `.specify/templates/spec-template.md`.
- Prioritize user stories (`P1` MVP, `P2` secondary, `P3` enhancements).
- Write concrete, testable **Given / When / Then** acceptance scenarios for each story.
- Define what is explicitly Out of Scope.
- Ask the user to confirm the specification or proceed.

### 3. Technical Implementation Plan (`specs/NNN-<feature>/plan.md`)
- Generate `specs/NNN-<feature>/plan.md` using `.specify/templates/plan-template.md`.
- Define data models, Prisma schema updates, API route contracts, and component trees.
- Run the Constitution Check.

### 4. Actionable Task Breakdown (`specs/NNN-<feature>/tasks.md`)
- Generate `specs/NNN-<feature>/tasks.md` using `.specify/templates/tasks-template.md`.
- Structure tasks in sequenced phases (`Setup`, `Foundational`, `User Story 1`, `User Story 2`, `Polish`).
- Tag tasks with `[P]` (parallelizable) and story references (`[US1]`).

### 5. Implementation & Verification
- Execute code strictly against the tasks in `tasks.md`.
- Maintain test and build integrity (`npx tsc --noEmit` = 0 errors, `npm run build` succeeds).
- Verify each Acceptance Scenario in `spec.md`.
- Mark completed tasks with `[x]`.

### 6. Obsidian Knowledge Sync
- Automatically sync any new architecture decisions, rules, or optimizations into `D:\AI\Obsidian\AI_Brain_Sync\`.
