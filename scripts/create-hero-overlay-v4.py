#!/usr/bin/env python3
"""
Create a Hero image by overlaying real coach photos on the hero-option-12 base image.
The base image is 2048x1143 pixels.

Based on visual analysis of the base image, the glass bubbles are located at:
- Top left: Woman with curly dark hair (around x=280, y=320, size ~220)
- Center top: Man in blue shirt (around x=720, y=280, size ~240)  
- Center: Woman with braids/glasses (around x=920, y=480, size ~200)
- Left bottom: Woman with short hair (around x=340, y=620, size ~220)
- Right top: Woman smiling (around x=1680, y=360, size ~200)
- Right middle: Woman with glasses (around x=1720, y=620, size ~180)
- Right bottom: Woman smiling (around x=1780, y=900, size ~160)

We will replace these with real coach photos:
- Steven Barholere (man) -> Center top position
- Sue-Anne Richer -> Top left position
- Erika Séguin -> Left bottom position
- Soukaina Haidar -> Center position
- Victor Amisi -> Right bottom position (we'll add him)
- Preciosa Baganha -> Right top position
- Francine -> Right middle position
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-12-all-coaches.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-real-v4.png"

# Coach photos mapped to bubble positions in the base image
# Positions are (center_x, center_y, diameter) based on visual analysis
COACH_OVERLAYS = [
    # Top left - curly hair woman -> Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 280, "y": 320, "size": 200},
    # Center top - man -> Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 720, "y": 280, "size": 220},
    # Center - woman with braids -> Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 920, "y": 480, "size": 180},
    # Left bottom - short hair woman -> Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 340, "y": 640, "size": 200},
    # Right top - smiling woman -> Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1680, "y": 380, "size": 180},
    # Right middle - woman with glasses -> Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 1720, "y": 640, "size": 170},
    # Right bottom -> Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 1780, "y": 920, "size": 150},
]

def create_circular_photo(photo_path, size):
    """Create a circular cropped photo"""
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
    
    # Create circular mask
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
        print(f"Overlaying {coach['name']}...")
        
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
