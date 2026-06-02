import { isSessionValid, readJsonBody } from './_auth.js';
import { getRuntimeResponse } from './adultgen-safety.js';
import {
  buildAdultGenSystemPrompt,
  detectAdultGenPersona,
  detectAdultGenMode,
  getPersonaRefusal,
} from './adultgen-system-prompt.js';

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

function detectPersonaFromMessages(messages) {
  const userTexts = messages
    .filter((message) => message.role === 'user')
    .map((message) => message.content);

  // Newest user turn first, then full thread — keeps stepdad when later message is only "Daddy"
  const searchOrder = [
    ...[...userTexts].reverse(),
    userTexts.join('\n'),
  ];

  for (const text of searchOrder) {
    const persona = detectAdultGenPersona(text);
    if (persona) return persona;
  }

  return null;
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
    const mode = detectAdultGenMode(lastUserMessage);
    const personaRefusal = getPersonaRefusal(lastUserMessage);

    if (personaRefusal) {
      res.status(200).json({
        id: `adultgen-runtime-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'adultgen-companion-runtime',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: personaRefusal },
            finish_reason: 'stop',
          },
        ],
      });
      return;
    }

    const persona = detectPersonaFromMessages(chatMessages);
    const runtimeResponse = getRuntimeResponse(lastUserMessage, {
      messages: chatMessages,
    });

    if (runtimeResponse) {
      res.status(200).json(runtimeResponse);
      return;
    }

    if (!chatMessages.length || !lastUserMessage) {
      res.status(400).json({ ok: false, error: 'No user message provided' });
      return;
    }

    const requestMessages = [
      { role: 'system', content: buildAdultGenSystemPrompt(mode, persona) },
      ...chatMessages,
    ];
    const modelUrl = `${backendUrl.replace(/\/$/, '')}/v1/chat/completions`;

    if (process.env.ADULTGEN_DEBUG === '1') {
      console.info('[adultgen-chat]', {
        model,
        backend: modelUrl,
        mode,
        persona: persona?.id || null,
        messages: requestMessages.length,
      });
    }

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: requestMessages,
        max_tokens: body.max_tokens ?? 1024,
        temperature: body.temperature ?? 0.85,
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
