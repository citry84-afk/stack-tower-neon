#!/usr/bin/env python3
"""Genera landings SEO estáticas por curso (primaria, infantil, ESO)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

COURSES = [
    {
        "id": "infantil-3",
        "slug": "infantil/3-anos",
        "label": "1º Infantil",
        "age": "3 años",
        "stage": "Educación Infantil",
        "subjects": ["Números y formas", "Lectura inicial", "Mi entorno"],
    },
    {
        "id": "infantil-4",
        "slug": "infantil/4-anos",
        "label": "2º Infantil",
        "age": "4 años",
        "stage": "Educación Infantil",
        "subjects": ["Cálculo básico", "Palabras y frases", "Naturaleza"],
    },
    {
        "id": "infantil-5",
        "slug": "infantil/5-anos",
        "label": "3º Infantil",
        "age": "5 años",
        "stage": "Educación Infantil",
        "subjects": ["Mates", "Lenguaje", "Descubrimiento"],
    },
    {
        "id": "primaria-1",
        "slug": "primaria/1-primaria",
        "label": "1º de Primaria",
        "age": "6 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "primaria-2",
        "slug": "primaria/2-primaria",
        "label": "2º de Primaria",
        "age": "7 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "primaria-3",
        "slug": "primaria/3-primaria",
        "label": "3º de Primaria",
        "age": "8 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "primaria-4",
        "slug": "primaria/4-primaria",
        "label": "4º de Primaria",
        "age": "9 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "primaria-5",
        "slug": "primaria/5-primaria",
        "label": "5º de Primaria",
        "age": "10 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "primaria-6",
        "slug": "primaria/6-primaria",
        "label": "6º de Primaria",
        "age": "11 años",
        "stage": "Educación Primaria",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "eso-1",
        "slug": "eso/1-eso",
        "label": "1º de la ESO",
        "age": "12 años",
        "stage": "Educación Secundaria (ESO)",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
    {
        "id": "eso-2",
        "slug": "eso/2-eso",
        "label": "2º de la ESO",
        "age": "13 años",
        "stage": "Educación Secundaria (ESO)",
        "subjects": ["Mates", "Lengua", "Inglés", "Naturales", "Sociales"],
    },
]

# Contenido editorial único por curso (AdSense / calidad)
COURSE_COPY: dict[str, dict] = {
    "infantil-3": {
        "intro": "A los 3 años el aprendizaje pasa por jugar, contar, nombrar y explorar el entorno. LIPA Brain Gym adapta micro-misiones de un minuto con voz visual de Lipi, sin leer pantallas largas ni instalar apps.",
        "mates": ["Contar hasta 5 con objetos", "Reconocer círculo, cuadrado y triángulo", "Comparar grande / pequeño", "Series de dos colores"],
        "lengua": ["Escuchar cuentos cortos", "Nombrar imágenes del día a día", "Primeras sílabas con apoyo visual", "Rimas y canciones del aula"],
        "ingles": ["Saludos y colores en inglés", "Animales con tarjetas", "Números del 1 al 5 en voz"],
        "naturales": ["Partes del cuerpo", "Mascotas y cuidados", "Estaciones del año con dibujos"],
        "sociales": ["La familia y el cole", "Compartir y esperar turno", "Normas básicas del aula"],
        "routine": "Lunes: 2 misiones de números y una de formas. Martes: escucha y señala palabras. Miércoles: cuerpo y emociones. Jueves: repaso mixto. Viernes: mini-reto y Recreo Neon si completó el entreno.",
        "faq": [
            ("¿Necesita saber leer?", "No. Las consignas son visuales y cortas; un adulto puede acompañar los primeros días."),
            ("¿Cuánto tiempo es adecuado?", "Entre 5 y 7 minutos. Mejor dejar con ganas de más que forzar media hora."),
            ("¿Los datos se suben a internet?", "El progreso se guarda en el navegador del dispositivo. Consulta la página Para padres."),
        ],
    },
    "infantil-4": {
        "intro": "En 2º Infantil (4 años) el niño consolida conteo, vocabulario y curiosidad natural. Brain Gym reparte el refuerzo en sesiones guiadas que imitan el ritmo del cole, sin listas de menús.",
        "mates": ["Contar hasta 10", "Sumar y restar con dedos", "Patrones ABAB", "Días de la semana con pictogramas"],
        "lengua": ["Palabras con pictograma", "Primeras letras mayúsculas", "Comprensión de instrucciones de dos pasos", "Vocabulario de la casa y el parque"],
        "ingles": ["Frutas y partes de la cara", "Instrucciones simples: sit, stand", "Repaso de colores y números"],
        "naturales": ["Plantas y agua", "Animales de granja", "Limpieza de manos y hábitos saludables"],
        "sociales": ["Ayudar en casa", "Reconocer emociones básicas", "Mapa del cole (aula, patio)"],
        "routine": "Cada día una materia principal: mates los lunes, lengua los martes, naturales los miércoles, sociales los jueves e inglés los viernes. Al terminar, opción de Recreo Neon.",
        "faq": [
            ("¿Puede usarlo en la tablet del cole?", "Sí, funciona en navegador. Recomendamos auriculares suaves si hay ruido."),
            ("¿Sustituye al maestro?", "No. Es refuerzo en casa o en biblioteca; el contenido sigue el currículo español pero no evalúa oficialmente."),
            ("¿Hay informe para padres?", "Sí, en Para padres verás días entrenados y materias tocadas en la semana."),
        ],
    },
    "infantil-5": {
        "intro": "El curso de 5 años prepara la transición a Primaria. Aquí combinamos números hasta 20, lectura de palabras frecuentes y pequeños retos de ciencias y convivencia, siempre en bloques de un minuto.",
        "mates": ["Números hasta 20", "Sumas sin llevadas", "Posición espacial (delante, detrás)", "Monedas de 1 y 2 euros con juego"],
        "lengua": ["Palabras con b y v sonoras", "Ordenar frases de 3 palabras", "Comprensión de cuento corto", "Escritura guiada de su nombre"],
        "ingles": ["Familia y ropa", "Preguntas What is it?", "Repaso fonético básico"],
        "naturales": ["Seres vivos y no vivos", "El tiempo atmosférico", "Los cinco sentidos"],
        "sociales": ["Profesiones de la ciudad", "Normas de tráfico peatonales", "Celebraciones del calendario escolar"],
        "routine": "Modelo 7 min: calentamiento (1 min), dos misiones de mates o lengua (4 min), cierre con naturales o sociales (2 min). Si hay racha de 3 días, desbloquea Recreo Neon.",
        "faq": [
            ("¿Está alineado con LOMLOE?", "Las competencias siguen áreas de Infantil del currículo español; el detalle por unidad está en la app de curso."),
            ("¿Funciona sin registro?", "Sí. El perfil se guarda localmente; no pedimos email al niño."),
            ("¿Qué pasa si falla un reto?", "Lipi propone repaso suave; no hay castigos ni publicaciones de notas."),
        ],
    },
    "primaria-1": {
        "intro": "Primer curso de Primaria (6 años) es el salto a la lectura fluida y las primeras tablas. Brain Gym reparte mates, lengua, inglés, naturales y sociales en una ruta diaria para que el niño sepa siempre qué toca hoy.",
        "mates": ["Composición del 10", "Sumas y restas hasta 20", "Figuras planas y cuerpos", "Medidas no estándar (palmos, pasos)"],
        "lengua": ["Grafema–fonema", "Sílabas directas", "Comprensión de texto de 4 líneas", "Caligrafía de letras minúsculas"],
        "ingles": ["Classroom objects", "Colours and numbers 1–10", "Simple commands"],
        "naturales": ["Seres vivos: plantas y animales", "Hábitos de salud", "Materiales: duro, blando"],
        "sociales": ["Mi barrio", "Símbolos de España", "Normas de convivencia en el cole"],
        "routine": "Ejemplo: lunes mates (composición), martes lengua (lectura), miércoles inglés (vocabulario), jueves naturales (seres vivos), viernes sociales (mapa). Cada sesión ~7 min con Lipi.",
        "faq": [
            ("¿Necesita cuenta de adulto?", "No es obligatoria. Los padres pueden abrir el informe semanal sin login."),
            ("¿Se puede repetir una materia?", "Sí, desde Ver todas las materias eliges mates o lengua cuando quieras."),
            ("¿Hay anuncios para niños?", "Los anuncios dependen de la configuración de cookies del sitio; el entreno funciona sin ellos."),
        ],
    },
    "primaria-2": {
        "intro": "En 2º de Primaria (7 años) aparecen las primeras llevadas y la comprensión lectora más larga. Usamos retos de un minuto para mantener la concentración y celebrar rachas sin presión de nota.",
        "mates": ["Llevadas en suma", "Restas con canje", "Reconocer billetes y monedas", "Problemas de una operación"],
        "lengua": ["Acentuación básica", "Sinónimos sencillos", "Texto narrativo corto", "Dictado de 6 palabras"],
        "ingles": ["Family members", "Prepositions in / on", "Food vocabulary"],
        "naturales": ["Funciones de los sentidos", "Cadenas alimentarias simples", "Cuidado del medio ambiente en el cole"],
        "sociales": ["Paisajes de España", "Profesiones y servicios", "Cronología: antes y después"],
        "routine": "Rotación automática si usas Empezar curso: el sistema alterna materias. Si un día solo quieres mates, entra desde la ficha del curso.",
        "faq": [
            ("¿Sirve para deberes?", "Sí como repaso; no sustituye cuadernos del cole pero refuerza lo visto en clase."),
            ("¿Funciona en móvil?", "Está pensado para pantallas táctiles; no hace falta instalar desde la tienda."),
            ("¿Cómo veo el progreso?", "Mi evolución muestra XP; Para padres resume la semana por materia."),
        ],
    },
    "primaria-3": {
        "intro": "Tercero de Primaria (8 años) consolida la multiplicación inicial y la producción de textos. Las misiones de Brain Gym conectan con unidades típicas del cole español y preparan el control de tablas.",
        "mates": ["Tablas del 2, 3, 4 y 5", "Multiplicación como suma repetida", "Fracciones con pizza visual", "Perímetro de cuadrado y rectángulo"],
        "lengua": ["Verbos en presente", "Sustantivos propios y comunes", "Texto descriptivo", "Ortografía de ge, gi, gue"],
        "ingles": ["Daily routines", "Weather expressions", "Questions with do / does"],
        "naturales": ["Grupos de animales", "Volcán y terremoto (intro)", "Estados del agua"],
        "sociales": ["Comunidades autónomas", "Prehistoria en línea de tiempo", "Derechos del niño (intro)"],
        "routine": "Sesión tipo: 1 min repaso tablas, 2 min problema corto, 2 min lengua (ortografía), 2 min inglés (listening). Opcional Recreo Neon al final.",
        "faq": [
            ("¿Incluye ciencias sociales y naturales?", "Sí, con actividades visuales; no reemplaza experimentos de laboratorio del cole."),
            ("¿Pueden dos hermanos usar el mismo móvil?", "Recomendamos perfil por niño en el selector de curso al entrar."),
            ("¿Hay contenido de reflejos mezclado?", "Recreo Neon es aparte; el Brain Gym del cole va primero."),
        ],
    },
    "primaria-4": {
        "intro": "Cuarto de Primaria (9 años) trabaja números grandes, problemas de dos pasos y comprensión lectora con inferencias. Esta página reúne qué practica tu hijo o alumno y cómo encaja en 7 minutos diarios.",
        "mates": ["Multiplicación de dos cifras (intro)", "División exacta sencilla", "Fracciones equivalentes", "Problemas con dinero y tiempo"],
        "lengua": ["Sinónimos y antónimos", "Reglas de b/v y h", "Texto informativo", "Resumen en tres frases"],
        "ingles": ["Past simple regular", "Comparatives short / tall", "School subjects vocabulary"],
        "naturales": ["Circuito eléctrico simple", "Ecosistemas de España", "Nutrición: grupos de alimentos"],
        "sociales": ["Edad Media en España", "Mapa físico: relieve", "Economía familiar: ahorro"],
        "routine": "Lunes mates (problema), martes lengua (comprensión), miércoles inglés, jueves naturales, viernes sociales. Lipi marca la misión completada y sugiere la siguiente.",
        "faq": [
            ("¿Por qué 7 minutos?", "Es la ventana en la que la mayoría mantiene atención activa; puedes hacer dos sesiones si quieres más."),
            ("¿Está actualizado al currículo?", "Sí, en español y alineado a competencias LOMLOE por curso."),
            ("¿Dónde está el informe semanal?", "En Para padres, generado en el mismo dispositivo."),
        ],
    },
    "primaria-5": {
        "intro": "En 5º de Primaria (10 años) se afianzan fracciones, decimales y la expresión escrita. Brain Gym ofrece práctica distribuida: mejor un poco cada día que un bloque largo el domingo.",
        "mates": ["Fracciones con distinto denominador", "Decimales con coma", "Potencias de base 10", "Problemas de proporcionalidad simple"],
        "lengua": ["Reglas de g/j, ll/y", "Texto argumentativo corto", "Análisis de personaje", "Acentos agudos y llanos"],
        "ingles": ["Irregular verbs intro", "Directions in town", "Present continuous"],
        "naturales": ["Sistema solar y fases lunares", "Fuerzas y movimiento (intro)", "Salud y pubertad (tema adaptado)"],
        "sociales": ["Edad Moderna: descubrimientos", "Constitución española (ideas clave)", "Consumo responsable"],
        "routine": "Modelo semanal equilibrado: 2 días mates, 1 lengua, 1 inglés, 1 naturales, 1 sociales. El séptimo día libre o repaso libre en la app.",
        "faq": [
            ("¿Puede preparar la ESO?", "Ayuda a hábito de estudio; el salto de contenido se cubre en la ficha de 1º ESO."),
            ("¿Hay modo sin Recreo Neon?", "Sí; el arcade es opcional tras completar el entreno."),
            ("¿Se guarda en la nube?", "No por defecto; privacidad por diseño en el navegador."),
        ],
    },
    "primaria-6": {
        "intro": "Sexto de Primaria (11 años) es el cierre antes de la ESO: porcentajes, lengua con textos más largos y visión global de España en el mundo. Refuerza sin sustituir al tutor del cole.",
        "mates": ["Porcentajes y proporciones", "Enteros negativos (intro)", "Geometría: ángulos y triángulos", "Problemas de varias operaciones"],
        "lengua": ["Subordinadas con porque y aunque", "Resumen crítico de noticia", "Ortografía de -ción / -sión", "Vocabulario de transición a ESO"],
        "ingles": ["Comparatives and superlatives", "Future with going to", "Reading short email format"],
        "naturales": ["Célula y funciones vitales", "Energías renovables", "Salud: hábitos y prevención"],
        "sociales": ["Guerra Civil española (línea simple)", "Unión Europea", "Derechos y deberes ciudadanos"],
        "routine": "Ejemplo miércoles: 3 min mates (porcentaje), 2 min lengua (resumen), 2 min sociales (mapa UE). Lipi adapta si fallas un reto con repaso guiado.",
        "faq": [
            ("¿Sirve para Selectividad?", "No; es refuerzo de Primaria. Para ESO usa la landing de 1º ESO."),
            ("¿Cuántas pantallas tiene?", "Una ruta guiada; evitamos menús infinitos que distraen."),
            ("¿Contacto con soporte?", "Escríbenos desde la página de contacto del sitio."),
        ],
    },
    "eso-1": {
        "intro": "Primer curso de la ESO (12 años) aumenta la abstracción en mates y la extensión de textos. Brain Gym mantiene sesiones cortas para encajar entre extraescolares y deberes largos.",
        "mates": ["Potencias y raíz cuadrada entera", "Ecuaciones de primer grado", "Estadística: media y moda", "Geometría en el plano cartesiano"],
        "lengua": ["Análisis sintáctico básico", "Texto expositivo", "Literatura: géneros narrativos", "Ortografía avanzada"],
        "ingles": ["Present perfect intro", "Passive voice simple", "Phrasal verbs frecuentes"],
        "naturales": ["Biología celular", "Física: velocidad", "Química: mezclas y disoluciones"],
        "sociales": ["Grecia y Roma en Hispania", "Geografía de España y Europa", "Economía: oferta y demanda (intro)"],
        "routine": "Tras elegir 1º ESO, Lipi propone la misión del día según lo pendiente en mates o lengua. 7 min base; puedes extender con segunda misión.",
        "faq": [
            ("¿Es solo para España?", "El currículo sigue el sistema español; otros países pueden usarlo como práctica extra."),
            ("¿Hay examen final?", "No evaluamos con nota; hay XP y rachas motivacionales."),
            ("¿Recreo Neon es obligatorio?", "No; es recompensa opcional tras el entreno escolar."),
        ],
    },
    "eso-2": {
        "intro": "En 2º de la ESO (13 años) conviven álgebra, física y análisis de textos más densos. Esta guía explica cómo repartir el refuerzo diario sin añadir otra plataforma con contraseña.",
        "mates": ["Sistemas de ecuaciones 2x2", "Funciones lineales", "Teorema de Pitágoras aplicado", "Probabilidad simple"],
        "lengua": ["Subordinadas múltiples", "Comentario de texto literario", "Ortografía de hiatos y diptongos", "Vocabulario académico"],
        "ingles": ["Conditionals type 1", "Reported speech intro", "Science vocabulary"],
        "naturales": ["Genética básica", "Electricidad y Ohm", "Reacciones químicas simbólicas"],
        "sociales": ["Edad Contemporánea", "Globalización y redes", "Participación ciudadana"],
        "routine": "Lunes mates (ecuaciones), martes lengua, miércoles inglés, jueves naturales (física/química alternas), viernes sociales. Informe semanal en Para padres.",
        "faq": [
            ("¿Puedo usarlo en ordenador y móvil?", "Sí; el progreso es por navegador, no sincroniza entre dispositivos aún."),
            ("¿Incluye Historia completa?", "Bloques clave del currículo; profundiza en clase con el profesor."),
            ("¿Cómo solicitar ayuda?", "Email en Contacto; respondemos dudas técnicas del sitio."),
        ],
    },
}

PLAY_SUBJECTS = [
    ("matematicas", "Mates", "➕"),
    ("lenguaje", "Lengua", "📖"),
    ("ingles", "Inglés", "🇬🇧"),
    ("naturales", "Naturales", "🔬"),
    ("sociales", "Sociales", "🌍"),
]

NAV = """  <nav class="site-nav" role="navigation" aria-label="Navegación principal">
    <div class="site-nav__inner">
      <div class="site-nav__top">
        <a class="site-nav__brand" href="/">LIPA Studios</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menú</button>
      </div>
      <div id="primary-nav" class="nav-links">
        <a href="/">Brain Gym</a>
        <a href="/cursos.html">Cursos</a>
        <a href="/para-padres.html">Para padres</a>
        <a href="/recreo-neon.html">Recreo Neon</a>
      </div>
    </div>
    <div class="nav-backdrop" id="nav-backdrop"></div>
  </nav>
  <script src="/js/site-nav.js" defer></script>"""

FOOTER = """  <footer class="lipa-footer lipa-footer--site lipa-footer--compact">
    <nav class="lipa-footer__links" aria-label="Enlaces legales e información">
      <a href="/about.html">Sobre LIPA</a>
      <a href="/contact.html">Contacto</a>
      <a href="/privacy.html">Privacidad</a>
      <a href="/terms.html">Términos</a>
    </nav>
    <p class="lipa-footer__copy">© 2024–2026 LIPA Studios · Brain Gym alineado al currículo español (LOMLOE)</p>
  </footer>"""


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def render_list(items: list[str]) -> str:
    return "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>"


def render_faq(faq: list[tuple[str, str]]) -> str:
    parts = []
    for q, a in faq:
        parts.append(
            f'<details class="course-landing-faq__item">'
            f"<summary>{esc(q)}</summary><p>{esc(a)}</p></details>"
        )
    return "\n      ".join(parts)


def render_topics_block(copy: dict) -> str:
    blocks = [
        ("Matemáticas", copy["mates"]),
        ("Lengua y literatura", copy["lengua"]),
        ("Inglés", copy["ingles"]),
        ("Naturales / Ciencias", copy["naturales"]),
        ("Ciencias sociales", copy["sociales"]),
    ]
    html = ""
    for title, items in blocks:
        html += f"""
      <h3>{esc(title)}</h3>
      {render_list(items)}"""
    return html


def render_faq_schema(faq: list[tuple[str, str]]) -> str:
    entities = [
        {
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        }
        for q, a in faq
    ]
    entities.append(
        {
            "@type": "Question",
            "name": "¿LIPA Brain Gym es gratis?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí. El refuerzo escolar y las rutinas son gratuitas en el navegador, sin instalar apps ni crear cuenta.",
            },
        }
    )
    return json.dumps(
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities},
        ensure_ascii=False,
    )


def render_play_links(c: dict) -> str:
    items = []
    for sub_id, label, emoji in PLAY_SUBJECTS:
        href = f"/materia.html?c={c['id']}&m={sub_id}"
        items.append(
            f'<li><a href="{href}">{emoji} {esc(label)}</a></li>'
        )
    return '<ul class="course-landing-play-links">' + "".join(items) + "</ul>"


def page(c: dict) -> str:
    copy = COURSE_COPY[c["id"]]
    path = f"/{c['slug']}"
    canonical = f"https://lipastudios.com{path}"
    title = f"Refuerzo {c['label']} en 7 min al día | LIPA Brain Gym"
    desc = (
        f"Guía completa de Brain Gym para {c['label']} ({c['age']}): "
        f"mates, lengua, inglés, naturales y sociales. Rutina LOMLOE gratis en el navegador."
    )
    subjects_li = "".join(f"<li>{esc(s)}</li>" for s in c["subjects"])
    play_url = f"/curso.html?c={c['id']}&empezar=1"
    topics_html = render_topics_block(copy)
    faq_html = render_faq(copy["faq"])
    play_links = render_play_links(c)
    faq_schema = render_faq_schema(copy["faq"])
    breadcrumb_schema = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://lipastudios.com/",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Cursos",
                    "item": "https://lipastudios.com/cursos.html",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": c["label"],
                    "item": canonical,
                },
            ],
        },
        ensure_ascii=False,
    )

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:image" content="https://lipastudios.com/og-image.jpg">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:image" content="https://lipastudios.com/og-image.jpg">
  <link rel="stylesheet" href="/css/lipa-ui.css">
  <link rel="stylesheet" href="/css/site-nav.css">
  <link rel="stylesheet" href="/css/brain-gym.css?v=3">
  <link rel="stylesheet" href="/css/brain-design-system.css?v=3">
  <link rel="stylesheet" href="/css/course-landing.css">
  <meta name="theme-color" content="#2ed3a6">
  <script type="application/ld+json">
  {{"@context":"https://schema.org","@type":"Course","name":"{esc(c['label'])}","description":"{esc(desc)}","provider":{{"@type":"Organization","name":"LIPA Studios","url":"https://lipastudios.com","logo":"https://lipastudios.com/logo.png"}},"url":"{canonical}","inLanguage":"es","isAccessibleForFree":true,"educationalLevel":"{esc(c['stage'])}","typicalAgeRange":"{esc(c['age'])}","image":"https://lipastudios.com/og-image.jpg"}}
  </script>
  <script type="application/ld+json">
  {breadcrumb_schema}
  </script>
  <script type="application/ld+json">
  {faq_schema}
  </script>
</head>
<body class="lipa-page lipa-brain-soft">
{NAV}
  <main class="course-landing-main">
    <header class="course-landing-hero">
      <p class="brain-eyebrow">LIPA Brain Gym · {esc(c['age'])} · {esc(c['stage'])}</p>
      <h1>Refuerza {esc(c['label'])} en 7 minutos al día</h1>
      <p>Un botón, misión a misión: mates, lengua y más del cole. Sin menús confusos — Lipi guía el entreno en el navegador, sin instalar apps.</p>
    </header>
    <ul class="course-landing-subjects" aria-label="Áreas del curso">{subjects_li}</ul>

    <article class="course-landing-article">
      <h2>Qué es Brain Gym para {esc(c['label'])}</h2>
      <p>{esc(copy['intro'])}</p>
      <p>El contenido sigue competencias del currículo español (LOMLOE) para {esc(c['stage'].lower())}. No sustituye al profesorado del centro: refuerza lo visto en clase con micro-actividades y seguimiento local para las familias.</p>

      <h2>Contenidos que practica en este curso</h2>
      {topics_html}

      <h2>Un día tipo de 7 minutos</h2>
      <p>{esc(copy['routine'])}</p>
      <p>Al pulsar <strong>Empezar</strong>, Lipi abre la misión pendiente (mates, lengua, etc.). Si completas la rutina del día, puedes desbloquear <a href="/recreo-neon.html">Recreo Neon</a> — arcade de reflejos como premio, no como sustituto del estudio.</p>

      <h2>Entrar directamente por materia</h2>
      <p>Desde la app puedes elegir una asignatura concreta:</p>
      {play_links}

      <h2>Informe para padres y privacidad</h2>
      <p>En <a href="/para-padres.html">Para padres</a> verás cuántos días entrenó esta semana, qué materias tocó y sugerencias de repaso. Los datos permanecen en el navegador del dispositivo; no pedimos registro al menor. Más información en <a href="/privacy.html">Privacidad</a>, <a href="/editorial.html">política editorial</a> y <a href="/contact.html">Contacto</a>.</p>
      <p>Guía general: <a href="/blog/refuerzo-escolar-7-minutos-brain-gym.html">refuerzo escolar en 7 minutos</a> · <a href="/cursos.html">todos los cursos</a>.</p>

      <h2>Preguntas frecuentes sobre {esc(c['label'])}</h2>
      <div class="course-landing-faq">
      {faq_html}
      </div>
    </article>

    <div class="course-landing-steps" aria-label="Cómo funciona">
      <div class="course-landing-step"><span class="course-landing-step__num">1</span><div><strong>Elige el curso</strong> Ya estás en {esc(c['label'])} — contenido adaptado a {esc(c['age'])}.</div></div>
      <div class="course-landing-step"><span class="course-landing-step__num">2</span><div><strong>7 min de Brain Gym</strong> Misiones cortas con feedback inmediato de Lipi.</div></div>
      <div class="course-landing-step"><span class="course-landing-step__num">3</span><div><strong>Recreo Neon (opcional)</strong> Tras el entreno, juegos de reflejos como recompensa.</div></div>
    </div>
    <div class="course-landing-cta">
      <a href="{play_url}" class="lipa-btn lipa-btn--primary lipa-btn--lg">Empezar {esc(c['label'])}</a>
      <a href="/curso.html?c={c['id']}" class="lipa-btn lipa-btn--secondary">Ver todas las materias</a>
    </div>
    <p class="course-landing-links">
      <a href="/para-padres.html">Informe para padres</a> ·
      <a href="/cursos.html">Otros cursos</a> ·
      <a href="/blog/refuerzo-escolar-7-minutos-brain-gym.html">Guía 7 min</a> ·
      <a href="/">Inicio Brain Gym</a>
    </p>
  </main>
{FOOTER}
</body>
</html>
"""


def main() -> None:
    for c in COURSES:
        out_file = ROOT / f"{c['slug']}.html"
        out_file.parent.mkdir(parents=True, exist_ok=True)
        html = page(c)
        if "motion" in html:
            raise SystemExit(f"motion tag leak in {out_file}")
        out_file.write_text(html, encoding="utf-8")
        print("wrote", out_file.relative_to(ROOT))


if __name__ == "__main__":
    main()
