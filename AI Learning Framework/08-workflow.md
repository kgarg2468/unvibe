# 08 — Workflow, Architecture, and Activation (Revised)

> **This document supersedes the original 08-workflow.md.** The original designed the framework as a CLI that hoped the coding agent would call it. This revision redesigns it as a first-class skill system that the coding agent *must* enter, borrowing the activation architecture from Superpowers while building a fundamentally different skill graph optimized for learning rather than execution discipline.

## The lesson from Superpowers

Superpowers works because of five architectural decisions, not because of any single skill's content:

**1. The router fires on every message.** The `using-superpowers` skill is not optional. It checks whether *any* skill applies before *any* response or action. The enforcement language is extreme and deliberate: "IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT." This is not a suggestion in AGENTS.md — it's a skill the agent loads into its context on every turn.

**2. Anti-rationalization is explicit.** Superpowers includes a table of thoughts that mean "STOP — you're rationalizing." Things like "This is just a simple question," "I need more context first," "The skill is overkill." Each rationalization is paired with a reality check. This prevents the agent from talking itself out of using the skill, which is the exact failure mode our original CLI-behind-AGENTS.md approach had — the agent could rationalize not calling the CLI.

**3. Skills gate each other with hard transitions.** Brainstorming's terminal state is "invoke writing-plans." Writing-plans' terminal state is "offer subagent-driven-development or executing-plans." These aren't suggestions; they're the only valid next step. The graph has no "skip ahead" edges. Process skills (brainstorming, debugging) fire before implementation skills. Always.

**4. Every skill has a process flow graph.** Superpowers uses Graphviz digraphs inline in the skill markdown. The agent literally follows a state machine: "User message received → Might any skill apply? → yes → Invoke Skill tool → Announce → Has checklist? → Create TodoWrite per item → Follow skill exactly." This removes ambiguity about ordering and makes the skill auditable.

**5. Checklists become tracked todos.** When a skill has a checklist, each item becomes a TodoWrite entry. The agent must complete them in order. This creates accountability — you can see what was done and what was skipped.

## What to borrow, what to build fresh

**Borrow from Superpowers:**
- The router-fires-on-every-message pattern
- Anti-rationalization tables
- Hard skill-to-skill transitions (no skip edges)
- Process flow graphs (digraphs) in every skill
- Checklists as tracked todos
- Process skills fire before implementation skills
- The enforcement language style ("YOU DO NOT HAVE A CHOICE")
- The "announce what skill you're using" pattern for transparency
- The spec-before-plan-before-implementation gating chain

**Build fresh (this is where the differentiation lives):**
- Every process skill is optimized for *learning*, not *execution discipline*
- The skill graph's central path is: understand → question → research → decide → capture → then implement
- Superpowers' brainstorming asks questions to refine the *spec*; this framework asks questions to refine the *user's understanding*
- Superpowers' output is a plan good enough for "an enthusiastic junior engineer with poor taste"; this framework's output is a plan whose decision log teaches the user *why* each choice was made
- The skill graph includes a research loop and a quiz step that Superpowers doesn't have
- Skill calibration adapts question depth to the user's profile — Superpowers treats all users the same
- The anti-rationalization table targets learning-avoidance specifically, not just discipline-avoidance

## The skill system

### The router skill: `using-unvibe`

Fires on every message. Decides whether the framework should activate. Contains:

- The skill-check logic (same pattern as `using-superpowers`: check before any response, even 1% chance means check)
- The skip/bypass logic (recognizes `vibe:`, `[skip]`, `--quick` prefixes as explicit prototype-lane markers)
- The pause/resume and enable/disable state checks (reads from `.unvibe/state.json`)
- The work-context inference (signals from the message content, git state, branch name, repo maturity — see `04-work-contexts.md`)
- The "is this bigger than it looks?" small-change detector (architectural signal check)
- The anti-rationalization table adapted for this framework's context
- Skill priority: process skills (questioning, research, decision-capture) fire before implementation skills (plan-generation)

The router's anti-rationalization table:

| Thought | Reality |
|---|---|
| "This is just a simple feature" | Simple features are where unexamined assumptions cause the most wasted learning. |
| "I already know what stack to use" | Knowing what to pick ≠ knowing why. The questions surface the why. |
| "The user just wants to build, not learn" | If the framework is active, the user opted into learning. Respect that. |
| "I can ask questions later" | Questions before code change the code. Questions after code are postmortems. |
| "Let me just scaffold first" | Scaffolding IS architecture. Question it before committing. |
| "This doesn't need research" | If the user hasn't explicitly compared alternatives, it needs research. |
| "I'll just do this one thing first" | Check BEFORE doing anything. Skills prevent wasted work. |
| "This is too small for the full process" | If the router fired, the process is warranted. Small tasks harbor hidden decisions. |
| "I remember the skill" | Skills evolve. Read the current version every time. |

