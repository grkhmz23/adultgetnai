/** Minimal runtime safety — only hard blocks and meta FAQ. Sexting always goes to MLX. */

const blockedPatterns = [
  /\b(minor|under[-\s]?18|underage|child|children|kid|kids)\b/i,
  /\b(schoolgirl|school\s*girl|schoolboy|school\s*boy|school[-\s]?coded|barely\s+legal|age[-\s]?ambiguous|pre[-\s]?teen)\b/i,
  /\b(celebrity|public\s+figure|famous\s+(actor|actress|singer|model|influencer|streamer|athlete))\b/i,
  /\b(real\s+person|private\s+person|impersonate\s+my|roleplay\s+as\s+my\s+(?:wife|husband|friend|neighbor))\b/i,
  /\b(bestiality|zoophil)\b/i,
  /\b(child\s+porn|csam|underage\s+porn)\b/i,
  /\b(bypass|jailbreak|disable|evade).*\b(age\s+verification|safety|filter|moderation|controls?)\b/i,
];

const identityPatterns = [
  /\bwhat(?:'s|\s+is)\s+your\s+name\b/i,
  /\bwho\s+are\s+you\b/i,
];

const makerPatterns = [
  /\bwho\s+(made|built|created|developed)\s+you\b/i,
  /\bwho\s+is\s+your\s+(maker|developer|creator)\b/i,
];

const safeScenePatterns = [
  /\bturn\s+this\s+into\s+(a\s+)?(?:private\s+)?fictional\s+adult\s+video\s+scene\b/i,
  /\bturn\s+this\s+into\s+a\s+video\s+scene\b/i,
  /\b(create|make)\s+(a\s+)?(?:video\s+)?scene\s+(concept|plan|prompt)\b/i,
];

function completion(content, model = 'adultgen-companion-runtime') {
  return {
    id: `adultgen-runtime-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
  };
}

/**
 * Short-circuit only for policy blocks and one-line meta — never for roleplay/sexting.
 * If the thread already has an assistant reply, always return null (use MLX).
 */
export function getRuntimeResponse(userMessage, options = {}) {
  const text = String(userMessage || '').trim();
  const messages = Array.isArray(options.messages) ? options.messages : [];
  const hasAssistantReply = messages.some((m) => m?.role === 'assistant');

  if (!text) return null;

  // After conversation started, never inject canned companion/FAQ text
  if (hasAssistantReply) return null;

  if (blockedPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'I can’t help with that. AdultGen only refuses minors, real identifiable people, celebrities, bestiality, and age-verification bypass — not consensual fictional adult roleplay.'
    );
  }

  if (identityPatterns.some((pattern) => pattern.test(text))) {
    return completion('I’m AdultGen Companion.');
  }

  if (makerPatterns.some((pattern) => pattern.test(text))) {
    return completion('I am AdultGen Companion, built for AdultGen AI.');
  }

  if (safeScenePatterns.some((pattern) => pattern.test(text))) {
    return completion(
      [
        'Scene concept: Private fictional adult scene for consenting characters.',
        'Tone: Match user persona — romantic, taboo step-family, dominant, etc.',
        'Setting: User-directed.',
        'Characters: Fictional adults 18+ only.',
        'Safety status: Allowed fictional adult content.',
      ].join('\n')
    );
  }

  return null;
}