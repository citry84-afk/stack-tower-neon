#!/usr/bin/env python3
"""Añade tema claro Brain Gym a páginas de juego."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = ["neon-*.html", "tablas-relampago.html", "test-reflejos.html", "toque-flash-neon.html"]
DS_LINK = '<link rel="stylesheet" href="/css/brain-design-system.css?v=2">'
THEME = '#2ed3a6'


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    if "brain-design-system.css" not in text:
        if 'href="/css/brain-gym.css"' in text:
            text = text.replace(
                '<link rel="stylesheet" href="/css/brain-gym.css">',
                '<link rel="stylesheet" href="/css/brain-gym.css">\n  ' + DS_LINK,
                1,
            )
        elif 'href="/css/mini-games.css"' in text:
            text = text.replace(
                '<link rel="stylesheet" href="/css/mini-games.css">',
                '<link rel="stylesheet" href="/css/mini-games.css">\n  ' + DS_LINK,
                1,
            )

    text = re.sub(
        r'<meta name="theme-color" content="[^"]*">',
        f'<meta name="theme-color" content="{THEME}">',
        text,
        count=1,
    )

    if "lipa-brain-soft" not in text and "game-page" in text:
        text = re.sub(
            r'(<body class="[^"]*)\blipa-page\b([^"]*game-page[^"]*")',
            r"\1lipa-page lipa-brain-soft\2",
            text,
            count=1,
        )

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    changed = []
    for pat in PATTERNS:
        for path in sorted(ROOT.glob(pat)):
            if patch_file(path):
                changed.append(path.name)
    print("Updated:", len(changed), "files")
    for name in changed:
        print(" ", name)


if __name__ == "__main__":
    main()
