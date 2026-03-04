# Media Enrichment - Progress

## Feature: Automatic Image Sourcing, AI Image Generation & Video Discovery

### Status: ✅ Complete

### Files Changed/Created:
- ✅ `apps/admin/src/lib/media-search.ts` — Core media search library (new)
- ✅ `apps/admin/src/app/api/media-search/route.ts` — Standalone API endpoint (new)
- ✅ `apps/admin/src/app/api/generate-article/route.ts` — Integrated media enrichment
- ✅ `apps/admin/src/app/dashboard/DashboardHome.tsx` — Enhanced toast with media counts
- ✅ `apps/admin/src/app/dashboard/content/[id]/edit/page.tsx` — Media Options Panel

### What It Does:

**Media Search Library (`media-search.ts`)**
- Scrapes source article for og:image and content images (>200px, filtered for non-icons)
- Extracts YouTube/Vimeo embeds from source article HTML
- Searches Unsplash API (with API key) or falls back to source URL (without)
- Generates AI images via fal.ai FLUX Schnell (if FAL_KEY available)
- Searches YouTube Data API (if YOUTUBE_API_KEY available) or provides search URL fallback
- All sources run in parallel via Promise.allSettled for speed
- Graceful degradation: every API key is optional

**Generate Article Integration**
- After AI generates article text, media search runs automatically
- Results stored in article `metadata.media_options` column
- Best cover image picked automatically: og:image > AI generated > article image > stock > fallback
- Response includes `media.imagesFound` and `media.videosFound` counts

**Dashboard Toast Enhancement**
- After article generation, toast shows: "Generated: 'Title' for Brand with X images and Y videos found"

**Article Edit Page - Media Options Panel**
- Collapsible panel below cover image picker
- Shows media counts badge
- **Source Images**: Grid with "Use as Cover" hover button, labeled Featured/Article
- **Stock Images**: Grid with credit attribution, "Use as Cover" button
- **AI Generated**: Larger grid showing prompt on hover, "Use as Cover" button  
- **Videos**: List with thumbnails, "Open" link, "Embed" button (inserts iframe in body), "Cover" button (uses thumbnail)

### API Keys (all optional):
| Key | Source | Effect if Missing |
|-----|--------|-------------------|
| `UNSPLASH_ACCESS_KEY` | Unsplash | Falls back to source.unsplash.com URL |
| `FAL_KEY` | fal.ai | AI images skipped silently |
| `YOUTUBE_API_KEY` | YouTube Data API | Returns search URL instead of results |

### Build: ✅ Passes `next build` cleanly
### TypeScript: ✅ Passes `tsc --noEmit` cleanly
