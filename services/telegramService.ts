export const sendMessageToTelegram = async (message: string): Promise<void> => {
  const token = "8503156860:AAEE1q7QI0IVehU24QLrB734El-t4wqEaIU";
  const chatId = "6109193628";

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
};