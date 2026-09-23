# ZMS Labs showcase design

This file records how the showcase looks and the decisions behind it. The site uses the same typeface and colors as the rest of ZMS Labs, and its mastheads are in the visual family of Epistemic Skills. Each case study opens with what I wanted the project to do, then shows the interface and the evidence. When AI tools or other people's projects did part of the work, the page says so, and it says what the work does not show.

## Visual system

- Deep ink `#152c35` provides a stable masthead in either GitHub theme.
- Warm white `#f5f3ed` carries the title; orange `#ffac70` identifies the accent geometry.
- The masthead's orange square and the site header's rotated 2×2 grid use the same accent color. The square marks the wordmark, the grid is the compact logo, and the favicon is drawn from that header grid.
- Muted blue `#b7c8cc` carries secondary text with readable contrast.
- Archivo is the display face. Native GitHub typography handles README prose and navigation. The website serves a Latin subset of Archivo as a WOFF file, made from the bundled, unmodified TTF with every weight and the license names kept; the TTF stays as the fallback.
- The geometric composition represents connections between reasoning, tools, and development. It is conceptual artwork, not a system topology or a depiction of private infrastructure.
- The line on the masthead artwork and the default share card is "What I've been building with AI, and how it's actually going."

The masthead introduces the site, and a plain text description and working links follow it straight away. On the README, product images come before the project list, because the images are the most direct evidence and a phone reader should reach them within two screens. The project list pairs each project with the question behind it and what the case study shows.

### Share cards

Every share card is 1200 by 630 pixels. The default card shows the ZMS Labs wordmark and its orange square on ink, with the masthead line set on two lines. The home page, the other top-level pages and any case without its own card use it. A project card crops that case's own capture or illustration and ends in a solid ink band holding the project name, a short label saying what the picture is, and the ZMS Labs wordmark. The labels are "Archived prototype, made-up content" (Steno), "Sample data" (SaveBench), "AI-generated artwork" (Epistemic Skills and Gridiron), "Made-up agent identity" (Fleet Orchestrator), "Made-up choices" (Krewcible) and "Fictional content" (Neuraxic). A share card travels without its caption, so the label goes on the card itself.

## Responsive and accessible behavior

Wide and narrow SVGs use purpose-built compositions selected by an HTML `picture` element. Outlined type avoids font-service dependencies. Each SVG has a title and description, and the README supplies alternative text. Essential information is repeated in native Markdown.

The README needs no scripts or external font service. The website uses small local scripts for walkthroughs, method selection, evidence tabs and product galleries; its content and direct full-resolution image links remain available without JavaScript. Neither surface uses analytics, remote font services, or generated contribution counters.

## The full website

The website uses an editorial layout: large purposeful headings, generous space, warm paper, deep ink, and restrained orange accents. It connects each project's concrete problem to decisions, records and limits. Steno and Krewcible keep their own interface typography and arrangement inside unaltered captures. Captures are never recolored or recomposed, and generated art is never a case's first exhibit.

The Gridiron illustration relates a field, an event record, and commentary. The Epistemic Skills illustration presents investigation, examination, and verification as available methods, not a required sequence. Both were created with OpenAI image generation, and every caption calls them "AI-generated conceptual artwork". Neither appears on the home page, where each featured project shows its own exhibit; on their case pages they come after the case's own panels. Pages show a WebP copy through a `<picture>` element and keep the original PNG as the fallback, because the PNG carries the image's Content Credentials record and re-encoding drops it. Generated drafts that added trend lines or success signals were rejected because nothing in the work supported them. Important explanations remain selectable HTML text.

The Steno clause illustration ends with questions for human review, not a clearance or automatic legal decision. Krewcible's heading describes the choices a person can see and change in the editor. The [Evidence page](https://zms-labs.github.io/showcase/evidence.html) and the [asset manifest](docs/assets/manifest.json) record where each public asset came from and what it supports.

