# 🏗️ MEDIA NETWORK — Master Build Plan
> 4 Brands. 1 Database. 1 Empire.

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              SHARED SUPABASE DB                  │
│  users │ articles │ submissions │ media │ issues │
└──────────┬──────────┬──────────┬──────────┬──────┘
           │          │          │          │
    ┌──────┴──┐ ┌─────┴───┐ ┌───┴─────┐ ┌─┴────────┐
    │ Sauce   │ │  Trap   │ │  Sauce  │ │   Trap   │
    │ Caviar  │ │  Glow   │ │  Wire   │ │Frequency │
    └─────────┘ └─────────┘ └─────────┘ └──────────┘
     Magazine    Discovery    News Wire   Production
```

## 🎨 BRAND IDENTITY — Each Site Gets Its Own Logo & Icon

Every site needs a **unique, professional logo** that:
- Works as a favicon (16×16, 32×32)
- Works as an app icon (192×192, 512×512)
- Works as an OG/social image logo
- Has full wordmark + icon-only versions
- Looks sharp on dark AND light backgrounds

### SEO & Meta — AIRTIGHT
Every page on every site MUST have:
- `<title>` — unique, keyword-rich
- `<meta description>` — compelling, brand-voiced
- `og:title`, `og:description`, `og:image` — custom per page
- `og:type`, `og:url`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `apple-touch-icon`, `favicon.ico`, `site.webmanifest`
- Structured data (JSON-LD) — Article, Organization, BreadcrumbList
- Canonical URLs
- RSS feeds per site + per category
- Sitemap.xml (auto-generated)
- robots.txt

When ANYONE shares a link via text, iMessage, WhatsApp, Discord, Twitter, or anywhere:
→ Rich preview with custom branded image, title, and description. NO generic/missing previews.

---

**Stack:**
- Frontend: Next.js 14+ (App Router) on Vercel
- Database: Supabase (PostgreSQL + Auth + Storage) — **under Vinci Films Network project**
- CMS: Custom admin dashboard (shared)
- AI Pipeline: News APIs + Claude/GPT for content generation
- Deployment: Vercel (4 projects, 1 monorepo or shared packages)
- Payments: Stripe (for print copies, premium submissions, etc.)

---

## 🥂 SAUCECAVIAR.COM — The Digital Magazine

### Brand Identity
- **Tagline:** "Culture Served Premium"
- **Vibe:** Luxury, editorial, exclusive. Think Vogue meets Complex meets high-end street culture.
- **Audience:** Culture enthusiasts, fashion-forward creatives, music lovers who appreciate curation over noise

### Color Scheme
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Champagne Gold | `#C9A84C` | Headings, accents, logo |
| Secondary | Deep Black | `#0A0A0A` | Backgrounds, text |
| Accent | Ivory Cream | `#F5F0E8` | Cards, page backgrounds |
| Highlight | Burgundy | `#722F37` | CTAs, links, hover states |
| Text | Warm White | `#FAFAF7` | Body text on dark |
| Subtle | Charcoal | `#2D2D2D` | Borders, secondary text |

### Typography
- **Headlines:** Playfair Display (elegant serif)
- **Body:** Inter or DM Sans (clean sans-serif)
- **Accent:** Cormorant Garamond (editorial quotes)

### Key Features
1. **Interactive Digital Magazine** — Page-flip experience (Turn.js/StPageFlip)
   - Each "Issue" is a full magazine with cover, table of contents, articles
   - Swipe/tap to turn pages on mobile
   - Embedded video players within pages
   - Audio integration (background music per spread)
   - Full-screen immersive reading mode
2. **Magazine Archive** — Browse all past issues
3. **Print-on-Demand** — Stripe checkout for physical copies
4. **Featured Artists** — Curated spotlight sections
5. **Writer Contributions** — Submit editorial pitches
6. **Artist Submissions** — Submit to be featured in upcoming issues

### Magazine Issues
- Each issue has its own **unique name/theme** (e.g. "The Glow Up Issue", "Summer Sauce Vol. 3")
- Custom cover art per issue
- Table of contents with animated navigation
- Issues archived and browsable
- Collectors vibe — each issue feels like a limited edition drop

