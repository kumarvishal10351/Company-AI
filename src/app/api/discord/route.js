import { sendToDiscord } from '@/lib/discord';

export async function POST(req) {
  try {
    const body = await req.json();
    const { botToken, channelId, applicantName, applicantEmail, companyName, companyWebsite, pdfBase64 } = body;

    const activeBotToken = botToken || process.env.DISCORD_BOT_TOKEN;
    const activeChannelId = channelId || process.env.DISCORD_CHANNEL_ID;

    if (!activeBotToken || !activeChannelId) {
      return Response.json({ error: 'Discord bot token and channel ID are required (provide in Discord settings or environment variables)' }, { status: 400 });
    }

    await sendToDiscord({ botToken: activeBotToken, channelId: activeChannelId, applicantName, applicantEmail, companyName, companyWebsite, pdfBase64 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
