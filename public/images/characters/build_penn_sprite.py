"""
Build penn-1.png and penn-2.png from a Gemini / composite Penn export.

1. Save your PNG as penn-source.png in this folder (or pass the path as argv).
2. Run: python build_penn_sprite.py

Removes the baked checkerboard by flooding from the border through pixels that
match neutral (“checker”) tones sampled from the edge.
"""

from __future__ import annotations

import sys
from collections import Counter, deque
from pathlib import Path

from PIL import Image


SOURCE_NAME = "penn-source.png"


def _edge_samples(px, w: int, h: int, stride: int = 1) -> list[tuple[int, int, int]]:
    out: list[tuple[int, int, int]] = []
    for x in range(0, w, stride):
        out.append(px[x, 0][:3])
        out.append(px[x, h - 1][:3])
    for y in range(0, h, stride):
        out.append(px[0, y][:3])
        out.append(px[w - 1, y][:3])
    return out


def _quantize(rgb: tuple[int, int, int], step: int = 6) -> tuple[int, int, int]:
    return tuple(round(c / step) * step for c in rgb)


def _backdrop_templates(edge_colors: list[tuple[int, int, int]]) -> set[tuple[int, int, int]]:
    """Quantized neutral edge colors (checker tiles)."""
    ctr = Counter(_quantize(c) for c in edge_colors)
    templates: set[tuple[int, int, int]] = set()
    for rgb, _ in ctr.most_common(40):
        r, g, b = rgb
        if max(r, g, b) - min(r, g, b) > 42:
            continue
        templates.add(rgb)
    return templates


def _near(rgb: tuple[int, int, int], tpl: tuple[int, int, int], tol: int = 28) -> bool:
    return all(abs(rgb[i] - tpl[i]) <= tol for i in range(3))


def _matches_any(rgb: tuple[int, int, int], templates: set[tuple[int, int, int]], tol: int) -> bool:
    return any(_near(rgb, t, tol) for t in templates)


def _clear_opaque_bands(px, w: int, h: int, max_lum_threshold: float = 46.0) -> None:
    """Remove letterbox rows/cols that are uniformly very dark (opaque black bars)."""
    for y in range(h):
        vals = [px[x, y] for x in range(w) if px[x, y][3] > 0]
        if not vals:
            continue
        mx = max(sum(c[:3]) / 3 for c in vals)
        if mx < max_lum_threshold:
            for x in range(w):
                px[x, y] = (0, 0, 0, 0)

    for x in range(w):
        vals = [px[x, y] for y in range(h) if px[x, y][3] > 0]
        if not vals:
            continue
        mx = max(sum(c[:3]) / 3 for c in vals)
        if mx < max_lum_threshold:
            for y in range(h):
                px[x, y] = (0, 0, 0, 0)


def _crop_nonempty(im: Image.Image) -> Image.Image:
    px = im.load()
    w, h = im.size
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


def strip_checkerboard(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()

    edge = _edge_samples(px, w, h, stride=2)
    templates = _backdrop_templates(edge)
    if len(templates) < 2:
        templates = _backdrop_templates(_edge_samples(px, w, h, stride=1))

    seeds: list[tuple[int, int]] = []
    for x in range(w):
        for y in (0, h - 1):
            c = px[x, y][:3]
            if _matches_any(c, templates, tol=30):
                seeds.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            c = px[x, y][:3]
            if _matches_any(c, templates, tol=30):
                seeds.append((x, y))

    inside = [[False] * w for _ in range(h)]
    seen = set(seeds)
    q: deque[tuple[int, int]] = deque(seeds)
    while q:
        x, y = q.popleft()
        inside[y][x] = True
        c = px[x, y][:3]
        if not _matches_any(c, templates, tol=36):
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            if (nx, ny) in seen:
                continue
            nc = px[nx, ny][:3]
            if _matches_any(nc, templates, tol=36):
                seen.add((nx, ny))
                q.append((nx, ny))

    out = Image.new("RGBA", (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            if inside[y][x]:
                po[x, y] = (0, 0, 0, 0)
            else:
                r, g, b = px[x, y][:3]
                po[x, y] = (r, g, b, 255)

    return out


def finalize_sprite(im: Image.Image) -> Image.Image:
    """Strip leftover letterboxing and crop to visible pixels."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    _clear_opaque_bands(px, w, h)
    return _crop_nonempty(rgba)


def main() -> int:
    here = Path(__file__).resolve().parent
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else here / SOURCE_NAME
    if not src.is_file():
        print(f"Missing source image.\n  Expected: {here / SOURCE_NAME}\n  Or pass a path as argv.", file=sys.stderr)
        return 1

    base = strip_checkerboard(Image.open(src))
    w, h = base.size
    # Dalawang bersyon ni Penn sa source: kaliwa at kanan (hati sa gitna).
    mid = w // 2
    first = finalize_sprite(base.crop((0, 0, mid, h)))
    second = finalize_sprite(base.crop((mid, 0, w, h)))

    first.save(here / "penn-1.png", optimize=True)
    second.save(here / "penn-2.png", optimize=True)
    print(f"Wrote penn-1.png {first.size} and penn-2.png {second.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
