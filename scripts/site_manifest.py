"""Write or check the site's file list: docs/EXPORT-MANIFEST.json and docs/SHA256SUMS.txt.

A matching hash shows a file is the one listed. It does not show that the file's content is right.

The name check looks for designated private names in the repository. The names are kept in
.local/forbidden-names.txt, an untracked file that only the maintainer has, one name per line
(blank lines and lines starting with # are skipped). The check reads every file git tracks or
would add, and it reports where a name appears without printing the name. Nothing runs this
script automatically, so a name is caught only when someone runs it with the list present.

--check always compares the file hashes and prints one line saying whether the name check ran.
--write refuses to run without the name list, so the manifests are rewritten only after the
name check passes.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "docs"
NAME_LIST = REPO / ".local" / "forbidden-names.txt"
MANIFESTS = ("EXPORT-MANIFEST.json", "SHA256SUMS.txt")
# Maintainer guides. GitHub Pages serves them as plain text, but they are not part of the presented site.
GUIDES = ("MAINTAINING.md", "epistemic-skills.md")


def load_names():
    """Return the listed names, or None when the local list does not exist."""
    if not NAME_LIST.is_file():
        return None
    lines = NAME_LIST.read_text(encoding="utf-8").splitlines()
    return [line.strip() for line in lines if line.strip() and not line.lstrip().startswith("#")]


def files_to_scan():
    """Every file git tracks or would add. Falls back to docs/ when git is unavailable."""
    command = ["git", "-C", str(REPO), "ls-files", "-z", "--cached", "--others", "--exclude-standard"]
    try:
        listed = subprocess.run(command, capture_output=True, check=True).stdout.decode("utf-8")
    except (OSError, subprocess.CalledProcessError):
        return sorted(p for p in ROOT.rglob("*") if p.is_file()), "docs/ only, because git was unavailable"
    paths = {REPO / p for p in listed.split("\0") if p}
    return sorted(p for p in paths if p.is_file()), "the repository"


def name_hits(names):
    """Return the scope, the number of files read, and each hit as a path and line, never the name."""
    pattern = re.compile("|".join(rf"\b{re.escape(n)}\b" for n in names), re.IGNORECASE)
    paths, scope = files_to_scan()
    hits = []
    for path in paths:
        relative = path.relative_to(REPO).as_posix()
        shown = pattern.sub("<listed name>", relative)  # a path can hold the name too
        if shown != relative:
            hits.append(f"{shown} (file path)")
        text = path.read_text(encoding="utf-8", errors="replace")
        hits += [f"{shown}:{number}" for number, line in enumerate(text.splitlines(), 1) if pattern.search(line)]
    return scope, len(paths), hits


parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
mode = parser.add_mutually_exclusive_group(required=True)
mode.add_argument("--write", action="store_true", help="rewrite both manifests (needs the local name list)")
mode.add_argument("--check", action="store_true", help="confirm both manifests match the files in docs/")
args = parser.parse_args()

names = load_names()
list_path = NAME_LIST.relative_to(REPO).as_posix()
if args.write and not names:
    raise SystemExit(f"Refusing to write: the name list {list_path} is missing or empty. "
                     "The name check has to run before the manifests are rewritten.")
if names:
    scope, scanned, hits = name_hits(names)
    if hits:
        raise SystemExit("Name check: failed. A designated private name appears at: " + ", ".join(hits))
    print(f"Name check: ran over {scanned} files in {scope}; no listed name found")
else:
    reason = "no local name list" if names is None else "the local name list is empty"
    print(f"Name check: not run ({reason} at {list_path}); file hashes are still checked")

guides = [g for g in GUIDES if (ROOT / g).is_file()]
excluded = set(MANIFESTS) | set(guides)
scope_text = "Static site payload; excludes the two manifests"
if guides:
    noun = "guide" if len(guides) == 1 else "guides"
    scope_text += f" and the maintainer {noun} {' and '.join(guides)}, which GitHub Pages also serves as plain text"
files = []
for path in sorted(ROOT.rglob("*")):
    if path.is_file() and path.relative_to(ROOT).as_posix() not in excluded:
        files.append({"path": path.relative_to(ROOT).as_posix(), "bytes": path.stat().st_size,
                      "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
manifest = {"schema": "static-portfolio-export-v1", "status": "Approved public showcase source",
            "scope": scope_text, "files": files}
outputs = {"EXPORT-MANIFEST.json": json.dumps(manifest, indent=2) + "\n",
           "SHA256SUMS.txt": "".join(f"{f['sha256']}  {f['path']}\n" for f in files)}
for name, expected in outputs.items():
    target = ROOT / name
    if args.write:
        target.write_text(expected, encoding="utf-8", newline="\n")
    elif not target.exists() or target.read_text(encoding="utf-8") != expected:
        raise SystemExit(f"Manifest drift: {name}; inspect changes, then use --write")
print(f"Static payload: {len(files)} files; manifests {'written' if args.write else 'match'}")
