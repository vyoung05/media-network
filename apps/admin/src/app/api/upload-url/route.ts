import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateRequest } from '@/lib/api-auth';

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Detect content type from URL or response headers, with magic byte fallback
 */
function detectContentType(url: string, responseType: string | null, buffer: Buffer): string {
  // Check response Content-Type header first
  if (responseType && ALLOWED_CONTENT_TYPES.some(t => responseType.includes(t.split('/')[1]))) {
    const match = ALLOWED_CONTENT_TYPES.find(t => responseType.includes(t.split('/')[1]));
    if (match) return match;
  }

  // Magic bytes detection
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return 'image/webp';

  // Fall back to URL extension
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  const extMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  };
  return extMap[ext || ''] || 'image/jpeg';
}

/**
 * Get file extension from content type
 */
function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
    'image/webp': 'webp', 'image/svg+xml': 'svg',
  };
  return map[contentType] || 'jpg';
}

// POST /api/upload-url — download image from URL and store in Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const auth = await validateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { url, folder = 'uploads' } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Download the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MediaNetwork/1.0',
        'Accept': 'image/*',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to download image: ${response.status} ${response.statusText}` },
        { status: 422 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `Downloaded file too large (${sizeMB}MB). Maximum is 10MB.` },
        { status: 400 }
      );
    }

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Downloaded file is empty' }, { status: 422 });
    }

    // Detect content type
    const responseContentType = response.headers.get('content-type');
    const contentType = detectContentType(url, responseContentType, buffer);

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${contentType}` },
        { status: 400 }
      );
    }

    const ext = getExtension(contentType);

    // Generate unique filename from URL
    const urlPath = parsedUrl.pathname.split('/').pop()?.replace(/[^a-zA-Z0-9-_]/g, '-') || 'image';
    const sanitizedName = urlPath.replace(/\.[^/.]+$/, '').substring(0, 50);
    const uniqueName = `${folder}/${Date.now()}-${sanitizedName}.${ext}`;

    // Upload to Supabase Storage
    const supabase = getServiceClient();
    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(uniqueName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
      size: buffer.length,
      type: contentType,
      originalUrl: url,
    });
  } catch (err: any) {
    console.error('Upload URL error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload from URL' }, { status: 500 });
  }
}
