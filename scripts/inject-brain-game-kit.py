#!/usr/bin/env python3
"""Añade lipa-mascot + lipa-game-feedback + lipa-game-hint a páginas brain."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FULL_KIT = (
    '  <script src="/js/lipa-mascot.js"></script>\n'
    '  <script src="/js/lipa-game-feedback.js"></script>\n'
    '  <script src="/js/lipa-game-hint.js"></script>\n'
)
HINT_ONLY = '  <script src="/js/lipa-game-hint.js"></script>\n'
PAGES = sorted(ROOT.glob('neon-*.html')) + [ROOT / 'tablas-relampago.html']


def main():
    for path in PAGES:
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        if 'lipa-game-hint.js' in text:
            continue
        if 'lipa-game-feedback.js' in text:
            text = text.replace(
                '<script src="/js/lipa-game-feedback.js"></script>',
                '<script src="/js/lipa-game-feedback.js"></script>\n' + HINT_ONLY,
                1,
            )
            path.write_text(text, encoding='utf-8')
            print('hint+', path.name)
            continue
        marker = '<script src="/js/lipa-brain-core.js"></script>'
        if marker in text:
            text = text.replace(marker, FULL_KIT + marker, 1)
        else:
            idx = text.find('<script src="/js/neon-')
            if idx == -1:
                print('skip', path.name)
                continue
            line_end = text.find('</script>', idx) + len('</script>')
            text = text[:line_end] + '\n' + FULL_KIT + text[line_end:]
        path.write_text(text, encoding='utf-8')
        print('full', path.name)


if __name__ == '__main__':
    main()
