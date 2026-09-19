# Epistemic Skills: from reasoning methods to usable practice

[Explore the repository](https://github.com/ZMS-Labs/epistemic-skills) · [Read the handbook](https://github.com/ZMS-Labs/epistemic-skills/wiki) · [Return to the showcase](../README.md)

## The problem

An AI agent can produce fluent reasoning while missing the question that matters. It can propose a fix before distinguishing possible causes, apply too much process to routine work, or stop at an analysis when the user asked for an outcome.

Epistemic Skills turns recurring reasoning needs into reusable methods with explicit triggers, outputs, and stopping conditions. The intent is to improve the work that follows the reasoning.

## The design

The suite separates a shared usage guide from substantive disciplines. That keeps skill discovery, acknowledgment, and continuation consistent while allowing investigation, scrutiny, verification, and continuity to remain distinct.

Three choices illustrate the approach:

- **Proportionate use.** Routine, directly checkable work can finish with an ordinary targeted check. More process needs a reason.
- **Focused and plural scrutiny.** Perspective serves a particular concern. Gauntlet preserves the meaning of a multi-lens review rather than treating every critique as a panel.
- **Visible contribution.** Skill use is briefly acknowledged, and its contribution returns to the user's task. Naming a method alone is not evidence that it helped.

The [design rationale](https://github.com/ZMS-Labs/epistemic-skills/wiki/Design-Rationale) explains the boundaries and tradeoffs.

## What a reader can inspect

| Question | Evidence or explanation |
|---|---|
| What does each method actually say? | [Canonical skill source](https://github.com/ZMS-Labs/epistemic-skills/tree/main/plugins/epistemic-skills/skills) |
| How would someone use it on a task? | [Three worked examples](https://github.com/ZMS-Labs/epistemic-skills/wiki/Workflow-Recipes) |
| What checks run, and what do they establish? | [Testing and evaluations](https://github.com/ZMS-Labs/epistemic-skills/wiki/Testing-and-Evaluations) |
| What was published? | [Versioned releases and assets](https://github.com/ZMS-Labs/epistemic-skills/releases) |
| Can another person maintain it? | [Editing, checks, and publication guide](https://github.com/ZMS-Labs/epistemic-skills/blob/main/docs/MAINTAINING.md) |

## What this demonstrates — and what remains open

The repository provides inspectable examples of method design, documentation, generated distribution surfaces, automated checks, and release provenance. Those are concrete engineering artifacts.

They do not establish universal improvements in agent performance. The project's evaluation documentation distinguishes structural checks, exercised workflows, and the limits of behavioral evidence. Host support and release-specific caveats belong to that documentation, where they can be maintained with the implementation.

The useful question for a reader is specific: does a method resolve a real uncertainty in the task, and does the subsequent work demonstrate the intended result?
