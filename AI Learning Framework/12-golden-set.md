# 12 — Golden Set: 10 Reference Scenarios

This document contains 10 hand-written example interactions that define the **voice and quality bar** for every prompt the framework generates. When the coding agent writes the questioning skill, the research skill, or any prompt that produces user-facing questions, it must match the format, tone, and depth shown here.

These scenarios are the test fixtures. Snapshot tests should compare the framework's output against these examples. Deviations in voice or format are bugs, not features.

## How to read each scenario

Each scenario contains:
- **Brain dump** — the user's actual message, in their voice
- **Context detection** — what the router infers
- **Meta-layer** — the three framing questions, in inspiration format, asked one at a time
- **Dimension questions** — the calibrated questions, one per turn, rendered as structured choices in Codex when available and as plain-text fallback here
- **Uncertainty markers** — what answers should trigger the research skill
- **Sample research brief** — what one research output looks like
- **Decision log entry** — what gets written to `.unvibe/decisions.md`

The prose option blocks below should be read as the fallback text rendering of the question content. In Codex app and CLI, the same questions should use the host's structured choice UI when it is available.

---

## Scenario 1: Beginner greenfield — first portfolio site

**User profile:** Chapman freshman, knows HTML/CSS, has done one or two CodePen projects, has never deployed anything live.

**Brain dump:**
> "I want to build a portfolio site to show off the projects I've worked on. I want it to look good and have a place to write blog posts."

**Context detection:**
- Greenfield project (no existing codebase mentioned)
- Brain dump implies: static-ish content site, design-conscious, blog functionality
- Profile says beginner — calibrate questions toward foundational decisions, more inspiration examples, more recommendations leaning to simpler options

**Meta-layer:**

> *"Before we pick anything, three quick questions to make sure we build the right thing.*
>
> *First — what's the smallest version of this that would feel like a win? You don't need to plan the whole site right now. Just the version you'd be excited to share with one person.*
>
> *For instance, things like: 'a homepage with my name and three projects,' 'just the blog with one post live,' 'a one-page resume that looks better than a PDF.'*
>
> *What would feel like a win for you?"*

After answer:

> *"Got it. Second — what are you assuming about how this works that might turn out to be wrong? Just one or two things that, if false, would change what we build.*
>
> *For instance, things like: 'I'll write blog posts in Markdown,' 'I want full control over the design,' 'I'll only update this every few months.'*
>
> *What comes to mind?"*

After answer:

> *"Last one — what would make you want to throw this away in six months and rebuild it?*
>
> *For instance: 'if I outgrow it and need a custom backend,' 'if updating it becomes painful,' 'if I want to switch from blog posts to a video format.'*
>
> *Anything come to mind?"*

**Dimension questions** (work context: greenfield; weight: heavy on problem framing, complexity management, decision artifact; light on integration/blast radius):

> *"How do you want to build the site itself? Three common ways:*
>
> *Option A — Next.js with a template*
> *A React framework that handles routing, blog posts from Markdown files, and deployment to Vercel in a few clicks. You'd start from a free template and customize it. The framework most professional dev portfolios use today.*
>
> *Option B — Astro with a template*
> *Similar to Next.js but optimized for content-heavy sites like blogs. Slightly simpler than Next.js for this use case because it's designed around static content. Also free and easy to deploy.*
>
> *Option C — A site builder like Framer or Webflow*
> *No code at all. You design visually in a browser, publish with one click. Good if your goal is "have a nice site" rather than "learn to build a site." Costs money after free tier.*
>
> *Recommendation: Astro, because you mentioned wanting both projects and blog posts, and Astro handles markdown blogs beautifully out of the box. Next.js is fine too — slightly more capable but slightly more to learn. Framer would skip the learning, which from your profile I think you actually want.*
>
> *Which feels right? Or want me to dig into any of them?"*

> *"Where will you host the blog posts? Three options:*
>
> *Option A — Markdown files in your repo*
> *You write posts as `.md` files alongside your code. Free, simple, version-controlled, no database. The blog ships when your code ships.*
>
> *Option B — A headless CMS like Sanity or Contentful*
> *You write posts in a separate web interface; your site fetches them. Costs money past free tier, but easier to write posts from your phone or laptop without touching code.*
>
> *Option C — A hosted platform like Substack or Medium with the homepage just linking to it*
> *You don't write blog code at all. The portfolio links out to your Substack. Easiest possible thing.*
>
> *Recommendation: Markdown files in your repo, because you said you'll only update it every few months and you're trying to learn. CMS adds complexity you don't need yet, and Substack is fine but you said you wanted full control over design.*
>
> *Which one?"*

> *"Where will you deploy it? Two main options for what we're building:*
>
> *Option A — Vercel*
> *Free for personal sites. Made by the team behind Next.js. Connects to your GitHub repo — every commit auto-deploys. Industry standard.*
>
> *Option B — Cloudflare Pages*
> *Also free, similar workflow. Slightly faster globally because of Cloudflare's network. Either is great for this.*
>
> *Recommendation: Vercel, because the docs and templates assume it. Cloudflare Pages is genuinely as good — pick that if you already use Cloudflare for anything else. Otherwise Vercel.*
>
> *Pick one?"*

> *"How will you know it's working? I mean before you launch — how will you preview your changes as you build?*
>
> *Option A — Local dev server (`npm run dev`)*
> *You run a command, your site appears at localhost:3000, changes show up live as you save files. Standard workflow.*
>
> *Option B — Preview deployments on every push*
> *Vercel/Cloudflare auto-builds a preview URL for every commit. You can share these. Slower feedback loop than local.*
>
> *Option C — Both*
> *Local for fast iteration, preview deployments to share work-in-progress with friends.*
>
> *Recommendation: Both. The local dev server is your moment-to-moment loop. Preview deployments are how you'll show your portfolio to people before launch. Setting up both takes about 5 minutes.*
>
> *Sound good?"*

**Uncertainty markers** (would trigger research skill):
- "Not sure what Astro is" → research skill explains static site generators
- "What's a CMS?" → research skill explains headless CMS vs. traditional
- "How is Vercel different from like... Netlify?" → research skill compares

**Sample research brief** (if user picks "what's the difference between Astro and Next.js really?"):

> *"For your portfolio specifically, here's what matters:*
>
> *1. **Build speed.** Astro builds your site to plain HTML by default, so pages load instantly. Next.js does more JavaScript by default, which is great for app-like sites but overkill for a portfolio.*
>
> *2. **Learning curve.** Astro's syntax is closer to plain HTML — easier to start. Next.js has more concepts (server components, client components, routing patterns) that pay off when you build complex apps.*
>
> *3. **Future flexibility.** If you later want to add a "comment on my blog post" feature or "submit a contact form that hits a database," Next.js scales to that more naturally. Astro can do it too but you'd be adding back complexity you skipped.*
>
> *Quick check: which of these matters most to you for *this* project — fast load, easy to learn, or future flexibility?"*

**Decision log entry:**

```markdown
## 2026-04-15 — Greenfield: Personal portfolio site

**Context:** First-time site builder, knows HTML/CSS, no deployment experience.

**Smallest version that would feel like a win:**
"A homepage with my name, three projects, and one blog post live."

**Assumptions named:**
- "I'll write blog posts in Markdown"
- "I want to update this maybe every couple months"

**What would make me throw this away:**
"If updating it becomes painful — if I have to remember a bunch of commands every time."

**Decisions:**

- **Framework: Astro.** Picked over Next.js because [user] said the portfolio is mostly content (projects + blog), and Astro is designed for that. Picked over Framer because [user] wants to learn how this works.
- **Blog content: Markdown files in the repo.** Picked over a headless CMS because update frequency is low and [user] wants control over design. Picked over Substack-as-blog because [user] wants the portfolio and blog visually unified.
- **Hosting: Vercel.** Picked over Cloudflare Pages because templates and docs assume Vercel. Both would work fine.
- **Feedback loop: Local dev + preview deployments.** Local for fast iteration, previews for sharing work-in-progress.

**Concepts engaged with this session:** static site generators, headless CMS vs. file-based content, deployment platforms, dev/preview workflows.
```

---

## Scenario 2: Intermediate greenfield — Pomodoro timer that syncs across devices

**User profile:** You (or someone with your profile) — has shipped React apps, knows TypeScript, comfortable with Supabase, has never built a real-time sync feature, has never thought hard about offline-first.

**Brain dump:**
> "I want to build a Pomodoro timer that syncs across my phone and laptop. Like, if I start a 25-minute timer on my laptop, my phone should show the same countdown. I use Pomodoros constantly and existing apps are all either ugly or don't sync right."

**Context detection:**
- Greenfield (no codebase mentioned)
- Multi-device sync is the headline feature, not an afterthought
- Profile says intermediate — questions can use real terminology, recommendations can lean to slightly more sophisticated options
- "existing apps are all either ugly or don't sync right" → strong signal of taste/quality bar

