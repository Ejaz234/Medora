import { MessageSquare } from "lucide-react";

interface ConversationItemProps {
  id: string;
  title: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

function ConversationItem({
  id,
  title,
  isSelected = false,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        isSelected
          ? "bg-zinc-800 text-zinc-100"
          : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
      }`}
    >
      <MessageSquare
        size={15}
        className={`shrink-0 transition ${
          isSelected
            ? "text-teal-400"
            : "text-zinc-600 group-hover:text-teal-400"
        }`}
      />

      <span className="truncate">
        {title}
      </span>
    </button>
  );
}

export default ConversationItem;