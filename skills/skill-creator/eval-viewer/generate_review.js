#!/usr/bin/env node
/**
 * Generate a standalone HTML review page for skill evaluation results.
 *
 * Usage:
 *   node generate_review.js <workspace>/iteration-N \
 *     --skill-name "my-skill" \
 *     --benchmark <workspace>/iteration-N/benchmark.json \
 *     --static <workspace>/iteration-N/review.html
 *
 * Optional:
 *     --previous-workspace <workspace>/iteration-<N-1>
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

function gatherOutputs(workspace) {
  const evals = [];
  const entries = fs.readdirSync(workspace);
  for (const entry of entries) {
    const evalDir = path.join(workspace, entry);
    if (!fs.statSync(evalDir).isDirectory()) continue;
    if (entry.startsWith(".") || entry === "skill-snapshot") continue;

    const metadata = loadJson(path.join(evalDir, "eval_metadata.json"));
    if (!metadata) continue;

    const evalItem = {
      name: metadata.eval_name || entry,
      prompt: metadata.prompt || "",
      run_id: entry,
      configs: {},
    };

    for (const config of ["with_skill", "without_skill"]) {
      const configDir = path.join(evalDir, config, "outputs");
      const grading = loadJson(path.join(evalDir, config, "grading.json"));
      const timing = loadJson(path.join(evalDir, config, "timing.json"));

      const outputs = [];
      if (fs.existsSync(configDir)) {
        const files = fs.readdirSync(configDir);
        for (const f of files) {
          const fpath = path.join(configDir, f);
          if (fs.statSync(fpath).isFile()) {
            let content;
            try {
              content = fs.readFileSync(fpath, "utf-8");
            } catch {
              content = `[binary file: ${f}]`;
            }
            outputs.push({ filename: f, content });
          }
        }
      }

      evalItem.configs[config] = { outputs, grading, timing };
    }

    evals.push(evalItem);
  }
  return evals;
}

function gatherPreviousOutputs(prevWorkspace) {
  if (!prevWorkspace) return {};
  const evals = gatherOutputs(prevWorkspace);
  const map = {};
  for (const e of evals) map[e.run_id] = e;
  return map;
}

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#047;");
}

function renderHtml(evals, benchmark, skillName, previous) {
  previous = previous || {};
  const evalsJson = JSON.stringify(evals);
  const benchmarkJson = JSON.stringify(benchmark);
  const previousJson = JSON.stringify(previous);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skill Review: ${escapeHtml(skillName)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#1a1a2e}
nav{background:#1a1a2e;color:#fff;padding:12px 24px;display:flex;align-items:center;gap:24px}
nav h1{font-size:18px;font-weight:600}
.tabs{display:flex;gap:0}
.tab{padding:8px 20px;cursor:pointer;opacity:.6;border-bottom:2px solid transparent}
.tab.active{opacity:1;border-bottom-color:#4f8cff}
.content{display:none;padding:24px;max-width:1200px;margin:0 auto}
.content.active{display:block}
.eval-list{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.eval-btn{padding:6px 14px;border:1px solid #ddd;border-radius:6px;cursor:pointer;background:#fff;font-size:13px}
.eval-btn.active{background:#4f8cff;color:#fff;border-color:#4f8cff}
.eval-panel{display:none}
.eval-panel.active{display:block}
.prompt{background:#eef;padding:16px;border-radius:8px;margin-bottom:16px;white-space:pre-wrap;font-size:14px}
.config-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.config-card{background:#fff;border-radius:8px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.config-card h3{font-size:14px;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.output-file{background:#f8f8f8;border-radius:6px;margin:8px 0;overflow:hidden}
.output-file h4{font-size:13px;padding:8px 12px;background:#eee}
.output-file pre{padding:12px;font-size:12px;overflow-x:auto;max-height:400px}
.grading{font-size:13px;margin-top:12px}
.grading-item{padding:4px 0}
.pass{color:#22c55e}
.fail{color:#ef4444}
.timing{font-size:12px;color:#666;margin-top:8px}
.benchmark-table{width:100%;border-collapse:collapse;margin:16px 0}
.benchmark-table th,.benchmark-table td{padding:10px 14px;text-align:left;border-bottom:1px solid #eee;font-size:14px}
.benchmark-table th{background:#f8f8f8;font-weight:600}
.delta-positive{color:#22c55e}
.delta-negative{color:#ef4444}
.feedback-section{margin-top:16px}
.feedback-textarea{width:100%;min-height:80px;padding:10px;border:1px solid #ddd;border-radius:6px;font-family:inherit;font-size:13px;resize:vertical}
.submit-btn{display:block;margin:24px auto;padding:12px 32px;background:#1a1a2e;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}
.submit-btn:hover{background:#2d2d4e}
.prev-output{margin-top:12px;padding:12px;background:#fffbe6;border-radius:6px;font-size:13px}
.prev-output summary{cursor:pointer;font-weight:600}
.empty{color:#999;font-style:italic;padding:20px;text-align:center}
</style>
</head>
<body>
<nav>
  <h1>Skill Review: ${escapeHtml(skillName)}</h1>
  <div class="tabs">
    <div class="tab active" onclick="switchTab('outputs')">Outputs</div>
    <div class="tab" onclick="switchTab('benchmark')">Benchmark</div>
  </div>
</nav>

<div id="tab-outputs" class="content active">
  <div class="eval-list" id="eval-list"></div>
  <div id="eval-panels"></div>
  <button class="submit-btn" onclick="submitFeedback()">Submit All Reviews</button>
</div>

<div id="tab-benchmark" class="content">
  <div id="benchmark-content"></div>
</div>

<script>
const EVALS = ${evalsJson};
const BENCHMARK = ${benchmarkJson};
const PREVIOUS = ${previousJson};
const feedback = {};

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab[onclick*="'+name+'"]').classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function renderConfig(name, cfg, runId) {
  let html = '<div class="config-card"><h3>'+name+'</h3>';
  if (cfg.outputs && cfg.outputs.length) {
    cfg.outputs.forEach(of => {
      html += '<div class="output-file"><h4>'+esc(of.filename)+'</h4><pre>'+esc(of.content)+'</pre></div>';
    });
  } else {
    html += '<div class="empty">No output files</div>';
  }
  if (cfg.grading && cfg.grading.expectations) {
    html += '<div class="grading">';
    cfg.grading.expectations.forEach(e => {
      const cls = e.passed ? 'pass' : 'fail';
      const icon = e.passed ? '\\u2705' : '\\u274c';
      html += '<div class="grading-item '+cls+'">'+icon+' <strong>'+esc(e.text)+'</strong> &mdash; '+esc(e.evidence||'')+'</div>';
    });
    html += '</div>';
  }
  if (cfg.timing) {
    html += '<div class="timing">Tokens: '+(cfg.timing.total_tokens||'?')+' | Time: '+(cfg.timing.duration_ms||'?')+'ms</div>';
  }
  html += '</div>';
  return html;
}

function renderBenchmark() {
  let html = '<h2>Benchmark: '+esc(BENCHMARK.skill_name||'')+'</h2>';
  html += '<table class="benchmark-table"><tr><th>Config</th><th>Pass Rate</th><th>Time (ms)</th><th>Tokens</th></tr>';
  (BENCHMARK.configs||[]).forEach(c => {
    html += '<tr><td><strong>'+esc(c.name)+'</strong></td><td>'+(c.pass_rate*100).toFixed(1)+'% \\u00b1'+(c.pass_rate_std*100).toFixed(1)+'%</td><td>'+c.avg_time_ms+' \\u00b1'+c.time_ms_std+'</td><td>'+c.avg_tokens+' \\u00b1'+c.tokens_std+'</td></tr>';
  });
  html += '</table>';

  if (BENCHMARK.deltas && Object.keys(BENCHMARK.deltas).length) {
    html += '<h3>Deltas (with_skill - baseline)</h3><table class="benchmark-table">';
    for (const [key, val] of Object.entries(BENCHMARK.deltas)) {
      const cls = typeof val === 'number' && val > 0 ? 'delta-positive' : 'delta-negative';
      const sign = typeof val === 'number' && val > 0 ? '+' : '';
      html += '<tr><td>'+key+'</td><td class="'+cls+'">'+sign+(typeof val === 'number' ? (val%1!==0?val.toFixed(1):val) : val)+'</td></tr>';
    }
    html += '</table>';
  }

  (BENCHMARK.configs||[]).forEach(c => {
    html += '<h3>'+esc(c.name)+' &mdash; Per Eval</h3><table class="benchmark-table"><tr><th>Eval</th><th>Pass Rate</th><th>Assertions</th><th>Time (ms)</th><th>Tokens</th></tr>';
    (c.per_eval||[]).forEach(e => {
      html += '<tr><td>'+esc(e.name)+'</td><td>'+(e.pass_rate*100).toFixed(1)+'%</td><td>'+e.assertions_passed+'/'+e.assertions_total+'</td><td>'+e.time_ms+'</td><td>'+e.tokens+'</td></tr>';
    });
    html += '</table>';
  });

  document.getElementById('benchmark-content').innerHTML = html;
}

function renderEval(idx) {
  const ev = EVALS[idx];
  if (!ev) return;
  let html = '<div class="prompt"><strong>Prompt:</strong><br>'+esc(ev.prompt)+'</div>';
  html += '<div class="config-grid">';
  html += renderConfig('with_skill', ev.configs.with_skill||{}, ev.run_id);
  html += renderConfig('without_skill', ev.configs.without_skill||{}, ev.run_id);
  html += '</div>';

  const prev = PREVIOUS[ev.run_id];
  if (prev) {
    html += '<details class="prev-output"><summary>Previous Iteration Output</summary>';
    html += '<div class="config-grid">';
    html += renderConfig('with_skill (prev)', prev.configs.with_skill||{}, ev.run_id+'-prev');
    html += renderConfig('without_skill (prev)', prev.configs.without_skill||{}, ev.run_id+'-prev');
    html += '</div></details>';
  }

  const saved = feedback[ev.run_id] || '';
  html += '<div class="feedback-section"><label><strong>Feedback:</strong></label><textarea class="feedback-textarea" id="fb-'+ev.run_id+'" placeholder="What do you think? Anything to change?">'+esc(saved)+'</textarea></div>';

  const panel = document.getElementById('panel-'+idx);
  if (panel) panel.innerHTML = html;
}

function switchEval(idx) {
  document.querySelectorAll('.eval-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.eval-panel').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector('.eval-btn[data-idx="'+idx+'"]');
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('panel-'+idx);
  if (panel) panel.classList.add('active');
  renderEval(idx);
}

function init() {
  const list = document.getElementById('eval-list');
  const panels = document.getElementById('eval-panels');
  EVALS.forEach((ev, i) => {
    const btn = document.createElement('div');
    btn.className = 'eval-btn'+(i===0?' active':'');
    btn.textContent = ev.name||ev.run_id;
    btn.dataset.idx = i;
    btn.onclick = () => switchEval(i);
    list.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'panel-'+i;
    panel.className = 'eval-panel'+(i===0?' active':'');
    panels.appendChild(panel);
  });
  if (EVALS.length) renderEval(0);
  renderBenchmark();
}

function submitFeedback() {
  const reviews = [];
  EVALS.forEach(ev => {
    const el = document.getElementById('fb-'+ev.run_id);
    const val = el ? el.value.trim() : '';
    if (val) {
      reviews.push({run_id: ev.run_id, feedback: val, timestamp: new Date().toISOString()});
    }
  });
  const fb = {reviews, status: 'complete'};
  const blob = new Blob([JSON.stringify(fb, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'feedback.json';
  a.click();
}

document.addEventListener('DOMContentLoaded', init);
</script>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);
  const workspace = args[0];
  if (!workspace) {
    console.error("Usage: generate_review.js <workspace/iteration-N> [options]");
    process.exit(1);
  }

  let skillName = "Skill";
  let benchmarkPath = null;
  let outputPath = path.join(workspace, "review.html");
  let prevWorkspace = null;

  const nameIdx = args.indexOf("--skill-name");
  if (nameIdx >= 0 && nameIdx + 1 < args.length) skillName = args[nameIdx + 1];

  const benchIdx = args.indexOf("--benchmark");
  if (benchIdx >= 0 && benchIdx + 1 < args.length) benchmarkPath = args[benchIdx + 1];

  const staticIdx = args.indexOf("--static");
  if (staticIdx >= 0 && staticIdx + 1 < args.length) outputPath = args[staticIdx + 1];

  const prevIdx = args.indexOf("--previous-workspace");
  if (prevIdx >= 0 && prevIdx + 1 < args.length) prevWorkspace = args[prevIdx + 1];

  const benchmark = benchmarkPath ? loadJson(benchmarkPath) : { skill_name: skillName, configs: [], deltas: {} };
  const evals = gatherOutputs(workspace);
  const previous = prevWorkspace ? gatherPreviousOutputs(prevWorkspace) : {};

  console.log(`Found ${evals.length} evals`);
  const html = renderHtml(evals, benchmark, skillName, previous);

  const outPath = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf-8");
  console.log(`Review written to ${outPath}`);
}

main();
