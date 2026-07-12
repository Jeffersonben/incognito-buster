import { createVisitorKey, json, requireKv } from './_utils.js';

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const kvError = requireKv(env);
    if (kvError) return json({ ok: false, error: kvError }, 500);

    const visitorKey = await createVisitorKey(request);
    const value = await env.PRIVACY_DEMO_KV.get(`visitor:${visitorKey}`);

    if (!value) {
      return json({ ok: true, found: false, message: 'No saved demo record was found for this network today.' });
    }

    return json({ ok: true, found: true, record: JSON.parse(value) });
  } catch (error) {
    return json({ ok: false, error: 'Could not check the demo identity.' }, 500);
  }
}
