import { readFileSync } from "node:fs";

import { loadTemplate } from "./content-loader.js";

type BuildResearchBriefInput = {
  alternatives: string[];
  brainDump: string;
  topic: string;
};

type ResearchSeed = {
  differences: string[];
  pair: [string, string];
  quiz: string[];
};

function loadResearchSeeds(): ResearchSeed[] {
  const raw = readFileSync(new URL("../content/research-seeds.json", import.meta.url), "utf8");
  return JSON.parse(raw) as ResearchSeed[];
}

function findSeed(topic: string, alternatives: string[]): ResearchSeed | undefined {
  const normalized = [topic, ...alternatives].map((item) => item.toLowerCase()).sort();

  return loadResearchSeeds().find((seed) => {
    const pair = [...seed.pair].map((item) => item.toLowerCase()).sort();
    return pair.length === normalized.length && pair.every((item, index) => item === normalized[index]);
  });
}

export function buildResearchBrief(input: BuildResearchBriefInput): string {
  const seed = findSeed(input.topic, input.alternatives);
  const title = [input.topic, ...input.alternatives].join(" vs ");

  const differenceLines = seed
    ? seed.differences.map((difference) => `- ${difference}`)
    : [
        "- Compare the operational model, data shape, and migration cost for these options.",
        "- Pull one source-backed advantage and one real downside for each option.",
        "- Decide which tradeoff matters most for this project before coding."
      ];

  const quizLines = seed
    ? seed.quiz.map((question) => `- ${question}`)
    : [
        "- Which option is easier to reverse later if your assumptions are wrong?",
        "- Which option better fits the current codebase constraints?",
        "- What evidence would make you switch your current preference?"
      ];

  let template = loadTemplate("research");

  template = template.replace("{{topic}}", title);
  template = template.replace("{{context}}", input.brainDump);
  template = template.replace("{{differences}}", differenceLines.join("\n"));
  template = template.replace("{{quiz}}", quizLines.join("\n"));

  return `${template.trimEnd()}\n`;
}
