# Repository Guidelines

## Project Structure & Module Organization

This repository powers Lizhong Hu’s Jekyll personal website at au1bhi.com. Published content includes the homepage, CV, contest archive, and Codeforces dashboard.

- `_pages/` contains page content; `_portfolio/` contains contest archive entries.
- `_data/` holds navigation and CV data; `_config.yml` controls site settings.
- `_layouts/` and `_includes/` contain Liquid templates; `_sass/` contains styles: `_tokens.scss` (fonts, light/dark colour roles, motion), `_base.scss`, `_layout.scss`, `_components.scss`, `_syntax.scss`, `_motion.scss`. Pages use design tokens such as `--ink`, `--bg-raised`, `--accent`; do not hard-code colours.
- `assets/js/_main.js` is the dependency-free site script (theme toggle, navigation, scroll reveal, section index, on-demand MathJax/Mermaid/Plotly); `assets/js/codeforces.js` and `network-status.js` are page scripts. Icons come from `_includes/icon.html` (inline SVG).
- Content priority: lead with what a first-time reader finds most notable (the Asian Games assignment, awards, the featured project), then supporting detail. In the results strip the large `value` names the achievement or event itself, never a duration or count.
- The homepage (`_pages/about.md`, `_layouts/home.html`, `assets/js/home.js`) shows a results strip from the `highlights` front matter, a featured-project card, a live Codeforces rating, and an animated shortest-path graph behind the hero. Keep these facts aligned with `_pages/cv.md`; keep the synthetic-set caveat next to the NoteLLM metrics.
- `images/og-card.png` (1200×630) is the default share image (`og_image` in `_config.yml`); the favicon set in `images/` is the masthead diamond mark.
- Entries that appear on both the CV and the Contest Archive live once in `_includes/cv/*.md` and are included by `_pages/cv.md` and `_pages/portfolio.md`; edit them there.
- Every published page has a Chinese counterpart under `_pages/zh/` (`/zh/`, `/zh/cv/`, `/zh/portfolio/`, `/zh/codeforces/`, `/zh/status/`) with `lang: zh`, so Chinese navigation never lands on an English page; add both versions when adding a page. The Codeforces pages share `_includes/codeforces-dashboard.html` (labels in `_data/codeforces_i18n.yml`, runtime text via `L(en, zh)` in `assets/js/codeforces.js`). The status pages use two scripts with identical logic, `assets/js/network-status.js` and `network-status-zh.js`; change them together. Other details: interface strings are in `_data/i18n.yml`, Chinese navigation in `main_zh` of `_data/navigation.yml`, and `translation:` front matter links each page to its counterpart. The Chinese CV body is rendered by `_includes/cv-web.html` from `_data/cv_web.json`; after editing `cv-latex/variants.json`, run `python3 scripts/export_cv_web.py` (education is mirrored in that script from `build_cv_variants.py`). Do not hand-edit `_data/cv_web.json`.
- Codeforces data: `scripts/fetch_codeforces.py` writes the trimmed snapshot `assets/data/codeforces.json`, refreshed daily by `.github/workflows/codeforces-snapshot.yml`. Pages paint the snapshot first and replace it with live API data when reachable. Chart.js is self-hosted in `assets/vendor/`; do not add CDN dependencies for published pages.
- Finish layer (`_sass/_finish.scss`, loaded last): paper grain, a brass detail colour (`--brass`) used only for numerals, hairlines and small marks, layered shadows with an inner highlight on raised surfaces, pointer-following light, a sliding navigation indicator, and slow "settle" entrances. The aim is restrained and tactile, not flashy; prefer refining these over adding new effects, and keep every effect optional (no JavaScript, no hover, reduced motion).
- Typography: one serif pairing for all text, including navigation and labels (`Site Serif` for Latin, `Site Song` for Chinese; the owner prefers the serif look and found sans-serif thin). Two weights only (`$weight-text` and 700), no italics, monospace only for code. Do not introduce a sans face, extra weights or italic emphasis; mixed Chinese/English text must look like one typeface. After adding or changing Chinese text anywhere on the site, run `python3 scripts/subset_cjk_font.py` so the new characters are in the Chinese webfont. See `assets/fonts/README.md`.
- Front matter options: `layout: home` (hero from `site.author`), `lead`, `eyebrow`, `wide: true` (full-width shell), `toc: true` (section index built from `h2` headings), `classes: cv` (CV entry styling).
- `assets/`, `images/`, and `files/` hold scripts, images, and downloadable documents.
- Complete website profile sources live in `cv-latex/full/`; published Chinese/English PDFs live in `assets/pdf/full/`.
- `cv-latex/cv.tex` and `cv-zh.tex` retain the shared font/layout preambles used by the generators.
- Audience-specific CV sources live in `cv-latex/variants/<audience>/`; published PDFs mirror this in `assets/pdf/variants/<audience>/`.
- `scripts/` provides content utilities. `_site/` is generated output.

