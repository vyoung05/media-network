# PROGRESS: Seed Mock Data + Wire Brand Sites to Supabase

## Part 1: Seed API Route
- [x] Create `apps/admin/src/app/api/seed-content/route.ts`
- [x] Hard-code all mock data from TrapFrequency + TrapGlow
- [x] Upsert into Supabase tables with service_role key

## Part 2: Wire TrapFrequency to Supabase
- [x] Add query functions to `apps/trapfrequency/src/lib/supabase.ts` (with snake→camelCase mappers)
- [x] Update `page.tsx` (home)
- [x] Update `tutorials/page.tsx`
- [x] Update `tutorials/[slug]/page.tsx`
- [x] Update `beats/page.tsx`
- [x] Update `beats/[slug]/page.tsx`
- [x] Update `gear/page.tsx`
- [x] Update `gear/[slug]/page.tsx`
- [x] Update `producers/[slug]/page.tsx`
- [x] Types & constants kept in mock-data.ts (data arrays still there but unused)

## Part 3: Wire TrapGlow to Supabase
- [x] Add query functions to `apps/trapglow/src/lib/supabase.ts`
- [x] Update `page.tsx` (home) — artists from Supabase, blog posts still mock
- [x] Update `discover/page.tsx`
- [x] Update `artist/[slug]/page.tsx`

## Part 4: Build + Deploy
- [ ] Build admin
- [ ] Build trapfrequency
- [ ] Build trapglow
- [ ] Git commit + push

## Status: Building...
