import type { Brand } from '@media-network/shared';

// ======================== FIELD DEFINITIONS ========================

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'url' | 'toggle' | 'tags' | 'color';

export interface BrandField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  group?: string; // group fields together in the form
  helpText?: string;
  min?: number;
  max?: number;
}

export interface BrandFormConfig {
  id: Brand;
  name: string;
  description: string;
  icon: string;
  color: string;
  contentTypes: {
    id: string;
    label: string;
    description: string;
    fields: BrandField[];
  }[];
}

// ======================== SHARED FIELDS ========================

const COMMON_FIELDS: BrandField[] = [
  { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter article title...', required: true },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Brief summary...', group: 'content' },
  { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Write your article content... (supports HTML)', required: true, group: 'content' },
  { key: 'cover_image', label: 'Cover Image URL', type: 'url', placeholder: 'https://images.unsplash.com/...', group: 'media' },
  { key: 'tags', label: 'Tags', type: 'tags', placeholder: 'hip-hop, music, breaking-news', group: 'meta' },
];

// ======================== BRAND CONFIGS ========================

export const BRAND_FORM_CONFIGS: Record<Brand, BrandFormConfig> = {
  // ---- SAUCEWIRE: News Wire ----
  saucewire: {
    id: 'saucewire',
    name: 'SauceWire',
    description: 'Culture. Connected. Now.',
    icon: '⚡',
    color: '#E63946',
    contentTypes: [
      {
        id: 'article',
        label: 'News Article',
        description: 'Standard news article for SauceWire',
        fields: [
          ...COMMON_FIELDS,
          { key: 'is_breaking', label: 'Breaking News', type: 'toggle', group: 'flags', helpText: 'Shows breaking news banner on site' },
          { key: 'source_url', label: 'Source URL', type: 'url', placeholder: 'https://...', group: 'meta', helpText: 'Original source attribution' },
          { key: 'urgency', label: 'Urgency Level', type: 'select', group: 'meta', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'developing', label: 'Developing Story' },
            { value: 'breaking', label: 'Breaking' },
            { value: 'exclusive', label: 'Exclusive' },
          ]},
          { key: 'related_brands', label: 'Cross-Post to', type: 'tags', placeholder: 'saucecaviar, trapglow', group: 'distribution', helpText: 'Other brands to cross-post this article to' },
        ],
      },
    ],
  },

  // ---- SAUCECAVIAR: Luxury Magazine ----
  saucecaviar: {
    id: 'saucecaviar',
    name: 'SauceCaviar',
    description: 'Culture Served Premium',
    icon: '🥂',
    color: '#C9A84C',
    contentTypes: [
      {
        id: 'feature',
        label: 'Feature Article',
        description: 'Long-form feature for the magazine',
        fields: [
          ...COMMON_FIELDS,
          { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'A secondary headline...', group: 'content' },
          { key: 'issue_number', label: 'Issue Number', type: 'number', placeholder: '1', group: 'magazine', helpText: 'Which magazine issue this belongs to' },
          { key: 'section', label: 'Magazine Section', type: 'select', group: 'magazine', options: [
            { value: 'cover-story', label: 'Cover Story' },
            { value: 'feature', label: 'Feature' },
            { value: 'culture', label: 'Culture' },
            { value: 'style', label: 'Style & Fashion' },
            { value: 'editorial', label: 'Editorial' },
            { value: 'interview', label: 'Interview' },
          ]},
          { key: 'luxury_brands', label: 'Featured Brands', type: 'tags', placeholder: 'Louis Vuitton, Gucci, Balenciaga', group: 'magazine', helpText: 'Luxury brands mentioned in this article' },
          { key: 'photographer', label: 'Photographer', type: 'text', placeholder: 'Photographer name', group: 'credits' },
          { key: 'stylist', label: 'Stylist', type: 'text', placeholder: 'Stylist name', group: 'credits' },
          { key: 'layout_style', label: 'Layout Style', type: 'select', group: 'design', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'full-bleed', label: 'Full Bleed (immersive)' },
            { value: 'editorial-grid', label: 'Editorial Grid' },
            { value: 'photo-essay', label: 'Photo Essay' },
          ]},
          { key: 'ad_placement', label: 'Ad Placement', type: 'select', group: 'monetization', options: [
            { value: 'none', label: 'No Ads' },
            { value: 'sidebar', label: 'Sidebar Ad' },
            { value: 'mid-article', label: 'Mid-Article' },
            { value: 'premium', label: 'Premium Sponsor' },
          ]},
        ],
      },
    ],
  },

  // ---- TRAPGLOW: Artist Discovery ----
  trapglow: {
    id: 'trapglow',
    name: 'TrapGlow',
    description: 'Shining Light on What\'s Next',
    icon: '✨',
    color: '#8B5CF6',
    contentTypes: [
      {
        id: 'artist-spotlight',
        label: 'Artist Spotlight',
        description: 'Featured artist profile & discovery',
        fields: [
          ...COMMON_FIELDS,
          { key: 'artist_name', label: 'Artist Name', type: 'text', placeholder: 'Artist / Stage Name', required: true, group: 'artist' },
          { key: 'artist_real_name', label: 'Real Name', type: 'text', placeholder: 'Legal name (optional)', group: 'artist' },
          { key: 'genre', label: 'Primary Genre', type: 'select', required: true, group: 'artist', options: [
            { value: 'hip-hop', label: 'Hip-Hop' },
            { value: 'rnb', label: 'R&B' },
            { value: 'pop', label: 'Pop' },
            { value: 'electronic', label: 'Electronic' },
            { value: 'alternative', label: 'Alternative' },
            { value: 'latin', label: 'Latin' },
            { value: 'afrobeats', label: 'Afrobeats' },
          ]},
          { key: 'subgenres', label: 'Sub-Genres', type: 'tags', placeholder: 'trap, melodic rap, drill', group: 'artist' },
          { key: 'location', label: 'Artist Location', type: 'text', placeholder: 'Miami, FL', group: 'artist' },
          { key: 'spotify_url', label: 'Spotify', type: 'url', placeholder: 'https://open.spotify.com/artist/...', group: 'streaming' },
          { key: 'apple_music_url', label: 'Apple Music', type: 'url', placeholder: 'https://music.apple.com/...', group: 'streaming' },
          { key: 'soundcloud_url', label: 'SoundCloud', type: 'url', placeholder: 'https://soundcloud.com/...', group: 'streaming' },
          { key: 'youtube_url', label: 'YouTube', type: 'url', placeholder: 'https://youtube.com/@...', group: 'streaming' },
          { key: 'instagram', label: 'Instagram', type: 'text', placeholder: '@handle', group: 'social' },
          { key: 'twitter', label: 'X (Twitter)', type: 'text', placeholder: '@handle', group: 'social' },
          { key: 'tiktok', label: 'TikTok', type: 'text', placeholder: '@handle', group: 'social' },
          { key: 'is_featured', label: 'Featured Artist', type: 'toggle', group: 'flags', helpText: 'Pin to featured section on homepage' },
          { key: 'discovery_date', label: 'Discovery Date', type: 'text', placeholder: 'YYYY-MM-DD', group: 'meta', helpText: 'When TrapGlow first found this artist' },
          { key: 'monthly_listeners', label: 'Monthly Listeners', type: 'number', placeholder: '50000', group: 'stats', helpText: 'Approx Spotify monthly listeners' },
        ],
      },
      {
        id: 'blog',
        label: 'Blog Post',
        description: 'General music blog post',
        fields: [
          ...COMMON_FIELDS,
          { key: 'related_artists', label: 'Related Artists', type: 'tags', placeholder: 'Drake, Future, Metro Boomin', group: 'music' },
          { key: 'embed_url', label: 'Embed URL', type: 'url', placeholder: 'YouTube/Spotify embed URL', group: 'media', helpText: 'Video or music player embed' },
        ],
      },
    ],
  },

  // ---- TRAPFREQUENCY: Production Hub ----
  trapfrequency: {
    id: 'trapfrequency',
    name: 'TrapFrequency',
    description: 'Tune Into The Craft',
    icon: '🎛️',
    color: '#39FF14',
    contentTypes: [
      {
        id: 'tutorial',
        label: 'Tutorial',
        description: 'Production tutorial / how-to',
        fields: [
          ...COMMON_FIELDS,
          { key: 'difficulty', label: 'Difficulty Level', type: 'select', required: true, group: 'tutorial', options: [
            { value: 'beginner', label: '🟢 Beginner' },
            { value: 'intermediate', label: '🟡 Intermediate' },
            { value: 'advanced', label: '🔴 Advanced' },
            { value: 'masterclass', label: '⚫ Masterclass' },
          ]},
          { key: 'daw', label: 'DAW', type: 'select', group: 'tutorial', options: [
            { value: 'fl-studio', label: 'FL Studio' },
            { value: 'ableton', label: 'Ableton Live' },
            { value: 'logic', label: 'Logic Pro' },
            { value: 'pro-tools', label: 'Pro Tools' },
            { value: 'studio-one', label: 'Studio One' },
            { value: 'any', label: 'Any / Universal' },
          ]},
          { key: 'tutorial_type', label: 'Tutorial Type', type: 'select', group: 'tutorial', options: [
            { value: 'mixing', label: 'Mixing' },
            { value: 'mastering', label: 'Mastering' },
            { value: 'sound-design', label: 'Sound Design' },
            { value: 'arrangement', label: 'Arrangement' },
            { value: 'sampling', label: 'Sampling' },
            { value: 'workflow', label: 'Workflow Tips' },
          ]},
          { key: 'video_url', label: 'Video Tutorial URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'media' },
          { key: 'download_url', label: 'Project File Download', type: 'url', placeholder: 'Download link for project files', group: 'media' },
        ],
      },
      {
        id: 'beat',
        label: 'Beat Showcase',
        description: 'Beat or instrumental spotlight',
        fields: [
          ...COMMON_FIELDS,
          { key: 'bpm', label: 'BPM', type: 'number', placeholder: '140', required: true, group: 'beat-info', min: 40, max: 300 },
          { key: 'musical_key', label: 'Key', type: 'select', required: true, group: 'beat-info', options: [
            { value: 'C', label: 'C Major' }, { value: 'Cm', label: 'C Minor' },
            { value: 'D', label: 'D Major' }, { value: 'Dm', label: 'D Minor' },
            { value: 'E', label: 'E Major' }, { value: 'Em', label: 'E Minor' },
            { value: 'F', label: 'F Major' }, { value: 'Fm', label: 'F Minor' },
            { value: 'G', label: 'G Major' }, { value: 'Gm', label: 'G Minor' },
            { value: 'A', label: 'A Major' }, { value: 'Am', label: 'A Minor' },
            { value: 'B', label: 'B Major' }, { value: 'Bm', label: 'B Minor' },
          ]},
          { key: 'beat_genre', label: 'Beat Genre', type: 'select', group: 'beat-info', options: [
            { value: 'trap', label: 'Trap' },
            { value: 'drill', label: 'Drill' },
            { value: 'boom-bap', label: 'Boom Bap' },
            { value: 'rnb', label: 'R&B' },
            { value: 'lo-fi', label: 'Lo-Fi' },
            { value: 'rage', label: 'Rage' },
            { value: 'afro', label: 'Afro' },
            { value: 'jersey-club', label: 'Jersey Club' },
          ]},
          { key: 'producer_name', label: 'Producer', type: 'text', placeholder: 'Producer name', group: 'credits' },
          { key: 'beat_audio_url', label: 'Beat Audio URL', type: 'url', placeholder: 'https://...mp3', group: 'media', helpText: 'Direct link to the beat audio file' },
          { key: 'sample_pack_url', label: 'Sample Pack Link', type: 'url', placeholder: 'https://...', group: 'media' },
          { key: 'license_type', label: 'License', type: 'select', group: 'meta', options: [
            { value: 'free', label: 'Free' },
            { value: 'lease', label: 'Lease' },
            { value: 'exclusive', label: 'Exclusive' },
            { value: 'collab', label: 'Open for Collab' },
          ]},
        ],
      },
      {
        id: 'gear',
        label: 'Gear Review',
        description: 'Hardware / software review',
        fields: [
          ...COMMON_FIELDS,
          { key: 'gear_name', label: 'Product Name', type: 'text', placeholder: 'Roland SP-404 MKII', required: true, group: 'gear' },
          { key: 'gear_type', label: 'Gear Type', type: 'select', group: 'gear', options: [
            { value: 'hardware', label: 'Hardware' },
            { value: 'software', label: 'Software / Plugin' },
            { value: 'controller', label: 'Controller' },
            { value: 'headphones', label: 'Headphones / Monitors' },
            { value: 'mic', label: 'Microphone' },
            { value: 'interface', label: 'Audio Interface' },
          ]},
          { key: 'price', label: 'Price', type: 'text', placeholder: '$299', group: 'gear' },
          { key: 'rating', label: 'Rating (1-10)', type: 'number', placeholder: '8', group: 'gear', min: 1, max: 10 },
          { key: 'pros', label: 'Pros', type: 'tags', placeholder: 'Great sound, Portable, Affordable', group: 'review' },
          { key: 'cons', label: 'Cons', type: 'tags', placeholder: 'Small screen, No Bluetooth', group: 'review' },
          { key: 'buy_url', label: 'Buy Link', type: 'url', placeholder: 'https://...', group: 'gear' },
        ],
      },
    ],
  },
};

