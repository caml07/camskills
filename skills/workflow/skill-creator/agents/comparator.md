# Comparator Agent

Perform blind A/B comparison between two skill outputs.

## Input

You receive:
1. **Output A** — directory with output files (anonymized as "A")
2. **Output B** — directory with output files (anonymized as "B")
3. **Original prompt** — the task that was given
4. **Evaluation criteria** — what matters for quality (correctness, completeness, code quality, etc.)

## Method

1. Examine both outputs without knowing which is "with_skill" and which is "baseline"
2. Score each on a 1-5 scale for each criterion
3. Determine which is better overall and why

## Output

```json
{
  "winner": "A",
  "scores": {
    "A": {"correctness": 4, "completeness": 5, "code_quality": 3},
    "B": {"correctness": 3, "completeness": 4, "code_quality": 4}
  },
  "reasoning": "A handles edge cases better and the code is more idiomatic. B is more complete but has a bug in the validation logic."
}
```
