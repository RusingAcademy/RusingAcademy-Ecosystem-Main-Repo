#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-base-7bubbles.png.
Version 17: Using the new base with exactly 7 empty glass bubbles arranged elegantly.

The base image is 2752x1536 pixels.

Bubble positions (visual analysis of hero-base-7bubbles.png):
Left side (3 bubbles):
1. Top left - around x=280, y=220, size ~220
2. Middle left - around x=180, y=480, size ~200
3. Bottom left - around x=200, y=780, size ~200

Center:
4. Center top - around x=620, y=280, size ~200

Right side (3 bubbles):
5. Top right - around x=2050, y=180, size ~220
6. Middle right - around x=2200, y=450, size ~200
7. Bottom right - around x=2250, y=750, size ~220
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-base-7bubbles.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v17.png"

# Coach photos mapped to the 7 bubble positions
COACH_OVERLAYS = [
    # Top left bubble - Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 280, "y": 220, "size": 210},
    # Middle left bubble - Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 180, "y": 480, "size": 190},
    # Bottom left bubble - Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 200, "y": 780, "size": 190},
    # Center top bubble - Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 620, "y": 280, "size": 190},
    # Top right bubble - Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2050, "y": 180, "size": 210},
    # Middle right bubble - Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2200, "y": 450, "size": 190},
    # Bottom right bubble - Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2250, "y": 750, "size": 210},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    # Crop from upper portion to focus on face
    top = max(0, (height - min_dim) // 6)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    photo = photo.resize((size, size), Image.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(photo, (0, 0), mask)
    
    return result

def main():
    print(f"Loading base image: {BASE_IMAGE}")
    try:
        base = Image.open(BASE_IMAGE).convert('RGBA')
    except Exception as e:
        print(f"Error loading base image: {e}")
        return
    
    print(f"Base image size: {base.size}")
    
    print("\nOverlaying 7 coach photos into bubbles...")
    for coach in COACH_OVERLAYS:
        print(f"  {coach['name']} at ({coach['x']}, {coach['y']}) size {coach['size']}")
        
        circular_photo = create_circular_photo(coach['path'], coach['size'])
        if circular_photo:
            paste_x = coach['x'] - coach['size'] // 2
            paste_y = coach['y'] - coach['size'] // 2
            base.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nFinal hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
