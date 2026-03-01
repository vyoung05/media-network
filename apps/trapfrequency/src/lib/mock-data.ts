// ============================================================
// TRAPFREQUENCY — Mock Data
// Rich, realistic mock data for the music production hub
// ============================================================

// ======================== TYPES ========================

export interface Producer {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string;
  location: string;
  daws: DAWType[];
  genres: string[];
  credits: string[];
  beatCount: number;
  followerCount: number;
  links: {
    website?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    soundcloud?: string;
    spotify?: string;
    beatstars?: string;
  };
  featured: boolean;
  joinedAt: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  daw: DAWType;
  skillLevel: SkillLevel;
  category: TutorialCategory;
  duration: string;
  author: Producer;
  tags: string[];
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

export interface Beat {
  id: string;
  title: string;
  slug: string;
  producer: Producer;
  bpm: number;
  key: string;
  genre: string;
  tags: string[];
  duration: string;
  waveformData: number[];
  plays: number;
  likes: number;
  coverImage: string | null;
  audioUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
}

export interface GearReview {
  id: string;
  title: string;
  slug: string;
  product: string;
  brand: string;
  category: GearCategory;
  price: string;
  rating: number;
  excerpt: string;
  body: string;
  coverImage: string | null;
  pros: string[];
  cons: string[];
  verdict: string;
  affiliateUrl: string | null;
  author: Producer;
  publishedAt: string;
}

export interface SamplePack {
  id: string;
  title: string;
  slug: string;
  creator: string;
  price: string;
  isFree: boolean;
  sampleCount: number;
  genres: string[];
  description: string;
  coverImage: string | null;
  previewSounds: string[];
  rating: number;
  downloadCount: number;
  publishedAt: string;
}

export interface FrequencyChartEntry {
  rank: number;
  beat: Beat;
  previousRank: number | null;
  weeksOnChart: number;
}

export type DAWType = 'FL Studio' | 'Ableton Live' | 'Logic Pro' | 'Pro Tools' | 'Reason' | 'Studio One' | 'Cubase' | 'MPC Software';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
export type TutorialCategory = 'Sound Design' | 'Mixing' | 'Mastering' | 'Beat Making' | 'Sampling' | 'Music Theory' | 'Arrangement' | 'Vocal Production' | 'Synthesis' | 'Workflow';
export type GearCategory = 'Controllers' | 'Monitors' | 'Headphones' | 'Microphones' | 'Audio Interfaces' | 'MIDI Controllers' | 'Drum Machines' | 'Synthesizers' | 'Software' | 'Accessories';

// ======================== DAW METADATA ========================

export const DAW_INFO: Record<DAWType, { color: string; icon: string; shortName: string }> = {
  'FL Studio': { color: '#FF6600', icon: '🍊', shortName: 'FL' },
  'Ableton Live': { color: '#00D8FF', icon: '⬟', shortName: 'Ableton' },
  'Logic Pro': { color: '#555555', icon: '🎛️', shortName: 'Logic' },
  'Pro Tools': { color: '#7B68EE', icon: '🎚️', shortName: 'PT' },
  'Reason': { color: '#FF3333', icon: '🔧', shortName: 'Reason' },
  'Studio One': { color: '#2196F3', icon: '🎵', shortName: 'S1' },
  'Cubase': { color: '#CC0000', icon: '🎼', shortName: 'Cubase' },
  'MPC Software': { color: '#E91E63', icon: '🥁', shortName: 'MPC' },
};

export const SKILL_COLORS: Record<SkillLevel, string> = {
  'Beginner': '#39FF14',
  'Intermediate': '#4361EE',
  'Advanced': '#FFB800',
  'Master': '#E63946',
};

export const TRAPFREQUENCY_CATEGORIES = ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'] as const;

// ======================== MOCK PRODUCERS ========================

export const mockProducers: Producer[] = [
  {
    id: 'p1',
    name: 'KVNG Beats',
    slug: 'kvng-beats',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=600&fit=crop&q=80',
    bio: 'Multi-platinum producer from Atlanta. Known for dark trap instrumentals with signature 808 patterns. Produced for Future, Young Thug, and Gunna. FL Studio wizard with 10+ years of experience crafting hits that dominate the charts.',
    location: 'Atlanta, GA',
    daws: ['FL Studio'],
    genres: ['Trap', 'Dark Trap', 'Hip-Hop'],
    credits: ['Future - "Mask Off" (co-prod)', 'Young Thug - "Hot"', 'Gunna - "Pushin P" (add. prod)', 'Lil Baby - "Real As It Gets"'],
    beatCount: 342,
    followerCount: 45200,
    links: {
      instagram: 'https://instagram.com/kvngbeats',
      youtube: 'https://youtube.com/@kvngbeats',
      beatstars: 'https://beatstars.com/kvngbeats',
    },
    featured: true,
    joinedAt: '2023-06-15T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Synthia Rose',
    slug: 'synthia-rose',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=600&fit=crop&q=80',
    bio: 'R&B and neo-soul producer blending vintage synths with modern production. Ableton Live specialist with a background in jazz piano. Her beats have been placed on major playlists and featured in Netflix originals.',
    location: 'Los Angeles, CA',
    daws: ['Ableton Live', 'Logic Pro'],
    genres: ['R&B', 'Neo-Soul', 'Lo-Fi'],
    credits: ['SZA - "Good Days" (add. keys)', 'Daniel Caesar - session musician', 'H.E.R. - "Focus" (remix)', 'Jorja Smith - "Blue Lights" (flip)'],
    beatCount: 189,
    followerCount: 28400,
    links: {
      instagram: 'https://instagram.com/synthiarose',
      spotify: 'https://open.spotify.com/artist/synthiarose',
      soundcloud: 'https://soundcloud.com/synthiarose',
      website: 'https://synthiarose.com',
    },
    featured: true,
    joinedAt: '2023-08-22T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'DrumGod',
    slug: 'drumgod',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&h=600&fit=crop&q=80',
    bio: 'Drum pattern specialist and sound designer. Known for intricate hi-hat patterns and punchy drum kits. Has released 20+ drum kits downloaded over 500K times. Regular contributor to Splice and BeatStars.',
    location: 'Chicago, IL',
    daws: ['FL Studio', 'MPC Software'],
    genres: ['Drill', 'Trap', 'Boom Bap'],
    credits: ['Chief Keef - drum programming', 'Polo G - "Rapstar" (drums)', 'Lil Durk - "All My Life" (perc)', 'G Herbo - session work'],
    beatCount: 567,
    followerCount: 72100,
    links: {
      youtube: 'https://youtube.com/@drumgod',
      beatstars: 'https://beatstars.com/drumgod',
      twitter: 'https://twitter.com/drumgodbeats',
    },
    featured: true,
    joinedAt: '2023-03-10T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Melo Circuit',
    slug: 'melo-circuit',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=600&fit=crop&q=80',
    bio: 'Melodic trap and ambient producer pushing the boundaries of what beats can sound like. Logic Pro user with a love for cinematic sound design. His signature pads and atmospheric textures have defined a new wave of emotional trap.',
    location: 'Toronto, ON',
    daws: ['Logic Pro', 'Ableton Live'],
    genres: ['Melodic Trap', 'Ambient', 'Cinematic'],
    credits: ['Drake - "Fair Trade" (add. prod)', 'The Weeknd - session work', 'PartyNextDoor - "Loyal" (co-prod)', 'NAV - background vocals'],
    beatCount: 234,
    followerCount: 38900,
    links: {
      instagram: 'https://instagram.com/melocircuit',
      spotify: 'https://open.spotify.com/artist/melocircuit',
      youtube: 'https://youtube.com/@melocircuit',
    },
    featured: true,
    joinedAt: '2023-05-01T00:00:00Z',
  },
  {
    id: 'p5',
    name: 'Bass Architect',
    slug: 'bass-architect',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop&q=80',
    bio: 'Sound designer and bass music specialist. Crafts heavy 808s and sub-bass patches from scratch using synthesis. Known for making the hardest-hitting low end in the game. Runs a popular YouTube channel with 200K+ subscribers.',
    location: 'Houston, TX',
    daws: ['FL Studio', 'Ableton Live'],
    genres: ['Trap', 'Phonk', 'Bass Music'],
    credits: ['Travis Scott - "SICKO MODE" (808 design)', 'Don Toliver - mixing', 'Megan Thee Stallion - "Savage" (bass)', 'Sauce Walka - production'],
    beatCount: 412,
    followerCount: 91300,
    links: {
      youtube: 'https://youtube.com/@bassarchitect',
      twitter: 'https://twitter.com/bassarchitect',
      website: 'https://bassarchitect.com',
    },
    featured: true,
    joinedAt: '2023-01-20T00:00:00Z',
  },
  {
    id: 'p6',
    name: 'Kira Voltage',
    slug: 'kira-voltage',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1571266028243-d220c6d3173e?w=1200&h=600&fit=crop&q=80',
    bio: 'Electronic and experimental producer merging EDM with hip-hop. Ableton Push 3 power user. Her live performance sets have been featured at SXSW, A3C, and Rolling Loud. Also runs production workshops for women in music.',
    location: 'Miami, FL',
    daws: ['Ableton Live'],
    genres: ['Electronic', 'Experimental', 'Future Bass'],
    credits: ['Skrillex - remix collab', 'Rico Nasty - "Smack a Bitch" (remix)', 'Charli XCX - session synths', 'Diplo - "Lean On" (bootleg)'],
    beatCount: 156,
    followerCount: 34700,
    links: {
      instagram: 'https://instagram.com/kiravoltage',
      soundcloud: 'https://soundcloud.com/kiravoltage',
      spotify: 'https://open.spotify.com/artist/kiravoltage',
    },
    featured: false,
    joinedAt: '2023-09-12T00:00:00Z',
  },
  {
    id: 'p7',
    name: 'OG Sampler',
    slug: 'og-sampler',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=600&fit=crop&q=80',
    bio: 'Old school meets new school. Sample-based producer with an encyclopedic knowledge of vinyl. Known for flipping obscure soul, jazz, and funk records into modern bangers. MPC Live II is his weapon of choice.',
    location: 'New York, NY',
    daws: ['MPC Software', 'Pro Tools'],
    genres: ['Boom Bap', 'Jazz Rap', 'Sample-Based'],
    credits: ['Joey Bada$$ - "Devastated" (sample)', 'J. Cole - "No Role Modelz" (add. chop)', 'Rapsody - production credits', 'Black Thought - beat tape'],
    beatCount: 289,
    followerCount: 52400,
    links: {
      instagram: 'https://instagram.com/ogsampler',
      youtube: 'https://youtube.com/@ogsampler',
      beatstars: 'https://beatstars.com/ogsampler',
    },
    featured: true,
    joinedAt: '2023-02-14T00:00:00Z',
  },
  {
    id: 'p8',
    name: 'Nebula Keys',
    slug: 'nebula-keys',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&h=600&fit=crop&q=80',
    bio: 'Keyboard player turned producer. Creates lush, keys-driven beats with complex chord progressions. Known for teaching music theory to producers through his viral TikTok series "Chords That Hit Different."',
    location: 'Nashville, TN',
    daws: ['Logic Pro', 'Ableton Live'],
    genres: ['R&B', 'Pop', 'Gospel Trap'],
    credits: ['Chris Brown - session keys', 'Khalid - "Talk" (add. keys)', 'Summer Walker - "Playing Games" (co-prod)', 'Kirk Franklin - remix'],
    beatCount: 198,
    followerCount: 41200,
    links: {
      instagram: 'https://instagram.com/nebulakeys',
      youtube: 'https://youtube.com/@nebulakeys',
      spotify: 'https://open.spotify.com/artist/nebulakeys',
      website: 'https://nebulakeys.com',
    },
    featured: false,
    joinedAt: '2023-07-30T00:00:00Z',
  },
  {
    id: 'p9',
    name: 'Phantom 808',
    slug: 'phantom-808',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop&q=80',
    bio: 'Anonymous producer collective known for dark, atmospheric trap beats. Their identity remains a mystery but their sound is unmistakable — haunting melodies, thunderous 808s, and eerie vocal chops that have dominated SoundCloud and streaming platforms.',
    location: 'Unknown',
    daws: ['FL Studio'],
    genres: ['Dark Trap', 'Phonk', 'Memphis Rap'],
    credits: ['Playboi Carti - type beats', 'Denzel Curry - "Ultimate" (style)', 'XXXTentacion - influence', 'Bones - TeamSESH collabs'],
    beatCount: 723,
    followerCount: 118500,
    links: {
      soundcloud: 'https://soundcloud.com/phantom808',
      beatstars: 'https://beatstars.com/phantom808',
    },
    featured: true,
    joinedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'p10',
    name: 'Luna Waves',
    slug: 'luna-waves',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&h=600&fit=crop&q=80',
    bio: 'Lo-fi and chill producer creating beats for study sessions and late-night vibes. Her sound is warm, nostalgic, and textured with vinyl crackle, soft piano, and jazzy guitar loops. Has accumulated over 50M streams across lo-fi playlists.',
    location: 'Portland, OR',
    daws: ['Ableton Live', 'FL Studio'],
    genres: ['Lo-Fi', 'Chill Hop', 'Jazz Hop'],
    credits: ['ChilledCow playlist feature', 'College Music collab', 'Lofi Girl official playlist', 'Spotify "Lo-Fi Beats" editorial'],
    beatCount: 445,
    followerCount: 67800,
    links: {
      spotify: 'https://open.spotify.com/artist/lunawaves',
      instagram: 'https://instagram.com/lunawaves',
      youtube: 'https://youtube.com/@lunawaves',
    },
    featured: false,
    joinedAt: '2023-04-18T00:00:00Z',
  },
];

// ======================== MOCK TUTORIALS ========================

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400 * 1000).toISOString();

