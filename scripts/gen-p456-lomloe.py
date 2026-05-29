#!/usr/bin/env python3
"""Generate LOMLOE ref + curriculum build blocks for Primaria 4-6."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SABER_DEFS = {
    "primaria-4": {
        "matematicas": [
            ("p4-m-a1", "numeros", "Números hasta 10.000", "Lectura, comparación y valor posicional."),
            ("p4-m-a2", "multiplicacion", "Multiplicación y división", "Productos y repartos con números mayores."),
            ("p4-m-a3", "operaciones", "Fracciones equivalentes", "Comparar y simplificar fracciones."),
            ("p4-m-b1", "operaciones", "Decimales", "Décimas, centésimas y relación con fracciones."),
            ("p4-m-c1", "formas", "Ángulos y simetría", "Medir ángulos y ejes de simetría."),
            ("p4-m-a4", "problemas-numericos", "Problemas multiplicativos", "Planificar operaciones combinadas."),
        ],
        "lenguaje": [
            ("p4-l-c1", "lectura", "Comprensión lectora", "Textos narrativos, informativos y descriptivos."),
            ("p4-l-c2", "ortografia", "Ortografía avanzada", "R/rr, h, acentos y mayúsculas."),
            ("p4-l-c3", "escritura", "Sintaxis y literatura", "Oración compuesta y géneros literarios."),
        ],
        "ingles": [
            ("p4-i-e1", "ingles-vocabulario", "Past simple", "Acciones pasadas y vocabulario cotidiano."),
            ("p4-i-e2", "ingles-vocabulario", "Comparatives", "Comparar personas, lugares y cosas."),
            ("p4-i-e3", "ingles-oral", "Reading comprehension", "Leer y responder en inglés."),
        ],
        "naturales": [
            ("p4-n-b1", "naturales-seres-vivos", "Célula y clasificación", "Seres vivos y funciones vitales."),
            ("p4-n-b2", "naturales-salud", "Salud y consumo", "Hábitos saludables y alimentación."),
            ("p4-n-b3", "naturales-materia", "Fuerzas y máquinas", "Movimiento, fuerzas y energía mecánica."),
        ],
        "sociales": [
            ("p4-s-b1", "sociales-convivencia", "Derechos y participación", "Democracia local y convivencia."),
            ("p4-s-b2", "sociales-geografia", "Autonomías y economía", "Organización territorial y recursos."),
            ("p4-s-b3", "sociales-historia", "Edad Moderna temprana", "Descubrimientos y sociedad."),
        ],
        "brain-gym-diario": [
            ("p4-d-01", "atencion", "Rutina diaria equilibrada", "Mates, lengua, inglés y reflejos en 7 min."),
        ],
    },
    "primaria-5": {
        "matematicas": [
            ("p5-m-a1", "operaciones", "Operaciones con decimales", "Sumar, restar y multiplicar decimales."),
            ("p5-m-a2", "operaciones", "Fracciones y decimales", "Equivalencias y comparación."),
            ("p5-m-a3", "operaciones", "Porcentajes básicos", "Descuentos, partes y proporciones simples."),
            ("p5-m-b1", "formas", "Área y volumen", "Medidas, perímetro, área y volumen."),
            ("p5-m-c1", "formas", "Coordenadas y figuras", "Plano cartesiano y transformaciones."),
            ("p5-m-a4", "problemas-numericos", "Problemas de proporción", "Escalas y repartos proporcionales."),
        ],
        "lenguaje": [
            ("p5-l-c1", "comprension", "Textos argumentativos", "Opinión, causa y consecuencia."),
            ("p5-l-c2", "ortografia", "Ortografía 5º", "Reglas ortográficas y puntuación."),
            ("p5-l-c3", "escritura", "Gramática avanzada", "Oración compuesta y conectores."),
        ],
        "ingles": [
            ("p5-i-e1", "ingles-vocabulario", "Present perfect", "Experiencias y resultados recientes."),
            ("p5-i-e2", "ingles-vocabulario", "Future forms", "Will y going to para planes."),
            ("p5-i-e3", "ingles-oral", "Oral presentations", "Exponer ideas con claridad."),
        ],
        "naturales": [
            ("p5-n-b1", "naturales-seres-vivos", "Reproducción y herencia", "Ciclos vitales y características."),
            ("p5-n-b2", "naturales-seres-vivos", "Ecosistemas", "Medio ambiente y sostenibilidad."),
            ("p5-n-b3", "naturales-materia", "Luz, sonido y electricidad", "Ondas, circuitos y energía."),
        ],
        "sociales": [
            ("p5-s-b1", "sociales-convivencia", "Gobierno y democracia", "Instituciones y participación."),
            ("p5-s-b2", "sociales-geografia", "Recursos y población", "Geografía humana y económica."),
            ("p5-s-b3", "sociales-historia", "Edad Moderna y Contemporánea", "Revoluciones y cambios sociales."),
        ],
        "brain-gym-diario": [
            ("p5-d-01", "atencion", "Rutina diaria equilibrada", "Mates, lengua, inglés y reflejos en 7 min."),
        ],
    },
    "primaria-6": {
        "matematicas": [
            ("p6-m-a1", "operaciones", "Proporcionalidad", "Regla de tres y magnitudes proporcionales."),
            ("p6-m-a2", "numeros", "Números enteros", "Positivos, negativos y recta numérica."),
            ("p6-m-a3", "operaciones", "Fracciones y decimales avanzados", "Operaciones combinadas."),
            ("p6-m-b1", "operaciones", "Estadística básica", "Media, moda y gráficos."),
            ("p6-m-c1", "formas", "Geometría avanzada", "Circunferencia, área y volumen."),
            ("p6-m-a4", "problemas-numericos", "Álgebra inicial", "Incógnitas y problemas complejos."),
        ],
        "lenguaje": [
            ("p6-l-c1", "comprension", "Análisis de textos", "Ideas, argumentos y estructura."),
            ("p6-l-c2", "ortografia", "Ortografía y redacción", "Textos formales y revisión."),
            ("p6-l-c3", "lectura", "Literatura española", "Autores, movimientos y géneros."),
        ],
        "ingles": [
            ("p6-i-e1", "ingles-vocabulario", "Conditionals and modals", "Hipótesis y obligación."),
            ("p6-i-e2", "ingles-vocabulario", "Passive voice", "Transformaciones y estilo."),
            ("p6-i-e3", "ingles-oral", "Project language", "Presentaciones y vocabulario académico."),
        ],
        "naturales": [
            ("p6-n-b1", "naturales-seres-vivos", "Evolución y biodiversidad", "Adaptación y conservación."),
            ("p6-n-b2", "naturales-cuerpo", "Cuerpo humano avanzado", "Sistemas y salud integral."),
            ("p6-n-b3", "naturales-materia", "Energía y sostenibilidad", "Recursos y cambio climático."),
        ],
        "sociales": [
            ("p6-s-b1", "sociales-convivencia", "Constitución y UE", "Ciudadanía europea y derechos."),
            ("p6-s-b2", "sociales-geografia", "Geografía mundial", "Continentes, clima y globalización."),
            ("p6-s-b3", "sociales-historia", "Historia contemporánea", "Siglo XX y sociedad actual."),
        ],
        "brain-gym-diario": [
            ("p6-d-01", "atencion", "Rutina diaria equilibrada", "Mates, lengua, inglés y reflejos en 7 min."),
        ],
    },
}


def js_str(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def gen_lomloe_block():
    lines = []
    for course_id, subjects in SABER_DEFS.items():
        lines.append(f"    '{course_id}': {{")
        for subj, sabers in subjects.items():
            key = f"'{subj}'" if subj == "brain-gym-diario" else subj
            lines.append(f"      {key}: [")
            for i, (sid, tag, title, desc) in enumerate(sabers):
                comma = "," if i < len(sabers) - 1 else ""
                lines.append(
                    f"        {{ id: '{sid}', tags: ['{tag}'], title: '{js_str(title)}', desc: '{js_str(desc)}' }}{comma}"
                )
            lines.append("      ],")
        lines.append("    },")
    return "\n".join(lines)


def gen_math(prefix, grade, bl_base):
    """5 math units aligned to saber ids."""
    g = grade
    p = prefix
    a1, a2, a3, b1, a4 = f"{p}-m-a1", f"{p}-m-a2", f"{p}-m-a3", f"{p}-m-b1", f"{p}-m-a4"
    titles = {
        4: [
            ("num", "Números hasta 10.000", "LOMLOE · valor posicional y comparación.", a1),
            ("ops", "Multiplicación y división", "LOMLOE · productos y repartos con números mayores.", a2),
            ("frac", "Fracciones equivalentes", "LOMLOE · comparar y simplificar fracciones.", a3),
            ("dec", "Decimales", "LOMLOE · décimas, centésimas y cálculo.", b1),
            ("prob", "Problemas multiplicativos", "LOMLOE · planificar operaciones combinadas.", a4),
        ],
        5: [
            ("dec", "Operaciones con decimales", "LOMLOE · sumar, restar y multiplicar decimales.", a1),
            ("frac", "Fracciones y decimales", "LOMLOE · equivalencias y comparación.", a2),
            ("pct", "Porcentajes básicos", "LOMLOE · descuentos y partes de un todo.", a3),
            ("med", "Área y volumen", "LOMLOE · medidas, perímetro y volumen.", b1),
            ("prop", "Problemas de proporción", "LOMLOE · escalas y repartos proporcionales.", a4),
        ],
        6: [
            ("prop", "Proporcionalidad", "LOMLOE · regla de tres y magnitudes.", a1),
            ("int", "Números enteros", "LOMLOE · positivos, negativos y recta numérica.", a2),
            ("frac", "Fracciones avanzadas", "LOMLOE · operaciones combinadas.", a3),
            ("stat", "Estadística básica", "LOMLOE · media, moda y gráficos.", b1),
            ("alg", "Álgebra inicial", "LOMLOE · incógnitas y problemas complejos.", a4),
        ],
    }[g]
    out = [f"  function primaria{g}Math() {{"]
    out.append("    return [")
    for slug, title, desc, sab in titles:
        bl = bl_base
        out.append(f"      unit('{p}-m-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveGame('{p}-m-{slug}1', 'Tablas express', 'tablas-relampago', 2, {bl}, null, '{sab}'),")
        out.append(f"        liveMates('{p}-m-{slug}2', 'Cálculo mental', 1, 2, {bl + 1}, null, '{sab}'),")
        out.append(f"        liveGame('{p}-m-{slug}3', 'Mix operaciones', 'neon-calculo', 3, {bl + 1}, null, '{sab}'),")
        out.append(f"        liveMates('{p}-m-{slug}4', 'Dos pasos', 2, 3, {bl + 2}, null, '{sab}'),")
        out.append(f"        soon('{p}-m-{slug}5', 'Misión {js_str(title)}', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out.append("    ];")
    out.append("  }")
    return "\n".join(out)


def gen_lengua(prefix, grade, bl):
    p, g = prefix, grade
    units = [
        ("textos", "Comprensión lectora", f"LOMLOE · textos para {g}º.", f"{p}-l-c1"),
        ("orto", "Ortografía", f"LOMLOE · reglas ortográficas de {g}º.", f"{p}-l-c2"),
        ("gram", "Sintaxis y literatura", f"LOMLOE · gramática y géneros literarios.", f"{p}-l-c3"),
    ]
    if g == 5:
        units[0] = ("arg", "Textos argumentativos", "LOMLOE · opinión y causa-consecuencia.", f"{p}-l-c1")
        units[2] = ("gram", "Gramática avanzada", "LOMLOE · oración compuesta.", f"{p}-l-c3")
    if g == 6:
        units[0] = ("anal", "Análisis de textos", "LOMLOE · ideas y argumentos.", f"{p}-l-c1")
        units[1] = ("red", "Ortografía y redacción", "LOMLOE · textos formales.", f"{p}-l-c2")
        units[2] = ("lit", "Literatura española", "LOMLOE · autores y géneros.", f"{p}-l-c3")
    out = [f"  function primaria{g}Lengua() {{"]
    out.append("    return [")
    for slug, title, desc, sab in units:
        out.append(f"      unit('{p}-l-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveLengua('{p}-l-{slug}1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', {bl}, '{sab}'),")
        out.append(f"        liveLenguaRot('{p}-l-{slug}2', 'Ordena la frase', 2, 2, 'Sintaxis', {bl}, '{sab}'),")
        out.append(f"        liveLenguaRot('{p}-l-{slug}3', 'Completa', 1, 3, 'Ortografía', {bl}, '{sab}'),")
        out.append(f"        soon('{p}-l-{slug}4', 'Dictado', 'listening', 4),")
        out.append(f"        soon('{p}-l-{slug}5', 'Misión lengua', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out.append("    ];")
    out.append("  }")
    return "\n".join(out)


def gen_ingles(prefix, grade, bl):
    p, g = prefix, grade
    titles = {
        4: [
            ("past", "Past simple", "LOMLOE · acciones pasadas.", f"{p}-i-e1"),
            ("comp", "Comparatives", "LOMLOE · comparar en inglés.", f"{p}-i-e2"),
            ("read", "Reading comprehension", "LOMLOE · leer y responder.", f"{p}-i-e3"),
        ],
        5: [
            ("perf", "Present perfect", "LOMLOE · experiencias recientes.", f"{p}-i-e1"),
            ("fut", "Future forms", "LOMLOE · will y going to.", f"{p}-i-e2"),
            ("oral", "Oral presentations", "LOMLOE · exponer ideas.", f"{p}-i-e3"),
        ],
        6: [
            ("cond", "Conditionals and modals", "LOMLOE · hipótesis y obligación.", f"{p}-i-e1"),
            ("pass", "Passive voice", "LOMLOE · transformaciones.", f"{p}-i-e2"),
            ("proj", "Project language", "LOMLOE · vocabulario académico.", f"{p}-i-e3"),
        ],
    }[g]
    out = [f"  function primaria{g}Ingles() {{"]
    out.append("    return [")
    for slug, title, desc, sab in titles:
        out.append(f"      unit('{p}-i-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveIngles('{p}-i-{slug}1', 'Vocab drill', 0, 1, {bl}, null, '{sab}'),")
        out.append(f"        liveIngles('{p}-i-{slug}2', 'Listen & tap', 1, 2, {bl}, null, '{sab}'),")
        out.append(f"        soon('{p}-i-{slug}3', 'Fill the gap', 'typing', 3),")
        out.append(f"        soon('{p}-i-{slug}4', 'Grammar quiz', 'quiz', 4),")
        out.append(f"        soon('{p}-i-{slug}5', 'English mission', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out.append("    ];")
    out.append("  }")
    return "\n".join(out)


def gen_naturales(prefix, grade, bl):
    p, g = prefix, grade
    themes = {
        4: [
            ("cel", "Célula y clasificación", "LOMLOE · seres vivos y funciones vitales.", f"{p}-n-b1"),
            ("sal", "Salud y consumo", "LOMLOE · hábitos y alimentación.", f"{p}-n-b2"),
            ("fuer", "Fuerzas y máquinas", "LOMLOE · movimiento y energía mecánica.", f"{p}-n-b3"),
        ],
        5: [
            ("rep", "Reproducción y herencia", "LOMLOE · ciclos vitales.", f"{p}-n-b1"),
            ("eco", "Ecosistemas", "LOMLOE · medio ambiente y sostenibilidad.", f"{p}-n-b2"),
            ("luz", "Luz, sonido y electricidad", "LOMLOE · ondas y circuitos.", f"{p}-n-b3"),
        ],
        6: [
            ("evo", "Evolución y biodiversidad", "LOMLOE · adaptación y conservación.", f"{p}-n-b1"),
            ("cuer", "Cuerpo humano avanzado", "LOMLOE · sistemas y salud.", f"{p}-n-b2"),
            ("ene", "Energía y sostenibilidad", "LOMLOE · recursos y clima.", f"{p}-n-b3"),
        ],
    }[g]
    out = [f"  function primaria{g}Naturales() {{"]
    out.append("    return [")
    for slug, title, desc, sab in themes:
        out.append(f"      unit('{p}-n-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}1', 'Preguntas', 1, 2, 'Ciencia', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}2', 'Verdadero o falso', 2, 2, 'Lee', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}3', 'Clasifica', 0, 3, 'Naturales', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}4', 'Experimento virtual', 1, 3, 'Comprensión', {bl + 1}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}5', 'Reto científico', 2, 4, 'Misión', {bl + 1}, '{sab}')")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out.append("    ];")
    out.append("  }")
    return "\n".join(out)


def gen_sociales(prefix, grade, bl):
    p, g = prefix, grade
    themes = {
        4: [
            ("der", "Derechos y participación", "LOMLOE · democracia local.", f"{p}-s-b1"),
            ("auto", "Autonomías y economía", "LOMLOE · territorio y recursos.", f"{p}-s-b2"),
            ("mod", "Edad Moderna temprana", "LOMLOE · descubrimientos.", f"{p}-s-b3"),
        ],
        5: [
            ("gob", "Gobierno y democracia", "LOMLOE · instituciones.", f"{p}-s-b1"),
            ("geo", "Recursos y población", "LOMLOE · geografía humana.", f"{p}-s-b2"),
            ("cont", "Edad Moderna y Contemporánea", "LOMLOE · revoluciones.", f"{p}-s-b3"),
        ],
        6: [
            ("ue", "Constitución y UE", "LOMLOE · ciudadanía europea.", f"{p}-s-b1"),
            ("mund", "Geografía mundial", "LOMLOE · continentes y globalización.", f"{p}-s-b2"),
            ("sig", "Historia contemporánea", "LOMLOE · siglo XX.", f"{p}-s-b3"),
        ],
    }[g]
    out = [f"  function primaria{g}Sociales() {{"]
    out.append("    return [")
    for slug, title, desc, sab in themes:
        out.append(f"      unit('{p}-s-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveSocialesRot('{p}-s-{slug}1', 'Lee y responde', 1, 2, 'Historia', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}2', 'Mapas', 0, 2, 'Geografía', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}3', 'Ordena', 2, 3, 'Convivencia', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}4', 'Debate corto', 1, 3, 'Ciudadanía', {bl + 1}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}5', 'Misión social', 2, 4, 'Reto', {bl + 1}, '{sab}')")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out.append("    ];")
    out.append("  }")
    return "\n".join(out)


def gen_daily(grade, bonus):
    return f"  function primaria{grade}Daily() {{\n    return mapDailyFromP1('p{grade}', {bonus});\n  }}"


def gen_build_block():
    parts = []
    configs = [(4, 4, 9, 3), (5, 5, 10, 4), (6, 6, 11, 5)]
    for g, bl_math, bl_lang, daily_bonus in configs:
        p = f"p{g}"
        parts.append(f"  /** —— {g}º Primaria (LOMLOE RD 157/2022) —— */")
        parts.append(gen_math(p, g, bl_math))
        parts.append("")
        parts.append(gen_lengua(p, g, bl_lang))
        parts.append("")
        parts.append(gen_ingles(p, g, bl_math))
        parts.append("")
        parts.append(gen_naturales(p, g, bl_lang))
        parts.append("")
        parts.append(gen_sociales(p, g, bl_lang))
        parts.append("")
        parts.append(gen_daily(g, daily_bonus))
        parts.append("")
    return "\n".join(parts)


def patch_lomloe_ref():
    path = ROOT / "js/lipa-lomloe-ref.js"
    text = path.read_text(encoding="utf-8")
    marker = "    'primaria-3': {"
    end_marker = "  };"
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit("primaria-3 block not found")
    if "'primaria-4':" in text:
        print("LOMLOE ref already has primaria-4, skipping insert")
        return
    close = text.rfind("    'primaria-3'", 0, text.find("  var SABER_INDEX"))
    block_end = text.find("\n  };", close)
    if block_end < 0:
        raise SystemExit("BY_COURSE close not found")
    insert_at = block_end + 1  # after closing brace line of primaria-3
    # insert before `  };` closing BY_COURSE
    insert_at = text.rfind("  };", 0, text.find("  var SABER_INDEX"))
    block = gen_lomloe_block() + "\n"
    path.write_text(text[:insert_at] + block + text[insert_at:], encoding="utf-8")
    print("Patched lipa-lomloe-ref.js")


def patch_build():
    path = ROOT / "js/lipa-curriculum-build.js"
    text = path.read_text(encoding="utf-8")
    # Remove legacy naturales/sociales remap chain (superseded by LOMLOE units below).
    legacy_start = text.find("  function primaria4Naturales()")
    legacy_end = text.find("  function infSid(")
    if legacy_start >= 0 and legacy_end > legacy_start:
        text = text[:legacy_start] + text[legacy_end:]
    start = text.find("  function primaria4Lengua()")
    end = text.find("  function eso2Math()")
    if start < 0 or end < 0:
        raise SystemExit("build markers not found")
    new_block = gen_build_block()
    path.write_text(text[:start] + new_block + text[end:], encoding="utf-8")
    print("Patched lipa-curriculum-build.js")


def main():
    patch_lomloe_ref()
    patch_build()


if __name__ == "__main__":
    main()
