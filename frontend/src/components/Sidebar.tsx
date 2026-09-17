import {
  ChevronLeft,
  Clock3,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/react";

import ConversationItem from "./ConversationItem";

interface Conversation {
  id: string;
  title: string;
}

interface SidebarProps {
  conversations?: Conversation[];
  selectedConversationId?: string | null;
  isLoading?: boolean;
  onNewConversation?: () => void;
  onSelectConversation?: (id: string) => void;
  onCollapse?: () => void;
}

function Sidebar({
  conversations = [],
  selectedConversationId = null,
  isLoading = false,
  onNewConversation,
  onSelectConversation,
  onCollapse,
}: SidebarProps) {
  const { user } = useUser();

  return (
    <aside className="flex h-screen w-[270px] shrink-0 flex-col border-r border-zinc-800 bg-[#0d0d0f]">

      {/* Header */}

      <div className="flex h-[72px] items-center justify-between border-b border-zinc-800 px-5">
        <div>
          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400">
              <span className="text-sm font-bold text-zinc-950">
                M
              </span>
            </div>

            <span className="text-[15px] font-semibold tracking-tight">
              <span className="text-teal-400">
                MEDORA
              </span>
            </span>

          </div>

          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
            Medical intelligence
          </p>
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          className="rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-800 hover:text-zinc-300"
        >
          <ChevronLeft size={17} />
        </button>
      </div>


      {/* New conversation */}

      <div className="p-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="group flex w-full items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition duration-200 hover:border-teal-500/40 hover:bg-zinc-800"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10">
            <Plus
              size={16}
              className="text-teal-400 transition-transform duration-200 group-hover:rotate-90"
            />
          </div>

          <span>
            New conversation
          </span>
        </button>
      </div>


      {/* Conversations */}

      <div className="flex-1 overflow-y-auto px-3">

        <div className="mb-3 flex items-center gap-2 px-2">
          <Clock3
            size={13}
            className="text-zinc-600"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Recent
          </span>
        </div>


        {isLoading ? (

          <div className="flex flex-col items-center justify-center px-3 py-10">
            <Loader2
              size={16}
              className="animate-spin text-teal-500"
            />

            <p className="mt-3 text-[10px] text-zinc-700">
              Loading conversations...
            </p>
          </div>

        ) : conversations.length === 0 ? (

          <div className="px-3 py-10 text-center">

            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <MessageSquare
                size={16}
                className="text-zinc-700"
              />
            </div>

            <p className="text-xs text-zinc-600">
              No conversations yet
            </p>

            <p className="mx-auto mt-1 max-w-[170px] text-[10px] leading-4 text-zinc-700">
              Start a conversation and it will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-1">

            {conversations.map(
              (conversation) => (
                <ConversationItem
                  key={conversation.id}
                  id={conversation.id}
                  title={conversation.title}
                  isSelected={
                    conversation.id ===
                    selectedConversationId
                  }
                  onClick={
                    onSelectConversation
                  }
                />
              )
            )}

          </div>

        )}

      </div>


      {/* User section */}

      <div className="border-t border-zinc-800 p-3">

        <div className="flex items-center gap-3 rounded-xl px-3 py-3">

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />

          <div className="min-w-0">

            <p className="truncate text-xs font-medium text-zinc-200">
              {user?.fullName ||
                user?.firstName ||
                "User"}
            </p>

            <p className="truncate text-[10px] text-zinc-500">
              {user?.primaryEmailAddress
                ?.emailAddress ||
                "Signed in"}
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;