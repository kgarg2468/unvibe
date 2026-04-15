import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

import { detectWorkContext } from "../src/context-detection.js";

type GoldenFixture = {
  brainDump: string;
  expectedContext: string;
  name: string;
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "golden");

function readFixture(fileName: string): GoldenFixture {
  return JSON.parse(readFileSync(join(fixturesDir, fileName), "utf8")) as GoldenFixture;
}

describe("detectWorkContext", () => {
  test.each([
    "greenfield.json",
    "new-feature.json",
    "dependency-swap.json",
    "refactor.json",
    "migration.json",
    "bug-fix.json"
  ])("detects the %s scenario", (fileName) => {
    const fixture = readFixture(fileName);

    expect(detectWorkContext(fixture.brainDump)).toBe(fixture.expectedContext);
  });
});
