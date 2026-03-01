# Media Network Deployment Progress

## Status: ✅ ALL DEPLOYED

### Apps
| App | Linked | Env Vars | Deployed | Production URL |
|-----|--------|----------|----------|----------------|
| Admin | ✅ | ✅ | ✅ | https://media-network-admin.vercel.app |
| SauceWire | ✅ | ✅ | ✅ | https://saucewire.com |
| SauceCaviar | ✅ | ✅ | ✅ | https://saucecaviar.com |
| TrapGlow | ✅ | ✅ | ✅ | https://trapglow.com |
| TrapFrequency | ✅ | ✅ | ✅ | https://trapfrequency.com |

### Environment Variables Set (all projects)
- `NEXT_PUBLIC_SUPABASE_URL` → production, preview, development
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → production, preview, development
- `SUPABASE_SERVICE_ROLE_KEY` → production, preview, development
- `NEXT_PUBLIC_SITE_URL` → production (per-app URL)

### Post-Deploy
- ✅ Admin seed endpoint hit: Admin account already exists (userId: bfd7420b-6d11-4599-8169-d5d568c2287c)

### Deployment Log
- All builds succeeded on first attempt
- Used monorepo root deployment strategy (swapping .vercel/project.json per project)
- rootDirectory set to `apps/<appname>` for each project
- installCommand: `npm install --legacy-peer-deps`
- buildCommand: `npx next build`
- All projects use `transpilePackages` for `@media-network/shared` and `@media-network/ui`

### Notes
- Next.js 14.2.3 has a known security vulnerability — consider upgrading
- `@studio-freight/lenis` is deprecated, renamed to `lenis`
- Monorepo root `.vercel/project.json` restored to admin project as default
