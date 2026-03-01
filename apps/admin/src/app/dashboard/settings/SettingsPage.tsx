'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Brand } from '@media-network/shared';
import { SocialMediaSettingsTab } from '@/components/SocialMediaSettingsTab';

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
      <label className="text-sm text-gray-300 font-medium flex-shrink-0">{label}</label>
      <div className="flex-1 sm:max-w-sm">{children}</div>
    </div>
  );
}

// ======================== MAIN COMPONENT ========================

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'brands' | 'ai' | 'api' | 'social'>('general');
  const [general, setGeneral] = useState(INITIAL_GENERAL);
  const [brandSettings, setBrandSettings] = useState(INITIAL_BRAND_SETTINGS);
  const [api, setApi] = useState(INITIAL_API);
  const [activeBrandTab, setActiveBrandTab] = useState<Brand>('saucewire');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateBrand = (brand: Brand, key: keyof BrandSettings, value: unknown) => {
    setBrandSettings((prev) => ({
      ...prev,
      [brand]: { ...prev[brand], [key]: value },
    }));
  };

  const tabs = [
    { key: 'general' as const, label: 'General', icon: '⚙️' },
    { key: 'brands' as const, label: 'Brands', icon: '🏷️' },
    { key: 'ai' as const, label: 'AI Pipeline', icon: '🤖' },
    { key: 'api' as const, label: 'API Keys', icon: '🔑' },
    { key: 'social' as const, label: 'Social Media', icon: '📱' },
  ];

  const currentBrand = brandSettings[activeBrandTab];
  const brandConfig = BRAND_CONFIGS[activeBrandTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
      <div className="flex gap-1 border-b border-white/[0.06] pb-px overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
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
          <div className="flex gap-2 flex-wrap">
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

      {/* ===================== SOCIAL MEDIA TAB ===================== */}
      {activeTab === 'social' && <SocialMediaSettingsTab />}
    </div>
  );
}
