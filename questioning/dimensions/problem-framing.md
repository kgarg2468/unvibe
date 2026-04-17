# Problem Framing

## What This Dimension Is

Problem framing is the work of getting clear on what the user is actually trying to accomplish before locking into a solution. It covers the smallest version worth building, the real outcome that matters, and what is explicitly out of scope.

## Why It Matters

This is where accidental second projects get killed early. If you skip it, you end up implementing the first idea instead of solving the real problem, or you silently grow the scope until the work stops being teachable.

## Calibration Examples

### Beginner

- "What's the smallest version of this that would still feel like a win?"
- "Which part actually matters for the first version, and what are you okay leaving out?"

### Intermediate

- "What's the real user-visible outcome here, and what are the clearest non-goals?"
- "Is the request itself the problem, or is it trying to fix a symptom somewhere else?"

### Senior

- "What's the actual success condition, the non-goals, and the kill condition?"
- "If you did nothing, what pain would remain, and is this still the right slice to solve now?"

## Compression By Work Context

- Greenfield: Expand this dimension. Ask about the smallest lovable version, the actual outcome, non-goals, and what would make the project worth continuing.
- New feature: Tighten it. Confirm the user-visible outcome and the one thing that is explicitly not part of this feature.
- Service or dependency swap: Keep it light. The main framing question is why the swap exists and whether it solves a real pain or just replaces one tool with another.
- Refactor: Compress hard. The framing question becomes "what behavior must stay the same?" and "what counts as a successful cleanup?"
- Migration: Ask what "done" means in real terms. The question is not just "move it" but "when is the old path truly retired?"
- Bug fix: Use framing to separate root cause from symptom. The core move is "what exact behavior is wrong?" and "what would count as actually fixed?"
- Small change with architectural implications: Ask whether this is bigger than it looks. If the answer changes a contract, data shape, or dependency choice, keep framing active.

## Uncertainty Markers That Should Trigger `research`

- The user cannot tell whether they need the full request or a smaller slice.
- The user keeps referencing another product without knowing which part they actually want to copy.
- The user says things like "I think we need all of this," "not sure what the real first version is," or "what do people usually build first here?"
- The user is choosing between clearly different scope shapes and does not understand the tradeoff yet.
