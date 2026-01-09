#!/usr/bin/env python3
"""
Create a Hero image by overlaying real coach photos on the hero-option-12 base image.
The base image is 2048x1143 pixels.

Refined positions based on the actual bubble locations in the base image.
The bubbles have glass borders so we need to place photos slightly smaller than the bubble.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-12-all-coaches.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-real-v5.png"

# Coach photos mapped to bubble positions in the base image
# Refined positions after viewing the overlay result
# Format: (center_x, center_y, size) - size is the diameter of the circular photo
COACH_OVERLAYS = [
    # Top left large bubble - curly hair woman -> Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 275, "y": 305, "size": 175},
    # Center top large bubble - man -> Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 715, "y": 265, "size": 190},
    # Center medium bubble - woman with braids -> Soukaina (keep original AI face, position adjusted)
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 915, "y": 465, "size": 155},
    # Left bottom large bubble - short hair woman -> Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 335, "y": 625, "size": 175},
    # Right top medium bubble - smiling woman -> Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1675, "y": 365, "size": 145},
    # Right middle medium bubble - woman with glasses -> Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 1715, "y": 620, "size": 140},
    # Right bottom small bubble -> Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 1775, "y": 900, "size": 120},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo that fits inside the glass bubble"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to make it square (center crop, focusing on face - upper portion)
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    # Crop from upper portion to focus on face
    top = max(0, (height - min_dim) // 5)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    
    # Resize to target size
    photo = photo.resize((size, size), Image.LANCZOS)
    
    # Create circular mask with soft edge
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    
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
    for coach in COACH_OVERLAYS:
        print(f"Overlaying {coach['name']} at ({coach['x']}, {coach['y']}) size {coach['size']}...")
        
        circular_photo = create_circular_photo(coach['path'], coach['size'])
        if circular_photo:
            # Calculate paste position (center the photo at x, y)
            paste_x = coach['x'] - coach['size'] // 2
            paste_y = coach['y'] - coach['size'] // 2
            
            # Paste with alpha channel
            base.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    # Save result
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"Final hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
