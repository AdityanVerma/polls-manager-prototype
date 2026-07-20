import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import StatusBadge from "@/components/StatusBadge";
import type { Poll } from "@/types/poll";

interface PollPreviewModalProps {
  poll: Poll | null;
  onClose: () => void;
}

function formatDate(value: string | undefined): string {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function formatPollType(poll: Poll): string {
  return poll.pollType === "open" ? "Open Poll" : "Asset Poll";
}

export default function PollPreviewModal({
  poll,
  onClose,
}: PollPreviewModalProps) {
  if (!poll) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={poll.title || "Untitled Poll"}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge color={poll.pollType === "open" ? "sky" : "violet"}>
          {formatPollType(poll)}
        </Badge>
        <StatusBadge status={poll.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-zinc-500">Start Date</dt>
          <dd className="mt-0.5 text-zinc-800">{formatDate(poll.startDate)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-zinc-500">End Date</dt>
          <dd className="mt-0.5 text-zinc-800">{formatDate(poll.endDate)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-sm text-zinc-600">
        {poll.pollType === "open"
          ? "Available to all learners."
          : `Associated asset: ${poll.sourceAssetName ?? "Not set"}`}
      </p>

      <div className="mt-6 space-y-5">
        {poll.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <p className="text-sm font-medium text-zinc-900">
              Question {index + 1}: {question.text || "Untitled question"}
            </p>
            <div className="mt-3 space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700"
                >
                  <input
                    type="radio"
                    disabled
                    className="h-4 w-4 cursor-not-allowed accent-zinc-400"
                  />
                  {option.text || "Untitled option"}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