**Meta-layer:**

> *"Three quick questions before we pick anything.*
>
> *First — what's the smallest version of this that would actually replace your current Pomodoro app on day one?*
>
> *For instance: 'just the timer with sync, no history, no settings,' 'timer + the ability to label what I'm working on,' 'just one device for v1, sync in v2.'*
>
> *What would you actually use?"*

After answer:

> *"Second — what are you assuming about how sync works that might be wrong? You don't need to be exhaustive, just one or two things.*
>
> *For instance: 'both devices will be online when I switch,' 'I'm the only user — no shared timers with anyone else,' 'a few seconds of drift between devices is fine,' 'I'll always start the timer fresh, never resume from a closed laptop.'*
>
> *What comes to mind?"*

After answer:

> *"Last — what would make you want to throw this away in six months and rebuild differently?*
>
> *For instance: 'if it can't handle being offline,' 'if the sync delay is annoying,' 'if I want to share timers with a study group later,' 'if I outgrow Supabase for some reason.'*
>
> *Anything?"*

**Dimension questions** (work context: greenfield; weight: heavy on data/state, failure modes, change strategy; this is a sync feature, so failure modes dominate):

> *"For multi-device sync, where does the source of truth live? Three patterns:*
>
> *Option A — Server is the source of truth (Supabase row updated in real-time)*
> *Both devices read and write to the same database row. The phone subscribes to changes via Supabase realtime. If you start a timer on your laptop, the row updates, your phone sees the change in ~100ms.*
>
> *Option B — Last-write-wins with a local cache*
> *Each device keeps its own copy and syncs periodically. Simpler to build. Risk: if both devices change something at the same time, one update silently overwrites the other.*
>
> *Option C — CRDT (conflict-free replicated data type)*
> *Library handles conflicts automatically. Overkill for a Pomodoro timer — there's basically nothing to conflict on.*
>
> *Recommendation: Option A (Supabase as source of truth). For a single-user timer, the conflict model is trivial — only one user — so the server-as-truth pattern is the simplest correct option. CRDTs would be impressive engineering theater for a problem you don't have.*
>
> *Which one?"*

> *"What happens when a device is offline? Three options:*
>
> *Option A — Show "disconnected" and disable the timer*
> *Simplest. If you're on the subway with no signal, you can't start a Pomodoro. Probably bad given your use case.*
>
> *Option B — Run the timer locally, sync the result when reconnected*
> *Timer keeps counting on the offline device. When it comes back online, it tells the server "I just finished a 25-min session." Server merges.*
>
> *Option C — Run the timer locally AND sync optimistically*
> *Timer runs locally and any state changes are queued. When online, the queue flushes. Slightly more complex than B, handles edge cases better (like starting one timer offline, then starting a different one online).*
>
> *Recommendation: Option B. Your assumption was that you'll usually be online, and a simple "log it after the fact" pattern handles the occasional offline session without much code. Option C is correct for power users — could be a v2 feature.*
>
> *Pick one?"*

> *"What's your rollback story if the sync logic is wrong and starts losing timer history? Three options:*
>
> *Option A — Database backups + manual restore*
> *Supabase auto-backs up; if something goes wrong you restore from yesterday. Loses any data since the last backup.*
>
> *Option B — Append-only log, never delete*
> *Every timer event (start, pause, complete) writes a new row, never updates an existing one. Even if logic is wrong, you can replay history to reconstruct correct state.*
>
> *Option C — Soft deletes only, full history retained*
> *No row is ever deleted, only marked inactive. Easier to query than option B, slightly less robust to logic bugs.*
>
> *Recommendation: Option B (append-only log). For a timer app, this is overkill on day one but trivial to implement and gives you complete debuggability for the cost of one column. If you ever want to add history/stats features, the data is already there.*
>
> *Which one?"*

> *"How will you know sync is working correctly in production? Three options:*
>
> *Option A — Trust your local testing*
> *Test it on your devices, ship it, fix bugs as you find them. Fine for a personal app.*
>
> *Option B — Add a sync timestamp visible in the UI*
> *Show "last synced 2s ago" somewhere. Easy to spot when sync is broken because the timestamp stops updating.*
>
> *Option C — Log sync events to Supabase, query them when something feels off*
> *Every sync attempt logs success/failure. You can audit "did the laptop actually push this update?"*
>
> *Recommendation: Option B for v1, Option C if you start trusting this for real work. Option A is technically fine for personal apps but you'll lose data once and regret it.*
>
> *Pick one?"*

**Uncertainty markers:**
- "What's the difference between Supabase realtime and just polling?" → research skill
- "Should I use Postgres or just Redis for this?" → research skill (compares for this specific use case)
- "Not sure how to handle the timer when laptop is asleep" → triggers a deeper question, not necessarily research

**Decision log entry:**

```markdown
## 2026-04-15 — Greenfield: Cross-device Pomodoro timer

**Smallest viable version:**
"Timer with sync, ability to label what I'm working on, no history view yet."

**Key assumption named:**
"I'll usually be online when I switch devices, but I do sometimes start sessions on the subway."

**What would make me throw this away:**
"If sync delay becomes annoying, or if I can't use it offline at all."

**Decisions:**

- **Source of truth: Supabase row, server-authoritative.** Picked over local-cache patterns because there's only one user — no conflict model needed.
- **Offline behavior: timer runs locally, syncs result on reconnect.** Matches the named assumption (usually online, sometimes offline). Optimistic queue (Option C) deferred to v2.
- **History storage: append-only event log.** Picked because it's trivial to implement now and unlocks future stats features without a migration.
- **Sync verification: visible timestamp in UI.** Catches sync failures without writing custom monitoring.

**Concepts engaged:** server-authoritative sync, optimistic updates, append-only event logs, observability for sync correctness.
```

---

## Scenario 3: Intermediate greenfield — invoicing SaaS MVP

**User profile:** Self-taught dev, freelances, has shipped two paid client projects, comfortable with React + Next.js + Supabase, has never charged users for software, has never handled financial data.

**Brain dump:**
> "I want to build a simple invoicing tool for freelancers. Just send an invoice, get paid, track who's paid and who hasn't. There are existing tools but they're either expensive or too complicated for one-person businesses. I want to charge $5/month."

**Context detection:**
- Greenfield, but commercial product not personal — different stakes
- "I want to charge $5/month" → payment processing decisions, account systems, terms of service
- "handle financial data" implied — security and compliance concerns
- Profile says intermediate but with one giant gap: never built a paid product

**Meta-layer:**

> *"Three questions before we pick anything.*
>
> *First — what's the smallest version of this that someone would actually pay $5/month for? Not the version you'd be most excited to ship — the version someone would buy.*
>
> *For instance: 'create an invoice, send it as a PDF link, mark it paid manually,' 'create + send + accept payment via Stripe,' 'just the part where they don't have to chase clients for unpaid invoices.'*
>
> *What's the smallest payable version?"*

After answer:

> *"Second — what are you assuming that might turn out to be wrong? Especially about the business side, since this isn't a hobby project.*
>
> *For instance: 'freelancers will trust a new app with their banking info,' 'they'll pay $5/month before they've sent their first invoice,' 'I won't need to handle international tax stuff,' 'Stripe will let me do this without a real business entity.'*
>
> *What's lurking?"*

After answer:

> *"Last — what would make you shut this down or rebuild differently in six months?*
>
> *For instance: 'if I have to handle GDPR/SOC2 stuff,' 'if Stripe rejects my account,' 'if no one pays after the free trial,' 'if a single bug in the payment flow loses someone's invoice.'*
>
> *Anything?"*

**Dimension questions** (work context: greenfield commercial; weight: heavy on failure modes, change strategy, data/state; payments add a unique dimension):

> *"How are users going to authenticate? Three options:*
>
> *Option A — Email + password (Supabase Auth default)*
> *Built-in to Supabase, free, easy. Users have to remember a password.*
>
> *Option B — Magic links / passwordless (Supabase Auth)*
> *User enters email, gets a login link. No passwords to manage. Slight friction on every login.*
>
> *Option C — Google sign-in only*
> *One click. Excludes anyone without a Google account or who refuses to use Google for business stuff.*
>
> *Recommendation: Option B (magic links). For a B2B-ish tool used a few times a week, magic links match the usage pattern, eliminate password reset support tickets, and feel premium. Option A is fine but you'll spend time on password reset flows. Option C alone is too restrictive — fine to add alongside B later.*
>
> *Which one?"*

