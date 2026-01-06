# Changesets

This folder is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Usage

### Adding a changeset

When you make changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the semver bump type (major/minor/patch)
3. Write a summary of the changes

### Releasing

To version and publish packages:

```bash
pnpm changeset version  # Updates versions and changelogs
pnpm publish -r         # Publishes to npm
```
