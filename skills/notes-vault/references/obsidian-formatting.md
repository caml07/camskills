# Obsidian Formatting Reference

## Callouts

```markdown
> [!NOTE] Title
> Content here

> [!TIP] Title
> Pro tip content

> [!WARNING] Title
> Warning content

> [!CAUTION] Title
> Caution content — use sparingly

> [!INFO] Title
> Information callout

> [!EXAMPLE] Title
> Example content
```

## Tables

```markdown
| Feature | Approach A | Approach B |
|---|---|---|
| Speed | Fast | Slow |
| Setup | Complex | Simple |
| Type safety | Full | Partial |
```

## Mermaid Diagrams

### Flowchart

```mermaid
graph TD
    A[Start] --> B{Is valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E[End]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    User->>App: Click login
    App->>API: POST /auth/login
    API-->>App: Token + user
    App-->>User: Show dashboard
```

### Class Diagram

```mermaid
classDiagram
    class User {
        +string id
        +string name
        +login()
        +logout()
    }
    class AuthService {
        +login()
        +validateToken()
    }
    User --> AuthService
```

## Embeds

```markdown
![[note-name]]           → Embed full note content
![[image.png]]           → Embed image
![alt text](url)         → External image
```

## Wiki-links

```markdown
[[Note Name]]               → Basic link
[[Note Name|Display Text]]  → Link with custom display
[[Note Name#Heading]]       → Link to a heading
[[Note Name#^block-id]]     → Link to a block reference
```

## Code Blocks with Filename

```markdown
```typescript title="src/api.ts"
// code here
```
```

## Tags

```markdown
#react #typescript #concepto

Inline tags: can be placed anywhere in the text #debugging
```

## Dataview Queries

```markdown
```dataview
TABLE tags, estado, fecha
FROM "React"
SORT fecha DESC
```

```dataview
LIST
FROM #concepto AND #react
SORT file.name ASC
```
```

## Frontmatter

```yaml
---
tags: [react, hook, concepto]
fecha: 2026-06-18
estado: borrador
aliases:
  - useState
  - state hook
---
```
