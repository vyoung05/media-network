# SauceCaviar Architecture — Interactive Digital Magazine

## The Challenge
SauceCaviar is the FLAGSHIP. It's not a blog with pages — it's an immersive, interactive digital magazine with page-flip experiences, embedded video/audio, cinematic cover reveals, and print-quality typography.

## Tech Stack
- **Next.js 14+ App Router** (SSR + client components)
- **Turn.js / StPageFlip** for realistic page-flip (evaluate both)
  - StPageFlip: MIT license, TypeScript, no jQuery dependency ✅
  - Turn.js: jQuery dependency, older but battle-tested
  - **Decision: StPageFlip** (modern, no jQuery, TS-native)
- **Framer Motion** for all UI animations, cover reveals, page transitions
- **GSAP + ScrollTrigger** for parallax, timeline animations
- **Lenis** for smooth scrolling outside magazine reader
- **Howler.js** for ambient audio per issue/section
- **React Player** for embedded video within magazine pages

## Page Structure

### Public Pages
1. **/** — Home: Latest issue hero with cinematic cover reveal + past issues grid
2. **/issues** — Issues Archive: Visual grid with hover previews, filterable
3. **/issues/[slug]** — Issue Reader: Full interactive flipbook experience
4. **/submit** — Submit portal (writers + artists)
5. **/advertise** — Media kit, rates, self-serve ad portal
6. **/about** — Brand story, team, mission
7. **/subscribe** — Email + premium tier for early access

### Magazine Reader (The Core)
The issue reader is the centerpiece. Each issue is a collection of pages:

```
Issue
├── Cover (animated reveal)
├── Inside Front Cover (ad slot)
├── Table of Contents (animated navigation)
├── Feature Articles (1-4 pages each)
│   ├── Full-bleed hero image
│   ├── Body text with pull quotes, drop caps
│   ├── Embedded video (auto-plays on flip)
│   └── Photo spreads (double-page)
├── Photo Editorials (double-page spreads)
├── Ad Pages (interactive — video, links, animations)
├── Artist Spotlights
├── Back Cover
└── Inside Back Cover (ad slot)
```

### Page Types (Layout Templates)
1. **CoverPage** — Full-bleed image, issue title, cinematic reveal animation
2. **TableOfContents** — Animated list, click-to-jump navigation
3. **ArticlePage** — Long-form text with columns, pull quotes, drop caps
4. **SpreadPage** — Double-page photo editorial (image + text overlay)
5. **VideoPage** — Full-page embedded video with play overlay
6. **AdPage** — Interactive advertisement (video, links, hover effects)
7. **ArtistSpotlight** — Artist feature with music embed, bio, gallery
8. **FullBleedImage** — Edge-to-edge photography page
9. **BackCover** — Issue credits, next issue teaser

### Interactive Features
- **Page flip** with realistic paper texture, shadow, sound effect
- **Zoom & pinch** on images within pages
- **Full-screen immersive mode** — hides browser chrome
- **Audio ambient** — optional background music per issue/section
- **Video auto-play** — video pages play when flipped to
- **Animated text** — text reveals as page "opens"
- **Progress indicator** — visual page progress bar
- **Keyboard navigation** — arrow keys to flip
- **Touch/swipe** — mobile-native gesture support
- **Bookmarking** — remember reading position

## Components

### Magazine Reader
- `MagazineReader` — Main container, manages page state, flip engine
- `PageFlip` — StPageFlip wrapper component
- `CoverReveal` — Cinematic opening animation for each issue
- `PageNavigator` — Bottom bar with page dots/thumbnails
- `FullscreenToggle` — Enter/exit immersive mode
- `AmbientAudio` — Background music controller (Howler.js)
- `PageTurnSound` — Paper flip sound effect
- `ZoomableImage` — Pinch-zoom image viewer

### Page Templates
- `CoverTemplate` — Cover layout with title overlay
- `TOCTemplate` — Table of contents with animated links
- `ArticleTemplate` — Multi-column text with drop caps, pull quotes
- `SpreadTemplate` — Double-page photo spread
- `VideoTemplate` — Full-page video embed
- `AdTemplate` — Interactive ad with click tracking
- `ArtistTemplate` — Artist spotlight layout

### Shared
- `Header` — Navigation (transparent over hero, solid on scroll)
- `Footer` — Site footer
- `IssueCard` — Grid card for issues archive (cover image, title, date)
- `CustomCursor` — Desktop custom cursor
- `GlassMorphCard` — Frosted glass card component
- `ShareIssue` — Share functionality for issues/pages
- `AudioPlayer` — Article audio player (TTS)
- `SubscribeForm` — Email subscription component
- `AdSubmissionForm` — Self-serve ad submission

## Mock Data
- At least 2 full mock issues with 12-16 pages each
- Mock ads with brands
- Mock submissions
- Issue metadata (title, theme name, cover, published date)

## Color Scheme
- Champagne Gold #C9A84C (primary)
- Deep Black #0A0A0A (background)
- Ivory Cream #F5F0E8 (card backgrounds)
- Burgundy #722F37 (CTAs, links)
- Warm White #FAFAF7 (body text)
- Charcoal #2D2D2D (borders, secondary text)

## Typography
- Playfair Display — headlines (elegant serif)
- Inter / DM Sans — body text
- Cormorant Garamond — editorial quotes, accent text
