# Media Network — Supabase Backend Integration Progress

## Status: ✅ Complete — All builds pass

### Phase 1: Admin Auth ✅
- [x] Auth provider wrapper in admin layout (`AuthProvider.tsx`)
- [x] LoginPage.tsx — real Supabase `signInWithPassword` + `signInWithOAuth` (Google)
- [x] Auth guard on dashboard routes (dashboard layout redirects to login if no session)
- [x] Seed API route for Vincent's admin account (`POST /api/seed`)

### Phase 2: Admin Dashboard — Replace Mock Data ✅
- [x] DashboardHome.tsx — real stats from Supabase (articles, submissions, writers, page views per brand)
- [x] ContentQueuePage.tsx — real `getArticles(status: 'pending_review')` + approve/reject via `updateArticleStatus`
- [x] SubmissionsPage.tsx — real `getSubmissions` + `reviewSubmission` with reviewer_id
- [x] WritersPage.tsx — real `getUsers(role: 'writer')` + editors
- [x] SettingsPage.tsx — kept as-is (UI-only settings, works fine)

### Phase 3: Article Creation & Publishing ✅
- [x] Article editor page (`/dashboard/content/new`) — title, body, excerpt, brand, category, tags, cover image, status selector
- [x] Article edit page (`/dashboard/content/[id]/edit`) — load article by ID, edit all fields, publish button
- [x] Slug auto-generation from title via `slugify()`
- [x] Reading time auto-calculation via `estimateReadingTime()`
- [x] Status flow: draft → pending_review → published (with published_at timestamp)

### Phase 4: Brand Sites — Replace Mock Data ✅
- [x] SauceWire — `lib/supabase.ts` + home, article, category, archive pages all use real Supabase queries
- [x] TrapGlow — `lib/supabase.ts` + blog pages use real queries (artists stay as mock - no artist table in Supabase)
- [x] SauceCaviar — `lib/supabase.ts` + feed.xml uses real articles (issues stay as mock - no issues table in Supabase)
- [x] TrapFrequency — `lib/supabase.ts` + feed.xml uses real articles (tutorials/beats/gear stay as mock)

### Phase 5: Admin API Routes ✅
- [x] `POST /api/articles` — create article using service_role client
- [x] `PATCH /api/articles/[id]` — update article
- [x] `DELETE /api/articles/[id]` — delete article
- [x] `POST /api/articles/[id]/publish` — publish (sets status + published_at)
- [x] `POST /api/seed` — creates Vincent's admin account (vyoung86@gmail.com)

### Phase 6: Feed/OG Automation ✅
- [x] SauceWire RSS feed reads from Supabase (with 30min cache)
- [x] TrapGlow RSS feed reads from Supabase
- [x] SauceCaviar RSS feed reads from Supabase + mock issues
- [x] TrapFrequency RSS feed reads from Supabase
- [x] OG routes remain functional (they use query params, not mock data)

### Phase 7: Build Verification ✅
- [x] `npm run build` passes for ALL 7 workspaces (shared, ui, admin, saucecaviar, saucewire, trapfrequency, trapglow)

### Bug Fixes (Pre-existing)
- [x] Fixed TextReveal component usage in SauceCaviar (AboutPageClient, SubscribePageClient) — was passing JSX children to a `children: string` prop
- [x] Added Suspense boundary around SauceWire archive page (useSearchParams requires it)

## Architecture Notes

### What's Using Real Supabase
- All admin dashboard pages (stats, content queue, submissions, writers)
- Admin article CRUD (create, read, update, delete, publish)
- Admin auth (login, session management, auth guard)
- SauceWire: home, article, category, archive pages
- TrapGlow: blog listing, blog post pages
- All 4 brand sites: RSS feeds

### What Still Uses Mock Data (by design — no Supabase tables for these)
- TrapGlow: artist pages, discover page, daily picks, leaderboard
- SauceCaviar: magazine issues, issue reader, pages
- TrapFrequency: tutorials, beats, gear reviews, producers, sample packs
- Admin: settings page (UI-only, doesn't persist to DB)

### Key Files Created/Modified
```
apps/admin/src/components/AuthProvider.tsx    — NEW: Supabase auth context
apps/admin/src/lib/supabase.ts               — NEW: client re-exports
apps/admin/src/app/layout.tsx                 — MODIFIED: wraps with AuthProvider
apps/admin/src/app/LoginPage.tsx              — MODIFIED: real Supabase auth
apps/admin/src/app/dashboard/layout.tsx       — MODIFIED: auth guard
apps/admin/src/app/dashboard/DashboardHome.tsx — MODIFIED: real data
apps/admin/src/app/dashboard/content/ContentQueuePage.tsx — MODIFIED: real data
apps/admin/src/app/dashboard/content/new/page.tsx — NEW: article editor
apps/admin/src/app/dashboard/content/[id]/edit/page.tsx — NEW: article editor
apps/admin/src/app/dashboard/submissions/SubmissionsPage.tsx — MODIFIED: real data
apps/admin/src/app/dashboard/writers/WritersPage.tsx — MODIFIED: real data
apps/admin/src/app/api/articles/route.ts     — NEW: create articles API
apps/admin/src/app/api/articles/[id]/route.ts — NEW: update/delete articles API
apps/admin/src/app/api/articles/[id]/publish/route.ts — NEW: publish API
apps/admin/src/app/api/seed/route.ts         — NEW: seed admin account
apps/saucewire/src/lib/supabase.ts           — NEW: Supabase queries
apps/saucewire/src/app/page.tsx              — MODIFIED: async, uses Supabase
apps/saucewire/src/app/[slug]/page.tsx       — MODIFIED: uses Supabase
apps/saucewire/src/app/category/[slug]/page.tsx — MODIFIED: uses Supabase
apps/saucewire/src/app/archive/page.tsx      — MODIFIED: uses Supabase + Suspense
apps/saucewire/src/app/feed.xml/route.ts     — MODIFIED: uses Supabase
apps/trapglow/src/lib/supabase.ts            — NEW: Supabase queries
apps/trapglow/src/app/blog/page.tsx          — MODIFIED: uses Supabase
apps/trapglow/src/app/blog/[slug]/page.tsx   — MODIFIED: uses Supabase
apps/trapglow/src/app/feed.xml/route.ts      — MODIFIED: uses Supabase
apps/saucecaviar/src/lib/supabase.ts         — NEW: Supabase queries
apps/saucecaviar/src/app/feed.xml/route.ts   — MODIFIED: uses Supabase
apps/trapfrequency/src/lib/supabase.ts       — NEW: Supabase queries
apps/trapfrequency/src/app/feed.xml/route.ts — MODIFIED: uses Supabase
```
