import { createClient } from '@supabase/supabase-js';

// Estimated cost per 1K tokens (input/output) by model
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // Gemini
  'gemini-2.5-flash-preview-05-20': { input: 0.00015, output: 0.0006 },
  'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
  // OpenAI
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'tts-1': { input: 0.015, output: 0 }, // $15 per 1M chars ≈ $0.015/1K
  // Anthropic
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  // ElevenLabs (per 1K chars, tracked as tokens_in)
  'eleven_multilingual_v2': { input: 0.30, output: 0 }, // ~$0.30/1K chars
};

interface CostEntry {
  service: string;
  operation: string;
  model?: string;
  provider?: string;
  brand?: string;
  article_id?: string;
  tokens_in?: number;
  tokens_out?: number;
  estimated_cost?: number;
  metadata?: Record<string, any>;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function trackCost(entry: CostEntry): Promise<void> {
  try {
    // Auto-calculate estimated cost if not provided
    if (!entry.estimated_cost && entry.model) {
      const rates = MODEL_COSTS[entry.model] || { input: 0.001, output: 0.002 };
      entry.estimated_cost =
        ((entry.tokens_in || 0) / 1000) * rates.input +
        ((entry.tokens_out || 0) / 1000) * rates.output;
    }

    const supabase = getSupabase();
    await supabase.from('api_costs').insert({
      service: entry.service,
      operation: entry.operation,
      model: entry.model || null,
      provider: entry.provider || null,
      brand: entry.brand || null,
      article_id: entry.article_id || null,
      tokens_in: entry.tokens_in || 0,
      tokens_out: entry.tokens_out || 0,
      estimated_cost: entry.estimated_cost || 0,
      metadata: entry.metadata || {},
    });
  } catch (err) {
    // Fire-and-forget — don't let cost tracking break the main operation
    console.error('Cost tracking failed:', err);
  }
}

// Helper to estimate token count from text (rough: ~4 chars per token for English)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
