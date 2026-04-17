# Verification And Learning

## What This Dimension Is

Verification and learning is the feedback-loop dimension. It asks how you will know the work is correct, how quickly you will know, and what uncertainty is still worth resolving before code hardens around a bad assumption.

## Why It Matters

People often confuse activity with progress. This dimension forces a better question: what is the fastest trustworthy signal that says "this works" or "this plan is wrong"? It is where Unvibe decides whether to stay in questioning or trigger `research`.

## Calibration Examples

### Beginner

- "How will you know this worked before you merge it, and what still feels fuzzy enough that you should learn it first?"
- "If this broke in production, what signal would tell you quickly?"

### Intermediate

- "What is the fastest trustworthy signal that this worked, and what uncertainty would most change the plan if resolved first?"
- "What can you reproduce, assert, or observe that would prove you fixed the right thing?"

### Senior

- "What's the tightest trustworthy feedback loop here?"
- "What unresolved uncertainty most changes the plan, and what is the cheapest way to collapse it?"

## Compression By Work Context

- Greenfield: Ask for fast local feedback plus the one uncertainty worth resolving before major buildout.
- New feature: Emphasize integration verification and production observability, not just local happy-path testing.
- Service or dependency swap: Make this heavy. You need proof that the new thing behaves like the old one where it matters.
- Refactor: Treat verification as the safety net. Snapshot tests, contract checks, or builds often matter more than new feature tests.
- Migration: Ask how you will measure completion, correctness, and drift while old and new systems coexist.
- Bug fix: Make this dominant. Reproduce first, then make the bug non-reproducible for the right reason, then add the assertion or test that would catch it again.
- Small change with architectural implications: Keep it active. A tiny change that affects auth, deploy, or data still needs a trustworthy validation loop.

## Uncertainty Markers That Should Trigger `research`

- The user says "I'll know when it feels right," "I'll test manually later," or "I think this is probably the right tool."
- The user has never used the technology involved and is guessing at validation strategy.
- The user says "not sure," "I've never used X," "what do you recommend?" or picks the first option with no reasoning.
- The user cannot distinguish between a fast signal and a trustworthy signal.
