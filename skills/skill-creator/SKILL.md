---
name: skill-creator
description: >-
  Guides the complete skill development lifecycle: capture intent, research,
  write SKILL.md, create test cases, run parallel subagent evaluations
  (with-skill vs baseline), grade assertions, aggregate flat benchmarks,
  iterate based on feedback, optimize descriptions, and package final .skill
  files. Trigger when the user says "create a skill", "make a skill", "new
  skill", "skill for X", "write a skill", "develop a skill", "skill-creator",
  or wants to improve/iterate an existing skill.
license: MIT
compatibility: opencode
---

# Skill Creator

Build skills for Opencode through a structured, test-driven process.

## Overview

A skill lives at `~/.config/opencode/skills/<name>/SKILL.md` with optional bundled resources (`agents/`, `references/`, `scripts/`, `eval-viewer/`, `assets/`).

The process follows 8 phases. Do not skip phases unless the user explicitly asks.

---

## Phase 1: Capture Intent

Understand exactly what the user wants before writing anything.

### Questions to answer

1. **What should the skill enable the agent to do?** — the core behavior
2. **When should it trigger?** — what user phrases, contexts, file patterns
3. **What is the expected output format?** — code generation, file transformation, data extraction, guided workflow
4. **Should we set up test cases?** — skills with objectively verifiable outputs benefit from tests; subjective skills (writing style, art) often don't
5. **Are there example files or similar skills?** — ask the user to point at existing work
6. **Any edge cases or constraints?** — libraries, frameworks, security concerns, environment specifics

Extract as much as possible from the current conversation before asking. If the user already showed a workflow, capture the tools used, the sequence of steps, corrections they made.

---

## Phase 2: Research

Before drafting, gather context using available tools.

### Use Context7 MCP

If the skill involves a library, framework, API, or service:

```
context7_resolve-library-id(libraryName="<lib>", query="<question>")
context7_query-docs(libraryId="<id>", query="<specific question>")
```

### Explore existing skills

Check if similar skills already exist:

```
ls ~/.config/opencode/skills/
cat ~/.config/opencode/skills/<relevant-skill>/SKILL.md
```

### Use subagents for research

For deep research topics, spawn a subagent in parallel:

```
task(
  description="research <topic>",
  prompt="Investigate <topic> for building a skill. Return: key concepts, best practices, common patterns, code examples.",
  subagent_type="explore"
)
```

---

## Phase 3: Write SKILL.md

### Progressive Disclosure

Three-level loading system:

1. **Frontmatter** (name + description) — always in context (~100 words). Make descriptions slightly "pushy" to encourage triggering.
2. **SKILL.md body** — in context when triggered (<500 lines)
3. **Bundled resources** — loaded as needed via reference in the body

When approaching 500 lines, add hierarchy with pointers to where to go next.

### Frontmatter

```yaml
---
name: <kebab-case, matches directory name>
description: >-
  When to trigger and what it does. Specific, slightly pushy.
  Include trigger patterns.
license: MIT
compatibility: opencode
---
```

### Writing Patterns

- Use **imperative** form ("Create a test case", "Spawn two subagents")
- **Explain the why** behind instructions. LLMs perform better when they understand the reasoning.
- Avoid ALL-CAPS mandates like MUST/ALWAYS/NEVER — they are yellow flags. Reframe as explanations.
- Keep examples concrete. Use real file paths, real column names, real company names.

### Domain Organization

For skills that span multiple frameworks/domains:

