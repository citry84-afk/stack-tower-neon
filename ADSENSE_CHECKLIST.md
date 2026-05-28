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

## ads.txt en AdSense («No se encuentra»)

El archivo **sí está publicado**: [https://lipastudios.com/ads.txt](https://lipastudios.com/ads.txt)

```
google.com, pub-4837743291717475, DIRECT, f08c47fec0942fa0
```

Si en **Sitios** sigue en amarillo:

1. Comprueba que el sitio en AdSense es **`lipastudios.com`** (sin `www`, sin Netlify).
2. Tras el último deploy, espera **24–72 h**; la fecha «Última actualización» en AdSense a veces tarda en refrescarse.
3. Abre la fila del sitio → revisa de nuevo el estado de `ads.txt`.

## Código AdSense (`ca-pub-4837743291717475`)

El snippet oficial se inyecta desde **`/consent.js`** en todas las páginas que lo incluyen:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4837743291717475" crossorigin="anonymous"></script>
```

- El script se carga **siempre** (para que Google lo detecte).
- Los bloques `<ins class="adsbygoogle">` solo se rellenan si el usuario **acepta cookies** (Consent Mode v2).

## Cuándo pedir revisión

**Listo para pedir revisión** (21+ indexadas, deploy con funnel + blog). Pasos:

1. [AdSense](https://adsense.google.com) → **Sitios** → `lipastudios.com`
2. Si aparece «Contenido de poco valor» o «Preparando» → **Solicitar revisión**
3. Copiar/adaptar el texto de `scripts/adsense-revision-mensaje.txt` (español, breve)
4. Comprobar en móvil: anuncios no tapan botones de juego ni la ruta guiada

No hace falta esperar a 50 indexadas; puedes volver a solicitar si GSC sube a ~30 en una semana.
