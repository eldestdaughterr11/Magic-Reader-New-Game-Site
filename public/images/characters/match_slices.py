import math
from PIL import Image

def analyze_image(path):
    img = Image.open(path).convert("RGB")
    thumb = img.resize((10, 10))
    px = thumb.load()
    colors = []
    for y in range(10):
        for x in range(10):
            colors.append(px[x, y])
    return colors

cards = {
    "A": r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156815644.png",
    "E": r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156820899.png",
    "I": r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156826363.png",
    "O": r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156831256.png"
}

card_profiles = {name: analyze_image(path) for name, path in cards.items()}

for i in range(7):
    slice_path = f"public/images/characters/gameplay_slice_{i}.png"
    try:
        slice_profile = analyze_image(slice_path)
    except Exception as e:
        print(f"Slice {i} failed to load: {e}")
        continue
    
    best_match = None
    min_diff = float("inf")
    for name, profile in card_profiles.items():
        diff = 0
        for c1, c2 in zip(slice_profile, profile):
            diff += abs(c1[0] - c2[0]) + abs(c1[1] - c2[1]) + abs(c1[2] - c2[2])
        if diff < min_diff:
            min_diff = diff
            best_match = name
            
    print(f"Slice {i} best matches Card {best_match} with diff {min_diff}")
