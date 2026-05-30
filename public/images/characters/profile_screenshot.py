import os
from PIL import Image

def main():
    img_path = r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156788803.png"
    im = Image.open(img_path).convert("RGB")
    w, h = im.size
    px = im.load()

    # Define background check
    def is_bg(color):
        r, g, b = color
        # Page background is dark purple: #3d2b4f = (61, 43, 79)
        # Or #4b385a = (75, 56, 90)
        # Header is olive: #6b7752 = (107, 119, 82)
        if abs(r - 61) + abs(g - 43) + abs(b - 79) < 25:
            return True
        if abs(r - 75) + abs(g - 56) + abs(b - 90) < 25:
            return True
        if abs(r - 107) + abs(g - 119) + abs(b - 82) < 25:
            return True
        return False

    # Let's count non-background pixels in columns and rows
    row_count = []
    for y in range(h):
        cnt = 0
        for x in range(w):
            if not is_bg(px[x, y]):
                cnt += 1
        row_count.append(cnt)

    # Let's find segments where row_count is high
    # (meaning we have an image or card, since text has fewer pixels)
    print("Vertical content profile (every 10 lines):")
    for y in range(0, h, 10):
        # average count over 10 lines
        avg = sum(row_count[y:y+10]) // 10
        print(f"y={y:3d} to {y+9:3d}: {'*' * (avg // 5)} ({avg})")

if __name__ == "__main__":
    main()
