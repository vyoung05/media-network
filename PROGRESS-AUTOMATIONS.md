# Media Network — Automation Features Progress

## Feature 1: OG Image Auto-Generation
- [x] SauceWire OG route — enhanced with `image` background param + overlay
- [x] SauceCaviar OG route — enhanced with `category`, `author`, `image` params
- [x] TrapGlow OG route — enhanced with `image` background param + `category`/`author`
- [x] TrapFrequency OG route — enhanced with `image` background param
- [x] SauceWire `[slug]/page.tsx` — OG image now uses `/api/og?title=...&category=...&author=...&image=...`
- [x] TrapGlow `blog/[slug]/page.tsx` — OG image now uses `/api/og?title=...&category=...&author=...&image=...`
- [x] TrapFrequency `tutorials/[slug]/page.tsx` — OG image uses `/api/og?title=...&category=Tutorials&author=...`
- [x] TrapFrequency `beats/[slug]/page.tsx` — OG image uses `/api/og?title=...&type=beat&category=...`
- [x] SauceCaviar `issues/[slug]/page.tsx` — OG image uses `/api/og?title=...&issue=...&image=...`
- [x] Publish endpoint — stores `metadata.og_image_url` after publishing
- [x] @vercel/og already installed in all brand apps

## Feature 2: RSS Feed Auto-Generation
- [x] SauceWire feed.xml — 50 articles, audio enclosures via `fetchAudioUrl`
- [x] SauceCaviar feed.xml — 50 articles, audio enclosures, title updated to "Luxury Culture Magazine"
- [x] TrapGlow feed.xml — 50 articles, audio enclosures, title updated to "Artist Discovery"
- [x] TrapFrequency feed.xml — 50 articles, audio enclosures, title updated to "Music Production"
- [x] RSS links in all layouts — already present via `alternates.types`
- [x] Added `fetchAudioUrl` to saucecaviar, trapglow, trapfrequency supabase libs

## Feature 3: Scheduled Publishing
- [x] SQL migration file (`supabase/add-scheduled-publish.sql`)
- [x] Admin UI — schedule toggle + datetime picker on new article page
- [x] Cron API route (`/api/cron/publish-scheduled`) — queries scheduled articles, publishes, triggers TTS
- [x] Vercel cron config (`apps/admin/vercel.json`) — every 5 minutes
- [x] Articles POST route — accepts `scheduled_publish_at` field
- [x] Content queue — shows scheduled articles with 🕐 clock icon and date

## Files Modified
- `apps/saucewire/src/app/api/og/route.tsx` — added image background support
- `apps/saucecaviar/src/app/api/og/route.tsx` — added category/author/image params
- `apps/trapglow/src/app/api/og/route.tsx` — added image/category/author params
- `apps/trapfrequency/src/app/api/og/route.tsx` — added image background support
- `apps/saucewire/src/app/[slug]/page.tsx` — OG metadata uses dynamic OG route
- `apps/trapglow/src/app/blog/[slug]/page.tsx` — OG metadata uses dynamic OG route
- `apps/trapfrequency/src/app/tutorials/[slug]/page.tsx` — OG metadata uses dynamic OG route
- `apps/trapfrequency/src/app/beats/[slug]/page.tsx` — OG metadata uses dynamic OG route
- `apps/saucecaviar/src/app/issues/[slug]/page.tsx` — OG metadata uses dynamic OG route
- `apps/admin/src/app/api/articles/[id]/publish/route.ts` — stores OG image URL in metadata
- `apps/saucewire/src/app/feed.xml/route.ts` — 50 articles, audio enclosures
- `apps/saucecaviar/src/app/feed.xml/route.ts` — 50 articles, audio enclosures
- `apps/trapglow/src/app/feed.xml/route.ts` — 50 articles, audio enclosures
- `apps/trapfrequency/src/app/feed.xml/route.ts` — 50 articles, audio enclosures
- `apps/saucecaviar/src/lib/supabase.ts` — added fetchAudioUrl
- `apps/trapglow/src/lib/supabase.ts` — added fetchAudioUrl
- `apps/trapfrequency/src/lib/supabase.ts` — added fetchAudioUrl

## Files Created
- `supabase/add-scheduled-publish.sql` — migration for scheduled_publish_at column
- `apps/admin/src/app/api/cron/publish-scheduled/route.ts` — cron handler
- `apps/admin/vercel.json` — Vercel cron configuration
- `apps/admin/src/app/dashboard/content/new/page.tsx` — added schedule UI
- `apps/admin/src/app/dashboard/content/ContentQueuePage.tsx` — added scheduled indicator
- `apps/admin/src/app/api/articles/route.ts` — accepts scheduled_publish_at

---
*All features complete ✅*
