# Showcase artwork

The mastheads are original vector compositions in the visual family of [Epistemic Skills](https://github.com/ZMS-Labs/epistemic-skills). The connecting lines are conceptual artwork. They do not depict infrastructure, a network, or an operational workflow.

Rebuild with Python and `fonttools`:

```bash
python assets/render_assets.py
```

The small SVG drawing helper is adapted from Epistemic Skills' [documentation asset generator](https://github.com/ZMS-Labs/epistemic-skills/blob/b2c7270ee53142046e1fda38980053d2dd7906fb/docs/assets/render_assets.py), which Epistemic Skills licenses under GPL-3.0-or-later. This repository distributes its code and compositions under GPL-3.0-or-later, as the [README](../README.md) states.

The bundled, unmodified Archivo font is distributed under the [SIL Open Font License](fonts/OFL.txt), separately from the repository license. Its source is [Google Fonts / Archivo](https://github.com/google/fonts/tree/main/ofl/archivo), and its SHA-256 is `0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053`.

SVG lettering is converted to paths. Reading the README requires no font installation or remote font request.

## Website assets

The site's separate `docs/assets/` directory holds the locally served Archivo font, captures of the real product interfaces with made-up content, and two AI-generated conceptual illustrations made with OpenAI image generation. Each illustration also has a WebP copy that the pages show for faster loading; the original PNGs, which keep their embedded Content Credentials record, stay alongside them. The [asset manifest](../docs/assets/manifest.json) records each file's identity and what it supports, and the [Evidence page](https://zms-labs.github.io/showcase/evidence.html) covers origins and notices. Product images keep each interface's own look, and the illustrations never stand in for product evidence. Private preparation records keep the generation prompts and the directions that were rejected.
