# CLAUDE.md - AI Assistant Context

Este archivo proporciona contexto para asistentes de IA trabajando en este monorepo.

## Resumen del Proyecto

Monorepo de **27 web components** construidos con **Lit 3**, publicados en npm bajo el scope `@manufosela/*`.

- **Repo**: https://github.com/manufosela/ui-components
- **npm**: https://www.npmjs.com/org/manufosela
- **Demo**: https://manufosela.github.io/ui-components/

## Stack Tecnologico

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Lit | 3.x | Framework de web components |
| pnpm | 9.x | Package manager (workspaces) |
| TypeScript | 5.x | Generacion de .d.ts desde JSDoc (DX) |
| Changesets | 2.x | Versionado y changelogs |
| web-test-runner | 0.19.x | Testing |
| @open-wc/testing | 4.x | Testing utilities |
| ESLint | 8.x | Linting |
| Prettier | 3.x | Formatting |
| Husky | 9.x | Git hooks |
| @custom-elements-manifest/analyzer | 0.11.x | Generacion de manifests para playground |

**Nota**: El codigo es vanilla JavaScript. TypeScript se usa SOLO para generar declaraciones de tipos (.d.ts) desde JSDoc para mejorar la DX de los consumidores.

## Estructura de un Componente

```
packages/{component-name}/
├── src/
│   ├── {component-name}.js       # Componente principal
│   └── {component-name}.styles.js # Estilos (opcional, para componentes grandes)
├── demo/
│   ├── index.html                # Demo interactiva
│   └── playground.html           # Playground con api-viewer-element
├── test/
│   └── {component-name}.test.js  # Tests
├── package.json
├── README.md
├── custom-elements.json          # Manifest generado (pnpm cem)
└── web-test-runner.config.js
```

## Patrones de Codigo

### Sintaxis Lit 3 (OBLIGATORIO)

```javascript
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  // Propiedades estaticas (NO usar static get properties())
  static properties = {
    myProp: { type: String },
    myAttr: { type: Number, attribute: 'my-attr' },
    _internal: { state: true },  // Estado interno (no atributo)
  };

  static styles = css`
    :host { display: block; }
  `;

  constructor() {
    super();
    this.myProp = '';
    this.myAttr = 0;
  }

  render() {
    return html`...`;
  }
}

customElements.define('my-component', MyComponent);
```

### API Declarativa (PREFERIDO)

Preferir contenido via slots/elementos hijo sobre atributos complejos:

```html
<!-- BIEN: Declarativo -->
<radar-chart>
  <chart-series name="Team A" color="#ff0000">
    <chart-value label="Speed">80</chart-value>
    <chart-value label="Power">65</chart-value>
  </chart-series>
</radar-chart>

<!-- EVITAR: Atributos JSON -->
<radar-chart data='[{"name":"Team A","values":[80,65]}]'></radar-chart>
```

### Metodo de Parseo de Slots

```javascript
connectedCallback() {
  super.connectedCallback();
  this._parseSlottedContent();
}

_parseSlottedContent() {
  const items = this.querySelectorAll('my-item');
  if (items.length > 0) {
    this._items = Array.from(items).map(el => ({
      label: el.getAttribute('label') || '',
      value: el.textContent.trim()
    }));
  }
}

render() {
  return html`
    ...
    <slot @slotchange="${this._parseSlottedContent}" style="display:none;"></slot>
  `;
}
```

### Atributos Booleanos Invertidos

Para atributos que por defecto son `true`, usar prefijo `hide-` o `no-`:

```javascript
static properties = {
  hideArrow: { type: Boolean, attribute: 'hide-arrow' },
  noAnimation: { type: Boolean, attribute: 'no-animation' },
};
```

### JSDoc para Tipos (DX)

Usar JSDoc para generar declaraciones de tipos automaticamente:

