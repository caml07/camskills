const fs = require("fs");
const vm = require("vm");

const skills = ["no-commit-secrets", "fix-debug", "test-first", "notes-vault"];

for (const skill of skills) {
  const file = `C:/Users/psistema/.config/opencode/${skill}-workspace/iteration-1/review.html`;
  if (!fs.existsSync(file)) {
    console.log(`${skill}: NOT FOUND`);
    continue;
  }
  const html = fs.readFileSync(file, "utf-8");
  
  // Check no unescaped ' in onchange  
  if (html.includes("onchange")) {
    console.log(`${skill}: WARNING - still has onchange`);
  } else {
    console.log(`${skill}: no onchange attribute ✓`);
  }
  
  // Check script syntax  
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  if (!match) {
    console.log(`${skill}: no script tag`);
    continue;
  }
  
  try {
    new vm.Script(match[1]);
    console.log(`${skill}: SCRIPT OK ✓`);
  } catch(e) {
    console.log(`${skill}: SCRIPT ERROR - ${e.message.substring(0, 100)}`);
  }
  
  // Check line count
  console.log(`${skill}: ${html.split("\n").length} lines, ${html.length} bytes`);
}
