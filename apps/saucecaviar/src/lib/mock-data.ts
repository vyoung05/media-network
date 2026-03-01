// ============================================================
// SauceCaviar — Rich Mock Data for 2 Full Magazine Issues
// ============================================================

export type PageType =
  | 'cover'
  | 'toc'
  | 'article'
  | 'spread'
  | 'video'
  | 'ad'
  | 'artist'
  | 'full-bleed'
  | 'back-cover'
  | 'audio'
  | 'gallery'
  | 'video-ad'
  | 'interactive'
  | 'quote'
  | 'credits'
  | 'letter';

export interface MagazinePage {
  id: string;
  pageNumber: number;
  type: PageType;
  title?: string;
  subtitle?: string;
  content?: string;
  pullQuote?: string;
  author?: string;
  authorTitle?: string;
  imageUrl: string;
  imageAlt?: string;
  secondaryImageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  category?: string;
  tags?: string[];
  videoUrl?: string;
  musicEmbed?: string;
  artistName?: string;
  artistBio?: string;
  artistLinks?: Record<string, string>;
  advertiserName?: string;
  advertiserTagline?: string;
  advertiserCta?: string;
  advertiserUrl?: string;
  tocEntries?: TocEntry[];
}

export interface TocEntry {
  title: string;
  page: number;
  category: string;
}

export interface MagazineIssue {
  id: string;
  slug: string;
  title: string;
  issueNumber: number;
  subtitle: string;
  description: string;
  coverImage: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  pageCount: number;
  pages: MagazinePage[];
  featuredColor?: string;
  season?: string;
}

// ============================================================
// ISSUE #1 — "The Glow Up Issue"
// ============================================================

