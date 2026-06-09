import os
from PIL import Image

folder = r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9"
for f in sorted(os.listdir(folder)):
    if f.startswith("media_") and f.endswith(".png"):
        path = os.path.join(folder, f)
        img = Image.open(path)
        print(f"{f:<30} Size: {str(img.size):<12} Mode: {img.mode}")
