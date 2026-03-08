import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const article = {
  title: "Netflix Acquires Ben Affleck's AI Filmmaking Company InterPositive in Major Industry Move",
  slug: "netflix-acquires-ben-affleck-ai-interpositive-deal",
  body: `<p>Netflix has acquired Ben Affleck's AI-powered filmmaking tool company, InterPositive, for an undisclosed sum — a deal that signals the streaming giant's aggressive push into artificial intelligence-driven content production.</p>

<p>The Oscar-winning director, producer, writer, and actor has also joined Netflix as a senior advisor as part of the acquisition, further deepening his ties to the streaming platform.</p>

<h2>What InterPositive Actually Does</h2>

<p>According to Affleck, InterPositive's technology allows filmmakers to build proprietary AI models based on scenes they've already shot, then leverage that data to streamline post-production work that would otherwise consume hours of manual labor.</p>

<p>"You can use your own model to remove the wires on stunts, reframe a shot, get a shot you missed, shape the lighting, enhance the backgrounds," Affleck explained in a video accompanying the announcement. The tools, he says, "take out all the logistical, difficult, technical stuff that often gets in the way" of filmmaking.</p>

<h2>A Deeper Netflix Partnership</h2>

<p>The InterPositive acquisition is just the latest move in an expanding relationship between Affleck and Netflix. Earlier this week, Affleck and Matt Damon's production company, Artists Equity, signed a multi-year partnership giving Netflix first-look rights on all future streaming-focused projects from the duo.</p>

<p>Affleck has already released multiple films through Netflix, most recently <em>The Rip</em>, a thriller starring both Affleck and Damon as Miami narcotics officers who stumble onto a secret hoard of drug money.</p>

<h2>The AI Debate in Hollywood</h2>

<p>Despite his tech investments, Affleck has positioned himself firmly in the "responsible AI" camp. He's among hundreds of Hollywood insiders who signed onto the Creators Coalition on AI, a cross-industry group established late last year focused on ensuring human creators remain at the center of the entertainment industry.</p>

<p>"This is not a full rejection of AI," the Coalition stated. "The technology is here. This is a commitment to responsible, human-centered innovation."</p>

<p>Netflix's chief product and technology officer, Elizabeth Stone, echoed that sentiment: "The InterPositive team is joining Netflix because of our shared belief that innovation should empower storytellers, not replace them."</p>

<h2>Post-Warner Bros. Discovery Pivot</h2>

<p>The deal arrives just over a week after Netflix pulled out of its planned acquisition of Warner Bros. Discovery, after Paramount swooped in with a roughly $110 billion bid that Warner's board deemed "superior" to Netflix's $83 billion offer.</p>

<p>With that mega-merger off the table, Netflix appears to be pivoting toward strategic tech acquisitions and talent partnerships rather than traditional media consolidation.</p>

<p>Kimberly A. Owczarski, an associate professor at Texas Christian University who studies media franchises, told NPR that Netflix's decision to partner with a filmmaker of Affleck's prominence sends a positive message to an industry anxious about AI's growing role.</p>

<p>"His status in the industry as a star, filmmaker, and producer gives substantial weight as he promotes a responsible use of AI in filmmaking," Owczarski said.</p>`,
  excerpt: "Netflix has acquired Ben Affleck's AI filmmaking tool company InterPositive, with the Oscar winner also joining as senior advisor. The deal deepens their partnership and signals Netflix's push into responsible AI-powered content production.",
  seo_description: "Netflix acquires Ben Affleck's InterPositive AI filmmaking company. Affleck joins as senior advisor in deal signaling responsible AI adoption in Hollywood.",
  brand: "saucewire",
  category: "Entertainment",
  status: "published",
  source_url: "https://www.npr.org/2026/03/06/nx-s1-5739370/netflix-ben-affleck-ai-interpositive-deal",
  tags: ["Netflix", "Ben Affleck", "AI", "InterPositive", "Hollywood", "Filmmaking", "Streaming", "Matt Damon", "Artists Equity"],
  cover_image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=630&fit=crop&auto=format&q=80",
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

// Look up the AI editor for SauceWire (Dex Monroe)
const { data: editorData } = await supabase
  .from('users')
  .select('id')
  .eq('name', 'Dex Monroe')
  .eq('is_verified', true)
  .limit(1);

if (editorData && editorData.length > 0) {
  article.author_id = editorData[0].id;
  console.log(`✅ Found AI editor Dex Monroe: ${editorData[0].id}`);
}

const { data, error } = await supabase
  .from('articles')
  .insert(article)
  .select('id, title, slug, brand, status')
  .single();

if (error) {
  console.error('❌ Insert error:', error.message);
  process.exit(1);
}

console.log(`✅ Article published!`);
console.log(`   Title: ${data.title}`);
console.log(`   Brand: ${data.brand}`);
console.log(`   Status: ${data.status}`);
console.log(`   URL: https://saucewire.com/article/${data.slug}`);
