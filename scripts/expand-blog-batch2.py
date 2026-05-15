#!/usr/bin/env python3
"""Second batch: expand remaining thin blog posts."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES: list[tuple[str, str, str]] = [
    (
        "blog/reflejos-edad.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Los reflejos cambian con la edad, pero se pueden mejorar con rutina y practica.</p>
      <div class="card">
        <h3>Consejo principal</h3>
        <ol>
          <li>Practica diaria corta.</li>
          <li>Entrena timing con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>Registra progreso semanal.</li>
        </ol>
      </div>
      <h2>Rutina recomendada</h2>
      <p>10-15 minutos al dia durante 2 semanas.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>El tiempo de reacción no es una constante fija: cambia con la edad, el sueño, el estrés y el entrenamiento. Lo importante para el lector es separar lo inevitable de lo mejorable: hay aspectos biológicos y otros que responden a práctica constante con feedback.</p>
      <p>Este artículo evita prometer milagros: propone expectativas realistas y una rutina que puedes sostener semanas, no solo un fin de semana.</p>

      <h2>Qué suele cambiar con los años (idea general)</h2>
      <p>En términos generales, la velocidad pura de procesamiento puede moderarse, pero la <strong>calidad de la decisión</strong> y la <strong>consistencia</strong> siguen siendo entrenables. Muchos jugadores adultos compensan con lectura de patrones y menor impulsividad.</p>

      <div class="card">
        <h3>Plan base (10–15 minutos, 4–5 días/semana)</h3>
        <ol>
          <li><strong>Calentamiento visual breve</strong> para reducir rigidez antes de medir.</li>
          <li><strong>Bloque de timing</strong> con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>, priorizando precisión antes que récord.</li>
          <li><strong>Registro semanal simple</strong>: mejor sensación de aciertos o mejor puntuación estable, no solo picos aislados.</li>
        </ol>
      </div>

      <h2>Cómo integrarlo sin frustración</h2>
      <p>Evita compararte con clips de jugadores jóvenes sin contexto. Mejor compara tu semana actual con la anterior. Para una guía más amplia, enlaza con la <a href="/blog/mejorar-reflejos-guia-completa.html" style="color:#00ffee;">guía completa</a> y el <a href="/guia-reflejos.html" style="color:#00ffee;">plan de 7 días</a>.</p>

      <h2>Aviso</h2>
      <p>Síntomas neurológicos (mareos, pérdida de equilibrio, visión doble) no se abordan entrenando reflejos en casa: requieren valoración médica.</p>""",
    ),
    (
        "blog/tiempo-reaccion-promedio.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <div class="card">
        <h2>Tabla orientativa</h2>
        <table>
          <tr><th>Nivel</th><th>Descripcion</th></tr>
          <tr><td>Principiante</td><td>Necesita mejorar consistencia y precision.</td></tr>
          <tr><td>Intermedio</td><td>Reacciona bien con errores ocasionales.</td></tr>
          <tr><td>Avanzado</td><td>Alta precision y respuesta rapida.</td></tr>
        </table>
      </div>
      <h2>Como mejorar rapido</h2>
      <p>Entrena 10-15 minutos al dia con <a href="/" style="color:#00ffee;">Stack Tower Neon</a> y sigue la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a>.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 14 min lectura | 📝 LIPA Studios</div>
      <p>Los números “promedio” de tiempo de reacción que circulan en internet suelen mezclar tests distintos (simple vs. elección), hardware (latencia de pantalla) y población. Por eso este artículo no promete cifras médicas: usa una tabla orientativa por <strong>niveles de consistencia</strong> y te dice cómo medir mejor en casa.</p>

      <div class="card">
        <h2>Tabla orientativa (por consistencia, no por milisegundos exactos)</h2>
        <table style="width:100%; border-collapse:collapse; margin:12px 0;">
          <tr style="border-bottom:1px solid rgba(0,255,255,.4);"><th style="text-align:left;padding:8px;">Nivel</th><th style="text-align:left;padding:8px;">Qué suele observarse</th></tr>
          <tr><td style="padding:8px;">Principiante</td><td style="padding:8px;">Mucha variabilidad entre intentos; fallos por anticipación o lectura tardía del estímulo.</td></tr>
          <tr><td style="padding:8px;">Intermedio</td><td style="padding:8px;">Racha estable con errores puntuales; empieza a notar patrones de timing.</td></tr>
          <tr><td style="padding:8px;">Avanzado</td><td style="padding:8px;">Alta precisión y menos dispersión; el trabajo pasa de “reaccionar” a anticipar con control.</td></tr>
        </table>
      </div>

      <h2>Cómo medir en condiciones comparables</h2>
      <p>Usa siempre el mismo dispositivo, la misma hora aproximada y la misma duración de sesión. Si cambias de monitor a móvil, el resultado no será comparable. Para práctica con feedback inmediato, usa <a href="/" style="color:#00ffee;">Stack Tower Neon</a> y anota una métrica simple semanal (no cada minuto).</p>

      <h2>Cómo mejorar de forma realista</h2>
      <p>Diez a quince minutos diarios con foco valen más que una hora dispersa. Sigue una guía estructurada en <a href="/guia-reflejos.html" style="color:#00ffee;">plan de 7 días</a> y profundiza con la <a href="/blog/reflejos-rapidos-tecnicas-cientificas.html" style="color:#00ffee;">guía de técnicas y hábitos</a> si quieres más marco teórico.</p>

      <h2>FAQ</h2>
      <p><strong>¿Mi resultado es “malo”?</strong> Depende del test y del contexto. Lo útil es la tendencia en semanas, no un número aislado.</p>""",
    ),
    (
        "blog/reflejos-estudiantes.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Con poco tiempo puedes entrenar reflejos y mejorar tu reaccion con una rutina simple.</p>
      <div class="card">
        <h3>Rutina 10 minutos</h3>
        <ol>
          <li>2 min de calentamiento visual.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test rapido.</li>
        </ol>
      </div>
      <h2>Consejo clave</h2>
      <p>La clave es repetir a diario y registrar avances.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>Entre clases, trabajos y pantallas, muchos estudiantes buscan algo corto que no les robe el día pero sí mantenga el cerebro entrenado en timing y atención sostenida. Esta rutina cabe entre dos bloques de estudio y no requiere equipo especial.</p>

      <div class="card">
        <h3>Rutina de 10 minutos (enfoque examen / memorización)</h3>
        <ol>
          <li><strong>2 min calentamiento visual:</strong> parpadeos, mirada lejos/cerca; reduce sequedad ocular por lectura.</li>
          <li><strong>6 min timing activo:</strong> sesiones cortas en <a href="/" style="color:#00ffee;">Stack Tower Neon</a> buscando precisión, no récord fatigado.</li>
          <li><strong>2 min cierre:</strong> anota una sola línea: “¿fallé más por prisa o por llegar tarde?” para el día siguiente.</li>
        </ol>
      </div>

      <h2>Por qué encaja con rutina de estudio</h2>
      <p>Es micro-descanso activo: no sustituye deporte ni sueño, pero evita que la sesión de estudio sea solo sedentaria. Para el marco editorial del sitio, consulta la <a href="/editorial.html" style="color:#00ffee;">política editorial</a> y las <a href="/blog/pausas-activas-reflejos.html" style="color:#00ffee;">pausas activas</a>.</p>

      <h2>Consejo clave</h2>
      <p>La repetición diaria importa más que la intensidad puntual. Cinco días con 10 minutos suelen superar un solo día de 50 minutos.</p>""",
    ),
]

def main() -> None:
    missing = []
    applied = []
    for rel, old, new in PATCHES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        if old not in text:
            missing.append(rel)
            continue
        path.write_text(text.replace(old, new, 1), encoding="utf-8")
        applied.append(rel)
    print("Applied:", len(applied), applied)
    if missing:
        print("MISSING:", missing)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
