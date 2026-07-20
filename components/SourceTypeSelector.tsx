"use client";

import type { SourceType } from "@/types/poll";

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: "course", label: "Course" },
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
  { value: "topic", label: "Topic" },
];

interface SourceTypeSelectorProps {
  value: SourceType;
  onChange: (value: SourceType) => void;
}

export default function SourceTypeSelector({
  value,
  onChange,
}: SourceTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SOURCE_TYPES.map((source) => {
        const isSelected = source.value === value;
        return (
          <button
            key={source.value}
            type="button"
            onClick={() => onChange(source.value)}
            aria-pressed={isSelected}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
            }`}
          >
            {source.label}
          </button>
        );
      })}
    </div>
  );
}
