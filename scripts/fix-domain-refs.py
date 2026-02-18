#!/usr/bin/env python3
"""
Wave 5 — Fix all rusingacademy.com URL references to rusingacademy.ca
Excludes email addresses (@rusingacademy.com) which are correct as-is.
"""
import re
import os

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_SRC = os.path.join(REPO_ROOT, "client", "src")

# Files and patterns to fix
# We replace URL references but NOT email addresses
URL_PATTERN = re.compile(r'(?<!@)rusingacademy\.com')

total_replacements = 0
files_modified = []

for root, dirs, files in os.walk(CLIENT_SRC):
    dirs[:] = [d for d in dirs if d != "node_modules"]
    for fname in files:
        if not fname.endswith((".tsx", ".ts")):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, "r") as f:
            content = f.read()
        
        # Count matches (excluding email addresses)
        matches = URL_PATTERN.findall(content)
        if not matches:
            continue
        
        new_content = URL_PATTERN.sub("rusingacademy.ca", content)
        count = len(matches)
        
        with open(fpath, "w") as f:
            f.write(new_content)
        
        rel_path = os.path.relpath(fpath, REPO_ROOT)
        files_modified.append((rel_path, count))
        total_replacements += count
        print(f"  Fixed {count} refs in {rel_path}")

print(f"\n=== SUMMARY ===")
print(f"Files modified: {len(files_modified)}")
print(f"Total replacements: {total_replacements}")
