# Website typefaces

The website references Claude/Anthropic's sans / serif / mono pairing. The CSS prefers locally installed Anthropic families, then uses the self-hosted open-source equivalents below. These are alternatives, not copies of Anthropic's proprietary fonts.

| Role | Self-hosted font | Upstream |
| --- | --- | --- |
| Navigation, headings, forms and dashboards | Site Sans (Source Sans 3 subset) | https://github.com/adobe-fonts/source-sans |
| Reading text | Site Serif (Source Serif 4 subset) | https://github.com/adobe-fonts/source-serif |
| Code | Site Mono (Source Code Pro subset) | https://github.com/adobe-fonts/source-code-pro |

The served files are **Latin subsets** of the upstream variable fonts pinned in `sources.json` (the sizes there are those of the original files). They keep Basic Latin, Latin-1, Latin Extended-A, common punctuation, arrows and a few math signs, the default OpenType features, weights 300–700 and, for the serif, the optical-size axis. This reduces the reading face from about 420 KB to about 130 KB and the interface face from about 170 KB to under 30 KB.

Because the upstream licence reserves the font name "Source", the modified files are renamed: `site-serif-*.woff2` ("Site Serif", from Source Serif 4), `site-sans-*.woff2` ("Site Sans", from Source Sans 3) and `site-mono-*.woff2` ("Site Mono", from Source Code Pro). They remain under the SIL Open Font License; each family's upstream licence text is kept alongside. To regenerate them, download the original WOFF2 files at the pinned commits and run `python3 scripts/subset_fonts.py <originals-dir> assets/fonts` (requires `fonttools` and `brotli`; run it from a native filesystem path as with other builds).

Font loading uses `font-display: swap`; no Google Fonts or third-party font request is required. Chinese uses the configured local CJK sans / serif fallback, and emoji retains the browser fallback.

Typography stacks, font-face declarations and the `--font-*` custom properties are centralized in `_sass/_tokens.scss`. Icons are inline SVG (`_includes/icon.html`); no icon font is loaded. Status colors and separators inherit the existing website theme tokens.

Reference inspected 2026-10-08: https://www.anthropic.com/ (CSS families: Anthropic Sans, Anthropic Serif, Anthropic Mono). The Claude product page could not be inspected without access; the site adopts the pairing rather than claiming a pixel-identical Claude UI.
