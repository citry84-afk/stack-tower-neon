# Indexación y Search Console

## Cuenta y propiedad

- Usar **lipastudios4@gmail.com** → [Search Console](https://search.google.com/search-console) (a veces `/u/1/`).
- Propiedad: prefijo de URL **`https://lipastudios.com/`** (verificación en `index.html`).

## Tras cada deploy (automático en repo)

```bash
python3 scripts/fix-sitemap.py
./scripts/ping-indexnow.sh
```

Opcional comprobar sitemap en vivo:

```bash
python3 scripts/validate-sitemap-live.py
```

## Manual en GSC (solo tú, ~10 URLs/día)

1. Entra en **Sitemaps** → confirma `sitemap.xml` en estado correcto (sin errores 404).
2. Abre **Inspección de URLs**.
3. Copia una URL de `scripts/gsc-priority-urls.txt` (sección «Tanda actual»).
4. Pega → **Probar URL publicada** → si OK, **Solicitar indexación**.
5. Repite hasta **10 solicitudes** o hasta mensaje de **cuota superada** (vuelve al día siguiente).
6. Cuando termines la tanda, descomenta la «Siguiente tanda» en el `.txt` y muévela arriba.

**Último estado (agente):** 2026-05-22 — cuota de «Solicitar indexación» agotada en `lipastudios4@gmail.com`. Se reenvió `sitemap.xml` en GSC y IndexNow. La URL `mi-rutina-cerebro.html` pasó prueba en vivo («La página se puede indexar») pero no se pudo encolar indexación manual.

### URLs ya priorizadas en deploys recientes

Home, `cursos.html`, `curso.html`, `materia.html`, `para-padres.html`, `gym-cerebro.html`, landings `4-primaria`, etc. — no hace falta repetirlas salvo que GSC diga «No indexada».

## Sitemap

~88 URLs indexables: 11 landings de curso, funnel Brain Gym, blog, arcade. **No** incluye las 55 páginas materia (`noindex`); `robots.txt` las bloquea al rastreo.

## AdSense

Cuando GSC muestre **15–20 URLs indexadas** (landings + cursos + para padres), espera 2–3 días y pide **revisión** en AdSense. Checklist: `ADSENSE_CHECKLIST.md`.
