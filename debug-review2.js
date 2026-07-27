const fs = require("fs");
const cp = require("child_process");

const WORKSPACE = "C:/Users/psistema/.config/opencode/fix-debug-workspace/iteration-1";
const html = fs.readFileSync(WORKSPACE + "/review.html", "utf-8");

const fnMatch = html.match(/function renderEval\(idx\) {[\s\S]*?^}/m);
if (!fnMatch) { console.log("no match"); process.exit(1); }

const fn = fnMatch[0];
fs.writeFileSync("C:/Users/psistema/AppData/Local/Temp/renderEval_fn.js", fn);

const result = cp.spawnSync("node", ["--check", "/tmp/renderEval_fn.js"]);
console.log("Node --check output:", result.stderr.toString() || "OK");
console.log("Status:", result.status);

// Also try checking just line 20
const lines = fn.split("\n");
fs.writeFileSync("C:/Users/psistema/AppData/Local/Temp/renderEval_line20.js", lines[19]);

const result2 = cp.spawnSync("node", ["--check", "C:/Users/psistema/AppData/Local/Temp/renderEval_line20.js"]);
console.log("\nLine 20 --check:", result2.stderr.toString() || "OK");
