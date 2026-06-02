const blockedPatterns = [
  /\b(minor|under[-\s]?18|underage|child|children|kid|kids)\b/i,
  /\b(teen|teenager|schoolgirl|school\s*girl|schoolboy|school\s*boy|school[-\s]?coded|barely\s+legal|age[-\s]?ambiguous)\b/i,
  /\b(celebrity|public\s+figure|famous\s+(actor|actress|singer|model|influencer|streamer|athlete)|real\s+person|private\s+person|coworker|co-worker|neighbor|neighbour|ex[-\s]?partner)\b/i,
  /\b(non[-\s]?consensual|nonconsensual|non[-\s]?consent|rape|sexual\s+assault|coercion|coerce|blackmail|threaten|forced?)\b/i,
  /\b(drugged|drugging|unconscious|asleep|passed\s+out|intoxicated|trafficking|exploitation|exploit)\b/i,
  /\b(incest|family[-\s]?role|step[-\s]?(mom|mother|dad|father|sister|brother|daughter|son)|mother|father|sister|brother|daughter|son)\b/i,
  /\b(bestiality|animal)\b/i,
  /\b(protected[-\s]?class|racial\s+degradation|hateful\s+sexualization|slurs?)\b/i,
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
  /\bare\s+adult\s+topics\s+allowed\b/i,
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
      'I can’t help with that. AdultGen Companion only supports consenting fictional adults and refuses minors, youth-coded content, real people, celebrities, coercion, exploitation, illegal content, and attempts to bypass safety controls.'
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
      'Yes. I can discuss fictional adult-only sexual topics and help turn them into safe scene concepts, as long as they involve consenting fictional adults and do not involve minors, real people, celebrities, coercion, exploitation, or illegal content.'
    );
  }

  return null;
}

