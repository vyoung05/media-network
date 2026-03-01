-- Add scheduled publish support for magazine issues
ALTER TABLE magazine_issues ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_magazine_scheduled ON magazine_issues (scheduled_publish_at) WHERE status = 'draft' AND scheduled_publish_at IS NOT NULL;

-- Enable Realtime on notifications table (for real-time notification bell)
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
