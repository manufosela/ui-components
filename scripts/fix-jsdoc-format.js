#!/usr/bin/env node

/**
 * Script to convert @cssprop JSDoc format from:
 *   @cssprop --name - Description (default: value)
 * To:
 *   @cssprop [--name=value] - Description
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const packagesDir = join(process.cwd(), 'packages');

// Pattern to match old format: @cssprop --name - Description (default: value)
const oldFormatRegex = /@cssprop\s+(--[\w-]+)\s+-\s+(.+?)\s*\(default:\s*([^)]+)\)/g;

// Pattern to check if already in new format
const newFormatRegex = /@cssprop\s+\[--[\w-]+=[^\]]+\]/;

function convertCssProp(content) {
  return content.replace(oldFormatRegex, (match, propName, description, defaultValue) => {
    const cleanDefault = defaultValue.trim();
    const cleanDesc = description.trim();
    return `@cssprop [${propName}=${cleanDefault}] - ${cleanDesc}`;
  });
}

const packages = readdirSync(packagesDir).filter(name => {
  const srcDir = join(packagesDir, name, 'src');
  return existsSync(srcDir);
});

console.log(`Processing ${packages.length} packages...\n`);

let totalFixed = 0;

for (const pkg of packages) {
  const srcDir = join(packagesDir, pkg, 'src');
  const files = readdirSync(srcDir).filter(f => f.endsWith('.js') && !f.endsWith('.styles.js'));

  for (const file of files) {
    const filePath = join(srcDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Check if file has old format @cssprop
    if (oldFormatRegex.test(content)) {
      // Reset regex lastIndex
      oldFormatRegex.lastIndex = 0;

      const newContent = convertCssProp(content);

      if (newContent !== content) {
        writeFileSync(filePath, newContent);
        const count = (content.match(oldFormatRegex) || []).length;
        console.log(`  ✓ ${pkg}/${file} - Fixed ${count} @cssprop tags`);
        totalFixed += count;
      }
    }
  }
}

console.log(`\nDone! Fixed ${totalFixed} @cssprop tags.`);
