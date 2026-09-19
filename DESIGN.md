# ZMS Labs showcase design

The showcase extends the clear typography and geometric artwork used by Epistemic Skills into an organization-level introduction. It should help a visitor understand the focus, find a concrete project, and inspect the evidence behind the presentation.

## Visual system

- Deep ink `#152c35` provides a stable masthead in either GitHub theme.
- Warm white `#f5f3ed` carries the title; orange `#ffac70` identifies the accent geometry.
- Muted blue `#b7c8cc` carries secondary text with readable contrast.
- Archivo is the display face. Native GitHub typography handles prose and navigation.
- The geometric composition represents connections between reasoning, tools, and workflows. It is conceptual artwork, not a system topology or a depiction of private infrastructure.

The masthead is an introduction, followed immediately by a readable text description and working links. The featured project carries the proof. Tables compare practical problems, principles, and evidence; they are not decorative cards.

## Responsive and accessible behavior

Wide and narrow SVGs use purpose-built compositions selected by an HTML `picture` element. Outlined type avoids font-service dependencies. Each SVG has a title and description, and the README supplies alternative text. Essential information is repeated in native Markdown.

No animation, embedded scripts, external font services, tracking pixels, or generated contribution counters are required. The page stays useful if the artwork does not load.
