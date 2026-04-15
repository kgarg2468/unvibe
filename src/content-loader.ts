import { readFileSync } from "node:fs";

import type { DimensionId, ExperienceLevel, WorkContext } from "./types.js";

type MetaQuestionContent = {
  id: string;
  prompts: Record<ExperienceLevel, string>;
  why: string;
};

type DimensionContent = {
  id: DimensionId;
  displayName: string;
  prompts: Record<ExperienceLevel, string>;
  why: string;
};

type WorkContextContent = {
  defaultQuestionCount: number;
  dimensions: Record<DimensionId, number>;
};

type OnboardingContent = {
  questions: string[];
  seedDefaults: {
    experienceLevel: ExperienceLevel;
    focusAreas: string[];
  };
};

type CalibrationContent = {
  keywords: Record<string, ExperienceLevel>;
  policy: {
    downgrade: string;
    seedSource: string;
  };
};

function loadJson<T>(relativePath: string): T {
  const raw = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  return JSON.parse(raw) as T;
}

export function loadMetaLayer(): MetaQuestionContent[] {
  return loadJson<MetaQuestionContent[]>("../content/meta-layer.json");
}

export function loadDimensions(): DimensionContent[] {
  return loadJson<DimensionContent[]>("../content/dimensions.json");
}

export function loadWorkContexts(): Record<WorkContext, WorkContextContent> {
  return loadJson<Record<WorkContext, WorkContextContent>>("../content/work-contexts.json");
}

export function loadOnboardingContent(): OnboardingContent {
  return loadJson<OnboardingContent>("../content/onboarding.json");
}

export function loadCalibrationContent(): CalibrationContent {
  return loadJson<CalibrationContent>("../content/calibration.json");
}

export function loadTemplate(templateName: "plan" | "research" | "summary"): string {
  return readFileSync(new URL(`../content/templates/${templateName}.md`, import.meta.url), "utf8");
}
