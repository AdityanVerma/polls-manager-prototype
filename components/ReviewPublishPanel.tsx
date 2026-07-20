import type { Poll, PollType } from "@/types/poll";

interface ReviewPublishPanelProps {
  poll: Poll;
  onChange: (poll: Poll) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onUpdate: () => void;
  isEditMode: boolean;
}

export default function ReviewPublishPanel({
  poll,
  onChange,
  onSaveDraft,
  onPublish,
  onUpdate,
  isEditMode,
}: ReviewPublishPanelProps) {
  const pollType: PollType = poll.pollType ?? "asset";
  const showAssetField = pollType === "asset" && poll.sourceType !== "topic";

  const updatePollType = (value: PollType) => {
    onChange({ ...poll, pollType: value });
  };

  const updateStartDate = (value: string) => {
    onChange({ ...poll, startDate: value });
  };

  const updateEndDate = (value: string) => {
    onChange({ ...poll, endDate: value });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
        Review &amp; Publish
      </h2>

      <div className="mt-4">
        <span className="mb-2 block text-sm font-medium text-zinc-700">
          Poll Type
        </span>
        <div className="flex flex-wrap gap-3">
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
              pollType === "open"
                ? "border-zinc-900 bg-zinc-900/5 font-medium text-zinc-900"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <input
              type="radio"
              name="pollType"
              value="open"
              checked={pollType === "open"}
              onChange={() => updatePollType("open")}
              className="h-4 w-4 accent-zinc-900"
            />
            Open Poll
          </label>
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
              pollType === "asset"
                ? "border-zinc-900 bg-zinc-900/5 font-medium text-zinc-900"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <input
              type="radio"
              name="pollType"
              value="asset"
              checked={pollType === "asset"}
              onChange={() => updatePollType("asset")}
              className="h-4 w-4 accent-zinc-900"
            />
            Asset Poll
          </label>
        </div>
      </div>

      {showAssetField && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Asset
          </label>
          <input
            type="text"
            value={poll.sourceAssetName ?? ""}
            readOnly
            className="w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-700"
          />
        </div>
      )}

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-zinc-700">
          Schedule
        </span>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Start Date
            </label>
            <input
              type="date"
              value={poll.startDate ?? ""}
              onChange={(e) => updateStartDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              End Date
            </label>
            <input
              type="date"
              value={poll.endDate ?? ""}
              onChange={(e) => updateEndDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-100 pt-5">
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={isEditMode ? onUpdate : onPublish}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
        >
          {isEditMode ? "Update Poll" : "Publish Poll"}
        </button>
      </div>
    </div>
  );
}