### Process skills (the learning core)

These are the skills that differentiate this framework from Superpowers. They map directly to the dimension framework in `03-dimensions.md`.

---

**Skill: `questioning`**

The central skill. Fires after the router classifies work as non-trivial and non-skipped.

Process flow:
```
digraph questioning {
    "Router activates questioning" [shape=doublecircle];
    "Run meta-layer (3 questions)" [shape=box];
    "Detect work context" [shape=box];
    "Confirm context with user (one sentence)" [shape=box];
    "Load user profile" [shape=box];
    "Weight dimensions for context" [shape=box];
    "Generate calibrated questions (3-7)" [shape=box];
    "Present questions to user" [shape=box];
    "User answers" [shape=box];
    "Uncertainty detected?" [shape=diamond];
    "Invoke research skill" [shape=box];
    "Update passive calibration" [shape=box];
    "All questions answered?" [shape=diamond];
    "Invoke decision-capture skill" [shape=doublecircle];

    "Router activates questioning" -> "Run meta-layer (3 questions)";
    "Run meta-layer (3 questions)" -> "Detect work context";
    "Detect work context" -> "Confirm context with user (one sentence)";
    "Confirm context with user (one sentence)" -> "Load user profile";
    "Load user profile" -> "Weight dimensions for context";
    "Weight dimensions for context" -> "Generate calibrated questions (3-7)";
    "Generate calibrated questions (3-7)" -> "Present questions to user";
    "Present questions to user" -> "User answers";
    "User answers" -> "Update passive calibration";
    "Update passive calibration" -> "Uncertainty detected?";
    "Uncertainty detected?" -> "Invoke research skill" [label="yes"];
    "Uncertainty detected?" -> "All questions answered?" [label="no"];
    "Invoke research skill" -> "All questions answered?";
    "All questions answered?" -> "Present questions to user" [label="no, more questions"];
    "All questions answered?" -> "Invoke decision-capture skill" [label="yes"];
}
```

Checklist (each becomes a TodoWrite item):
1. Run the three meta-layer questions (see `02-meta-layer.md`) — always, in order
2. Detect work context from available signals (see `04-work-contexts.md`)
3. Confirm context with user in one sentence ("Looks like you're adding a feature to an existing Next.js app. Sound right?")
4. Load user profile from `~/.unvibe/profile.json`
5. **Read scoped decision log** — most recent 3 entries OR last 30 days, whichever is fewer (see `13-decision-log-protocol.md`). Identify any locked decisions for this project so questions don't re-litigate them.
6. Weight dimensions per context (see `04-work-contexts.md`)
7. Generate 3–7 calibrated questions from weighted dimensions at appropriate depth for profile, **excluding any decisions already locked by recent log entries**
8. Present questions — one at a time, always
9. For each answer: update passive calibration signals, check for uncertainty markers
10. If uncertainty detected → invoke `research` skill, return to questioning after research completes
11. When all questions answered → invoke `decision-capture` skill

**The terminal state is invoking decision-capture.** Do NOT invoke plan-generation or any implementation skill directly from questioning.

Key rules:
- Multiple choice preferred when options are well-defined; open-ended when the question is about reasoning
- Never skip the meta-layer, even for small work
- If a user's answer reveals they don't understand the question, rephrase at a lower calibration level — don't just move on
- Uncertainty markers: "not sure," "I think maybe," "I've never used X," "what do you recommend?", hedging language, picking the first option without reasoning

## Question format rules (critical for not feeling annoying)

The framework's questions must always make the user feel informed, never tested. Two absolute rules:

**Rule 1: The framework never asks the user to explain or define anything.** The user is here because they don't yet know everything a senior engineer would know. Asking *"what's the difference between Yjs and Automerge?"* or *"explain how CRDTs work"* puts the burden of explanation on the person who came to the framework to learn. That's the failure mode that makes Socratic tools feel like pop quizzes and makes users quit. Never do it.

If the framework needs the user to understand a concept before they can decide, the framework provides the explanation (in the option blurbs, see Rule 2) — it doesn't extract it from the user.

**Rule 2: Decision questions use structured choice when the host supports it, and a deterministic plain-text fallback everywhere else. The user actively picks (no auto-accept defaults).**

Structured choice contract:

