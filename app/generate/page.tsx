"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PollTypeSelector from "@/components/PollTypeSelector";
import AssetSelector from "@/components/AssetSelector";
import AIRequestPreview from "@/components/AIRequestPreview";
import PollEditor from "@/components/PollEditor";
import PollSkeleton from "@/components/PollSkeleton";
import ReviewPublishPanel from "@/components/ReviewPublishPanel";
import Badge from "@/components/Badge";
import { useToast } from "@/components/ToastProvider";
import QuestionGenerationSettings, {
  type GenerationSettings,
} from "@/components/QuestionGenerationSettings";

import { MOCK_ASSETS } from "@/data/assets";

import { parsePollResponse } from "@/lib/parsePollResponse";
import { getPolls, savePoll } from "@/lib/pollStorage";
import { ensureAnalytics } from "@/lib/analyticsStorage";

import type { AIRequest, Asset, Poll, PollType } from "@/types/poll";

function GenerateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const pollId = searchParams.get("pollId");
  const isEditMode = Boolean(pollId);

  const [pollType, setPollType] = useState<PollType>("open");
  const [generationSettings, setGenerationSettings] =
    useState<GenerationSettings>({
      topic: "",
      instructions: "",
      questionCount: 5,
      questionType: "both",
      isCompulsory: false,
    });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [aiRequest, setAiRequest] = useState<AIRequest | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the existing poll when arriving via /generate?pollId=<id>.
  // Fields are populated directly from localStorage — the AI is not called.
  useEffect(() => {
    if (!pollId) return;

    const existingPoll = getPolls().find((p) => p.id === pollId);
    if (!existingPoll) return;

    setPoll(existingPoll);
    const loadedPollType = existingPoll.sourceType ?? "open";
    setPollType(loadedPollType);

    if (loadedPollType === "open") {
      setGenerationSettings((prev) => ({
        ...prev,
        topic: existingPoll.sourceTopic ?? "",
        instructions: existingPoll.sourceDescription ?? "",
      }));
    } else if (existingPoll.sourceAsset) {
      setSelectedAsset(existingPoll.sourceAsset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  const isOpenPoll = pollType === "open";
  const isValid = isOpenPoll
    ? generationSettings.topic.trim().length > 0
    : selectedAsset !== null && generationSettings.topic.trim().length > 0;

  const handleGenerate = async () => {
    if (!isValid) return;

    const request: AIRequest = isOpenPoll
      ? {
          pollType: "open",
          settings: generationSettings,
        }
      : {
          pollType: "asset",
          asset: selectedAsset!,
          settings: generationSettings,
        };

    console.log(request);
    setAiRequest(request);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generatePoll",
          ...request,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to generate poll.");
      }

      const parsedPoll = parsePollResponse(data.result);
      const enrichedPoll: Poll = {
        ...parsedPoll,
        // Preserve identity and metadata across a regenerate so an edit
        // never turns into a duplicate poll in storage.
        id: poll?.id ?? parsedPoll.id,
        status: poll?.status ?? "draft",
        pollType: poll?.pollType ?? pollType,
        startDate: poll?.startDate,
        endDate: poll?.endDate,
        sourceType: pollType,
        sourceTopic: generationSettings.topic.trim(),
        sourceDescription: generationSettings.instructions.trim() || undefined,
        sourceAsset: isOpenPoll ? undefined : (selectedAsset ?? undefined),
        sourceAssetName: isOpenPoll ? undefined : selectedAsset?.title,
        generationSettings,
      };
      setPoll(enrichedPoll);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestion = async () => {
    if (!poll) return;

    setIsGeneratingQuestion(true);

    try {
      // API call will be added in the next step.
      console.log("Generate another question...");
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSaveDraft = () => {
    if (!poll) return;
    const draftPoll: Poll = { ...poll, status: "draft" };
    savePoll(draftPoll);
    setPoll(draftPoll);
    showToast("Poll saved as draft.", "success");
  };

  const handlePublish = () => {
    if (!poll) return;
    const publishedPoll: Poll = { ...poll, status: "published" };
    savePoll(publishedPoll);
    ensureAnalytics(publishedPoll);
    setPoll(publishedPoll);
    showToast("Poll published successfully.", "success");
    setTimeout(() => {
      router.push("/polls");
    }, 1000);
  };

  const handleUpdate = () => {
    if (!poll) return;
    savePoll(poll);
    if (poll.status === "published") {
      ensureAnalytics(poll);
    }
    showToast("Poll updated successfully.", "success");
    setTimeout(() => {
      router.push("/polls");
    }, 1000);
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      {isEditMode && (
        <div className="mb-4">
          <Badge color="amber">Editing Existing Poll</Badge>
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        Generate Poll with AI
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        What type of poll do you want to create?
      </p>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <PollTypeSelector value={pollType} onChange={setPollType} />

        <div className="mt-5">
          {isOpenPoll ? (
            <QuestionGenerationSettings
              pollType={pollType}
              settings={generationSettings}
              onChange={setGenerationSettings}
            />
          ) : (
            <div className="space-y-6">
              <AssetSelector
                assets={MOCK_ASSETS}
                selectedAssetId={selectedAsset?.id ?? null}
                onSelect={setSelectedAsset}
              />

              <QuestionGenerationSettings
                pollType={pollType}
                settings={generationSettings}
                onChange={setGenerationSettings}
              />
            </div>
          )}
        </div>

        {!poll && (
          <div className="mt-5">
            <button
              type="button"
              disabled={!isValid || isLoading}
              onClick={handleGenerate}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none sm:w-auto"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </span>
              ) : (
                "Generate with AI"
              )}
            </button>
          </div>
        )}
      </section>

      {aiRequest && !poll && (
        <section className="mt-6">
          <AIRequestPreview request={aiRequest} />
        </section>
      )}

      {error && (
        <section className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </section>
      )}

      {isLoading && !poll && (
        <section className="mt-8">
          <PollSkeleton />
        </section>
      )}

      {poll && (
        <>
          <section className="mt-8">
            <PollEditor
              poll={poll}
              onChange={setPoll}
              onRegenerate={handleGenerate}
              onGenerateQuestion={handleGenerateQuestion}
              isRegenerating={isLoading}
              isGeneratingQuestion={isGeneratingQuestion}
            />
          </section>

          <section className="mt-8">
            <ReviewPublishPanel
              poll={poll}
              onChange={setPoll}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onUpdate={handleUpdate}
              isEditMode={isEditMode}
            />
          </section>
        </>
      )}
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-sm text-zinc-500">
          Loading...
        </main>
      }
    >
      <GenerateForm />
    </Suspense>
  );
}
