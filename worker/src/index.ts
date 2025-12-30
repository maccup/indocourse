interface Env {
  DB: D1Database;
  BREVO_API_KEY: string;
  FRONTEND_URL: string;
  SENDER_EMAIL: string;
  SENDER_NAME: string;
  API_URL: string;
}

interface SubscribeRequest {
  email: string;
  name: string;
  locale: string;
  termsConsent: boolean;
  marketingConsent: boolean;
  consentDate: string;
}

const ALLOWED_LOCALES = ['en'];

function getDownloadLinks(apiUrl: string): Record<string, { pdf: string; audio: string }> {
  return {
    en: {
      pdf: `${apiUrl}/downloads/indonesian-basics-en.pdf`,
      audio: `${apiUrl}/downloads/indonesian-basics-audio-en.zip`
    }
  };
}

function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isAllowed = origin === allowedOrigin || isLocalhost;

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data: unknown, status: number, origin: string, allowedOrigin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowedOrigin)
    }
  });
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function generateEmailHtml(name: string, locale: string, apiUrl: string): string {
  const downloadLinks = getDownloadLinks(apiUrl);
  const links = downloadLinks[locale] || downloadLinks['en'];
  const firstName = name.split(' ')[0];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8F9FA;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center; background: linear-gradient(135deg, #2EC4B6 0%, #26a69a 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Indonesian Basics</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Learn with Kiki the Monkey</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #2D3436; font-size: 24px; font-weight: 600;">
                Selamat, ${firstName}! 🎉
              </h2>
              <p style="margin: 0 0 24px; color: #2D3436; opacity: 0.7; font-size: 16px; line-height: 1.6;">
                Your free Indonesian learning materials are ready! You're about to learn Indonesian the way locals actually speak it - no boring textbooks, just real phrases you'll use in Bali.
              </p>

              <!-- Download Buttons -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="${links.pdf}" style="display: block; padding: 18px 24px; background-color: #FFE66D; color: #2D3436; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; text-align: center;">
                      📚 Download PDF eBook
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="${links.audio}" style="display: block; padding: 18px 24px; background-color: #2EC4B6; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; text-align: center;">
                      🎧 Download 234 Audio Files
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Tips Section -->
              <div style="margin-top: 32px; padding: 24px; background-color: #F8F9FA; border-radius: 12px; border-left: 4px solid #2EC4B6;">
                <h3 style="margin: 0 0 12px; color: #2D3436; font-size: 16px; font-weight: 600;">
                  🚀 Quick Start Tips
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #2D3436; opacity: 0.7; font-size: 14px; line-height: 1.8;">
                  <li>Start with Unit 1 - master basic greetings first</li>
                  <li>Listen to the audio while reading the dialogues</li>
                  <li>Practice the "No Anda" rule - use Pak, Bu, Mas, Mba instead</li>
                  <li>15-20 mins a day = conversations in 2-4 weeks!</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #2D3436; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 14px;">
                Happy learning! Kiki is cheering for you 🐒
              </p>
              <p style="margin: 12px 0 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                <a href="https://indonesianbasics.com" style="color: #2EC4B6; text-decoration: none;">IndonesianBasics.com</a>
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

async function sendEmail(env: Env, to: string, name: string, locale: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: env.SENDER_NAME,
          email: env.SENDER_EMAIL
        },
        to: [{ email: to, name }],
        subject: 'Your Indonesian Basics Download is Ready!',
        htmlContent: generateEmailHtml(name, locale, env.API_URL)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Brevo API error:', JSON.stringify(errorData));
      return { success: false, error: JSON.stringify(errorData) };
    }

    const data = await response.json();
    console.log('Brevo API success:', JSON.stringify(data));
    return { success: true };
  } catch (err) {
    console.error('Brevo API exception:', err);
    return { success: false, error: String(err) };
  }
}

async function handleSubscribe(request: Request, env: Env, origin: string): Promise<Response> {
  let body: SubscribeRequest;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, origin, env.FRONTEND_URL);
  }

  const { email, name, locale = 'en', termsConsent, marketingConsent, consentDate } = body;

  if (!email || !validateEmail(email)) {
    return jsonResponse({ error: 'Valid email is required' }, 400, origin, env.FRONTEND_URL);
  }

  if (!name || name.trim().length < 2) {
    return jsonResponse({ error: 'Name is required (minimum 2 characters)' }, 400, origin, env.FRONTEND_URL);
  }

  if (!termsConsent) {
    return jsonResponse({ error: 'Terms consent is required' }, 400, origin, env.FRONTEND_URL);
  }

  const normalizedLocale = ALLOWED_LOCALES.includes(locale) ? locale : 'en';

  try {
    const existing = await env.DB.prepare(
      'SELECT id, email_sent_at FROM subscribers WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (existing) {
      await env.DB.prepare(
        'UPDATE subscribers SET download_count = download_count + 1, locale = ?, name = ?, terms_consent = ?, marketing_consent = ?, consent_date = ? WHERE id = ?'
      ).bind(normalizedLocale, name.trim(), termsConsent ? 1 : 0, marketingConsent ? 1 : 0, consentDate || new Date().toISOString(), existing.id).run();

      // Always resend email
      const emailResult = await sendEmail(env, email, name, normalizedLocale);
      if (emailResult.success) {
        await env.DB.prepare(
          "UPDATE subscribers SET email_sent_at = datetime('now') WHERE id = ?"
        ).bind(existing.id).run();
      }

      const downloadLinks = getDownloadLinks(env.API_URL);
      return jsonResponse({
        success: true,
        message: 'Download link sent to your email',
        links: downloadLinks[normalizedLocale]
      }, 200, origin, env.FRONTEND_URL);
    }

    const result = await env.DB.prepare(
      'INSERT INTO subscribers (email, name, locale, terms_consent, marketing_consent, consent_date, download_count) VALUES (?, ?, ?, ?, ?, ?, 1)'
    ).bind(email.toLowerCase(), name.trim(), normalizedLocale, termsConsent ? 1 : 0, marketingConsent ? 1 : 0, consentDate || new Date().toISOString()).run();

    const emailResult = await sendEmail(env, email, name, normalizedLocale);

    if (emailResult.success) {
      await env.DB.prepare(
        "UPDATE subscribers SET email_sent_at = datetime('now') WHERE id = ?"
      ).bind(result.meta.last_row_id).run();
    }

    const downloadLinks = getDownloadLinks(env.API_URL);
    return jsonResponse({
      success: true,
      message: 'Download link sent to your email',
      links: downloadLinks[normalizedLocale]
    }, 201, origin, env.FRONTEND_URL);

  } catch (error) {
    console.error('Subscribe error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500, origin, env.FRONTEND_URL);
  }
}

async function handleGetLocales(origin: string, env: Env): Promise<Response> {
  return jsonResponse({
    locales: ALLOWED_LOCALES.map(code => ({
      code,
      name: code === 'en' ? 'English' : code
    }))
  }, 200, origin, env.FRONTEND_URL);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env.FRONTEND_URL)
      });
    }

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      return handleSubscribe(request, env, origin);
    }

    if (url.pathname === '/api/locales' && request.method === 'GET') {
      return handleGetLocales(origin, env);
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse({ status: 'ok' }, 200, origin, env.FRONTEND_URL);
    }

    return jsonResponse({ error: 'Not found' }, 404, origin, env.FRONTEND_URL);
  }
};
