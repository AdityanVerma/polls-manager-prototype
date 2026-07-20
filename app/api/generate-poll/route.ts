import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterChat } from "@/lib/openrouter";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceType, input } = body ?? {};

    if (!sourceType || !input) {
      return NextResponse.json(
        { error: "Both sourceType and input are required." },
        { status: 400 },
      );
    }

    const userPrompt = `Source type: ${sourceType}\nContent: ${input}`;

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
