# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

TypeScript learning program: 12 VitePress doc chapters with exercises and project templates. Learner is a senior sysadmin (AWS/cloud background) — use infrastructure-themed code examples.

## Commands

```bash
npm run docs:dev       # Dev server
npm run docs:build     # Build static site
```

No test runner or TS compiler at project level. Exercise `.ts` files are standalone snippets.

## Structure

- `docs/` — VitePress chapters (config: `docs/.vitepress/config.ts`, base: `/typescript-journey/`)
- `exercises/` — Per-chapter exercises (`01`-`08`). Chapter 01 is JS; rest are TS.
- `projects/` — Capstone starters: `cli-tool`, `api-server`, `testing`, `advanced-patterns`
- `app/` — Browser-based TS playground

## Conventions

Prettier: 4-space indent, semicolons, single quotes, ES5 trailing commas. Each doc chapter leads with "why" context before walkthroughs.
