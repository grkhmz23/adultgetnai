import { useEffect, useMemo, useState } from 'react';

export type LocalChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type LocalConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: LocalChatMessage[];
};

const storageVersion = 1;

function newId() {
  return crypto.randomUUID();
}

function cleanMessage(value: unknown): LocalChatMessage | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<LocalChatMessage>;
  if (
    (candidate.role !== 'user' && candidate.role !== 'assistant') ||
    typeof candidate.content !== 'string' ||
    !candidate.content.trim()
  ) {
    return null;
  }

  return {
    id: typeof candidate.id === 'string' ? candidate.id : newId(),
    role: candidate.role,
    content: candidate.content.slice(0, 4000),
    createdAt:
      typeof candidate.createdAt === 'string'
        ? candidate.createdAt
        : new Date().toISOString(),
  };
}

function loadConversations(storageKey: string): LocalConversation[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { version?: number; conversations?: unknown[] };
    if (parsed.version !== storageVersion || !Array.isArray(parsed.conversations)) return [];

    return parsed.conversations
      .map((value): LocalConversation | null => {
        if (!value || typeof value !== 'object') return null;
        const candidate = value as Partial<LocalConversation>;
        if (typeof candidate.id !== 'string' || !Array.isArray(candidate.messages)) return null;
        const messages = candidate.messages.map(cleanMessage).filter(Boolean) as LocalChatMessage[];
        const now = new Date().toISOString();
        return {
          id: candidate.id,
          title:
            typeof candidate.title === 'string' && candidate.title.trim()
              ? candidate.title.slice(0, 72)
              : 'New conversation',
          createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : now,
          updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : now,
          messages,
        };
      })
      .filter(Boolean)
      .sort((left, right) => right!.updatedAt.localeCompare(left!.updatedAt))
      .slice(0, 40) as LocalConversation[];
  } catch {
    return [];
  }
}

function titleFromMessage(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length > 42 ? `${normalized.slice(0, 42)}…` : normalized;
}

export function createLocalMessage(
  role: LocalChatMessage['role'],
  content: string
): LocalChatMessage {
  return {
    id: newId(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function useLocalConversations(namespace: string) {
  const storageKey = `adultgen_chat_history:${namespace || 'anonymous'}`;
  const [conversations, setConversations] = useState<LocalConversation[]>(() =>
    loadConversations(storageKey)
  );
  const [activeId, setActiveId] = useState<string | null>(() => conversations[0]?.id ?? null);

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ version: storageVersion, conversations })
      );
    } catch {
      /* Chat remains usable when browser storage is unavailable. */
    }
  }, [conversations, storageKey]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [activeId, conversations]
  );

  function startNewConversation() {
    setActiveId(null);
  }

  function ensureConversation(firstMessage: string) {
    if (activeId && conversations.some((conversation) => conversation.id === activeId)) {
      return activeId;
    }

    const now = new Date().toISOString();
    const id = newId();
    const conversation: LocalConversation = {
      id,
      title: titleFromMessage(firstMessage) || 'New conversation',
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    setConversations((current) => [conversation, ...current].slice(0, 40));
    setActiveId(id);
    return id;
  }

  function appendMessage(conversationId: string, message: LocalChatMessage) {
    setConversations((current) =>
      current
        .map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                updatedAt: message.createdAt,
                messages: [...conversation.messages, message].slice(-60),
              }
            : conversation
        )
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    );
  }

  function deleteConversation(conversationId: string) {
    setConversations((current) => current.filter((conversation) => conversation.id !== conversationId));
    if (activeId === conversationId) setActiveId(null);
  }

  function clearAll() {
    setConversations([]);
    setActiveId(null);
  }

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    startNewConversation,
    ensureConversation,
    appendMessage,
    deleteConversation,
    clearAll,
  };
}
