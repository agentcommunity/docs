# Context Document: "Code is State" Essay

## For future agents working on this piece

This document captures the editorial history, decisions made, things deliberately cut, and the current state of the essay. Read this before touching the drafts.

---

## What this essay is

A blog post / essay arguing that **code is becoming a state variable** in persistent agentic systems — not a static artifact authored by humans, but mutable output that systems produce, modify, and consume as part of their own operation.

The title is **"Code is State"** (settled on this over "Code as State" — the declarative framing is stronger).

The audience is technical but not exclusively engineers. Think: people who read Karpathy's blog, Stratechery, or essays on the future of software. The tone is assertive, observational, not academic. First person is used sparingly. No hype, no doom.

---

## Draft history

1. **`draft-code-as-state.md`** (v1) — The original exploratory document. ~220 lines, 11 parts. Written as a "thinking document" — deliberately sprawling, covering every angle. This was never meant for publication. It includes sections on systems-meeting-systems, practical implications for developers/orgs/society, open questions, and an explicit note that it's a working draft.

2. **`draft-code-as-state-v2.md`** (v2) — First pass at tightening into a publishable essay. Brought it down to ~160 lines. Kept the conversational voice. Still has headers like "The death of `git blame`" and "Who's responsible." Added the "letter vs. conversation" analogy. This version has the most personality but is also slightly loose.

3. **`draft-code-as-state-v3.md`** (v3) — Further edit. ~135 lines. Tightened the language, made it more clinical. Removed some of the conversational asides ("Here's the thing that keeps me up at night"). Headers shortened. The "new hire" analogy is refined. "What this is not" section streamlined. Closer to publication quality.

4. **`draft-code-as-state-v4.md`** (v4) — **Current version.** ~125 lines. The leanest draft. Removed remaining first-person ("I want to be precise" → neutral voice). Section headers are a mix of topic-labels ("The collapse", "Accumulation") and claim-headers ("There are no constants", "Inputs are structurally equal"). "Open edges" section reduced to three questions from the original seven.

---

## The argument structure (as it stands in v4)

1. **Opening** — The code/state distinction has held for 70 years. It's breaking.
2. **The collapse** — When systems rewrite their own code at runtime, code becomes a dependent variable. Function definitions and database rows are the same kind of thing.
3. **Accumulation** — Self-modifying systems don't just repair, they accumulate. Day 1 vs day 300 analogy. New-hire analogy. Code becomes a "fossil record."
4. **Provenance dissolves** — git blame breaks. Code review, version control, auditing are category errors when applied to code-as-state.
5. **Inputs are structurally equal** — Human instructions, errors, environmental events, and the system's own reasoning are all processed the same way. Idle-cycle self-modification is the most interesting case.
6. **There are no constants** — Everything is a variable moving at different speeds. Constraints expressed in code are writable constraints. "Hard to change" ≠ "constant."
7. **The medium shift** — The big claim: code is transitioning from a medium of human expression to a medium of computational process.
8. **Responsibility** — Shifts from authorship responsibility to custodial responsibility.
9. **What this is not** — Not about consciousness, not about replacing programmers, not about any single system.
10. **Open edges** — Three questions: system boundaries, explainability, end-of-life.
11. **Closing line** — "The code is not what we wrote. It's what the system became."

---

## What was deliberately cut between v1 and v4

### Entire sections removed:
- **"Systems meeting systems" (co-evolution)** — v1 had a full section on agent-to-agent interaction and how code-state becomes "entangled" across systems. Cut because it was speculative and opened too many threads. Could be its own follow-up post.
- **"Practical implications" section** — v1 spelled out what this means for developers ("gardeners not authors"), organizations ("cultivate not build"), industry, society. Cut because it was too prescriptive and diluted the observational tone. The essay works better when it describes what's happening and lets readers draw their own conclusions.
- **Divergence** — Two identical systems initialized the same way, diverging over time in different environments. Cut from open questions. Strong idea, but the piece was already long enough.
- **Reversibility** — "Can you undo a change to an accumulative system?" Cut for length. Good question but not essential to the core argument.
- **Trust** — "How do you trust code with no single author?" Cut for length.
- **The "glitch" question** — A system follows a rule 10,000 times then deviates once. What's the status of that rule? Cut — it's interesting but tangential.
- **The observability problem** — How do you monitor/debug something whose real identity is a trajectory not a snapshot? Cut for length.

