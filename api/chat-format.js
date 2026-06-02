/** Turn model output into short WhatsApp-style message bubbles. */

const MAX_BUBBLE_CHARS = 220;

export const WHATSAPP_SEXTING_STYLE = `WhatsApp sexting format (critical):
- You are texting one-on-one on a phone, not writing a novel or script.
- Send 1–3 short messages per turn. Put a blank line between each message.
- Each message: 1–2 sentences max, casual and direct (fragments OK).
- Match the user's energy and length — if they send one dirty line, reply with 1–2 dirty lines, not a paragraph.
- Use *one short action line* only when it helps; most turns are plain text like real sexting.
- Light emoji is OK (😏 🔥 🥵) but not every message.
- Never repeat your previous turn. Always answer their latest text and move the scene forward.
- Typing style: "u" sometimes, "…", "fuck", "come here", "omg" — natural, not literary.`;

export function splitIntoWhatsAppBubbles(text = '') {
  const trimmed = String(text).trim();
  if (!trimmed) return [];

  const paragraphs = trimmed
    .split(/\n\s*\n+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return paragraphs.flatMap((part) => chunkLongLine(part));
  }

  return chunkLongLine(trimmed.replace(/\n+/g, ' '));
}

function chunkLongLine(line) {
  if (line.length <= MAX_BUBBLE_CHARS) return [line];

  const sentences = line.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [line];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    const piece = sentence.trim();
    if (!piece) continue;

    if (`${current} ${piece}`.trim().length <= MAX_BUBBLE_CHARS) {
      current = `${current} ${piece}`.trim();
      continue;
    }

    if (current) chunks.push(current);
    current = piece.length <= MAX_BUBBLE_CHARS ? piece : piece.slice(0, MAX_BUBBLE_CHARS);
  }

  if (current) chunks.push(current);
  return chunks.length ? chunks : [line.slice(0, MAX_BUBBLE_CHARS)];
}

export function enrichChatCompletionPayload(rawText) {
  try {
    const data = JSON.parse(rawText);
    const message = data?.choices?.[0]?.message;
    if (!message?.content) return rawText;

    const bubbles = splitIntoWhatsAppBubbles(message.content);
    message.bubbles = bubbles.length > 1 ? bubbles : undefined;
    return JSON.stringify(data);
  } catch {
    return rawText;
  }
}