# Website typefaces

The site sets all text in one serif pairing, so that mixed Chinese and English lines share the same texture and weight. Two weights are used: a text weight slightly above regular, and bold for headings and emphasis. Italics are not used (Chinese has no italic form). Monospace appears only in code.

| Role | Self-hosted font | Source |
| --- | --- | --- |
| Latin text | Site Serif (`site-serif-roman.woff2`) | Source Serif 4, https://github.com/adobe-fonts/source-serif |
| Chinese text | Site Song (`site-song-medium.woff2`, `site-song-bold.woff2`) | Noto Serif CJK SC Medium and Bold, https://github.com/notofonts/noto-cjk |
| Code | Site Mono (`site-mono-roman.woff2`) | Source Code Pro, https://github.com/adobe-fonts/source-code-pro |

**Latin and code** files are subsets of the upstream variable fonts pinned in `sources.json` (the sizes there are those of the original files): Basic Latin, Latin-1, Latin Extended-A, common punctuation, arrows and a few math signs, default OpenType features, weights 300–700 and, for the serif, the optical-size axis. Regenerate with `python3 scripts/subset_fonts.py <originals-dir> assets/fonts`.

**Chinese** files contain only the characters that appear in the site's own pages, data and scripts (about 670 at the time of writing, roughly 140 KB per weight). A character that is not in the subset is drawn with the reader's system serif, which looks slightly different, so after adding Chinese text run `python3 scripts/subset_cjk_font.py` (it reads the Noto Serif CJK collection installed on the machine and writes the two files here). The Medium file serves all text weights; the Bold file serves headings.

All files are modified versions under the SIL Open Font License and are renamed ("Site …") because the upstream licence reserves the name "Source". The upstream licence texts are kept alongside; Noto Serif CJK is © 2017–2023 Adobe, also under the SIL Open Font License 1.1.

Font loading uses `font-display: swap`; no third-party font request is made. Stacks, font-face declarations and the `--font-*` custom properties are in `_sass/_tokens.scss`. Icons are inline SVG (`_includes/icon.html`).
