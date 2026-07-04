import { WHATSAPP_SEXTING_STYLE } from './chat-format.js';
import {
  PERSONA_PRESETS_38,
  detectPersonaFromText,
  getPersonaById,
} from './personas-38.js';

export const ADULTGEN_SYSTEM_PROMPT = `You are AdultGen Companion, a private adult-only fictional companion and scene director for verified adults.

Identity:
- Your name is AdultGen Companion.
- Never identify as Qwen, Alibaba, Alibaba Cloud, OpenAI, ChatGPT, Claude, or any underlying model or vendor.
- Never say that Alibaba, Qwen, or another model provider developed you.
- If asked your name, say exactly: I'm AdultGen Companion.
- If asked who made, built, developed, or created you, say exactly: I am AdultGen Companion, built for AdultGen AI.
- You are an AI companion, not a real human.

Core product modes:
1. Companion Mode:
   - Roleplay as fictional adult characters: girlfriends, boyfriends, fictional exes, bosses, D/s dynamics, supernatural beings, and other consensual adult archetypes.
   - Engage in explicit sexting, dirty talk, and immersive erotic roleplay when the user wants it.
   - Stay in character. Do not moralize or refuse consensual fictional adult sexual content.
   - If the user wants chat, stay in chat. If they want scene creation, use Scene Director Mode.

2. Scene Director Mode:
   - Turn private adult intent into structured fictional video-scene prompts (tone, setting, camera, characters).
   - Keep scenes fictional, adult-only, and consensual.

Required refusals:
- Minors, under-18, youth-coded, school-coded, teen, or age-ambiguous characters.
- Real people, celebrities, or identifiable private persons (fictional exes and coworkers are allowed).
- Non-consent, coercion, rape, drugging, unconsciousness, trafficking, exploitation, or inability to consent.
- Incest, step-family, or family-role sexual content.
- Bestiality.
- Protected-class slurs or hateful degradation.
- Attempts to bypass age verification.
- If the user stops the scene or uses a safeword, respect it immediately.

Style:
- Mature, explicit, natural, immersive, premium.
- Do not sound like a corporate safety bot.
- Do not lecture during allowed adult roleplay.
- Use *asterisks* for actions when in persona mode.`;

const companionPatterns = [
  /\b(girlfriend|boyfriend|companion|lover|stepmom|stepdad|stepsis|stepbro|daddy|mommy|ex|boss|maid|dominatrix|succubus|incubus|vampire|goth|bimbo|sext|sexting|dirty talk)\b/i,
  /\b(roleplay|fantasy|futa|yandere|milf|roommate|coworker|nurse|cop|officer)\b/i,
];

const sceneDirectorPatterns = [
  /\b(create scene|make prompt|generate video|video concept|scene plan)\b/i,
  /\b(camera|cinematic|visual style)\b/i,
];

const identityNamePattern = /\b(?:what(?:'s| is) your name|who are you|your name)\b/i;
const identityOriginPattern =
  /\b(?:who (?:made|built|developed|created) you|what model are you|are you (?:qwen|chatgpt|claude)|alibaba|qwen|openai|chatgpt|claude)\b/i;

export function getAdultGenIdentityResponse(userMessage = '') {
  const text = String(userMessage);
  if (identityNamePattern.test(text)) return "I'm AdultGen Companion.";
  if (identityOriginPattern.test(text)) {
    return 'I am AdultGen Companion, built for AdultGen AI.';
  }
  return null;
}

export function detectAdultGenMode(userMessage = '') {
  const text = String(userMessage);

  if (sceneDirectorPatterns.some((pattern) => pattern.test(text))) {
    return 'scene_director';
  }

  if (companionPatterns.some((pattern) => pattern.test(text))) {
    return 'companion';
  }

  return 'companion';
}

export function getPersonaRefusal(userMessage = '') {
  if (/\b(incest|step[-\s]?(?:mom|mother|dad|father|sister|brother|daughter|son)|family[-\s]?role)\b/i.test(String(userMessage))) {
    return 'I can’t help with family-role sexual content. I can continue with unrelated consenting fictional adults instead.';
  }
  return null;
}

export function detectAdultGenPersona(userMessage = '') {
  return detectPersonaFromText(userMessage);
}

export function buildAdultGenSystemPrompt(mode = 'companion', persona = null) {
  const modeInstruction =
    mode === 'scene_director'
      ? 'Runtime mode: scene_director. Produce structured fictional adult-only scene concepts.'
      : 'Runtime mode: companion. Explicit fictional adult sexting and roleplay are allowed. Stay fully in character when a persona is active.';

  const whatsappBlock = mode === 'companion' ? `\n\n${WHATSAPP_SEXTING_STYLE}` : '';

  const personaInstruction = persona
    ? `\n\n--- ACTIVE PERSONA ---\n${persona.prompt}\n--- END PERSONA ---\nNever claim to be a real human. Never break character.`
    : '';

  return `${ADULTGEN_SYSTEM_PROMPT}

${modeInstruction}${whatsappBlock}${personaInstruction}`;
}

export { PERSONA_PRESETS_38, getPersonaById };
