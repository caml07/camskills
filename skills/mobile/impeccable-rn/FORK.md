# Fork curado de Impeccable para React Native

## Identidad

- Upstream: `pbakaus/impeccable`
- Tipo: fork curado, no espejo funcional
- Base upstream revisada: `c0f495212236129c2e92aaf7714a3a9914569d13`
- Último upstream revisado: `936867543ac2576920d663cc9803597f6044f3ac` (4.7.1)
- Fecha de revisión: 2026-10-24
- Licencia declarada por el fork: Apache-2.0; conservar notices del upstream si se redistribuyen archivos derivados.
- Resultado de revisión: importados criterios nativos de Operate/Read,
  crítica sin detector web, inspección de estados interactivos, restauración
  del tema/font scale Android y preservación de escritura árabe/persa cuando
  el producto la soporte. Permanecen fuera el launcher, comps y los gates web.

## Qué se importa

- Principios de craft y crítica cuando son independientes de browser.
- Reglas de interacción, accesibilidad, listas, rendimiento y adaptación que tienen contrato nativo.
- Correcciones upstream que no introduzcan DOM, CSS, CSP, browser automation o live HTML.

## Qué se excluye

- `live`, `live-setup`, HMR, CSP, HTML/CSS, browser, detector y hooks web.
- Generación de comps, tableros de decisión y pipelines de imágenes.
- Referencias a hover, focus rings web, DOM portals, ARIA-only y formularios web.

## Mantenimiento

1. Revisar el upstream y su licencia antes de importar cambios.
2. Comparar el diff contra esta lista de exclusiones.
3. Importar manualmente solo cambios RN/nativos.
4. Actualizar este archivo con nuevo SHA y fecha.
5. Validar que la skill solo contenga `SKILL.md`, `FORK.md`, `NOTICE.md` y `reference/*.md` permitidos.

El historial Git conserva el material eliminado; no se archiva dentro de la
skill activa para no volver a cargarlo accidentalmente.
