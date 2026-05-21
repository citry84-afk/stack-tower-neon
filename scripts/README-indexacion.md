# Indexación y Search Console

## Automatizado (ejecutar tras cada deploy GSC)

```bash
python3 scripts/fix-sitemap.py
python3 scripts/validate-sitemap-live.py
python3 scripts/submit-indexnow.py
netlify deploy --prod
```

- **fix-sitemap.py** — fechas malformadas (`2026-02-01-23…`) y 29-feb en años no bisiestos.
- **validate-sitemap-live.py** — HEAD/GET a cada URL del sitemap en producción (debe ser 200).
- **submit-indexnow.py** — avisa a Bing/IndexNow de URLs prioritarias.

## Solo manual en GSC (tu sesión de Google)

La cuenta del agente/navegador de Cursor **no** tiene acceso a la propiedad. Tú, con la cuenta verificada:

1. [Search Console](https://search.google.com/search-console) → `lipastudios.com` (dominio o prefijo `https://lipastudios.com/`).
2. **Sitemaps** → borrar entrada rota si existe → añadir `https://lipastudios.com/sitemap.xml` → Enviar.
3. **Inspección de URLs** → hasta ~10/día: lista en `scripts/gsc-priority-urls.txt` → **Solicitar indexación**.

## Sitemap actual

~86 URLs indexables (11 landings Brain Gym, sin las 55 materias `noindex`).
`robots.txt` declara `Sitemap: https://lipastudios.com/sitemap.xml`.
`www` redirige 301 a apex (correcto para GSC).
