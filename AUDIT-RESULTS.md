# Media Network Admin — Full Site Audit Results
**Date:** 2025-07-16  
**Auditor:** Claude (Automated)  
**Scope:** All forms, API routes, dashboard pages, and seed data

---

## Database Schema (Actual Columns from Supabase)

| Table | Columns |
|-------|---------|
| **artists** | id, name, slug, real_name, avatar, cover_image, bio, genres, moods, region, city, social, spotify_embed, soundcloud_embed, apple_music_embed, monthly_listeners, followers, glow_score, glow_trend, is_featured, is_daily_pick, featured_track, featured_track_url, tags, gallery, status, created_at, updated_at |
| **beats** | id, title, slug, cover_image, audio_url, producer_id, bpm, key, genre, tags, duration, plays, likes, is_featured, status, published_at, created_at, updated_at |
| **producers** | id, name, slug, **avatar**, **cover_image**, bio, location, daws, genres, credits, links, beat_count, follower_count, **featured**, status, created_at, updated_at |
| **sample_packs** | id, title, slug, creator, price, is_free, sample_count, genres, description, **cover_image**, rating, **download_count**, status, published_at, created_at, updated_at |
| **gear_reviews** | id, title, slug, product, brand_name, category, price, rating, excerpt, body, **cover_image**, pros, cons, verdict, affiliate_url, producer_id, status, published_at, created_at, updated_at |
| **tutorials** | id, title, slug, excerpt, body, **cover_image**, daw, skill_level, category, duration, producer_id, tags, **view_count**, like_count, status, published_at, created_at, updated_at |
| **articles** | id, title, slug, body, excerpt, cover_image, brand, category, tags, author_id, status, is_breaking, is_ai_generated, source_url, reading_time_minutes, view_count, published_at, created_at, updated_at, metadata, scheduled_publish_at, cross_posted_from, cross_posted_to, seo_title, seo_description, focus_keyword, seo_score |
| **submissions** | id, user_id, brand, type, title, content, media_urls, contact_email, contact_name, status, reviewer_id, reviewer_notes, is_anonymous, submitted_at, reviewed_at |
| **rss_feeds** | id, brand, name, url, category, enabled, last_fetched_at, fetch_error, created_at, updated_at |
| **magazine_issues** | id, slug, title, issue_number, subtitle, description, cover_image, published_at, status, page_count, featured_color, season, created_at, updated_at, scheduled_publish_at |
| **magazine_pages** | id, issue_id, page_number, type, title, subtitle, content, pull_quote, author, author_title, image_url, image_alt, secondary_image_url, background_color, text_color, category, tags, video_url, music_embed, artist_name, artist_bio, artist_links, advertiser_name, advertiser_tagline, advertiser_cta, advertiser_url, toc_entries, created_at, updated_at |
| **ad_placements** | (empty) |
| **announcements** | (empty) |
| **newsletter_subscribers** | (empty) |
| **newsletter_campaigns** | (empty) |
| **newsletter_settings** | (empty) |
| **social_share_log** | (empty) |
| **notifications** | (empty) |

