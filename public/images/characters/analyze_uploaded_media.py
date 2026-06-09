from PIL import Image

def analyze_media(path):
    img = Image.open(path)
    print(f"\nFile: {path}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    opaque_colors = {}
    alphas = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            alphas[a] = alphas.get(a, 0) + 1
            if a > 0:
                opaque_colors[(r, g, b)] = opaque_colors.get((r, g, b), 0) + 1
                
    print(f"Alpha counts: {alphas}")
    sorted_colors = sorted(opaque_colors.items(), key=lambda item: item[1], reverse=True)
    print("Top 10 most frequent opaque colors:")
    for color, count in sorted_colors[:10]:
        print(f"  Color {color}: {count} pixels")

analyze_media(r"C:\Users\tipid\.gemini\antigravity\brain\0ebef052-010a-4fd4-a6fc-782c496a0ffe\media__1780931615981.png")
analyze_media(r"C:\Users\tipid\.gemini\antigravity\brain\0ebef052-010a-4fd4-a6fc-782c496a0ffe\media__1780931621508.png")