const glowUpPages: MagazinePage[] = [
  // Page 1: Cover
  {
    id: 'glow-1-cover',
    pageNumber: 1,
    type: 'cover',
    title: 'The Glow Up Issue',
    subtitle: 'Reinvention Starts Here',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=1600&fit=crop',
    imageAlt: 'Fashion editorial cover shot',
    category: 'Issue #1',
    backgroundColor: '#0A0A0A',
  },
  // Page 2: Table of Contents
  {
    id: 'glow-1-toc',
    pageNumber: 2,
    type: 'toc',
    title: 'Contents',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1200&fit=crop',
    tocEntries: [
      { title: 'The Art of Reinvention', page: 3, category: 'Feature' },
      { title: 'Street Luxe: When Concrete Meets Couture', page: 5, category: 'Fashion' },
      { title: 'Presented by Maison Noir', page: 7, category: 'Advertisement' },
      { title: 'Golden Hour — A Photo Editorial', page: 8, category: 'Photography' },
      { title: 'Rising: Amara Osei', page: 10, category: 'Artist Spotlight' },
      { title: 'The Sound of Transformation', page: 11, category: 'Feature' },
      { title: 'Presented by AURA Fragrances', page: 13, category: 'Advertisement' },
      { title: 'Letter from the Editor', page: 14, category: 'Closing' },
    ],
  },
  // Page 3–4: Feature Article — The Art of Reinvention
  {
    id: 'glow-1-art1',
    pageNumber: 3,
    type: 'article',
    title: 'The Art of Reinvention',
    subtitle: 'How culture\'s most daring minds shed their skin — and why it matters now more than ever',
    author: 'Jasmine Laurent',
    authorTitle: 'Editor-in-Chief',
    category: 'Feature',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=800&fit=crop',
    imageAlt: 'Portrait of creative transformation',
    content: `There is a sacred violence in becoming someone new. Not the superficial kind — not a haircut, not a wardrobe swap — but the marrow-deep metamorphosis that happens when an artist, a dreamer, a culture-maker decides that who they were is no longer who they need to be.

We've watched it happen in real time. Pharrell pivoted from rapper-producer to luxury fashion architect. Rihanna shelved music to build a billion-dollar empire. Tyler, the Creator burned his shock-rap persona at the altar and emerged wearing custom Le Fleur suits. These aren't pivots. They're evolutions.

The glow up isn't about looking better. It's about seeing clearer. It's the producer who stops chasing trends and starts making the sounds only they can hear. It's the photographer who throws out the mood board and shoots from instinct. It's the kid from the block who learns that authenticity is the ultimate luxury.

In this issue, we celebrate the courage of transformation. We sit with the artists, designers, and visionaries who burned the old playbook and wrote something wilder, truer, and more alive. Because in a culture obsessed with consistency, there's nothing more radical than change.

Culture doesn't wait for permission. It sheds its skin when the season demands it. And right now, the season is demanding something extraordinary.`,
    pullQuote: '"The glow up isn\'t about looking better. It\'s about seeing clearer."',
    tags: ['culture', 'reinvention', 'editorial'],
  },
  {
    id: 'glow-1-art1b',
    pageNumber: 4,
    type: 'article',
    title: 'The Art of Reinvention',
    subtitle: 'Continued',
    author: 'Jasmine Laurent',
    category: 'Feature',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop',
    content: `Consider the trajectory of someone like Steve Lacy. A kid from Compton who started producing on his iPhone, became a member of The Internet, and then exploded as a solo artist with a sound that defies every box the industry tried to put him in. Rock, R&B, psychedelia, pop — he absorbed it all and output something entirely his own.

That's the alchemy of the glow up. It's not addition — it's synthesis. You don't just add new skills or new aesthetics to your existing self. You dissolve the boundaries between who you were and who you could be, and from that dissolution, something unprecedented crystallizes.

The fashion world understands this instinctively. Demna Gvasalia at Balenciaga turned trauma into haute couture. Virgil Abloh, before his untimely passing, proved that a DJ from Rockford, Illinois could stand at the helm of Louis Vuitton and make it feel like the most natural thing in the world.

What these luminaries share isn't talent alone — though they have it in abundance. What they share is the willingness to be uncomfortable. To sit in the unknown. To release the version of themselves that the world already loved in pursuit of the version the world hadn't met yet.

This issue is your permission slip — not that you need one. Step into the fire. Let the old version of you become kindling for something magnificent.`,
    pullQuote: '"Step into the fire. Let the old version of you become kindling for something magnificent."',
    tags: ['culture', 'reinvention'],
  },
  // Page 5–6: Feature — Street Luxe
  {
    id: 'glow-1-art2',
    pageNumber: 5,
    type: 'article',
    title: 'Street Luxe',
    subtitle: 'When Concrete Meets Couture — The New Rules of Fashion\'s Most Exciting Intersection',
    author: 'Marcus Webb',
    authorTitle: 'Fashion Director',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop',
    imageAlt: 'Street fashion editorial',
    content: `The line between streetwear and high fashion didn't just blur — it evaporated. What started as a subversive undercurrent has become the dominant force in global fashion, and the gatekeepers who once sneered at sneakers on the runway now compete for the cosign of the culture.

Walk the streets of any major city — Lagos, Tokyo, London, Atlanta — and you'll see it: a $3,000 Bottega Veneta bag paired with vintage Nike Dunks. A hand-tailored Savile Row blazer over a screen-printed tee from a local artist. Cartier on the wrist, Carhartt on the body.

This isn't confusion. It's fluency. The new generation speaks fashion like a polyglot, mixing dialects of luxury and street with an intuition that can't be taught in any design school. They understand something the old guard took decades to learn: that taste is not about price point. It's about intention.

The codes have shifted. Logomania is out. Quiet luxury isn't enough either — it's too safe, too afraid to make a statement. What's emerging is something we're calling "Street Luxe" — a mode of dressing that honors craft and culture simultaneously. Materials matter. Provenance matters. But so does the story you carry in your stride.`,
    pullQuote: '"Taste is not about price point. It\'s about intention."',
    tags: ['fashion', 'streetwear', 'luxury'],
  },
  {
    id: 'glow-1-art2b',
    pageNumber: 6,
    type: 'spread',
    title: 'Street Luxe: The Editorial',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop',
    imageAlt: 'Street luxe fashion editorial spread',
    content: `Styled by Marcus Webb | Photography by Kai Ashton

Look 1: Oversized cashmere topcoat in dove grey, layered over a hand-distressed vintage band tee. Wide-leg wool trousers break over custom Air Force 1s in sail leather. 18k gold Cuban link completes the look.

Look 2: Deconstructed double-breasted blazer in midnight navy — intentionally raw hem — worn open over a ribbed tank in cream. Leather cargo pants, slim cut. Chrome Hearts accessories. Y-3 Qasa High in triple black.

Look 3: Full leather ensemble — butter-soft jacket and matching wide-leg pants in cognac. Underneath: nothing but a gold chain and confidence. Bottega Veneta Pouch in noir. Custom vintage Jordans.

Each look tells the same story differently: that the most powerful fashion statement isn't what you wear — it's the conviction with which you wear it.`,
    category: 'Fashion',
    tags: ['fashion', 'editorial', 'photography'],
  },
  // Page 7: Ad — Maison Noir
  {
    id: 'glow-1-ad1',
    pageNumber: 7,
    type: 'ad',
    title: 'Maison Noir',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=1600&fit=crop',
    imageAlt: 'Maison Noir luxury fragrance advertisement',
    advertiserName: 'Maison Noir',
    advertiserTagline: 'Darkness Has Never Looked This Good',
    advertiserCta: 'Discover the Collection',
    advertiserUrl: 'https://example.com/maison-noir',
    backgroundColor: '#0A0A0A',
  },
  // Page 8–9: Photo Spread — Golden Hour
  {
    id: 'glow-1-spread1',
    pageNumber: 8,
    type: 'full-bleed',
    title: 'Golden Hour',
    subtitle: 'A Photo Editorial by Kai Ashton',
    imageUrl: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=1200&h=1600&fit=crop',
    imageAlt: 'Golden hour portrait photography',
    category: 'Photography',
    tags: ['photography', 'editorial', 'golden-hour'],
  },
  {
    id: 'glow-1-spread2',
    pageNumber: 9,
    type: 'spread',
    title: 'Golden Hour',
    subtitle: 'When the light forgives everything',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1492684223f8-e1f1832c2f89?w=1200&h=800&fit=crop',
    imageAlt: 'Golden hour photo editorial spread',
    content: `There's a twenty-minute window every day when the world turns to gold. Photographers call it golden hour. We call it truth hour — because in that light, everything is exactly as beautiful as it was always meant to be.

Shot on location across three cities over two weeks. No retouching. No filters. Just natural light, real people, and the radical belief that beauty doesn't need to be manufactured — only witnessed.`,
    category: 'Photography',
  },
  // Page 10: Artist Spotlight — Amara Osei
  {
    id: 'glow-1-artist',
    pageNumber: 10,
    type: 'artist',
    title: 'Rising',
    subtitle: 'Amara Osei',
    artistName: 'Amara Osei',
    artistBio: `At 24, Amara Osei has already accomplished what most artists spend a lifetime chasing: a sound that is undeniably, irrevocably hers. Born in Accra, raised in South London, and now based between Lagos and LA, Osei's music is a bridge between worlds — Afrobeats rhythms wrapped in neo-soul warmth, topped with lyrics that read like love letters to diaspora.

Her debut EP "Homecoming" — which she produced, wrote, and mixed entirely herself — drew comparisons to everyone from Sade to Burna Boy. But Osei resists comparison. "I'm not trying to sound like anyone," she says, curled up in a studio chair at Westlake Studios. "I'm trying to sound like the feeling of landing in Accra after being away for too long. That specific joy. That specific ache."

The EP's lead single "Sugar Water" has already amassed 15 million streams, and her live shows — which blend music with spoken word and contemporary dance — have earned her festival slots at Coachella and Afro Nation.

"I think the glow up, for me, was realizing I didn't have to choose between my worlds. I can be African and British and American and futuristic all at once. The music holds all of it."`,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=1600&fit=crop',
    imageAlt: 'Amara Osei artist portrait',
    artistLinks: {
      spotify: 'https://spotify.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
    },
    musicEmbed: 'https://open.spotify.com/embed/track/placeholder',
    category: 'Artist Spotlight',
    pullQuote: '"I\'m trying to sound like the feeling of landing in Accra after being away for too long."',
    tags: ['music', 'artist-spotlight', 'afrobeats', 'neo-soul'],
  },
  // Page 11–12: Feature — The Sound of Transformation
  {
    id: 'glow-1-art3',
    pageNumber: 11,
    type: 'article',
    title: 'The Sound of Transformation',
    subtitle: 'How music production evolved from bedroom beats to billion-dollar art form',
    author: 'Devon Carter',
    authorTitle: 'Music Editor',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=800&fit=crop',
    imageAlt: 'Music studio production',
    content: `The democratization of music production is the most significant cultural shift of our generation. Full stop. What once required a million-dollar studio and a record label's blessing now requires a laptop, a pair of headphones, and an idea.

But let's be precise about what we mean. Democratization doesn't mean dilution. Yes, more people than ever are making music. But the cream rises — it always has. What's changed is that the cream no longer needs permission to exist.

Metro Boomin started making beats as a teenager in St. Louis. He didn't wait to be discovered. He uploaded, he networked, he iterated. Now he's one of the most influential producers alive. Lex Luger changed the sound of an entire genre from his bedroom in Virginia Beach. Timbaland was a prodigy, sure — but his innovative spirit is shared by thousands of producers today who have access to tools Tim couldn't have dreamed of in 1996.

The new producers aren't just musicians. They're architects of sonic worlds. They're using AI-assisted mixing, granular synthesis, spatial audio, and modular synthesis to create textures that didn't exist five years ago. The glow up of production is a glow up of possibility itself.`,
    pullQuote: '"Democratization doesn\'t mean dilution. The cream rises — it always has."',
    tags: ['music', 'production', 'technology'],
  },
  {
    id: 'glow-1-art3b',
    pageNumber: 12,
    type: 'article',
    title: 'The Sound of Transformation',
    subtitle: 'Continued',
    author: 'Devon Carter',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop',
    content: `The tools have leveled the playing field, but the vision — the audacity to imagine something that doesn't yet exist — that's still rare. That's still the thing that separates a beat-maker from a producer, a producer from an artist, an artist from a legend.

We spoke with five producers under thirty who are redefining what music can sound like. Their answers reveal a generation unburdened by genre loyalty, unafraid of experimentation, and deeply committed to craft.

"I don't think about what category my music falls into," says Zaire Bishop, a 26-year-old producer from Detroit whose work spans trap, ambient, and classical. "Categories are for libraries. I'm building worlds."

That worldbuilding mentality is everywhere. From Kaytranada's genre-agnostic dance productions to 070 Shake's otherworldly sonic landscapes, the new wave of creators isn't interested in fitting in. They're interested in breaking through — and taking us somewhere we've never been.

The glow up of music isn't just sonic. It's philosophical. It's a rejection of the idea that artists must be legible, categorizable, safe. The most exciting music being made right now is music that doesn't care if you understand it on first listen. It trusts that you'll come back — and hear something new every time.`,
    pullQuote: '"Categories are for libraries. I\'m building worlds." — Zaire Bishop',
    tags: ['music', 'production'],
  },
  // Page 13: Ad — AURA Fragrances
  {
    id: 'glow-1-ad2',
    pageNumber: 13,
    type: 'ad',
    title: 'AURA Fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea081e63837?w=1200&h=1600&fit=crop',
    imageAlt: 'AURA Fragrances advertisement',
    advertiserName: 'AURA Fragrances',
    advertiserTagline: 'Your Energy, Bottled.',
    advertiserCta: 'Shop Now',
    advertiserUrl: 'https://example.com/aura',
    backgroundColor: '#1A1A1A',
  },
  // Page 14: Back Cover
  {
    id: 'glow-1-back',
    pageNumber: 14,
    type: 'back-cover',
    title: 'Until Next Issue',
    subtitle: 'The Glow Up Continues...',
    content: `Thank you for reading Issue #1 of SauceCaviar. This magazine exists because culture deserves to be treated like art — not content, not noise, but art.

Every page was crafted with the same obsessive attention to detail that our featured artists bring to their work. We don't publish on a schedule. We publish when we have something worth saying.

Next issue: Summer Sauce Vol. 1 — where we explore the sounds, styles, and spirits of the season.

Stay premium. Stay curious. Stay glowing.

— The SauceCaviar Team`,
    imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=1600&fit=crop',
    imageAlt: 'SauceCaviar back cover',
    backgroundColor: '#0A0A0A',
  },
];

