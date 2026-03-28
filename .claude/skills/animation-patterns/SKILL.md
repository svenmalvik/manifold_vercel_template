---
name: animation-patterns
description: Use when adding animations, transitions, scroll effects, loading states, skeleton screens, micro-interactions, or when the user wants something to feel alive, smooth, or responsive
---

# Animation & Micro-Interaction Patterns

## Overview

CSS-first animation for React 19 + CSS Modules. Animate to communicate, not decorate. Every motion must answer: what changed, where should I look, or is the system working? Pair with the **beautiful-web-design** skill for hover/transition foundations.

## Easing & Timing Quick Reference

| Purpose | Easing | Duration | Notes |
|---------|--------|----------|-------|
| Element entering | `cubic-bezier(0, 0, 0.2, 1)` (decelerate) | 200-300ms | Fast start, gentle stop |
| Element exiting | `cubic-bezier(0.4, 0, 1, 1)` (accelerate) | 150-200ms | Gentle start, fast exit |
| Interactive feedback | `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring) | 150-250ms | Slight overshoot = tactile |
| Layout shift | `cubic-bezier(0.4, 0, 0.2, 1)` (standard) | 250-350ms | Balanced in/out |
| Emphasis / bounce | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | 400-600ms | Use sparingly |

**Rule of thumb:** nothing under 100ms (imperceptible) or over 500ms (sluggish). Button feedback: 150ms. Page transition: 250-350ms. Staggered list reveal: 50-80ms between items.

## CSS Custom Properties for Animation

```css
:root {
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
}
```

## Scroll-Driven Animations (CSS Only)

Use `animation-timeline: view()` to animate elements as they scroll into the viewport. No JS, no Intersection Observer needed. Supported in Chrome, Edge, and Safari 26+.

```css
/* Fade-up reveal on scroll */
@keyframes scroll-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: scroll-fade-up var(--ease-out) both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}

/* Scale-in for images */
@keyframes scroll-scale {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
.revealImage {
  animation: scroll-scale var(--ease-out) both;
  animation-timeline: view();
  animation-range: entry 10% entry 40%;
}

/* Horizontal slide for cards */
@keyframes scroll-slide-in {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
}
.revealLeft {
  animation: scroll-slide-in var(--ease-out) both;
  animation-timeline: view();
  animation-range: entry 5% entry 30%;
}
```

Declare `animation-timeline` **after** any `animation` shorthand, or it gets overwritten.

## Page Transitions with View Transitions API

React 19 provides `<ViewTransition>` for declarative cross-fade and morph transitions. Wrap state changes in `startTransition` to activate.

```tsx
import { ViewTransition, startTransition } from 'react';

function App() {
  const [page, setPage] = useState('list');
  const navigate = (p: string) => startTransition(() => setPage(p));

  return (
    <ViewTransition>
      {page === 'list' ? (
        <ListView onSelect={() => navigate('detail')} />
      ) : (
        <DetailView onBack={() => navigate('list')} />
      )}
    </ViewTransition>
  );
}
```

```css
/* Style the transition in CSS */
::view-transition-old(root) {
  animation: var(--duration-normal) var(--ease-in) fade-out;
}
::view-transition-new(root) {
  animation: var(--duration-normal) var(--ease-out) fade-in;
}
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in  { from { opacity: 0; } }
```

For shared-element morphs, give both elements the same `view-transition-name` in CSS.

## Micro-Interactions

### Button Feedback

```css
.button {
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-out);
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.button:active {
  transform: translateY(0) scale(0.97);
  transition-duration: 80ms;
}
```

### Skeleton Screen

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    var(--color-surface) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```tsx
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeleton} style={{ height: 160 }} />
      <div className={styles.skeleton} style={{ height: 20, width: '70%', marginTop: 12 }} />
      <div className={styles.skeleton} style={{ height: 14, width: '90%', marginTop: 8 }} />
    </div>
  );
}
```

### Loading Spinner (Minimal)

```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

## Staggered Animations

### Pure CSS with nth-child (reliable today)

```css
.staggerItem {
  opacity: 0;
  animation: scroll-fade-up var(--duration-normal) var(--ease-out) both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}
.staggerItem:nth-child(1) { animation-delay: 0ms; }
.staggerItem:nth-child(2) { animation-delay: 60ms; }
.staggerItem:nth-child(3) { animation-delay: 120ms; }
.staggerItem:nth-child(4) { animation-delay: 180ms; }
.staggerItem:nth-child(5) { animation-delay: 240ms; }
.staggerItem:nth-child(6) { animation-delay: 300ms; }
```

### CSS custom property via inline style (dynamic lists)

```tsx
function StaggeredList({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li
          key={item}
          className={styles.staggerItem}
          style={{ '--stagger': i } as React.CSSProperties}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

```css
.staggerItem {
  animation: scroll-fade-up var(--duration-normal) var(--ease-out) both;
  animation-delay: calc(var(--stagger) * 60ms);
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}
```

**Coming soon:** `sibling-index()` (Chrome 125+) eliminates the need for inline style or nth-child rules entirely: `animation-delay: calc(sibling-index() * 60ms);`

## When NOT to Animate

1. **Respect `prefers-reduced-motion`** -- always.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

2. **Skip animation when it adds no meaning:** decorative parallax, looping background motion, auto-playing carousels.
3. **Never animate layout properties:** avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`. Stick to `transform` and `opacity` (GPU-composited, no layout thrashing).
4. **Do not animate text content changes** -- fade the container, not individual characters.
5. **Content-heavy pages:** reduce or remove scroll animations on blog posts and documentation. Readers want to scan, not wait.
6. **Mobile with low battery / low-end devices:** keep animations to opacity-only transitions.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Animating `width`/`height`/`margin` | Use `transform: scale()` or `translate()` instead |
| Missing `prefers-reduced-motion` | Add the media query from day one |
| `animation-timeline` before `animation` shorthand | Always declare `animation-timeline` after shorthand |
| Easing set to `linear` or `ease` | Use custom cubic-bezier for organic motion |
| Stagger delay over 100ms per item | Keep 50-80ms between items; total sequence under 600ms |
| Skeleton shimmer too fast | 1.2-1.8s cycle feels natural |
| Animations on every element | Pick 2-3 key moments per page; restraint beats spectacle |
| Spring easing on page transitions | Reserve spring/overshoot for small interactive elements |
| No `will-change` hint for heavy animations | Add `will-change: transform` on animated elements, remove after |
| View Transitions without `startTransition` | React requires wrapping state updates in `startTransition` |
