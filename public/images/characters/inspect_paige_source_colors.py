from PIL import Image

def analyze_pixels(path):
    img = Image.open(path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    opaque_colors = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0:
                opaque_colors[(r, g, b)] = opaque_colors.get((r, g, b), 0) + 1
                
    # Sort opaque colors by frequency
    sorted_colors = sorted(opaque_colors.items(), key=lambda item: item[1], reverse=True)
    print(f"\n--- {path} ---")
    print(f"Top 20 most frequent opaque colors (RGB):")
    for color, count in sorted_colors[:20]:
        print(f"  Color {color}: {count} pixels")

analyze_pixels("public/images/characters/paige-source.png")