// ============================================================
// ISSUE #2 — "Summer Sauce Vol. 1"
// ============================================================

const summerSaucePages: MagazinePage[] = [
  // Page 1: Cover
  {
    id: 'summer-1-cover',
    pageNumber: 1,
    type: 'cover',
    title: 'Summer Sauce',
    subtitle: 'Vol. 1 — The Heat Issue',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1600&fit=crop',
    imageAlt: 'Summer editorial cover',
    category: 'Issue #2',
    backgroundColor: '#0A0A0A',
  },
  // Page 2: Table of Contents
  {
    id: 'summer-1-toc',
    pageNumber: 2,
    type: 'toc',
    title: 'Contents',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1200&fit=crop',
    tocEntries: [
      { title: 'Hot Town, Summer in the City', page: 3, category: 'Feature' },
      { title: 'The New Leisure', page: 5, category: 'Lifestyle' },
      { title: 'Presented by SOLARIS Swim', page: 7, category: 'Advertisement' },
      { title: 'Blue & Gold — A Photo Editorial', page: 8, category: 'Photography' },
      { title: 'Rising: Khalil Torres', page: 9, category: 'Artist Spotlight' },
      { title: 'Nocturnal Summer', page: 10, category: 'Feature' },
      { title: 'Letter from the Editor', page: 12, category: 'Closing' },
    ],
  },
  // Page 3–4: Feature — Hot Town
  {
    id: 'summer-1-art1',
    pageNumber: 3,
    type: 'article',
    title: 'Hot Town, Summer in the City',
    subtitle: 'A love letter to the season that turns every block into a runway',
    author: 'Jasmine Laurent',
    authorTitle: 'Editor-in-Chief',
    category: 'Feature',
    imageUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1200&h=800&fit=crop',
    imageAlt: 'Summer in the city editorial',
    content: `There's a specific energy that takes over a city when summer arrives — a collective exhale, a permission to exist more loudly, more colorfully, more freely. Fire hydrants become fountains. Stoops become stages. Every park becomes a festival that nobody organized but everybody attends.

Summer in the city isn't a season. It's a state of mind. It's the kid with the JBL speaker on the A train, turning the whole car into a mobile party. It's the bodega guy who sets up a domino table on the sidewalk and doesn't pack it up until midnight. It's the ice cream truck melody that hits different when you're 25 than it did when you were 8 — not because it changed, but because you understand now what it represents: the democratization of joy.

Fashion transforms too. Summer is the great equalizer — when every body type, every budget, every aesthetic gets its day in the sun. Literally. The guy in the $5 tank top from the corner store can look just as fly as the one in the $500 designer muscle tee. It's about skin, confidence, and the way the light hits you at 7 PM when the whole world turns amber.

We traveled to five cities — New York, Miami, Lagos, Barcelona, and Tokyo — to document how summer transforms urban culture. What we found was the same beautiful chaos everywhere: people choosing to be outside, choosing to be together, choosing to celebrate the fact that we're alive and the weather agrees.`,
    pullQuote: '"Summer in the city isn\'t a season. It\'s a state of mind."',
    tags: ['summer', 'city-life', 'culture'],
  },
  {
    id: 'summer-1-art1b',
    pageNumber: 4,
    type: 'spread',
    title: 'Summer Cities',
    subtitle: 'Five Cities, One Season, Infinite Sauce',
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=800&fit=crop',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=1200&h=800&fit=crop',
    imageAlt: 'Summer cities editorial spread',
    content: `NEW YORK — The stoop is still king. Washington Heights on a Sunday afternoon is a masterclass in community: mangú, bachata, and three generations of one family taking up the whole sidewalk without apology.

MIAMI — Wynwood has become the open-air gallery the world visits, but the real art is on 79th Street, where the murals aren't commissioned — they're confessions.

LAGOS — Lekki in summer is fashion week every weekend. The fabric choices alone — ankara prints in neon geometrics — make Milan look timid.

BARCELONA — Gothic Quarter at sunset, someone is always playing flamenco guitar badly and everyone loves it. That's the point.

TOKYO — Harajuku's summer dress code is anarchy with precision. Every outfit is a thesis statement.`,
    category: 'Feature',
    tags: ['travel', 'city-life', 'global'],
  },
  // Page 5–6: Feature — The New Leisure
  {
    id: 'summer-1-art2',
    pageNumber: 5,
    type: 'article',
    title: 'The New Leisure',
    subtitle: 'How luxury redefined relaxation — and why Gen Z isn\'t buying it',
    author: 'Solange Adeyemi',
    authorTitle: 'Lifestyle Editor',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop',
    imageAlt: 'Luxury leisure lifestyle',
    content: `Leisure used to be simple. A hammock. A cold drink. Maybe a paperback with a cracked spine. But somewhere between the rise of wellness culture and the Instagram aesthetic industrial complex, relaxation became... aspirational. It became expensive. It became a brand.

The $400 scented candle. The $200 "mindfulness" journal. The $150 linen loungewear set designed specifically for doing nothing in a way that looks like you could be in a Kinfolk editorial. We commodified rest, packaged it in neutral tones, and marked it up 800%.

And Gen Z is calling bullshit.

Not in a confrontational way — more in a "we're just going to do our own thing" way. The new leisure is unapologetically low-tech. It's park hangs with no agenda. It's screen-free Sundays. It's learning to cook a meal without filming it. It's reading a book because you want to, not because it was recommended by a BookTok influencer.

There's a beautiful irony here: the generation most associated with digital culture is the one most aggressively reclaiming analog rest. They grew up online and decided that the best luxury isn't a thing you buy — it's the absence of stimulation. It's silence treated not as emptiness but as fullness.`,
    pullQuote: '"The best luxury isn\'t a thing you buy — it\'s the absence of stimulation."',
    tags: ['lifestyle', 'wellness', 'gen-z'],
  },
  {
    id: 'summer-1-art2b',
    pageNumber: 6,
    type: 'article',
    title: 'The New Leisure',
    subtitle: 'Continued',
    author: 'Solange Adeyemi',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop',
    content: `The shift is showing up in consumption patterns too. Luxury resorts are seeing a decline in bookings from under-30 travelers who are instead opting for camping, road trips, and "slow travel" — staying in one place for weeks instead of hopping between tourist destinations.

"I don't want a curated experience," says Maya, 23, a graphic designer from Brooklyn. "I want a real one. I'd rather cook dinner in a rented house in the countryside than eat at a Michelin-starred restaurant. Not because I'm anti-luxury, but because luxury has been redefined for me. Real luxury is time. Real luxury is choosing how to spend it."

This philosophy extends to fashion. The most coveted summer pieces aren't logos or designer swim trunks — they're vintage finds, hand-dyed pieces from local makers, and items with stories attached. A friend's hand-me-down linen shirt. A bracelet bought from a street vendor in Marrakech. A faded cap from a dive bar in Montauk that you've been wearing for three summers straight.

The industry will try to co-opt this, of course. They always do. Some brand will release a "deliberately unbranded" collection and charge premium prices for the absence of a logo. It's already happening.

But here's the thing: you can't manufacture intentional nonchalance. You can't bottle genuine rest. And you can't sell someone the feeling of lying in the grass with nothing to do and nowhere to be. That feeling is free. And that's what makes it priceless.`,
    pullQuote: '"Real luxury is time. Real luxury is choosing how to spend it."',
    tags: ['lifestyle', 'wellness'],
  },
  // Page 7: Ad — SOLARIS Swim
  {
    id: 'summer-1-ad1',
    pageNumber: 7,
    type: 'ad',
    title: 'SOLARIS',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop',
    imageAlt: 'SOLARIS Swim advertisement',
    advertiserName: 'SOLARIS Swim',
    advertiserTagline: 'Born for the Sun',
    advertiserCta: 'Explore Summer \'25',
    advertiserUrl: 'https://example.com/solaris',
    backgroundColor: '#1A1A1A',
  },
  // Page 8: Full-bleed photo spread
  {
    id: 'summer-1-spread1',
    pageNumber: 8,
    type: 'full-bleed',
    title: 'Blue & Gold',
    subtitle: 'A Visual Meditation on Summer\'s Palette',
    imageUrl: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1200&h=1600&fit=crop',
    imageAlt: 'Blue and gold summer photography',
    category: 'Photography',
    tags: ['photography', 'editorial', 'summer'],
  },
  // Page 9: Artist Spotlight — Khalil Torres
  {
    id: 'summer-1-artist',
    pageNumber: 9,
    type: 'artist',
    title: 'Rising',
    subtitle: 'Khalil Torres',
    artistName: 'Khalil Torres',
    artistBio: `Khalil Torres doesn't make music for playlists. He makes music for moments — the kind of moments that only happen when the sun goes down and the city lights come up and everything feels like it's suspended in possibility.

The 22-year-old producer-singer from the Bronx has built a devoted following on the strength of his voice — a feathery tenor that sounds like it's always on the edge of a whisper — and his production, which layers lo-fi jazz samples with trap percussion and ambient textures that feel like warm fog.

His debut mixtape "Violet Hour" — self-released on SoundCloud last summer — has racked up 8 million plays. The project was recorded entirely in his grandmother's apartment in Mott Haven, using a $200 microphone and Ableton on a secondhand laptop.

"My grandmother's apartment has this specific silence," Torres explains, sitting on the fire escape of that same apartment. "It's not quiet — you can hear the trains, the neighbors, kids playing outside. But there's a peace to it. That's the texture I'm trying to capture in the music. The peace inside the chaos."

His live shows are intimate by design — never more than 200 people — and always feature a live jazz trio alongside his electronic production. The result is something that feels both ancient and futuristic, like a love song from a time that hasn't happened yet.`,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1600&fit=crop',
    imageAlt: 'Khalil Torres portrait',
    artistLinks: {
      spotify: 'https://spotify.com',
      soundcloud: 'https://soundcloud.com',
      instagram: 'https://instagram.com',
    },
    musicEmbed: 'https://open.spotify.com/embed/track/placeholder',
    category: 'Artist Spotlight',
    pullQuote: '"The peace inside the chaos — that\'s the texture I\'m trying to capture."',
    tags: ['music', 'artist-spotlight', 'producer', 'r-and-b'],
  },
  // Page 10–11: Feature — Nocturnal Summer
  {
    id: 'summer-1-art3',
    pageNumber: 10,
    type: 'article',
    title: 'Nocturnal Summer',
    subtitle: 'The nightlife renaissance nobody predicted — and everybody needed',
    author: 'Devon Carter',
    authorTitle: 'Music Editor',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop',
    imageAlt: 'Nightlife and music scene',
    content: `The pandemic killed nightlife. The post-pandemic era resurrected it — but different. Stranger. Better.

The new clubs don't look like clubs. They're rooftop gardens with DJ booths. Abandoned warehouses with immersive light installations. Pop-up parties in art galleries that start at midnight and end at dawn with everyone sitting in a circle sharing stories.

The old nightlife model — VIP sections, bottle service, velvet ropes — feels antiquated now. Not because people don't want luxury, but because the definition of luxury in a social setting has fundamentally shifted. The new luxury is intimacy. It's a room where everyone is there for the music, not the scene. It's a dance floor where your phone is in your pocket because the moment is better than any content you could capture.

We've entered what we're calling the "Third Space" era of nightlife — events that exist between a traditional club and a house party. They're curated but not corporate. They're exclusive but not elitist. And they're happening everywhere, from the basements of Brooklyn brownstones to the hilltops of Ibiza.

The DJs leading this movement aren't superstar headliners — they're selectors, tastemakers who understand that a great night isn't about hearing every hit. It's about being taken on a journey.`,
    pullQuote: '"The new luxury is intimacy. A room where everyone is there for the music, not the scene."',
    tags: ['nightlife', 'music', 'culture'],
  },
  {
    id: 'summer-1-art3b',
    pageNumber: 11,
    type: 'article',
    title: 'Nocturnal Summer',
    subtitle: 'Continued',
    author: 'Devon Carter',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200&h=800&fit=crop',
    content: `The sound has changed too. The aggressive, peak-time EDM that dominated the 2010s has given way to something more textured, more patient. Amapiano from South Africa. UK garage revival. Afro house. Baile funk from Brazil. The global south is setting the tempo now, and the rest of the world is learning the steps.

"I play a four-hour set and I might never go above 120 BPM," says DJ Zara, a London-based selector who's become one of the most in-demand names on the underground circuit. "The energy isn't about speed. It's about depth. I want people to close their eyes and feel like they're somewhere else entirely."

This slower, deeper approach to nightlife mirrors a broader cultural shift. We're moving from an economy of attention to an economy of presence. We don't want faster, louder, more. We want realer, deeper, truer.

And there's something poetic about this happening in summer — the season of long nights and short inhibitions. The season when time itself seems to slow down, when 3 AM feels like it could last forever.

This summer, the best parties won't be the ones you see on Instagram. They'll be the ones where nobody was looking at their phone. The ones where the music was so right that dancing was the only possible response. The ones that end with the sunrise and a feeling that something invisible but real happened between strangers who, for a few hours, weren't strangers at all.`,
    pullQuote: '"We\'re moving from an economy of attention to an economy of presence."',
    tags: ['nightlife', 'music', 'summer'],
  },
  // Page 12: Back Cover
  {
    id: 'summer-1-back',
    pageNumber: 12,
    type: 'back-cover',
    title: 'See You in the Heat',
    subtitle: 'Summer Sauce Vol. 1',
    content: `This issue was made in the heat — literally and figuratively.

Every story here is an invitation: to go outside, to stay up too late, to wear something bold, to listen to something new, to let the summer transform you the way it transforms everything it touches.

Issue #3 is already in the works. It'll be different. It always is.

Until then — stay premium, stay outside, stay sauced.

— Jasmine Laurent, Editor-in-Chief
SauceCaviar Magazine`,
    imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=1600&fit=crop',
    imageAlt: 'SauceCaviar back cover',
    backgroundColor: '#0A0A0A',
  },
];

