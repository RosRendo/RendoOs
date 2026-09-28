---
description: Run final quality audit and mark a feature as converged/completed.
command: /speckit.converge
---

# Command: /speckit.converge

## Input
Target feature directory under `specs/` (e.g. `specs/002-project-scanner/`).

## Execution Workflow
1. **Checklist Validation**:
   - Fill out and verify `checklist.md` for the feature.
2. **Acceptance Verification**:
   - Confirm all P1, P2, P3 user stories meet their acceptance scenarios.
3. **Status Update**:
   - Update `spec.md`, `plan.md`, and `tasks.md` status to `Completed`.
4. **Git Commit & Push**:
   - Stage and commit the completed feature branch or merge to main.
