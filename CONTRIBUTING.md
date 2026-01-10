# Contributing to UI Components

Guia completa para añadir, migrar y contribuir componentes al monorepo.

## Requisitos Previos

- Node.js 18+
- pnpm 8+
- Conocimientos de Lit 3 y Web Components

## Getting Started

1. **Fork/clone** el repositorio
2. **Instalar dependencias**: `pnpm install`
3. **Ejecutar servidor dev**: `pnpm start` (abre el catalogo)

---

## Estructura de un Componente

```
packages/{component-name}/
├── src/
│   ├── {component-name}.js         # Componente principal
│   └── {component-name}.styles.js  # Estilos (opcional)
├── demo/
│   └── index.html                  # Demo interactiva
├── test/
│   └── {component-name}.test.js    # Tests
├── package.json
├── README.md
└── web-test-runner.config.js
```

---

## Proceso Completo: Añadir un Componente

### Paso 1: Crear Estructura

```bash
mkdir -p packages/{name}/{src,demo,test}
```

### Paso 2: package.json

```json
{
  "name": "@manufosela/{name}",
  "version": "1.0.0",
  "description": "Descripcion del componente",
  "license": "MIT",
  "author": "manufosela",
  "type": "module",
  "main": "./src/{name}.js",
  "module": "./src/{name}.js",
  "types": "./src/{name}.d.ts",
  "exports": {
    ".": {
      "types": "./src/{name}.d.ts",
      "import": "./src/{name}.js"
    }
  },
  "files": ["src"],
  "scripts": {
    "start": "web-dev-server --node-resolve --open demo/ --watch",
    "test": "web-test-runner",
    "test:watch": "web-test-runner --watch",
    "test:coverage": "web-test-runner --coverage",
    "build:types": "tsc --declaration --declarationMap --emitDeclarationOnly --allowJs --checkJs --outDir ./src ./src/{name}.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/manufosela/ui-components",
    "directory": "packages/{name}"
  },
  "dependencies": {
    "lit": "^3.2.1"
  }
}
```

### Paso 3: web-test-runner.config.js

```javascript
export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    threshold: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Paso 4: Componente Principal

```javascript
import { LitElement, html, css } from 'lit';

/**
 * Descripcion del componente.
 *
 * @element {name}
 *
 * @attr {String} my-attr - Descripcion
 * @attr {Boolean} disabled - Si esta deshabilitado
 *
 * @cssprop [--{name}-color=#000] - Color principal
 *
 * @fires {name}-change - Se dispara cuando cambia el valor
 *
 * @slot - Contenido principal
 */
