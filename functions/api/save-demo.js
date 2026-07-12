import { createVisitorKey, detectBrowser, detectDevice, json, requireKv } from './_utils.js';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const kvError = requireKv(env);
    if (kvError) return json({ ok: false, error: kvError }, 500);

    const body = await request.json();
    const consent = Boolean(body.consent);
    const name = String(body.name || '').trim().slice(0, 60);

    if (!consent) return json({ ok: false, error: 'Consent is required for this educational demo.' }, 400);
    if (!name) return json({ ok: false, error: 'Please type a display name first.' }, 400);

    const userAgent = request.headers.get('user-agent') || '';
    const visitorKey = await createVisitorKey(request);
    const record = {
      name,
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      savedAt: new Date().toISOString(),
      expiresIn: '24 hours',
      method: 'Temporary hashed network key',
      explanation: 'This data was saved on the server. Private browsing does not erase data that a website already saved on its server.'
    };

    await env.PRIVACY_DEMO_KV.put(`visitor:${visitorKey}`, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 });
    return json({ ok: true, record });
  } catch (error) {
    return json({ ok: false, error: 'Could not save the demo identity.' }, 500);
  }
}
