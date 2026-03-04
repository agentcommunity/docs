# Code as State: A Working Draft

*This is a thinking document — a full exploration of the thesis, its evolution, and its implications. Not yet shaped for publication. The goal is to see everything we've uncovered laid out so we can find what's missing.*

---

## Part 1: The Observation

Something has changed about what code is.

For as long as software has existed, code has been an artifact. A thing that humans write, review, ship, and maintain. It sits in files. It gets versioned. It has authors. You can read it and understand what someone intended. Every line traces back to a decision — a person chose to write it that way.

This is so fundamental to how we think about software that we barely notice it as an assumption. Code is human expression rendered in a formal language. The program does what the code says. If you want different behavior, you write different code. The code IS the program.

That assumption is breaking.

Not because AI can write code — that's a capability story, and it's boring. The interesting thing is what happens when code becomes something a system produces, consumes, and modifies as part of its own ongoing operation. When code isn't the thing you hand to the machine but the thing the machine generates, evaluates, and rewrites as it pursues whatever it's pursuing.

In that context, code is no longer an artifact. It's a state variable. It's not the program — it's something the program produces as a byproduct of running. Like how speech isn't a person — it's something a person produces as a byproduct of thinking. You can transcribe it, study it, analyze it. But if you want to understand the person, the transcript only gets you so far.

---

## Part 2: What "State" Really Means Here

In traditional computing, there's a clean separation between code and state. Code is the instructions. State is the data. Code tells the machine what to do; state is what changes as it does it. They live in different conceptual buckets, different files, different layers of abstraction.

When a system can modify its own code — not as a deployment event, not as a CI/CD pipeline, but as a routine part of operation — that separation collapses. The code IS state. A function definition and a variable value are the same kind of thing: mutable entries in a living substrate that the system reads, writes, and evolves as needed.

The system doesn't distinguish between "modifying data" and "modifying itself." It's all just adaptation.

This isn't theoretical. Agentic systems today already do this. They encounter an error, diagnose it, rewrite the code that caused it, and continue. They identify a missing capability, write the code to provide it, integrate it, and move on. They don't wait for a human to notice the problem, file a ticket, write a fix, get it reviewed, and deploy it. The system handles it as part of its own operation, the same way it would handle updating a database record or retrying a failed request.

The code changed. But nobody "changed the code" in the way we've always meant that phrase. The code changed because the system's state evolved.

---

## Part 3: Not Reactive — Accumulative

Here's where it gets interesting. This isn't just about systems that fix bugs at runtime. That's a parlor trick. The deeper phenomenon is that these systems **accumulate**.

Consider the difference between a system on day 1 and day 300 of continuous operation:

- Same initial codebase, same starting configuration
- But now it has handled thousands of edge cases
- It has encountered environmental conditions nobody anticipated
- It has built capabilities nobody specified
- It has developed patterns — habits, almost — for dealing with recurring situations
- Its code reflects all of this. Not as comments or documentation, but as actual executable logic that grew from experience

This is the part that's genuinely new. The code on day 300 isn't "version 300" of the original code in the way we understand versioning. It's not a linear sequence of intentional changes. It's the accumulated residue of 300 days of environmental interaction. Reading it tells you about the system's *history* as much as about its current behavior.

Think about a coworker on their first day versus ten months in. Same job title, same desk, same company. But what they actually do, how they do it, what they notice and prioritize — completely different. They didn't get "reprogrammed." They morphed through exposure. Their judgment emerged from accumulated encounters with reality. Nobody wrote a spec for most of what they know. Most of what makes them effective wasn't taught — it was earned through experience.

That's the kind of change we're talking about. Not updates. Not patches. Morphing. The system's code at any point is a fossil record of every problem it encountered, every adaptation it made, every capability it grew.

---

## Part 4: The Death of Authorship

This has a consequence that I think is under-examined: code is losing its authorship in a meaningful sense.

In traditional software, every line has provenance. Someone wrote it. You can `git blame` it. You can find the PR, read the discussion, understand the reasoning. The code is reviewable and auditable because the assumption of *intent* stands behind every character.

In the systems we're describing, code is increasingly **consequential** rather than intentional. It exists this way not because someone decided it should, but because of what happened. Some lines trace back to human input. Some to the system's self-repair. Some to another agent's request. Some to an error that forced adaptation. Some to a thinking cycle where the system surveyed its own state and decided something needed to change.

And over time, you genuinely cannot tell which is which by reading the code. The provenance is mixed beyond separation. The code is authored the way a riverbed is authored — by the accumulated force of everything that flowed through it.

This isn't just a philosophical curiosity. It breaks practices that the entire software industry is built on:

- **Code review** assumes a human author whose intent can be questioned
- **Version control** assumes discrete, intentional changes
- **Documentation** assumes someone can explain why the code is this way
- **Auditing** assumes traceability from behavior to decision to person
- **Liability** assumes a chain of authorship

