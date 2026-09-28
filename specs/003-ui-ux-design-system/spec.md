# Feature Specification: RendoOS — Master UI/UX Design System

**Feature Directory**: `specs/003-ui-ux-design-system`  
**Created**: 2026-09-28  
**Status**: Ready for Planning (`/speckit.plan`)  
**Input / User Description**: "RendoOS — Master UI/UX Design System: Notion's calmness + Linear's precision + modern colorful productivity software. Information flow first, components second. 80-90% neutral, 10-20% semantic accent. Anti-AI-slop, no neon, no glassmorphism, no generic card wall."

---

## 1. Problem Statement & Motivation
- **The Problem**: RendoOS previously suffered from typical SaaS / dashboard tendencies: too many competing cards, glowing gradients, glassmorphism, and visual noise that increased cognitive overhead instead of reducing it.
- **The Solution**: Redesign and standardize the entire RendoOS interface around a unified, calm personal command center aesthetic:
  - **Notion's calmness**: Content-first typography, generous semantic spacing, quiet surfaces, single-column reading flows.
  - **Linear's precision**: Crisp 1px subtle borders, disciplined 6px/8px/12px radii, keyboard-first clarity, instant responsiveness, high-craft dark mode.
  - **Modern colorful productivity**: 80–90% neutral foundation with 10–20% semantic accents that communicate real meaning (Indigo, Blue, Green, Amber, Rose, Purple, Cyan).
- **Core Principle**:
  > **Design the information flow first. Components exist to support the flow, not the other way around.**

---

## 2. User Scenarios & Prioritized Stories

### User Story 1 - Design Tokens & Semantic Color Foundation (Priority: P1) 🎯 MVP Foundation
As a user navigating RendoOS, I want the entire application to look visually cohesive, calm, and purposeful, where color always communicates meaning and never competes for attention.

- **Why this priority**: Without a rock-solid token foundation, individual components will drift into inconsistent colors, arbitrary radii, and decorative noise.
- **Independent Verification**: Inspect `src/app/globals.css` and `tailwind.config.js` to verify semantic color variables (`indigo`, `blue`, `green`, `amber`, `rose`, `purple`, `cyan`) with tone scales (50, 100, 300, 500, 600, 700), warm dark neutrals (deep charcoal `#0d1117`, surface `#161b22`, border `#21262d`), and typography scale.
- **Acceptance Scenarios**:
  1. **Given** any screen in RendoOS, **When** scanning the UI, **Then** 80–90% of the surface area is neutral, and accent colors represent strictly defined semantics (Green = completed/healthy, Amber = attention/pending, Rose = blocked/error, Purple = AI/automation, Blue = tech/links, Indigo = primary actions).
  2. **Given** dark mode, **When** viewing the interface, **Then** backgrounds use warm deep charcoal (not pitch black `#000000`) and borders are subtle 1px low-contrast dividers without glowing shadows or neon effects.
  3. **Given** any component, **When** rendered, **Then** border radii strictly follow: 6px for small controls, 6–8px for buttons, 8–12px for cards/containers, and 12–16px for dialogs.

---

### User Story 2 - Calm Sidebar & Predictable Navigation Architecture (Priority: P1)
As a developer using RendoOS daily, I want a calm, collapsible sidebar navigation grouped into meaningful categories so that I always know where I am and where to go next.

- **Why this priority**: The top navbar with multiple floating buttons contributed to visual clutter; a persistent, structured sidebar provides a true "personal operating system" feel.
- **Independent Verification**: Navigate between sections using the sidebar; verify grouped hierarchy, active indicators, and responsive collapse.
- **Acceptance Scenarios**:
  1. **Given** the app layout, **When** viewing navigation, **Then** items are grouped under calm headers:
     - `HOME` (Command Center)
     - `WORK` (Projects, Tasks, Roadmap)
     - `KNOWLEDGE` (Notes, Architecture, Decisions)
     - `SKILLS` (Development, DevOps, AI)
     - `SYSTEM` (Scanner, Automations, Settings)
  2. **Given** an inactive navigation link, **When** viewed, **Then** it shows muted text and a neutral icon; **When** active, it displays slightly stronger text, a subtle accent-tinted background, and an accent indicator.
  3. **Given** mobile or tablet screen widths, **When** resizing, **Then** the sidebar collapses smoothly into a clean drawer or bottom navigation without breaking content flow.

---

### User Story 3 - Continuous Command Center Dashboard Flow (Priority: P1) 🎯 Core Flow
As a user opening RendoOS, I want the home screen to flow naturally from current context to immediate priority to next actions, rather than confronting me with a disjointed wall of dashboard cards.

