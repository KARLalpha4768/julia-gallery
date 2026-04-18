"""
Auto-crop white/light paper edges from artwork images.
Detects the painting boundary and crops to it.
"""
from PIL import Image, ImageFilter
import os
import shutil

ARTWORK_DIR = r"e:\OneDrive\Desktop\Erze Novel\Art Commerce Website\public\artwork"
BACKUP_DIR = os.path.join(ARTWORK_DIR, "_originals_backup")

# Create backup
os.makedirs(BACKUP_DIR, exist_ok=True)

def get_crop_bounds(img, threshold=230, margin=2):
    """Find the bounding box of the non-white content."""
    # Convert to grayscale
    gray = img.convert("L")
    # Apply slight blur to reduce noise
    gray = gray.filter(ImageFilter.GaussianBlur(radius=2))
    
    width, height = gray.size
    pixels = gray.load()
    
    # Find top boundary
    top = 0
    for y in range(height):
        row_dark = sum(1 for x in range(width) if pixels[x, y] < threshold)
        if row_dark > width * 0.15:  # At least 15% of row is dark (painting content)
            top = max(0, y - margin)
            break
    
    # Find bottom boundary 
    bottom = height
    for y in range(height - 1, -1, -1):
        row_dark = sum(1 for x in range(width) if pixels[x, y] < threshold)
        if row_dark > width * 0.15:
            bottom = min(height, y + margin + 1)
            break
    
    # Find left boundary
    left = 0
    for x in range(width):
        col_dark = sum(1 for y in range(height) if pixels[x, y] < threshold)
        if col_dark > height * 0.15:
            left = max(0, x - margin)
            break
    
    # Find right boundary
    right = width
    for x in range(width - 1, -1, -1):
        col_dark = sum(1 for y in range(height) if pixels[x, y] < threshold)
        if col_dark > height * 0.15:
            right = min(width, x + margin + 1)
            break
    
    return (left, top, right, bottom)


processed = 0
skipped = 0

for fname in sorted(os.listdir(ARTWORK_DIR)):
    if not fname.endswith(".jpeg"):
        continue
    
    fpath = os.path.join(ARTWORK_DIR, fname)
    
    # Backup original
    backup_path = os.path.join(BACKUP_DIR, fname)
    if not os.path.exists(backup_path):
        shutil.copy2(fpath, backup_path)
    
    img = Image.open(fpath)
    orig_size = img.size
    
    bounds = get_crop_bounds(img)
    crop_w = bounds[2] - bounds[0]
    crop_h = bounds[3] - bounds[1]
    
    # Only crop if we're removing at least 1% of image on any side
    removed_pct = 1 - (crop_w * crop_h) / (orig_size[0] * orig_size[1])
    
    if removed_pct > 0.005:  # More than 0.5% would be removed
        cropped = img.crop(bounds)
        cropped.save(fpath, "JPEG", quality=92)
        new_size = cropped.size
        print(f"CROP {fname}: {orig_size[0]}x{orig_size[1]} -> {new_size[0]}x{new_size[1]} (removed {removed_pct*100:.1f}%)")
        processed += 1
    else:
        print(f"SKIP {fname}: already clean ({removed_pct*100:.2f}% would change)")
        skipped += 1

print(f"\nDone: {processed} cropped, {skipped} already clean")
print(f"Originals backed up to: {BACKUP_DIR}")
