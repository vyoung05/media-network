# Media Network — Full Content Wiring Plan

## Goal
Wire ALL content types through admin dashboard → Supabase → brand sites.
Vincent needs to be the editor of everything from one place.

## Phase 1: Database Schema (New Supabase Tables)

### Tables to create:
1. **producers** (TrapFrequency)
   - id, name, slug, avatar, cover_image, bio, location
   - daws TEXT[], genres TEXT[], credits TEXT[]
   - links JSONB (website, instagram, twitter, youtube, soundcloud, spotify, beatstars)
   - beat_count INT, follower_count INT, featured BOOLEAN
   - brand = 'trapfrequency' (implicit)
   - created_at, updated_at

2. **tutorials** (TrapFrequency)
   - id, title, slug, excerpt, body, cover_image
   - daw TEXT, skill_level TEXT, category TEXT, duration TEXT
   - producer_id UUID → producers
   - tags TEXT[], view_count INT, like_count INT
   - status (draft/published/archived)
   - brand = 'trapfrequency' (implicit)
   - published_at, created_at, updated_at

3. **beats** (TrapFrequency)
   - id, title, slug, cover_image, audio_url
   - producer_id UUID → producers
   - bpm INT, key TEXT, genre TEXT, tags TEXT[]
   - duration TEXT, plays INT, likes INT
   - is_featured BOOLEAN, status
   - published_at, created_at, updated_at

4. **gear_reviews** (TrapFrequency)
   - id, title, slug, product, brand_name, category
   - price TEXT, rating FLOAT, excerpt, body, cover_image
   - pros TEXT[], cons TEXT[], verdict TEXT
   - affiliate_url TEXT
   - producer_id UUID → producers (author)
   - status, published_at, created_at, updated_at

5. **sample_packs** (TrapFrequency)
   - id, title, slug, creator TEXT, price TEXT, is_free BOOLEAN
   - sample_count INT, genres TEXT[], description, cover_image
   - rating FLOAT, download_count INT
   - status, published_at, created_at, updated_at

6. **artists** (TrapGlow)
   - id, name, slug, real_name, avatar, cover_image, bio
   - genres TEXT[], moods TEXT[], region, city
   - social JSONB (spotify, soundcloud, apple_music, instagram, twitter, youtube, tiktok)
   - spotify_embed, soundcloud_embed, apple_music_embed
   - monthly_listeners INT, followers INT
   - glow_score INT, glow_trend TEXT
   - is_featured BOOLEAN, is_daily_pick BOOLEAN
   - featured_track TEXT, featured_track_url TEXT
   - tags TEXT[], gallery TEXT[]
   - status, created_at, updated_at

7. **magazine_issues** (SauceCaviar) — already have `issues` + `issue_pages` tables!
   - Need to extend with: subtitle, season, featured_color, page_count
   - issue_pages needs: type, title, subtitle, content, pull_quote, author, author_title
   - Plus: image_url, secondary_image_url, bg_color, text_color, category, tags
   - Plus: video_url, music_embed, artist fields, advertiser fields, toc_entries JSONB

## Phase 2: Seed Data
- Run SQL to insert all mock data into new tables (with Unsplash images)

## Phase 3: Admin Dashboard — New Sections
### Sidebar additions:
- 🎵 Producers (TrapFrequency)
- 📚 Tutorials (TrapFrequency)
- 🎧 Beats (TrapFrequency)
- 🔧 Gear Reviews (TrapFrequency)
- 📦 Sample Packs (TrapFrequency)
- 🎤 Artists (TrapGlow)
- 📖 Magazine Issues (SauceCaviar)

### Each section needs:
- List page with search/filter/status
- Create/Edit form
- Status management (draft → published)
- Image upload for covers/avatars

### API routes needed:
- /api/producers (CRUD)
- /api/tutorials (CRUD)
- /api/beats (CRUD)
- /api/gear-reviews (CRUD)
- /api/sample-packs (CRUD)
- /api/artists (CRUD)
- /api/magazine-issues (CRUD + pages)

## Phase 4: Brand Sites — Read from Supabase
- TrapFrequency: Replace mock-data imports with Supabase queries
- TrapGlow: Replace mock-data imports with Supabase queries
- SauceCaviar: Replace mock-data imports with Supabase queries

## Existing tables we can leverage:
- issues + issue_pages (SauceCaviar — need to extend)
- articles (already wired)
- users (already wired)
- media (already exists)
- submissions (already wired)

## Sub-Agent Split:
- **Agent A:** Create all Supabase tables + seed mock data
- **Agent B:** Build admin dashboard pages + API routes
- **Agent C:** Wire brand sites to read from Supabase
