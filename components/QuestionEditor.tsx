import type { Question } from "@/types/poll";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onChange: (updated: Question) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuestionEditor({
  question,
  index,
  onChange,
  onDuplicate,
  onDelete,
}: QuestionEditorProps) {
  const handleTextChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleOptionChange = (optionId: string, text: string) => {
    onChange({
      ...question,
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
          Question {index + 1}
        </h3>
      </div>

      <input
        type="text"
        value={question.text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Question text"
        className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
      />

      <div className="mt-4 space-y-2.5">
        {question.options.map((option, optionIndex) => (
          <div key={option.id} className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-xs font-medium text-zinc-500">
              {OPTION_LABELS[optionIndex] ?? optionIndex + 1}
            </span>
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${OPTION_LABELS[optionIndex] ?? optionIndex + 1}`}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          Duplicate Question
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
        >
          Delete Question
        </button>
      </div>
    </div>
  );
}
