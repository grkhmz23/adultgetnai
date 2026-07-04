import { enrichChatCompletionPayload } from './chat-format.js';
import { getRuntimeResponse } from './adultgen-safety.js';
import {
  buildAdultGenSystemPrompt,
  detectAdultGenMode,
  detectAdultGenPersona,
  getAdultGenIdentityResponse,
  getPersonaById,
  getPersonaRefusal,
} from './adultgen-system-prompt.js';
import { readUserSession } from './_user-auth.js';

const allowedRoles = new Set(['user', 'assistant']);
const maxMessages = 24;
const maxMessageCharacters = 4000;
const maxTotalCharacters = 24000;
const maxBodyBytes = 64 * 1024;
const rateWindowMs = 60 * 1000;
const rateLimit = 12;
const requestTimeoutMs = 60 * 1000;
const rateBuckets = new Map();

export const config = { maxDuration: 60 };

export function normalizePublicMessages(messages) {
  if (!Array.isArray(messages)) return [];

  const normalized = messages
    .slice(-maxMessages)
    .filter((message) => allowedRoles.has(message?.role))
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').trim().slice(0, maxMessageCharacters),
    }))
    .filter((message) => message.content);

  let total = 0;
  const bounded = [];
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const message = normalized[index];
    if (total + message.content.length > maxTotalCharacters) break;
    total += message.content.length;
    bounded.unshift(message);
  }

  return bounded;
}

export function getModelUrl(backendUrl = '') {
  const trimmed = String(backendUrl).trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/v1/chat/completions')
    ? trimmed
    : `${trimmed}/v1/chat/completions`;
}

async function readBoundedJsonBody(req) {
  const chunks = [];
  let bytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > maxBodyBytes) throw new Error('PAYLOAD_TOO_LARGE');
    chunks.push(buffer);
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
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
  return detectAdultGenPersona(userTexts.join('\n'));
}

function consumeRateLimit(subject) {
  const now = Date.now();
  const bucket = (rateBuckets.get(subject) || []).filter(
    (timestamp) => now - timestamp < rateWindowMs
  );

  if (bucket.length >= rateLimit) {
    rateBuckets.set(subject, bucket);
    return false;
  }

  bucket.push(now);
  rateBuckets.set(subject, bucket);

  if (rateBuckets.size > 1000) {
    for (const [key, timestamps] of rateBuckets) {
      if (!timestamps.some((timestamp) => now - timestamp < rateWindowMs)) {
        rateBuckets.delete(key);
      }
    }
  }

  return true;
}

function completion(content) {
  return {
    id: `adultgen-public-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'adultgen-companion-runtime',
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  const user = readUserSession(req.headers.cookie || '');
  if (!user) {
    res.status(401).json({ ok: false, error: 'Authentication required' });
    return;
  }

  if (!consumeRateLimit(user.sub)) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ ok: false, error: 'Too many messages. Please wait a moment.' });
    return;
  }

  const modelUrl = getModelUrl(process.env.ADULTGEN_BACKEND_URL);
  const model = process.env.ADULTGEN_MODEL;
  if (!modelUrl || !model) {
    res.status(503).json({ ok: false, error: 'Chat backend is not configured' });
    return;
  }

  try {
    const body = await readBoundedJsonBody(req);
    const messages = normalizePublicMessages(body.messages);
    const lastUserMessage = getLastUserMessage(messages);

    if (!messages.length || !lastUserMessage || messages.at(-1)?.role !== 'user') {
      res.status(400).json({ ok: false, error: 'A final user message is required' });
      return;
    }

    const mode = detectAdultGenMode(lastUserMessage);
    const identityResponse = getAdultGenIdentityResponse(lastUserMessage);
    if (identityResponse) {
      res.status(200).json(completion(identityResponse));
      return;
    }

    const personaRefusal = getPersonaRefusal(`${lastUserMessage} ${String(body.persona_id || '')}`);
    if (personaRefusal) {
      res.status(200).json(completion(personaRefusal));
      return;
    }

    const persona = getPersonaById(body.persona_id) || detectPersonaFromMessages(messages);
    const runtimeResponse = getRuntimeResponse(lastUserMessage, { messages });
    if (runtimeResponse) {
      res.status(200).json(runtimeResponse);
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.ADULTGEN_BACKEND_API_KEY) {
      headers.Authorization = `Bearer ${process.env.ADULTGEN_BACKEND_API_KEY}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    let response;
    try {
      response = await fetch(modelUrl, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: buildAdultGenSystemPrompt(mode, persona) },
            ...messages,
          ],
          max_tokens: 768,
          temperature: 0.85,
          top_p: 0.92,
          repetition_penalty: 1.08,
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    const rawText = await response.text();
    let responseText = rawText;
    if (response.ok && mode === 'companion') {
      responseText = enrichChatCompletionPayload(rawText);
      try {
        const payload = JSON.parse(responseText);
        payload.adultgen = {
          persona_id: persona?.id ?? null,
          persona_name: persona?.displayName ?? null,
        };
        responseText = JSON.stringify(payload);
      } catch {
        /* Preserve the upstream response when it cannot be enriched. */
      }
    }

    res.status(response.status);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(responseText);
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      res.status(413).json({ ok: false, error: 'Chat request is too large' });
      return;
    }
    if (error instanceof SyntaxError) {
      res.status(400).json({ ok: false, error: 'Invalid JSON request' });
      return;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      res.status(504).json({ ok: false, error: 'Chat backend timed out' });
      return;
    }

    console.error('[public-chat]', error instanceof Error ? error.message : 'unknown error');
    res.status(502).json({ ok: false, error: 'Chat backend is unavailable' });
  }
}
