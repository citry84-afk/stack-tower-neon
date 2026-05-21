#!/usr/bin/env python3
"""Repara sitemap.xml: fechas malformadas y URLs Brain Gym duplicadas."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
MARKER = "<!-- BRAIN_GYM_LANDINGS -->"
COURSE_LOCS = (
    "https://lipastudios.com/primaria/",
    "https://lipastudios.com/infantil/",
    "https://lipastudios.com/eso/",
)


def fix_malformed_lastmod(text: str) -> str:
    return re.sub(
        r"<lastmod>2026-02-01-(\d{2})T",
        r"<lastmod>2026-02-\1T",
        text,
    )


def remove_pre_marker_course_dupes(text: str) -> str:
    if MARKER not in text:
        return text
    before, after = text.split(MARKER, 1)
    url_blocks = re.findall(r"  <url>[\s\S]*?</url>\n", before)
    kept: list[str] = []
    for block in url_blocks:
        m = re.search(r"<loc>(.*?)</loc>", block)
        if not m:
            kept.append(block)
            continue
        loc = m.group(1)
        if any(loc.startswith(p) for p in COURSE_LOCS):
            continue
        kept.append(block)
    head = before[: before.find("  <url>")]
    return head + "".join(kept) + MARKER + after


def remove_trailing_brain_gym_dupes(text: str) -> str:
    if MARKER not in text:
        return text
    head, tail = text.split(MARKER, 1)
    blocks = re.findall(r"  <url>[\s\S]*?</url>\n", tail)
    rest: list[str] = []
    for block in blocks:
        m = re.search(r"<loc>(.*?)</loc>", block)
        if m and any(m.group(1).startswith(p) for p in COURSE_LOCS):
            continue
        rest.append(block)
    return head + MARKER + "\n" + "".join(rest)


def main() -> None:
    text = SITEMAP.read_text(encoding="utf-8")
    text = fix_malformed_lastmod(text)
    text = remove_pre_marker_course_dupes(text)
    text = remove_trailing_brain_gym_dupes(text)
    SITEMAP.write_text(text, encoding="utf-8")

    locs = re.findall(r"<loc>(.*?)</loc>", text)
    from collections import Counter

    dups = [u for u, n in Counter(locs).items() if n > 1]
    bad = [
        m
        for m in set(re.findall(r"<lastmod>(.*?)</lastmod>", text))
        if re.match(r"2026-02-01-\d", m)
    ]
    print(f"urls: {len(locs)} unique: {len(set(locs))} dups: {len(dups)} bad_dates: {len(bad)}")
    if dups:
        for u in dups[:10]:
            print("  dup:", u)


if __name__ == "__main__":
    main()
