#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { writeCodexAdapter } from "./adapter-codex.js";
import { renderPlanArtifact, renderSessionSummary } from "./artifacts.js";
import { buildPlanningPacket } from "./question-engine.js";
import { appendDecisionEntry, reviseDecisionEntry } from "./decision-log.js";
import { createDefaultProfile, updateProfileFromAnswer } from "./profile.js";
import { buildResearchBrief } from "./research.js";
import {
  ensureInitializedDirectories,
  loadProfile,
  loadRepoState,
  loadSettings,
  resolveRuntimePaths,
  saveProfile,
  saveRepoState,
  saveSettings,
  seedDefaults,
  type VisibilityMode
} from "./state.js";
import type { UserProfile } from "./types.js";

type CliResult = {
  exitCode: number;
  stderr: string;
  stdout: string;
};

type Sandbox = {
  homeRoot: string;
  repoRoot: string;
};

function createResult(stdout: string, stderr = "", exitCode = 0): CliResult {
  return { exitCode, stderr, stdout };
}

function getFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);

  if (index === -1 || index === args.length - 1) {
    return undefined;
  }

  return args[index + 1];
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDecisionLog(decisionsPath: string): void {
  if (!existsSync(decisionsPath)) {
    writeFileSync(decisionsPath, "# Unvibe Decision Log\n\n", "utf8");
  }
}

