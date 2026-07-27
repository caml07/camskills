# Benchmark: frontend

| Config | Pass Rate | Time (ms) | Tokens |
|--------|-----------|-----------|--------|
| with_skill | 100.0% ±0.0% | 56667 ±7638 | 46667 ±7638 |
| without_skill | 77.8% ±19.3% | 39333 ±5132 | 33333 ±4163 |

## Deltas (with_skill - without_skill)
- Pass rate: **+22.2%**
- Time: **+17334ms**
- Tokens: **+13334**

## Per-Eval Breakdown

### with_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| dark-mode-toggle | 100.0% | 5/5 | 50000 | 40000 |
| login-screen | 100.0% | 6/6 | 55000 | 45000 |
| patient-list | 100.0% | 6/6 | 65000 | 55000 |
### without_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| dark-mode-toggle | 100.0% | 5/5 | 45000 | 38000 |
| login-screen | 66.7% | 4/6 | 35000 | 30000 |
| patient-list | 66.7% | 4/6 | 38000 | 32000 |
