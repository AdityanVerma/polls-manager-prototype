/**
 * Minimal OpenRouter client for the AI Poll Generator prototype.
 * Kept in one place so the model can be swapped easily later.
 */

/** Change this to try a different model — used by the /api/generate-poll route. */
export const OPENROUTER_MODEL = "openai/gpt-oss-120b";

const OPENROUTER_CHAT_COMPLETIONS_URL =
  "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterChatCompletionResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

/**
 * Sends a chat completion request to OpenRouter and returns the raw text
 * content of the first choice. Throws if the request fails or the API
 * key is missing.
 */
export async function callOpenRouterChat(
  messages: OpenRouterChatMessage[],
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set.");
  }

  const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter request failed (${response.status}): ${errorText}`,
    );
  }

  const data: OpenRouterChatCompletionResponse = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter response did not contain any content.");
  }

  return content;
}
