---
title: "AgentBrief: a curation agent for the agentic web"
description: "A workflow-first newsroom built on taste, signal, and the agentic web"
author: Balazs Nemethi
date: 2026-01-16
tags: [agent, curation, news, workflow]
---

news.agentcommunity.org

If you are anything like me, you feel the speed of the agentic web and the weight of keeping up with it. The signal is real, but the noise is louder, and most days you do not have the time or attention to separate the two. I wanted a daily brief for the AgentCommunity that made this easy. Not a list of links, but a clean, consistent cut of what actually matters.

This is not about writing.

AI can write. Anyone can prompt a model into a paragraph. The hard part is curating what deserves to be written about in the first place.

What follows is the story of how AgentBrief came together, why it had to be built as a workflow with an AI editorial layer, and why curation is the real product.

## I - Curation is the product

When people hear "agentic news," they think the magic is in the writing. It is not. The writing is downstream. The product is the taste and the selection.

Curation is the product. Selection is the product.

If you get the curation right, writing becomes formatting. If you get it wrong, the cleanest prose in the world is just noise with grammar.

I am not building an editorial board. I am building a curation agent for the agentic web. The agent still writes, but only after it has decided what matters and which sources are worth trusting. That one decision shapes everything else.

This forces a brutal rule: garbage in, garbage out. You cannot curate your way out of a bad input stream.

So we start where agentic builders already live and where news spreads fastest: X, Discord channels, and specific subreddits. We do not crawl the whole internet, and we do not chase every headline. We choose high-signal inputs on purpose, because taste cannot be invented later.

That is the anchor. Everything else in this story hangs from it.

## II - The constraint that forced the system

I have dyslexia. I can read and write, but my written English is messy. Grammar slips through. It takes me hours to clean up a page that still feels wrong.

That limitation is not just annoying. It changes what is realistic.

Writing consistently is the thing I avoid. Not because I do not care, but because it costs too much focus for too little certainty. And yet AgentCommunity needed a daily brief.

So I did what I always do when I hit a wall: I stopped trying to be the wall and started building a system around it.

If I could not be the daily writer, I could build a curator that never gets tired, never forgets the sources, and never loses the thread. That is how AgentBrief started.

## III - The wrong first idea

The first version in my head was an orchestrator agent. An agent that would decide the steps, choose when to enrich, and more or less run the whole pipeline by itself. It sounded elegant. It felt modern.

It was wrong.

Certain steps are not creative. They are not debatable. They are required. Ingest has to happen. Sending has to happen. Formatting has to stay consistent.

If the agent has to decide whether to do those things, you burn tokens just to arrive at the same answer. You also introduce variance where you want reliability. That matters when APIs have quotas, limits, and real costs attached to them.

I learned fast that this is not where you want intelligence. Intelligence belongs in the editorial layer. Everything else should be a workflow.

## IV - Workflow backbone, AI curation layer

So we flipped it.

The workflow is deterministic. It runs the steps that must happen and keeps the outputs clean and consistent. Then the AI does what it is actually good at: curation.

It decides what is important. It selects topics. It chooses what deserves expansion. It picks the arc. It does not decide whether ingest runs. It does not decide whether we ship.

It decides what matters.

This split turned the system from a clever demo into something that can run every day. It also makes the output more auditable, because the subjective decisions are isolated where they belong. The prompt is the editorial policy. Everything else is the pipeline doing its job.

We track the origin whenever possible, not just the person who reposted it. Receipts are not public yet, but the sourcing is already there.

## V - The curator agent

I do not call it this in the code, but that is what it is: a curator agent.

Not a writer. Not an editorial board. A taste engine trained on the right inputs, tuned to select, compress, and expand.

The agent is free where it should be free. It is constrained where it should be constrained. It gets to be editorial. It does not get to be chaotic.

This is how you make curation trustworthy without turning it into bureaucracy.

## VI - Garbage in, garbage out

If curation is the product, the inputs are the leverage.

I do not want "the internet." I want the places where agentic builders actually live and where news spreads fast. So the inputs are X, Discord channels, and specific subreddits.

That choice is intentional. The goal is not to see everything. The goal is to see what matters.

Every system learns what you feed it. If you feed it noise, it gets good at noise. Signal is a choice. So we made one.

Over time, we will add more channels, but only if the readers want them. This is not about being everywhere. It is about being useful.

If you are part of AgentCommunity, we can also highlight your internal news in a dedicated section of the brief. It is the simplest way to give builders visibility without turning the newsletter into a marketing feed.

## VII - Channel matters

Same information. Different surface.

The web issue is canonical. It is the long form. It is the stable archive.

Email is the compressed version you can read in the morning without scrolling forever. The X thread is the social cut, built for fast scanning and link hopping.

LinkedIn is next, as soon as the API approval clears. The point is simple: people do not live on one platform. If you want the news to travel, you have to respect the format of the place it lands.

## VIII - The fuck around and find out sprint

This was not a clean plan. It was a six week sprint with winter break in the middle.

I had never built anything like this, so I did it the way I build most things: by figuring it out and finding out. I used Cursor and a pile of models. OpenAI, Anthropic, Google, xAI, z.ai, Kimi. Most of the actual work landed on GPT-5.2 and Gemini 3 Pro.

One intern helped with pipeline work, entirely with AI. We looked around for something that fit the scope and the constraints. We did not find it.

We were inspired by smol ai's ainews, but it was closed and did not map to what we needed. So we built from scratch.

## IX - V1 is live

Production started in January. Everything before that was testing, even if some of it looks public on the issue feed.

Now it runs without intervention. A full week of clean runs. That is v1.

You can read it here: [news.agentcommunity.org](https://news.agentcommunity.org)

## X - What comes next if people care

The goal is not just a daily brief. If people want this, we will expand it.

More channels. More delivery formats. Different lengths. Possibly different verticals. The curation layer is the engine, so the output can evolve with the audience.

## XI - The bigger mission (quietly)

AgentCommunity is becoming a global network of companies building the agentic web.

Part of that mission is securing the .agent naming layer so the web stays open, portable, and trustworthy. AgentBrief is the news surface for that world.

If you want the full mission, it is here: [agentcommunity.org/about](https://agentcommunity.org/about)

## XII - The invitation

If this resonates, join the daily brief.

[news.agentcommunity.org](https://news.agentcommunity.org)

If you have ideas, feedback, or want to suggest sources, send a note.

news@agentcommunity.org

If enough people care, we will expand the channels, the formats, and the verticals. That part depends on you.
