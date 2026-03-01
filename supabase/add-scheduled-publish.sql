-- Scheduled Publishing: Add column + index to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_scheduled 
  ON articles(scheduled_publish_at) 
  WHERE scheduled_publish_at IS NOT NULL AND status = 'pending_review';
