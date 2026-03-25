Type-check and build the app for production.

Steps:
1. Run `npm run build` (this runs `tsc -b && vite build`).
2. If TypeScript reports errors, fix them before proceeding.
3. Confirm the build succeeded and the `dist/` directory was created.
4. Report the output size summary printed by Vite.

A clean build with zero TypeScript errors is required before deploying to Vercel.