> *"How are you handling payment processing — both for *you* (charging users $5/mo) and for *your users* (collecting payment from their clients)?*
>
> *Option A — Stripe for both, two separate integrations*
> *You set up a Stripe account to collect subscription revenue. Your users either get paid via your Stripe (you take a cut) or you provide a "pay this invoice" link that uses Stripe Connect.*
>
> *Option B — Stripe for your subscriptions, your users handle their own payments outside the app*
> *You charge $5/mo via Stripe. Your users send invoices and tell their clients "Venmo me" or "wire me." App tracks paid/unpaid manually.*
>
> *Option C — Stripe for your subscriptions, Stripe Connect for users to receive client payments through your app*
> *Most powerful but most complex. You're now a payments middleman for thousands of dollars of someone else's money. Heavy compliance.*
>
> *Recommendation: Option B for v1. Option A/C is "real" SaaS but it adds 2-3 weeks of work, KYC requirements, and significant liability. v1 just tracks invoices and lets users mark them paid manually. If users love it and ask for in-app payment, build Connect later.*
>
> *Which one?"*

> *"Where does invoice data live, and what happens if you ever want to migrate it? Three options:*
>
> *Option A — Supabase Postgres, schema designed for invoices specifically*
> *Tables for users, clients, invoices, line items. Standard. Migrating to a different DB would require careful planning.*
>
> *Option B — Supabase + an event log*
> *Same as A, plus every action is also logged as an event ("invoice X created," "invoice X marked paid"). Auditable, debuggable, helpful if you ever need to prove "yes the user did mark this paid on Tuesday."*
>
> *Option C — Just a JSON blob per user*
> *Store the user's full invoice history as a JSON document. Fastest to build, hardest to query later, terrible for analytics.*
>
> *Recommendation: Option B. For a financial tool, the audit log isn't paranoia — it's how you debug "the user says I deleted their invoice but I didn't." Postgres + event log is the same shape as production financial systems use, costs nothing extra, and lets you sleep at night.*
>
> *Which one?"*

> *"What's your rollout plan? Three options:*
>
> *Option A — Build it all, then launch publicly*
> *Standard. Risk: you build features no one wants.*
>
> *Option B — Beta with 5-10 freelancer friends for a month, free*
> *You get feedback before charging. Risk: friends are too polite.*
>
> *Option C — Charge from day one with a 14-day free trial*
> *Validates "would they actually pay" instead of "do they like it." Risk: you launch with bugs that cost real users real money.*
>
> *Recommendation: Option B. The "would they pay" question is real but you don't need to charge to answer it — you can ask in the beta. Option C with money on day one is brave but risky for a financial tool. Option A is the most common and most regretted choice.*
>
> *Which one?"*

> *"How will you know if this thing is actually working in production? Three options:*
>
> *Option A — Wait for users to email you when something's broken*
> *Free, low-effort, terrible. By the time they email, they've lost trust.*
>
> *Option B — Sentry for errors + Supabase logs*
> *Errors get reported automatically. You can grep logs when something feels off.*
>
> *Option C — Sentry + a daily "money sanity check" script*
> *Plus a script that runs daily checking obvious sanity rules ("no invoice should have a paid date before its created date"). Catches data corruption before users do.*
>
> *Recommendation: Option C. For a financial tool, the cost of "users discover the bug for you" is loss of trust. The sanity script is 30 lines of code and the difference between "we caught it before anyone noticed" and "users emailing you angrily."*
>
> *Pick one?"*

**Uncertainty markers (will trigger research):**
- "Do I need an LLC to use Stripe?" → research skill
- "What's Stripe Connect?" → research skill
- "What does GDPR mean for me?" → research skill (lighter touch — surface the concern, recommend talking to a lawyer if serious)

**Decision log entry:**

```markdown
## 2026-04-15 — Greenfield: Invoicing SaaS for freelancers

**Smallest payable version:**
"Create + send invoice, manually mark paid, automated reminder for unpaid invoices."

**Assumptions named:**
- "Freelancers will pay $5/mo if I save them time chasing clients"
- "I don't need to handle international tax stuff for v1"
- "I don't need to be a real business entity to use Stripe — needs verification"

**What would make me shut this down:**
"If a payment bug ever loses someone's invoice, or if no one pays after trial."

**Decisions:**

- **Auth: magic links (Supabase).** B2B usage pattern; eliminates password reset support.
- **Payments (v1): Stripe for my subscription, users handle their own payment collection outside the app.** Defers Connect complexity until validated demand.
- **Data: Supabase + event log.** Audit trail for financial data is not optional, even for v1.
- **Rollout: free beta with 5-10 friends for a month, then $5/mo with 14-day trial.** Validates desirability before pricing.
- **Monitoring: Sentry + daily sanity check script.** Catches financial data corruption before users do.

**Open questions for next session:**
- Do I need an LLC to use Stripe at this scale?
- What's the minimum I need to do for GDPR if I have any EU users?

**Concepts engaged:** B2B auth patterns, payment intermediation, audit logs, financial data sanity checks, beta-then-paid rollout strategy.
```

---

## Scenario 4: Beginner feature — adding dark mode to a Next.js portfolio

**User profile:** Same Chapman friend from Scenario 1, now their portfolio is live, they want to add dark mode.

**Brain dump:**
> "I want to add dark mode to my portfolio. Should be pretty easy right?"

**Context detection:**
- New feature in existing codebase
- "Should be pretty easy right?" → user thinks this is trivial; framework should gently surface that it isn't
- Existing Next.js + Astro from Scenario 1's decisions
- Profile updated since scenario 1 — user has now shipped one project

**Meta-layer:**

> *"Quick three before we pick how to do it.*
>
> *First — what's the smallest version of dark mode that would feel done? Dark mode has a lot of hidden choices.*
>
> *For instance: 'a toggle button, persists across sessions, dark for everything,' 'just respects the system preference, no toggle,' 'toggle plus an in-between auto mode that follows system.'*
>
> *What's "done" for you?"*

After answer:

> *"Second — what are you assuming about how this works that might be wrong?*
>
> *For instance: 'I'll only have to change CSS,' 'images will look fine in dark mode,' 'my code blocks for blog posts will switch correctly,' 'visitors won't see a white flash before dark mode loads.'*
>
> *Anything come to mind?"*

After answer:

> *"Last — what would make you regret this in six months?*
>
> *For instance: 'if every new component I add I have to remember to style for both modes,' 'if it breaks on mobile,' 'if it conflicts with my image styles.'*
>
> *Anything?"*

**Dimension questions** (work context: feature in existing; weight: heavy on current-state/contracts, integration, complexity management — every existing component is now affected):

> *"How are you going to define your dark mode colors? Three options:*
>
> *Option A — CSS variables for everything, theme switches by setting a `data-theme` attribute*
> *You define colors once as variables. Switching themes changes one attribute on `<html>`. Standard modern approach.*
>
> *Option B — Tailwind's built-in dark mode classes*
> *You write `bg-white dark:bg-gray-900` on every element. Fast to build, but every component needs both classes.*
>
> *Option C — Two completely separate stylesheets*
> *Old-school, lots of duplication. Don't pick this.*
>
> *Recommendation: Option A (CSS variables). You said you'd regret it if every new component required remembering both modes — Option A solves that. You define semantic colors once (`--color-text`, `--color-bg`) and components just use them. Option B is fine but you'll write `dark:` everywhere forever.*
>
> *Which one?"*

> *"How does the user toggle the theme, and where do you store their preference? Three options:*
>
> *Option A — Toggle button + save to localStorage*
> *User clicks a button, theme changes, preference persists across visits. Standard.*
>
> *Option B — Just respect the OS setting (`prefers-color-scheme`), no toggle*
> *No button. If their phone is in dark mode, your site is dark. Simplest, but power users hate it.*
>
> *Option C — Toggle that supports light/dark/auto, default to auto*
> *Three states. Auto follows the OS. Toggle button cycles through. Best of both worlds, slightly more code.*
>
> *Recommendation: Option C. You said you wanted "toggle plus auto" earlier — this is exactly that. Slightly more code than A but matches what you actually wanted.*
>
> *Which one?"*

> *"How do you prevent the "white flash" — the brief moment when the page loads in light mode before dark mode kicks in?*
>
> *Option A — Don't worry about it for v1*
> *Easy. Looks slightly bad. Many sites have this problem.*
>
> *Option B — Inline a tiny script in `<head>` that sets the theme before the page renders*
> *Standard fix. ~10 lines of JavaScript that runs before anything renders.*
>
> *Option C — Server-side rendering of the initial theme based on a cookie*
> *Most correct. Most complex. Overkill for a portfolio.*
>
> *Recommendation: Option B. The white flash is a known problem with a known fix. Skipping it makes the site look amateurish to anyone who knows what to look for. The fix is short and you'll learn how it works.*
>
> *Pick one?"*

> *"What about images and code blocks — anything that might not switch automatically? Three options:*
>
> *Option A — Audit every image and code block manually*
> *Look at every page in dark mode, fix what looks bad. Tedious but thorough.*
>
> *Option B — Add a dark-mode-friendly border or background to images, switch code block themes via a library*
> *Catches the 90% case without auditing every page. Code block themes need a library like `shiki` or `prism` configured for both modes.*
>
> *Option C — Skip it for v1, fix as you notice problems*
> *Fine for a low-traffic portfolio.*
>
> *Recommendation: Option B. You explicitly named "code blocks not switching" as something you'd regret. Setting up syntax highlighting for both themes is a one-time fix. Image borders are a 5-line CSS rule.*
>
> *Which one?"*

