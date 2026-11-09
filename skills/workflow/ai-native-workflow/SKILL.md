---
name: ai-native-workflow
description: >-
  Ejecuta cambios de código con un ciclo proporcionado de plan, implementación,
  pruebas, verificación real, simplificación y review. Usar para implementar
  features, corregir bugs, modificar interfaces funcionales o hacer refactors
  end-to-end; también cuando se pida "ai-native-workflow", "10x workflow" o
  "build verify review". No activar en respuestas, notas ni planes sin código.
---

# AI-native workflow

Aplica el ciclo **definir → implementar → probar → verificar → revisar →
entregar** usando las skills existentes de CamSkills. Elige el modo con
[Cam Route](../cam-route/SKILL.md). El tamaño del trabajo determina el número
de fases; no conviertas una corrección de una línea en una auditoría completa.

## Fase 0: observar y acotar

1. Lee la petición, el repo, sus instrucciones y el estado Git antes de editar.
2. Respeta el alcance: si piden solo plan, diagnóstico o review, no escribas
   código ni actives esta secuencia de implementación.
3. Identifica **qué comportamiento cambia**, la comprobación que lo demostraría,
   las partes sensibles y el impacto sobre datos/estado compartido.
4. Fija modo:
   - **Quick:** cambio localizado, reversible y claro.
   - **Standard:** feature o corrección multiarchivo con comportamiento observable.
   - **Deep:** seguridad, auth, migraciones, arquitectura amplia, datos o alto
     riesgo de regresión. Si el cambio es pequeño pero sensible, conserva
     los controles de seguridad sin convocar todo el pipeline.
5. Preserva cambios ajenos y no hagas commit, push, merge ni deploy salvo
   instrucción explícita del usuario. Si hay secretos, nunca los imprimas.

## Fase 1: objetivo, contexto y aceptación

Escribe internamente, o en un plan cuando el trabajo lo amerite:

- **Goal:** resultado observable para el usuario.
- **Context:** módulos, restricciones, antes/ahora y fuentes relevantes.
- **Verification:** pasos concretos y estados esperados, incluidos fallos.

Para Quick, bastan 1-2 criterios en el mensaje de trabajo. Para Standard,
inspecciona primero las rutas afectadas. Para Deep, crea un plan de unidades
verificables; usa `grilling` solo para decisiones que requieren intervención
humana y `junior-to-senior` cuando exista una arquitectura o plan que revisar.
No hagas ambas entrevistas por rutina.

## Fase 2: implementar y probar

- Bug: reproduce la falla con datos **sintéticos o anonimizados**; aplica
  `diagnosing-bugs`. Solo cambia a `fix-debug` si el foco es una API de
  dependencia y Context7 es útil. La reproducción fallida se comunica.
- Feature/backend/TUI: `tdd` si el flujo admite test-first. Mantén
  cambios pequeños y dentro del alcance.
- React Native/Expo: `test-first` sustituye a `tdd`; usa
  `expo-overview` antes de cualquier skill Expo especializada.
- UI web: `impeccable`. UI React Native: `impeccable-rn`.
  Escoge por superficie, nunca ambas por defecto.
- Aplica `no-use-effect` en React y React Native. Antes de commits
  autorizados, `no-commit-secrets`.

Un test que falla antes del cambio demuestra la regresión; un test que pasa
después confirma solo el comportamiento que realmente cubre.

## Fase 3: verificar el comportamiento real

1. Ejecuta las pruebas pertinentes: tests, lint, typecheck o build según
   el repo. No atribuyas resultados a comandos que no ejecutaste.
2. Si hay una skill de proyecto `verify`, úsala para iniciar la aplicación,
   conducir la acción del usuario, comprobar el resultado y guardar evidencia
   (capturas, logs, respuestas, cambios de estado).
3. Si no existe y la app tiene un recorrido reproducible, usa
   `create-verification-skill` para crear un driver **local al proyecto**,
   preferentemente en `.agents/skills/verify/` para Codex/OpenCode. Prueba
   una ruta completa antes de decir que la skill funciona. No la generes
   obligatoriamente por un typo o una modificación solo documental.
4. Usa `maintain-verification-skill` cuando cambie la forma de recorrer
   una funcionalidad ya documentada o el mapa sea obsoleto; no cada vez
   que editas una línea.
5. Aísla puertos, bases de datos, contenedores y perfiles cuando hay
   trabajo concurrente. Un worktree **no aísla** por sí solo Postgres,
   MongoDB, Supabase ni servicios externos. Limpia únicamente recursos
   creados por tu prueba y conserva la evidencia.

Si no hay acceso a un runtime o faltan credenciales, entrega pruebas
alternativas y marca **verificación real pendiente**. No inventes screenshots.

## Fase 4: simplificar y revisar

Elige revisiones que cubran **preguntas diferentes**:

- Quick: `git diff` y test afectado. Sin comité de reviews.
- Standard: `code-review` cuando haya cambios sustantivos que contrastar
  con specs o convenciones. Ejecuta `deslop` si el diff ganó ruido
  innecesario, y vuelve a correr pruebas afectadas.
- Deep: añade `thermo-nuclear-code-quality-review` para riesgo de
  mantenibilidad, `thermo-nuclear-review` para fallos o regresiones,
  `security-audit` para superficie de seguridad. No todos a la vez
  por defecto. `thermos` requiere paralelismo real y modelos/agentes
  disponibles; en skills-only no está garantizado.
- OpenCode: Ponytail puede ayudar en su modo lazy cuando el plugin
  esté cargado. No supongas que existe en Codex ni impongas sus
  pasadas sobre una revisión equivalente.
- Una revisión independiente **no sustituye** ejecutar la app ni probar
  estados reales. Si las revisiones discrepan, resuelve con evidencia;
  no uses conteos de aprobaciones como prueba de corrección.

## Fase 5: entregar

Reporta brevemente:

- Qué cambió y dónde.
- Qué comprobaste **de verdad**, con comando o evidencia y resultado.
- Qué no se pudo comprobar, riesgos y próximos pasos.
- Qué habilidades del router se usaron si afecta a la comprensión.

No marques un PR como aprobado, no lo fusiones ni anuncies deployment
sin una acción real y autorizada. Un agente puede preparar la evidencia
y una propuesta de PR; el control final sigue en manos del usuario.

## Profundidad por defecto

| Modo | Antes | Durante | Después |
| --- | --- | --- | --- |
| Quick | Criterio observable | Edición mínima, test afectado | Diff y resultado |
| Standard | Goal/Context/Verification | Skill de stack + tests | Driver real si aplica, review proporcional |
| Deep | Plan + riesgo + aislamiento | Tests y cambios por unidades verificables | Driver, revisión estructural/seguridad necesaria y evidencia |

El repositorio local es la fuente de verdad; este flujo no impone
`poteto-mode`, auto-merge, agentes en nube ni hooks globales.
