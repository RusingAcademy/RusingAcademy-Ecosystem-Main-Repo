#!/usr/bin/env python3
"""
Create a complete Hero image from scratch with:
1. A professional office background
2. 7 coach photos in elegant glass bubble frames
3. SLE speech bubbles (BBB, CBC, CCC, Bilingualism, etc.)

This script builds the glass bubble effect programmatically around each coach photo.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BACKGROUND_IMAGE = f"{BASE_DIR}/hero-base-7bubbles.png"  # Use as background
OUTPUT_PATH = f"{BASE_DIR}/hero-complete.png"

# Image dimensions
WIDTH = 2752
HEIGHT = 1536

# Teal color
TEAL = (0, 150, 136)
TEAL_LIGHT = (0, 200, 180)
TEAL_GLOW = (0, 180, 160, 100)

# Coach data with positions
COACHES = [
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 280, "y": 230, "size": 220},
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 380, "y": 340, "size": 200},
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 180, "y": 530, "size": 200},
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 200, "y": 800, "size": 200},
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2050, "y": 200, "size": 220},
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2200, "y": 480, "size": 200},
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2250, "y": 780, "size": 220},
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

def create_glass_bubble(size, border_width=4):
    """Create a glass bubble frame with teal border and glow effect"""
    # Create larger canvas for glow
    glow_size = size + 40
    bubble = Image.new('RGBA', (glow_size, glow_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    center = glow_size // 2
    radius = size // 2
    
    # Draw outer glow
    for i in range(20, 0, -2):
        alpha = int(30 * (1 - i / 20))
        glow_color = (0, 180, 160, alpha)
        draw.ellipse([
            center - radius - i,
            center - radius - i,
            center + radius + i,
            center + radius + i
        ], outline=glow_color, width=2)
    
    # Draw main border
    draw.ellipse([
        center - radius,
        center - radius,
        center + radius,
        center + radius
    ], outline=TEAL_LIGHT, width=border_width)
    
    # Draw inner highlight (glass effect)
    highlight_radius = radius - 5
    draw.arc([
        center - highlight_radius,
        center - highlight_radius,
        center + highlight_radius,
        center + highlight_radius
    ], start=200, end=340, fill=(255, 255, 255, 80), width=2)
    
    return bubble

def create_call_buttons(size=50):
    """Create video call buttons (green mic, red hangup)"""
    buttons = Image.new('RGBA', (size * 2 + 10, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(buttons)
    
    # Green microphone button
    draw.ellipse([0, 0, size - 1, size - 1], fill=(76, 175, 80))
    # Simple mic icon
    draw.rectangle([size//2 - 4, size//4, size//2 + 4, size//2 + 5], fill='white')
    draw.ellipse([size//2 - 6, size//4 - 4, size//2 + 6, size//4 + 8], fill='white')
    draw.arc([size//2 - 10, size//4, size//2 + 10, size//2 + 10], start=0, end=180, fill='white', width=2)
    
    # Red hangup button
    offset = size + 10
    draw.ellipse([offset, 0, offset + size - 1, size - 1], fill=(244, 67, 54))
    # Simple phone icon
    draw.rectangle([offset + size//4, size//2 - 4, offset + size*3//4, size//2 + 4], fill='white')
    
    return buttons

def main():
    print(f"Loading background image: {BACKGROUND_IMAGE}")
    try:
        base = Image.open(BACKGROUND_IMAGE).convert('RGBA')
    except Exception as e:
        print(f"Error loading background: {e}")
        return
    
    print(f"Base image size: {base.size}")
    
    print("\nCreating coach bubbles...")
    for coach in COACHES:
        print(f"  Processing {coach['name']}...")
        
        # Create circular photo
        photo = create_circular_photo(coach['path'], coach['size'])
        if not photo:
            continue
        
        # Create glass bubble frame
        bubble = create_glass_bubble(coach['size'])
        
        # Calculate positions
        photo_x = coach['x'] - coach['size'] // 2
        photo_y = coach['y'] - coach['size'] // 2
        
        bubble_offset = (bubble.width - coach['size']) // 2
        bubble_x = photo_x - bubble_offset
        bubble_y = photo_y - bubble_offset
        
        # Paste photo first
        base.paste(photo, (photo_x, photo_y), photo)
        
        # Paste bubble frame on top
        base.paste(bubble, (bubble_x, bubble_y), bubble)
        
        # Add call buttons below the bubble
        buttons = create_call_buttons(30)
        button_x = coach['x'] - buttons.width // 2
        button_y = coach['y'] + coach['size'] // 2 + 5
        base.paste(buttons, (button_x, button_y), buttons)
    
    # Save result
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nComplete hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
