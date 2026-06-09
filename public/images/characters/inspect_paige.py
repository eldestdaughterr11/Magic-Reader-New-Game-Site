from PIL import Image
import os

def inspect(path):
    if not os.path.exists(path):
        print(f"{path} does not exist")
        return
    img = Image.open(path)
    print(f"File: {path}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    # Count unique colors and their alphas
    alphas = {}
    non_transparent_colors = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            alphas[a] = alphas.get(a, 0) + 1
            if a > 0:
                color = (r, g, b)
                non_transparent_colors[color] = non_transparent_colors.get(color, 0) + 1
                
    print(f"Alpha counts: {alphas}")
    # Show some dark colors (possible outlines)
    dark_colors = sorted([c for c in non_transparent_colors.keys() if sum(c) < 100], key=lambda c: sum(c))
    print(f"Top 10 darkest colors: {dark_colors[:10]}")

inspect("public/images/characters/paige-1.png")
inspect("public/images/characters/paige-source.png")
