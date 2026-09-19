# Maintaining the public showcase

This repository is a concise introduction to ZMS Labs' public work. It is documentation and artwork; it does not run a service.

## Source map

| File | Purpose |
|---|---|
| `README.md` | Public introduction and featured-project links |
| `docs/epistemic-skills.md` | Evidence-linked project case study |
| `assets/render_assets.py` | Reproducible SVG artwork |
| `assets/README.md` | Font provenance, licensing, and rebuild instructions |
| `DESIGN.md` | Visual direction and accessibility decisions |

## Editing

Keep the introduction brief and support material claims with public source links. Distinguish released capabilities, experiments, forks, and archived work. Verify the current project documentation before changing counts, support claims, or status language.

Include only deliberately public information. Do not copy internal notes, personal details, system inventories, network addresses, credentials, private project names, or operational paths into prose, images, commit messages, or examples. Check image metadata as well as visible text. Do not change another repository's visibility to make a link work.

For artwork changes, rebuild the SVGs using the instructions in [assets](../assets/README.md). Keep nearby Markdown equivalent to the essential image text. Review both narrow and wide layouts.

Before publication, run `git diff --check`, check all changed links, inspect staged files for unintended content, and confirm that every featured repository is public. After pushing, confirm the public README and artwork match the intended commit.

## Organization presentation

The organization description can link to this repository as its public introduction. Featured repository pins are managed through GitHub's organization profile interface. This repository's README is a standalone showcase; it does not automatically become an organization-page README.

See [GitHub's organization profile documentation](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile) for the distinction.
