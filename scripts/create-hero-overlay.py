#!/usr/bin/env python3
"""
Create a hero image by overlaying real coach photos on the generated hero base
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# Paths
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-8-coaches.png"  # Use generated image as base
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v2.png"

# Coach photos with their positions matching the base image layout
COACH_OVERLAYS = [
    # Top left bubble
    {"path": f"{BASE_DIR}/Steven.jpg", "x": 95, "y": 95, "size": 130},
    # Top center bubble  
    {"path": f"{BASE_DIR}/Sue-Anne.jpg", "x": 350, "y": 55, "size": 120},
    # Center (on laptop screen)
    {"path": f"{BASE_DIR}/ErikaFrank.jpg", "x": 575, "y": 130, "size": 110},
    # Right side top
    {"path": f"{BASE_DIR}/Preciosa.JPG", "x": 1180, "y": 85, "size": 125},
    # Right side middle
    {"path": f"{BASE_DIR}/Francine.jpg", "x": 1255, "y": 310, "size": 120},
    # Bottom right
    {"path": f"{BASE_DIR}/IMG-20250823-WA0001.jpg", "x": 1155, "y": 540, "size": 115},
    # Left side bottom
    {"path": f"{BASE_DIR}/Soukaina.jpeg", "x": 85, "y": 380, "size": 125},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo with glass effect border"""
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
