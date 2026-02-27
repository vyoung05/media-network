import type { Article, User } from '@media-network/shared';

// ======================== TYPES ========================

export interface Artist {
  id: string;
  name: string;
  slug: string;
  real_name: string | null;
  avatar: string;
  cover_image: string;
  bio: string;
  genre: string[];
  mood: string[];
  region: string;
  city: string;
  social: {
    spotify?: string;
    soundcloud?: string;
    apple_music?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  spotify_embed?: string;
  soundcloud_embed?: string;
  apple_music_embed?: string;
  monthly_listeners: number;
  followers: number;
  glow_score: number; // 0-100, the "Glow Up" ranking score
  glow_trend: 'rising' | 'steady' | 'new';
  is_featured: boolean;
  is_daily_pick: boolean;
  featured_track: string;
  featured_track_url: string | null;
  tags: string[];
  gallery: string[];
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  category: string;
  tags: string[];
  author: User;
  artist_id?: string;
  reading_time_minutes: number;
  view_count: number;
  published_at: string;
  created_at: string;
}

// ======================== GENRES & MOODS ========================

export const GENRES = [
  'Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin',
  'Afrobeats', 'Neo-Soul', 'Indie', 'Trap', 'Drill', 'Rage',
] as const;

export const MOODS = [
  'Chill', 'Hype', 'Emotional', 'Dark', 'Feel-Good', 'Experimental',
  'Melodic', 'Aggressive', 'Dreamy', 'Late Night',
] as const;

export const REGIONS = [
  'East Coast', 'West Coast', 'South', 'Midwest', 'UK', 'Toronto',
  'Atlanta', 'Lagos', 'Paris', 'International',
] as const;

// ======================== MOCK AUTHORS ========================

const authors: User[] = [
  {
    id: 'tg-author-1',
    email: 'nova@trapglow.com',
    name: 'Nova Eclipse',
    role: 'editor',
    avatar_url: null,
    bio: 'Music curator and culture writer. Ear to the ground, eyes on the horizon.',
    links: { twitter: 'https://twitter.com/novaeclipse', instagram: 'https://instagram.com/novaeclipse' },
    brand_affiliations: ['trapglow'],
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tg-author-2',
    email: 'jaylen@trapglow.com',
    name: 'Jaylen Morris',
    role: 'writer',
    avatar_url: null,
    bio: 'Hip-hop journalist. Interviewed 200+ artists. Co-sign machine.',
    links: { twitter: 'https://twitter.com/jaylenmorris' },
    brand_affiliations: ['trapglow', 'saucewire'],
    is_verified: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'tg-author-3',
    email: 'aria@trapglow.com',
    name: 'Aria Fontaine',
    role: 'writer',
    avatar_url: null,
    bio: 'R&B specialist. Vinyl collector. Believes in the album experience.',
    links: { instagram: 'https://instagram.com/ariafontaine' },
    brand_affiliations: ['trapglow'],
    is_verified: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tg-author-4',
    email: 'kai@trapglow.com',
    name: 'Kai Reeves',
    role: 'writer',
    avatar_url: null,
    bio: 'Electronic music and Afrobeats correspondent. Festival circuit regular.',
    links: { twitter: 'https://twitter.com/kaireeves' },
    brand_affiliations: ['trapglow'],
    is_verified: false,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];

// ======================== MOCK ARTISTS ========================

export const mockArtists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Velvet Roux',
    slug: 'velvet-roux',
    real_name: 'Destiny Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600',
    bio: 'Velvet Roux emerged from Atlanta\'s underground scene with a voice that blends silk and fire. Her debut EP "Midnight Honey" fused neo-soul with trap production, earning comparisons to early SZA and Jhené Aiko. Now on her third project, she\'s carved out a lane that\'s entirely her own — lush harmonies over 808s, lyrics about self-worth and late-night drives through the city.',
    genre: ['R&B', 'Neo-Soul', 'Hip-Hop'],
    mood: ['Melodic', 'Dreamy', 'Late Night'],
    region: 'South',
    city: 'Atlanta, GA',
    social: {
      spotify: 'https://open.spotify.com/artist/velvetroux',
      instagram: 'https://instagram.com/velvetroux',
      twitter: 'https://twitter.com/velvetroux',
      tiktok: 'https://tiktok.com/@velvetroux',
      soundcloud: 'https://soundcloud.com/velvetroux',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/4PTG3Z6ehGkBFwjybzWkR8',
    monthly_listeners: 284000,
    followers: 156000,
    glow_score: 94,
    glow_trend: 'rising',
    is_featured: true,
    is_daily_pick: true,
    featured_track: 'Satin Dreams',
    featured_track_url: null,
    tags: ['neo-soul', 'female-vocalist', 'atlanta', 'rising'],
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=800',
    ],
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'artist-2',
    name: 'Pharaoh Bliss',
    slug: 'pharaoh-bliss',
    real_name: 'Marcus Jordan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    cover_image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1600',
    bio: 'Pharaoh Bliss is Chicago\'s latest prodigy — a producer-rapper hybrid who builds his beats from scratch and then floats over them. His sound sits at the intersection of drill and jazz, sampling Coltrane over sliding 808s. He sold out Metro Chicago three times before ever releasing a full album.',
    genre: ['Hip-Hop', 'Drill', 'Alternative'],
    mood: ['Dark', 'Experimental', 'Aggressive'],
    region: 'Midwest',
    city: 'Chicago, IL',
    social: {
      spotify: 'https://open.spotify.com/artist/pharaohbliss',
      soundcloud: 'https://soundcloud.com/pharaohbliss',
      instagram: 'https://instagram.com/pharaohbliss',
      youtube: 'https://youtube.com/@pharaohbliss',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/2Fxmhks0bxGSBdJ92vM42m',
    monthly_listeners: 512000,
    followers: 289000,
    glow_score: 97,
    glow_trend: 'rising',
    is_featured: true,
    is_daily_pick: false,
    featured_track: 'Gold Casket',
    featured_track_url: null,
    tags: ['drill', 'jazz-rap', 'chicago', 'producer'],
    gallery: [
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
      'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800',
    ],
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'artist-3',
    name: 'Luna Sage',
    slug: 'luna-sage',
    real_name: 'Selena Okafor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600',
    bio: 'Nigerian-American singer Luna Sage fuses Afrobeats rhythms with indie pop sensibilities. Raised in Houston but rooted in Lagos, her music carries the weight of two worlds — amapiano-inspired grooves meet confessional songwriting. Her track "Oshun\'s Daughter" has 40M streams and counting.',
    genre: ['Afrobeats', 'Pop', 'Indie'],
    mood: ['Feel-Good', 'Melodic', 'Dreamy'],
    region: 'South',
    city: 'Houston, TX',
    social: {
      spotify: 'https://open.spotify.com/artist/lunasage',
      apple_music: 'https://music.apple.com/us/artist/luna-sage',
      instagram: 'https://instagram.com/lunasage',
      tiktok: 'https://tiktok.com/@lunasage',
    },
    apple_music_embed: 'https://embed.music.apple.com/us/album/oshuns-daughter/1234567890',
    monthly_listeners: 890000,
    followers: 430000,
    glow_score: 91,
    glow_trend: 'rising',
    is_featured: true,
    is_daily_pick: true,
    featured_track: "Oshun's Daughter",
    featured_track_url: null,
    tags: ['afrobeats', 'indie-pop', 'houston', 'nigerian'],
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    ],
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'artist-4',
    name: 'KODA',
    slug: 'koda',
    real_name: 'Kofi Darko',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600',
    bio: 'KODA doesn\'t follow trends — he sets them. The London-born, Toronto-raised artist pioneered a sound he calls "neon trap": futuristic synth work layered over hard-hitting drums with autotuned melodies that stick in your head for weeks. His debut album "Signal Lost" debuted at #14 on the Billboard 200.',
    genre: ['Trap', 'Electronic', 'Hip-Hop'],
    mood: ['Hype', 'Dark', 'Experimental'],
    region: 'Toronto',
    city: 'Toronto, ON',
    social: {
      spotify: 'https://open.spotify.com/artist/koda',
      soundcloud: 'https://soundcloud.com/kodamusic',
      instagram: 'https://instagram.com/koda',
      twitter: 'https://twitter.com/kodaofficial',
      youtube: 'https://youtube.com/@kodamusic',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp',
    soundcloud_embed: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/koda-signal',
    monthly_listeners: 1240000,
    followers: 670000,
    glow_score: 99,
    glow_trend: 'rising',
    is_featured: true,
    is_daily_pick: false,
    featured_track: 'Signal Lost',
    featured_track_url: null,
    tags: ['neon-trap', 'toronto', 'electronic', 'billboard'],
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    ],
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'artist-5',
    name: 'Mira Voss',
    slug: 'mira-voss',
    real_name: 'Amira Vasquez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    cover_image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600',
    bio: 'Mira Voss brings the heat of Miami\'s Latin underground to the mainstream. Bilingual bars over reggaeton-trap fusions have made her the voice of a new generation. "Fuego Lento" spent 12 weeks on Spotify\'s Viral 50 chart, and her live shows are pure chaos — in the best way.',
    genre: ['Latin', 'Hip-Hop', 'Trap'],
    mood: ['Hype', 'Feel-Good', 'Aggressive'],
    region: 'South',
    city: 'Miami, FL',
    social: {
      spotify: 'https://open.spotify.com/artist/miravoss',
      apple_music: 'https://music.apple.com/us/artist/mira-voss',
      instagram: 'https://instagram.com/miravoss',
      tiktok: 'https://tiktok.com/@miravoss',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/7GhIk7Il098yCjg4BQjzvb',
    monthly_listeners: 650000,
    followers: 380000,
    glow_score: 88,
    glow_trend: 'rising',
    is_featured: false,
    is_daily_pick: true,
    featured_track: 'Fuego Lento',
    featured_track_url: null,
    tags: ['latin-trap', 'bilingual', 'miami', 'viral'],
    gallery: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=800',
    ],
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'artist-6',
    name: 'Onyx Saint',
    slug: 'onyx-saint',
    real_name: 'Damon Price',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600',
    bio: 'Brooklyn\'s Onyx Saint raps like he\'s reading from a novel — dense, literary, and devastating. His storytelling ability draws comparisons to Nas and Black Thought, but his production choices — heavy on ambient textures and chopped samples — place him firmly in the future. "Concrete Cathedral" was named one of the best underground albums of the year by multiple outlets.',
    genre: ['Hip-Hop', 'Alternative', 'Neo-Soul'],
    mood: ['Emotional', 'Dark', 'Late Night'],
    region: 'East Coast',
    city: 'Brooklyn, NY',
    social: {
      spotify: 'https://open.spotify.com/artist/onyxsaint',
      soundcloud: 'https://soundcloud.com/onyxsaint',
      instagram: 'https://instagram.com/onyxsaint',
      twitter: 'https://twitter.com/onyxsaint',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b',
    monthly_listeners: 175000,
    followers: 98000,
    glow_score: 82,
    glow_trend: 'rising',
    is_featured: false,
    is_daily_pick: false,
    featured_track: 'Concrete Cathedral',
    featured_track_url: null,
    tags: ['lyricist', 'brooklyn', 'underground', 'storytelling'],
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ],
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'artist-7',
    name: 'Zephyr Jones',
    slug: 'zephyr-jones',
    real_name: 'Zion Jones',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
    cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600',
    bio: 'Zephyr Jones makes music for the golden hour. The Los Angeles-based producer-singer crafts hazy, sun-drenched soundscapes that blend lo-fi hip-hop with psychedelic soul. His instrumental mixtapes have become study session staples, but his vocal work reveals an artist with way more range than the algorithm suggests.',
    genre: ['Electronic', 'R&B', 'Alternative'],
    mood: ['Chill', 'Dreamy', 'Feel-Good'],
    region: 'West Coast',
    city: 'Los Angeles, CA',
    social: {
      spotify: 'https://open.spotify.com/artist/zephyrjones',
      soundcloud: 'https://soundcloud.com/zephyrjones',
      youtube: 'https://youtube.com/@zephyrjones',
      instagram: 'https://instagram.com/zephyrjones',
    },
    soundcloud_embed: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/zephyr-golden',
    monthly_listeners: 420000,
    followers: 210000,
    glow_score: 78,
    glow_trend: 'steady',
    is_featured: false,
    is_daily_pick: false,
    featured_track: 'Golden Hour Drive',
    featured_track_url: null,
    tags: ['lo-fi', 'producer', 'la', 'psychedelic'],
    gallery: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    ],
    created_at: '2024-02-20T00:00:00Z',
  },
  {
    id: 'artist-8',
    name: 'Sable Noir',
    slug: 'sable-noir',
    real_name: 'Isabelle Toure',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
    cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600',
    bio: 'Sable Noir is the Paris-born, London-based singer redefining European R&B. Singing in English and French, she weaves between haunting ballads and dancefloor-ready UK garage reworkings. Vogue called her "the future of transatlantic soul" after her Glastonbury performance went viral.',
    genre: ['R&B', 'Electronic', 'Pop'],
    mood: ['Emotional', 'Melodic', 'Late Night'],
    region: 'UK',
    city: 'London, UK',
    social: {
      spotify: 'https://open.spotify.com/artist/sablenoir',
      apple_music: 'https://music.apple.com/us/artist/sable-noir',
      instagram: 'https://instagram.com/sablenoir',
      twitter: 'https://twitter.com/sablenoirmusic',
      tiktok: 'https://tiktok.com/@sablenoir',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/1dGr1c8CrMLDpV6mPbImSI',
    monthly_listeners: 780000,
    followers: 410000,
    glow_score: 86,
    glow_trend: 'rising',
    is_featured: true,
    is_daily_pick: false,
    featured_track: 'Nuit Blanche',
    featured_track_url: null,
    tags: ['uk-rb', 'bilingual', 'london', 'garage'],
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    ],
    created_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'artist-9',
    name: 'RAE KAPITAL',
    slug: 'rae-kapital',
    real_name: 'Raymond Osei',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600',
    cover_image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1600',
    bio: 'RAE KAPITAL brought rage music to the Afrobeats scene and nobody knew they needed it until they heard it. The Ghanaian-British rapper\'s aggressive delivery over Afro-drill production has created an entirely new subgenre. His track "No Passport" racked up 25M views on YouTube in its first month.',
    genre: ['Afrobeats', 'Drill', 'Hip-Hop'],
    mood: ['Aggressive', 'Hype', 'Dark'],
    region: 'UK',
    city: 'London, UK',
    social: {
      spotify: 'https://open.spotify.com/artist/raekapital',
      youtube: 'https://youtube.com/@raekapital',
      instagram: 'https://instagram.com/raekapital',
      twitter: 'https://twitter.com/raekapital',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/5ghIgXAoN6qfbQ7lEDKLqR',
    monthly_listeners: 960000,
    followers: 520000,
    glow_score: 93,
    glow_trend: 'rising',
    is_featured: false,
    is_daily_pick: true,
    featured_track: 'No Passport',
    featured_track_url: null,
    tags: ['afro-drill', 'ghanaian', 'rage', 'london'],
    gallery: [
      'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
    ],
    created_at: '2024-03-10T00:00:00Z',
  },
  {
    id: 'artist-10',
    name: 'Cypress Ray',
    slug: 'cypress-ray',
    real_name: 'Cypress Raymond',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600',
    cover_image: 'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=1600',
    bio: 'Cypress Ray is country-trap\'s most unlikely champion — a former church choir singer from rural Louisiana who blends twangy guitars with 808s and Auto-Tune. What sounds like it shouldn\'t work absolutely does. His debut single "Bayou Gospel" earned a cosign from T-Pain and has redefined what Southern rap can sound like.',
    genre: ['Hip-Hop', 'Alternative', 'Trap'],
    mood: ['Feel-Good', 'Emotional', 'Melodic'],
    region: 'South',
    city: 'Baton Rouge, LA',
    social: {
      spotify: 'https://open.spotify.com/artist/cypressray',
      instagram: 'https://instagram.com/cypressray',
      tiktok: 'https://tiktok.com/@cypressray',
    },
    spotify_embed: 'https://open.spotify.com/embed/track/2LBqCSwhJGcFQeTHnhEN6u',
    monthly_listeners: 340000,
    followers: 180000,
    glow_score: 76,
    glow_trend: 'new',
    is_featured: false,
    is_daily_pick: false,
    featured_track: 'Bayou Gospel',
    featured_track_url: null,
    tags: ['country-trap', 'louisiana', 'southern', 'church'],
    gallery: [
      'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=800',
    ],
    created_at: '2024-03-20T00:00:00Z',
  },
];

