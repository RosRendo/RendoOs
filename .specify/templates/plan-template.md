# Technical Implementation Plan: [FEATURE_NAME]

**Feature Directory**: `specs/[NNN-feature-name]`  
**Date**: [DATE]  
**Spec Link**: [spec.md](spec.md)  
**Status**: [Draft | Ready for Implementation | Complete]

---

## 1. Architecture Summary
<!-- Concise explanation of technical approach and system impact -->
[High-level summary of architecture, data flow, and components involved]

---

## 2. Technical Context & Constraints
- **Language / Runtime**: Node.js 20+ / TypeScript (Strict)
- **Framework**: Next.js 15 (App Router) + React 19
- **Database / ORM**: SQLite (`prisma/dev.db`) + Prisma Client
- **Target Route(s)**: [e.g. `/`, `/projects/[id]`, `/scanner`, `/api/...`]
- **Performance Constraints**: [e.g. Instant optimistic UI response (<50ms), async background execution for long tasks]

---

## 3. Constitution Check
*GATE: Must pass before writing code. If violations exist, justify in Section 7.*
- [ ] Conforms to Spec-First workflow (spec.md reviewed and prioritized).
- [ ] Maintains low developer overhead and simplicity (no unnecessary abstractions).
- [ ] Complies with Next.js Server/Client component boundaries.
- [ ] Adheres to dark mode visual design tokens and aesthetic standards.

---

## 4. Data Model & Schema Changes
<!-- Describe changes to prisma/schema.prisma or new models -->
```prisma
// Example Prisma schema addition
model NewEntity {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 5. API Contracts & Endpoints
### `GET /api/[endpoint]`
- **Query Params**: `?param=value`
- **Response `200 OK`**:
```json
{
  "items": []
}
```

### `POST /api/[endpoint]`
- **Request Body**:
```json
{
  "field": "value"
}
```
- **Response `201 Created`**:
```json
{
  "success": true
}
```

---

## 6. Component Hierarchy & File Structure
```text
src/
├── app/
│   ├── [route]/
│   │   └── page.tsx           # Page view
│   └── api/
│       └── [endpoint]/
│           └── route.ts       # Backend route handler
├── components/
│   └── [NewFeatureComponent].tsx # Interactive client component
└── lib/
    ├── types.ts               # TypeScript interface definitions
    └── utils.ts               # Helper utilities
```

---

## 7. Complexity & Trade-Offs
| Decision | Rationale | Alternatives Considered & Rejected |
| :--- | :--- | :--- |
| [e.g. Direct SQLite via Prisma] | Simple, self-contained, zero cloud latency | Cloud PostgreSQL (unneeded overhead for local tool) |
