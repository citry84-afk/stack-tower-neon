# 🛡️ STACK TOWER - PROTOCOLO DE SEGURIDAD

## ⚠️ REGLAS CRÍTICAS

1. **NUNCA** hacer deploy sin testing móvil
2. **SIEMPRE** crear respaldo antes de cambios
3. **INMEDIATAMENTE** rollback si algo falla

## 🚀 DEPLOY SEGURO

```bash
# Método recomendado (con testing móvil obligatorio)
./deploy-safe.sh "Descripción del cambio"

# Método manual (solo en emergencias)
./backup.sh "Backup manual"
git add . && git commit -m "mensaje"
netlify deploy --prod --dir .
```

## 🔄 ROLLBACK DE EMERGENCIA

```bash
# Si el juego no funciona en móvil:
git reset --hard stable-$(date +%Y%m%d)*
git push --force-with-lease origin main
netlify deploy --prod --dir .
```

## 📱 TESTING MÓVIL OBLIGATORIO

**ANTES de cada deploy, verificar:**
- ✅ Botón JUGAR funciona
- ✅ Botón AUDIO funciona  
- ✅ Botón APILAR funciona
- ✅ Botón PAUSA funciona
- ✅ Botón MENU funciona
- ✅ Botón COMPARTIR funciona
- ✅ Juego se puede jugar completo

## 🏷️ SISTEMA DE RESPALDOS

```bash
# Ver respaldos disponibles
git tag -l "stable-*"

# Restaurar a respaldo específico
git reset --hard stable-20250101_120000
git push --force-with-lease origin main
netlify deploy --prod --dir .
```

## 🚨 COMANDOS DE EMERGENCIA

```bash
# Rollback inmediato a versión que funciona
git reset --hard 26dfc84
git push --force-with-lease origin main
netlify deploy --prod --dir .

# Ver estado actual
git log --oneline -5
git status
```

## 📋 CHECKLIST PRE-DEPLOY

- [ ] Código probado en desktop
- [ ] Código probado en móvil real
- [ ] Respaldo creado
- [ ] Sin cambios sin commit
- [ ] Deploy a staging primero
- [ ] Testing móvil en staging
- [ ] Deploy a producción solo si todo funciona

## 🎯 OBJETIVO

**CERO TIEMPO DE INACTIVIDAD** para usuarios móviles.
**CERO RIESGO** de romper funcionalidad básica.
