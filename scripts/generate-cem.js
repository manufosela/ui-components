#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();
const packagesDir = join(rootDir, 'packages');
const packages = readdirSync(packagesDir).filter(name => {
  const pkgPath = join(packagesDir, name);
  return existsSync(join(pkgPath, 'src'));
});

console.log(`Generating Custom Elements Manifests for ${packages.length} packages...\n`);

for (const pkg of packages) {
  const pkgPath = join(packagesDir, pkg);

  try {
    execSync(
      `npx cem analyze --litelement --globs "src/*.js" --exclude "**/*.styles.js" --outdir "."`,
      { cwd: pkgPath, stdio: 'pipe' }
    );
    console.log(`  ✓ ${pkg}`);
  } catch (error) {
    console.error(`  ✗ ${pkg}: ${error.message}`);
  }
}

console.log('\nDone!');