### Advertising
- **In-magazine ad placements** — brands can purchase full-page or half-page ads within issues
- Ad slots: inside front cover, between features, back cover, sidebar banners
- Self-serve ad submission portal (upload creative, select issue, pay via Stripe)
- Ad analytics: impressions, clicks, engagement per placement
- Media kit page with rates, audience demographics, specs

### Design Standard (10x Above Everything Else)
- This is the FLAGSHIP. Must make every other site look basic by comparison.
- **Immersive page-flip** with realistic paper texture, shadow, and sound effects
- **Spread layouts** — double-page spreads for feature articles and photo editorials
- **Embedded video** that auto-plays when you flip to that page
- **Ambient audio** — optional background music per issue/section
- **Zoom & pinch** on images within the magazine
- **Full-screen immersive mode** — no browser chrome, just pure magazine
- **Animated page elements** — text and images that reveal as you "open" each page
- **Cover reveal animation** — each issue opens with a cinematic cover unveil
- **Print-quality typography** — magazine-grade layout with columns, pull quotes, drop caps
- **Interactive ads** — ad pages can have video, links, animations (premium placement)

### Pages
- Home (latest issue hero with cinematic reveal + past issues grid)
- Issues Archive (visual grid with hover previews)
- Issue Reader (full interactive flipbook experience)
- Submit (writer + artist portals)
- Advertise (media kit, rates, self-serve ad portal)
- About
- Subscribe (email + premium tier for early access)

---

## ✨ TRAPGLOW.COM — Music Discovery Platform

### Brand Identity
- **Tagline:** "Shining Light on What's Next"
- **Vibe:** Energetic, discovery-focused, emerging talent spotlight. Think early-era Pigeons & Planes or The FADER.
- **Audience:** Music fans hunting for the next big thing, emerging artists wanting exposure

### Color Scheme
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Electric Violet | `#8B5CF6` | Logo, headings, primary CTA |
| Secondary | Deep Navy | `#0F0B2E` | Backgrounds |
| Accent | Neon Cyan | `#06F5D6` | Highlights, badges, "NEW" tags |
| Warm | Sunset Orange | `#FF6B35` | Secondary CTA, trending indicators |
| Text | Ghost White | `#F8F8FF` | Body text |
| Surface | Dark Purple | `#1A1035` | Cards, panels |

### Typography
- **Headlines:** Space Grotesk (modern, techy)
- **Body:** Plus Jakarta Sans (friendly, readable)
- **Accent:** Unbounded (bold for artist names)

### Key Features
1. **Artist Spotlight Cards** — Visual-first artist features with embedded players
2. **"Glow Up" Section** — Rising artists tracked over time (like a leaderboard)
3. **Embedded Music Players** — Spotify, SoundCloud, Apple Music embeds
4. **Genre Tags + Filtering** — Browse by genre, mood, region
5. **Daily Discovery** — AI-curated daily picks
6. **Artist Submission Portal** — Artists apply to be featured
7. **Writer Portal** — Music journalists contribute reviews/features
8. **Social Proof** — Play counts, trending metrics, community votes

### Pages
- Home (featured artists + daily discovery + trending)
- Discover (filterable grid of artists/songs)
- Artist Profile (bio, music, features, links)
- Submit (artist submission form)
- Write (writer application + dashboard)
- Blog (long-form features and interviews)

---

## 🔌 SAUCEWIRE.COM — The Culture News Wire

### Brand Identity
- **Tagline:** "Culture. Connected. Now."
- **Vibe:** Fast, authoritative, always-on. Think a hip-hop Reuters or culture-focused AP News. Breaking news energy.
- **Audience:** Anyone who wants to stay plugged into hip-hop, culture, entertainment, and street fashion news

