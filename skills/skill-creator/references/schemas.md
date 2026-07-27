# JSON Schemas for Skill Creator

All schemas use flat structures to minimize token overhead.

---

## evals.json

```json
{
  "skill_name": "my-skill",
  "evals": [
    {
      "id": 1,
      "name": "kebab-case-eval-name",
      "prompt": "Realistic user task prompt",
      "files": ["input/data.csv"],
      "expected_output": "Description of expected result",
      "assertions": [
        {
          "name": "descriptive-assertion-name",
          "description": "What this assertion checks"
        }
      ]
    }
  ]
}
```

---

## eval_metadata.json

```json
{
  "eval_name": "kebab-case-eval-name",
  "prompt": "User's task prompt",
  "assertions": [
    {
      "name": "descriptive-assertion-name",
      "description": "What this assertion checks"
    }
  ]
}
```

---

## timing.json

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332
}
```

---

## grading.json

```json
{
  "eval_name": "eval-name",
  "config": "with_skill",
  "expectations": [
    {
      "text": "descriptive-assertion-name",
      "passed": true,
      "evidence": "Brief observation from output"
    }
  ]
}
```

---

## benchmark.json (flat)

```json
{
  "skill_name": "my-skill",
  "configs": [
    {
      "name": "with_skill",
      "pass_rate": 0.85,
      "pass_rate_std": 0.08,
      "avg_time_ms": 45200,
      "time_ms_std": 5200,
      "avg_tokens": 85000,
      "tokens_std": 4800,
      "per_eval": [
        {
          "name": "eval-name",
          "pass_rate": 1.0,
          "assertions_passed": 3,
          "assertions_total": 3,
          "time_ms": 40000,
          "tokens": 80000
        }
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

---

## feedback.json

```json
{
  "reviews": [
    {
      "run_id": "eval-name-with_skill",
      "feedback": "User's comments on this run",
      "timestamp": "2026-01-15T10:30:00Z"
    }
  ],
  "status": "complete"
}
```

---

## Trigger eval set

```json
[
  {"query": "realistic user prompt", "should_trigger": true},
  {"query": "near-miss prompt", "should_trigger": false}
]
```
