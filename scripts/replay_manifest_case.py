"""Reproduce a recorded manifest failure and correction from this repository's history.

Uses Git and Python's standard library. Does not contact a model or the network.
Requires the two historical commits below; a normal full clone contains them.
"""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
CASES = [("before", "5668cd4ef540c42874119e790a6393e8e1c3ac12", 14),
         ("corrected", "f90c7ee21d7f5c53f93e4ca1009f99c6e0d39f3b", 0)]

def blob(revision, path):
    result = subprocess.run(["git", "show", f"{revision}:{path}"], cwd=ROOT, capture_output=True)
    if result.returncode:
        raise SystemExit("Required historical object is missing. Use a full clone of ZMS-Labs/showcase.")
    return result.stdout

results = []
for label, revision, expected in CASES:
    manifest = json.loads(blob(revision, "docs/EXPORT-MANIFEST.json"))
    different = [item["path"] for item in manifest["files"]
                 if hashlib.sha256(blob(revision, "docs/" + item["path"])).hexdigest() != item["sha256"]]
    if len(different) != expected:
        raise SystemExit(f"Unexpected historical result at {revision}: {len(different)} differences")
    results.append({"stage": label, "commit": revision, "payload_files": len(manifest["files"]),
                    "manifest_differences": len(different), "different_paths": different})
print(json.dumps({"scope": "Historical committed-file integrity; not a skill performance benchmark",
                  "results": results}, indent=2))
