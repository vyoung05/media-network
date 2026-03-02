-- ============================================================
-- RSS Feeds Management Table
-- Allows admins to add/edit/delete custom RSS feed sources
-- that are merged with the hardcoded defaults in news-feed API
-- ============================================================

CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  default_category TEXT NOT NULL DEFAULT 'Entertainment',
  primary_brands TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;

-- Anyone can read feeds (needed by the news-feed API route)
CREATE POLICY "Anyone can read rss_feeds" ON rss_feeds FOR SELECT USING (true);

-- Service role can do everything (admin API routes use service role key)
CREATE POLICY "Service role manages rss_feeds" ON rss_feeds FOR ALL USING (true);

-- Auto-update the updated_at timestamp on row changes
CREATE OR REPLACE FUNCTION update_rss_feeds_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rss_feeds_updated_at
  BEFORE UPDATE ON rss_feeds
  FOR EACH ROW EXECUTE FUNCTION update_rss_feeds_updated_at();
