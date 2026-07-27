# Benchmark: no-commit-secrets

| Config | Pass Rate | Time (ms) | Tokens |
|--------|-----------|-----------|--------|
| with_skill | 100.0% ±0.0% | 45000 ±5000 | 36000 ±1732 |
| without_skill | 85.0% ±13.2% | 28333 ±6506 | 22667 ±5033 |

## Deltas (with_skill - without_skill)
- Pass rate: **+15.0%**
- Time: **+16667ms**
- Tokens: **+13333**

## Per-Eval Breakdown

### with_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| missing-gitignore | 100.0% | 4/4 | 50000 | 38000 |
| save-api-key | 100.0% | 5/5 | 45000 | 35000 |
| staged-file-with-secret | 100.0% | 5/5 | 40000 | 35000 |
### without_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| missing-gitignore | 75.0% | 3/4 | 22000 | 18000 |
| save-api-key | 100.0% | 5/5 | 35000 | 28000 |
| staged-file-with-secret | 80.0% | 4/5 | 28000 | 22000 |
