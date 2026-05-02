# Deploy automático de lipastudios.com

**Criterio:** Trabajas en este repo (`stack-tower-neon`). Netlify bien configurado = **cada `git push` a `main`** publica en `lipastudios.com` sin tocar el panel.

Netlify **ya** despliega solo con push a `main` del **repo que tengas enlazado**. El follón viene de mezclar **dos repos** sin unirlos.

---

## Opción A — Recomendada (un solo origen, sin secretos)

**Qué hace:** Netlify mira directamente **este** repositorio.

1. Netlify → sitio **lipastudios.com** → **Project configuration** → **Build & deploy**.
2. En **Continuous deployment**, enlaza el repo **`citry84-afk/stack-tower-neon`** (o **Change linked repository** si ya hay otro).
3. Deja **Branch**: `main`, **Build command** vacío o el de `netlify.toml`, **Publish directory**: `.`.
4. A partir de ahí, **cada `git push` a `main` en stack-tower-neon** publica solo.

**Una vez hecho el cambio en Netlify**, no vuelvas a subir Drops ni dependas del otro repo para producción. Puedes dejar `lipastudios-landing` como copia o archivarlo cuando te convenza el deploy desde aquí.

## Opción B — Solo si quieres seguir con Netlify enlazado a `lipastudios-landing`

Útil si no cambias el repo en Netlify: copiar **este** `main` al otro repo con GitHub Actions.

1. Repo **stack-tower-neon** → **Settings** → **Secrets and variables** → **Actions** → secret **`LIPA_MIRROR_TOKEN`** ([PAT](https://github.com/settings/tokens) con push a `lipastudios-landing`).
2. En GitHub (web): **Actions** → **New workflow** → pegar el contenido de **`scripts/github-workflow-sync-lipa.template.yml`** como `.github/workflows/sync-to-lipastudios-landing.yml`.  
   *(No lo incluimos en el repo por defecto: algunos clientes Git OAuth no pueden subir workflows sin permiso `workflow`; créalo desde la web o usa SSH + token con ese scope.)*

Sin secret el job solo avisa y termina OK.

Si el mirror falla por historiales distintos, alinea `main` entre repos o usa la opción A.

## Comprobar

- **Netlify** → **Deploys**: debe aparecer un deploy tras el push, con el commit reciente.
- **Dominio** `lipastudios.com` no requiere cambios al cambiar solo el repo origen.