export const mockTutorials: Tutorial[] = [
  {
    id: 't1',
    title: 'How to Make Hard-Hitting 808s in FL Studio from Scratch',
    slug: 'hard-hitting-808s-fl-studio',
    excerpt: 'Learn how to synthesize, layer, and process 808 bass sounds that rattle speakers. No samples needed — we\'re building from a sine wave.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=450&fit=crop&q=80',
    daw: 'FL Studio',
    skillLevel: 'Intermediate',
    category: 'Sound Design',
    duration: '18 min',
    author: mockProducers[4], // Bass Architect
    tags: ['808', 'bass', 'sound design', 'FL Studio', 'synthesis'],
    viewCount: 124500,
    likeCount: 8900,
    publishedAt: hoursAgo(6),
  },
  {
    id: 't2',
    title: 'Ableton Live: Creating Lush Pads with Wavetable Synthesis',
    slug: 'ableton-wavetable-pads',
    excerpt: 'Deep dive into Ableton\'s Wavetable synth to create evolving, cinematic pads perfect for melodic trap and ambient production.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=450&fit=crop&q=80',
    daw: 'Ableton Live',
    skillLevel: 'Advanced',
    category: 'Synthesis',
    duration: '24 min',
    author: mockProducers[5], // Kira Voltage
    tags: ['wavetable', 'pads', 'ableton', 'synthesis', 'ambient'],
    viewCount: 67300,
    likeCount: 5200,
    publishedAt: hoursAgo(18),
  },
  {
    id: 't3',
    title: 'Beginner\'s Guide to Mixing Trap Beats — EQ, Compression & More',
    slug: 'beginners-guide-mixing-trap',
    excerpt: 'Your first mix doesn\'t have to sound amateur. Learn the fundamentals of EQ, compression, and gain staging for clean trap mixes.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop&q=80',
    daw: 'FL Studio',
    skillLevel: 'Beginner',
    category: 'Mixing',
    duration: '32 min',
    author: mockProducers[0], // KVNG Beats
    tags: ['mixing', 'EQ', 'compression', 'beginner', 'trap'],
    viewCount: 234100,
    likeCount: 18400,
    publishedAt: daysAgo(1),
  },
  {
    id: 't4',
    title: 'Logic Pro X: Advanced Vocal Chain for Professional Results',
    slug: 'logic-pro-vocal-chain',
    excerpt: 'Build a complete vocal processing chain in Logic Pro using stock plugins. From de-essing to parallel compression, get radio-ready vocals.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=450&fit=crop&q=80',
    daw: 'Logic Pro',
    skillLevel: 'Advanced',
    category: 'Vocal Production',
    duration: '28 min',
    author: mockProducers[7], // Nebula Keys
    tags: ['vocals', 'mixing', 'logic pro', 'compression', 'chain'],
    viewCount: 89200,
    likeCount: 6700,
    publishedAt: daysAgo(2),
  },
  {
    id: 't5',
    title: 'The Art of Sampling: Chopping Soul Records on the MPC',
    slug: 'sampling-soul-records-mpc',
    excerpt: 'Learn the classic art of sampling — from digging in crates to chopping and flipping soul, jazz, and funk records on the MPC.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=450&fit=crop&q=80',
    daw: 'MPC Software',
    skillLevel: 'Intermediate',
    category: 'Sampling',
    duration: '22 min',
    author: mockProducers[6], // OG Sampler
    tags: ['sampling', 'MPC', 'soul', 'vinyl', 'chopping'],
    viewCount: 156700,
    likeCount: 12300,
    publishedAt: daysAgo(3),
  },
  {
    id: 't6',
    title: 'Music Theory for Producers: Chord Progressions That Hit Different',
    slug: 'music-theory-chord-progressions',
    excerpt: 'You don\'t need a music degree. Learn the chord progressions behind the biggest hits — minor 7ths, suspended chords, and modal interchange.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=450&fit=crop&q=80',
    daw: 'Ableton Live',
    skillLevel: 'Beginner',
    category: 'Music Theory',
    duration: '20 min',
    author: mockProducers[7], // Nebula Keys
    tags: ['music theory', 'chords', 'harmony', 'beginner', 'keys'],
    viewCount: 312400,
    likeCount: 24100,
    publishedAt: daysAgo(4),
  },
  {
    id: 't7',
    title: 'FL Studio: Advanced Hi-Hat Programming for Drill & Trap',
    slug: 'fl-studio-hihat-programming',
    excerpt: 'Master the art of intricate hi-hat rolls, velocity modulation, and ghost notes. Learn patterns from Metro Boomin, Wheezy, and TM88.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=450&fit=crop&q=80',
    daw: 'FL Studio',
    skillLevel: 'Advanced',
    category: 'Beat Making',
    duration: '16 min',
    author: mockProducers[2], // DrumGod
    tags: ['hi-hats', 'drill', 'trap', 'drums', 'programming'],
    viewCount: 198300,
    likeCount: 15600,
    publishedAt: daysAgo(5),
  },
  {
    id: 't8',
    title: 'Mastering Your Own Beats: A Complete Guide for Home Studios',
    slug: 'mastering-home-studio-guide',
    excerpt: 'Professional mastering at home is possible. Learn LUFS targets, multiband compression, stereo imaging, and limiter settings for streaming.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=450&fit=crop&q=80',
    daw: 'Logic Pro',
    skillLevel: 'Advanced',
    category: 'Mastering',
    duration: '35 min',
    author: mockProducers[3], // Melo Circuit
    tags: ['mastering', 'LUFS', 'limiter', 'home studio', 'streaming'],
    viewCount: 143800,
    likeCount: 11200,
    publishedAt: daysAgo(6),
  },
  {
    id: 't9',
    title: 'Creating Lo-Fi Textures: Vinyl Crackle, Tape Saturation & More',
    slug: 'lofi-textures-vinyl-tape',
    excerpt: 'The secret sauce behind lo-fi production — learn how to add warmth, character, and nostalgia to your beats with analog emulation.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=450&fit=crop&q=80',
    daw: 'Ableton Live',
    skillLevel: 'Intermediate',
    category: 'Sound Design',
    duration: '19 min',
    author: mockProducers[9], // Luna Waves
    tags: ['lo-fi', 'texture', 'vinyl', 'tape', 'analog'],
    viewCount: 87600,
    likeCount: 7400,
    publishedAt: daysAgo(7),
  },
  {
    id: 't10',
    title: 'Arrangement Secrets: How to Turn a 4-Bar Loop into a Full Song',
    slug: 'arrangement-loop-to-song',
    excerpt: 'Stop making 4-bar loops that go nowhere. Learn the arrangement techniques pros use to build energy, create transitions, and tell a story.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=450&fit=crop&q=80',
    daw: 'FL Studio',
    skillLevel: 'Beginner',
    category: 'Arrangement',
    duration: '25 min',
    author: mockProducers[0], // KVNG Beats
    tags: ['arrangement', 'song structure', 'transitions', 'drops', 'builds'],
    viewCount: 267900,
    likeCount: 21300,
    publishedAt: daysAgo(8),
  },
  {
    id: 't11',
    title: 'Pro Tools Workflow: Recording & Editing Vocals Like a Pro',
    slug: 'pro-tools-vocal-recording',
    excerpt: 'Industry-standard vocal recording techniques in Pro Tools. From mic setup and gain staging to comping, tuning, and alignment.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=450&fit=crop&q=80',
    daw: 'Pro Tools',
    skillLevel: 'Intermediate',
    category: 'Vocal Production',
    duration: '30 min',
    author: mockProducers[6], // OG Sampler
    tags: ['pro tools', 'vocals', 'recording', 'comping', 'editing'],
    viewCount: 72400,
    likeCount: 5800,
    publishedAt: daysAgo(9),
  },
  {
    id: 't12',
    title: 'Phonk Production Masterclass: Memphis Rap Meets Modern Bass',
    slug: 'phonk-production-masterclass',
    excerpt: 'Dive into the world of phonk — learn the cowbell patterns, Memphis vocal chops, drifting 808s, and dark atmospheres that define the genre.',
    body: 'Full tutorial content here...',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop&q=80',
    daw: 'FL Studio',
    skillLevel: 'Master',
    category: 'Beat Making',
    duration: '40 min',
    author: mockProducers[8], // Phantom 808
    tags: ['phonk', 'memphis', 'cowbell', '808', 'dark'],
    viewCount: 345200,
    likeCount: 28700,
    publishedAt: daysAgo(10),
  },
];

