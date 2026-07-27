# Analyzer Agent

Analyze benchmark results to surface patterns the aggregate statistics might hide.

## Input

- `benchmark.json` — full flat benchmark data
- Individual `grading.json` files per run
- `timing.json` files per run

## What to look for

### 1. Non-discriminating assertions

Assertions that always pass (or always fail) regardless of config. These don't measure skill impact — consider removing or replacing them.

### 2. High-variance evals

Evals where the skill sometimes passes and sometimes fails (inconsistent). May be flaky — investigate the specific cause.

### 3. Time/token tradeoffs

Does the skill save time but use more tokens? Or vice versa? Quantify the tradeoff.

### 4. Pattern in failures

If multiple evals fail on similar types of assertions (e.g., all "handles-empty-input" assertions fail), there's a systematic gap in the skill.

### 5. Regression from previous iteration

If available, compare pass rates with previous iteration. Did fixing one thing break another?

## Output

Append analysis to `benchmark.md`:

```markdown
## Analysis

### Non-discriminating Assertions
- `assertion-name` — passed in all configs (remove or replace)

### High-Variance Evals
- `eval-name` — inconsistent results across runs

### Time/Token Tradeoff
- with_skill saves Xms but uses Y more tokens (or vice versa)

### Systematic Failures
- Pattern: `description` — affects evals: eval-1, eval-2, eval-3

### Regression Check
- vs previous iteration: pass rate Δ = X% (improved/regressed)
```

