---
name: impeccable-rn
  Mejora interfaces React Native y Expo con criterio nativo, usando el sistema
  visual existente y evidencia de código o dispositivo. Úsala para cambiar una
  pantalla, crear un flujo nuevo o auditar accesibilidad, rendimiento,
  plataformas y adaptación. No usa browser, HTML, CSS, CSP ni live preview web.
version: 2.0.0-rn-curated
user-invocable: true
argument-hint: "[craft|audit] [target]"
license: Apache-2.0
---

# Impeccable RN

Fork curado de Impeccable para React Native y Expo. Conserva la intención del
upstream (interfaces deliberadas, estados completos, crítica con evidencia),
pero reemplaza supuestos de navegador por contratos nativos.

## Entra por aquí

| Entrada | Cuándo usarla | Resultado |
|---|---|---|
| `/impeccable-rn <target>` | Cambio acotado en una pantalla o componente existente | Edita el código con el menor cambio coherente |
| `/impeccable-rn craft <target>` | Pantalla, flujo o cambio visual estructural nuevo | Diseña e implementa el flujo completo |
| `/impeccable-rn audit <target>` | Revisión solicitada, sin editar | Reporte accionable con evidencia |

Las palabras `polish`, `layout`, `harden`, `optimize`, `typeset` y `animate`
son intenciones, no sub-workflows obligatorios. Ejecuta solo la parte que el
problema necesite.

## Flujo por defecto: cambio acotado

1. Resolver el target a un archivo, ruta o componente concreto.
2. Leer el target, su navegación y el token/componente vecino que ya sea fuente de verdad.
3. Leer solo la sección relevante de `reference/native.md`.
4. Preservar comportamiento, copy, tokens y patrones existentes salvo que el pedido los cambie.
5. Hacer el cambio mínimo que corrige la causa, no una limpieza estética lateral.
6. Verificar el estado afectado con el check disponible del proyecto. Si el cambio cruza plataforma, probar la plataforma afectada.

No requiere entrevista, PRODUCT.md, screenshot, comp, subagente ni documento nuevo
para cambiar un padding, copy, color tokenizado o estado pequeño.

## `craft`: pantalla o flujo nuevo

1. Leer navegación, tokens, componentes reutilizables, dependencias y comandos reales del proyecto.
2. Confirmar una sola vez cualquier decisión material ausente: tarea principal, plataforma objetivo o estados que el producto debe soportar.
3. Definir en pocas líneas: tarea, jerarquía, estados, navegación, accesibilidad y adaptación.
4. Implementar primero con primitivas y dependencias ya presentes.
5. Verificar loading/empty/error/success/offline solo cuando el flujo los tenga; no rellenar estados irrelevantes.
6. Probar teléfono y tablet/orientación si el producto los soporta.

## `audit`: solo lectura

1. Leer source y, si existe, evidencia de simulator/emulator/device.
2. Revisar accesibilidad, rendimiento, tema/estados, conformidad iOS/Android y adaptación.
3. Reportar solo hallazgos verificables: `[P0-P3]`, archivo/línea, impacto, evidencia y acción.
4. Separar evidencia faltante de defecto confirmado.
5. No cambiar código ni generar puntuaciones si no ayudan a decidir.

## Límites

- No importar DOM, ARIA-only, hover obligatorio, focus traps web, CSS, HTML, CSP o browser tooling.
- No imponer FlashList, expo-image, React Hook Form, Zod, Reanimated, Skia, fuentes o bottom sheets si el proyecto no los usa o el problema no los necesita.
- No añadir memoización, animación o abstracciones sin evidencia o reutilización real.
- No sustituir el diseño existente por una estética genérica “AI-proof”. El producto y sus tokens mandan.
- Los criterios de contraste, touch targets y accesibilidad son mínimos de seguridad/usabilidad; la composición visual sigue siendo contextual.

## Referencias

- `reference/native.md`: contrato RN/Expo, accesibilidad, plataformas, listas, insets, responsive, motion y evidencia actual.
- `reference/craft.md`: flujo breve para crear o reestructurar una superficie.
- `reference/audit.md`: reporte técnico de solo lectura.

## Verificación mínima

Usar los comandos que existan en el proyecto. No afirmar que una pantalla fue
probada en dispositivo si solo se revisó source. Registrar, cuando importe:

- plataforma, OS, device/emulator y build;
- estado probado y resultado;
- check ejecutado y resultado;
- evidencia faltante.