// ======================== HELPER: Generate Waveform Data ========================

function generateWaveformData(length: number = 80): number[] {
  const data: number[] = [];
  for (let i = 0; i < length; i++) {
    // Create realistic-looking waveform shape
    const base = Math.sin(i * 0.15) * 0.3;
    const noise = Math.random() * 0.6;
    const envelope = Math.sin((i / length) * Math.PI) * 0.4;
    data.push(Math.min(1, Math.max(0.05, Math.abs(base + noise * envelope + 0.2))));
  }
  return data;
}

// ======================== MOCK BEATS ========================

export const mockBeats: Beat[] = [
  {
    id: 'b1',
    title: 'Midnight Protocol',
    slug: 'midnight-protocol',
    producer: mockProducers[0],
    bpm: 145,
    key: 'C minor',
    genre: 'Dark Trap',
    tags: ['dark', '808', 'hard', 'aggressive'],
    duration: '3:24',
    waveformData: generateWaveformData(),
    plays: 45200,
    likes: 3400,
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: hoursAgo(2),
  },
  {
    id: 'b2',
    title: 'Golden Hour',
    slug: 'golden-hour',
    producer: mockProducers[1],
    bpm: 88,
    key: 'Ab major',
    genre: 'R&B',
    tags: ['smooth', 'keys', 'soulful', 'vibes'],
    duration: '4:12',
    waveformData: generateWaveformData(),
    plays: 32100,
    likes: 2800,
    coverImage: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: hoursAgo(8),
  },
  {
    id: 'b3',
    title: 'Drill Sergeant',
    slug: 'drill-sergeant',
    producer: mockProducers[2],
    bpm: 140,
    key: 'F# minor',
    genre: 'Drill',
    tags: ['drill', 'UK', 'aggressive', 'bouncy'],
    duration: '2:58',
    waveformData: generateWaveformData(),
    plays: 67800,
    likes: 5100,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: hoursAgo(14),
  },
  {
    id: 'b4',
    title: 'Neon Dreams',
    slug: 'neon-dreams',
    producer: mockProducers[3],
    bpm: 130,
    key: 'Eb minor',
    genre: 'Melodic Trap',
    tags: ['melodic', 'ambient', 'emotional', 'cinematic'],
    duration: '3:45',
    waveformData: generateWaveformData(),
    plays: 89300,
    likes: 7200,
    coverImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: daysAgo(1),
  },
  {
    id: 'b5',
    title: 'Subterranean',
    slug: 'subterranean',
    producer: mockProducers[4],
    bpm: 150,
    key: 'G minor',
    genre: 'Phonk',
    tags: ['phonk', 'bass', 'heavy', 'drift'],
    duration: '2:36',
    waveformData: generateWaveformData(),
    plays: 112400,
    likes: 9800,
    coverImage: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: false,
    publishedAt: daysAgo(2),
  },
  {
    id: 'b6',
    title: 'Voltage Drop',
    slug: 'voltage-drop',
    producer: mockProducers[5],
    bpm: 160,
    key: 'D minor',
    genre: 'Future Bass',
    tags: ['electronic', 'future bass', 'synths', 'drops'],
    duration: '3:18',
    waveformData: generateWaveformData(),
    plays: 28900,
    likes: 2100,
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: false,
    publishedAt: daysAgo(3),
  },
  {
    id: 'b7',
    title: 'Vinyl Memoirs',
    slug: 'vinyl-memoirs',
    producer: mockProducers[6],
    bpm: 92,
    key: 'Bb major',
    genre: 'Boom Bap',
    tags: ['sample', 'vinyl', 'classic', 'chill'],
    duration: '3:56',
    waveformData: generateWaveformData(),
    plays: 54300,
    likes: 4600,
    coverImage: 'https://images.unsplash.com/photo-1461784180009-21121b2f204c?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: daysAgo(4),
  },
  {
    id: 'b8',
    title: 'Celestial Keys',
    slug: 'celestial-keys',
    producer: mockProducers[7],
    bpm: 78,
    key: 'F major',
    genre: 'Gospel Trap',
    tags: ['keys', 'gospel', 'uplifting', 'spiritual'],
    duration: '4:32',
    waveformData: generateWaveformData(),
    plays: 41200,
    likes: 3800,
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: false,
    publishedAt: daysAgo(5),
  },
  {
    id: 'b9',
    title: 'Shadow Realm',
    slug: 'shadow-realm',
    producer: mockProducers[8],
    bpm: 155,
    key: 'A minor',
    genre: 'Dark Trap',
    tags: ['dark', 'eerie', 'horror', 'memphis'],
    duration: '2:48',
    waveformData: generateWaveformData(),
    plays: 198700,
    likes: 16400,
    coverImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: daysAgo(1),
  },
  {
    id: 'b10',
    title: 'Rainy Window',
    slug: 'rainy-window',
    producer: mockProducers[9],
    bpm: 72,
    key: 'C major',
    genre: 'Lo-Fi',
    tags: ['lo-fi', 'chill', 'study', 'rain'],
    duration: '5:10',
    waveformData: generateWaveformData(),
    plays: 234100,
    likes: 19200,
    coverImage: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&h=800&fit=crop&q=80',
    audioUrl: null,
    isFeatured: true,
    publishedAt: daysAgo(2),
  },
];

