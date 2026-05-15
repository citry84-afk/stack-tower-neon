#!/usr/bin/env python3
"""Fourth batch: mobile, tests, adults, warmup, sports, eye-hand."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES: list[tuple[str, str, str]] = [
    (
        "blog/reflejos-movil-juegos-rapidos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Entrenar reflejos en movil es ideal si tienes poco tiempo. Usa juegos rapidos y sesiones cortas.</p>
      <div class="card">
        <h3>Rutina recomendada</h3>
        <ol>
          <li>2 min de calentamiento.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test rapido.</li>
        </ol>
      </div>
      <h2>Consejo de rendimiento</h2>
      <p>Si tu movil es basico, consulta la <a href="/moviles-gaming-baratos.html" style="color:#00ffee;">guia de moviles gaming baratos</a>.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>El móvil añade variables: tamaño de pantalla, latencia táctil y postura del cuello. Entrenar reflejos ahí es válido si reduces distracciones (notificaciones off) y mantienes el pulgar o el índice en un ángulo cómodo.</p>

      <div class="card">
        <h3>Rutina recomendada</h3>
        <ol>
          <li><strong>2 min calentamiento:</strong> rotar muñeca y mirar a lo lejos dos veces por minuto.</li>
          <li><strong>6 min bloque principal:</strong> partidas cortas en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>; si fatigas, pausa 60 s.</li>
          <li><strong>2 min evaluación:</strong> ¿errores por pulsar demasiado pronto o tarde?</li>
        </ol>
      </div>

      <h2>Rendimiento del dispositivo</h2>
      <p>Si tu móvil es básico, cierra apps en segundo plano y revisa la guía de <a href="/moviles-gaming-baratos.html" style="color:#00ffee;">móviles gaming baratos</a> y <a href="/blog/gaming-movil-optimizacion-dispositivos.html" style="color:#00ffee;">optimización</a>.</p>

      <h2>Más lectura</h2>
      <p><a href="/blog/tiempo-reaccion-movil.html" style="color:#00ffee;">Tiempo de reacción en móvil</a></p>""",
    ),
    (
        "blog/test-rapido-reaccion.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Un test rapido ayuda a medir tu reaccion y ver progreso semana a semana.</p>
      <div class="card">
        <h3>Pasos del test</h3>
        <ol>
          <li>Haz 5 partidas cortas.</li>
          <li>Registra tu mejor resultado.</li>
          <li>Repite cada semana.</li>
        </ol>
        <p>Usa <a href="/" style="color:#00ffee;">Stack Tower Neon</a> para medir timing y precision.</p>
      </div>
      <h2>Como mejorar</h2>
      <p>Aplica la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a> con rutina diaria.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 13 min lectura | 📝 LIPA Studios</div>
      <p>Un test rápido en casa no sustituye instrumentos de laboratorio, pero sí sirve para ver <strong>tendencias</strong> si mantienes condiciones similares (mismo teléfono u ordenador, misma hora, misma duración de sueño aproximada).</p>

      <div class="card">
        <h3>Protocolo simple</h3>
        <ol>
          <li><strong>Cinco partidas cortas</strong> en lugar de una larga: reduce varianza por fatiga.</li>
          <li><strong>Anota mejor marca estable</strong>, no solo un outlier afortunado.</li>
          <li><strong>Repite cada 7 días</strong> y compara semanas, no horas consecutivas.</li>
        </ol>
        <p>Usa <a href="/" style="color:#00ffee;">Stack Tower Neon</a> como práctica de timing con feedback inmediato.</p>
      </div>

      <h2>Cómo mejorar lo medido</h2>
      <p>Combina el test con la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a>, sueño regular (<a href="/blog/sueno-reflejos-mejorar.html" style="color:#00ffee;">sueño y reflejos</a>) y calentamiento (<a href="/blog/calentamiento-reflejos-5-min.html" style="color:#00ffee;">calentamiento 5 min</a>).</p>

      <h2>Evita estos errores</h2>
      <p>Cambiar de monitor a móvil mid-week, jugar tras cafeína muy alta solo un día, o compararte con otra persona en otro hardware.</p>""",
    ),
    (
        "blog/mejorar-reflejos-adultos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>En adultos, la clave es constancia y sesiones cortas. Esta rutina funciona en 10-15 minutos diarios.</p>
      <div class="card">
        <h3>Rutina base</h3>
        <ol>
          <li>3 min de calentamiento visual.</li>
          <li>7 min de timing con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test rapido.</li>
        </ol>
      </div>
      <h2>Consejos practicos</h2>
      <ul>
        <li>Practica a la misma hora para crear habito.</li>
        <li>Evita la fatiga con descansos cortos.</li>
        <li>Complementa con la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a>.</li>
      </ul>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>La edad adulta trae más obligaciones y menos tiempo; por eso esta rutina prioriza regularidad sobre volumen. El objetivo es proteger articulaciones y vista mientras mantienes estímulos de timing.</p>

      <div class="card">
        <h3>Rutina base (12–15 minutos)</h3>
        <ol>
          <li><strong>3 min calentamiento visual y cuello.</strong></li>
          <li><strong>7 min timing</strong> con <a href="/" style="color:#00ffee;">Stack Tower Neon</a> en bloques de 2–3 min con pausa.</li>
          <li><strong>2 min test</strong> + nota mental del día.</li>
        </ol>
      </div>

      <h2>Consejos prácticos</h2>
      <ul>
        <li>Ancla la práctica a un hábito existente (tras café, antes de noticias, etc.).</li>
        <li>Si fatigas vista, reduce brillo y revisa <a href="/blog/postura-reflejos.html" style="color:#00ffee;">postura</a>.</li>
        <li>Amplía contexto con la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a> y <a href="/blog/reflejos-edad.html" style="color:#00ffee;">reflejos y edad</a>.</li>
      </ul>""",
    ),
    (
        "blog/calentamiento-reflejos-5-min.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Un calentamiento corto mejora timing y precision desde la primera partida.</p>
      <div class="card">
        <h3>Rutina de 5 minutos</h3>
        <ol>
          <li>1 min de reaccion visual.</li>
          <li>3 min en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>1 min de respiracion y focus.</li>
        </ol>
        <p>Apunta tu mejor tiempo para comparar semana a semana.</p>
      </div>
      <h2>Tip extra</h2>
      <p>Si juegas FPS, combina este calentamiento con una rutina de <a href="/blog/reflejos-fps-aim.html" style="color:#00ffee;">aim y reflejos</a>.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>El calentamiento existe para reducir errores tempranos: cuando vas “frío”, sueles compensar con tensión extra y clicks impulsivos. Cinco minutos bastan si los repartes bien.</p>

      <div class="card">
        <h3>Rutina de 5 minutos</h3>
        <ol>
          <li><strong>1 min reacción visual:</strong> cambios de foco y parpadeos lentos.</li>
          <li><strong>3 min Stack Tower Neon:</strong> ritmo medio, sin perseguir récord.</li>
          <li><strong>1 min respiración:</strong> exhala más largo que inhalas para bajar activation.</li>
        </ol>
        <p>Anota tu sensación de precisión en la primera partida “seria” tras calentar.</p>
      </div>

      <h2>Tip extra</h2>
      <p>Para FPS, encadena con la guía de <a href="/blog/reflejos-fps-aim.html" style="color:#00ffee;">aim y reflejos</a>. Para sesiones largas, programa <a href="/blog/pausas-activas-reflejos.html" style="color:#00ffee;">pausas activas</a>.</p>""",
    ),
    (
        "blog/reflejos-deportes.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 6 min lectura</div>
      <p>Mejorar reflejos en deporte requiere rutina corta y consistente. Aqui tienes un plan simple.</p>
      <h2>Rutina diaria</h2>
      <div class="card">
        <h3>10 minutos al dia</h3>
        <ol>
          <li>3 min de reaccion visual.</li>
          <li>5 min de timing preciso con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test rapido de progreso.</li>
        </ol>
      </div>
      <h2>Consejos practicos</h2>
      <ul>
        <li>Usa entrenamientos cortos antes de tu sesion deportiva.</li>
        <li>Evita fatiga: menos es mas.</li>
        <li>Combina con la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a>.</li>
      </ul>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 13 min lectura | 📝 LIPA Studios</div>
      <p>En deportes de invasión o raqueta, el tiempo de reacción se mezcla con lectura táctica. El trabajo digital con <a href="/" style="color:#00ffee;">Stack Tower Neon</a> no sustituye la práctica específica del deporte, pero sí mantiene coordinación ojo-mano cuando no puedes estar en cancha.</p>

      <h2>Rutina diaria complementaria</h2>
      <div class="card">
        <h3>10 minutos al día (fuera del deporte específico)</h3>
        <ol>
          <li><strong>3 min</strong> estimulación visual y cambios de foco.</li>
          <li><strong>5 min</strong> timing preciso con Stack Tower Neon.</li>
          <li><strong>2 min</strong> autoevaluación: ¿fatiga o falta de lectura del estímulo?</li>
        </ol>
      </div>

      <h2>Consejos prácticos</h2>
      <ul>
        <li>Haz este bloque antes del entreno si necesitas “despertar” coordinación; evita llegar agotado por exceso de pantalla.</li>
        <li>Menos volumen y más calidad cuando ya entrenaste físico intenso.</li>
        <li>Integra la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a> y revisa <a href="/blog/coordination-ojo-mano.html" style="color:#00ffee;">coordinación ojo-mano</a>.</li>
      </ul>""",
    ),
    (
        "blog/coordination-ojo-mano.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 6 min lectura</div>

      <p>
        La coordinacion ojo-mano es clave para precision y reflejos. Con ejercicios simples y juegos
        de timing puedes mejorar en poco tiempo.
      </p>

      <h2>Ejercicios recomendados</h2>
      <div class="card">
        <h3>1) Seguimiento visual</h3>
        <p>Sigue objetos en movimiento y reacciona a cambios de color.</p>

        <h3>2) Timing preciso</h3>
        <p>Juega a <a href="/" style="color:#00ffee;">Stack Tower Neon</a> buscando apilados perfectos.</p>

        <h3>3) Rutina diaria</h3>
        <p>15 minutos al dia, 5 dias por semana.</p>
      </div>

      <h2>Combina con entrenamiento de reflejos</h2>
      <p>
        Usa la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a> para estructurar tu rutina
        y medir progreso.
      </p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 14 min lectura | 📝 LIPA Studios</div>

      <p>
        La coordinación ojo-mano une lo que ves con el gesto que ejecutas. En gaming y en deporte, los errores no siempre son “lentitud”: muchas veces son desajustes finos entre lectura del estímulo y movimiento. Por eso combinamos seguimiento visual, práctica con feedback inmediato y descansos cortos.
      </p>

      <h2>Ejercicios recomendados</h2>
      <div class="card">
        <h3>1) Seguimiento visual</h3>
        <p>Prueba seguir un objeto en movimiento suave (incluso el dedo a 40 cm) y cambiar ritmo; busca suavidad, no tensión cervical.</p>

        <h3>2) Timing preciso</h3>
        <p>En <a href="/" style="color:#00ffee;">Stack Tower Neon</a> prioriza apilados limpios antes que velocidad; la precisión forzada educa el punto de activación.</p>

        <h3>3) Rutina semanal</h3>
        <p>Cinco días con 12–15 minutos suelen rendir mejor que dos maratones; registra sensación de control, no solo puntos.</p>
      </div>

      <h2>Combina con entrenamiento de reflejos</h2>
      <p>
        Estructura la semana con la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a>, refuerza con <a href="/blog/ejercicios-reaccion-visual.html" style="color:#00ffee;">reacción visual</a> y revisa la <a href="/editorial.html" style="color:#00ffee;">política editorial</a> si quieres saber cómo actualizamos contenidos.
      </p>""",
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