```javascript
/**
 * Descripcion del componente.
 *
 * @element my-component
 *
 * @attr {String} name - Nombre del elemento
 * @attr {Number} count - Contador (default: 0)
 * @attr {Boolean} disabled - Si esta deshabilitado
 *
 * @cssprop [--my-color=#000] - Color principal
 * @cssprop [--my-size=16px] - Tamano base
 *
 * @fires my-change - Se dispara cuando cambia el valor
 * @fires my-submit - Se dispara al enviar
 *
 * @slot - Contenido principal
 * @slot header - Contenido del header
 */
export class MyComponent extends LitElement {
  // ...
}
```

Para generar los .d.ts antes de publicar:
```bash
pnpm --filter @manufosela/{name} build:types
```

### CSS Custom Properties

Documentar todas las variables CSS:

```javascript
/**
 * @cssprop [--my-color=#000] - Color principal
 * @cssprop [--my-size=16px] - Tamano base
 */
```

### Eventos

Usar `CustomEvent` con `detail`:

```javascript
this.dispatchEvent(new CustomEvent('my-event', {
  detail: { value: this.value, name: this.name },
  bubbles: true,
  composed: true
}));
```

### Dark Mode

Soportar dark mode via clase `.dark` en ancestro:

```css
:host-context(.dark) {
  --bg-color: #1a1a1a;
  --text-color: #f5f5f7;
}
```

## Añadir un Nuevo Componente

1. **Crear estructura**:
   ```bash
   mkdir -p packages/{name}/{src,demo,test}
   ```

2. **Crear archivos**:
   - `src/{name}.js` - Componente Lit 3
   - `demo/index.html` - Demo con ejemplos (incluir import map para CDN)
   - `test/{name}.test.js` - Tests
   - `package.json` - Metadatos npm
   - `README.md` - Documentacion
   - `web-test-runner.config.js` - Config tests (**puerto unico requerido**)

3. **web-test-runner.config.js template**:
   ```javascript
   export default {
     files: 'test/**/*.test.js',
     nodeResolve: true,
     port: 8127,  // IMPORTANTE: Usar siguiente puerto disponible (ver otros packages)
   };
   ```

   > **IMPORTANTE**: Cada paquete debe tener un puerto unico (8100-8199) para evitar conflictos cuando los tests se ejecutan en paralelo en CI. Verificar el ultimo puerto usado en otros `web-test-runner.config.js` y usar el siguiente.

5. **package.json template**:
   ```json
   {
     "name": "@manufosela/{name}",
     "version": "1.0.0",
     "description": "...",
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

   **Nota**: Las devDependencies estan en el root del monorepo.

6. **Actualizar**:
   - `README.md` raiz (tabla de paquetes y estructura)
   - `index.html` raiz (catalogo de componentes)

7. **Verificar**:
   ```bash
   pnpm install
   pnpm test --filter @manufosela/{name}
   ```

## Demo Template

Todas las demos deben seguir este estilo consistente.

> **IMPORTANTE**: El import map es **obligatorio** para que las demos funcionen en GitHub Pages (sin servidor de desarrollo). Mapea `lit` al CDN esm.sh.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script type="importmap">
    {
      "imports": {
        "lit": "https://esm.sh/lit@3",
        "lit/": "https://esm.sh/lit@3/"
      }
    }
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{Component Name} - Demo</title>
  <style>
    :root {
      --bg-color: #f5f5f7;
      --card-bg: #ffffff;
      --text-color: #1d1d1f;
      --text-muted: #86868b;
      --border-color: #d2d2d7;
    }
    /* ... estilos estandar ... */
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>{Component Name}</h1>
      <p class="subtitle">{Descripcion corta}</p>
      <p>
        <a href="../../../">&larr; Back to components</a> |
        <a href="https://github.com/manufosela/ui-components/tree/main/packages/{name}" target="_blank">GitHub Repo</a> |
        <a href="playground.html">Playground</a>
      </p>
    </header>

    <!-- Demo cards -->
    <div class="demo-card">
      <h2>Titulo</h2>
      <p>Descripcion</p>
      <div class="demo-content">
        <!-- Componente -->
      </div>
      <div class="code-block"><!-- Codigo ejemplo --></div>
    </div>

    <footer>
      <p>
        <a href="https://github.com/manufosela/ui-components">View on GitHub</a> |
        <a href="https://www.npmjs.com/package/@manufosela/{name}">npm</a>
      </p>
    </footer>
  </div>

  <script type="module">
    import '../src/{name}.js';
  </script>
</body>
</html>
```

