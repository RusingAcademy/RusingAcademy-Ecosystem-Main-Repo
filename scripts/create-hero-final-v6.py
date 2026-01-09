#!/usr/bin/env python3
"""
Create the final Hero image by:
1. Overlaying real coach photos on the hero-option-12 base image (larger to cover AI faces)
2. Adding SLE-specific speech bubbles (BBB, CBC, CCC, Bilingualism, Français, Anglais)

The base image is 2048x1143 pixels.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
BASE_IMAGE = f"{BASE_DIR}/hero-option-12-all-coaches.png"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-sle-v6.png"

# Lingueefy brand colors
TEAL = (0, 150, 136)  # #009688
TEAL_LIGHT = (77, 182, 172)
WHITE = (255, 255, 255)

# Coach photos - LARGER sizes to fully cover AI faces
COACH_OVERLAYS = [
    # Top left large bubble - Sue-Anne (covers curly hair woman)
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 275, "y": 305, "size": 195},
    # Center top large bubble - Steven (covers man)
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 715, "y": 265, "size": 210},
    # Center medium bubble - Soukaina (covers woman with braids)
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 915, "y": 465, "size": 175},
    # Left bottom large bubble - Erika (covers short hair woman)
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 335, "y": 625, "size": 195},
    # Right top medium bubble - Preciosa
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1675, "y": 365, "size": 165},
    # Right middle medium bubble - Francine
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 1715, "y": 620, "size": 160},
    # Right bottom small bubble - Victor
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 1775, "y": 900, "size": 140},
]

# SLE Speech bubbles to overlay (replacing existing "Hello!" and "Bonjour!")
# We'll add new bubbles with SLE terms
SLE_BUBBLES = [
    # Near Steven - "BBB" 
    {"text": "BBB", "x": 850, "y": 180, "bg": TEAL, "text_color": WHITE},
    # Near the right side - "CBC"
    {"text": "CBC", "x": 1550, "y": 280, "bg": TEAL, "text_color": WHITE},
    # Near Soukaina - "CCC"
    {"text": "CCC", "x": 1050, "y": 380, "bg": TEAL_LIGHT, "text_color": WHITE},
    # Near Sue-Anne - "Français"
    {"text": "Français", "x": 150, "y": 180, "bg": TEAL, "text_color": WHITE},
    # Near Preciosa - "Anglais"  
    {"text": "Anglais", "x": 1820, "y": 480, "bg": TEAL, "text_color": WHITE},
    # Keep some bilingual greetings
    {"text": "Bonjour!", "x": 580, "y": 140, "bg": WHITE, "text_color": TEAL},
    {"text": "Hello!", "x": 1400, "y": 200, "bg": WHITE, "text_color": TEAL},
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
    top = max(0, (height - min_dim) // 5)
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

def create_speech_bubble(text, bg_color, text_color, font_size=20):
    """Create a speech bubble with text"""
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    dummy_img = Image.new('RGBA', (1, 1))
    dummy_draw = ImageDraw.Draw(dummy_img)
    bbox = dummy_draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    padding_x = 14
    padding_y = 8
    bubble_width = text_width + padding_x * 2
    bubble_height = text_height + padding_y * 2
    tail_height = 10
    
    total_height = bubble_height + tail_height
    bubble = Image.new('RGBA', (bubble_width, total_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    # Draw border if white background
    border_color = TEAL if bg_color == WHITE else None
    
    radius = 10
    draw.rounded_rectangle(
        [0, 0, bubble_width - 1, bubble_height - 1],
        radius=radius,
        fill=(*bg_color, 245),
        outline=border_color if border_color else None,
        width=2 if border_color else 0
    )
    
    # Draw tail
    tail_x = bubble_width // 2
    draw.polygon([
        (tail_x - 6, bubble_height - 2),
        (tail_x + 6, bubble_height - 2),
        (tail_x, bubble_height + tail_height - 2)
    ], fill=(*bg_color, 245))
    
    # Draw text
    text_x = (bubble_width - text_width) // 2
    text_y = (bubble_height - text_height) // 2 - 2
    draw.text((text_x, text_y), text, font=font, fill=(*text_color, 255))
    
    return bubble

def main():
    print(f"Loading base image: {BASE_IMAGE}")
    try:
        base = Image.open(BASE_IMAGE).convert('RGBA')
    except Exception as e:
        print(f"Error loading base image: {e}")
        return
    
    print(f"Base image size: {base.size}")
    
    # Overlay each coach photo
    print("\nOverlaying coach photos...")
    for coach in COACH_OVERLAYS:
        print(f"  {coach['name']} at ({coach['x']}, {coach['y']}) size {coach['size']}")
        
        circular_photo = create_circular_photo(coach['path'], coach['size'])
        if circular_photo:
            paste_x = coach['x'] - coach['size'] // 2
            paste_y = coach['y'] - coach['size'] // 2
            base.paste(circular_photo, (paste_x, paste_y), circular_photo)
    
    # Add SLE speech bubbles
    print("\nAdding SLE speech bubbles...")
    for bubble_data in SLE_BUBBLES:
        print(f"  {bubble_data['text']} at ({bubble_data['x']}, {bubble_data['y']})")
        bubble = create_speech_bubble(
            bubble_data['text'], 
            bubble_data['bg'], 
            bubble_data['text_color']
        )
        paste_x = bubble_data['x'] - bubble.width // 2
        paste_y = bubble_data['y'] - bubble.height // 2
        base.paste(bubble, (paste_x, paste_y), bubble)
    
    # Save result
    base = base.convert('RGB')
    base.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"\nFinal hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
