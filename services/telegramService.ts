// The Telegram bot token lives server-side only (see /api/send-order.ts).
// The client never sees it.
export const sendMessageToTelegram = async (message: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error('Failed to send order notification:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
};