import os
from PIL import Image

def main():
    img_path = r"C:\Users\tipid\Downloads\visuals\A sheriff sans_20260217143320.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    im = Image.open(img_path)
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # Find the bounding box of non-transparent pixels (a > 0)
    min_x, min_y = w, h
    max_x, max_y = -1, -1
    for x in range(w):
        for y in range(h):
            if px[x, y][3] > 0:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if max_x >= min_x and max_y >= min_y:
        cropped_sprite = rgba.crop((min_x, min_y, max_x + 1, max_y + 1))
    else:
        cropped_sprite = rgba

    output_path = r"public/images/characters/sherriff-1.png"
    cropped_sprite.save(output_path, optimize=True)
    print(f"Saved Sherriff Sans sprite to {output_path} with size {cropped_sprite.size}")

if __name__ == "__main__":
    main()
