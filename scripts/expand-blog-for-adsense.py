#!/usr/bin/env python3
"""Insert substantive article bodies into thin blog posts (AdSense quality)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Each entry: relative path, exact old substring, new substring (must match byte-for-byte).
PATCHES: list[tuple[str, str, str]] = [
    (
        "blog/pausas-activas-reflejos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Micro pausas cada 45-60 minutos mejoran focus y reaccion.</p>
      <div class="card">
        <h3>3 micro ejercicios</h3>
        <ol>
          <li>30s de seguimiento visual.</li>
          <li>60s de <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>30s de respiracion y estiramientos.</li>
        </ol>
      </div>
      <h2>Cuando hacerlas</h2>
      <p>Haz una pausa activa antes de partidas ranked o torneos.</p>""",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 12 min lectura | 📝 LIPA Studios</div>
      <p>Las pausas activas no son solo “descansar”: son reseteos cortos para recuperar atención sostenida y coordinación fina. Si juegas sesiones largas o trabajas frente a pantalla, el cerebro acumula fatiga visual y micro errores de timing que suben el tiempo de reacción percibido.</p>
      <p>Este protocolo está pensado para insertarse cada 45–60 minutos. La idea es mover ojos y cuello, hacer una práctica de timing real con un juego corto y cerrar con respiración para bajar la tensión de hombros y muñecas.</p>

      <h2>Por qué funcionan las micro pausas</h2>
      <p>La lectura rápida de estímulos en pantalla depende de foco y de estabilidad postural. Cuando la vista queda fija y los hombros suben, los movimientos de clic o toque empiezan a llegar tarde. Una pausa breve interrumpe ese ciclo y devuelve sensibilidad al ritmo del estímulo.</p>

      <div class="card">
        <h3>Protocolo de 3 micro ejercicios (≈3 minutos)</h3>
        <ol>
          <li><strong>30 s seguimiento visual:</strong> aleja la mirada 6 metros si puedes; si no, cambia entre un punto cercano y uno lejano 10 veces. Con eso reduces rigidez del enfoque.</li>
          <li><strong>60 s timing en juego:</strong> una partida corta de <a href="/" style="color:#00ffee;">Stack Tower Neon</a> para reactivar anticipación y clic preciso sin fatigar.</li>
          <li><strong>30 s respiración y hombros:</strong> inhala 4 s, exhala 6 s, tres ciclos; rota muñecas y estira dedos para soltar tensión de agarre.</li>
        </ol>
      </div>

      <h2>Cuándo programarlas</h2>
      <p>Úsalas antes de partidas clasificatorias, después de bloques de estudio o cuando notes picos de errores “tontos”. Si entrenas reflejos con una guía estructurada, encajan bien dentro del plan de <a href="/guia-reflejos.html" style="color:#00ffee;">7 días</a> o como complemento de la <a href="/blog/mejorar-reflejos-guia-completa.html" style="color:#00ffee;">guía completa</a>.</p>

      <h2>Errores comunes</h2>
      <p>Saltar pausas por “solo una partida más”, abrir redes sociales en lugar de mover el cuerpo, o alargar la pausa tanto que pierdes calentamiento motor. Mejor corta y consistente.</p>

      <h2>Preguntas frecuentes</h2>
      <p><strong>¿Suficiente con una pausa cada 2 horas?</strong> Si notas fatiga antes, adelántala. El objetivo es calidad de respuesta, no cumplir un cronómetro rígido.</p>
      <p><strong>¿Sirve para trabajo y para gaming?</strong> Sí; el patrón visual es similar. Ajusta solo la intensidad del bloque de juego.</p>""",
    ),
    (
        "blog/postura-reflejos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Una postura correcta mejora el control y la velocidad de respuesta.</p>
      <div class="card">
        <h3>Ajustes clave</h3>
        <ol>
          <li>Pantalla a la altura de los ojos.</li>
          <li>Espalda recta y hombros relajados.</li>
          <li>Munecas apoyadas para precision.</li>
        </ol>
      </div>
      <h2>Mejora tu timing</h2>
      <p>Combina postura con un <a href="/blog/calentamiento-reflejos-5-min.html" style="color:#00ffee;">calentamiento rapido</a>.</p>""",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 11 min lectura | 📝 LIPA Studios</div>
      <p>La postura influye directamente en la precisión micro del ratón o del pulgar en pantalla. Cuando la cabeza se proyecta hacia delante o los codos quedan demasiado altos, la muñeca compensa y aparecen micro retrasos al ejecutar un clic o un tap.</p>
      <p>No buscamos una ergonomía perfecta de oficina: buscamos una base estable para que el tiempo de reacción que entrenas sea consistente entre sesiones.</p>

      <h2>Ajustes prácticos en escritorio</h2>
      <div class="card">
        <h3>Checklist rápida</h3>
        <ol>
          <li><strong>Pantalla:</strong> borde superior cercano a la altura de los ojos; evita mirar hacia abajo de forma pronunciada.</li>
          <li><strong>Silla y espalda:</strong> apoyo lumbar ligero; hombros abajo, sin tensión permanente.</li>
          <li><strong>Muñecas:</strong> si usas ratón, apoya el antebrazo; en teclado mecánico bajo, evita hiperextensión.</li>
          <li><strong>Pies:</strong> contacto con el suelo o reposapiés para no compensar con la espalda.</li>
        </ol>
      </div>

      <h2>Ajustes en móvil gaming</h2>
      <p>Sujeta el teléfono con las dos manos cuando sea posible y evita sesiones larguísimas con el cuello flexionado. Si quieres optimizar dispositivos modestos, revisa también la guía de <a href="/moviles-gaming-baratos.html" style="color:#00ffee;">móviles gaming baratos</a>.</p>

      <h2>Cómo ligarlo al entrenamiento</h2>
      <p>Después de corregir altura de monitor y silla, haz un <a href="/blog/calentamiento-reflejos-5-min.html" style="color:#00ffee;">calentamiento corto</a> y una partida de práctica en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>. Así comparas sensaciones “antes/después” con menos variables.</p>

      <h2>Señales de aviso</h2>
      <p>Dolor punzante, entumecimiento o pinchazos repetidos no se entrenan con más reflejos: son motivo de pausa prolongada y valoración profesional.</p>""",
    ),
    (
        "blog/hidratacion-reflejos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 4 min lectura</div>
      <p>Una hidratacion correcta mejora el foco y la velocidad de respuesta.</p>
      <div class="card">
        <h3>Habitos simples</h3>
        <ol>
          <li>Vaso de agua antes de jugar.</li>
          <li>Pequenos sorbos cada 30-40 min.</li>
          <li>Evita exceso de bebidas azucaradas.</li>
        </ol>
      </div>
      <h2>Como medir el cambio</h2>
      <p>Haz un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rapido de reaccion</a> antes y despues.</p>""",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 10 min lectura | 📝 LIPA Studios</div>
      <p>La hidratación ligera y estable ayuda a mantener alerta sin picos de somnolencia que te hagan fallar el timing. No estamos hablando de rendimiento deportivo extremo, sino de un hábito básico que condiciona cómo percibes estímulos visuales durante sesiones largas.</p>
      <p>Las bebidas muy azucaradas pueden dar subidas rápidas de energía seguidas de bajadas que se notan en la consistencia de respuesta. El agua y bebidas sin cafeína en exceso suelen ser más predecibles para práctica diaria.</p>

      <div class="card">
        <h3>Hábitos simples y medibles</h3>
        <ol>
          <li><strong>Antes de jugar:</strong> un vaso de agua para partir sin déficit leve (especialmente si llevas horas sin beber).</li>
          <li><strong>Durante sesión:</strong> sorbos cada 30–40 min si la partida lo permite; pausa corta si entras en rachas competitivas.</li>
          <li><strong>Evita sustituir agua por refrescos:</strong> azúcar alto puede alternar foco y distracción.</li>
        </ol>
      </div>

      <h2>Cómo observar el efecto sin obsesionarse</h2>
      <p>Puedes hacer un <a href="/blog/test-rapido-reaccion.html" style="color:#00ffee;">test rápido de reacción</a> en dos días distintos (hidratación regular vs. día descuidado) y comparar sensación subjetiva de errores “bobos”. No es un laboratorio, pero sí una señal práctica.</p>

      <h2>Relación con otras guías</h2>
      <p>Si combinas hidratación con sueño estable (<a href="/blog/sueno-reflejos-mejorar.html" style="color:#00ffee;">sueño y reflejos</a>) y una rutina corta en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>, suele mejorar la regularidad más que buscar un “truco” aislado.</p>

      <h2>Aviso</h2>
      <p>Personas con restricciones médicas de líquidos deben seguir indicación clínica; este texto es orientativo para público general.</p>""",
    ),
    (
        "blog/reflejos-5-minutos.html",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 | ⏱️ 5 min lectura</div>
      <p>Si tienes poco tiempo, esta rutina de 5 minutos es suficiente para mejorar reflejos.</p>
      <div class="card">
        <h3>Rutina 5 minutos</h3>
        <ol>
          <li>1 min: calentamiento visual.</li>
          <li>3 min: timing con <a href="/" style="color:#00ffee;">Stack Tower Neon</a>.</li>
          <li>1 min: test rapido.</li>
        </ol>
      </div>
      <h2>Consejo clave</h2>
      <p>La consistencia diaria es mas importante que sesiones largas.</p>""",
        """      <div class="article-meta">📅 Publicado: Febrero 2026 · Actualizado: mayo 2026 | ⏱️ 13 min lectura | 📝 LIPA Studios</div>
      <p>Cinco minutos bien repartidos pueden servir para mantener reflejos si los repites casi todos los días. La clave no es la duración absoluta, sino que el cerebro reciba un estímulo predecible de timing con feedback inmediato.</p>
      <p>Esta rutina está pensada para quien tiene agenda apretada pero quiere evitar abandonar el hábito por “no llegar” a sesiones largas.</p>

      <div class="card">
        <h3>Rutina de 5 minutos (cronómetro)</h3>
        <ol>
          <li><strong>Minuto 1 – calentamiento visual:</strong> parpadeos lentos, enfocar lejos/cerca si puedes mirar por ventana; reduce rigidez antes de medir reacción.</li>
          <li><strong>Minutos 2–4 – timing real:</strong> partidas cortas en <a href="/" style="color:#00ffee;">Stack Tower Neon</a>. Prioriza precisión sobre récord; busca sensación estable.</li>
          <li><strong>Minuto 5 – cierre:</strong> mini autochequeo: ¿fallos por impaciencia o por mover demasiado tarde? Anótalo mentalmente para la siguiente sesión.</li>
        </ol>
      </div>

      <h2>Por qué la regularidad gana</h2>
      <p>Una sesión larga puntual entrena, pero la continuidad construye automatismos. Para profundizar más allá de estos cinco minutos, enlaza con la <a href="/blog/mejorar-reflejos-guia-completa.html" style="color:#00ffee;">guía completa</a> o el <a href="/guia-reflejos.html" style="color:#00ffee;">plan de 7 días</a>.</p>

      <h2>Errores habituales</h2>
      <p>Saltar el calentamiento visual, forzar récords fatigados o compararte con sesiones “buenas” sin contexto (sueño, estrés, caffeine).</p>

      <h2>FAQ</h2>
      <p><strong>¿Mejor mañana o noche?</strong> Cuando puedas ser constante. La hora importa menos que no saltarte días por improvisación.</p>""",
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
        print("MISSING (no changes):", missing)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
