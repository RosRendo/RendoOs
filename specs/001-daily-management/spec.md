# Feature Specification: Daily Management & Command Center

**Feature Directory**: `specs/001-daily-management`  
**Created**: 2026-09-27  
**Status**: Completed  
**Input / User Description**: "Introduce daily management features: Today command center, global quick capture (Ctrl+K), project health indicators, milestones tracker (M1-M4), activity timeline, and weekly review."

---

## 1. Problem Statement & Motivation
- **The Problem**: Developers juggling multiple local repos and active projects lose context between sessions, forget pending tasks, and lack an instant view of what to focus on today.
- **The Solution**: Build a daily command center with a primary focus spotlight, quick capture modal (`Ctrl+K`), visual milestone progress bars, date-grouped activity history, and a weekly review screen.
- **Value**: Reduces mental startup friction each morning to under 10 seconds.

---

## 2. User Scenarios & Prioritized Stories

### User Story 1 - Today Command Center (Priority: P1) 🎯 MVP
As a developer starting work, I want to open Rendo Hub and immediately see my primary focus project, actionable tasks for today, and dormant projects needing attention.

- **Acceptance Scenarios**:
  1. **Given** a primary focus project is set, **When** visiting `/`, **Then** the Today Command Center displays the project banner, live runner buttons, and active tasks.
  2. **Given** tasks flagged with bucket `NOW`, **When** clicking the checkbox, **Then** the task toggles between `DONE` and `TODO` immediately without a page refresh.
  3. **Given** projects inactive for >7 days, **When** reviewing the Needs Attention card, **Then** 1-click triage buttons (`[Keep Active]`, `[Pause]`, `[Archive]`) update the project status instantly.

---

### User Story 2 - Global Quick Capture (Priority: P1)
As a developer working across different screens, I want to press `Ctrl + K` to capture an idea, task, note, or blocker into any project without navigating away.

- **Acceptance Scenarios**:
  1. **Given** any page in Rendo Hub, **When** pressing `Ctrl + K`, **Then** the Quick Capture modal opens with focused input.
  2. **Given** the modal is open, **When** selecting tab `[Task]` or `[Blocker]` and typing text, **Then** pressing `Ctrl + Enter` saves the item to the selected project and closes the modal.

---

### User Story 3 - Milestones Progress Tracker (Priority: P2)
As a developer tracking major project phases, I want to view M1-M4 progress bars and update percentages with 1 click.

- **Acceptance Scenarios**:
  1. **Given** a project details page, **When** switching to the Milestones tab, **Then** all milestones render with progress bars and status badges.
  2. **Given** a milestone, **When** clicking a quick step button (`0%`, `25%`, `50%`, `75%`, `100%`), **Then** the progress updates immediately, auto-marking `COMPLETED` when reaching 100%.

---

### User Story 4 - Activity Timeline (Priority: P2)
As a developer wondering "What was I doing last time?", I want a chronological timeline feed of completed tasks and milestone changes.

- **Acceptance Scenarios**:
  1. **Given** project updates, **When** opening the Timeline tab, **Then** events are grouped into `TODAY`, `YESTERDAY`, and earlier dates.

---

### User Story 5 - Weekly Review Screen (Priority: P3)
As a developer doing weekend or weekly retrospectives, I want a high-contrast dashboard summarizing weekly throughput and generating next week's priority plan.

- **Acceptance Scenarios**:
  1. **Given** 7 days of activity, **When** visiting `/review`, **Then** 4 metric cards display tasks completed, touched projects, inactive projects, and captured ideas.

---

## 3. Out of Scope (Non-Goals)
- No complex multi-user permission systems.
- No third-party Jira / Linear synchronization.
- No recurring billing or subscription models.
