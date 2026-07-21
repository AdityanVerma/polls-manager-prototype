"use client";

import type { GenerationSettings, QuestionType, PollType } from "@/types/poll";

interface QuestionGenerationSettingsProps {
  pollType: PollType;
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
}

export default function QuestionGenerationSettings({
  pollType,
  settings,
  onChange,
}: QuestionGenerationSettingsProps) {
  const update = <K extends keyof GenerationSettings>(
    key: K,
    value: GenerationSettings[K],
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Topic */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Topic <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={settings.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder="e.g. Leadership Skills"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
        />
      </div>

      {/* Instructions */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Additional Instructions{" "}
          <span className="font-normal text-zinc-400">(Optional)</span>
        </label>

        <textarea
          rows={4}
          value={settings.instructions}
          onChange={(e) => update("instructions", e.target.value)}
          placeholder="Guide the AI. Example: Focus on scenario-based questions suitable for beginners."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
        />
      </div>

      {/* Configuration */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Question Configuration
        </h3>

        {/* Question Count */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700">
              Number of Questions
            </label>

            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
              {settings.questionCount}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={settings.questionCount}
            onChange={(e) => update("questionCount", Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Question Type */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Question Type
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["mcq", "MCQ"],
              ["msq", "MSQ"],
              ["both", "Both"],
            ].map(([value, label]) => {
              const selected = settings.questionType === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("questionType", value as QuestionType)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white hover:bg-zinc-50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandatory */}
        {pollType === "open" && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3">
            <div>
              <p className="text-sm font-medium text-zinc-800">
                Mandatory Poll
              </p>

              <p className="text-xs text-zinc-500">
                Learners must answer this poll.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.isCompulsory}
              onChange={(e) => update("isCompulsory", e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
