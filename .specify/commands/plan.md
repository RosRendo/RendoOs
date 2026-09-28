---
description: Create technical implementation plan from an approved feature specification.
command: /speckit.plan
---

# Command: /speckit.plan

## Input
Target feature directory under `specs/` (e.g. `specs/002-project-scanner/`).

## Execution Workflow
1. **Read Spec**:
   - Inspect `specs/NNN-<feature>/spec.md` to understand requirements and user stories.
2. **Consult Constitution**:
   - Verify architectural boundaries and constraints from `.specify/memory/constitution.md`.
3. **Formulate Technical Blueprint**:
   - Identify schema changes required in `prisma/schema.prisma`.
   - Design REST API route contracts (`GET`, `POST`, `PATCH`, `DELETE`).
   - Define component architecture, separating Server and Client components.
   - Address error handling, data flow, and caching.
4. **Generate `plan.md`**:
   - Write `specs/NNN-<feature>/plan.md` using `.specify/templates/plan-template.md`.
5. **Report to User**:
   - Present technical design for review before generating tasks.
