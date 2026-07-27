const fs = require("fs");
const cp = require("child_process");

const WORKSPACE = "C:/Users/psistema/.config/opencode/fix-debug-workspace/iteration-1";
const html = fs.readFileSync(WORKSPACE + "/review.html", "utf-8");

// Find the line
const lines = html.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("feedback-section") && lines[i].includes("onchange")) {
    const line = lines[i];
    console.log("Line " + (i+1) + " length: " + line.length);
    
    // Count all single quotes and their positions
    const squotes = [];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "'") squotes.push(j);
    }
    console.log("Single quote positions: " + JSON.stringify(squotes));
    console.log("Single quote count: " + squotes.length);
    
    // If we have 10 quotes, pairs should be (0,1), (2,3), (4,5), (6,7), (8,9)
    if (squotes.length === 10) {
      for (let p = 0; p < squotes.length; p += 2) {
        const start = squotes[p];
        const end = squotes[p + 1];
        console.log("\nString " + (p/2 + 1) + " (positions " + start + "-" + end + "):");
        console.log("  " + JSON.stringify(line.substring(start, end + 1)));
      }
      
      // Show the expression between strings
      for (let p = 2; p < squotes.length - 2; p += 2) {
        const afterEnd = squotes[p - 1] + 1;
        const beforeStart = squotes[p];
        const expr = line.substring(afterEnd, beforeStart).trim();
        console.log("\nExpression between string " + (p/2) + " and string " + (p/2 + 1) + ":");
        console.log("  " + expr);
      }
    }
    
    break;
  }
}
