export type WorkContext =
  | "greenfield"
  | "new_feature"
  | "dependency_swap"
  | "refactor"
  | "migration"
  | "bug_fix";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type DimensionId =
  | "problem_framing"
  | "current_state_contracts"
  | "failure_modes"
  | "change_strategy"
  | "verification_learning";

export type UserProfile = {
  conceptsDemonstrated?: Record<string, ExperienceLevel>;
  conceptsSeen?: Record<string, number>;
  experienceLevel: ExperienceLevel;
  languages: string[];
  focusAreas: string[];
  lastUpdated?: string;
  seedSource?: "github" | "onboarding" | "passive";
};

export type Question = {
  dimensionId?: DimensionId;
  id: string;
  prompt: string;
  why: string;
};

export type PlanningPacket = {
  context: WorkContext;
  dimensionQuestions: Question[];
  metaQuestions: Question[];
  recommendedFocus: string[];
};
