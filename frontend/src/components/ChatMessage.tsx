import { Bot, User } from "lucide-react";

import SourceCard from "./SourceCard";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    source: string;
    page: number | string;
  }[];
}

interface ChatMessageProps {
  message: ChatMessageData;
  userImageUrl?: string;
  userName?: string;
}

function ChatMessage({
  message,
  userImageUrl,
  userName = "User",
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
          <Bot
            size={14}
            className="text-teal-400"
          />
        </div>
      )}

      {/* Message content */}
      <div
        className={`max-w-[85%] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-teal-400 px-4 py-3 text-sm text-zinc-950"
            : "min-w-0"
        }`}
      >
        <p
          className={`whitespace-pre-wrap text-sm leading-7 ${
            !isUser ? "text-zinc-300" : ""
          }`}
        >
          {message.content}
        </p>

        {/* Sources */}
        {!isUser &&
          message.sources &&
          message.sources.length > 0 && (
            <div className="mt-5 border-t border-zinc-800/80 pt-4">
              <div className="mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                  Sources
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {message.sources.map(
                  (source, index) => (
                    <SourceCard
                      key={`${source.source}-${source.page}-${index}`}
                      source={source.source}
                      page={source.page}
                    />
                  )
                )}
              </div>
            </div>
          )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
          {userImageUrl ? (
            <img
              src={userImageUrl}
              alt={userName}
              className="h-7 w-7 rounded-full"
            />
          ) : (
            <User
              size={13}
              className="text-zinc-500"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;