- **Why this priority**: The home dashboard is the first impression each day. It must answer in 2–3 seconds: *Where am I? What matters right now? What can I do next?*
- **Independent Verification**: Visit `/` and verify the single/2-column continuous reading flow with zero unnecessary metric widgets or decorative charts.
- **Acceptance Scenarios**:
  1. **Given** the home page (`/`), **When** loaded, **Then** the content is centered with comfortable maximum reading width (`max-w-5xl`) and follows the continuous hierarchy:
     ```text
     Good morning, Rendo
     What needs your attention?
     ──────────────────────────────
     CURRENT FOCUS (Spotlight Project)
       Current State -> Current Priority -> Next Action -> [Continue Button]
     ──────────────────────────────
     ACTIVE PROJECTS (Focused list with identity dot, state, progress)
     ──────────────────────────────
     RECENT / UPCOMING (Actionable tasks & attention reminders)
     ```
  2. **Given** the dashboard, **When** removing color, shadows, and icons mentally, **Then** the information hierarchy remains 100% legible and obvious in pure grayscale.
  3. **Given** the dashboard, **When** inspected, **Then** there are zero decorative KPI widgets, fake analytics graphs, or stacked colored boxes.

---

### User Story 4 - Content-First Project Workspace & Progressive Disclosure (Priority: P2)
As a developer reviewing a specific project, I want the project page to present immediate identity, current state, and next actions first, progressively disclosing architecture, tasks, milestones, and notes only when needed.

- **Why this priority**: Prevents information overload by keeping project overviews focused on execution while preserving instant access to deep technical blueprints.
- **Independent Verification**: Open `/projects/[id]` and test progressive disclosure across tabs.
- **Acceptance Scenarios**:
  1. **Given** a project page, **When** rendered, **Then** the header displays project identity (subtle accent badge), plain-English description, current status, and next actionable step.
  2. **Given** supporting project details (Architecture, Tasks, Database Design, Milestones, Notes, Activity Timeline), **When** browsing, **Then** they are presented in clean, quiet tabs with zero visual clutter.
  3. **Given** the Database Design tab, **When** viewing Prisma or SQL schemas, **Then** code and entity relationships render with clean typography and subtle borders.

---

### User Story 5 - Component Harmonization & Anti-AI-Slop Polish (Priority: P2)
As a developer interacting with controls, I want all buttons, inputs, modals, and status badges to feel lightweight, intentional, and cohesive.

- **Why this priority**: Eliminates residual glassmorphism, neon outlines, and pill-shaped overload from older components.
- **Independent Verification**: Verify `TodayCommandCenter`, `MilestonesViewer`, `QuickCaptureModal`, `ActivityTimeline`, and buttons.
- **Acceptance Scenarios**:
  1. **Given** any interactive section, **When** buttons are rendered, **Then** exactly ONE primary solid accent action exists per section, secondary actions use subtle outlines/neutrals, and tertiary actions use ghost text.
  2. **Given** statuses (`Healthy`, `Needs Attention`, `Blocked`, `Inactive`), **When** displayed, **Then** they use a small colored bullet (`●`) + concise text + subtle tint (never loud, full-bleed colored banners).
  3. **Given** Quick Capture (`Ctrl + K`), **When** opened, **Then** it presents a calm, focused modal with clean tabs (`Task`, `Idea`, `Note`, `Blocker`), subtle 1px border, and zero glassmorphic blur.

---

## 3. Visual & Aesthetic Rules (Strict Enforcement)

| Element | Rule | Avoid |
| :--- | :--- | :--- |
| **Color Balance** | 80–90% neutral, 10–20% semantic accent | Rainbow dashboards, full-bleed colored cards |
| **Borders** | 1px, low-contrast (`#21262d` dark / `#e5e7eb` light) | Thick borders, colored borders on everything |
| **Shadows** | None or very subtle on surfaces; medium on modals/dropdowns | Floating glowing card shadows |
| **Border Radius** | 6px controls, 8px buttons, 10–12px cards, 16px modals | Turning every button into a pill |
| **Typography** | Sans-serif, strong hierarchy: 32px title, 20px section, 15px body, 13px meta | Bold text everywhere, giant decorative headings |
| **Progress** | Quiet, subtle percentage bar with soft color | Giant circular gauges, neon radial meters |
| **AI Features** | Subtle purple accent (`bg-purple-500/10 text-purple-400`) | `✨ AI POWERED ✨` glowing banners |
| **Icons** | Lightweight, consistent stroke, semantic purpose | Emoji beside every single heading |

---

## 4. Edge Cases & Boundary Conditions
- **High-contrast / Grayscale readability**: Text contrast must exceed WCAG AA standards (minimum 4.5:1 for body text).
- **Responsive Layout**: On mobile (<768px), sidebar transforms into an off-canvas drawer or bottom bar, preserving single-column flow.
- **Empty States**: Never show giant cartoon illustrations; use calm, quiet messages with a single primary action button.

---

## 5. Out of Scope (Non-Goals)
- No arbitrary user theme customizations (color pickers for random hex codes).
- No animated decorative particle canvas backgrounds.
- No multi-tenant branding or white-label styling.
