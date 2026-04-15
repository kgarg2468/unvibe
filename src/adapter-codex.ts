import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const START_MARKER = "<!-- UNVIBE:START -->";
const END_MARKER = "<!-- UNVIBE:END -->";

function instructionBlock(): string {
  return [
    START_MARKER,
    "# Unvibe Codex CLI Adapter",
    "",
    "When the user gives you a non-trivial feature request, refactor, migration, swap, or bug report, do not jump straight into code.",
    "Run `unvibe ask --brain-dump \"...\"` first unless the user has used an explicit skip marker such as `vibe:` or `[skip]`.",
    "Use `unvibe research` when the user is deciding between meaningful technical options.",
    "Record important answers with `unvibe log` and use `unvibe plan` before implementation begins.",
    "Respect `unvibe pause`, `resume`, `enable`, and `disable` state.",
    END_MARKER,
    ""
  ].join("\n");
}

export function writeCodexAdapter(repoRoot: string): void {
  const agentsPath = join(repoRoot, "AGENTS.md");
  const block = instructionBlock();

  if (!existsSync(agentsPath)) {
    writeFileSync(agentsPath, block, "utf8");
    return;
  }

  const current = readFileSync(agentsPath, "utf8");
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}\\n?`, "m");

  if (pattern.test(current)) {
    writeFileSync(agentsPath, current.replace(pattern, block), "utf8");
    return;
  }

  const separator = current.endsWith("\n") ? "" : "\n";
  writeFileSync(agentsPath, `${current}${separator}\n${block}`, "utf8");
}