export class MyComponent extends LitElement {
  static properties = {
    myAttr: { type: String, attribute: 'my-attr' },
    disabled: { type: Boolean, reflect: true },
    _internal: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    /* Estilos del componente */

    @media (prefers-reduced-motion: reduce) {
      .animated {
        transition: none;
        animation: none;
      }
    }
  `;

  constructor() {
    super();
    this.myAttr = '';
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Setup
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup: listeners, timers, etc.
  }

  _dispatchChange(value) {
    this.dispatchEvent(new CustomEvent('{name}-change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`...`;
  }
}

customElements.define('{name}', MyComponent);
```

### Paso 5: Tests

```javascript
import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/{name}.js';

describe('{Name}', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<{name}></{name}>`);
    expect(el).to.exist;
  });

  it('accepts attributes', async () => {
    const el = await fixture(html`<{name} my-attr="value"></{name}>`);
    expect(el.myAttr).to.equal('value');
  });

  it('handles disabled state', async () => {
    const el = await fixture(html`<{name} disabled></{name}>`);
    expect(el.disabled).to.be.true;
  });

  it('dispatches change event', async () => {
    const el = await fixture(html`<{name}></{name}>`);
    setTimeout(() => el._dispatchChange('test'));
    const event = await oneEvent(el, '{name}-change');
    expect(event.detail.value).to.equal('test');
  });

  it('passes accessibility audit', async () => {
    const el = await fixture(html`<{name}></{name}>`);
    await expect(el).to.be.accessible();
  });
});
```

### Paso 6: Demo (demo/index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{Name} - Demo</title>
  <style>
    :root {
      --bg-color: #f5f5f7;
      --card-bg: #ffffff;
      --text-color: #1d1d1f;
      --text-muted: #86868b;
      --border-color: #d2d2d7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-color);
      color: var(--text-color);
      padding: 2rem;
    }
    .container { max-width: 900px; margin: 0 auto; }
    header { margin-bottom: 2rem; }
    header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    header .subtitle { color: var(--text-muted); margin-bottom: 1rem; }
    header a { color: #0066cc; }
    .demo-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .demo-card h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .demo-card > p { color: var(--text-muted); margin-bottom: 1rem; }
    .demo-content {
      padding: 1.5rem;
      background: var(--bg-color);
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .code-block {
      background: #1d1d1f;
      color: #f5f5f7;
      padding: 1rem;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre;
    }
    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      text-align: center;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>{Name}</h1>
      <p class="subtitle">Descripcion corta</p>
      <p>
        <a href="../../../">&larr; Back</a> |
        <a href="https://github.com/manufosela/ui-components/tree/main/packages/{name}">GitHub</a>
      </p>
    </header>

    <div class="demo-card">
      <h2>Basic</h2>
      <p>Ejemplo basico.</p>
      <div class="demo-content">
        <{name}></{name}>
      </div>
      <div class="code-block">&lt;{name}&gt;&lt;/{name}&gt;</div>
    </div>

    <footer>
      <a href="https://github.com/manufosela/ui-components">GitHub</a> |
      <a href="https://www.npmjs.com/package/@manufosela/{name}">npm</a>
    </footer>
  </div>
  <script type="module">import '../src/{name}.js';</script>
</body>
</html>
```

### Paso 7: README.md

```markdown
# @manufosela/{name}

Descripcion. Built with [Lit](https://lit.dev/).

## Installation

\`\`\`bash
npm install @manufosela/{name}
\`\`\`

## Usage

\`\`\`javascript
import '@manufosela/{name}';
\`\`\`

\`\`\`html
<{name}></{name}>
\`\`\`

## Attributes

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `my-attr` | String | `''` | Descripcion |
| `disabled` | Boolean | `false` | Disable component |

## Events

| Event | Detail | Description |
| ----- | ------ | ----------- |
| `{name}-change` | `{ value }` | Fired on change |

## CSS Custom Properties

| Property | Default | Description |
| -------- | ------- | ----------- |
| `--{name}-color` | `#000` | Main color |

## Accessibility

- Keyboard navigation supported
- ARIA attributes properly set
- Focus management handled
- Respects `prefers-reduced-motion`

## License

