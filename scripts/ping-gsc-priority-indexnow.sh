#!/usr/bin/env bash
# Ping IndexNow for URLs listed in gsc-priority-urls.txt (current tanda).
set -euo pipefail
HOST="lipastudios.com"
KEY="a1bf3fb2f48c78dff2a3ed0cfdf42fec"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URLS=$(grep -E '^https://' "$ROOT/scripts/gsc-priority-urls.txt" | python3 -c 'import sys,json; print(json.dumps([l.strip() for l in sys.stdin]))')
PAYLOAD=$(printf '{"host":"%s","key":"%s","keyLocation":"%s","urlList":%s}' "$HOST" "$KEY" "$KEY_LOCATION" "$URLS")
for endpoint in "https://api.indexnow.org/indexnow" "https://www.bing.com/indexnow"; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "$endpoint" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$PAYLOAD")
  echo "$endpoint -> HTTP $code"
done
count=$(echo "$URLS" | python3 -c 'import sys,json; print(len(json.load(sys.stdin)))')
echo "URLs: $count"
