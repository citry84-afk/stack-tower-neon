#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = [
    ("neon-peques.html", "neon-peques", "elige", "Neon Peques", "¿Qué es? Toca la palabra correcta.", "🐣"),
    ("neon-colores.html", "neon-colores", "color", "Neon Colores", "Aprende los colores con dibujos grandes.", "🎨"),
    ("neon-numeros.html", "neon-numeros", "cuenta", "Neon Números", "Cuenta los dibujos del 1 al 5.", "🔢"),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | Infantil · LIPA Brain Gym</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://lipastudios.com/{file}">
  <link rel="stylesheet" href="/css/lipa-ui.css">
  <link rel="stylesheet" href="/css/site-nav.css">
  <link rel="stylesheet" href="/css/mini-games.css">
  <link rel="stylesheet" href="/css/brain-gym.css">
  <meta name="theme-color" content="#f59e0b">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5XL1W8RNTP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-5XL1W8RNTP');
  </script>
  <script src="/consent.js"></script>
</head>
<body class="lipa-page game-page game-page--brain game-page--peques" data-peques-mode="{mode}" data-peques-activity="{activity}">
  <nav class="site-nav" role="navigation" aria-label="Navegación principal">
    <div class="site-nav__inner">
      <div class="site-nav__top">
        <a class="site-nav__brand" href="/">LIPA Studios</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menú</button>
      </div>
      <motion id="primary-nav" class="nav-links">
        <a href="/cursos.html">Cursos</a>
        <a href="/curso.html?c=infantil-4">Infantil</a>
        <a href="/{file}" aria-current="page">{title}</a>
      </div>
    </div>
    <div class="nav-backdrop" id="nav-backdrop"></div>
  </nav>
  <script src="/js/site-nav.js" defer></script>

  <main class="wrap">
    <p class="brain-eyebrow brain-eyebrow--peques">LIPA Brain Gym · Infantil {emoji}</p>
    <h1>{title}</h1>
    <p class="lead">{lead}</p>
    <p id="peques-brain-level" class="brain-level-pill brain-level-pill--peques" aria-live="polite">Nivel Brain 1</p>

    <div class="stats">
      <div class="stat"><span>Tiempo</span><strong id="peques-timer">30 s</strong></motion>
      <div class="stat"><span>Puntos</span><strong id="peques-score">0</strong></div>
      <div class="stat"><span>Precisión</span><strong id="peques-accuracy">100%</strong></div>
      <div class="stat"><span>Combo</span><strong id="peques-combo">0</strong></div>
    </div>

    <div id="peques-arena" class="peques-arena math-arena" aria-live="polite">
      <div class="math-arena__inner">
        <p id="peques-streak" class="math-streak" hidden>🔥 Combo <span id="peques-streak-n">0</span></p>
        <p id="peques-prompt" class="peques-prompt">Pulsa empezar</p>
        <div id="peques-work" class="peques-work"></div>
      </div>
    </div>

    <div id="peques-overlay" class="game-overlay" hidden>
      <p><strong>¡Muy bien!</strong></p>
      <p>Puntos: <strong id="peques-final-score">0</strong></p>
      <p>Precisión: <strong id="peques-final-acc">0%</strong> · Mejor combo: <strong id="peques-final-combo">0</strong></p>
      <label for="peques-name" class="flash-name-label">Nombre (ranking)</label>
      <input type="text" id="peques-name" class="flash-name-input" maxlength="15" placeholder="Tu nombre" autocomplete="nickname">
      <button type="button" class="btn btn--ghost" id="peques-share">Compartir</button>
      <p style="margin-top:12px;font-size:14px;"><a href="/mi-evolucion.html">Mi evolución</a> · <a href="/cursos.html">Mis cursos</a></p>
    </motion>

    <button type="button" class="btn btn--peques" id="peques-start">Empezar 30 s</button>

    <section class="card">
      <h2>Ranking de hoy</h2>
      <div id="peques-leaderboard"></div>
    </section>

    <section class="card">
      <h2>Más para peques</h2>
      <div class="hub-links">
        <a href="/neon-peques.html">Neon Peques</a>
        <a href="/neon-colores.html">Neon Colores</a>
        <a href="/neon-numeros.html">Neon Números</a>
        <a href="/toque-flash-neon.html">Flash Tap</a>
        <a href="/curso.html?c=infantil-4">Curso Infantil</a>
      </div>
    </section>
  </main>

  <script src="/js/lipa-daily.js"></script>
  <script src="/js/lipa-brain-catalog.js"></script>
  <script src="/js/lipa-brain-core.js"></script>
  <script src="/js/lipa-routine-flow.js"></script>
  <script src="/js/lipa-peques-bank.js"></script>
  <script src="/js/lipa-analytics.js"></script>
  <script src="/js/neon-peques.js"></script>
</body>
</html>
"""

for file, activity, mode, title, lead, emoji in PAGES:
    html = TEMPLATE.format(
        file=file,
        activity=activity,
        mode=mode,
        title=title,
        lead=lead,
        emoji=emoji,
        desc=lead + " Juego gratis para Infantil 3-5 años.",
    )
    html = html.replace("<motion ", "<div ").replace("</motion>", "</motion>")
    (ROOT / file).write_text(html, encoding="utf-8")
    print("wrote", file)