MIT
```

### Paso 8: Verificar

```bash
pnpm install
pnpm --filter @manufosela/{name} test
pnpm --filter @manufosela/{name} test:coverage
pnpm lint
pnpm --filter @manufosela/{name} start
```

### Paso 9: Actualizar Raiz

1. **README.md**: Añadir a tabla de componentes
2. **index.html**: Añadir al catalogo

### Paso 10: Commit

```bash
pnpm changeset
git add -A
git commit -m "feat({name}): add new component"
```

---

## Checklist de Revision (8 Categorias)

Todo componente debe cumplir estos criterios:

### 1. API Publica

- [ ] Atributos con nombres claros (kebab-case)
- [ ] Tipos correctos y valores por defecto
- [ ] Eventos con prefijo del componente y `event.detail`
- [ ] Slots documentados
- [ ] CSS Custom Properties expuestas

### 2. Accesibilidad (A11y)

- [ ] Navegacion con teclado
- [ ] Gestion del foco
- [ ] Roles ARIA correctos
- [ ] `aria-*` dinamicos (selected, expanded, checked)
- [ ] Lectores de pantalla compatibles
- [ ] Estados (disabled/error) anunciados
- [ ] `@media (prefers-reduced-motion: reduce)`

### 3. Arquitectura

- [ ] Metodos con responsabilidad unica
- [ ] Sin logica duplicada
- [ ] Separacion: logica / render / eventos
- [ ] Cleanup en `disconnectedCallback`

### 4. Consistencia

- [ ] Naming igual que otros componentes
- [ ] Patron de estados comun (active, selected, open)
- [ ] Ejemplos vanilla JS (no solo Lit)

### 5. DX

- [ ] Instalacion clara
- [ ] Ejemplo minimo funcional
- [ ] Ejemplo avanzado
- [ ] Sin `console.log` (usar `console.warn`/`console.error`)

### 6. Performance

- [ ] Bundle razonable
- [ ] Sin renders innecesarios
- [ ] Sin listeners globales innecesarios

### 7. Testing

- [ ] Test de render basico
- [ ] Test de interaccion
- [ ] Test de eventos
- [ ] Casos limite
- [ ] Coverage >= 80%

### 8. Documentacion

- [ ] README completo
- [ ] Tablas de atributos/eventos/CSS vars
- [ ] Ejemplos
- [ ] Seccion Accessibility

---

## Migracion de Componente Existente

1. **Copiar** codigo a `packages/{name}/src/`
2. **Actualizar imports** a Lit 3
3. **Eliminar `console.log`** de debug
4. **Añadir JSDoc** (`@element`, `@attr`, `@cssprop`, `@fires`, `@slot`)
5. **Añadir `prefers-reduced-motion`** si hay animaciones
6. **Crear tests** (coverage >= 80%)
7. **Crear demo** con template estandar
8. **Pasar checklist** de 8 categorias

---

## Code Standards

### Lit 3 Syntax (Obligatorio)

```javascript
// Usar static properties (NO static get properties())
static properties = {
  myProp: { type: String },
  myAttr: { type: Number, attribute: 'my-attr' },
  _internal: { state: true },
};
```

### Naming

- **Atributos**: kebab-case (`my-attr`)
- **Eventos**: prefijo componente (`{name}-change`)
- **Estado interno**: prefijo `_` (`_myState`)
- **Booleanos invertidos**: `hide-*` o `no-*`

### API Declarativa (Preferida)

```html
<!-- Bien: Declarativo -->
<my-list>
  <list-item>Item 1</list-item>
</my-list>

<!-- Evitar: JSON -->
<my-list items='[{"text":"Item 1"}]'></my-list>
```

### JSDoc para Tipos

```javascript
/**
 * @element my-component
 * @attr {String} name - Nombre
 * @cssprop [--my-color=#000] - Color
 * @fires my-change - Evento cambio
 * @slot - Contenido
 */
```

---

## Commit Messages

[Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Correccion
- `docs:` Solo documentacion
- `refactor:` Sin cambio funcional
- `test:` Tests
- `chore:` Mantenimiento

```
feat(arc-slider): add value-position property
fix(app-modal): use double rAF for modal rendering
```

---

## Pull Request Checklist

- [ ] Codigo sigue patrones Lit 3
- [ ] API declarativa cuando posible
- [ ] Demo funciona
- [ ] Tests pasan (`pnpm test`)
- [ ] Lint pasa (`pnpm lint`)
- [ ] README actualizado
- [ ] Changeset creado (`pnpm changeset`)

---

## Prompt para Asistente IA

Copia este prompt para que una IA te ayude a crear el componente:

```
Necesito añadir un componente web "{component-name}" al monorepo ui-components.

Funcionalidad:
- {Descripcion}
- {Atributos}
- {Eventos}

Tareas:
1. Crear estructura en packages/{component-name}/
2. Implementar siguiendo CLAUDE.md
3. Incluir @media (prefers-reduced-motion: reduce)
4. JSDoc completo (@element, @attr, @cssprop, @fires, @slot)
5. Tests con coverage >= 80%
6. Demo interactiva
7. README con seccion Accessibility
8. Actualizar README.md e index.html raiz
9. Ejecutar tests y lint
10. Crear commit convencional

Seguir checklist de 8 categorias de CONTRIBUTING.md.
```

---

## Recursos

- [Lit Documentation](https://lit.dev/)
- [Open WC Testing](https://open-wc.org/docs/testing/testing-package/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Conventional Commits](https://www.conventionalcommits.org/)
