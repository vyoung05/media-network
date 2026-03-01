const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lvacbxnjfeunouqaskvh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWNieG5qZmV1bm91cWFza3ZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2NTk1MSwiZXhwIjoyMDg3NzQxOTUxfQ.nsqsW-ssYKOYaxrEK-AnY2QeoT6kAKusQR4PibY21Ns',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const i1 = '9cae0fbf-1c4f-4bdb-b5e3-49e91e5a311e';
const i2 = 'ba203f53-e3c9-4da0-994b-9d7af4f8d706';

async function seed() {
  // Issue 1 pages
  const issue1Pages = [
    { issue_id: i1, page_number: 1, type: 'cover', title: 'The Glow Up Issue', subtitle: 'Reinvention Starts Here', image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=1600&fit=crop', category: 'Issue #1', background_color: '#0A0A0A' },
    { issue_id: i1, page_number: 2, type: 'toc', title: 'Contents', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1200&fit=crop', toc_entries: [
      { title: 'The Art of Reinvention', page: 3, category: 'Feature' },
      { title: 'Street Luxe', page: 5, category: 'Fashion' },
      { title: 'Maison Noir', page: 7, category: 'Advertisement' },
      { title: 'Golden Hour', page: 8, category: 'Photography' },
      { title: 'Rising: Amara Osei', page: 10, category: 'Artist Spotlight' },
      { title: 'The Sound of Transformation', page: 11, category: 'Feature' },
      { title: 'AURA Fragrances', page: 13, category: 'Advertisement' },
      { title: 'Letter from the Editor', page: 14, category: 'Closing' },
    ]},
    { issue_id: i1, page_number: 3, type: 'article', title: 'The Art of Reinvention', subtitle: "How culture's most daring minds shed their skin", author: 'Jasmine Laurent', author_title: 'Editor-in-Chief', category: 'Feature', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=800&fit=crop', content: "There is a sacred violence in becoming someone new. Not the superficial kind — not a haircut, not a wardrobe swap — but the marrow-deep metamorphosis that happens when an artist decides that who they were is no longer who they need to be.", pull_quote: "The glow up isn't about looking better. It's about seeing clearer." },
    { issue_id: i1, page_number: 4, type: 'article', title: 'The Art of Reinvention', subtitle: 'Continued', author: 'Jasmine Laurent', category: 'Feature', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop', content: "Consider the trajectory of someone like Steve Lacy. A kid from Compton who started producing on his iPhone, became a member of The Internet, and then exploded as a solo artist.", pull_quote: "Step into the fire. Let the old version of you become kindling for something magnificent." },
    { issue_id: i1, page_number: 5, type: 'article', title: 'Street Luxe', subtitle: "When Concrete Meets Couture", author: 'Marcus Webb', author_title: 'Fashion Director', category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop', content: "The line between streetwear and high fashion didn't just blur — it evaporated.", pull_quote: "Taste is not about price point. It's about intention." },
    { issue_id: i1, page_number: 6, type: 'spread', title: 'Street Luxe: The Editorial', image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=800&fit=crop', secondary_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop', content: 'Styled by Marcus Webb | Photography by Kai Ashton', category: 'Fashion' },
    { issue_id: i1, page_number: 7, type: 'ad', title: 'Maison Noir', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=1600&fit=crop', advertiser_name: 'Maison Noir', advertiser_tagline: 'Darkness Has Never Looked This Good', advertiser_cta: 'Discover the Collection', advertiser_url: 'https://example.com/maison-noir', background_color: '#0A0A0A' },
    { issue_id: i1, page_number: 8, type: 'full-bleed', title: 'Golden Hour', subtitle: 'A Photo Editorial by Kai Ashton', image_url: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=1200&h=1600&fit=crop', category: 'Photography' },
    { issue_id: i1, page_number: 9, type: 'spread', title: 'Golden Hour', subtitle: 'When the light forgives everything', image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop', secondary_image_url: 'https://images.unsplash.com/photo-1492684223f8-e1f1832c2f89?w=1200&h=800&fit=crop', content: "There's a twenty-minute window every day when the world turns to gold.", category: 'Photography' },
    { issue_id: i1, page_number: 10, type: 'artist', title: 'Rising', subtitle: 'Amara Osei', artist_name: 'Amara Osei', artist_bio: "At 24, Amara Osei has already accomplished what most artists spend a lifetime chasing: a sound that is undeniably hers.", image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=1600&fit=crop', artist_links: { spotify: 'https://spotify.com', instagram: 'https://instagram.com', twitter: 'https://twitter.com' }, category: 'Artist Spotlight', pull_quote: "I'm trying to sound like the feeling of landing in Accra after being away for too long." },
    { issue_id: i1, page_number: 11, type: 'article', title: 'The Sound of Transformation', subtitle: 'How music production evolved', author: 'Devon Carter', author_title: 'Music Editor', category: 'Music', image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=800&fit=crop', content: "The democratization of music production is the most significant cultural shift of our generation.", pull_quote: "Democratization doesn't mean dilution. The cream rises — it always has." },
    { issue_id: i1, page_number: 12, type: 'article', title: 'The Sound of Transformation', subtitle: 'Continued', author: 'Devon Carter', category: 'Music', image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop', content: "The tools have leveled the playing field, but the vision — that's still rare.", pull_quote: "Categories are for libraries. I'm building worlds." },
    { issue_id: i1, page_number: 13, type: 'ad', title: 'AURA Fragrances', image_url: 'https://images.unsplash.com/photo-1594035910387-fea081e63837?w=1200&h=1600&fit=crop', advertiser_name: 'AURA Fragrances', advertiser_tagline: 'Your Energy, Bottled.', advertiser_cta: 'Shop Now', advertiser_url: 'https://example.com/aura', background_color: '#1A1A1A' },
    { issue_id: i1, page_number: 14, type: 'back-cover', title: 'Until Next Issue', subtitle: 'The Glow Up Continues...', content: 'Thank you for reading Issue #1 of SauceCaviar.', image_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=1600&fit=crop', background_color: '#0A0A0A' },
  ];

  // Issue 2 pages
  const issue2Pages = [
    { issue_id: i2, page_number: 1, type: 'cover', title: 'Summer Sauce', subtitle: 'Vol. 1 — The Heat Issue', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1600&fit=crop', category: 'Issue #2', background_color: '#0A0A0A' },
    { issue_id: i2, page_number: 2, type: 'toc', title: 'Contents', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1200&fit=crop', toc_entries: [
      { title: 'Hot Town, Summer in the City', page: 3, category: 'Feature' },
      { title: 'The New Leisure', page: 5, category: 'Lifestyle' },
      { title: 'SOLARIS Swim', page: 7, category: 'Advertisement' },
      { title: 'Blue & Gold', page: 8, category: 'Photography' },
      { title: 'Rising: Khalil Torres', page: 9, category: 'Artist Spotlight' },
      { title: 'Nocturnal Summer', page: 10, category: 'Feature' },
      { title: 'Letter from the Editor', page: 12, category: 'Closing' },
    ]},
    { issue_id: i2, page_number: 3, type: 'article', title: 'Hot Town, Summer in the City', subtitle: "A love letter to the season that turns every block into a runway", author: 'Jasmine Laurent', author_title: 'Editor-in-Chief', category: 'Feature', image_url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1200&h=800&fit=crop', content: "There's a specific energy that takes over a city when summer arrives.", pull_quote: "Summer in the city isn't a season. It's a state of mind." },
    { issue_id: i2, page_number: 4, type: 'spread', title: 'Summer Cities', subtitle: 'Five Cities, One Season, Infinite Sauce', image_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=800&fit=crop', secondary_image_url: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=1200&h=800&fit=crop', content: 'NEW YORK — The stoop is still king. MIAMI — The real art is on 79th Street. LAGOS — Lekki in summer is fashion week.', category: 'Feature' },
    { issue_id: i2, page_number: 5, type: 'article', title: 'The New Leisure', subtitle: "How luxury redefined relaxation", author: 'Solange Adeyemi', author_title: 'Lifestyle Editor', category: 'Lifestyle', image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop', content: "Leisure used to be simple. A hammock. A cold drink.", pull_quote: "The best luxury isn't a thing you buy — it's the absence of stimulation." },
    { issue_id: i2, page_number: 6, type: 'article', title: 'The New Leisure', subtitle: 'Continued', author: 'Solange Adeyemi', category: 'Lifestyle', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop', content: "The shift is showing up in consumption patterns too.", pull_quote: "Real luxury is time. Real luxury is choosing how to spend it." },
    { issue_id: i2, page_number: 7, type: 'ad', title: 'SOLARIS', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop', advertiser_name: 'SOLARIS Swim', advertiser_tagline: 'Born for the Sun', advertiser_cta: "Explore Summer '25", advertiser_url: 'https://example.com/solaris', background_color: '#1A1A1A' },
    { issue_id: i2, page_number: 8, type: 'full-bleed', title: 'Blue & Gold', subtitle: "A Visual Meditation on Summer's Palette", image_url: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1200&h=1600&fit=crop', category: 'Photography' },
    { issue_id: i2, page_number: 9, type: 'artist', title: 'Rising', subtitle: 'Khalil Torres', artist_name: 'Khalil Torres', artist_bio: "Khalil Torres doesn't make music for playlists. He makes music for moments.", image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1600&fit=crop', artist_links: { spotify: 'https://spotify.com', soundcloud: 'https://soundcloud.com', instagram: 'https://instagram.com' }, category: 'Artist Spotlight', pull_quote: "The peace inside the chaos — that's the texture I'm trying to capture." },
    { issue_id: i2, page_number: 10, type: 'article', title: 'Nocturnal Summer', subtitle: 'The nightlife renaissance nobody predicted', author: 'Devon Carter', author_title: 'Music Editor', category: 'Music', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop', content: "The pandemic killed nightlife. The post-pandemic era resurrected it — but different.", pull_quote: "The new luxury is intimacy. A room where everyone is there for the music." },
    { issue_id: i2, page_number: 11, type: 'article', title: 'Nocturnal Summer', subtitle: 'Continued', author: 'Devon Carter', category: 'Music', image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200&h=800&fit=crop', content: "The sound has changed too. Amapiano from South Africa. UK garage revival. Afro house.", pull_quote: "We're moving from an economy of attention to an economy of presence." },
    { issue_id: i2, page_number: 12, type: 'back-cover', title: 'See You in the Heat', subtitle: 'Summer Sauce Vol. 1', content: "This issue was made in the heat — literally and figuratively.", image_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=1600&fit=crop', background_color: '#0A0A0A' },
  ];

  // Insert issue 1 pages one by one (different schemas per page type)
  let count = 0;
  for (const page of [...issue1Pages, ...issue2Pages]) {
    const { error } = await supabase.from('magazine_pages').insert(page);
    if (error) {
      console.error(`Error page ${page.page_number} (${page.type}):`, error.message);
    } else {
      count++;
    }
  }
  console.log(`Done: ${count} pages seeded across both issues`);
}

seed();
