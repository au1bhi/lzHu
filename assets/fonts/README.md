# Website typefaces

The website references Claude/Anthropic's sans / serif / mono pairing. The CSS prefers locally installed Anthropic families, then uses the self-hosted open-source equivalents below. These are alternatives, not copies of Anthropic's proprietary fonts.

| Role | Self-hosted font | Upstream |
| --- | --- | --- |
| Navigation, headings, forms and dashboards | Source Sans 3 | https://github.com/adobe-fonts/source-sans |
| Reading text | Source Serif 4 | https://github.com/adobe-fonts/source-serif |
| Code | Source Code Pro | https://github.com/adobe-fonts/source-code-pro |

Original, unmodified variable WOFF2 files are pinned to the commits in `sources.json`. Each family includes its upstream SIL Open Font License. Regular and italic faces support weights 200–900. Font loading uses `font-display: swap`; no Google Fonts or third-party font request is required. Chinese uses the configured local CJK sans / serif fallback, and emoji retains the browser fallback.

Typography variables are centralized in `_sass/_themes.scss`; font-face declarations and UI roles are in `_sass/layout/_typography.scss`. Keep icon fonts separate. Status colors and separators inherit the existing website theme tokens.

Reference inspected 2026-10-08: https://www.anthropic.com/ (CSS families: Anthropic Sans, Anthropic Serif, Anthropic Mono). The Claude product page could not be inspected without access; the site adopts the pairing rather than claiming a pixel-identical Claude UI.
