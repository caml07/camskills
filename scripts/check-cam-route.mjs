#!/usr/bin/env node
// Static checks for Cam Route's contracts. Classification remains contextual.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, lstatSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const globalSkills = new Map();

for (const category of readdirSync(skillsDir)) {
  const dir = join(skillsDir, category);
  if (!lstatSync(dir).isDirectory()) continue;
  for (const name of readdirSync(dir)) {
    const file = join(dir, name, "SKILL.md");
    if (!existsSync(file)) continue;
    // Pstack keeps two private copies; Matt Pocock owns their public aliases.
    if (globalSkills.has(name) && category === "pstack" && ["tdd", "teach"].includes(name)) {
      continue;
    }
    assert.ok(!globalSkills.has(name), `Duplicate discoverable skill: ${name}`);
    globalSkills.set(name, file);
  }
}

const routerPath = globalSkills.get("cam-route");
const workflowPath = globalSkills.get("ai-native-workflow");
const router = readFileSync(routerPath, "utf8");
const workflow = readFileSync(workflowPath, "utf8");
const routeMapPath = join(skillsDir, "workflow/cam-route/references/route-map.md");
const routeMap = readFileSync(routeMapPath, "utf8");

test("router and pipeline have discoverable, distinct names", () => {
  for (const [name, body] of [["cam-route", router], ["ai-native-workflow", workflow]]) {
    assert.match(body, new RegExp(`^---\\nname: ${name}\\n`));
    assert.match(body, /description:/);
    assert.doesNotMatch(body, /disable-model-invocation:\s*true/);
  }
});

test("all explicitly named route skills are installed", () => {
  const needed = [
    "research", "context7-mcp", "grilling", "grill-with-docs",
    "junior-to-senior", "codebase-design", "domain-modeling",
    "ai-native-workflow", "diagnosing-bugs", "fix-debug", "tdd",
    "test-first", "impeccable", "impeccable-rn", "mobile-app-ui-design",
    "expo-overview", "code-review", "security-audit",
    "thermo-nuclear-code-quality-review", "thermo-nuclear-review",
    "create-verification-skill", "maintain-verification-skill",
    "doc-system", "technical-writing", "academic-notes", "notes-vault",
    "wizard", "find-skills", "humanizer", "deslop",
    "no-use-effect", "no-commit-secrets", "poteto-mode",
  ];
  for (const name of needed) {
    assert.ok(globalSkills.has(name), `Not installed: ${name}`);
    assert.ok(routeMap.includes(`\`${name}\``), `Not referenced in route map: ${name}`);
  }
});

test("routing scenarios cover all three modes and common needs", () => {
  const scenarios = routeMap.split("## Casos para comprobar el routing")[1] ?? "";
  const rows = scenarios.split("\n").filter((line) => line.startsWith('| "'));
  assert.ok(rows.length >= 10, `Expected 10+ real scenarios, found ${rows.length}`);
  assert.ok(rows.some((row) => row.includes("Quick")));
  assert.ok(rows.some((row) => row.includes("Standard")));
  assert.ok(rows.some((row) => row.includes("Deep")));
});

test("no mutually exclusive default pairs in the route policy", () => {
  for (const pair of [
    ["tdd", "test-first"], ["impeccable", "impeccable-rn"],
    ["fix-debug", "diagnosing-bugs"], ["grilling", "grill-with-docs"],
  ]) {
    const sentence = router.split("\n").join(" ");
    const quoted = (name) => "`" + name + "`";
    assert.ok(sentence.includes(quoted(pair[0])) && sentence.includes(quoted(pair[1])));
  }
  assert.match(router, /no hagas commit, push, merge ni deploy|ninguna ruta autoriza auto-commit/);
  assert.match(workflow, /verificación real pendiente/i);
});

test("Codex links point to the canonical skill files", () => {
  for (const name of ["cam-route", "ai-native-workflow"]) {
    const alias = join(root, "codex/.agents/skills", name);
    assert.ok(lstatSync(alias).isSymbolicLink(), `Not a symlink: ${alias}`);
    assert.equal(realpathSync(alias), dirname(globalSkills.get(name)));
  }
});
