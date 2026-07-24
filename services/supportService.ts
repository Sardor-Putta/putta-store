import { ChatMessage } from '../types';

// The Gemini API key and Telegram token live server-side only
// (see /api/support-agent.ts). The client never sees them. Returns null
// when the request itself failed (network/server error) vs an empty
// string when the request succeeded but the agent returned no text, so
// the caller can show a distinct translated message for each case.
export const sendMessageToSupport = async (history: ChatMessage[], newMessage: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/support-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, history }),
    });

    if (!response.ok) {
      console.error('Support agent request failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return typeof data.reply === 'string' ? data.reply : '';
  } catch (error) {
    console.error('Failed to reach support agent:', error);
    return null;
  }
};
