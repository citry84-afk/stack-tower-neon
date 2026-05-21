#!/usr/bin/env python3
"""Genera logo.png (512×512) desde og-image.jpg para schema.org."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "og-image.jpg"
DST = ROOT / "logo.png"

def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"missing {SRC} — run scripts/generate-og-image.py first")
    img = Image.open(SRC).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    img = img.resize((512, 512), Image.Resampling.LANCZOS)
    img.save(DST, "PNG", optimize=True)
    print("wrote", DST, DST.stat().st_size)


if __name__ == "__main__":
    main()
