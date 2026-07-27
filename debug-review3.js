const fs = require("fs");
const cp = require("child_process");

const WORKSPACE = "C:/Users/psistema/.config/opencode/fix-debug-workspace/iteration-1";
const html = fs.readFileSync(WORKSPACE + "/review.html", "utf-8");

// Extract renderEval using proper brace matching
const fnStart = html.indexOf("function renderEval(idx)");
let depth = 0;
let fnEnd = fnStart;
for (let i = fnStart; i < html.length; i++) {
  if (html[i] === "{") depth++;
  else if (html[i] === "}") depth--;
  if (depth === 0 && i > fnStart) {
    fnEnd = i;
    break;
  }
}
const fnText = html.substring(fnStart, fnEnd + 1);
const lines = fnText.split("\n");
console.log("Total lines: " + lines.length);

// Show line 20 and surrounding context
for (let i = Math.max(0, 18); i < Math.min(lines.length, 22); i++) {
  console.log("Line " + (i+1) + " (" + lines[i].length + " chars): " + lines[i].substring(0, 200));
}

// Write line 20 to file and check
const line20 = lines[19];
const tmpFile = process.env.TEMP + "\\line20_test.js";
fs.writeFileSync(tmpFile, line20);

const result = cp.spawnSync("node", ["--check", tmpFile]);
console.log("\nnode --check output:");
console.log(result.stderr.toString());

// Try with the full function
const fnFile = process.env.TEMP + "\\fn_renderEval_test.js";
fs.writeFileSync(fnFile, fnText);
const result2 = cp.spawnSync("node", ["--check", fnFile]);
console.log("Full function --check:");
console.log(result2.stderr.toString() || "OK");

// Character-by-character analysis of problematic region
// Find 'feedback' in line20
const fbIdx = line20.indexOf("feedback");
if (fbIdx >= 0) {
  console.log("\nCharacter analysis around 'feedback[':");
  for (let i = fbIdx - 5; i < Math.min(fbIdx + 30, line20.length); i++) {
    const ch = line20[i];
    const code = line20.charCodeAt(i);
    const desc = ch === "'" ? "SINGLE_QUOTE" : 
                 ch === '"' ? "DOUBLE_QUOTE" :
                 ch === "\\" ? "BACKSLASH" : 
                 ch === "+" ? "PLUS" :
                 ch === "[" ? "BRACKET_OPEN" :
                 ch === "]" ? "BRACKET_CLOSE" : 
                 ch;
    console.log("  Pos " + i + ": '" + ch + "' (0x" + code.toString(16) + ") - " + desc);
  }
}
