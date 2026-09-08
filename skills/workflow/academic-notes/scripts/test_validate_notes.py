#!/usr/bin/env python3
import subprocess
import sys
import tempfile
from pathlib import Path


SCRIPT = Path(__file__).with_name("validate_notes.py")
HEADINGS = """## Captured From Class / Capturado en clase
## Detailed Notes / Notas detalladas
## Examples, Commands, and Diagrams / Ejemplos, comandos y diagramas
## Decisions, Trade-offs, and Failure Modes / Decisiones, trade-offs y modos de fallo
## Tasks and Deadlines / Tareas y fechas límite
## Questions and Gaps / Preguntas y vacíos
## Senior Challenge / Reto senior
1. What happened?

> [!faq]- Model answer / Respuesta modelo
> It happened.

2. Why did it happen?

> [!faq]- Model answer / Respuesta modelo
> Because.
## AI Context and Sources / Contexto y fuentes de IA
## Raw Notes / Notas crudas
Class capture.
"""


def run(root):
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(root)], text=True, capture_output=True
    )


with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    note = root / "2026-09-04 - Week 01 - Day 03 - Web II.md"
    note.write_text(
        """---
type: session
course: Web II
date: 2026-09-04
week: 1
day: 3
status: complete
---

""" + HEADINGS,
        encoding="utf-8",
    )
    assert run(root).returncode == 0

    note.write_text(note.read_text(encoding="utf-8").replace("week: 1", "week: 01"), encoding="utf-8")
    result = run(root)
    assert result.returncode == 1
    assert "week/day must be positive unpadded integers" in result.stdout
