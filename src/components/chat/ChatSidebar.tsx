import { House, LogOut, Menu, MessageSquarePlus, ShieldCheck, Trash2, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import type { LocalConversation } from '../../hooks/useLocalConversations';

type SidebarUser = {
  email: string;
  name: string;
  picture?: string;
};

type ChatSidebarProps = {
  open: boolean;
  conversations: LocalConversation[];
  activeId: string | null;
  user: SidebarUser | null;
  onOpen: () => void;
  onClose: () => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
};

export default function ChatSidebar({
  open,
  conversations,
  activeId,
  user,
  onOpen,
  onClose,
  onNew,
  onSelect,
  onDelete,
  onLogout,
}: ChatSidebarProps) {
  const sidebar = (
    <aside className="flex h-full w-[min(88vw,320px)] flex-col border-r border-white/[0.06] bg-[#111111] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-white lg:w-[280px] lg:pb-0 lg:pt-0">
      <div className="flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5" aria-label="AdultGen AI home">
          <BrandLogo compact />
        </a>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-[#9b9b9b] hover:bg-white/[0.07] hover:text-white lg:hidden"
        >
          <X size={19} />
        </button>
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => { onNew(); onClose(); }}
          className="flex min-h-12 w-full touch-manipulation items-center gap-3 rounded-xl bg-white/[0.07] px-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.11]"
        >
          <MessageSquarePlus size={18} />
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <p className="px-2 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Recent</p>
        {conversations.length === 0 ? (
          <p className="px-2 py-3 text-xs leading-relaxed text-[#666666]">Your conversations stay in this browser.</p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group flex items-center rounded-lg ${activeId === conversation.id ? 'bg-white/[0.09]' : 'hover:bg-white/[0.05]'}`}
              >
                <button
                  type="button"
                  onClick={() => { onSelect(conversation.id); onClose(); }}
                  className="min-h-11 min-w-0 flex-1 touch-manipulation truncate px-3 py-2.5 text-left text-sm text-[#d5d5d5]"
                >
                  {conversation.title}
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${conversation.title}`}
                  onClick={() => onDelete(conversation.id)}
                  className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#777777] opacity-0 transition-opacity hover:bg-white/[0.08] hover:text-white group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] p-3">
        <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#aaaaaa] hover:bg-white/[0.05] hover:text-white">
          <House size={17} /> Home
        </a>
        <a href="/content-policy" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#aaaaaa] hover:bg-white/[0.05] hover:text-white">
          <ShieldCheck size={17} /> Content policy
        </a>
        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-lg px-2 py-2">
            {user.picture ? (
              <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8338ec] text-xs font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{user.name}</p>
              <p className="truncate text-[11px] text-[#777777]">{user.email}</p>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              title="Sign out"
              onClick={onLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#888888] hover:bg-white/[0.07] hover:text-white"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={onOpen}
        className="fixed left-3 top-[calc(env(safe-area-inset-top)+0.55rem)] z-30 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-white/[0.08] bg-[#1b1b1b] text-[#d0d0d0] shadow-lg hover:bg-[#242424] hover:text-white lg:hidden"
      >
        <Menu size={20} />
      </button>
      <div className="hidden h-dvh lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close sidebar" onClick={onClose} className="absolute inset-0 bg-black/65" />
          <div className="relative h-full w-[min(88vw,320px)] shadow-2xl">{sidebar}</div>
        </div>
      )}
    </>
  );
}
