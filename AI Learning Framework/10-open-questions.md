# 10 — Open Questions (Revised)

Known unresolved design questions. The coding agent helping with implementation should flag these when they come up rather than deciding silently.

## 1. How does the router detect work context without a CLI?

The original design had a CLI that could inspect `git diff`, branch names, and file state. In the skill-first architecture, the router skill runs inside the agent's context — it doesn't shell out to a CLI. The agent can still run git commands and read files, but the skill needs to specify *when* and *how* to gather these signals without slowing down every interaction.

**Current leaning:** The router skill includes a lightweight "context probe" step that runs git status and checks the user's message for keywords before deciding whether to activate. This is fast (one shell command) and provides the branch-name and diff-size signals the weighting logic needs. For MVP, message-content analysis alone (keywords, length, specificity) may be sufficient without any git inspection.

## 2. How does the questioning skill load dimension references?

Each dimension has a reference file with example questions at three calibration levels. The questioning skill needs to load the relevant dimension files based on the work-context weighting. In Superpowers, skills reference each other by name and the platform loads them. But dimension references aren't skills — they're data.

**Current leaning:** Store dimension references as files inside the `questioning/` skill directory (e.g., `questioning/dimensions/failure-modes.md`). The questioning skill reads them as needed. For platforms that support skill sub-files (Claude Code, Codex via skill tools), this is clean. For platforms that don't, inline the dimension content directly in the questioning skill at the cost of a larger skill file.

## 3. Where's the exact line between "fires" and "doesn't fire"?

The router has smart defaults for when to activate (>2 sentences, >50 lines of change, architectural signals, etc.). But the exact threshold is a user-experience decision that can only be calibrated with real users.

**Current leaning:** Start with a bias toward not firing when ambiguous. Let early users complain "it didn't fire when it should have" rather than "it fires on everything." The former is correctable with a message like "run the questioning skill on this"; the latter causes uninstalls. Tune thresholds based on feedback.

## 4. How many questions per interaction is too many?

Meta-layer always fires (3 questions). Dimension questions add 3–7 more. Research quiz adds 2–3 per research loop. Maximum single interaction could be 3 + 7 + 6 (two research loops) = 16 questions. That's probably too many.

**Current leaning:** Hard cap of 10 total questions per activation (meta-layer + dimension + research combined). If the framework would generate more, prioritize by blind-spot ranking (see `06-blind-spots.md`). The user can always say "ask me more" to continue, but the default should feel tight, not exhausting.

**Note:** Question *count* is one concern; question *format* is another. Question format is now resolved (see `08-workflow.md`, "Question format rules"): decision questions use structured choice when available and a deterministic plain-text fallback otherwise; the user actively picks (no auto-accept); the framework never asks the user to explain or define anything. One question per turn keeps the interaction readable even when the total count stays near the cap.

## 5. Should the decision log be human-editable or append-only?

The decision log (`.unvibe/decisions.md`) is the learning artifact. Two models:

- **Append-only:** Trustworthy as a historical record but unforgiving if the user wants to revise a bad decision.
- **Editable:** Flexible but undermines the log's function as honest history.

**Resolved (see `13-decision-log-protocol.md`):** Append-only for the framework, with a structured `**Revises:**` field for documenting changes-of-mind as new entries that reference prior ones. The user themselves may directly edit `decisions.md` if they want — the framework respects whatever the file contains. This preserves the framework's commitment to honest history while not locking the user out of their own artifact.

**Also resolved:** The full reading and writing protocol for `decisions.md` is now specified in `13-decision-log-protocol.md`. Critically: no skill ever reads the entire file. Every read is scope-limited (most recent N entries, last X days, or topic-matching), enforced through a state-layer function. This prevents the naive failure mode of loading the entire log on every activation, which would scale token usage badly as projects age.

## 6. How does the framework handle the Superpowers coexistence question?

