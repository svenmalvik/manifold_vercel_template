---
name: beautiful-web-design
description: Use when building or styling a web app UI, creating layouts, choosing colors, setting up typography, or when the user asks for something to look good, modern, or professional
---

# Beautiful Web Design

## Overview

Build web apps that look handcrafted, not AI-generated. The goal is extraordinary design with personality — not the safe, predictable output every AI produces by default.

## CRITICAL: Avoid the AI Design Trap

AI-generated sites all look the same: indigo/purple primary color, white background, centered hero with gradient text, three evenly-spaced feature cards, rounded-everything, stock illustration style. **This is what you must NOT produce.**

### The AI Slop Checklist — If You Catch Yourself Doing 3+ of These, Stop and Redesign

- Indigo or purple as the primary color
- Centered hero → three equal feature cards → testimonials → CTA footer
- Perfectly symmetric layouts throughout
- Generic gradient text headings
- Uniform card grids with identical sizing
- `border-radius: 9999px` on everything
- Bland, safe color palette (blue/gray/white)
- Every section the same height and padding
- No visual tension or surprise anywhere

## Design Philosophy: Intentional Imperfection

Great design has **tension** — elements that contrast, surprise, or break a pattern to create visual interest. Think editorial magazine layouts, not SaaS templates.

Principles:
1. **Asymmetry over symmetry** — offset grids, unequal columns, elements that break the grid intentionally
2. **Contrast in scale** — pair oversized headings with small body text; mix large and small cards
3. **Whitespace as a design element** — generous, uneven spacing creates rhythm and breathing room
4. **One bold choice per page** — an oversized typeface, a striking color accent, an unexpected layout. Pick one and commit
5. **Restraint everywhere else** — the bold choice only works if the rest is calm

## Design Foundation

### Spacing: 8pt Grid with Intentional Variation

Use multiples of 8px as your base, but vary section spacing to create rhythm — not every section needs the same padding.

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-5xl: 128px;
}
```

Use `--space-4xl` or `--space-5xl` between major sections. Use tighter spacing within groups. The contrast between tight and loose creates visual hierarchy that generic layouts lack.

### Typography: Bold, Fluid, Expressive

Typography is the #1 differentiator. AI defaults to safe system fonts at safe sizes. Instead:

```css
:root {
  /* Use a distinctive display font for headings — NOT Inter, NOT system-ui */
  --font-display: 'Syne', 'Space Grotesk', 'Outfit', 'Clash Display', sans-serif;
  --font-body: 'Inter', 'DM Sans', system-ui, sans-serif;

  /* Dramatic scale — headings should feel oversized */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
  --text-2xl: clamp(2rem, 1.5rem + 2vw, 3rem);
  --text-3xl: clamp(2.5rem, 1.8rem + 3vw, 4.5rem);
  --text-4xl: clamp(3.5rem, 2rem + 5vw, 7rem);

  --line-height-tight: 1.1;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.7;

  --tracking-tight: -0.03em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}
```

Rules:
- Headings: use `--font-display`, tight line-height (1.1), negative letter-spacing (`--tracking-tight`)
- Go big — `--text-4xl` for hero headlines. If it doesn't feel slightly uncomfortable, it's not big enough
- Body: 16px minimum, line-height 1.5+, max-width `65ch`
- Mix weights dramatically: 300 for labels, 700–900 for headings
- Consider uppercase + wide letter-spacing for small labels/overlines

### Color: Distinctive, Not Default

Pick a palette that has character. Avoid the Tailwind defaults (indigo-500, slate, zinc).

```css
:root {
  /* Example: warm, editorial palette */
  --color-bg: #f5f0eb;           /* warm off-white, not cold gray */
  --color-surface: #fffdf9;
  --color-border: #e0d5c7;
  --color-text: #1a1715;
  --color-text-muted: #6b5e52;

  /* A single, confident accent — not blue */
  --color-accent: #d4552a;       /* warm red-orange */
  --color-accent-hover: #b8441f;
  --color-accent-light: #fef0eb;

  /* Feedback */
  --color-success: #2d7a4f;
  --color-warning: #c27a1a;
  --color-error: #c43d2e;

  /* Depth */
  --shadow-sm: 0 1px 3px rgba(26, 23, 21, 0.04);
  --shadow-md: 0 4px 12px rgba(26, 23, 21, 0.06);
  --shadow-lg: 0 12px 40px rgba(26, 23, 21, 0.1);
}
```

Color strategies that stand out:
- **Warm neutrals** (cream, sand, stone) instead of cold grays
- **Dark mode with warmth** — use `#1a1715` not `#0a0a0a`
- **One confident accent** — not blue. Try terracotta, forest green, ochre, deep plum
- **High-contrast pairings** — dark backgrounds with light text for hero sections, then invert
- Meet WCAG AA: 4.5:1 for body text, 3:1 for large text

