import { FileText } from "lucide-react";

interface SourceCardProps {
  source: string;
  page: number | string;
}

function SourceCard({
  source,
  page,
}: SourceCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#101012] px-3 py-2">
      <div className="flex items-center gap-2">
        <FileText
          size={12}
          className="shrink-0 text-teal-500"
        />

        <p className="truncate text-[10px] font-medium text-zinc-400">
          {source}
        </p>
      </div>

      <p className="mt-1 pl-5 text-[10px] text-zinc-600">
        Page {page}
      </p>
    </div>
  );
}

export default SourceCard;