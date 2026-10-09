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

## Network Status

`/status/` 展示原生 IPv4 和 WARP IPv6 的实时健康状态、每个节点的状态与延迟、7 天真实检测历史（84 格，每格两小时，显示区间内最后一次实际探测结果）和对应状态变化。新事件保存检测数量、失败及恢复节点、逐节点变化、延迟范围与中位数、上轮检测对照；同一线路总体状态不变时，节点状态变化也会记录。历史色块区分等待本轮检测、历史无记录、未取得可判定结果和监控任务异常；任务异常使用灰色条纹，保存可确认的异常时间及失败环节。服务器还保存每轮开始、执行阶段、结果及完成状态；重启可恢复已测出但未写完的结果，未完成的任务会记录为中断。旧事件缺失的明细会明确标注，列表支持展开详情和加载更多。所有节点默认展开；搜索只筛选节点，不改变总体统计。数据来自上海监测点，不代表每个用户所在地的连接体验。

页面读取 `https://notellm.au1bhi.com/network-status/ip-data` 的公开脱敏数据，无需前端密钥。该服务已允许本站域名及 `http://127.0.0.1:4000` / `http://localhost:4000` 的跨域读取。刷新失败会提示重试；服务器每两小时探测一次，页面刷新只同步保存的结果；超过两小时五分钟的数据不再显示为可用。页面资源在 `assets/css/network-status.css` 和 `assets/js/network-status.js`，入口在 `_pages/status.html`。

状态使用判题风格：`Accept`、`Partial`、`Time Limit Exceed` 和 `Skipped`。延迟由上海 Mihomo URL Test 测量，监控配置启用 `unified-delay`；接口提供本轮实际模式，页面不会把旧结果标成统一延迟。与本地客户端对照时需使用相同测试目标和统一延迟设置。

## Typography

全站参考 Claude / Anthropic 的 sans、serif、mono 搭配：标题、导航和数据界面使用 Source Sans 3，正文使用 Source Serif 4，代码使用 Source Code Pro；本机若有对应 Anthropic 字体则优先使用。开源替代字体以原始 WOFF2 文件自托管，使用 `font-display: swap`，中文设置对应的本机字体回退。字体来源、固定版本与许可证见 [字体说明](assets/fonts/README.md)。Status 使用原站的页面布局和主题变量，并随全站明暗主题切换。
