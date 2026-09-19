<picture>
  <source media="(max-width: 600px)" srcset="assets/zms-labs-mobile.svg">
  <img src="assets/zms-labs.svg" alt="ZMS Labs. Thoughtful tools. Work you can inspect." width="1280">
</picture>

# ZMS Labs

**Independent work in AI-assisted software, reasoning methods, and tools for complex work.**

ZMS Labs explores how software and AI can help people investigate problems, make informed decisions, and carry useful work through to completion. The public work brings together reusable methods, implementation, and documentation that makes the reasoning visible.

[**Explore the featured project**](#featured-project--epistemic-skills) · [**See the engineering approach**](#how-the-work-is-approached) · [**Browse public repositories**](https://github.com/orgs/ZMS-Labs/repositories?type=public)

<details>
<summary>Repository status</summary>

<!-- ZMS-ESTATE:BEGIN -->

> **Obligation:** `none` · **Stage:** `building` · **Load-bearing:** `unknown — not yet observed`
> **Purpose:** `configuration`
> **Canonical for:** organization-project-showcase
> Estate authority: the ZMS fleet governance registry (private), `governance/estate.yaml`.

<!-- ZMS-ESTATE:END -->

</details>

## Featured project — Epistemic Skills

### Better questions. Evidence that changes the next step.

[**Epistemic Skills**](https://github.com/ZMS-Labs/epistemic-skills) is a collection of reusable methods for AI agents. It addresses familiar failures: plausible explanations that survive without testing, reviews that overlook the real tradeoff, and work reported as complete before the outcome has been checked.

The current suite contains a shared usage guide and sixteen disciplines. Methods cover investigation, focused and plural review, verification, and continuity between sessions. Each has a purpose, a useful result, and a stopping point.

| A practical problem | What the project contributes |
|---|---|
| A bug keeps returning despite plausible fixes. | **Triage** separates competing causes and seeks observations that distinguish them. |
| A consequential decision needs scrutiny. | **Perspective** examines a focused concern; **Gauntlet** brings multiple lenses and reasoned adjudication. |
| A change was made, but its effect is uncertain. | **Did It Land** checks the intended outcome; **Evidence-Locked UAT** ties acceptance to observed behavior. |
| Work resumes after its reasoning has been lost. | **Decision Ledger** preserves consequential choices, assumptions, and the conditions for revisiting them. |

[**Read the project**](https://github.com/ZMS-Labs/epistemic-skills#readme) · [**Try a worked example**](https://github.com/ZMS-Labs/epistemic-skills/wiki/Workflow-Recipes) · [**Explore the handbook**](https://github.com/ZMS-Labs/epistemic-skills/wiki) · [**Inspect the case study**](docs/epistemic-skills.md)

## How the work is approached

The aim is to make both the result and the basis for trusting it understandable.

| Principle | What that means in practice | Public example |
|---|---|---|
| **Start with the actual question.** | Select a method because it resolves an uncertainty or changes the next action. Keep routine work proportionate. | [Method selection](https://github.com/ZMS-Labs/epistemic-skills/wiki/How-the-Pieces-Fit) |
| **Make claims inspectable.** | Connect conclusions to observed results, and distinguish a structural check from a demonstrated outcome. | [Testing and evaluations](https://github.com/ZMS-Labs/epistemic-skills/wiki/Testing-and-Evaluations) |
| **Explain the tradeoffs.** | Document why a boundary exists and when a different approach is appropriate. | [Design rationale](https://github.com/ZMS-Labs/epistemic-skills/wiki/Design-Rationale) |
| **Design for the next reader.** | Preserve enough context for someone else to use, maintain, or question the work. | [Maintainer guide](https://github.com/ZMS-Labs/epistemic-skills/blob/main/docs/MAINTAINING.md) |

These are working principles. Individual repositories and their evidence establish what has actually been implemented and verified.

## Areas of exploration

**Reasoning and decision support.** Methods that help an agent investigate, compare alternatives, and recognize when its confidence exceeds its evidence.

**AI-assisted workflows.** Ways to connect useful reasoning to implementation, verification, and continuity across a longer task.

**Tools for complex work.** Interfaces and reusable building blocks that make information, choices, and outcomes easier to understand.

This showcase is a curated introduction. Project documentation identifies each repository's scope, status, and relationship to upstream work.

## Explore or contribute

Start with [Epistemic Skills](https://github.com/ZMS-Labs/epistemic-skills). For a technical question or contribution, use that project's [issue tracker](https://github.com/ZMS-Labs/epistemic-skills/issues) and [contribution guide](https://github.com/ZMS-Labs/epistemic-skills/blob/main/CONTRIBUTING.md).

For an error in this showcase, [open an issue here](https://github.com/ZMS-Labs/showcase/issues). Public issues should contain only information suitable for public disclosure.

---

[ZMS Labs on GitHub](https://github.com/ZMS-Labs) · [About this showcase](docs/MAINTAINING.md) · [Artwork and attribution](assets/README.md)
