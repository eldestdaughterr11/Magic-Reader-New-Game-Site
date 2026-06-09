import os
from PIL import Image

folder = "public/images/characters"
for f in sorted(os.listdir(folder)):
    if f.endswith(".png"):
        path = os.path.join(folder, f)
        img = Image.open(path)
        print(f"{f:<25} Size: {str(img.size):<12} Mode: {img.mode}")
