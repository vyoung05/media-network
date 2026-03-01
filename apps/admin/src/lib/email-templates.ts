import type { Brand } from '@media-network/shared';

interface EmailTemplateData {
  brand: Brand;
  subject: string;
  articles: Array<{
    title: string;
    excerpt: string;
    url: string;
    cover_image?: string;
    category?: string;
    author?: string;
  }>;
  footerText?: string;
  unsubscribeUrl: string;
}

const BRAND_STYLES: Record<Brand, {
  name: string;
  tagline: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  headerStyle: string;
  logo: string;
  domain: string;
}> = {
  saucewire: {
    name: 'SauceWire',
    tagline: 'Culture. Connected. Now.',
    primaryColor: '#E63946',
    bgColor: '#111111',
    textColor: '#FFFFFF',
    headerStyle: 'font-weight: 900; text-transform: uppercase; letter-spacing: 2px;',
    logo: '📡',
    domain: 'saucewire.com',
  },
  saucecaviar: {
    name: 'SauceCaviar',
    tagline: 'Culture Served Premium',
    primaryColor: '#C9A84C',
    bgColor: '#0A0A0A',
    textColor: '#FAFAF7',
    headerStyle: 'font-weight: 300; font-style: italic; letter-spacing: 4px;',
    logo: '🥂',
    domain: 'saucecaviar.com',
  },
  trapglow: {
    name: 'TrapGlow',
    tagline: 'Shining Light on What\'s Next',
    primaryColor: '#8B5CF6',
    bgColor: '#0F0B2E',
    textColor: '#F8F8FF',
    headerStyle: 'font-weight: 700; text-shadow: 0 0 20px #8B5CF6;',
    logo: '✨',
    domain: 'trapglow.com',
  },
  trapfrequency: {
    name: 'TrapFrequency',
    tagline: 'Tune Into The Craft',
    primaryColor: '#39FF14',
    bgColor: '#0D0D0D',
    textColor: '#E0E0E0',
    headerStyle: 'font-weight: 600; font-family: monospace; letter-spacing: 1px;',
    logo: '🎛️',
    domain: 'trapfrequency.com',
  },
};

export function generateEmailHTML(data: EmailTemplateData): string {
  const style = BRAND_STYLES[data.brand];

  const articleCards = data.articles.map(article => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid ${style.primaryColor}22;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${article.cover_image ? `
            <td width="120" style="padding-right: 16px; vertical-align: top;">
              <img src="${article.cover_image}" alt="${article.title}" width="120" height="80" style="border-radius: 8px; object-fit: cover; display: block;" />
            </td>
            ` : ''}
            <td style="vertical-align: top;">
              ${article.category ? `<span style="color: ${style.primaryColor}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">${article.category}</span><br/>` : ''}
              <a href="${article.url}" style="color: ${style.textColor}; text-decoration: none; font-size: 18px; font-weight: 700; line-height: 1.3; display: block; margin: 4px 0 8px;">
                ${article.title}
              </a>
              <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 0 0 12px;">
                ${article.excerpt || ''}
              </p>
              ${article.author ? `<span style="color: #666; font-size: 12px;">By ${article.author}</span>` : ''}
              <a href="${article.url}" style="color: ${style.primaryColor}; font-size: 13px; font-weight: 600; text-decoration: none;">
                Read more →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${style.bgColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${style.bgColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding: 32px 24px; background: linear-gradient(135deg, ${style.primaryColor}15, ${style.primaryColor}05); border-radius: 16px 16px 0 0; border-bottom: 2px solid ${style.primaryColor};">
              <div style="font-size: 32px; margin-bottom: 8px;">${style.logo}</div>
              <h1 style="margin: 0; color: ${style.primaryColor}; font-size: 28px; ${style.headerStyle}">
                ${style.name}
              </h1>
              <p style="margin: 4px 0 0; color: #888; font-size: 13px; letter-spacing: 1px;">
                ${style.tagline}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px; background-color: ${style.bgColor};">
              <h2 style="color: ${style.textColor}; font-size: 20px; margin: 0 0 24px; font-weight: 600;">
                ${data.subject}
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${articleCards}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: ${style.primaryColor}08; border-radius: 0 0 16px 16px; border-top: 1px solid ${style.primaryColor}22;">
              <p style="color: #666; font-size: 12px; margin: 0 0 8px;">
                ${data.footerText || `You're receiving this because you subscribed to ${style.name}.`}
              </p>
              <a href="${data.unsubscribeUrl}" style="color: #999; font-size: 11px; text-decoration: underline;">
                Unsubscribe
              </a>
              <p style="color: #444; font-size: 11px; margin: 12px 0 0;">
                © ${new Date().getFullYear()} ${style.name} — ${style.domain}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generatePlainText(data: EmailTemplateData): string {
  const style = BRAND_STYLES[data.brand];
  const articleTexts = data.articles.map(a =>
    `${a.title}\n${a.excerpt || ''}\nRead more: ${a.url}\n`
  ).join('\n---\n\n');

  return `${style.name} — ${data.subject}\n\n${articleTexts}\n\n---\n${data.footerText || ''}\nUnsubscribe: ${data.unsubscribeUrl}\n© ${new Date().getFullYear()} ${style.name}`;
}
