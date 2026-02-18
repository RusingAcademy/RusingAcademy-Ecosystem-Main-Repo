#!/usr/bin/env python3
"""
Update local image references in source code to use WebP format.
Wave 2 Sprint 1 - Performance Optimization.

This script:
1. Finds all local /images/*.jpg|jpeg|png references in TSX/TS files
2. Checks if a corresponding .webp file exists
3. Replaces the extension with .webp

CDN references (b-cdn.net) are NOT modified by this script.
"""

import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_SRC = os.path.join(REPO_ROOT, "client", "src")
IMAGES_DIR = os.path.join(REPO_ROOT, "client", "public", "images")

DRY_RUN = "--dry-run" in sys.argv

def find_source_files():
    """Find all .tsx and .ts files in client/src."""
    files = []
    for root, dirs, filenames in os.walk(CLIENT_SRC):
        for f in filenames:
            if f.endswith(('.tsx', '.ts')) and 'node_modules' not in root:
                files.append(os.path.join(root, f))
    return sorted(files)

def has_webp_version(image_path):
    """Check if a WebP version of the image exists."""
    # image_path is like /images/library/something.jpg
    # Map to filesystem: client/public/images/library/something.webp
    rel = image_path.lstrip('/')
    full_path = os.path.join(REPO_ROOT, "client", "public", rel)
    webp_path = os.path.splitext(full_path)[0] + '.webp'
    return os.path.exists(webp_path)

def process_file(filepath):
    """Process a single source file, replacing local image refs with WebP."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = []
    
    # Pattern: local image references like "/images/something.jpg"
    # But NOT CDN URLs (b-cdn.net, cloudfront, etc.)
    pattern = r'(?<!b-cdn\.net)(/images/[^"\'`\s)]+\.(?:jpg|jpeg|png))'
    
    def replace_match(m):
        img_path = m.group(1)
        # Skip if it's part of a CDN URL
        start = max(0, m.start() - 50)
        context = content[start:m.start()]
        if 'b-cdn.net' in context or 'cloudfront' in context or 'http' in context:
            return img_path
        
        if has_webp_version(img_path):
            webp_path = os.path.splitext(img_path)[0] + '.webp'
            changes.append(f"  {img_path} -> {webp_path}")
            return webp_path
        return img_path
    
    content = re.sub(pattern, replace_match, content)
    
    if content != original:
        rel_path = os.path.relpath(filepath, REPO_ROOT)
        print(f"\n{rel_path}: {len(changes)} replacements")
        for c in changes:
            print(c)
        
        if not DRY_RUN:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    
    return len(changes)

def main():
    if DRY_RUN:
        print("[DRY RUN] No files will be modified.\n")
    
    files = find_source_files()
    total_changes = 0
    files_changed = 0
    
    for f in files:
        n = process_file(f)
        if n > 0:
            total_changes += n
            files_changed += 1
    
    print(f"\n{'='*50}")
    print(f"Total: {total_changes} references updated in {files_changed} files")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
