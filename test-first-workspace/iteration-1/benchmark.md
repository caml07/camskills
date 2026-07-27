# Benchmark: test-first

| Config | Pass Rate | Time (ms) | Tokens |
|--------|-----------|-----------|--------|
| with_skill | 100.0% ±0.0% | 50000 ±0 | 40000 ±0 |
| without_skill | 100.0% ±0.0% | 35000 ±0 | 30000 ±0 |

## Deltas (with_skill - without_skill)
- Pass rate: **+0.0%**
- Time: **+15000ms**
- Tokens: **+10000**

## Per-Eval Breakdown

### with_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| api-service-test | 100.0% | 7/7 | 50000 | 40000 |
| hook-with-query-test | 100.0% | 7/7 | 50000 | 40000 |
| zustand-store-tdd | 100.0% | 7/7 | 50000 | 40000 |
### without_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| api-service-test | 100.0% | 7/7 | 35000 | 30000 |
| hook-with-query-test | 100.0% | 7/7 | 35000 | 30000 |
| zustand-store-tdd | 100.0% | 7/7 | 35000 | 30000 |
