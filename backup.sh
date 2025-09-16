#!/bin/bash
# STACK TOWER - SISTEMA DE RESPALDO AUTOMÁTICO
# Uso: ./backup.sh [mensaje]

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 STACK TOWER - SISTEMA DE RESPALDO${NC}"

# Crear tag de respaldo con timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TAG_NAME="stable-$TIMESTAMP"
MESSAGE=${1:-"Backup automático - $TIMESTAMP"}

echo -e "${GREEN}📦 Creando respaldo: $TAG_NAME${NC}"

# Crear tag
git tag -a "$TAG_NAME" -m "$MESSAGE"

# Push del tag
git push origin "$TAG_NAME"

echo -e "${GREEN}✅ Respaldo creado: $TAG_NAME${NC}"
echo -e "${YELLOW}💡 Para restaurar: git reset --hard $TAG_NAME${NC}"

# Mostrar últimos 5 respaldos
echo -e "${YELLOW}📋 Últimos 5 respaldos:${NC}"
git tag -l "stable-*" | tail -5

echo -e "${GREEN}🎮 Listo para deploy seguro${NC}"
