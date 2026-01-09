#!/usr/bin/env python3
"""
Create a hero image composite with real coach photos in glass-effect circular bubbles
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# Paths
BASE_DIR = "/home/ubuntu/lingueefy/hero-options"
OUTPUT_PATH = f"{BASE_DIR}/hero-final-real-coaches.png"

# Coach photos - using the actual uploaded photos
COACH_PHOTOS = [
    {"path": f"{BASE_DIR}/Steven.jpg", "name": "Steven"},
    {"path": f"{BASE_DIR}/Sue-Anne.jpg", "name": "Sue-Anne"},
    {"path": f"{BASE_DIR}/ErikaFrank.jpg", "name": "Erika"},
    {"path": f"{BASE_DIR}/Soukaina.jpeg", "name": "Soukaina"},
    {"path": f"{BASE_DIR}/Preciosa.JPG", "name": "Preciosa"},
    {"path": f"{BASE_DIR}/Francine.jpg", "name": "Francine"},
    {"path": f"{BASE_DIR}/IMG-20250823-WA0001.jpg", "name": "Victor"},
]

# Bubble positions (x, y) and sizes for 7 coaches around the composition
# Canvas size: 1456 x 816 (landscape)
BUBBLE_POSITIONS = [
    {"x": 120, "y": 180, "size": 160},   # Top left - Steven
    {"x": 350, "y": 80, "size": 150},    # Top center-left - Sue-Anne
    {"x": 580, "y": 150, "size": 140},   # Top center - Erika
    {"x": 100, "y": 450, "size": 145},   # Bottom left - Soukaina
    {"x": 1200, "y": 120, "size": 155},  # Top right - Preciosa
    {"x": 1280, "y": 380, "size": 150},  # Right middle - Francine
    {"x": 1180, "y": 600, "size": 145},  # Bottom right - Victor
]

# Teal color
TEAL = (0, 150, 136)
TEAL_LIGHT = (0, 200, 180, 100)
WHITE = (255, 255, 255)

def create_circular_mask(size):
    """Create a circular mask"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size-1, size-1), fill=255)
    return mask

