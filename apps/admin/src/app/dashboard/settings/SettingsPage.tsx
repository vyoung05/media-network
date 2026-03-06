'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '@media-network/shared';

// ======================== TYPES ========================

interface BrandSettings {
  enabled: boolean;
  autoPublish: boolean;
  aiPipelineEnabled: boolean;
  aiPublishThreshold: number;
  pipelineFrequencyHours: number;
  defaultCategory: string;
  notificationsEnabled: boolean;
  rssEnabled: boolean;
  audioArticlesEnabled: boolean;
  ttsVoice: string;
}

interface GeneralSettings {
  siteName: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  postsPerPage: number;
  enableRegistration: boolean;
  requireApproval: boolean;
  maintenanceMode: boolean;
}

interface ApiSettings {
  supabaseUrl: string;
  supabaseAnonKey: string;
  elevenLabsApiKey: string;
  newsApiKey: string;
  stripePublicKey: string;
  openaiApiKey: string;
}

interface RolePermissions {
  [key: string]: boolean;
}

interface PermissionsSettings {
  editor: RolePermissions;
  writer: RolePermissions;
}

const EDITOR_PERMISSIONS = [
  { key: 'publish_articles', label: 'Publish Articles', description: 'Can publish articles directly without admin approval' },
  { key: 'manage_submissions', label: 'Manage Submissions', description: 'Can review, approve, and reject creator submissions' },
  { key: 'edit_any_article', label: 'Edit Any Article', description: 'Can edit articles created by other users' },
  { key: 'view_analytics', label: 'View Analytics', description: 'Access to analytics dashboards and reports' },
  { key: 'manage_categories', label: 'Manage Categories', description: 'Create, edit, and delete content categories' },
];

const WRITER_PERMISSIONS = [
  { key: 'submit_articles', label: 'Submit Articles', description: 'Can create and submit articles for review' },
  { key: 'edit_own_articles', label: 'Edit Own Articles', description: 'Can edit their own articles after submission' },
  { key: 'upload_media', label: 'Upload Media', description: 'Can upload images, videos, and other media files' },
  { key: 'view_own_analytics', label: 'View Own Analytics', description: 'Can see analytics for their own published articles' },
  { key: 'access_submissions', label: 'Access Submissions Portal', description: 'Can view and interact with the submissions portal' },
];

const INITIAL_PERMISSIONS: PermissionsSettings = {
  editor: {
    publish_articles: false,
    manage_submissions: false,
    edit_any_article: false,
    view_analytics: false,
    manage_categories: false,
  },
  writer: {
    submit_articles: false,
    edit_own_articles: false,
    upload_media: false,
    view_own_analytics: false,
    access_submissions: false,
  },
};

// ======================== INITIAL STATE ========================

const BRAND_CONFIGS: Record<Brand, { name: string; color: string; categories: string[]; voices: string[] }> = {
  saucewire: {
    name: 'SauceWire',
    color: '#E63946',
    categories: ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'],
    voices: ['Authoritative Newscaster', 'Professional Narrator', 'Casual Reporter'],
  },
  saucecaviar: {
    name: 'SauceCaviar',
    color: '#C9A84C',
    categories: ['Fashion', 'Music', 'Art', 'Culture', 'Lifestyle'],
    voices: ['Smooth Sophisticated', 'Editorial Narrator', 'Luxury Brand Voice'],
  },
  trapglow: {
    name: 'TrapGlow',
    color: '#8B5CF6',
    categories: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin'],
    voices: ['Young Energetic', 'Hype Discovery', 'Chill Narrator'],
  },
  trapfrequency: {
    name: 'TrapFrequency',
    color: '#39FF14',
    categories: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'],
    voices: ['Knowledgeable Technical', 'Chill Producer', 'Instructor Voice'],
  },
};

const INITIAL_BRAND_SETTINGS: Record<Brand, BrandSettings> = {
  saucewire: {
    enabled: true,
    autoPublish: true,
    aiPipelineEnabled: true,
    aiPublishThreshold: 85,
    pipelineFrequencyHours: 2,
    defaultCategory: 'Music',
    notificationsEnabled: true,
    rssEnabled: true,
    audioArticlesEnabled: true,
    ttsVoice: 'Authoritative Newscaster',
  },
  saucecaviar: {
    enabled: true,
    autoPublish: false,
    aiPipelineEnabled: false,
    aiPublishThreshold: 90,
    pipelineFrequencyHours: 6,
    defaultCategory: 'Culture',
    notificationsEnabled: true,
    rssEnabled: true,
    audioArticlesEnabled: true,
    ttsVoice: 'Smooth Sophisticated',
  },
  trapglow: {
    enabled: true,
    autoPublish: false,
    aiPipelineEnabled: true,
    aiPublishThreshold: 80,
    pipelineFrequencyHours: 4,
    defaultCategory: 'Hip-Hop',
    notificationsEnabled: true,
    rssEnabled: true,
    audioArticlesEnabled: true,
    ttsVoice: 'Young Energetic',
  },
  trapfrequency: {
    enabled: true,
    autoPublish: false,
    aiPipelineEnabled: false,
    aiPublishThreshold: 75,
    pipelineFrequencyHours: 8,
    defaultCategory: 'Tutorials',
    notificationsEnabled: false,
    rssEnabled: true,
    audioArticlesEnabled: true,
    ttsVoice: 'Knowledgeable Technical',
  },
};

