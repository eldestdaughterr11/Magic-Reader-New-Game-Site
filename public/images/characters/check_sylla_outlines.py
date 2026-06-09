from PIL import Image

img = Image.open("public/images/characters/syllabella-1.png")
rgba = img.convert("RGBA")
w, h = rgba.size
px = rgba.load()

# Let's count how many black/near-black pixels are transparent vs opaque
black_transparent = 0
black_opaque = 0
other_opaque = 0

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        # Check if color is black or very dark
        if r < 15 and g < 15 and b < 15:
            if a == 0:
                black_transparent += 1
            else:
                black_opaque += 1
        elif a > 0:
            other_opaque += 1

print("Syllabella-1.png pixel analysis:")
print(f"Total size: {w}x{h} = {w*h} pixels")
print(f"Opaque pixels: {black_opaque + other_opaque}")
print(f"Black/Dark transparent pixels: {black_transparent}")
print(f"Black/Dark opaque pixels: {black_opaque}")
print(f"Other opaque pixels: {other_opaque}")
