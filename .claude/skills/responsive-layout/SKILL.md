---
name: responsive-layout
description: Use when building responsive layouts, adapting components for different screen sizes, implementing mobile-first design, using container queries, or when the user wants something to work well on phones, tablets, and desktops
---

# Responsive Layout

## Overview

Build layouts that adapt intelligently to any context — not just viewport width, but the container a component lives in. Pair this with the **beautiful-web-design** skill for typography, color, and visual polish. This skill covers structure; that skill covers style.

## CRITICAL: Avoid the Breakpoint Avalanche

The old way — five device-specific breakpoints with duplicated layout rules — is dead. Modern responsive design uses fluid techniques that handle the gaps between breakpoints automatically, with only 2–3 structural breakpoints for major layout shifts.

### The Responsive Slop Checklist — If You Catch Yourself Doing 3+ of These, Redesign

- Fixed pixel widths on containers
- Five or more `@media` breakpoints
- Duplicating component styles per breakpoint
- Using `width: 100vw` (causes horizontal scrollbar)
- Ignoring touch target sizes on mobile
- Same padding/gap values at every screen size
- Text that's readable on desktop but microscopic on mobile
- Navigation that only works with a mouse

## Strategy: Three Layers of Responsiveness

1. **Fluid by default** — `clamp()`, `fr`, `%`, `min()` handle continuous scaling
2. **Container queries** — components adapt to their parent, not the viewport
3. **Media queries** — only for major structural shifts (single-column to multi-column)

## Breakpoints: Content-Driven, Not Device-Driven

Use only 2–3 breakpoints where your layout actually breaks. These are sensible defaults:

```css
/* Mobile-first: base styles are for narrow screens */

/* Tablet / two-column threshold */
@media (min-width: 40rem) { /* 640px */ }

/* Desktop / full layout */
@media (min-width: 64rem) { /* 1024px */ }
```

Never target specific devices. If your layout breaks at 820px, add a breakpoint at 820px.

## Container Queries: Component-Level Responsiveness

Container queries let a component respond to its parent's width — critical for reusable components that appear in sidebars, modals, and main content areas.

```css
/* Parent opts in as a query container */
.cardWrapper {
  container: card / inline-size;
}

/* Child adapts based on available space, not viewport */
.card {
  display: flex;
  flex-direction: column;
}

@container card (min-width: 480px) {
  .card {
    flex-direction: row;
    align-items: center;
  }
}
```

Container query units scale proportionally within a component:

```css
.card {
  container-type: inline-size;
}

.cardTitle {
  font-size: clamp(1rem, 0.8rem + 1.5cqi, 1.5rem);
  padding: clamp(0.5rem, 8cqi, 1.5rem);
}
```

**Gotchas:**
- A container cannot query itself — only children query parents
- Grid items should not be containers; wrap them in a `<div>` first
- CSS custom properties cannot appear inside `@container` conditions
- Always provide explicit or intrinsic sizing to avoid content collapse with Flexbox containers

## Fluid Grid: No Media Queries Needed

This single declaration creates a responsive grid that reflows automatically:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
  gap: var(--space-lg);
}
```

The `min(16rem, 100%)` prevents overflow on narrow screens — without it, a fixed `minmax(16rem, ...)` breaks below 256px.

## The :has() Selector: Context-Aware Layouts

Style parent elements based on their children — enables conditional layouts without JavaScript:

```css
/* Card with image gets horizontal layout on wide screens */
.card:has(img) {
  grid-template-columns: 200px 1fr;
}

/* Card without image stays stacked */
.card:not(:has(img)) {
  grid-template-columns: 1fr;
}

/* Form row highlights when its input is invalid */
.formRow:has(:invalid) {
  border-left: 3px solid var(--color-error);
}

/* Sidebar collapses: main content takes full width */
.layout:has(.sidebar:empty) {
  grid-template-columns: 1fr;
}
```

Keep `:has()` scoped to small, repeated patterns — avoid applying it to `body` or large subtrees for performance.

## Touch Targets: Non-Negotiable Minimums

WCAG 2.5.8 (AA) requires 24x24px. Real-world usability demands more:

```css
/* Minimum interactive target: 44x44px (WCAG AAA) */
.button, .link, .iconButton {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Expand tap area without changing visual size */
.compactLink {
  position: relative;
}
.compactLink::after {
  content: '';
  position: absolute;
  inset: -8px; /* expands clickable area by 8px in every direction */
}

/* Enforce spacing between adjacent targets */
.actionBar {
  display: flex;
  gap: 12px; /* prevents mis-taps */
}
```

## Fluid Spacing and Sizing

Use `clamp()` for spacing that scales with the viewport — reference the spacing scale from **beautiful-web-design**:

```css
.section {
  padding-block: clamp(var(--space-xl), 6vw, var(--space-5xl));
}

.container {
  width: min(100% - 2rem, 72rem); /* fluid with max-width, no overflow */
  margin-inline: auto;
}
```

## Modern Typography for Responsiveness

Use these CSS properties to prevent layout-breaking text:

```css
h1, h2, h3 {
  text-wrap: balance; /* prevents orphan words in headings */
}

p {
  text-wrap: pretty; /* avoids single-word last lines */
}
```

Fluid type scale is defined in **beautiful-web-design** — use those `--text-*` variables. Do not duplicate type definitions.

## CSS Modules Integration

In a React + CSS Modules project, structure responsive styles like this:

```css
/* Card.module.css */
.wrapper {
  container: card / inline-size;
}

.card {
  display: grid;
  gap: var(--space-md);
  padding: clamp(var(--space-md), 4cqi, var(--space-xl));
}

@container card (min-width: 500px) {
  .card {
    grid-template-columns: 1fr 2fr;
  }
}

@media (min-width: 64rem) {
  .card {
    grid-template-columns: 1fr 2fr 1fr;
  }
}
```

## Quick Reference

| Technique | When to Use |
|-----------|-------------|
| `clamp()` on font-size, padding, gap | Always — fluid by default |
| `repeat(auto-fit, minmax(min(...), 1fr))` | Card grids, galleries, any repeating layout |
| `container-type: inline-size` | Reusable components in varying contexts |
| `@container` | Component adapts to parent width |
| `:has()` | Conditional layout based on child content |
| `@media (min-width)` | Major layout shifts only (1→2 columns) |
| `min(100% - 2rem, 72rem)` | Fluid container with max-width |
| `text-wrap: balance` | Headings — prevents orphaned words |
| `cqi` units | Sizing relative to container, not viewport |
| `min-height: 44px` on interactive elements | Every button, link, icon button |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Media query for every small change | Use `clamp()` and fluid units instead |
| `container-type` on grid items | Wrap grid items in a `<div>`, query that |
| Viewport units only in `clamp()` | Mix `rem` + `vw` so browser zoom still works |
| `width: 100vw` on anything | Use `width: 100%` — `100vw` includes scrollbar |
| Touch targets under 44px | Set `min-height: 44px; min-width: 44px` |
| Same gap everywhere | Scale gaps with `clamp()` — tight on mobile, generous on desktop |
| Container queries without fallback | Base styles must work without `@container` firing |
| Forgetting `:has()` performance | Scope to small repeating patterns, never `body:has(...)` |
| Fixed pixel breakpoints | Use `rem` breakpoints — they respect user font-size settings |
| Duplicating type scale | Use `--text-*` variables from beautiful-web-design |
