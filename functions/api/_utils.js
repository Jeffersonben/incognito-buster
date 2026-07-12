import { KV_BINDING_NAME, VISITOR_KEY_SALT } from './_constants.js';

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

function getTrustedIp(request) {
  // Cloudflare Pages injects CF-Connecting-IP. The X-Forwarded-For fallback is only for local/dev-like environments.
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown-ip';
}

export async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  let hex = '';
  for (const byte of new Uint8Array(hashBuffer)) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

export async function createVisitorKey(request) {
  const ip = getTrustedIp(request);
  const today = new Date().toISOString().slice(0, 10);
  return sha256Hex(`${ip}:${today}:${VISITOR_KEY_SALT}`);
}

export function requireKv(env) {
  if (!env[KV_BINDING_NAME]) {
    return `Missing KV binding: ${KV_BINDING_NAME}`;
  }
  return null;
}

export function safeParseRecord(value) {
  if (!value) return null;
  try {
    const record = JSON.parse(value);
    if (!record || typeof record !== 'object') return null;
    if (typeof record.name !== 'string') return null;
    return record;
  } catch {
    return null;
  }
}

export function secondsSince(isoDate) {
  const time = Date.parse(isoDate || '');
  if (Number.isNaN(time)) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - time) / 1000);
}
