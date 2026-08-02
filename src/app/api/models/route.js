import { getAvailableModels } from '@/lib/openrouter';

export async function GET(req) {
  const apiKey = req.headers.get('x-api-key') || '';

  try {
    const models = await getAvailableModels(apiKey);
    return Response.json({ models });
  } catch (error) {
    return Response.json({ error: error.message, models: [] }, { status: 200 });
  }
}
