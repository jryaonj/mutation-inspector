# Mutation Inspector

[中文说明](README.zh_CN.md)

Mutation Inspector is a Vite + React single-page app for exploring mutation-related molecular chains and phenotype mappings. It combines five chain matrices with a 21-phenomenon view, so users can move between chain stages, matrix entries, related biological mechanisms, and DOI-backed paper references.

## Features

- Five-chain matrix explorer with action/object stage cards.
- Multi-select stage filtering; selecting nothing shows all entries.
- Entry highlighting that follows explicit matrix markers.
- Color-matched marker pills for primary and secondary actions/products.
- Full matrix table view with added phenomenology and mechanism columns.
- 21-phenomenon mapping view with related entry chain diagrams.
- DOI/source-link paper panels without generic search-result links.
- UI i18n for `en_US` and `zh_CN` via the language switcher in the header.

## Quick Start

```bash
npm install
npm run dev
```

Open the local Vite page at:

```text
http://localhost:5173/
```

## Build

```bash
npm run build
```

The production bundle is emitted to `dist/`.

## Project Layout

```text
index.html                 Vite HTML shell
index.jsx                  React mount
main.jsx                   UI state, filtering, i18n, and rendering
mutationData.js            Matrix rows, phenomenon rows, and paper data
.github/workflows/deploy.yml
.codex/                    Codex status/settings handoff
.agents/                   Agent handoff/settings
```

## Internationalization

The application UI chrome supports:

- `en_US`
- `zh_CN`

The source biological matrix data is preserved in its original mixed Chinese/English form. UI labels, controls, status text, detail panel headings, table extension columns, and marker terminology are localized.

## Validation

Useful local checks:

```bash
npm run build
npx --yes esbuild main.jsx --bundle --format=esm --outfile=/tmp/mutation-inspector-check.js --external:react --external:framer-motion --external:lucide-react --log-level=warning
```

## License

MIT. See [LICENSE](LICENSE).
