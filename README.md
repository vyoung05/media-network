# 🏛️ Media Network

> **4 Brands. 1 Database. 1 Empire.**

The Media Network is a unified digital media platform powering four distinct brands under [The Young Empire](https://vincifilmsnetwork.com) — each with its own identity, audience, and editorial voice, all sharing a single backend infrastructure.

---

## 🌐 The Brands

| Brand | Domain | Focus | Color |
|-------|--------|-------|-------|
| **SauceCaviar** | [saucecaviar.com](https://saucecaviar.com) | Luxury lifestyle & culture magazine | `#C9A84C` Gold |
| **TrapGlow** | [trapglow.com](https://trapglow.com) | Beauty, wellness & lifestyle discovery | `#8B5CF6` Purple |
| **SauceWire** | [saucewire.com](https://saucewire.com) | Digital culture & breaking news | `#E63946` Red |
| **TrapFrequency** | [trapfrequency.com](https://trapfrequency.com) | Music production, beats & audio hub | `#39FF14` Neon Green |

## 🏗️ Architecture

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

### Monorepo Structure

```
media-network/
├── apps/
│   ├── admin/           # Admin dashboard (media-network-admin.vercel.app)
│   ├── saucecaviar/     # SauceCaviar frontend
│   ├── trapglow/        # TrapGlow frontend
│   ├── saucewire/       # SauceWire frontend
│   └── trapfrequency/   # TrapFrequency frontend
├── packages/
│   └── shared/          # Shared types, API layer, Supabase clients
├── branding/            # Brand assets, logos, colors
├── scripts/             # Deployment & automation scripts
├── supabase/            # Database migrations & seed data
└── package.json         # Workspace root
```

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS + Framer Motion + GSAP |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Deployment** | Vercel (5 projects, 1 monorepo) |
| **Admin** | Custom dashboard with Google OAuth |
| **AI Pipeline** | Automated content curation & generation |
| **Language** | TypeScript (97.6%) |

## 🔑 Key Features

- **Unified Content Pipeline** — One admin dashboard manages content across all four brands
- **AI-Powered News Scanner** — Automated RSS aggregation with quality scoring
- **Brand-Specific Sections** — Each brand has unique content types (beats, tutorials, gear reviews, magazine issues, etc.)
- **Writer Portal** — Content submission and review workflow
- **TTS Audio** — Text-to-speech audio versions of articles
- **Digital Magazine Editor** — Full-featured magazine creation for SauceCaviar
- **SEO Optimization** — Auto-generated OG images, sitemaps, structured data
- **Newsletter System** — Email campaigns per brand
- **Hot or Not** — Community voting feature

## 🚀 Deployments

| App | URL | Auto-Deploy |
|-----|-----|-------------|
| Admin Dashboard | [media-network-admin.vercel.app](https://media-network-admin.vercel.app) | ✅ `main` |
| SauceCaviar | [saucecaviar.com](https://saucecaviar.com) | ✅ `main` |
| TrapGlow | [trapglow.com](https://trapglow.com) | ✅ `main` |
| SauceWire | [saucewire.com](https://saucewire.com) | ✅ `main` |
| TrapFrequency | [trapfrequency.com](https://trapfrequency.com) | ✅ `main` |

All projects auto-deploy from the `main` branch via Vercel's GitHub integration.

## 🛠️ Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run a specific app
cd apps/admin && npm run dev
cd apps/saucewire && npm run dev

# Build a specific app
cd apps/trapfrequency && npx next build
```

Each app has its own `.env.local` for Supabase credentials (not committed to git).

## 📊 Database

Hosted on Supabase under the **Vinci Films Network PRO** organization.

**Core tables:** articles, users, submissions, categories, tags, media, audio_versions, magazine_issues, magazine_pages, newsletter_subscribers

**Key features:**
- Row-Level Security (RLS) enabled
- Real-time subscriptions
- Edge Functions for AI pipeline
- Storage buckets for media assets

## 👥 Team

Built by **Vincent Young** — CEO of [The Young Empire](https://vincifilmsnetwork.com)

- 🎵 [Pop Vinci](https://popvinci.com) — Artist & Creator
- 🎬 [Vinci Films Network](https://vincifilmsnetwork.com) — Film & Media
- 🏫 [Pop Vinci Academy](https://popvinciacademy.com) — Education

---

*Part of The Young Empire ecosystem — where music, media, and technology converge.*
