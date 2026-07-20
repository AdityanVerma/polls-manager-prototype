"use client";

import type { PollType } from "@/types/poll";

const POLL_TYPES: { value: PollType; label: string; description: string }[] = [
  {
    value: "open",
    label: "Open Poll",
    description: "Generate from a topic and optional description.",
  },
  {
    value: "asset",
    label: "Asset Poll",
    description: "Generate from an existing learning asset.",
  },
];

interface PollTypeSelectorProps {
  value: PollType;
  onChange: (value: PollType) => void;
}

export default function PollTypeSelector({
  value,
  onChange,
}: PollTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {POLL_TYPES.map((type) => {
        const isSelected = type.value === value;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            aria-pressed={isSelected}
            className={`rounded-lg border p-4 text-left transition-all ${
              isSelected
                ? "border-zinc-900 bg-zinc-900/5 shadow-sm"
                : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isSelected ? "text-zinc-900" : "text-zinc-700"
              }`}
            >
              {type.label}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{type.description}</p>
          </button>
        );
      })}
    </div>
  );
}
