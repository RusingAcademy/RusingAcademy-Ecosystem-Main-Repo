#!/usr/bin/env python3
"""
Create multiple Hero image variants for Lingueefy with:
- 7 real coach photos in 3D glass bubbles
- SLE-related conversation bubbles (BBB, CBC, CCC, Bilingualism, Français, Anglais, Bonjour, Hello)
- Different layouts and styles for user to choose from
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import math

# Paths
UPLOAD_DIR = "/home/ubuntu/upload"
OUTPUT_DIR = "/home/ubuntu/lingueefy/hero-options"

# Canvas size (16:9 aspect ratio for hero)
WIDTH = 1920
HEIGHT = 1080

# Lingueefy brand colors
TEAL = (0, 150, 136)  # #009688
TEAL_LIGHT = (77, 182, 172)  # #4db6ac
TEAL_DARK = (0, 121, 107)  # #00796b
WHITE = (255, 255, 255)
DARK_GRAY = (45, 55, 72)
ORANGE = (249, 115, 22)  # Accent color

# Coach photos
COACH_PHOTOS = {
    "Steven": f"{UPLOAD_DIR}/Steven.jpg",
    "Sue-Anne": f"{UPLOAD_DIR}/Sue-Anne.jpg",
    "Erika": f"{UPLOAD_DIR}/ErikaFrank.jpg",
    "Soukaina": f"{UPLOAD_DIR}/Soukaina.jpeg",
    "Victor": f"{UPLOAD_DIR}/IMG-20250823-WA0001.jpg",
    "Preciosa": f"{UPLOAD_DIR}/Preciosa.JPG",
    "Francine": f"{UPLOAD_DIR}/Francine.jpg",
}

def create_gradient_background(width, height, style="light"):
    """Create different gradient backgrounds"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    if style == "light":
        # Light gradient from soft blue to white
        for y in range(height):
            ratio = y / height
            r = int(235 + (255 - 235) * ratio)
            g = int(245 + (255 - 245) * ratio)
            b = int(250 + (255 - 250) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    elif style == "teal":
        # Teal gradient
        for y in range(height):
            ratio = y / height
            r = int(0 + (240 - 0) * ratio)
            g = int(120 + (250 - 120) * ratio)
            b = int(110 + (245 - 110) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    elif style == "warm":
        # Warm cream gradient
        for y in range(height):
            ratio = y / height
            r = int(255)
            g = int(248 + (255 - 248) * ratio)
            b = int(240 + (255 - 240) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    elif style == "modern":
        # Modern gray-blue gradient
        for y in range(height):
            ratio = y / height
            r = int(248 + (255 - 248) * ratio)
            g = int(250 + (255 - 250) * ratio)
            b = int(252 + (255 - 252) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def create_glass_bubble(photo_path, size, glow_color=TEAL):
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
    inner_size = size - 12
    photo = photo.resize((inner_size, inner_size), Image.LANCZOS)
    
    # Create the bubble with glass effect
    bubble_size = size + 16
    bubble = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    # Draw outer glow
    for i in range(8, 0, -1):
        alpha = int(40 * (8 - i) / 8)
        offset = 8 - i
        draw.ellipse(
            [offset, offset, bubble_size - offset - 1, bubble_size - offset - 1],
            outline=(*glow_color, alpha),
            width=2
        )
    
    # Draw glass border
    border_width = 3
    for i in range(border_width):
        ratio = i / border_width
        r = int(TEAL_LIGHT[0] + (TEAL[0] - TEAL_LIGHT[0]) * ratio)
        g = int(TEAL_LIGHT[1] + (TEAL[1] - TEAL_LIGHT[1]) * ratio)
        b = int(TEAL_LIGHT[2] + (TEAL[2] - TEAL_LIGHT[2]) * ratio)
        offset = 8 + i
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
    
    # Add highlight reflection
    highlight = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    highlight_draw.arc(
        [12, 12, bubble_size - 28, bubble_size - 28],
        200, 280,
        fill=(255, 255, 255, 80),
        width=2
    )
    bubble = Image.alpha_composite(bubble, highlight)
    
    return bubble

def create_speech_bubble(text, bg_color, font_size=22):
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
    
    padding_x = 16
    padding_y = 10
    bubble_width = text_width + padding_x * 2
    bubble_height = text_height + padding_y * 2
    tail_height = 12
    
    total_height = bubble_height + tail_height
    bubble = Image.new('RGBA', (bubble_width, total_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    if bg_color == WHITE:
        text_color = TEAL
        border_color = TEAL
    else:
        text_color = WHITE
        border_color = None
    
    radius = 12
    draw.rounded_rectangle(
        [0, 0, bubble_width - 1, bubble_height - 1],
        radius=radius,
        fill=(*bg_color, 240),
        outline=border_color if border_color else None,
        width=2 if border_color else 0
    )
    
    tail_x = bubble_width // 2
    draw.polygon([
        (tail_x - 8, bubble_height - 2),
        (tail_x + 8, bubble_height - 2),
        (tail_x, bubble_height + tail_height - 2)
    ], fill=(*bg_color, 240))
    
    text_x = (bubble_width - text_width) // 2
    text_y = (bubble_height - text_height) // 2 - 2
    draw.text((text_x, text_y), text, font=font, fill=(*text_color, 255))
    
    return bubble

def add_small_orbs(img, positions, color=TEAL_LIGHT, max_size=40):
    """Add small decorative orbs"""
    draw = ImageDraw.Draw(img, 'RGBA')
    
    for x, y, size in positions:
        size = min(size, max_size)
        for i in range(size, 0, -2):
            alpha = int(25 * (size - i) / size)
            draw.ellipse(
                [x - i, y - i, x + i, y + i],
                fill=(*color, alpha)
            )
    
    return img

def add_center_text(img, title, subtitle, show_button=True):
    """Add center text content"""
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 52)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        button_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        title_font = subtitle_font = button_font = ImageFont.load_default()
    
    # Title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    title_y = HEIGHT // 2 - 60
    
    draw.text((title_x + 2, title_y + 2), title, font=title_font, fill=(0, 0, 0, 30))
    draw.text((title_x, title_y), title, font=title_font, fill=DARK_GRAY)
    
    # Subtitle
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    subtitle_y = title_y + 65
    draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=(100, 100, 100))
    
    if show_button:
        # CTA button
        cta_text = "Find Your Coach"
        cta_bbox = draw.textbbox((0, 0), cta_text, font=button_font)
        cta_width = cta_bbox[2] - cta_bbox[0]
        cta_height = cta_bbox[3] - cta_bbox[1]
        
        btn_padding_x = 35
        btn_padding_y = 12
        btn_width = cta_width + btn_padding_x * 2
        btn_height = cta_height + btn_padding_y * 2
        btn_x = (WIDTH - btn_width) // 2
        btn_y = subtitle_y + 50
        
        draw.rounded_rectangle(
            [btn_x, btn_y, btn_x + btn_width, btn_y + btn_height],
            radius=22,
            fill=TEAL
        )
        
        cta_x = btn_x + btn_padding_x
        cta_y = btn_y + btn_padding_y - 2
        draw.text((cta_x, cta_y), cta_text, font=button_font, fill=WHITE)
    
    return img


# ============ VARIANT 1: Arc Layout ============
def create_variant_1():
    """Arc layout with coaches in a semi-circle at top"""
    print("Creating Variant 1: Arc Layout...")
    
    img = create_gradient_background(WIDTH, HEIGHT, "light")
    img = img.convert('RGBA')
    
    # Coach positions in arc at top
    coaches = [
        ("Steven", 280, 200, 140),
        ("Sue-Anne", 480, 120, 130),
        ("Erika", 700, 80, 120),
        ("Francine", 960, 60, 130),
        ("Preciosa", 1220, 80, 120),
        ("Victor", 1440, 120, 130),
        ("Soukaina", 1640, 200, 140),
    ]
    
    # Speech bubbles
    bubbles = [
        ("BBB", 380, 320, TEAL),
        ("CBC", 1540, 320, TEAL),
        ("CCC", 600, 200, TEAL_LIGHT),
        ("Bilingualism", 1320, 200, TEAL_LIGHT),
        ("Français", 200, 380, TEAL_DARK),
        ("Anglais", 1720, 380, TEAL_DARK),
        ("Bonjour!", 820, 160, WHITE),
        ("Hello!", 1100, 160, WHITE),
    ]
    
    # Small orbs
    orbs = [(100, 700, 30), (1820, 650, 35), (960, 850, 25), (300, 800, 20), (1600, 780, 28)]
    img = add_small_orbs(img, orbs)
    
    # Add coaches
    for name, x, y, size in coaches:
        bubble = create_glass_bubble(COACH_PHOTOS[name], size)
        if bubble:
            img.paste(bubble, (x - bubble.width // 2, y - bubble.height // 2), bubble)
    
    # Add speech bubbles
    for text, x, y, color in bubbles:
        sb = create_speech_bubble(text, color)
        img.paste(sb, (x - sb.width // 2, y - sb.height // 2), sb)
    
    # Add center text
    img = add_center_text(img, "Master Your SLE Exam", "Connect with certified bilingual coaches")
    
    img = img.convert('RGB')
    img.save(f"{OUTPUT_DIR}/variant-1-arc.png", 'PNG', quality=95)
    print("  Saved: variant-1-arc.png")


# ============ VARIANT 2: Two Columns Layout ============
def create_variant_2():
    """Two columns layout with coaches on left and right"""
    print("Creating Variant 2: Two Columns Layout...")
    
    img = create_gradient_background(WIDTH, HEIGHT, "modern")
    img = img.convert('RGBA')
    
    # Left column coaches
    left_coaches = [
        ("Steven", 180, 180, 150),
        ("Sue-Anne", 220, 400, 130),
        ("Erika", 160, 620, 140),
        ("Soukaina", 240, 840, 120),
    ]
    
    # Right column coaches
    right_coaches = [
        ("Victor", 1740, 180, 150),
        ("Preciosa", 1700, 400, 130),
        ("Francine", 1760, 620, 140),
    ]
    
    # Speech bubbles scattered
    bubbles = [
        ("BBB", 350, 280, TEAL),
        ("CBC", 1570, 280, TEAL),
        ("CCC", 380, 520, TEAL_LIGHT),
        ("Bilingualism", 1540, 520, TEAL_LIGHT),
        ("Français", 320, 740, TEAL_DARK),
        ("Anglais", 1600, 740, TEAL_DARK),
        ("Bonjour!", 420, 140, WHITE),
        ("Hello!", 1500, 140, WHITE),
    ]
    
    # Small orbs
    orbs = [(480, 900, 25), (1440, 880, 30), (960, 950, 20)]
    img = add_small_orbs(img, orbs)
    
    # Add coaches
    for name, x, y, size in left_coaches + right_coaches:
        bubble = create_glass_bubble(COACH_PHOTOS[name], size)
        if bubble:
            img.paste(bubble, (x - bubble.width // 2, y - bubble.height // 2), bubble)
    
    # Add speech bubbles
    for text, x, y, color in bubbles:
        sb = create_speech_bubble(text, color)
        img.paste(sb, (x - sb.width // 2, y - sb.height // 2), sb)
    
    # Add center text
    img = add_center_text(img, "Master Your SLE Exam", "Connect with certified bilingual coaches")
    
    img = img.convert('RGB')
    img.save(f"{OUTPUT_DIR}/variant-2-columns.png", 'PNG', quality=95)
    print("  Saved: variant-2-columns.png")


# ============ VARIANT 3: Floating Scattered Layout ============
def create_variant_3():
    """Scattered floating layout with varied sizes"""
    print("Creating Variant 3: Floating Scattered Layout...")
    
    img = create_gradient_background(WIDTH, HEIGHT, "warm")
    img = img.convert('RGBA')
    
    # Scattered coach positions
    coaches = [
        ("Steven", 200, 250, 160),
        ("Sue-Anne", 1720, 300, 150),
        ("Erika", 350, 700, 130),
        ("Francine", 1600, 700, 140),
        ("Preciosa", 500, 150, 120),
        ("Victor", 1400, 150, 125),
        ("Soukaina", 150, 500, 115),
    ]
    
    # Speech bubbles
    bubbles = [
        ("BBB", 320, 380, TEAL),
        ("CBC", 1600, 450, TEAL),
        ("CCC", 620, 220, TEAL_LIGHT),
        ("Bilingualism", 1280, 220, TEAL_LIGHT),
        ("Français", 280, 600, TEAL_DARK),
        ("Anglais", 1720, 580, TEAL_DARK),
        ("Bonjour!", 450, 820, WHITE),
        ("Hello!", 1470, 820, WHITE),
    ]
    
    # Small orbs
    orbs = [(80, 850, 35), (1840, 850, 30), (960, 920, 40), (600, 950, 25), (1320, 950, 28)]
    img = add_small_orbs(img, orbs)
    
    # Add coaches
    for name, x, y, size in coaches:
        bubble = create_glass_bubble(COACH_PHOTOS[name], size)
        if bubble:
            img.paste(bubble, (x - bubble.width // 2, y - bubble.height // 2), bubble)
    
    # Add speech bubbles
    for text, x, y, color in bubbles:
        sb = create_speech_bubble(text, color)
        img.paste(sb, (x - sb.width // 2, y - sb.height // 2), sb)
    
    # Add center text
    img = add_center_text(img, "Master Your SLE Exam", "Connect with certified bilingual coaches")
    
    img = img.convert('RGB')
    img.save(f"{OUTPUT_DIR}/variant-3-scattered.png", 'PNG', quality=95)
    print("  Saved: variant-3-scattered.png")


# ============ VARIANT 4: Compact Top Banner ============
def create_variant_4():
    """Compact banner with coaches in a tight row at top"""
    print("Creating Variant 4: Compact Top Banner...")
    
    img = create_gradient_background(WIDTH, HEIGHT, "teal")
    img = img.convert('RGBA')
    
    # Tight row of coaches at top
    start_x = 240
    spacing = 240
    coaches = [
        ("Steven", start_x, 140, 130),
        ("Sue-Anne", start_x + spacing, 140, 130),
        ("Erika", start_x + spacing * 2, 140, 130),
        ("Francine", start_x + spacing * 3, 140, 130),
        ("Preciosa", start_x + spacing * 4, 140, 130),
        ("Victor", start_x + spacing * 5, 140, 130),
        ("Soukaina", start_x + spacing * 6, 140, 130),
    ]
    
    # Speech bubbles in a row below coaches
    bubbles = [
        ("BBB", 300, 280, WHITE),
        ("CCC", 540, 280, WHITE),
        ("CBC", 780, 280, WHITE),
        ("Bonjour!", 1020, 280, WHITE),
        ("Hello!", 1260, 280, WHITE),
        ("Français", 1500, 280, WHITE),
        ("Anglais", 1680, 280, WHITE),
    ]
    
    # Small orbs
    orbs = [(100, 800, 30), (1820, 750, 35), (500, 900, 25), (1400, 880, 28)]
    img = add_small_orbs(img, orbs, color=WHITE, max_size=35)
    
    # Add coaches
    for name, x, y, size in coaches:
        bubble = create_glass_bubble(COACH_PHOTOS[name], size, glow_color=WHITE)
        if bubble:
            img.paste(bubble, (x - bubble.width // 2, y - bubble.height // 2), bubble)
    
    # Add speech bubbles
    for text, x, y, color in bubbles:
        sb = create_speech_bubble(text, color, font_size=18)
        img.paste(sb, (x - sb.width // 2, y - sb.height // 2), sb)
    
    # Add center text (adjusted for teal background)
    draw = ImageDraw.Draw(img)
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 52)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        button_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except:
        title_font = subtitle_font = button_font = ImageFont.load_default()
    
    title = "Master Your SLE Exam"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    title_y = HEIGHT // 2 + 20
    draw.text((title_x, title_y), title, font=title_font, fill=WHITE)
    
    subtitle = "Connect with certified bilingual coaches"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    subtitle_y = title_y + 65
    draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=(220, 255, 250))
    
    # White button
    cta_text = "Find Your Coach"
    cta_bbox = draw.textbbox((0, 0), cta_text, font=button_font)
    cta_width = cta_bbox[2] - cta_bbox[0]
    cta_height = cta_bbox[3] - cta_bbox[1]
    btn_padding_x = 35
    btn_padding_y = 12
    btn_width = cta_width + btn_padding_x * 2
    btn_height = cta_height + btn_padding_y * 2
    btn_x = (WIDTH - btn_width) // 2
    btn_y = subtitle_y + 50
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_width, btn_y + btn_height], radius=22, fill=WHITE)
    draw.text((btn_x + btn_padding_x, btn_y + btn_padding_y - 2), cta_text, font=button_font, fill=TEAL)
    
    img = img.convert('RGB')
    img.save(f"{OUTPUT_DIR}/variant-4-banner.png", 'PNG', quality=95)
    print("  Saved: variant-4-banner.png")


# ============ VARIANT 5: Diamond Layout ============
def create_variant_5():
    """Diamond layout with coaches arranged in diamond pattern"""
    print("Creating Variant 5: Diamond Layout...")
    
    img = create_gradient_background(WIDTH, HEIGHT, "light")
    img = img.convert('RGBA')
    
    # Diamond pattern
    center_x = WIDTH // 2
    coaches = [
        ("Steven", center_x, 100, 140),  # Top
        ("Sue-Anne", center_x - 350, 280, 130),  # Upper left
        ("Erika", center_x + 350, 280, 130),  # Upper right
        ("Francine", center_x - 500, 540, 140),  # Middle left
        ("Preciosa", center_x + 500, 540, 140),  # Middle right
        ("Victor", center_x - 350, 800, 130),  # Lower left
        ("Soukaina", center_x + 350, 800, 130),  # Lower right
    ]
    
    # Speech bubbles around the diamond
    bubbles = [
        ("BBB", center_x - 180, 180, TEAL),
        ("CBC", center_x + 180, 180, TEAL),
        ("CCC", center_x - 600, 400, TEAL_LIGHT),
        ("Bilingualism", center_x + 600, 400, TEAL_LIGHT),
        ("Français", center_x - 550, 700, TEAL_DARK),
        ("Anglais", center_x + 550, 700, TEAL_DARK),
        ("Bonjour!", center_x - 200, 900, WHITE),
        ("Hello!", center_x + 200, 900, WHITE),
    ]
    
    # Small orbs
    orbs = [(100, 500, 30), (1820, 500, 30), (200, 950, 25), (1720, 950, 25)]
    img = add_small_orbs(img, orbs)
    
    # Add coaches
    for name, x, y, size in coaches:
        bubble = create_glass_bubble(COACH_PHOTOS[name], size)
        if bubble:
            img.paste(bubble, (x - bubble.width // 2, y - bubble.height // 2), bubble)
    
    # Add speech bubbles
    for text, x, y, color in bubbles:
        sb = create_speech_bubble(text, color)
        img.paste(sb, (x - sb.width // 2, y - sb.height // 2), sb)
    
    # Add center text
    img = add_center_text(img, "Master Your SLE Exam", "Connect with certified bilingual coaches")
    
    img = img.convert('RGB')
    img.save(f"{OUTPUT_DIR}/variant-5-diamond.png", 'PNG', quality=95)
    print("  Saved: variant-5-diamond.png")


def main():
    print("=" * 50)
    print("Creating Hero Image Variants")
    print("=" * 50)
    
    create_variant_1()
    create_variant_2()
    create_variant_3()
    create_variant_4()
    create_variant_5()
    
    print("=" * 50)
    print("All variants created successfully!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 50)

if __name__ == "__main__":
    main()
