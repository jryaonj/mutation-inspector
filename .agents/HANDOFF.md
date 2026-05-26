# Agent Handoff

## Snapshot

This repository is an initial Vite/React mutation-inspector SPA. The UI was generated and then repaired around entry filtering, marker color semantics, phenomenon chain drawing, and literature links.

## Key Files

- `main.jsx`: UI state, filtering, highlighting, chain diagrams, paper rendering.
- `mutationData.js`: matrix rows, phenomenon rows, DOI-backed paper strings.
- `README.md` / `README.zh_CN.md`: project documentation in English and Chinese.
- `LICENSE`: MIT license.
- `index.jsx`: React mount.
- `index.html`: Vite shell.
- `.github/workflows/deploy.yml`: GitHub Pages deployment.

## Current Product Rules

- Empty action/object stage filter means show all entries.
- Multiple selected stages match entries by any selected stage.
- Selected entry highlights must match the matrix marker semantics.
- Entry filter cards and chain diagrams need arrows between stages.
- `源发 / 寄发` may exist in raw data, but UI text should display `原发 / 继发`.
- Paper links should point to DOI/source URLs only; do not use generic `scholar.google.com?q=...` links.
- The 21 phenomenon records need visible related-entry chain drawings.
- UI chrome supports `en_US` and `zh_CN`; avoid machine-translating the raw biological source data without review.

## Recommended Checks

```bash
npm install
npm run dev
npm run build
npx --yes esbuild main.jsx --bundle --format=esm --outfile=/tmp/mutation-inspector-check.js --external:react --external:framer-motion --external:lucide-react --log-level=warning
```

The development page should respond at `http://localhost:5173/`.
