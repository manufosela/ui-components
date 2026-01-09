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

// Default slot content for components that need it
const defaultSlotContent = {
  'header-nav': `
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Contact</a>`,
  'circle-steps': `
      <step-item label="Step 1" description="First step"></step-item>
      <step-item label="Step 2" description="Second step"></step-item>
      <step-item label="Step 3" description="Third step"></step-item>
      <step-item label="Step 4" description="Fourth step"></step-item>`,
  'radar-chart': `
      <chart-series name="Player" color="#3b82f6">
        <chart-value label="Speed">80</chart-value>
        <chart-value label="Power">65</chart-value>
        <chart-value label="Defense">90</chart-value>
        <chart-value label="Magic">45</chart-value>
        <chart-value label="Luck">70</chart-value>
      </chart-series>`,
  'behaviour-accordion': `
      <accordion-item header="Section 1">Content for section 1</accordion-item>
      <accordion-item header="Section 2">Content for section 2</accordion-item>
      <accordion-item header="Section 3">Content for section 3</accordion-item>`,
  'tab-nav': `
      <tab-item label="Tab 1">Content for Tab 1</tab-item>
      <tab-item label="Tab 2">Content for Tab 2</tab-item>
      <tab-item label="Tab 3">Content for Tab 3</tab-item>`,
  'multi-carousel': `
      <div style="background:#3b82f6;color:white;padding:2rem;text-align:center;">Slide 1</div>
      <div style="background:#22c55e;color:white;padding:2rem;text-align:center;">Slide 2</div>
      <div style="background:#8b5cf6;color:white;padding:2rem;text-align:center;">Slide 3</div>`,
  'nav-list': `
      <nav-item value="home">Home</nav-item>
      <nav-item value="about">About</nav-item>
      <nav-item value="contact">Contact</nav-item>`,
  'rich-select': `
      <rich-option value="opt1">Option 1</rich-option>
      <rich-option value="opt2">Option 2</rich-option>
      <rich-option value="opt3">Option 3</rich-option>`,
  'multi-select': `
      <select-option value="opt1">Option 1</select-option>
      <select-option value="opt2">Option 2</select-option>
      <select-option value="opt3">Option 3</select-option>`,
};

const playgroundTemplate = (componentName, displayName, tagName, jsFile, slotContent) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} - Playground</title>
  <script type="importmap">
    {
      "imports": {
        "lit": "https://esm.sh/lit@3?bundle",
        "lit/": "https://esm.sh/lit@3&bundle/"
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
      padding: 1.5rem;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 1.5rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
      font-weight: 600;
    }
    .subtitle {
      color: var(--text-muted);
      margin: 0 0 0.75rem;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      font-size: 0.9rem;
    }
    .nav-links a {
      color: var(--accent);
      text-decoration: none;
    }
    .nav-links a:hover {
      text-decoration: underline;
    }

    /* API Demo styling */
    api-demo {
      display: block;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;

      /* CSS custom properties for api-viewer theming */
      --ave-accent-color: var(--accent);
      --ave-border-color: #e5e7eb;
      --ave-header-color: var(--text-color);
      --ave-item-color: var(--text-muted);
      --ave-monospace-font: 'SF Mono', Monaco, Consolas, monospace;

      /* Minimum height for demo area */
      --ave-demo-min-height: 300px;
    }

    /* Force minimum size on the component preview wrapper */
    api-demo::part(demo-output) {
      min-height: 300px;
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #fafafa;
    }

    /* Layout: controles izquierda, preview derecha en desktop */
    @media (min-width: 900px) {
      api-demo::part(demo-tabs) {
        flex-direction: row-reverse;
      }
    }

    .info-box {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-left: 4px solid var(--accent);
    }
    .info-box p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    footer a { color: var(--text-color); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
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

${slotContent ? `
    <div class="info-box" style="margin-bottom: 1.5rem;">
      <p><strong>Live Example</strong> (with slot content - api-demo below doesn't show slots)</p>
    </div>
    <div style="background: var(--card-bg); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <${tagName}>${slotContent}
      </${tagName}>
    </div>
` : ''}
    <api-demo src="../custom-elements.json" only="${tagName}"></api-demo>

    <footer>
      <p>
        <a href="https://github.com/manufosela/ui-components">View on GitHub</a> |
        <a href="https://www.npmjs.com/package/@manufosela/${componentName}">npm</a>
      </p>
      <p>Copyright &copy; <span class="footer-year"></span> <a href="https://github.com/manufosela" target="_blank">@manufosela</a> | MIT License</p>
      <p style="margin-top: 0.5rem;">
        <a href="https://librecounter.org/referer/show" target="_blank" title="View site statistics">
          <img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" alt="LibreCounter" style="height: 24px; vertical-align: middle;" />
        </a>
      </p>
    </footer>
  </div>

  <script>
    document.querySelectorAll('.footer-year').forEach(el => el.textContent = new Date().getFullYear());
  </script>
  <script type="module">
    // api-demo element (incluye Lit 2 bundled)
    import 'https://esm.sh/@api-viewer/demo@1.0.0-pre.10?bundle';

    // Componente local (usa Lit 3 del import map)
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
  const slotContent = defaultSlotContent[pkg] || '';

  try {
    writeFileSync(playgroundPath, playgroundTemplate(pkg, displayName, tagName, jsFile, slotContent));
    console.log(`  ✓ ${pkg}`);
    successCount++;
  } catch (error) {
    console.error(`  ✗ ${pkg}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\nDone! Success: ${successCount}, Errors: ${errorCount}`);