**Uncertainty markers:**
- "What are CSS variables?" → research skill (foundational explanation, since user is a beginner)
- "How does `prefers-color-scheme` work?" → research skill
- "What's shiki?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Feature: Dark mode for portfolio

**Smallest "done" version:**
"Toggle with light/dark/auto, persists across sessions, code blocks switch correctly."

**Assumptions named:**
- "Images will look fine — but I should check"
- "I'll add a class and be done — turns out there's more"

**What would make me regret this:**
"If every new component requires remembering two modes."

**Decisions:**

- **Color system: CSS variables with semantic names.** Solves the "remember both modes" problem.
- **Toggle UX: light/dark/auto with localStorage.** Matches the named "smallest done" version.
- **No-flash fix: inline script in `<head>`.** The standard technique; learning opportunity.
- **Images and code blocks: dark-friendly borders + shiki for syntax highlighting.** Catches the cases user explicitly worried about.

**Concepts engaged:** CSS variables, `prefers-color-scheme`, FOUC prevention, syntax highlighting libraries.
```

---

## Scenario 5: Intermediate feature — adding research-loop to Use-Anything

**User profile:** You. CS student, builder, has shipped Use-Anything's spec and core CLI, now extending it with the research-loop concept (which you originally designed for Unvibe and want to surface in Use-Anything too).

**Brain dump:**
> "I want to add the research-loop pattern from Unvibe into Use-Anything. When a user asks Use-Anything to generate a SKILL.md for a tool and Use-Anything isn't sure between two approaches, it should surface the alternatives, build a tradeoff brief, and let the user pick before generating the skill."

**Context detection:**
- Feature in existing codebase (Use-Anything exists)
- Cross-project pattern reuse — non-trivial
- Profile says senior-ish for this domain (you designed both Use-Anything and Unvibe)
- Calibrate questions toward architecture and integration, skip foundational stuff

**Meta-layer:**

> *"Three quick ones.*
>
> *First — what's the smallest version of this that's an actual improvement to Use-Anything? You don't have to port the whole Unvibe research skill.*
>
> *For instance: 'just detect uncertainty in the existing flow and pause to ask the user,' 'detect + surface alternatives, no quiz,' 'full research-loop with quiz and decision logging.'*
>
> *What's the smallest real improvement?"*

After answer:

> *"Second — what are you assuming about how this fits into Use-Anything that might be wrong?*
>
> *For instance: 'the uncertainty detection logic from Unvibe will work in a different flow,' 'users will tolerate the pause,' 'the doc-fetching layer can be shared between projects,' 'the format that works for Unvibe questions will work for Use-Anything's tool comparisons.'*
>
> *What's worth flagging?"*

After answer:

> *"Last — what would make you tear this out in three months?*
>
> *For instance: 'if it slows down the common case where there's no uncertainty,' 'if maintaining two copies of research-loop logic across projects becomes annoying,' 'if Use-Anything's audience doesn't actually want to learn — they want fast generation.'*
>
> *Any of those land?"*

**Dimension questions** (heavy on integration, contracts, complexity management — this is feature-in-existing with cross-project implications):

> *"How does the research-loop logic actually live? Three options:*
>
> *Option A — Copy-paste the prompts from Unvibe into Use-Anything*
> *Fastest. Two copies of the same logic. Diverges over time.*
>
> *Option B — Extract a shared library both projects depend on*
> *Cleanest separation of concerns. Means you maintain a third package. More setup work upfront.*
>
> *Option C — Use-Anything depends on Unvibe's research module directly*
> *No new package. Coupling between two of your projects.*
>
> *Recommendation: Option A for v1. You've explicitly said you don't know yet whether the format that works for Unvibe will work for Use-Anything. Premature shared library would lock in an abstraction you haven't validated. Copy-paste is honest about the duplication and lets each project's version evolve. Extract to a shared library when both have stabilized.*
>
> *Which one?"*

> *"What contract does the new research-loop expose to the rest of Use-Anything? Three options:*
>
> *Option A — A function `maybeResearch(context) → either(decision, researchResult)`*
> *Existing flow calls this; if it returns a research result, the flow incorporates it. Functional, easy to test.*
>
> *Option B — An event emitter the flow subscribes to*
> *Research module emits "uncertainty detected," "research complete," etc. More flexible, harder to reason about.*
>
> *Option C — A middleware in the existing pipeline*
> *Research lives as a pipeline stage. Composes naturally with Use-Anything's existing pipeline architecture.*
>
> *Recommendation: Option C — middleware pattern. Use-Anything already has a 5-stage pipeline (Probe → Rank → Analyze → Generate → Validate). A new "Disambiguate" stage between Analyze and Generate fits naturally. Option A would be cleaner if Use-Anything weren't already pipelined; given that it is, fight the existing architecture and you'll regret it.*
>
> *Which one?"*

> *"How do you avoid slowing down the common case where there's no uncertainty? You named this as a regret risk. Three options:*
>
> *Option A — Always run uncertainty detection, even when result is "no uncertainty"*
> *Adds latency to every invocation. Probably small but real.*
>
> *Option B — Skip the disambiguate stage entirely if a confidence threshold isn't crossed*
> *Detection logic runs cheaply; expensive research-loop only fires past a threshold.*
>
> *Option C — Make it opt-in via a flag (`--research`)*
> *Default behavior unchanged. Users who want learning mode opt in.*
>
> *Recommendation: Option B. You want the learning to be the default, but you also explicitly worried about slowing the common case. A cheap confidence check + expensive research-loop only when needed gets both. Option C makes it easy to skip — which means most people will skip — which defeats the purpose.*
>
> *Pick one?"*

> *"How will you know if the addition is actually improving Use-Anything's outputs? Three options:*
>
> *Option A — Subjective: try it on a few tools, see if outputs feel better*
> *Fast, low-rigor. Fine for personal validation.*
>
> *Option B — Snapshot test: same input with and without research-loop, compare outputs*
> *Captures whether the loop actually changes outputs. Doesn't tell you if changes are improvements.*
>
> *Option C — A/B with a small set of users, measure perceived skill gain*
> *Closest to validating the actual goal. Hardest to set up.*
>
> *Recommendation: Option B for v1. The honest answer is you can't measure "skill gain" cheaply, but you can verify the research-loop is producing meaningfully different outputs from the no-research baseline. If outputs are identical, the loop isn't doing anything. If outputs differ, you can manually judge whether the differences are improvements.*
>
> *Which one?"*

**Uncertainty markers:**
- "Should I version the prompts?" → research skill
- "How do other CLI tools handle pluggable disambiguation?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Feature: Research-loop in Use-Anything

**Smallest improvement:**
"Detect uncertainty in the Analyze stage, surface 2-3 alternatives, let user pick before Generate runs. No quiz, no decision log — that's Unvibe-specific."

**Key assumptions named:**
- "The uncertainty detection logic ports from Unvibe — needs validation"
- "Users will tolerate a brief pause for high-impact ambiguities"
- "Doc-fetching can be shared eventually but not yet"

**What would make me tear this out:**
"If maintaining two copies of research-loop logic across projects becomes annoying."

**Decisions:**

- **Code organization: copy-paste from Unvibe for v1, extract shared library when both stabilize.** Avoids premature abstraction.
- **Architecture: new "Disambiguate" pipeline stage between Analyze and Generate.** Fits Use-Anything's existing pipeline pattern.
- **Common-case performance: cheap confidence check, full research-loop only past threshold.** Default-on but not always-on.
- **Validation: snapshot tests comparing with/without research-loop outputs.** Captures whether loop is doing anything; manual judgment for whether changes are improvements.

**Concepts engaged:** cross-project code reuse strategy (copy vs. shared lib), pipeline middleware patterns, opt-in vs. always-on for expensive features, snapshot testing for prompt-driven outputs.
```

---

## Scenario 6: Senior feature — adding webhooks to an existing API

**User profile:** Working engineer (~3 years experience) at a small startup. Has shipped APIs before. Has used webhooks as a consumer but never built the sender side.

**Brain dump:**
> "We need to add webhooks to our API so customers can subscribe to events like 'invoice.created' and 'payment.received'. They register a URL with us, we POST to it when events happen."

**Context detection:**
- Feature in existing codebase (API exists)
- "We" → professional context, team work
- Webhooks have well-known failure modes — calibrate hard on failure modes and contracts
- Profile says senior — assume they know HTTP, retries, idempotency vocabulary

**Meta-layer:**

> *"Three before we pick anything.*
>
> *First — what's the smallest version of this that's actually shippable to your customers?*
>
> *For instance: 'fire-and-forget POST, no retries, just two event types,' 'reliable delivery with retries for one event type,' 'full system with retries, signing, dead-letter queue, multiple event types.'*
>
> *What's the smallest shippable thing?"*

