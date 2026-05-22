# Registro GSC — lipastudios.com

Cuenta: **lipastudios4@gmail.com** (`/u/1/search-console`)  
Propiedad: `https://lipastudios.com/`

## Intentos de «Solicitar indexación»

| Fecha | Resultado |
|-------|-----------|
| 2026-05-22 | Cuota superada (mi-rutina-cerebro; prueba en vivo OK) |
| 2026-05-22 (2) | Sitemap reenviado OK |
| **Hoy (reintento)** | **Cuota superada** otra vez en `mi-rutina-cerebro.html` |
| 2026-05-22 (3) | IndexNow ping OK (200). Informe: **21 indexadas**, **87 sin indexar**. Inspección: `retos-rapidos`, `mi-rutina-cerebro` → «Google no reconoce esta URL»; «Solicitar indexación» bloqueada por modal de carga / cuota |
| **2026-05-22 (4)** | **Batch OK parcial:** `mi-rutina-cerebro` ✓ solicitada, `retos-rapidos` ✓ ya indexada, `unidad` ✓ solicitada. `primaria/5-primaria` → error GSC al solicitar; resto pendiente (cuota/error). Motivos 87 sin indexar documentados en `gsc-non-indexed-reasons.md`. |

## Tanda pendiente (10 URLs)

Ver `scripts/gsc-priority-urls.txt` — sección «Tanda pendiente».

## Motivos «Sin indexar» (87)

Ver desglose en `scripts/gsc-non-indexed-reasons.md` (canónica 54, rastreada no indexada 21, redirección 7, duplicada sin canónica 5).

## Cuando la cuota vuelva

1. Abrir GSC → Inspección de URLs.
2. Por cada URL: pegar → Enter → **Solicitar indexación** (sin «Probar URL» si la cuota es justa).
3. Si aparece «La solicitud de indexación se ha enviado correctamente», pasar a la siguiente.
4. Máximo 10/día.

## Alternativas sin cuota

- `./scripts/ping-indexnow.sh`
- Sitemaps → enviar `sitemap.xml` (no gasta cuota de inspección)