Many users will have both Superpowers and this framework installed. Both have router skills that want to fire on every message. Both have brainstorming/questioning phases. What happens when they conflict?

**Current leaning:** Design for coexistence, not competition. The framework's router should detect when Superpowers is also installed and defer implementation-phase skills to Superpowers (which is better at execution discipline), while asserting priority on the *pre-brainstorming* learning phase. The workflow becomes: this framework's questioning → decision-capture → then Superpowers' brainstorming → writing-plans → execution. This is additive — the user gets learning *and* execution discipline.

This requires explicit integration notes in the router skill. If Superpowers is detected, the router's terminal state after decision-capture should be "invoke Superpowers brainstorming" instead of the framework's own plan-generation. This is a v1.1 concern but worth designing for from the start.

## 7. Should the framework announce itself?

When the framework fires, should it say "I'm using the questioning skill to understand your approach" (transparent, Superpowers-style) or should the questions appear naturally in the conversation without meta-commentary?

**Current leaning:** Announce, following the Superpowers pattern. Transparency matters for two reasons: (1) the user knows the framework is active and can skip if they want, and (2) it normalizes the idea that the pre-code phase is a real, named skill, not just "the agent being chatty." The announcement should be one sentence: "Using questioning to explore your approach before we build."

## 8. How does the framework handle work that doesn't map to any of the seven contexts?

The seven work contexts in `04-work-contexts.md` cover most software work, but edge cases exist: writing documentation, doing research, creating tests for existing untested code, CI/CD configuration, dependency updates.

**Current leaning:** For work that doesn't cleanly map, the router should still fire but with a lighter touch — meta-layer questions only (the three framing questions always apply), no dimension-specific questions. The framework gracefully degrades rather than refusing to engage. This also provides passive calibration data.

## 9. How does the research skill get access to docs?

The research skill needs to fetch documentation and compare options. In the original CLI design, the CLI would do HTTP requests. In the skill-first design, the skill instructs the agent to use its existing tools (web fetch, file reading, search).

**Current leaning:** The research skill instructs the agent to use whatever doc-fetching tools are available on the platform. On Claude Code, that's web fetch. On Codex, that's web search. On Cursor, that's docs integration. The skill doesn't hardcode a mechanism — it says "fetch the docs for X and Y, then build a tradeoff brief." This keeps the skill platform-agnostic but means quality depends on the host's doc-fetching capabilities. For topics with curated question banks, the bank supplements whatever the agent finds.

## 10. Should the framework track learning progress over time?

The profile tracks concepts seen and demonstrated, but should the framework also surface "you've grown" signals? E.g., "Two months ago you needed research on database choices; today you answered the question without hesitation."

**Current leaning:** Not in v1. The profile exists for calibration, not for gamification. Surfacing progress could be motivating but also feels paternalistic if done wrong. Defer this to v2 at earliest, and only if user feedback requests it.

## 11. How should skill files reference the dimension framework?

The questioning skill needs to know about dimensions, weighting, calibration, and blind spots. Should it inline all of this, or reference the docs?

**Current leaning:** Inline the essential logic (the five v1 dimensions, the weighting rules per context, the calibration level definitions) directly in the questioning skill file. Reference the full docs (03, 04, 05, 06) as background reading for the agent but don't require them to be loaded on every turn. The skill file should be self-contained enough that the agent can follow it without loading external docs, but rich enough that it generates good questions.

## 12. What's the packaging and distribution model?

Superpowers uses `npx skills add` and native plugin marketplaces on Claude Code and Cursor. This framework should follow the same model for reach.

**Current leaning:** Ship as a skills.sh package (same ecosystem as Superpowers), register on the Claude Code and Cursor plugin marketplaces, and provide manual install instructions for hosts without marketplaces. The `npx skills add` path is the primary install vector because it works across the most hosts.

---

These are the decisions the coding agent should flag when they come up during implementation, rather than deciding silently. If a decision is blocking progress, surface it — the right answer depends on real-user feedback.
