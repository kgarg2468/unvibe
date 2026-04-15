import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

import { buildPlanningPacket } from "../src/question-engine.js";

type GoldenFixture = {
  brainDump: string;
  expectedContext: string;
  name: string;
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "golden");

function readFixture(fileName: string): GoldenFixture {
  return JSON.parse(readFileSync(join(fixturesDir, fileName), "utf8")) as GoldenFixture;
}

describe("buildPlanningPacket", () => {
  test.each([
    "greenfield.json",
    "new-feature.json",
    "dependency-swap.json",
    "refactor.json",
    "migration.json",
    "bug-fix.json"
  ])("builds a calibrated question batch for %s", (fileName) => {
    const fixture = readFixture(fileName);
    const packet = buildPlanningPacket({
      brainDump: fixture.brainDump,
      profile: {
        experienceLevel: "beginner",
        languages: ["typescript"],
        focusAreas: ["architecture", "testing"]
      }
    });

    expect(packet.context).toBe(fixture.expectedContext);
    expect(packet.metaQuestions).toHaveLength(3);
    expect(packet.dimensionQuestions.length).toBeLessThanOrEqual(5);
    expect(packet.dimensionQuestions.length).toBeGreaterThan(0);
    expect(packet).toMatchSnapshot();
  });
});
