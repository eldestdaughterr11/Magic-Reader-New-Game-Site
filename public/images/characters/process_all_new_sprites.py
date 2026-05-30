import os
from PIL import Image

def process_sprite(src_filename, dest_filename):
    img_path = os.path.join(r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9", src_filename)
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    im = Image.open(img_path)
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # The background is dark purple (approx 80, 57, 88)
    def is_background(r, g, b, a):
        if a < 10:
            return True
        # Check proximity to (80, 57, 88)
        if abs(r - 80) + abs(g - 57) + abs(b - 88) < 30:
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

    output_path = os.path.join(r"public/images/characters", dest_filename)
    cropped_sprite.save(output_path, optimize=True)
    print(f"Saved {dest_filename} with size {cropped_sprite.size}")

def main():
    mappings = [
        ("media__1780156315077.png", "penny-1.png"),
        ("media__1780156319623.png", "grandma-1.png"),
        ("media__1780156324836.png", "connie-1.png"),
        ("media__1780156331786.png", "teacher-1.png")
    ]

    for src, dest in mappings:
        process_sprite(src, dest)

if __name__ == "__main__":
    main()