Tables that returned 404 (don't exist yet): tracks, brands, user_roles, content_queue, seo_scores, hot_or_not_tracks

---

## Bugs Found & Fixed

### 🔴 BeatForm.tsx — `cover_image_url` → `cover_image`
- **File:** `src/components/forms/BeatForm.tsx`
- **Bug:** Form used `cover_image_url` in both `initialData?.cover_image_url` and the submit payload
- **DB Column:** `cover_image`
- **Fix:** Changed to `cover_image` in both places
- **Impact:** Beat cover images were being lost on edit (form reads wrong field) and saved to wrong column (insert/update fails silently)

### 🔴 ProducerForm.tsx — THREE mismatches
- **File:** `src/components/forms/ProducerForm.tsx`
- **Bug 1:** `avatar_url` → DB has `avatar`
- **Bug 2:** `cover_image_url` → DB has `cover_image`  
- **Bug 3:** `is_featured` → DB has `featured`
- **Fix:** Changed initialData reads and submit payload for all three
- **Impact:** Producer avatars, cover images, and featured status were all broken

### 🔴 SamplePackForm.tsx — `cover_image_url` → `cover_image`
- **File:** `src/components/forms/SamplePackForm.tsx`
- **Bug:** Same pattern as BeatForm — wrong column name for cover image
- **Fix:** Changed both places
- **Impact:** Sample pack cover images broken

### 🔴 GearForm.tsx — `cover_image_url` → `cover_image`
- **File:** `src/components/forms/GearForm.tsx`
- **Bug:** Same pattern
- **Fix:** Changed both places
- **Impact:** Gear review cover images broken

### 🔴 TutorialForm.tsx — `cover_image_url` → `cover_image`
- **File:** `src/components/forms/TutorialForm.tsx`
- **Bug:** Same pattern
- **Fix:** Changed both places
- **Impact:** Tutorial cover images broken

### 🟡 ProducersPage.tsx — THREE display mismatches
- **File:** `src/app/dashboard/producers/ProducersPage.tsx`
- **Bug 1:** Interface defined `avatar_url` → should be `avatar`
- **Bug 2:** Template referenced `producer.avatar_url` → should be `producer.avatar`
- **Bug 3:** Template referenced `producer.is_featured` → should be `producer.featured`
- **Fix:** Updated interface and all template references
- **Impact:** Producer avatars not showing in list, featured badge not displaying

### 🟡 ArtistsPage.tsx — `avatar_url` → `avatar`
- **File:** `src/app/dashboard/artists/ArtistsPage.tsx`
- **Bug:** Template referenced `artist.avatar_url` → should be `artist.avatar`
- **Fix:** Updated template reference
- **Impact:** Artist avatars not showing in list view

### 🟡 SamplePacksPage.tsx — `downloads` → `download_count`
- **File:** `src/app/dashboard/sample-packs/SamplePacksPage.tsx`
- **Bug:** Template referenced `pack.downloads` → DB column is `download_count`
- **Fix:** Changed to `pack.download_count`
- **Impact:** Download count always showing 0

### 🟡 TutorialsPage.tsx — `views` → `view_count`
- **File:** `src/app/dashboard/tutorials/TutorialsPage.tsx`
- **Bug:** Template referenced `t.views` → DB column is `view_count`
- **Fix:** Changed to `t.view_count`
- **Impact:** View count always showing 0

### 🔴 Seed Data (seed-content/route.ts) — `genre`/`mood` → `genres`/`moods` for artists
- **File:** `src/app/api/seed-content/route.ts`
- **Bug:** All 10 artist seed entries used `genre: [...]` and `mood: [...]` (singular)
- **DB Columns:** `genres` and `moods` (plural)
- **Fix:** Replaced all occurrences in the artists section only (beats correctly use singular `genre`)
- **Impact:** Re-seeding would insert artist data with wrong column names, losing genre/mood data

---

## Verified Correct (No Issues Found)

### Forms
- ✅ **ArtistForm.tsx** — Already fixed (genres/moods plural). All other fields match DB schema.

### API Routes
- ✅ **artists/route.ts** — Correct: uses `genres` (contains filter), `is_featured`
- ✅ **artists/[id]/route.ts** — Pass-through (body from form)
- ✅ **beats/route.ts** — Correct: uses `genre` (singular, matches DB)
- ✅ **beats/[id]/route.ts** — Pass-through
- ✅ **producers/route.ts** — Pass-through (body from form)
- ✅ **producers/[id]/route.ts** — Pass-through
- ✅ **sample-packs/route.ts** — Pass-through
- ✅ **sample-packs/[id]/route.ts** — Pass-through
- ✅ **gear-reviews/route.ts** — Pass-through
- ✅ **gear-reviews/[id]/route.ts** — Pass-through
- ✅ **tutorials/route.ts** — Correct filter params
- ✅ **tutorials/[id]/route.ts** — Pass-through
- ✅ **articles/route.ts** — All columns match
- ✅ **articles/[id]/route.ts** — Uses shared lib functions
- ✅ **content/route.ts** — Correct
- ✅ **submissions/route.ts** — Correct
- ✅ **dashboard/route.ts** — Aggregation queries, no column issues

### Dashboard Pages
- ✅ **BeatsPage.tsx** — All column refs correct (`genre`, `is_featured`, `plays`)
- ✅ **ContentQueuePage.tsx** — Uses article fields correctly
- ✅ **SubmissionsPage.tsx** — All fields match schema
- ✅ **DashboardHome.tsx** — Aggregation, no direct column refs
- ✅ **GearPage.tsx** — All column refs correct
- ✅ **WritersPage.tsx** — Users table (separate schema)

### Seed Data
- ✅ **Producers seed data** — Correctly uses `featured` (not `is_featured`)
- ✅ **Beats seed data** — Correctly uses `genre` (singular), `cover_image`, `is_featured`

---

## Summary

| Category | Bugs Found | Bugs Fixed |
|----------|-----------|------------|
| Form field → DB column mismatches | 9 | 9 |
| Dashboard display → DB column mismatches | 4 | 4 |
| Seed data → DB column mismatches | 2 | 2 |
| **Total** | **15** | **15** |

### Root Cause
The forms were written with `_url` suffixed column names (e.g., `cover_image_url`, `avatar_url`) while the actual DB schema uses shorter names (`cover_image`, `avatar`). The producers table uses `featured` instead of `is_featured` unlike the other tables.

### Remaining Notes
- Tables `tracks`, `brands`, `user_roles`, `content_queue`, `seo_scores`, `hot_or_not_tracks` returned 404 — they don't exist in the DB yet. Code references to these tables will fail but they appear to be planned features.
- The `brand-fields.ts` config uses field keys that don't directly map to DB columns (they're for the dynamic form builder) — this is by design.
- API routes use pass-through pattern (body → Supabase) so fixing the forms automatically fixes the API data.
