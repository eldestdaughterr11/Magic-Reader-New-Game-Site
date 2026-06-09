import os
from PIL import Image

path = r"C:\Users\tipid\Downloads\visuals\new classmate_20260308212915.png"
if os.path.exists(path):
    print("Original file exists!")
    img = Image.open(path)
    print("Size:", img.size)
    print("Mode:", img.mode)
else:
    print("Original file NOT found at the path")
