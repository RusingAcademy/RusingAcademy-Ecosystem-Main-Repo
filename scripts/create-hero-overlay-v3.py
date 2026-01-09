#!/usr/bin/env python3
"""
Create a hero image by overlaying real coach photos on the generated hero base
Positions are calibrated for the 2752x1536 hero-option-8-coaches.png base image
This version replaces only the 3 main large glass bubbles with real coach photos
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# Paths
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_IMAGE = f"{BASE_DIR}/hero-option-8-coaches.png"  # Use generated image as base
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v3.png"

# Coach photos with their positions matching the 3 main glass bubbles in base image
# The base image has 3 large glass bubbles:
# 1. Left side - large bubble with woman (around x=350, y=650, size ~350px)
# 2. Center top - large bubble with man (around x=920, y=350, size ~350px)  
# 3. Right side - large bubble with woman with glasses (around x=2150, y=700, size ~300px)

COACH_OVERLAYS = [
    # Large left bubble - Erika (the woman with short dark hair)
    {"path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 350, "y": 680, "size": 280},
    # Large center top bubble - Steven (the man)
    {"path": f"{UPLOAD_DIR}/Steven.jpg", "x": 920, "y": 360, "size": 280},
    # Large right bubble - Francine (woman with glasses)
    {"path": f"{UPLOAD_DIR}/Francine.jpg", "x": 2150, "y": 720, "size": 240},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to make it square (center crop, focusing on face area - upper portion)
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    # Crop from upper portion to focus on face
    top = max(0, (height - min_dim) // 4)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    
    # Resize to target size
    photo = photo.resize((size, size), Image.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size-1, size-1), fill=255)
    
    # Apply mask
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(photo, (0, 0), mask)
    
    return result

def main():
    # Load base image
    print(f"Loading base image: {BASE_IMAGE}")
    try:
        base = Image.open(BASE_IMAGE).convert('RGBA')
    except Exception as e:
        print(f"Error loading base image: {e}")
        return
    
    print(f"Base image size: {base.size}")
    
    # Overlay each coach photo
    for i, coach in enumerate(COACH_OVERLAYS):
        print(f"Overlaying coach {i+1}: {os.path.basename(coach['path'])}")
        
        circular_photo = create_circular_photo(coach['path'], coach['size'])
        if circular_photo:
            # Calculate paste position (center the photo at x, y)
            paste_x = coach['x'] - coach['size'] // 2
            paste_y = coach['y'] - coach['size'] // 2
            
            # Paste with alpha channel
            base.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    # Save result
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"Final hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
