#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on the new clean base image.
The base image is 2752x1536 pixels with empty glass bubble frames.

Based on visual analysis of hero-base-clean.png:
- Top left large bubble: around x=280, y=380
- Upper left medium bubble: around x=480, y=280  
- Center top bubble: around x=720, y=320
- Center bubble (near laptop): around x=680, y=520
- Right side top bubble: around x=1900, y=280
- Right side middle bubble: around x=2100, y=480
- Right side bottom bubble: around x=2200, y=750
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-base-clean.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v7.png"

# Coach photos mapped to the empty glass bubble positions
# Positions calibrated for 2752x1536 image
COACH_OVERLAYS = [
    # Top left large bubble - Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 280, "y": 380, "size": 220},
    # Upper left medium bubble - Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 480, "y": 260, "size": 180},
    # Center top bubble - Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 740, "y": 300, "size": 170},
    # Center bubble near laptop - Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 700, "y": 540, "size": 160},
    # Right side top bubble - Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1920, "y": 280, "size": 180},
    # Right side middle bubble - Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 2150, "y": 500, "size": 170},
    # Right side bottom bubble - Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2250, "y": 780, "size": 180},
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
    top = max(0, (height - min_dim) // 5)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    photo = photo.resize((size, size), Image.LANCZOS)
    
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
    
    # Overlay each coach photo
    print("\nOverlaying coach photos...")
    for coach in COACH_OVERLAYS:
        print(f"  {coach['name']} at ({coach['x']}, {coach['y']}) size {coach['size']}")
        
        circular_photo = create_circular_photo(coach['path'], coach['size'])
        if circular_photo:
            paste_x = coach['x'] - coach['size'] // 2
            paste_y = coach['y'] - coach['size'] // 2
            base.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    # Save result
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nFinal hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
