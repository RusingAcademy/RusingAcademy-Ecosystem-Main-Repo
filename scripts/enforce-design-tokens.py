#!/usr/bin/env python3
"""
Wave 3 — Design System Enforcement
Replace hardcoded Tailwind arbitrary colors with CSS custom property equivalents.
Only replaces colors that have a clear mapping to existing design tokens.
"""
import re
import sys
import os
import glob

# Map of hardcoded hex colors → design token replacements
# Only map colors that have a clear 1:1 token equivalent
COLOR_MAP = {
    # LinkedIn brand color — keep as-is (external brand)
    # '#0A66C2': keep
    # '#004182': keep
    
    # Gold/Barholex colors → use token
    '#FFD700': 'var(--barholex-gold)',
    '#D4A853': 'var(--barholex-gold)',
    '#e0b860': 'var(--barholex-gold-hover)',
    '#E69500': 'var(--barholex-gold-hover)',
    
    # Teal/Foundation colors → use token
    '#008090': 'var(--teal)',
    '#006a75': 'var(--teal)',
    '#00A0A0': 'var(--teal-hover)',
    
    # Purple/AI colors → use token
    '#8B5CFF': 'var(--accent-purple)',
    '#8B5CF6': 'var(--accent-purple)',
    '#6D28D9': 'var(--ai-violet)',
    '#5B21B6': 'var(--ai-violet-hover)',
    
    # CTA Orange → use token
    '#F08800': 'var(--cta)',
    '#D97A00': 'var(--cta-hover)',
    
    # Text colors → use token
    '#0a0a0a': 'var(--text)',
    '#1a1a1a': 'var(--text)',
    '#111827': 'var(--brand-obsidian)',
    '#1f2937': 'var(--text-paragraph)',
    '#374151': 'var(--text-muted)',
    
    # Foundation brand
    '#0F3D3E': 'var(--brand-foundation)',
    '#145A5B': 'var(--brand-foundation-2)',
    
    # CTA Copper
    '#C65A1E': 'var(--brand-cta)',
    '#E06B2D': 'var(--brand-cta-2)',
    
    # Lingueefy
    '#17E2C6': 'var(--lingueefy-accent)',
    '#14C9B0': 'var(--lingueefy-accent-2)',
    '#0FB8A0': 'var(--lingueefy-cyan-hover)',
    
    # Semantic
    '#EF4444': 'var(--error)',
    '#10B981': 'var(--success)',
    '#F59E0B': 'var(--warning)',
    '#3B82F6': 'var(--info)',
    '#B42318': 'var(--danger)',
}

# Colors to SKIP (external brand colors, intentional one-offs)
SKIP_COLORS = {
    '#0A66C2',  # LinkedIn
    '#004182',  # LinkedIn hover
    '#2F2F2F',  # Apple dark button
    '#3a3a3a',  # Apple dark hover
    '#333',     # Short hex
    '#666',     # Short hex
    '#999',     # Short hex
    '#0d1020',  # Custom dark modal
}

DRY_RUN = '--dry-run' in sys.argv

def process_file(filepath):
    """Process a single file and replace hardcoded colors with tokens in style attributes."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    replacements = []
    
    # Only replace in style={{ }} attributes (inline styles), not in Tailwind classes
    # For Tailwind arbitrary values like bg-[#FFD700], we leave them as-is
    # because Tailwind can't use CSS vars in arbitrary values without special setup
    
    # Replace in style={{ color: '#xxx' }} patterns
    for hex_color, token in COLOR_MAP.items():
        # Case-insensitive match
        pattern = re.compile(re.escape(hex_color), re.IGNORECASE)
        if pattern.search(content):
            # Only replace in style attributes and CSS-like contexts
            # Find occurrences in style={{ ... }} blocks
            style_pattern = re.compile(
                r'(style\s*=\s*\{\{[^}]*?)' + re.escape(hex_color) + r'([^}]*?\}\})',
                re.IGNORECASE | re.DOTALL
            )
            new_content = style_pattern.sub(
                lambda m: m.group(1) + token + m.group(2),
                content
            )
            if new_content != content:
                count = len(style_pattern.findall(content))
                replacements.append(f"  style: {hex_color} → {token} ({count}x)")
                content = new_content
    
    if replacements and not DRY_RUN:
        with open(filepath, 'w') as f:
            f.write(content)
    
    return replacements

def main():
    total_replacements = 0
    total_files = 0
    
    # Process all TSX files
    patterns = [
        'client/src/pages/*.tsx',
        'client/src/components/*.tsx',
        'client/src/components/**/*.tsx',
    ]
    
    files = set()
    for pattern in patterns:
        files.update(glob.glob(os.path.join('/home/ubuntu/repo', pattern), recursive=True))
    
    for filepath in sorted(files):
        replacements = process_file(filepath)
        if replacements:
            relpath = os.path.relpath(filepath, '/home/ubuntu/repo')
            print(f"\n{relpath}:")
            for r in replacements:
                print(r)
            total_replacements += len(replacements)
            total_files += 1
    
    print(f"\n{'=' * 50}")
    print(f"Total: {total_replacements} replacements in {total_files} files")
    if DRY_RUN:
        print("(DRY RUN — no files modified)")
    print(f"{'=' * 50}")

if __name__ == '__main__':
    main()
