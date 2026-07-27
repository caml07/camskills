# Benchmark: notes-vault

| Config | Pass Rate | Time (ms) | Tokens |
|--------|-----------|-----------|--------|
| with_skill | 100.0% ±0.0% | 42500 ±3536 | 32500 ±3536 |
| without_skill | 91.7% ±11.8% | 33500 ±2121 | 26500 ±2121 |

## Deltas (with_skill - without_skill)
- Pass rate: **+8.3%**
- Time: **+9000ms**
- Tokens: **+6000**

## Per-Eval Breakdown

### with_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| create-atomic-note | 100.0% | 6/6 | 45000 | 35000 |
| update-moc | 100.0% | 6/6 | 40000 | 30000 |
### without_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| create-atomic-note | 83.3% | 5/6 | 35000 | 28000 |
| update-moc | 100.0% | 6/6 | 32000 | 25000 |
