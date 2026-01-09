#!/usr/bin/env python3
"""
Optimize images to reduce file size to under 5MB while maintaining quality.
Converts PNG to optimized JPEG for photos, keeps PNG for logos with transparency.
"""

from PIL import Image
import os

# Input images from upload directory
UPLOAD_DIR = "/home/ubuntu/upload"
OUTPUT_DIR = "/home/ubuntu/lingueefy/optimized-images"

# Images to optimize
IMAGES = [
    "hero-generated-v11(1).png",
    "lingueefy-glass-v2.png",
    "hero-final-v19.png",
    "hero-base-clean.png",
    "hero-option-2.png",
    "hero-option-8-coaches.png",
    "hero-option-11-all-coaches.png",
    "hero-option-12-all-coaches.png",
    "hero-generated-v11.png",
    "hero-background-empty.png",
]

def optimize_image(input_path, output_path, max_size_mb=5):
    """Optimize image to be under max_size_mb"""
    try:
        img = Image.open(input_path)
        
        # Check if image has transparency
        has_transparency = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
        
        # Get original size
        original_size = os.path.getsize(input_path)
        print(f"  Original: {original_size / 1024 / 1024:.2f} MB")
        
        # If already under 5MB and it's a PNG with transparency, optimize PNG
        if has_transparency and "logo" in input_path.lower() or "glass" in input_path.lower():
            # Keep as PNG but optimize
            img = img.convert('RGBA')
            output_png = output_path.replace('.jpg', '.png')
            img.save(output_png, 'PNG', optimize=True)
            new_size = os.path.getsize(output_png)
            print(f"  Optimized PNG: {new_size / 1024 / 1024:.2f} MB -> {output_png}")
            return output_png
        
        # Convert to RGB for JPEG
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background for transparency
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                background.paste(img, mask=img.split()[-1])
                img = background
            else:
                img = img.convert('RGB')
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Try different quality levels to get under 5MB
        for quality in [95, 90, 85, 80, 75, 70]:
            output_jpg = output_path.replace('.png', '.jpg')
            img.save(output_jpg, 'JPEG', quality=quality, optimize=True)
            new_size = os.path.getsize(output_jpg)
            
            if new_size < max_size_mb * 1024 * 1024:
                print(f"  Optimized JPEG (q={quality}): {new_size / 1024 / 1024:.2f} MB -> {output_jpg}")
                return output_jpg
        
        # If still too large, resize
        print(f"  Still too large, resizing...")
        scale = 0.8
        while new_size >= max_size_mb * 1024 * 1024 and scale > 0.3:
            new_width = int(img.width * scale)
            new_height = int(img.height * scale)
            resized = img.resize((new_width, new_height), Image.LANCZOS)
            resized.save(output_jpg, 'JPEG', quality=85, optimize=True)
            new_size = os.path.getsize(output_jpg)
            print(f"  Resized to {new_width}x{new_height}: {new_size / 1024 / 1024:.2f} MB")
            scale -= 0.1
        
        return output_jpg
        
    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("Optimizing images to under 5MB...\n")
    
    optimized_files = []
    
    for image_name in IMAGES:
        input_path = os.path.join(UPLOAD_DIR, image_name)
        
        if not os.path.exists(input_path):
            print(f"Skipping {image_name} - file not found")
            continue
        
        print(f"Processing: {image_name}")
        
        # Determine output name
        base_name = os.path.splitext(image_name)[0]
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}-optimized.jpg")
        
        result = optimize_image(input_path, output_path)
        if result:
            optimized_files.append(result)
    
    print(f"\n{'='*50}")
    print(f"Optimization complete! {len(optimized_files)} images processed.")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"\nOptimized files:")
    for f in optimized_files:
        size = os.path.getsize(f)
        print(f"  {os.path.basename(f)}: {size / 1024:.1f} KB")

if __name__ == "__main__":
    main()
