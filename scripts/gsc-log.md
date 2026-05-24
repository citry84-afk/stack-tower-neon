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
| **2026-05-22 (5)** | **2ª tanda (7 URLs):** solicitadas OK → `primaria/5-primaria`, `infantil/3-anos`, `primaria/2-primaria`, `eso/2-eso`. Ya indexadas → `infantil/4-anos`, `blog/refuerzo-escolar-7-minutos-brain-gym.html`. Error GSC → `primaria/3-primaria` (reintentar). Informe sigue en **21 indexadas** (GSC tarda en actualizar). |
| **2026-05-22 (6)** | Mejora SEO: enlaces internos funnel en home, cursos, landings (11), entrenador-cerebro, unidad. IndexNow OK. Nueva tanda GSC preparada (10 URLs). |
| **2026-05-19** | **Push `1aff390`** (enlaces internos). IndexNow OK (200). **Batch GSC bloqueado:** cuota superada al solicitar `primaria/3-primaria` («Google no reconoce esta URL»). Reintentar mañana las 10 URLs de `gsc-priority-urls.txt`. |
| **2026-05-19 (2)** | Reintento batch: inspección `entrenador-cerebro.html` → «no reconoce URL»; **cuota superada** al solicitar. **Sitemap** `sitemap.xml` reenviado en GSC. **IndexNow** 10 URLs prioridad → HTTP 200. Informe Páginas: **21 indexadas**, **87 sin indexar** (sin cambio aún). URLs live OK (200). |
| **2026-05-20** | **Batch 10 URLs OK parcial.** IndexNow 10 URLs → HTTP 200. **Ya indexadas:** `primaria/1-primaria`, `guia-reflejos.html`. **Solicitadas OK:** `primaria/6-primaria`, `infantil/5-anos`, `about.html`, `blog/calculo-mental-5-minutos.html`, `entrenador-cerebro.html`. **Error GSC:** `eso/1-eso`, `blog/gym-cerebro-reflejos-mates.html`. **Pendiente:** `primaria/3-primaria` (modal colgado). Informe sigue **21/87** (GSC tarda días). |
| **2026-05-21** | IndexNow tanda actual OK (200). Inspección `cursos.html` → **ya indexada**. `para-padres` en curso. **GSC:** sesión cerrada en navegador automático → requiere login manual `lipastudios4@gmail.com` para seguir batch. |

## Tanda pendiente (reintentos + siguiente)

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
