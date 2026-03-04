import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Brand-specific voice mapping for ElevenLabs
const ELEVENLABS_VOICES: Record<string, { voiceId: string; voiceName: string }> = {
  saucewire: { voiceId: 'pFZP5JQG7iQjIQuC4Bku', voiceName: 'Lily' },
  saucecaviar: { voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel' },
  trapglow: { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah' },
  trapfrequency: { voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum' },
};

// Brand-specific voice mapping for OpenAI TTS (fallback)
const OPENAI_VOICES: Record<string, string> = {
  saucewire: 'nova',        // clear, authoritative female
  saucecaviar: 'onyx',      // deep, sophisticated male
  trapglow: 'shimmer',      // energetic female
  trapfrequency: 'echo',    // chill male
};

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Generate audio with ElevenLabs
async function generateElevenLabs(
  text: string,
  brand: string,
  apiKey: string
): Promise<{ audio: Uint8Array; provider: string; voiceName: string } | null> {
  const voice = ELEVENLABS_VOICES[brand] || ELEVENLABS_VOICES.saucewire;
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs failed:', errText);
      return null;
    }

    const buffer = await response.arrayBuffer();
    return {
      audio: new Uint8Array(buffer),
      provider: 'elevenlabs',
      voiceName: voice.voiceName,
    };
  } catch (err) {
    console.error('ElevenLabs error:', err);
    return null;
  }
}

// Generate audio with OpenAI TTS (fallback)
async function generateOpenAI(
  text: string,
  brand: string,
  apiKey: string
): Promise<{ audio: Uint8Array; provider: string; voiceName: string } | null> {
  const voice = OPENAI_VOICES[brand] || OPENAI_VOICES.saucewire;
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text.slice(0, 4096), // OpenAI limit
        voice,
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI TTS failed:', errText);
      return null;
    }

    const buffer = await response.arrayBuffer();
    return {
      audio: new Uint8Array(buffer),
      provider: 'openai',
      voiceName: voice,
    };
  } catch (err) {
    console.error('OpenAI TTS error:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: 'articleId required' }, { status: 400 });
    }

    const supabase = getSupabaseService();

    // 1. Fetch the article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id, title, body, excerpt, brand')
      .eq('id', articleId)
      .single();

    if (articleError || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 2. Check if audio already exists
    const { data: existing } = await supabase
      .from('audio_versions')
      .select('id, url')
      .eq('article_id', articleId)
      .eq('status', 'ready')
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Audio already exists', audioVersion: existing });
    }

    // 3. Clean up any previous failed attempts
    await supabase
      .from('audio_versions')
      .delete()
      .eq('article_id', articleId)
      .in('status', ['error', 'processing']);

    // 4. Create a "processing" record
    const { data: audioRecord, error: insertError } = await supabase
      .from('audio_versions')
      .insert({
        article_id: articleId,
        provider: 'pending',
        voice_id: '',
        voice_name: '',
        status: 'processing',
        url: '',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create audio record', details: insertError.message },
        { status: 500 }
      );
    }

    // 5. Prepare text for TTS (title + body, cleaned)
    const ttsText = `${article.title}. ${article.body}`
      .replace(/<[^>]*>/g, '') // strip HTML
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')   // normalize whitespace
      .trim();

    // 6. Try ElevenLabs first, fall back to OpenAI
    let result: { audio: Uint8Array; provider: string; voiceName: string } | null = null;

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (elevenLabsKey) {
      result = await generateElevenLabs(ttsText.slice(0, 5000), article.brand, elevenLabsKey);
    }

    if (!result) {
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        console.log('Falling back to OpenAI TTS...');
        result = await generateOpenAI(ttsText, article.brand, openaiKey);
      }
    }

    if (!result) {
      await supabase
        .from('audio_versions')
        .update({ status: 'error', error_message: 'All TTS providers failed' })
        .eq('id', audioRecord.id);
      return NextResponse.json({ error: 'All TTS providers failed' }, { status: 500 });
    }

    // 7. Upload to Supabase Storage
    const fileName = `${article.brand}/${articleId}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('article-audio')
      .upload(fileName, result.audio, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      await supabase
        .from('audio_versions')
        .update({ status: 'error', error_message: uploadError.message })
        .eq('id', audioRecord.id);
      return NextResponse.json(
        { error: 'Upload failed', details: uploadError.message },
        { status: 500 }
      );
    }

    // 8. Get public URL
    const { data: urlData } = supabase.storage
      .from('article-audio')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 9. Update audio_versions record
    const { data: updated, error: updateError } = await supabase
      .from('audio_versions')
      .update({
        url: publicUrl,
        status: 'ready',
        provider: result.provider,
        voice_id: result.provider === 'elevenlabs'
          ? (ELEVENLABS_VOICES[article.brand]?.voiceId || '')
          : result.voiceName,
        voice_name: result.voiceName,
        file_size_bytes: result.audio.length,
        duration_seconds: Math.round(result.audio.length / 16000),
      })
      .eq('id', audioRecord.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update audio record', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Audio generated successfully via ${result.provider}`,
      audioVersion: updated,
      url: publicUrl,
      provider: result.provider,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
