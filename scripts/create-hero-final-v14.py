#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-option-11-all-coaches.png.
Version 14: Using the original hero-option-11 with CIRCULAR glass bubbles.

The base image is 2752x1536 pixels.

Glass bubble positions in hero-option-11 (circular bubbles):
1. Top left large - Black man in blue shirt (Steven) - center ~(310, 340), size ~280
2. Top center large - Asian woman (Sue-Anne) - center ~(680, 260), size ~260
3. Left bottom large - Woman with glasses in striped sweater (Francine) - center ~(340, 680), size ~270
4. Right side large - Black woman with glasses (Preciosa) - center ~(2000, 420), size ~260
5. Right bottom - Bald black man (Victor) - center ~(2200, 820), size ~240

We need to add Erika and Soukaina in appropriate positions.
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-11-all-coaches.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v14.png"

# Coach photos - LARGER sizes to fully cover the AI faces in circular bubbles
COACH_OVERLAYS = [
    # Top left large bubble - Steven (replaces black man in blue shirt)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 310, "y": 340, "size": 300},
    # Top center large bubble - Sue-Anne (replaces Asian woman)
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 680, "y": 260, "size": 280},
    # Left bottom large bubble - Francine (replaces woman with glasses)
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 340, "y": 680, "size": 290},
    # Right side large bubble - Preciosa (replaces black woman with glasses)
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2000, "y": 420, "size": 280},
    # Right bottom bubble - Victor (replaces bald man)
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2200, "y": 820, "size": 260},
    # Add Erika - position near laptop screen area
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 920, "y": 520, "size": 200},
    # Add Soukaina - position on right side middle
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2350, "y": 560, "size": 180},
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
    
    print("\nOverlaying 7 unique coach photos (larger sizes to cover AI faces)...")
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
