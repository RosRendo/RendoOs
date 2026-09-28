# Technical Implementation Plan: Local Project Scanner & Intelligence

**Feature Directory**: `specs/002-project-scanner`  
**Date**: 2026-09-28  
**Spec Link**: [spec.md](spec.md)  
**Status**: Ready for Implementation

---

## 1. Architecture Summary
Introduce a server-side local scanner engine within Next.js API route handlers using Node.js `fs`, `path`, and `net` modules to:
1. Scan local directories non-destructively for software project signatures (`package.json`, `go.mod`, `requirements.txt`, `prisma/schema.prisma`).
2. Parse dependency trees and determine frameworks and script commands.
3. Test local TCP ports via socket connection checks (`net.Socket`) with a fast 200ms timeout to detect live dev servers.
4. Provide a dedicated Scanner UI (`/scanner` or modal) with one-click "Import / Sync".

---

## 2. API Design & Contracts

### `POST /api/scan/inspect`
- **Request**:
```json
{
  "targetPath": "D:\\FOR RENDO (ONLY )\\Personal Project"
}
```
- **Response `200 OK`**:
```json
{
  "detectedProjects": [
    {
      "name": "CV-Gen",
      "folderPath": "D:\\FOR RENDO (ONLY )\\Personal Project\\CV-Gen",
      "framework": "Next.js",
      "scripts": { "dev": "next dev", "build": "next build" },
      "port": 3000,
      "isPortListening": false,
      "alreadyImported": true,
      "hasPrisma": true,
      "hasReadme": true
    }
  ]
}
```

### `GET /api/scan/health`
- **Query**: `?ports=3000,3005,3010,5173`
- **Response `200 OK`**:
```json
{
  "statuses": {
    "3000": true,
    "3005": false,
    "3010": true,
    "5173": false
  }
}
```

---

## 3. UI Component Architecture
- `src/components/ProjectScannerModal.tsx`: Interactive scanning dialog allowing folder path input, scan progress animation, detected project cards, and 1-click import buttons.
- `src/components/LivePortBadge.tsx`: Lightweight badge pinging port status and showing live pulse indicator.
