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

async function findRecord(env, request) {
  const days = [getDayStamp(0), getDayStamp(-1)];
  for (const dayStamp of days) {
    const visitorKey = await buildVisitorKey(request, dayStamp);
    const recordKey = `recognition:${dayStamp}:${visitorKey}`;
    const value = await env.PRIVACY_DEMO_KV.get(recordKey);
    if (value) return { recordKey, record: JSON.parse(value) };
  }
  return null;
}

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const found = await findRecord(env, request);
    const userAgent = request.headers.get('user-agent') || '';

    if (!found) {
      return Response.json({
        ok: true,
        known: false,
        currentVisit: {
          browser: detectBrowser(userAgent),
          device: detectDevice(userAgent),
          checkedAt: new Date().toISOString(),
          note: 'No server-side match was found for this network today.'
        }
      });
    }

    const now = new Date().toISOString();
    const visit = {
      type: 'site-opened-again',
      time: now,
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent)
    };

    const updated = {
      ...found.record,
      lastSeenAt: now,
      visits: [...(found.record.visits || []), visit].slice(-6)
    };

    await env.PRIVACY_DEMO_KV.put(found.recordKey, JSON.stringify(updated), { expirationTtl: 60 * 60 * 24 });

    return Response.json({
      ok: true,
      known: true,
      record: {
        name: updated.name,
        firstSavedAt: updated.firstSavedAt,
        lastSeenAt: updated.lastSeenAt,
        browser: updated.browser,
        device: updated.device,
        visits: updated.visits,
        storageSource: updated.storageSource,
        privacy: updated.privacy,
        expiresIn: '24 hours from latest match'
      }
    });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not check demo identity.' }, { status: 500 });
  }
}
