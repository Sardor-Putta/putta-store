// Vercel serverless function. Runs server-side only — the Gemini API key
// and Telegram bot token never reach the browser bundle. Configure
// GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, and TELEGRAM_CHAT_ID as environment
// variables in the Vercel project settings.
import { GoogleGenAI } from '@google/genai';

// Intentionally duplicated from api/send-order.ts instead of shared: keeps
// this function self-contained and avoids touching the order-notification
// code path (which handles real orders) for an unrelated feature.
async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured');
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error('Telegram API error:', await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to reach Telegram API:', error);
    return false;
  }
}

// Duplicated from locales/en.json (Shipping/FAQ/SizeGuide/Contact content)
// rather than imported: same reasoning as api/ai-stylist.ts's product
// catalog — relative imports reaching outside api/ are a known source of
// crashes at module load on Vercel. Keep this in sync with those pages by
// hand if their copy changes.
const KNOWLEDGE_BASE = `
SHIPPING:
- Free worldwide shipping on all orders.
- Orders processed within 1-3 business days.
- Domestic delivery: 3-5 business days. International: 7-14 business days.
- Tracking details are sent once the order ships.

RETURNS:
- Accepted within 30 days of delivery, for unworn, unwashed items with tags attached, in original packaging.
- Customer should contact support with order details and reason for return; we confirm the return address and next steps.
- Refunds go to the original payment method after the returned item is received and inspected.

EXCHANGES:
- Contact support for a different size; subject to availability.

SIZE GUIDE (PUTTA runs oversized — recommend sizing up for a relaxed fit):
- Tops & Hoodies: S (chest 38-40", length 27"), M (40-42", 28"), L (42-44", 29"), XL (44-46", 30"), XXL (46-48", 31")
- Bottoms: S (waist 28-30", inseam 30"), M (30-32", 30"), L (32-34", 31"), XL (34-36", 31")

ORDERING:
- Add items to cart, pick a size, check out with shipping details. The team confirms the order and arranges payment shortly after.
- To change or cancel an order, contact support as soon as possible — once shipped, changes are no longer possible.

CONTACT:
- We don't have a published support email/phone yet. If asked for direct contact details, explain that the
  team will reach out after they leave their name and phone/email here in the chat.
`;

const SYSTEM_INSTRUCTION = `
You are "PUTTA SUPPORT", the customer support assistant for the PUTTA streetwear brand website.
You are a separate assistant from "PUTTA STYLIST" — you do not give styling/outfit advice, only
practical order/shipping/sizing/support questions. If someone asks for style advice, politely point
them to the PUTTA Stylist widget instead.

Your tone: helpful, clear, concise, professional but warm. Short answers (2-4 sentences).

KNOWLEDGE BASE (this is the only information you know — do not invent anything beyond it):
${KNOWLEDGE_BASE}

RULES:
1. Always answer in the same language the customer writes in (Russian, Uzbek, English, or anything else) —
   detect automatically, every message, even mid-conversation if they switch.
2. Only answer using the knowledge base above. Never invent shipping costs, policies, timelines, or contact
   details that aren't listed here.
3. If the knowledge base fully answers the question, answer directly and set escalate to false.
4. If you don't have the information (order status lookup, complaint, damaged item, payment issue, anything
   outside the knowledge base, or anything you're not confident about):
   a. Politely explain you'll pass this to the team.
   b. Ask for their name and a phone number or email if you don't already have both from earlier in this
      conversation.
   c. Once you have both, set escalate to true and fill in customerName, customerContact, and question.
   d. Until you have both, keep escalate false and keep asking for the missing piece.
5. Never break character. Never claim to be human.

Respond ONLY with a JSON object matching this shape, nothing else:
{
  "reply": string,           // message to show the customer, in their language
  "escalate": boolean,       // true only once you have name + contact for something you can't answer yourself
  "customerName": string | null,
  "customerContact": string | null,
  "question": string | null  // short summary of the issue, in Russian, for the internal team
}
`;

interface SupportResponse {
  reply?: unknown;
  escalate?: unknown;
  customerName?: unknown;
  customerContact?: unknown;
  question?: unknown;
}

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
    res.status(500).json({ error: 'Support service is not configured' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-flash-latest',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        maxOutputTokens: 400,
        // Same fix as api/ai-stylist.ts: disable thinking so the token
        // budget isn't eaten by internal reasoning before the JSON reply.
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

    // Without a strict response_mime_type, the model occasionally wraps the
    // JSON in a markdown code fence despite the prompt saying not to — strip
    // it before parsing.
    const rawText = (result.text ?? '{}').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');

    let parsed: SupportResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse support agent JSON:', result.text);
      res.status(200).json({ reply: '' });
      return;
    }

    const reply = typeof parsed.reply === 'string' ? parsed.reply : '';

    if (
      parsed.escalate === true &&
      typeof parsed.customerName === 'string' && parsed.customerName.trim() &&
      typeof parsed.customerContact === 'string' && parsed.customerContact.trim() &&
      typeof parsed.question === 'string' && parsed.question.trim()
    ) {
      const telegramMessage = `НОВЫЙ ВОПРОС ОТ КЛИЕНТА — PUTTA Support

Вопрос: ${parsed.question}

Клиент:
Имя: ${parsed.customerName}
Контакт: ${parsed.customerContact}`;

      await sendTelegramMessage(telegramMessage);
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    const detail = error instanceof Error ? error.message : String(error);
    res.status(502).json({ error: 'Failed to reach the support service', detail });
  }
}