Product images open in full-resolution galleries. On screens wider than 720 pixels, Expand opens a viewer that shows the image at its full size and pans. On phones Expand is hidden and the full-resolution link spans the width, so the phone's own zoom does the enlarging. Recordings keep the proportions of the video itself. The automated browser check renders every page at 1440, 390 and 320 pixels wide. Controls support keyboard activation, visible focus, and dialog focus return. The fixed light palette is deliberate; the GitHub masthead stays legible in either GitHub theme. Printed pages show every walkthrough step, leave out the controls, and print dark panels as ink on paper.

### Page conventions

og:description is identical to the meta description on every page. Descriptions lead with substance, never a `Project:` name prefix; the title carries the name. Every `<title>` and og:title ends ` · ZMS Labs` and the two match exactly. The Evidence status table's Checked column reads "what · date" with counts spelled out.

A case page's h1 is short and plain: a statement, or the page's real question. Two-part slogans are kept to the one or two pages where they still read naturally (SaveBench), and the supporting cases use the same heading on the case page, the home card and the More work entry. Each project keeps one topic phrase after its name, the same on the home card, the case hero and More work (for example "Neuraxic · Writing story worlds"). A dot separator in a status line or a Shown as row is preceded by a non-breaking space, so the dot never starts a line. Dates never break across lines.

Where a case page has an "In plain terms" block, it uses the small treatment: a muted label and one or two short paragraphs. It sits in the hero, before the Shown as row, except where that would push the case's first exhibit further down the first screen; Steno, Epistemic Skills and Fleet Orchestrator keep it directly under their first exhibit for that reason.

The four featured case pages open with their strongest real exhibit right after the jump links, so it starts within the first screen at 1440 by 900 pixels: Steno's archived designs, SaveBench's measured experiment, the Epistemic Skills publication check and the Fleet Orchestrator cockpit. Their headlines stay on two lines at that width.

## Featured and supporting work

Decided 22 September 2026. Four projects are featured, in this order: Steno, SaveBench, Epistemic Skills and Fleet Orchestrator. Each shows a different kind of proof: a designed product with recorded checks, an experiment in the game that kept its failing result, public source, and a component study with real visuals. Their rows on the home page alternate image left and right.

Five supporting projects follow, in this order: Neuraxic, Krewcible, Gridiron, Enaction and Poiesis. Neuraxic leads because the home page promises writing and no featured project covers it. On the home page Neuraxic and Krewcible show their own captures in frames of one shape, so their text lines up side by side. Gridiron and Enaction are text cards, and Poiesis takes the whole last row.

There is no fifth featured project. A fifth card would have to tell a new story about how I use AI and give a visitor something to check that the four don't already give, and none does yet. Poiesis is the standby. It moves up only after its page rewrite lands and one public, dated record goes beyond made-up test data.

Every list of these projects uses the same order: the home page, the Evidence table, the continue chain, More work and the README. Moving a project between tiers means changing all of them together, along with its crumb.

## Status, limits and credit

These conventions came out of an internal review of the public pages that I ran with AI reviewers in late September 2026. They exist so a reader meets each project's status in one vocabulary, reads each limit once, and finds the same account of how the AI tools were used wherever they look.

### Status line

Every home card, More work entry and case hero carries one status line. It uses one of the five labels in the "Shown as" column of the Evidence page (Prototype, Interface study, Component study, Recorded experiment, Public source), and the label links to the key at `evidence.html#status`. The markup is `<p class="status"><a href="evidence.html#status"><b>Label</b></a> · one plain clause about what is real</p>`, with the relative path adjusted for page depth. The line sits after the card's sentence and before its link, so a reader goes from claim to status to action. The label is ink and semibold and the clause is muted; there are no colored pills, because a colored chip reads as a badge. Case heroes use fixed keys instead: Shown as, Checked, Source, and Recording where a recording exists. The Shown as key holds the status line itself, the linked label and its clause, so every case hero has the same row. A label changes in the Evidence table first, then everywhere it appears.

### Boundary budget

