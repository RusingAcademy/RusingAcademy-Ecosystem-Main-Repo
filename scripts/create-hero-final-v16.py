#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-background-empty.png.
Version 16: Optimized with LARGER photos to fill the bubbles better.

The base image is 2752x1536 pixels.

Refined bubble positions and sizes based on v15 results:
- Top left bubble: needs to be bigger and centered
- All bubbles need larger photos to fill them properly
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-background-empty.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v16.png"

# Coach photos with LARGER sizes to fill bubbles properly
COACH_OVERLAYS = [
    # Top left bubble - Steven (larger)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 330, "y": 280, "size": 240},
    # Left middle bubble - Sue-Anne (larger)
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 200, "y": 580, "size": 220},
    # Bottom left bubble - Francine (larger)
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 280, "y": 830, "size": 220},
    # Center bubble near laptop - Erika (larger)
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 760, "y": 680, "size": 230},
    # Top right bubble - Preciosa (larger)
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2050, "y": 230, "size": 230},
    # Right middle bubble - Soukaina (larger)
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2350, "y": 450, "size": 220},
    # Bottom right bubble - Victor (larger)
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2400, "y": 750, "size": 220},
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
    top = max(0, (height - min_dim) // 6)
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
    
    print("\nOverlaying 7 coach photos with LARGER sizes...")
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
