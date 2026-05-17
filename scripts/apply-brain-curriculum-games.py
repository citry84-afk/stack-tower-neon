#!/usr/bin/env python3
"""Añade scripts de currículo + Lipi a páginas de juego Brain Gym."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
GLOBS = ["neon-*.html", "tablas-relampago.html", "test-reflejos.html", "toque-flash-neon.html"]

CURR_BLOCK = """
  <script src="/js/lipa-curriculum-meta.js"></script>
  <script src="/js/lipa-curriculum-build.js"></script>
  <script src="/js/lipa-curriculum-data.js"></script>
  <script src="/js/lipa-curriculum.js"></script>"""

SESSION = '  <script src="/js/lipa-curriculum-session.js"></script>'

MASCOT_BLOCK = """
  <script src="/js/lipa-mascot.js"></script>
  <script src="/js/lipa-game-feedback.js"></script>
  <script src="/js/lipa-game-hint.js"></script>"""


def patch(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    if "lipa-curriculum-session.js" not in text and "lipa-brain-core.js" in text:
        insert = CURR_BLOCK + "\n" + SESSION
        if "lipa-game-hint.js" in text:
            text = text.replace(
                '<script src="/js/lipa-game-hint.js"></script>',
                '<script src="/js/lipa-game-hint.js"></script>\n' + SESSION.strip(),
                1,
            )
            if "lipa-curriculum.js" not in text:
                text = text.replace(
                    '<script src="/js/lipa-brain-core.js"></script>',
                    CURR_BLOCK + "\n  <script src=\"/js/lipa-brain-core.js\"></script>",
                    1,
                )
        else:
            text = text.replace(
                '<script src="/js/lipa-brain-core.js"></script>',
                CURR_BLOCK + "\n" + SESSION + "\n  <script src=\"/js/lipa-brain-core.js\"></script>",
                1,
            )

    if "lipa-mascot.js" not in text and "game-page" in text:
        if "lipa-brain-core.js" in text:
            text = text.replace(
                '<script src="/js/lipa-brain-core.js"></script>',
                MASCOT_BLOCK + "\n  <script src=\"/js/lipa-brain-core.js\"></script>",
                1,
            )

    if "game-page--brain" not in text and "game-page" in text:
        text = text.replace(
            'class="lipa-page lipa-brain-soft game-page"',
            'class="lipa-page lipa-brain-soft game-page game-page--brain"',
            1,
        )

    if path.name == "test-reflejos.html":
        if "brain-design-system.css" not in text:
            text = text.replace(
                '<link rel="stylesheet" href="/css/lipa-ui.css">',
                '<link rel="stylesheet" href="/css/lipa-ui.css">\n'
                '  <link rel="stylesheet" href="/css/mini-games.css">\n'
                '  <link rel="stylesheet" href="/css/brain-gym.css">\n'
                '  <link rel="stylesheet" href="/css/brain-design-system.css?v=2">',
                1,
            )
        text = re.sub(
            r"<body([^>]*)>",
            '<body class="lipa-page lipa-brain-soft game-page game-page--brain"\\1>',
            text,
            count=1,
        )
        if 'class="lipa-page lipa-brain-soft game-page game-page--brain"' in text:
            text = text.replace(
                '<body class="lipa-page lipa-brain-soft game-page game-page--brain" class="lipa-page lipa-brain-soft game-page game-page--brain">',
                '<body class="lipa-page lipa-brain-soft game-page game-page--brain">',
            )
        # fix duplicate body class from regex on existing body
        text = re.sub(
            r'<body class="lipa-page lipa-brain-soft game-page game-page--brain"\s*>',
            '<body class="lipa-page lipa-brain-soft game-page game-page--brain">',
            text,
            count=1,
        )
        if "<body>" in text:
            text = text.replace(
                "<body>",
                '<body class="lipa-page lipa-brain-soft game-page game-page--brain">',
                1,
            )

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    changed = []
    for pat in GLOBS:
        for path in sorted(ROOT.glob(pat)):
            if patch(path):
                changed.append(path.name)
    print("Patched", len(changed), "files")
    for n in changed:
        print(" ", n)


if __name__ == "__main__":
    main()