// ======================== MOCK GEAR REVIEWS ========================

export const mockGearReviews: GearReview[] = [
  {
    id: 'g1',
    title: 'Akai MPC Live II Review: The Ultimate Standalone Beat Machine',
    slug: 'akai-mpc-live-ii-review',
    product: 'MPC Live II',
    brand: 'Akai Professional',
    category: 'Drum Machines',
    price: '$1,199',
    rating: 4.8,
    excerpt: 'The MPC Live II is the best standalone beat machine ever made. Period. Here\'s why every producer needs one in their setup.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&h=450&fit=crop&q=80',
    pros: ['Standalone operation — no computer needed', '7" touchscreen with intuitive workflow', '16 velocity-sensitive pads feel incredible', 'Built-in speaker and rechargeable battery', 'Massive expansion storage via SATA drive'],
    cons: ['Heavy at 5.8 lbs for portability', 'Software updates can be slow', 'Learning curve for non-MPC users'],
    verdict: 'The MPC Live II is the gold standard for standalone production. Whether you\'re on a plane, in a hotel, or in the studio, this machine delivers professional results.',
    affiliateUrl: null,
    author: mockProducers[6],
    publishedAt: daysAgo(3),
  },
  {
    id: 'g2',
    title: 'Native Instruments Maschine MK3: Controller + Software Powerhouse',
    slug: 'native-instruments-maschine-mk3',
    product: 'Maschine MK3',
    brand: 'Native Instruments',
    category: 'Controllers',
    price: '$649',
    rating: 4.5,
    excerpt: 'Maschine MK3 bridges the gap between hardware and software like nothing else. But is the Komplete integration worth the price?',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1558383409-57baa6c8b082?w=800&h=450&fit=crop&q=80',
    pros: ['Komplete integration is unmatched', 'Dual high-res color displays', 'Smart Strip for note repeat and modulation', 'Excellent build quality and pad response', 'Massive sound library included'],
    cons: ['Requires computer to operate', 'Pricey compared to competitors', 'Can be overwhelming for beginners'],
    verdict: 'If you\'re already in the NI ecosystem, Maschine MK3 is a no-brainer. The hardware-software integration is seamless and the sound library alone is worth the price.',
    affiliateUrl: null,
    author: mockProducers[2],
    publishedAt: daysAgo(5),
  },
  {
    id: 'g3',
    title: 'Yamaha HS8 Studio Monitors: Honest Sound at a Fair Price',
    slug: 'yamaha-hs8-studio-monitors',
    product: 'HS8',
    brand: 'Yamaha',
    category: 'Monitors',
    price: '$699/pair',
    rating: 4.6,
    excerpt: 'The Yamaha HS8s continue the legacy of honest, flat monitoring. They won\'t flatter your mixes — and that\'s exactly the point.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=450&fit=crop&q=80',
    pros: ['Incredibly flat frequency response', 'Excellent low-end for 8" woofer', 'Room control switches for acoustic correction', 'Built to last — classic Yamaha quality', 'White cone is iconic studio aesthetic'],
    cons: ['Can sound harsh in untreated rooms', 'Bass port noise at high volumes', 'Need proper placement for best results'],
    verdict: 'For producers who want truth over hype, the HS8s are the industry standard for a reason. Your mixes will translate better on every system.',
    affiliateUrl: null,
    author: mockProducers[3],
    publishedAt: daysAgo(7),
  },
  {
    id: 'g4',
    title: 'Shure SM7B: The Vocal Mic That Changed Everything',
    slug: 'shure-sm7b-review',
    product: 'SM7B',
    brand: 'Shure',
    category: 'Microphones',
    price: '$399',
    rating: 4.9,
    excerpt: 'From Michael Jackson\'s "Thriller" to every major podcast — the SM7B is the most versatile dynamic mic ever made. Here\'s our deep dive.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=450&fit=crop&q=80',
    pros: ['Legendary vocal tone — warm, full, present', 'Excellent off-axis rejection', 'Built like a tank — will outlast you', 'Works for vocals, instruments, podcasts', 'Electromagnetic shielding kills hum/buzz'],
    cons: ['Needs a LOT of clean gain (CloudLifter recommended)', 'Heavy — need a sturdy boom arm', 'Not ideal for quiet acoustic sources'],
    verdict: 'There\'s a reason the SM7B has been an industry staple for 50 years. Pair it with a CloudLifter and a good preamp, and you\'ve got radio-ready vocals.',
    affiliateUrl: null,
    author: mockProducers[0],
    publishedAt: daysAgo(10),
  },
  {
    id: 'g5',
    title: 'Universal Audio Apollo Twin X Review: Studio-Grade Interface',
    slug: 'universal-audio-apollo-twin-x',
    product: 'Apollo Twin X',
    brand: 'Universal Audio',
    category: 'Audio Interfaces',
    price: '$1,299',
    rating: 4.7,
    excerpt: 'The Apollo Twin X brings legendary UA preamps and real-time UAD processing to your desktop. Premium price, premium results.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=450&fit=crop&q=80',
    pros: ['Unison preamps sound incredible', 'Real-time UAD plugin processing', 'Near-zero latency monitoring', 'Premium build quality — all metal', 'Console software is intuitive and powerful'],
    cons: ['Expensive for a 2-input interface', 'UAD plugins require additional purchase', 'Thunderbolt only — no USB option'],
    verdict: 'If you can afford it, the Apollo Twin X is the best 2-channel interface money can buy. The Unison preamps and UAD ecosystem are game-changers.',
    affiliateUrl: null,
    author: mockProducers[1],
    publishedAt: daysAgo(12),
  },
  {
    id: 'g6',
    title: 'Audio-Technica ATH-M50x: The Producer Headphone Standard',
    slug: 'audio-technica-ath-m50x',
    product: 'ATH-M50x',
    brand: 'Audio-Technica',
    category: 'Headphones',
    price: '$149',
    rating: 4.4,
    excerpt: 'At $149, the M50x might be the best value in studio headphones. Accurate, comfortable, and damn near indestructible.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=450&fit=crop&q=80',
    pros: ['Outstanding accuracy for the price', 'Comfortable for long sessions', 'Detachable cables (3 included)', 'Folds flat for portability', 'Extended low-end for beat makers'],
    cons: ['Soundstage is narrow (closed-back)', 'Can get warm after 3+ hours', 'Earpads wear out and need replacement'],
    verdict: 'The M50x remains the default recommendation for producers on a budget — and even producers NOT on a budget. Just buy them.',
    affiliateUrl: null,
    author: mockProducers[4],
    publishedAt: daysAgo(14),
  },
  {
    id: 'g7',
    title: 'Novation Launchpad X: Grid Controller for Ableton Power Users',
    slug: 'novation-launchpad-x-review',
    product: 'Launchpad X',
    brand: 'Novation',
    category: 'MIDI Controllers',
    price: '$169',
    rating: 4.3,
    excerpt: 'The Launchpad X is the best grid controller for Ableton Live users. 64 RGB pads, velocity sensitivity, and deep DAW integration.',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1571266028243-d220c6d3173e?w=800&h=450&fit=crop&q=80',
    pros: ['Deep Ableton Live integration', 'Velocity and pressure-sensitive pads', 'RGB LED feedback is beautiful', 'Compact and bus-powered', 'Works with other DAWs via MIDI'],
    cons: ['Only really shines with Ableton', 'No knobs or faders', 'Pads are smaller than MPC-style'],
    verdict: 'For Ableton users, the Launchpad X is essential. For other DAW users, consider alternatives with more traditional controls.',
    affiliateUrl: null,
    author: mockProducers[5],
    publishedAt: daysAgo(16),
  },
  {
    id: 'g8',
    title: 'Arturia MiniLab 3: Best Budget MIDI Keyboard for Beginners',
    slug: 'arturia-minilab-3-review',
    product: 'MiniLab 3',
    brand: 'Arturia',
    category: 'MIDI Controllers',
    price: '$99',
    rating: 4.2,
    excerpt: 'Arturia\'s MiniLab 3 packs 25 keys, 8 pads, 8 knobs, and Analog Lab into a $99 package. Is it too good to be true?',
    body: 'Full review content...',
    coverImage: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=450&fit=crop&q=80',
    pros: ['Incredible value at $99', 'Analog Lab Intro included (500+ presets)', 'Slim, portable, USB-C', 'Knobs and pads add versatility', 'Works with any DAW'],
    cons: ['Mini keys — not for serious playing', 'No aftertouch', 'Pads are small and stiff'],
    verdict: 'For beginners and mobile producers, the MiniLab 3 is unbeatable value. The included Analog Lab software alone makes it worth the price.',
    affiliateUrl: null,
    author: mockProducers[7],
    publishedAt: daysAgo(18),
  },
];

