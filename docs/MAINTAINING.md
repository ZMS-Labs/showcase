# Maintaining the public showcase

The repository contains the ZMS Labs portfolio and its editable static website. GitHub Pages publishes `main:/docs` at <https://zms-labs.github.io/showcase/>. The site presents selected project artifacts; it does not deploy the featured applications.

## Source map

| Source | Purpose |
|---|---|
| `README.md` | GitHub introduction and selected work |
| `docs/index.html`, `site.css`, `site.js`, `walkthroughs.js` | Website, shared presentation, and interactive controls |
| `docs/case-studies/` | Five project studies, including Steno's separate recorded-check example |
| `docs/about.html`, `more-work.html`, `evidence.html` | Authorship, supporting work, evidence boundaries and attribution |
| `docs/assets/manifest.json` | Asset types, hashes, provenance, and supported claims |
| `docs/downloads/` | Reviewed Gridiron research-source snapshot |
| `docs/epistemic-skills.md` | Additional source-linked method case study |
| `scripts/verify_site.py` | Local link, responsive rendering, image, and interaction checks |
| `scripts/site_manifest.py` | Reproduce or check the static payload manifest |
| `assets/render_assets.py`, `assets/README.md` | Original GitHub masthead source, font notice, and rebuild instructions |
| `DESIGN.md` | Website and GitHub visual direction |

## Edit and verify

Edit the HTML directly; there is no hidden build step. Keep claims, headings, captions, alternative text, and diagrams consistent. Review current project evidence before changing counts or status. Preserve each product's visual language and provide full-resolution access to dense captures.

For a local preview:

```bash
python -m http.server 8000 --directory docs
```

For the existing browser checks, install Python's `playwright` package in your development environment and its Chromium browser (`python -m playwright install chromium`), then run:

```bash
python scripts/verify_site.py
python scripts/site_manifest.py --check
git diff --check
```

The browser check discovers every HTML page and exercises desktop and two narrow widths. It checks images, local links, horizontal overflow, existing controls, keyboard walkthroughs, focus, no-JavaScript access and transcripts. It briefly serves the static files on loopback to check both videos, seeking, playback and descriptive tracks, then stops the server. Because that temporary Python server lacks byte-range support, its media check fully buffers the local recording before seeking; the deployed check exercises the host's actual seek behavior with metadata preload. Use `--base-url https://zms-labs.github.io/showcase/` to repeat the checks against the published copy. Optional `--screenshots <directory>` saves inspection images outside `docs/`. These checks cover the presentation; they do not certify the featured products or full accessibility conformance.

The genuine Steno and Krewcible recordings have native controls, no autoplay, descriptive text tracks, selectable transcripts and synthetic content. Preserve their distinction from live product operation. Record new media provenance and inspect both pixels and metadata before replacing them.

Run `python scripts/replay_manifest_case.py` in a full clone to reproduce the historical Epistemic Skills publication case. This uses public Git objects and requires no network or model. Its 28-file counts describe that historical publication.

After changing site files, run `python scripts/site_manifest.py --write`, inspect the manifest diff, then run `--check`. Update the asset manifest only after reviewing the underlying changed asset. Hashes establish identity, not correctness. The manifests exclude themselves and the source-only `MAINTAINING.md` and `epistemic-skills.md` guides; their declared scope is explicit.

Inspect changed layouts and labels in a real browser, including at 320px and 390px, and inspect the GitHub README in its supported themes. A fixed light website palette does not imply a separate dark design. For original masthead changes, rebuild the SVGs using the [asset instructions](../assets/README.md).

## Publication and privacy

Publish only intentionally public artifacts. A private application may have a public case study without exposing its repository. Do not add private repository links, operational paths, real matter data, machine identities, credentials, or unreviewed screenshots. Inspect pixels and metadata. Keep sensitive preparation records private and useful public attribution beside the artifact.

Preserve included licenses and notices. Do not silently replace the Gridiron source archive or treat a hash update as a rights review. A new source export needs its own content and license review; application publication is a separate decision.

Use a pull request, review the exact diff, and pass required checks. After merging, inspect the Pages build and live website: confirm the deployed source revision, navigation, images, controls, and download hash. A merged commit is not by itself proof that deployment succeeded. Keep `main:/docs` as the publishing source unless a separately reviewed change updates both hosting and this guide.

## Organization presentation

The native organization profile lives in the public `.github` repository. It links to this website and the source repository. Repository pins are managed separately through GitHub's organization profile interface.

## Visual documentation quality

Follow the [ZMS Labs documentation standard](https://github.com/ZMS-Labs/.github/blob/main/docs/documentation-standard.md#use-visuals-to-explain) for changed visuals. Verify labels, arrows, order, grouping, and status against source; distinguish concept, implementation, and observation. Preserve authentic demonstrations, product identity, accessible equivalents, and provenance. Inspect the actual destination and record concrete checks and limitations. Use one bounded review and affected rechecks; no independent-model gate is required. Adoption does not certify historical visuals.
