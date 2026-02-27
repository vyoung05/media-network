import type { Article, User } from '@media-network/shared';

// ======================== MOCK AUTHORS ========================

const authors: User[] = [
  {
    id: '1',
    email: 'dj.source@saucewire.com',
    name: 'DJ Source',
    role: 'writer',
    avatar_url: null,
    bio: 'Music journalist covering hip-hop and R&B.',
    links: { twitter: 'https://twitter.com/djsource' },
    brand_affiliations: ['saucewire'],
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'maya.chen@saucewire.com',
    name: 'Maya Chen',
    role: 'editor',
    avatar_url: null,
    bio: 'Culture editor. Fashion, art, and everything in between.',
    links: { instagram: 'https://instagram.com/mayachen' },
    brand_affiliations: ['saucewire', 'saucecaviar'],
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'tech.wire@saucewire.com',
    name: 'TechWire',
    role: 'writer',
    avatar_url: null,
    bio: 'Covering technology at the intersection of culture.',
    links: {},
    brand_affiliations: ['saucewire'],
    is_verified: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    email: 'sports.desk@saucewire.com',
    name: 'Sports Desk',
    role: 'writer',
    avatar_url: null,
    bio: 'Sports coverage with a culture lens.',
    links: {},
    brand_affiliations: ['saucewire'],
    is_verified: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

// ======================== MOCK ARTICLES ========================

const now = new Date();
function hoursAgo(hours: number): string {
  return new Date(now.getTime() - hours * 3600 * 1000).toISOString();
}

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Drake Drops Surprise Album at Midnight — Fans Go Wild on Social Media',
    slug: 'drake-surprise-album-midnight',
    body: `<p>In a move that's become his signature, Drake released a full-length album at midnight with zero prior announcement. The project, titled "Nocturnal," features 16 tracks including collaborations with Future, SZA, and a posthumous verse from Juice WRLD.</p>
<p>Social media erupted within minutes of the drop. "Nocturnal" was trending worldwide on X (formerly Twitter) within 30 minutes, with fans sharing their instant reactions and favorite tracks.</p>
<p>The album marks Drake's first full release in over a year, following a string of singles that kept fans speculating about a new project. Industry sources suggest the surprise strategy was deliberate, avoiding the typical album rollout cycle that has become increasingly complex in the streaming era.</p>
<p>Early standout tracks include "3 AM in Toronto," a haunting introspective piece, and "Overtime" featuring Future, which has already spawned a TikTok dance challenge. Spotify reported that "Nocturnal" broke the platform's record for most first-hour streams of a hip-hop album.</p>`,
    excerpt: 'Drake releases "Nocturnal" at midnight with 16 tracks, featuring Future, SZA, and a posthumous Juice WRLD verse. Spotify first-hour records shattered.',
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    brand: 'saucewire',
    category: 'Music',
    tags: ['drake', 'album-release', 'hip-hop', 'breaking'],
    author_id: '1',
    author: authors[0],
    status: 'published',
    is_breaking: true,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 3,
    view_count: 15420,
    published_at: hoursAgo(1),
    created_at: hoursAgo(2),
    updated_at: hoursAgo(1),
  },
  {
    id: '2',
    title: 'Nike x Pharrell "Humanrace" Collection Drops This Friday — First Look Inside',
    slug: 'nike-pharrell-humanrace-collection',
    body: `<p>Nike and Pharrell Williams are set to release their latest "Humanrace" collaboration this Friday, and we've got an exclusive first look at the entire collection.</p>
<p>The drop includes three new colorways of the Humanrace NMD, a reimagined Air Max 1, and an apparel line that blends athletic performance with Pharrell's signature maximalist aesthetic.</p>
<p>Prices range from $110 for tees to $250 for the sneakers. The collection will be available on Nike SNKRS, select retailers, and Pharrell's website.</p>`,
    excerpt: 'Nike and Pharrell\'s latest "Humanrace" collab includes NMDs, Air Max 1s, and a full apparel line. Dropping this Friday.',
    cover_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
    brand: 'saucewire',
    category: 'Fashion',
    tags: ['nike', 'pharrell', 'sneakers', 'fashion'],
    author_id: '2',
    author: authors[1],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 4,
    view_count: 8930,
    published_at: hoursAgo(3),
    created_at: hoursAgo(4),
    updated_at: hoursAgo(3),
  },
  {
    id: '3',
    title: 'Apple Vision Pro Gets Major Update — Spatial Music Videos Are Here',
    slug: 'apple-vision-pro-spatial-music-videos',
    body: `<p>Apple just rolled out a massive update for Vision Pro that's going to change how we experience music. The new "Spatial Music" feature transforms music videos into immersive 3D environments.</p>
<p>Launch partners include Travis Scott, Bad Bunny, Billie Eilish, and The Weeknd, each offering custom spatial experiences for their latest singles.</p>
<p>The update also includes improved hand tracking, new productivity features, and a redesigned home environment.</p>`,
    excerpt: 'Apple Vision Pro now supports spatial music videos with Travis Scott, Bad Bunny, and Billie Eilish as launch partners.',
    cover_image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1200',
    brand: 'saucewire',
    category: 'Tech',
    tags: ['apple', 'vision-pro', 'music', 'tech'],
    author_id: '3',
    author: authors[2],
    status: 'published',
    is_breaking: false,
    is_ai_generated: true,
    source_url: 'https://apple.com/newsroom',
    reading_time_minutes: 3,
    view_count: 12100,
    published_at: hoursAgo(5),
    created_at: hoursAgo(6),
    updated_at: hoursAgo(5),
  },
  {
    id: '4',
    title: 'LeBron James Launches Production Company Focused on Hip-Hop Documentaries',
    slug: 'lebron-james-hiphop-documentaries',
    body: `<p>LeBron James is expanding his entertainment empire with a new production company dedicated entirely to hip-hop documentaries and docuseries.</p>
<p>The venture, called "The Vault Productions," has already secured deals with Netflix and Amazon for three projects covering untold stories from hip-hop's golden era.</p>
<p>The first project will explore the rise of Southern rap, from the Dungeon Family to the trap movement.</p>`,
    excerpt: 'LeBron\'s new "Vault Productions" has deals with Netflix and Amazon for hip-hop documentaries. First project: the rise of Southern rap.',
    cover_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
    brand: 'saucewire',
    category: 'Entertainment',
    tags: ['lebron-james', 'documentaries', 'hip-hop', 'netflix'],
    author_id: '4',
    author: authors[3],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 2,
    view_count: 6750,
    published_at: hoursAgo(7),
    created_at: hoursAgo(8),
    updated_at: hoursAgo(7),
  },
  {
    id: '5',
    title: 'NBA All-Star Weekend 2025: Everything You Need to Know',
    slug: 'nba-all-star-weekend-2025-guide',
    body: `<p>NBA All-Star Weekend is back, and this year it's bigger than ever. From the celebrity game to the three-point contest, here's your complete guide.</p>
<p>The main event features a new format, with captains selecting from a pool of voted starters and reserves. Musical performances by Kendrick Lamar and GloRilla are confirmed for halftime.</p>`,
    excerpt: 'Complete guide to NBA All-Star Weekend 2025 — new format, musical performances by Kendrick and GloRilla, and all the events.',
    cover_image: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=1200',
    brand: 'saucewire',
    category: 'Sports',
    tags: ['nba', 'all-star', 'basketball', 'kendrick-lamar'],
    author_id: '4',
    author: authors[3],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 5,
    view_count: 9200,
    published_at: hoursAgo(10),
    created_at: hoursAgo(11),
    updated_at: hoursAgo(10),
  },
  {
    id: '6',
    title: 'Kanye West\'s Donda Academy Unveils New Campus Design',
    slug: 'kanye-donda-academy-new-campus',
    body: `<p>Kanye West's Donda Academy has revealed plans for a new permanent campus, featuring a design by Tadao Ando that blends minimalism with bold, Brutalist architecture.</p>
<p>The campus includes a performing arts center, a fashion design studio, and a recording studio. Construction is expected to begin later this year.</p>`,
    excerpt: 'Donda Academy reveals Tadao Ando-designed campus with performing arts center, fashion studio, and recording facilities.',
    cover_image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200',
    brand: 'saucewire',
    category: 'Music',
    tags: ['kanye-west', 'donda-academy', 'architecture', 'education'],
    author_id: '2',
    author: authors[1],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 3,
    view_count: 7800,
    published_at: hoursAgo(14),
    created_at: hoursAgo(15),
    updated_at: hoursAgo(14),
  },
  {
    id: '7',
    title: 'Rihanna Teases Fenty Fragrance Launch With Cryptic Instagram Posts',
    slug: 'rihanna-fenty-fragrance-teaser',
    body: `<p>Rihanna is back at it with the mysterious social media posts. The mogul shared a series of cryptic images on Instagram hinting at a major Fenty fragrance launch.</p>
<p>The posts feature close-up shots of amber-colored liquid, tropical flowers, and the text "Coming Soon" in Fenty's signature typeface. Industry insiders believe the launch is set for next month.</p>`,
    excerpt: 'Rihanna\'s cryptic Instagram posts point to a new Fenty fragrance launch. Industry insiders say it drops next month.',
    cover_image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200',
    brand: 'saucewire',
    category: 'Fashion',
    tags: ['rihanna', 'fenty', 'fragrance', 'beauty'],
    author_id: '2',
    author: authors[1],
    status: 'published',
    is_breaking: false,
    is_ai_generated: true,
    source_url: null,
    reading_time_minutes: 2,
    view_count: 11200,
    published_at: hoursAgo(18),
    created_at: hoursAgo(19),
    updated_at: hoursAgo(18),
  },
  {
    id: '8',
    title: 'TikTok Launches Creator Fund 2.0 With Bigger Payouts for Music Content',
    slug: 'tiktok-creator-fund-2-music',
    body: `<p>TikTok has announced Creator Fund 2.0, a revamped monetization program that significantly increases payouts for creators who produce music-related content.</p>
<p>The new program offers up to 3x higher CPMs for original music, dance challenges, and music reviews. It also includes a $50M dedicated fund for emerging music creators.</p>`,
    excerpt: 'TikTok\'s Creator Fund 2.0 offers 3x higher payouts for music content plus a $50M fund for emerging music creators.',
    cover_image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200',
    brand: 'saucewire',
    category: 'Tech',
    tags: ['tiktok', 'creator-economy', 'music', 'social-media'],
    author_id: '3',
    author: authors[2],
    status: 'published',
    is_breaking: false,
    is_ai_generated: true,
    source_url: 'https://tiktok.com/press',
    reading_time_minutes: 3,
    view_count: 5400,
    published_at: hoursAgo(22),
    created_at: hoursAgo(23),
    updated_at: hoursAgo(22),
  },
  {
    id: '9',
    title: 'Megan Thee Stallion Announces Global Tour With All-Female Opening Acts',
    slug: 'megan-thee-stallion-global-tour',
    body: `<p>Megan Thee Stallion has announced a 40-city global tour featuring an all-female lineup of opening acts including GloRilla, Ice Spice, and Saweetie.</p>
<p>The "Hot Girl World Tour" kicks off in Houston this summer and includes stops in London, Paris, Tokyo, and Lagos. Pre-sale begins Monday for fan club members.</p>`,
    excerpt: 'Megan Thee Stallion\'s 40-city "Hot Girl World Tour" features all-female openers: GloRilla, Ice Spice, and Saweetie.',
    cover_image: 'https://images.unsplash.com/photo-1501386761578-0a55d8b8dce7?w=1200',
    brand: 'saucewire',
    category: 'Music',
    tags: ['megan-thee-stallion', 'tour', 'hip-hop', 'concerts'],
    author_id: '1',
    author: authors[0],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 2,
    view_count: 8100,
    published_at: hoursAgo(26),
    created_at: hoursAgo(27),
    updated_at: hoursAgo(26),
  },
  {
    id: '10',
    title: 'Caitlin Clark Signs Record-Breaking Endorsement Deal With Jordan Brand',
    slug: 'caitlin-clark-jordan-brand-deal',
    body: `<p>Caitlin Clark has signed the largest endorsement deal in women's basketball history with Jordan Brand. The multi-year deal is reportedly worth over $28 million and includes her own signature shoe.</p>
<p>The "CC1" is expected to launch in Fall 2025, making Clark only the second woman to receive a signature Jordan shoe after Maya Moore's Air Jordan collection.</p>`,
    excerpt: 'Caitlin Clark\'s $28M Jordan Brand deal is the biggest in women\'s basketball history. Signature shoe "CC1" drops Fall 2025.',
    cover_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
    brand: 'saucewire',
    category: 'Sports',
    tags: ['caitlin-clark', 'jordan-brand', 'wnba', 'endorsement'],
    author_id: '4',
    author: authors[3],
    status: 'published',
    is_breaking: true,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 3,
    view_count: 13500,
    published_at: hoursAgo(30),
    created_at: hoursAgo(31),
    updated_at: hoursAgo(30),
  },
  {
    id: '11',
    title: 'Virgil Abloh Foundation Awards $5M in Scholarships to HBCU Design Students',
    slug: 'virgil-abloh-foundation-hbcu-scholarships',
    body: `<p>The Virgil Abloh™ "Post-Modern" Scholarship Fund has awarded $5 million in scholarships to students at HBCUs studying fashion design, architecture, and creative arts.</p>
<p>This year's recipients include 50 students across 12 institutions, each receiving full tuition coverage plus mentorship from leading designers.</p>`,
    excerpt: 'Virgil Abloh Foundation gives $5M in scholarships to 50 HBCU students in fashion, architecture, and creative arts.',
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200',
    brand: 'saucewire',
    category: 'Fashion',
    tags: ['virgil-abloh', 'hbcu', 'scholarships', 'fashion'],
    author_id: '2',
    author: authors[1],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 3,
    view_count: 4300,
    published_at: hoursAgo(36),
    created_at: hoursAgo(37),
    updated_at: hoursAgo(36),
  },
  {
    id: '12',
    title: 'Netflix Greenlights Hip-Hop Anime Series From Flying Lotus',
    slug: 'netflix-hiphop-anime-flying-lotus',
    body: `<p>Netflix has greenlit a 12-episode anime series from producer/musician Flying Lotus that blends hip-hop culture with cyberpunk aesthetics.</p>
<p>Titled "Bass Frequency," the series is set in a futuristic version of Los Angeles where underground DJs use music as a weapon against a corporate-controlled society. Thundercat and Denzel Curry are voicing characters.</p>`,
    excerpt: 'Flying Lotus\'s anime "Bass Frequency" is coming to Netflix — cyberpunk LA where DJs fight the system with music.',
    cover_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200',
    brand: 'saucewire',
    category: 'Entertainment',
    tags: ['netflix', 'anime', 'flying-lotus', 'hip-hop'],
    author_id: '1',
    author: authors[0],
    status: 'published',
    is_breaking: false,
    is_ai_generated: false,
    source_url: null,
    reading_time_minutes: 2,
    view_count: 9800,
    published_at: hoursAgo(40),
    created_at: hoursAgo(41),
    updated_at: hoursAgo(40),
  },
];

// ======================== HELPERS ========================

export function getBreakingArticles(): Article[] {
  return mockArticles.filter(a => a.is_breaking);
}

export function getTrendingArticles(limit = 5): Article[] {
  return [...mockArticles]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  return mockArticles.filter(
    a => a.category.toLowerCase() === category.toLowerCase()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(a => a.slug === slug);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return mockArticles.filter(
    a =>
      a.title.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q) ||
      a.tags.some(t => t.includes(q))
  );
}
