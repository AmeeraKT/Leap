# Deploy Leap to Vercel (GitHub)

Repository: [rudra-code-creator/leap-UQIES-hackathon](https://github.com/rudra-code-creator/leap-UQIES-hackathon)

## Vercel project (linked)

- **Project:** [leap-uqies-hackathon](https://vercel.com/rudrakeshwani2-8208s-projects/leap-uqies-hackathon)
- **Production domain:** `leap-uqies-hackathon.vercel.app` (after first `--prod` deploy)
- **Preview example:** deployments from CLI or PR branches

## One-time setup (GitHub → Vercel)

> **Required:** Connect GitHub to your Vercel account first:  
> [Vercel → Account Settings → Login Connections → GitHub](https://vercel.com/account/settings/authentication)

1. Open [vercel.com/rudrakeshwani2-8208s-projects/leap-uqies-hackathon/settings/git](https://vercel.com/rudrakeshwani2-8208s-projects/leap-uqies-hackathon/settings/git) and connect `rudra-code-creator/leap-UQIES-hackathon`,  
   **or** run `npx vercel@latest git connect` after connecting GitHub.
2. Alternatively, import at [vercel.com/new](https://vercel.com/new) if starting fresh.
3. Confirm project settings (auto-detected from `vercel.json`):
   - **Framework:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm ci`
4. Set **Production Branch** to `master` (Project → Settings → Git).
5. Add environment variables (Settings → Environment Variables). See `.env.example`. At minimum for AI features:
   - `VITE_MISTRAL_AI_RESUME_ROASTER` (Production + Preview)
   - `VITE_OPENROUTER_API_KEY` (optional, Content Studio)
6. Click **Deploy**.

After this, every push to `master` deploys to production; other branches get preview URLs.

## If GitHub deploys fail with `ERESOLVE` on `npm install`

`master` must include **both** `.npmrc` (`legacy-peer-deps=true`) and an updated `package-lock.json` with `@vitejs/plugin-react-swc@^4.3.1` (Vite 8 peer). Without those files, Vercel’s `npm ci` step fails before the build runs. CLI uploads worked earlier because they included local fixes not yet on `master`.

## CLI (optional)

```bash
npx vercel@latest login
npx vercel@latest link
npx vercel@latest git connect
npx vercel@latest --prod
```

## Local production check

```bash
npm run build
npm run preview
```

Client routes (e.g. `/roadmap`) rely on the SPA rewrite in `vercel.json`.
