# Quality & Convergence Checklist: [FEATURE_NAME]

**Feature**: `specs/[NNN-feature-name]`  
**Date**: [DATE]  

---

## Specification & Planning
- [ ] User stories are prioritized (`P1`, `P2`, `P3...`) with clear MVP boundary.
- [ ] Every user story has concrete, testable **Given / When / Then** scenarios.
- [ ] Non-goals (Out of Scope) are explicitly listed to prevent scope creep.
- [ ] Implementation plan passed Constitution Check.

## Code Quality & Architecture
- [ ] No unhandled Promise rejections or empty catch blocks.
- [ ] TypeScript strict mode satisfied (`npx tsc --noEmit` returns 0 errors).
- [ ] Client component directives (`'use client'`) only on interactive leaves.
- [ ] Database queries use proper relations and cascade integrity.

## User Experience & Aesthetics
- [ ] High-contrast dark mode styling conforms to design system.
- [ ] Empty states and loading skeletons provided for async data.
- [ ] Interactive buttons have clear hover, active, and disabled states.
- [ ] All timestamps formatted clearly (relative or standardized locale).

## Convergence & Verification
- [ ] `npm run build` succeeds without warnings.
- [ ] All acceptance scenarios verified working.
- [ ] Spec, plan, and tasks marked as completed.
- [ ] Architecture / Rule synced to Obsidian vault.
