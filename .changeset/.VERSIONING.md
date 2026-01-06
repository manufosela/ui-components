# Versioning Guidelines

This document outlines the versioning strategy for `@manufosela/ui-components` packages.

## Semantic Versioning

All packages follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, backwards compatible

## Breaking Changes (MAJOR)

A change is considered **breaking** if it requires users to modify their code. Examples:

### API Changes
- Removing a public property or method
- Changing property/attribute names
- Changing the type of a property
- Removing or renaming CSS custom properties
- Changing event names or their detail structure
- Removing slots or changing slot names

### Behavioral Changes
- Changing default values in ways that affect existing usage
- Modifying the component's structure in ways that break CSS selectors
- Changing the rendering output in incompatible ways

## Non-Breaking Changes (MINOR/PATCH)

### MINOR (New Features)
- Adding new properties, methods, or events
- Adding new CSS custom properties
- Adding new slots
- Adding new functionality without changing existing behavior

### PATCH (Bug Fixes)
- Fixing bugs without changing the public API
- Performance improvements
- Documentation updates
- Internal refactoring that doesn't affect the public API

## Creating a Changeset

When making changes, create a changeset describing the change:

```bash
pnpm changeset
```

Select the affected packages, the change type (major/minor/patch), and provide a description.

## Release Process

1. **Create changeset** during development: `pnpm changeset`
2. **Version packages** when ready to release: `pnpm changeset version`
3. **Review** the generated CHANGELOG entries
4. **Commit** the version changes
5. **Publish** to npm: `pnpm publish -r --access public` (requires OTP)
6. **Push** changes and tags to GitHub

## Deprecation Policy

Before removing features in a major version:

1. Mark as deprecated in a minor version
2. Add console warnings for deprecated features
3. Document the migration path in CHANGELOG
4. Remove in the next major version
