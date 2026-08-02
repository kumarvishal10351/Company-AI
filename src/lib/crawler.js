import * as cheerio from 'cheerio';
import { normalizeUrl } from './utils';

const IMPORTANT_PATHS = [
  '/', '/about', '/about-us', '/company', '/our-story',
  '/products', '/services', '/solutions', '/platform',
  '/contact', '/contact-us',
  '/pricing', '/plans',
  '/features', '/capabilities',
];

const IGNORE_RE = /login|signin|signup|register|auth|account|dashboard|admin|cart|checkout|blog\/\d|page\/\d|privacy|terms|legal|cookie|careers|jobs|press/i;
const SKIP_EXT = /\.(pdf|zip|exe|dmg|pkg|png|jpg|jpeg|gif|svg|webp|mp4|mp3|css|js|woff|ttf|ico)$/i;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; CompanyResearchBot/1.0; +https://company-research.vercel.app)',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchPage(url, timeoutMs = 10000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal, headers: HEADERS, redirect: 'follow' });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') && !ct.includes('application/xhtml')) return null;
    return await res.text();
  } catch { return null; }
}

function extractContent(html) {
  const $ = cheerio.load(html);
  $('script,style,nav,footer,header,iframe,noscript,svg,img,video,audio,form,.cookie-banner,.popup,.modal,[role="navigation"],[role="banner"]').remove();

  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';

  const mainContent = $('main, article, [role="main"], .content, .main, #content, #main').text().trim();
  const bodyText = mainContent || $('body').text().trim();

  const cleaned = bodyText.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return { title, metaDesc, content: cleaned };
}

function discoverLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = new Set();
  const baseHost = new URL(baseUrl).hostname;

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    const norm = normalizeUrl(href, baseUrl);
    if (!norm) return;
    try {
      const parsed = new URL(norm);
      if (parsed.hostname !== baseHost) return;
      if (IGNORE_RE.test(parsed.pathname)) return;
      if (SKIP_EXT.test(parsed.pathname)) return;
      links.add(norm);
    } catch {}
  });

  return [...links];
}

function scorePage(url) {
  const path = new URL(url).pathname.toLowerCase();
  if (path === '/' || path === '') return 100;
  const high = ['about', 'product', 'service', 'solution', 'platform', 'feature', 'contact', 'pricing'];
  for (const kw of high) { if (path.includes(kw)) return 80; }
  const med = ['team', 'customer', 'case-stud', 'integrat', 'enterprise', 'overview'];
  for (const kw of med) { if (path.includes(kw)) return 50; }
  return 10;
}

export async function crawlWebsite(baseUrl, maxPages = 10) {
  const base = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
  const origin = base.origin;
  const visited = new Set();
  const results = [];

  // Seed with important paths
  const candidates = new Set(IMPORTANT_PATHS.map(p => normalizeUrl(p, origin)).filter(Boolean));

  // Crawl homepage first and discover more links
  const homeHtml = await fetchPage(origin);
  if (homeHtml) {
    visited.add(origin);
    const { title, metaDesc, content } = extractContent(homeHtml);
    if (content.length > 50) {
      results.push({ url: origin, title, metaDesc, content: content.slice(0, 4000) });
    }
    const discovered = discoverLinks(homeHtml, origin);
    discovered.forEach(l => candidates.add(l));
  }

  // Sort candidates by relevance, filter visited
  const sorted = [...candidates]
    .filter(u => !visited.has(u) && !IGNORE_RE.test(u))
    .sort((a, b) => scorePage(b) - scorePage(a))
    .slice(0, maxPages - 1);

  // Crawl in parallel batches of 3
  for (let i = 0; i < sorted.length; i += 3) {
    const batch = sorted.slice(i, i + 3);
    const htmls = await Promise.all(batch.map(u => {
      if (visited.has(u)) return null;
      visited.add(u);
      return fetchPage(u);
    }));

    for (let j = 0; j < batch.length; j++) {
      if (!htmls[j]) continue;
      const { title, metaDesc, content } = extractContent(htmls[j]);
      if (content.length > 50) {
        results.push({ url: batch[j], title, metaDesc, content: content.slice(0, 3000) });
      }
    }
  }

  return results;
}
