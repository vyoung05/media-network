# AI Pipeline Enhancement — Progress Tracker

## Date: 2025-07-02

### ✅ Task 1: Expand RSS Sources (news-feed/route.ts)
- Expanded from 13 → 40 hardcoded RSS sources
- **SauceWire:** AP News, Reuters, CNN Entertainment, NBC News Entertainment, Yahoo Entertainment, Page Six, The Shade Room (via RSSHub), Bossip, MediaTakeOut + existing (TMZ, ESPN, Variety)
- **SauceCaviar:** GQ, Elle, Architectural Digest, Robb Report, Luxe Digital + existing (Vogue, Highsnobiety, Hypebeast)
- **TrapGlow:** Pitchfork, Stereogum, Genius (via RSSHub), XXL Magazine, NME, Clash Magazine, WORLDSTARHIPHOP (via RSSHub) + existing (HotNewHipHop, Billboard, Complex)
- **TrapFrequency:** Sweetwater, Reverb News, Ableton Blog (via RSSHub), Native Instruments Blog, Plugin Boutique + existing (MusicRadar, Sound On Sound, The Verge)
- Used RSSHub alternatives for sites without native RSS (Genius, WORLDSTARHIPHOP, The Shade Room, Yahoo Entertainment, Ableton)
- Increased return limit from 50 → 60 items

### ✅ Task 2: Breaking News Priority (news-feed/route.ts)
- Added `FeedPriority` type: `'breaking' | 'trending' | 'normal'`
- Added `priority` field to `FeedItem` interface
- `detectPriority()` function checks:
  - < 2 hours old + breaking keywords → `'breaking'`
  - < 6 hours old → `'trending'`
  - Everything else → `'normal'`
- Breaking keywords: "breaking", "just in", "exclusive", "developing", "urgent", "live update", "confirmed", "first look", "sources say", "reportedly"
- Sort order: breaking first → trending → normal, then by date within each priority group

### ✅ Task 3: Article Quality Scoring (generate-article/route.ts)
- Added `scoreArticleQuality()` function scoring 1-100:
  - **Word count (30 pts):** 400-800 = full score, under 300 or over 1000 = penalized
  - **Required fields (25 pts):** title, excerpt, body, tags must all be present
  - **Paragraph structure (25 pts):** 4+ paragraphs = full, 3 = 20, 2 = 12, 1 = 5
  - **AI artifact detection (20 pts):** Scans for "As an AI...", "[insert...]", "[placeholder]", etc.
- Quality score stored in AI_META comment embedded in article body
- Articles scoring below 40 include a `warning` and `qualityFlags` array in API response
- Quality breakdown returned in article response for transparency

### ✅ Task 4: Vercel Cron for Auto-Pilot (NEW: /api/cron/auto-generate/route.ts)
- Created new cron endpoint at `/api/cron/auto-generate`
- Checks `settings` table for key `ai_pipeline_autopilot` (boolean)
- If enabled: generates 3 articles per brand (all 4 brands)
- Logs results to `ai_pipeline_logs` table (timestamp, results_json, articles_created, errors)
- Supports `CRON_SECRET` env var for authorization
- Route marked as `force-dynamic` for Next.js compatibility
- Created `vercel.json` with cron schedule: `0 */6 * * *` (every 6 hours)

### ✅ Task 5: Smarter Deduplication (auto-generate/route.ts)
- **Source URL dedup:** Checks if `source_url` was already used by ANY brand → skip
- **Fuzzy title matching:** Extracts first 5 significant words (ignoring articles, prepositions, common verbs), if 3+ match → skip
- **Stop words list:** 50+ common English stop words filtered out for fuzzy matching
- Both same-brand title similarity AND cross-brand fuzzy matching are now active
- Newly generated articles immediately added to dedup sets for within-batch prevention

### ✅ Task 6: RSS Feed Health Dashboard (AIPipelinePage.tsx)
- Added `FeedHealthDashboard` collapsible component
- Shows each RSS source: name, URL, status (✅ active / ❌ failed / ⚠️ slow)
- Displays response time (ms), item count, last fetched time
- "Refresh All Feeds" button fetches `/api/news-feed` and extracts `feedHealth` data
- Individual "Test" button per feed using `/api/rss-feeds?test=` endpoint
- Failed/slow feeds sorted to top for visibility
- Summary badges: count of active, failed, slow feeds
- Health data stored in localStorage (`ai-pipeline-feed-health`) for persistence
- Feed health tracking added to `fetchFeed()` in news-feed/route.ts (response times, errors)
- `feedHealth` array included in news-feed API response

### ✅ Task 7: Social Preview Cards (AIPipelinePage.tsx)
- Added `ArticlePreviewCard` component with:
  - Cover image thumbnail (from Unsplash)
  - Title (2-line clamp), brand badge (colored), category tag
  - Quality score badge: green (>70), yellow (40-70), red (<40)
  - Source attribution ("via TMZ", "via Billboard") parsed from AI_META
  - Tags display (first 3 + overflow count)
  - Quick actions: ✅ Approve (publishes), ✏️ Edit (links to content), 🗑️ Delete (with confirm)
- Actions wired to Supabase: approve updates status to 'published', delete removes the article
- Preview cards shown in responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- Shows up to 9 most recent articles as preview cards
- Quality scoring parsed from AI_META embedded in article body

### Files Modified
- `src/app/api/news-feed/route.ts` — Tasks 1, 2, 6
- `src/app/api/generate-article/route.ts` — Task 3
- `src/app/api/auto-generate/route.ts` — Task 5
- `src/app/dashboard/ai-pipeline/AIPipelinePage.tsx` — Tasks 6, 7

### Files Created
- `src/app/api/cron/auto-generate/route.ts` — Task 4
- `vercel.json` — Task 4 (cron schedule)
- `PROGRESS.md` — This file

### Build Status
- ✅ `npx next build` compiles successfully
- All 18 routes build without errors
- TypeScript type checking passes
- New cron route renders as dynamic (ƒ)

### Supabase Tables Referenced (may need creation)
- `settings` — key/value table for `ai_pipeline_autopilot` toggle
- `ai_pipeline_logs` — cron execution logs (timestamp, results_json, articles_created, errors)
- `rss_feeds` — existing, used for custom feed management
- `articles` — existing, enhanced with quality_score in AI_META
