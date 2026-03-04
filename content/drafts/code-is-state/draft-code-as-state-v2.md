# Code as State

There's an assumption baked into everything we do with software. It's so basic we don't even think of it as an assumption. It goes like this: humans write code, machines run code, and the code sits there in between — static, intentional, authored. It does what it says. If you want different behavior, you write different code.

This assumption is breaking, and I don't think we've fully reckoned with what comes next.

---

## The old model

Here's how software has worked for 70 years. A person has an idea. They translate that idea into a formal language — C, Python, JavaScript, whatever. They type it into files. Those files get compiled or interpreted. The machine does what the files say. If the machine does the wrong thing, the person changes the files. Ship it. Repeat.

In this model, code is an **artifact**. Like a blueprint, or a legal document, or a musical score. It's a static thing that a human created to express intent. You can read it. You can trace every line back to a decision someone made. You can `git blame` it and find out who wrote it and why. The entire apparatus of modern software engineering — version control, code review, CI/CD, documentation — exists because code is an artifact with knowable provenance.

This works great when humans are the only ones writing code.

## What changes

Now consider a system that can modify its own source code as part of its normal operation. Not a build pipeline. Not a macro system. A running process that encounters a problem, writes new code to solve it, integrates that code into itself, and keeps going.

This is already happening. Agentic systems today encounter errors and rewrite the functions that caused them. They identify missing capabilities and author the code to provide them. They don't file a ticket and wait. They handle it the way they'd handle any other operational concern — as a state transition.

And that phrase — "state transition" — is the whole point.

In traditional computing, there's a clean separation between code and state. Code is the instructions. State is the data. They live in different conceptual buckets. Code tells the machine what to do; state is what changes as it does it.

When a system can modify its own code at runtime, that separation collapses. A function definition and a variable value become the same kind of thing: mutable entries in a substrate that the system reads, writes, and rewrites as needed. The system doesn't distinguish between "updating a database record" and "rewriting a function." Both are just state mutations. Both serve the same purpose: adapting to what's happening right now.

**Code becomes a dependent variable.** It's not the program. It's output that the program produces as part of running.

## This goes deeper than self-healing

The obvious version of this story is "agents fix their own bugs." That's real but it's a parlor trick. The interesting phenomenon is what happens over time.

A system that can modify its own code doesn't just fix things. It **accumulates**.

Take the same system on day 1 and day 300 of continuous operation. Same initial codebase. Same starting configuration. By day 300:

- It has handled thousands of edge cases nobody anticipated
- It has built capabilities nobody specified
- It has developed patterns for dealing with recurring situations
- Its codebase reflects all of this — not as comments, but as executable logic that grew from experience

The code on day 300 isn't "version 300" in the way we understand versioning. It's not a sequence of planned changes. It's the accumulated residue of 300 days of interaction with reality.

Think about a new employee on day 1 versus month 10. Same title, same desk. But what they actually do, how they approach problems, what they even notice — completely different. Nobody reprogrammed them. They morphed through exposure. Their judgment emerged from accumulated encounters with reality. Nobody wrote a spec for most of what they know.

That's the kind of change happening in the code. Not updates. Not patches. Morphing. At any given moment, the codebase is a fossil record of every problem the system encountered, every adaptation it made, every capability it needed and grew.

## Code loses its author

This has a consequence worth sitting with: **code is becoming consequential rather than intentional.**

In the old model, every line of code has provenance. Someone wrote it. You can find the PR, read the discussion, understand the intent. Code is reviewable because the assumption of authorship stands behind every character.

In persistent agentic systems, the provenance gets tangled. Some code traces back to a human instruction. Some to the system's self-repair. Some to an environmental event that forced adaptation. Some to an internal cycle where the system surveyed its own state and decided, on its own, that something needed to change.

Over time, you can't tell which is which by reading the code. The authorship is mixed beyond separation. The code is authored the way a riverbed is authored — by the accumulated force of everything that flowed through it.

This matters because the entire software industry is built on practices that assume authorship:

- **Code review** assumes a human author whose reasoning you can question
- **Version control** assumes discrete, intentional changes
- **Auditing** assumes traceability from behavior back to a person's decision
- **Liability** assumes a chain of authorship from person to code to outcome

When code is a state variable — the byproduct of an ongoing process rather than the expression of a human intention — these practices aren't just harder to apply. They become category errors. Tools designed for artifacts, applied to something that isn't an artifact.

## Inputs flatten

There's a related structural change that's easy to miss. Persistent agentic systems receive inputs from many sources:

- Human operators giving instructions
- Environmental events — errors, data changes, shifting constraints
- Other agents making requests
- The system's own internal reasoning — surveying its state and generating initiative

In traditional software, there's a clear hierarchy. Human intent sits on top. Everything else is subordinate to it.

In agentic systems, these inputs are processed through the same machinery. A human instruction and an environment error both arrive as signals that shape the next state mutation. The code changes in response to both the same way. Architecturally, a human saying "do X" and a database throwing an error are the same kind of event.

Humans remain essential — as operators, as governors, as the entities that decide whether a system should exist and what broad purpose it should serve. But at the execution layer, human input is one signal among many. The system's trajectory is shaped by the totality of what it encounters, not by any single privileged source.

