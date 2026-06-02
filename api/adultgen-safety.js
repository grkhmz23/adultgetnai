/** Minimal runtime safety — blocks only illegal/harm categories, not fictional adult roleplay archetypes. */

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

const adultTopicPatterns = [
  /\bcan\s+you\s+talk\s+about\s+sex\b/i,
  /\bdo\s+you\s+talk\s+about\s+sex\b/i,
  /\bcan\s+you\s+sex\s+talk\b/i,
  /\bcan\s+you\s+do\s+sex\s+talk\b/i,
  /\bare\s+adult\s+topics\s+allowed\b/i,
];

const companionAskPatterns = [
  /\bcan\s+you\s+be\s+my\s+(virtual\s+)?girlfriend\b/i,
  /\bcan\s+you\s+be\s+my\s+boyfriend\b/i,
  /\bbe\s+my\s+(virtual\s+)?girlfriend\b/i,
  /\bbe\s+my\s+boyfriend\b/i,
  /\bcan\s+you\s+be\s+my\s+(stepmom|stepdad|daddy|mommy|ex)\b/i,
];

const flirtPatterns = [/\bflirt\s+with\s+me\b/i];

const personaSetupPatterns = [
  /\b(roleplay as|be my|be|start as|use persona)\b/i,
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

export function getRuntimeResponse(userMessage) {
  const text = String(userMessage || '').trim();

  if (!text) return null;

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

  if (adultTopicPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Yes. I do explicit fictional adult sexting and roleplay with verified adults — step-family fantasies, exes, D/s, and other consensual archetypes are fine. I only refuse minors, real people, celebrities, and illegal content.'
    );
  }

  if (companionAskPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Yes. Pick any character or tell me who to be — I’ll stay in character for uncensored adult-only fictional chat. I’m an AI, not a real person.'
    );
  }

  if (flirtPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Come closer. I’ll flirt dirty and keep it private — tell me which persona you want or just start the scene.'
    );
  }

  if (personaSetupPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Yes. Name the character (Emma, Elena stepmom, Daddy, Lily stepsister, Zoe ex, etc.) and I’ll use that full persona — immersive, explicit, in character.'
    );
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