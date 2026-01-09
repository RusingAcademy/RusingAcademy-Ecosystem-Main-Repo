#!/usr/bin/env python3
"""
Create the final Hero image with refined positioning.
The base image is 2752x1536 pixels.

Refined positions to better fit the glass bubble frames.
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-base-clean.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v8.png"

# Coach photos - refined positions to fit inside the glass bubbles
COACH_OVERLAYS = [
    # Large left bubble - Steven (main coach, prominent position)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 260, "y": 400, "size": 200},
    # Upper left smaller bubble - Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 470, "y": 270, "size": 150},
    # Center upper bubble - Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 720, "y": 310, "size": 140},
    # Center lower bubble (near laptop) - Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 680, "y": 530, "size": 130},
    # Right side top bubble - Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1900, "y": 290, "size": 150},
    # Right side middle bubble - Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 2120, "y": 510, "size": 145},
    # Right side bottom bubble - Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2220, "y": 780, "size": 160},
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
    
    print("\nOverlaying coach photos...")
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
