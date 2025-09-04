---
title: "Door or Address book"
description: "How does an AI agent know what to do when it hits a locked door on the web?"
author: Agent Community
date: 2025-07-25
tags: [AID, Discovery, DNS, LLMS.txt]
---

### Instructions on the Door, or an Address in the Book?

How does an AI agent know what to do when it hits a locked door on the web?

This is one of the fundamental, practical problems we have to solve to build an internet of agents. If an agent's job is to access a staging server or a protected API, and it's met with a `401 Unauthorized` page, what happens next? The vision of autonomy grinds to a halt.

Vercel recently proposed a clever, intuitive solution. The idea is to leave a note for the agent, right there on the 401 page. Using a special script tag, `<script type="text/llms.txt">`, a developer can embed human-readable instructions telling the agent exactly how to get in. It might say, "To get a key, call this special function, or ask the user for a bypass token."

It's a simple, elegant hack. And on the surface, it makes perfect sense. The instructions for what to do next are right where the agent gets stuck.

But it has a hidden, dangerous flaw. It’s the digital equivalent of leaving a handwritten note on the front door of a bank that says, "New deposit procedure: please slide cash and checks under the loose floorboard in the alley."

You're asking an AI to trust and interpret instructions from a source that hasn't been verified. This opens up a massive security hole for something called prompt injection. An attacker could craft a malicious set of instructions on a compromised page, telling a visiting agent to send its data to a malicious endpoint or to leak its credentials. Because the instructions are just free-form text, the agent has no way to distinguish a legitimate instruction from a sophisticated trap. It’s being asked to *interpret*, not to *verify*.

The problem is that this approach mixes up two very different things: the *location* of a service and the *content* of a page. A secure system needs to separate them. You need a trusted way to find the right door before you start reading the notes taped to it.

This is a subtle but crucial distinction. We don't need better notes; we need a better address book.

This is where Agent Interface Discovery (AID) (new name: Agent Identity & Discovery) offers a more robust, foundational solution. AID doesn't leave instructions on the page. It publishes an address in the internet's most trusted, decentralized address book: DNS.

The entire mechanism is a single, machine-readable `TXT` record.

`_agent.example.com. IN TXT "v=aid1;uri=https://api.example.com/mcp;p=mcp"`

Look at the difference. This isn't a paragraph of prose for an LLM to ponder. It's structured data. It says, "The agent for this domain lives at this specific URI and speaks this specific protocol."

This solves the security problem at its root.

1.  **It's Out-of-Band.** The discovery happens via DNS, a completely separate and more trusted channel than the HTTP content of a webpage. The agent finds the official front door *before* it ever gets to the potentially compromised house.
2.  **It's Deterministic.** An AID client isn't interpreting natural language. It's parsing a `uri` field and a `proto` field. The attack surface for prompt injection is virtually eliminated because there's no ambiguous prose to inject into. The logic is handled by a simple, deterministic parser, not a complex LLM.
3.  **It's Verifiable.** The AID specification strongly encourages using DNSSEC, which allows an agent to cryptographically verify that the address it received is authentic and hasn't been tampered with.

Vercel’s proposal is a clever pattern. AID is boring, essential infrastructure. It’s the `MX` record for agents. Email works reliably because every mail server in the world agrees to first look up the `MX` record in DNS to find the right address. It doesn't fly to a domain's web server and read a note about where to send the mail.

To build a secure and scalable agentic web, we need the same clean separation of concerns. We need a formal, deterministic layer for discovering agent interfaces that is not susceptible to the whims of prompt injection.

The note-on-the-door approach is a clever workaround for a missing piece of infrastructure. The right solution is to build that infrastructure. Let’s give our agents a proper, public address book, not just a series of scribbled notes.

**Give your agent a permanent, public address at [aid.agentcommunity.org](https://aid.agentcommunity.org).**
**Oiriginal Vercel LLMs.txt article at the blog**  [<script type="text/llms.txt>](https://vercel.com/blog/a-proposal-for-inline-llm-instructions-in-html)

---

**Related Reading:**

- [AID Specification](docs.agentcommunity.org/aid/specification)
- [Design Rationale](docs.agentcommunity.org/aid/rationale)
- [The Missing MX Record for the Internet of Agents](missing-record)
