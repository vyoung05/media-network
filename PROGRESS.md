# AdSense Infrastructure Progress

## Tasks
- [x] 1. Create shared AdBanner component (`packages/shared/src/components/AdBanner.tsx`)
- [x] 2. Add ad slots to SauceWire (header, in-feed, article sidebar, mid-content, footer)
- [x] 3. Add ad slots to SauceCaviar, TrapGlow, TrapFrequency (header, in-feed, sidebar, mid-content, footer)
- [x] 4. Add AdSense script to all 4 site layouts (via next/script + env var)
- [x] 5. Create Privacy Policy page for all 4 sites (`/privacy` route)
- [x] 6. Create Terms of Service page for all 4 sites (`/terms` route)
- [x] 7. Add Privacy/Terms links to all site footers
- [x] 8. Git commit and push

## Files Created/Modified

### New Files (15)
- `packages/shared/src/components/AdBanner.tsx` — Shared AdSense component
- `packages/shared/src/components/PrivacyPolicyContent.tsx` — Shared privacy policy content
- `packages/shared/src/components/TermsContent.tsx` — Shared terms of service content
- `apps/saucewire/src/components/AdBannerSlot.tsx` — Layout ad wrapper
- `apps/saucecaviar/src/components/AdBannerSlot.tsx` — Layout ad wrapper
- `apps/trapglow/src/components/AdBannerSlot.tsx` — Layout ad wrapper
- `apps/trapfrequency/src/components/AdBannerSlot.tsx` — Layout ad wrapper
- `apps/saucewire/src/app/privacy/` — Privacy policy page + client component
- `apps/saucewire/src/app/terms/` — Terms of service page + client component
- `apps/saucecaviar/src/app/privacy/` — Privacy policy page + client component
- `apps/saucecaviar/src/app/terms/` — Terms of service page + client component
- `apps/trapglow/src/app/privacy/` — Privacy policy page + client component
- `apps/trapglow/src/app/terms/` — Terms of service page + client component
- `apps/trapfrequency/src/app/privacy/` — Privacy policy page + client component
- `apps/trapfrequency/src/app/terms/` — Terms of service page + client component

### Modified Files (14)
- `packages/shared/src/components/index.ts` — Added exports for AdBanner, PrivacyPolicyContent, TermsContent
- `packages/ui/src/components/NewsFeed.tsx` — Added in-feed ads every 3rd article
- `apps/saucewire/src/app/layout.tsx` — Added AdSense script + header/footer ad slots
- `apps/saucewire/src/app/[slug]/ArticlePageClient.tsx` — Added sidebar + mid-content ads
- `apps/saucewire/src/components/Footer.tsx` — Added Privacy/Terms links
- `apps/saucecaviar/src/app/layout.tsx` — Added AdSense script + header/footer ad slots
- `apps/saucecaviar/src/app/issues/IssuesPageClient.tsx` — Added in-feed ads in issues grid
- `apps/trapglow/src/app/layout.tsx` — Added AdSense script + header/footer ad slots
- `apps/trapglow/src/app/blog/[slug]/BlogPostClient.tsx` — Added sidebar + mid-content ads
- `apps/trapglow/src/components/Footer.tsx` — Added Privacy/Terms links
- `apps/trapfrequency/src/app/layout.tsx` — Added AdSense script + header/footer ad slots
- `apps/trapfrequency/src/app/tutorials/[slug]/TutorialDetailClient.tsx` — Added sidebar + mid-content ads
- `apps/trapfrequency/src/components/Footer.tsx` — Added Privacy/Terms links

## Configuration
Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` env var (e.g., `ca-pub-XXXXXXX`) after AdSense approval.
Without it, all ad slots render nothing — zero visual impact.

## Status: ✅ COMPLETE
