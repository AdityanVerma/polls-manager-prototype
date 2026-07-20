import type { AIRequest } from "@/types/poll";

interface AIRequestPreviewProps {
  request: AIRequest;
}

export default function AIRequestPreview({ request }: AIRequestPreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-sm font-medium text-zinc-700">
        AI Request Preview
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm text-zinc-800">
        {JSON.stringify(request, null, 2)}
      </pre>
    </div>
  );
}
