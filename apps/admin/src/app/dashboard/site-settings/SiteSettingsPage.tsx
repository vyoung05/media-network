'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ======================== TYPES ========================

interface BrandSettings {
  id: string;
  brand: string;
  site_name: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  logo_url: string;
  logo_dark_url: string;
  favicon_url: string;
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  og_image_url: string;
  footer_text: string;
  social_links: Record<string, string>;
  custom_css: string;
  custom_fonts: { heading: string; body: string };
  navigation_items: Array<{ label: string; url: string }>;
  is_maintenance: boolean;
  maintenance_message: string;
  analytics_id: string;
  updated_at: string;
}

type Brand = 'saucecaviar' | 'trapglow' | 'saucewire' | 'trapfrequency';

const BRAND_META: Record<Brand, { name: string; color: string }> = {
  saucecaviar: { name: 'SauceCaviar', color: '#C9A84C' },
  trapglow: { name: 'TrapGlow', color: '#8B5CF6' },
  saucewire: { name: 'SauceWire', color: '#E63946' },
  trapfrequency: { name: 'TrapFrequency', color: '#39FF14' },
};

const BRANDS = Object.keys(BRAND_META) as Brand[];

const FONT_OPTIONS = [
  'Inter', 'Playfair Display', 'Space Grotesk', 'JetBrains Mono', 'Poppins',
  'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Raleway', 'Oswald',
  'Merriweather', 'Nunito', 'DM Sans', 'Outfit', 'Plus Jakarta Sans',
  'Sora', 'Clash Display', 'Cabinet Grotesk', 'General Sans',
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter / X', icon: '𝕏' },
  { key: 'instagram', label: 'Instagram', icon: '📷' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
  { key: 'spotify', label: 'Spotify', icon: '🎧' },
  { key: 'soundcloud', label: 'SoundCloud', icon: '☁️' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'discord', label: 'Discord', icon: '💬' },
  { key: 'threads', label: 'Threads', icon: '@' },
];

// ======================== SUBCOMPONENTS ========================

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  brandColor,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  brandColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6 pt-2 space-y-4 border-t border-white/[0.06]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent"
          style={{ padding: 0 }}
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-gray-400 block mb-1">{label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        />
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const Component = multiline ? 'textarea' : 'input';
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <Component
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900">
            {opt}
          </option>
        ))}
      </select>
    </div>
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
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? '' : 'bg-gray-700'}`}
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

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </motion.div>
  );
}

// ======================== MAIN PAGE ========================

export function SiteSettingsPage() {
  const [activeBrand, setActiveBrand] = useState<Brand>('saucecaviar');
  const [settings, setSettings] = useState<Record<string, BrandSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const brandColor = BRAND_META[activeBrand].color;
  const current = settings[activeBrand];

  // Fetch all brand settings
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/brand-settings');
        const json = await res.json();
        if (json.data) {
          const map: Record<string, BrandSettings> = {};
          json.data.forEach((s: BrandSettings) => {
            map[s.brand] = s;
          });
          setSettings(map);
        }
      } catch (err) {
        console.error('Failed to load brand settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateField = useCallback(
    (field: keyof BrandSettings, value: unknown) => {
      setSettings((prev) => ({
        ...prev,
        [activeBrand]: { ...prev[activeBrand], [field]: value },
      }));
      setHasChanges(true);
    },
    [activeBrand]
  );

  const updateSocialLink = useCallback(
    (platform: string, url: string) => {
      setSettings((prev) => ({
        ...prev,
        [activeBrand]: {
          ...prev[activeBrand],
          social_links: { ...prev[activeBrand]?.social_links, [platform]: url },
        },
      }));
      setHasChanges(true);
    },
    [activeBrand]
  );

  const updateFont = useCallback(
    (type: 'heading' | 'body', font: string) => {
      setSettings((prev) => ({
        ...prev,
        [activeBrand]: {
          ...prev[activeBrand],
          custom_fonts: { ...prev[activeBrand]?.custom_fonts, [type]: font },
        },
      }));
      setHasChanges(true);
    },
    [activeBrand]
  );

  const addNavItem = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      [activeBrand]: {
        ...prev[activeBrand],
        navigation_items: [...(prev[activeBrand]?.navigation_items || []), { label: '', url: '' }],
      },
    }));
    setHasChanges(true);
  }, [activeBrand]);

  const updateNavItem = useCallback(
    (index: number, field: 'label' | 'url', value: string) => {
      setSettings((prev) => {
        const items = [...(prev[activeBrand]?.navigation_items || [])];
        items[index] = { ...items[index], [field]: value };
        return { ...prev, [activeBrand]: { ...prev[activeBrand], navigation_items: items } };
      });
      setHasChanges(true);
    },
    [activeBrand]
  );

  const removeNavItem = useCallback(
    (index: number) => {
      setSettings((prev) => {
        const items = [...(prev[activeBrand]?.navigation_items || [])];
        items.splice(index, 1);
        return { ...prev, [activeBrand]: { ...prev[activeBrand], navigation_items: items } };
      });
      setHasChanges(true);
    },
    [activeBrand]
  );

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const { id, updated_at, ...payload } = current;
      const res = await fetch('/api/brand-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      if (json.data) {
        setSettings((prev) => ({ ...prev, [activeBrand]: json.data }));
      }
      setHasChanges(false);
      setToast(`${BRAND_META[activeBrand].name} settings saved!`);
    } catch (err: any) {
      setToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Customize branding, colors, and content for each site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: hasChanges ? brandColor : undefined,
            color: hasChanges ? '#000' : undefined,
          }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Brand Tabs */}
      <div className="flex gap-2 flex-wrap">
        {BRANDS.map((brand) => {
          const meta = BRAND_META[brand];
          const isActive = activeBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}40` } : { border: '1px solid transparent' }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: meta.color, boxShadow: isActive ? `0 0 8px ${meta.color}` : 'none' }}
              />
              {meta.name}
              {isActive && (
                <motion.div
                  layoutId="brand-indicator"
                  className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {!current ? (
        <div className="glass-panel p-12 text-center text-gray-400">No settings found for {BRAND_META[activeBrand].name}</div>
      ) : (
        <div className="space-y-4">
          {/* Section 1: Branding */}
          <CollapsibleSection title="Branding" icon="🏷️" defaultOpen brandColor={brandColor}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Site Name" value={current.site_name} onChange={(v) => updateField('site_name', v)} placeholder="Brand name" />
              <TextInput label="Tagline" value={current.tagline} onChange={(v) => updateField('tagline', v)} placeholder="Your brand tagline" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Logo URL" value={current.logo_url} onChange={(v) => updateField('logo_url', v)} placeholder="https://..." />
              <TextInput label="Logo (Dark)" value={current.logo_dark_url} onChange={(v) => updateField('logo_dark_url', v)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Favicon URL" value={current.favicon_url} onChange={(v) => updateField('favicon_url', v)} placeholder="https://..." />
              <TextInput label="OG Image URL" value={current.og_image_url} onChange={(v) => updateField('og_image_url', v)} placeholder="https://..." />
            </div>
            {/* Logo Preview */}
            {current.logo_url && (
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <img src={current.logo_url} alt="Logo" className="h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs text-gray-500">Logo preview</span>
              </div>
            )}
          </CollapsibleSection>

          {/* Section 2: Colors */}
          <CollapsibleSection title="Colors" icon="🎨" defaultOpen brandColor={brandColor}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ColorPicker label="Primary" value={current.primary_color} onChange={(v) => updateField('primary_color', v)} />
              <ColorPicker label="Secondary" value={current.secondary_color} onChange={(v) => updateField('secondary_color', v)} />
              <ColorPicker label="Accent" value={current.accent_color} onChange={(v) => updateField('accent_color', v)} />
              <ColorPicker label="Background" value={current.background_color} onChange={(v) => updateField('background_color', v)} />
              <ColorPicker label="Text" value={current.text_color} onChange={(v) => updateField('text_color', v)} />
            </div>
            {/* Live Palette Preview */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Palette Preview</p>
              <div className="flex gap-2 items-center">
                {[current.primary_color, current.secondary_color, current.accent_color, current.background_color, current.text_color].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-lg border border-white/10 shadow-lg" style={{ backgroundColor: c || '#000' }} />
                    <span className="text-[10px] text-gray-500 font-mono">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 3: Hero */}
          <CollapsibleSection title="Hero Section" icon="🖼️" brandColor={brandColor}>
            <TextInput label="Hero Image URL" value={current.hero_image_url} onChange={(v) => updateField('hero_image_url', v)} placeholder="https://..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Hero Title" value={current.hero_title} onChange={(v) => updateField('hero_title', v)} placeholder="Welcome to..." />
              <TextInput label="Hero Subtitle" value={current.hero_subtitle} onChange={(v) => updateField('hero_subtitle', v)} placeholder="Discover the best..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="CTA Button Text" value={current.hero_cta_text} onChange={(v) => updateField('hero_cta_text', v)} placeholder="Explore" />
              <TextInput label="CTA Button URL" value={current.hero_cta_url} onChange={(v) => updateField('hero_cta_url', v)} placeholder="/" />
            </div>
            {/* Mini Hero Preview */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Hero Preview</p>
              <div
                className="relative rounded-xl overflow-hidden h-40 flex flex-col items-center justify-center text-center p-6"
                style={{
                  backgroundColor: current.background_color || '#0A0A0F',
                  backgroundImage: current.hero_image_url ? `url(${current.hero_image_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {current.hero_image_url && <div className="absolute inset-0 bg-black/50" />}
                <div className="relative z-10">
                  <h4 className="text-lg font-bold" style={{ color: current.text_color || '#fff' }}>
                    {current.hero_title || 'Your Hero Title'}
                  </h4>
                  <p className="text-sm opacity-70 mt-1" style={{ color: current.text_color || '#fff' }}>
                    {current.hero_subtitle || 'Your subtitle here'}
                  </p>
                  <button
                    className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: current.primary_color, color: '#000' }}
                  >
                    {current.hero_cta_text || 'Explore'}
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 4: Typography */}
          <CollapsibleSection title="Typography" icon="🔤" brandColor={brandColor}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput label="Heading Font" value={current.custom_fonts?.heading || 'Inter'} onChange={(v) => updateFont('heading', v)} options={FONT_OPTIONS} />
              <SelectInput label="Body Font" value={current.custom_fonts?.body || 'Inter'} onChange={(v) => updateFont('body', v)} options={FONT_OPTIONS} />
            </div>
            <div className="mt-2 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500 mb-3">Font Preview</p>
              <p className="text-xl font-bold text-white" style={{ fontFamily: current.custom_fonts?.heading }}>
                {current.custom_fonts?.heading || 'Inter'} — Heading Font
              </p>
              <p className="text-sm text-gray-300 mt-2" style={{ fontFamily: current.custom_fonts?.body }}>
                This is how body text looks with {current.custom_fonts?.body || 'Inter'}. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 5: Navigation */}
          <CollapsibleSection title="Navigation" icon="🧭" brandColor={brandColor}>
            <div className="space-y-3">
              {(current.navigation_items || []).map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <TextInput label={`Label ${i + 1}`} value={item.label} onChange={(v) => updateNavItem(i, 'label', v)} placeholder="Home" />
                  <TextInput label={`URL ${i + 1}`} value={item.url} onChange={(v) => updateNavItem(i, 'url', v)} placeholder="/" />
                  <button onClick={() => removeNavItem(i)} className="mt-5 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addNavItem}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-dashed border-white/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Navigation Item
              </button>
            </div>
          </CollapsibleSection>

          {/* Section 6: Social Links */}
          <CollapsibleSection title="Social Links" icon="🔗" brandColor={brandColor}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_PLATFORMS.map((p) => (
                <div key={p.key} className="flex items-center gap-3">
                  <span className="text-lg w-8 text-center">{p.icon}</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">{p.label}</label>
                    <input
                      type="text"
                      value={current.social_links?.[p.key] || ''}
                      onChange={(e) => updateSocialLink(p.key, e.target.value)}
                      placeholder={`https://${p.key}.com/...`}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 7: Footer */}
          <CollapsibleSection title="Footer" icon="📄" brandColor={brandColor}>
            <TextInput label="Footer Text" value={current.footer_text} onChange={(v) => updateField('footer_text', v)} placeholder="© 2026 Brand. All rights reserved." />
          </CollapsibleSection>

          {/* Section 8: Advanced */}
          <CollapsibleSection title="Advanced" icon="⚙️" brandColor={brandColor}>
            <TextInput label="Google Analytics ID" value={current.analytics_id} onChange={(v) => updateField('analytics_id', v)} placeholder="G-XXXXXXXXXX" />
            <div className="space-y-4">
              <Toggle
                label="Maintenance Mode"
                description="When enabled, the site shows a maintenance page"
                checked={current.is_maintenance}
                onChange={(v) => updateField('is_maintenance', v)}
                color="#EF4444"
              />
              {current.is_maintenance && (
                <TextInput
                  label="Maintenance Message"
                  value={current.maintenance_message}
                  onChange={(v) => updateField('maintenance_message', v)}
                  placeholder="We'll be back soon."
                  multiline
                />
              )}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Custom CSS</label>
              <textarea
                value={current.custom_css || ''}
                onChange={(e) => updateField('custom_css', e.target.value)}
                placeholder=":root { --custom-var: #fff; }"
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-green-400 font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
              />
            </div>
          </CollapsibleSection>

          {/* Bottom Save */}
          <div className="flex justify-end pt-2 pb-8">
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              style={{
                backgroundColor: hasChanges ? brandColor : '#333',
                color: hasChanges ? '#000' : '#666',
                boxShadow: hasChanges ? `0 4px 20px ${brandColor}40` : 'none',
              }}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
