-- ============================================================
-- MEDIA NETWORK — Cross-Posting & Social Media Tables
-- ============================================================

-- 1. Add cross-posting columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS cross_posted_from uuid REFERENCES articles(id) ON DELETE SET NULL;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS cross_posted_to uuid[] DEFAULT '{}';

-- Create index for cross-posting lookups
CREATE INDEX IF NOT EXISTS idx_articles_cross_posted_from ON articles(cross_posted_from) WHERE cross_posted_from IS NOT NULL;

-- 2. Social Media Settings table
CREATE TABLE IF NOT EXISTS social_media_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  platform text NOT NULL,
  enabled boolean DEFAULT false,
  credentials jsonb DEFAULT '{}',
  auto_share_on_publish boolean DEFAULT false,
  default_template text DEFAULT '{title} - {excerpt} {url} {brand}',
  default_hashtags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(brand, platform)
);

-- Enable RLS
ALTER TABLE social_media_settings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on social_media_settings"
  ON social_media_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Social Share Log table
CREATE TABLE IF NOT EXISTS social_share_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  brand text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  post_url text,
  error_message text,
  shared_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE social_share_log ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on social_share_log"
  ON social_share_log
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for quick lookups by article
CREATE INDEX IF NOT EXISTS idx_social_share_log_article ON social_share_log(article_id);
CREATE INDEX IF NOT EXISTS idx_social_share_log_brand ON social_share_log(brand);

-- Updated_at trigger for social_media_settings
CREATE OR REPLACE FUNCTION update_social_media_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_social_media_settings_updated_at ON social_media_settings;
CREATE TRIGGER trigger_social_media_settings_updated_at
  BEFORE UPDATE ON social_media_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_social_media_settings_updated_at();
