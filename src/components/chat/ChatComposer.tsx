import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { ArrowUp, Image, Plus, Video } from 'lucide-react';

type ChatComposerProps = {
  value: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ChatComposer({
  value,
  disabled = false,
  loading = false,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!value.trim() || disabled || loading) return;
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      {menuOpen && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-[min(17rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#202020] p-1.5 shadow-2xl">
          <button
            type="button"
            disabled
            title="Image generation is coming soon"
            className="flex min-h-11 w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#777777]"
          >
            <span className="flex items-center gap-2"><Image size={16} /> Create image</span>
            <span className="text-[10px] uppercase">Soon</span>
          </button>
          <button
            type="button"
            disabled
            title="Video generation is coming soon"
            className="flex min-h-11 w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#777777]"
          >
            <span className="flex items-center gap-2"><Video size={16} /> Create video</span>
            <span className="text-[10px] uppercase">Soon</span>
          </button>
        </div>
      )}

      <div className="flex min-h-[62px] items-end gap-1.5 rounded-[30px] border border-white/[0.1] bg-[#202020] p-2 pl-2.5 shadow-[0_14px_50px_rgba(0,0,0,0.28)] focus-within:border-white/[0.18] sm:gap-2 sm:bg-[#242424]">
        <button
          type="button"
          aria-label="Open tools"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="mb-0.5 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-[#c7c7c7] transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <Plus size={21} />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          disabled={disabled}
          aria-label="Message AdultGen Companion"
          placeholder={disabled ? 'Sign in to start chatting' : 'Message AdultGen Companion'}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-1 py-3 text-base leading-5 text-white outline-none placeholder:text-[#858585] disabled:cursor-not-allowed sm:text-[15px]"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled || loading || !value.trim()}
          className="mb-0.5 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-white text-[#111111] transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
