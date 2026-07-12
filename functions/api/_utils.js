export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

export function detectBrowser(userAgent) {
  const ua = userAgent || '';
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/')) return 'Chrome / Chromium';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Unknown browser';
}

export function detectDevice(userAgent) {
  const ua = userAgent || '';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'Mobile device';
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  return 'Desktop or laptop';
}

export async function createVisitorKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown-ip';
  const today = new Date().toISOString().slice(0, 10);
  const input = `${ip}:${today}:incognito-buster-safe-demo-v3`;
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function requireKv(env) {
  if (!env.PRIVACY_DEMO_KV) {
    return 'Missing KV binding: PRIVACY_DEMO_KV';
  }
  return null;
}
