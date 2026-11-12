# Website typefaces

The site sets all text in one sans-serif family so that mixed Chinese and English lines share the same weight and texture. Only two weights are used: 400 for text and 700 for headings and emphasis (the two weights every common Chinese system font provides, so Latin and Chinese emphasis match). Italics are not used (Chinese has no italic form). Monospace appears only in code.

| Role | Self-hosted font | Upstream |
| --- | --- | --- |
| All Latin text | Site Sans (Source Sans 3 subset) | https://github.com/adobe-fonts/source-sans |
| Code | Site Mono (Source Code Pro subset) | https://github.com/adobe-fonts/source-code-pro |

Chinese is rendered with the reader's system sans (PingFang SC, Microsoft YaHei, Noto Sans CJK SC, in that order of preference); no Chinese webfont is downloaded.

The served files are **Latin subsets** of the upstream variable fonts pinned in `sources.json` (the sizes there are those of the original files). They keep Basic Latin, Latin-1, Latin Extended-A, common punctuation, arrows and a few math signs, the default OpenType features and weights 300–700. Together they are about 55 KB.

Because the upstream licence reserves the font name "Source", the modified files are renamed: `site-sans-roman.woff2` ("Site Sans") and `site-mono-roman.woff2` ("Site Mono"). They remain under the SIL Open Font License; each family's upstream licence text is kept alongside. To regenerate them, download the original WOFF2 files at the pinned commits and run `python3 scripts/subset_fonts.py <originals-dir> assets/fonts` (requires `fonttools` and `brotli`; run it from a native filesystem path as with other builds).

Font loading uses `font-display: swap`; no Google Fonts or third-party font request is made. Stacks, font-face declarations and the `--font-*` custom properties are in `_sass/_tokens.scss`. Icons are inline SVG (`_includes/icon.html`).
