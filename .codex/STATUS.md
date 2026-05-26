# Mutation Inspector Status

Generated: 2026-05-24

## Current Shape

- Vite React SPA mounted from `index.html` through `index.jsx`.
- Main UI logic lives in `main.jsx`.
- GPT-generated structured content was split into `mutationData.js`.
- The local demo server is expected at `http://localhost:5173/` with `npm run dev`.
- GitHub Pages deployment is configured in `.github/workflows/deploy.yml`.

## Implemented Behavior

- Action/object entry filters wrap across lines and support multi-select.
- Selecting no action/object stage means all entries are included.
- Entry highlighting is based on explicit matrix markers rather than loose text matches.
- Entry marker labels use the same color family as their tags.
- Matrix/entry wording displays `原发 / 继发`.
- The 21 phenomenon records have related entry chain drawings, not only text.
- Related entries in the right-side detail area are clickable and can re-highlight their entry.
- Literature links resolve from explicit URLs or DOI links; generic Scholar query fallbacks are intentionally avoided.
- UI chrome supports `en_US` and `zh_CN` language switching.
- Project docs are available in `README.md` and `README.zh_CN.md`; license is MIT.

## Validation Commands

```bash
npm run dev
npm run build
npx --yes esbuild main.jsx --bundle --format=esm --outfile=/tmp/mutation-inspector-check.js --external:react --external:framer-motion --external:lucide-react --log-level=warning
```

## Notes For Future Codex Work

- Keep raw generated data in `mutationData.js` unless it needs further domain normalization.
- Do not reintroduce horizontal scrolling for the action/object entry filter.
- When adding literature references, prefer DOI, PMID/PMCID, journal pages, or source URLs over search-result URLs.
- If matrix marker semantics change, update `classifyCell` and the stage tone map together.
- Keep biological source data separate from UI i18n unless a reviewed scientific translation is added.
