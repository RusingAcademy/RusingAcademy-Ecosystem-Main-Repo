#!/bin/bash
# =============================================================================
# Image Optimization Script for RusingAcademy Ecosystem
# Wave 2 Sprint 1 - Performance Optimization
# =============================================================================
# This script converts JPG/PNG images to WebP format with quality optimization
# and resizes oversized images while maintaining aspect ratio.
# It does NOT delete originals - it creates .webp versions alongside them.
# =============================================================================

set -e

IMAGES_DIR="client/public/images"
QUALITY=82          # WebP quality (80-85 is optimal for web)
MAX_WIDTH_HERO=1920 # Max width for hero/banner images
MAX_WIDTH_CARD=800  # Max width for card/thumbnail images
MAX_WIDTH_LOGO=400  # Max width for logos
DRY_RUN=false

# Parse arguments
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be modified."
fi

echo "============================================="
echo "RusingAcademy Image Optimization"
echo "============================================="
echo ""

# Counters
CONVERTED=0
SKIPPED=0
SAVED_BYTES=0

# Function to get max width based on directory
get_max_width() {
  local filepath="$1"
  case "$filepath" in
    */hero/*|*/generated/*) echo $MAX_WIDTH_HERO ;;
    */logos/*) echo $MAX_WIDTH_LOGO ;;
    *) echo $MAX_WIDTH_CARD ;;
  esac
}

# Function to convert a single image
convert_image() {
  local src="$1"
  local ext="${src##*.}"
  local webp_path="${src%.*}.webp"
  local max_w=$(get_max_width "$src")

  # Skip if WebP already exists and is newer
  if [ -f "$webp_path" ] && [ "$webp_path" -nt "$src" ]; then
    SKIPPED=$((SKIPPED + 1))
    return
  fi

  local orig_size=$(stat -c%s "$src" 2>/dev/null || echo 0)

  if [ "$DRY_RUN" = true ]; then
    echo "[DRY] Would convert: $src ($(numfmt --to=iec $orig_size))"
    CONVERTED=$((CONVERTED + 1))
    return
  fi

  # Get current dimensions
  local dims=$(identify -format "%wx%h" "$src" 2>/dev/null || echo "0x0")
  local cur_w=$(echo "$dims" | cut -dx -f1)

  # Convert with optional resize
  if [ "$cur_w" -gt "$max_w" ] 2>/dev/null; then
    convert "$src" -resize "${max_w}x>" -quality 85 /tmp/resized_tmp.jpg 2>/dev/null
    cwebp -q $QUALITY /tmp/resized_tmp.jpg -o "$webp_path" 2>/dev/null
    rm -f /tmp/resized_tmp.jpg
  else
    cwebp -q $QUALITY "$src" -o "$webp_path" 2>/dev/null
  fi

  if [ -f "$webp_path" ]; then
    local new_size=$(stat -c%s "$webp_path" 2>/dev/null || echo 0)
    local saved=$((orig_size - new_size))
    if [ $saved -gt 0 ]; then
      SAVED_BYTES=$((SAVED_BYTES + saved))
    fi
    CONVERTED=$((CONVERTED + 1))
    echo "[OK] $src ($(numfmt --to=iec $orig_size) -> $(numfmt --to=iec $new_size))"
  else
    echo "[FAIL] $src"
  fi
}

# Process all JPG and PNG files
echo "Processing images in $IMAGES_DIR..."
echo ""

find "$IMAGES_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) \
  ! -name "*.min.*" \
  ! -path "*/inspiration/*" \
  | sort | while read -r file; do
    convert_image "$file"
  done

echo ""
echo "============================================="
echo "RESULTS"
echo "============================================="
echo "Converted: $CONVERTED"
echo "Skipped:   $SKIPPED"
echo "Saved:     $(numfmt --to=iec $SAVED_BYTES 2>/dev/null || echo "${SAVED_BYTES} bytes")"
echo "============================================="
