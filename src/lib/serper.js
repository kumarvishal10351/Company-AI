const SERPER_URL = 'https://google.serper.dev/search';

async function search(query, apiKey, opts = {}) {
  if (!apiKey) throw new Error('Serper API key is required');
  const res = await fetch(SERPER_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: opts.num || 10, gl: opts.gl || 'us', hl: opts.hl || 'en' }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Serper API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function findCompanyWebsite(companyName, apiKey) {
  try {
    if (apiKey) {
      const results = await search(`${companyName} official website`, apiKey);

      if (results.knowledgeGraph?.website) return results.knowledgeGraph.website;

      const skipDomains = /facebook\.com|twitter\.com|x\.com|linkedin\.com|wikipedia\.org|youtube\.com|instagram\.com|crunchbase\.com|glassdoor\.com/i;

      if (results.organic) {
        for (const r of results.organic) {
          if (!skipDomains.test(r.link)) return r.link;
        }
        if (results.organic[0]?.link) return results.organic[0].link;
      }
    }
  } catch (err) {
    console.warn('[Serper Warning] findCompanyWebsite fallback engaged:', err.message);
  }

  // Graceful fallback URL generation
  const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://${cleanName}.com`;
}

export async function searchCompanyInfo(companyName, apiKey) {
  try {
    if (!apiKey) return { general: [], products: [], contact: [], knowledgeGraph: null };

    const [generalRes, productsRes, contactRes] = await Promise.allSettled([
      search(`${companyName} company overview about`, apiKey),
      search(`${companyName} products services solutions`, apiKey),
      search(`${companyName} contact phone address headquarters`, apiKey),
    ]);

    const general = generalRes.status === 'fulfilled' ? generalRes.value : {};
    const products = productsRes.status === 'fulfilled' ? productsRes.value : {};
    const contact = contactRes.status === 'fulfilled' ? contactRes.value : {};

    return {
      general: formatResults(general),
      products: formatResults(products),
      contact: formatResults(contact),
      knowledgeGraph: general.knowledgeGraph || products.knowledgeGraph || contact.knowledgeGraph || null,
    };
  } catch {
    return { general: [], products: [], contact: [], knowledgeGraph: null };
  }
}

export async function searchCompetitors(companyName, industry, apiKey) {
  try {
    if (!apiKey) return [];
    const results = await search(`${companyName} competitors alternatives ${industry || ''}`, apiKey);
    return formatResults(results);
  } catch {
    return [];
  }
}

function formatResults(data) {
  const items = [];
  if (data && data.organic) {
    for (const r of data.organic.slice(0, 8)) {
      items.push({ title: r.title, link: r.link, snippet: r.snippet || '' });
    }
  }
  if (data && data.answerBox) {
    items.unshift({ title: 'Answer', link: '', snippet: data.answerBox.answer || data.answerBox.snippet || '' });
  }
  return items;
}

export { search as searchGoogle };
