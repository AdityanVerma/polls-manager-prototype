import type { Poll } from "@/types/poll";

const POLLS_STORAGE_KEY = "ai-poll-generator:polls";

/** Reads all saved polls from localStorage. Returns [] on the server or on parse failure. */
export function getPolls(): Poll[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(POLLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistPolls(polls: Poll[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
}

/** Inserts a new poll or overwrites the existing one with the same id. */
export function savePoll(poll: Poll): void {
  const polls = getPolls();
  const existingIndex = polls.findIndex((p) => p.id === poll.id);

  if (existingIndex === -1) {
    polls.push(poll);
  } else {
    polls[existingIndex] = poll;
  }

  persistPolls(polls);
}

/** Removes a poll by id. */
export function deletePoll(id: string): void {
  const polls = getPolls().filter((poll) => poll.id !== id);
  persistPolls(polls);
}
