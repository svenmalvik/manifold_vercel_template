# Manifold Vercel Template

A GitHub template repository for creating Vercel-deployed web apps through [Manifold](https://github.com/svenmalvik/manifold). Non-developers select this template in Manifold's simple view, describe what they want, and the agent builds and deploys it automatically.

## What's included

- React 19 + TypeScript
- Vite 6 (dev server + build)
- CSS Modules for styling
- Vercel deployment with SPA routing pre-configured
- Agent guidance in `CLAUDE.md` so Manifold knows how to build, preview, and deploy

## How it works

1. A user picks this template in Manifold's simple view.
2. Manifold clones the repo and opens a chat.
3. The user describes the app they want in plain language.
4. The agent builds it, starts a live preview, and can deploy to Vercel when ready.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
```