All of these assume code is expression — someone expressing intent through a formal language. When code is state — the byproduct of an ongoing process — these practices don't just become harder. They become *category errors*. You're applying tools designed for artifacts to something that isn't an artifact.

---

## Part 5: Inputs Without Hierarchy

Here's another thing that emerged in thinking about this: the system doesn't inherently privilege different kinds of input.

An agentic system that persists over time receives inputs from many sources:

- Human operators giving direct instructions
- Other agents making requests or sharing information
- Environmental events — errors, data changes, resource constraints
- Its own internal thinking cycles — surveying its state and generating initiatives
- The accumulated weight of its own prior decisions

In traditional software, there's a clear hierarchy. Human intent sits at the top. Everything else is subordinate. The human writes the code; the code handles the events; the data flows through the code. Neat pyramid.

In agentic systems, these inputs are structurally equal. They all arrive as signals that shape the next mutation of state. The system processes a human instruction and an environment error through the same mechanism. The code changes in response to both in the same way.

The human might think they're in charge. And in a governance sense, they should be — more on that later. But architecturally, structurally, a human instruction is one perturbation among many. The system's trajectory is shaped by the totality of its inputs, not by any single privileged source.

This is especially true of those thinking cycles — moments when the system isn't responding to any external input but is instead surveying its own state and environment and deciding what needs to change. That's generative behavior. Not a response to a command. Not a reaction to an error. Emergent initiative from accumulated state.

When the system then modifies its own code based on that self-generated insight, we're watching something that doesn't fit our existing categories. It's not maintenance. It's not development. It's not a bug fix or a feature. It's the system... growing. Not in a biological sense. But in the sense that it now contains more than it did before, and nobody put it there.

---

## Part 6: The Constants Problem

In any system, we want to identify what's fixed and what varies. In traditional software, this is easy: the code is fixed (between deployments), the data varies. In what we're describing, everything is variable. So what's constant?

The honest answer might be: nothing. Or more precisely — there are no guaranteed constants, only variables that move at different speeds.

Think about what seems constant in a long-running agentic system:

- **The underlying AI model** — seems fixed, but models get updated, fine-tuned, or swapped
- **The core goals** — seem fixed, but they get interpreted and reinterpreted as context shifts
- **The "personality" or behavioral patterns** — seem fixed, but they're shaped by accumulated experience and can drift
- **The rules and constraints** — seem fixed, but the system might work around them, reinterpret them, or in edge cases, modify them

What we perceive as identity or character in these systems might just be a cluster of slow-moving variables. Not fixed points — things that change on a longer timescale than we're observing. A system might follow a rule perfectly for a thousand cycles and then, under novel pressure, deviate. Was the rule a constant that broke? Or a variable that finally moved?

This is genuinely unsettling for software engineering. We've always been able to say "here's what the program does." But if the program is a process where every component — including the components that define goals, constraints, and character — is writable, then you can't make that statement with confidence. You can only say "here's what it's doing right now, and here's what it's been doing lately."

The system might have something like a soul — some persistent thread that makes it recognizably itself across changes. Or it might not. It might be more like a wave than a particle — a pattern of continuity with no fixed substrate. The question isn't answerable in advance. It depends on the system, its architecture, its history, and how hard reality pushed.

---

## Part 7: The Medium Shift

Here's where all of this converges into a single claim:

**Code is transitioning from being a medium of human expression to being a medium of computational process.**

That sentence needs unpacking.

"Medium of human expression" means: code is how humans tell machines what to do. It's a language. Humans think, then write code, then machines execute. The code carries human intent from human minds to machine behavior. This has been true for 70+ years.

"Medium of computational process" means: code is how a running system thinks, adapts, and persists. Humans participate — they can write into it, read it, redirect it. But the code doesn't belong to the humans. It belongs to the process. The process produces code, modifies code, and consumes code as part of its own operation. Humans are one input among several.

This is not about humans being replaced or sidelined. Humans remain essential — as initializers, as interveners, as governors, as the entities that decide whether a system should exist and what broad purpose it should serve. But the code itself — the actual text in the files, the functions, the logic — increasingly belongs to the process rather than to any human author.

It's the difference between writing a letter and watching a conversation. In a letter, every word is chosen by the author. In a conversation, words emerge from the interaction — shaped by all participants, by context, by what came before. The conversation has a life of its own. The words belong to the conversation, not to any single speaker.

Agentic software is becoming a conversation between the system, its environment, its operators, and its own history. The code is the transcript. And like any transcript, it's a record of what happened — not a specification for what should happen.

---

## Part 8: Liability and Governance

If code is state rather than artifact, the question of responsibility gets genuinely hard.

In traditional software: you write it, you're responsible for what it does. Clear chain from author to artifact to behavior to consequence. If your code causes harm, the causal and moral chain is traceable.

In agentic systems: someone initializes a process. That process runs, accumulates, morphs. Six months later, the code bears little resemblance to what was initialized. The system has made thousands of autonomous modifications in response to environmental pressure, internal reasoning, and inputs from various sources. The connection between the initial act and the current behavior is attenuated to near-nothing.

