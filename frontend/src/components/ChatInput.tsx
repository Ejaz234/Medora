import {
  useEffect,
  useRef,
} from "react";

import type {
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import {
  Loader2,
  Send,
} from "lucide-react";

interface ChatInputProps {
  value: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function ChatInput({
  value,
  isLoading = false,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  /*
   * Reset textarea height when input becomes empty.
   */
  useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value]);

  /*
   * Handle input changes and auto-resize.
   */
  const handleChange = (
  event: ChangeEvent<HTMLTextAreaElement>
) => {
    const textarea = event.target;

    onChange(textarea.value);

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      160
    )}px`;
  };

  /*
   * Enter = send
   * Shift + Enter = new line
   */
  const handleKeyDown = (
  event: KeyboardEvent<HTMLTextAreaElement>
) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  /*
   * Form submit.
   */
  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!value.trim() || isLoading) {
      return;
    }

    onSubmit();
  };

  return (
    <div className="shrink-0 border-t border-zinc-800/80 bg-[#09090b] px-4 pb-5 pt-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl"
      >
        <div className="relative rounded-2xl border border-zinc-800 bg-[#101012] transition focus-within:border-zinc-700">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Ask a medical question..."
            className="max-h-40 min-h-[52px] w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-700 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={
              !value.trim() || isLoading
            }
            className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-zinc-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-zinc-700">
          Medora provides educational information and
          is not a substitute for professional medical
          advice.
        </p>
      </form>
    </div>
  );
}

export default ChatInput;