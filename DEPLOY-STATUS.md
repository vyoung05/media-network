# Media Network — Deployment Status

**Deployed:** 2025-02-27  
**Monorepo:** `C:\Users\Owner\clawd\projects\media-network`  
**Vercel Account:** vincents-projects-c196e8d5

---

## ✅ App 1: SauceWire

| Field | Value |
|-------|-------|
| **Production URL** | https://saucewire.vercel.app |
| **Deploy URL** | https://saucewire-39db9bxri-vincents-projects-c196e8d5.vercel.app |
| **Inspect** | https://vercel.com/vincents-projects-c196e8d5/saucewire/9PxSJUgWSPyeTN6fFvaappUPkKEK |
| **Status** | ✅ Success |
| **Pages** | 25 static pages (home, articles, categories, archive, submit, write) |
| **Build Time** | ~41s |

---

## ✅ App 2: TrapGlow

| Field | Value |
|-------|-------|
| **Production URL** | https://trapglow.vercel.app |
| **Deploy URL** | https://trapglow-mmr979v7m-vincents-projects-c196e8d5.vercel.app |
| **Inspect** | https://vercel.com/vincents-projects-c196e8d5/trapglow/Cc2WefsvSMppHT7WE24FFThfZgZg |
| **Status** | ✅ Success |
| **Pages** | 31 static pages (home, artists, blog, discover, submit, write) |
| **Build Time** | ~44s |

---

## ✅ App 3: TrapFrequency

| Field | Value |
|-------|-------|
| **Production URL** | https://trapfrequency.vercel.app |
| **Deploy URL** | https://trapfrequency-exup0rbuw-vincents-projects-c196e8d5.vercel.app |
| **Inspect** | https://vercel.com/vincents-projects-c196e8d5/trapfrequency/6tYQmEgLZ5QdcpukHrftMWtnVGuA |
| **Status** | ✅ Success |
| **Pages** | 49 static pages (home, beats, producers, gear, tutorials, submit) |
| **Build Time** | ~41s |

---

## Deployment Notes

### Workspace Strategy
- Apps depend on `@media-network/shared` and `@media-network/ui` workspace packages
- **Cannot deploy from individual app directories** — npm install fails because workspace packages aren't on npm registry
- **Solution:** Deploy from monorepo root with:
  - `installCommand: "npm install"` (resolves workspaces at root)
  - `buildCommand: "npm run build --workspace=apps/<app>"` (scopes build to specific app)
  - `outputDirectory: "apps/<app>/.next"` (points to correct build output)

### How to Redeploy
For each app, from the monorepo root:
1. Create `vercel.json` with app-specific build/output config
2. `vercel link --yes --project <project-name>`
3. `vercel --yes --prod`
4. Clean up: remove `vercel.json` and `.vercel/`

### GitHub Connected
- All 3 projects connected to: https://github.com/vyoung05/media-network
- Push-to-deploy should work for future commits

### Warnings (non-blocking)
- `@studio-freight/lenis` deprecated → rename to `lenis` in future
- `next@14.2.3` has security vulnerability → upgrade to patched version
- 3 npm audit vulnerabilities (2 low, 1 critical) — audit recommended