### Color Scheme
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Signal Red | `#E63946` | Breaking news, logo accent |
| Secondary | Ink Black | `#111111` | Backgrounds, headers |
| Accent | Electric Blue | `#1DA1F2` | Links, timestamps, live indicators |
| Neutral | Steel Gray | `#8D99AE` | Secondary text, metadata |
| Text | Pure White | `#FFFFFF` | Body text |
| Surface | Dark Slate | `#1B1B2F` | Cards, article backgrounds |

### Typography
- **Headlines:** Archivo Black (bold, news-y impact)
- **Body:** Source Sans Pro (clean readability, news standard)
- **Meta:** JetBrains Mono (timestamps, categories — wire feel)

### Key Features
1. **Live News Feed** — Real-time scrolling feed (auto-updates)
2. **Breaking News Banner** — Highlighted urgent stories
3. **Category Wires** — Music | Fashion | Entertainment | Sports | Tech
4. **AI Auto-Publishing** — News APIs → AI rewrite → publish (can run 24/7)
5. **Quick Read Format** — Short, punchy articles (300-500 words)
6. **Source Attribution** — Links back to original sources
7. **Writer Portal** — Contributors submit news tips and articles
8. **Push Notifications** — Breaking news alerts (web push)
9. **Trending Sidebar** — Most-read stories in real-time

### Pages
- Home (live feed + breaking + trending sidebar)
- Category pages (Music, Fashion, Entertainment, Sports, Tech)
- Article page (clean reading experience)
- Submit Tip (anonymous news tip form)
- Write (contributor portal)
- Archive (searchable past stories)

---

## 🎵 TRAPFREQUENCY.COM — Music Production Hub

### Brand Identity
- **Tagline:** "Tune Into The Craft"
- **Vibe:** Technical but accessible. The intersection of music production knowledge and culture. Think Splice meets Genius meets a producer's dream blog.
- **Audience:** Producers, beatmakers, audio engineers, aspiring music creators

### Color Scheme
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Frequency Green | `#39FF14` | Logo, waveform accents, primary CTA |
| Secondary | Studio Black | `#0D0D0D` | Backgrounds (DAW-inspired dark UI) |
| Accent | Amber | `#FFB800` | Highlights, ratings, premium badges |
| Cool | Waveform Blue | `#4361EE` | Secondary accents, links |
| Text | Light Gray | `#E0E0E0` | Body text |
| Surface | Mixer Dark | `#1A1A2E` | Cards, panels |

### Typography
- **Headlines:** Orbitron (techy, futuristic)
- **Body:** Rubik (geometric, modern)
- **Code/Tech:** Fira Code (for production tips, technical content)

### Key Features
1. **Production Tutorials** — Step-by-step guides, tips, techniques
2. **Beat Showcase** — Producers submit beats to be featured
3. **Gear Reviews** — AI-generated + human-curated equipment reviews
4. **Sample Pack Spotlights** — Curated free/paid sample pack features
5. **Producer Profiles** — Featured producer pages with credits, beats, links
6. **DAW Tips** — FL Studio, Ableton, Logic Pro specific content
7. **Frequency Charts** — Trending beats, most-used sounds, production trends
8. **Writer/Producer Portal** — Submit articles, tutorials, beats
9. **Waveform Visualizer** — Audio player with visual waveform display

### Pages
- Home (featured content + latest tutorials + beat showcase)
- Tutorials (filterable by DAW, skill level, topic)
- Beats (producer showcase with audio players)
- Gear (equipment reviews and recommendations)
- Submit (producer submission + writer application)
- Producer Profile (individual producer pages)

---

## 🔧 SHARED INFRASTRUCTURE

### Database Schema (Supabase)
```sql
-- Core
users (id, email, name, role, avatar, bio, links, brand_affiliations[], created_at)
-- role: admin | editor | writer | artist | producer | reader

-- Content
articles (id, title, slug, body, excerpt, cover_image, brand, category, 
          author_id, status, is_ai_generated, source_url, published_at)
-- brand: saucecaviar | trapglow | saucewire | trapfrequency
-- status: draft | pending_review | published | archived

-- Magazine (SauceCaviar specific)
issues (id, title, number, cover_image, published_at, status)
issue_pages (id, issue_id, page_number, content, media_url, layout_type)

-- Submissions
submissions (id, user_id, brand, type, title, content, media_urls[], 
             status, reviewer_notes, submitted_at, reviewed_at)
-- type: article_pitch | artist_feature | beat_submission | news_tip

-- Media
media (id, url, type, brand, uploaded_by, metadata)

-- Analytics
page_views (id, article_id, brand, viewed_at, user_agent, country)
```

