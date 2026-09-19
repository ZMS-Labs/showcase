"""Reproduce the static site's file inventory. Hash identity is not content approval."""
from pathlib import Path
import argparse
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1] / "docs"
EXCLUDED = {"EXPORT-MANIFEST.json", "SHA256SUMS.txt", "MAINTAINING.md", "epistemic-skills.md"}
parser = argparse.ArgumentParser(description=__doc__)
mode = parser.add_mutually_exclusive_group(required=True)
mode.add_argument("--write", action="store_true")
mode.add_argument("--check", action="store_true")
args = parser.parse_args()
files = []
for path in sorted(ROOT.rglob("*")):
    if path.is_file() and path.relative_to(ROOT).as_posix() not in EXCLUDED:
        files.append({"path": path.relative_to(ROOT).as_posix(), "bytes": path.stat().st_size,
                      "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
manifest = {"schema": "static-portfolio-export-v1", "status": "Approved public showcase source",
            "scope": "Static site payload; excludes the two manifests and source-only MAINTAINING.md and epistemic-skills.md",
            "files": files}
outputs = {"EXPORT-MANIFEST.json": json.dumps(manifest, indent=2) + "\n",
           "SHA256SUMS.txt": "".join(f"{f['sha256']}  {f['path']}\n" for f in files)}
for name, expected in outputs.items():
    target = ROOT / name
    if args.write:
        target.write_text(expected, encoding="utf-8", newline="\n")
    elif not target.exists() or target.read_text(encoding="utf-8") != expected:
        raise SystemExit(f"Manifest drift: {name}; inspect changes, then use --write")
print(f"Static payload: {len(files)} files; manifests {'written' if args.write else 'match'}")
