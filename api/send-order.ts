// Vercel serverless function. Runs server-side only — the Telegram bot token
// never reaches the browser bundle. Configure TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID as environment variables in the Vercel project settings.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured');
    res.status(500).json({ error: 'Notification service is not configured' });
    return;
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!telegramRes.ok) {
      const details = await telegramRes.text();
      console.error('Telegram API error:', details);
      res.status(502).json({ error: 'Failed to deliver notification' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to reach Telegram API:', error);
    res.status(502).json({ error: 'Failed to deliver notification' });
  }
}
