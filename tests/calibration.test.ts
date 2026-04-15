import { describe, expect, test } from "vitest";

import {
  createDefaultProfile,
  inferExperienceLevel,
  updateProfileFromAnswer
} from "../src/profile.js";

describe("profile calibration", () => {
  test("seeds a beginner-friendly profile by default", () => {
    const profile = createDefaultProfile();

    expect(profile.experienceLevel).toBe("beginner");
    expect(profile.seedSource).toBe("onboarding");
    expect(profile.languages).toEqual([]);
    expect(profile.focusAreas).toContain("architecture");
  });

  test("upgrades knowledge heuristically without downgrading", () => {
    const profile = createDefaultProfile({
      focusAreas: ["testing"],
      languages: ["typescript"]
    });

    const firstPass = updateProfileFromAnswer(
      profile,
      "We need idempotency here because duplicate requests can create two orders and increase the blast radius."
    );

    const secondPass = updateProfileFromAnswer(
      firstPass,
      "I still want a simple implementation first."
    );

    expect(firstPass.conceptsSeen.idempotency).toBeGreaterThanOrEqual(1);
    expect(firstPass.conceptsDemonstrated.idempotency).toBe("intermediate");
    expect(firstPass.experienceLevel).toBe("intermediate");
    expect(secondPass.experienceLevel).toBe("intermediate");
  });

  test("infers experience from onboarding signals", () => {
    expect(
      inferExperienceLevel({
        shipped: ["production app at work"],
        wantsToLearn: ["distributed systems"]
      })
    ).toBe("advanced");

    expect(
      inferExperienceLevel({
        shipped: ["personal website"],
        wantsToLearn: ["testing"]
      })
    ).toBe("intermediate");

    expect(
      inferExperienceLevel({
        shipped: ["nothing yet"],
        wantsToLearn: ["databases"]
      })
    ).toBe("beginner");
  });
});
