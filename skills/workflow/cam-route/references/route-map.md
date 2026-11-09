# Catálogo de rutas

La primera columna describe el **resultado pedido**, no palabras clave aisladas.
Para una tarea mixta, elige la ruta del resultado principal y activa apoyos
solo cuando la fase correspondiente los necesite.

| Necesidad observada | Skill principal | Apoyos condicionales | Regla de exclusión |
| --- | --- | --- | --- |
| Pregunta factual breve, explicación, traducción | Responder sin skill | Ninguno | No ejecutar CamSkills como ritual |
| Investigación técnica actual, comparación | `research` | `context7-mcp` si hay API/SDK | No crear docs si solo se pide respuesta |
| Aterrizar una idea ambigua | `grilling` | `junior-to-senior` después del plan | Para decisiones documentadas usa `grill-with-docs` en lugar de `grilling` |
| Diseño de arquitectura o modelo de dominio | `codebase-design` | `domain-modeling`, `junior-to-senior` si existe un plan | No iniciar implementación sin solicitarla |
| Implementar una feature o refactor | `ai-native-workflow` | Skill específica de stack en su fase | Ver `../ai-native-workflow/SKILL.md` |
| Reparar un bug del código | `ai-native-workflow` | `diagnosing-bugs` para reproducir; `fix-debug` solo si la API de una dependencia es el origen | No usar ambos diagnósticos por defecto |
| Interfaz web a diseñar o modificar | `impeccable` | `ai-native-workflow` si se cambia código | No `impeccable-rn` |
| Interfaz React Native/Expo | `impeccable-rn` | `expo-overview` si proyecto Expo; `ai-native-workflow` si se implementa | `mobile-app-ui-design` solo si se piden mockups/ideación móvil |
| Código Expo sin trabajo de UI | `expo-overview` | Skill Expo de dominio; `ai-native-workflow` si hay implementación | No cargar todas las `expo-*` |
| Pruebas de comportamiento reales / crear driver | `create-verification-skill` | `maintain-verification-skill` solo si ya existe un mapa que mantener | El driver va dentro del proyecto, no del vault global |
| Review de un diff contra especificación/estándares | `code-review` | `security-audit` si hay superficie sensible | No ejecutar Thermo-Nuclear sin objetivo estructural |
| Mantenibilidad, spaghetti, grandes refactors | `thermo-nuclear-code-quality-review` | `deslop` cuando se solicita limpiar el diff | `thermos` solo con subagentes disponibles y doble revisión requerida |
| Auditoría de seguridad | `security-audit` | `code-review` únicamente si también se pide revisar el diff | Auditoría integral solo por petición explícita |
| Documentación técnica | `doc-system` | `technical-writing` si hace falta pulir redacción técnica | No `research` si las fuentes ya están en el repo |
| Notas de asignaturas / Obsidian académico | `academic-notes` | `notes-vault` solo para nota atómica no cubierta | No mezclar dos gestores de la misma nota |
| Nota general del vault / conocimiento permanente | `notes-vault` | `doc-system` si se trata de documentación técnica de repo | Respetar la ruta del vault |
| Diagnóstico de infraestructura, despliegue o migración | `wizard` cuando son pasos humanos | `security-audit` cuando hay seguridad; skill del stack si existe | No asumir autorización para producción |
| Entrevista pedagógica o práctica de examen | Tutor socrático (sin pipeline) | `academic-notes` solo cuando se solicita guardar | No invocar TDD/reviews para estudiar |
| Descubrir nuevas skills | `find-skills` | Ninguno | Evaluar procedencia y evitar instalaciones duplicadas |

## Selección de intensidad

| Mode | Condición | Resultado mínimo |
| --- | --- | --- |
| Quick | Texto/cambio local, reversible, requisitos claros | Cambio o respuesta, check pertinente |
| Standard | Feature, bug con varias etapas, UI funcional o cambio de persistencia acotado | Criterios de aceptación, implementación, pruebas, verificación real si disponible y review proporcional |
| Deep | Auth, secretos, seguridad, migraciones, arquitectura transversal, estado de producción o riesgo alto | Plan y revisión de arquitectura, aislamiento, pruebas y evidencias, seguridad/review independiente cuando corresponda |

El usuario puede pedir un modo más exhaustivo. Reducirlo por debajo de
comprobaciones mínimas no autoriza afirmar que algo quedó verificado.

## Reglas de especialización

- **TDD:** `test-first` solo para React Native/Expo; `tdd` para otros
  stacks cuando el alcance admite prueba-first. No cargar ambos.
- **Frontend:** `impeccable` para web; `impeccable-rn` para cambios
  React Native; `mobile-app-ui-design` para exploración de pantallas.
- **Expo:** `expo-overview` primero y una sola skill Expo especializada,
  por ejemplo `expo-router`, `expo-animation` o `expo-data-fetching`.
- **Review:** `code-review` pregunta si cumple la spec y convenciones;
  `thermo-nuclear-code-quality-review` pregunta si la arquitectura se está
  volviendo compleja; `thermo-nuclear-review` busca defectos y riesgos.
  Cargar solo los ejes necesarios.
- **Verificación de interfaz:** si existe un driver `verify` del
  proyecto, ejecutarlo. Si no existe y el repo es ejecutable, generar
  `verify` una vez con `create-verification-skill` y probarlo antes de
  considerarlo operativo. Una ausencia de driver no justifica inventar
  capturas ni llamar "passed" a pruebas no ejecutadas.
- **Mantenimiento:** `maintain-verification-skill` solo cuando el
  mapa de funcionalidades está desactualizado o se pide auditarlo.
- **Calidad y commits:** `deslop` corrige el diff de manera puntual.
  Ponytail puede ayudar en OpenCode si está habilitado; no se considera
  un gate universal. `no-commit-secrets` se comprueba antes de cualquier
  commit **solicitado**. Al editar React o React Native, se aplica
  `no-use-effect` como restricción existente.
- **Pstack:** `poteto-mode` solo por petición explícita; no es la ruta
  global por defecto ni modifica la política de Cam Route.

## Casos para comprobar el routing

| Petición realista | Ruta esperada | Modo |
| --- | --- | --- |
| "Explicame qué es un NFA" | respuesta/tutor | Quick |
| "En mi vault documenta la week 7 de Cloud" | `academic-notes` | Quick |
| "Investiga las diferencias de Expo Router vX" | `research` + `context7-mcp` | Standard |
| "Quiero pensar la arquitectura de keytbrui, solo plan" | `codebase-design` + `junior-to-senior` si hay plan | Standard |
| "Haz que Banquito funcione en móvil y escritorio" | `impeccable` + `ai-native-workflow` | Standard |
| "Arregla el crash al navegar en Expo" | `ai-native-workflow` + `diagnosing-bugs` + `test-first` | Standard |
| "Arregla el error de bcrypt en el backend" | `ai-native-workflow` + `diagnosing-bugs` + `tdd` | Standard |
| "Audita toda la autenticación antes de lanzar" | `security-audit` | Deep |
| "Revisa esta PR por spaghetti y abstracciones" | `thermo-nuclear-code-quality-review` | Deep |
| "Crea cómo probar automáticamente el simulador" | `create-verification-skill` | Standard |
| "Mejora los textos del informe" | `humanizer` si es estilo humano, `doc-system` si es documentación técnica | Quick |
| "Ajusta solo un typo en README" | `doc-system` si requiere documentación, o edición directa | Quick |

Estos casos son **criterios de evaluación del agente**. No existe un
clasificador de texto determinista que pueda interpretarlos sin contexto.
