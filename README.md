<picture>
  <source media="(max-width: 600px)" srcset="assets/zms-labs-mobile.svg">
  <img src="assets/zms-labs.svg" alt="ZMS Labs. Thoughtful tools. Work you can inspect." width="1280">
</picture>

# ZMS Labs · Selected work

**Tools for work that takes judgment.**

Independent projects exploring how software can make complex information, decisions, and creative work easier to understand. This portfolio connects product design with implementation choices and evidence you can inspect.

[**Explore the full showcase →**](https://zms-labs.github.io/showcase/) · [Evidence and attribution](https://zms-labs.github.io/showcase/evidence.html) · [Maintain this site](docs/MAINTAINING.md)

## Four projects, four concrete questions

| Project | Question and inspectable work |
|---|---|
| [**Steno**](https://zms-labs.github.io/showcase/case-studies/steno/) | **How could a contract workstation connect a clause to the questions it raises?**<br>An authentic archived interface prototype with fictional matter data, plus a separate recording of two drafting checks |
| [**Epistemic Skills**](https://zms-labs.github.io/showcase/case-studies/epistemic-skills/) | **How can agents investigate, compare alternatives, and verify their work more systematically?**<br>Public methods, worked examples, design rationale, and evaluation limits |
| [**Gridiron**](https://zms-labs.github.io/showcase/case-studies/gridiron/) | **How can commentary stay accountable to a recorded event?**<br>A synthetic replay, its evidence boundaries, and a downloadable research-source snapshot |
| [**Krewcible**](https://zms-labs.github.io/showcase/case-studies/krewcible/) | **How can a creative tool keep choices visible and editable?**<br>Existing checkpoint-editor components before and after exercised controls with synthetic state |

## Product design you can examine

[![Steno's archived matter-map prototype, rendered with fictional content. Design evidence, not current product operation.](docs/assets/steno/matter-map.png)](https://zms-labs.github.io/showcase/case-studies/steno/)

**Steno · Connecting document context and review questions.** The case study preserves the prototype's visual language and offers a full-resolution gallery. Its recorded component checks are presented separately from the interface design.

[![Krewcible's checkpoint editor after exercised controls changed the modification stack and deterministic text. Synthetic component study.](docs/assets/krewcible/workspace.png)](https://zms-labs.github.io/showcase/case-studies/krewcible/)

**Krewcible · Shape the idea. See what changed.** Inspect the initial and changed states, the controls exercised, and the limits of the study. These captures do not demonstrate a generation service or persistent storage.

## Substance behind the presentation

- **Purpose and tradeoffs:** each case study explains the problem, design choices, implemented slice, and remaining questions.
- **Evidence near the claim:** prototype images, component interactions, recorded results, and conceptual illustrations are identified as different kinds of artifacts.
- **Inspectable work:** [Epistemic Skills](https://github.com/ZMS-Labs/epistemic-skills) has public source; Gridiron includes a reviewed source snapshot. Steno and Krewcible share selected case-study material while their application source remains private.
- **Clear authorship:** these are personally directed projects developed with AI assistance. [Attribution and provenance](https://zms-labs.github.io/showcase/evidence.html) explain the assistance and the work shown.

These are independent projects with different stages of maturity. The showcase does not establish employer deployment, production readiness, or measured improvement in agent performance.

## Read, run, maintain

The site is plain HTML, CSS, and JavaScript in [`docs/`](docs/README.md). Open `docs/index.html` locally or run `python -m http.server 8000 --directory docs`. It needs no build service, model account, external font request, or application backend.

[Maintenance and verification](docs/MAINTAINING.md) · [Design decisions](DESIGN.md) · [Asset provenance](docs/assets/manifest.json) · [Documentation standard](https://github.com/ZMS-Labs/.github/blob/main/docs/documentation-standard.md#use-visuals-to-explain)

See [LICENSE](LICENSE) and [asset notices](assets/README.md). The Gridiron download retains its own declarations and third-party notices. Publishing this portfolio does not publish or deploy the private applications.