// ======================== HELPERS ========================

export function getBrandFormConfig(brand: Brand): BrandFormConfig {
  return BRAND_FORM_CONFIGS[brand];
}

export function getContentTypeFields(brand: Brand, contentTypeId: string): BrandField[] {
  const config = BRAND_FORM_CONFIGS[brand];
  const contentType = config.contentTypes.find(ct => ct.id === contentTypeId);
  return contentType?.fields || config.contentTypes[0].fields;
}

export function getFieldGroups(fields: BrandField[]): Map<string, BrandField[]> {
  const groups = new Map<string, BrandField[]>();
  for (const field of fields) {
    const group = field.group || 'general';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(field);
  }
  return groups;
}

export const GROUP_LABELS: Record<string, string> = {
  general: 'General',
  content: 'Content',
  media: 'Media',
  meta: 'Metadata',
  flags: 'Options',
  distribution: 'Distribution',
  magazine: 'Magazine',
  credits: 'Credits',
  design: 'Design',
  monetization: 'Monetization',
  artist: 'Artist Info',
  streaming: 'Streaming Links',
  social: 'Social Media',
  stats: 'Stats',
  music: 'Music',
  tutorial: 'Tutorial Details',
  'beat-info': 'Beat Info',
  gear: 'Gear Details',
  review: 'Review',
};
