import { describe, expect, test, vi } from "vitest";

import { renderPlanArtifact, renderSessionSummary } from "../src/artifacts.js";
import { buildResearchBrief } from "../src/research.js";

describe("artifact rendering", () => {
  test("renders a plan artifact that references recent decisions and focus areas", () => {
    const plan = renderPlanArtifact({
      brainDump: "Add collaborative cursors to the whiteboard experience.",
      context: "new_feature",
      decisions: [
        {
          answer: "Use Yjs because it already fits the collaborative editing model we want.",
          question: "Why this realtime layer?"
        }
      ],
      recommendedFocus: ["current_state_contracts", "failure_modes", "change_strategy"],
      researchArtifacts: ["research/yjs-vs-automerge.md"]
    });

    expect(plan).toContain("# Unvibe Plan");
    expect(plan).toContain("Add collaborative cursors to the whiteboard experience.");
    expect(plan).toContain("current_state_contracts");
    expect(plan).toContain("Use Yjs because it already fits the collaborative editing model we want.");
    expect(plan).toMatchSnapshot();
  });

  test("renders a session summary from recent work", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T13:00:00.000Z"));

    const summary = renderSessionSummary({
      demonstratedConcepts: ["idempotency", "blast_radius"],
      recentDecisions: [
        "Use Postgres because the schema will grow with multi-user workflows.",
        "Keep the initial rollout behind a feature flag."
      ],
      weakAreas: ["rollback planning"]
    });

    expect(summary).toContain("# Unvibe Session Summary");
    expect(summary).toContain("2026-04-14T13:00:00.000Z");
    expect(summary).toContain("idempotency");
    expect(summary).toContain("rollback planning");
    expect(summary).toMatchSnapshot();
  });

  test("builds a research brief from curated content when a known comparison exists", () => {
    const brief = buildResearchBrief({
      alternatives: ["Automerge"],
      brainDump: "We need collaborative editing for an existing product.",
      topic: "Yjs"
    });

    expect(brief).toContain("# Unvibe Research Brief");
    expect(brief).toContain("Yjs");
    expect(brief).toContain("Automerge");
    expect(brief).toContain("Quiz");
    expect(brief).toMatchSnapshot();
  });
});
