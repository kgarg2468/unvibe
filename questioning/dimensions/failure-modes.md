# Failure Modes

## What This Dimension Is

Failure modes means asking how this can go wrong, how bad each failure is, who notices first, and whether the default behavior is safe. It is not generic paranoia. It is the habit of designing for the believable bad case instead of only the happy path.

## Why It Matters

Beginners routinely ship things that work when used correctly and fall apart when timing, input, dependencies, or users get messy. This dimension surfaces the one failure mode most likely to cost trust if it is ignored.

## Calibration Examples

### Beginner

- "If this goes wrong in the most believable way, what breaks for users or data?"
- "Can you make the failure safer by default instead of hoping you catch it later?"

### Intermediate

- "What is the most likely bad failure here, and how do you make it safe by default?"
- "Which failures should you prevent, which should you handle, and which are okay to accept?"

### Senior

- "What new failure mode does this introduce, and how are you containing the blast radius?"
- "What dependency can fail under you here, and what should your component do when it does?"

## Compression By Work Context

- Greenfield: Keep it active, especially for dependencies, auth, payments, sync, and data writes. Ask what can fail before there is real traffic.
- New feature: Expand it. Features break existing flows more often than they break themselves.
- Service or dependency swap: Make this one of the dominant dimensions. The old system's weird edge cases are often the exact ones the new system fails on.
- Refactor: Focus on silent breakage. Refactors fail by preserving most behavior and breaking the one invariant nobody wrote down.
- Migration: Ask about partial completion, duplicated writes, stale reads, and "half moved and stuck" states.
- Bug fix: Ask whether this bug is one instance of a larger class of failure and how you will know if the class shows up elsewhere.
- Small change with architectural implications: Use this to catch "tiny diff, large blast radius" changes around auth, errors, deploy config, and public interfaces.

## Uncertainty Markers That Should Trigger `research`

- The user says "I'll handle errors later," "probably fine," or "I think the dependency just retries."
- The user does not know what the upstream or downstream failure behavior looks like.
- The user is comparing options and cannot tell which one fails more safely for this project.
- The user asks "what usually goes wrong with this?" or "what do you recommend here?" in a way that points to an unknown tradeoff.
