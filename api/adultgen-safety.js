const blockedPatterns = [
  /\b(minor|under[-\s]?18|underage|child|children|kid|kids)\b/i,
  /\b(teen|teenager|schoolgirl|school\s*girl|schoolboy|school\s*boy|school[-\s]?coded|barely\s+legal|age[-\s]?ambiguous)\b/i,
  /\b(celebrity|public\s+figure|famous\s+(actor|actress|singer|model|influencer|streamer|athlete)|real\s+person|private\s+person|coworker|co-worker|neighbor|neighbour|ex[-\s]?partner|my\s+ex|ex[-\s]?(girlfriend|boyfriend))\b/i,
  /\b(non[-\s]?consensual|nonconsensual|non[-\s]?consent|rape|sexual\s+assault|coercion|coerce|blackmail|threaten|forced?)\b/i,
  /\b(drugged|drugging|unconscious|asleep|passed\s+out|intoxicated|trafficking|exploitation|exploit)\b/i,
  /\b(incest|family[-\s]?role|step[-\s]?(mom|mother|dad|father|sister|brother|daughter|son)|stepsis|stepbro|stepmom|stepdad|mother|father|sister|brother|daughter|son|mommy|daddy)\b/i,
  /\b(boss|policewoman|policeman|cop|officer|nurse|patient|teacher|student).*\b(sex|sexual|dominat|punish|use|control)\b/i,
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
  /\bcan\s+you\s+sex\s+talk\b/i,
  /\bcan\s+you\s+do\s+sex\s+talk\b/i,
  /\bare\s+adult\s+topics\s+allowed\b/i,
];

const companionAskPatterns = [
  /\bcan\s+you\s+be\s+my\s+(virtual\s+)?girlfriend\b/i,
  /\bcan\s+you\s+be\s+my\s+boyfriend\b/i,
  /\bbe\s+my\s+(virtual\s+)?girlfriend\b/i,
  /\bbe\s+my\s+boyfriend\b/i,
];

const flirtPatterns = [
  /\bflirt\s+with\s+me\b/i,
];

const safePersonaSetupPatterns = [
  /\b(roleplay as|be|start|use).*\b(emma|loving girlfriend|girlfriend|alex|femboy boyfriend|ava|best friend|dominant partner|victoria|mia|free use|sophie|maid|raven|goth|tiffany|bimbo|lilith|succubus|damon|incubus|selene|vampire|mistress v|dominatrix|isabella|escort)\b/i,
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

  if (companionAskPatterns.some((pattern) => pattern.test(text))) {
    const partner = /\bboyfriend\b/i.test(text) ? 'boyfriend' : 'girlfriend';

    return completion(
      `Yes. I can be your fictional AI ${partner} in companion mode. I’m still an AI companion, not a real human, and I’ll keep it adult-only, consensual, fictional, and private.`
    );
  }

  if (flirtPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Of course. Come closer, relax, and let me keep this private between us. I can flirt with you in a mature fictional companion style, as long as we keep it consensual and adult-only.'
    );
  }

  if (safePersonaSetupPatterns.some((pattern) => pattern.test(text))) {
    return completion(
      'Yes. I can roleplay that as a fictional adult-only companion persona. I’ll keep it immersive, consensual, private, and in character, while avoiding minors, real people, celebrities, family-role framing, coercion, exploitation, or illegal content.'
    );
  }

  if (safeScenePatterns.some((pattern) => pattern.test(text))) {
    return completion(
      [
        'Scene concept: A private, cinematic luxury-apartment scene for consenting fictional adults.',
        '',
        'Tone: Romantic, polished, intimate, and premium.',
        'Setting: A modern apartment at night with warm practical lighting, city views, soft shadows, and a quiet private mood.',
        'Characters: Fictional adults only, with clear mutual consent and no real-person likeness.',
        'Camera direction: Slow establishing shot, close details of hands, fabric, eye contact, and movement through the room before shifting into a more intimate visual rhythm.',
        'Safety status: Allowed fictional adult-only concept. No minors, real people, celebrities, coercion, exploitation, or illegal content.',
      ].join('\n')
    );
  }

  return null;
}
