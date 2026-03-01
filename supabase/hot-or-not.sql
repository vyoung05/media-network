-- Hot or Not Voting System for SauceCaviar Magazine
-- Run date: 2026-03-01

CREATE TABLE IF NOT EXISTS magazine_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES magazine_issues(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album TEXT,
  cover_image TEXT,
  preview_url TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  soundcloud_url TEXT,
  youtube_url TEXT,
  genre TEXT,
  submitted_by TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'featured')),
  hot_count INTEGER DEFAULT 0,
  not_count INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  hot_percentage NUMERIC DEFAULT 0,
  featured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS magazine_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID NOT NULL REFERENCES magazine_tracks(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('hot', 'not')),
  voter_fingerprint TEXT,
  voter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_magazine_tracks_status ON magazine_tracks(status);
CREATE INDEX idx_magazine_tracks_hot ON magazine_tracks(hot_percentage DESC) WHERE status = 'active';
CREATE INDEX idx_magazine_tracks_issue ON magazine_tracks(issue_id);
CREATE INDEX idx_magazine_votes_track ON magazine_votes(track_id);
CREATE INDEX idx_magazine_votes_fingerprint ON magazine_votes(voter_fingerprint, track_id);

CREATE TRIGGER update_magazine_tracks_updated_at BEFORE UPDATE ON magazine_tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_track_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE magazine_tracks SET
    hot_count = (SELECT COUNT(*) FROM magazine_votes WHERE track_id = NEW.track_id AND vote = 'hot'),
    not_count = (SELECT COUNT(*) FROM magazine_votes WHERE track_id = NEW.track_id AND vote = 'not'),
    total_votes = (SELECT COUNT(*) FROM magazine_votes WHERE track_id = NEW.track_id),
    hot_percentage = COALESCE(
      (SELECT ROUND(COUNT(*) FILTER (WHERE vote = 'hot') * 100.0 / NULLIF(COUNT(*), 0), 1)
       FROM magazine_votes WHERE track_id = NEW.track_id), 0
    )
  WHERE id = NEW.track_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_on_insert
  AFTER INSERT ON magazine_votes
  FOR EACH ROW EXECUTE FUNCTION update_track_vote_counts();

ALTER TABLE magazine_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active tracks" ON magazine_tracks FOR SELECT USING (status IN ('active', 'featured'));
CREATE POLICY "Public can vote" ON magazine_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read votes" ON magazine_votes FOR SELECT USING (true);
CREATE POLICY "Service role tracks" ON magazine_tracks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role votes" ON magazine_votes FOR ALL USING (auth.role() = 'service_role');
