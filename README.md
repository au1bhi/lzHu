# Lizhong Hu — Personal Website

Source for [au1bhi.com](https://au1bhi.com), a lightweight personal website for a CV, selected contest materials, and Codeforces statistics.

## What is published

- **Home** — a short introduction and links to the main sections
- **CV** — education, experience, and competition records
- **Contest Archive** — selected reference materials
- **Codeforces** — a browser-side dashboard for the public `Au1Bhi` profile

The site intentionally does not publish the unused AcademicPages sample sections (publications, talks, teaching, blog archives, tag/category indexes, demo pages, or an interactive site-map page). Comments, social sharing, analytics, and the footer RSS link are disabled.

## Local development

Docker is the recommended way to run the same locked Ruby/Jekyll environment used by the project.

```bash
docker compose up --build
```

Open <http://127.0.0.1:4000>. The port is bound to loopback only, so the development server is not exposed to the local network.

To produce a one-off build:

```bash
docker build -t jekyll-site:local .
docker run --rm -v "$PWD:/usr/src/app" -w /usr/src/app \
  jekyll-site:local bundle exec jekyll build
```

If Ruby and Bundler are already installed locally, use the lockfile:

```bash
bundle install
bundle exec jekyll serve
```

## Updating content

| Content | Primary file |
| --- | --- |
| Homepage | `_pages/about.md` |
| CV | `_pages/cv.md` |
| CV JSON data | `_data/cv.json` |
| Navigation | `_data/navigation.yml` |
| Contest archive entries | `_portfolio/` |
| Site identity and public profiles | `_config.yml` |

Keep `_pages/cv.md` and `_data/cv.json` aligned. After editing the Markdown CV, run:

```bash
./scripts/update_cv_json.sh
```

The script updates the JSON data and can optionally start a local Jekyll server.

## Mathematics

MathJax is loaded site-wide. In Markdown, use `\(...\)` for inline math and `$$...$$` for display math:

```markdown
The running time is \(O(n \log n)\).

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

## Quality and security

- Dependency versions are locked in `Gemfile.lock` and `package-lock.json`.
- Dependabot checks Ruby, npm, Docker, Python workflow, and GitHub Action dependencies weekly.
- Do not commit credentials, tokens, private keys, `.env` files, or generated `_site/` output; these are excluded by `.gitignore`.
- Before pushing, run a local production build and review `git diff --check`.

## Deployment

The site is designed for GitHub Pages. Push the verified `master` branch to the configured `origin`; the hosting platform then builds and serves the site. Never place secrets in repository files or Git history.