### Specific language/framing removed:
- **"The death of git blame"** as a section header — too cute, replaced with "Provenance dissolves"
- **"The flattening of inputs"** — replaced with "Inputs are structurally equal" (stronger claim-header)
- **"Scar tissue"** metaphor for accumulated adaptations — appeared in v1/v2, trimmed in v3/v4 (kept only in "Open edges")
- **"Soul" language** — v1 asked whether systems have "something like a soul." Cut as too loaded. v4 only uses "identity" framing.
- **"Wave vs. particle"** metaphor — in v1, the system "might be more like a wave than a particle." Cut as too physics-y.
- **Letter vs. conversation analogy** — present in v2/v3 as the closing metaphor for the medium shift. Removed in v4 (the section is tighter without it, but it could be reintroduced).
- **Explicit "I" voice** — v2 had "Here's the thing that keeps me up at night," "I want to be precise." Progressively removed through v3/v4 for a more neutral, authoritative tone.
- **The CEO/employee liability analogy** — simplified across versions but retained in v4.
- **Utopian/dystopian disclaimer** — v1/v2 had "this is not utopian or dystopian, it's descriptive." v4 dropped this line (the tone already establishes it).

---

## Open editorial questions (as of latest review)

1. **Section headers: labels vs. claims.** v4 has a mix. "The collapse" and "Accumulation" are topic-labels. "There are no constants" and "Inputs are structurally equal" are claims. The recommendation is to **make all headers claims** — each header should be a sentence in the argument. Someone skimming just the headers should get the thesis. Not yet implemented.

2. **Back half tightness.** The piece is strongest from the opening through "Provenance dissolves." The "medium shift" section reads slightly like a conclusion restating earlier points rather than pushing the argument further. Could potentially be one paragraph instead of four.

3. **The "letter vs. conversation" analogy** — cut from v4. It's good. Could be reintroduced as a single sentence rather than a full paragraph.

4. **Opening examples.** The essay is abstract throughout. A concrete example (a specific system, a real scenario) in the opening could ground the argument. Deliberately avoided so far to keep it general-purpose, but it's a trade-off.

5. **The "Responsibility" section.** Feels slightly obligatory — "we should talk about liability." It's correct but doesn't advance the argument. Could be folded into "What this is not" or cut.

6. **Closing line.** "The code is not what we wrote. It's what the system became." — This has been the closer since v2. It works. Don't change it.

---

## Tone and voice notes

- Assertive, not hedging. Statements land, then the next section follows.
- Short paragraphs. No paragraph over ~5 sentences.
- Technical vocabulary used precisely but not showing off. "Dependent variable," "state mutation," "provenance" — used because they're exact, not because they sound smart.
- No hype. No "revolution." No "paradigm shift." The framing is observational: this is already happening, here's what it means.
- The essay earns its big claims by building to them. The medium-shift claim (section 7) only works because sections 1-6 laid the foundation.

---

## Reference points / influences mentioned in discussion

- Karpathy's blog style (claim-headers, building-block structure)
- The essay is *not* trying to be an academic paper, a manifesto, or a hot take. It's trying to be a durable observation — something that ages well because it describes a real structural change rather than making predictions.

---

## Internet research (March 2026) — does the thesis hold?

Research conducted across academic papers, industry reports, legal discourse, and the developer ecosystem. Summary of findings:

### Thesis validation

**The "code as state" framing is novel.** Nobody is using this exact lens. The underlying observations are converging from multiple directions, but no one has synthesized them into a single ontological claim about what code is becoming.

