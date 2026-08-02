import { sendToDiscord } from '@/lib/discord';

export async function POST(req) {
  try {
    const body = await req.json();
    const { botToken, channelId, applicantName, applicantEmail, companyName, companyWebsite, pdfBase64 } = body;

    if (!botToken || !channelId) {
      return Response.json({ error: 'Discord bot token and channel ID are required' }, { status: 400 });
    }

    await sendToDiscord({ botToken, channelId, applicantName, applicantEmail, companyName, companyWebsite, pdfBase64 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
