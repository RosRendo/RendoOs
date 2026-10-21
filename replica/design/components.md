# RendoOS Component Specifications

Design primitives built for Notion calmness + Linear precision. 80–90% neutral foundation, 10–20% semantic accents. No neon, no glassmorphism, no generic card wall.

---

### Button
- **Variants**:
  - `primary`: solid accent (`bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-2xs`)
  - `secondary`: neutral outline (`border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300`)
  - `ghost`: subtle text (`text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40`)
  - `danger`: destructive action (`border border-rose-500/20 text-rose-500 hover:bg-rose-500/10`)
- **Sizes**:
  - `sm`: 28px height, `px-2 py-0.5 text-xs font-mono`
  - `md`: 36px height, `px-3 py-1.5 text-xs font-medium`
  - `lg`: 42px height, `px-4 py-2 text-sm font-semibold`
- **States**: default, hover, active (scale 0.98), focus-visible (2px ring), disabled (opacity 50, cursor-not-allowed).
- **A11y**: Native `<button>`, aria-labels on icon-only buttons, keyboard reachable with visible focus rings.
- **Used on**: Everywhere (Command Center, Repositories, Workspace, Modals).

---

### StatusBadge & PortBadge
- **Variants**:
  - `active` / `live`: emerald micro-dot (`●`) + `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
  - `in-dev`: blue micro-dot + `bg-blue-500/10 text-blue-400 border border-blue-500/20`
  - `experiment`: violet micro-dot + `bg-violet-500/10 text-violet-400 border border-violet-500/20`
  - `warning` / `paused`: amber micro-dot + `bg-amber-500/10 text-amber-400 border border-amber-500/20`
  - `danger` / `blocker`: rose micro-dot + `bg-rose-500/10 text-rose-400 border border-rose-500/20`
  - `port-chip`: `font-mono text-[10px] font-bold px-1.5 py-0.2 rounded` with direct `↗` link to localhost port.
- **Used on**: S01 (Command Center), S02 (Repositories), S03 (Workspace).

---

### SurfaceCard & Panel
- **Tokens**:
  - Background: `bg-white dark:bg-[#0c0d12]`
  - Border: 1px subtle `border-zinc-200/80 dark:border-zinc-800/80`
  - Radius: `rounded-xl` (12px) for main sections, `rounded-lg` (8px) for inner list items.
  - Shadow: `shadow-xs` / `shadow-2xs` (never heavy glowing drop-shadows).
- **Rule**: Never nest 3 borders deep. Prefer structural column dividers (`divide-zinc-100 dark:divide-zinc-800/70`) over card-within-card containers.
- **Used on**: Command Center pillars, Spotlight Workbench, Repositories grid.

---

### TabBar & SegmentedControl
- **Variants**:
  - `underline`: Clean border-bottom indicator (`border-b-2 border-blue-500 text-blue-500 font-semibold`)
  - `pill`: Segmented control container (`bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono`)
- **A11y & Responsiveness**: Horizontal scrollable with `overflow-x-auto scrollbar-none` on narrow viewports; tabular numerals for counts (`font-mono text-[10px]`).
- **Used on**: S02 (Filters), S03 (Overview / Tasks / DB / Arch tabs).

---

### QuickCaptureDialog (Ctrl+K / ⌘K)
- **Structure**:
  - Backdrop: `bg-black/50 backdrop-blur-xs`
  - Modal: `max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl`
  - Tabs: Task (`blue`), Idea (`amber`), Note (`violet`), Blocker (`rose`).
  - Shortcut listener: Global `⌘K` / `Ctrl+K` keydown, Escape to close.
- **Used on**: Everywhere via global AppShell.

---

### SidebarRail & NavItem
- **Structure**:
  - Desktop: Collapsible between `w-60` and `w-16`, persistent on left, border-right `border-zinc-200/80 dark:border-zinc-800/80`.
  - Sections: Quiet uppercase labels (`HOME`, `WORK`, `KNOWLEDGE`, `SYSTEM`).
  - Active state: `bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-2xs`.
  - Inactive state: `text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50`.
  - Mobile: Slide-over drawer with backdrop.
- **Used on**: S00 (AppShell).
