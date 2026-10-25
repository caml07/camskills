# Contrato nativo RN/Expo

## Fuente de verdad

Lee primero el código, tokens, navegación y dependencias del proyecto. Estas
reglas son criterios de revisión, no una receta para introducir librerías.

## Accesibilidad

- Cada control personalizado debe tener el `accessibilityRole` que describe su comportamiento.
- Los controles solo con icono necesitan `accessibilityLabel`.
- `accessibilityHint` explica solo resultados no obvios; no repite el label.
- Mantener `accessibilityState` sincronizado con `disabled`, `selected`, `checked`, `busy` y `expanded`.
- Usar `accessibilityValue` para rangos, progreso y contadores.
- `accessibilityActions` debe ofrecer una alternativa a gestos importantes.
- No marcar contenedores como `accessible` sin decidir si deben ser un único elemento lógico.
- En overlays, usar `accessibilityViewIsModal` en iOS y `importantForAccessibility="no-hide-descendants"` en hermanos Android cuando corresponda.
- Anunciar estados dinámicos con `accessibilityLiveRegion="polite"` en Android o `AccessibilityInfo.announceForAccessibility()` cuando sea necesario.
- No ocultar contenido a usuarios de lector de pantalla.
- Si el producto soporta árabe o persa, conservar U+200C y las variantes originales de Yeh/Kaf al almacenar texto; normalizar equivalencias solo en búsqueda o validación. Formatear dígitos y fechas con la locale y el calendario del producto, no asumir números occidentales.

## Interacción y plataformas

- Touch target de referencia: 44 pt iOS y 48 dp Android, con separación suficiente.
- `Pressable` debe responder inmediatamente; no retrasar `onPress` por una animación.
- Gestos son aceleradores, no el único camino. Ofrecer botón, menú o acción accesible visible.
- No interceptar el gesto back de iOS ni Predictive Back de Android sin una razón de producto.
- `Modal.onRequestClose` es obligatorio para back de Android/TV. En iOS también participa en dismiss por gesto de `pageSheet`/`formSheet`; no asumir el mismo comportamiento entre plataformas.
- Un modal debe tener heading, cierre, retorno y árbol accesible aislado.

## Insets, tamaño y teclado

- Usar la única fuente de insets que ya emplee el proyecto, normalmente `react-native-safe-area-context`.
- No sumar manualmente padding de notch, status bar, home indicator o barra de navegación.
- Usar `useWindowDimensions()` para width, height y `fontScale`; no congelar `Dimensions.get()` para decisiones de layout.
- Probar teclado, rotación, tablet, split screen, ventanas pequeñas y, si aplica, foldables.
- En Android 15+ verificar edge-to-edge con insets reales; un color de status bar no corrige el layout.
- Una pantalla debe tener una sola autoridad para cada borde de inset para evitar doble padding.

## Texto y tipografía

- Dejar que `Text` envuelva naturalmente. `numberOfLines` solo cuando truncar sea intencional y exista una forma de leer el contenido completo.
- No usar `adjustsFontSizeToFit` para ocultar un layout roto.
- Probar `fontScale` grande, fallback de fuentes, pesos ausentes y textos largos.
- Usar tokens existentes; no crear una escala paralela por pantalla.
- RTL, idiomas y expansión de copy se revisan solo si el producto los soporta.

## Listas y rendimiento

- `ScrollView` renderiza todos sus hijos. Para contenido largo o dinámico usar `FlatList`, `SectionList` o `VirtualizedList`.
- Usar `keyExtractor` estable; no índices si hay inserción, borrado u orden variable.
- `extraData` cuando `renderItem` dependa de estado externo que la lista no conoce.
- `numColumns` para grids virtualizados uniformes; no usarlo para masonry.
- `getItemLayout` solo para filas de tamaño fijo.
- Mantener rows livianos. `React.memo` solo si profiling muestra renders evitables.
- Ajustar `initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod` y `windowSize` como tradeoff entre blank areas, memoria y respuesta táctil.
- `removeClippedSubviews` es una decisión medida: puede causar contenido faltante con transforms o posicionamiento absoluto y no libera memoria.
- No añadir FlashList por reflejo; usarlo solo si ya existe o si una medición justifica el cambio.

## Imágenes y motion

- Reservar aspect ratio para evitar saltos.
- Usar el componente de imagen ya adoptado por el proyecto. En Expo, `expo-image` solo si ya es parte del stack o aporta una mejora medida.
- Placeholder, error y label accesible para imágenes de contenido; imágenes decorativas fuera del árbol accesible.
- Usar el sistema de animación existente. Preferir transforms/opacity para motion rutinario.
- Respetar `AccessibilityInfo.isReduceMotionEnabled()` y `reduceMotionChanged` cuando la pantalla permanezca montada.
- El movimiento comunica estado; no es decoración obligatoria.

## Nueva Arquitectura

- RN 0.76+ habilita la Nueva Arquitectura por defecto; confirmar la versión real del proyecto antes de afirmar compatibilidad.
- Hermes, Fabric y TurboModules son el baseline de versiones modernas, pero habilitarlos no garantiza mejora automática.
- No añadir ramas de compatibilidad legacy sin un runtime soportado que lo requiera.
- Medir antes/después: la arquitectura solo importa si el cuello de botella usa layout, render concurrente o frontera JS/native.

## Verificación

Registrar qué se verificó y qué no:

1. Source y TypeScript.
2. Tests del proyecto.
3. Simulator/emulator/device si el cambio depende de plataforma.
4. VoiceOver/TalkBack, font scale, dark mode, reduced motion y estados de error cuando sean relevantes. Antes de alterar el tema o font scale del emulador Android, registrar sus valores y restaurarlos al terminar.
5. En pantallas interactivas, recorrer también estados abiertos, vacíos, errores y texto largo que el usuario puede alcanzar; una captura del estado inicial no basta para detectar recortes o superposiciones.

## Fuentes oficiales

- https://reactnative.dev/docs/accessibility
- https://reactnative.dev/docs/accessibilityinfo
- https://reactnative.dev/docs/modal
- https://reactnative.dev/docs/flatlist
- https://reactnative.dev/docs/optimizing-flatlist-configuration
- https://reactnative.dev/docs/usewindowdimensions
- https://reactnative.dev/architecture/landing-page
