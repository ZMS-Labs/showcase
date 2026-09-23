# Source for the showcase site

This folder is the source of my project showcase at <https://zms-labs.github.io/showcase/>. Each page says what I wanted a project to do and what works so far.

[Visit the showcase](https://zms-labs.github.io/showcase/) or open [index.html](index.html) locally. No build, model account, external font service, or application backend is required.

## Explore

The four featured projects:

- [Steno](https://zms-labs.github.io/showcase/case-studies/steno/): a contract workstation that keeps the document, its connections and the questions under review together. The archived prototype, the Hallmark emblem (a grade and what backs it) and two recorded drafting checks.
- [SaveBench](https://zms-labs.github.io/showcase/case-studies/savebench/): AI models design factories in the video game Satisfactory, and the running game measures what each factory delivers. The comparison interface, a factory an AI agent designed that the game scored as a FAIL, and later results.
- [Epistemic Skills](https://zms-labs.github.io/showcase/case-studies/epistemic-skills/): written methods that help AI agents (AI tools that carry out a multi-step task on their own) investigate a failure, compare options and check whether a change worked. Public source, in eleven releases since July 2026.
- [Fleet Orchestrator](https://zms-labs.github.io/showcase/case-studies/fleet-orchestrator/): a workspace for keeping track of several AI coding agents and their work between sessions. The agent glyphs, the main screen, the Surface Bridge (the part that turns a decision about an agent's next step into commands for the AI tool running it) and three tests of the review gate.

The five supporting projects:

- [Neuraxic](https://zms-labs.github.io/showcase/case-studies/neuraxic/): a writing workspace where a story's prose, people, places and rules develop together, with five tests of what each version of the story can see and how a new detail gets accepted.
- [Krewcible](https://zms-labs.github.io/showcase/case-studies/krewcible/): shaping a character through choices you can see, change and take back, shown in the editor's own controls before anything is generated.
- [Gridiron](https://zms-labs.github.io/showcase/case-studies/gridiron/): commentary for a football video game that follows what happened on the field. Two recorded runs of one made-up drive, and a research-source download.
- [Enaction](https://zms-labs.github.io/showcase/case-studies/enaction/): keeping a character someone plays separate from the player, including whose memory a turn can change.
- [Poiesis](https://zms-labs.github.io/showcase/case-studies/poiesis/): a shared service for generated files, and how to tell which file came back, how long to keep it, and how to make a stored prompt unreadable once a job finishes. Eight tests.

Elsewhere on the site:

- [About](https://zms-labs.github.io/showcase/about.html): who I am, where each project came from and how I work with AI tools.
- [More work](https://zms-labs.github.io/showcase/more-work.html): the five supporting projects on one page, plus my fork (my own copy) of OpenClaw and the guide this site's pages and diagrams follow.
- [Evidence and attribution](https://zms-labs.github.io/showcase/evidence.html): what each example shows, where it came from and where its evidence stops.

## Maintain

Edit the static HTML, `site.css`, `site.js` and `walkthroughs.js`; see [maintenance and verification](https://github.com/ZMS-Labs/showcase/blob/main/MAINTAINING.md). The [asset manifest](assets/manifest.json) identifies the exact presentation assets, and [EXPORT-MANIFEST.json](EXPORT-MANIFEST.json) lists every file in the site payload.

The Gridiron download is a research snapshot that keeps its GPL notices and leaves out the original private Git history. Source for the seven private projects is not included here.
