#!/bin/bash
# STACK TOWER - DEPLOY SEGURO CON TESTING MÓVIL
# Uso: ./deploy-safe.sh [mensaje]

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 STACK TOWER - DEPLOY SEGURO${NC}"

# 1. Crear respaldo automático
echo -e "${YELLOW}📦 Paso 1: Creando respaldo...${NC}"
./backup.sh "Pre-deploy backup - $(date)"

# 2. Verificar que no hay cambios sin commit
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ ERROR: Hay cambios sin commit${NC}"
    echo -e "${YELLOW}💡 Ejecuta: git add . && git commit -m 'tu mensaje'${NC}"
    exit 1
fi

# 3. Deploy a staging
echo -e "${YELLOW}📤 Paso 2: Deploy a staging...${NC}"
netlify deploy --dir . --site stack-tower-neon2

# 4. Testing móvil obligatorio
echo -e "${YELLOW}📱 Paso 3: TESTING MÓVIL OBLIGATORIO${NC}"
echo -e "${RED}⚠️  DEBES PROBAR EN MÓVIL REAL ANTES DE CONTINUAR${NC}"
echo -e "${YELLOW}🔗 URL de staging: https://stack-tower-neon2.netlify.app${NC}"
echo -e "${YELLOW}📋 Checklist móvil:${NC}"
echo -e "   ✅ Botón JUGAR funciona"
echo -e "   ✅ Botón AUDIO funciona" 
echo -e "   ✅ Botón APILAR funciona"
echo -e "   ✅ Botón PAUSA funciona"
echo -e "   ✅ Botón MENU funciona"
echo -e "   ✅ Botón COMPARTIR funciona"
echo -e "   ✅ Juego se puede jugar completo"

read -p "¿Funciona TODO en móvil? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ DEPLOY CANCELADO - Arregla los problemas móviles primero${NC}"
    echo -e "${YELLOW}💡 Para rollback: git reset --hard stable-$(date +%Y%m%d)*${NC}"
    exit 1
fi

# 5. Deploy a producción
echo -e "${GREEN}🚀 Paso 4: Deploy a producción...${NC}"
netlify deploy --prod --dir .

echo -e "${GREEN}✅ DEPLOY COMPLETADO CON ÉXITO${NC}"
echo -e "${BLUE}🎮 Juego disponible en: https://stack-tower-neon2.netlify.app${NC}"
echo -e "${YELLOW}📦 Respaldo creado: stable-$(date +%Y%m%d)*${NC}"
