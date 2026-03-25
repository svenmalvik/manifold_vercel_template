# Manifold Vercel Template

This repository is a Vercel-deployable React SPA starter used in Manifold's simple view.

## Tech stack

- **React 19** with TypeScript
- **Vite 6** as the build tool
- **CSS Modules** for styling (no Tailwind, no styled-components)
- **Vercel** for deployment (zero-config — Vite is auto-detected)

Do NOT add Dexie, IndexedDB, or server-side frameworks unless the user explicitly requests it.

## Development

```bash
npm install       # install dependencies (run first)
npm run dev       # start Vite dev server at http://localhost:5173
```

The dev server hot-reloads on file changes. Always run `npm install` before `npm run dev` in a fresh clone.

## Build & type-check

```bash
npm run build     # tsc -b && vite build → outputs dist/
npm run preview   # serve the production build locally
```

Zero TypeScript errors are required before deploying. Fix all type errors before running `vercel deploy`.

## Deploying to Vercel

```bash
vercel deploy             # deploy a preview URL
vercel deploy --prod      # promote to production
```

Vercel auto-detects Vite. The `vercel.json` rewrite rule ensures SPA routing works (no 404s on deep links).

## Environment variables

```bash
vercel env add KEY                  # add a secret
vercel env pull .env.local          # pull all vars to a local file
```

Never commit `.env.local` — it is in `.gitignore`.

## Agent guidance

When extending this starter:
- Preserve the Vite + CSS Modules structure unless there is a clear reason to change it
- Run `npm install` after editing `package.json`
- Run `npm run build` to verify there are no type errors before deploying
- Narrate each step briefly so the user can follow along
- After scaffolding is complete, run `npm run dev` so the user can preview immediately
