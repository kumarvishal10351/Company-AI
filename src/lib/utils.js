export function isValidUrl(input) {
  if (!input) return false;
  try {
    const url = input.startsWith('http') ? input : `https://${input}`;
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.');
  } catch { return false; }
}

export function extractDomain(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
  } catch { return url; }
}

export function normalizeUrl(url, base) {
  try {
    const parsed = new URL(url, base);
    return parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } catch { return null; }
}

export function truncate(text, max = 200) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max) + '…';
}

export function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function sanitize(str) {
  if (!str) return '';
  return str.replace(/[<>]/g, '');
}
