---
id: DOC-{NNN}
tipo: AUDIT
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}]
evidencia: []
---

# DOC-{NNN}: Audit — {Área}

> Auditoría técnica con findings accionables. `doc:sync --check` es el gate automatizado.

## Findings
| # | File / Component | Problema | Root cause | Qué cortar | Reemplazar con | Severidad |
|---|---|---|---|---|---|---|
| 1 | | | | | | P1/P2/P3 |

> **Regla ponytail:** Un guard en la función compartida > un guard en cada caller.
> Si el mismo patrón roto aparece N veces, el fix es uno en el lugar común, no N parches.

## Actions
| Prioridad | Qué hacer | Archivo(s) | Responsable | Fecha objetivo |
|-----------|-----------|------------|-------------|----------------|
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |

## Checklist de Validación
- [ ] `npx tsc --noEmit` limpio
- [ ] `npm test` — baseline sin regresiones
- [ ] `doc:sync --check` limpio
- [ ] Mermaid renderiza en GitHub PR
- [ ] No secretos en diff

---
*Crear bajo demanda. `doc:sync --check` corre automáticamente en CI/local.*