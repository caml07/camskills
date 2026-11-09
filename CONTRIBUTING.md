# Contribuir a CamSkills

CamSkills reúne tres tipos de contenido: skills propias, forks adaptados y
copias de skills de terceros. El objetivo es preservar una sola fuente de
verdad por skill y mantener la instalación segura.

## Estructura

```text
skills/
  engineering/    Workflow y arquitectura
  design/         UI web
  mobile/         Expo, React Native
  workflow/       Integraciones propias y rutas
  pstack/         Distribución vendorizada
codex/.agents/skills/    Enlaces y adaptaciones para Codex
scripts/                 Instalador, validaciones y sincronización
docs/                    Documentación de usuario
```

- Una skill necesita `SKILL.md` con frontmatter que incluya `name` y
  `description`.
- Las reglas genéricas pertenecen a la skill que las posee. `cam-route`
  documenta únicamente cuándo seleccionarlas.
- Cambios a upstream deben registrarse en [`UPSTREAM.md`](UPSTREAM.md).
  Conserva licencias y modificaciones locales que hagan al fork portátil.
- Las rutas de Codex deben resolver a la skill original o a un overlay
  específico. Evita copiar la misma skill a varias rutas.

## Flujo de cambios

1. Comprueba `git status` y evita sobrescribir cambios no relacionados.
2. Modifica la skill o documentación canónica.
3. Prueba el comportamiento real cuando el cambio modifica código o scripts.
4. Ejecuta las comprobaciones correspondientes.
5. Revisa `git diff --check` y la posible presencia de credenciales.
6. Deja commits y pushes bajo control del usuario.

## Checks

```bash
python3 -m unittest discover -s tests -v
node --test scripts/check-cam-route.mjs
bash -n setup install.sh
git diff --check
```

Prueba instalaciones con directorios aislados. Nunca uses tu configuración
de OpenCode o Codex como entorno de pruebas destructivas.

## Enlaces y procedencia

Los forks y las skills vendorizadas pueden tener condiciones de licencia
distintas. Antes de incorporar una skill, verifica su origen y preserva su
aviso de licencia. Consulta [UPSTREAM.md](UPSTREAM.md) para el inventario de
fuentes y revisiones.
