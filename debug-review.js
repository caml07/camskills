const fs = require('fs');
const vm = require('vm');
const WORKSPACE = "C:/Users/psistema/.config/opencode/fix-debug-workspace/iteration-1";

const html = fs.readFileSync(WORKSPACE + "/review.html", "utf-8");

// Extract renderEval function  
const fnMatch = html.match(/function renderEval\(idx\) {[\s\S]*?^}/m);
if (!fnMatch) { console.log("Could not find renderEval"); process.exit(1); }

const fn = fnMatch[0];
const lines = fn.split("\n");
console.log("renderEval has " + lines.length + " lines");

// Show line 20 (0-indexed = 19)
const line20 = lines[19];
console.log("Line 20 chars: " + line20.length);
console.log("---LINE 20 START---");
console.log(line20);
console.log("---LINE 20 END---");

// Try parsing the whole fn
try {
  new vm.Script(fn);
  console.log("Function parses OK");
} catch(e) {
  console.log("Parse error: " + e.message);
}

// Try just line 20  
try {
  new vm.Script(line20);
  console.log("Line 20 parses OK alone");
} catch(e) {
  console.log("Line 20 alone error: " + e.message);
  
  // Break line 20 into tokens
  let i = 0;
  const parts = [];
  let current = "";
  while (i < line20.length) {
    current += line20[i];
    try {
      new vm.Script(current);
      parts.push({code: current, ok: true});
    } catch(e2) {
      parts.push({code: current, ok: false, err: e2.message});
      current = "";
    }
    i++;
  }
  
  // Find the problematic segment
  for (const p of parts) {
    if (!p.ok) {
      console.log("Problem at: " + p.code.substring(0, 100) + "...");
      console.log("Error: " + p.err);
    }
  }
}
