function detectBrowser(userAgent) {
  const ua = userAgent || '';
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/')) return 'Chrome / Chromium';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Unknown browser';
}

function detectDevice(userAgent) {
  const ua = userAgent || '';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'Mobile device';
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  return 'Desktop or laptop';
}

function getDayStamp(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function sha256(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getClientIp(request) {
  const forwarded = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown-ip';
  return forwarded.split(',')[0].trim();
}

async function buildVisitorKey(request, dayStamp) {
  const ip = getClientIp(request);
  const raw = ['privacy-demo-v3-ip-only', ip, dayStamp].join('|');
  return sha256(raw);
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim().slice(0, 60);
    const consent = body.consent === true;

    if (!consent) {
      return Response.json({ ok: false, error: 'Consent is required for this educational demo.' }, { status: 400 });
    }

    if (!name) {
      return Response.json({ ok: false, error: 'Name is required.' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const dayStamp = getDayStamp(0);
    const visitorKey = await buildVisitorKey(request, dayStamp);
    const recordKey = `recognition:${dayStamp}:${visitorKey}`;

    const now = new Date().toISOString();
    const record = {
      name,
      firstSavedAt: now,
      lastSeenAt: now,
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      visits: [
        {
          type: 'normal-tab-save',
          time: now,
          browser: detectBrowser(userAgent),
          device: detectDevice(userAgent)
        }
      ],
      storageSource: 'Cloudflare KV server-side storage',
      privacy: {
        rawIpStored: false,
        cookiesRequired: false,
        localStorageRequired: false,
        fingerprintingUsed: false,
        recognitionMethod: 'Short-lived one-way hash from IP address and date',
        limitation: 'May fail if VPN, network, or public IP changes. Shared networks can share the same recognition key.'
      }
    };

    await env.PRIVACY_DEMO_KV.put(recordKey, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 });

    return Response.json({
      ok: true,
      message: 'Demo identity saved for 24 hours. Open the same site URL in a private/incognito tab.',
      record: {
        name: record.name,
        browser: record.browser,
        device: record.device,
        firstSavedAt: record.firstSavedAt,
        storageSource: record.storageSource,
        expiresIn: '24 hours'
      }
    });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not save demo identity.' }, { status: 500 });
  }
}
