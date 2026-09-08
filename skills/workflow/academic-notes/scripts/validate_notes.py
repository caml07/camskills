#!/usr/bin/env python3
import re
import sys
from pathlib import Path

REQUIRED_KEYS = {
    "semester": {"type", "term", "starts"},
    "course": {"type", "course", "code", "meetings", "ai_policy"},
    "syllabus": {"type", "course"},
    "session": {"type", "course", "date", "week", "day", "status"},
    "course-event": {"type", "course", "date", "week", "event", "status"},
    "weekly-summary": {"type", "course", "week"},
    "concept": {"type", "concept", "courses"},
}

ALLOWED_KEYS = {
    "semester": {"type", "term", "starts"},
    "course": {"type", "course", "code", "section", "meetings", "ai_policy"},
    "syllabus": {"type", "course"},
    "session": {"type", "course", "date", "week", "day", "status"},
    "course-event": {"type", "course", "date", "week", "event", "status"},
    "weekly-summary": {"type", "course", "week"},
    "concept": {"type", "concept", "courses", "tags"},
}

SESSION_HEADINGS = [
    "Captured From Class / Capturado en clase",
    "Detailed Notes / Notas detalladas",
    "Examples, Commands, and Diagrams / Ejemplos, comandos y diagramas",
    "Decisions, Trade-offs, and Failure Modes / Decisiones, trade-offs y modos de fallo",
    "Tasks and Deadlines / Tareas y fechas límite",
    "Questions and Gaps / Preguntas y vacíos",
    "Senior Challenge / Reto senior",
    "AI Context and Sources / Contexto y fuentes de IA",
    "Raw Notes / Notas crudas",
]

SUMMARY_HEADINGS = [
    "Sessions / Sesiones",
    "Detailed Synthesis / Síntesis detallada",
    "Connections and Durable Concepts / Conexiones y conceptos duraderos",
    "Exam Preparation / Preparación para examen",
    "Questions / Preguntas",
    "Answers / Respuestas",
    "Open Gaps / Vacíos abiertos",
]

OTHER_HEADINGS = {
    "course": [
        "Note-Taking Profile / Perfil de notas",
        "Course Map / Mapa del curso",
        "Open Questions / Preguntas abiertas",
    ],
    "syllabus": [
        "Captured From Class / Capturado en clase",
        "Operational Notes / Notas operativas",
        "Verify With Instructor / Verificar con instructor",
    ],
    "concept": [
        "Definition / Definición",
        "Example / Ejemplo",
        "Relationships / Relaciones",
        "Sources / Fuentes",
    ],
}


def frontmatter(text):
    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        return {}
    block = text[4:].split("\n---\n", 1)[0]
    return {match.group(1): match.group(2).strip() for match in re.finditer(r"^([a-z_]+):(?:\s*(.*))?$", block, re.M)}


def headings(text):
    return [match.group(1).strip() for match in re.finditer(r"^## (.+)$", text, re.M)]


def safe_name(name):
    name = name.replace("/", "-").replace(":", " -")
    return re.sub(r"[\\*?\"<>|]", "", " ".join(name.split()))


