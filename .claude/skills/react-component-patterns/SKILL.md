---
name: react-component-patterns
description: Use when building React components, structuring files, managing state, fetching data, typing props, or composing UI — covers React 19 patterns with TypeScript and CSS Modules
---

# React 19 Component Patterns

## File Structure

One folder per component. Keep the component, its styles, and its barrel export together.

```
src/
├── components/
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.module.css
│   │   └── index.ts          // export { default } from './Card'
│   ├── UserList/
│   │   ├── UserList.tsx
│   │   ├── UserList.module.css
│   │   └── index.ts
```

Only extract a component into `components/` when it is shared. Page-specific pieces stay next to the page that uses them.

## Component Skeleton

Every component follows this shape: props interface at the top, CSS Module import, named function export.

```tsx
import styles from './Card.module.css'

interface CardProps {
  title: string
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export default function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </article>
  )
}
```

### CSS Module pairing

```css
/* Card.module.css */
.card     { padding: 24px; border-radius: 12px; }
.default  { background: var(--color-surface); }
.outlined { border: 1px solid var(--color-border); background: transparent; }
.title    { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
.body     { font-size: 15px; line-height: 1.6; }
```

## Props & TypeScript Conventions

```tsx
// Extend native HTML attributes when wrapping a DOM element
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button className={`${styles[variant]} ${className ?? ''}`} {...rest} />
}
```

- Use `interface` for props (not `type`) — they merge and show better in IDE tooltips.
- Use `React.ReactNode` for children, not `JSX.Element`.
- Use `React.ComponentProps<'element'>` to extend native element props.
- Discriminated unions for mutually exclusive variants:

```tsx
type AlertProps =
  | { severity: 'info'; action?: never }
  | { severity: 'error'; action: () => void }
```

## Ref as Prop (React 19 — No forwardRef)

React 19 passes `ref` as a regular prop. No `forwardRef` wrapper needed.

```tsx
interface InputProps extends React.ComponentProps<'input'> {
  label: string
  ref?: React.Ref<HTMLInputElement>
}

export default function Input({ label, ref, ...rest }: InputProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input ref={ref} className={styles.input} {...rest} />
    </label>
  )
}
```

## State Management Patterns

### Local state — useState

Keep state as close to where it is used as possible. One component, one concern.

```tsx
const [query, setQuery] = useState('')
```

### Complex local state — useReducer

Switch to `useReducer` when state transitions depend on previous state or involve multiple related values.

```tsx
interface FormState {
  name: string
  email: string
  status: 'idle' | 'submitting' | 'done'
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'SUBMIT' }
  | { type: 'DONE' }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value }
    case 'SUBMIT':    return { ...state, status: 'submitting' }
    case 'DONE':      return { ...state, status: 'done' }
  }
}
```

### Cross-component state — Context

Create a typed context with a custom hook. Never export the raw context.

```tsx
// ThemeContext.tsx
import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return <Ctx value={{ theme, toggle }}>{children}</Ctx>
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
```

Note: React 19 uses `<Context value={}>` directly instead of `<Context.Provider value={}>`.

## Data Fetching — the `use` Hook (React 19)

The `use` hook reads a Promise during render. Pair it with a `<Suspense>` boundary for loading states and an `<ErrorBoundary>` for errors.

```tsx
import { use, Suspense } from 'react'

// Create the promise OUTSIDE the component (or in a parent / loader).
const usersPromise = fetch('/api/users').then(r => r.json())

function UserList() {
  const users: User[] = use(usersPromise)
  return (
    <ul className={styles.list}>
      {users.map(u => <li key={u.id} className={styles.item}>{u.name}</li>)}
    </ul>
  )
}

// Usage
export default function UsersPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserList />
    </Suspense>
  )
}
```

`use` can also read Context directly: `const theme = use(ThemeCtx)` — and unlike `useContext`, it works inside conditionals and loops.

## Form Actions — useActionState (React 19)

Manages async form submission state with built-in pending tracking.

```tsx
import { useActionState } from 'react'

interface FormResult { success: boolean; error?: string }

async function submitForm(_prev: FormResult | null, formData: FormData): Promise<FormResult> {
  const res = await fetch('/api/contact', { method: 'POST', body: formData })
  if (!res.ok) return { success: false, error: 'Failed to send' }
  return { success: true }
}

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitForm, null)

  return (
    <form action={action} className={styles.form}>
      <input name="message" required className={styles.input} />
      <button disabled={isPending} className={styles.button}>
        {isPending ? 'Sending...' : 'Send'}
      </button>
      {state?.error && <p className={styles.error}>{state.error}</p>}
    </form>
  )
}
```

## Composition Patterns

### Compound components — split a complex UI into co-located pieces that share context.

```tsx
function Tabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0)
  return <TabsCtx value={{ active, setActive }}>{children}</TabsCtx>
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className={styles.tabList}>{children}</div>
}

function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const { active, setActive } = useTabsCtx()
  return (
    <button
      className={`${styles.tab} ${active === index ? styles.active : ''}`}
      onClick={() => setActive(index)}
    >{children}</button>
  )
}

// Usage: <Tabs><TabList><Tab index={0}>A</Tab></TabList></Tabs>
```

### Custom hooks — extract reusable logic out of components.

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initial
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue] as const
}
```

### Render delegation — pass layout control to the parent via `children` or render props, not config objects.

## Quick Reference

| Need | Pattern |
|------|---------|
| Style a component | CSS Module: `ComponentName.module.css` |
| Combine CSS classes | Template literal: `` `${styles.a} ${styles.b}` `` |
| Conditional class | `condition ? styles.active : ''` |
| Extend native element | `React.ComponentProps<'button'>` |
| Expose a ref | Accept `ref` as a prop (no `forwardRef`) |
| Simple local state | `useState` |
| Complex / related state | `useReducer` |
| Shared app-wide state | Context + custom hook |
| Async data in render | `use(promise)` + `<Suspense>` |
| Form submission | `useActionState` |
| Optimistic UI | `useOptimistic` |
| Reusable logic | Custom hook (`useXxx`) |
| Multi-part UI | Compound component + context |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Inline styles or `style={}` objects | Use CSS Modules — they scope automatically and ship zero JS |
| `forwardRef` wrapper in React 19 | Pass `ref` as a regular prop |
| Creating promise inside component for `use` | Lift the promise to module scope, a parent, or a cache — otherwise it re-creates every render |
| Giant component doing everything | Split into container (data) and presentational (markup) components |
| `useEffect` for data fetching | Prefer `use(promise)` + Suspense, or `useActionState` for form flows |
| Prop drilling through 3+ levels | Introduce a Context with a custom hook |
| `any` or missing types on props | Define an `interface` for every component's props |
| `JSX.Element` for children type | Use `React.ReactNode` — it covers strings, numbers, fragments, null |
| `<Context.Provider value={}>` | React 19 shorthand: `<Context value={}>` |
| Exporting raw Context object | Export only a custom `useXxx` hook that throws if used outside provider |
