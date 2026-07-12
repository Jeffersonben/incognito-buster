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

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return Response.json({ ok: false, error: 'Demo ID is required.' }, { status: 400 });
    }

    const key = `demo:${id}`;
    const value = await env.PRIVACY_DEMO_KV.get(key);
    if (!value) {
      return Response.json({ ok: false, error: 'Demo record not found or expired.' }, { status: 404 });
    }

    const record = JSON.parse(value);
    const userAgent = request.headers.get('user-agent') || '';
    const now = new Date().toISOString();
    record.openCount = Number(record.openCount || 0) + 1;
    record.lastOpenedAt = now;
    record.visitLog = Array.isArray(record.visitLog) ? record.visitLog : [];
    record.visitLog.push({
      event: 'Opened demo link',
      at: now,
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent)
    });
    record.visitLog = record.visitLog.slice(-8);

    await env.PRIVACY_DEMO_KV.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 });
    return Response.json({ ok: true, record });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not load demo record.' }, { status: 500 });
  }
}
