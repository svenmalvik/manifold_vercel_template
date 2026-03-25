Deploy the app to Vercel and share the preview URL with the user.

Steps:
1. Run `npm run build` first to ensure there are no type errors.
2. Run `vercel deploy` to create a preview deployment.
3. Extract the preview URL from the output (the line starting with "https://").
4. Share the URL with the user so they can view the live app.

Notes:
- `vercel deploy` requires the Vercel CLI (`npm i -g vercel`) and an active login (`vercel login`).
- To deploy to production instead of a preview, run `vercel deploy --prod`.
- To add or update environment variables before deploying, run `vercel env add KEY` or `vercel env pull .env.local`.