// ======================== MOCK BLOG POSTS ========================

const now = new Date();
function daysAgo(days: number): string {
  return new Date(now.getTime() - days * 86400 * 1000).toISOString();
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'KODA\'s "Signal Lost" Is the Blueprint for a New Era of Trap',
    slug: 'koda-signal-lost-blueprint-new-era',
    excerpt: 'How a Toronto artist fused neon synths with hard-hitting drums and created something we\'ve never heard before.',
    body: `<p>When KODA dropped "Signal Lost" last fall, the music industry collectively paused. Not because it was loud — though it is — but because nobody could categorize it. Was it trap? Electronic? Something from the future beamed back to us?</p>
<p>The answer is all of the above. KODA, born Kofi Darko, has spent the last three years quietly building a sound he calls "neon trap" — and with "Signal Lost," he's given it a manifesto.</p>
<p>The production alone is staggering. Futuristic synth pads that feel lifted from a Blade Runner soundtrack sit alongside drums that hit harder than anything coming out of Atlanta right now. And then there's KODA's voice — autotuned but deeply emotional, threading melodies that refuse to leave your head.</p>
<p>"I wanted to make music that sounds like driving through a city at 3 AM with all the neon lights reflecting off wet pavement," KODA told TrapGlow. "That's the feeling. That's the whole album."</p>
<p>He succeeded. Track after track, "Signal Lost" paints a nocturnal landscape of heartbreak, ambition, and the loneliness of pursuing something nobody understands yet. The standout "Midnight Protocol" — with its glitching beat switch at the two-minute mark — has become the unofficial soundtrack of late-night coding sessions and long drives.</p>
<p>What makes KODA special isn't just the sound — it's the intention. Every element serves the mood. Every silence is deliberate. In an era of quantity-over-quality playlist fodder, "Signal Lost" demands you listen front to back. And rewards you every time you do.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600',
    category: 'Feature',
    tags: ['koda', 'album-review', 'neon-trap', 'toronto'],
    author: authors[0],
    artist_id: 'artist-4',
    reading_time_minutes: 6,
    view_count: 24500,
    published_at: daysAgo(2),
    created_at: daysAgo(3),
  },
  {
    id: 'post-2',
    title: 'The Rise of Afro-Drill: How RAE KAPITAL Is Bridging Two Worlds',
    slug: 'rise-of-afro-drill-rae-kapital',
    excerpt: 'RAE KAPITAL didn\'t just blend genres — he built a bridge between continents and created a movement.',
    body: `<p>Genre-blending isn't new. But what RAE KAPITAL is doing — fusing the raw energy of UK drill with the rhythmic complexity of West African music — feels genuinely unprecedented.</p>
<p>The Ghanaian-British rapper grew up in East London, raised on a diet of grime MCs and highlife records his parents played on Sunday mornings. "Those two things lived in separate rooms in my head for years," he explains. "Afro-drill is what happens when you knock the wall down."</p>
<p>His breakout track "No Passport" is the perfect entry point: a stuttering drill beat overlaid with talking drum patterns, RAE's rapid-fire bars switching between English and Twi. It racked up 25 million YouTube views in its first month and sparked a wave of imitators — but nobody does it like the original.</p>
<p>The music is just the surface. RAE KAPITAL represents a generation of diaspora kids who refuse to choose between their identities. His concerts are events — half mosh pit, half cultural celebration, all energy.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1600',
    category: 'Feature',
    tags: ['rae-kapital', 'afro-drill', 'uk', 'culture'],
    author: authors[1],
    artist_id: 'artist-9',
    reading_time_minutes: 5,
    view_count: 18200,
    published_at: daysAgo(4),
    created_at: daysAgo(5),
  },
  {
    id: 'post-3',
    title: 'Velvet Roux on Vulnerability, Atlanta, and Her New Album "Bloom"',
    slug: 'velvet-roux-interview-bloom-album',
    excerpt: 'An intimate conversation with Atlanta\'s queen of neo-soul about growth, therapy, and making music that heals.',
    body: `<p>Velvet Roux doesn't do small talk. Within five minutes of our conversation, she's already talking about her therapy journey, the breakup that inspired her upcoming album "Bloom," and why she thinks vulnerability is the most radical thing an artist can offer.</p>
<p>"We live in a culture that rewards armor," she says, curled up in a studio chair, a candle flickering behind her. "Especially for Black women. You're supposed to be strong, unbreakable. But my music is about saying — I'm cracking, and that's where the light gets in."</p>
<p>"Bloom" is her most ambitious work yet. Where her debut "Midnight Honey" established her as a neo-soul voice, and sophomore effort "Afterglow" expanded her production palette, this third project feels like a full artistic statement.</p>
<p>The lead single "Satin Dreams" pairs lush strings with trap hi-hats and Velvet's most powerful vocal performance to date. It's already earned Spotify editorial placement and a cosign from SZA herself on Twitter.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600',
    category: 'Interview',
    tags: ['velvet-roux', 'interview', 'neo-soul', 'atlanta'],
    author: authors[2],
    artist_id: 'artist-1',
    reading_time_minutes: 8,
    view_count: 15800,
    published_at: daysAgo(6),
    created_at: daysAgo(7),
  },
  {
    id: 'post-4',
    title: '10 Underground Artists About to Blow Up in 2025',
    slug: '10-underground-artists-blow-up-2025',
    excerpt: 'From Brooklyn basements to Lagos studios — these are the names you\'ll hear everywhere soon.',
    body: `<p>Every year, a handful of artists make the jump from "who?" to "how did I not know about them sooner?" We spent months digging through SoundCloud pages, club flyers, and TikTok algorithms to find this year's class.</p>
<p>From Onyx Saint's literary Brooklyn rap to Cypress Ray's genre-defying country-trap, from Sable Noir's transatlantic R&B to Mira Voss's bilingual Miami heat — these ten artists represent the full spectrum of where music is going.</p>
<p>What they all share: authenticity, an obsessive work ethic, and the kind of creative vision that can't be manufactured. The majors are circling, the playlists are loading, and the co-signs are coming. Remember these names.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600',
    category: 'List',
    tags: ['underground', 'emerging', '2025', 'listicle'],
    author: authors[0],
    reading_time_minutes: 10,
    view_count: 32100,
    published_at: daysAgo(8),
    created_at: daysAgo(9),
  },
  {
    id: 'post-5',
    title: 'Luna Sage: "I\'m Not Choosing Between Nigeria and America"',
    slug: 'luna-sage-not-choosing-between-worlds',
    excerpt: 'The Afrobeats-indie star on identity, "Oshun\'s Daughter," and why genre labels are dead.',
    body: `<p>Luna Sage's Spotify bio reads simply: "From everywhere. Nowhere. The in-between." It's the kind of statement that could feel pretentious from another artist, but from her it's just honest.</p>
<p>Born in Houston to Nigerian parents, Luna grew up caught between worlds. Her earliest memories are of Fela Kuti records playing at family gatherings and Radiohead blasting from her older brother's room. Both found their way into her music.</p>
<p>"People always ask if I'm making Afrobeats or indie pop," she says over video call from her Houston home studio. "And I'm like — yes. Both. All of it. Genre labels are just filing systems for streaming platforms. Music doesn't actually work like that."</p>
<p>"Oshun's Daughter" — the track that put her on the map — is proof. Over amapiano-inspired log drums and shimmering guitars, Luna sings about ancestry, self-discovery, and finding power in the places between identities. Forty million streams later, the culture agrees.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600',
    category: 'Interview',
    tags: ['luna-sage', 'afrobeats', 'identity', 'interview'],
    author: authors[3],
    artist_id: 'artist-3',
    reading_time_minutes: 7,
    view_count: 21300,
    published_at: daysAgo(10),
    created_at: daysAgo(11),
  },
  {
    id: 'post-6',
    title: 'How TikTok\'s Algorithm Is Rewriting Music Discovery',
    slug: 'tiktok-algorithm-rewriting-music-discovery',
    excerpt: 'The 15-second clip economy has changed how we find music forever. Is that a good thing?',
    body: `<p>In 2019, getting on a major Spotify playlist was the golden ticket. In 2025, a 15-second TikTok can do more for an artist's career than a million-dollar marketing budget.</p>
<p>The shift has been seismic. Artists are now composing with virality in mind — hooks front-loaded, drops optimized for the 7-second attention window, lyrics designed to become captions. Some see it as democratization. Others see it as the death of the album.</p>
<p>We talked to five emerging artists about how TikTok has shaped their creative process, for better and worse.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1600',
    category: 'Analysis',
    tags: ['tiktok', 'music-industry', 'algorithm', 'discovery'],
    author: authors[0],
    reading_time_minutes: 9,
    view_count: 28700,
    published_at: daysAgo(12),
    created_at: daysAgo(13),
  },
  {
    id: 'post-7',
    title: 'Pharaoh Bliss: The Jazz-Drill Fusion Chicago Didn\'t Know It Needed',
    slug: 'pharaoh-bliss-jazz-drill-fusion-chicago',
    excerpt: 'How sampling Coltrane over sliding 808s created Chicago\'s most exciting new sound.',
    body: `<p>Chicago has always been a city of musical innovation. From house music to drill, from gospel to footwork — the city doesn't just participate in scenes, it invents them. Pharaoh Bliss is the latest in that lineage.</p>
<p>The 24-year-old producer-rapper grew up on the South Side, equally influenced by his grandfather's jazz record collection and the drill music blasting from every other car. "People act like those are opposite things," he says. "But the energy is the same. Jazz was the drill of its era — raw, real, from the streets."</p>
<p>His music proves the point. "Gold Casket" opens with a Coltrane sample that dissolves into one of the hardest drill beats you'll hear this year. The juxtaposition shouldn't work, but it does — because Pharaoh understands that both genres come from the same place of urgency and expression.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1600',
    category: 'Feature',
    tags: ['pharaoh-bliss', 'jazz-drill', 'chicago', 'innovation'],
    author: authors[1],
    artist_id: 'artist-2',
    reading_time_minutes: 6,
    view_count: 19400,
    published_at: daysAgo(14),
    created_at: daysAgo(15),
  },
  {
    id: 'post-8',
    title: 'The SoundCloud Renaissance: Why Independent Artists Are Going Back to Basics',
    slug: 'soundcloud-renaissance-independent-artists',
    excerpt: 'Forget the algorithm. A new generation of artists is finding power in SoundCloud\'s raw, unfiltered platform.',
    body: `<p>It's 2025 and SoundCloud is cool again. Not in the nostalgic, "remember-when" way — but in a genuine, artists-are-choosing-it-over-DSPs way.</p>
<p>The reason is simple: freedom. On SoundCloud, there's no algorithm deciding who hears you. No playlist editors to court. No 30-second skip penalty affecting your revenue. You upload, people listen, and the music speaks for itself.</p>
<p>For artists like Onyx Saint and Zephyr Jones, who both built their initial fanbases on the platform, this return to basics represents something bigger than nostalgia. It's a rejection of the streaming industrial complex.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600',
    category: 'Analysis',
    tags: ['soundcloud', 'independent', 'streaming', 'industry'],
    author: authors[2],
    reading_time_minutes: 7,
    view_count: 14600,
    published_at: daysAgo(16),
    created_at: daysAgo(17),
  },
  {
    id: 'post-9',
    title: 'Sable Noir\'s Glastonbury Set Changed Everything',
    slug: 'sable-noir-glastonbury-set-changed-everything',
    excerpt: 'One performance. One viral moment. One artist going from "next up" to "now."',
    body: `<p>It was supposed to be a 30-minute set on Glastonbury's second stage. What happened instead was the kind of moment that defines a career.</p>
<p>Sable Noir took the stage at 4 PM on a Saturday. By 4:15, the crowd had swelled beyond capacity. By 4:30, clips were trending worldwide. The moment that broke the internet: a stripped-back performance of "Nuit Blanche" where she sang the chorus in French, then English, then French again, each time with increasing intensity until the entire field was singing along in both languages.</p>
<p>"I didn't plan it," she says now, three months later. "I just felt the crowd and responded. That's what live music is supposed to be — a conversation."</p>`,
    cover_image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600',
    category: 'Feature',
    tags: ['sable-noir', 'glastonbury', 'live-music', 'viral'],
    author: authors[3],
    artist_id: 'artist-8',
    reading_time_minutes: 5,
    view_count: 26800,
    published_at: daysAgo(18),
    created_at: daysAgo(19),
  },
  {
    id: 'post-10',
    title: 'Country-Trap Is Not a Joke: Cypress Ray Proves It',
    slug: 'country-trap-not-a-joke-cypress-ray',
    excerpt: 'From Louisiana church choirs to Auto-Tune anthems — Cypress Ray is building a genre from the ground up.',
    body: `<p>"People laughed at first," Cypress Ray admits with a grin. "They heard 'country-trap' and thought it was a TikTok bit. Then they actually listened."</p>
<p>What they heard was something unexpectedly beautiful. Cypress Ray's music combines the storytelling tradition of Southern gospel and country with the production sensibilities of modern trap. "Bayou Gospel," his debut single, layers twangy slide guitar over booming 808s while he sings about faith, doubt, and growing up in rural Louisiana.</p>
<p>T-Pain's cosign helped, but the music was going to find its audience regardless. There's a sincerity to Cypress Ray's work that transcends genre labels — it's the sound of someone being unapologetically himself, and in 2025, that's the rarest thing in music.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=1600',
    category: 'Feature',
    tags: ['cypress-ray', 'country-trap', 'louisiana', 'genre-blending'],
    author: authors[1],
    artist_id: 'artist-10',
    reading_time_minutes: 5,
    view_count: 12300,
    published_at: daysAgo(20),
    created_at: daysAgo(21),
  },
  {
    id: 'post-11',
    title: 'Why Every Artist Needs a "Third Place" Sound',
    slug: 'every-artist-needs-third-place-sound',
    excerpt: 'Genre-blending isn\'t a trend anymore — it\'s survival. Here\'s why the most exciting artists refuse to stay in one lane.',
    body: `<p>Sociologist Ray Oldenburg coined the term "third place" to describe the social spaces between home and work — cafés, parks, barbershops. We think the concept applies perfectly to the current music landscape.</p>
<p>The most exciting artists of 2025 — KODA, Luna Sage, Sable Noir, Pharaoh Bliss — all live in a "third place" sonically. They're not quite one genre, not quite another. They exist in the space between, and that's exactly where the magic happens.</p>
<p>This isn't about being eclectic for eclecticism's sake. It's about authenticity. When your influences are genuinely diverse — when drill and jazz actually both shaped your childhood, when Afrobeats and indie pop actually both feel like home — the fusion isn't forced. It's natural.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600',
    category: 'Analysis',
    tags: ['genre-blending', 'opinion', 'music-industry', 'culture'],
    author: authors[0],
    reading_time_minutes: 8,
    view_count: 17900,
    published_at: daysAgo(22),
    created_at: daysAgo(23),
  },
  {
    id: 'post-12',
    title: 'Mira Voss and the New Latin Underground',
    slug: 'mira-voss-new-latin-underground',
    excerpt: 'Miami\'s Mira Voss is leading a bilingual revolution in hip-hop. The majors are paying attention.',
    body: `<p>Mira Voss performs like every show might be her last — and that energy is why she's suddenly everywhere.</p>
<p>The Miami-raised rapper has spent three years building a cult following with bilingual bars that switch between English and Spanish mid-sentence, delivered over reggaeton-trap fusions that feel both familiar and brand new.</p>
<p>"Fuego Lento" was the breakthrough — 12 weeks on Spotify's Viral 50 chart, a placement in a Netflix show, and enough major label attention to make her phone buzz constantly. But she's taking her time.</p>
<p>"I've seen what happens when artists sign too early," she says. "The machine chews you up. I'd rather build this right."</p>`,
    cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600',
    category: 'Feature',
    tags: ['mira-voss', 'latin-trap', 'miami', 'bilingual'],
    author: authors[2],
    artist_id: 'artist-5',
    reading_time_minutes: 6,
    view_count: 13700,
    published_at: daysAgo(24),
    created_at: daysAgo(25),
  },
];