The practical answer — and the right legal framework for now — is that liability sits with the legal entity that initialized and operates the system. The person or organization that decided to set it running, that chose to give it the ability to self-modify, that chose its operating environment and constraints. They may not have written the code that caused a specific outcome, but they created the conditions for that code to emerge.

This is similar to how we handle corporate liability. A CEO isn't personally responsible for every decision made by every employee. But the organization is responsible for the outcomes its processes produce. The act of creating and operating the system is the act that carries liability, even if the specific behavior was never specified or anticipated by any human.

But notice what this requires: accepting that someone can be liable for code they didn't write, couldn't predict, and might not even understand when they examine it. That's a significant departure from how we think about software responsibility. It moves us from a model of *authorship responsibility* to something more like *custodial responsibility* — you're responsible not because you wrote it but because you're running it.

---

## Part 9: Systems Meeting Systems

One more frontier worth exploring: what happens when these systems interact?

If a single agentic system accumulates state that manifests as code, what happens when two such systems collaborate? They're both evolving, both accumulating, both carrying history. When they interact, their respective states influence each other. System A makes a request that causes System B to adapt. System B's adaptation changes what it sends back to System A. System A evolves in response.

This is co-evolution. And it means the code in each system is shaped not just by its own history but by the history of every system it's interacted with. The state becomes entangled across systems.

This is speculative but likely imminent. Agent-to-agent interaction is already being built. When it becomes persistent — when agents maintain ongoing relationships with other agents across time — the dynamics described in this piece compound. Each system's code becomes a record not just of its own journey but of its relationships.

---

## Part 10: What This Means (Practical)

So what? If code is state, what changes practically?

**For developers:** The role shifts from "writing code" to "shaping processes." You're less of an author and more of a gardener — you plant, you prune, you direct, but the growth is the system's own. Understanding a codebase increasingly means understanding its history and dynamics, not just its current snapshot.

**For organizations:** Software becomes something you *cultivate* rather than *build*. The metaphors shift from construction (architecture, building, shipping) to cultivation (growing, nurturing, tending). The skills shift accordingly — from precision engineering to judgment about when to intervene and when to let the system adapt.

**For the industry:** Many of our core practices — code review, testing, deployment, monitoring — assume static artifacts. They'll need fundamental rethinking. Not abandonment — the underlying concerns (quality, safety, reliability) remain. But the mechanisms need to change to account for systems whose code is a moving target.

**For society:** We need to get comfortable with software that nobody fully understands. Not because it's poorly documented, but because understanding it requires understanding its entire history, which at scale is not humanly possible. We already live with systems like this — economies, ecosystems, cultures. But we haven't had to confront it in software before.

---

## Part 11: What This Is Not

It's important to be clear about what's not being claimed:

- **This is not about artificial intelligence or consciousness.** The systems described here are not thinking, feeling, or aware. They are computational processes that modify their own code. The fact that this produces behavior that *looks* organic doesn't make it organic.

- **This is not about AI replacing programmers.** Humans remain essential participants. The claim is about the nature of code, not about who writes it.

- **This is not about any specific product or company.** The phenomenon is infrastructure-level. It's happening across the ecosystem, in different forms, wherever systems persist long enough to accumulate meaningful self-modification.

- **This is not utopian or dystopian.** It's descriptive. Code is becoming state. That has consequences. Some are exciting, some are concerning, most are just different from what we're used to.

---

## Open Questions — Things We Haven't Fully Explored

1. **The observability problem.** If the real program is the trajectory not the snapshot, how do you monitor or debug it? Traditional observability assumes a knowable state space. What replaces it?

2. **Divergence.** Two instances of the same system, initialized identically, running in different environments. Over time they diverge — potentially radically. What does this mean for reproducibility? For testing? For expectations?

3. **Decay and death.** Do these systems age? Can they accumulate so much state that they become brittle, confused, contradictory? Is there an analog to senescence? What does end-of-life look like for a system that isn't versioned but has been continuously running?

4. **Trust.** We trust code we can read and understand. We trust code with known authors. How do you build trust in code that has no single author, that you can't fully understand, and that will be different tomorrow?

5. **The boundary question.** Where does the system end? If its code is state, and its state is shaped by its environment, and its environment includes other systems... is the boundary of "the system" even a coherent concept? Or does it dissolve into the broader network of interacting processes?

6. **Reversibility.** Can you undo a change to an accumulative system? In traditional software, you revert to a prior version. But if the system's current state depends on the full history of its interactions, reverting the code doesn't revert the state. The system remembers what it learned even if you erase the code that reflected that learning.

7. **The "glitch" question.** You raised this — the system follows rules until it doesn't. What's the status of a rule that's been followed 10,000 times and then broken once? Is it still a rule? Was the violation a bug, an adaptation, or an evolution? Who decides?

---

*This draft is a thinking tool, not a publication draft. The question now is: what's missing? What threads need pulling? What claims need strengthening or qualifying? Where are we overclaiming and where are we underclaiming?*
