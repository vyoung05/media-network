# Homepage Fix Progress

## Assessment
- ✅ **TrapGlow**: Already fully wired — `fetchTrendingArticles(8)` in page.tsx, HomePageClient accepts & displays `trendingArticles: Article[]` with gradient fallbacks
- ✅ **TrapFrequency**: Already fully wired — `fetchTrendingArticles(6)` in page.tsx, HomePageClient accepts & displays `trendingArticles: Article[]` with green gradient fallbacks and SafeImage
- ⏳ **SauceCaviar**: page.tsx fetches `trendingArticles` BUT HomePageClient IGNORES them (props interface missing, no trending section). Mock data already says "The Culture Issue" (not food-focused).

## Fixes Required
1. SauceCaviar `HomePageClient.tsx`:
   - Add `trendingArticles` to props interface
   - Add "Trending Stories" section ABOVE magazine issues
   - Gold (#C9A84C) gradient fallback cards
   
2. All three: Build & deploy

## Status
- [ ] Fix SauceCaviar HomePageClient
- [ ] Build trapglow
- [ ] Build trapfrequency
- [ ] Build saucecaviar
- [ ] Deploy all three
