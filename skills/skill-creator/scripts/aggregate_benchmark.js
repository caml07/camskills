#!/usr/bin/env node
/**
 * Aggregate grading results into a flat benchmark.json.
 *
 * Usage:
 *   node aggregate_benchmark.js <workspace>/iteration-N --skill-name <name>
 *
 * Outputs:
 *   - benchmark.json (flat structure)
 *   - benchmark.md (human-readable summary)
 */

const fs = require("fs");
const path = require("path");

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return null;
  }
}

function mean(vals) {
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function stdev(vals) {
  if (vals.length < 2) return 0;
  const m = mean(vals);
  const sqDiffs = vals.map((v) => (v - m) ** 2);
  return Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / (vals.length - 1));
}

function gatherRuns(workspace) {
  const runs = {};
  const entries = fs.readdirSync(workspace);
  for (const entry of entries) {
    const evalDir = path.join(workspace, entry);
    if (!fs.statSync(evalDir).isDirectory()) continue;
    if (entry === "skill-snapshot" || entry.startsWith(".")) continue;

    const metadataPath = path.join(evalDir, "eval_metadata.json");
    if (!fs.existsSync(metadataPath)) continue;

    const metadata = loadJson(metadataPath);
    const evalName = (metadata && metadata.eval_name) || entry;
    runs[evalName] = { metadata: metadata || {}, configs: {} };

    for (const config of ["with_skill", "without_skill"]) {
      const configDir = path.join(evalDir, config);
      const timingPath = path.join(configDir, "timing.json");
      const gradingPath = path.join(configDir, "grading.json");

      const timing = loadJson(timingPath);
      const grading = loadJson(gradingPath);
      runs[evalName].configs[config] = {
        timing,
        grading,
        expectations: (grading && grading.expectations) || [],
      };
    }
  }
  return runs;
}

function computeEvalMetrics(expectations) {
  const passed = expectations.filter((e) => e.passed).length;
  const total = expectations.length;
  const rate = total > 0 ? passed / total : 0;
  return { rate, passed, total };
}

function buildBenchmark(runs, skillName) {
  const configNames = ["with_skill", "without_skill"];
  const configs = [];
  const deltas = {};

  for (const config of configNames) {
    const evalRates = [];
    const evalData = [];

    for (const [evalName, run] of Object.entries(runs)) {
      const cfg = run.configs[config];
      if (!cfg) continue;
      const { rate, passed, total } = computeEvalMetrics(cfg.expectations);
      const timing = cfg.timing || {};
      const timeMs = timing.duration_ms || 0;
      const tokens = timing.total_tokens || 0;
      evalRates.push(rate);
      evalData.push({
        name: evalName,
        pass_rate: Math.round(rate * 10000) / 10000,
        assertions_passed: passed,
        assertions_total: total,
        time_ms: timeMs,
        tokens,
      });
    }

    configs.push({
      name: config,
      pass_rate: Math.round(mean(evalRates) * 10000) / 10000,
      pass_rate_std: Math.round(stdev(evalRates) * 10000) / 10000,
      avg_time_ms: Math.round(mean(evalData.map((e) => e.time_ms))),
      time_ms_std: Math.round(stdev(evalData.map((e) => e.time_ms))),
      avg_tokens: Math.round(mean(evalData.map((e) => e.tokens))),
      tokens_std: Math.round(stdev(evalData.map((e) => e.tokens))),
      per_eval: evalData,
    });
  }

  if (configs.length === 2) {
    deltas.pass_rate = Math.round((configs[0].pass_rate - configs[1].pass_rate) * 10000) / 10000;
    deltas.time_ms = configs[0].avg_time_ms - configs[1].avg_time_ms;
    deltas.tokens = configs[0].avg_tokens - configs[1].avg_tokens;
  }

  return { skill_name: skillName, configs, deltas };
}

function writeBenchmarkMd(benchmark, filePath) {
  const lines = [];
  lines.push(`# Benchmark: ${benchmark.skill_name}\n`);
  lines.push("| Config | Pass Rate | Time (ms) | Tokens |");
  lines.push("|--------|-----------|-----------|--------|");
  for (const cfg of benchmark.configs) {
    const pr = (cfg.pass_rate * 100).toFixed(1);
    const prs = (cfg.pass_rate_std * 100).toFixed(1);
    lines.push(
      `| ${cfg.name} | ${pr}% ±${prs}% | ${cfg.avg_time_ms} ±${cfg.time_ms_std} | ${cfg.avg_tokens} ±${cfg.tokens_std} |`
    );
  }

  const deltas = benchmark.deltas;
  if (deltas && Object.keys(deltas).length) {
    lines.push(`\n## Deltas (with_skill - without_skill)`);
    const dr = ((deltas.pass_rate || 0) * 100).toFixed(1);
    lines.push(`- Pass rate: **${deltas.pass_rate >= 0 ? "+" : ""}${dr}%**`);
    lines.push(`- Time: **${deltas.time_ms >= 0 ? "+" : ""}${deltas.time_ms}ms**`);
    lines.push(`- Tokens: **${deltas.tokens >= 0 ? "+" : ""}${deltas.tokens}**`);
  }

  lines.push("\n## Per-Eval Breakdown\n");
  for (const cfg of benchmark.configs) {
    lines.push(`### ${cfg.name}\n`);
    lines.push("| Eval | Pass Rate | Assertions | Time (ms) | Tokens |");
    lines.push("|------|-----------|------------|-----------|--------|");
    for (const ev of cfg.per_eval) {
      const pr = (ev.pass_rate * 100).toFixed(1);
      lines.push(`| ${ev.name} | ${pr}% | ${ev.assertions_passed}/${ev.assertions_total} | ${ev.time_ms} | ${ev.tokens} |`);
    }
  }

  fs.writeFileSync(filePath, lines.join("\n") + "\n");
  console.log(`Wrote ${filePath}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: aggregate_benchmark.js <workspace/iteration-N> --skill-name <name>");
    process.exit(1);
  }

  const workspace = path.resolve(args[0]);
  let skillName = "unknown";
  const nameIdx = args.indexOf("--skill-name");
  if (nameIdx >= 0 && nameIdx + 1 < args.length) {
    skillName = args[nameIdx + 1];
  }

  console.log(`Aggregating: ${workspace}`);
  const runs = gatherRuns(workspace);
  console.log(`Found ${Object.keys(runs).length} eval runs`);

  const benchmark = buildBenchmark(runs, skillName);
  const benchmarkPath = path.join(workspace, "benchmark.json");
  fs.writeFileSync(benchmarkPath, JSON.stringify(benchmark, null, 2));
  console.log(`Wrote ${benchmarkPath}`);

  writeBenchmarkMd(benchmark, path.join(workspace, "benchmark.md"));
}

main();
