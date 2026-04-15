import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

type AppendDecisionEntryInput = {
  answer: string;
  question: string;
};

type ReviseDecisionEntryInput = {
  entryId: string;
  newAnswer: string;
  reason: string;
};

function ensureParentDirectory(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

function entryIdFromDate(now: Date): string {
  return `decision-${now.toISOString().toLowerCase().replaceAll(":", "-").replaceAll(".", "-")}`;
}

function ensureLogFile(logPath: string): void {
  ensureParentDirectory(logPath);

  if (!existsSync(logPath)) {
    writeFileSync(logPath, "# Unvibe Decision Log\n\n", "utf8");
  }
}

function appendSection(logPath: string, section: string): void {
  const current = readFileSync(logPath, "utf8");
  writeFileSync(logPath, `${current}${section}`, "utf8");
}

export function appendDecisionEntry(logPath: string, input: AppendDecisionEntryInput): string {
  ensureLogFile(logPath);

  const now = new Date();
  const entryId = entryIdFromDate(now);
  const section = [
    `## ${entryId}`,
    `Timestamp: ${now.toISOString()}`,
    "",
    "Question",
    input.question,
    "",
    "Answer",
    input.answer,
    "",
    "---",
    ""
  ].join("\n");

  appendSection(logPath, section);

  return entryId;
}

export function reviseDecisionEntry(logPath: string, input: ReviseDecisionEntryInput): string {
  ensureLogFile(logPath);

  const now = new Date();
  const entryId = entryIdFromDate(now);
  const section = [
    `## ${entryId}`,
    `Timestamp: ${now.toISOString()}`,
    `Supersedes: ${input.entryId}`,
    "",
    "Revision reason",
    input.reason,
    "",
    "Revised answer",
    input.newAnswer,
    "",
    "---",
    ""
  ].join("\n");

  appendSection(logPath, section);

  return entryId;
}
