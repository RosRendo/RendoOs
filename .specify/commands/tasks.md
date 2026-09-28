---
description: Break down an approved plan and spec into an actionable checklist of tasks.
command: /speckit.tasks
---

# Command: /speckit.tasks

## Input
Target feature directory under `specs/` (e.g. `specs/002-project-scanner/`).

## Execution Workflow
1. **Analyze Plan & Spec**:
   - Inspect `spec.md` and `plan.md` in the feature directory.
2. **Phase Breakdown**:
   - Group tasks into logical, sequenced phases:
     - Phase 1: Setup & Foundational Prerequisites (types, schema, migrations).
     - Phase 2: User Story 1 (P1 MVP implementation & verification).
     - Phase 3: User Story 2 (P2 implementation & verification).
     - Phase 4: Polish, Optimization & Verification.
3. **Task Conventions**:
   - Tag tasks with `[P]` if they can be executed in parallel without file collisions.
   - Tag with `[US1]`, `[US2]` to link directly to prioritized user stories.
   - Include exact file paths in task descriptions.
4. **Generate `tasks.md`**:
   - Write `specs/NNN-<feature>/tasks.md` using `.specify/templates/tasks-template.md`.
