import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterChat } from "@/lib/openrouter";
import type { AIRequest, Asset, GenerationSettings } from "@/types/poll";

const SYSTEM_PROMPT = `
You are an expert instructional designer.

Generate a high-quality learning poll.

Return ONLY valid JSON.

Rules:
- Generate EXACTLY the requested number of questions.
- Never generate more or fewer.
- Every question must contain exactly four unique options.
- Avoid duplicate questions.
- Avoid duplicate options within a question.
- Keep options similar in length.
- Return valid JSON only.

Expected format:

{
  "title": "string",
  "questions": [
    {
      "id": "1",
      "question": "string",
      "options": [
        "option 1",
        "option 2",
        "option 3",
        "option 4"
      ]
    }
  ]
}
`;

const QUESTION_SYSTEM_PROMPT = `You are given an existing poll.

Generate exactly ONE new multiple-choice question.

Rules:
- The question must fit naturally with the existing poll.
- Do NOT repeat or closely resemble existing questions.
- Return ONLY valid JSON.

Expected format:

{
  "question": "string",
  "options": [
    "option 1",
    "option 2",
    "option 3",
    "option 4"
  ]
}

Do not return markdown.
Do not wrap JSON in code fences.`;

function isValidGenerationSettings(
  value: unknown,
): value is GenerationSettings {
  if (!value || typeof value !== "object") return false;

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.topic === "string" &&
    typeof settings.instructions === "string" &&
    typeof settings.questionCount === "number" &&
    ["mcq", "msq", "both"].includes(settings.questionType as string) &&
    typeof settings.isCompulsory === "boolean"
  );
}

type GenerationMode = "generatePoll" | "generateQuestion";

function isValidAsset(value: unknown): value is Asset {
  if (!value || typeof value !== "object") return false;
  const asset = value as Record<string, unknown>;
  return (
    typeof asset.id === "string" &&
    typeof asset.title === "string" &&
    typeof asset.assetType === "string" &&
    Array.isArray(asset.categories) &&
    typeof asset.description === "string"
  );
}

function getQuestionTypeLabel(
  questionType: GenerationSettings["questionType"],
) {
  switch (questionType) {
    case "mcq":
      return "Multiple Choice Questions (MCQ)";
    case "msq":
      return "Multiple Select Questions (MSQ)";
    default:
      return "A balanced mix of MCQ and MSQ";
  }
}

function buildUserPrompt(request: AIRequest): string {
  const { topic, instructions, questionCount, questionType } = request.settings;

  const questionTypeLabel = getQuestionTypeLabel(questionType);

  if (request.pollType === "open") {
    return `
Poll Type: Open Poll

Topic:
${topic}

Additional Instructions:
${instructions || "None"}

Question Configuration
- Generate exactly ${questionCount} questions.
- Question Type: ${questionTypeLabel}

Requirements
- Each question must have exactly 4 options.
- Questions should be clear, concise and non-repetitive.
- Base the questions on the topic and additional instructions.
`;
  }

  const { asset } = request;

  return `
Poll Type: Asset Poll

Asset Information
- Title: ${asset.title}
- Type: ${asset.assetType}
- Categories: ${asset.categories.join(", ")}
- Description: ${asset.description}

Generation Topic
${topic}

Additional Instructions
${instructions || "None"}

Question Configuration
- Generate exactly ${questionCount} questions.
- Question Type: ${questionTypeLabel}

Requirements
- Use the asset as the primary knowledge source.
- Use the topic and instructions to guide the focus.
- Each question must have exactly 4 options.
- Questions should be clear, concise and non-repetitive.
`;
}

function buildGenerateQuestionPrompt(
  request: AIRequest,
  existingQuestions: string[],
) {
  const source =
    request.pollType === "open"
      ? `
Topic: ${request.settings.topic}

Instructions:
${request.settings.instructions || "None"}
`
      : `
Asset Title:
${request.asset.title}

Categories:
${request.asset.categories.join(", ")}

Description:
${request.asset.description}

Topic:
${request.settings.topic}

Instructions:
${request.settings.instructions || "None"}
`;

  return `
${source}

Existing Questions:

${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Generate ONE additional question only.
`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    const mode: GenerationMode =
      body?.mode === "generateQuestion" ? "generateQuestion" : "generatePoll";

    const pollType = body?.pollType;

    if (pollType !== "open" && pollType !== "asset") {
      return NextResponse.json(
        { error: "pollType must be 'open' or 'asset' type." },
        { status: 400 },
      );
    }

    let aiRequest: AIRequest;

    if (!isValidGenerationSettings(body?.settings)) {
      return NextResponse.json(
        { error: "Invalid generation settings." },
        { status: 400 },
      );
    }

    if (pollType === "open") {
      if (!body.settings.topic.trim()) {
        return NextResponse.json(
          { error: "Topic is required." },
          { status: 400 },
        );
      }

      aiRequest = {
        pollType: "open",
        settings: body.settings,
      };
    } else {
      if (!isValidAsset(body?.asset)) {
        return NextResponse.json(
          { error: "A valid asset is required." },
          { status: 400 },
        );
      }

      aiRequest = {
        pollType: "asset",
        asset: body.asset,
        settings: body.settings,
      };
    }

    let content: string;

    if (mode === "generatePoll") {
      const userPrompt = buildUserPrompt(aiRequest);

      content = await callOpenRouterChat([
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);
    } else {
      const existingQuestions = Array.isArray(body?.existingQuestions)
        ? body.existingQuestions.filter(
            (q): q is string => typeof q === "string",
          )
        : [];

      const userPrompt = buildGenerateQuestionPrompt(
        aiRequest,
        existingQuestions,
      );

      content = await callOpenRouterChat([
        {
          role: "system",
          content: QUESTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);
    }

    return NextResponse.json({ result: content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
