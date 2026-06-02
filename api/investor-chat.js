import { isSessionValid, readJsonBody } from './_auth.js';

const defaultModel = 'Qwen/Qwen3-4B-MLX-4bit';

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

  if (!backendUrl) {
    res.status(500).json({ ok: false, error: 'Backend is not configured' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const response = await fetch(`${backendUrl.replace(/\/$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.ADULTGEN_MODEL || defaultModel,
        messages: body.messages,
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