After answer:

> *"Second — what are you assuming about how customers will use this that might be wrong?*
>
> *For instance: 'they'll have HTTPS endpoints,' 'they'll handle duplicate events correctly,' 'they'll notice when their endpoint goes down,' 'they want events in order.'*
>
> *What's worth surfacing?"*

After answer:

> *"Last — what would make you regret this architecture in a year?*
>
> *For instance: 'if event volume 100x's,' 'if customers want to subscribe to specific resources not just types,' 'if you add a second microservice that also wants to send events,' 'if you need to support webhooks for high-stakes financial events with strict ordering.'*
>
> *Any of those?"*

**Dimension questions** (heavy on contracts, failure modes, change strategy, data — webhooks are 90% failure-mode design):

> *"How do you handle a customer's endpoint being down or slow? Three options:*
>
> *Option A — Fire and forget*
> *POST once, don't care about response. Simplest. Customers lose events when their endpoint hiccups.*
>
> *Option B — Synchronous retries with exponential backoff*
> *Try, wait, try again, wait longer. Blocks the event-emitting code while retries happen. Bad if many endpoints are slow.*
>
> *Option C — Async retry queue with exponential backoff and a dead-letter queue*
> *Event goes into a queue. Worker tries to deliver, retries with backoff, gives up after N attempts and parks in dead-letter for manual investigation.*
>
> *Recommendation: Option C. Webhooks where customers depend on them are not fire-and-forget — losing a "payment.received" event is real damage. Synchronous retries can cause cascading slowness when one customer's endpoint is bad. Async queue + DLQ is the standard architecture, and the DLQ gives you a way to debug "customer says they didn't get the event."*
>
> *Pick one?"*

> *"How do customers verify a request actually came from you and not a forged source? Three options:*
>
> *Option A — Don't sign requests, rely on URL secrecy*
> *Customer's webhook URL contains a random token. If you have the URL, you're trusted. Easy. Bad — URLs leak.*
>
> *Option B — HMAC signature in a header (Stripe-style)*
> *You sign each request body with a shared secret. Customer verifies the signature. Standard, well-documented pattern.*
>
> *Option C — mTLS*
> *Mutual TLS for the connection itself. Most secure, most painful for customers to implement.*
>
> *Recommendation: Option B. HMAC is the standard for a reason — it's secure, it's well-understood, and Stripe's docs serve as a free template for explaining it to your customers. mTLS is correct for high-security cases (banking), overkill here.*
>
> *Pick one?"*

> *"How do you handle event ordering and delivery guarantees? Three options:*
>
> *Option A — At-most-once, no ordering guarantees*
> *Some events may be lost; events may arrive out of order. Simplest. Bad for state-tracking events.*
>
> *Option B — At-least-once, no ordering guarantees*
> *Events may be delivered multiple times; customer must be idempotent. Standard for most webhook systems.*
>
> *Option C — Exactly-once, in order*
> *Mathematically hard, especially over the public internet. Most webhook systems don't promise this.*
>
> *Recommendation: Option B. The webhook industry has converged on at-least-once + customer-handles-idempotency for good reason — exactly-once is impractical, at-most-once silently loses data. Document the contract clearly so customers know to dedupe by event ID.*
>
> *Pick one?"*

> *"How do you let customers test their integration? Three options:*
>
> *Option A — They test against your real API, you fire real events*
> *Easiest for you. Customers have to do real actions to trigger events.*
>
> *Option B — A "send test event" button in your dashboard*
> *Customer can fire a synthetic event of any type. Standard.*
>
> *Option C — A full webhook simulator (replay events, simulate failures)*
> *Best DX, more work to build.*
>
> *Recommendation: Option B for v1. The "send test event" pattern is what every major webhook provider has, and it's the minimum customers expect. Option C is great for v2.*
>
> *Pick one?"*

> *"How will you know if customers' endpoints are failing? Three options:*
>
> *Option A — They'll email you when they notice*
> *Bad. Slow. Expensive in support.*
>
> *Option B — Track delivery success rate per customer; surface failures in your dashboard*
> *They can see "your endpoint failed 12% of events this week."*
>
> *Option C — Same as B + auto-email customers when their endpoint enters a degraded state*
> *Proactive. Customers love it. Slightly more code.*
>
> *Recommendation: Option C. The point of webhooks is reliability; the second-order effect is helping customers notice when their endpoint is broken. Stripe famously does this and customers cite it as a quality differentiator.*
>
> *Pick one?"*

**Uncertainty markers:**
- "Should I use SQS or Redis for the queue?" → research skill compares
- "How do other people structure event payloads — flat or nested?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Feature: Customer-facing webhook system

**Smallest shippable version:**
"Two event types (invoice.created, payment.received), async delivery with retries, HMAC signing, basic dashboard for managing endpoints."

**Assumptions named:**
- "Customers will handle duplicate events correctly — needs to be in onboarding docs"
- "Most customers will have HTTPS endpoints, but we should document the requirement"
- "Customers want strict ordering — but they're going to ask for it"

**What would make me regret this:**
"If event volume 100x'd and the queue couldn't keep up, or if we needed strict ordering later."

**Decisions:**

- **Delivery: async queue + retry with exponential backoff + DLQ.** Standard webhook reliability pattern.
- **Authentication: HMAC signature in header.** Stripe-style, well-documented for customers.
- **Delivery guarantees: at-least-once, customer responsible for idempotency.** Industry standard, document clearly.
- **Testing: dashboard "send test event" button.** Minimum customers expect.
- **Endpoint health: track delivery success rate, auto-email on degradation.** Proactive notification matches the reliability promise.

