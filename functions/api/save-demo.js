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

function shortAgent(userAgent) {
  return String(userAgent || '').slice(0, 140);
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim().slice(0, 60);
    const consent = Boolean(body.consent);

    if (!consent) {
      return Response.json({ ok: false, error: 'Consent is required for this educational demo.' }, { status: 400 });
    }
    if (!name) {
      return Response.json({ ok: false, error: 'Name is required.' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      id,
      name,
      createdAt: now,
      lastOpenedAt: null,
      openCount: 0,
      expiresIn: '24 hours',
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      userAgentPreview: shortAgent(userAgent),
      storageSource: 'Cloudflare KV server-side storage',
      consentMode: 'Explicit opt-in demo identity',
      collectedData: ['chosen display name', 'browser type', 'device type', 'timestamp', 'temporary demo ID'],
      notCollected: ['passwords', 'raw IP address', 'precise location', 'browsing history', 'cross-site tracking data'],
      visitLog: [
        {
          event: 'Created demo identity',
          at: now,
          browser: detectBrowser(userAgent),
          device: detectDevice(userAgent)
        }
      ]
    };

    await env.PRIVACY_DEMO_KV.put(`demo:${id}`, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 });
    return Response.json({ ok: true, id, expiresIn: record.expiresIn });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not save demo record.' }, { status: 500 });
  }
}
