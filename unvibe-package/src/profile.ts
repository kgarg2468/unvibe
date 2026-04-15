import { loadCalibrationContent, loadOnboardingContent } from "./content-loader.js";
import type { ExperienceLevel, UserProfile } from "./types.js";

type OnboardingSignals = {
  shipped: string[];
  wantsToLearn: string[];
};

function calibrationKeywords(): Record<string, { concept: string; level: ExperienceLevel }> {
  const keywords = loadCalibrationContent().keywords;

  return Object.fromEntries(
    Object.entries(keywords).map(([keyword, level]) => [
      keyword,
      { concept: keyword.replaceAll(" ", "_"), level }
    ])
  );
}

function levelScore(level: ExperienceLevel): number {
  if (level === "advanced") {
    return 3;
  }

  if (level === "intermediate") {
    return 2;
  }

  return 1;
}

function scoreToLevel(score: number): ExperienceLevel {
  if (score >= 3) {
    return "advanced";
  }

  if (score >= 2) {
    return "intermediate";
  }

  return "beginner";
}

export function inferExperienceLevel(signals: OnboardingSignals): ExperienceLevel {
  if (signals.shipped.includes("production app at work")) {
    return "advanced";
  }

  if (signals.shipped.includes("personal website") || signals.shipped.includes("side project")) {
    return "intermediate";
  }

  return "beginner";
}

export function createDefaultProfile(partial: Partial<UserProfile> = {}): UserProfile {
  const onboarding = loadOnboardingContent();

  return {
    conceptsDemonstrated: {},
    conceptsSeen: {},
    experienceLevel: onboarding.seedDefaults.experienceLevel,
    focusAreas: onboarding.seedDefaults.focusAreas,
    languages: [],
    seedSource: "onboarding",
    ...partial
  };
}

export function updateProfileFromAnswer(profile: UserProfile, answer: string): UserProfile {
  const next: UserProfile = {
    ...profile,
    conceptsDemonstrated: { ...(profile.conceptsDemonstrated ?? {}) },
    conceptsSeen: { ...(profile.conceptsSeen ?? {}) },
    lastUpdated: new Date().toISOString()
  };

  const normalized = answer.toLowerCase();
  let strongestLevel = levelScore(next.experienceLevel);

  for (const [keyword, descriptor] of Object.entries(calibrationKeywords())) {
    if (!normalized.includes(keyword)) {
      continue;
    }

    next.conceptsSeen![descriptor.concept] = (next.conceptsSeen![descriptor.concept] ?? 0) + 1;

    const existing = next.conceptsDemonstrated![descriptor.concept] ?? "beginner";
    const upgraded =
      levelScore(descriptor.level) > levelScore(existing) ? descriptor.level : existing;

    next.conceptsDemonstrated![descriptor.concept] = upgraded;
    strongestLevel = Math.max(strongestLevel, levelScore(upgraded));
  }

  next.experienceLevel = scoreToLevel(strongestLevel);

  return next;
}
