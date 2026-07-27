# Benchmark: fix-debug

| Config | Pass Rate | Time (ms) | Tokens |
|--------|-----------|-----------|--------|
| with_skill | 100.0% ±0.0% | 60000 ±5000 | 47667 ±2517 |
| without_skill | 94.4% ±9.6% | 42333 ±2517 | 37667 ±2517 |

## Deltas (with_skill - without_skill)
- Pass rate: **+5.6%**
- Time: **+17667ms**
- Tokens: **+10000**

## Per-Eval Breakdown

### with_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| prisma-auth-error | 100.0% | 6/6 | 55000 | 45000 |
| react-native-crash | 100.0% | 6/6 | 60000 | 48000 |
| react-native-perf | 100.0% | 6/6 | 65000 | 50000 |
### without_skill

| Eval | Pass Rate | Assertions | Time (ms) | Tokens |
|------|-----------|------------|-----------|--------|
| prisma-auth-error | 83.3% | 5/6 | 40000 | 35000 |
| react-native-crash | 100.0% | 6/6 | 42000 | 38000 |
| react-native-perf | 100.0% | 6/6 | 45000 | 40000 |
