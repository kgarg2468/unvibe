# Unvibe

Unvibe is a learning-first skill bundle for coding agents. It keeps the speed of AI-assisted building, but inserts a structured pre-code phase where the agent asks the questions a senior engineer would ask before touching the keyboard, researches the choices the user is uncertain about, and records the reasoning behind the final plan so the user learns while the code ships.

## Repository layout

- `using-unvibe/` is the router skill. It is already built and should stay unchanged.
- `questioning/` contains the central questioning skill plus the five v1 dimension reference files.
- `research/` contains the uncertainty detour skill that returns control to questioning.
- `decision-capture/` contains the append-only decision-log skill and the handoff into planning.

## Install

### Codex

Codex is the primary target.

1. Copy the four skill directories into your local Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R /absolute/path/to/Unvibe/using-unvibe ~/.codex/skills/
cp -R /absolute/path/to/Unvibe/questioning ~/.codex/skills/
cp -R /absolute/path/to/Unvibe/research ~/.codex/skills/
cp -R /absolute/path/to/Unvibe/decision-capture ~/.codex/skills/
```

2. Start a new Codex session so the installed skills are loaded.
3. If you also use Superpowers, disable `using-superpowers` and `brainstorming`. Keep everything else.

### Claude Code

This repo does not yet ship a dedicated Claude Code plugin wrapper. For now, install the same four skill directories into the host's skill/plugin surface and keep `using-unvibe` as the router. If Superpowers is present, disable only `using-superpowers` and `brainstorming`.

### Cursor

This repo does not yet ship a Cursor marketplace package. For now, copy the same four skill directories into Cursor's equivalent skill/plugin location and keep the same coexistence rule: disable `using-superpowers` and `brainstorming`, keep the rest.

## Superpowers coexistence

Disable `using-superpowers` and `brainstorming`. Keep everything else.

Unvibe owns the learning-heavy pre-code phase. Superpowers still owns execution discipline after decision capture.

## Skip and bypass controls

- `vibe:` skips Unvibe for a single request and marks prototype lane
- `[skip]` does the same
- `--quick` does the same
- `pause unvibe` pauses activation in the repo by writing `.unvibe/state.json`
- `resume unvibe` resumes it
- `disable unvibe in this repo` disables the router for the repo
- `enable unvibe in this repo` re-enables it

On first use, the skills create only three state files:

- `~/.unvibe/profile.json`
- `.unvibe/state.json`
- `.unvibe/decisions.md`

Default `state.json` contents:

```json
{"enabled": true, "paused": false}
```

These are local runtime artifacts. Do not commit them as part of the bundle.

## How it works

The active chain is:

`using-unvibe` → `questioning` → `research` → `decision-capture` → Superpowers `writing-plans` → execution

The `research` step is conditional. It fires only when `questioning` detects real uncertainty.

`decision-capture` is the handoff point. It writes the append-only learning artifact, updates the calibration profile, and then passes the work into planning. If Superpowers `writing-plans` is unavailable, the agent generates the plan natively.

## Question UX in Codex

Unvibe is now Codex-first for question presentation:

- ask exactly one user-facing question per turn
- keep the three meta-layer questions open-ended
- render later product and architecture decisions as structured choices when the host supports them
- keep a deterministic plain-text fallback for hosts that do not

In Codex:

- the app should use the structured picker UI for discrete decisions
- the CLI should use the corresponding numbered selector flow
- approval in `decision-capture` should use the same choice-driven pattern

Outside Codex or outside structured-input contexts, the fallback format is:

```text
[Question]

Recommendation: [option], because [reason].

1. [Option]
[description]

2. [Option]
[description]

3. [Option]
[description]

Reply with 1, 2, 3, or your own answer.
```

## Notes

- The legacy `unvibe-package/` prototype has been removed. The active product path is the skill bundle in this repo root.
- This repo does not create a hosted service, dashboard, or account system. The product is the skill bundle.
