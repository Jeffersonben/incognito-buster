import { KV_BINDING_NAME, VISITOR_KEY_PREFIX } from './_constants.js';
import { createVisitorKey, json, requireKv, safeParseRecord } from './_utils.js';

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const kvError = requireKv(env);
    if (kvError) return json({ ok: false, error: kvError }, 500);

    const visitorKey = await createVisitorKey(request);
    const value = await env[KV_BINDING_NAME].get(`${VISITOR_KEY_PREFIX}${visitorKey}`);
    const record = safeParseRecord(value);

    if (!record) {
      return json({ ok: true, found: false, message: 'No saved demo record was found for this network today.' });
    }

    return json({ ok: true, found: true, record });
  } catch {
    return json({ ok: false, error: 'Could not check the demo identity.' }, 500);
  }
}
