# Checklist AdSense — lipastudios.com

Sitio principal: **https://lipastudios.com** (Netlify). Producto editorial: **LIPA Brain Gym** (refuerzo escolar LOMLOE).

## Requisitos cumplidos

- [x] Páginas legales y confianza: `about.html`, `contact.html`, `privacy.html`, `terms.html`, `help.html`, `editorial.html`, `disclaimer.html`
- [x] `ads.txt` → `google.com, pub-4837743291717475`
- [x] `consent.js` — Consent Mode v2 + AdSense tras consentimiento
- [x] `robots.txt` + `sitemap.xml` (arcade, blog, **11 landings de curso**, sin páginas materia `noindex`)
- [x] Contenido útil indexable: home con guía Brain Gym plegable, `cursos.html` (~500 palabras), 11 landings `/primaria/…`, `/infantil/…`, `/eso/…`, blog 40+ artículos con autor y CTA a Cursos
- [x] `robots.txt` bloquea landings materia `noindex` y `reto-rapido.html`
- [x] `curso.html` y `materia.html` con texto estático + OG/schema (no solo shell JS)
- [x] Slots de anuncio: `index.html`, `cursos.html`, `gym-cerebro.html`, `para-padres.html`, `entrenador-cerebro.html`, `recreo-neon.html`, `entrenador-reflejos.html`
- [x] `retos-rapidos.html`, `unidad.html` con copy estático; `reto-rapido.html` en `noindex` (URL dinámica)
- [x] GA4 `G-5XL1W8RNTP`
- [x] `jugar.html` eliminado → redirige a `recreo-neon.html` (hub arcade)

## Antes de reaplicar en AdSense

1. **Search Console** (`lipastudios4@gmail.com`): sin errores críticos; sitemap enviado.
2. ~~Esperar **15–20 URLs indexadas**~~ → **21 indexadas** en GSC (22 may 2026). Siguiente: que entren landings clave del funnel (`mi-rutina-cerebro`, `retos-rapidos`, `unidad`, landings curso).
3. Cuota GSC: máx. ~10 «Solicitar indexación»/día — lista en `scripts/gsc-priority-urls.txt`.
4. En AdSense → Sitios, solo **lipastudios.com** (sin dominios viejos).
5. Revisar en móvil que los anuncios no tapen botones de juego ni la ruta guiada.

## URLs prioritarias para indexación (GSC)

Ver `scripts/gsc-priority-urls.txt`. Incluye landings Infantil/Primaria/ESO y páginas núcleo Brain Gym.

## IndexNow

```bash
chmod +x scripts/ping-indexnow.sh && ./scripts/ping-indexnow.sh
```

O: `python3 scripts/submit-indexnow.py` (si SSL local falla, usar curl del README).

## Cuándo pedir revisión

Tras el último deploy con landings + home Brain Gym: esperar **2–3 días**, comprobar indexación en GSC, luego **Sitios → Solicitar revisión** en AdSense citando refuerzo escolar y páginas legales.
