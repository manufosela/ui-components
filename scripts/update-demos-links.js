#!/usr/bin/env node

import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();
const packagesDir = join(rootDir, 'packages');

const packages = readdirSync(packagesDir).filter(name => {
  const pkgPath = join(packagesDir, name);
  return existsSync(join(pkgPath, 'demo', 'index.html'));
});

console.log(`Updating demo links for ${packages.length} packages...\n`);

let successCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const pkg of packages) {
  const demoPath = join(packagesDir, pkg, 'demo', 'index.html');

  try {
    let content = readFileSync(demoPath, 'utf-8');

    // Check if playground link already exists
    if (content.includes('playground.html')) {
      console.log(`  - ${pkg}: Already has playground link`);
      skippedCount++;
      continue;
    }

    // Pattern 1: Link with GitHub Repo
    const pattern1 = /(<a href="https:\/\/github\.com\/manufosela\/ui-components[^"]*"[^>]*>GitHub Repo<\/a>)/g;

    // Pattern 2: Link with just "GitHub"
    const pattern2 = /(<a href="https:\/\/github\.com\/manufosela\/ui-components[^"]*"[^>]*>GitHub<\/a>)/g;

    let updated = false;

    if (pattern1.test(content)) {
      content = content.replace(pattern1, '$1 |\n        <a href="playground.html">Playground</a>');
      updated = true;
    } else if (pattern2.test(content)) {
      content = content.replace(pattern2, '$1 |\n        <a href="playground.html">Playground</a>');
      updated = true;
    }

    if (updated) {
      writeFileSync(demoPath, content);
      console.log(`  ✓ ${pkg}`);
      successCount++;
    } else {
      console.log(`  ? ${pkg}: Could not find GitHub link pattern`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`  ✗ ${pkg}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\nDone! Updated: ${successCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
