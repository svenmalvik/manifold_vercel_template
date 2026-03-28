---
name: accessible-components
description: Use when building interactive React components that need to be accessible, adding ARIA attributes, implementing keyboard navigation, managing focus, or when the user asks for accessible UI, screen reader support, or WCAG compliance
---

# Accessible Components

## Overview

Build React components that work for everyone — keyboard users, screen reader users, and users with low vision. Follow the WAI-ARIA Authoring Practices Guide (APG) and meet WCAG 2.2 AA. The rule: **no ARIA is better than bad ARIA** — prefer semantic HTML, reach for ARIA only when native elements fall short.

## Semantic HTML First

Always start with the right element. Native elements provide keyboard support, focus management, and screen reader announcements for free.

```tsx
// WRONG — div with ARIA bolted on
<div role="button" tabIndex={0} onClick={handleClick}>Save</div>

// RIGHT — native button
<button onClick={handleClick}>Save</button>
```

Use `<nav>`, `<main>`, `<section aria-labelledby>`, `<header>`, `<footer>` for landmarks. Use `<h1>`–`<h6>` in order — never skip levels.

## ARIA Quick Reference

| Role / Attribute | Element | Purpose |
|---|---|---|
| `role="dialog"` + `aria-modal="true"` | Modal wrapper | Declares modal; traps assistive tech focus |
| `aria-labelledby` | Dialog, section, tabpanel | Points to visible heading as accessible name |
| `role="tablist"` / `role="tab"` / `role="tabpanel"` | Tabs container / tab / panel | Tab widget structure |
| `aria-selected="true\|false"` | Tab | Active tab state |
| `aria-controls` | Tab, accordion header, menu button | Links trigger to controlled panel |
| `aria-expanded="true\|false"` | Accordion header, menu button | Open/collapsed state |
| `aria-haspopup="menu"` | Menu button | Signals a popup menu exists |
| `role="menu"` / `role="menuitem"` | Dropdown list / items | Menu widget structure |
| `aria-orientation` | Tablist, menu | `vertical` or `horizontal` (default) |
| `aria-live="polite"` | Status region | Announces dynamic content to screen readers |
| `aria-disabled="true"` | Any interactive element | Disabled without removing from tab order |

## Keyboard Patterns

### Modal Dialog

```tsx
import { useRef, useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
}

export function Modal({ open, onClose, titleId, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();   // native focus trap
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}          /* Escape key fires cancel */
    >
      {children}
    </dialog>
  );
}
```

The native `<dialog>` with `showModal()` gives you `role="dialog"`, `aria-modal="true"`, focus trapping, and Escape-to-close for free. Return focus to the trigger on close.

### Tabs

```tsx
import { useState, useRef, type KeyboardEvent } from 'react';

interface Tab { id: string; label: string; content: React.ReactNode; }

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKey = (e: KeyboardEvent) => {
    let next = active;
    if (e.key === 'ArrowRight') next = (active + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (active - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== active) { setActive(next); tabRefs.current[next]?.focus(); }
  };

  return (
    <>
      <div role="tablist" aria-label="Content tabs" onKeyDown={handleKey}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            ref={el => { tabRefs.current[i] = el; }}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== active}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
```

Arrow keys move between tabs (roving `tabIndex`). Tab key moves into the panel. Home/End jump to first/last tab.

### Accordion

```tsx
import { useState } from 'react';

interface AccordionItem { id: string; heading: string; content: React.ReactNode; }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpenIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>
            <button
              aria-expanded={openIds.has(item.id)}
              aria-controls={`sect-${item.id}`}
              onClick={() => toggle(item.id)}
            >
              {item.heading}
            </button>
          </h3>
          <div id={`sect-${item.id}`} role="region" aria-labelledby={`btn-${item.id}`} hidden={!openIds.has(item.id)}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Enter/Space toggles. The heading level (`h3` here) must match your page hierarchy.

### Dropdown Menu

```tsx
import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface MenuItem { id: string; label: string; onSelect: () => void; }

export function DropdownMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) itemRefs.current[focusIdx]?.focus();
  }, [open, focusIdx]);

  const handleBtnKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); setOpen(true); setFocusIdx(0);
    }
    if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setFocusIdx(items.length - 1); }
  };

  const handleMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => (i + 1) % items.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(i => (i - 1 + items.length) % items.length); }
    if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    if (e.key === 'Enter' || e.key === ' ') { items[focusIdx].onSelect(); setOpen(false); btnRef.current?.focus(); }
  };

  return (
    <div>
      <button ref={btnRef} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} onKeyDown={handleBtnKey}>
        {label}
      </button>
      {open && (
        <ul role="menu" onKeyDown={handleMenuKey}>
          {items.map((item, i) => (
            <li key={item.id} role="menuitem" tabIndex={-1} ref={el => { itemRefs.current[i] = el; }} onClick={() => { item.onSelect(); setOpen(false); btnRef.current?.focus(); }}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Focus Management Rules

1. **Visible focus indicator** — use the tokens from the `beautiful-web-design` skill:
   ```css
   :focus-visible {
     outline: 2px solid var(--color-accent);
     outline-offset: 3px;
   }
   ```
   Never remove outlines without a visible replacement.
2. **Return focus** — when a modal or popover closes, restore focus to the element that opened it.
3. **Roving tabIndex** — in composite widgets (tabs, menus, toolbars) only the active item has `tabIndex={0}`; siblings get `tabIndex={-1}`. Arrow keys move focus.
4. **Skip link** — add as the first focusable element on every page:
   ```tsx
   <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
   ```

## Color Contrast

Use the color tokens from the **beautiful-web-design** skill and verify they meet WCAG 2.2 AA:

| Context | Minimum ratio |
|---|---|
| Body text | 4.5 : 1 |
| Large text (18px bold / 24px regular) | 3 : 1 |
| UI components and graphical objects | 3 : 1 |
| Focus indicators | 3 : 1 against adjacent colors |

## Screen Reader Announcements

For dynamic content (toasts, live counts, errors), use an ARIA live region:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

```css
/* visually hidden but announced */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Use `aria-live="assertive"` only for urgent errors. Prefer `polite` for everything else.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using `div` / `span` as buttons | Use `<button>` — free keyboard + screen reader support |
| `role="button"` without keyboard handler | Use native `<button>`, or add `onKeyDown` for Enter and Space |
| `aria-label` duplicating visible text | Use `aria-labelledby` pointing to the visible heading instead |
| Removing `:focus` outlines for aesthetics | Style `:focus-visible` instead — keeps mouse UX clean |
| Opening modal without moving focus | Call `.showModal()` or imperatively `.focus()` on first element |
| Closing modal without returning focus | Store `document.activeElement` before open, restore on close |
| `aria-expanded` missing on toggle buttons | Always set `aria-expanded="true"` or `"false"` on the trigger |
| Tabs navigable only with Tab key | Implement arrow keys with roving `tabIndex` per APG |
| Missing skip link on content-heavy pages | Add skip link as first focusable element |
| Using `aria-hidden="true"` on focusable element | Remove from tab order first, or use `inert` attribute |
| Color as the only indicator of state | Add icon, text, or pattern alongside color |
| Missing `lang` attribute on `<html>` | Set `<html lang="en">` — screen readers need it for pronunciation |
