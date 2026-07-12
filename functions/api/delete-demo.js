import { KV_BINDING_NAME, VISITOR_KEY_PREFIX } from './_constants.js';
import { createVisitorKey, json, requireKv } from './_utils.js';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const kvError = requireKv(env);
    if (kvError) return json({ ok: false, error: kvError }, 500);

    const visitorKey = await createVisitorKey(request);
    await env[KV_BINDING_NAME].delete(`${VISITOR_KEY_PREFIX}${visitorKey}`);
    return json({ ok: true, message: 'Demo record deleted.' });
  } catch {
    return json({ ok: false, error: 'Could not delete the demo record.' }, 500);
  }
}
