export interface OptionResult {
  optionId: string;
  votes: number;
  /** Whole-number percentage; all option percentages within a question sum to 100. */
  percentage: number;
}

export interface QuestionResult {
  questionId: string;
  optionResults: OptionResult[];
}

export interface PollAnalytics {
  pollId: string;
  totalResponses: number;
  /** Whole-number percentage of respondents who completed the entire poll. */
  completionRate: number;
  questionResults: QuestionResult[];
  generatedAt: string;
}