Keep unused AcademicPages sample sections unpublished unless explicitly requested.

## Build, Test, and Development Commands

- `docker compose up --build`: recommended local server at `http://127.0.0.1:4000`.
- `bundle install`: install Ruby dependencies using `Gemfile.lock`.
- `bundle exec jekyll serve`: run locally with Ruby and Bundler installed.
- `JEKYLL_ENV=production bundle exec jekyll build`: validate the production site build.
- `npm ci` followed by `npm run build:js`: install locked JavaScript dependencies and rebuild `assets/js/main.min.js`; use Node.js 20 or newer.
- `npm run watch:js`: rebuild JavaScript when source files change.
- `./scripts/update_cv_json.sh`: regenerate CV JSON; review the resulting diff for accuracy.
- `python3 scripts/build_cv_full.py --compile`: regenerate and compile both complete website profiles.
- `python3 scripts/build_cv_variants.py --compile`: regenerate and compile all four application audiences in both languages.

For PDF updates, follow `cv-latex/README.md` and copy the compiled PDF into `assets/pdf/`. Keep Markdown, JSON, LaTeX, and published PDF content aligned.

## CV Audience Directories & Maintenance

The website complete profiles and application CVs have different purposes. Keep them in separate directory trees, with the Chinese and English versions together in each folder:

- `cv-latex/full/` → `assets/pdf/full/`: the complete website introduction in both languages. Include all supported education, research interests, projects, technical experience, awards, leadership, skills, and public contest resources from the site. Use readable multi-page A4 layout; do not impose a one-page limit or remove facts to squeeze the document onto one page.
- `cv-latex/variants/<audience>/` → `assets/pdf/variants/<audience>/`: application CVs selected and ordered for each reader:

| Directory | Purpose | Content priority |
| --- | --- | --- |
| `international/` | International companies / 外企 | Backend projects, teamwork, and international on-site technical support |
| `training/` | Algorithm education and training / 算法教育培训 | Problem testing/setting, training coordination, and online judging |
| `engineering/` | Engineering roles / 工程 | Backend implementation, databases, infrastructure, and validation |
| `academic/` | Graduate study / 升学 | Research interests, thesis methods, and evaluation |

**Why this layout:** the website PDFs serve as a complete reference, while application CVs deliberately select and order content for different readers. A separate `full/` folder prevents the complete introduction from being accidentally replaced by a short application CV. Purpose-based folders make the correct version easy to find and reduce accidental submission of the wrong CV. Keeping both languages in the same folder makes factual comparison easier. Mirroring the source and PDF directories keeps the build output and download links unambiguous; shared content and rendering remain centralized to avoid maintenance drift.

