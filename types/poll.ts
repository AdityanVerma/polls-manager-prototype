/**
 * Shared domain types for the AI Poll Generator prototype.
 *
 * These model the core workflow: the user picks a poll type (Open or
 * Asset) and its source input, the AI generates a Poll made up of
 * Questions, each with a set of Options. Everything lives in local
 * state / localStorage — no backend persistence.
 */

/** How the poll is targeted: open to anyone, or tied to a specific asset.
 * This is also the choice that drives what the AI generates from. */
export type PollType = "open" | "asset";

/** File/content types supported by the mock asset library. */
export type AssetType =
  "PDF" | "MP3" | "MP4" | "JPG" | "JPEG" | "PNG" | "HTML" | "LINK";

/** A piece of learning content that an Asset Poll can be generated from. */
export interface Asset {
  id: string;
  title: string;
  assetType: AssetType;
  categories: string[];
  description: string;
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

export type QuestionType = "mcq" | "msq" | "both";

export interface GenerationSettings {
  topic: string;
  instructions: string;
  questionCount: number;
  questionType: QuestionType;
  isCompulsory: boolean;
}

export type PollStatus = "draft" | "published";

/**
 * The request payload sent to the AI to generate a poll. Shape depends on
 * the chosen poll type: an Open Poll is generated from a topic (+ optional
 * description); an Asset Poll is generated from an existing asset's metadata.
 */
export type AIRequest =
  | {
      pollType: "open";
      settings: GenerationSettings;
    }
  | {
      pollType: "asset";
      asset: Asset;
      settings: GenerationSettings;
    };

export interface Poll {
  id: string;
  title: string;
  questions: Question[];
  status: PollStatus;
  createdAt: string;
  /** The poll type used to generate this poll (Open or Asset). */
  sourceType?: PollType;
  /** Topic used to generate this poll. */
  sourceTopic?: string;
  /** Additional instructions provided to the AI. */
  sourceDescription?: string;
  /** The full asset this poll was generated from (Asset Poll only). */
  sourceAsset?: Asset;
  /** Convenience copy of the asset's title, for display (Asset Poll only). */
  sourceAssetName?: string;
  /** Whether the poll is Open or tied to an Asset, set on the Review & Publish step. */
  pollType?: PollType;
  startDate?: string;
  endDate?: string;
  generationSettings?: GenerationSettings;
}
