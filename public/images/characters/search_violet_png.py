import os
from PIL import Image

def count_violet(path):
    img = Image.open(path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    violet_count = 0
    total_non_transparent = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0:
                total_non_transparent += 1
                # Violet definition: R and B are greater than G, and not too bright
                if r > g + 15 and b > g + 15 and max(r, g, b) < 200:
                    violet_count += 1
                    
    return violet_count, total_non_transparent

folder = "public/images/characters"
for f in sorted(os.listdir(folder)):
    if f.endswith(".png"):
        path = os.path.join(folder, f)
        violet_count, total = count_violet(path)
        pct = (violet_count / total * 100) if total > 0 else 0
        print(f"{f:<25} Violet: {violet_count:<5} Total: {total:<6} Pct: {pct:.1f}%")
