#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';
import { execSync } from 'child_process';

const packagesDir = join(process.cwd(), 'packages');

// Get all packages with src directory
const packages = readdirSync(packagesDir).filter((name) => {
  const srcDir = join(packagesDir, name, 'src');
  return existsSync(srcDir);
});

console.log('Calculating bundle sizes...\n');

const sizes = {};

for (const pkg of packages) {
  const srcDir = join(packagesDir, pkg, 'src');
  const files = readdirSync(srcDir).filter((f) => f.endsWith('.js'));

  // Concatenate all JS files in src
  let bundleContent = '';
  for (const file of files) {
    bundleContent += readFileSync(join(srcDir, file), 'utf-8');
  }

  // Calculate raw size
  const rawSize = Buffer.byteLength(bundleContent, 'utf-8');

  // Minify using esbuild (faster than terser)
  let minifiedSize = rawSize;
  let gzippedSize = 0;

  try {
    // Write temp file
    const tempFile = `/tmp/${pkg}-bundle.js`;
    const tempOutFile = `/tmp/${pkg}-bundle.min.js`;
    writeFileSync(tempFile, bundleContent);

    // Minify with esbuild
    execSync(`npx esbuild ${tempFile} --minify --outfile=${tempOutFile}`, {
      stdio: 'pipe',
    });

    const minified = readFileSync(tempOutFile, 'utf-8');
    minifiedSize = Buffer.byteLength(minified, 'utf-8');

    // Gzip the minified content
    const gzipped = gzipSync(minified);
    gzippedSize = gzipped.length;
  } catch {
    // Fallback: just gzip the raw content
    const gzipped = gzipSync(bundleContent);
    gzippedSize = gzipped.length;
  }

  sizes[pkg] = {
    raw: rawSize,
    minified: minifiedSize,
    gzipped: gzippedSize,
  };

  const gzippedKB = (gzippedSize / 1024).toFixed(1);
  console.log(`  ${pkg}: ${gzippedKB} KB (gzipped)`);
}

// Update index.html
const indexPath = join(process.cwd(), 'index.html');
let indexContent = readFileSync(indexPath, 'utf-8');

// For each package, find its card and add/update size info
for (const [pkg, size] of Object.entries(sizes)) {
  const gzippedKB = (size.gzipped / 1024).toFixed(1);

  // Find the card for this package and update/add size
  // Pattern: packages/{pkg}/demo/" class="card">
  // We need to find the card-meta section and add size there

  // Look for the pattern with this package
  const cardPattern = new RegExp(
    `(packages/${pkg}/demo/[^]*?<div class="card-meta">\\s*<span class="badge">[^<]+</span>\\s*<span>[^<]+</span>)(\\s*<span>[\\d.]+ KB</span>)?(\\s*</div>)`,
    's'
  );

  const replacement = `$1\n          <span>${gzippedKB} KB</span>$3`;

  if (cardPattern.test(indexContent)) {
    indexContent = indexContent.replace(cardPattern, replacement);
  }
}

writeFileSync(indexPath, indexContent);

console.log('\nDone! Updated index.html with bundle sizes.');

// Also write a JSON file for reference
const sizesJson = join(process.cwd(), 'bundle-sizes.json');
writeFileSync(sizesJson, JSON.stringify(sizes, null, 2));
console.log('Written bundle-sizes.json');
