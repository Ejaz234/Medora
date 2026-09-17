import { ArrowLeft, Bot, Menu } from "lucide-react";

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onBackToDashboard: () => void;
}

function ChatHeader({
  sidebarOpen,
  onToggleSidebar,
  onBackToDashboard,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Open sidebar */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Back to dashboard */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Assistant identity */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
            <Bot
              size={17}
              className="text-teal-400"
            />
          </div>

          <div>
            <h1 className="text-sm font-medium text-zinc-200">
              Medical Assistant
            </h1>

            <p className="text-[10px] text-zinc-600">
              Grounded in medical sources
            </p>
          </div>
        </div>
      </div>

      {/* RAG status */}
      <div className="hidden items-center gap-2 text-[10px] text-zinc-600 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />

        RAG active
      </div>
    </header>
  );
}

export default ChatHeader;