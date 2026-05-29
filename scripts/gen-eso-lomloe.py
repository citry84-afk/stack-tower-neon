#!/usr/bin/env python3
"""Generate LOMLOE ref + curriculum build blocks for ESO 1-2."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SABER_DEFS = {
    "eso-1": {
        "matematicas": [
            ("eso1-m-a1", "numeros", "Números racionales", "Fracciones, decimales y operaciones combinadas."),
            ("eso1-m-a2", "operaciones", "Potencias y raíces", "Potencias de exponente natural y raíz cuadrada."),
            ("eso1-m-a3", "problemas-numericos", "Ecuaciones de 1º grado", "Incógnitas y problemas algebraicos."),
            ("eso1-m-b1", "operaciones", "Proporcionalidad y porcentajes", "Regla de tres y variación proporcional."),
            ("eso1-m-c1", "formas", "Geometría plana", "Triángulos, ángulos y construcciones."),
            ("eso1-m-a4", "operaciones", "Estadística básica", "Frecuencias, media y gráficos."),
        ],
        "lenguaje": [
            ("eso1-l-c1", "comprension", "Análisis literario", "Géneros, figuras y comprensión profunda."),
            ("eso1-l-c2", "ortografia", "Gramática y sintaxis", "Oración, morfología y ortografía."),
            ("eso1-l-c3", "escritura", "Expresión escrita", "Textos argumentativos y narrativos."),
        ],
        "ingles": [
            ("eso1-i-e1", "ingles-vocabulario", "Past tenses", "Pasado simple y continuo."),
            ("eso1-i-e2", "ingles-vocabulario", "Descriptions", "Adjetivos, comparativos y superlativos."),
            ("eso1-i-e3", "ingles-oral", "Oral interaction", "Diálogos y comprensión oral."),
        ],
        "naturales": [
            ("eso1-n-b1", "naturales-seres-vivos", "La célula y seres vivos", "Biología: estructura y funciones vitales."),
            ("eso1-n-b2", "naturales-materia", "Materia y reacciones", "Física y química: estados y mezclas."),
            ("eso1-n-b3", "naturales-materia", "La Tierra y el universo", "Geología y astronomía básica."),
        ],
        "sociales": [
            ("eso1-s-b1", "sociales-geografia", "Geografía de España", "Relieve, clima y paisaje."),
            ("eso1-s-b2", "sociales-historia", "Sociedades preindustriales", "Edad Antigua y Edad Media."),
            ("eso1-s-b3", "sociales-convivencia", "Ciudadanía y derechos", "Constitución y convivencia democrática."),
        ],
        "brain-gym-diario": [
            ("eso1-d-01", "atencion", "Rutina diaria ESO", "Mates, lengua, inglés y reflejos en 7 min."),
        ],
    },
    "eso-2": {
        "matematicas": [
            ("eso2-m-a1", "operaciones", "Funciones lineales", "Pendiente, intercepto y gráficas."),
            ("eso2-m-a2", "problemas-numericos", "Sistemas de ecuaciones", "Resolución algebraica y gráfica."),
            ("eso2-m-a3", "formas", "Teorema de Pitágoras", "Triángulos rectángulos y distancias."),
            ("eso2-m-b1", "operaciones", "Probabilidad", "Experimentos aleatorios y frecuencias."),
            ("eso2-m-c1", "formas", "Geometría en el espacio", "Prismas, pirámides y volumen."),
            ("eso2-m-a4", "numeros", "Números reales", "Irracionales y recta real."),
        ],
        "lenguaje": [
            ("eso2-l-c1", "lectura", "Movimientos literarios", "Romanticismo, realismo y generación del 98."),
            ("eso2-l-c2", "comprension", "Análisis sintáctico", "Oraciones compuestas y subordinadas."),
            ("eso2-l-c3", "escritura", "Comunicación audiovisual", "Medios, lenguaje y opinión."),
        ],
        "ingles": [
            ("eso2-i-e1", "ingles-vocabulario", "Reported speech", "Estilo indirecto y verbos de reporting."),
            ("eso2-i-e2", "ingles-vocabulario", "Relative clauses", "Defining y non-defining clauses."),
            ("eso2-i-e3", "ingles-oral", "Debate and opinion", "Argumentar y expresar acuerdo."),
        ],
        "naturales": [
            ("eso2-n-b1", "naturales-seres-vivos", "Genética y herencia", "ADN, genes y variabilidad."),
            ("eso2-n-b2", "naturales-materia", "Fuerzas y energía", "Movimiento, trabajo y electricidad."),
            ("eso2-n-b3", "naturales-salud", "Salud y hábitos", "Prevención y bienestar adolescente."),
        ],
        "sociales": [
            ("eso2-s-b1", "sociales-geografia", "Geografía humana", "Población, urbanización y globalización."),
            ("eso2-s-b2", "sociales-historia", "Edad Contemporánea", "Revoluciones y conflictos del s. XIX-XX."),
            ("eso2-s-b3", "sociales-convivencia", "Economía y consumo", "Mercado, oferta y demanda básica."),
        ],
        "brain-gym-diario": [
            ("eso2-d-01", "atencion", "Rutina diaria ESO", "Mates, lengua, inglés y reflejos en 7 min."),
        ],
    },
}

MATH_UNITS = {
    1: [
        ("rac", "Números racionales", "LOMLOE · fracciones, decimales y operaciones.", "eso1-m-a1"),
        ("pot", "Potencias y raíces", "LOMLOE · potencias y raíz cuadrada.", "eso1-m-a2"),
        ("ecu", "Ecuaciones de 1º grado", "LOMLOE · incógnitas y álgebra básica.", "eso1-m-a3"),
        ("prop", "Proporcionalidad", "LOMLOE · porcentajes y regla de tres.", "eso1-m-b1"),
        ("stat", "Estadística", "LOMLOE · frecuencias, media y gráficos.", "eso1-m-a4"),
    ],
    2: [
        ("lin", "Funciones lineales", "LOMLOE · pendiente, intercepto y gráficas.", "eso2-m-a1"),
        ("sis", "Sistemas de ecuaciones", "LOMLOE · resolución algebraica y gráfica.", "eso2-m-a2"),
        ("pit", "Teorema de Pitágoras", "LOMLOE · triángulos rectángulos.", "eso2-m-a3"),
        ("prob", "Probabilidad", "LOMLOE · experimentos aleatorios.", "eso2-m-b1"),
        ("real", "Números reales", "LOMLOE · irracionales y recta real.", "eso2-m-a4"),
    ],
}

LENGUA_UNITS = {
    1: [
        ("lit", "Análisis literario", "LOMLOE · géneros, figuras y comprensión.", "eso1-l-c1"),
        ("gram", "Gramática y sintaxis", "LOMLOE · morfología y ortografía.", "eso1-l-c2"),
        ("esc", "Expresión escrita", "LOMLOE · textos argumentativos.", "eso1-l-c3"),
    ],
    2: [
        ("mov", "Movimientos literarios", "LOMLOE · romanticismo y realismo.", "eso2-l-c1"),
        ("sin", "Análisis sintáctico", "LOMLOE · oraciones compuestas.", "eso2-l-c2"),
        ("av", "Comunicación audiovisual", "LOMLOE · medios y opinión.", "eso2-l-c3"),
    ],
}

INGLES_UNITS = {
    1: [
        ("past", "Past tenses", "LOMLOE · pasado simple y continuo.", "eso1-i-e1"),
        ("desc", "Descriptions", "LOMLOE · comparativos y superlativos.", "eso1-i-e2"),
        ("oral", "Oral interaction", "LOMLOE · diálogos y listening.", "eso1-i-e3"),
    ],
    2: [
        ("rep", "Reported speech", "LOMLOE · estilo indirecto.", "eso2-i-e1"),
        ("rel", "Relative clauses", "LOMLOE · oraciones de relativo.", "eso2-i-e2"),
        ("deb", "Debate and opinion", "LOMLOE · argumentar en inglés.", "eso2-i-e3"),
    ],
}

NATURALES_UNITS = {
    1: [
        ("cel", "La célula y seres vivos", "LOMLOE · biología: estructura celular.", "eso1-n-b1"),
        ("mat", "Materia y reacciones", "LOMLOE · física y química básica.", "eso1-n-b2"),
        ("tie", "La Tierra y el universo", "LOMLOE · geología y astronomía.", "eso1-n-b3"),
    ],
    2: [
        ("gen", "Genética y herencia", "LOMLOE · ADN y variabilidad.", "eso2-n-b1"),
        ("fue", "Fuerzas y energía", "LOMLOE · movimiento y electricidad.", "eso2-n-b2"),
        ("sal", "Salud y hábitos", "LOMLOE · prevención adolescente.", "eso2-n-b3"),
    ],
}

SOCIALES_UNITS = {
    1: [
        ("geo", "Geografía de España", "LOMLOE · relieve, clima y paisaje.", "eso1-s-b1"),
        ("hist", "Sociedades preindustriales", "LOMLOE · Edad Antigua y Media.", "eso1-s-b2"),
        ("ciu", "Ciudadanía y derechos", "LOMLOE · Constitución y convivencia.", "eso1-s-b3"),
    ],
    2: [
        ("hum", "Geografía humana", "LOMLOE · población y globalización.", "eso2-s-b1"),
        ("cont", "Edad Contemporánea", "LOMLOE · revoluciones s. XIX-XX.", "eso2-s-b2"),
        ("eco", "Economía y consumo", "LOMLOE · mercado y oferta.", "eso2-s-b3"),
    ],
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


def gen_math(n, bl):
    p = f"eso{n}"
    out = [f"  function eso{n}Math() {{", "    return ["]
    for slug, title, desc, sab in MATH_UNITS[n]:
        out.append(f"      unit('{p}-m-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveGame('{p}-m-{slug}1', 'Cálculo express', 'neon-calculo', 3, {bl}, null, '{sab}'),")
        out.append(f"        liveGame('{p}-m-{slug}2', 'Tablas flash', 'tablas-relampago', 2, {bl}, null, '{sab}'),")
        out.append(f"        liveMates('{p}-m-{slug}3', 'Álgebra mental', 2, 3, {bl + 1}, null, '{sab}'),")
        out.append(f"        liveMates('{p}-m-{slug}4', 'Problemas', 3, 4, {bl + 1}, null, '{sab}'),")
        out.append(f"        soon('{p}-m-{slug}5', 'Misión {js_str(title)}', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out += ["    ];", "  }"]
    return "\n".join(out)


def gen_lengua(n, bl):
    p = f"eso{n}"
    out = [f"  function eso{n}Lengua() {{", "    return ["]
    for slug, title, desc, sab in LENGUA_UNITS[n]:
        out.append(f"      unit('{p}-l-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveLengua('{p}-l-{slug}1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', {bl}, '{sab}'),")
        out.append(f"        liveLenguaRot('{p}-l-{slug}2', 'Ordena y corrige', 2, 3, 'Sintaxis', {bl}, '{sab}'),")
        out.append(f"        liveLenguaRot('{p}-l-{slug}3', 'Completa', 1, 4, 'Ortografía', {bl + 1}, '{sab}'),")
        out.append(f"        soon('{p}-l-{slug}4', 'Redacción', 'typing', 4),")
        out.append(f"        soon('{p}-l-{slug}5', 'Misión lengua', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out += ["    ];", "  }"]
    return "\n".join(out)


def gen_ingles(n, bl):
    p = f"eso{n}"
    out = [f"  function eso{n}Ingles() {{", "    return ["]
    for slug, title, desc, sab in INGLES_UNITS[n]:
        out.append(f"      unit('{p}-i-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveIngles('{p}-i-{slug}1', 'Vocab drill', 0, 2, {bl}, null, '{sab}'),")
        out.append(f"        liveIngles('{p}-i-{slug}2', 'Listen & tap', 1, 3, {bl}, null, '{sab}'),")
        out.append(f"        soon('{p}-i-{slug}3', 'Fill the gap', 'typing', 3),")
        out.append(f"        soon('{p}-i-{slug}4', 'Grammar quiz', 'quiz', 4),")
        out.append(f"        soon('{p}-i-{slug}5', 'English mission', 'quiz', 5)")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out += ["    ];", "  }"]
    return "\n".join(out)


def gen_naturales(n, bl):
    p = f"eso{n}"
    out = [f"  function eso{n}Naturales() {{", "    return ["]
    for slug, title, desc, sab in NATURALES_UNITS[n]:
        out.append(f"      unit('{p}-n-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}1', 'Preguntas', 1, 3, 'Ciencia', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}2', 'Verdadero o falso', 2, 3, 'Lee', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}3', 'Clasifica', 0, 4, 'Naturales', {bl}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}4', 'Experimento virtual', 1, 4, 'Comprensión', {bl + 1}, '{sab}'),")
        out.append(f"        liveNaturalesRot('{p}-n-{slug}5', 'Reto científico', 2, 5, 'Misión', {bl + 1}, '{sab}')")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out += ["    ];", "  }"]
    return "\n".join(out)


def gen_sociales(n, bl):
    p = f"eso{n}"
    out = [f"  function eso{n}Sociales() {{", "    return ["]
    for slug, title, desc, sab in SOCIALES_UNITS[n]:
        out.append(f"      unit('{p}-s-{slug}', '{js_str(title)}', '{js_str(desc)}', [")
        out.append(f"        liveSocialesRot('{p}-s-{slug}1', 'Lee y responde', 1, 3, 'Historia', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}2', 'Mapas', 0, 3, 'Geografía', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}3', 'Ordena', 2, 4, 'Convivencia', {bl}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}4', 'Debate corto', 1, 4, 'Ciudadanía', {bl + 1}, '{sab}'),")
        out.append(f"        liveSocialesRot('{p}-s-{slug}5', 'Misión social', 2, 5, 'Reto', {bl + 1}, '{sab}')")
        out.append(f"      ], {{ saberIds: ['{sab}'] }}),")
    out += ["    ];", "  }"]
    return "\n".join(out)


def gen_daily(n, bl, sab_daily):
    p = f"eso{n}"
    sab_m = f"eso{n}-m-a3" if n == 1 else f"eso{n}-m-a2"
    sab_i = f"eso{n}-i-e1"
    sab_l = f"eso{n}-l-c1"
    return f"""  function eso{n}Daily() {{
    return [
      unit('{p}-d-rutina', 'Brain Gym diario', 'LOMLOE · mates, idiomas y reflejos para ESO.', [
        liveGame('{p}-d1', 'Cálculo express', 'neon-calculo', 3, {bl}, null, '{sab_m}'),
        liveGame('{p}-d2', 'Tablas flash', 'tablas-relampago', 2, {bl}, null, '{sab_m}'),
        liveGame('{p}-d3', 'English drill', 'neon-palabras', 2, {bl}, null, '{sab_i}'),
        liveLengua('{p}-d4', 'Mini lectura', 'neon-lectura', 2, 'Comprensión', {bl + 1}, '{sab_l}'),
        tagSaber(liveReflex('{p}-d5', 'Reflejos finales', 'reaction-test', 2), '{sab_daily}')
      ], {{ saberIds: ['{sab_daily}'] }})
    ];
  }}"""


def gen_eso_block(n):
    bl_math = 8 if n == 1 else 9
    bl_lang = 10 if n == 1 else 11
    sab_daily = f"eso{n}-d-01"
    parts = [
        f"  /** —— {n}º ESO (LOMLOE RD 243/2022) —— */",
        gen_math(n, bl_math),
        "",
        gen_lengua(n, bl_lang),
        "",
        gen_ingles(n, bl_math),
        "",
        gen_naturales(n, bl_lang),
        "",
        gen_sociales(n, bl_lang),
        "",
        gen_daily(n, bl_math, sab_daily),
        "",
    ]
    return "\n".join(parts)


def patch_lomloe_ref():
    path = ROOT / "js/lipa-lomloe-ref.js"
    text = path.read_text(encoding="utf-8")
    if "'eso-1':" in text:
        print("LOMLOE ref already has eso-1, skipping insert")
        return
    insert_at = text.rfind("  };", 0, text.find("  var SABER_INDEX"))
    if insert_at < 0:
        raise SystemExit("BY_COURSE close not found")
    block = gen_lomloe_block() + "\n"
    path.write_text(text[:insert_at] + block + text[insert_at:], encoding="utf-8")
    print("Patched lipa-lomloe-ref.js")


def patch_build():
    path = ROOT / "js/lipa-curriculum-build.js"
    text = path.read_text(encoding="utf-8")

    start1 = text.find("  function eso1Math()")
    end1 = text.find("  function remapUnits(")
    if start1 < 0 or end1 < 0:
        raise SystemExit("eso1 markers not found")
    block1 = gen_eso_block(1)
    text = text[:start1] + block1 + text[end1:]

    start2 = text.find("  function eso2Math()")
    end2 = text.find("  function esoCourse(")
    if start2 < 0 or end2 < 0:
        raise SystemExit("eso2 markers not found")
    block2 = gen_eso_block(2)
    text = text[:start2] + block2 + text[end2:]

    path.write_text(text, encoding="utf-8")
    print("Patched lipa-curriculum-build.js")


def main():
    patch_lomloe_ref()
    patch_build()


if __name__ == "__main__":
    main()