**Concepts engaged:** async retry queues, dead-letter queues, HMAC signing, delivery guarantees (at-least-once vs. exactly-once), idempotency contracts, webhook health monitoring.
```

---

## Scenario 7: Intermediate refactor — reorganizing a messy components folder

**User profile:** Self-taught dev, has been building a Next.js app for 6 months. The `components/` folder has 40+ files at the top level with inconsistent naming.

**Brain dump:**
> "My components folder is a disaster. Everything is at the top level, names are inconsistent, some files have multiple components, and I can't find anything anymore. I want to reorganize it."

**Context detection:**
- Refactor (explicit)
- "Reorganize" — high risk of becoming a rewrite if not careful
- Existing codebase, presumably tests exist or don't (need to ask)
- Profile says intermediate — calibrate to "you know components, do you know how to refactor safely?"

**Meta-layer:**

> *"Three before we pick how.*
>
> *First — what's the smallest version of "reorganized" that would make this feel less broken? Reorganizing all 40 files is a big undertaking that could span days.*
>
> *For instance: 'just group by feature, leave names alone,' 'group by feature + rename inconsistencies,' 'full restructure: feature folders + naming convention + split multi-component files.'*
>
> *What's the smallest improvement?"*

After answer:

> *"Second — what are you assuming about how the existing components are used that might be wrong?*
>
> *For instance: 'I know everywhere each component is imported,' 'no components are referenced by string-based dynamic imports,' 'no components are imported from outside the components folder by other tools,' 'I don't have any tests that import these by path.'*
>
> *What might bite?"*

After answer:

> *"Last — what would make you regret this in a few weeks?*
>
> *For instance: 'if I broke prod and didn't notice,' 'if I have to keep restructuring as the project grows,' 'if the new structure makes sense to me but not to anyone else who looks at the code,' 'if I miss imports somewhere and pages 404 in production.'*
>
> *Anything?"*

**Dimension questions** (refactor: heavy on current-state/contracts, verification, change strategy — preserving behavior is the whole game):

> *"What's the actual organizing principle for the new structure? Three options:*
>
> *Option A — By feature/domain (`components/auth/`, `components/dashboard/`, etc.)*
> *Components grouped by what they're for. Most popular pattern in modern React.*
>
> *Option B — By component type (`components/buttons/`, `components/forms/`, etc.)*
> *Grouped by what they are. Easy to find a "button," harder to find "all the auth-related stuff."*
>
> *Option C — Hybrid: feature folders + a shared `ui/` for primitives*
> *Feature-specific stuff in feature folders, generic primitives (Button, Input, Modal) in `ui/`.*
>
> *Recommendation: Option C. Grouping by feature is right for everything except generic UI primitives — those genuinely are reused across features. Option A alone leads to "where do I put the Button used in 5 features" debates. Option B groups by shape, not purpose, which makes navigation harder.*
>
> *Which one?"*

> *"How do you actually do the move without breaking imports? Three options:*
>
> *Option A — Move files manually, fix imports as you find broken ones*
> *Slow. Error-prone. You'll miss some.*
>
> *Option B — Use VSCode's "move file" feature which auto-updates imports*
> *VSCode/Cursor can move files and update all imports automatically. Catches the obvious cases.*
>
> *Option C — Same as B + a codemod for the renaming pass*
> *If you're also renaming files (PascalCase to kebab-case, etc.), a codemod handles the rename across all imports at once.*
>
> *Recommendation: Option B. You said the smallest improvement is "group by feature, leave names alone" — Option C is overkill until you commit to renaming. VSCode's move-and-update-imports is the safest mechanical approach.*
>
> *Pick one?"*

> *"How do you verify nothing broke? Three options:*
>
> *Option A — Run the app, click around manually*
> *Fine for small apps. Will miss things in larger apps.*
>
> *Option B — TypeScript build + ESLint pass + manual click-through*
> *TypeScript catches missing imports. ESLint catches obvious issues. Manual catches runtime stuff.*
>
> *Option C — Same as B + actual end-to-end tests (Playwright or similar)*
> *Catches the most. Requires you to have or write tests.*
>
> *Recommendation: Option B. TypeScript will catch 95% of import issues — anything dynamically imported by string is what to manually verify. End-to-end tests (Option C) are the right answer if you already have them; writing them just for this refactor is the tail wagging the dog.*
>
> *Which one?"*

> *"What's your rollback plan if you ship the refactor and something's wrong? Three options:*
>
> *Option A — Single commit, revert if needed*
> *One big commit. Easy to revert. Hard to bisect if a bug shows up later.*
>
> *Option B — Multiple commits (one per moved feature folder), can revert subsets*
> *Each feature folder's move is its own commit. If one breaks, you can revert just that folder.*
>
> *Option C — Do it on a long-lived branch, ship after extensive testing*
> *Big-bang merge. Risky for a refactor.*
>
> *Recommendation: Option B. You explicitly said you'd regret it if you broke prod and didn't notice. Per-folder commits give you maximum bisect ability — if a bug appears two weeks later, you can find which folder's move caused it. Option C is the "refactor as rewrite" trap.*
>
> *Pick one?"*

> *"How do you stop the new structure from rotting back to its old state? Three options:*
>
> *Option A — Discipline. Just remember to follow the convention.*
> *Doesn't work. You will forget.*
>
> *Option B — A README in `components/` documenting the convention*
> *Helps. Future-you and contributors can read it. Still requires discipline.*
>
> *Option C — ESLint rule enforcing imports from feature folders match a pattern*
> *Mechanical. Annoying to set up. Catches violations automatically.*
>
> *Recommendation: Option B for v1. You're a solo dev — discipline + a README is enough. Option C is for teams. Don't add tooling complexity until the simple version stops working.*
>
> *Pick one?"*

**Uncertainty markers:**
- "What's a codemod?" → research skill (lighter touch)
- "How does VSCode's move file actually update imports?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Refactor: Reorganize components folder

**Smallest improvement:**
"Group by feature with a shared `ui/` folder for primitives. Don't rename anything yet."

**Assumptions named:**
- "I know all the import paths — but I have one or two dynamic imports I should audit"
- "TypeScript will catch missing imports — true if I run a full build"

**What would make me regret this:**
"If I broke prod and didn't notice, or if I miss imports for dynamically-loaded components."

**Decisions:**

- **Structure: hybrid (feature folders + `ui/` for primitives).** Right tradeoff for solo project.
- **Move technique: VSCode/Cursor move-and-update-imports.** Mechanical safety.
- **Verification: TypeScript build + ESLint + manual click-through of dynamic imports.** Right effort for solo project without existing E2E tests.
- **Commit strategy: per-folder commits, one feature at a time.** Maximum bisect ability if regression shows up later.
- **Maintenance: README documenting the convention.** Discipline + docs is enough for solo work; ESLint rule is overkill.

**Concepts engaged:** feature-based organization, codemods, mechanical refactoring tools, per-commit refactor strategy, refactor-vs-rewrite distinction.
```

---

## Scenario 8: Senior refactor — extracting a reusable module from AEGIS

**User profile:** You. Built AEGIS for the Chapman hackathon (PPO-based RL cybersecurity agent, network simulation, GNN+LSTM policy). Want to extract the network simulation layer as a reusable module for other RL projects.

**Brain dump:**
> "AEGIS has a really solid network simulation — Chapman's network topology, attack scenarios, MITRE mappings. I want to extract it into a standalone library so I can use it for other RL projects and so others can use it. But I don't want to break AEGIS or do a full rewrite."

**Context detection:**
- Refactor with intent to reuse
- High-skill audience, complex codebase
- Risk: extraction-as-rewrite, breaking AEGIS, premature abstraction
- Calibrate to senior depth, skip foundational explanations

**Meta-layer:**

> *"Three before we pick how.*
>
> *First — what's the smallest version of "extracted" that would actually let you use the simulation in a second project?*
>
> *For instance: 'lift the simulation files into a folder, document the interface, leave AEGIS unchanged,' 'lift + clean interface boundaries + AEGIS imports from the new location,' 'full standalone package with tests and docs that can be installed via pip.'*
>
> *What's the smallest real win?"*

After answer:

> *"Second — what are you assuming about the simulation that might be wrong?*
>
> *For instance: 'the interface is already clean,' 'the simulation doesn't have hidden coupling to PPO-specific stuff,' 'configuration is generic enough that other RL setups will accept it,' 'the MITRE mappings are general-purpose and not Chapman-specific.'*
>
> *What's worth flagging?"*

After answer:

> *"Last — what would make you regret this in three months?*
>
> *For instance: 'if maintaining the extracted library and AEGIS as separate things doubles your work,' 'if the abstraction was wrong and now you have to refactor twice,' 'if external users want features that conflict with what AEGIS needs,' 'if you never actually use it for a second project.'*
>
> *Any of those?"*

**Dimension questions** (heavy on contracts, complexity management, change strategy — extraction is mostly about getting the boundary right):

> *"What's the actual scope of "extracted"? Three options:*
>
> *Option A — Internal extraction (in-repo folder with clean interface)*
> *Move the simulation into a clearly-bounded folder inside AEGIS. Define a clear interface. Don't publish it. AEGIS uses it via internal import.*
>
> *Option B — Sibling repo (separate repo, AEGIS depends on it via local path or git)*
> *New repo, AEGIS depends on it. You can develop both in parallel. Not a real package yet.*
>
> *Option C — Published package (pip-installable, versioned)*
> *Full standalone library. Versioned releases. AEGIS pins a version. Others can install.*
>
> *Recommendation: Option A. You explicitly named "extraction-as-rewrite" risk. Internal extraction lets you iterate on the interface without the friction of versioning, package publishing, and dependency management. When you actually start the second project, you'll know whether the interface is right. Then promote to Option B or C.*
>
> *Pick one?"*

> *"How do you find the right interface boundary without doing it three times? Three options:*
>
> *Option A — Best-guess from the existing code structure*
> *Look at what's currently exposed, draw a line. Likely wrong because current structure was implicit.*
>
> *Option B — Sketch the API by writing the second project first (tracer-bullet)*
> *Write a minimal second use case that imports from a hypothetical clean API. The sketch reveals what the API needs to be.*
>
> *Option C — Apply Ousterhout's "design it twice" — two interface designs, pick the better one*
> *Design two different interfaces (e.g., "give me an env, I give you observations" vs. "give me a step function, I drive the loop"). Compare.*
>
> *Recommendation: Option B + Option C. Option B is the most honest way to find the right interface — second use case forces clarity. Option C complements it by making sure the first idea isn't locked in. Cost is a couple of hours sketching the second project. Cheap insurance.*
>
> *Pick one?"*

> *"How do you keep AEGIS working while the extraction is in progress? Three options:*
>
> *Option A — Refactor AEGIS in-place, update imports as you go*
> *Big-bang. Risk of half-broken AEGIS for days.*
>
> *Option B — Create the extracted folder alongside, AEGIS keeps using its current paths until extraction is verified*
> *Two copies temporarily. AEGIS is never broken. When extraction is verified, swap AEGIS to use new paths.*
>
> *Option C — Symlink or path alias the new location to the old*
> *Trick AEGIS into using new paths without changing its imports. Simulates the swap.*
>
> *Recommendation: Option B. AEGIS is your hackathon submission and possibly something you'll show to inference.net — keeping it working while you extract is non-negotiable. Two copies for a few days is fine; you delete the old when the new is verified.*
>
> *Pick one?"*

> *"What invariants must hold after extraction? Three options:*
>
> *Option A — "AEGIS still trains successfully and produces equivalent metrics"*
> *End-to-end behavior preservation. Slowest to verify (full training run).*
>
> *Option B — "Simulation outputs match byte-for-byte for known inputs"*
> *Fast verification via snapshot tests on simulation outputs. Doesn't catch training-time issues.*
>
> *Option C — Both: snapshot tests first, training-equivalence as final check*
> *Snapshot tests as you refactor (fast feedback), full training run as the merge gate.*
>
> *Recommendation: Option C. Snapshot tests give you a tight refactor loop. The training-equivalence check is the real "did I break AEGIS" answer. Doing only snapshots is fast but risks subtle training-time differences. Doing only training is too slow to iterate against.*
>
> *Pick one?"*

