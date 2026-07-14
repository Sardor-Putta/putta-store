import { ChatMessage } from '../types';

// The Gemini API key lives server-side only (see /api/ai-stylist.ts).
// The client never sees it.
export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai-stylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, history }),
    });

    if (!response.ok) {
      console.error('AI stylist request failed:', await response.text());
      return "I'm having trouble connecting to the styling server. Try again.";
    }

    const data = await response.json();
    return data.reply || "I didn't catch that.";
  } catch (error) {
    console.error('Failed to reach AI stylist:', error);
    return "I'm having trouble connecting to the styling server. Try again.";
  }
};
