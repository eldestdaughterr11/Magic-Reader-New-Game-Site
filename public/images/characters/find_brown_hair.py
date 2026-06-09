import os
from PIL import Image

def has_brown_hair(path):
    img = Image.open(path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    brown_count = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0:
                # Check if it matches (73, 34, 0) with some tolerance
                if abs(r - 73) + abs(g - 34) + abs(b - 0) < 15:
                    brown_count += 1
    return brown_count

folder = "public/images/characters"
for f in sorted(os.listdir(folder)):
    if f.endswith(".png"):
        path = os.path.join(folder, f)
        brown_count = has_brown_hair(path)
        if brown_count > 100:
            print(f"{f:<25} has {brown_count} pixels of brown hair color")
