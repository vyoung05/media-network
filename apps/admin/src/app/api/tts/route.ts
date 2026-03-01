import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Brand-specific voice mapping (ElevenLabs voice IDs)
const BRAND_VOICES: Record<string, { voiceId: string; voiceName: string }> = {
  saucewire: { voiceId: 'pFZP5JQG7iQjIQuC4Bku', voiceName: 'Lily' },       // authoritative newscaster
  saucecaviar: { voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel' },    // sophisticated narrator
  trapglow: { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah' },       // energetic, youthful
  trapfrequency: { voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum' },  // chill, knowledgeable
};

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: 'articleId required' }, { status: 400 });
    }

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
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

    // 3. Create a "processing" record
    const { data: audioRecord, error: insertError } = await supabase
      .from('audio_versions')
      .insert({
        article_id: articleId,
        provider: 'elevenlabs',
        voice_id: BRAND_VOICES[article.brand]?.voiceId || BRAND_VOICES.saucewire.voiceId,
        voice_name: BRAND_VOICES[article.brand]?.voiceName || BRAND_VOICES.saucewire.voiceName,
        status: 'processing',
        url: '',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create audio record', details: insertError.message }, { status: 500 });
    }

    // 4. Prepare text for TTS (title + body, cleaned)
    const ttsText = `${article.title}. ${article.body}`
      .replace(/<[^>]*>/g, '')  // strip HTML
      .replace(/\s+/g, ' ')    // normalize whitespace
      .trim()
      .slice(0, 5000);         // ElevenLabs limit

    // 5. Call ElevenLabs TTS API
    const voiceId = BRAND_VOICES[article.brand]?.voiceId || BRAND_VOICES.saucewire.voiceId;
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: ttsText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      // Update record to error
      await supabase
        .from('audio_versions')
        .update({ status: 'error', error_message: errText })
        .eq('id', audioRecord.id);
      return NextResponse.json({ error: 'TTS generation failed', details: errText }, { status: 500 });
    }

    // 6. Get audio buffer
    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // 7. Upload to Supabase Storage
    const fileName = `${article.brand}/${articleId}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('article-audio')
      .upload(fileName, audioBytes, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      await supabase
        .from('audio_versions')
        .update({ status: 'error', error_message: uploadError.message })
        .eq('id', audioRecord.id);
      return NextResponse.json({ error: 'Upload failed', details: uploadError.message }, { status: 500 });
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
        file_size_bytes: audioBytes.length,
        duration_seconds: Math.round(audioBytes.length / 16000), // rough estimate
      })
      .eq('id', audioRecord.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update audio record', details: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Audio generated successfully',
      audioVersion: updated,
      url: publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