> *"What's the rollback story if the extraction breaks AEGIS in a way the tests don't catch? Three options:*
>
> *Option A — Git revert*
> *Standard. Loses any genuine improvements made during extraction.*
>
> *Option B — Branch the extraction, only merge when fully verified, can abandon branch*
> *Extraction lives on a branch until it's done. Main is always working AEGIS.*
>
> *Option C — Feature flag the extraction, toggle between old/new code paths*
> *Both code paths exist; runtime flag picks. Maximum safety, most code complexity.*
>
> *Recommendation: Option B. Feature flagging is the right answer for production code paths users see; for an internal refactor of your own RL project, branch + verify is enough. Abandon-the-branch is the rollback.*
>
> *Pick one?"*

**Uncertainty markers:**
- "How do other RL libraries structure their environment interfaces?" → research skill (compare gym, pettingzoo)
- "Should this be a Gym environment specifically?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Refactor: Extract AEGIS network simulation

**Smallest extraction:**
"In-repo extraction with clean interface. AEGIS imports from new location. No standalone package yet."

**Assumptions named:**
- "Interface is mostly clean — but PPO-specific assumptions probably leaked in"
- "MITRE mappings are general — needs verification before claiming it as a library feature"

**What would make me regret this:**
"If I extract and never actually start a second project that uses it — premature abstraction."

**Decisions:**

- **Scope: internal extraction (in-repo, no published package).** Defer real packaging until second use case validates the interface.
- **Interface design: tracer-bullet (sketch a second project that imports from the new API) + design it twice.** Forces honest interface, not "what's currently exposed."
- **Migration strategy: extract alongside, AEGIS keeps current paths until verified, then swap.** AEGIS is never broken.
- **Verification: snapshot tests for fast iteration + full AEGIS training run as merge gate.** Both fast feedback and real validation.
- **Rollback: branch-based, abandon if verification fails.** Sufficient for personal-project refactor.

**Concepts engaged:** premature abstraction risk, tracer-bullet API design, "design it twice," extraction-vs-rewrite, snapshot testing as refactor safety net, behavior-preservation invariants for ML refactors.
```

---

## Scenario 9: Intermediate bug fix — "auth works locally but breaks in production"

**User profile:** Self-taught, has a Next.js + Supabase app live in production. Auth works in local dev but users report being logged out unexpectedly in prod.

**Brain dump:**
> "My Supabase auth is broken in production. Users get logged out randomly, but it works fine on my local machine. I've been adding console.logs everywhere but I can't figure it out."

**Context detection:**
- Non-trivial bug fix
- "Works locally, breaks in prod" — classic environment/state problem
- "Adding console.logs everywhere" → user is in symptom-fixing mode
- Profile says intermediate, but bug-finding is a different skill from building

**Meta-layer:**

> *"Three before we touch anything.*
>
> *First — what's the smallest version of "fixed" that would actually solve the user complaints? Sometimes "fix the bug" and "make the symptom stop" are different.*
>
> *For instance: 'users stop reporting being logged out,' 'I understand the root cause and have fixed it,' 'I've also added monitoring so I'd know if this regresses.'*
>
> *What does "done" look like for you?"*

After answer:

> *"Second — what are you assuming about why this is happening that might be wrong? You're probably already debugging based on a hypothesis.*
>
> *For instance: 'it's a session timeout issue,' 'it's an environment variable mismatch,' 'it's a cookie/SameSite problem,' 'it's something with the Supabase client config differing between envs,' 'it's actually multiple bugs and not one.'*
>
> *What's your current best guess?"*

After answer:

> *"Last — what would make you regret your fix in a month?*
>
> *For instance: 'if I patch the symptom but the real bug shows up somewhere else,' 'if the fix is environment-specific and breaks something else in dev,' 'if I never figure out the actual root cause and this happens again with a different feature.'*
>
> *Anything?"*

**Dimension questions** (bug fix: heavy on problem framing, current-state model, verification, failure modes — root cause vs. symptom is the whole game):

> *"Before changing any code, how do you build a mental model of what's actually happening? Three options:*
>
> *Option A — Keep adding console.logs and rebuilding*
> *What you're doing. Slow, easy to lose information, hard to capture state at the right moment.*
>
> *Option B — Reproduce in production with structured logging in place*
> *Add temporary structured logs around the auth flow, deploy, wait for the bug, read logs.*
>
> *Option C — Reproduce locally by simulating production conditions (env vars, headers, domain, cookie settings)*
> *If you can reproduce it locally, debugging speed goes up 10x. Sometimes possible, sometimes not.*
>
> *Recommendation: Option C first, Option B if Option C fails. Most "works in dev, breaks in prod" bugs are environment-config differences (cookies, CORS, env vars) that you can simulate locally if you know what to look for. Console.logs in prod (Option A) is what you fall back to when you can't reproduce. The order matters because each step is faster than the next.*
>
> *Which one?"*

> *"What are the most likely classes of cause for "auth works in dev, breaks in prod"? Three categories worth investigating in order:*
>
> *Option A — Cookie/session config differences (SameSite, Secure flag, domain, HttpOnly)*
> *Most common cause for this exact symptom. Browsers treat cookies differently across HTTP/HTTPS, across subdomains, across SameSite settings.*
>
> *Option B — Environment variable mismatch (wrong Supabase URL/key in production)*
> *Easy to check, easy to miss. If prod is pointing at the wrong Supabase project, you'd see exactly this.*
>
> *Option C — Server vs. client session sync (Next.js SSR with Supabase auth has known gotchas)*
> *If you're using server components or middleware with Supabase, the session can desync between server and client.*
>
> *Recommendation: Investigate in order A → B → C. A is the most common cause for "random logouts" specifically. B is fastest to verify. C is the trickiest and worth the deepest dive if A and B come up clean.*
>
> *Want to start with A — checking cookie settings between dev and prod?"*

> *"How will you know you've actually fixed the root cause and not just made the symptom go away? Three options:*
>
> *Option A — The bug stops happening for a week*
> *Time-based. Doesn't tell you why it stopped.*
>
> *Option B — You can explain the bug to someone else end-to-end (cause → mechanism → fix)*
> *Forces you to actually understand it. If you can't explain it, you don't really know.*
>
> *Option C — Same as B + you've added a test or assertion that would catch this class of bug if reintroduced*
> *Best. Verifies understanding AND prevents regression.*
>
> *Recommendation: Option C. You named "I never figure out the root cause and this happens again" as a regret risk — Option C is the antidote. Writing the test forces you to characterize the bug in a way that catches it again.*
>
> *Which one?"*

> *"How do you make sure your fix doesn't break something else? Three options:*
>
> *Option A — Test the fix locally, deploy, hope*
> *Standard. Risky for auth.*
>
> *Option B — Test locally + verify on a staging environment that mirrors prod*
> *Catches environment-related regressions before they hit users.*
>
> *Option C — Same as B + canary deploy (5% of traffic gets the new version, monitor errors)*
> *Catches issues that only appear under real production load/traffic patterns.*
>
> *Recommendation: Option B. You probably don't have a canary setup; staging that mirrors prod (same env vars, same domain config) catches 90% of "works locally" bugs. Set up staging if you haven't — it's a one-time investment that pays back constantly.*
>
> *Pick one?"*

**Uncertainty markers:**
- "What's SameSite?" → research skill explains cookie attributes
- "How do I set up a staging env on Vercel?" → research skill or doc lookup
- "What's a canary deploy?" → research skill

**Decision log entry:**

```markdown
## 2026-04-15 — Bug fix: Auth works locally, breaks in prod

**"Done" definition:**
"Root cause understood, fix verified, monitoring/test added so it can't regress silently."

**Initial hypothesis (worth flagging as possibly wrong):**
"Cookie SameSite or session timeout issue."

**What would make me regret the fix:**
"If I patch the symptom and the real bug shows up somewhere else later."

**Decisions:**

- **Investigation approach: try to reproduce locally with prod-like config first, structured logging in prod second, console.logs as last resort.** Optimizes for debugging speed.
- **Cause investigation order: cookie/SameSite → env vars → server/client session sync.** Prioritized by likelihood for "random logouts" symptom.
- **Verification: write a test that would catch this class of bug.** Forces understanding, prevents regression.
- **Deploy: staging env that mirrors prod, then production.** Catches "works locally" issues before users.

