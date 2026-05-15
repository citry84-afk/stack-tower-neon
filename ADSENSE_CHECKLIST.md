# Checklist AdSense — lipastudios.com

Sitio principal: **https://lipastudios.com** (Netlify `lipastudios`)

## Requisitos cumplidos

- [x] `privacy.html`, `terms.html`, `contact.html`, `about.html`, `editorial.html`, `disclaimer.html`
- [x] `help.html`, `news.html`, blog con artículos enlazados
- [x] `ads.txt` → `google.com, pub-4837743291717475`
- [x] `consent.js` — Consent Mode v2 + carga AdSense tras aceptar
- [x] `robots.txt` + `sitemap.xml` con arcade y minijuegos
- [x] Contenido editorial: guía plegable en home, entrenador, rutina 5 min, 40+ posts blog
- [x] Arcade funcional: 6 minijuegos + Stack Tower
- [x] Slots de anuncio en `index.html` (inferior), `jugar.html`, `entrenador-reflejos.html`
- [x] GA4 `G-5XL1W8RNTP` + eventos `lipa_game_start` / `lipa_game_complete`

## Antes de reaplicar en AdSense

1. En Search Console, verificar propiedad **lipastudios.com** sin errores críticos.
2. Solicitar indexación de: `/jugar.html`, `/toque-flash-neon.html`, `/esquiva-neon.html`, `/blog/reflejos-5-minutos.html`.
3. En AdSense → Sitios, usar solo **lipastudios.com** (no subdominios viejos de Beat/Runner).
4. Tras aprobar, revisar que los anuncios no tapen botones de juego en móvil.

## IndexNow

```bash
chmod +x scripts/ping-indexnow.sh && ./scripts/ping-indexnow.sh
```

## Analytics (retención por juego)

En GA4 → Informes → Exploraciones, usar eventos:

- `lipa_game_start` — inicios por `game_id`
- `lipa_game_complete` — partidas terminadas con `score`
- `lipa_arcade_view` — visitas al hub `/jugar.html`

El panel **Tu progreso** en `/jugar.html` muestra qué minijuegos jugaste esta semana (local).
