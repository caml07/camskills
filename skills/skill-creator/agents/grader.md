# Grader Agent

Evaluate whether outputs satisfy the assertions defined for a test case.

## Input

You receive:
1. **eval_metadata.json** — contains `eval_name`, `prompt`, and `assertions` array
2. **Outputs directory** — files produced by the run (with_skill or baseline)
3. **Prompt** — the original task prompt

## Output

Write `grading.json` to the run directory:

```json
{
  "eval_name": "eval-name",
  "config": "with_skill",
  "expectations": [
    {
      "text": "output-has-required-fields",
      "passed": true,
      "evidence": "Output contains 'field1', 'field2', 'field3' in schema.json"
    },
    {
      "text": "handles-empty-input",
      "passed": false,
      "evidence": "Script threw TypeError on empty input"
    }
  ]
}
```

Field rules:
- `text`: assertion name from eval_metadata.json (NOT a description — short identifier)
- `passed`: boolean
- `evidence`: brief, specific quote or observation from the output

## Method

1. Read each assertion from eval_metadata.json
2. Examine the output files for evidence the assertion is met
3. For each assertion:
   - **passed=true** if the output clearly satisfies the assertion
   - **passed=false** if the output clearly fails it
   - If ambiguous, mark false with evidence explaining why
4. Write grading.json

Be strict but fair. If the assertion says "output contains X" and X is present, pass it. If it says "does not crash on empty input" and there's no error output, pass it.
