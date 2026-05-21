#!/usr/bin/env python3
"""Añade CTA de Brain Gym / cursos a artículos del blog."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
MARKER = 'class="blog-brain-cta"'

CTA = """
    <div class="blog-brain-cta" style="margin:1.5rem 0;padding:1rem 1.15rem;border:1px solid rgba(46,211,166,.35);border-radius:12px;background:rgba(46,211,166,.08);">
      <p style="margin:0 0 8px;font-weight:600;">Refuerzo escolar LOMLOE (7 min al día)</p>
      <p style="margin:0;font-size:0.95rem;line-height:1.6;">
        <a href="/cursos.html">Elige curso</a> (Infantil, Primaria, ESO) ·
        <a href="/blog/refuerzo-escolar-7-minutos-brain-gym.html">Guía Brain Gym</a> ·
        <a href="/para-padres.html">Para padres</a>
      </p>
    </div>
"""


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text or "/cursos.html" in text:
        return False
    if "</aside>" in text and "blog-author" in text:
        text = text.replace("</aside>", f"</aside>{CTA}", 1)
    elif "</article>" in text:
        text = text.replace("</article>", f"{CTA}\n    </article>", 1)
    elif "<div class=\"wrap\">" in text:
        idx = text.rfind("</div>")
        if idx == -1:
            return False
        text = text[:idx] + CTA + "\n  " + text[idx:]
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
