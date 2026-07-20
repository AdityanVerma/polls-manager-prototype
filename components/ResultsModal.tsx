import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import StatusBadge from "@/components/StatusBadge";
import { getAnalytics } from "@/lib/analyticsStorage";
import type { Poll } from "@/types/poll";

interface ResultsModalProps {
  poll: Poll | null;
  onClose: () => void;
}

function formatPollType(poll: Poll): string {
  return poll.pollType === "open" ? "Open Poll" : "Asset Poll";
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

export default function ResultsModal({ poll, onClose }: ResultsModalProps) {
  if (!poll) return null;

  const analytics = getAnalytics(poll.id);

  const optionEntries = analytics
    ? poll.questions.flatMap((question) => {
        const questionResult = analytics.questionResults.find(
          (result) => result.questionId === question.id,
        );
        if (!questionResult) return [];

        return question.options.flatMap((option) => {
          const optionResult = questionResult.optionResults.find(
            (result) => result.optionId === option.id,
          );
          if (!optionResult) return [];

          return [
            {
              optionText: option.text || "Untitled option",
              percentage: optionResult.percentage,
            },
          ];
        });
      })
    : [];

  const mostSelected = optionEntries.length
    ? optionEntries.reduce((best, entry) =>
        entry.percentage > best.percentage ? entry : best,
      )
    : null;

  const leastSelected = optionEntries.length
    ? optionEntries.reduce((worst, entry) =>
        entry.percentage < worst.percentage ? entry : worst,
      )
    : null;

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

      {!analytics ? (
        <div className="mt-6 rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center">
          <p className="text-sm text-zinc-500">
            No analytics yet. Analytics are generated automatically the first
            time this poll is published.
          </p>
        </div>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-zinc-500">
                Total Responses
              </dt>
              <dd className="mt-0.5 text-zinc-800">
                {analytics.totalResponses}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">
                Completion Rate
              </dt>
              <dd className="mt-0.5 text-zinc-800">
                {analytics.completionRate}%
              </dd>
            </div>
          </dl>

          <div className="mt-6 space-y-5">
            {poll.questions.map((question, index) => {
              const questionResult = analytics.questionResults.find(
                (result) => result.questionId === question.id,
              );

              return (
                <div
                  key={question.id}
                  className="rounded-xl border border-zinc-200 p-4"
                >
                  <p className="text-sm font-medium text-zinc-900">
                    Question {index + 1}: {question.text || "Untitled question"}
                  </p>
                  <div className="mt-3 space-y-3">
                    {question.options.map((option) => {
                      const optionResult = questionResult?.optionResults.find(
                        (result) => result.optionId === option.id,
                      );
                      const percentage = optionResult?.percentage ?? 0;
                      const votes = optionResult?.votes ?? 0;

                      return (
                        <div key={option.id}>
                          <div className="flex items-baseline justify-between text-xs text-zinc-600">
                            <span className="font-medium text-zinc-700">
                              {option.text || "Untitled option"}
                            </span>
                            <span>
                              {percentage}% &middot; {votes} votes
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-4">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
              Analytics
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SummaryCard
                label="Total Responses"
                value={String(analytics.totalResponses)}
              />
              <SummaryCard
                label="Average Completion Rate"
                value={`${analytics.completionRate}%`}
              />
              <SummaryCard
                label="Most Selected Option"
                value={
                  mostSelected
                    ? `${mostSelected.optionText} (${mostSelected.percentage}%)`
                    : "—"
                }
              />
              <SummaryCard
                label="Least Selected Option"
                value={
                  leastSelected
                    ? `${leastSelected.optionText} (${leastSelected.percentage}%)`
                    : "—"
                }
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
