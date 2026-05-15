#!/usr/bin/env bash
# Ping IndexNow for lipastudios.com (uses curl; works when Python SSL fails locally).
set -euo pipefail
HOST="lipastudios.com"
KEY="a1bf3fb2f48c78dff2a3ed0cfdf42fec"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
URLS='[
  "https://lipastudios.com/",
  "https://lipastudios.com/jugar.html",
  "https://lipastudios.com/entrenador-reflejos.html",
  "https://lipastudios.com/test-reflejos.html",
  "https://lipastudios.com/aim-trainer-neon.html",
  "https://lipastudios.com/grid-reflejos-neon.html",
  "https://lipastudios.com/toque-flash-neon.html",
  "https://lipastudios.com/esquiva-neon.html",
  "https://lipastudios.com/blog/reflejos-5-minutos.html"
]'
PAYLOAD=$(printf '{"host":"%s","key":"%s","keyLocation":"%s","urlList":%s}' "$HOST" "$KEY" "$KEY_LOCATION" "$URLS")
for endpoint in "https://api.indexnow.org/indexnow" "https://www.bing.com/indexnow"; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "$endpoint" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$PAYLOAD")
  echo "$endpoint -> HTTP $code"
done
