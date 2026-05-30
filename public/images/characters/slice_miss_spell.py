import os
from PIL import Image

def main():
    img_path = r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780152393697.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    im = Image.open(img_path)
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # The background is exactly (80, 57, 88, 255)
    def is_background(r, g, b, a):
        if a < 10:
            return True
        # Check proximity to (80, 57, 88)
        if abs(r - 80) + abs(g - 57) + abs(b - 88) < 15:
            return True
        return False

    # Check for columns that contain foreground pixels
    has_foreground = [False] * w
    for x in range(w):
        for y in range(h):
            r, g, b, a = px[x, y]
            if not is_background(r, g, b, a):
                has_foreground[x] = True
                break

    # Group adjacent columns that have foreground to find the 4 sprites' x-ranges
    ranges = []
    in_range = False
    start_x = 0
    for x in range(w):
        if has_foreground[x] and not in_range:
            start_x = x
            in_range = True
        elif not has_foreground[x] and in_range:
            ranges.append((start_x, x - 1))
            in_range = False
    if in_range:
        ranges.append((start_x, w - 1))

    print("Detected ranges:", ranges)

    if len(ranges) != 4:
        print(f"Warning: Expected 4 ranges, but found {len(ranges)}. Let's fallback or adjust parameters.")
        # If we couldn't separate them because of a few pixels, let's try dividing it into 4 equal segments
        # 304 / 4 = 76 columns each!
        # Let's see: 76 width each is:
        # Range 1: 0 to 75
        # Range 2: 76 to 151
        # Range 3: 152 to 227
        # Range 4: 228 to 303
        ranges = [(0, 75), (76, 151), (152, 227), (228, 303)]
        print("Using fallback 4 equal columns:", ranges)

    # For each detected range, crop the sprite, make background transparent, and auto-crop to its tight bounding box
    for idx, (x1, x2) in enumerate(ranges):
        sprite = rgba.crop((x1, 0, x2 + 1, h))
        sw, sh = sprite.size
        spx = sprite.load()

        for x in range(sw):
            for y in range(sh):
                r, g, b, a = spx[x, y]
                if is_background(r, g, b, a):
                    spx[x, y] = (0, 0, 0, 0)

        # Now auto-crop the sprite to its tight visible bounding box (non-transparent)
        min_x, min_y = sw, sh
        max_x, max_y = -1, -1
        for x in range(sw):
            for y in range(sh):
                if spx[x, y][3] > 0:  # non-transparent
                    min_x = min(min_x, x)
                    max_x = max(max_x, x)
                    min_y = min(min_y, y)
                    max_y = max(max_y, y)

        if max_x >= min_x and max_y >= min_y:
            cropped_sprite = sprite.crop((min_x, min_y, max_x + 1, max_y + 1))
        else:
            cropped_sprite = sprite

        output_path = f"public/images/characters/antagonist-{idx + 1}.png"
        cropped_sprite.save(output_path, optimize=True)
        print(f"Saved sprite {idx + 1} to {output_path} with size {cropped_sprite.size}")

if __name__ == "__main__":
    main()
