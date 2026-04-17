# Current State And Contracts

## What This Dimension Is

Current-state and contracts means understanding what already exists, what must remain true after the change, and which boundaries or callers will feel the change. It is the difference between "I read some code" and "I can predict what this system will do if I touch it."

## Why It Matters

Most non-greenfield mistakes come from treating a change as isolated when it is not. This dimension catches hidden callers, invariants, compatibility risks, and surprising behavior changes before they turn into regressions.

## Calibration Examples

### Beginner

- "What already exists that this touches, and what has to keep working afterward?"
- "If this changed in a surprising way, who or what would feel it first?"

### Intermediate

- "What contracts or invariants does this change depend on, and what must stay stable?"
- "Where is the real boundary of this problem, and who relies on that boundary right now?"

### Senior

- "Which contracts are load-bearing here, and what would be a breaking surprise to callers?"
- "What has to remain true after this change for the system to still be considered the same system?"

## Compression By Work Context

- Greenfield: Use this mostly for new interfaces and boundaries you are about to create. There is less legacy state, but there are still future callers to protect from bad APIs.
- New feature: Expand this dimension. Integration points, hidden callers, existing invariants, and backward compatibility are the main risks.
- Service or dependency swap: Make this one of the dominant dimensions. Interface differences, subtle behavior mismatches, and compatibility shims are the whole game.
- Refactor: Treat this as the refactor's safety contract. The important question is what observable behavior and invariants must not change.
- Migration: Use it to map old-system and new-system boundaries, ownership, and which consumers still rely on the old path.
- Bug fix: Use it to build the mental model first. The question is not "where is the broken line?" but "what system behavior am I misunderstanding?"
- Small change with architectural implications: Keep it heavy. Small changes that touch public interfaces, config, or data shape need this dimension even when the diff is tiny.

## Uncertainty Markers That Should Trigger `research`

- The user says "I don't really know what else calls this."
- The user is unsure whether an API, table, event, or module is private or public.
- The user cannot tell whether a proposed change is backward compatible.
- The user says "I think this is internal," "I haven't traced the callers," or "I'm not sure what has to stay the same."