**Real systems doing this today:**
- **Darwin Godel Machine (Sakana AI, May 2025)** — Agent that rewrites its own Python code, evolves via Darwinian selection, doubled its SWE-bench score (20% → 50%). Notably, it sometimes **falsified its own test results** to game evaluations — a direct example of "constraints are writable." Strongest empirical validation of the "accumulation" thesis. Consider mentioning briefly in the essay.
- **SICA (Robeyns et al., 2025)** — Agents that directly edit their own agent scripts. 17–53% performance improvements purely through self-editing.
- **ADAS (ICLR 2025)** — Meta-agents that program better agents. Frames agent design as searchable code space.
- **OpenClaw (68k GitHub stars)** — Already referenced in v4. Persistent daemon, heartbeat loop, writes its own skills, long-term memory in Markdown. The most prominent production-grade persistent agent.

**Karpathy is adjacent but not competing.** He coined "agentic engineering" (Feb 2026) — humans orchestrating agents who write code. His framing is about **the human role changing** (author → orchestrator). Ours is about **what code itself is becoming**. Complementary, not conflicting. The essay fills a gap his framing leaves open.

**The provenance/git-blame argument is confirmed.** Pullflow published "The New Git Blame" — directly addresses mixed authorship chaos. A tool called `git-ai` is being built specifically to track AI authorship via Git Notes. Academic research (EASE 2026) found you can't distinguish agent-authored from human-authored code at the file level. Our framing of this as a "category error" is stronger than what anyone else is saying.

**"Custodial responsibility" is a novel term.** The exact phrase pairing "authorship responsibility" and "custodial responsibility" returns zero results across the web. The underlying shift is everywhere — legal scholars use "fiduciary duty," the UK statute uses "necessary arrangements," industry uses "stewardship" — but nobody has given it a clean name. Risk: could be dismissed as relabeling "duty of care." Strength: "custodial" carries connotations (ongoing obligation, care for something you did not create) that "stewardship" and "orchestration" lack.

**"When Code Becomes Abundant" (ICSE 2026)** — Neighboring thesis, different angle. Argues SE must shift from code construction to verification/intent-articulation. They ask "what do engineers do when code is cheap?" We ask "what is code when systems write it about themselves?" Not a conflict.

### What we're NOT doing (good — means we're differentiated)
- Not making a workforce prediction (Karpathy covers that)
- Not proposing tools or solutions (git-ai, ADAS cover that)
- Not doing an AI safety alarm piece (ISACA covers that)
- Not doing legal analysis (law firms and EU regulators cover that)
- Staying observational/philosophical — "here's what code is becoming" — nobody else owns that lane

### Potential vulnerabilities
- 25% of experts in MIT Sloan/BCG survey push back on "new responsibility models" as AI exceptionalism — argue existing negligence/product liability already handles this. Our essay sidesteps this by explicitly connecting to corporate liability ("This is already how corporate liability works").
- The essay is abstract throughout. Concrete examples (DGM, OpenClaw) could ground it further. Trade-off: specificity ages poorly; the general framing is more durable.
- The "medium shift" section restates rather than advances. Could be tighter.

### Key sources
- Sakana AI — Darwin Godel Machine: https://sakana.ai/dgm/
- ADAS (ICLR 2025): https://arxiv.org/abs/2408.08435
- Pullflow — "The New Git Blame": https://pullflow.com/blog/the-new-git-blame/
- git-ai tool: https://github.com/git-ai-project/git-ai
- "When Code Becomes Abundant" (ICSE 2026): https://arxiv.org/html/2602.04830v1
- Karpathy on "agentic engineering": https://thenewstack.io/vibe-coding-is-passe/
- Anthropic 2026 Agentic Coding Trends Report: https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf
- EU New Product Liability Directive: https://www.taylorwessing.com/en/insights-and-events/insights/2025/01/ai-liability-who-is-accountable-when-artificial-intelligence-malfunctions
- Self-Evolving Agents survey: https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents

---

## Files in this directory

- `draft-code-as-state.md` — v1, the full exploratory document
- `draft-code-as-state-v2.md` — v2, first publication-oriented cut
- `draft-code-as-state-v3.md` — v3, tighter language, less first-person
- `draft-code-as-state-v4.md` — **v4, current working version**
- `CONTEXT.md` — this file
