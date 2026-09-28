---
description: Create or update a feature specification from a natural language description.
command: /speckit.specify
---

# Command: /speckit.specify

## Input
Feature description or request passed by the user.

## Execution Workflow
1. **Analyze Requirements**:
   - Extract primary user goals, motivations, and edge cases.
   - Determine a short kebab-case name for the feature (e.g. `project-scanner`, `cloud-backup`).
2. **Determine Feature Directory**:
   - Find the next sequential number in `specs/` (e.g., `specs/003-feature-name/`).
   - Create the directory if it does not exist.
3. **Generate `spec.md`**:
   - Use `.specify/templates/spec-template.md` as the blueprint.
   - Populate Problem Statement, Prioritized User Stories (`P1`, `P2`, `P3...`), and independent Acceptance Scenarios (`Given / When / Then`).
   - Define Out of Scope items explicitly.
4. **Constitution Check**:
   - Read `.specify/memory/constitution.md` to ensure no constitutional principles are violated.
5. **Report to User**:
   - Present the generated specification for review and ask for confirmation before moving to `/speckit.plan`.