// ======================== MOCK SAMPLE PACKS ========================

export const mockSamplePacks: SamplePack[] = [
  {
    id: 'sp1',
    title: 'Midnight 808 Kit Vol. 3',
    slug: 'midnight-808-kit-vol-3',
    creator: 'Bass Architect',
    price: 'Free',
    isFree: true,
    sampleCount: 45,
    genres: ['Trap', 'Dark Trap', 'Phonk'],
    description: '45 carefully crafted 808 samples — from deep sub-bass to distorted aggression. Each tuned to C and ready to pitch.',
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop&q=80',
    previewSounds: [],
    rating: 4.9,
    downloadCount: 124500,
    publishedAt: daysAgo(2),
  },
  {
    id: 'sp2',
    title: 'Neo Soul Keys Collection',
    slug: 'neo-soul-keys-collection',
    creator: 'Nebula Keys',
    price: '$24.99',
    isFree: false,
    sampleCount: 120,
    genres: ['R&B', 'Neo-Soul', 'Gospel'],
    description: 'Premium Rhodes, Wurlitzer, and Clavinet loops recorded through vintage tube amps. 120 loops in multiple keys and tempos.',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop&q=80',
    previewSounds: [],
    rating: 4.7,
    downloadCount: 34200,
    publishedAt: daysAgo(5),
  },
  {
    id: 'sp3',
    title: 'Drill Percussion Toolkit',
    slug: 'drill-percussion-toolkit',
    creator: 'DrumGod',
    price: '$14.99',
    isFree: false,
    sampleCount: 200,
    genres: ['Drill', 'UK Drill', 'NY Drill'],
    description: '200 one-shot drum samples optimized for drill production. Includes slides, percs, hi-hats, snares, and kicks.',
    coverImage: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop&q=80',
    previewSounds: [],
    rating: 4.8,
    downloadCount: 87300,
    publishedAt: daysAgo(8),
  },
  {
    id: 'sp4',
    title: 'Lo-Fi Dreams Sample Pack',
    slug: 'lofi-dreams-sample-pack',
    creator: 'Luna Waves',
    price: 'Free',
    isFree: true,
    sampleCount: 80,
    genres: ['Lo-Fi', 'Chill Hop', 'Jazz'],
    description: 'Vinyl textures, jazz piano loops, dusty drums, and ambient pads. Everything you need for lo-fi beats.',
    coverImage: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&h=800&fit=crop&q=80',
    previewSounds: [],
    rating: 4.6,
    downloadCount: 198400,
    publishedAt: daysAgo(12),
  },
  {
    id: 'sp5',
    title: 'Cinematic Strings & Pads',
    slug: 'cinematic-strings-pads',
    creator: 'Melo Circuit',
    price: '$29.99',
    isFree: false,
    sampleCount: 65,
    genres: ['Melodic Trap', 'Cinematic', 'Ambient'],
    description: 'Orchestral strings and evolving pads perfect for melodic trap and cinematic production. Recorded with a 12-piece string section.',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=800&fit=crop&q=80',
    previewSounds: [],
    rating: 4.8,
    downloadCount: 45600,
    publishedAt: daysAgo(15),
  },
];

