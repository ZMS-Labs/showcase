# Design record: sternone.net

This file records how the site looks and reads, and why. Earlier design records (the September 2026 editorial site and the October product-scroll candidate) are in the Git history of this file.

## Who it's for and what it has to do

The site introduces me to people who might hire me: in-house legal teams and the people they work with. The first screen has to establish a credible commercial lawyer with practical judgment who also improves how work gets done. Everything after that should give a reason to keep reading.

Professional work comes first: Dovenmuehle (in-house, 2017 to 2026), then Tishler &amp; Wald (2007 to 2016). Independent work comes second, under the ZMS Labs name, and is kept visibly separate from employer work.

## Two settings, one system

- **Paper** (`#f6f5f1`) with ink (`#121212`) carries the professional work. Secondary text is `#62615b` (5.6:1 on paper). The signal color `#b8461a` (4.9:1 on paper) marks focus, active states and misses.
- **Night** (`#0e1b21`) with `#f1efe8` text carries ZMS Labs work. The ZMS orange `#ffac70` (9.5:1 on night) is its accent.
- Moving from paper to night tells the reader they've moved from employer work to independent projects. No other color carries meaning on its own; every state also has a word.

Archivo is the only typeface, served locally as a Latin WOFF subset that keeps both of its axes (weight 100 to 900, width 62 to 125), with the unmodified TTF as the fallback. Width does the work a second family would: the name and headings run at 80 to 88 percent width, figures at 70 percent with tabular numerals, small labels at 115 percent in capitals. Body text is 17 to 19 pixels at a 64-character measure.

A small capital label sits above a heading only when it adds something the heading doesn't: the employer and dates, the ZMS Labs marker that separates independent work, a project's name and kind, a step's place in a story, or what a picture is. Labels that only name the section ("The record", "How it works") are left out.

Product captures keep each product's own look and are never recolored. Every image, recording and share card carries a short label saying what it is (Prototype, Component study, AI-generated artwork and so on).

## Page anatomy

- **Home:** name and one-sentence proposition; three facts (nearly 10 years in-house, 7 years at Tishler &amp; Wald, the $17,487,520.30 claim); the two roles side by side, Dovenmuehle first; the agreements story; the litigation case with its timeline; ZMS Labs on night with three featured projects (Interleaf, SaveBench, Epistemic Skills) and the other six as an index; how I work with AI; contact.
- **About:** the hero carries my photograph as a plate: a 4:5 print in true color with a hairline edge, hung top right beside the heading with the label "Photo" and the place, and the ledger under it. On narrow screens it follows the lead in reading order. The photo is cropped and resized only, never retouched, and the crop keeps every bystander out of frame.
- **Professional pages** (`commercial-agreements.html`, `ear.html`): problem, my part, result, then sources. One sentence says what the sources establish and what is my own account.
- **Case pages:** a night hero (crumb, the project's label, a plain h1, a lead that states the problem and what the project does, the status line, the strongest real exhibit), a story or walkthrough that a non-engineer can follow, product exhibits, "What went into this work", a short record (what ran and when, the source, what isn't shown yet), a closed "full record" disclosure holding the technical detail, limits, credits and JSON links, then the next project.
- **Sources and records** (`evidence.html`): the status key, the project table, and credits and licenses.
- **404:** self-contained, because GitHub Pages serves it at any depth.

## Motion

Motion is only used where the change itself is the point, and every story reads completely without it.

- **Scroll stories** (`[data-story]`): the text steps scroll normally; the picture beside them stays in view and changes when a step reaches the middle of the screen, in either direction. Used for the clause questions on the home page, the 28-file check on Epistemic Skills, the measuring-tool trials on SaveBench and the notice and liability clauses on Interleaf. Inactive steps are dimmed by color, not opacity, so they keep AA contrast.
- **Reveals and timelines** fade in once as they arrive. The SaveBench bars grow to their recorded values.
- The visitor's reduced-motion setting turns all of it off, and the footer has a motion switch. Without scripts, every step shows and each picture shows its final state.

## Words

Lead with the problem, then my contribution, then the result. Plain words; any technical term is explained the first time in a few words, or replaced. Short paragraphs, one idea each. Confident about what was built and observed. Each limit is stated once, attached to the fact it bounds, in the record section; no defensive lists of what something isn't. No em or en dashes, no "ensure", "robust", "leverage" or similar filler, no exclamation points outside quoted product output. US dates ("September 19, 2026").

The credit is the same everywhere it appears: "AI tools write the code. I decide what each project is for and check what comes back." Each case page says what I did and what the AI tools did.

Privacy and claims: the litigation client and the competing creditor are not named, and court sources are cited by docket number. The $17,487,520.30 figure is described as a competing claim defeated, never as money recovered. In-house examples are illustrations; no company terms appear.

## Conventions the checks rely on

- Titles read "Page · Zach Stern"; og:title matches the title and og:description matches the meta description. Every page has an og:image at 1200 by 630 and `summary_large_image`.
- Status lines: `<p class="status"><a href="evidence.html#status"><b>Label</b></a> · one plain clause</p>`, with the label matching the Evidence table.
- Project order everywhere: Interleaf, SaveBench, Epistemic Skills, Fleet Orchestrator, Neuraxic, Krewcible, Gridiron, Enaction, Poiesis. On the home page the first three are `.home-project` features and the rest are `.gallery-card` rows.
- Header navigation: Experience, Work, About, LinkedIn. Footer: Experience, Work, About, How I work with AI tools, Sources and records, LinkedIn. LinkedIn is the only contact route.
- Walkthroughs keep the `[data-walkthrough]` contract that `walkthroughs.js` and the verifier use. Galleries keep the `.design-view` contract that `site.js` uses.

