---
name: speckit
description: Execute Spec-Driven Development (SDD) workflows using GitHub Spec Kit standards for Rendo Hub (/speckit.specify, /speckit.clarify, /speckit.plan, /speckit.tasks, /speckit.implement, /speckit.converge).
---

# GitHub Spec Kit Skill for Rendo Hub

Use this skill whenever the user asks to plan, specify, break down, or implement features using Spec-Driven Development (SDD).

## SDD Lifecycle & Commands

### 1. `/speckit.constitution`
- **Purpose**: View or update the project constitution.
- **File**: `.specify/memory/constitution.md`
- **Action**: Ensure alignment with core product principles, aesthetics, Next.js architecture, and Prisma ORM rules.

### 2. `/speckit.specify [feature description]`
- **Purpose**: Create a new feature specification or update an existing one.
- **File**: `specs/NNN-<feature>/spec.md`
- **Template**: `.specify/templates/spec-template.md`
- **Action**:
  - Determine next sequential number in `specs/`.
  - Capture Problem Statement, Out of Scope, and prioritized user stories (`P1`, `P2`, `P3...`).
  - Provide independent Acceptance Scenarios (`Given / When / Then`) for every user journey.

### 3. `/speckit.clarify`
- **Purpose**: Clarify ambiguities, unanswered questions, or edge cases in a draft spec.
- **Action**: Prompt user with focused questions on data modeling, UX behavior, or scope boundaries.

### 4. `/speckit.plan [feature]`
- **Purpose**: Create a concrete technical blueprint based on an approved `spec.md`.
- **File**: `specs/NNN-<feature>/plan.md`
- **Template**: `.specify/templates/plan-template.md`
- **Action**:
  - Outline database changes, Prisma schema definitions, API contracts, and component trees.
  - Run the Constitution Check.

### 5. `/speckit.tasks [feature]`
- **Purpose**: Break down the technical plan and user stories into a sequenced task checklist.
- **File**: `specs/NNN-<feature>/tasks.md`
- **Template**: `.specify/templates/tasks-template.md`
- **Action**:
  - Organize into `Phase 1: Setup`, `Phase 2: User Story 1 (MVP)`, `Phase 3: User Story 2`, `Phase 4: Polish & Verification`.
  - Mark parallel tasks with `[P]` and story references with `[US1]`.

### 6. `/speckit.implement [feature]`
- **Purpose**: Implement code changes according to `tasks.md` and verify against acceptance scenarios.
- **Action**:
  - Execute tasks incrementally.
  - Keep `npx tsc --noEmit` at 0 errors.
  - Verify every acceptance scenario in `spec.md`.
  - Check off tasks with `[x]`.

### 7. `/speckit.converge [feature]`
- **Purpose**: Final quality audit and convergence.
- **Action**: Verify `checklist.md`, confirm build passes, and update status to `Completed`.
