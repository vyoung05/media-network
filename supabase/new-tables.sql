-- ============================================================
-- MEDIA NETWORK — Extended Content Tables
-- Producers, Tutorials, Beats, Gear Reviews, Sample Packs, Artists
-- ============================================================

-- ======================== NEW ENUMS ========================

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE skill_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Master');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE glow_trend AS ENUM ('rising', 'steady', 'new');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ======================== PRODUCERS (TrapFrequency) ========================

CREATE TABLE IF NOT EXISTS public.producers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar TEXT,
  cover_image TEXT,
  bio TEXT,
  location TEXT,
  daws TEXT[] DEFAULT '{}',
  genres TEXT[] DEFAULT '{}',
  credits TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '{}',
  beat_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== TUTORIALS (TrapFrequency) ========================

CREATE TABLE IF NOT EXISTS public.tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image TEXT,
  daw TEXT,
  skill_level skill_level DEFAULT 'Beginner',
  category TEXT,
  duration TEXT,
  producer_id UUID REFERENCES public.producers(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== BEATS (TrapFrequency) ========================

CREATE TABLE IF NOT EXISTS public.beats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  audio_url TEXT,
  producer_id UUID REFERENCES public.producers(id) ON DELETE SET NULL,
  bpm INTEGER,
  key TEXT,
  genre TEXT,
  tags TEXT[] DEFAULT '{}',
  duration TEXT,
  plays INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== GEAR REVIEWS (TrapFrequency) ========================

CREATE TABLE IF NOT EXISTS public.gear_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  product TEXT NOT NULL,
  brand_name TEXT,
  category TEXT,
  price TEXT,
  rating REAL DEFAULT 0,
  excerpt TEXT,
  body TEXT,
  cover_image TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  verdict TEXT,
  affiliate_url TEXT,
  producer_id UUID REFERENCES public.producers(id) ON DELETE SET NULL,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== SAMPLE PACKS (TrapFrequency) ========================

CREATE TABLE IF NOT EXISTS public.sample_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  creator TEXT,
  price TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  sample_count INTEGER DEFAULT 0,
  genres TEXT[] DEFAULT '{}',
  description TEXT,
  cover_image TEXT,
  rating REAL DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== ARTISTS (TrapGlow) ========================

CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  real_name TEXT,
  avatar TEXT,
  cover_image TEXT,
  bio TEXT,
  genres TEXT[] DEFAULT '{}',
  moods TEXT[] DEFAULT '{}',
  region TEXT,
  city TEXT,
  social JSONB DEFAULT '{}',
  spotify_embed TEXT,
  soundcloud_embed TEXT,
  apple_music_embed TEXT,
  monthly_listeners INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  glow_score INTEGER DEFAULT 0,
  glow_trend glow_trend DEFAULT 'new',
  is_featured BOOLEAN DEFAULT FALSE,
  is_daily_pick BOOLEAN DEFAULT FALSE,
  featured_track TEXT,
  featured_track_url TEXT,
  tags TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================== EXTEND ISSUES TABLE (SauceCaviar) ========================

-- Add missing columns to existing issues table
DO $$ BEGIN
  ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS subtitle TEXT;
  ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS season TEXT;
  ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS featured_color TEXT;
  ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Extend issue_pages with rich content fields
DO $$ BEGIN
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'article';
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS title TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS subtitle TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS pull_quote TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS author TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS author_title TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS image_url TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS image_alt TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS secondary_image_url TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS background_color TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS text_color TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS category TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS video_url TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS music_embed TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS artist_name TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS artist_bio TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS artist_links JSONB DEFAULT '{}';
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS advertiser_name TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS advertiser_tagline TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS advertiser_cta TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS advertiser_url TEXT;
  ALTER TABLE public.issue_pages ADD COLUMN IF NOT EXISTS toc_entries JSONB DEFAULT '[]';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ======================== INDEXES ========================

CREATE INDEX IF NOT EXISTS idx_producers_slug ON public.producers(slug);
CREATE INDEX IF NOT EXISTS idx_producers_featured ON public.producers(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_producers_status ON public.producers(status);

CREATE INDEX IF NOT EXISTS idx_tutorials_slug ON public.tutorials(slug);
CREATE INDEX IF NOT EXISTS idx_tutorials_daw ON public.tutorials(daw);
CREATE INDEX IF NOT EXISTS idx_tutorials_skill_level ON public.tutorials(skill_level);
CREATE INDEX IF NOT EXISTS idx_tutorials_category ON public.tutorials(category);
CREATE INDEX IF NOT EXISTS idx_tutorials_status ON public.tutorials(status);
CREATE INDEX IF NOT EXISTS idx_tutorials_published_at ON public.tutorials(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_tutorials_producer ON public.tutorials(producer_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_tags ON public.tutorials USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_beats_slug ON public.beats(slug);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON public.beats(genre);
CREATE INDEX IF NOT EXISTS idx_beats_producer ON public.beats(producer_id);
CREATE INDEX IF NOT EXISTS idx_beats_featured ON public.beats(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_beats_status ON public.beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_published_at ON public.beats(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_beats_plays ON public.beats(plays DESC);

CREATE INDEX IF NOT EXISTS idx_gear_reviews_slug ON public.gear_reviews(slug);
CREATE INDEX IF NOT EXISTS idx_gear_reviews_category ON public.gear_reviews(category);
CREATE INDEX IF NOT EXISTS idx_gear_reviews_status ON public.gear_reviews(status);
CREATE INDEX IF NOT EXISTS idx_gear_reviews_rating ON public.gear_reviews(rating DESC);

CREATE INDEX IF NOT EXISTS idx_sample_packs_slug ON public.sample_packs(slug);
CREATE INDEX IF NOT EXISTS idx_sample_packs_is_free ON public.sample_packs(is_free);
CREATE INDEX IF NOT EXISTS idx_sample_packs_status ON public.sample_packs(status);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON public.artists(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_artists_daily_pick ON public.artists(is_daily_pick) WHERE is_daily_pick = TRUE;
CREATE INDEX IF NOT EXISTS idx_artists_glow_score ON public.artists(glow_score DESC);
CREATE INDEX IF NOT EXISTS idx_artists_status ON public.artists(status);
CREATE INDEX IF NOT EXISTS idx_artists_genres ON public.artists USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_artists_region ON public.artists(region);

-- ======================== TRIGGERS ========================

CREATE TRIGGER set_updated_at_producers
  BEFORE UPDATE ON public.producers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_tutorials
  BEFORE UPDATE ON public.tutorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_beats
  BEFORE UPDATE ON public.beats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_gear_reviews
  BEFORE UPDATE ON public.gear_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_sample_packs
  BEFORE UPDATE ON public.sample_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_artists
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ======================== ROW LEVEL SECURITY ========================

ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Published content is readable by everyone
CREATE POLICY "Published producers viewable by all" ON public.producers FOR SELECT USING (status = 'published');
CREATE POLICY "Published tutorials viewable by all" ON public.tutorials FOR SELECT USING (status = 'published');
CREATE POLICY "Published beats viewable by all" ON public.beats FOR SELECT USING (status = 'published');
CREATE POLICY "Published gear reviews viewable by all" ON public.gear_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Published sample packs viewable by all" ON public.sample_packs FOR SELECT USING (status = 'published');
CREATE POLICY "Published artists viewable by all" ON public.artists FOR SELECT USING (status = 'published');

-- Admins/editors can manage all content
CREATE POLICY "Admins manage producers" ON public.producers FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Admins manage tutorials" ON public.tutorials FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Admins manage beats" ON public.beats FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Admins manage gear reviews" ON public.gear_reviews FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Admins manage sample packs" ON public.sample_packs FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Admins manage artists" ON public.artists FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'editor')));
