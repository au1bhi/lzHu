# Repository Guidelines

## Project Structure & Module Organization

This repository powers Lizhong Hu’s Jekyll personal website at au1bhi.com. Published content includes the homepage, CV, contest archive, and Codeforces dashboard.

- `_pages/` contains page content; `_portfolio/` contains contest archive entries.
- `_data/` holds navigation and CV data; `_config.yml` controls site settings.
- `_layouts/` and `_includes/` contain Liquid templates; `_sass/` contains styles.
- `assets/`, `images/`, and `files/` hold scripts, images, and downloadable documents.
- `cv-latex/cv.tex` produces the published `assets/pdf/Lizhong_Hu_CV.pdf`.
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

For PDF updates, follow `cv-latex/README.md` and copy the compiled PDF into `assets/pdf/`. Keep Markdown, JSON, LaTeX, and published PDF content aligned.

## Coding Style & Naming Conventions

Match surrounding formatting: two-space indentation in JavaScript, JSON, and YAML; four spaces in Python. Preserve Markdown front matter and existing permalinks. Use descriptive filenames consistent with neighboring content. Edit JavaScript sources before regenerating the minified bundle. No dedicated formatter or linter is configured.

## Testing Guidelines

No automated test suite or coverage threshold is configured. Run the production build and `git diff --check`. Preview affected pages on desktop and mobile; verify navigation, downloads, and any changed dashboard or theme behavior.

## Commit & Pull Request Guidelines

History uses short descriptive subjects such as `update CV`; no enforced prefix convention exists. Prefer specific, action-oriented messages and focused commits. Base contributions on `master`. PRs should describe the change, link relevant issues, report validation, and include screenshots for visible changes.

## Security & Configuration

Keep dependency lockfiles tracked. Never commit credentials, `.env` files, caches, or generated `_site/` output. Restart Jekyll after changing `_config.yml`.
