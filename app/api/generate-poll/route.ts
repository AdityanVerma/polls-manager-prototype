import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterChat } from "@/lib/openrouter";
import type { AIRequest, Asset, GenerationSettings } from "@/types/poll";
import {
  buildPollGenerationPrompt,
  buildQuestionGenerationPrompt,
} from "@/lib/promptBuilders";

const ASSET_TYPES = [
  "PDF",
  "MP3",
  "MP4",
  "JPG",
  "JPEG",
  "PNG",
  "HTML",
  "LINK",
] as const;

function isAssetType(value: unknown): value is Asset["assetType"] {
  return ASSET_TYPES.some((assetType) => assetType === value);
}

function isValidGenerationSettings(
  value: unknown,
): value is GenerationSettings {
  if (!value || typeof value !== "object") return false;

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.topic === "string" &&
    typeof settings.instructions === "string" &&
    typeof settings.questionCount === "number" &&
    Number.isInteger(settings.questionCount) &&
    settings.questionCount >= 1 &&
    settings.questionCount <= 10 &&
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
    isAssetType(asset.assetType) &&
    Array.isArray(asset.categories) &&
    asset.categories.every((category) => typeof category === "string") &&
    typeof asset.description === "string"
  );
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
      const prompt = buildPollGenerationPrompt(aiRequest);

      content = await callOpenRouterChat([
        {
          role: "user",
          content: prompt,
        },
      ]);
    } else {
      const existingQuestions = Array.isArray(body?.existingQuestions)
        ? body.existingQuestions
        : [];

      const prompt = buildQuestionGenerationPrompt({
        ...aiRequest,
        existingQuestions,
      });

      content = await callOpenRouterChat([
        {
          role: "user",
          content: prompt,
        },
      ]);
    }

    return NextResponse.json({ result: content });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
