import type { WorkContext } from "./types.js";

const RULES: Array<{ context: WorkContext; patterns: RegExp[] }> = [
  {
    context: "migration",
    patterns: [/\bmigrate\b/i, /\blegacy\b/i, /\bnormalized schema\b/i, /\bover time\b/i]
  },
  {
    context: "dependency_swap",
    patterns: [/\breplace\b/i, /\bswap\b/i, /\bwith\b/i, /\bacross the app\b/i]
  },
  {
    context: "refactor",
    patterns: [/\brefactor\b/i, /\binternal structure\b/i, /\bwithout changing\b/i]
  },
  {
    context: "bug_fix",
    patterns: [/\bfix\b/i, /\bbug\b/i, /\bduplicate\b/i, /\bclicks?\b/i]
  },
  {
    context: "new_feature",
    patterns: [/\badd\b/i, /\bexisting\b/i, /\breal-time\b/i, /\bcollaborative\b/i]
  },
  {
    context: "greenfield",
    patterns: [/\bbuild a new\b/i, /\bnew .* app\b/i, /\brepo setup\b/i, /\bstarting from scratch\b/i]
  }
];

export function detectWorkContext(brainDump: string): WorkContext {
  const normalized = brainDump.trim();

  for (const rule of RULES) {
    if (rule.patterns.every((pattern) => pattern.test(normalized))) {
      return rule.context;
    }
  }

  if (/\bfix\b|\bbug\b/i.test(normalized)) {
    return "bug_fix";
  }

  if (/\bmigrate\b|\blegacy\b/i.test(normalized)) {
    return "migration";
  }

  if (/\breplace\b|\bswap\b/i.test(normalized)) {
    return "dependency_swap";
  }

  if (/\brefactor\b/i.test(normalized)) {
    return "refactor";
  }

  if (/\badd\b|\bexisting\b/i.test(normalized)) {
    return "new_feature";
  }

  return "greenfield";
}
