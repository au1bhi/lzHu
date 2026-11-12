# LaTeX CV

## Complete website profiles

The website main PDFs are full Chinese/English introductions, covering all supported education, research interests, projects, technical experience, awards, leadership, skills, and contest resources from the site. Readability takes priority over page count: use 11 pt text and natural multi-page A4 layout, with no one-page limit.

From the repository root:

```bash
python3 scripts/build_cv_full.py --compile
# Generate sources only:
python3 scripts/build_cv_full.py
```

Sources: `cv-latex/full/cv-en.tex` and `cv-zh.tex`. Published PDFs: `assets/pdf/full/Lizhong_Hu_CV_en.pdf` and `Lizhong_Hu_CV_zh.pdf`. The generator also refreshes the existing root aliases `Lizhong_Hu_CV.pdf`, `Lizhong_Hu_CV_zh.pdf`, and `胡力中_简历.pdf` so existing links continue to point to the complete introductions.

Full-profile selection is maintained in the `full` and `full_awards` sections of `variants.json`, using the same bilingual entry/skill registry as application CVs. Do not edit generated sources directly. The original `cv.tex` and `cv-zh.tex` provide shared preambles; compiling those old standalone files is not the publication workflow for the complete profiles.

The full-profile renderer starts technical experience and awards on fresh pages to keep page topics coherent. Inspect both languages after content changes: short experiences, skill rows, and evaluation notes should stay together. Full entries may use labeled bullets, a separate evaluation-scope note, or yearly contest groups. Archive entries provide evidence links; individual responsibilities are stated once under activities. Preserve complete facts, official contest names, metric definitions, and original resource links when reorganizing content. Changes to shared education also require rebuilding the eight application PDFs and checking their one-page limit.

The `full/` folder separates the website reference introduction from the selected application CVs below. This prevents a short application document from accidentally replacing the complete website profile. See `AGENTS.md` for the directory rationale and maintenance rules.

Official names and source links are recorded in [name-sources.md](name-sources.md). Keep this record updated when changing institution or competition names.

## Audience-specific bilingual CVs

Four audiences are published in both Chinese and English:

| Audience | Audience directory | Selection |
| --- | --- | --- |
| International companies / 外企 | `international` | Backend projects, teamwork, and on-site technical support in Japan |
| Algorithm education & training / 算法教育培训 | `training` | Problem testing/setting, training coordination, contest operations, and DOMjudge |
| Engineering / 工程 | `engineering` | Backend services, databases, network infrastructure, and validation |
| Graduate study / 升学 | `academic` | Research interests, undergraduate thesis methods/evaluation, and algorithm contributions |

Directories separate the four application purposes so that files are easier to select and an academic CV is not accidentally submitted for a job application. Each Chinese/English pair stays together to support factual consistency. Shared content and rendering remain centralized to avoid drift between versions.

Content is maintained in `variants.json`, selected from `_pages/cv.md`, `_pages/about.md`, and the contest archive. Institution and award names follow `name-sources.md`. Chinese and English describe the same facts; training support is not presented as formal classroom teaching, and synthetic RAG evaluation is not presented as general answer accuracy.

Application PDFs each occupy one A4 page. A short focus line and restrained accent color identify each purpose: blue for international companies, teal for algorithm education, green for engineering, and purple for graduate study. `APPLICATION_LAYOUTS` in the generator tunes readable body type and spacing separately for each audience/language so translations use the page effectively. Engineering includes the documented NoteLLM evaluation evidence; graduate-study selection centers on thesis methods and evaluation. Review all eight PDFs when changing this layout or its content. Compilation uses Poppler's `pdfinfo` to reject a multi-page application PDF before copying it into the published folder; complete website profiles remain unrestricted.

From the repository root, regenerate the eight standalone LaTeX sources and compile/copy their PDFs:

```bash
python3 scripts/build_cv_variants.py --compile
# Generate sources only:
python3 scripts/build_cv_variants.py
# Rebuild one version:
python3 scripts/build_cv_variants.py --compile --audience engineering --language zh
```

Dependencies: Python 3, latexmk, pdfLaTeX for English, and XeLaTeX with SimSun, SimHei, FangSong, and KaiTi for Chinese. Generated `variants/{audience}/cv-{en,zh}.tex` files should be updated through `variants.json` and the generator. Shared layout and education are rendered by `scripts/build_cv_variants.py`; the original `cv.tex` / `cv-zh.tex` supply the existing font and layout preambles.

Generated sources are grouped under `cv-latex/variants/{audience}/`; each directory contains `cv-en.tex` and `cv-zh.tex`. Published PDFs mirror that layout under `/assets/pdf/variants/{audience}/Lizhong_Hu_CV_{en,zh}.pdf`; the Chinese engineering alias is kept inside `variants/engineering/胡力中_工程岗位简历.pdf`. The download table reads `_data/cv_variants.json`. Existing root PDF URLs remain aliases of the complete website profiles.

Compilation now uses checked native-filesystem workspaces under `${XDG_CACHE_HOME:-$HOME/.cache}/lzhu-cv-build/`. TeX sources stay in this repository; compiler intermediates and logs stay off NTFS. Successful workspaces are removed automatically; failed diagnostics are retained in the cache. Do not run raw latexmk in `cv-latex/` or override compiler output to the NTFS data disk. The existing full and variant generator commands remain the supported entry points.

This avoids the known NTFS3 compiler-write failure observed in the sibling thesis project. Each target has a lock and a bounded compiler timeout; an uninterruptible kernel task requires stopping further work and a normal reboot after saving files. See `AGENTS.md` and the parent `../AGENTS.md`.
