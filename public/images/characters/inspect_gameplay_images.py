from PIL import Image

files = [
    "media__1780156788803.png",
    "media__1780156815644.png",
    "media__1780156820899.png",
    "media__1780156826363.png",
    "media__1780156831256.png"
]

for f in files:
    img = Image.open(f"C:\\Users\\tipid\\.gemini\\antigravity\\brain\\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\\{f}")
    print(f, img.size)