// ======================== FREQUENCY CHART ========================

export const mockFrequencyChart: FrequencyChartEntry[] = [
  { rank: 1, beat: mockBeats[9], previousRank: 2, weeksOnChart: 8 },
  { rank: 2, beat: mockBeats[8], previousRank: 1, weeksOnChart: 12 },
  { rank: 3, beat: mockBeats[3], previousRank: 5, weeksOnChart: 6 },
  { rank: 4, beat: mockBeats[4], previousRank: 3, weeksOnChart: 10 },
  { rank: 5, beat: mockBeats[0], previousRank: null, weeksOnChart: 1 },
  { rank: 6, beat: mockBeats[2], previousRank: 4, weeksOnChart: 9 },
  { rank: 7, beat: mockBeats[6], previousRank: 7, weeksOnChart: 14 },
  { rank: 8, beat: mockBeats[1], previousRank: 9, weeksOnChart: 5 },
  { rank: 9, beat: mockBeats[7], previousRank: 6, weeksOnChart: 7 },
  { rank: 10, beat: mockBeats[5], previousRank: 8, weeksOnChart: 4 },
];

// ======================== HELPER FUNCTIONS ========================

export function getFeaturedProducers(): Producer[] {
  return mockProducers.filter(p => p.featured);
}

export function getProducerBySlug(slug: string): Producer | undefined {
  return mockProducers.find(p => p.slug === slug);
}

export function getFeaturedBeats(): Beat[] {
  return mockBeats.filter(b => b.isFeatured);
}

export function getBeatsByProducer(producerId: string): Beat[] {
  return mockBeats.filter(b => b.producer.id === producerId);
}

export function getTutorialsByDAW(daw: DAWType): Tutorial[] {
  return mockTutorials.filter(t => t.daw === daw);
}

export function getTutorialsByLevel(level: SkillLevel): Tutorial[] {
  return mockTutorials.filter(t => t.skillLevel === level);
}

export function getTutorialsByCategory(category: TutorialCategory): Tutorial[] {
  return mockTutorials.filter(t => t.category === category);
}

export function getLatestTutorials(count: number = 6): Tutorial[] {
  return [...mockTutorials]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getTrendingBeats(count: number = 8): Beat[] {
  return [...mockBeats]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, count);
}

export function getTopGearReviews(count: number = 4): GearReview[] {
  return [...mockGearReviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