The boundary budget is how often a page may state a limit. Each case page has one "What is real here" block, using the `.evidence-callout` element, and it leads with what actually ran and when. The required limits appear exactly once per page: the AI's role, the made-up content, and, where relevant, that nothing shown is a real agreement or matter and that sample terms are not recommended terms. A limit may also sit next to the one claim it bounds, but never twice in the same words. Every image, recording and share card carries a short label saying what it is, because those travel alone. On the home page each featured image has its label directly under it. Legal notices appear once. Where a page needs to say whose projects these are, it uses one sentence: "These are personal projects." The limits block uses ink on a plain background; orange stays for the brand mark, the focus ring and one primary action per page, and green stays for results. The README states its limits in one paragraph. Each case's evidence JSON remains the authoritative list of what that case does not show.

### Credit

Wherever a page briefly states how the work splits between me and the AI tools, it uses these two sentences word for word: "AI tools write the code. I decide what each project is for and check what comes back." The full account is on About, under the heading "How I work with AI tools" (`about.html#how-i-work`). Each case page has one contribution section headed "What went into this work." It holds the direction, what I did, what the AI tools did, and a link with the text "How I work with AI tools" to that About section. "What I did" opens with "I decide what each project is for and check what comes back." and "What the AI did" opens with "AI tools write the code.", so both sentences appear word for word on every case page. The one contact route is the line "Questions and conversations are welcome through my GitHub profile.", linked to https://github.com/SternOne.

### Footer

Every page's footer reads "Personal projects by Zach Stern." followed by two links: "How I work with AI tools" (`about.html#how-i-work`) and "What each project shows" (`evidence.html`), with paths adjusted for page depth. The footer names me and points to the account of the AI's part, so no footer repeats a limit.

## Walkthroughs, navigation and recordings

Each featured case adds a contribution account, one concrete decision story and a short walkthrough of observations a reader can check. Walkthroughs follow one convention, decided 22 September 2026:

- A numbered strip above the steps shows every step title, so a reader sees the whole path before starting.
- On screens wider than 720 pixels, one step shows at a time. The strip, Previous and Next move between steps, and the strip marks the current one.
- On phones, 720 pixels and narrower, every step is stacked in order with no Previous or Next buttons, and the strip links to each step. Nothing waits behind a button, and nobody has to scroll back up after each step.
- Without JavaScript every step shows and there is no strip. In print every step prints, and the strip and controls are left out.

`walkthroughs.js` builds the strip from each step's heading, so the step titles live only in the page. Step headings carry no number of their own, because the strip numbers them, and the buttons read "Previous" and "Next step" on every page.

Every page, including Steno's recorded-checks sub-page, carries the same five-link header nav in fixed order: Work (index.html#work), More work (more-work.html), Evidence (evidence.html), About (about.html), GitHub (external, last). The footer follows the rule above. Crumbs are tiered: "Showcase / …" on top-level pages, "Featured / <name>" linking index.html#work on featured cases, and "Supporting / <name>" linking more-work.html on supporting cases. The continue chain follows the project order, Steno, SaveBench, Epistemic Skills, Fleet Orchestrator, Neuraxic, Krewcible, Gridiron, Enaction and Poiesis, and Poiesis continues to More work. Its eyebrow reads "Continue exploring", except on Fleet Orchestrator, where "Continue to supporting work" marks the step into the supporting tier. The small link beside it reads "All featured work" on featured cases and on Poiesis, and "More work" on the other supporting cases.

Steno and Krewcible have silent, page-only recordings of the real prototype and component being operated with made-up content. Native playback, text tracks, transcripts and full-resolution stills keep dense interfaces readable. The recordings contain only captured frames. Steno's authored prototype questions stay distinct from its separate drafting checks. The composition panel in the Krewcible recording was added for the study. It displays the text that Krewcible's own function produces, which comes out the same way every time for the same choices.

Fleet Orchestrator's editable HTML diagram and walkthrough describe assertions from three isolated tests. The return to blocked status is explicit. All states use words as well as color; eligibility has no success tick or completion label. The page's diagrams explain the work; none of them is a screenshot of a running console.

The Epistemic Skills case uses a historical publication incident with a Git-object reproduction script, and its counts are marked as historical. On the home page it shows that check as an HTML panel. The Gridiron walkthrough follows the answer key for the sample drive without inventing timing or play-by-play speech.

