# ZMS Labs showcase design

The showcase extends the clear typography and geometric artwork used by Epistemic Skills into an organization-level introduction. It should help a visitor understand the focus, find a concrete project, and inspect the evidence behind the presentation.

## Visual system

- Deep ink `#152c35` provides a stable masthead in either GitHub theme.
- Warm white `#f5f3ed` carries the title; orange `#ffac70` identifies the accent geometry.
- Muted blue `#b7c8cc` carries secondary text with readable contrast.
- Archivo is the display face. Native GitHub typography handles README prose and navigation; the website bundles Archivo locally.
- The geometric composition represents connections between reasoning, tools, and workflows. It is conceptual artwork, not a system topology or a depiction of private infrastructure.

The masthead is an introduction, followed immediately by a readable text description and working links. The featured artifacts carry the evidence. Tables compare practical problems, principles, and evidence; they are not decorative cards.

## Responsive and accessible behavior

Wide and narrow SVGs use purpose-built compositions selected by an HTML `picture` element. Outlined type avoids font-service dependencies. Each SVG has a title and description, and the README supplies alternative text. Essential information is repeated in native Markdown.

The README needs no scripts or external font service. The website uses small local scripts for method selection, evidence tabs, and product galleries; its content and direct full-resolution image links remain available without JavaScript. Neither surface uses analytics, remote font services, or generated contribution counters.

## The full website

The website uses an editorial layout: large purposeful headings, generous space, warm paper, deep ink, and restrained orange accents. It connects each project's concrete problem to decisions, artifacts, and limits. Steno and Krewcible retain their distinct interface typography and arrangement inside authentic captures rather than being redrawn to match the portfolio.

The Gridiron illustration relates a field, an event record, and commentary. The Epistemic Skills illustration presents investigation, examination, and verification as available methods, not a mandatory sequence. Both were created with OpenAI image generation and are identified as conceptual artwork. Unsupported trend lines and success signals were rejected. Important explanations remain selectable HTML text.

The Steno clause illustration ends with questions for human review, not a clearance or automatic legal decision. Krewcible's heading describes visible choices and changes, not persistent history or generated media. The [evidence page](docs/evidence.html) and [asset manifest](docs/assets/manifest.json) preserve public-safe provenance and scope.

Desktop and narrow layouts were inspected, with full-resolution galleries for product images. Controls support keyboard activation, visible focus, and dialog focus return. The fixed light palette is deliberate; the GitHub masthead remains legible against either surrounding theme. Automated rendering checks supplement visual inspection and do not certify taste, semantic truth, or full accessibility compliance.
