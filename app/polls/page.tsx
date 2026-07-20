"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deletePoll, getPolls } from "@/lib/pollStorage";
import StatusBadge from "@/components/StatusBadge";
import Badge from "@/components/Badge";
import PollPreviewModal from "@/components/PollPreviewModal";
import ResultsModal from "@/components/ResultsModal";
import { useToast } from "@/components/ToastProvider";
import type { Poll } from "@/types/poll";

function formatSource(poll: Poll): string {
  if (!poll.sourceType) return "—";

  if (poll.sourceType === "open") {
    return poll.sourceTopic ? `Topic: ${poll.sourceTopic}` : "Topic";
  }

  return poll.sourceAssetName ? `Asset: ${poll.sourceAssetName}` : "Asset";
}

function formatPollType(poll: Poll): string {
  if (poll.pollType === "open") return "Open Poll";
  if (poll.pollType === "asset") return "Asset Poll";
  return "—";
}

function formatCreatedOn(createdAt: string): string {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function ActionButtons({
  poll,
  onPreview,
  onResults,
  onDelete,
}: {
  poll: Poll;
  onPreview: () => void;
  onResults: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onPreview}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
      >
        Preview
      </button>
      <Link
        href={`/generate?pollId=${poll.id}`}
        className="flex items-center rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={onResults}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
      >
        Results
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}

export default function PollsPage() {
  const { showToast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [previewPoll, setPreviewPoll] = useState<Poll | null>(null);
  const [resultsPoll, setResultsPoll] = useState<Poll | null>(null);

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  const handleDelete = (poll: Poll) => {
    const confirmed = window.confirm(
      `Delete "${poll.title || "Untitled Poll"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    deletePoll(poll.id);
    setPolls(getPolls());
    showToast("Poll deleted.", "success");
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Poll Manager
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {polls.length > 0
              ? `${polls.length} poll${polls.length === 1 ? "" : "s"} total`
              : "Manage every poll you've generated."}
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
        >
          Generate New Poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18" />
              <path d="M7 14h4" />
              <path d="M7 17h7" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-700">
            No polls have been created yet.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Generate your first poll to see it listed here.
          </p>
          <Link
            href="/generate"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
          >
            Generate New Poll
          </Link>
        </div>
      ) : (
        <>
          {/* Table view — sm and up */}
          <div className="mt-8 hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Poll Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Poll Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Questions
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Created On
                    </th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap text-zinc-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {polls.map((poll) => (
                    <tr
                      key={poll.id}
                      className="transition-colors hover:bg-zinc-50"
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-zinc-900">
                        {poll.title || "Untitled Poll"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                        {formatSource(poll)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          color={poll.pollType === "open" ? "sky" : "violet"}
                        >
                          {formatPollType(poll)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={poll.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                        {poll.questions.length}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                        {formatCreatedOn(poll.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          poll={poll}
                          onPreview={() => setPreviewPoll(poll)}
                          onResults={() => setResultsPoll(poll)}
                          onDelete={() => handleDelete(poll)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card view — below sm */}
          <div className="mt-8 space-y-3 sm:hidden">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-zinc-900">
                    {poll.title || "Untitled Poll"}
                  </p>
                  <StatusBadge status={poll.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge color={poll.pollType === "open" ? "sky" : "violet"}>
                    {formatPollType(poll)}
                  </Badge>
                  <span className="text-xs text-zinc-500">
                    {poll.questions.length} question
                    {poll.questions.length === 1 ? "" : "s"}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-zinc-500">
                  <dt>Source</dt>
                  <dd className="text-right text-zinc-700">
                    {formatSource(poll)}
                  </dd>
                  <dt>Created On</dt>
                  <dd className="text-right text-zinc-700">
                    {formatCreatedOn(poll.createdAt)}
                  </dd>
                </dl>

                <div className="mt-4 border-t border-zinc-100 pt-3">
                  <ActionButtons
                    poll={poll}
                    onPreview={() => setPreviewPoll(poll)}
                    onResults={() => setResultsPoll(poll)}
                    onDelete={() => handleDelete(poll)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <PollPreviewModal
        poll={previewPoll}
        onClose={() => setPreviewPoll(null)}
      />

      <ResultsModal poll={resultsPoll} onClose={() => setResultsPoll(null)} />
    </main>
  );
}