### Border Radius: Mix, Don't Uniform

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

Use different radii for different elements — small for buttons, larger for cards. Avoid `border-radius: 9999px` everywhere.

## Layout: Break the Grid

### Asymmetric two-column

```css
.split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr; /* NOT 1fr 1fr */
  gap: var(--space-xl);
  align-items: center;
}
```

### Mixed-size bento grid

```css
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: var(--space-lg);
}
.bento .feature {
  grid-column: span 2; /* One card deliberately larger */
}
```

### Full-bleed accent sections

```css
.accent-section {
  background: var(--color-text);
  color: var(--color-bg);
  padding: var(--space-5xl) var(--space-md);
  margin-inline: calc(-1 * var(--space-md)); /* break out of container */
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
```

Alternate between light and dark sections. The contrast creates rhythm.

### Overlapping elements

```css
.overlap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.overlap-grid .image {
  grid-row: 1;
  grid-column: 1 / 3;
}
.overlap-grid .content {
  grid-row: 1;
  grid-column: 2;
  align-self: center;
  margin-top: var(--space-3xl);
  position: relative;
  z-index: 1;
  background: var(--color-surface);
  padding: var(--space-xl);
}
```

## Visual Effects

### Scroll-driven reveals (CSS only, no JS)

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

### Animated gradient accent

```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-accent), #e8a04a, var(--color-accent));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 6s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Hover with personality

```css
.card {
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px) rotate(-0.5deg); /* slight rotation = human feel */
  box-shadow: var(--shadow-lg);
}
```

### Glassmorphism (for floating elements only)

```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-lg);
}
```

### Focus states

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

Never remove focus outlines without a replacement.

## Quick Reference

| Element | Approach |
|---------|----------|
| Hero headline | `--text-4xl`, `--font-display`, tight tracking |
| Section heading | `--text-2xl` to `--text-3xl` |
| Body text | `--text-base`, max-width `65ch` |
| Section spacing | Vary: `--space-3xl` to `--space-5xl` |
| Card padding | `--space-lg` to `--space-xl` |
| Card radius | `--radius-lg` |
| Grid layout | Asymmetric columns, mixed-size cards |
| Primary color | NOT indigo/purple. Use a warm or earthy accent |
| Background | Warm off-white or bold dark, not `#ffffff` |
| Hover effects | Slight rotation + lift, custom cubic-bezier |
| Contrast ratio | 4.5:1 body, 3:1 large text |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Defaulting to indigo/blue primary | Choose a distinctive accent with character |
| Symmetric everything | Use asymmetric grids, unequal columns |
| Same spacing between all sections | Vary spacing to create rhythm |
| Safe, small headings | Go dramatically large with display font |
| `Inter` or `system-ui` for headings | Use a distinctive display typeface |
| Identical card sizes in a grid | Mix spans — one large, two small |
| White background + gray cards | Use warm neutrals or dark accent sections |
| Linear easing on animations | Use `cubic-bezier(0.2, 0, 0, 1)` for organic feel |
| Every section has same structure | Alternate layouts: split, full-bleed, bento, overlap |
| No contrast between sections | Alternate light/dark backgrounds |