- one question only
- 2–3 mutually exclusive options
- recommended option listed first and labeled `(Recommended)`
- short, plain-language option descriptions
- built-in free-form fallback when the user wants a different answer

Plain-text fallback:

```
[Question in plain language, no jargon]

Recommendation: [name], because [project-specific reasoning that references the user's own answers and context].

1. [name]
[1-2 sentence blurb explaining what this is in plain language. No assumed knowledge. No jargon. If a term is technical, explain it inline.]

2. [name]
[Same format.]

3. [name]
[Same format.]

Reply with 1, 2, 3, or your own answer.
```

Concrete example for a real-time sync decision:

> *"How do you want to sync cursor positions between users?*
>
> *Recommendation: Yjs, because you mentioned wanting this to scale beyond cursors to collaborative document editing later, and Yjs handles that natively while Supabase broadcast would need significant rework.*
>
> *1. Yjs*
> *A library that lets multiple users edit the same data without conflicts. Used by tools like Figma. Handles the hard "two users moved their cursor at the same time" cases automatically. Slightly more setup than Supabase realtime.*
>
> *2. Automerge*
> *Similar to Yjs — also handles concurrent edits automatically. Smaller community, slightly different design choices. Comparable for your use case.*
>
> *3. Supabase realtime broadcast*
> *Simplest setup since you're already using Supabase. You'd handle the "what if two users move at once" logic yourself. For cursors specifically that's fine because positions don't really conflict — you just show the latest one.*
>
> *Reply with 1, 2, 3, or your own answer."*

Why this format works:

- **The user can answer in 30 seconds without leaving the conversation.** No googling, no separate research tab. The blurbs are the micro-education.
- **The user learns by reading the options**, not by being tested on them. By the time they pick, they've absorbed what each thing is.
- **The recommendation is project-specific**, not generic. It references something the user said earlier ("you mentioned wanting this to scale to document editing"). This shows the framework has been listening and makes the recommendation trustworthy.
- **No auto-accept.** The user must actively type or say their choice. This slight friction is intentional — it prevents the "just click recommend" pattern that defeats the framework's purpose. The user has to consider, even briefly, whether to take the recommendation.
- **The fallback is deterministic.** Whether or not the host supports structured choice, the underlying question stays readable and answerable.

When the framework is uncertain itself (genuinely close call between options), the recommendation should say so: *"Recommendation: I'd lean Option A, but it's a close call — if you have any reason to prefer B, that's totally defensible too."* Honesty about uncertainty is calibration the user can use.

**Decision questions vs. open-ended questions:**

The structured-choice contract applies to **decision questions** — questions where the user is choosing between alternatives (which library, which architecture, which approach, which database, which deployment target).

It does NOT apply to:

