# Agent Runtime v0.3.4

Agent Runtime v0.3.4 fixes the Simplified Chinese homepage and aligns both localized index pages with the home landing layout.

## Highlights

- Fixes Simplified Chinese homepage rendering by using proper VitePress home layout for localized index pages.
- Refines English and Simplified Chinese home pages with concise hero actions, quick links, ecosystem links, and LLM entrypoints.
- Fixes repository-base GitHub Pages logo loading.
- Keeps the core Agent Runtime specification compatible with v0.3.3.
- Updates version snapshots and package metadata.

## Validation

- `npm run build`
- Repository-base `VITEPRESS_BASE` build
- `npm audit --omit=dev`
- `npm pack --dry-run`
- LLM file consistency checks
- Localized homepage layout checks