function parseList(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasSkipMarker(brainDump: string): boolean {
  const normalized = brainDump.trim().toLowerCase();
  return (
    normalized.startsWith("vibe:") ||
    normalized.startsWith("[skip]") ||
    normalized.startsWith("--quick")
  );
}

function renderAskOutput(brainDump: string, profile: UserProfile, visibility: VisibilityMode): string {
  const packet = buildPlanningPacket({ brainDump, profile });
  const meta = packet.metaQuestions
    .map((question, index) => `${index + 1}. ${question.prompt}\n   Why: ${question.why}`)
    .join("\n");
  const dimensions = packet.dimensionQuestions
    .map(
      (question, index) =>
        `${index + 1}. [${question.dimensionId}] ${question.prompt}\n   Why: ${question.why}`
    )
    .join("\n");

  const lines = [
    ...(visibility === "visible" ? ["# Unvibe Planning Questions", ""] : []),
    "",
    `Context: ${packet.context}`,
    "",
    "## Meta Questions",
    meta,
    "",
    "## Dimension Questions",
    dimensions,
    ""
  ];

  return lines.join("\n");
}

function extractDemonstratedConcepts(profile: UserProfile): string[] {
  return Object.entries(profile.conceptsDemonstrated ?? {})
    .filter(([, level]) => level !== "beginner")
    .map(([concept]) => concept);
}

function writeArtifact(pathName: string, content: string): void {
  writeFileSync(pathName, content, "utf8");
}

export async function runCli(argv: string[], sandbox: Sandbox): Promise<CliResult> {
  const paths = resolveRuntimePaths(sandbox);
  const command = argv[0];

  if (!command) {
    return createResult("", "No command provided.", 1);
  }

  if (command === "init") {
    ensureInitializedDirectories(paths);
    seedDefaults(paths);
    ensureDecisionLog(paths.decisionsPath);
    writeCodexAdapter(paths.repoRoot);

    return createResult(
      `Unvibe initialized.\nRepo: ${paths.repoRoot}\nHome: ${paths.homeRoot}\nAdapter: AGENTS.md`
    );
  }

  if (!existsSync(paths.statePath)) {
    return createResult("", "Run `unvibe init` first.", 1);
  }

  const state = loadRepoState(paths);
  const settings = loadSettings(paths);
  let profile = loadProfile(paths);

  if (command === "status") {
    return createResult(
      [
        "# Unvibe Status",
        `Enabled: ${state.enabled}`,
        `Paused: ${state.paused}`,
        `Visibility: ${settings.visibility}`,
        `Languages: ${profile.languages.join(", ") || "none"}`,
        `Experience: ${profile.experienceLevel}`
      ].join("\n")
    );
  }

  if (command === "pause") {
    state.paused = true;
    saveRepoState(paths, state);
    return createResult("Unvibe paused for this repo session.");
  }

  if (command === "resume") {
    state.paused = false;
    saveRepoState(paths, state);
    return createResult("Unvibe resumed for this repo session.");
  }

  if (command === "disable") {
    state.enabled = false;
    saveRepoState(paths, state);
    return createResult("Unvibe disabled for this repo.");
  }

  if (command === "enable") {
    state.enabled = true;
    saveRepoState(paths, state);
    return createResult("Unvibe enabled for this repo.");
  }

  if (command === "profile") {
    const languages = parseList(getFlag(argv, "--languages"));
    const focusAreas = parseList(getFlag(argv, "--focus-areas"));
    const experienceLevel = getFlag(argv, "--experience");
    const visibility = getFlag(argv, "--visibility");

    if (languages.length > 0) {
      profile = { ...profile, languages };
    }

    if (focusAreas.length > 0) {
      profile = { ...profile, focusAreas };
    }

    if (experienceLevel === "beginner" || experienceLevel === "intermediate" || experienceLevel === "advanced") {
      profile = { ...profile, experienceLevel };
    }

    if (visibility === "quiet" || visibility === "visible") {
      saveSettings(paths, { visibility });
    }

    saveProfile(paths, profile);

    return createResult(
      [
        "# Unvibe Profile",
        `Experience: ${profile.experienceLevel}`,
        `Languages: ${profile.languages.join(", ") || "none"}`,
        `Focus Areas: ${profile.focusAreas.join(", ")}`
      ].join("\n")
    );
  }

  if (!state.enabled) {
    return createResult("Unvibe is disabled for this repo.");
  }

  if (state.paused) {
    return createResult("Unvibe is paused for this repo session.");
  }

  if (command === "ask") {
    const brainDump = getFlag(argv, "--brain-dump");

    if (!brainDump) {
      return createResult("", "Missing `--brain-dump`.", 1);
    }

    if (hasSkipMarker(brainDump)) {
      return createResult("Unvibe detected a prototype-lane skip marker and did not fire.");
    }

    const packet = buildPlanningPacket({ brainDump, profile });
    state.lastAsk = {
      brainDump,
      context: packet.context,
      recommendedFocus: packet.recommendedFocus
    };
    saveRepoState(paths, state);

    return createResult(renderAskOutput(brainDump, profile, settings.visibility));
  }

  if (command === "log" && argv[1] === "edit") {
    const entry = getFlag(argv, "--entry");
    const reason = getFlag(argv, "--reason");
    const answer = getFlag(argv, "--answer");

    if (!entry || !reason || !answer) {
      return createResult("", "Missing `--entry`, `--reason`, or `--answer`.", 1);
    }

    const revisionId = reviseDecisionEntry(paths.decisionsPath, {
      entryId: entry,
      newAnswer: answer,
      reason
    });
    state.recentDecisions.push({ answer, id: revisionId, question: `Revision of ${entry}` });
    saveRepoState(paths, state);

    return createResult(`Decision revised as ${revisionId}.`);
  }

  if (command === "log") {
    const question = getFlag(argv, "--question");
    const answer = getFlag(argv, "--answer");

    if (!question || !answer) {
      return createResult("", "Missing `--question` or `--answer`.", 1);
    }

    const entryId = appendDecisionEntry(paths.decisionsPath, { answer, question });
    state.recentDecisions.push({ answer, id: entryId, question });
    saveRepoState(paths, state);

    const updatedProfile = updateProfileFromAnswer(profile, answer);
    saveProfile(paths, updatedProfile);

    return createResult(`Decision logged as ${entryId}.`);
  }

  if (command === "research") {
    const topic = argv[1];
    const alternatives = parseList(getFlag(argv, "--alternatives"));
    const brainDump = getFlag(argv, "--brain-dump") ?? state.lastAsk?.brainDump ?? "No project context supplied.";

    if (!topic) {
      return createResult("", "Missing research topic.", 1);
    }

    const brief = buildResearchBrief({ alternatives, brainDump, topic });
    const fileName = `${slugify([topic, ...alternatives].join(" vs "))}.md`;
    const relativePath = join("research", fileName);
    const fullPath = join(paths.unvibeRoot, relativePath);

    writeArtifact(fullPath, brief);

    if (!state.researchArtifacts.includes(relativePath)) {
      state.researchArtifacts.push(relativePath);
      saveRepoState(paths, state);
    }

    return createResult(`Research brief written to ${relativePath}.\n\n${brief}`);
  }

  if (command === "plan") {
    const brainDump = getFlag(argv, "--brain-dump") ?? state.lastAsk?.brainDump;

    if (!brainDump) {
      return createResult("", "Missing `--brain-dump` and no prior `ask` context exists.", 1);
    }

    const packet = buildPlanningPacket({ brainDump, profile });
    const plan = renderPlanArtifact({
      brainDump,
      context: packet.context,
      decisions: state.recentDecisions.slice(-5),
      recommendedFocus: packet.recommendedFocus,
      researchArtifacts: state.researchArtifacts
    });

    const planPath = join(paths.unvibeRoot, "plans", `${slugify(brainDump)}.md`);
    writeArtifact(planPath, plan);

    const summary = renderSessionSummary({
      demonstratedConcepts: extractDemonstratedConcepts(loadProfile(paths)),
      recentDecisions: state.recentDecisions.slice(-5).map((decision) => decision.answer),
      weakAreas: packet.recommendedFocus
    });
    const summaryPath = join(
      paths.unvibeRoot,
      "summaries",
      `session-${new Date().toISOString().toLowerCase().replaceAll(":", "-").replaceAll(".", "-")}.md`
    );
    writeArtifact(summaryPath, summary);

    return createResult(`Plan written to ${planPath}\nSummary written to ${summaryPath}`);
  }

  return createResult("", `Unknown command: ${command}`, 1);
}

async function main(): Promise<void> {
  const sandbox = {
    homeRoot: process.env.UNVIBE_HOME ?? join(process.env.HOME ?? process.cwd(), ".unvibe"),
    repoRoot: process.env.UNVIBE_REPO_ROOT ?? process.cwd()
  };

  const result = await runCli(process.argv.slice(2), sandbox);

  if (result.stdout) {
    process.stdout.write(`${result.stdout}\n`);
  }

  if (result.stderr) {
    process.stderr.write(`${result.stderr}\n`);
  }

  process.exitCode = result.exitCode;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  void main();
}
