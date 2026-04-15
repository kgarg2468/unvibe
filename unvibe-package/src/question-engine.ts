import { detectWorkContext } from "./context-detection.js";
import { loadDimensions, loadMetaLayer, loadWorkContexts } from "./content-loader.js";
import type { PlanningPacket, UserProfile } from "./types.js";

type BuildPlanningPacketInput = {
  brainDump: string;
  profile: UserProfile;
};

export function buildPlanningPacket(input: BuildPlanningPacketInput): PlanningPacket {
  const context = detectWorkContext(input.brainDump);
  const metaQuestions = loadMetaLayer().map((question) => ({
    id: question.id,
    prompt: question.prompts[input.profile.experienceLevel],
    why: question.why
  }));

  const workContext = loadWorkContexts()[context];
  const dimensions = loadDimensions()
    .map((dimension) => ({
      ...dimension,
      weight: workContext.dimensions[dimension.id]
    }))
    .sort((left, right) => right.weight - left.weight)
    .slice(0, workContext.defaultQuestionCount)
    .map((dimension) => ({
      id: dimension.id,
      dimensionId: dimension.id,
      prompt: dimension.prompts[input.profile.experienceLevel],
      why: dimension.why
    }));

  return {
    context,
    metaQuestions,
    dimensionQuestions: dimensions,
    recommendedFocus: dimensions.slice(0, 3).map((dimension) => dimension.dimensionId ?? dimension.id)
  };
}
