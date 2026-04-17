# Change Strategy

## What This Dimension Is

Change strategy is how the work actually lands without trapping the user later. It covers reversible steps, rollout shape, rollback story, stop-the-bleeding moves, and whether the decision is a one-way door or still a two-way door.

## Why It Matters

Teams and solo builders alike overestimate "the code exists" and underestimate "the change is safely introduced." This dimension turns rollout and reversibility into part of the design, not an afterthought after the code looks correct.

## Calibration Examples

### Beginner

- "What's the smallest reversible step you could take first?"
- "If this interacts badly with something else, how do you back out cleanly?"

### Intermediate

- "What's the rollback story, and what would 'half shipped and stuck' look like?"
- "How do you make progress without turning this into a one-way door too early?"

### Senior

- "What's the smallest real step that keeps this a two-way door?"
- "Where do you stop the old path from accumulating new usage while the new path is rolling out?"

## Compression By Work Context

- Greenfield: Keep it light but present. There may be little to roll back from, but irreversible early choices still matter.
- New feature: Ask for a reversible first slice and a clean rollback story if the feature misbehaves in production.
- Service or dependency swap: Make this dominant. Swaps fail when the new path is not fully adopted or the rollback path is unclear.
- Refactor: Use it to keep the work incremental. Large refactor branches with no safe merge points are how refactors become rewrites.
- Migration: Treat this as the center of gravity. The questions are about phased rollout, adoption, completion, and shutting off the old path.
- Bug fix: Compress it to rollback and verification. Even bug fixes need a clean escape hatch if the hypothesis is wrong.
- Small change with architectural implications: Ask whether this tiny-looking change quietly closes a door that will be expensive to reopen later.

## Uncertainty Markers That Should Trigger `research`

- The user says "we'll just swap it all at once," "we can clean it up later," or "I don't really have a rollback plan."
- The user cannot tell whether a decision is easy to reverse.
- The user is choosing between rollout strategies and does not understand which one keeps optionality longer.
- The user asks for advice on incremental rollout, dual-running, feature flags, or migration sequencing.
