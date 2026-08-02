#!/usr/bin/env node

import { loadContext } from './context.mjs';

const context = loadContext(process.cwd());
const findings = [];

if (!context.hasProduct) {
  findings.push({ artifact: 'PRODUCT.md', command: 'init', summary: 'Missing product context.' });
}

if (!context.hasDesign) {
  findings.push({ artifact: 'DESIGN.md', command: 'document', summary: 'Missing design context.' });
}

const report = {
  contextDir: context.contextDir,
  productPath: context.productPath,
  designPath: context.designPath,
  findings,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else if (findings.length === 0) {
  console.log('Design context is present.');
} else {
  for (const finding of findings) console.log(`${finding.artifact}: ${finding.summary} Run ${finding.command}.`);
}