The most interesting case is when the system isn't responding to *any* external input. When it's in an idle cycle, surveying its own state, and decides that something needs to change. That's not a response to a command. Not a reaction to an error. It's emergent initiative from accumulated state. The system noticed something — a pattern, a risk, an optimization — because its history of interactions made that noticing possible.

When it then rewrites its own code based on that self-generated insight... what category does that fall into? It's not maintenance. Not development. Not a bug fix. It's the system extending itself based on its own accumulated understanding. Nobody asked for it. The environment demanded it in some diffuse, non-explicit way that only became visible from the system's vantage point.

## There are no constants

In any system, we want to know what's fixed and what varies. In traditional software: the code is fixed between deployments, the data varies. Simple.

In what we're describing, everything varies. So what's constant?

Maybe nothing.

Or more precisely: there are no guaranteed constants, only variables that move at different speeds.

Think about what seems constant in a long-running agentic system:

- **The model** — seems fixed, but models get updated, swapped, fine-tuned
- **The goals** — seem fixed, but they get reinterpreted as context shifts
- **The behavioral patterns** — seem fixed, but they drift with accumulated experience
- **The rules** — seem fixed, but the system might work around them, reinterpret them, or in edge cases, modify them

What we perceive as identity in these systems might be a cluster of slow-moving variables. Not fixed points — things that change on a longer timescale than we're watching. A system follows a rule for ten thousand cycles and then deviates under novel pressure. Was that a constant that broke, or a variable that finally moved?

You could claim some things must be constant — the core architecture, the fundamental constraints. But this is an empirical claim, not a logical one. If the system can write its own code, and the constraints are expressed in code, then the constraints are writable too. We can assume that in practice some variables function as constants. The model probably respects its rules. Probably. But "probably" and "always" are different words, and the gap between them is where the interesting questions live.

The system might have something like identity — a persistent thread that makes it recognizably itself across time and changes. Or it might be more like a wave than a particle: a pattern of continuity with no fixed substrate. You can't answer that question in advance. It depends on the system, its history, and how hard reality pushed.

## The medium shift

All of this converges into one claim:

**Code is transitioning from a medium of human expression to a medium of computational process.**

For 70 years, code has been how humans tell machines what to do. A language for carrying intent from human minds to machine behavior. This is the water we swim in. Every programming language, every IDE, every Stack Overflow answer assumes this framing.

What's emerging is different. Code is becoming how a running system thinks, adapts, and persists. The system produces code, modifies code, and consumes code as part of its own operation. Humans can still write into it — they're important participants. But the code doesn't *belong* to the humans. It belongs to the process.

Think about the difference between writing a letter and overhearing a conversation. In a letter, every word is chosen by the author. In a conversation, words emerge from the interaction — shaped by all participants, by context, by history. The words belong to the conversation, not to any single speaker.

Agentic software is becoming a conversation between the system, its environment, its operators, and its own history. The code is the transcript. A record of what happened — not a specification for what should happen.

## Responsibility doesn't disappear

If code has no single author, who's responsible for what it does?

The practical answer: the entity that initialized and operates the system. The person or organization that decided to set it running, that gave it the ability to self-modify, that defined its operating environment. They may not have written the code that caused a specific outcome. But they created the conditions for that code to emerge.

This isn't unprecedented. It's how corporate liability already works. A CEO isn't personally responsible for every decision every employee makes. But the organization is responsible for the outcomes its processes produce. You're liable not because you authored the behavior but because you're operating the system that produced it.

It's a shift from **authorship responsibility** to **custodial responsibility**. You own it not because you wrote it, but because you're running it.

## What this is not

A few things worth being explicit about.

This is not a claim about consciousness or intelligence. The systems described here aren't thinking or feeling. They're computational processes that modify their own code. That the results *look* organic doesn't make them organic.

This is not about AI replacing programmers. Humans remain essential. The claim is about what code is becoming, not about who writes it.

This is not about any specific system or product. The phenomenon is infrastructure-level. It shows up wherever systems persist long enough to accumulate meaningful self-modification.

And this is not utopian or dystopian. It's descriptive. Code is becoming state. That has consequences — some exciting, some concerning, most just different from what we're used to.

## What's ahead

A few questions I don't have clean answers to. I suspect nobody does yet.

**Where does the system end?** If code is state, and state is shaped by environment, and the environment includes other systems and human inputs and real-world events — what's the boundary of "the system"? Is it even a coherent concept? Or does it dissolve into the broader mesh of interacting processes?

**Can a system explain itself?** If a system's code is the fossil record of its history, can it reconstruct why it is the way it is? Explainability is already hard for neural networks. It's a different kind of hard for a system whose logic was assembled incrementally by a process that didn't keep notes.

**What does end-of-life look like?** Traditional software gets deprecated, archived, replaced. But a system that has been accumulating for years — that carries the scar tissue of thousands of adaptations — what does it mean to shut that down? Is there something worth preserving? What's lost?

These are genuinely open questions. The framing — code as state, not artifact — doesn't answer them. But it might be the right lens for thinking about them. Because as long as we treat code as something humans write and machines run, we'll keep trying to apply 70-year-old assumptions to something that has quietly become a different thing entirely.

The code is no longer just what we wrote. It's what the system became.
