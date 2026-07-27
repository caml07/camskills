#!/usr/bin/env node
/**
 * Description optimization loop for skills.
 *
 * Evaluates the skill's frontmatter description against trigger/non-trigger
 * queries and iteratively improves it.
 *
 * Uses an OpenAI-compatible API (OpenAI, OpenRouter, Anthropic, etc.).
 *
 * Usage:
 *   export SKILL_CREATOR_MODEL=gpt-4o
 *   export OPENAI_BASE_URL=https://api.openai.com/v1
 *   export OPENAI_API_KEY=sk-...
 *
 *   node run_loop.js \
 *     --eval-set trigger-evals.json \
 *     --skill-path ~/.config/opencode/skills/<name> \
 *     --max-iterations 5
 */

const fs = require("fs");
const path = require("path");

async function main() {
  const args = process.argv.slice(2);

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
  };

  const evalSetPath = getArg("--eval-set");
  const skillPath = getArg("--skill-path");
  const maxIterations = parseInt(getArg("--max-iterations") || "5", 10);
  const outputPath = getArg("--output") || "./optimization-report.json";

  if (!evalSetPath || !skillPath) {
    console.error("Usage: node run_loop.js --eval-set <json> --skill-path <dir> [--max-iterations N] [--output <path>]");
    process.exit(1);
  }

  const model = process.env.SKILL_CREATOR_MODEL || "gpt-4o";
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Set OPENAI_API_KEY environment variable");
    process.exit(1);
  }

  // Try to load native fetch (Node 18+) or fallback
  let fetchFn;
  try {
    fetchFn = globalThis.fetch;
  } catch {
    console.error("Node.js 18+ with native fetch required. Or install 'node-fetch'.");
    process.exit(1);
  }

  function loadSkillDescription(sp) {
    const skillFile = path.join(sp, "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      console.error(`SKILL.md not found at ${skillFile}`);
      process.exit(1);
    }
    const content = fs.readFileSync(skillFile, "utf-8");
    const multiMatch = content.match(/^description:\s*>\s*\n((?:^  .*\n?)*)/m);
    if (multiMatch) {
      return multiMatch[1].replace(/\n  /g, " ").replace(/\n/g, " ").trim();
    }
    const quoteMatch = content.match(/^description:\s*"(.+)"/m);
    if (quoteMatch) return quoteMatch[1];
    const simpleMatch = content.match(/^description:\s*(.+)/m);
    if (simpleMatch) return simpleMatch[1].trim().replace(/^['"]|['"]$/g, "");
    console.error("Could not extract description from SKILL.md frontmatter");
    process.exit(1);
  }

  function updateSkillDescription(sp, newDesc) {
    const skillFile = path.join(sp, "SKILL.md");
    let content = fs.readFileSync(skillFile, "utf-8");
    const multiPattern = /^description:\s*>\s*\n(?:^  .*\n?)*/m;
    const quotePattern = /^description:\s*"[^"]*"/m;
    const simplePattern = /^description:\s*.+/m;

    const replacement = `description: >-\n  ${newDesc}`;
    if (multiPattern.test(content)) {
      content = content.replace(multiPattern, replacement);
    } else if (quotePattern.test(content)) {
      content = content.replace(quotePattern, replacement);
    } else {
      content = content.replace(simplePattern, replacement);
    }
    fs.writeFileSync(skillFile, content);
    console.log(`Updated description in ${skillFile}`);
  }

  async function callModel(messages, temperature = 0.3) {
    try {
      const resp = await fetchFn(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
        }),
      });
      const data = await resp.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    } catch (err) {
      console.error(`  API error: ${err.message}`);
      return "";
    }
  }

  async function checkTrigger(description, query) {
    const result = await callModel([
      {
        role: "system",
        content:
          "You are a trigger evaluation system. Given a skill description " +
          "and a user query, determine whether the skill would be triggered.\n" +
          "Rules:\n" +
          "- Skills only trigger for multi-step tasks the model can't easily handle on its own\n" +
          "- Simple one-step queries rarely trigger even with perfect description match\n" +
          "- Respond with EXACTLY 'true' or 'false' — no other text",
      },
      {
        role: "user",
        content: `Skill description:\n${description}\n\nUser query:\n${query}\n\nTrigger? (true/false):`,
      },
    ], 0.2);
    return result.toLowerCase() === "true";
  }

  async function evaluateDescription(description, evalSet) {
    let hits = 0;
    let total = 0;
    const details = [];

    for (const item of evalSet) {
      const should = item.should_trigger !== false;
      let itemHits = 0;
      for (let run = 0; run < 3; run++) {
        const triggered = await checkTrigger(description, item.query);
        if (triggered === should) itemHits++;
        await new Promise((r) => setTimeout(r, 300));
      }
      details.push({
        query: item.query,
        should_trigger: should,
        hits: itemHits,
        score: itemHits / 3,
      });
      hits += itemHits;
      total += 3;
    }
    return { hit_rate: total > 0 ? hits / total : 0, details };
  }

  async function proposeImprovement(description, failures, falsePositives) {
    const failureLines = [];
    if (failures.length) {
      failureLines.push("Misses (should trigger but didn't):");
      failures.slice(0, 5).forEach((f) => failureLines.push(`  - ${f}`));
    }
    if (falsePositives.length) {
      failureLines.push("False activations (should NOT trigger but did):");
      falsePositives.slice(0, 5).forEach((f) => failureLines.push(`  - ${f}`));
    }

    return callModel([
      {
        role: "system",
        content:
          "You are optimizing skill descriptions for an AI coding assistant. " +
          "The description determines when a skill is triggered. " +
          "Write a clear, specific description that helps the model recognize " +
          "when this skill is needed. Include trigger patterns but avoid " +
          "unnecessary verbosity. The description should be around 200-400 characters.",
      },
      {
        role: "user",
        content:
          `Current description:\n${description}\n\n` +
          `Evaluation results — the description failed on these cases:\n` +
          failureLines.join("\n") +
          "\n\nWrite an improved description that handles these cases better. " +
          "Return ONLY the description text, no explanations:",
      },
    ], 0.7);
  }

  function splitEvalSet(evalSet, testRatio = 0.4) {
    const indices = Array.from({ length: evalSet.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const split = Math.floor(evalSet.length * (1 - testRatio));
    return [indices.slice(0, split).map((i) => evalSet[i]), indices.slice(split).map((i) => evalSet[i])];
  }

  // Main loop
  const description = loadSkillDescription(skillPath);
  const evalSet = JSON.parse(fs.readFileSync(evalSetPath, "utf-8"));
  const [trainSet, testSet] = splitEvalSet(evalSet);

  console.log(`Loaded ${evalSet.length} evals (${trainSet.length} train, ${testSet.length} test)`);
  console.log(`Initial description:\n${description}\n`);

  let bestScore = 0;
  let bestDescription = description;
  const results = [];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    console.log(`\n=== Iteration ${iteration + 1}/${maxIterations} ===`);

    const train = await evaluateDescription(description, trainSet);
    const test = await evaluateDescription(description, testSet);

    const failures = train.details.filter((d) => d.should_trigger && d.score < 0.67).map((d) => d.query);
    const falsePositives = train.details.filter((d) => !d.should_trigger && d.score > 0.33).map((d) => d.query);

    const result = {
      iteration: iteration + 1,
      description,
      train_score: Math.round(train.hit_rate * 10000) / 10000,
      test_score: Math.round(test.hit_rate * 10000) / 10000,
      train_failures: failures.length,
      false_positives: falsePositives.length,
    };
    results.push(result);

    console.log(`  Train: ${(train.hit_rate * 100).toFixed(1)}%  Test: ${(test.hit_rate * 100).toFixed(1)}%`);
    console.log(`  Failures: ${failures.length} misses, ${falsePositives.length} false positives`);

    if (test.hit_rate > bestScore) {
      bestScore = test.hit_rate;
      bestDescription = description;
      console.log("  * New best (test score)");
    }

    if (iteration === maxIterations - 1) break;
    if (!failures.length && !falsePositives.length) {
      console.log("  Perfect score — stopping early");
      break;
    }

    const newDesc = await proposeImprovement(description, failures, falsePositives);
    if (newDesc) {
      description = newDesc;
      console.log(`  New description:\n  ${newDesc.substring(0, 200)}...`);
    } else {
      console.log("  No improvement proposed — stopping");
      break;
    }
  }

  console.log(`\n=== Final ===`);
  console.log(`Best test score: ${(bestScore * 100).toFixed(1)}%`);
  console.log(`Best description:\n${bestDescription}`);

  const report = {
    best_description: bestDescription,
    best_test_score: Math.round(bestScore * 10000) / 10000,
    iterations: maxIterations,
    results,
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${outputPath}`);

  updateSkillDescription(skillPath, bestDescription);
}

main().catch(console.error);