**Concepts engaged:** environment-config bugs, root cause vs. symptom debugging, mental-model-first debugging, regression tests for bugs, staging environments, cookie security flags.
```

---

## Scenario 10: Senior bug fix — "API returns random 500s under load, can't reproduce"

**User profile:** Working engineer, 3+ years experience. Has been on call. The kind of bug where pattern recognition matters more than fundamentals.

**Brain dump:**
> "Our API is returning 500s in production maybe 0.3% of requests. Can't reproduce locally even under load testing. Sentry shows a few different stack traces but they all seem to be downstream of something earlier. We've been chasing this for two weeks."

**Context detection:**
- Non-trivial bug, real production impact
- "Two weeks of chasing" → user is frustrated, may be in symptom-fixing loop
- "Multiple stack traces, all seem downstream" → strong signal it's actually one underlying cause
- Senior calibration — assume vocabulary, focus on the *meta* of debugging

**Meta-layer:**

> *"Three before we go further — at the two-week mark these are worth being deliberate about.*
>
> *First — what's "fixed" actually look like at this point? After two weeks the bar might have shifted.*
>
> *For instance: '500 rate drops below some threshold,' 'we understand the root cause and ship a fix even if some 500s remain,' 'we ship instrumentation that turns this from a mystery into a measurable thing,' 'we accept it and add user-facing graceful degradation.'*
>
> *Where's the bar?"*

After answer:

> *"Second — what are you assuming about the bug that might be wrong? After two weeks it's worth questioning the framing.*
>
> *For instance: 'it's a single bug with multiple symptoms,' 'it only happens under load,' 'the stack traces are downstream of the real cause,' 'load testing locally is realistic enough to catch it,' 'it's our code and not a downstream service.'*
>
> *What's worth questioning?"*

After answer:

> *"Last — what would make you tear out the eventual fix in three months?*
>
> *For instance: 'if it turns out to be three different bugs and we only fixed one,' 'if the fix is a hack that masks the real issue,' 'if we add complexity that costs us in unrelated incidents later,' 'if we ship a "fix" that doesn't actually reduce the 500 rate.'*
>
> *Any of those?"*

**Dimension questions** (bug fix at scale: heavy on problem framing, current-state model, failure modes, verification — and meta-debugging):

> *"At two weeks of chasing, the most valuable move might be stopping and changing approach. Three options:*
>
> *Option A — Keep chasing — you might be close*
> *Sunk cost is real. If the team has a strong hypothesis, finishing it might be right. Most often this is wrong after two weeks.*
>
> *Option B — Stop, write up everything you know, look for the pattern in the writeup*
> *The act of structured writing often surfaces what ad-hoc debugging missed. You also get an artifact for handoff if you switch people.*
>
> *Option C — Stop, ship aggressive observability (distributed tracing, request-level logging), wait for next occurrence with a real lens*
> *Acknowledges the bug isn't reproducible from current data. Trades a few days of "no fix" for the ability to actually see what's happening.*
>
> *Recommendation: Option B first (fast, cheap, often illuminating), then Option C if B doesn't surface the cause. Option A after two weeks usually means another two weeks. Most senior engineers learn this the hard way; the move is to recognize when you're stuck.*
>
> *Which one?"*

> *"You said the multiple stack traces seem downstream of an earlier cause. How do you find the upstream cause? Three options:*
>
> *Option A — Hypothesize the cause, then look for evidence*
> *What you've been doing for two weeks. Confirmation bias risk.*
>
> *Option B — Map the request path: what services/components does a typical request touch, what's the order, what's the failure cascade?*
> *Forces you to think about the system, not the symptom. Often the upstream cause is a service or component you weren't considering.*
>
> *Option C — Distributed tracing on a sample of requests until you catch a failed one with full upstream context*
> *Most direct answer to "what was happening upstream?" Requires tracing infrastructure.*
>
> *Recommendation: Option B as a meta-step (cheap, high-value), then Option C if you have tracing or can set it up quickly. Option A is what got you here.*
>
> *Which one?"*

> *"How do you handle the production impact while you investigate? Three options:*
>
> *Option A — Nothing — 0.3% is below the user-pain threshold*
> *Defensible if the failed requests are gracefully retried by clients.*
>
> *Option B — Add automatic retry on 500 (server-side or client-side guidance)*
> *Masks symptom for users while you investigate. Risk: hides the metric you'd use to know the fix worked.*
>
> *Option C — Add a circuit breaker or fallback for the affected endpoints*
> *Graceful degradation. Most expensive to add, most user-friendly.*
>
> *Recommendation: Option B with care. The 0.3% might be tolerable, but two weeks of chase suggests it's bothering someone enough to keep trying. Adding retry buys you peace of mind, but make sure you keep a separate counter of "underlying 500 rate" so you can tell when the fix actually works vs. when retry is just hiding it.*
>
> *Pick one?"*

> *"How will you know the eventual fix actually worked? Three options:*
>
> *Option A — Watch the 500 rate drop*
> *Standard. Slow signal. Hard to attribute the drop to your fix vs. other changes.*
>
> *Option B — Reproduce the bug deterministically (in test or staging), verify the fix prevents it*
> *Fast, attributable. Depends on being able to reproduce, which is the whole problem.*
>
> *Option C — Add an assertion in production that would have fired for this bug, ship the fix, monitor the assertion*
> *Same as B but for cases where you can't reproduce. The assertion characterizes the bug; if it stops firing, the fix worked.*
>
> *Recommendation: Option C. You can't reproduce — Option B is unavailable. Option A is too slow and too noisy at 0.3%. The "assertion that would have fired" forces you to characterize the bug precisely, which often surfaces the cause as a side effect.*
>
> *Which one?"*

> *"What invariants should hold that you can verify post-fix to make sure you didn't introduce new bugs? Three options:*
>
> *Option A — Existing test suite passes*
> *Necessary, not sufficient. Tests probably don't cover the bug you're fixing.*
>
> *Option B — Existing tests + new test that characterizes the bug class + performance regression check*
> *Broader. Catches both the fix and accidental side effects.*
>
> *Option C — Same as B + canary deploy with comparison metrics*
> *Most rigorous. Catches issues that only appear under real load/traffic.*
>
> *Recommendation: Option C if you have canary infrastructure, Option B if not. For a bug that's been chasing you for two weeks, the cost of "we ship a fix that introduces a new bug" is high.*
>
> *Pick one?"*

**Uncertainty markers:**
- "What does distributed tracing actually look like?" → research skill (Jaeger, Tempo, OpenTelemetry overview)
- "How do I add a circuit breaker?" → research skill (resilience libraries for the language)
- "What's a canary deploy in our infra?" → depends on stack, may need to check docs

**Decision log entry:**

```markdown
## 2026-04-15 — Bug fix: Random 500s under production load (after 2 weeks of chasing)

**"Done" bar (recalibrated):**
"Ship instrumentation that turns this from mystery to measurable; understand root cause; fix verified by an assertion that would have fired previously."

**Assumptions worth questioning (named):**
- "It's a single bug — but maybe it's three"
- "It only happens under load — but we haven't proven low-load doesn't have it"
- "It's our code — should verify downstream services"

**What would make me regret the eventual fix:**
"If we ship a hack that masks the real issue and three months later it shows up worse."

**Decisions:**

- **Meta-move: stop chasing, write up everything we know, look for the pattern. Then ship distributed tracing.** Recognizes two weeks of investigation has stalled.
- **Investigation approach: map the request path explicitly, then trace.** Avoid more confirmation-bias-driven hypothesizing.
- **Production impact: add retry with separate underlying-500-rate counter.** Buys time, doesn't hide the real metric.
- **Verification: assertion in production that would have fired for this bug.** Characterizes the bug precisely; signals fix success when assertion stops firing.
- **Regression safety: existing tests + new bug-class test + canary deploy with metric comparison.** Higher rigor warranted given two weeks of investment.

**Concepts engaged:** sunk cost in debugging, distributed tracing, request path mapping, characterization-as-verification, circuit breakers and graceful degradation, canary deploys for fix validation.
```

---

## Voice and format notes for the coding agent

When generating questions for any future scenario, match these patterns:

**Voice:**
- Direct, peer-to-peer. Not condescending, not overly formal.
- "Three before we pick how" / "Quick three" — conversational openers
- Recommendations always include reasoning that references something the user said
- Honest about uncertainty: "close call," "either is fine," "you'll know when you start using it"
- Never asks the user to define or explain something
- Always provides the explanation in option blurbs

**Question format (decision questions):**
- one question per turn
- structured choice in Codex when available
- 2-3 options
- Each option has a 1-3 sentence blurb in plain language
- Recommendation is project-specific (references user's earlier answers)
- User actively picks (no auto-accept defaults)
- Plain-text fallback ends with `Reply with 1, 2, 3, or your own answer.`

**Question format (meta-layer):**
- Open-ended
- one question per turn
- 2-3 example answers as inspiration, framed clearly as examples
- Invites the user to answer in their own words
- Prefer a short cue like `Reply in 1-3 sentences.`
- Never asks the user to explain a concept

**Question count:**
- Meta-layer: always 3
- Dimension questions: 3-7, weighted by work context
- Maximum total per activation: 10 (excluding research quizzes)

**Decision log:**
- Saves to `.unvibe/decisions.md`
- Includes: date, work context, "smallest version" answer, assumptions named, "what would make me throw this away" answer, all decisions with reasoning, concepts engaged
- The "concepts engaged" section feeds passive skill calibration
