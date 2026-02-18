#!/usr/bin/env python3
"""
Add loading="lazy" and decoding="async" to <img> tags that don't have them.
Wave 2 Sprint 1 - Performance Optimization.

Excludes hero images and above-the-fold images that should load eagerly.
"""

import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_SRC = os.path.join(REPO_ROOT, "client", "src")

DRY_RUN = "--dry-run" in sys.argv

# Files where images should NOT be lazy-loaded (above the fold)
EAGER_FILES = {
    'HeroGoldStandard.tsx',  # Hero section - must load immediately
}

def find_tsx_files():
    files = []
    for root, dirs, filenames in os.walk(CLIENT_SRC):
        for f in filenames:
            if f.endswith('.tsx') and 'node_modules' not in root:
                files.append(os.path.join(root, f))
    return sorted(files)

def process_file(filepath):
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Skip eager files
    if filename in EAGER_FILES:
        return 0
    
    # Add loading="lazy" to <img tags that don't have loading= attribute
    # Match <img followed by attributes, but only if no loading= exists
    def add_lazy(match):
        nonlocal changes
        tag = match.group(0)
        if 'loading=' in tag:
            return tag
        # Add loading="lazy" decoding="async" after <img
        changes += 1
        return tag.replace('<img', '<img loading="lazy" decoding="async"', 1)
    
    # Find all <img ... > or <img ... /> tags (including multi-line)
    content = re.sub(r'<img\s', lambda m: '<img loading="lazy" decoding="async" ' if 'loading=' not in content[m.start():m.start()+500] else m.group(0), content)
    
    # Simpler approach: just find <img without loading and add it
    lines = content.split('\n')
    new_lines = []
    changes = 0
    in_img = False
    img_has_loading = False
    
    for line in lines:
        if '<img' in line and 'loading=' not in line:
            # Check if the img tag is complete on this line
            line = line.replace('<img ', '<img loading="lazy" decoding="async" ', 1)
            changes += 1
        new_lines.append(line)
    
    if changes > 0:
        content = '\n'.join(new_lines)
        rel_path = os.path.relpath(filepath, REPO_ROOT)
        print(f"{rel_path}: {changes} img tags updated")
        
        if not DRY_RUN:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    
    return changes

def main():
    if DRY_RUN:
        print("[DRY RUN] No files will be modified.\n")
    
    files = find_tsx_files()
    total = 0
    files_changed = 0
    
    for f in files:
        n = process_file(f)
        if n > 0:
            total += n
            files_changed += 1
    
    print(f"\nTotal: {total} img tags updated in {files_changed} files")

if __name__ == '__main__':
    main()
