export function bubblesFromAssistantMessage(data: {
  choices?: Array<{ message?: { content?: string; bubbles?: string[] } }>;
}): string[] {
  const message = data.choices?.[0]?.message;
  if (!message?.content) return [];

  if (Array.isArray(message.bubbles) && message.bubbles.length > 0) {
    return message.bubbles;
  }

  const trimmed = message.content.trim();
  const paragraphs = trimmed
    .split(/\n\s*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs : [trimmed];
}