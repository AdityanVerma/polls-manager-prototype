import type { Poll } from "@/types/poll";
import type { PollAnalytics, QuestionResult } from "@/types/analytics";

const ANALYTICS_STORAGE_KEY = "ai-poll-generator:analytics";

type AnalyticsByPollId = Record<string, PollAnalytics>;

function getAllAnalytics(): AnalyticsByPollId {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistAllAnalytics(all: AnalyticsByPollId): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(all));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random percentages for `count` options that always sum to exactly 100. */
function randomPercentages(count: number): number[] {
  const weights = Array.from({ length: count }, () => Math.random() + 0.15);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const raw = weights.map((w) => (w / totalWeight) * 100);

  const floored = raw.map(Math.floor);
  const remainder = 100 - floored.reduce((sum, v) => sum + v, 0);

  const orderByFraction = raw
    .map((value, index) => ({ index, fraction: value - floored[index] }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remainder; i++) {
    floored[orderByFraction[i % count].index] += 1;
  }

  return floored;
}

/** Converts percentages into vote counts that sum to exactly `total`. */
function votesFromPercentages(total: number, percentages: number[]): number[] {
  const votes = percentages.map((pct) => Math.round((pct / 100) * total));
  const diff = total - votes.reduce((sum, v) => sum + v, 0);

  if (diff !== 0) {
    const maxIndex = percentages.indexOf(Math.max(...percentages));
    votes[maxIndex] += diff;
  }

  return votes;
}

function generateAnalyticsForPoll(poll: Poll): PollAnalytics {
  const totalResponses = randomInt(120, 500);
  const completionRate = randomInt(70, 100);

  const questionResults: QuestionResult[] = poll.questions.map((question) => {
    const optionCount = question.options.length || 1;
    const percentages = randomPercentages(optionCount);
    const votes = votesFromPercentages(totalResponses, percentages);

    return {
      questionId: question.id,
      optionResults: question.options.map((option, index) => ({
        optionId: option.id,
        votes: votes[index],
        percentage: percentages[index],
      })),
    };
  });

  return {
    pollId: poll.id,
    totalResponses,
    completionRate,
    questionResults,
    generatedAt: new Date().toISOString(),
  };
}

/** Reads existing analytics for a poll, or null if none have been generated yet. */
export function getAnalytics(pollId: string): PollAnalytics | null {
  return getAllAnalytics()[pollId] ?? null;
}

/**
 * Returns the poll's analytics, generating and persisting a realistic random
 * result set the first time it's called for a given poll. Subsequent calls
 * for the same poll id return the same stored data — analytics are never
 * regenerated once created.
 */
export function ensureAnalytics(poll: Poll): PollAnalytics {
  const all = getAllAnalytics();
  const existing = all[poll.id];
  if (existing) return existing;

  const generated = generateAnalyticsForPoll(poll);
  all[poll.id] = generated;
  persistAllAnalytics(all);
  return generated;
}
