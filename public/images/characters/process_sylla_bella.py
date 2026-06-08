import os
from PIL import Image
from collections import deque

def main():
    img_path = r"C:\Users\tipid\.gemini\antigravity\brain\5f4af748-dbdf-42a9-bd23-fe76b33e3b7b\media__1780933516807.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    img = Image.open(img_path)
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    # 1. Flood fill from the edges to identify the background pixels
    queue = deque()
    visited = set()
    
    # Seed with all border pixels
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h-1))
        visited.add((x, 0))
        visited.add((x, h-1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w-1, y))
        visited.add((0, y))
        visited.add((w-1, y))
        
    # Get corner colors as seed colors for the background
    corner_colors = [px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1]]
    
    # Check color distance.
    def is_bg_color(color):
        r, g, b, a = color
        # Background range: R: 15-60, G: 12-50, B: 10-50.
        if not (15 <= r <= 60 and 12 <= g <= 50 and 10 <= b <= 50):
            return False
        # Do not fill if it is very dark (outlines or shoes)
        if r < 15 and g < 15 and b < 15:
            return False
        return True

    bg_mask = [[False for _ in range(h)] for _ in range(w)]
    
    while queue:
        cx, cy = queue.popleft()
        color = px[cx, cy]
        if is_bg_color(color):
            bg_mask[cx][cy] = True
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # 2. Create the transparent image
    transparent_img = Image.new("RGBA", (w, h))
    t_px = transparent_img.load()
    
    for x in range(w):
        for y in range(h):
            if bg_mask[x][y]:
                t_px[x, y] = (0, 0, 0, 0)
            else:
                t_px[x, y] = px[x, y]
                
    # 3. Auto-crop to its tight visible bounding box
    min_x, min_y = w, h
    max_x, max_y = -1, -1
    for x in range(w):
        for y in range(h):
            if t_px[x, y][3] > 0:  # non-transparent
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                
    if max_x >= min_x and max_y >= min_y:
        cropped_sprite = transparent_img.crop((min_x, min_y, max_x + 1, max_y + 1))
    else:
        cropped_sprite = transparent_img
        
    output_path = r"public/images/characters/syllabella-1.png"
    cropped_sprite.save(output_path, optimize=True)
    print(f"Saved Sylla Bella sprite to {output_path} with size {cropped_sprite.size}")

if __name__ == "__main__":
    main()
