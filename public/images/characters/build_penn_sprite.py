"""
Build penn-1.png and penn-2.png from a Gemini / composite Penn export.

Removes the baked checkerboard by flood filling from the border using a grayscale
and color-range bounding rule to prevent leaking into character outlines or gray vests.
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


SOURCE_NAME = "penn-source.png"


def strip_checkerboard(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    
    # Initialize queue with all border pixels
    for x in range(w):
        for y in (0, h - 1):
            q.append((x, y))
            visited[y][x] = True
        
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x]:
                q.append((x, y))
                visited[y][x] = True

    # Flood fill
    while q:
        x, y = q.popleft()
        nc = px[x, y]
        r, g, b = nc[:3]
        
        # Background checkerboard is gray: difference between channels is small
        is_gray = max(r, g, b) - min(r, g, b) < 15
        
        # Not too dark (outlines/hair) and not too bright (collar/socks)
        is_bg_range = 40 <= max(r, g, b) and min(r, g, b) <= 230
        
        if is_gray and is_bg_range:
            # Mark as background (transparent)
            px[x, y] = (0, 0, 0, 0)
            
            # Check 4-connected neighbors
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    if not visited[ny][nx]:
                        visited[ny][nx] = True
                        q.append((nx, ny))

    return rgba


def finalize_sprite(im: Image.Image) -> Image.Image:
    """Crop to visible pixels."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    
    min_x = min_y = 10**9
    max_x = max_y = -1
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
    if max_x < min_x:
        return im
    return im.crop((min_x, min_y, max_x + 1, max_y + 1))


def main() -> int:
    here = Path(__file__).resolve().parent
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else here / SOURCE_NAME
    if not src.is_file():
        print(f"Missing source image.\n  Expected: {here / SOURCE_NAME}\n  Or pass a path as argv.", file=sys.stderr)
        return 1

    base = strip_checkerboard(Image.open(src))
    w, h = base.size
    mid = w // 2
    first = finalize_sprite(base.crop((0, 0, mid, h)))
    second = finalize_sprite(base.crop((mid, 0, w, h)))

    first.save(here / "penn-1.png", optimize=True)
    second.save(here / "penn-2.png", optimize=True)
    print(f"Wrote penn-1.png {first.size} and penn-2.png {second.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
