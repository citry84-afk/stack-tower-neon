#!/usr/bin/env bash
# Preparación técnica GSC tras cambios en sitemap (ejecutar desde raíz del repo).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== fix sitemap =="
python3 scripts/fix-sitemap.py

echo "== validate URLs (curl) =="
fail=0
while IFS= read -r url; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" -L --max-time 15 "$url" || echo "000")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code $url"
    fail=$((fail + 1))
  fi
done < <(python3 -c "import re; from pathlib import Path; [print(u) for u in re.findall(r'<loc>(.*?)</loc>', Path('sitemap.xml').read_text())]")
if [[ "$fail" -gt 0 ]]; then
  echo "$fail URLs con error — revisar antes de deploy"
  exit 1
fi
echo "OK: todas las URLs del sitemap responden 200"

echo "== IndexNow =="
python3 scripts/submit-indexnow.py 2>/dev/null || \
  curl -sS -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "
import json,re
from pathlib import Path
urls=re.findall(r'<loc>([^<]+)</loc>', Path('sitemap.xml').read_text())
print(json.dumps({
  'host':'lipastudios.com',
  'key':'a1bf3fb2f48c78dff2a3ed0cfdf42fec',
  'keyLocation':'https://lipastudios.com/a1bf3fb2f48c78dff2a3ed0cfdf42fec.txt',
  'urlList': urls[:100],
}))
")" -w "\nIndexNow HTTP %{http_code}\n"

echo "== netlify deploy =="
netlify deploy --prod

echo ""
echo "GSC manual (cuenta verificada):"
echo "  1. Sitemaps → https://lipastudios.com/sitemap.xml"
echo "  2. Inspección → scripts/gsc-priority-urls.txt (máx. 10/día)"
