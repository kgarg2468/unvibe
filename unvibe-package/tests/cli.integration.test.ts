import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, test, vi } from "vitest";

import { runCli } from "../src/cli.js";

function makeSandbox() {
  const root = mkdtempSync(join(tmpdir(), "unvibe-cli-"));
  const repoRoot = join(root, "repo");
  const homeRoot = join(root, "home");

  return { homeRoot, repoRoot };
}

describe("cli integration", () => {
  test("init creates repo and home state, and rewrites AGENTS.md idempotently", async () => {
    const sandbox = makeSandbox();

    const first = await runCli(["init"], sandbox);
    const second = await runCli(["init"], sandbox);

    const agents = readFileSync(join(sandbox.repoRoot, "AGENTS.md"), "utf8");

    expect(first.exitCode).toBe(0);
    expect(second.exitCode).toBe(0);
    expect(existsSync(join(sandbox.homeRoot, "profile.json"))).toBe(true);
    expect(existsSync(join(sandbox.repoRoot, ".unvibe", "state.json"))).toBe(true);
    expect(agents.match(/UNVIBE:START/g)).toHaveLength(1);
  });

  test("status, pause, resume, disable, enable, and profile reflect persisted settings", async () => {
    const sandbox = makeSandbox();

    await runCli(["init"], sandbox);
    await runCli(["pause"], sandbox);
    await runCli(["disable"], sandbox);
    await runCli(["profile", "--visibility", "quiet", "--languages", "typescript,python"], sandbox);

    const paused = await runCli(["status"], sandbox);

    expect(paused.stdout).toContain("Paused: true");
    expect(paused.stdout).toContain("Enabled: false");
    expect(paused.stdout).toContain("Visibility: quiet");
    expect(paused.stdout).toContain("typescript, python");

    await runCli(["resume"], sandbox);
    await runCli(["enable"], sandbox);

    const resumed = await runCli(["status"], sandbox);

    expect(resumed.stdout).toContain("Paused: false");
    expect(resumed.stdout).toContain("Enabled: true");
  });

  test("ask respects skip markers and otherwise emits meta plus dimension questions", async () => {
    const sandbox = makeSandbox();

    await runCli(["init"], sandbox);

    const skipped = await runCli(
      ["ask", "--brain-dump", "vibe: quick CSS tweak for the button spacing"],
      sandbox
    );
    const asked = await runCli(
      [
        "ask",
        "--brain-dump",
        "Add collaborative cursors to my existing Next.js whiteboard app."
      ],
      sandbox
    );

    expect(skipped.stdout).toContain("prototype-lane skip marker");
    expect(asked.stdout).toContain("Meta Questions");
    expect(asked.stdout).toContain("Dimension Questions");
  });

  test("quiet visibility softens the ask output without disabling the workflow", async () => {
    const sandbox = makeSandbox();

    await runCli(["init"], sandbox);
    await runCli(["profile", "--visibility", "quiet"], sandbox);

    const asked = await runCli(
      [
        "ask",
        "--brain-dump",
        "Add collaborative cursors to my existing Next.js whiteboard app."
      ],
      sandbox
    );

    expect(asked.stdout).not.toContain("# Unvibe Planning Questions");
    expect(asked.stdout).toContain("Context:");
    expect(asked.stdout).toContain("Meta Questions");
  });

  test("log, research, and plan create durable artifacts and session summary", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T13:30:00.000Z"));

    const sandbox = makeSandbox();

    await runCli(["init"], sandbox);
    await runCli(
      [
        "log",
        "--question",
        "Why this realtime layer?",
        "--answer",
        "Use Yjs because it fits the collaborative editing model and keeps the rollout incremental."
      ],
      sandbox
    );
    await runCli(
      ["research", "Yjs", "--alternatives", "Automerge", "--brain-dump", "Realtime cursors"],
      sandbox
    );
    const planResult = await runCli(
      ["plan", "--brain-dump", "Add collaborative cursors to my existing whiteboard app."],
      sandbox
    );

    const repoState = join(sandbox.repoRoot, ".unvibe");
    const decisions = readFileSync(join(repoState, "decisions.md"), "utf8");
    const research = readFileSync(join(repoState, "research", "yjs-vs-automerge.md"), "utf8");
    const plan = readFileSync(
      join(repoState, "plans", "add-collaborative-cursors-to-my-existing-whiteboard-app.md"),
      "utf8"
    );
    const summary = readFileSync(
      join(repoState, "summaries", "session-2026-04-14t13-30-00-000z.md"),
      "utf8"
    );

    expect(planResult.stdout).toContain("Plan written");
    expect(decisions).toContain("Use Yjs because it fits the collaborative editing model");
    expect(research).toContain("Yjs");
    expect(plan).toContain("# Unvibe Plan");
    expect(summary).toContain("# Unvibe Session Summary");
  });

  test("log edit preserves history instead of overwriting entries", async () => {
    vi.useFakeTimers();

    const sandbox = makeSandbox();
    await runCli(["init"], sandbox);

    vi.setSystemTime(new Date("2026-04-14T14:00:00.000Z"));
    await runCli(
      [
        "log",
        "--question",
        "Which database should we use?",
        "--answer",
        "Start with SQLite."
      ],
      sandbox
    );

    vi.setSystemTime(new Date("2026-04-14T14:05:00.000Z"));
    await runCli(
      [
        "log",
        "edit",
        "--entry",
        "decision-2026-04-14t14-00-00-000z",
        "--reason",
        "The product needs multi-user writes from day one.",
        "--answer",
        "Use Postgres."
      ],
      sandbox
    );

    const decisions = readFileSync(join(sandbox.repoRoot, ".unvibe", "decisions.md"), "utf8");

    expect(decisions).toContain("Supersedes: decision-2026-04-14t14-00-00-000z");
    expect(decisions).toContain("Use Postgres.");
  });

  test("status recovers from a corrupted state file by falling back to defaults", async () => {
    const sandbox = makeSandbox();

    await runCli(["init"], sandbox);
    writeFileSync(join(sandbox.repoRoot, ".unvibe", "state.json"), "{not-valid-json", "utf8");

    const status = await runCli(["status"], sandbox);

    expect(status.exitCode).toBe(0);
    expect(status.stdout).toContain("Enabled: true");
    expect(status.stdout).toContain("Paused: false");
  });
});
