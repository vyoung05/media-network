-- ============================================================
-- SauceCaviar Magazine Tables
-- ============================================================

-- Magazine Issues table
CREATE TABLE IF NOT EXISTS magazine_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  issue_number INTEGER NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  page_count INTEGER DEFAULT 0,
  featured_color TEXT DEFAULT '#C9A84C',
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Magazine Pages table
CREATE TABLE IF NOT EXISTS magazine_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES magazine_issues(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cover','toc','article','spread','video','ad','artist','full-bleed','back-cover')),
  title TEXT,
  subtitle TEXT,
  content TEXT,
  pull_quote TEXT,
  author TEXT,
  author_title TEXT,
  image_url TEXT,
  image_alt TEXT,
  secondary_image_url TEXT,
  background_color TEXT,
  text_color TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  video_url TEXT,
  music_embed TEXT,
  artist_name TEXT,
  artist_bio TEXT,
  artist_links JSONB DEFAULT '{}',
  advertiser_name TEXT,
  advertiser_tagline TEXT,
  advertiser_cta TEXT,
  advertiser_url TEXT,
  toc_entries JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(issue_id, page_number)
);

-- Indexes
CREATE INDEX idx_magazine_issues_status ON magazine_issues(status);
CREATE INDEX idx_magazine_issues_number ON magazine_issues(issue_number);
CREATE INDEX idx_magazine_pages_issue ON magazine_pages(issue_id);
CREATE INDEX idx_magazine_pages_type ON magazine_pages(type);

-- Triggers (uses existing update_updated_at_column function)
CREATE TRIGGER update_magazine_issues_updated_at BEFORE UPDATE ON magazine_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_magazine_pages_updated_at BEFORE UPDATE ON magazine_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE magazine_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published issues" ON magazine_issues 
  FOR SELECT USING (status = 'published');
CREATE POLICY "Anon read published issues" ON magazine_issues 
  FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Service role full access issues" ON magazine_issues 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read pages of published issues" ON magazine_pages 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM magazine_issues WHERE id = magazine_pages.issue_id AND status = 'published')
  );
CREATE POLICY "Anon read pages of published issues" ON magazine_pages 
  FOR SELECT TO anon USING (
    EXISTS (SELECT 1 FROM magazine_issues WHERE id = magazine_pages.issue_id AND status = 'published')
  );
CREATE POLICY "Service role full access pages" ON magazine_pages 
  FOR ALL USING (auth.role() = 'service_role');
