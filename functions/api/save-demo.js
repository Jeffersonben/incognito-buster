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

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim().slice(0, 60);
    if (!name) {
      return Response.json({ ok: false, error: 'Name is required.' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const id = crypto.randomUUID();
    const record = {
      name,
      createdAt: new Date().toISOString(),
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      note: 'This record was saved on the server to demonstrate server-side memory.'
    };

    await env.PRIVACY_DEMO_KV.put(`demo:${id}`, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 });
    return Response.json({ ok: true, id });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not save demo record.' }, { status: 500 });
  }
}
