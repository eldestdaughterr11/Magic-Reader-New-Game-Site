from PIL import Image
import os

def find_outline_colors(path):
    img = Image.open(path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    # Let's count colors that are dark violet/purple, e.g. R between 10 and 60, B between 10 and 60, G between 5 and 45.
    dark_violet = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0:
                # We know the background is (75, 56, 90). Let's see what other purple/violet colors exist.
                # Check if it has a purple hue (R and B > G) and is relatively dark (max(r, g, b) < 70)
                if r > g + 10 and b > g + 10 and max(r, g, b) < 75:
                    dark_violet[(r, g, b)] = dark_violet.get((r, g, b), 0) + 1
                    
    sorted_colors = sorted(dark_violet.items(), key=lambda item: item[1], reverse=True)
    print(f"\n--- {path} dark violet colors ---")
    for color, count in sorted_colors[:15]:
        print(f"  Color {color}: {count} pixels")

find_outline_colors(r"C:\Users\tipid\AppData\Local\Temp\media__1780931621508.png" if not os.path.exists(r"C:\Users\tipid\.gemini\antigravity\brain\0ebef052-010a-4fd4-a6fc-782c496a0ffe\media__1780931621508.png") else r"C:\Users\tipid\.gemini\antigravity\brain\0ebef052-010a-4fd4-a6fc-782c496a0ffe\media__1780931621508.png")