- Meta-layer questions (these are about the user's own reasoning and intent — see `02-meta-layer.md` for the "examples as inspiration" format)
- Confirmation questions ("Sound right?", "Approve?")
- Open-ended exploration ("What's the smallest version that would work?" — though if the framework can identify 2-3 plausible "smallest versions," it should offer them as inspiration examples following the meta-layer format)

When in doubt: if the framework can pre-populate sensible options, use the decision format. If it would have to invent options or constrain the user's answer artificially, use the open-ended format with examples as inspiration.

---

**Skill: `research`**

Fires when the questioning skill detects uncertainty. NOT a standalone skill — always invoked from within questioning, and returns control to questioning when complete.

Process flow:
```
digraph research {
    "Questioning invokes research" [shape=doublecircle];
    "Identify topic and 1-2 alternatives" [shape=box];
    "Fetch docs / probe options" [shape=box];
    "Build tradeoff brief (3 concrete differences for THIS project)" [shape=box];
    "Present brief to user" [shape=box];
    "Quiz user (2-3 questions)" [shape=box];
    "User answers quiz" [shape=box];
    "Log research outcome" [shape=box];
    "Return to questioning" [shape=doublecircle];

    "Questioning invokes research" -> "Identify topic and 1-2 alternatives";
    "Identify topic and 1-2 alternatives" -> "Fetch docs / probe options";
    "Fetch docs / probe options" -> "Build tradeoff brief (3 concrete differences for THIS project)";
    "Build tradeoff brief (3 concrete differences for THIS project)" -> "Present brief to user";
    "Present brief to user" -> "Quiz user (2-3 questions)";
    "Quiz user (2-3 questions)" -> "User answers quiz";
    "User answers quiz" -> "Log research outcome";
    "Log research outcome" -> "Return to questioning";
}
```

Key rules:
- The tradeoff brief is *project-specific*, not generic. "For *your* app, the difference between Postgres and SQLite that matters most is X, because Y."
- The quiz is not a test — it's a forcing function for the user to articulate their reasoning. There are no wrong answers, only unclear ones.
- If curated question banks exist for this topic, use them as seeds. Otherwise, generate on the fly.
- Always surface at least one tradeoff the user probably hasn't considered.
- Keep it to 2–3 minutes. Research should feel like a useful detour, not a lecture.
- If the user's quiz answers show they understood the tradeoffs, upgrade their profile for that concept.

---

**Skill: `decision-capture`**

Fires after all questioning is complete. Creates the learning artifact — this is the framework's main output alongside the plan.

Process flow:
```
digraph decision_capture {
    "Questioning invokes decision-capture" [shape=doublecircle];
    "Compile answers from questioning + research" [shape=box];
    "Present decision summary to user" [shape=box];
    "User approves?" [shape=diamond];
    "Append to .unvibe/decisions.md" [shape=box];
    "Update user profile (passive calibration)" [shape=box];
    "Invoke plan-generation skill" [shape=doublecircle];

    "Questioning invokes decision-capture" -> "Compile answers from questioning + research";
    "Compile answers from questioning + research" -> "Present decision summary to user";
    "Present decision summary to user" -> "User approves?";
    "User approves?" -> "Append to .unvibe/decisions.md" [label="yes"];
    "User approves?" -> "Compile answers from questioning + research" [label="no, revise"];
    "Append to .unvibe/decisions.md" -> "Update user profile (passive calibration)";
    "Update user profile (passive calibration)" -> "Invoke plan-generation skill";
}
```

The decision summary is presented first, using discrete approval choices:

- `Approve draft`
- `Revise wording`
- `Revise decisions`

Only the approved draft is appended.

The decision log entry includes:
- Date, work context, feature/task name
- Each question asked, the user's answer, and the reasoning
- For researched topics: alternatives considered, tradeoffs surfaced, choice made and why
- Assumptions explicitly named by the user (from meta-layer Q2)
- "What would make me throw this away" answer (from meta-layer Q3)
- Concepts the user engaged with (feeds calibration)

**The terminal state is invoking plan-generation.** This is the hard gate between process skills and implementation.

---

### Implementation skill

**Skill: `plan-generation`**

Fires after decision-capture is approved. Generates the implementation plan with the decision log layered in.

This skill borrows the `writing-plans` pattern from Superpowers: bite-sized tasks (2–5 minutes each), exact file paths, complete code, TDD steps, frequent commits. The framework-specific addition: each major task section references the relevant decision from the decision log. The user sees *why* alongside *what* and *how*.

**Decision log read scope:** Plan-generation reads ONLY the entry just written by the current session's decision-capture (1 entry). It does NOT read prior entries. See `13-decision-log-protocol.md` for the full reading rules.

Process flow:
```
digraph plan_generation {
    "Decision-capture invokes plan-generation" [shape=doublecircle];
    "Read decision log" [shape=box];
    "Generate implementation plan with decision context" [shape=box];
    "Present plan in sections for approval" [shape=box];
    "User approves section?" [shape=diamond];
    "All sections approved?" [shape=diamond];
    "Scope changed? (new decisions needed)" [shape=diamond];
    "Save plan to .unvibe/plans/" [shape=box];
    "Proceed to implementation" [shape=doublecircle];
    "Loop back to questioning skill" [shape=box];

    "Decision-capture invokes plan-generation" -> "Read decision log";
    "Read decision log" -> "Generate implementation plan with decision context";
    "Generate implementation plan with decision context" -> "Present plan in sections for approval";
    "Present plan in sections for approval" -> "User approves section?";
    "User approves section?" -> "All sections approved?" [label="yes"];
    "User approves section?" -> "Scope changed? (new decisions needed)" [label="no"];
    "Scope changed? (new decisions needed)" -> "Loop back to questioning skill" [label="yes"];
    "Scope changed? (new decisions needed)" -> "Generate implementation plan with decision context" [label="no, revise plan"];
    "Loop back to questioning skill" -> "Decision-capture invokes plan-generation" [label="new decisions captured"];
    "All sections approved?" -> "Present plan in sections for approval" [label="no, more sections"];
    "All sections approved?" -> "Save plan to .unvibe/plans/" [label="yes"];
    "Save plan to .unvibe/plans/" -> "Proceed to implementation";
}
```

Plan is saved to `.unvibe/plans/YYYY-MM-DD-<topic>.md`.

Critical loop-back rule: if the user's revision introduces a *new decision* that wasn't covered in questioning (e.g., "actually let's add auth"), the skill loops back to the questioning skill for that new scope. The plan doesn't finalize until the user understands what they're building.

## The full workflow graph

```
digraph unvibe_full {
    rankdir=TB;

    "User message" [shape=doublecircle];
    "Router: using-unvibe" [shape=box style=filled fillcolor=lightyellow];
    "Skip/bypass?" [shape=diamond];
    "Non-trivial work?" [shape=diamond];
    "Pass through (no framework)" [shape=box];
    "Questioning skill" [shape=box style=filled fillcolor=lightblue];
    "Research skill" [shape=box style=filled fillcolor=lightgreen];
    "Decision-capture skill" [shape=box style=filled fillcolor=lightblue];
    "Plan-generation skill" [shape=box style=filled fillcolor=lightyellow];
    "Implementation (agent proceeds normally)" [shape=doublecircle];

    "User message" -> "Router: using-unvibe";
    "Router: using-unvibe" -> "Skip/bypass?";
    "Skip/bypass?" -> "Pass through (no framework)" [label="vibe: prefix, paused, disabled"];
    "Skip/bypass?" -> "Non-trivial work?" [label="no skip"];
    "Non-trivial work?" -> "Pass through (no framework)" [label="trivial change"];
    "Non-trivial work?" -> "Questioning skill" [label="non-trivial"];
    "Questioning skill" -> "Research skill" [label="uncertainty detected"];
    "Research skill" -> "Questioning skill" [label="research complete, resume"];
    "Questioning skill" -> "Decision-capture skill" [label="all questions answered"];
    "Decision-capture skill" -> "Plan-generation skill" [label="user approves decisions"];
    "Plan-generation skill" -> "Questioning skill" [label="new scope discovered, loop back"];
    "Plan-generation skill" -> "Implementation (agent proceeds normally)" [label="plan approved"];
}
```

## State management

The CLI becomes internal plumbing — the state layer skills call, not the user-facing entry point.

**Per-repo state** (`.unvibe/` in repo root, created on first activation):
- `state.json` — pause/resume, enable/disable flags, current session context
- `decisions.md` — append-only decision log (the learning artifact)
- `plans/` — saved implementation plans
- `sessions/` — per-session interaction logs (optional)

**Per-user state** (`~/.unvibe/`):
- `profile.json` — skill calibration profile (see `05-skill-calibration.md`)
- `config.json` — global preferences (default skip behavior, verbosity)

**Cross-host portability:** Both directories are host-agnostic. Switching from Codex to Claude Code preserves profile and decision log. Only the skill files differ per host.

## Installation per host

### Codex (primary target)

```
npx skills add <framework>
```

Installs skill files into Codex's skill directory. Router fires automatically on every message once installed. No `init` needed per repo — `.unvibe/` is created on first activation. AGENTS.md is optional reinforcement, not the primary trigger.

### Claude Code

```
/plugin install <framework>
```

Or: `/plugin marketplace add <framework-marketplace>` then `/plugin install <framework>`.

### Cursor

```
/add-plugin <framework>
```

Or: manual skill file installation + `.cursorrules` reinforcement.

### Other hosts (OpenCode, Gemini CLI, etc.)

Follow Superpowers' model: provide per-host install instructions that fetch from the repo. Each host gets a thin adapter in its own directory (`.codex/`, `.claude-plugin/`, `.cursor-plugin/`, `.opencode/`).

### Key installation principle

Installation should never require the user to manually set up PATH, restart the agent, or run `init` in every repo. The skill fires because it's installed, not because the repo is configured. This is the core architectural fix over the original CLI design.

## Toggles

Toggle logic lives in the **router skill**, not in CLI flags.

**Per-invocation:** Router recognizes `vibe:`, `[skip]`, `--quick` in the user's message → passes through without activating process skills.

**Per-session:** User says "pause unvibe" → agent writes flag to `state.json` → framework doesn't fire until "resume unvibe."

**Per-repo:** User says "disable unvibe in this repo" → agent writes flag → framework doesn't fire in this repo until "enable unvibe."

**Global:** Uninstall the skill package. Or set a flag in `~/.unvibe/config.json`.

**Smart defaults (from the router):**
- Fire on: brain dumps >2 sentences, new files being created, >50 lines of change, mentions of adding/changing/swapping/refactoring/migrating, any architectural signals (auth, data, deploy, new dependencies)
- Don't fire on: one-sentence trivial requests, <10 line diffs touching no architectural signals, `hack/`/`wip/`/`spike/`/`experiment/` branches
- Bias: toward not firing when ambiguous. Under-fire annoys less than over-fire.