def section(text, heading):
    match = re.search(rf"^## {re.escape(heading)}\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return match.group(1) if match else ""


def validate(path):
    text = path.read_text(encoding="utf-8")
    data = frontmatter(text)
    note_type = data.get("type")
    errors = []
    if note_type not in REQUIRED_KEYS:
        return [f"unknown or missing type: {note_type!r}"]
    missing = REQUIRED_KEYS[note_type] - data.keys()
    if missing:
        errors.append(f"missing frontmatter: {', '.join(sorted(missing))}")
    extra = data.keys() - ALLOWED_KEYS[note_type]
    if extra:
        errors.append(f"unexpected frontmatter: {', '.join(sorted(extra))}")

    actual_headings = headings(text)
    required_headings = OTHER_HEADINGS.get(note_type, [])
    if note_type == "session":
        name_match = re.fullmatch(r"(\d{4}-\d{2}-\d{2}) - Week (\d{2}) - Day (\d{2}) - (.+)\.md", path.name)
        valid_week = bool(re.fullmatch(r"(?:0|[1-9]\d*)", data.get("week", "")))
        valid_day = bool(re.fullmatch(r"[1-9]\d*", data.get("day", "")))
        if not name_match:
            errors.append("non-canonical session filename")
        elif valid_week and valid_day and (name_match.group(1), int(name_match.group(2)), int(name_match.group(3)), name_match.group(4)) != (
            data.get("date"), int(data.get("week", 0)), int(data.get("day", 0)), safe_name(data.get("course", ""))
        ):
            errors.append("session filename does not match frontmatter")
        if not valid_week or not valid_day:
            errors.append("week must be a nonnegative unpadded integer and day must be a positive unpadded integer")
        if data.get("status") not in {"draft", "complete"}:
            errors.append("status must be draft or complete")
        required_headings = SESSION_HEADINGS if data.get("status") == "complete" else [SESSION_HEADINGS[-1]]
    elif note_type == "course-event":
        name_match = re.fullmatch(r"(\d{4}-\d{2}-\d{2}) - Week (\d{2}) - Office Hours - (.+)\.md", path.name)
        valid_week = bool(re.fullmatch(r"(?:0|[1-9]\d*)", data.get("week", "")))
        if not name_match:
            errors.append("non-canonical course-event filename")
        elif valid_week and (name_match.group(1), int(name_match.group(2)), name_match.group(3)) != (
            data.get("date"), int(data.get("week", 0)), safe_name(data.get("course", ""))
        ):
            errors.append("course-event filename does not match frontmatter")
        if data.get("event") != "office-hours":
            errors.append("course-event event must be office-hours")
        if data.get("status") not in {"draft", "complete"}:
            errors.append("status must be draft or complete")
        if not valid_week:
            errors.append("week must be a nonnegative unpadded integer")
        required_headings = SESSION_HEADINGS if data.get("status") == "complete" else [SESSION_HEADINGS[-1]]
    elif note_type == "weekly-summary":
        name_match = re.fullmatch(r"Week (\d{2}) Summary\.md", path.name)
        if not name_match:
            errors.append("non-canonical weekly-summary filename")
        valid_week = bool(re.fullmatch(r"(?:0|[1-9]\d*)", data.get("week", "")))
        if not valid_week:
            errors.append("week must be a nonnegative unpadded integer")
        elif name_match and int(name_match.group(1)) != int(data["week"]):
            errors.append("weekly-summary filename does not match frontmatter")
        required_headings = SUMMARY_HEADINGS
    elif note_type == "syllabus":
        if path.name != "Day 00 - Syllabus.md":
            errors.append("non-canonical syllabus filename")
        forbidden = {"week", "day", "status"} & data.keys()
        if forbidden:
            errors.append(f"syllabus has forbidden frontmatter: {', '.join(sorted(forbidden))}")

    missing_headings = [heading for heading in required_headings if heading not in actual_headings]
    if missing_headings:
        errors.append(f"missing headings: {', '.join(missing_headings)}")
    duplicates = [heading for heading in required_headings if actual_headings.count(heading) > 1]
    if duplicates:
        errors.append(f"duplicate headings: {', '.join(duplicates)}")
    present_positions = [actual_headings.index(heading) for heading in required_headings if heading in actual_headings]
    if present_positions != sorted(present_positions):
        errors.append("canonical headings are out of order")

    if note_type in {"session", "course-event"} and data.get("status") == "complete":
        challenge = section(text, SESSION_HEADINGS[-3])
        questions = len(re.findall(r"^\d+\. ", challenge, re.M))
        answers = len(re.findall(r"^> \[!faq\]-", challenge, re.M))
        if questions not in {2, 3} or answers != questions:
            errors.append("Senior Challenge must have 2-3 numbered questions with matching collapsed answers")
    elif note_type == "weekly-summary":
        questions = len(re.findall(r"^\d+\. ", section(text, SUMMARY_HEADINGS[3]), re.M))
        answers = len(re.findall(r"^> \[!faq\]-", section(text, SUMMARY_HEADINGS[5]), re.M))
        if not questions or answers != questions:
            errors.append("exam questions and collapsed answers must be numbered and matched")
    return errors


root = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
failures = []
notes = [note for note in sorted(root.rglob("*.md")) if "RESOURCES" not in note.parts]
session_dates = {}
session_days = {}
for note in notes:
    note_errors = validate(note)
    data = frontmatter(note.read_text(encoding="utf-8"))
    if data.get("type") == "session":
        date_key = (data.get("course"), data.get("date"))
        day_key = (data.get("course"), data.get("day"))
        if date_key in session_dates:
            note_errors.append(f"duplicate course/date; already used by {session_dates[date_key].name}")
        else:
            session_dates[date_key] = note
        if day_key in session_days:
            note_errors.append(f"duplicate course/day; already used by {session_days[day_key].name}")
        else:
            session_days[day_key] = note
    for error in note_errors:
        failures.append(f"{note.relative_to(root)}: {error}")

if failures:
    print("\n".join(failures))
    raise SystemExit(1)
print(f"Validated {len(notes)} academic notes.")
