/**
 * Shared domain types for the AI Poll Generator prototype.
 *
 * These model the core workflow: an Asset (topic or learning content) is
 * given to the AI, which generates a Poll made up of Questions, each with
 * a set of Options. Everything lives in local state — no persistence layer.
 */

/**
 * The source material used to generate a poll: either a free-typed topic
 * or a block of learning content (e.g. pasted text from a lesson).
 */
export interface Asset {
  id: string;
  type: "topic" | "content";
  /** Raw text — either the topic prompt or the learning content body. */
  text: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export type PollStatus = "draft" | "published";

/** Where the AI should draw poll content from, chosen on the Generate page. */
export type SourceType = "course" | "pdf" | "video" | "topic";

/**
 * The request payload built from the user's source selection, sent to the
 * AI to generate a poll. `input` is either the selected asset name
 * (Course/PDF/Video) or the free-typed topic text.
 */
export interface AIRequest {
  sourceType: SourceType;
  input: string;
}

/** How the poll is targeted: open to anyone, or tied to a specific asset. */
export type PollType = "open" | "asset";

export interface Poll {
  id: string;
  title: string;
  questions: Question[];
  status: PollStatus;
  createdAt: string;
  /** The source type used to generate this poll, if any. */
  sourceType?: SourceType;
  /** The selected asset name this poll was generated from (Course/PDF/Video only). */
  sourceAssetName?: string;
  /** The original topic text this poll was generated from (Topic source only). */
  sourceTopicText?: string;
  /** Whether the poll is Open or tied to an Asset, set on the Review & Publish step. */
  pollType?: PollType;
  startDate?: string;
  endDate?: string;
}
