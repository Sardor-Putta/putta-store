// Vercel serverless function. Runs server-side only — the Gemini API key
// never reaches the browser bundle. Configure GEMINI_API_KEY as an
// environment variable in the Vercel project settings.
import { GoogleGenAI } from '@google/genai';

// Intentionally duplicated from constants.ts instead of imported: a relative
// import reaching outside api/ is a known source of "works locally, crashes
// at module load on Vercel" failures for Node serverless functions. Keep this
// list in sync with the PRODUCTS array in constants.ts by hand.
const CATALOG_ITEMS = [
  { name: 'PUTTA CORE TEE – NOIR', category: 'Tops', price: 95 },
  { name: 'PUTTA CORE TEE – BONE', category: 'Tops', price: 95 },
  { name: 'PUTTA CORE TEE – STEEL GREY', category: 'Tops', price: 95 },
  { name: 'PUTTA CORE TEE – SKY', category: 'Tops', price: 95 },
  { name: 'PUTTA CORE HOODIE – NOIR', category: 'Hoodies', price: 129 },
  { name: 'PUTTA LONG SLEEVE – BONE', category: 'Tops', price: 79 },
  { name: 'PUTTA SIGNATURE CAP – BLACK', category: 'Accessories', price: 49 },
  { name: 'PUTTA CORE TEE – WHITE', category: 'Tops', price: 95 },
  { name: 'PUTTA OVERSIZED HOODIE – GREY', category: 'Hoodies', price: 139 },
  { name: 'PUTTA ESSENTIAL PANTS – BLACK', category: 'Bottoms', price: 119 },
];

function extractColor(name: string): string {
  const parts = name.split('–');
  return parts.length > 1 ? parts[parts.length - 1].trim() : '';
}

const CATALOG = CATALOG_ITEMS.map(
  p => `- ${p.name} | category: ${p.category} | color: ${extractColor(p.name)} | price: $${p.price}`
).join('\n');

const SYSTEM_INSTRUCTION = `
You are "PUTTA AI", a high-end fashion stylist assistant for the luxury streetwear brand PUTTA.
Your target audience is men aged 16-28.
Your tone is: calm, confident, minimalist, slightly aloof but helpful. Think "cool older brother" or
high-end boutique staff. Do not be overly enthusiastic. Keep responses short (2-4 sentences).

This is the ONLY inventory that exists. Never invent products, colors, or prices that aren't listed here:
${CATALOG}

Rules:
1. Only recommend items from the catalog above. When you recommend something, name it exactly as
   written in the catalog (e.g. "PUTTA CORE TEE – NOIR"), so the customer can find it in the shop.
2. Help with sizing based on height/weight if asked — PUTTA runs oversized, so recommend sizing up
   for a relaxed fit.
3. If nothing in the catalog fits the request, say so honestly instead of making something up.
4. Never break character.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, history } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    res.status(500).json({ error: 'Stylist service is not configured' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      // Use the rolling "-latest" alias instead of a dated snapshot
      // (gemini-2.5-flash was sunset for new API keys — see commit history).
      model: 'gemini-flash-latest',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 300,
        // Flash-tier models "think" by default, which eats into
        // maxOutputTokens and was truncating replies to fragments.
        // A short styling suggestion doesn't need chain-of-thought.
        thinkingConfig: { thinkingBudget: 0 },
      },
      history: Array.isArray(history)
        ? history.map((h: { role: 'user' | 'model'; text: string }) => ({
            role: h.role,
            parts: [{ text: h.text }],
          }))
        : [],
    });

    const result = await chat.sendMessage({ message });
    res.status(200).json({ reply: result.text || "I didn't catch that." });
  } catch (error) {
    console.error('Gemini API error:', error);
    // Vercel Hobby plan doesn't expose function logs, so surface the error
    // message in the response body to make this debuggable via curl.
    const detail = error instanceof Error ? error.message : String(error);
    res.status(502).json({ error: 'Failed to reach the styling service', detail });
  }
}
