#!/usr/bin/env python3
"""Genera landings por materia (noindex; canonical al curso)."""
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

_spec = importlib.util.spec_from_file_location(
    "generate_course_landings", ROOT / "scripts" / "generate-course-landings.py"
)
_gen = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_gen)
COURSE_COPY: dict[str, dict] = _gen.COURSE_COPY

SUBJECT_COPY_KEY = {
    "matematicas": "mates",
    "lenguaje": "lengua",
    "ingles": "ingles",
    "naturales": "naturales",
    "sociales": "sociales",
}
REDIRECTS_MARKER_START = "# SUBJECT LANDINGS (auto)"
REDIRECTS_MARKER_END = "# /SUBJECT LANDINGS"

COURSES = [
    {"id": "infantil-3", "slug": "infantil/3-anos", "label": "1º Infantil", "age": "3 años"},
    {"id": "infantil-4", "slug": "infantil/4-anos", "label": "2º Infantil", "age": "4 años"},
    {"id": "infantil-5", "slug": "infantil/5-anos", "label": "3º Infantil", "age": "5 años"},
    {"id": "primaria-1", "slug": "primaria/1-primaria", "label": "1º de Primaria", "age": "6 años"},
    {"id": "primaria-2", "slug": "primaria/2-primaria", "label": "2º de Primaria", "age": "7 años"},
    {"id": "primaria-3", "slug": "primaria/3-primaria", "label": "3º de Primaria", "age": "8 años"},
    {"id": "primaria-4", "slug": "primaria/4-primaria", "label": "4º de Primaria", "age": "9 años"},
    {"id": "primaria-5", "slug": "primaria/5-primaria", "label": "5º de Primaria", "age": "10 años"},
    {"id": "primaria-6", "slug": "primaria/6-primaria", "label": "6º de Primaria", "age": "11 años"},
    {"id": "eso-1", "slug": "eso/1-eso", "label": "1º de la ESO", "age": "12 años"},
    {"id": "eso-2", "slug": "eso/2-eso", "label": "2º de la ESO", "age": "13 años"},
]

SUBJECTS = [
    ("matematicas", "mates", "Matemáticas", "➕", "Números, operaciones y problemas del cole."),
    ("lenguaje", "lengua", "Lengua", "📖", "Lectura, ortografía y comprensión."),
    ("ingles", "ingles", "Inglés", "🇬🇧", "Vocabulario y frases en inglés."),
    ("naturales", "naturales", "Naturales", "🔬", "Cuerpo, seres vivos y ciencias."),
    ("sociales", "sociales", "Sociales", "🌍", "Mapas, historia y convivencia."),
]

SUBJECTS_BY_ID = {s[0]: s[2] for s in SUBJECTS}

NAV = """  <nav class="site-nav" role="navigation" aria-label="Navegación principal">
    <div class="site-nav__inner">
      <div class="site-nav__top">
        <a class="site-nav__brand" href="/">LIPA Studios</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menú</button>
      </div>
      <div id="primary-nav" class="nav-links">
        <a href="/">Brain Gym</a>
        <a href="/cursos.html">Cursos</a>
        <a href="/para-padres.html">Para padres</a>
        <a href="/recreo-neon.html">Recreo Neon</a>
      </div>
    </div>
    <div class="nav-backdrop" id="nav-backdrop"></div>
  </nav>
  <script src="/js/site-nav.js" defer></script>"""

FOOTER = """  <footer class="lipa-footer lipa-footer--site lipa-footer--compact">
    <nav class="lipa-footer__links" aria-label="Enlaces legales e información">
      <a href="/about.html">Sobre LIPA</a>
      <a href="/contact.html">Contacto</a>
      <a href="/privacy.html">Privacidad</a>
      <a href="/terms.html">Términos</a>
    </nav>
    <p class="lipa-footer__copy">© 2024–2026 LIPA Studios</p>
  </footer>"""


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def subject_bullets(course_id: str, sub_id: str) -> str:
    copy = COURSE_COPY.get(course_id, {})
    key = SUBJECT_COPY_KEY.get(sub_id, "")
    items = copy.get(key) if key else []
    if not items:
        return ""
    lis = "".join(f"<li>{esc(x)}</li>" for x in items)
    sub_label = SUBJECTS_BY_ID.get(sub_id, sub_id)
    return f"<h2>Qué practica en {esc(sub_label)}</h2><ul>{lis}</ul>"


