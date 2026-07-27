const fs = require("fs");
const cp = require("child_process");

const WORKSPACE = "C:/Users/psistema/.config/opencode/fix-debug-workspace/iteration-1";
const html = fs.readFileSync(WORKSPACE + "/review.html", "utf-8");

// Find the line containing "feedback-section" in the whole file
const lines = html.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("feedback-section") && lines[i].includes("onchange")) {
    console.log("Line " + (i+1) + " (" + lines[i].length + " chars):");
    console.log(lines[i]);
    
    // Write just this line and check syntax
    const tmpFile = process.env.TEMP + "\\onchange_line.js";
    fs.writeFileSync(tmpFile, lines[i]);
    
    const result = cp.spawnSync("node", ["--check", tmpFile]);
    console.log("\nnode --check:");
    console.log(result.stderr.toString() || "OK");
    
    // Character analysis
    const fbIdx = lines[i].indexOf("feedback");
    console.log("\nChar analysis around 'feedback[':");
    const start = Math.max(0, fbIdx - 5);
    const end = Math.min(lines[i].length, fbIdx + 40);
    for (let j = start; j < end; j++) {
      const ch = lines[i][j];
      const code = lines[i].charCodeAt(j);
      let desc;
      if (ch === "'") desc = "SQ";
      else if (ch === '"') desc = "DQ";
      else if (ch === "\\") desc = "BS";
      else if (ch === "+") desc = "PLUS";
      else if (ch === "[") desc = "[";
      else if (ch === "]") desc = "]";
      else if (ch === " ") desc = "SP";
      else desc = ch;
      console.log("  pos=" + j + " char=0x" + code.toString(16) + " (" + desc + ")");
    }
    break;
  }
}
