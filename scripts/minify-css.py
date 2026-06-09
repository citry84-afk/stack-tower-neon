#!/usr/bin/env python3
"""Genera .min.css a partir de los CSS más pesados del sitio."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'css'
TARGETS = [
    'lipa-ui.css',
    'brain-design-system.css',
    'brain-gym.css',
    'curriculum.css',
    'arcade-hub.css',
    'site-nav.css',
]


def minify_css(text: str) -> str:
    text = re.sub(r'/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', text)
    text = text.replace(';}', '}')
    return text.strip()


def main():
    for name in TARGETS:
        src = ROOT / name
        if not src.exists():
            print('skip (missing):', name)
            continue
        raw = src.read_text(encoding='utf-8')
        out = minify_css(raw)
        dst = ROOT / name.replace('.css', '.min.css')
        dst.write_text(out, encoding='utf-8')
        pct = round(100 - len(out) / len(raw) * 100) if raw else 0
        print(f'{name}: {len(raw)} → {len(out)} bytes (-{pct}%)')


if __name__ == '__main__':
    main()
