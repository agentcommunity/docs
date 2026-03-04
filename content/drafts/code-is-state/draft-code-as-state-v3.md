# Code is State

Every variable in your program is mutable state. Your source code is not. It's the one thing that stays fixed while everything else moves. You write it, you ship it, it runs, and the data flows through it like water through plumbing. The plumbing doesn't change. That's the deal. That's been the deal for seventy years.

The deal is off.

We now have systems that rewrite their own source code as a normal part of operation. Not metaprogramming. Not code generation at build time. Running processes that encounter problems, write new functions to solve them, integrate those functions into themselves, and keep going. The source code changes — not because a developer pushed a commit, but because the system decided it needed to change.

Once you internalize what that actually means, a lot of things break.

## The collapse

Here's the thing that breaks first: the distinction between code and state.

This distinction is so fundamental we teach it in week one. Code is the instructions. State is the data. Code is what you wrote. State is what changes at runtime. They live in different files. They have different lifecycles. You version one and persist the other.

When a system can rewrite its own functions at runtime, a function definition and a database row become the same kind of thing. Both are mutable entries that the system reads, modifies, and acts on. From the system's perspective, "update a config value" and "rewrite the error handler" are the same operation. State mutation. It doesn't care that one of them is what we call "code."

So code becomes state. Not metaphorically. Literally. It's a dependent variable — output that the program produces as part of running, not input that a human provides before running.

This already happens today. It's not a research agenda. Agentic systems encounter errors and rewrite the code that caused them. They identify missing capabilities and author the functions to provide them. They don't file tickets. They don't wait. They treat code modification the way they treat any other state transition — as something you just do when the situation calls for it.

## Accumulation

The surface-level version of this story is "agents fix their own bugs." True, but boring. A parlor trick. The deep version is about what happens over time.

Systems that modify their own code don't just repair. They **accumulate**.

Day 1: you initialize a system with a codebase. Day 300: same system, same machine. The codebase is unrecognizable. Not because of 300 planned releases. Because the system spent 300 days encountering reality, and reality kept requiring things nobody anticipated. Edge cases got handled. Capabilities got added. Patterns emerged for recurring problems. The code reflects all of this — not as documentation, but as executable logic that grew from experience.

Here's the analogy that makes this click. Think about a new hire on day 1 versus month 10. Same role, same desk. What they actually do, how they do it, what they even notice and prioritize — completely different person. Nobody reprogrammed them. They morphed through exposure. Most of what makes them effective by month 10 wasn't taught. It was earned through thousands of small encounters with reality.

That's what's happening in the code. Not updates. Not patches. Morphing. The codebase at any point in time is a fossil record — every problem the system hit, every adaptation it made, every capability it grew because it needed to. You can read it, but what you're reading is a history, not a design.

## The death of `git blame`

Here's the consequence that keeps me up at night.

Traditional code has provenance. Every line was written by someone, for a reason, at a known time. You can `git blame` any file and get a name, a date, a commit message. You can find the PR, read the discussion, understand the reasoning. The entire apparatus of modern software engineering — code review, version control, CI/CD, auditing — rests on this assumption. Code has an author. The author had intent. The intent is recoverable.

In persistent agentic systems, provenance becomes noise. Some code traces to a human instruction. Some to the system repairing itself. Some to an environmental event that forced adaptation. Some to an internal cycle where the system, unprompted, surveyed its own state and decided something needed to change.

Over time you can't distinguish these by reading the code. They're mixed beyond separation. The code is authored the way a riverbed is authored — by the accumulated force of everything that flowed through it.

This breaks things:

- **Code review** assumes a human author whose reasoning you can question. Who do you question when the author is a process?
- **Version control** assumes discrete, intentional changes. What's a "commit" when the system is continuously rewriting itself?
- **Auditing** assumes traceability from behavior to decision to person. The chain is gone.

These aren't just harder to apply. They're category errors — tools designed for artifacts, aimed at something that isn't an artifact anymore.

I want to be precise about what's new here. Code generation is old. Macros, templates, code gen — we've had machines producing code for decades. The difference is those systems produce code *and then stop*. The code becomes an artifact again the moment it's generated. What's different now is that the code never stops being mutable. It's state from the moment it's written to the moment the system shuts down. There's no point where it solidifies into an artifact.

## The flattening of inputs

Something else happens that's easy to miss. Persistent agentic systems receive inputs from many sources:

- Human operators giving instructions
- Environmental events — errors, failures, data changes
- Other agents or services making requests
- The system's own internal reasoning

