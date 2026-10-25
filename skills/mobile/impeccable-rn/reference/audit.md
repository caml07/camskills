# Auditoría nativa RN/Expo

Auditoría de solo lectura. No edites el código durante la revisión.

## Alcance

Revisar solo dimensiones relevantes al target:

- accesibilidad e interacción;
- rendimiento de listas, imágenes, startup y gestos;
- tema, tokens y estados;
- conformidad iOS/Android;
- adaptación a tamaño, orientación, teclado y ventanas.

No ejecutar browser tooling ni evaluar HTML/CSS. El detector del upstream lee markup web: no correrlo sobre RN ni interpretar un resultado vacío como pantalla sin problemas. La revisión de diseño con evidencia nativa es el método completo, no una auditoría degradada.

## Método

1. Leer target, navegación, tokens, dependencias y componentes compartidos.
2. Revisar source con ubicación exacta `archivo:línea`.
3. Usar evidencia renderizada solo si existe simulator/emulator/device; no inventarla.
4. Separar defecto confirmado de evidencia faltante.
5. Reportar únicamente problemas que cambien una decisión.

Al revisar sliders, superficies de arrastre o tiras de controles desplazables,
probar el gesto táctil cuando exista un device o emulator. Confirmar que no
bloquee el scroll, que la interacción no dependa de handlers de mouse y que un
cancel o interrupción no deje el control atrapado. Indicar la plataforma y la
evidencia usada; un layout renderizado no prueba el gesto.

## Salida

```markdown
## Resumen

## Hallazgos
- [P0|P1|P2|P3] Título
  - Ubicación: `src/...:42`
  - Impacto: qué usuario o flujo afecta
  - Evidencia: qué se observó
  - Acción: cambio mínimo recomendado

## Evidencia faltante
- Device/OS/estado que no se pudo probar.

## Lo que funciona
- Patrón que debe preservarse.
```

### Severidad

- **P0:** impide completar la tarea o produce riesgo crítico.
- **P1:** degrada de forma importante el uso o viola una expectativa nativa.
- **P2:** problema acotado con workaround.
- **P3:** pulido opcional sin impacto real.

No usar scores totales para aparentar precisión. Si una dimensión no fue evaluada,
marcarla como no evaluada.