```
skill-name/
├── SKILL.md          # workflow + selection logic
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

Claude reads only the relevant reference file.

### Bundled Resources

```
skill-name/
├── SKILL.md (required)
├── agents/           # Subagent instructions for delegated tasks
├── references/       # Reference docs loaded as needed
├── scripts/          # Deterministic automation scripts
├── eval-viewer/      # HTML review generator
└── assets/           # Templates and static files
```

---

## Phase 4: Create Test Cases

Create 2-3 realistic test prompts. These should be the kind of thing a real user would actually type.

### evals.json format

```json
{
  "skill_name": "my-skill",
  "evals": [
    {
      "id": 1,
      "name": "validate-user-input",  (required, kebab-case)
      "prompt": "User's task prompt — realistic, conversational",
      "files": ["input/test.csv"],    (relative to eval workspace)
      "expected_output": "Description of expected result",
      "assertions": [
        {
          "name": "output-has-required-fields",
          "description": "Output contains field1, field2, field3 at minimum"
        },
        {
          "name": "handles-empty-input",
          "description": "Does not crash when given empty CSV"
        }
      ]
    }
  ]
}
```

Assertions must have descriptive names that read clearly — someone glancing at the benchmark viewer should immediately understand what each one checks.

Show the test cases to the user and get sign-off before running.

---

## Phase 5: Run Tests & Evaluate

### Step 1: Create workspace

```
<skill-name>-workspace/iteration-<N>/
```

Within each iteration, each eval gets a directory named after its `name` field from evals.json:

```
iteration-1/
├── validate-user-input/
│   ├── with_skill/
│   │   └── outputs/
│   └── without_skill/
│       └── outputs/
├── another-eval/
│   └── ...
```

### Step 2: Create eval_metadata.json

One per eval directory — contains the prompt and assertions for the grader:

```json
{
  "eval_name": "validate-user-input",
  "prompt": "User's task prompt",
  "assertions": [
    {
      "name": "output-has-required-fields",
      "description": "Output contains field1, field2, field3 at minimum"
    }
  ]
}
```

### Step 3: Spawn all runs (same turn)

Spawn **all** subagents in parallel — with-skill AND baseline — in a single turn:

**With-skill run:**
```
task(
  description="run-skill <eval-name>",
  prompt="You are testing skill-creator. Read SKILL.md at ~/.config/opencode/skills/skill-creator/SKILL.md first, then follow its instructions exactly to complete this task: <eval prompt>. Save all outputs to: <workspace>/<eval-name>/with_skill/outputs/",
  subagent_type="general"
)
```

**Baseline run** (no skill):
- **New skill**: no skill at all. Same prompt without the skill path reference.
- **Improving existing skill**: snapshot old version first (`cp -r <skill-path> <workspace>/skill-snapshot/`), then reference the snapshot.

```
task(
  description="baseline <eval-name>",
  prompt="<eval prompt>. Save all outputs to: <workspace>/<eval-name>/without_skill/outputs/",
  subagent_type="general"
)
```

### Step 4: While runs run — draft assertions

Use the time productively. Draft quantitative assertions for each test case. Good assertions are:
- Objectively verifiable (file exists, field is present, output matches regex)
- Descriptively named (read clearly in benchmark viewer)
- NOT necessary for subjective skills (writing style, design quality — evaluate qualitatively)

Update eval_metadata.json with the assertions.

### Step 5: Capture timing data

When each subagent completes, the notification includes `total_tokens` and `duration_ms`. Save immediately to `timing.json` in the run directory:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332
}
```

### Step 6: Grade each run

Spawn a grader subagent per run (or grade inline):

```
task(
  description="grade <eval-name> <config>",
  prompt="Read agents/grader.md at ~/.config/opencode/skills/skill-creator/agents/grader.md. Follow its instructions to evaluate assertions against outputs. Input: <eval_metadata.json path> and outputs at <outputs-path>. Save grading.json to: <run-directory>/",
  subagent_type="general"
)
```

For programmatically checkable assertions, write a script instead — scripts are faster and more reliable.

### Step 7: Aggregate benchmark

```bash
node ~/.config/opencode/skills/skill-creator/scripts/aggregate_benchmark.js \
  <workspace>/iteration-N \
  --skill-name "<skill-name>"
```

This produces:
- `benchmark.json` — flat structure, minimal nesting
- `benchmark.md` — human-readable summary

### Step 8: Launch the viewer

```bash
node ~/.config/opencode/skills/skill-creator/eval-viewer/generate_review.js \
  <workspace>/iteration-N \
  --skill-name "<skill-name>" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  --static <workspace>/iteration-N/review.html
```

For iteration 2+, also pass:
```
--previous-workspace <workspace>/iteration-<N-1>
```

Proffer the `review.html` link to the user so they can inspect outputs and leave feedback.

### Step 9: Read feedback

The user clicks "Submit All Reviews" which downloads `feedback.json`. Read it back:

```json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "the chart is missing axis labels", "timestamp": "..."},
    {"run_id": "eval-0-without_skill", "feedback": "", "timestamp": "..."}
  ],
  "status": "complete"
}
```

Empty feedback = user is satisfied. Focus improvements on evals with specific complaints.

---

## Phase 6: Iterate

### How to think about improvements

1. **Generalize from feedback.** Don't overfit to specific examples. The skill will be used across countless prompts. If a pattern keeps failing, try a different metaphor or approach rather than piling on MUSTs.

