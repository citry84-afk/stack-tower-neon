#!/usr/bin/env bash
# Recordatorio: ejecutar tras desplegar o cuando el usuario pida «indexar GSC».
set -euo pipefail
echo "=== GSC — lipastudios.com ==="
echo "Cuenta: lipastudios4@gmail.com"
echo ""
echo "URLs pendientes (máx. 10/día):"
grep -E '^https://' "$(dirname "$0")/gsc-priority-urls.txt" | head -10
echo ""
echo "Manual: Inspección de URLs → Solicitar indexación"
echo "Automático (agente): usar navegador en /u/1/search-console"
echo ""
echo "Sin cuota:"
bash "$(dirname "$0")/ping-indexnow.sh"