// ======================== HELPERS ========================

export function getFeaturedArtists(): Artist[] {
  return mockArtists.filter(a => a.is_featured);
}

export function getDailyPicks(): Artist[] {
  return mockArtists.filter(a => a.is_daily_pick);
}

export function getGlowUpLeaderboard(): Artist[] {
  return [...mockArtists].sort((a, b) => b.glow_score - a.glow_score);
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return mockArtists.find(a => a.slug === slug);
}

export function getArtistsByGenre(genre: string): Artist[] {
  return mockArtists.filter(a => a.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
}

export function getArtistsByMood(mood: string): Artist[] {
  return mockArtists.filter(a => a.mood.some(m => m.toLowerCase() === mood.toLowerCase()));
}

export function getArtistsByRegion(region: string): Artist[] {
  return mockArtists.filter(a => a.region.toLowerCase() === region.toLowerCase());
}

export function searchArtists(query: string): Artist[] {
  const q = query.toLowerCase();
  return mockArtists.filter(
    a =>
      a.name.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q) ||
      a.genre.some(g => g.toLowerCase().includes(q)) ||
      a.tags.some(t => t.includes(q)) ||
      a.city.toLowerCase().includes(q)
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find(p => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return mockBlogPosts.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getRelatedPosts(postId: string, limit = 4): BlogPost[] {
  const post = mockBlogPosts.find(p => p.id === postId);
  if (!post) return [];
  return mockBlogPosts
    .filter(p => p.id !== postId && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, limit);
}

export function getTrendingPosts(limit = 5): BlogPost[] {
  return [...mockBlogPosts].sort((a, b) => b.view_count - a.view_count).slice(0, limit);
}

export function getPostsByArtist(artistId: string): BlogPost[] {
  return mockBlogPosts.filter(p => p.artist_id === artistId);
}

export function formatListeners(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}