interface RssFeed {
  id?: string;
  name: string;
  url: string;
  default_category: string;
  primary_brands: string[];
  enabled: boolean;
  created_at?: string;
}

const FEED_CATEGORIES = [
  'Music', 'Sports', 'Entertainment', 'Celebrity', 'Hip-Hop',
  'R&B', 'Fashion', 'Culture', 'Tech', 'Gear', 'Tutorials',
];

const BRAND_OPTIONS: Array<{ key: string; label: string; color: string }> = [
  { key: 'saucecaviar', label: 'SauceCaviar', color: '#C9A84C' },
  { key: 'trapglow', label: 'TrapGlow', color: '#8B5CF6' },
  { key: 'saucewire', label: 'SauceWire', color: '#E63946' },
  { key: 'trapfrequency', label: 'TrapFrequency', color: '#39FF14' },
];

const EMPTY_FEED: RssFeed = {
  name: '',
  url: '',
  default_category: 'Entertainment',
  primary_brands: [],
  enabled: true,
};

const INITIAL_GENERAL: GeneralSettings = {
  siteName: 'Media Network',
  adminEmail: 'vyoung86@gmail.com',
  timezone: 'America/New_York',
  dateFormat: 'MMM D, YYYY',
  postsPerPage: 20,
  enableRegistration: true,
  requireApproval: true,
  maintenanceMode: false,
};

const INITIAL_API: ApiSettings = {
  supabaseUrl: 'https://lvacbxnjfeunouqaskvh.supabase.co',
  supabaseAnonKey: '••••••••••••••••',
  elevenLabsApiKey: '••••••••••••••••',
  newsApiKey: '••••••••••••••••',
  stripePublicKey: '••••••••••••••••',
  openaiApiKey: '••••••••••••••••',
};

// ======================== SECTION COMPONENTS ========================

