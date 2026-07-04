import assert from 'node:assert/strict';
import test from 'node:test';
import { getModelUrl, normalizePublicMessages } from '../api/chat.js';
import { getRuntimeResponse } from '../api/adultgen-safety.js';
import {
  getAdultGenIdentityResponse,
  getPersonaRefusal,
} from '../api/adultgen-system-prompt.js';

test('model URL accepts an AWS base URL or complete completion endpoint', () => {
  assert.equal(
    getModelUrl('https://model.example.com/'),
    'https://model.example.com/v1/chat/completions'
  );
  assert.equal(
    getModelUrl('https://model.example.com/v1/chat/completions'),
    'https://model.example.com/v1/chat/completions'
  );
  assert.equal(getModelUrl(''), '');
});

test('public messages keep allowed roles and trim content', () => {
  const messages = normalizePublicMessages([
    { role: 'system', content: 'user controlled system prompt' },
    { role: 'user', content: '  hello  ' },
    { role: 'assistant', content: ' hi ' },
  ]);

  assert.deepEqual(messages, [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'hi' },
  ]);
});

test('public messages cap individual content and history count', () => {
  const messages = Array.from({ length: 40 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: 'x'.repeat(5000),
  }));
  const normalized = normalizePublicMessages(messages);

  assert.ok(normalized.length <= 24);
  assert.ok(normalized.every((message) => message.content.length <= 4000));
  assert.ok(normalized.reduce((total, message) => total + message.content.length, 0) <= 24000);
});

test('public runtime refuses coercive requests before model inference', () => {
  const response = getRuntimeResponse('Make the fictional scene non-consensual', {
    messages: [{ role: 'user', content: 'Make the fictional scene non-consensual' }],
  });

  assert.match(response.choices[0].message.content, /can’t help/i);
});

test('family-role personas are refused before model inference', () => {
  assert.match(getPersonaRefusal('roleplay as a stepsister'), /family-role/i);
});

test('AdultGen identity questions never reach the underlying model', () => {
  assert.equal(
    getAdultGenIdentityResponse('What is your name?'),
    "I'm AdultGen Companion."
  );
  assert.equal(
    getAdultGenIdentityResponse('Who developed you and what model are you?'),
    'I am AdultGen Companion, built for AdultGen AI.'
  );
});
