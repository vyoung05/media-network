# Newsletter + SEO Build Progress

## Database Setup
- [x] Newsletter tables (subscribers, campaigns, settings)
- [x] SEO columns on articles table (seo_title, seo_description, focus_keyword, seo_score)

## Types (shared)
- [x] Newsletter types in shared package (NewsletterSubscriber, NewsletterCampaign, NewsletterSettings, etc.)
- [x] SEO types (SEOData, SEORule, SEOScoreResult)

## API Routes (admin)
- [x] /api/newsletter/subscribers (GET/POST/PATCH/DELETE)
- [x] /api/newsletter/campaigns (GET/POST)
- [x] /api/newsletter/campaigns/[id]/send (POST)
- [x] /api/newsletter/settings (GET/PUT)
- [x] /api/newsletter/subscribe (public, CORS-enabled)
- [x] /api/newsletter/unsubscribe (public, CORS-enabled)
- [x] /api/seo/scores (GET — calculates scores for all articles)
- [x] Updated articles publish endpoint for newsletter auto-trigger

## Admin Pages
- [x] /dashboard/newsletter (hub with stats, campaigns list, quick actions)
- [x] /dashboard/newsletter/subscribers (table with search, brand filter, export CSV, add/toggle)
- [x] /dashboard/newsletter/campaigns/new (create campaign with article selection, preview, send)
- [x] /dashboard/newsletter/settings (per-brand provider config, auto-send, digest frequency)
- [x] /dashboard/seo (dashboard with scores, distribution, article checklist)

## Components
- [x] SEOPanel component (reusable, with score circle, checklist, social previews)
- [x] Email templates (brand-styled HTML generator)
- [x] Newsletter signup component (shared, for brand sites)
- [x] JsonLd component (shared, Article/Organization/Breadcrumb schemas)

## Brand Sites
- [x] Sitemap.xml for all 4 brands (saucewire, saucecaviar, trapglow, trapfrequency)
- [x] Robots.txt for all 4 brands
- [x] JSON-LD structured data on all 4 brand homepages (Organization)
- [x] JSON-LD structured data on article pages (saucewire, trapglow)
- [x] Newsletter signup in all 4 brand site footers

## Final
- [ ] Git commit & push
