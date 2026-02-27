-- ======================== INDEXES ========================

-- Articles
CREATE INDEX idx_articles_brand ON public.articles(brand);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_brand_status ON public.articles(brand, status);
CREATE INDEX idx_articles_brand_category ON public.articles(brand, category);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_breaking ON public.articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_tags ON public.articles USING GIN(tags);

-- Submissions
CREATE INDEX idx_submissions_brand ON public.submissions(brand);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_brand_status ON public.submissions(brand, status);
CREATE INDEX idx_submissions_user ON public.submissions(user_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Users
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_brand_affiliations ON public.users USING GIN(brand_affiliations);

-- Issues
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_published_at ON public.issues(published_at DESC);

-- Issue Pages
CREATE INDEX idx_issue_pages_issue ON public.issue_pages(issue_id);

-- Media
CREATE INDEX idx_media_brand ON public.media(brand);
CREATE INDEX idx_media_type ON public.media(type);
CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);

-- Profiles
CREATE INDEX idx_profiles_display_name ON public.profiles(display_name);

-- Ad Placements
CREATE INDEX idx_ad_placements_brand ON public.ad_placements(brand);
CREATE INDEX idx_ad_placements_active ON public.ad_placements(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ad_placements_issue ON public.ad_placements(issue_id);
CREATE INDEX idx_ad_placements_dates ON public.ad_placements(start_date, end_date);

-- Audio Versions
CREATE INDEX idx_audio_versions_article ON public.audio_versions(article_id);
CREATE INDEX idx_audio_versions_status ON public.audio_versions(status);

-- Page Views
CREATE INDEX idx_page_views_article ON public.page_views(article_id);
CREATE INDEX idx_page_views_brand ON public.page_views(brand);
CREATE INDEX idx_page_views_viewed_at ON public.page_views(viewed_at DESC);
CREATE INDEX idx_page_views_brand_date ON public.page_views(brand, viewed_at DESC);

-- ======================== FUNCTIONS ========================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_issues
  BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_issue_pages
  BEFORE UPDATE ON public.issue_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_ad_placements
  BEFORE UPDATE ON public.ad_placements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_audio_versions
  BEFORE UPDATE ON public.audio_versions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment article view count
CREATE OR REPLACE FUNCTION increment_view_count(article_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================== ROW LEVEL SECURITY ========================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- ---- USERS ----

-- Anyone can read public user profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow insert on signup (via trigger or service role)
CREATE POLICY "Users can insert own profile on signup"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---- ARTICLES ----

-- Published articles are readable by everyone
CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (status = 'published' OR author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Writers can insert articles
CREATE POLICY "Writers and above can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'writer')
    )
  );

-- Authors can update their own draft/pending articles
CREATE POLICY "Authors can update own articles"
  ON public.articles FOR UPDATE
  USING (
    author_id = auth.uid() AND status IN ('draft', 'pending_review')
  );

-- Admins and editors can update any article
CREATE POLICY "Admins and editors can update any article"
  ON public.articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- ISSUES ----

-- Published issues viewable by all
CREATE POLICY "Published issues are viewable by everyone"
  ON public.issues FOR SELECT
  USING (status = 'published' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Admins/editors manage issues
CREATE POLICY "Admins and editors manage issues"
  ON public.issues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ---- ISSUE PAGES ----

-- Pages viewable if issue is published
CREATE POLICY "Issue pages are viewable when issue is published"
  ON public.issue_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.issues
      WHERE id = issue_id AND (status = 'published' OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
      )
    )
  );

-- Admins/editors manage issue pages
CREATE POLICY "Admins and editors manage issue pages"
  ON public.issue_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ---- SUBMISSIONS ----

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Anyone authenticated can submit
CREATE POLICY "Authenticated users can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Anonymous submissions allowed (user_id can be null)
CREATE POLICY "Anonymous submissions allowed"
  ON public.submissions FOR INSERT
  WITH CHECK (is_anonymous = TRUE);

-- Admins/editors can update submissions (review)
CREATE POLICY "Admins and editors can review submissions"
  ON public.submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ---- MEDIA ----

-- Media viewable by all
CREATE POLICY "Media is viewable by everyone"
  ON public.media FOR SELECT
  USING (true);

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Uploaders and admins can manage their media
CREATE POLICY "Users can manage own media"
  ON public.media FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete own media"
  ON public.media FOR DELETE
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- PAGE VIEWS ----

-- Anyone can insert page views (anonymous tracking)
CREATE POLICY "Anyone can record page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

-- Only admins can read analytics
CREATE POLICY "Admins can view analytics"
  ON public.page_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ---- PROFILES ----

-- Profiles are publicly readable
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can manage any profile
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- AD PLACEMENTS ----

-- Active ads are viewable by everyone (for rendering on sites)
CREATE POLICY "Active ads are viewable by everyone"
  ON public.ad_placements FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage all ads
CREATE POLICY "Admins can manage ad placements"
  ON public.ad_placements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- AUDIO VERSIONS ----

-- Audio versions are readable when the article is published
CREATE POLICY "Audio versions are viewable for published articles"
  ON public.audio_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE id = article_id AND status = 'published'
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Admins can manage audio versions
CREATE POLICY "Admins can manage audio versions"
  ON public.audio_versions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ======================== SEED DATA ========================

-- Create admin user trigger (auto-create profile on auth signup)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'reader'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
