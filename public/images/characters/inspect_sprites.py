from PIL import Image

files = [
    "media__1780156315077.png",
    "media__1780156319623.png",
    "media__1780156324836.png",
    "media__1780156331786.png"
]

for f in files:
    img = Image.open(f"C:\\Users\\tipid\\.gemini\\antigravity\\brain\\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\\{f}")
    print(f, img.size)
