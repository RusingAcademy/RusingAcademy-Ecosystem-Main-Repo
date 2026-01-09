#!/usr/bin/env python3
"""
Create the final Hero image by overlaying real coach photos on hero-generated-v11.png.
Version 12: Precise positions matching the speech bubble frames exactly.

The base image is 2752x1536 pixels.
Frame positions identified by visual analysis.
"""

from PIL import Image, ImageDraw
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-generated-v11.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v12.png"

# Coach photos mapped to exact frame positions
# Positions refined to match the speech bubble frames precisely
COACH_OVERLAYS = [
    # Top left small frame - Asian woman -> Sue-Anne
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 195, "y": 380, "w": 175, "h": 215},
    # Top center left - Black man in blue -> Steven
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 495, "y": 255, "w": 165, "h": 205},
    # Top center - Black woman with braids -> Soukaina
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 720, "y": 255, "w": 165, "h": 205},
    # Top right - Black man in navy suit -> Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2100, "y": 315, "w": 175, "h": 215},
    # Left middle - Woman with glasses -> Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 350, "y": 700, "w": 165, "h": 205},
    # Left bottom - Asian woman -> Erika (smaller frame)
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 195, "y": 895, "w": 155, "h": 195},
    # Right bottom - Woman with dark curly hair -> Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2300, "y": 815, "w": 175, "h": 215},
]

def create_rounded_rect_photo(photo_path, width, height, radius=18):
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
        new_width = int(orig_height * target_ratio)
        left = (orig_width - new_width) // 2
        photo = photo.crop((left, 0, left + new_width, orig_height))
    else:
        new_height = int(orig_width / target_ratio)
        top = max(0, (orig_height - new_height) // 4)
        if top + new_height > orig_height:
            top = orig_height - new_height
        photo = photo.crop((0, top, orig_width, top + new_height))
    
    photo = photo.resize((width, height), Image.LANCZOS)
    
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, width - 1, height - 1], radius=radius, fill=255)
    
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
    
    print("\nOverlaying coach photos with precise positioning...")
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
