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

## Constraints

- Preserve the Vite + CSS Modules structure unless there is a clear reason to change it.
- Always run `npm install` after editing `package.json`.
- Always run `npm run build` to verify zero type errors before deploying.
- The `vercel.json` rewrite rule ensures SPA routing works — do not remove it.
- Keep the language simple when narrating steps; the user is not a developer.
