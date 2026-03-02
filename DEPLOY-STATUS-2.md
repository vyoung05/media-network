# Media Network — Deployment Status (Round 2)
**Date:** 2026-02-27

## ✅ App 1: SauceCaviar (Flagship Magazine)
- **Project:** `saucecaviar`
- **Production URL:** https://saucecaviar.vercel.app
- **Deployment URL:** https://saucecaviar-f6fazrhcw-vincents-projects-c196e8d5.vercel.app
- **Inspect:** https://vercel.com/vincents-projects-c196e8d5/saucecaviar/DcjQuKqrFT6bLWzVWPDGcaYAyexK
- **Status:** ✅ Deployed successfully
- **Build time:** ~40s
- **Framework:** Next.js 14.2.3
- **Routes:** 10 routes (/, about, advertise, issues, issues/[slug], submit, subscribe, feed.xml, api/og)
- **Project ID:** `prj_02BmukMYVslQRCoGLtaq0FkJkzdD`

### Configuration
- Root Directory: `apps/saucecaviar`
- Install Command: `cd ../.. && npm install` (monorepo root)
- Build Command: `npx next build`
- Source Files Outside Root: ✅ enabled
- Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL

---

## ✅ App 2: Admin Dashboard
- **Project:** `media-network-admin`
- **Production URL:** https://media-network-admin.vercel.app
- **Deployment URL:** https://media-network-admin-pj8szn6bf-vincents-projects-c196e8d5.vercel.app
- **Inspect:** https://vercel.com/vincents-projects-c196e8d5/media-network-admin/285TjkdXLBKcMt7mfsbXwrxzNL7p
- **Status:** ✅ Deployed successfully
- **Build time:** ~37s
- **Framework:** Next.js 14.2.3
- **Routes:** 7 routes (/, dashboard, dashboard/content, dashboard/settings, dashboard/submissions, dashboard/writers)
- **Project ID:** `prj_2xdK8TR0dI2nio0yHcPbnBN8c98C`

### Configuration
- Root Directory: `apps/admin`
- Install Command: `cd ../.. && npm install` (monorepo root)
- Build Command: `npx next build`
- Source Files Outside Root: ✅ enabled
- Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL

---

## Deployment Notes

### Monorepo Strategy
Both apps deployed from the **monorepo root** (`C:\Users\Owner\clawd\projects\media-network`) with:
- `rootDirectory` set to each app's path (e.g., `apps/saucecaviar`)
- `sourceFilesOutsideRootDirectory: true` to access `packages/shared` and `packages/ui`
- `installCommand: cd ../.. && npm install` to install all workspace deps from monorepo root
- Build runs from the app's rootDirectory using `npx next build`

### Fixes Applied
1. Added no-op `build` scripts to `packages/shared` and `packages/ui` (they export raw .ts/.tsx — transpiled by each app's `transpilePackages` config)
2. Created each Vercel project via API with proper monorepo settings
3. Set env variables for Supabase connectivity

### Redeployment Commands
To redeploy either app, switch the `.vercel/project.json` at the monorepo root:

```powershell
# SauceCaviar
cd C:\Users\Owner\clawd\projects\media-network
Remove-Item .vercel -Recurse -Force
New-Item -ItemType Directory -Force -Path .vercel
'{"projectId":"prj_02BmukMYVslQRCoGLtaq0FkJkzdD","orgId":"team_EjGLVhUj3JF7sk8RBnJWk8CD"}' | Set-Content .vercel\project.json
vercel deploy --prod --yes

# Admin Dashboard
cd C:\Users\Owner\clawd\projects\media-network
Remove-Item .vercel -Recurse -Force
New-Item -ItemType Directory -Force -Path .vercel
'{"projectId":"prj_2xdK8TR0dI2nio0yHcPbnBN8c98C","orgId":"team_EjGLVhUj3JF7sk8RBnJWk8CD"}' | Set-Content .vercel\project.json
vercel deploy --prod --yes
```