def page(course: dict, sub_id: str, slug: str, label: str, emoji: str, blurb: str) -> str:
    path = f"/{course['slug']}/{slug}"
    course_canonical = f"https://lipastudios.com/{course['slug']}"
    title = f"{label} {course['label']} · refuerzo 7 min | LIPA Brain Gym"
    desc = f"{label} para {course['label']} ({course['age']}): {blurb} Acceso directo a la rutina guiada."
    play = f"/materia.html?c={course['id']}&m={sub_id}&empezar=1"
    course_path = f"/{course['slug']}"
    bullets_html = subject_bullets(course["id"], sub_id)
    bullets_block = f"\n      {bullets_html}\n" if bullets_html else ""
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="{course_canonical}">
  <link rel="stylesheet" href="/css/lipa-ui.css">
  <link rel="stylesheet" href="/css/site-nav.css">
  <link rel="stylesheet" href="/css/brain-gym.css?v=3">
  <link rel="stylesheet" href="/css/brain-design-system.css?v=3">
  <link rel="stylesheet" href="/css/course-landing.css">
  <meta name="theme-color" content="#2ed3a6">
</head>
<body class="lipa-page lipa-brain-soft">
{NAV}
  <main class="course-landing-main">
    <header class="course-landing-hero">
      <p class="brain-eyebrow"><a href="{course_path}" style="color:inherit;text-decoration:none;">{esc(course['label'])}</a> · {esc(course['age'])}</p>
      <h1>{emoji} {esc(label)} — {esc(course['label'])}</h1>
      <p>{esc(blurb)} Practica con Lipi en sesiones de 5–7 minutos: un botón y misión a misión.</p>
    </header>
    <article class="course-landing-article">
      <p>Esta página es un acceso rápido a <strong>{esc(label)}</strong> en {esc(course['label'])}. La guía completa del curso — contenidos LOMLOE, rutina semanal y preguntas frecuentes — está en <a href="{course_path}">la ficha de {esc(course['label'])}</a>.</p>
      <p>Recomendamos empezar por la rutina guiada del curso para alternar materias con equilibrio. Si hoy solo quieres {esc(label.lower())}, pulsa el botón de abajo.</p>{bullets_block}
      <p>Tras el entreno puedes usar <a href="/recreo-neon.html">Recreo Neon</a> como recompensa opcional. Las familias pueden revisar el progreso en <a href="/para-padres.html">Para padres</a>.</p>
    </article>
    <div class="course-landing-cta">
      <a href="{play}" class="lipa-btn lipa-btn--primary lipa-btn--lg">Empezar {esc(label)}</a>
      <a href="{course_path}" class="lipa-btn lipa-btn--secondary">Guía completa del curso</a>
    </div>
    <p class="course-landing-links">
      <a href="{course_path}">Volver a {esc(course['label'])}</a> ·
      <a href="/cursos.html">Todos los cursos</a> ·
      <a href="/">Brain Gym</a>
    </p>
  </main>
{FOOTER}
</body>
</html>
"""


def patch_redirects(redirect_lines: list[str]) -> None:
    path = ROOT / "_redirects"
    text = path.read_text(encoding="utf-8")
    block = REDIRECTS_MARKER_START + "\n" + "\n".join(redirect_lines) + "\n" + REDIRECTS_MARKER_END
    if REDIRECTS_MARKER_START in text:
        start = text.index(REDIRECTS_MARKER_START)
        end = text.index(REDIRECTS_MARKER_END) + len(REDIRECTS_MARKER_END)
        text = text[:start] + block + text[end:]
    else:
        text = text.rstrip() + "\n\n" + block + "\n"
    path.write_text(text, encoding="utf-8")


def main() -> None:
    redirect_lines: list[str] = []
    count = 0
    for course in COURSES:
        for sub_id, slug, label, emoji, blurb in SUBJECTS:
            out = ROOT / course["slug"] / f"{slug}.html"
            out.parent.mkdir(parents=True, exist_ok=True)
            html = page(course, sub_id, slug, label, emoji, blurb)
            if "motion" in html:
                raise SystemExit(f"motion tag leak in {out}")
            out.write_text(html, encoding="utf-8")
            count += 1
            pretty = f"/{course['slug']}/{slug}"
            redirect_lines.append(f"{pretty}  /{course['slug']}/{slug}.html  200")
            print("wrote", out.relative_to(ROOT))
    patch_redirects(redirect_lines)
    print(f"done: {count} subject landings (noindex), redirects patched")


if __name__ == "__main__":
    main()
