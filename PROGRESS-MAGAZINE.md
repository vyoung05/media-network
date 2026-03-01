# Magazine Issue Editor — Progress

## Status: ✅ Complete

### Files Created
- [x] `supabase/magazine-tables.sql` — SQL schema (issues + pages + RLS + triggers)
- [x] `apps/admin/src/app/api/magazine-issues/route.ts` — GET (list) + POST (create)
- [x] `apps/admin/src/app/api/magazine-issues/[id]/route.ts` — GET (single + pages) + PATCH + DELETE
- [x] `apps/admin/src/app/api/magazine-issues/[id]/pages/route.ts` — GET (list pages) + POST (add page, auto page_count)
- [x] `apps/admin/src/app/api/magazine-issues/[id]/pages/[pageId]/route.ts` — PATCH + DELETE (auto page_count)
- [x] `apps/admin/src/app/api/magazine-issues/[id]/publish/route.ts` — POST (set status + published_at)
- [x] `apps/admin/src/app/dashboard/magazine/page.tsx` — Issues list (cards, search, status badges, delete)
- [x] `apps/admin/src/app/dashboard/magazine/new/page.tsx` — Create issue form (auto-slug, color picker, preview)
- [x] `apps/admin/src/app/dashboard/magazine/[id]/edit/page.tsx` — Full issue editor + page management

### Files Modified
- [x] `apps/admin/src/components/Sidebar.tsx` — Added SauceCaviar section with Magazine Issues nav item
- [x] `apps/admin/src/config/brand-fields.ts` — Added magazine-issue content type

### Features
- Full CRUD for magazine issues and pages
- Dynamic page editor with type-specific fields (cover, toc, article, spread, video, ad, artist, full-bleed, back-cover)
- Page reordering with up/down arrows
- Publish workflow
- Mobile-responsive design (responsive grids, bottom-sheet modals, touch targets)
- SauceCaviar gold (#C9A84C) brand theming
- TOC entries repeating field editor
- Artist links multi-platform editor
- Color pickers for background/featured colors
- Image URL preview for pages
