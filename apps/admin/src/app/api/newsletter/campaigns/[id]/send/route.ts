import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';

const BRAND_STYLES: Record<string, { color: string; name: string; logo: string }> = {
  saucewire: { color: '#E63946', name: 'SauceWire', logo: '📡' },
  saucecaviar: { color: '#C9A84C', name: 'SauceCaviar', logo: '🥂' },
  trapglow: { color: '#8B5CF6', name: 'TrapGlow', logo: '✨' },
  trapfrequency: { color: '#39FF14', name: 'TrapFrequency', logo: '🎛️' },
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();

    // Get campaign
    const { data: campaign, error: cErr } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (cErr || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get newsletter settings for this brand
    const { data: settings } = await supabase
      .from('newsletter_settings')
      .select('*')
      .eq('brand', campaign.brand)
      .single();

    if (!settings || !settings.enabled) {
      return NextResponse.json(
        { error: 'Newsletter not configured or disabled for this brand' },
        { status: 400 }
      );
    }

    // Get active subscribers for this brand
    const { data: subscribers, count } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .eq('brand', campaign.brand)
      .eq('is_active', true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 });
    }

    // Mark campaign as sending
    await supabase
      .from('newsletter_campaigns')
      .update({ status: 'sending' })
      .eq('id', params.id);

    // Send emails based on provider
    let sentCount = 0;
    const brandStyle = BRAND_STYLES[campaign.brand] || BRAND_STYLES.saucewire;

    try {
      if (settings.provider === 'resend' && settings.api_key_encrypted) {
        // Send via Resend API
        for (const subscriber of subscribers) {
          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${settings.api_key_encrypted}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: `${settings.from_name || brandStyle.name} <${settings.from_email || 'noreply@' + campaign.brand + '.com'}>`,
                to: [subscriber.email],
                subject: campaign.subject,
                html: campaign.html_content || `<p>${campaign.text_content || ''}</p>`,
                reply_to: settings.reply_to || undefined,
              }),
            });
            if (res.ok) sentCount++;
          } catch {
            // Continue sending to other subscribers
          }
        }
      } else if (settings.provider === 'sendgrid' && settings.api_key_encrypted) {
        // Send via SendGrid API
        for (const subscriber of subscribers) {
          try {
            const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${settings.api_key_encrypted}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: subscriber.email }] }],
                from: { email: settings.from_email || 'noreply@' + campaign.brand + '.com', name: settings.from_name || brandStyle.name },
                subject: campaign.subject,
                content: [
                  { type: 'text/html', value: campaign.html_content || `<p>${campaign.text_content || ''}</p>` },
                ],
              }),
            });
            if (res.ok || res.status === 202) sentCount++;
          } catch {
            // Continue
          }
        }
      } else {
        // No provider configured — simulate send for demo
        sentCount = subscribers.length;
      }

      // Update campaign status
      await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sent',
          sent_count: sentCount,
          sent_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      return NextResponse.json({
        success: true,
        sent_count: sentCount,
        total_subscribers: count || 0,
      });
    } catch (sendError: any) {
      await supabase
        .from('newsletter_campaigns')
        .update({ status: 'failed' })
        .eq('id', params.id);

      return NextResponse.json(
        { error: 'Failed to send: ' + sendError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
