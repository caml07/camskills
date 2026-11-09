---
name: cam-route
description: >-
  Router principal de CamSkills. Detecta la intención y el riesgo en solicitudes
  de programación, depuración, arquitectura, UI/UX, code review, seguridad,
  documentación, estudio, notas, automatización o verificación; selecciona
  únicamente las skills pertinentes y, si hay cambios de código, deriva a
  ai-native-workflow. Usar también para "cam-route", "qué skills uso",
  "elige el workflow" o "route this task". No activar para charla ni preguntas
  factuales simples.
---

# Cam Route

Encuentra **la ruta mínima que resuelve la petición**, no el máximo número de
skills que podrían participar. Esta skill decide; no sustituye las instrucciones
de las skills seleccionadas. La ruta no es autorización para cambiar de scope.

## 1. Clasificar antes de cargar skills

Lee la petición y, si existe, el repo activo. Determina:

1. **Resultado:** respuesta, investigación, plan, documento, código, revisión,
   interfaz, verificación, operación o nota.
2. **Superficie:** web, React Native/Expo, TUI/CLI, API, infraestructura,
   vault/academia u otra. Observa archivos si la tecnología importa.
3. **Riesgo:** bajo (reversible, aislado), medio (feature, estado persistente,
   varias capas) o alto (seguridad, producción, migración, datos, permisos,
   arquitectura transversal).
4. **Intención explícita:** modo tutor, solo plan, solo revisión, no cambios,
   sin commits, etc. Respeta esta intención antes de seleccionar un flujo.

Si es una pregunta sencilla sin trabajo sobre repositorio, **responde
directamente**; no leas otras skills por costumbre. Si el usuario menciona una
skill concreta, úsala como principal cuando corresponda.

## 2. Seleccionar la ruta

Consulta [route-map.md](references/route-map.md) para elegir **una ruta
primaria** y cero, una o dos skills de apoyo; aplica guardrails permanentes
cuando correspondan. Prioridad cuando hay varias necesidades:

- **La petición explícita** gana frente a inferencias.
- **Seguridad y datos** añaden gates, no sustituyen la intención principal.
- **Error reproducible** usa diagnóstico antes de implementación.
- **Interfaz** usa un driver visual específico de la plataforma, no dos.
- **Cambio de código** pasa por `ai-native-workflow` con Quick, Standard o
  Deep. Un plan sin implementación permanece en la ruta de planificación.
- **Documentación, notas y estudio** siguen su ruta y no invocan el pipeline
  de ingeniería.
- Una **skill especializada** ya instalada puede reemplazar la ruta genérica
  si encaja mejor con el objetivo (por ejemplo, `tanstack-query` para caché
  o `statechart` para máquinas de estados). Respeta las skills marcadas
  para invocación explícita y no cargues todo el catálogo para decidir.
- Si no existe un repo o no se puede ejecutar la app, conserva el flujo
  aplicable y declara qué parte de la verificación falta.

Una skill de apoyo es **condicional**, no un paso obligatorio. Lee su
`SKILL.md` solo al llegar al punto que la necesite. Si falta o no se puede
cargar, usa las herramientas presentes y declara la limitación.

## 3. Aplicar sin saturar el contexto

- **Quick:** una skill principal, validación pequeña. Sin entrevistas, paneles
  de agentes ni reviews redundantes.
- **Standard:** la skill principal y hasta dos apoyos relevantes, cargados
  por fase. Usa `ai-native-workflow` si se implementa código.
- **Deep:** activa solo los especialistas justificados por riesgo o
  complejidad. Puede requerir varias fases y un review independiente.
- **No combines por defecto:** `grilling` con `grill-with-docs`;
  `tdd` con `test-first`; `impeccable` con `impeccable-rn`;
  `fix-debug` con `diagnosing-bugs`; `code-review` con
  `thermo-nuclear-code-quality-review` sobre las mismas preguntas.
- `no-use-effect` se aplica al editar React o React Native;
  `no-commit-secrets` se aplica antes de un commit autorizado.
  Son restricciones, no motivos para activar un workflow adicional.
- Pstack está instalado en modalidad *skills-only*. `thermos`, `swarm`
  y otros flujos con subagentes solo se ejecutan en paralelo si el runtime
  puede despacharlos y aislar correctamente sus recursos. No inventes
  subagentes, herramientas, modelos ni resultados.
- Ponytail es un plugin de OpenCode, no una skill portable para Codex.
  Si está presente, úsalo con su modo lazy en fases de calidad.
  En otros runtimes, usa `deslop` u otra revisión disponible.

## 4. Entregar una decisión clara

Para tareas que requieran varias fases, comunica de forma breve el modo
elegido, la ruta principal y la comprobación prevista. Para tareas Quick,
ejecuta y comunica el resultado sin ceremonia. Si el usuario pregunta por el
routing, expón las skills elegidas y por qué descartaste las demás.

**Límite operativo:** ninguna ruta autoriza auto-commit, push, merge, deploy,
eliminación de datos, cambios de cuentas ni acceso a producción. Preserva los
permisos y las condiciones fijadas por el usuario.