### Admin Dashboard
- Single login for Vincent → manage all 4 brands
- Content queue: approve/edit/reject AI articles + human submissions
- Writer management: approve writers, track contributions
- Submission inbox: review artist/producer submissions
- Analytics: views, engagement, growth per brand
- AI Pipeline controls: toggle auto-publish, adjust frequency, review AI drafts

### AI Content Pipeline
```
[Cron: Every 2-4 hours]
     │
     ├── Fetch news from APIs (NewsAPI, Google News RSS, Reddit, X)
     │   └── Filter by relevance to each brand's niche
     │
     ├── AI Processing (Claude API)
     │   ├── Rewrite with brand voice
     │   ├── Generate headline + excerpt
     │   ├── Auto-categorize + tag
     │   └── Assign to appropriate brand(s)
     │
     ├── Quality Check
     │   ├── Auto-publish if confidence > threshold (SauceWire fast news)
     │   └── Queue for review if below threshold
     │
     └── Post-Publish
         ├── Social media auto-post
         └── Push notification (breaking news)
```

### Deployment Plan
1. **Phase 1: Foundation** — Supabase DB + shared auth + admin dashboard
2. **Phase 2: SauceWire** — Easiest to launch (auto news = instant content)
3. **Phase 3: TrapGlow** — Artist features + discovery
4. **Phase 4: TrapFrequency** — Production content + beat showcase
5. **Phase 5: SauceCaviar** — Magazine (most complex — interactive flipbook)

---

## 💰 Revenue Opportunities (Future)
- Premium magazine subscriptions (SauceCaviar)
- **In-magazine advertising** (full-page, half-page, interactive ad placements)
- Self-serve ad portal (brands upload + pay via Stripe)
- Featured placement fees (artists pay to get boosted)
- Print-on-demand magazine copies
- Sponsored articles / native advertising
- Beat marketplace commission (TrapFrequency)
- Email newsletter sponsorships
- Affiliate links (gear reviews on TrapFrequency)

---

---

## 🎬 DESIGN STANDARDS — STATE OF THE ART

These are NOT regular blog sites. These are **premium media experiences.**

### Animation & Motion
- **Framer Motion** — page transitions, scroll-triggered reveals, element animations
- **GSAP** — complex timeline animations, parallax scrolling, text character reveals
- **Lenis** — buttery smooth scrolling across all sites
- **Micro-interactions** — every button, card, link has purposeful hover/click feedback
- **Loading states** — branded shimmer skeletons, entrance animations

### Visual Design
- **Cinematic imagery** — full-bleed heroes, Ken Burns effect on photos, parallax depth
- **Glassmorphism** — frosted glass cards, gradient mesh backgrounds, depth layers
- **Dark mode default** — all sites are dark-first (nightlife/culture brands)
- **Custom cursors** on desktop
- **3D CSS transforms** — subtle perspective effects, card tilts on hover
- **Masonry grids** — Pinterest-style layouts with staggered load animations
- **Gradient meshes** — modern background treatments unique to each brand

### Typography
- **Animated headlines** — character-by-character reveals, text splitting effects
- **Scroll progress bars** — reading progress on article pages
- **Dynamic sizing** — fluid typography that scales beautifully

### Media Integration
- **Custom audio players** — waveform visualizers, brand-styled controls
- **Video backgrounds** — hero sections with ambient video loops
- **Embedded players** — Spotify, SoundCloud, YouTube with custom wrappers
- **Image galleries** — lightbox with swipe gestures, zoom, Ken Burns

### Artist Presentation
- Artists must look AMAZING when featured
- Full-screen artist hero images with name reveal animation
- Music embeds that match the site's aesthetic
- Social links with animated icons
- Photo galleries that feel like a professional portfolio
- Video content with cinematic framing