- Source paths: `cv-latex/variants/<audience>/cv-en.tex` and `cv-zh.tex`.
- Published paths: `assets/pdf/variants/<audience>/Lizhong_Hu_CV_en.pdf` and `Lizhong_Hu_CV_zh.pdf`. Keep any audience-specific aliases inside that audience folder too; do not add flat copies at the PDF root.
- Edit `cv-latex/variants.json` and regenerate with `python3 scripts/build_cv_variants.py --compile`. Do not hand-edit the generated LaTeX files. Shared layout/education are rendered by the script, using the general CV preambles.
- Update `_data/cv_variants.json` when moving published files. `_pages/cv.md` currently offers only the two complete profiles for download; the application CVs stay built and published under `assets/pdf/variants/` but are not linked from the page. Keep this directory mapping aligned with the generator and `cv-latex/README.md`.
- Keep Chinese and English facts aligned while tailoring emphasis to the audience. Complete profiles include research interests; among application CVs, only `academic/` includes a research-interest section. Distinguish contest training support from formal teaching, and synthetic RAG metrics from general answer accuracy.
- Application CVs must each fit one A4 page and use the page substantially while retaining readable type and margins. Give each audience a concise focus line and a restrained accent color; prioritize its relevant evidence rather than repeating the complete profile. Calibrate font size and spacing separately for each audience/language in `APPLICATION_LAYOUTS`, inspect all eight PDFs after layout changes, and avoid adding unsupported facts or empty padding to fill space. The compiler checks the one-page limit before copying a published variant.
- Maintain complete-profile content in the `full` / `full_awards` sections of `cv-latex/variants.json`, sharing the entry and skill registry with application CVs. Regenerate with `python3 scripts/build_cv_full.py --compile`; do not hand-edit `cv-latex/full/cv-en.tex` or `cv-zh.tex`.
- Full-profile pages group education/projects, technical experience/activities, and awards/skills/resources. Preserve all facts and evidence links while consolidating repeated responsibilities; clearly label university team participation, retain RAG evaluation scope/definitions, and prevent short experiences or isolated skill rows from splitting across pages. Shared education updates require rebuilding both full profiles and all application versions.
- Complete profile links in `_pages/cv.md` point to `assets/pdf/full/`. Existing root PDF URLs (`Lizhong_Hu_CV.pdf`, `Lizhong_Hu_CV_zh.pdf`, `胡力中_简历.pdf`) remain compatibility aliases of the complete profiles, updated by the full-profile generator.
- Ignore generated local PDFs, auxiliary files, and caches recursively under `cv-latex/`; only published PDF copies belong in version control.
- After a content or directory change, compile affected CVs, check their layout, validate download destinations with the production site build, and run `git diff --check`.

## Native-filesystem compiler safety

The sibling thesis build triggered an NTFS3 kernel BUG on this machine on 2026-10-09. CV compilation uses `scripts/compile_cv.py` and `scripts/native_build.py`: a checked native cache under `${XDG_CACHE_HOME:-$HOME/.cache}/lzhu-cv-build/`, per-target lock and bounded compiler shutdown. Only successful final PDFs are copied into `assets/pdf/`; successful temporary workspaces are removed, failed diagnostics are retained in the cache. Do not run raw latexmk/XeLaTeX/Biber in `cv-latex/` or redirect compiler intermediates to NTFS. Do not recursively scan the entire data disk or the blocked thesis build directory. Follow the parent `../AGENTS.md` for filesystem failure handling; do not retry D-state compiler tasks or try to clear kernel locks by deleting project files.

## Coding Style & Naming Conventions

Match surrounding formatting: two-space indentation in JavaScript, JSON, and YAML; four spaces in Python. Preserve Markdown front matter and existing permalinks. Use descriptive filenames consistent with neighboring content. Edit JavaScript sources before regenerating the minified bundle. No dedicated formatter or linter is configured.

## Testing Guidelines

No automated test suite or coverage threshold is configured. Run the production build and `git diff --check`. Preview affected pages on desktop and mobile; verify navigation, downloads, and any changed dashboard or theme behavior.

## Commit & Pull Request Guidelines

History uses short descriptive subjects such as `update CV`; no enforced prefix convention exists. Prefer specific, action-oriented messages and focused commits. Base contributions on `master`. PRs should describe the change, link relevant issues, report validation, and include screenshots for visible changes.

## Security & Configuration

Keep dependency lockfiles tracked. Never commit credentials, `.env` files, caches, or generated `_site/` output. Restart Jekyll after changing `_config.yml`.
