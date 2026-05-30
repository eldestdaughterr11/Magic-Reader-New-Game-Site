import os
from PIL import Image

def main():
    img_path = r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780152891348.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    im = Image.open(img_path)
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # The background is white (255, 255, 255)
    def is_background(r, g, b, a):
        if a < 10:
            return True
        # Check proximity to white (255, 255, 255)
        if r > 240 and g > 240 and b > 240:
            return True
        return False

    # Create a new image to make background transparent
    transparent_img = Image.new("RGBA", (w, h))
    t_px = transparent_img.load()

    for x in range(w):
        for y in range(h):
            r, g, b, a = px[x, y]
            if is_background(r, g, b, a):
                t_px[x, y] = (0, 0, 0, 0)
            else:
                t_px[x, y] = (r, g, b, a)

    # Now auto-crop to its tight visible bounding box
    min_x, min_y = w, h
    max_x, max_y = -1, -1
    for x in range(w):
        for y in range(h):
            if t_px[x, y][3] > 0:  # non-transparent
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if max_x >= min_x and max_y >= min_y:
        cropped_sprite = transparent_img.crop((min_x, min_y, max_x + 1, max_y + 1))
    else:
        cropped_sprite = transparent_img

    output_path = r"public/images/characters/syllabella-1.png"
    cropped_sprite.save(output_path, optimize=True)
    print(f"Saved Sylla Bella sprite to {output_path} with size {cropped_sprite.size}")

if __name__ == "__main__":
    main()
