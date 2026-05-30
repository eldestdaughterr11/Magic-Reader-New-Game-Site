import os
from PIL import Image

def main():
    img_path = r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156788803.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    im = Image.open(img_path)
    w, h = im.size
    rgba = im.convert("RGBA")
    px = rgba.load()

    # The background of the webpage is approx (75, 56, 90) or (61, 43, 79)
    # Let's count non-background pixels per row
    def is_background(r, g, b):
        # We can look for the main purple colors
        # (75, 56, 90) is #4b385a
        # (61, 43, 79) is #3d2b4f
        # (107, 119, 82) is olive header/footer #6b7752
        if abs(r - 75) + abs(g - 56) + abs(b - 90) < 15:
            return True
        if abs(r - 61) + abs(g - 43) + abs(b - 79) < 15:
            return True
        if abs(r - 107) + abs(g - 119) + abs(b - 82) < 15:
            return True
        return False

    row_has_content = [False] * h
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not is_background(r, g, b):
                row_has_content[y] = True
                break

    # Group adjacent rows that have content
    ranges = []
    in_range = False
    start_y = 0
    for y in range(h):
        if row_has_content[y] and not in_range:
            start_y = y
            in_range = True
        elif not row_has_content[y] and in_range:
            if y - start_y > 10:  # ignore tiny noise
                ranges.append((start_y, y - 1))
            in_range = False
    if in_range:
        ranges.append((start_y, h - 1))

    print("Detected content ranges:")
    for idx, (y1, y2) in enumerate(ranges):
        print(f"Range {idx}: y={y1} to {y2} (height={y2-y1+1})")
        # Crop the width to content as well
        col_has_content = [False] * w
        for x in range(w):
            for y in range(y1, y2 + 1):
                r, g, b, a = px[x, y]
                if not is_background(r, g, b):
                    col_has_content[x] = True
                    break
        x1, x2 = 0, w - 1
        for x in range(w):
            if col_has_content[x]:
                x1 = x
                break
        for x in range(w - 1, -1, -1):
            if col_has_content[x]:
                x2 = x
                break
        # Save temp crops
        crop_img = rgba.crop((x1, y1, x2 + 1, y2 + 1))
        crop_img.save(f"public/images/characters/temp_crop_{idx}.png")
        print(f"  Saved temp_crop_{idx}.png with size {crop_img.size}")

if __name__ == "__main__":
    main()
