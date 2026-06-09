from PIL import Image

def analyze_image(path):
    img = Image.open(path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    # Let's count how many pixels have alpha > 0 and are very dark
    dark_count = 0
    violet_count = 0
    other_count = 0
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0:
                # Check if it's very dark (r, g, b all under 30)
                if r < 30 and g < 30 and b < 30:
                    dark_count += 1
                # Check if it's purple/violet: r and b are higher than g, e.g. r > g + 20 and b > g + 20
                elif r > g + 15 and b > g + 15:
                    violet_count += 1
                else:
                    other_count += 1
                    
    print(f"Analysis for {path}:")
    print(f"Total non-transparent pixels: {dark_count + violet_count + other_count}")
    print(f"Dark/Black pixels (RGB < 30): {dark_count}")
    print(f"Violet/Purple pixels: {violet_count}")
    print(f"Other pixels: {other_count}")

analyze_image("public/images/characters/paige-1.png")
analyze_image("public/images/characters/paige-2.png")
analyze_image("public/images/characters/penn-1.png")
analyze_image("public/images/characters/penn-2.png")
