import { generateId } from "@/lib/id";
import type { Poll } from "@/types/poll";

interface RawAIQuestion {
  id?: string;
  question: string;
  options: string[];
}

interface RawAIPollResponse {
  title: string;
  questions: RawAIQuestion[];
}

/**
 * Converts the raw JSON text returned by the AI into a Poll object that
 * can be edited in local state. Throws if the text isn't valid JSON or
 * doesn't match the expected shape.
 */
export function parsePollResponse(raw: string): Poll {
  let parsed: RawAIPollResponse;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  if (
    !parsed ||
    typeof parsed.title !== "string" ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error("AI response was not in the expected poll format.");
  }

  return {
    id: generateId(),
    title: parsed.title,
    status: "draft",
    createdAt: new Date().toISOString(),
    questions: parsed.questions.map((question) => ({
      id: question.id ?? generateId(),
      text: question.question ?? "",
      options: (question.options ?? []).map((optionText) => ({
        id: generateId(),
        text: optionText,
      })),
    })),
  };
}
