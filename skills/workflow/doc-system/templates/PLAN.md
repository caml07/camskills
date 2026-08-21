---
id: DOC-{NNN}
tipo: PLAN
estado: 📜 legacy — diseño técnico en TDD (DOC-XXX-TDD-*.md)
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TDD_ID}]
evidencia: []
---

# DOC-{NNN}: Plan — {PlanName} (LEGACY)

> **Legacy.** El diseño técnico vive en `DOC-XXX-TDD-{slug}.md`.
> Este documento solo para planificación de tareas/sequencing si se desea.

## Objetivo
Qué se va a implementar y por qué.

## Branch
```bash
git checkout -b feat/{branch-name}
```

## Flujo Nuevo
```
ASCII diagram o ref a FLOW doc
```

## Fases de Implementación (opcional — TDD tiene el diseño)
### Fase 1: {Nombre}
- **RED** — Test:
- **GREEN** — Implementación:
- **REFACTOR** — Cleanup:

### Fase 2: {Nombre}
...

## Archivos a Modificar
- [ ] `path/to/file.ts`
- [ ] `path/to/file.test.ts`

## Riesgos
| Riesgo | Mitigación |
|--------|-----------|

## Enlace a TDD
`DOC-XXX-TDD-{slug}.md` — diseño técnico completo, migración, rollback, pruebas.

---
*Usar `/doc:new TDD` para diseño técnico. Este PLAN solo si se necesita task breakdown separado.*