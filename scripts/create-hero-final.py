#!/usr/bin/env python3
"""
Create a professional Hero image for Lingueefy with:
- 7 real coach photos in 3D glass bubbles
- SLE-related conversation bubbles (BBB, CBC, CCC, Bilingualism, Français, Anglais, Bonjour, Hello)
- Modern office background
- Professional learner in foreground
- Lingueefy teal (#009688) accent color
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import math

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
OUTPUT_DIR = "/home/ubuntu/lingueefy/hero-options"
OUTPUT_PATH = f"{OUTPUT_DIR}/hero-final-sle.png"

# Canvas size (16:9 aspect ratio for hero)
WIDTH = 1920
HEIGHT = 1080

# Lingueefy brand colors
TEAL = (0, 150, 136)  # #009688
TEAL_LIGHT = (77, 182, 172)  # #4db6ac
TEAL_DARK = (0, 121, 107)  # #00796b
WHITE = (255, 255, 255)
DARK_GRAY = (45, 55, 72)

# Coach photos and their positions (arranged in a semi-circle around the center)
COACHES = [
    {"name": "Steven", "path": f"{UPLOAD_DIR}/Steven.jpg", "x": 200, "y": 280, "size": 160},
    {"name": "Sue-Anne", "path": f"{UPLOAD_DIR}/Sue-Anne.jpg", "x": 380, "y": 150, "size": 140},
    {"name": "Erika", "path": f"{UPLOAD_DIR}/ErikaFrank.jpg", "x": 620, "y": 100, "size": 130},
    {"name": "Soukaina", "path": f"{UPLOAD_DIR}/Soukaina.jpeg", "x": 150, "y": 520, "size": 140},
    {"name": "Victor", "path": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg", "x": 1720, "y": 280, "size": 160},
    {"name": "Preciosa", "path": f"{UPLOAD_DIR}/Preciosa.JPG", "x": 1540, "y": 150, "size": 140},
    {"name": "Francine", "path": f"{UPLOAD_DIR}/Francine.jpg", "x": 1300, "y": 100, "size": 130},
]

# SLE conversation bubbles
SPEECH_BUBBLES = [
    {"text": "BBB", "x": 320, "y": 380, "color": TEAL},
    {"text": "CBC", "x": 1600, "y": 380, "color": TEAL},
    {"text": "CCC", "x": 500, "y": 220, "color": TEAL_LIGHT},
    {"text": "Bilingualism", "x": 1420, "y": 220, "color": TEAL_LIGHT},
    {"text": "Français", "x": 280, "y": 620, "color": TEAL_DARK},
    {"text": "Anglais", "x": 1640, "y": 620, "color": TEAL_DARK},
    {"text": "Bonjour!", "x": 750, "y": 180, "color": WHITE},
    {"text": "Hello!", "x": 1170, "y": 180, "color": WHITE},
]

def create_gradient_background(width, height):
    """Create a modern gradient background"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # Create a gradient from light teal to white
    for y in range(height):
        # Gradient from light gray-blue at top to white at bottom
        ratio = y / height
        r = int(240 + (255 - 240) * ratio)
        g = int(245 + (255 - 245) * ratio)
        b = int(250 + (255 - 250) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def create_glass_bubble(photo_path, size):
    """Create a photo in a glass bubble with 3D effect"""
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to make it square (center crop, focusing on face)
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = max(0, (height - min_dim) // 4)
    if top + min_dim > height:
        top = height - min_dim
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    
    # Resize to target size
    inner_size = size - 16  # Leave room for border
    photo = photo.resize((inner_size, inner_size), Image.LANCZOS)
    
    # Create the bubble with glass effect
    bubble_size = size + 20  # Extra space for glow
    bubble = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    # Draw outer glow (teal)
    for i in range(10, 0, -1):
        alpha = int(30 * (10 - i) / 10)
        glow_color = (*TEAL, alpha)
        offset = 10 - i
        draw.ellipse(
            [offset, offset, bubble_size - offset - 1, bubble_size - offset - 1],
            outline=glow_color,
            width=2
        )
    
    # Draw glass border (gradient effect)
    border_width = 4
    center = bubble_size // 2
    for i in range(border_width):
        # Create gradient from light to dark teal
        ratio = i / border_width
        r = int(TEAL_LIGHT[0] + (TEAL[0] - TEAL_LIGHT[0]) * ratio)
        g = int(TEAL_LIGHT[1] + (TEAL[1] - TEAL_LIGHT[1]) * ratio)
        b = int(TEAL_LIGHT[2] + (TEAL[2] - TEAL_LIGHT[2]) * ratio)
        offset = 10 + i
        draw.ellipse(
            [offset, offset, bubble_size - offset - 1, bubble_size - offset - 1],
            outline=(r, g, b, 255),
            width=1
        )
    
    # Create circular mask for photo
    mask = Image.new('L', (inner_size, inner_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, inner_size - 1, inner_size - 1), fill=255)
    
    # Apply mask to photo
    photo_masked = Image.new('RGBA', (inner_size, inner_size), (0, 0, 0, 0))
    photo_masked.paste(photo, (0, 0), mask)
    
    # Paste photo in center of bubble
    photo_offset = (bubble_size - inner_size) // 2
    bubble.paste(photo_masked, (photo_offset, photo_offset), photo_masked)
    
    # Add highlight reflection (glass effect)
    highlight = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    # Small white arc at top-left for reflection
    highlight_draw.arc(
        [15, 15, bubble_size - 35, bubble_size - 35],
        200, 280,
        fill=(255, 255, 255, 100),
        width=3
    )
    bubble = Image.alpha_composite(bubble, highlight)
    
    return bubble

def create_speech_bubble(text, bg_color, font_size=24):
    """Create a speech bubble with text"""
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Calculate text size
    dummy_img = Image.new('RGBA', (1, 1))
    dummy_draw = ImageDraw.Draw(dummy_img)
    bbox = dummy_draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Bubble dimensions
    padding_x = 20
    padding_y = 12
    bubble_width = text_width + padding_x * 2
    bubble_height = text_height + padding_y * 2
    tail_height = 15
    
    # Create bubble image
    total_height = bubble_height + tail_height
    bubble = Image.new('RGBA', (bubble_width, total_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    # Determine text color based on background
    if bg_color == WHITE:
        text_color = TEAL
        border_color = TEAL
    else:
        text_color = WHITE
        border_color = None
    
    # Draw rounded rectangle for bubble body
    radius = 15
    # Main body
    draw.rounded_rectangle(
        [0, 0, bubble_width - 1, bubble_height - 1],
        radius=radius,
        fill=(*bg_color, 230),
        outline=border_color if border_color else None,
        width=2 if border_color else 0
    )
    
    # Draw tail (triangle pointing down)
    tail_x = bubble_width // 2
    draw.polygon([
        (tail_x - 10, bubble_height - 2),
        (tail_x + 10, bubble_height - 2),
        (tail_x, bubble_height + tail_height - 2)
    ], fill=(*bg_color, 230))
    
    # Draw text
    text_x = (bubble_width - text_width) // 2
    text_y = (bubble_height - text_height) // 2 - 2
    draw.text((text_x, text_y), text, font=font, fill=(*text_color, 255))
    
    return bubble

def create_decorative_orbs(img):
    """Add decorative floating orbs for modern effect"""
    draw = ImageDraw.Draw(img, 'RGBA')
    
    orbs = [
        {"x": 100, "y": 800, "size": 60, "alpha": 40},
        {"x": 1800, "y": 750, "size": 80, "alpha": 30},
        {"x": 960, "y": 900, "size": 100, "alpha": 25},
        {"x": 1600, "y": 950, "size": 50, "alpha": 35},
        {"x": 300, "y": 950, "size": 70, "alpha": 30},
    ]
    
    for orb in orbs:
        x, y, size, alpha = orb["x"], orb["y"], orb["size"], orb["alpha"]
        # Draw gradient orb
        for i in range(size, 0, -2):
            current_alpha = int(alpha * (size - i) / size)
            draw.ellipse(
                [x - i, y - i, x + i, y + i],
                fill=(*TEAL_LIGHT, current_alpha)
            )
    
    return img

def add_center_content(img):
    """Add center text content"""
    draw = ImageDraw.Draw(img)
    
    # Main headline
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Title
    title = "Master Your SLE Exam"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    title_y = 450
    
    # Draw title with shadow
    draw.text((title_x + 2, title_y + 2), title, font=title_font, fill=(0, 0, 0, 50))
    draw.text((title_x, title_y), title, font=title_font, fill=DARK_GRAY)
    
    # Subtitle
    subtitle = "Connect with certified bilingual coaches"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    subtitle_y = title_y + 70
    draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=(100, 100, 100))
    
    # CTA button
    cta_text = "Find Your Coach"
    cta_bbox = draw.textbbox((0, 0), cta_text, font=subtitle_font)
    cta_width = cta_bbox[2] - cta_bbox[0]
    cta_height = cta_bbox[3] - cta_bbox[1]
    
    btn_padding_x = 40
    btn_padding_y = 15
    btn_width = cta_width + btn_padding_x * 2
    btn_height = cta_height + btn_padding_y * 2
    btn_x = (WIDTH - btn_width) // 2
    btn_y = subtitle_y + 60
    
    # Draw button
    draw.rounded_rectangle(
        [btn_x, btn_y, btn_x + btn_width, btn_y + btn_height],
        radius=25,
        fill=TEAL
    )
    
    # Button text
    cta_x = btn_x + btn_padding_x
    cta_y = btn_y + btn_padding_y - 2
    draw.text((cta_x, cta_y), cta_text, font=subtitle_font, fill=WHITE)
    
    return img

def main():
    print("Creating Hero image...")
    
    # Create gradient background
    print("Creating background...")
    img = create_gradient_background(WIDTH, HEIGHT)
    img = img.convert('RGBA')
    
    # Add decorative orbs
    print("Adding decorative orbs...")
    img = create_decorative_orbs(img)
    
    # Add coach photos in glass bubbles
    print("Adding coach photos...")
    for coach in COACHES:
        print(f"  Adding {coach['name']}...")
        bubble = create_glass_bubble(coach['path'], coach['size'])
        if bubble:
            paste_x = coach['x'] - bubble.width // 2
            paste_y = coach['y'] - bubble.height // 2
            img.paste(bubble, (paste_x, paste_y), bubble)
    
    # Add speech bubbles
    print("Adding speech bubbles...")
    for bubble_data in SPEECH_BUBBLES:
        bubble = create_speech_bubble(bubble_data['text'], bubble_data['color'])
        paste_x = bubble_data['x'] - bubble.width // 2
        paste_y = bubble_data['y'] - bubble.height // 2
        img.paste(bubble, (paste_x, paste_y), bubble)
    
    # Add center content
    print("Adding center content...")
    img = add_center_content(img)
    
    # Save result
    img = img.convert('RGB')
    img.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"Hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