## Supporting cases

Neuraxic, Krewcible, Gridiron, Enaction and Poiesis make up the supporting tier. They cover author-controlled continuity in a story, choices a person can see and change in a character editor, an event record behind game commentary, explicit role attribution, and returned-file identity. The supporting tier is a shorter reading path, so the four featured cases stay first. Enaction and Poiesis explain their work with editable HTML diagrams tied to concrete records or tests, with no invented product screenshots. Neuraxic and Krewcible lead with their original interfaces. The More work page holds the five supporting entries in the same order, then a section, "A fork and a practice", with the OpenClaw fork and the visual review guide.

Neuraxic shows open proposals and what the author has accepted as two different things. Enaction keeps the acting character distinct from the person using it, and does not imply generated dialogue or an accepted consequence from a staged turn.

### Fleet Orchestrator and Steno symbol systems

The Fleet Orchestrator and Steno pages explain their design with artwork the projects actually use. Fleet Orchestrator shows its home screen with made-up work and three boards of its glyphs, grouped by role, by state and by lineage and scale. The page layout around them was made for the showcase; the glyph renderer and the home components are used unmodified. Keep the plain-language account of what the person running the agents needs to see beside them, along with the Surface Bridge diagram of which part is responsible for what, drawn from the source, and the review-gate test story, which supports a narrower claim. Use the full project name throughout.

Steno's Hallmark gallery shows the emblem vocabulary as it is built: the assayer-style stamp, the material and facet grades, four evidence jewels, the custom glyphs, and the row and detail sizes. In the current source, the grade and the supporting marks are separate. The specimen labels make clear that no assessment ran. Preserve the original grade words as design vocabulary without treating them as legal assurances. These current component captures remain separate from the archived workspace prototype and recorded drafting checks.

Both galleries offer synchronized descriptions, alternative text, originals and keyboard-operable enlarged views. The public asset manifest records each image's exact identity and scope; source copies, private provenance and rendering scaffolds stay outside the published payload.

### Poiesis: identity and lifetime

Use selectable diagrams for this service case, with no invented product UI or generated model output. The dark two-column receipt panel separates byte identity from how long a file is kept; its "Hello" example is rebuilt from a passing test. The retention panel shows an explicit purge after expiry. A smaller diagram separates the encrypted content in the job queue from the key held in the job's record. Each diagram explains a different test, and together they are not one production trace.

Eight tests back narrow claims, and the case's evidence JSON lists what they do not show; keep those limits when refreshing the case. Its home card, last in the supporting row, spans the row on wider screens and stays in the normal reading order on phones.

### SaveBench and Neuraxic: product ideas made visible

These two expanded cases show original product UI, selectable view descriptions and actual navigation recordings. SaveBench leads with its game measurements, starting with the 9 September instrument check, and then explains a challenge, factory design on the map, kept revisions and comparison. The page says plainly that an AI model designed the factory in that experiment. Neuraxic explains an idea-first library, focus and facets before its narrower continuity evidence. SaveBench's featured card and Neuraxic's supporting card both show a preview of the real interface.

SaveBench keeps the existing prototype's own palette, blueprint and controls. Made-up layouts, rates and verdicts are labeled, and game artwork is left out of the captures. It keeps every measured window and says plainly which instrument was repaired; missing contestant measurements are not plotted as zero. Neuraxic keeps its own interface components, its reduced-motion shelf, procedural placeholder covers and declared local font fallbacks. The Neuraxic study feeds the real components made-up API responses with new fictional content; the project's own extraction and relationship-layout code runs as it normally does. Its wider World, Story and Minds and adaptation ideas are described as intent.

The stills and recordings shown are identified in the public asset manifest. Preparation scaffolding and source stay private. These two cases use captures of the real interfaces and no generated concept art, because a capture shows what exists and a generated screenshot could only show what it might look like. Do not replace them with generated product screenshots or treat either navigation recording as a backend acceptance run. Full-resolution access, native media controls, text tracks and selectable transcripts accompany the images.
