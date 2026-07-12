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

    const days = [getDayStamp(0), getDayStamp(-1)];
    for (const dayStamp of days) {
      const visitorKey = await buildVisitorKey(request, dayStamp);
      await env.PRIVACY_DEMO_KV.delete(`recognition:${dayStamp}:${visitorKey}`);
    }

    return Response.json({ ok: true, message: 'Demo record deleted for this network/day recognition key.' });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not delete demo record.' }, { status: 500 });
  }
}
