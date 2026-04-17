# 02 — The Meta-Layer

Before the framework asks any dimension-specific questions, it runs three framing questions. These sit *above* the dimensions and apply universally — every work context, every skill level, every scope. They are short, they are always asked, and they set the frame for everything that follows.

The meta-layer is the single most important feature of the framework. If everything else were stripped away and only these three questions remained, the framework would still do most of its job.

## The three questions

### 1. "What am I actually trying to accomplish, and is this the smallest version of it?"

This question interrogates the *task itself*, not the solution. Beginners interpret the task as stated and immediately start planning how to build it. Experienced engineers treat the stated task as a first draft of the real problem and push back on it: is this the smallest change that gets 80% of the value, is the stated problem actually the real problem, what happens if we do nothing, what's already in the system that we could use instead.

This question is a direct application of two ideas:

- **Ousterhout's "design it twice."** The first idea is rarely the best. The act of generating a second option changes what you understand about the first. Even if you go with option A, having articulated option B makes option A a more informed choice.
- **Google SRE's "What, Why, How" framing.** The natural human instinct is to jump from "there's a problem" to "how do I fix it." Experienced engineers resist this. They sit with "what" and "why" long enough that "how" becomes a much smaller decision space.

### 2. "What am I assuming that might be wrong?"

Every plan rests on hidden assumptions — about what the data looks like, about how users will actually behave, about what the library actually does under the hood, about what will still be true in six months, about whether the thing the user asked for is what they actually need. Experienced engineers name these explicitly before coding. Beginners discover them the hard way, mid-debug, at 11pm, after the code is already written.

This question is the highest-leverage single question in the entire framework. It tends to surface exactly the things that would otherwise cause rework. Amazon's PR/FAQ process exists essentially to force this question at an organizational scale; this framework applies the same forcing function to a solo builder.

The question is also *diagnostic*: how specifically a user can name their assumptions is one of the cleanest signals of skill level. Beginners say "I'm not sure" or "I don't know what I'm assuming." Intermediates name one or two technical assumptions. Seniors name five, weighted by likelihood-of-being-wrong, and separate the cheap-to-validate ones from the expensive ones.

### 3. "What would make me throw this away in six months?"

This question forces thinking about the *failure modes of the plan itself*, not just the code. Will the team grow past this choice? Will this library be abandoned? Will the data model need to change when we learn something new? Will this decision be a one-way door we can't walk back through?

This is the question that separates Ousterhout's **tactical programming** from **strategic programming** — the willingness to spend a little time now to avoid being trapped later. Tactical programming is "make it work." Strategic programming is "make it work, and make sure working now doesn't prevent working differently later."

Jeff Bezos's "one-way doors vs. two-way doors" framing lives here too. A one-way door is a decision that's hard or impossible to reverse (database choice, data model, public API shape). A two-way door is a decision you can reverse in an afternoon (CSS framework, internal function naming, which linter to use). Experienced engineers spend disproportionately more thinking time on one-way doors. Beginners treat all decisions as equally weighty, which means they either overthink trivial choices or underthink critical ones.

## Why these three and not more

The temptation is to add more meta-questions. Resist it. The framework's dimension layer (see `03-dimensions.md`) handles the specific categories of thinking; the meta-layer is *not* trying to be comprehensive. It is trying to be the smallest set of questions that reliably shifts the user out of implementer-mode and into designer-mode.

Three is the right number because:

- One is not enough to create a shift — users answer quickly and get back to execution mode.
- Two leaves a structural gap — the three questions map cleanly onto *what*, *what's hidden*, and *what's later*, and removing any of them breaks the frame.
- Four or more starts to feel like a form, and forms get skipped or resented.

Three questions takes 90 seconds to answer and reframes the entire rest of the interaction.

## Behavior rules for the meta-layer

- **Always run it.** Every non-trivial interaction starts with the meta-layer. Trivial interactions (one-line fixes, obvious changes, prototype lane) skip the framework entirely, but if the framework fires at all, the meta-layer fires first.
- **Ask all three, in order.** Don't pick a subset. Don't reorder.
- **Ask them one at a time.** Each question is its own turn. Do not dump the full meta-layer into one giant message.
- **Accept short answers.** The meta-layer is about forcing the user to *form* an answer, not about extracting a comprehensive one. A one-sentence answer to each question is fine. A "not sure" answer is also fine — and diagnostically useful.
- **Use the answers as context for the dimension layer.** Everything the user says in the meta-layer should inform how the dimension-specific questions get generated. If the user says "I'm assuming my users will always have internet," the dimensions should surface offline-mode questions later. If the user says "I'd throw this away if we outgrow SQLite," the dimensions should surface data-model and migration questions.
- **Use the answers for passive skill calibration.** The specificity and vocabulary of the meta-layer answers is a strong early signal of the user's experience level. See `05-skill-calibration.md`.

## Format: examples as inspiration, not as picks

Meta-layer questions are open-ended by design — the framework can't pre-populate the user's own assumptions or what *they* would throw away in six months. But "open-ended" without scaffolding leaves beginners staring at a blank prompt with no idea where to start.

The format for every meta-layer question:

1. **A short framing line when useful**, to keep the tone conversational rather than form-like
2. **The question itself**, in plain language, with no jargon
3. **2–3 example answers as inspiration**, framed clearly as examples (e.g., "for instance, things like…") so the user understands these are starting points, not options to pick from
4. **An invitation to answer in their own words**, ideally with a short cue like `Reply in 1-3 sentences.`

Example for question 2 ("What am I assuming that might be wrong?"):

> *"What are you assuming about this that might turn out to be wrong? You don't need to be exhaustive — just one or two things that, if false, would change what we build.*
>
> *For instance, things like: 'users will mostly use this on desktop,' 'the average doc has fewer than 100 cursors,' 'we'll always have a stable connection to Supabase,' 'I won't need to support offline mode.'*
>
> *What comes to mind for you?"*

The examples are deliberately specific and a little varied — they teach by example what kind of answer the framework is looking for, without putting the user in a multiple-choice box. A beginner reads the examples and thinks "oh, *that's* what an assumption looks like." A senior reads the examples and thinks "those don't apply, but here's what does for me."

Critical rule: the framework **never asks the user to explain or define a concept**. Meta-layer questions are about the user's own intent, reasoning, and context — things only they can know. They are never tests of knowledge.
