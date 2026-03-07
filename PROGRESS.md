# AdSense Infrastructure Progress — NATIVE ADS ONLY

## Design Direction
**NO banner ads anywhere.** Native ads only — content-blended, premium feel.
- No leaderboards, no sidebar rectangles, no header/footer banners
- No pop-ups, no sticky ads
- Ads look like regular content with subtle "Sponsored" badge

## Tasks
- [x] 1. Create native ad components (NativeInFeedAd, NativeInArticleAd, SponsoredSection)
- [x] 2. Add native in-feed ads to NewsFeed (every 5th article, same wire card styling)
- [x] 3. Add native in-article ads to all article/blog/tutorial detail pages (1 per page, content flow)
- [x] 4. Add SponsoredSection ("From Our Partners") to all 4 homepages
- [x] 5. Add AdSense script tag to all 4 layouts (via env var)
- [x] 6. Create Privacy Policy page for all 4 sites (/privacy)
- [x] 7. Create Terms of Service page for all 4 sites (/terms)
- [x] 8. Add Privacy/Terms links to all site footers
- [x] 9. Remove all banner/sidebar/leaderboard ads — NATIVE ONLY
- [x] 10. Git commit and push

## Ad Placement Summary

### In-Feed (NativeInFeedAd)
- **NewsFeed.tsx** — every 5th article, same border/padding as ArticleCard wire variant
- **SauceCaviar issues grid** — every 6th issue card
- Uses AdSense `data-ad-format="fluid"` with `data-ad-layout-key` for matched content

### In-Article (NativeInArticleAd)
- **SauceWire** — ArticlePageClient, between body and tags
- **TrapGlow** — BlogPostClient, between body and tags
- **TrapFrequency** — TutorialDetailClient, between content and tags
- Uses AdSense `data-ad-layout="in-article"` format
- Subtle divider lines with centered "Sponsored" badge

### Sponsored Section (SponsoredSection)
- **SauceWire homepage** — sidebar, 2 cards
- **SauceCaviar homepage** — before subscribe section, 3 cards
- **TrapGlow homepage** — before CTA section, 3 cards
- **TrapFrequency homepage** — before submit CTA, 3 cards
- Grid of native ad cards with "From Our Partners" heading

### What Was Removed
- Header leaderboard banners (all 4 sites)
- Footer banner ads (all 4 sites)
- Sidebar rectangle ads (SauceWire, TrapGlow)
- AdBannerSlot.tsx wrapper components (all 4 deleted)

## Files

### Shared Components
- `packages/shared/src/components/AdBanner.tsx` — NativeInFeedAd, NativeInArticleAd, SponsoredSection
- `packages/shared/src/components/PrivacyPolicyContent.tsx`
- `packages/shared/src/components/TermsContent.tsx`

### Per-Site Pages
- `apps/{site}/src/app/privacy/` — Privacy policy route (page.tsx + client component)
- `apps/{site}/src/app/terms/` — Terms of service route (page.tsx + client component)

## Configuration
Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` env var after AdSense approval.
Without it, ALL ad components render null — zero visual impact.

## Status: ✅ COMPLETE
