import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, test, vi } from "vitest";

import { appendDecisionEntry, reviseDecisionEntry } from "../src/decision-log.js";

describe("decision log", () => {
  test("appends entries to a markdown history", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T12:00:00.000Z"));

    const root = mkdtempSync(join(tmpdir(), "unvibe-decisions-"));
    const logPath = join(root, "decisions.md");

    const entryId = appendDecisionEntry(logPath, {
      answer: "We will use Supabase because the team already knows it.",
      question: "Why this backend choice?"
    });

    const log = readFileSync(logPath, "utf8");

    expect(entryId).toBe("decision-2026-04-14t12-00-00-000z");
    expect(log).toContain("# Unvibe Decision Log");
    expect(log).toContain("## decision-2026-04-14t12-00-00-000z");
    expect(log).toContain("Why this backend choice?");
    expect(log).toContain("We will use Supabase because the team already knows it.");
  });

  test("preserves history when an entry is revised", () => {
    vi.useFakeTimers();

    const root = mkdtempSync(join(tmpdir(), "unvibe-decisions-"));
    const logPath = join(root, "decisions.md");

    vi.setSystemTime(new Date("2026-04-14T12:00:00.000Z"));
    const entryId = appendDecisionEntry(logPath, {
      answer: "Start with SQLite.",
      question: "Which database should we use?"
    });

    vi.setSystemTime(new Date("2026-04-14T12:15:00.000Z"));
    const revisionId = reviseDecisionEntry(logPath, {
      entryId,
      newAnswer: "Use Postgres because the migration cost later is likely higher than the extra setup now.",
      reason: "We realized the data model will need multi-user writes."
    });

    const log = readFileSync(logPath, "utf8");

    expect(revisionId).toBe("decision-2026-04-14t12-15-00-000z");
    expect(log).toContain(`Supersedes: ${entryId}`);
    expect(log).toContain("Revision reason");
    expect(log).toContain("We realized the data model will need multi-user writes.");
    expect(log).toContain("Use Postgres because the migration cost later is likely higher than the extra setup now.");
  });
});
