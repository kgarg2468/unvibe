import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { createDefaultProfile } from "./profile.js";
import type { UserProfile, WorkContext } from "./types.js";

export type VisibilityMode = "quiet" | "visible";

export type RepoState = {
  enabled: boolean;
  lastAsk?: {
    brainDump: string;
    context: WorkContext;
    recommendedFocus: string[];
  };
  paused: boolean;
  recentDecisions: Array<{ answer: string; id: string; question: string }>;
  researchArtifacts: string[];
};

type GlobalSettings = {
  visibility: VisibilityMode;
};

export type RuntimePaths = {
  decisionsPath: string;
  homeRoot: string;
  profilePath: string;
  repoRoot: string;
  settingsPath: string;
  statePath: string;
  unvibeRoot: string;
};

export function resolveRuntimePaths(sandbox: { homeRoot: string; repoRoot: string }): RuntimePaths {
  const unvibeRoot = join(sandbox.repoRoot, ".unvibe");

  return {
    decisionsPath: join(unvibeRoot, "decisions.md"),
    homeRoot: sandbox.homeRoot,
    profilePath: join(sandbox.homeRoot, "profile.json"),
    repoRoot: sandbox.repoRoot,
    settingsPath: join(sandbox.homeRoot, "settings.json"),
    statePath: join(unvibeRoot, "state.json"),
    unvibeRoot
  };
}

function ensureParentDirectory(pathName: string): void {
  mkdirSync(dirname(pathName), { recursive: true });
}

function readJsonFile<T>(pathName: string, fallback: T): T {
  if (!existsSync(pathName)) {
    return fallback;
  }

  try {
    return JSON.parse(readFileSync(pathName, "utf8")) as T;
  } catch {
    writeJsonFile(pathName, fallback);
    return fallback;
  }
}

function writeJsonFile(pathName: string, value: unknown): void {
  ensureParentDirectory(pathName);
  writeFileSync(pathName, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function defaultRepoState(): RepoState {
  return {
    enabled: true,
    paused: false,
    recentDecisions: [],
    researchArtifacts: []
  };
}

export function defaultSettings(): GlobalSettings {
  return { visibility: "visible" };
}

export function ensureInitializedDirectories(paths: RuntimePaths): void {
  mkdirSync(paths.homeRoot, { recursive: true });
  mkdirSync(paths.repoRoot, { recursive: true });
  mkdirSync(paths.unvibeRoot, { recursive: true });
  mkdirSync(join(paths.unvibeRoot, "plans"), { recursive: true });
  mkdirSync(join(paths.unvibeRoot, "research"), { recursive: true });
  mkdirSync(join(paths.unvibeRoot, "summaries"), { recursive: true });
}

export function loadProfile(paths: RuntimePaths): UserProfile {
  return readJsonFile(paths.profilePath, createDefaultProfile());
}

export function saveProfile(paths: RuntimePaths, profile: UserProfile): void {
  writeJsonFile(paths.profilePath, profile);
}

export function loadSettings(paths: RuntimePaths): GlobalSettings {
  return readJsonFile(paths.settingsPath, defaultSettings());
}

export function saveSettings(paths: RuntimePaths, settings: GlobalSettings): void {
  writeJsonFile(paths.settingsPath, settings);
}

export function loadRepoState(paths: RuntimePaths): RepoState {
  return readJsonFile(paths.statePath, defaultRepoState());
}

export function saveRepoState(paths: RuntimePaths, state: RepoState): void {
  writeJsonFile(paths.statePath, state);
}

export function seedDefaults(paths: RuntimePaths): void {
  if (!existsSync(paths.profilePath)) {
    saveProfile(paths, createDefaultProfile());
  }

  if (!existsSync(paths.settingsPath)) {
    saveSettings(paths, defaultSettings());
  }

  if (!existsSync(paths.statePath)) {
    saveRepoState(paths, defaultRepoState());
  }
}
