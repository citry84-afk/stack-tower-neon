# Indexación: qué puede hacerse sin tu cuenta de Google

## Lo que **no** se puede automatizar sin ti

El botón **«Solicitar indexación»** de Search Console **solo existe en la interfaz web** con tu sesión de Google. No hay API pública equivalente para sitios HTML normales (solo inspección y envío de sitemaps con OAuth).

**Pasos manuales (~2 min):**

1. Entra en [Search Console](https://search.google.com/search-console) → propiedad `lipastudios.com`.
2. Barra superior: **Inspección de URLs**.
3. Pega cada URL y pulsa **Solicitar indexación**:
   - `https://lipastudios.com/`
   - `https://lipastudios.com/moviles-gaming-baratos.html`
   - `https://lipastudios.com/guia-reflejos.html`

## Lo que **sí** está automatizado en este repo

- **Sitemap** en `robots.txt` → Google rastrea cuando quiera.
- **IndexNow** (Bing y otros): clave en `a1bf3fb2f48c78dff2a3ed0cfdf42fec.txt` + script:

```bash
python3 scripts/submit-indexnow.py
```

Ejecutar tras cada deploy importante.
