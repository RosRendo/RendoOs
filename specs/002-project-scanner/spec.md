# Feature Specification: Local Project Scanner & Intelligence

**Feature Directory**: `specs/002-project-scanner`  
**Created**: 2026-09-28  
**Status**: Ready for Planning & Implementation  
**Input / User Description**: "Automate project onboarding and health checks by scanning local project directories to detect framework, package dependencies, package.json scripts, Prisma/SQL schemas, README files, and live port listener status."

---

## 1. Problem Statement & Motivation
- **The Problem**: Adding or updating projects in Rendo Hub currently requires manual data entry (paths, ports, tech stacks, run scripts, schemas). When a project's dependencies, ports, or scripts change, Rendo Hub becomes outdated unless manually synced.
- **The Solution**: Build an automated Local Project Scanner that inspects local directories (e.g. `D:\FOR RENDO (ONLY )\Personal Project\*`), extracts package manifests, identifies frameworks and database schemas, and checks if dev server ports are actively listening.
- **Value**: Reduces project registration time from minutes to a single click, keeping Rendo Hub accurate and synchronized with the actual filesystem.

---

## 2. User Scenarios & Prioritized Stories

### User Story 1 - 1-Click Directory Scan & Project Detection (Priority: P1) 🎯 MVP
As a developer, I want to scan a local directory path so that Rendo Hub automatically identifies all contained projects, their framework (Next.js, NestJS, Vite, Go, Python), and their package dependencies.

- **Acceptance Scenarios**:
  1. **Given** a directory path like `D:\FOR RENDO (ONLY )\Personal Project`, **When** clicking "Scan Directory", **Then** the scanner detects all child folders containing `package.json`, `go.mod`, `requirements.txt`, or `.git`.
  2. **Given** a detected project, **When** inspecting scan results, **Then** the framework (e.g. Next.js, FastAPI, Vite), scripts (`npm run dev`, `nest start`), and ports are auto-extracted without manual typing.
  3. **Given** a detected project not yet in Rendo Hub, **When** clicking "Import to Hub", **Then** the project is inserted into SQLite with all metadata populated.

---

### User Story 2 - Auto Schema & Architecture Extraction (Priority: P2)
As a developer, I want the scanner to inspect `prisma/schema.prisma` or SQL files in the target project and automatically generate the Database Design tab and schema overview.

- **Acceptance Scenarios**:
  1. **Given** a project folder with `prisma/schema.prisma`, **When** scanning or re-syncing the project, **Then** Rendo Hub parses the models, fields, and relations and updates the `databaseDesign` markdown field.
  2. **Given** a project with a `README.md`, **When** scanning, **Then** the scanner extracts the high-level overview and populates the project description if empty.

---

### User Story 3 - Live Port Listener & Process Health Check (Priority: P2)
As a developer running local servers, I want Rendo Hub to check whether project ports (e.g. 3000, 3005, 3010, 5173) are actively listening and display real-time status.

- **Acceptance Scenarios**:
  1. **Given** a project with port `3010`, **When** viewing the project card, **Then** a live ping verifies if the TCP port is open, displaying `🟢 Online (:3010)` or `⚪ Stopped`.
  2. **Given** a project where the port is offline, **When** clicking "Run Project", **Then** Rendo Hub launches the registered script and transitions the badge to `🟡 Starting` then `🟢 Online`.

---

## 3. Out of Scope (Non-Goals)
- No remote SSH or cloud server scanning (local machine only).
- No automatic execution of unapproved scripts or dependency installation (`npm install` will not be run automatically).
- No file watcher scanning every second (scans are on-demand or periodic to prevent CPU spikes).
