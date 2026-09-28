# Rendo Hub Specifications (`specs/`)

This directory contains feature specifications, technical implementation plans, and task lists following **GitHub Spec Kit** and **Spec-Driven Development (SDD)**.

---

## Directory Conventions
Each feature is assigned a sequential number and a descriptive kebab-case name:
```text
specs/
├── README.md
├── 001-daily-management/          # Completed Phase 2: Today Command Center, Ctrl+K Capture, Milestones, Review
│   ├── spec.md                   # Feature requirements & user stories
│   ├── plan.md                   # Technical design & schema changes
│   └── tasks.md                  # Implementation checklist
└── 002-project-scanner/           # Planned Phase 3: Local Repository & Project Scanner Intelligence
    ├── spec.md                   # Specification & acceptance scenarios
    ├── plan.md                   # Architecture & scanning algorithms
    └── tasks.md                  # Step-by-step tasks
```

---

## Feature Artifacts Lifecycle
1. **`spec.md`**: Defines **what** is being built, **why**, prioritized user stories (`P1`, `P2`, `P3...`), and independent acceptance scenarios (`Given / When / Then`).
2. **`plan.md`**: Defines **how** it is built, schema changes, API routes, component structure, and constitutional checks.
3. **`tasks.md`**: Actionable checklist tracking progress from setup to verification.
4. **`checklist.md`**: Convergence and quality checklist before marking complete.
