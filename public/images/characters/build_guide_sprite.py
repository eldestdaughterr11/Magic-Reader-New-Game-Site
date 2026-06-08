from PIL import Image
from pathlib import Path
from collections import deque

def clean_and_crop_sprite(rgba, x_start, x_end):
    # Crop the raw sprite from the source
    w_src, h_src = rgba.size
    sprite = rgba.crop((x_start, 0, x_end, h_src))
    w, h = sprite.size
    px = sprite.load()
    
    # Flood fill starting from all border pixels to make the background transparent
    visited = [[False] * w for _ in range(h)]
    q = deque()
    
    # Initialize queue with border pixels
    for x in range(w):
        for y in (0, h - 1):
            q.append((x, y))
            visited[y][x] = True
        
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x]:
                q.append((x, y))
                visited[y][x] = True
                
    while q:
        cx, cy = q.popleft()
        r, g, b, a = px[cx, cy]
        
        # Background is dark brown close to (40, 28, 29)
        if abs(r - 40) + abs(g - 28) + abs(b - 29) < 25:
            px[cx, cy] = (0, 0, 0, 0)
            
            # Check 4-connected neighbors
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h:
                    if not visited[ny][nx]:
                        visited[ny][nx] = True
                        q.append((nx, ny))
                        
    # Crop to actual visible bounding box of the non-transparent pixels
    min_x = min_y = 10**9
    max_x = max_y = -1
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0:  # Alpha > 0
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                
    if max_x >= min_x and max_y >= min_y:
        return sprite.crop((min_x, min_y, max_x + 1, max_y + 1))
    return sprite

def main():
    here = Path(__file__).resolve().parent
    src = here / "guide-source.png"
    
    if not src.is_file():
        print("Missing guide-source.png")
        return 1
        
    im = Image.open(src)
    rgba = im.convert("RGBA")
    
    # Precise active boundaries of the 3 sprites in the new guide-source.png
    sprite1 = clean_and_crop_sprite(rgba, 40, 160)
    sprite2 = clean_and_crop_sprite(rgba, 220, 340)
    sprite3 = clean_and_crop_sprite(rgba, 410, 725)
    
    sprite1.save(here / "guide-1.png", optimize=True)
    sprite2.save(here / "guide-2.png", optimize=True)
    sprite3.save(here / "guide-3.png", optimize=True)
    
    print(f"Successfully sliced guide-source.png into three separate, transparent sprites!")
    print(f"guide-1 size: {sprite1.size}")
    print(f"guide-2 size: {sprite2.size}")
    print(f"guide-3 size: {sprite3.size}")
    return 0

if __name__ == "__main__":
    main()