### 🔗 SHARING SYSTEM — "Share It Like Never Before"

Every piece of content gets a **premium, personalized sharing experience:**

#### Dynamic OG Images (Vercel OG / Satori)
- Every article, artist feature, and magazine issue auto-generates a **custom Open Graph image**
- Branded per site — SauceCaviar gold, TrapGlow violet, SauceWire red, TrapFrequency green
- Includes: article title, artist photo, brand logo, issue number
- Looks stunning in link previews on Twitter, iMessage, Discord, WhatsApp, etc.

#### Shareable Cards (The Game-Changer)
- **"Share as Image"** button on every article/feature
- Generates a beautiful, poster-quality image the user can save and post ANYWHERE
- Multiple formats auto-generated:
  - **Instagram Story** (1080×1920) — vertical, designed for Stories
  - **Instagram Post** (1080×1080) — square, feed-ready
  - **Twitter/X** (1200×675) — landscape with brand styling
  - **TikTok** (1080×1920) — vertical with bold text overlay
- Artist features include: artist photo, pull quote, "As Featured On [Brand]" badge
- Magazine issues: cover art + "Read Issue #X" call to action
- Users can **customize** before sharing — pick background color, add their own caption overlay

#### "As Featured On" Badges
- When an artist is featured, they get a downloadable **branded badge**
- "As Featured On SauceCaviar ✨" — designed like a certification/award
- Artists post these on their own socials = free marketing for the brand
- Different badge styles per site

#### Smart Share Buttons
- Not generic share icons — custom-styled, animated share buttons
- One-tap share to: Instagram Stories, Twitter/X, TikTok, WhatsApp, Copy Link
- Share count display (social proof)
- QR code generation for print magazine → digital bridge

#### Magazine-Specific Sharing
- Share individual pages/spreads from the magazine
- "Share This Spread" generates a cropped, branded image of that specific page
- Cover shares include animated preview (GIF/short video of page flip)

### 🔊 AUDIO ARTICLES — Every Article is Playable

Every article across ALL 4 sites gets an **auto-generated audio version:**

#### How It Works
1. Article is published (AI-generated or human-written)
2. Backend automatically sends the article text to TTS (ElevenLabs API)
3. Audio file is generated and stored in Supabase Storage
4. Article page shows a **custom audio player** at the top
5. Listener can play, pause, scrub, adjust speed (1x, 1.5x, 2x)

#### Audio Player Design
- Branded per site (matches color scheme)
- Waveform visualizer while playing
- Estimated listen time displayed ("4 min listen")
- Mini player that sticks to bottom when you scroll (like Spotify)
- Background audio — keeps playing if you navigate to another page

#### Voice Selection Per Brand
- **SauceCaviar** — Smooth, sophisticated narrator voice (premium editorial tone)
- **TrapGlow** — Young, energetic voice (discovery/hype energy)
- **SauceWire** — Authoritative, newscaster voice (breaking news delivery)
- **TrapFrequency** — Chill, knowledgeable voice (producer/technical tone)

#### Podcast Feed Potential
- Each site's audio articles can also be published as a **podcast feed**
- Subscribe in Apple Podcasts, Spotify, etc. to get articles read to you
- Automatic — no extra work needed

### 📡 RSS FEEDS — All Sites

Every site gets proper RSS/Atom feeds:
- `/feed.xml` — main site feed (all articles)
- `/feed/[category].xml` — per-category feeds
- `/feed/featured.xml` — featured/editor picks only
- Auto-discovery `<link>` tags in HTML head
- Compatible with all RSS readers (Feedly, Inoreader, etc.)
- Used by the AI pipeline to cross-reference sources

### Performance
- Everything must be fast despite the animations
- Image optimization (next/image, WebP/AVIF)
- Lazy loading with intersection observer
- Code splitting per page
- Lighthouse score target: 90+

---

*Created: 2026-02-26 | Owner: Vincent Young*
*Builder: Vector | Stack: Next.js + Vercel + Supabase + SkillBoss*
