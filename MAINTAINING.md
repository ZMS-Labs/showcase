# Maintaining the showcase

These are the working rules for changing the showcase. They apply to whoever makes the change, including an AI tool. AI tools write the code. I decide what each project is for and check what comes back. If you came to see the work itself, start at the [showcase](https://zms-labs.github.io/showcase/) or the [README](README.md).

GitHub Pages publishes `main:/docs` at <https://zms-labs.github.io/showcase/>. The site shows selected project artifacts; it does not run the applications themselves. This guide, `README.md` and `DESIGN.md` sit outside `docs/`, so Pages does not serve them.

## Source map

| Source | Purpose |
|---|---|
| `README.md` | GitHub introduction and the project list |
| `MAINTAINING.md` | This guide |
| `DESIGN.md` | Design decisions for the website and the GitHub pages |
| `docs/README.md` | Short landing page for the `docs/` folder on GitHub |
| `docs/index.html`, `site.css`, `site.js`, `walkthroughs.js` | Website, shared presentation and interactive controls |
| `docs/case-studies/` | Project case studies, including Steno's separate recorded-checks page, and each case's evidence JSON |
| `docs/about.html`, `more-work.html`, `evidence.html` | About me and how I work with AI tools, the supporting projects, and the status table with evidence and attribution |
| `docs/assets/manifest.json` | Asset types, hashes, sources and what each asset supports |
| `docs/assets/og/`, `docs/sitemap.xml`, `docs/robots.txt` | Link-preview images and search metadata, maintained per page |
| `docs/downloads/` | Gridiron research-source snapshot |
| `scripts/verify_site.py` | Local link, responsive rendering, image and interaction checks |
| `scripts/site_manifest.py` | Write or check the payload manifests; also checks for designated private names when the local list is present |
| `scripts/replay_manifest_case.py` | Replay the site's first publication check from public Git objects |
| `assets/render_assets.py`, `assets/README.md` | GitHub masthead source, font notice and rebuild instructions |

## Edit and verify

Edit the HTML directly; there is no hidden build step. Keep claims, headings, captions, alternative text and diagrams consistent. Review current project evidence before changing counts or status. Keep dated results dated: SaveBench's game records and the original publication check are records of past runs, not fresh runtime checks. Poiesis checks returned-file identity and prompt custody in separate tests: do not turn an explicit purge into a production scheduler claim, or a cleared key into a promise that backups are erased. Keep each product's own look and give full-resolution access to dense captures.

Each case's evidence JSON and its limit fields (the field names vary by case) are the authoritative statement of what that case does not show. Keep page text, captions and these guides consistent with it. I want each limit stated once and accurately, so a page stays easy to read and never overstates what it shows. On the site, each case page states its required limits once, in its "What is real here" block, and every status line uses one of the five labels in the Evidence page's "Shown as" column. [DESIGN.md](DESIGN.md) records both conventions.

Projects appear in one order everywhere. The four featured projects are Steno, SaveBench, Epistemic Skills and Fleet Orchestrator, and the five supporting projects are Neuraxic, Krewcible, Gridiron, Enaction and Poiesis. The home page, the Evidence table, the More work page, the README and `docs/README.md` list them in that order, each case page's crumb names its tier, and each case page's continue link goes to the next project in the order, with Poiesis continuing to More work. Change them together; `python scripts/verify_site.py --prepublish` fails when any of them except `docs/README.md` falls out of that order.

Open Graph and Twitter card metadata and the sitemap are maintained per page. Every page carries the shared meta block in its `<head>` (type, site name, title, description, URL, image, and `summary_large_image` card); a new page must add that block, an og image under `docs/assets/og/` at 1200x630 (or reuse `og-default.png`), a matching entry in `docs/sitemap.xml`, and, for a new image, an asset-manifest entry that records its source. The `og:image` URL is absolute, like the other discovery URLs, so it keeps working from any host or preview path; update `lastmod` when a page ships. Crawlers read `robots.txt` only at the host root, so the copy at `/showcase/robots.txt` does not announce the sitemap; submit the sitemap by hand if search indexing matters.

For a local preview:

```bash
python -m http.server 8000 --directory docs
```

For the browser checks, install Python's `playwright` package in your development environment and its Chromium browser (`python -m playwright install chromium`), then run:

```bash
python scripts/verify_site.py
python scripts/site_manifest.py --check
git diff --check
```

The browser check discovers every HTML page and renders it at 1440, 390 and 320 pixels wide. It checks images, local links, horizontal overflow, the interactive controls, keyboard walkthroughs, focus, no-JavaScript access and transcripts. It briefly serves the static files on loopback to check all four videos, seeking, playback and text tracks, then stops the server. Because that temporary Python server lacks byte-range support, its media check fully buffers the local recording before seeking; the deployed check exercises the host's actual seek behavior with metadata preload. It also fails on a typographic quote inside a code or pre block, because a curled quote breaks a command someone pastes into a shell, and when the Steno receipt's served-bytes digest disagrees with the evidence file or with `SHA256SUMS.txt`. On phone widths it accepts walkthrough steps stacked in order and a full-resolution link in place of Expand, as [DESIGN.md](DESIGN.md) describes; at 1440 pixels it requires the step controls and Expand. Use `--base-url https://zms-labs.github.io/showcase/` to repeat the checks against the published copy, or `--root <folder>` to check a copy of the site in another folder, such as an export. Optional `--screenshots <directory>` saves inspection images outside `docs/`. A normal run also counts four kinds of publishing problem in every text file Git tracks or would add: bracketed placeholder tags that mark words or decisions I still owe, dashes, wording the house style rules out, and breaks in the project order or in the case pages' required blocks. `--prepublish` fails while any are left. These checks cover the presentation only. They say nothing about the products themselves, and they are not a full accessibility audit.

`site_manifest.py` writes two files from one pass over `docs/`: `EXPORT-MANIFEST.json`, which describes the payload and its scope, and `SHA256SUMS.txt`, a plain checksum list for simple tools. Each recording's duration and width come from `docs/assets/manifest.json`, keyed by the asset's directory. The verifier requires the four expected recording directories, rejects missing or duplicate entries, and reports how many playback checks completed. `verify_site.py` also hard-codes two sets of numbers on purpose: the cue counts in the text tracks and the finding counts on the recorded-check page. Change them only after reviewing the changed track or findings, so that repackaging a video can never change them unnoticed. New pages that use JavaScript must keep the noscript pattern the check enforces: with scripts disabled, the fallback message and the evidence links stay visible, as on the recorded-check page.

The Steno, Krewcible, SaveBench and Neuraxic recordings capture the real interfaces (for Steno, the archived prototype) being operated with made-up content. They have native controls, no autoplay, text tracks and selectable transcripts. Do not describe them as live product operation. Record where new media came from, and inspect both pixels and metadata before replacing any of them. The Fleet Orchestrator and Steno Hallmark galleries use current component artwork with made-up inputs; keep them distinct from archived prototypes, live connections, test runs and real assessments. The verifier checks every gallery as well as the product-specific checks it already had.

Run `python scripts/replay_manifest_case.py` in a full clone to reproduce the historical Epistemic Skills publication case. This uses public Git objects and requires no network or model. Its 28-file counts describe that historical publication.

After changing site files, run `python scripts/site_manifest.py --write`, inspect the manifest diff, then run `--check`. Update the asset manifest only after reviewing the underlying changed asset. A matching hash shows a file is the one listed; it does not show that the content is right. The manifests exclude only themselves. The favicon `assets/icons/favicon.svg` is part of the published payload and must be declared in the asset manifest.

Inspect changed layouts and labels in a real browser, including at 320px and 390px, and inspect the GitHub README in its light and dark themes. The website's fixed light palette is deliberate. For masthead changes, rebuild the SVGs using the [asset instructions](assets/README.md).

## The private-name list

`scripts/site_manifest.py` can also check every file Git tracks, or would add, for names that must stay out of this public repository. The list lives at `.local/forbidden-names.txt`, which `.gitignore` excludes, with one name per line; blank lines and lines starting with `#` are skipped. The check reports the file and line where a name appears without printing the name.

`--check` always compares the file hashes and prints one line saying whether the name check ran. `--write` refuses to run without the list, so the manifests are rewritten only after the name check passes. Nothing runs the script automatically, so a name is caught only when someone runs it with the list present. Never commit the list, and never write a listed name in an issue, pull request, commit message or log.

## Publication and privacy

Publish only intentionally public artifacts. A private application may have a public case study without exposing its repository. Do not add private repository links, operational paths, real matter data, machine identities, credentials, or unreviewed screenshots. Inspect pixels and metadata. Keep sensitive preparation records private and useful public attribution beside the artifact.

Preserve included licenses and notices. Do not silently replace the Gridiron source archive or treat a hash update as a rights review. A new source export needs its own content and license review; application publication is a separate decision.

Automated rewriting passes, such as a prose or style pass run by an AI tool, never edit identity copy without my review, and never touch code blocks, commands or quoted strings. Identity copy is the README introduction, the home page opening, About, each case study's opening and anything written in the first person. An earlier prose pass (pull request #19) curled the quotes in a test command on one of the case pages, so the command failed when pasted into a shell.

Use a pull request, review the exact diff, and run the checks above before merging. After merging, inspect the Pages build and live website: confirm the deployed source revision, navigation, images, controls, and download hash. A merged commit is not by itself proof that deployment succeeded. Keep `main:/docs` as the publishing source unless a separately reviewed change updates both hosting and this guide.

The SaveBench and Neuraxic interface studies use the real product components with made-up state. Keep their recordings separate from SaveBench's game records and Neuraxic's backend tests. SaveBench leaves game artwork out of its captures; do not describe that as a product terrain toggle. Neuraxic uses its original reduced-motion shelf and local font fallbacks, and its prose offers are fixed placeholders. Neither recording shows a complete product or a saved workflow. The adjacent `interface-study.json` files describe scope; the asset manifest identifies the exact captures.

## Organization presentation

The native organization profile lives in the public `.github` repository. It links to this website and the source repository. Repository pins are managed separately through GitHub's organization profile interface.

## Visual documentation quality

Follow the [ZMS Labs documentation standard](https://github.com/ZMS-Labs/.github/blob/main/docs/documentation-standard.md#use-visuals-to-explain) for changed visuals. Check labels, arrows, order, grouping and status against the source, and say whether a visual shows a concept, an implementation or an observation. Keep real demonstrations real, keep each product's own look, provide a text equivalent and record where each visual came from. Look at the result where it will actually appear, and note what you checked and what you could not. One review, plus rechecks of anything it affects, is enough.

## Review history

September 2026: the first critical review of the whole site, by a separate AI agent. The pull requests that followed it record what changed.
