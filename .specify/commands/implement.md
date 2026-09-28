---
description: Implement code changes according to the tasks list and verify against acceptance scenarios.
command: /speckit.implement
---

# Command: /speckit.implement

## Input
Target feature directory under `specs/` (e.g. `specs/002-project-scanner/`).

## Execution Workflow
1. **Load Tasks**:
   - Inspect `specs/NNN-<feature>/tasks.md`. Identify the next incomplete task batch.
2. **Execute Incrementally**:
   - Implement backend schemas, routes, and models first.
   - Build frontend components according to design tokens and principles.
   - Assemble pages and wire data fetching.
   - Update `[ ]` to `[x]` in `tasks.md` as tasks are finished.
3. **Verify Acceptance Criteria**:
   - Verify every Acceptance Scenario in `spec.md` for the story being delivered.
4. **Compile & Quality Check**:
   - Run `npx tsc --noEmit` (must be 0 errors).
   - Run `npm run build` (must pass cleanly).
5. **Obsidian Sync**:
   - Auto-sync architectural decisions to `D:\AI\Obsidian\AI_Brain_Sync\`.