function SettingsSection({
  title,
  description,
  children,
  index = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="glass-panel overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </motion.div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  color,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? '' : 'bg-gray-700'
        }`}
        style={checked ? { backgroundColor: color || '#3B82F6' } : undefined}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? '22px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-300 font-medium flex-shrink-0">{label}</label>
      <div className="flex-1 max-w-sm">{children}</div>
    </div>
  );
}

// ======================== MAIN COMPONENT ========================

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'brands' | 'ai' | 'feeds' | 'api' | 'permissions' | 'account'>('general');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [general, setGeneral] = useState(INITIAL_GENERAL);
  const [brandSettings, setBrandSettings] = useState(INITIAL_BRAND_SETTINGS);
  const [api, setApi] = useState(INITIAL_API);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [activeBrandTab, setActiveBrandTab] = useState<Brand>('saucewire');
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ---- RSS Feed Management State ----
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RssFeed | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedForm, setFeedForm] = useState<RssFeed>({ ...EMPTY_FEED });
  const [feedToast, setFeedToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [testingFeed, setTestingFeed] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [deletingFeedId, setDeletingFeedId] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedGeneral = localStorage.getItem('media-network-settings-general');
      const savedBrands = localStorage.getItem('media-network-settings-brands');
      const savedApi = localStorage.getItem('media-network-settings-api');
      const savedPermissions = localStorage.getItem('media-network-settings-permissions');

      if (savedGeneral) setGeneral(JSON.parse(savedGeneral));
      if (savedBrands) setBrandSettings(JSON.parse(savedBrands));
      if (savedApi) setApi(JSON.parse(savedApi));
      if (savedPermissions) setPermissions(JSON.parse(savedPermissions));
    } catch (err) {
      console.error('Failed to load settings from localStorage:', err);
    }
    setLoaded(true);
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('media-network-settings-general', JSON.stringify(general));
      localStorage.setItem('media-network-settings-brands', JSON.stringify(brandSettings));
      localStorage.setItem('media-network-settings-api', JSON.stringify(api));
      localStorage.setItem('media-network-settings-permissions', JSON.stringify(permissions));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. See console for details.');
    }
  };

  const updateBrand = (brand: Brand, key: keyof BrandSettings, value: unknown) => {
    setBrandSettings((prev) => ({
      ...prev,
      [brand]: { ...prev[brand], [key]: value },
    }));
  };

  const updatePermission = (role: 'editor' | 'writer', key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [key]: value },
    }));
  };

  // ---- RSS Feed Management Functions ----

  const fetchFeeds = async () => {
    setFeedsLoading(true);
    try {
      const res = await fetch('/api/rss-feeds');
      const data = await res.json();
      if (data.feeds) setFeeds(data.feeds);
    } catch (err) {
      console.error('Failed to fetch feeds:', err);
      showFeedToast('Failed to load feeds', 'error');
    } finally {
      setFeedsLoading(false);
    }
  };

  const showFeedToast = (message: string, type: 'success' | 'error') => {
    setFeedToast({ message, type });
    setTimeout(() => setFeedToast(null), 3000);
  };

  const handleSaveFeed = async () => {
    if (!feedForm.name.trim()) { showFeedToast('Feed name is required', 'error'); return; }
    if (!feedForm.url.trim()) { showFeedToast('Feed URL is required', 'error'); return; }
    try { new URL(feedForm.url); } catch { showFeedToast('Invalid URL format', 'error'); return; }

    try {
      if (editingFeed?.id) {
        // Update existing
        const res = await fetch('/api/rss-feeds', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingFeed.id,
            name: feedForm.name,
            url: feedForm.url,
            defaultCategory: feedForm.default_category,
            primaryBrands: feedForm.primary_brands,
            enabled: feedForm.enabled,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        showFeedToast('Feed updated successfully', 'success');
      } else {
        // Add new
        const res = await fetch('/api/rss-feeds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: feedForm.name,
            url: feedForm.url,
            defaultCategory: feedForm.default_category,
            primaryBrands: feedForm.primary_brands,
            enabled: feedForm.enabled,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
        showFeedToast('Feed added successfully', 'success');
      }
      setEditingFeed(null);
      setShowAddForm(false);
      setFeedForm({ ...EMPTY_FEED });
      setTestResult(null);
      fetchFeeds();
    } catch (err) {
      showFeedToast(err instanceof Error ? err.message : 'Failed to save feed', 'error');
    }
  };

  const handleDeleteFeed = async (id: string) => {
    setDeletingFeedId(id);
    try {
      const res = await fetch('/api/rss-feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      showFeedToast('Feed deleted', 'success');
      fetchFeeds();
    } catch (err) {
      showFeedToast(err instanceof Error ? err.message : 'Failed to delete feed', 'error');
    } finally {
      setDeletingFeedId(null);
    }
  };

  const handleToggleFeedEnabled = async (feed: RssFeed) => {
    try {
      const res = await fetch('/api/rss-feeds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feed.id, enabled: !feed.enabled }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      fetchFeeds();
    } catch (err) {
      showFeedToast('Failed to toggle feed', 'error');
    }
  };

  const handleTestFeed = async () => {
    if (!feedForm.url.trim()) { showFeedToast('Enter a URL first', 'error'); return; }
    setTestingFeed(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/rss-feeds?test=${encodeURIComponent(feedForm.url)}`);
      const data = await res.json();
      if (data.ok) {
        setTestResult(`✅ Found ${data.itemCount} items`);
      } else {
        setTestResult(`❌ ${data.error || 'Failed to parse feed'}`);
      }
    } catch {
      setTestResult('❌ Network error');
    } finally {
      setTestingFeed(false);
    }
  };

  const startEditFeed = (feed: RssFeed) => {
    setEditingFeed(feed);
    setFeedForm({ ...feed });
    setShowAddForm(true);
    setTestResult(null);
  };

  const cancelFeedForm = () => {
    setEditingFeed(null);
    setShowAddForm(false);
    setFeedForm({ ...EMPTY_FEED });
    setTestResult(null);
  };

  const toggleFeedFormBrand = (brandKey: string) => {
    setFeedForm(prev => ({
      ...prev,
      primary_brands: prev.primary_brands.includes(brandKey)
        ? prev.primary_brands.filter(b => b !== brandKey)
        : [...prev.primary_brands, brandKey],
    }));
  };

  // Load feeds when tab selected
  useEffect(() => {
    if (activeTab === 'feeds') fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const editorActiveCount = Object.values(permissions.editor).filter(Boolean).length;
  const writerActiveCount = Object.values(permissions.writer).filter(Boolean).length;

  const tabs = [
    { key: 'general' as const, label: 'General', icon: '⚙️' },
    { key: 'brands' as const, label: 'Brands', icon: '🏷️' },
    { key: 'ai' as const, label: 'AI Pipeline', icon: '🤖' },
    { key: 'feeds' as const, label: 'News Feeds', icon: '📡' },
    { key: 'api' as const, label: 'API Keys', icon: '🔑' },
    { key: 'permissions' as const, label: 'Permissions', icon: '🔐' },
    { key: 'account' as const, label: 'Account', icon: '👤' },
  ];

  const currentBrand = brandSettings[activeBrandTab];
  const brandConfig = BRAND_CONFIGS[activeBrandTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your Media Network</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          className={`admin-btn-primary flex items-center gap-2 ${saved ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Changes
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ===================== GENERAL TAB ===================== */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SettingsSection title="General" description="Basic network settings" index={0}>
            <FieldRow label="Network Name">
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                className="admin-input text-sm"
              />
            </FieldRow>
            <FieldRow label="Admin Email">
              <input
                type="email"
                value={general.adminEmail}
                onChange={(e) => setGeneral({ ...general, adminEmail: e.target.value })}
                className="admin-input text-sm"
              />
            </FieldRow>
            <FieldRow label="Timezone">
              <select
                value={general.timezone}
                onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                className="admin-input text-sm"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </FieldRow>
            <FieldRow label="Posts Per Page">
              <input
                type="number"
                value={general.postsPerPage}
                onChange={(e) => setGeneral({ ...general, postsPerPage: Number(e.target.value) })}
                className="admin-input text-sm w-24"
                min={5}
                max={100}
              />
            </FieldRow>
          </SettingsSection>

          <SettingsSection title="Access Control" description="Registration and approval settings" index={1}>
            <Toggle
              label="Enable Registration"
              description="Allow new writers to register on the platform"
              checked={general.enableRegistration}
              onChange={(v) => setGeneral({ ...general, enableRegistration: v })}
            />
            <Toggle
              label="Require Approval"
              description="New writers must be approved before they can publish"
              checked={general.requireApproval}
              onChange={(v) => setGeneral({ ...general, requireApproval: v })}
            />
            <Toggle
              label="Maintenance Mode"
              description="Temporarily disable public access to all sites"
              checked={general.maintenanceMode}
              onChange={(v) => setGeneral({ ...general, maintenanceMode: v })}
              color="#EF4444"
            />
          </SettingsSection>
        </div>
      )}

      {/* ===================== BRANDS TAB ===================== */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          {/* Brand selector */}
          <div className="flex gap-2">
            {(Object.keys(BRAND_CONFIGS) as Brand[]).map((brand) => {
              const config = BRAND_CONFIGS[brand];
              const isActive = activeBrandTab === brand;
              return (
                <motion.button
                  key={brand}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveBrandTab(brand)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white bg-white/[0.03]'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${config.color}18`,
                          border: `1px solid ${config.color}40`,
                        }
                      : { border: '1px solid rgba(255,255,255,0.04)' }
                  }
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: config.color,
                      boxShadow: isActive ? `0 0 8px ${config.color}60` : 'none',
                    }}
                  />
                  {config.name}
                </motion.button>
              );
            })}
          </div>

          <SettingsSection
            title={`${brandConfig.name} Settings`}
            description={`Configuration for ${brandConfig.name}`}
            index={0}
          >
            <Toggle
              label="Site Enabled"
              description="Toggle this brand site on or off"
              checked={currentBrand.enabled}
              onChange={(v) => updateBrand(activeBrandTab, 'enabled', v)}
              color={brandConfig.color}
            />
            <FieldRow label="Default Category">
              <select
                value={currentBrand.defaultCategory}
                onChange={(e) => updateBrand(activeBrandTab, 'defaultCategory', e.target.value)}
                className="admin-input text-sm"
              >
                {brandConfig.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FieldRow>
            <Toggle
              label="Push Notifications"
              description="Send breaking news alerts to subscribers"
              checked={currentBrand.notificationsEnabled}
              onChange={(v) => updateBrand(activeBrandTab, 'notificationsEnabled', v)}
              color={brandConfig.color}
            />
            <Toggle
              label="RSS Feed"
              description="Serve RSS/Atom feed at /feed.xml"
              checked={currentBrand.rssEnabled}
              onChange={(v) => updateBrand(activeBrandTab, 'rssEnabled', v)}
              color={brandConfig.color}
            />
          </SettingsSection>

          <SettingsSection
            title="Audio Articles"
            description="Text-to-speech for article playback"
            index={1}
          >
            <Toggle
              label="Audio Articles"
              description="Auto-generate TTS audio for each published article"
              checked={currentBrand.audioArticlesEnabled}
              onChange={(v) => updateBrand(activeBrandTab, 'audioArticlesEnabled', v)}
              color={brandConfig.color}
            />
            <FieldRow label="TTS Voice">
              <select
                value={currentBrand.ttsVoice}
                onChange={(e) => updateBrand(activeBrandTab, 'ttsVoice', e.target.value)}
                className="admin-input text-sm"
              >
                {brandConfig.voices.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </FieldRow>
          </SettingsSection>
        </div>
      )}

      {/* ===================== AI PIPELINE TAB ===================== */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* Per-brand AI settings */}
          {(Object.keys(BRAND_CONFIGS) as Brand[]).map((brand, i) => {
            const config = BRAND_CONFIGS[brand];
            const settings = brandSettings[brand];
            return (
              <SettingsSection
                key={brand}
                title={`${config.name} — AI Pipeline`}
                index={i}
              >
                <Toggle
                  label="Enable AI Pipeline"
                  description="Automatically fetch, rewrite, and queue news articles"
                  checked={settings.aiPipelineEnabled}
                  onChange={(v) => updateBrand(brand, 'aiPipelineEnabled', v)}
                  color={config.color}
                />
                <Toggle
                  label="Auto-Publish"
                  description="Publish AI articles automatically when confidence is above threshold"
                  checked={settings.autoPublish}
                  onChange={(v) => updateBrand(brand, 'autoPublish', v)}
                  color={config.color}
                />
                <FieldRow label="Confidence Threshold">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={settings.aiPublishThreshold}
                      onChange={(e) => updateBrand(brand, 'aiPublishThreshold', Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-blue-500"
                      style={{ accentColor: config.color }}
                    />
                    <span className="text-sm font-mono text-white w-10 text-right">
                      {settings.aiPublishThreshold}%
                    </span>
                  </div>
                </FieldRow>
                <FieldRow label="Pipeline Frequency">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={settings.pipelineFrequencyHours}
                      onChange={(e) => updateBrand(brand, 'pipelineFrequencyHours', Number(e.target.value))}
                      className="admin-input text-sm w-20"
                    />
                    <span className="text-xs text-gray-500">hours between runs</span>
                  </div>
                </FieldRow>
              </SettingsSection>
            );
          })}
        </div>
      )}

      {/* ===================== NEWS FEEDS TAB ===================== */}
      {activeTab === 'feeds' && (
        <div className="space-y-6">
          {/* Toast */}
          {feedToast && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`glass-panel p-4 ${feedToast.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'}`}
            >
              <div className="flex items-center gap-2">
                <span>{feedToast.type === 'success' ? '✅' : '❌'}</span>
                <span className={`text-sm ${feedToast.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedToast.message}
                </span>
              </div>
            </motion.div>
          )}

          {/* Header + Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Manage RSS feed sources for the News Scanner. Custom feeds are merged with built-in defaults.
              </p>
            </div>
            {!showAddForm && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setShowAddForm(true); setEditingFeed(null); setFeedForm({ ...EMPTY_FEED }); setTestResult(null); }}
                className="admin-btn-primary flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Feed
              </motion.button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">
                  {editingFeed?.id ? '✏️ Edit Feed' : '➕ Add New Feed'}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <FieldRow label="Feed Name">
                  <input
                    type="text"
                    value={feedForm.name}
                    onChange={(e) => setFeedForm({ ...feedForm, name: e.target.value })}
                    placeholder="e.g. Rolling Stone"
                    className="admin-input text-sm"
                  />
                </FieldRow>

                <FieldRow label="Feed URL">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={feedForm.url}
                      onChange={(e) => { setFeedForm({ ...feedForm, url: e.target.value }); setTestResult(null); }}
                      placeholder="https://example.com/feed.xml"
                      className="admin-input text-sm flex-1"
                    />
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleTestFeed}
                      disabled={testingFeed}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:bg-white/[0.1] hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {testingFeed ? '⏳ Testing...' : '🔍 Test'}
                    </motion.button>
                  </div>
                  {testResult && (
                    <p className={`text-xs mt-1.5 ${testResult.startsWith('✅') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {testResult}
                    </p>
                  )}
                </FieldRow>

                <FieldRow label="Default Category">
                  <select
                    value={feedForm.default_category}
                    onChange={(e) => setFeedForm({ ...feedForm, default_category: e.target.value })}
                    className="admin-input text-sm"
                  >
                    {FEED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </FieldRow>

                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-gray-300 font-medium flex-shrink-0">Primary Brands</label>
                  <div className="flex gap-3 flex-1 max-w-sm justify-end">
                    {BRAND_OPTIONS.map((brand) => {
                      const isSelected = feedForm.primary_brands.includes(brand.key);
                      return (
                        <button
                          key={brand.key}
                          onClick={() => toggleFeedFormBrand(brand.key)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'text-white'
                              : 'text-gray-500 bg-white/[0.03] hover:bg-white/[0.06]'
                          }`}
                          style={isSelected ? {
                            backgroundColor: `${brand.color}20`,
                            border: `1px solid ${brand.color}50`,
                          } : {
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: brand.color, boxShadow: isSelected ? `0 0 6px ${brand.color}60` : 'none' }}
                          />
                          {brand.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Toggle
                  label="Enabled"
                  description="Feed will be included in News Scanner when enabled"
                  checked={feedForm.enabled}
                  onChange={(v) => setFeedForm({ ...feedForm, enabled: v })}
                  color="#3B82F6"
                />

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={cancelFeedForm}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSaveFeed}
                    className="admin-btn-primary text-sm"
                  >
                    {editingFeed?.id ? 'Update Feed' : 'Add Feed'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feeds List */}
          {feedsLoading ? (
            <div className="glass-panel p-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Loading feeds...</p>
            </div>
          ) : feeds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <span className="text-4xl">📡</span>
              <p className="text-sm text-gray-400 mt-3">No custom feeds yet</p>
              <p className="text-xs text-gray-600 mt-1">
                The News Scanner is using built-in default sources. Add custom feeds to expand coverage.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {feeds.map((feed, index) => (
                <motion.div
                  key={feed.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="glass-panel p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Feed info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">{feed.name}</h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            feed.enabled
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }`}
                        >
                          {feed.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5" title={feed.url}>
                        {feed.url}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {/* Category badge */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {feed.default_category}
                        </span>
                        {/* Brand dots */}
                        {feed.primary_brands.map((brandKey) => {
                          const brand = BRAND_OPTIONS.find(b => b.key === brandKey);
                          return brand ? (
                            <span key={brandKey} className="flex items-center gap-1" title={brand.label}>
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: brand.color }}
                              />
                              <span className="text-[10px] text-gray-500">{brand.label}</span>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Enable toggle */}
                      <button
                        onClick={() => handleToggleFeedEnabled(feed)}
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                          feed.enabled ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                      >
                        <motion.div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ left: feed.enabled ? '18px' : '2px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => startEditFeed(feed)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="Edit feed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => { if (confirm(`Delete "${feed.name}"?`)) handleDeleteFeed(feed.id!); }}
                        disabled={deletingFeedId === feed.id}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors disabled:opacity-50"
                        title="Delete feed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-4 border-blue-500/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div>
                <p className="text-sm font-medium text-blue-400">How Custom Feeds Work</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Custom feeds are merged with the built-in default sources (TMZ, ESPN, Billboard, etc.)
                  in the News Scanner. If a custom feed has the same URL as a default, the custom settings
                  override the defaults. The AI brand-affinity detection still runs on all feed items.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===================== NEWS FEEDS TAB ===================== */}
      {activeTab === 'feeds' && (
        <div className="space-y-6">
          {/* Header with Add button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Manage RSS feeds that power the News Scanner. Custom feeds merge with built-in defaults.
            </p>
            {!showAddForm && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setShowAddForm(true); setEditingFeed(null); setFeedForm({ ...EMPTY_FEED }); setTestResult(null); }}
                className="admin-btn-primary flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Feed
              </motion.button>
            )}
          </div>

          {/* Toast */}
          <AnimatePresence>
            {feedToast && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`px-4 py-3 rounded-lg text-sm flex items-center justify-between ${
                  feedToast.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                <span>{feedToast.message}</span>
                <button onClick={() => setFeedToast(null)} className="text-current opacity-60 hover:opacity-100 ml-3">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <SettingsSection
                  title={editingFeed ? '✏️ Edit Feed' : '➕ Add New Feed'}
                  description={editingFeed ? `Editing "${editingFeed.name}"` : 'Add a new RSS feed source'}
                  index={0}
                >
                  <FieldRow label="Feed Name">
                    <input
                      type="text"
                      value={feedForm.name}
                      onChange={(e) => setFeedForm({ ...feedForm, name: e.target.value })}
                      placeholder="e.g. HotNewHipHop"
                      className="admin-input text-sm"
                    />
                  </FieldRow>
                  <FieldRow label="Feed URL">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={feedForm.url}
                        onChange={(e) => { setFeedForm({ ...feedForm, url: e.target.value }); setTestResult(null); }}
                        placeholder="https://example.com/rss.xml"
                        className="admin-input text-sm flex-1 font-mono"
                      />
                      <button
                        onClick={handleTestFeed}
                        disabled={testingFeed || !feedForm.url}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-40"
                      >
                        {testingFeed ? '...' : 'Test'}
                      </button>
                    </div>
                    {testResult && (
                      <p className={`text-xs mt-1 ${testResult.startsWith('✅') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {testResult}
                      </p>
                    )}
                  </FieldRow>
                  <FieldRow label="Default Category">
                    <select
                      value={feedForm.default_category}
                      onChange={(e) => setFeedForm({ ...feedForm, default_category: e.target.value })}
                      className="admin-input text-sm"
                    >
                      {FEED_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </FieldRow>
                  <div>
                    <p className="text-sm text-gray-300 font-medium mb-2">Primary Brands</p>
                    <div className="flex gap-3 flex-wrap">
                      {BRAND_OPTIONS.map((brand) => (
                        <button
                          key={brand.key}
                          onClick={() => toggleFeedFormBrand(brand.key)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            feedForm.primary_brands.includes(brand.key)
                              ? 'text-white'
                              : 'text-gray-500 bg-white/[0.02] border-white/[0.06] hover:text-white'
                          }`}
                          style={feedForm.primary_brands.includes(brand.key) ? {
                            backgroundColor: `${brand.color}18`,
                            borderColor: `${brand.color}40`,
                          } : undefined}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: brand.color }}
                          />
                          {brand.label}
                        </button>
                      ))}
                    </div>
                    {feedForm.primary_brands.length === 0 && (
                      <p className="text-[10px] text-amber-400/70 mt-1">Select at least one brand</p>
                    )}
                  </div>
                  <Toggle
                    label="Enabled"
                    description="Disabled feeds won't appear in the News Scanner"
                    checked={feedForm.enabled}
                    onChange={(v) => setFeedForm({ ...feedForm, enabled: v })}
                  />
                  <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSaveFeed}
                      disabled={!feedForm.name || !feedForm.url || feedForm.primary_brands.length === 0}
                      className="admin-btn-primary text-sm disabled:opacity-40"
                    >
                      {editingFeed ? 'Update Feed' : 'Add Feed'}
                    </motion.button>
                    <button
                      onClick={cancelFeedForm}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </SettingsSection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed List */}
          <SettingsSection
            title="Feed Sources"
            description={feedsLoading ? 'Loading...' : `${feeds.length} custom feed${feeds.length !== 1 ? 's' : ''} configured`}
            index={1}
          >
            {feedsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-white/[0.03] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : feeds.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">📡</span>
                <p className="text-sm text-gray-500">No custom feeds yet</p>
                <p className="text-xs text-gray-600 mt-1">Built-in feeds (ESPN, TMZ, Billboard, etc.) are always active. Add custom ones here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feeds.map((feed, i) => (
                  <motion.div
                    key={feed.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
                      feed.enabled
                        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                        : 'bg-white/[0.01] border-white/[0.03] opacity-50'
                    }`}
                  >
                    {/* Name + URL */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{feed.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                          {feed.default_category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-mono truncate mt-0.5">{feed.url}</p>
                    </div>

                    {/* Brand dots */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      {feed.primary_brands.map((b) => {
                        const brand = BRAND_OPTIONS.find(bo => bo.key === b);
                        return brand ? (
                          <div
                            key={b}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: brand.color }}
                            title={brand.label}
                          />
                        ) : null;
                      })}
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => handleToggleFeedEnabled(feed)}
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
                        feed.enabled ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    >
                      <motion.div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ left: feed.enabled ? '18px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEditFeed(feed)}
                      className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteFeed(feed.id!)}
                      disabled={deletingFeedId === feed.id}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5 disabled:opacity-40"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </SettingsSection>

          {/* Built-in feeds info */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-4 border-blue-500/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">ℹ️</span>
              <div>
                <p className="text-sm font-medium text-blue-400">Built-in Feeds</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  The following feeds are always active: <span className="text-gray-400">TMZ, ESPN, Variety, AP, Billboard, Complex, HotNewHipHop, Hypebeast, Highsnobiety, MusicRadar, Sound On Sound, The Verge</span>.
                  Custom feeds you add here will merge with these. If a custom feed has the same URL as a built-in, it overrides it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===================== API KEYS TAB ===================== */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <SettingsSection title="Supabase" description="Database and auth" index={0}>
            <FieldRow label="Project URL">
              <input
                type="text"
                value={api.supabaseUrl}
                onChange={(e) => setApi({ ...api, supabaseUrl: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
            <FieldRow label="Anon Key">
              <input
                type="password"
                value={api.supabaseAnonKey}
                onChange={(e) => setApi({ ...api, supabaseAnonKey: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
          </SettingsSection>

          <SettingsSection title="ElevenLabs" description="Text-to-speech for audio articles" index={1}>
            <FieldRow label="API Key">
              <input
                type="password"
                value={api.elevenLabsApiKey}
                onChange={(e) => setApi({ ...api, elevenLabsApiKey: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
          </SettingsSection>

          <SettingsSection title="News API" description="External news sources for AI pipeline" index={2}>
            <FieldRow label="API Key">
              <input
                type="password"
                value={api.newsApiKey}
                onChange={(e) => setApi({ ...api, newsApiKey: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
          </SettingsSection>

          <SettingsSection title="Stripe" description="Payment processing" index={3}>
            <FieldRow label="Public Key">
              <input
                type="password"
                value={api.stripePublicKey}
                onChange={(e) => setApi({ ...api, stripePublicKey: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
          </SettingsSection>

          <SettingsSection title="OpenAI / Claude" description="AI content generation" index={4}>
            <FieldRow label="API Key">
              <input
                type="password"
                value={api.openaiApiKey}
                onChange={(e) => setApi({ ...api, openaiApiKey: e.target.value })}
                className="admin-input text-sm font-mono"
              />
            </FieldRow>
          </SettingsSection>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-4 border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-400">Security Notice</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  API keys are stored in environment variables on the server. Changes here update
                  the admin UI only. Use <code className="text-xs bg-admin-bg px-1 py-0.5 rounded font-mono">.env.local</code> files
                  for actual deployments.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===================== PERMISSIONS TAB ===================== */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 border-blue-500/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">🛡️</span>
              <div>
                <p className="text-sm font-medium text-blue-400">Everything Goes Through Admin</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  By default, all non-admin permissions are OFF. Admins retain full access to everything regardless
                  of these settings. Toggle permissions below to delegate specific capabilities to Editors and Writers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Brand-level access explanation */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-panel p-4 border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-lg">🏷️</span>
              <div>
                <p className="text-sm font-medium text-amber-400">Per-User Brand Access</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Not every team member has access to all 4 brands. Brand access is controlled per-user in the{' '}
                  <strong className="text-white">Writers</strong> page — click any user, go to the Edit tab, and
                  toggle which brands they can work on. By default, new users have <strong className="text-white">no brand access</strong> until
                  explicitly granted by an admin.
                </p>
                <div className="flex gap-3 mt-2">
                  {(['saucewire', 'trapglow', 'saucecaviar', 'trapfrequency'] as const).map((brand) => (
                    <span key={brand} className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: brand === 'saucewire' ? '#E63946' : brand === 'trapglow' ? '#8B5CF6' : brand === 'saucecaviar' ? '#C9A84C' : '#39FF14' }}
                      />
                      {brand === 'saucewire' ? 'SauceWire' : brand === 'trapglow' ? 'TrapGlow' : brand === 'saucecaviar' ? 'SauceCaviar' : 'TrapFrequency'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editor Permissions */}
          <SettingsSection
            title="Editor Permissions"
            description={`${editorActiveCount}/${EDITOR_PERMISSIONS.length} permissions active`}
            index={0}
          >
            <div className="space-y-1">
              {EDITOR_PERMISSIONS.map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors -mx-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                        permissions.editor[perm.key] ? 'bg-purple-400' : 'bg-gray-600'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-white font-medium">{perm.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermission('editor', perm.key, !permissions.editor[perm.key])}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      permissions.editor[perm.key] ? '' : 'bg-gray-700'
                    }`}
                    style={permissions.editor[perm.key] ? { backgroundColor: '#8B5CF6' } : undefined}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: permissions.editor[perm.key] ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Writer Permissions */}
          <SettingsSection
            title="Writer Permissions"
            description={`${writerActiveCount}/${WRITER_PERMISSIONS.length} permissions active`}
            index={1}
          >
            <div className="space-y-1">
              {WRITER_PERMISSIONS.map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors -mx-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                        permissions.writer[perm.key] ? 'bg-emerald-400' : 'bg-gray-600'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-white font-medium">{perm.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermission('writer', perm.key, !permissions.writer[perm.key])}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      permissions.writer[perm.key] ? '' : 'bg-gray-700'
                    }`}
                    style={permissions.writer[perm.key] ? { backgroundColor: '#10B981' } : undefined}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: permissions.writer[perm.key] ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Permission Summary */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Permission Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {/* Admin */}
                <div className="glass-panel p-4 border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">👑</span>
                    <h4 className="text-sm font-bold text-white">Admin</h4>
                  </div>
                  <div className="space-y-1.5">
                    {['Full access', 'Manage users', 'All settings', 'API keys', 'Publish anything'].map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-400">{p}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-blue-400/60 font-mono mt-3 uppercase tracking-wider">Always on</p>
                </div>

                {/* Editor */}
                <div className="glass-panel p-4 border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">✏️</span>
                    <h4 className="text-sm font-bold text-white">Editor</h4>
                  </div>
                  <div className="space-y-1.5">
                    {EDITOR_PERMISSIONS.map((perm) => (
                      <div key={perm.key} className="flex items-center gap-2">
                        {permissions.editor[perm.key] ? (
                          <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={`text-xs ${permissions.editor[perm.key] ? 'text-gray-300' : 'text-gray-600'}`}>
                          {perm.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-purple-400/60 font-mono mt-3 uppercase tracking-wider">
                    {editorActiveCount}/{EDITOR_PERMISSIONS.length} active
                  </p>
                </div>

                {/* Writer */}
                <div className="glass-panel p-4 border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📝</span>
                    <h4 className="text-sm font-bold text-white">Writer</h4>
                  </div>
                  <div className="space-y-1.5">
                    {WRITER_PERMISSIONS.map((perm) => (
                      <div key={perm.key} className="flex items-center gap-2">
                        {permissions.writer[perm.key] ? (
                          <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={`text-xs ${permissions.writer[perm.key] ? 'text-gray-300' : 'text-gray-600'}`}>
                          {perm.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-400/60 font-mono mt-3 uppercase tracking-wider">
                    {writerActiveCount}/{WRITER_PERMISSIONS.length} active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-1">Change Password</h3>
            <p className="text-sm text-gray-500 mb-6">Update your login password. This takes effect immediately.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordStatus(null);

                if (passwordForm.newPassword.length < 8) {
                  setPasswordStatus({ message: 'Password must be at least 8 characters.', type: 'error' });
                  return;
                }
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                  setPasswordStatus({ message: 'Passwords do not match.', type: 'error' });
                  return;
                }

                setChangingPassword(true);
                try {
                  const { getSupabaseBrowserClient } = await import('@/lib/supabase');
                  const supabase = getSupabaseBrowserClient();
                  const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
                  if (error) throw error;
                  setPasswordStatus({ message: 'Password updated successfully!', type: 'success' });
                  setPasswordForm({ newPassword: '', confirmPassword: '' });
                } catch (err: any) {
                  setPasswordStatus({ message: err.message || 'Failed to update password.', type: 'error' });
                } finally {
                  setChangingPassword(false);
                }
              }}
              className="space-y-4 max-w-md"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="admin-input w-full"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="admin-input w-full"
                  placeholder="Re-enter new password"
                  required
                  minLength={8}
                />
              </div>

              {passwordStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    passwordStatus.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {passwordStatus.message}
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={changingPassword}
                className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {changingPassword ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Update Password
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
