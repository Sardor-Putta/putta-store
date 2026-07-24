import { ChatMessage } from '../types';

// The Gemini API key lives server-side only (see /api/ai-stylist.ts).
// The client never sees it. Returns null when the request itself failed
// (network/server error) vs an empty string when the request succeeded but
// Gemini returned no text, so the caller can show a distinct translated
// message for each case instead of a hardcoded English one.
export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/ai-stylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, history }),
    });

    if (!response.ok) {
      console.error('AI stylist request failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return typeof data.reply === 'string' ? data.reply : '';
  } catch (error) {
    console.error('Failed to reach AI stylist:', error);
    return null;
  }
};