In traditional software, there's a hierarchy. Human intent at the top. Everything subordinate. In agentic systems, these inputs are structurally equal. They all arrive as signals that shape the next state mutation. A human saying "add caching" and a database throwing a timeout error are, at the execution layer, the same kind of event. Both result in code getting rewritten.

Humans remain essential — they initialize, govern, intervene. But at the level of the running process, human input is one perturbation among many. The system's trajectory is shaped by the totality of what it encounters.

The most interesting case: idle cycles where the system isn't responding to any external input at all. It surveys its own state, notices something — a pattern, a risk, a latent inefficiency — and rewrites code to address it. Nobody asked. No error triggered it. Its own accumulated history made the observation possible, and the observation produced action.

What category is that? Not maintenance. Not development. Not a bug fix. It's the system growing a capability that it recognized it needed, based on experience nobody gave it, in response to a situation nobody described.

## There are no constants

So if everything is state — if code is mutable, behavior is mutable, capabilities are mutable — what's fixed?

Maybe nothing. Maybe there are no constants, only variables that move at different speeds.

Look at what seems constant:

- **The model** — fixed, until it's updated, swapped, or fine-tuned
- **The goals** — fixed, until they're reinterpreted as context shifts
- **The rules** — fixed, until the system works around them or, in edge cases, modifies them
- **The behavioral patterns** — fixed, until accumulated experience pulls them somewhere new

What we perceive as the system's identity might just be a cluster of slow-moving variables. Things that change on a longer timescale than we're watching. A system follows a rule for ten thousand cycles and then deviates under novel pressure. Was that a constant that broke? Or a variable that finally moved?

If the system can write code, and constraints are expressed in code, then constraints are writable. You can argue some things *should* be constant, and you can build architectures that make certain things *hard* to change. But "hard to change" and "constant" are different claims. The gap between "probably won't change" and "can't change" is where the interesting problems live.

## The medium itself is shifting

Here's the big claim. Everything above builds to this.

**Code is transitioning from a medium of human expression to a medium of computational process.**

For seventy years, code has been how humans tell machines what to do. A language for moving intent from minds to processors. Every programming language, every IDE, every tutorial assumes this framing. Code is human thought, formalized.

What's emerging is different. Code is becoming how a running system thinks, adapts, and persists. The system produces it, modifies it, and consumes it as part of its own operation. Humans can still write into it. But the code doesn't belong to the humans anymore. It belongs to the process.

The difference between writing a letter and being in a conversation. In a letter, every word is chosen by the author. In a conversation, words emerge from the interaction — shaped by all participants, by context, by everything that was said before. The words belong to the conversation, not to any speaker.

Agentic software is becoming a conversation between the system, its environment, its operators, and its own history. The code is the transcript.

## Who's responsible

If code has no single author, who's liable when it does something wrong?

The entity that operates the system. The person or organization that set it running, gave it the ability to self-modify, chose its operating environment. They didn't write the code that caused a specific outcome. They created the conditions for that code to emerge.

This is already how corporate liability works. You're not responsible for every decision every employee makes. You're responsible for the outcomes your organization produces. The shift is from **authorship responsibility** to **custodial responsibility** — you own it not because you wrote it, but because you're running it.

## What this is not

I want to be clear about what I'm not saying.

This is not a claim about intelligence or consciousness. These systems are not thinking or feeling. They're computational processes that modify their own code. The results looking organic doesn't make them organic.

This is not about replacing programmers. Humans remain essential. The claim is about what code is becoming, not about who participates in writing it.

And this is not utopian or dystopian. It's observational. Code is becoming state. That has consequences.

## Open edges

Some things I don't have answers to.

**Where does the system end?** If code is state, and state is shaped by environment, and the environment includes other systems, human inputs, real-world events — is the boundary of "the system" even coherent? Or does it blur into the mesh of everything it interacts with?

**Can a system explain itself?** If the codebase is a fossil record of accumulated adaptations, can the system reconstruct *why* it is the way it is? Explainability is already hard for neural networks. It's a different kind of hard for a system whose logic was assembled incrementally by a process that didn't plan ahead.

**What does end-of-life look like?** Traditional software gets deprecated and archived. A system that has accumulated for years — carrying the scar tissue of thousands of adaptations — what does it mean to turn that off? Is something lost that can't be recovered from the initial codebase?

I don't think the framing I've described here answers these questions. But I think it's the right way to start asking them. Because as long as we treat code as something humans write and machines execute, we'll keep fitting seventy-year-old assumptions onto something that has quietly become a different thing entirely.

The code is not what we wrote. It's what the system became.
