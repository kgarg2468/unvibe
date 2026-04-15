import { loadTemplate } from "./content-loader.js";

type PlanArtifactInput = {
  brainDump: string;
  context: string;
  decisions: Array<{ answer: string; question: string }>;
  recommendedFocus: string[];
  researchArtifacts: string[];
};

type SessionSummaryInput = {
  demonstratedConcepts: string[];
  recentDecisions: string[];
  weakAreas: string[];
};

function renderList(items: string[], fallback: string): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : `- ${fallback}`;
}

function renderTemplate(templateName: "plan" | "summary", replacements: Record<string, string>): string {
  let template = loadTemplate(templateName);

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(`{{${key}}}`, value);
  }

  return `${template.trimEnd()}\n`;
}

export function renderPlanArtifact(input: PlanArtifactInput): string {
  const decisions = input.decisions.length
    ? input.decisions.map((decision) => `- ${decision.question}\n  ${decision.answer}`).join("\n")
    : "- No decisions recorded yet.";

  return renderTemplate("plan", {
    context: input.context,
    decisions,
    focus: renderList(input.recommendedFocus, "None yet"),
    research: renderList(input.researchArtifacts, "No research artifacts recorded yet."),
    task: input.brainDump
  }).concat(
    "\n## Execution Shape\n- Confirm the smallest useful slice before coding.\n- Protect existing contracts and failure modes first.\n- Keep rollout reversible and verify the fastest trustworthy signal.\n"
  );
}

export function renderSessionSummary(input: SessionSummaryInput): string {
  return renderTemplate("summary", {
    decisions: renderList(input.recentDecisions, "No decisions recorded yet."),
    demonstrated: renderList(input.demonstratedConcepts, "No demonstrated concepts captured yet."),
    reinforce: renderList(input.weakAreas, "None"),
    timestamp: new Date().toISOString()
  });
}