2. **Keep the prompt lean.** Remove instructions that aren't pulling their weight. Read transcripts, not just final outputs. If the skill makes the model waste time on unproductive tasks, trim those parts.

3. **Explain the why.** LLMs perform better with understanding. Replace rigid structures with reasoned explanations. If you find yourself writing ALWAYS or NEVER in ALL CAPS, reframe.

4. **Look for repeated work.** If all test cases independently wrote similar helper scripts, bundle that script in `scripts/` so future invocations don't reinvent the wheel.

### The loop

1. Apply improvements to the skill
2. Rerun all test cases into `iteration-<N+1>/`
3. Launch viewer with `--previous-workspace`
4. Wait for user review
5. Read feedback, improve again, repeat

Keep going until:
- User says they're happy
- All feedback is empty
- You're not making meaningful progress

---

## Phase 7: Description Optimization

Optimize the skill's frontmatter `description` field for better triggering.

### Step 1: Create trigger eval queries

20 queries — mix of should-trigger and should-not-trigger:

```json
[
  {"query": "realistic user prompt with context", "should_trigger": true},
  {"query": "near-miss that shares keywords but needs something else", "should_trigger": false}
]
```

- 10 should-trigger: different phrasings, formality levels, edge cases
- 10 should-not-trigger: near-misses, adjacent domains, ambiguous phrasing
- Must be realistic and substantive (multi-step, detailed). One-liners won't trigger skills regardless.
- Review with the user using the review template at `assets/eval_review.html`

### Step 2: Run the optimization loop

```bash
node ~/.config/opencode/skills/skill-creator/scripts/run_loop.js \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path ~/.config/opencode/skills/<skill-name> \
  --max-iterations 5
```

Configure the model via environment variables:
```
SKILL_CREATOR_MODEL=gpt-4o          # model name/ID
OPENAI_BASE_URL=https://api.openai.com/v1  # API-compatible endpoint
OPENAI_API_KEY=sk-...               # API key
```

The script splits 60/40 train/test, evaluates each description 3x per query, proposes improvements on failures, and selects the best by test score.

### Step 3: Apply result

Take `best_description` and update the skill's SKILL.md frontmatter. Report before/after and scores.

---

## Phase 8: Package

Create a .skill file for distribution:

```bash
node ~/.config/opencode/skills/skill-creator/scripts/package_skill.js \
  ~/.config/opencode/skills/<skill-name> \
  --output ./<skill-name>.skill
```

---

## Reference: Subagent spawning with Task tool

Opencode uses the `task()` tool for spawning subagents:

```
task(
  description="<3-5 word description>",
  prompt="<detailed instructions for the subagent>",
  subagent_type="general"  # or "explore" for quick searches
)
```

Available types:
- `explore` — fast, for file searches and quick research
- `general` — full agent for complex tasks

Always save outputs to a specified directory rather than relying on the subagent to return everything in its message.

---

## Reference: Flat benchmark format

Benchmarks use a flat structure to minimize token usage:

```json
{
  "skill_name": "my-skill",
  "configs": [
    {
      "name": "with_skill",
      "pass_rate": 0.85,
      "avg_time_ms": 45200,
      "avg_tokens": 85000,
      "per_eval": [
        {"name": "eval-name", "pass_rate": 1.0, "time_ms": 40000, "tokens": 80000}
      ]
    },
    {
      "name": "without_skill",
      "pass_rate": 0.70,
      "avg_time_ms": 51000,
      "avg_tokens": 92000,
      "per_eval": [
        {"name": "eval-name", "pass_rate": 0.67, "time_ms": 50000, "tokens": 90000}
      ]
    }
  ],
  "deltas": {
    "pass_rate": 0.15,
    "time_ms": -5800,
    "tokens": -7000
  }
}
```

No deep nesting, no verbose field names, no repeated metadata.

---

## Reference: Directory layout

```
<skill-name>-workspace/
├── iteration-1/
│   ├── eval-name-1/
│   │   ├── with_skill/
│   │   │   ├── outputs/
│   │   │   │   └── <files produced by skill>
│   │   │   ├── timing.json
│   │   │   └── grading.json
│   │   ├── without_skill/
│   │   │   ├── outputs/
│   │   │   ├── timing.json
│   │   │   └── grading.json
│   │   └── eval_metadata.json
│   ├── eval-name-2/
│   │   └── ...
│   ├── benchmark.json
│   ├── benchmark.md
│   └── review.html
├── iteration-2/
│   └── ...
├── skill-snapshot/          # only when improving existing skill
└── feedback.json
```
