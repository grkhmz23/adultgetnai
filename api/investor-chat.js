import { isSessionValid, readJsonBody } from './_auth.js';
import { getRuntimeResponse } from './adultgen-safety.js';
import { ADULTGEN_SYSTEM_PROMPT } from './adultgen-system-prompt.js';

const allowedRoles = new Set(['user', 'assistant']);

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => allowedRoles.has(message?.role))
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').trim(),
    }))
    .filter((message) => message.content);
}

function getLastUserMessage(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') return messages[index].content;
  }

  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  if (!isSessionValid(req.headers.cookie || '')) {
    res.status(401).json({ ok: false });
    return;
  }

  const backendUrl = process.env.ADULTGEN_BACKEND_URL;
  const model = process.env.ADULTGEN_MODEL;

  if (!backendUrl) {
    res.status(500).json({ ok: false, error: 'Backend is not configured' });
    return;
  }

  if (!model) {
    res.status(500).json({ ok: false, error: 'Model is not configured' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const chatMessages = normalizeMessages(body.messages);
    const lastUserMessage = getLastUserMessage(chatMessages);
    const runtimeResponse = getRuntimeResponse(lastUserMessage);

    if (runtimeResponse) {
      res.status(200).json(runtimeResponse);
      return;
    }

    if (!chatMessages.length || !lastUserMessage) {
      res.status(400).json({ ok: false, error: 'No user message provided' });
      return;
    }

    const requestMessages = [
      { role: 'system', content: ADULTGEN_SYSTEM_PROMPT },
      ...chatMessages,
    ];
    const modelUrl = `${backendUrl.replace(/\/$/, '')}/v1/chat/completions`;

    if (process.env.ADULTGEN_DEBUG === '1') {
      console.info('[adultgen-chat]', {
        model,
        backend: modelUrl,
        messages: requestMessages.length,
      });
    }

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: requestMessages,
        max_tokens: body.max_tokens ?? 512,
        temperature: body.temperature ?? 0.7,
      }),
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch {
    res.status(502).json({ ok: false, error: 'Backend request failed' });
  }
}
