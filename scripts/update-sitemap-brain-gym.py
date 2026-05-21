#!/usr/bin/env python3
"""Añade landings Brain Gym (solo páginas de curso) al sitemap.xml."""
from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
MARKER = "<!-- BRAIN_GYM_LANDINGS -->"
LASTMOD = datetime.now(timezone.utc).strftime("%Y-%m-%d")

COURSES = [
    "infantil/3-anos",
    "infantil/4-anos",
    "infantil/5-anos",
    "primaria/1-primaria",
    "primaria/2-primaria",
    "primaria/3-primaria",
    "primaria/4-primaria",
    "primaria/5-primaria",
    "primaria/6-primaria",
    "eso/1-eso",
    "eso/2-eso",
]
def url_entry(path: str, priority: str) -> str:
    loc = f"https://lipastudios.com/{path}"
    return f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{LASTMOD}</lastmod>
    <priority>{priority}</priority>
    <changefreq>weekly</changefreq>
    <mobile:mobile/>
  </url>
"""


def build_block() -> str:
    lines = [MARKER]
    for c in COURSES:
        lines.append(url_entry(c, "0.88"))
    return "\n".join(lines) + "\n"


def main() -> None:
    text = SITEMAP.read_text(encoding="utf-8")
    block = build_block()
    if MARKER in text:
        head, tail = text.split(MARKER, 1)
        rest_blocks = re.findall(r"  <url>[\s\S]*?</url>\n", tail)
        kept_rest: list[str] = []
        course_prefixes = tuple(f"https://lipastudios.com/{c}" for c in COURSES)
        subject_suffixes = ("/mates", "/lengua", "/ingles", "/naturales", "/sociales")
        for b in rest_blocks:
            m = re.search(r"<loc>(.*?)</loc>", b)
            loc = m.group(1) if m else ""
            if loc in course_prefixes or any(loc.endswith(s) for s in subject_suffixes):
                continue
            kept_rest.append(b)
        text = head + block.rstrip() + "\n" + "".join(kept_rest)
    else:
        insert_before = "  <url>\n    <loc>https://lipastudios.com/mi-rutina-cerebro.html</loc>"
        if insert_before not in text:
            raise SystemExit("insert point not found in sitemap.xml")
        text = text.replace(insert_before, block + insert_before, 1)
    SITEMAP.write_text(text, encoding="utf-8")
    n = len(COURSES)
    print(f"updated sitemap with {n} brain gym course URLs")


if __name__ == "__main__":
    main()
