#!/usr/bin/env python3
"""Replace legacy <nav class="nav-content"> with shared site-nav + strip duplicate nav CSS."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("/Users/papi/stack-tower-neon")

NAV_REPLACEMENT = """    <nav class="site-nav" role="navigation" aria-label="Navegación principal">
        <div class="site-nav__inner">
            <div class="site-nav__top">
                <a class="site-nav__brand" href="/" aria-label="LIPA Studios - Inicio">🎮 LIPA Studios</a>
                <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Abrir menú de navegación">
                    <span class="nav-toggle__icon" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </span>
                    Menú
                </button>
            </div>
            <div id="primary-nav" class="nav-links">
                <a href="/">Inicio</a>
                <a href="/juegos-de-reflejos.html">Juegos</a>
                <a href="/top-juegos-reflejos.html">Top Reflejos</a>
                <a href="/moviles-gaming-baratos.html">Guías</a>
                <a href="/blog.html">Blog</a>
                <a href="/entrenador-reflejos.html">Entrenador</a>
                <a href="/help.html">Ayuda</a>
                <a href="/about.html">Sobre el proyecto</a>
            </div>
        </div>
        <div class="nav-backdrop" id="nav-backdrop" aria-hidden="true"></div>
    </nav>
    <script src="/js/site-nav.js" defer></script>"""

LINK_TAG = '  <link rel="stylesheet" href="/css/site-nav.css">\n'

# Loosened: <nav optional attrs> ... </nav> first occurrence in body
NAV_BLOCK = re.compile(
    r"<nav(?:\s[^>]*)?>\s*<div\s+class=\"nav-content\"[^>]*>[\s\S]*?</nav>",
    re.IGNORECASE,
)

# Remove common inline nav rules (non-greedy single-brace)
STRIP_PATTERNS = [
    re.compile(r"\s*nav\s+a:hover\s*\{[^}]*\}\s*"),
    re.compile(r"\s*nav\s+\.logo\s*\{[^}]*\}\s*"),
    re.compile(r"\s*nav\s+a\s*\{[^}]*\}\s*"),
    re.compile(r"\s*nav\s+\.nav-content\s*\{[^}]*\}\s*"),
    re.compile(r"\s*nav\s*\{[^}]*\}\s*"),
]


def ensure_css_link(html: str) -> str:
    if "href=\"/css/site-nav.css\"" in html or "href='/css/site-nav.css'" in html:
        return html
    # After <head> or before </head>
    if "</head>" in html:
        return html.replace("</head>", LINK_TAG + "</head>", 1)
    return html


def strip_nav_css(html: str) -> str:
    for pat in STRIP_PATTERNS:
        html = pat.sub("\n", html)
    return html


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "nav-content" not in text and "class=\"nav-content\"" not in text:
        return False
    new_text, n = NAV_BLOCK.subn(NAV_REPLACEMENT, text, count=1)
    if n == 0:
        return False
    new_text = ensure_css_link(new_text)
    new_text = strip_nav_css(new_text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def inject_after_body(path: Path) -> bool:
    """Insert global nav after <body> when first child is <div class=\"wrap\"> and nav not present."""
    if not path.is_file():
        return False
    text = path.read_text(encoding="utf-8", errors="replace")
    if "site-nav" in text and "primary-nav" in text:
        return False
    marker = "<body>\n  <div class=\"wrap\">"
    if marker not in text:
        return False
    ins = NAV_REPLACEMENT + "\n  "
    text = text.replace(marker, "<body>\n" + ins + "  <div class=\"wrap\">", 1)
    text = ensure_css_link(text)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    changed: list[Path] = []
    for path in list(ROOT.glob("blog/*.html")) + [ROOT / "blog.html", ROOT / "help.html"]:
        if path.is_file() and process_file(path):
            changed.append(path)
    extra_pages = [
        "juegos-de-reflejos.html",
        "top-juegos-reflejos.html",
        "entrenador-reflejos.html",
        "guia-reflejos.html",
        "moviles-gaming-baratos.html",
        "moviles-gamers-baratos.html",
        "about.html",
        "contact.html",
        "news.html",
        "privacy.html",
        "terms.html",
        "editorial.html",
        "disclaimer.html",
        "404.html",
    ]
    injected = 0
    for name in extra_pages:
        if inject_after_body(ROOT / name):
            injected += 1
            print("inject:", name)

    print("Updated", len(changed), "blog/help files; injected", injected, "extra pages")
    for p in changed[:20]:
        print(" ", p.relative_to(ROOT))
    if len(changed) > 20:
        print(" ...")


if __name__ == "__main__":
    main()