## Tests Minimos

```javascript
import { html, fixture, expect } from '@open-wc/testing';
import '../src/{name}.js';

describe('{ComponentName}', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<{name}></{name}>`);
    expect(el).to.exist;
  });

  it('accepts attributes', async () => {
    const el = await fixture(html`<{name} my-attr="value"></{name}>`);
    expect(el.myAttr).to.equal('value');
  });

  it('passes accessibility audit', async () => {
    const el = await fixture(html`<{name}></{name}>`);
    await expect(el).to.be.accessible();
  });
});
```

## Workflow de Release

```bash
# 1. Hacer cambios
# 2. Crear changeset
pnpm changeset
# Seleccionar paquetes afectados, tipo de bump (patch/minor/major), descripcion

# 3. Commit cambios + changeset
git add -A && git commit -m "feat: descripcion"

# 4. Cuando listo para release:
pnpm changeset version  # Actualiza versions y CHANGELOGs
git add -A && git commit -m "chore: version packages"
pnpm build:types        # Generar declaraciones de tipos
pnpm publish -r --access public  # Requiere OTP de npm
git push
```

Ver `.changeset/.VERSIONING.md` para guias de versionado semantico.

## Comandos Utiles

```bash
# Desarrollo
pnpm start                          # Servidor dev (catalogo)
pnpm --filter @manufosela/{name} start  # Servidor dev (componente)

# Testing
pnpm test                           # Todos los tests
pnpm --filter @manufosela/{name} test   # Tests de un componente

# Linting
pnpm lint                           # Lint todo
pnpm lint:fix                       # Auto-fix

# Publicacion
pnpm publish -r --access public     # Publicar todos
pnpm --filter @manufosela/{name} publish --access public  # Publicar uno

# Playground
pnpm cem                            # Regenerar custom-elements.json para todos
```

## Playground Interactivo

Cada componente tiene un playground interactivo en `demo/playground.html` que usa `api-viewer-element`.

### Funcionalidades del Playground

- **Knobs**: Controles para modificar atributos en tiempo real
- **Eventos**: Log de eventos disparados
- **Codigo**: HTML actualizado listo para copiar

### Regenerar Manifests

Los playgrounds dependen de `custom-elements.json`. Si modificas propiedades o eventos:

```bash
pnpm cem  # Regenera todos los manifests
```

Los manifests se generan automaticamente en CI antes del deploy a GitHub Pages.

### Añadir Playground a Nuevo Componente

1. Generar manifest: `pnpm cem`
2. Ejecutar script: `node scripts/generate-playgrounds.js`
3. Añadir link en demo: `node scripts/update-demos-links.js`

## Convenciones de Commits

Usar Conventional Commits:

- `feat:` Nueva funcionalidad
- `fix:` Correccion de bug
- `chore:` Mantenimiento (deps, configs)
- `docs:` Documentacion
- `refactor:` Refactorizacion sin cambio funcional
- `test:` Añadir/modificar tests

## Checklist para PRs

- [ ] Codigo sigue patrones de Lit 3 (static properties, etc.)
- [ ] API es declarativa cuando es posible
- [ ] Demo funciona y tiene ejemplos claros
- [ ] Tests pasan (`pnpm test`)
- [ ] Lint pasa (`pnpm lint`)
- [ ] README del componente actualizado
- [ ] README raiz actualizado (si nuevo componente)
- [ ] index.html actualizado (si nuevo componente)
- [ ] Changeset creado (`pnpm changeset`)

## Notas Importantes

1. **No usar `console.log`** - ESLint lo marca como warning
2. **No CSS inline** - Usar `static styles` o archivo `.styles.js`
3. **Prefijo `_` para estado interno** - `_myState: { state: true }`
4. **Kebab-case para atributos** - `my-attr` no `myAttr`
5. **Eventos con prefijo** - `component-event` no `event`
6. **Siempre `composed: true`** - Para que eventos crucen shadow DOM
