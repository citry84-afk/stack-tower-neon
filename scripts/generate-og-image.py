#!/usr/bin/env python3
"""Genera og-image.jpg (1200×630) para Open Graph."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#1a1520")
draw = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    r = int(26 + t * 20)
    g = int(21 + t * 35)
    b = int(32 + t * 40)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

draw.rounded_rectangle((60, 80, W - 60, H - 80), radius=32, outline="#2ed3a6", width=4)
draw.rounded_rectangle((72, 92, W - 72, H - 92), radius=24, fill=(255, 255, 255, 12))

try:
    title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 56)
    sub_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 32)
    small_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 24)
except OSError:
    title_font = ImageFont.load_default()
    sub_font = title_font
    small_font = title_font

draw.text((120, 200), "LIPA Brain Gym", fill="#2ed3a6", font=title_font)
draw.text((120, 290), "Refuerzo escolar en 7 minutos", fill="#f5f0e8", font=sub_font)
draw.text((120, 360), "Mates · Lengua · Inglés · Naturales · Sociales", fill="#b8b0a4", font=small_font)
draw.text((120, 430), "lipastudios.com", fill="#7c3aed", font=small_font)

from pathlib import Path

path = Path(__file__).resolve().parents[1] / "og-image.jpg"
img.save(path, "JPEG", quality=88, optimize=True)
print("wrote", path, path.stat().st_size)
