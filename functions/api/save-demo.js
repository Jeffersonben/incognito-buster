import { DEMO_TTL_LABEL, DEMO_TTL_SECONDS, KV_BINDING_NAME, SAVE_COOLDOWN_SECONDS, VISITOR_KEY_PREFIX } from './_constants.js';
import { createVisitorKey, detectBrowser, detectDevice, json, requireKv, safeParseRecord, secondsSince } from './_utils.js';

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

    const visitorKey = await createVisitorKey(request);
    const kvKey = `${VISITOR_KEY_PREFIX}${visitorKey}`;
    const existingRecord = safeParseRecord(await env[KV_BINDING_NAME].get(kvKey));

    if (existingRecord && secondsSince(existingRecord.savedAt) < SAVE_COOLDOWN_SECONDS) {
      return json({
        ok: false,
        error: `Please wait ${SAVE_COOLDOWN_SECONDS} seconds before saving again. This protects the demo from repeated spam saves.`
      }, 429);
    }

    const userAgent = request.headers.get('user-agent') || '';
    const record = {
      name,
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      savedAt: new Date().toISOString(),
      expiresIn: DEMO_TTL_LABEL,
      method: 'Temporary hashed network key',
      explanation: 'This data was saved on the server. Private browsing does not erase data that a website already saved on its server.'
    };

    await env[KV_BINDING_NAME].put(kvKey, JSON.stringify(record), { expirationTtl: DEMO_TTL_SECONDS });
    return json({ ok: true, record });
  } catch {
    return json({ ok: false, error: 'Could not save the demo identity.' }, 500);
  }
}
