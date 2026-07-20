import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterChat } from "@/lib/openrouter";
import type { AIRequest, Asset } from "@/types/poll";

const SYSTEM_PROMPT = `Generate a poll from the provided content.
Return ONLY valid JSON.
Expected response format:
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
Do not return markdown.
Do not wrap JSON inside code blocks.`;

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

function buildUserPrompt(request: AIRequest): string {
  if (request.pollType === "open") {
    const lines = [`Poll type: Open Poll`, `Topic: ${request.topic}`];
    if (request.description) {
      lines.push(`Additional Information: ${request.description}`);
    }
    return lines.join("\n");
  }

  const { asset } = request;
  return [
    `Poll type: Asset Poll`,
    `Asset Title: ${asset.title}`,
    `Asset Type: ${asset.assetType}`,
    `Categories: ${asset.categories.join(", ")}`,
    `Asset Description: ${asset.description}`,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    const pollType = body?.pollType;

    if (pollType !== "open" && pollType !== "asset") {
      return NextResponse.json(
        { error: "pollType must be 'open' or 'asset'." },
        { status: 400 },
      );
    }

    let aiRequest: AIRequest;

    if (pollType === "open") {
      const topic = typeof body?.topic === "string" ? body.topic : "";
      if (!topic.trim()) {
        return NextResponse.json(
          { error: "A topic is required for an Open Poll." },
          { status: 400 },
        );
      }
      const description =
        typeof body?.description === "string" ? body.description : undefined;
      aiRequest = { pollType: "open", topic, description };
    } else {
      if (!isValidAsset(body?.asset)) {
        return NextResponse.json(
          { error: "A valid asset is required for an Asset Poll." },
          { status: 400 },
        );
      }
      aiRequest = { pollType: "asset", asset: body.asset };
    }

    const userPrompt = buildUserPrompt(aiRequest);

    const content = await callOpenRouterChat([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    return NextResponse.json({ result: content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
