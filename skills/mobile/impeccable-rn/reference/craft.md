# Craft nativo

Usar para una pantalla nueva, un flujo nuevo o una reestructuración visual
material. No es un torneo de estilos ni requiere generar comps.

## Antes de editar

1. Resolver la tarea principal y el target.
2. Leer navegación, tokens, componentes y una pantalla vecina.
3. Confirmar solo decisiones que bloqueen el trabajo: plataforma, estados o acción principal.
4. Escribir una mini-especificación de cuatro líneas:
   - tarea principal;
   - jerarquía visual;
   - estados que realmente existen;
   - navegación y salida.

Para un producto de trabajo (Operate), priorizar la tarea y los controles nativos conocidos; expresar la identidad en tipografía, paleta, densidad y un gesto visual propio, no en navegación disfrazada. Para lectura (Read), preservar orden y ancho legible del contenido; concentrar el carácter visual en encabezados y marco, sin poner ornamento detrás del texto. En una superficie persuasiva, asegurar que el propósito y el siguiente paso se entienden sin explicar el concepto aparte.

## Implementación

- Reutilizar primitivas existentes antes de crear componentes.
- Mantener la ruta como adaptador fino cuando el proyecto tenga features separadas.
- No introducir una dependencia para una sola interacción.
- Diseñar primero el estado útil, no el screenshot ideal.
- Asegurar copy legible, controles accesibles y una salida clara.
- Adaptar la estructura a tablet/orientación si el producto lo soporta; no estirar un layout de teléfono.

## Verificación

- TypeScript y tests disponibles.
- Loading, empty, error, success u offline solo cuando el flujo los necesite.
- Touch, back, teclado, font scale y lector de pantalla si son parte del target.
- Simulator/emulator/device para diferencias nativas reales.
- Inspeccionar en una pasada los tamaños y estados que se envían; corregir juntos los problemas observados y confirmar después, sin dar por probado el gesto por una imagen estática.

Si algo no puede verificarse, decirlo. No sustituir evidencia por una puntuación.