def create_glass_bubble(photo_path, size):
    """Create a glass-effect circular bubble with the coach photo"""
    # Load and resize photo
    try:
        photo = Image.open(photo_path).convert('RGBA')
    except Exception as e:
        print(f"Error loading {photo_path}: {e}")
        return None
    
    # Calculate crop to make it square (center crop)
    width, height = photo.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    photo = photo.crop((left, top, left + min_dim, top + min_dim))
    
    # Resize to bubble size
    photo = photo.resize((size - 20, size - 20), Image.LANCZOS)
    
    # Create the bubble with glass effect
    bubble_size = size + 20  # Extra space for glow
    bubble = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    
    # Create circular mask for photo
    mask = create_circular_mask(size - 20)
    
    # Apply mask to photo
    photo_masked = Image.new('RGBA', (size - 20, size - 20), (0, 0, 0, 0))
    photo_masked.paste(photo, (0, 0), mask)
    
    # Draw outer glow (teal)
    draw = ImageDraw.Draw(bubble)
    for i in range(10, 0, -1):
        alpha = int(30 * (10 - i) / 10)
        glow_color = (0, 150, 136, alpha)
        offset = 10 - i
        draw.ellipse(
            (offset, offset, bubble_size - offset - 1, bubble_size - offset - 1),
            outline=glow_color,
            width=2
        )
    
    # Draw glass ring border
    draw.ellipse((8, 8, bubble_size - 9, bubble_size - 9), outline=(255, 255, 255, 180), width=3)
    draw.ellipse((10, 10, bubble_size - 11, bubble_size - 11), outline=TEAL + (200,), width=2)
    
    # Paste photo in center
    photo_offset = (bubble_size - (size - 20)) // 2
    bubble.paste(photo_masked, (photo_offset, photo_offset), photo_masked)
    
    # Add glass highlight (top-left shine)
    highlight = Image.new('RGBA', (bubble_size, bubble_size), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    highlight_draw.ellipse((15, 15, 45, 35), fill=(255, 255, 255, 80))
    bubble = Image.alpha_composite(bubble, highlight)
    
    return bubble

def create_speech_bubble(text, bg_color, text_color, width=150, height=50):
    """Create a 3D speech bubble"""
    bubble = Image.new('RGBA', (width + 20, height + 30), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bubble)
    
    # Main bubble shape
    radius = 15
    draw.rounded_rectangle(
        (5, 5, width + 5, height + 5),
        radius=radius,
        fill=bg_color + (230,),
        outline=(255, 255, 255, 150),
        width=2
    )
    
    # Add shadow effect
    shadow = Image.new('RGBA', (width + 20, height + 30), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (8, 8, width + 8, height + 8),
        radius=radius,
        fill=(0, 0, 0, 40)
    )
    
    # Combine shadow and bubble
    result = Image.alpha_composite(shadow, bubble)
    
    # Add text
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    except:
        font = ImageFont.load_default()
    
    result_draw = ImageDraw.Draw(result)
    bbox = result_draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (width + 10 - text_width) // 2
    text_y = (height + 5 - text_height) // 2
    result_draw.text((text_x, text_y), text, fill=text_color, font=font)
    
    return result

def main():
    # Create base canvas (landscape)
    canvas_width = 1456
    canvas_height = 816
    
    # Create gradient background (light to white with teal tint)
    canvas = Image.new('RGBA', (canvas_width, canvas_height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Add subtle gradient
    for y in range(canvas_height):
        alpha = int(20 * (1 - y / canvas_height))
        for x in range(canvas_width):
            r, g, b, a = canvas.getpixel((x, y))
            # Add very subtle teal tint
            canvas.putpixel((x, y), (r, g + alpha, b + alpha // 2, a))
    
    # Add a central learner placeholder (simplified - just a desk area)
    # Draw a subtle desk/office area in center
    desk_color = (240, 235, 230, 255)
    draw.rounded_rectangle((400, 400, 1000, 750), radius=20, fill=desk_color)
    
    # Add laptop shape
    laptop_color = (60, 60, 70, 255)
    draw.rounded_rectangle((550, 450, 850, 650), radius=10, fill=laptop_color)
    draw.rounded_rectangle((560, 460, 840, 600), radius=5, fill=(200, 220, 230, 255))  # Screen
    draw.rounded_rectangle((520, 650, 880, 680), radius=5, fill=(80, 80, 90, 255))  # Keyboard
    
    # Add coach bubbles
    for i, (coach, pos) in enumerate(zip(COACH_PHOTOS, BUBBLE_POSITIONS)):
        print(f"Adding {coach['name']}...")
        bubble = create_glass_bubble(coach['path'], pos['size'])
        if bubble:
            # Calculate position (center the bubble)
            x = pos['x'] - bubble.size[0] // 2
            y = pos['y'] - bubble.size[1] // 2
            canvas.paste(bubble, (x, y), bubble)
    
    # Add speech bubbles
    speech_bubbles = [
        {"text": "Bonjour!", "x": 280, "y": 50, "bg": TEAL, "fg": WHITE},
        {"text": "Hello!", "x": 1050, "y": 80, "bg": WHITE, "fg": TEAL},
        {"text": "Bienvenue!", "x": 700, "y": 300, "bg": TEAL, "fg": WHITE},
        {"text": "Welcome!", "x": 1100, "y": 500, "bg": WHITE, "fg": TEAL},
    ]
    
    for sb in speech_bubbles:
        bubble = create_speech_bubble(sb['text'], sb['bg'], sb['fg'])
        canvas.paste(bubble, (sb['x'], sb['y']), bubble)
    
    # Add title text
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Add "Meet Our Coaches" text
    draw.text((550, 350), "Meet Our Coaches", fill=TEAL, font=title_font)
    draw.text((530, 390), "Expert SLE preparation for Canadian public servants", fill=(100, 100, 100), font=subtitle_font)
    
    # Save the final image
    canvas.save(OUTPUT_PATH, 'PNG', quality=95)
    print(f"Hero image saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
