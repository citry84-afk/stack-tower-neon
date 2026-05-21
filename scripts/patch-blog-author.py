#!/usr/bin/env python3
"""Añade bloque de autoría E-E-A-T a artículos del blog."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
MARKER = 'class="blog-author"'
CSS_LINK = '<link rel="stylesheet" href="/css/blog-author.css">'

AUTHOR_BLOCK = """
    <aside class="blog-author" aria-label="Sobre el autor">
      <p class="blog-author__label">Escrito y revisado por</p>
      <p><strong>Luis Alberto Moratalla</strong> · LIPA Studios</p>
      <p class="blog-author__bio">Creador de <a href="/gym-cerebro.html">LIPA Brain Gym</a> y <a href="/recreo-neon.html">Recreo Neon</a>. Artículos orientados a familias y refuerzo escolar en España (contenido informativo, no sustituye al profesorado).</p>
      <p class="blog-author__updated"><a href="/about.html">Sobre el proyecto</a> · <a href="/editorial.html">Política editorial</a> · <a href="/contact.html">Contacto</a></p>
    </aside>
"""


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False
    if CSS_LINK not in text and "</head>" in text:
        text = text.replace("</head>", f"  {CSS_LINK}\n</head>", 1)
    if "<article>" in text:
        text = text.replace("<article>", f"<article>{AUTHOR_BLOCK}", 1)
    elif "<div class=\"wrap\">" in text and "<h1" in text:
        idx = text.find("<h1")
        end = text.find("</h1>", idx)
        if end != -1:
            text = text[: end + 5] + AUTHOR_BLOCK + text[end + 5 :]
        else:
            return False
    else:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for path in sorted(BLOG.glob("*.html")):
        if patch_file(path):
            n += 1
            print("patched", path.name)
    print(f"done: {n} files updated")


if __name__ == "__main__":
    main()
