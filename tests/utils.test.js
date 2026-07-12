import { describe, expect, test } from 'vitest';
import { detectBrowser, detectDevice, safeParseRecord, sha256Hex } from '../functions/api/_utils.js';

describe('API utilities', () => {
  test('detects common browsers', () => {
    expect(detectBrowser('Mozilla/5.0 Chrome/120 Safari/537.36')).toBe('Chrome / Chromium');
    expect(detectBrowser('Mozilla/5.0 Firefox/121')).toBe('Firefox');
    expect(detectBrowser('Mozilla/5.0 Edg/120')).toBe('Microsoft Edge');
  });

  test('detects simple device categories', () => {
    expect(detectDevice('Mozilla/5.0 iPhone')).toBe('Mobile device');
    expect(detectDevice('Mozilla/5.0 iPad')).toBe('Tablet');
    expect(detectDevice('Mozilla/5.0 Windows NT 10.0')).toBe('Desktop or laptop');
  });

  test('creates a SHA-256 hex string', async () => {
    const hash = await sha256Hex('privacy-demo');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('rejects invalid KV records', () => {
    expect(safeParseRecord('{bad json')).toBeNull();
    expect(safeParseRecord(JSON.stringify({ browser: 'Chrome' }))).toBeNull();
    expect(safeParseRecord(JSON.stringify({ name: 'Paul' }))).toEqual({ name: 'Paul' });
  });
});