// ============================================================
// ASSEMBLED ISSUES
// ============================================================

export const mockIssues: MagazineIssue[] = [
  {
    id: 'issue-1',
    slug: 'the-glow-up-issue',
    title: 'The Glow Up Issue',
    issueNumber: 1,
    subtitle: 'Reinvention Starts Here',
    description: 'Our inaugural issue explores the art of transformation — in fashion, music, art, and identity. Featuring artist spotlight Amara Osei, a deep dive into the Street Luxe movement, and a golden hour photo editorial that will stop you in your tracks.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=1600&fit=crop',
    publishedAt: '2025-01-15T12:00:00Z',
    status: 'published',
    pageCount: 14,
    pages: glowUpPages,
    featuredColor: '#C9A84C',
    season: 'Winter 2025',
  },
  {
    id: 'issue-2',
    slug: 'summer-sauce-vol-1',
    title: 'Summer Sauce Vol. 1',
    issueNumber: 2,
    subtitle: 'The Heat Issue',
    description: 'Summer is a state of mind. We traveled five cities to capture the season\'s energy, explored the nightlife renaissance nobody predicted, and sat with rising artist Khalil Torres in his grandmother\'s Bronx apartment. Plus: The New Leisure — how Gen Z is reclaiming rest.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1600&fit=crop',
    publishedAt: '2025-06-01T12:00:00Z',
    status: 'published',
    pageCount: 12,
    pages: summerSaucePages,
    featuredColor: '#D4B965',
    season: 'Summer 2025',
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getIssueBySlug(slug: string): MagazineIssue | undefined {
  return mockIssues.find(i => i.slug === slug);
}

export function getLatestIssue(): MagazineIssue {
  return mockIssues[mockIssues.length - 1];
}

export function getAllIssues(): MagazineIssue[] {
  return [...mockIssues].reverse();
}

export function getIssuePage(issueSlug: string, pageNumber: number): MagazinePage | undefined {
  const issue = getIssueBySlug(issueSlug);
  return issue?.pages.find(p => p.pageNumber === pageNumber);
}

// ============================================================
// ADVERTISER DATA
// ============================================================

export const mockAdvertisers = [
  {
    id: 'adv-1',
    name: 'Maison Noir',
    industry: 'Luxury Fragrance',
    logo: '🖤',
    tagline: 'Darkness Has Never Looked This Good',
  },
  {
    id: 'adv-2',
    name: 'AURA Fragrances',
    industry: 'Beauty & Fragrance',
    logo: '✨',
    tagline: 'Your Energy, Bottled.',
  },
  {
    id: 'adv-3',
    name: 'SOLARIS Swim',
    industry: 'Fashion / Swimwear',
    logo: '☀️',
    tagline: 'Born for the Sun',
  },
  {
    id: 'adv-4',
    name: 'Onyx Audio',
    industry: 'Consumer Electronics',
    logo: '🎧',
    tagline: 'Sound, Perfected.',
  },
  {
    id: 'adv-5',
    name: 'Veritas Spirits',
    industry: 'Premium Spirits',
    logo: '🥃',
    tagline: 'Truth in Every Pour.',
  },
];

// ============================================================
// AD RATE CARD
// ============================================================

export const adRateCard = {
  placements: [
    { name: 'Inside Front Cover', price: 5000, description: 'Premium placement — first page readers see after the cover.' },
    { name: 'Full Page (Interior)', price: 3500, description: 'A full page within the magazine, between editorial content.' },
    { name: 'Double-Page Spread', price: 6000, description: 'Two facing pages for maximum visual impact.' },
    { name: 'Back Cover', price: 4500, description: 'The last page — lingers with the reader.' },
    { name: 'Inside Back Cover', price: 4000, description: 'Premium end placement with high retention.' },
    { name: 'Digital Banner (Site)', price: 1500, description: 'Rotating banner on saucecaviar.com homepage.' },
  ],
  audience: {
    monthlyReaders: '250K+',
    avgTimeOnPage: '8 min 32 sec',
    demographics: '18–35, 62% US, 38% International',
    interests: 'Fashion, Music, Art, Culture, Luxury',
  },
  specs: {
    fullPage: '1200 × 1600px, 300dpi recommended',
    spread: '2400 × 1600px, 300dpi recommended',
    formats: 'JPG, PNG, MP4 (for video ads)',
    maxFileSize: '10MB (images), 50MB (video)',
  },
};

// ============================================================
// TEAM DATA
// ============================================================

export const teamMembers = [
  {
    name: 'Jasmine Laurent',
    role: 'Editor-in-Chief',
    bio: 'Former features editor at Complex. Believes culture is the most honest mirror we have.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  },
  {
    name: 'Marcus Webb',
    role: 'Fashion Director',
    bio: 'Ex-Vogue, ex-GQ. Now he styles culture, not just clothes.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Devon Carter',
    role: 'Music Editor',
    bio: 'Grew up in record stores. Writes about sound the way poets write about love.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
  {
    name: 'Solange Adeyemi',
    role: 'Lifestyle Editor',
    bio: 'Lagos-born, Brooklyn-based. Covers the intersection of culture, wellness, and design.',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
  },
  {
    name: 'Kai Ashton',
    role: 'Photography Director',
    bio: 'Shoots on film whenever possible. Believes every portrait should feel like a conversation.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
];
