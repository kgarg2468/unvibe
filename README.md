# Unvibe

Unvibe is a learning-first orchestration layer for AI-assisted coding. It pushes Codex CLI into a planning workflow before code generation so users learn the reasoning behind stack, architecture, failure-mode, and rollout choices instead of only receiving code.

## Repository layout

- `AI Learning Framework/` contains the planning and research docs.
- `unvibe-package/` contains the runnable package source, tests, build output, and package metadata.

## v0 scope

- Codex CLI adapter via `AGENTS.md`
- Content-first prompt/question engine for 5 core dimensions
- Local profile calibration with onboarding defaults and light passive refinement
- Append-only decision log with explicit revisions
- Research brief generation for curated comparisons plus generic fallback
- Plan and session-summary artifacts in repo-local `.unvibe/`

## Commands

```bash
unvibe init
unvibe ask --brain-dump "Add collaborative cursors to my existing Next.js app."
unvibe log --question "Why this realtime layer?" --answer "Use Yjs because..."
unvibe research Yjs --alternatives Automerge --brain-dump "Realtime cursors"
unvibe plan --brain-dump "Add collaborative cursors to my existing whiteboard app."
unvibe status
unvibe pause
unvibe resume
unvibe enable
unvibe disable
unvibe profile --visibility quiet --languages typescript,python
unvibe log edit --entry decision-... --reason "Changed requirements" --answer "Use Postgres."
```

## Local development

```bash
cd unvibe-package
npm install
npm test
npm run build
```

The CLI stores cross-repo profile and settings data in `~/.unvibe/`, and repo-local artifacts in `.unvibe/`.
