import { generateId } from "@/lib/id";
import type { Poll, Question } from "@/types/poll";
import QuestionEditor from "@/components/QuestionEditor";

interface PollEditorProps {
  poll: Poll;
  onChange: (poll: Poll) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export default function PollEditor({
  poll,
  onChange,
  onRegenerate,
  isRegenerating,
}: PollEditorProps) {
  const updateTitle = (title: string) => {
    onChange({ ...poll, title });
  };

  const updateQuestion = (index: number, updated: Question) => {
    const questions = [...poll.questions];
    questions[index] = updated;
    onChange({ ...poll, questions });
  };

  const duplicateQuestion = (index: number) => {
    const original = poll.questions[index];
    const duplicated: Question = {
      ...original,
      id: generateId(),
      options: original.options.map((option) => ({
        ...option,
        id: generateId(),
      })),
    };
    const questions = [...poll.questions];
    questions.splice(index + 1, 0, duplicated);
    onChange({ ...poll, questions });
  };

  const deleteQuestion = (index: number) => {
    const questions = poll.questions.filter((_, i) => i !== index);
    onChange({ ...poll, questions });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Poll Title
        </label>
        <input
          type="text"
          value={poll.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base font-medium text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        {poll.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            onChange={(updated) => updateQuestion(index, updated)}
            onDuplicate={() => duplicateQuestion(index)}
            onDelete={() => deleteQuestion(index)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
        >
          {isRegenerating ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Regenerating...
            </span>
          ) : (
            "Regenerate with AI"
          )}
        </button>
      </div>
    </div>
  );
}
