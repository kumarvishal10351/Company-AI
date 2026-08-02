const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODELS_URL = 'https://openrouter.ai/api/v1/models';

export async function analyzeCompany(data, model, apiKey) {
  const prompt = buildPrompt(data);
  const key = apiKey || process.env.OPENROUTER_API_KEY || process.env.MISTRAL_API_KEY;

  if (!key) throw new Error('AI API key is required');

  const selectedModel = model || 'mistralai/mistral-large';

  const messages = [
    {
      role: 'system',
      content: 'You are a senior business research analyst. Produce accurate, detailed company analysis. Always respond with valid JSON only — no markdown fences, no explanation text.'
    },
    { role: 'user', content: prompt }
  ];

  let res;
  let lastError;

  // Primary OpenRouter endpoint supporting ANY OpenRouter AI model
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://company-research.vercel.app',
        'X-Title': 'Company Research Assistant',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      lastError = await res.text();
      res = null;
    }
  } catch (e) {
    lastError = e.message;
    res = null;
  }

  // Resilient fallback to direct Mistral API if OpenRouter key returns 404/error
  if (!res) {
    try {
      res = await fetch(MISTRAL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages,
          temperature: 0.2,
          response_format: { type: 'json_object' }
        }),
      });
      if (!res.ok) {
        lastError = await res.text();
        res = null;
      }
    } catch (e) {
      lastError = e.message;
      res = null;
    }
  }

  if (!res || !res.ok) {
    throw new Error(`AI API Error: ${lastError || 'Failed to connect to AI provider'}`);
  }

  const result = await res.json();
  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response from LLM');

  // Extract JSON from response
  const jsonStr = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI response as JSON');

  return JSON.parse(jsonMatch[0]);
}

function buildPrompt(data) {
  return `Analyze the following company data and generate a comprehensive research report.

CRAWLED WEBSITE DATA:
${data.crawledContent || 'No website data available.'}

SEARCH ENGINE RESULTS:
${data.searchResults || 'No search results available.'}

COMPANY URL: ${data.inputUrl || 'Unknown'}

Generate a JSON object with this EXACT structure:
{
  "companyName": "Official company name",
  "website": "Official website URL (use the COMPANY URL above if available)",
  "phone": "Phone number if found, otherwise 'Not publicly listed'",
  "address": "Full headquarters address if found, otherwise 'Not publicly listed'",
  "emails": ["contact@company.com"],
  "socialLinks": ["https://linkedin.com/company/example", "https://x.com/example"],
  "summary": "A comprehensive 2-3 paragraph executive summary covering what they do, their market position, and key strengths",
  "productsAndServices": ["Product/Service 1", "Product/Service 2", "...at least 4-8 items"],
  "painPoints": [
    "Detailed AI-generated pain point 1 — a real business challenge this company likely faces based on their industry, market position, and products",
    "Detailed AI-generated pain point 2",
    "Detailed AI-generated pain point 3",
    "Detailed AI-generated pain point 4"
  ],
  "competitors": [
    {"name": "Competitor 1", "website": "https://competitor1.com", "reason": "Offers similar core payment API infrastructure in North America"},
    {"name": "Competitor 2", "website": "https://competitor2.com", "reason": "Direct market rival for enterprise checkout solutions"},
    {"name": "Competitor 3", "website": "https://competitor3.com", "reason": "Provides competing fraud prevention and billing platform"}
  ],
  "industry": "Primary industry/sector",
  "country": "Country of headquarters"
}

REQUIREMENTS:
- Identify 4-6 real competitors in the SAME industry and market
- Each competitor MUST include a clear 'reason' explaining why it is a competitor
- Generate 4-6 specific, insightful AI-generated pain points based on market position
- Extract any public contact emails and social media URLs if present in the data
- Respond with ONLY the JSON object, no other text`;
}

export async function getAvailableModels(apiKey) {
  try {
    const res = await fetch(MODELS_URL, {
      headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
    });

    if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);

    const data = await res.json();
    const popular = [
      'mistralai/mistral-large',
      'google/gemini-2.0-flash-001',
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet',
      'deepseek/deepseek-chat',
      'meta-llama/llama-3.3-70b-instruct',
    ];

    const models = data.data
      ?.filter(m => m.id)
      .map(m => ({
        id: m.id,
        name: m.name || m.id,
        isPopular: popular.includes(m.id),
      }))
      .sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 80);

    return models || [];
  } catch {
    return [
      { id: 'mistralai/mistral-large', name: 'Mistral Large (OpenRouter)', isPopular: true },
      { id: 'google/gemini-2.0-flash-001', name: 'Google Gemini 2.0 Flash', isPopular: true },
      { id: 'openai/gpt-4o-mini', name: 'OpenAI GPT-4o Mini', isPopular: true },
      { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', isPopular: true },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Anthropic Claude 3.5 Sonnet', isPopular: true },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 Chat', isPopular: true },
    ];
  }
}
