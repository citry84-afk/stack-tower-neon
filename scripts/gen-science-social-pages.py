#!/usr/bin/env python3
"""Genera páginas HTML de Naturales y Sociales."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = [
    {
        "file": "neon-vida.html",
        "title": "Neon Vida | Seres vivos · Naturales",
        "desc": "Clasifica animales y plantas en 30 segundos. Naturales 1º–3º Primaria.",
        "theme": "#22c55e",
        "subject": "Naturales",
        "eyebrow": "brain-eyebrow--science",
        "body_class": "game-page--science",
        "btn": "btn--science",
        "pill": "brain-level-pill--science",
        "prefix": "naturales",
        "mode_attr": "data-naturales-mode",
        "activity_attr": "data-naturales-activity",
        "mode": "clasifica",
        "activity": "neon-vida",
        "h1": "Neon Vida",
        "lead": "¿Animal o planta? Clasifica seres vivos.",
        "bank": "lipa-naturales-bank.js",
        "engine": "neon-naturales.js",
        "links": [
            ("/neon-cuerpo.html", "Neon Cuerpo"),
            ("/neon-planeta.html", "Neon Planeta"),
            ("/materia.html?c=primaria-1&m=naturales", "Unidades 1º"),
        ],
    },
    {
        "file": "neon-cuerpo.html",
        "title": "Neon Cuerpo | Cuerpo y salud · Naturales",
        "desc": "Preguntas de ciencias sobre el cuerpo y los sentidos.",
        "theme": "#22c55e",
        "subject": "Naturales",
        "eyebrow": "brain-eyebrow--science",
        "body_class": "game-page--science",
        "btn": "btn--science",
        "pill": "brain-level-pill--science",
        "prefix": "naturales",
        "mode_attr": "data-naturales-mode",
        "activity_attr": "data-naturales-activity",
        "mode": "ciencia",
        "activity": "neon-cuerpo",
        "h1": "Neon Cuerpo",
        "lead": "Cuerpo, sentidos y hábitos saludables.",
        "bank": "lipa-naturales-bank.js",
        "engine": "neon-naturales.js",
        "links": [
            ("/neon-vida.html", "Neon Vida"),
            ("/neon-planeta.html", "Neon Planeta"),
            ("/materia.html?c=primaria-1&m=naturales", "Unidades 1º"),
        ],
    },
    {
        "file": "neon-planeta.html",
        "title": "Neon Planeta | Materia y Tierra · Naturales",
        "desc": "Verdadero o falso sobre la naturaleza y el planeta.",
        "theme": "#22c55e",
        "subject": "Naturales",
        "eyebrow": "brain-eyebrow--science",
        "body_class": "game-page--science",
        "btn": "btn--science",
        "pill": "brain-level-pill--science",
        "prefix": "naturales",
        "mode_attr": "data-naturales-mode",
        "activity_attr": "data-naturales-activity",
        "mode": "verdad",
        "activity": "neon-planeta",
        "h1": "Neon Planeta",
        "lead": "¿Verdadero o falso? Ciencia del mundo.",
        "bank": "lipa-naturales-bank.js",
        "engine": "neon-naturales.js",
        "links": [
            ("/neon-vida.html", "Neon Vida"),
            ("/neon-cuerpo.html", "Neon Cuerpo"),
            ("/materia.html?c=primaria-1&m=naturales", "Unidades 1º"),
        ],
    },
    {
        "file": "neon-entorno.html",
        "title": "Neon Entorno | Mi entorno · Sociales",
        "desc": "Familia, colegio y convivencia. Sociales 1º–3º Primaria.",
        "theme": "#38bdf8",
        "subject": "Sociales",
        "eyebrow": "brain-eyebrow--social",
        "body_class": "game-page--social",
        "btn": "btn--social",
        "pill": "brain-level-pill--social",
        "prefix": "sociales",
        "mode_attr": "data-sociales-mode",
        "activity_attr": "data-sociales-activity",
        "mode": "elige",
        "activity": "neon-entorno",
        "h1": "Neon Entorno",
        "lead": "Familia, colegio y normas de convivencia.",
        "bank": "lipa-sociales-bank.js",
        "engine": "neon-sociales.js",
        "links": [
            ("/neon-mapa.html", "Neon Mapa"),
            ("/neon-historia.html", "Neon Historia"),
            ("/materia.html?c=primaria-1&m=sociales", "Unidades 1º"),
        ],
    },
    {
        "file": "neon-mapa.html",
        "title": "Neon Mapa | Mapas y lugares · Sociales",
        "desc": "Orientación, lugares y geografía sencilla.",
        "theme": "#38bdf8",
        "subject": "Sociales",
        "eyebrow": "brain-eyebrow--social",
        "body_class": "game-page--social",
        "btn": "btn--social",
        "pill": "brain-level-pill--social",
        "prefix": "sociales",
        "mode_attr": "data-sociales-mode",
        "activity_attr": "data-sociales-activity",
        "mode": "mapa",
        "activity": "neon-mapa",
        "h1": "Neon Mapa",
        "lead": "Mapas, lugares y paisaje.",
        "bank": "lipa-sociales-bank.js",
        "engine": "neon-sociales.js",
        "links": [
            ("/neon-entorno.html", "Neon Entorno"),
            ("/neon-historia.html", "Neon Historia"),
            ("/materia.html?c=primaria-1&m=sociales", "Unidades 1º"),
        ],
    },
    {
        "file": "neon-historia.html",
        "title": "Neon Historia | Tiempo e historia · Sociales",
        "desc": "Ordena frases sobre el tiempo y la historia cercana.",
        "theme": "#38bdf8",
        "subject": "Sociales",
        "eyebrow": "brain-eyebrow--social",
        "body_class": "game-page--social",
        "btn": "btn--social",
        "pill": "brain-level-pill--social",
        "prefix": "sociales",
        "mode_attr": "data-sociales-mode",
        "activity_attr": "data-sociales-activity",
        "mode": "ordena",
        "activity": "neon-historia",
        "h1": "Neon Historia",
        "lead": "Ordena palabras: tiempo e historia.",
        "bank": "lipa-sociales-bank.js",
        "engine": "neon-sociales.js",
        "links": [
            ("/neon-entorno.html", "Neon Entorno"),
            ("/neon-mapa.html", "Neon Mapa"),
            ("/materia.html?c=primaria-1&m=sociales", "Unidades 1º"),
        ],
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} · LIPA Brain Gym</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://lipastudios.com/{file}">
  <link rel="stylesheet" href="/css/lipa-ui.css">
  <link rel="stylesheet" href="/css/site-nav.css">
  <link rel="stylesheet" href="/css/mini-games.css">
  <link rel="stylesheet" href="/css/brain-gym.css">
  <meta name="theme-color" content="{theme}">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5XL1W8RNTP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-5XL1W8RNTP');
  </script>
  <script src="/consent.js"></script>
</head>
<body class="lipa-page game-page game-page--brain {body_class}" {mode_attr}="{mode}" {activity_attr}="{activity}">
  <nav class="site-nav" role="navigation" aria-label="Navegación principal">
    <div class="site-nav__inner">
      <div class="site-nav__top">
        <a class="site-nav__brand" href="/">LIPA Studios</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menú</button>
      </div>
      <div id="primary-nav" class="nav-links">
        <a href="/cursos.html">Cursos</a>
        <a href="/curso.html?c=primaria-1">1º Primaria</a>
        <a href="/{file}" aria-current="page">{h1}</a>
      </div>
    </div>
    <div class="nav-backdrop" id="nav-backdrop"></div>
  </nav>
  <script src="/js/site-nav.js" defer></script>

  <main class="wrap">
    <p class="brain-eyebrow {eyebrow}">LIPA Brain Gym · {subject}</p>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    <p id="{prefix}-brain-level" class="brain-level-pill {pill}" aria-live="polite">Nivel Brain 1</p>

    <div class="stats">
      <div class="stat"><span>Tiempo</span><strong id="{prefix}-timer">30 s</strong></div>
      <div class="stat"><span>Puntos</span><strong id="{prefix}-score">0</strong></div>
      <div class="stat"><span>Precisión</span><strong id="{prefix}-accuracy">100%</strong></div>
      <div class="stat"><span>Combo</span><strong id="{prefix}-combo">0</strong></div>
    </div>

    <div id="{prefix}-arena" class="{prefix}-arena math-arena" aria-live="polite">
      <div class="math-arena__inner">
        <p id="{prefix}-streak" class="math-streak" hidden>🔥 Combo <span id="{prefix}-streak-n">0</span></p>
        <p id="{prefix}-prompt" class="{prefix}-prompt">Pulsa empezar</p>
        <div id="{prefix}-work" class="{prefix}-work"></div>
      </div>
    </div>

    <div id="{prefix}-overlay" class="game-overlay" hidden>
      <p><strong>Fin de ronda</strong></p>
      <p>Puntos: <strong id="{prefix}-final-score">0</strong></p>
      <p>Precisión: <strong id="{prefix}-final-acc">0%</strong> · Mejor combo: <strong id="{prefix}-final-combo">0</strong></p>
      <label for="{prefix}-name" class="flash-name-label">Nombre (ranking)</label>
      <input type="text" id="{prefix}-name" class="flash-name-input" maxlength="15" placeholder="Tu nombre" autocomplete="nickname">
      <button type="button" class="btn btn--ghost" id="{prefix}-share">Compartir</button>
      <p style="margin-top:12px;font-size:14px;"><a href="/mi-evolucion.html">Mi evolución</a> · <a href="/cursos.html">Mis cursos</a></p>
    </div>

    <button type="button" class="btn {btn}" id="{prefix}-start">Empezar 30 s</button>

    <section class="card">
      <h2>Ranking de hoy</h2>
      <div id="{prefix}-leaderboard"></div>
    </section>

    <section class="card">
      <h2>Siguiente en {subject_lower}</h2>
      <div class="hub-links">
        {hub_links}
      </div>
    </section>
  </main>

  <script src="/js/lipa-daily.js"></script>
  <script src="/js/lipa-brain-catalog.js"></script>
  <script src="/js/lipa-brain-core.js"></script>
  <script src="/js/lipa-routine-flow.js"></script>
  <script src="/js/{bank}"></script>
  <script src="/js/lipa-analytics.js"></script>
  <script src="/js/{engine}"></script>
</body>
</html>
"""

def hub_links(links):
    return "\n        ".join(f'<a href="{u}">{t}</a>' for u, t in links)

def main():
    for p in PAGES:
        html = TEMPLATE.format(
            subject_lower=p["subject"].lower(),
            hub_links=hub_links(p["links"]),
            **p,
        )
        path = ROOT / p["file"]
        path.write_text(html, encoding="utf-8")
        print("wrote", path.name)

if __name__ == "__main__":
    main()
