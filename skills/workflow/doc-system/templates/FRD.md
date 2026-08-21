---
id: DOC-{NNN}
tipo: FRD
estado: borrador
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{PRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Functional Requirements Document

## 1. Requisitos Funcionales (FR)
| ID | Nombre | Descripción | Regla / Caso borde | Estado | PRD-ID | Test-ID | Evidencia |
|----|--------|-------------|-------------------|--------|--------|---------|-----------|
| FR-001 | | | | planificado | | | |
| FR-002 | | | | implementado | | | src/...:L1-L10 |
| FR-003 | | | | verificado | | | test/... |

**Estados:** `planificado` | `en_progreso` | `implementado` | `verificado` | `rechazado` | `deprecated`

## 2. Requisitos No Funcionales (NFR)
| ID | Nombre | Descripción | Métrica / Target | Estado | PRD-ID | Evidencia |
|----|--------|-------------|------------------|--------|--------|-----------|
| NFR-001 | Performance | | p95 < 200ms | | | |
| NFR-002 | Disponibilidad | | 99.9% | | | |
| NFR-003 | Seguridad | | OWASP MASVS L1 | | | |
| NFR-004 | Accesibilidad | | WCAG 2.1 AA | | | |
| NFR-005 | Offline | | cola persistente 30d | | | |

## 3. Reglas de Negocio y Casos Borde
| Regla ID | Descripción | FR-ID | Validación | Evidencia código |
|----------|-------------|-------|------------|------------------|
| BR-001 | | | | |

## 4. Trazabilidad Completa
| FR/NFR | PRD Journey | AC-ID | Test Unitario | Test Integración | Test E2E | Estado Global |
|--------|-------------|-------|---------------|------------------|----------|---------------|
| FR-001 | J-001 | AC-001 | test/... | test/... | manual | ✅ |

## 5. Supuestos Técnicos (⚠️ requieren validación)
| Supuesto | Validación | Responsable |
|----------|------------|-------------|

---
*Este documento define CÓMO funciona el producto técnicamente. Cada FR/NFR debe tener evidencia de código o test.*