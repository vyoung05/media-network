-- Enhance magazine_pages for rich digital magazine
-- Run date: 2026-03-01

-- Expand page types
ALTER TABLE magazine_pages DROP CONSTRAINT IF EXISTS magazine_pages_type_check;
ALTER TABLE magazine_pages ADD CONSTRAINT magazine_pages_type_check CHECK (
  type IN ('cover','toc','article','spread','video','ad','artist','full-bleed','back-cover','gallery','interactive','video-ad','audio','quote','credits','letter')
);

-- Rich media fields
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS video_embed_url TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS audio_embed_url TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS spotify_embed TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS interactive_embed_url TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS iframe_url TEXT;

-- Typography / styling
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS title_font_size TEXT DEFAULT 'xl';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS title_font_style TEXT DEFAULT 'normal';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS title_alignment TEXT DEFAULT 'left';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS overlay_opacity NUMERIC DEFAULT 0.5;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS text_position TEXT DEFAULT 'bottom';

-- Lower thirds / captions / credits
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS lower_third_text TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS lower_third_subtitle TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS photo_credit TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS credits JSONB DEFAULT '[]';

-- Layout & animation
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS layout_style TEXT DEFAULT 'standard';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS animation TEXT DEFAULT 'fade';
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS transition_effect TEXT DEFAULT 'slide';

-- CTA / interaction
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS cta_text TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS cta_url TEXT;
ALTER TABLE magazine_pages ADD COLUMN IF NOT EXISTS cta_style TEXT DEFAULT 'button';
