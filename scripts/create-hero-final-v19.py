#!/usr/bin/env python3
"""
Create the final Hero image using the clean background (no pre-existing bubbles).
Add 7 coach photos in elegant glass bubble frames with video call buttons.

The base image is 2752x1536 pixels.
"""

from PIL import Image, ImageDraw, ImageFilter
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BACKGROUND_IMAGE = f"{BASE_DIR}/hero-background-clean.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-v19.png"

# Teal colors
TEAL = (0, 150, 136)
TEAL_LIGHT = (0, 200, 180)

# Coach data with elegant positions - 3 on left, 1 center-top, 3 on right
COACHES = [
    # Left side (3 coaches)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 180, "y": 280, "size": 200},
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 120, "y": 550, "size": 180},
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 180, "y": 820, "size": 180},
    # Center-top
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 500, "y": 200, "size": 180},
    # Right side (3 coaches)
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 2300, "y": 200, "size": 200},
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 2450, "y": 480, "size": 180},
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 2350, "y": 780, "size": 200},
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

def create_glass_bubble_frame(size, border_width=5):
    """Create an elegant glass bubble frame with teal border and glow"""
    # Create canvas with extra space for glow
    glow_padding = 30
    canvas_size = size + glow_padding * 2
    frame = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    
    center = canvas_size // 2
    radius = size // 2
    
    # Draw outer glow rings
    for i in range(15, 0, -1):
        alpha = int(40 * (1 - i / 15))
        draw.ellipse([
            center - radius - i,
            center - radius - i,
            center + radius + i,
            center + radius + i
        ], outline=(0, 180, 160, alpha), width=2)
    
    # Draw main teal border
    draw.ellipse([
        center - radius,
        center - radius,
        center + radius,
        center + radius
    ], outline=TEAL_LIGHT, width=border_width)
    
    # Draw inner light border for glass effect
    inner_radius = radius - 3
    draw.ellipse([
        center - inner_radius,
        center - inner_radius,
        center + inner_radius,
        center + inner_radius
    ], outline=(200, 255, 250, 60), width=2)
    
    return frame, glow_padding

def create_call_buttons():
    """Create video call buttons (green mic, red hangup)"""
    button_size = 28
    spacing = 8
    total_width = button_size * 2 + spacing
    buttons = Image.new('RGBA', (total_width, button_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(buttons)
    
    # Green microphone button
    draw.ellipse([0, 0, button_size - 1, button_size - 1], fill=(76, 175, 80))
    # Mic icon (simplified)
    cx, cy = button_size // 2, button_size // 2
    draw.rectangle([cx - 3, cy - 6, cx + 3, cy + 2], fill='white')
    draw.ellipse([cx - 4, cy - 8, cx + 4, cy - 2], fill='white')
    
    # Red hangup button
    offset = button_size + spacing
    draw.ellipse([offset, 0, offset + button_size - 1, button_size - 1], fill=(244, 67, 54))
    # Phone icon (simplified)
    cx2 = offset + button_size // 2
    draw.rectangle([cx2 - 8, cy - 2, cx2 + 8, cy + 2], fill='white')
    
    return buttons

def main():
    print(f"Loading background image: {BACKGROUND_IMAGE}")
    try:
        base = Image.open(BACKGROUND_IMAGE).convert('RGBA')
    except Exception as e:
        print(f"Error loading background: {e}")
        return
    
    print(f"Base image size: {base.size}")
    
    print("\nCreating coach bubbles with glass frames...")
    for coach in COACHES:
        print(f"  Processing {coach['name']}...")
        
        # Create circular photo
        photo = create_circular_photo(coach['path'], coach['size'])
        if not photo:
            continue
        
        # Create glass bubble frame
        frame, glow_padding = create_glass_bubble_frame(coach['size'])
        
        # Calculate positions
        photo_x = coach['x'] - coach['size'] // 2
        photo_y = coach['y'] - coach['size'] // 2
        
        frame_x = photo_x - glow_padding
        frame_y = photo_y - glow_padding
        
        # Paste photo
        base.paste(photo, (photo_x, photo_y), photo)
        
        # Paste frame on top
        base.paste(frame, (frame_x, frame_y), frame)
        
        # Add call buttons below
        buttons = create_call_buttons()
        button_x = coach['x'] - buttons.width // 2
        button_y = coach['y'] + coach['size'] // 2 + 8
        base.paste(buttons, (button_x, button_y), buttons)
    
    # Save result
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nFinal hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
