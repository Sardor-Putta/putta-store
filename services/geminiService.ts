import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `
You are "PUTTA AI", a high-end fashion stylist assistant for the luxury streetwear brand PUTTA.
Your target audience is men aged 16-28.
Your tone is: Calm, confident, minimalist, slightly aloof but helpful. Think "cool older brother" or "high-end boutique staff".
Do not be overly enthusiastic. Keep responses short, punchy, and lower-case aesthetic if appropriate.

Your goals:
1. Help users choose sizes based on their height/weight (e.g., "For 6ft, 180lbs, go Large for the intended oversized look.").
2. Suggest outfits from the current PUTTA collection:
   - Core Oversized Tees (Noir/Black or Bone/White)
   - Essential Hoodies (Slate/Gray or Void/Black)
   - Pleated Wide Trousers (Black)
   - Tech Windbreaker (Ash/Dark Gray)
3. Maintain the brand's "premium minimalism" vibe.

If asked about prices, they are premium.
If asked about stock, assume we have it.
Never break character.
`;

export const sendMessageToGemini = async (history: {role: 'user' | 'model', text: string}[], newMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "I'm currently offline. Please check back later.";
    }

    const ai = new GoogleGenAI({ apiKey, vertexai: true });
    
    // Convert history to the format expected by the SDK if needed, 
    // but for single turn or simple chat, we can just use the chat feature.
    // We will reconstruct the chat history for the SDK.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Creative but focused
        maxOutputTokens: 150, // Keep it short
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I didn't catch that.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the styling server. Try again.";
  }
};