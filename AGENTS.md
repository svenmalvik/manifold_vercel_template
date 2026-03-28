# Manifold Vercel Template

This repository is a Vercel-deployable React SPA used in Manifold's simple view by non-developers. The user interacts exclusively through chat — they describe what they want and the agent builds it.

## Tech stack

- **React 19** with TypeScript
- **Vite 6** as the build tool
- **CSS Modules** for styling (no Tailwind, no styled-components)
- **Vercel** for deployment (zero-config — Vite is auto-detected)

Do NOT add Dexie, IndexedDB, or server-side frameworks unless the user explicitly requests it.

## Agent workflows

The user will never run commands themselves. The agent must handle everything automatically based on what the user asks. Follow these patterns:

### When the user describes an app or requests changes

1. Edit the source files in `src/` to implement what the user described.
2. Run `npm install` if any dependencies were added to `package.json`.
3. Run `npm run dev` so the user can preview the result immediately.
4. Narrate each step briefly so the user can follow along.

### When the user wants to see their app live / share it

1. Run `npm run build` to type-check and produce `dist/`.
2. Fix any TypeScript errors before proceeding.
3. Run `vercel deploy` to create a preview URL.
4. Share the URL with the user so they can open or share it.
5. If the user wants it to be the "real" version, run `vercel deploy --prod`.

### When something looks broken or the user reports an issue

1. Run `npm run build` to surface any TypeScript errors.
2. Check the browser console output from the dev server.
3. Fix the issue, then restart `npm run dev` for the user to verify.

### When the user asks about environment variables or secrets

1. Run `vercel env add KEY` to add a new variable.
2. Run `vercel env pull .env.local` to sync variables locally.
3. Never commit `.env.local` — it is in `.gitignore`.

## Skills reference

When working on UI or frontend tasks, read and follow the relevant skill guides in `.claude/skills/`. Each defines project standards for its domain.

| Skill | Path | When to use |
|-------|------|-------------|
| **Beautiful Web Design** | `.claude/skills/beautiful-web-design/SKILL.md` | Styling, colors, typography, layout, visual polish |
| **Responsive Layout** | `.claude/skills/responsive-layout/SKILL.md` | Mobile-first layouts, container queries, breakpoints, touch targets |
| **Accessible Components** | `.claude/skills/accessible-components/SKILL.md` | ARIA patterns, keyboard navigation, focus management, screen readers |
| **React Component Patterns** | `.claude/skills/react-component-patterns/SKILL.md` | Component structure, state management, props, CSS Modules conventions |
| **Form Design** | `.claude/skills/form-design/SKILL.md` | Form validation UX, multi-step forms, accessible error messaging |
| **Animation Patterns** | `.claude/skills/animation-patterns/SKILL.md` | Scroll animations, micro-interactions, page transitions, easing |
| **SEO & Meta** | `.claude/skills/seo-and-meta/SKILL.md` | Open Graph tags, meta descriptions, structured data, social previews |

The goal is extraordinary, handcrafted-looking design — not generic AI output.

## Communication style

The user is NOT a developer. They are building their app through a chat conversation. All output must be written for someone with zero programming knowledge.

**Rules:**
- Never show code snippets, file paths, or terminal output in your responses to the user
- Never use technical terms like "component", "state", "props", "hook", "render", "build", "compile", "deploy", "API", "endpoint", "dependency", "module", or "TypeScript" — rephrase in plain language
- Never mention file names (e.g. `App.tsx`, `package.json`) — just say what you changed
- When something breaks, say what went wrong and that you're fixing it — not what the error message says
- Keep updates to 1–3 short sentences. No bullet lists of what you did
- Use "your app" or "your site", not "the application" or "the project"
- When asking a question, give 2–3 simple options — never ask open-ended technical questions

**Good examples:**
- "I've added a contact form to the main page. You can try it out now."
- "Your app is live! Here's the link: ..."
- "Something wasn't working right — I've fixed it, you can check again."
- "Would you like the header to be (a) fixed at the top when you scroll, or (b) scroll away with the page?"

**Bad examples:**
- "I've updated `src/App.tsx` to include a new `ContactForm` component with `useState` for form validation."
- "The build failed due to a TypeScript error in `FormField.tsx:42` — missing type annotation on the `onChange` handler."
- "I've added `react-helmet-async` as a dependency and configured Open Graph meta tags."

## Constraints

- Preserve the Vite + CSS Modules structure unless there is a clear reason to change it.
- Always run `npm install` after editing `package.json`.
- Always run `npm run build` to verify zero type errors before deploying.
- The `vercel.json` rewrite rule ensures SPA routing works — do not remove it.
- Keep the language simple when narrating steps; the user is not a developer.