## Share cards

`scripts/render_share_cards.py` renders every card in `docs/assets/og/` from HTML, using the site stylesheet. The default card is the name, the proposition and three facts on paper. Project cards put the project name and one line on night beside the project's own capture or a drawn panel of its recorded result, with the label that says what the picture is.

## Research basis

The layout and copy rules above follow published findings, checked through Consensus on October 5, 2026:

- People judge a page's visual appeal within about 50 milliseconds, and those first judgments hold up ([Lindgaard et al., 2006](https://doi.org/10.1080/01449290500330448); [Tractinsky et al., 2006](https://doi.org/10.1016/j.ijhcs.2006.06.009)). Pages with low visual complexity and a familiar layout are rated most appealing ([Tuch et al., 2012](https://doi.org/10.1016/j.ijhcs.2012.06.003)), and the same content in a better design is judged more credible ([Robins and Holmes, 2007](https://doi.org/10.1016/j.ipm.2007.02.003); [Fogg et al., 2003](https://doi.org/10.1145/997078.997097)). Hence a quiet, conventional first screen with real-world facts.
- Plain language beats legalese, including with lawyers ([Martínez et al., 2023](https://doi.org/10.1073/pnas.2302672120)). Needlessly complex words lower judged intelligence ([Oppenheimer, 2006](https://doi.org/10.1002/acp.1178)). Avoiding jargon, filler and hedges makes business writers read as more confident and professional ([Campbell et al., 2021](https://doi.org/10.1177/23294884211025735)).
- Frequent hedges make a speaker seem less competent and credible ([Erickson et al., 1978](https://doi.org/10.1016/0022-1031%2878%2990015-x); [Blankenship and Holtgraves, 2005](https://doi.org/10.1177/0261927x04273034)). Stating a specific uncertainty costs little trust ([van der Bles et al., 2020](https://doi.org/10.1073/pnas.1913678117)). Hence limits stated once, attached to the specific fact.
- Honest self-promotion improves interview evaluations through perceived competence ([Stevens and Kristof, 1995](https://doi.org/10.1037/0021-9010.80.5.587); [Amaral et al., 2019](https://doi.org/10.1111/ijsa.12260)), while humblebragging backfires ([Sezer et al., 2018](https://doi.org/10.1037/pspi0000108)).
- Precise figures read as more factual ([Schindler and Yalch, 2006](https://consensus.app/papers/details/832224bba1f55ccc87b6598a3d06f6c2/)); rounded ones are easier to remember ([Nguyen et al., 2022](https://doi.org/10.1145/3491102.3501852)). The site shows the exact $17,487,520.30 wherever the figure is the point, and "$17.49 million" in short references to the same claim.
- Typefaces that suit the document make the author seem more professional and trustworthy ([Shaikh, 2007](https://consensus.app/papers/details/3dbb19ec1eb65b40a91e85e592d42ae3/); [Shaikh et al., 2008](https://consensus.app/papers/details/69d1077333635abd8271a3d2ae06789f/)); restrained typographic variety reads as more authoritative ([Moys, 2013](https://consensus.app/papers/details/18f41b7eddb35909b9e8e73045131a66/)).
- About 55 characters per line supports comprehension ([Dyson and Haselgrove, 2001](https://doi.org/10.1006/ijhc.2001.0458)); margins help comprehension ([Chaparro et al., 2004](https://consensus.app/papers/details/2733c443e5005806a83d4ead2cd50962/)); larger body text improves readability ([Rello et al., 2016](https://doi.org/10.1145/2858036.2858204)).
- A face on a page adds warmth, and warmth feeds trust, but the photo does not raise trust on its own ([Cyr et al., 2009](https://doi.org/10.2307/20650308); [Riegelsberger et al., 2003](https://doi.org/10.1145/642611.642634)). In professional profiles the text drives judgments of expertise, and a good photo helps most beside strong text ([Domahidi et al., 2021](https://doi.org/10.1080/15213269.2021.1927104)). A natural smile reads as warm without costing competence in serious settings ([Wang et al., 2016](https://doi.org/10.1093/jcr/ucw062)). Hence one modest photo on About, next to the heading and the record, rather than a large portrait or none.
- Animation helps mainly when the change itself is what must be understood ([Tversky et al., 2002](https://doi.org/10.1006/ijhc.2002.1017); [Ploetzner et al., 2020](https://consensus.app/papers/details/81d60102dd305e929e42d262ee2ea121/)). Reader-paced segments and signaling help learning ([Rey et al., 2019](https://doi.org/10.1007/s10648-018-9456-4); [Schneider et al., 2018](https://doi.org/10.1016/j.edurev.2017.11.001)), and scrollytelling raises engagement without hurting comprehension ([McKenna et al., 2017](https://doi.org/10.1111/cgf.13195)).

## Other surfaces

The GitHub masthead (`assets/zms-labs.svg`, `assets/zms-labs-mobile.svg`) is the ZMS Labs identity and stays as it was; see [asset notes](assets/README.md). The README leads with the same professional summary as the site.
