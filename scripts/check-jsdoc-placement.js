#!/usr/bin/env node

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const packagesDir = join(process.cwd(), 'packages');

const packages = readdirSync(packagesDir).filter(name => {
  const srcDir = join(packagesDir, name, 'src');
  return existsSync(srcDir);
});

console.log('Checking JSDoc placement...\n');

const issues = [];

for (const pkg of packages) {
  const srcDir = join(packagesDir, pkg, 'src');
  const files = readdirSync(srcDir).filter(f => f.endsWith('.js') && !f.endsWith('.styles.js'));

  for (const file of files) {
    const filePath = join(srcDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Find JSDoc block with @element
    let jsdocEnd = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('@element')) {
        // Find the end of this JSDoc block
        for (let j = i; j < lines.length; j++) {
          if (lines[j].includes('*/')) {
            jsdocEnd = j;
            break;
          }
        }
        break;
      }
    }

    if (jsdocEnd >= 0) {
      // Check what's on the next non-empty line
      let nextLine = jsdocEnd + 1;
      while (nextLine < lines.length && lines[nextLine].trim() === '') {
        nextLine++;
      }

      if (nextLine < lines.length) {
        const nextContent = lines[nextLine].trim();
        if (!nextContent.startsWith('export class') && !nextContent.startsWith('class')) {
          issues.push({
            pkg,
            file,
            nextContent: nextContent.substring(0, 50)
          });
        }
      }
    }
  }
}

if (issues.length === 0) {
  console.log('All JSDoc blocks are correctly placed before classes!');
} else {
  console.log(`Found ${issues.length} issues:\n`);
  for (const issue of issues) {
    console.log(`  ${issue.pkg}/${issue.file}:`);
    console.log(`    Next line after JSDoc: "${issue.nextContent}..."`);
    console.log();
  }
}
