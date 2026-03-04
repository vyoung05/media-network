/**
 * Media Search — finds images and videos related to an article topic.
 * All API keys are OPTIONAL — each source degrades gracefully if missing.
 */

// ======================== TYPES ========================

export interface SourceImage {
  url: string;
  alt: string;
  source: 'og:image' | 'article';
}

export interface StockImage {
  url: string;
  credit: string;
}

export interface AIImage {
  url: string;
  prompt: string;
}

export interface VideoResult {
  title: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  source: 'youtube' | 'source_article';
}

export interface MediaSearchResult {
  sourceImages: SourceImage[];
  stockImages: StockImage[];
  aiImages: AIImage[];
  videos: VideoResult[];
}

// ======================== SOURCE ARTICLE SCRAPING ========================

async function scrapeSourceArticle(newsUrl: string): Promise<{
  images: SourceImage[];
  videos: VideoResult[];
}> {
  const images: SourceImage[] = [];
  const videos: VideoResult[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(newsUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MediaNetwork/1.0; +https://saucewire.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return { images, videos };

    const html = await res.text();

    // --- Extract og:image ---
    const ogImageMatch = html.match(
      /<meta\s+(?:[^>]*?)property=["']og:image["']\s+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta\s+content=["']([^"']+)["']\s+(?:[^>]*?)property=["']og:image["']/i
    );

    if (ogImageMatch?.[1]) {
      const ogUrl = ogImageMatch[1].trim();
      if (ogUrl.startsWith('http')) {
        images.push({ url: ogUrl, alt: 'Source article featured image', source: 'og:image' });
      }
    }

    // --- Extract <img> tags ---
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let imgMatch;
    const seenUrls = new Set(images.map(i => i.url));

    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const fullTag = imgMatch[0];
      const src = imgMatch[1];

      if (!src || !src.startsWith('http')) continue;
      if (seenUrls.has(src)) continue;

      // Filter: skip tiny images (icons, tracking pixels, logos)
      const widthMatch = fullTag.match(/width=["']?(\d+)/i);
      const heightMatch = fullTag.match(/height=["']?(\d+)/i);
      const width = widthMatch ? parseInt(widthMatch[1]) : 0;
      const height = heightMatch ? parseInt(heightMatch[1]) : 0;

      // If dimensions specified and too small, skip
      if (width > 0 && width < 200) continue;
      if (height > 0 && height < 100) continue;

      // Skip common non-content image patterns
      const lowerSrc = src.toLowerCase();
      if (
        lowerSrc.includes('logo') ||
        lowerSrc.includes('icon') ||
        lowerSrc.includes('avatar') ||
        lowerSrc.includes('badge') ||
        lowerSrc.includes('emoji') ||
        lowerSrc.includes('pixel') ||
        lowerSrc.includes('tracking') ||
        lowerSrc.includes('spacer') ||
        lowerSrc.includes('1x1') ||
        lowerSrc.includes('favicon') ||
        lowerSrc.includes('.svg') ||
        lowerSrc.includes('.gif') && lowerSrc.includes('pixel')
      ) {
        continue;
      }

      // Extract alt text
      const altMatch = fullTag.match(/alt=["']([^"']*?)["']/i);
      const alt = altMatch?.[1] || 'Article image';

      seenUrls.add(src);
      images.push({ url: src, alt, source: 'article' });

      // Cap at 6 article images
      if (images.length >= 7) break;
    }

    // --- Extract YouTube/Vimeo embeds ---
    const iframeRegex = /<iframe\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let iframeMatch;

    while ((iframeMatch = iframeRegex.exec(html)) !== null) {
      const iframeSrc = iframeMatch[1];

      // YouTube
      const ytMatch = iframeSrc.match(/(?:youtube\.com\/embed|youtube-nocookie\.com\/embed)\/([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        videos.push({
          title: 'Embedded video from source article',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          source: 'source_article',
        });
      }

      // Vimeo
      const vimeoMatch = iframeSrc.match(/player\.vimeo\.com\/video\/(\d+)/);
      if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        videos.push({
          title: 'Embedded Vimeo video from source article',
          url: `https://vimeo.com/${videoId}`,
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
          source: 'source_article',
        });
      }
    }
  } catch (err) {
    console.warn('Failed to scrape source article for media:', err instanceof Error ? err.message : err);
  }

  return { images, videos };
}

// ======================== UNSPLASH SEARCH ========================

async function searchUnsplash(query: string): Promise<StockImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (accessKey) {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=4&orientation=landscape`;
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      });

      if (res.ok) {
        const data = await res.json();
        return (data.results || []).map((photo: any) => ({
          url: photo.urls?.regular || photo.urls?.small,
          credit: `Unsplash / ${photo.user?.name || 'Unknown'}`,
        }));
      }
    } catch (err) {
      console.warn('Unsplash API error:', err instanceof Error ? err.message : err);
    }
  }

  // Fallback: single Unsplash source URL (no auth needed)
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [{
    url: `https://source.unsplash.com/1200x630/?${encodeURIComponent(query)}&sig=${hash % 99999}`,
    credit: 'Unsplash',
  }];
}

// ======================== FAL.AI IMAGE GENERATION ========================

async function generateAIImage(query: string): Promise<AIImage[]> {
  const falKey = process.env.FAL_KEY;
  if (!falKey) return [];

  const prompt = `Professional editorial photograph for a news article about: ${query}. High quality, photojournalistic style, 16:9 aspect ratio`;

  try {
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${falKey}`,
      },
      body: JSON.stringify({
        prompt,
        image_size: 'landscape_16_9',
        num_images: 1,
      }),
    });

    if (!res.ok) {
      console.warn('fal.ai error:', res.status, await res.text().catch(() => ''));
      return [];
    }

    const data = await res.json();
    const images = data.images || [];

    return images.map((img: any) => ({
      url: img.url || img.content || '',
      prompt,
    })).filter((img: AIImage) => img.url);
  } catch (err) {
    console.warn('fal.ai generation error:', err instanceof Error ? err.message : err);
    return [];
  }
}

// ======================== YOUTUBE SEARCH ========================

async function searchYouTube(query: string): Promise<VideoResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${apiKey}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        return (data.items || []).map((item: any) => {
          const videoId = item.id?.videoId;
          return {
            title: item.snippet?.title || 'YouTube Video',
            url: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            source: 'youtube' as const,
          };
        }).filter((v: VideoResult) => v.url);
      }
    } catch (err) {
      console.warn('YouTube API error:', err instanceof Error ? err.message : err);
    }
  }

  // Fallback: no results but provide a search link
  return [{
    title: `Search YouTube for: ${query}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    embedUrl: '',
    thumbnailUrl: '',
    source: 'youtube',
  }];
}

// ======================== MAIN SEARCH FUNCTION ========================

export async function searchMedia(params: {
  query: string;
  newsUrl?: string;
  type?: 'images' | 'videos' | 'all';
}): Promise<MediaSearchResult> {
  const { query, newsUrl, type = 'all' } = params;

  const result: MediaSearchResult = {
    sourceImages: [],
    stockImages: [],
    aiImages: [],
    videos: [],
  };

  const searchImages = type === 'images' || type === 'all';
  const searchVideos = type === 'videos' || type === 'all';

  // Run all searches in parallel
  const promises: Promise<void>[] = [];

  // Source article scraping (images + videos)
  if (newsUrl) {
    promises.push(
      scrapeSourceArticle(newsUrl).then(({ images, videos }) => {
        if (searchImages) result.sourceImages = images;
        if (searchVideos) result.videos.push(...videos);
      })
    );
  }

  // Unsplash
  if (searchImages) {
    promises.push(
      searchUnsplash(query).then(images => {
        result.stockImages = images;
      })
    );
  }

  // AI image generation
  if (searchImages) {
    promises.push(
      generateAIImage(query).then(images => {
        result.aiImages = images;
      })
    );
  }

  // YouTube search
  if (searchVideos) {
    promises.push(
      searchYouTube(query).then(videos => {
        // Avoid duplicates from source article scraping
        const existingUrls = new Set(result.videos.map(v => v.url));
        for (const video of videos) {
          if (!existingUrls.has(video.url)) {
            result.videos.push(video);
          }
        }
      })
    );
  }

  await Promise.allSettled(promises);

  return result;
}

/**
 * Pick the best available cover image from media search results.
 * Priority: og:image > AI generated > first stock image > fallback
 */
export function pickBestCoverImage(media: MediaSearchResult, fallbackUrl: string): string {
  // 1. og:image from source article is usually the best
  const ogImage = media.sourceImages.find(img => img.source === 'og:image');
  if (ogImage?.url) return ogImage.url;

  // 2. AI-generated image is custom for this article
  if (media.aiImages.length > 0 && media.aiImages[0].url) return media.aiImages[0].url;

  // 3. First article image
  const articleImage = media.sourceImages.find(img => img.source === 'article');
  if (articleImage?.url) return articleImage.url;

  // 4. First stock image
  if (media.stockImages.length > 0 && media.stockImages[0].url) return media.stockImages[0].url;

  // 5. Fallback
  return fallbackUrl;
}
