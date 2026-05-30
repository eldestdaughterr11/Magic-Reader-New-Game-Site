from PIL import Image

img = Image.open(r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156788803.png")
w, h = img.size

# We will crop from x = 10 to x = 190 (width 180), and height 140
for i in range(7):
    y_start = 150 + i * 110
    crop_img = img.crop((10, y_start, 200, y_start + 145))
    crop_img.save(f"public/images/characters/gameplay_slice_{i}.png")
    print(f"Slice {i}: y={y_start} to {y_start+145}, saved to gameplay_slice_{i}.png")
