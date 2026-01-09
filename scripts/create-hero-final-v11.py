#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-generated-v11.png.
This image has speech bubble style frames (rounded rectangles) instead of circular bubbles.

The base image is 2752x1536 pixels.
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-generated-v11.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v11.png"

# Coach photos mapped to the speech bubble frame positions
# These are rounded rectangle frames, so we need to use rounded rectangle masks
COACH_OVERLAYS = [
    # Top left - Asian woman with long hair -> Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 200, "y": 380, "w": 180, "h": 220},
    # Top center left - Black man in blue shirt -> Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 500, "y": 220, "w": 170, "h": 210},
    # Top center - Black woman with braids -> Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 720, "y": 220, "w": 170, "h": 210},
    # Top right - Black man in suit -> Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2100, "y": 280, "w": 180, "h": 220},
    # Left bottom - Woman with glasses -> Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 350, "y": 680, "w": 170, "h": 210},
    # Left bottom 2 - Asian woman -> Erika
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 200, "y": 880, "w": 160, "h": 200},
    # Right bottom - Woman with dark curly hair -> Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2300, "y": 780, "w": 180, "h": 220},
]

def create_rounded_rect_photo(photo_path, width, height, radius=20):
    """Create a photo with rounded rectangle mask"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to match aspect ratio
    target_ratio = width / height
    orig_width, orig_height = photo.size
    orig_ratio = orig_width / orig_height
    
    if orig_ratio > target_ratio:
        # Original is wider, crop width
        new_width = int(orig_height * target_ratio)
        left = (orig_width - new_width) // 2
        photo = photo.crop((left, 0, left + new_width, orig_height))
    else:
        # Original is taller, crop height (focus on top for face)
        new_height = int(orig_width / target_ratio)
        top = max(0, (orig_height - new_height) // 4)  # Focus on upper portion
        if top + new_height > orig_height:
            top = orig_height - new_height
        photo = photo.crop((0, top, orig_width, top + new_height))
    
    # Resize to target size
    photo = photo.resize((width, height), Image.LANCZOS)
    
    # Create rounded rectangle mask
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, width - 1, height - 1], radius=radius, fill=255)
    
    # Apply mask
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))
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
        print(f"  {coach['name']} at ({coach['x']}, {coach['y']}) size {coach['w']}x{coach['h']}")
        
        photo = create_rounded_rect_photo(coach['path'], coach['w'], coach['h'])
        if photo:
            paste_x = coach['x'] - coach['w'] // 2
            paste_y = coach['y'] - coach['h'] // 2
            base.paste(photo, (paste_x, paste_y), photo)
    
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nFinal hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
