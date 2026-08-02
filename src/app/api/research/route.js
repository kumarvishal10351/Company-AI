import { isValidUrl, extractDomain } from '@/lib/utils';
import { crawlWebsite } from '@/lib/crawler';
import { findCompanyWebsite, searchCompanyInfo, searchCompetitors } from '@/lib/serper';
import { analyzeCompany } from '@/lib/openrouter';

export const maxDuration = 60;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { input, openrouterKey, serperKey, model } = body;

  if (!input?.trim()) return Response.json({ error: 'Company Name or Website URL is required' }, { status: 400 });
  if (!openrouterKey) return Response.json({ error: 'OpenRouter API key is required' }, { status: 400 });
  if (!serperKey) return Response.json({ error: 'Serper API key is required' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Stage 1: Official Website Discovery
        send({ type: 'progress', step: 1, message: 'Discovering official website...' });

        let companyUrl = '';
        let inputCompanyName = input.trim();

        if (isValidUrl(input)) {
          companyUrl = input.startsWith('http') ? input : `https://${input}`;
          inputCompanyName = extractDomain(companyUrl);
        } else {
          const found = await findCompanyWebsite(input, serperKey);
          if (!found) {
            send({ type: 'error', message: `Could not find official website for "${input}". Please provide a direct website URL.` });
            controller.close();
            return;
          }
          companyUrl = found;
        }
        send({ type: 'progress', step: 1, message: `Official website discovered: ${companyUrl}`, done: true });

        // Stage 2: Serper Search
        send({ type: 'progress', step: 2, message: 'Executing Serper.dev public data search...' });
        let searchData = {};
        try {
          const searchName = inputCompanyName.replace(/\.(com|org|net|io|co|ai|dev)$/i, '');
          searchData = await searchCompanyInfo(searchName, serperKey);
          send({ type: 'progress', step: 2, message: 'Public search data collected', done: true });
        } catch (e) {
          send({ type: 'progress', step: 2, message: 'Public search limited', done: true });
        }

        // Stage 3: Website Crawler
        send({ type: 'progress', step: 3, message: 'Crawling target company website pages...' });
        let crawledPages = [];
        try {
          crawledPages = await crawlWebsite(companyUrl, 8);
          send({ type: 'progress', step: 3, message: `Crawled ${crawledPages.length} high-priority pages`, done: true });
        } catch (e) {
          send({ type: 'progress', step: 3, message: 'Website crawl limited — utilizing search data', done: true });
        }

        // Stage 4: Information Extraction
        send({ type: 'progress', step: 4, message: 'Extracting text content & metadata...' });
        const crawledContent = crawledPages
          .map(p => `--- PAGE: ${p.url} ---\nTitle: ${p.title}\n${p.metaDesc ? `Description: ${p.metaDesc}\n` : ''}${p.content}`)
          .join('\n\n');
        const searchContent = formatSearchData(searchData);
        send({ type: 'progress', step: 4, message: 'Text content & metadata extracted', done: true });

        // Stage 5: AI Analysis
        send({ type: 'progress', step: 5, message: 'Synthesizing insights with OpenRouter LLM...' });
        const analysis = await analyzeCompany(
          { crawledContent, searchResults: searchContent, inputUrl: companyUrl },
          model,
          openrouterKey
        );
        send({ type: 'progress', step: 5, message: 'AI synthesis complete', done: true });

        // Stage 6: Competitor Analysis
        send({ type: 'progress', step: 6, message: 'Identifying & validating market competitors...' });
        try {
          const compName = analysis.companyName || inputCompanyName;
          const compSearchResults = await searchCompetitors(compName, analysis.industry, serperKey);

          if (analysis.competitors) {
            await Promise.all(analysis.competitors.map(async (comp) => {
              if (!comp.website || !comp.website.startsWith('http')) {
                try {
                  const site = await findCompanyWebsite(comp.name, serperKey);
                  if (site) comp.website = site;
                } catch {}
              }
            }));
          }
          send({ type: 'progress', step: 6, message: `Identified ${analysis.competitors?.length || 0} competitors`, done: true });
        } catch {
          send({ type: 'progress', step: 6, message: 'Competitor identification complete', done: true });
        }

        // Stage 7: PDF Report Preparation
        send({ type: 'progress', step: 7, message: 'Structuring PDF report schema & sources...' });
        const report = {
          companyName: analysis.companyName || inputCompanyName,
          website: analysis.website || companyUrl,
          phone: analysis.phone || 'Not publicly listed',
          address: analysis.address || 'Not publicly listed',
          emails: analysis.emails || [],
          socialLinks: analysis.socialLinks || [],
          summary: analysis.summary || '',
          productsAndServices: analysis.productsAndServices || [],
          painPoints: analysis.painPoints || [],
          competitors: (analysis.competitors || []).slice(0, 6),
          industry: analysis.industry || 'N/A',
          country: analysis.country || 'N/A',
          crawledPages: crawledPages.map(p => ({ url: p.url, title: p.title })),
          generatedAt: new Date().toISOString(),
        };
        send({ type: 'progress', step: 7, message: 'PDF report structured', done: true });

        // Stage 8: Pipeline Completed
        send({ type: 'progress', step: 8, message: 'Research synthesis pipeline completed!', done: true });
        send({ type: 'result', data: report });

      } catch (error) {
        send({ type: 'error', message: error.message || 'An unexpected error occurred during research.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

function formatSearchData(data) {
  if (!data || Object.keys(data).length === 0) return 'No search data available.';

  const parts = [];

  if (data.knowledgeGraph) {
    const kg = data.knowledgeGraph;
    parts.push(`KNOWLEDGE GRAPH:\nTitle: ${kg.title || ''}\nType: ${kg.type || ''}\nDescription: ${kg.description || ''}\nWebsite: ${kg.website || ''}`);
    if (kg.attributes) {
      parts.push('Attributes: ' + JSON.stringify(kg.attributes));
    }
  }

  for (const [category, items] of Object.entries(data)) {
    if (category === 'knowledgeGraph' || !Array.isArray(items)) continue;
    parts.push(`\n${category.toUpperCase()} RESULTS:`);
    for (const item of items.slice(0, 6)) {
      parts.push(`- ${item.title}: ${item.snippet}`);
    }
  }

  return parts.join('\n');
}
