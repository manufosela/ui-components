#!/usr/bin/env node

import { readdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';

const rootDir = process.cwd();
const packagesDir = join(rootDir, 'packages');

// Component display names (kebab-case to Title Case)
function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Get the main JS file in src/ (assumes one main component file)
function getMainJsFile(pkgPath) {
  const srcDir = join(pkgPath, 'src');
  const files = readdirSync(srcDir).filter(f => f.endsWith('.js') && !f.endsWith('.styles.js'));
  return files[0] || null;
}

// Get tag name from custom-elements.json
function getTagName(pkgPath) {
  const cemPath = join(pkgPath, 'custom-elements.json');
  if (!existsSync(cemPath)) return null;

  try {
    const cem = JSON.parse(readFileSync(cemPath, 'utf-8'));
    for (const module of cem.modules || []) {
      for (const decl of module.declarations || []) {
        if (decl.tagName) return decl.tagName;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

const playgroundTemplate = (componentName, displayName, tagName, jsFile) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} - Playground</title>
  <script type="importmap">
    {
      "imports": {
        "lit": "https://esm.sh/lit@3",
        "lit/": "https://esm.sh/lit@3/",
        "api-viewer-element": "https://esm.sh/api-viewer-element@1.0.0-pre.10"
      }
    }
  </script>
  <style>
    :root {
      --bg-color: #f5f5f7;
      --card-bg: #ffffff;
      --text-color: #1d1d1f;
      --text-muted: #86868b;
      --accent: #3b82f6;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-color);
      color: var(--text-color);
      margin: 0;
      padding: 2rem;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 2rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 600;
    }
    .subtitle {
      color: var(--text-muted);
      margin: 0 0 1rem;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: var(--accent);
      text-decoration: none;
    }
    .nav-links a:hover {
      text-decoration: underline;
    }
    api-demo {
      display: block;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      min-height: 400px;
    }
    .info-box {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--accent);
    }
    .info-box p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${displayName}</h1>
      <p class="subtitle">Playground interactivo</p>
      <div class="nav-links">
        <a href="index.html">&larr; Demo tradicional</a>
        <a href="../../../">Todos los componentes</a>
        <a href="https://github.com/manufosela/ui-components/tree/main/packages/${componentName}" target="_blank">GitHub</a>
        <a href="https://www.npmjs.com/package/@manufosela/${componentName}" target="_blank">npm</a>
      </div>
    </header>

    <div class="info-box">
      <p>Modifica los atributos en el panel "Knobs" y observa los cambios en tiempo real. El codigo HTML se actualiza automaticamente.</p>
    </div>

    <api-demo src="../custom-elements.json" only="${tagName}"></api-demo>
  </div>

  <script type="module">
    import 'api-viewer-element';
    import '../src/${jsFile}';
  </script>
</body>
</html>
`;

const packages = readdirSync(packagesDir).filter(name => {
  const pkgPath = join(packagesDir, name);
  return existsSync(join(pkgPath, 'src')) && existsSync(join(pkgPath, 'demo'));
});

console.log(`Generating playground.html for ${packages.length} packages...\n`);

let successCount = 0;
let errorCount = 0;

for (const pkg of packages) {
  const pkgPath = join(packagesDir, pkg);
  const jsFile = getMainJsFile(pkgPath);
  const tagName = getTagName(pkgPath);

  if (!jsFile) {
    console.error(`  ✗ ${pkg}: No main JS file found`);
    errorCount++;
    continue;
  }

  if (!tagName) {
    console.error(`  ✗ ${pkg}: No tag name found in custom-elements.json`);
    errorCount++;
    continue;
  }

  const displayName = toTitleCase(pkg);
  const playgroundPath = join(pkgPath, 'demo', 'playground.html');

  try {
    writeFileSync(playgroundPath, playgroundTemplate(pkg, displayName, tagName, jsFile));
    console.log(`  ✓ ${pkg}`);
    successCount++;
  } catch (error) {
    console.error(`  ✗ ${pkg}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\nDone! Success: ${successCount}, Errors: ${errorCount}`);
