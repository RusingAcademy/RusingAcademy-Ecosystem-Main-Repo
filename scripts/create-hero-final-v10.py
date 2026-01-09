#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-option-11-all-coaches.png.
Version 10: Larger photos to fully cover the AI-generated faces in the glass bubbles.

The base image is 2752x1536 pixels.
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-11-all-coaches.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v10.png"

# Coach photos - LARGER sizes to fully cover the AI faces
# Positions refined to center on the faces in the bubbles
COACH_OVERLAYS = [
    # Top left large bubble - Steven (replaces the black man in blue shirt)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 310, "y": 340, "size": 280},
    # Top center large bubble - Sue-Anne (replaces the Asian woman)
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 680, "y": 260, "size": 260},
    # Left bottom large bubble - Francine (replaces woman with glasses in striped sweater)
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 340, "y": 680, "size": 270},
    # Right side large bubble - Preciosa (replaces black woman with glasses)
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2000, "y": 420, "size": 260},
    # Right bottom bubble - Victor (replaces bald man in blue suit)
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2200, "y": 820, "size": 240},
    # Erika - center area near laptop
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 920, "y": 520, "size": 190},
    # Soukaina - right side middle area
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2350, "y": 560, "size": 170},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo that fills the bubble completely"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to make it square (center crop, focusing on face)
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    # Crop from upper portion to focus on face
    top = max(0, (height - min_dim) // 6)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    
    # Resize to target size
    photo = photo.resize((size, size), Image.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    
    # Apply mask
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
    
    print("\nOverlaying coach photos (larger sizes)...")
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
