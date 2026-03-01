# PROGRESS: Seed Mock Data + Wire Brand Sites to Supabase

## Part 1: Seed API Route
- [x] Create `apps/admin/src/app/api/seed-content/route.ts`
- [x] Hard-code all mock data from TrapFrequency + TrapGlow (10 producers, 12 tutorials, 10 beats, 8 gear reviews, 5 sample packs, 10 artists)
- [x] Upsert into Supabase tables with service_role key
- [x] Fallback Unsplash URLs for any null images

## Part 2: Wire TrapFrequency to Supabase
- [x] Add query functions to `apps/trapfrequency/src/lib/supabase.ts` (with snake→camelCase mappers)
- [x] Update `page.tsx` (home) — `force-dynamic`, async, fetches from Supabase
- [x] Update `tutorials/page.tsx`
- [x] Update `tutorials/[slug]/page.tsx` — removed `generateStaticParams`
- [x] Update `beats/page.tsx`
- [x] Update `beats/[slug]/page.tsx` — removed `generateStaticParams`
- [x] Update `gear/page.tsx`
- [x] Update `gear/[slug]/page.tsx` — removed `generateStaticParams`
- [x] Update `producers/[slug]/page.tsx` — removed `generateStaticParams`
- [x] Types & constants kept in mock-data.ts (data arrays still exported but unused by pages)

## Part 3: Wire TrapGlow to Supabase
- [x] Add query functions to `apps/trapglow/src/lib/supabase.ts` (getArtists, getFeaturedArtists, etc.)
- [x] Update `page.tsx` (home) — artists from Supabase, blog posts still from mock
- [x] Update `discover/page.tsx`
- [x] Update `artist/[slug]/page.tsx` — removed `generateStaticParams`

## Part 4: Build + Deploy
- [x] Build admin ✓ (34 pages)
- [x] Build trapfrequency ✓ (all pages dynamic)
- [x] Build trapglow ✓ (all pages dynamic)
- [x] Git committed + pushed (commit 9037051)

## Bonus
- [x] Created `apps/admin/src/components/forms/ArtistForm.tsx` (was missing, blocked admin build)

## Status: ✅ COMPLETE
