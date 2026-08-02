const DISCORD_API = 'https://discord.com/api/v10';

export async function sendToDiscord({ botToken, channelId, applicantName, applicantEmail, companyName, companyWebsite, pdfBase64 }) {
  if (!botToken || !channelId) throw new Error('Discord bot token and channel ID are required');

  const formData = new FormData();

  const embed = {
    title: '📊 Company Research Report',
    color: 0xf5a623,
    fields: [
      { name: 'Applicant Name', value: applicantName || 'N/A', inline: true },
      { name: 'Applicant Email', value: applicantEmail || 'N/A', inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
      { name: 'Company Name', value: companyName || 'N/A', inline: true },
      { name: 'Company Website', value: companyWebsite || 'N/A', inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Company Research Assistant' },
  };

  formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

  if (pdfBase64) {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const safeName = (companyName || 'company').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    formData.append('files[0]', blob, `${safeName}-research-report.pdf`);
  }

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bot ${botToken}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord API error ${res.status}: ${err}`);
  }

  return await res.json();
}
