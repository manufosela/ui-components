# Contributing to UI Components

Thanks for your interest in contributing! This document provides guidelines for contributing to this monorepo of web components.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `pnpm install`
3. **Run the dev server**: `pnpm start` (opens the component catalog)

## Development Workflow

### Creating a New Component

```bash
# 1. Create the directory structure
mkdir -p packages/{component-name}/{src,demo,test}

# 2. Create required files
# - src/{component-name}.js (main component)
# - src/{component-name}.styles.js (optional, for large components)
# - demo/index.html (interactive demo)
# - test/{component-name}.test.js (tests)
# - package.json
# - README.md
# - web-test-runner.config.js

# 3. Install dependencies
pnpm install

# 4. Update root files
# - README.md (add to component table)
# - index.html (add to catalog)
```

### Modifying Existing Components

1. **Run the component's demo**: `pnpm --filter @manufosela/{name} start`
2. **Make your changes**
3. **Run tests**: `pnpm --filter @manufosela/{name} test`
4. **Verify linting**: `pnpm lint`

## Code Standards

### Lit 3 Syntax (Required)

```javascript
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  // Use static properties (NOT static get properties())
  static properties = {
    myProp: { type: String },
    myAttr: { type: Number, attribute: 'my-attr' },
    _internal: { state: true },
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

### Naming Conventions

- **Attributes**: kebab-case (`my-attr`, not `myAttr`)
- **Events**: component-prefixed (`component-change`, not `change`)
- **Internal state**: underscore prefix (`_myState`)
- **Boolean toggles**: use `hide-*` or `no-*` for defaults that are `true`

### API Design

**Prefer declarative slot-based APIs:**

```html
<!-- Good: Declarative -->
<my-list>
  <list-item>Item 1</list-item>
  <list-item>Item 2</list-item>
</my-list>

<!-- Avoid: JSON attributes -->
<my-list items='[{"text":"Item 1"},{"text":"Item 2"}]'></my-list>
```

### JSDoc for Types

Add JSDoc comments for TypeScript declaration generation:

```javascript
/**
 * Component description.
 *
 * @element my-component
 *
 * @attr {String} name - Element name
 * @attr {Number} count - Counter (default: 0)
 * @attr {Boolean} disabled - Whether disabled
 *
 * @cssprop [--my-color=#000] - Main color
 *
 * @fires my-change - Fired when value changes
 *
 * @slot - Default slot content
 * @slot header - Header content
 */
```

## Testing

Every component must have tests covering:

1. **Default rendering**: Component renders without errors
2. **Attribute handling**: Attributes are properly reflected
3. **Accessibility**: Basic a11y audit passes

```javascript
import { html, fixture, expect } from '@open-wc/testing';
import '../src/my-component.js';

describe('MyComponent', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<my-component></my-component>`);
    expect(el).to.exist;
  });

  it('accepts attributes', async () => {
    const el = await fixture(html`<my-component my-attr="value"></my-component>`);
    expect(el.myAttr).to.equal('value');
  });

  it('passes accessibility audit', async () => {
    const el = await fixture(html`<my-component></my-component>`);
    await expect(el).to.be.accessible();
  });
});
```

Run tests:
```bash
pnpm test                              # All tests
pnpm --filter @manufosela/{name} test  # Single component
```

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change without feature/fix
- `test:` Adding/updating tests
- `chore:` Maintenance (deps, configs)

Examples:
```
feat(arc-slider): add value-position property
fix(app-modal): use double rAF for modal rendering
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a feature branch**: `git checkout -b feat/my-feature`
2. **Make your changes** following the code standards
3. **Add tests** for new functionality
4. **Run the full test suite**: `pnpm test`
5. **Run linting**: `pnpm lint`
6. **Create a changeset**: `pnpm changeset`
7. **Push and create a PR**

### PR Checklist

- [ ] Code follows Lit 3 patterns
- [ ] API is declarative when possible
- [ ] Demo works and shows clear examples
- [ ] Tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Component README updated
- [ ] Root README updated (if new component)
- [ ] Root index.html updated (if new component)
- [ ] Changeset created (`pnpm changeset`)

## Changesets

We use [changesets](https://github.com/changesets/changesets) for versioning:

```bash
# Create a changeset
pnpm changeset

# Select affected packages
# Choose bump type (patch/minor/major)
# Write a description
```

**Bump types:**
- `patch`: Bug fixes, minor improvements
- `minor`: New features, non-breaking changes
- `major`: Breaking changes

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Open an issue or reach out to [@manufosela](https://github.com/manufosela).
