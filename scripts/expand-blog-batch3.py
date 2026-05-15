#!/usr/bin/env python3
"""Third batch: remaining thin blog expansions."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES: list[tuple[str, str, str]] = [
    (
        "blog/ejercicios-reflejos-sin-equipo.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Entrena reflejos sin equipo con ejercicios simples y una rutina diaria corta.</p>
      <div class="card">
        <h3>Rutina recomendada</h3>
        <ol>
          <li>2 min de reaccion visual.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test y registro.</li>
        </ol>
      </div>
      <h2>Consejo clave</h2>
      <p>La constancia diaria es la clave para mejorar reflejos.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>No necesitas gimnasio ni material caro para mantener el timing: buscas estímulos visuales claros, repetición y una métrica simple para no engañarte con sensaciones vagas. Esta rutina usa solo el navegador y el propio cuerpo para calentar vista y muñeca.</p>

      <h2>Qué entendemos por “sin equipo”</h2>
      <p>Sin bandas, sin pesas y sin sensores: solo postura estable, seguimiento visual y práctica de clic o toque preciso. Si tienes ratón de mala calidad o pantalla muy pequeña, el cuello importa más: revisa <a href="/blog/postura-reflejos.html" style="color:#00ffee;">postura y reflejos</a>.</p>

      <div class="card">
        <h3>Rutina recomendada (10 minutos)</h3>
        <ol>
          <li><strong>2 min reacción visual:</strong> alterna foco lejos/cerca; gira hombros suave.</li>
          <li><strong>6 min bloque principal:</strong> partidas cortas en <a href="/" style="color:#00ffee;">Stack Tower Neon</a> con objetivo de consistencia.</li>
          <li><strong>2 min registro:</strong> una nota breve del error dominante (anticipación vs. retardo).</li>
        </ol>
      </div>

      <h2>Consejo clave</h2>
      <p>La constancia diaria supera el esfuerzo heroico. Para ampliar fundamentos, enlaza con la <a href="/blog/mejorar-reflejos-guia-completa.html" style="color:#00ffee;">guía completa</a>.</p>""",
    ),
    (
        "blog/alimentacion-reflejos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>La alimentacion influye en tu energia, focus y velocidad de reaccion.</p>
      <div class="card">
        <h3>Alimentos que ayudan</h3>
        <ol>
          <li>Proteinas magras para energia estable.</li>
          <li>Frutas y vegetales para micronutrientes.</li>
          <li>Agua suficiente para evitar fatiga.</li>
        </ol>
      </div>
      <h2>Rutina simple</h2>
      <p>Combina buenos habitos con un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rapido de reaccion</a> para medir mejoras.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>La nutrición influye en energía estable y en la capacidad de mantener atención durante sesiones de práctica. Este texto es orientativo para público general y no sustituye plan dietético personalizado ni consejo médico.</p>

      <h2>Principios simples (sin “suplementos milagro”)</h2>
      <p>Prioriza comidas regulares, hidratación adecuada (<a href="/blog/hidratacion-reflejos.html" style="color:#00ffee;">hidratación y reflejos</a>) y evita picos fuertes de azúcar justo antes de entrenar timing, porque la somnolencia posterior puede distorsionar tus mediciones.</p>

      <div class="card">
        <h3>Ideas prácticas</h3>
        <ol>
          <li><strong>Proteína + carbohidrato complejo</strong> en comidas previas a sesiones largas de estudio o gaming.</li>
          <li><strong>Fruta y verdura</strong> como base de micronutrientes en la semana.</li>
          <li><strong>Agua</strong> repartida; la deshidratación leve ya afecta concentración.</li>
        </ol>
      </div>

      <h2>Rutina simple de seguimiento</h2>
      <p>Combina hábitos con un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rápido de reacción</a> semanal bajo las mismas condiciones (misma hora, mismo dispositivo).</p>

      <h2>Aviso</h2>
      <p>Patologías metabólicas o restricciones dietéticas deben tratarse con profesional sanitario.</p>""",
    ),
    (
        "blog/ejercicios-reflejos-rapidos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Estos ejercicios rápidos te ayudan a mejorar reflejos con sesiones cortas y consistentes.</p>
      <div class="card">
        <h3>Rutina en 10 minutos</h3>
        <ol>
          <li>2 min de calentamiento visual.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test rapido.</li>
        </ol>
      </div>
      <h2>Consejo clave</h2>
      <p>La clave es repetir a diario. Complementa con la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a>.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>Los ejercicios “rápidos” funcionan cuando tienen estructura: calentamiento mínimo, bloque de práctica con feedback inmediato y cierre con una observación concreta. Así evitas repetir errores sin darte cuenta.</p>

      <div class="card">
        <h3>Rutina en 10 minutos</h3>
        <ol>
          <li><strong>2 min calentamiento visual:</strong> reduce rigidez antes de exigir precisión.</li>
          <li><strong>6 min práctica:</strong> sesiones en <a href="/" style="color:#00ffee;">Stack Tower Neon</a> enfocadas en ritmo estable.</li>
          <li><strong>2 min evaluación:</strong> qué patrón de fallo predominó.</li>
        </ol>
      </div>

      <h2>Consejo clave</h2>
      <p>Repite a diario y usa la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a> como columna vertebral si quieres un plan de varios días.</p>

      <h2>Relacionados</h2>
      <p>Para variar estímulos, alterna con <a href="/blog/ejercicios-reaccion-visual.html" style="color:#00ffee;">reacción visual</a> y <a href="/blog/reflejos-5-minutos.html" style="color:#00ffee;">rutina de 5 minutos</a>.</p>""",
    ),
    (
        "blog/entrenamiento-reflejos-10-min.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Si tienes poco tiempo, esta rutina de 10 minutos es ideal para mejorar reflejos.</p>
      <div class="card">
        <h3>Rutina 10 minutos</h3>
        <ol>
          <li>2 min de calentamiento.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test y registro.</li>
        </ol>
      </div>
      <h2>Constancia</h2>
      <p>Repite 5 dias por semana y compara tu progreso.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>Diez minutos es un intervalo psicológicamente fácil de defender frente al calendario: suficiente para calentar y practicar, pero corto como para no posponerlo eternamente.</p>

      <div class="card">
        <h3>Rutina 10 minutos (plantilla)</h3>
        <ol>
          <li><strong>2 min calentamiento:</strong> cuello suave + foco visual.</li>
          <li><strong>6 min núcleo:</strong> partidas en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>; alterna 2 min precisión / 2 min ritmo / 2 min precisión.</li>
          <li><strong>2 min test y registro:</strong> mejor sensación o mejor marca estable.</li>
        </ol>
      </div>

      <h2>Constancia</h2>
      <p>Cinco días por semana suele ser más sostenible que siete para principiantes. Compara semanas, no días sueltos.</p>

      <h2>Sigue leyendo</h2>
      <p><a href="/entrenador-reflejos.html" style="color:#00ffee;">Entrenador de reflejos</a> · <a href="/blog/entrenamiento-reflejos-casa.html" style="color:#00ffee;">entrenar en casa</a></p>""",
    ),
    (
        "blog/ejercicios-reaccion-visual.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Una rutina corta de reaccion visual mejora tu tiempo de respuesta en pocos dias.</p>
      <div class="card">
        <h3>Rutina en 10 minutos</h3>
        <ol>
          <li>2 min de calentamiento visual.</li>
          <li>6 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a> (timing preciso).</li>
          <li>2 min de test rapido.</li>
        </ol>
      </div>
      <h2>Consejo clave</h2>
      <p>Entrena a diario y registra tu progreso semanal.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>La reacción visual no es solo “ver rápido”: es detectar el estímulo, interpretar qué requiere y ejecutar el movimiento correcto. Por eso mezclamos descanso ocular con práctica de timing real.</p>

      <div class="card">
        <h3>Rutina en 10 minutos</h3>
        <ol>
          <li><strong>2 min calentamiento visual:</strong> parpadeo consciente y cambios de distancia focal.</li>
          <li><strong>6 min Stack Tower Neon:</strong> prioriza apilados limpios; evita forzar ritmo si pierdes precisión.</li>
          <li><strong>2 min cierre:</strong> mini test subjetivo — ¿veías el bloque “entrando” al ritmo adecuado?</li>
        </ol>
      </div>

      <h2>Consejo clave</h2>
      <p>Entrena casi a diario y registra tendencia semanal. Profundiza en <a href="/blog/coordination-ojo-mano.html" style="color:#00ffee;">coordinación ojo-mano</a>.</p>""",
    ),
    (
        "blog/sueno-reflejos-mejorar.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>El descanso impacta tu tiempo de reaccion mas de lo que crees.</p>
      <div class="card">
        <h3>3 claves de sueno</h3>
        <ol>
          <li>Horario fijo para dormir y despertar.</li>
          <li>Evita pantallas 45 min antes.</li>
          <li>Ambiente oscuro y fresco.</li>
        </ol>
      </div>
      <h2>Como medir progreso</h2>
      <p>Haz un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rapido de reaccion</a> despues de dormir bien y compara resultados.</p>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>El sueño deficitario eleva lapsos de atención y empeora la consistencia motora fina: no solo “te sientes más lento”, sino que fallas más en decisiones repetidas. Para gaming y estudio, la regularidad del horario suele importar más que una noche “recuperadora” puntual.</p>

      <div class="card">
        <h3>Tres pilares prácticos</h3>
        <ol>
          <li><strong>Horario estable</strong> incluso fines de semana (con margen razonable).</li>
          <li><strong>Ventana sin pantallas</strong> antes de dormir; la luz azul y el contenido stimulante retrasan el inicio del sueño.</li>
          <li><strong>Ambiente oscuro y fresco</strong>; reduce ruido si puedes.</li>
        </ol>
      </div>

      <h2>Cómo medir progreso sin obsesionarse</h2>
      <p>Un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rápido de reacción</a> semanal con las mismas condiciones puede mostrar tendencia junto a sensación subjetiva de foco.</p>

      <h2>Lecturas relacionadas</h2>
      <p><a href="/blog/hidratacion-reflejos.html" style="color:#00ffee;">Hidratación</a> · <a href="/blog/alimentacion-reflejos.html" style="color:#00ffee;">Alimentación</a></p>""",
    ),
    (
        "blog/mejorar-precision-gaming.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>La precision se mejora con timing y reflejos. Este plan te ayuda con sesiones diarias cortas.</p>
      <div class="card">
        <h3>Rutina simple</h3>
        <ol>
          <li>3 min de calentamiento.</li>
          <li>7 min con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>2 min de test y registro.</li>
        </ol>
      </div>
      <h2>Tips extra</h2>
      <ul>
        <li>Reduce errores antes de aumentar velocidad.</li>
        <li>Practica todos los dias.</li>
        <li>Complementa con la <a href="/guia-reflejos.html" style="color:#00ffee;">guia de reflejos</a>.</li>
      </ul>""",
        """      <div class="article-meta">📅 Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 13 min lectura | 📝 LIPA Studios</div>
      <p>En gaming, la precisión es la suma de micro ajustes: sensibilidad coherente con tu DPI o pantalla, postura estable y lectura del ritmo del juego. Sin una base consistente, subir velocidad solo multiplica errores.</p>

      <div class="card">
        <h3>Rutina simple (12 minutos)</h3>
        <ol>
          <li><strong>3 min calentamiento:</strong> hombros y muñecas + foco visual.</li>
          <li><strong>7 min práctica:</strong> <a href="/" style="color:#00ffee;">Stack Tower Neon</a> — prioriza líneas de apilado limpio.</li>
          <li><strong>2 min registro:</strong> qué tipo de error fue más frecuente.</li>
        </ol>
      </div>

      <h2>Tips extra</h2>
      <ul>
        <li>Baja sensación de error antes de forzar velocidad.</li>
        <li>Sesiones cortas diarias baten maratones caóticos.</li>
        <li>Apoya la técnica con la <a href="/guia-reflejos.html" style="color:#00ffee;">guía de reflejos</a> y revisa <a href="/blog/postura-reflejos.html" style="color:#00ffee;">postura</a>.</li>
      </ul>

      <h2>En profundidad</h2>
      <p><a href="/blog/reflejos-fps-aim.html" style="color:#00ffee;">Reflejos en FPS</a> · <a href="/blog/mejorar-reflejos-videojuegos.html" style="color:#00ffee;">Reflejos en videojuegos</a></p>""",
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
