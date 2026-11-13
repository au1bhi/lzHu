---
layout: archive
title: "CV"
permalink: /cv/
classes: cv
translation: /zh/cv/
toc: true
lead: "Education, projects, technical experience, awards, and the complete profile in Chinese and English."
redirect_from:
  - /resume
---

{% include base_path %}

## Complete Profile

The complete profile covers education, research interests, projects, technical experience, contest awards, leadership and skills, in separate Chinese and English PDFs.

<div class="download-grid">
  <a class="download-card" href="{{ base_path }}/assets/pdf/full/Lizhong_Hu_CV_zh.pdf">
    <span class="download-card__badge">PDF</span>
    <span class="download-card__body">
      <span class="download-card__title">中文完整介绍</span>
      <span class="download-card__note">简体中文 · PDF</span>
    </span>
    <span class="download-card__icon">{% include icon.html name="download" %}</span>
  </a>
  <a class="download-card" href="{{ base_path }}/assets/pdf/full/Lizhong_Hu_CV_en.pdf">
    <span class="download-card__badge">PDF</span>
    <span class="download-card__body">
      <span class="download-card__title">Complete Profile in English</span>
      <span class="download-card__note">English · PDF</span>
    </span>
    <span class="download-card__icon">{% include icon.html name="download" %}</span>
  </a>
</div>

## Profile

Software Engineering undergraduate in a Sino-American dual-degree program, with experience in back-end development, RAG systems, Linux/Docker infrastructure, and live sports broadcast support.

## Research Interests

* **Primary interests:** Information Retrieval and Verifiable Retrieval-Augmented Generation
* **Related interests:** Algorithms and Data Structures; Software and Distributed Systems; Reliable and Intelligent Information Systems

## Education

**Quanzhou University of Information Engineering & Slippery Rock University**<br>
*Dual-Degree Sino-American Undergraduate Program, 2023–2027 (expected)*

* **Quanzhou University of Information Engineering**<br>
  Software Engineering (Sino-foreign Cooperation; in progress, expected 2027)<br>
  GPA: 3.1/4.0

* **Slippery Rock University**<br>
  Information Systems, Bachelor of Science (BS; in progress, expected 2027)<br>
  GPA: 3.583/4.000

*Four-year 4+0 joint undergraduate program conducted in China and officially recognized by the Ministry of Education of China.*

## Technical Experience

* **[Sinotech Xinrui (Beijing) Co., Ltd.](https://www.sinotechxinrui.com/) (中科鑫睿（北京）技术有限公司)**<br>
  *TOC Operator | Gifu, Japan | 7–22 Sep 2026*<br>
  **Project:** 20th Asian Games Aichi-Nagoya 2026 — broadcast technical support for football at Gifu Nagaragawa Stadium.<br>
  **Host broadcaster:** [China Media Group-International Media Port (CMG-IMP)](https://oca.asia/news/7336-cmg-imp-outlines-broadcasting-plans-for-20th-asian-games.html).
  * Checked equipment power, intercom quality, and primary/backup broadcast feeds before matches; coordinated signal verification with the broadcast team and outside broadcast van.
  * Monitored TOC signals during matches and provided on-site technical support throughout a 16-day football broadcast assignment.
  * Helped engineers isolate a monitor-feed fault to an optical transmitter through receiver replacement and attenuation tests; the feed was restored following post-match replacement and end-to-end verification.

{% include cv/matiji.md %}

## Selected Projects

* **[NoteLLM: Personal Learning Question-Answering System with Verifiable RAG](https://notellm.au1bhi.com)**<br>
  *FastAPI & Retrieval-Augmented Generation | Ongoing (Undergraduate Thesis)*<br>
  * Built a FastAPI backend with async SQLAlchemy, PostgreSQL, and pgvector for document retrieval across PDF, Markdown, and TXT files.
  * Implemented page-aware extraction, overlapping chunking, server-side citation validation, and source excerpt storage.
  * A single baseline run on 7 synthetic documents and 34 fixed questions recorded 100% source-level Recall@5, 97.1% automatic citation-to-source match, and 339 ms mean retrieval latency. [Evaluation report](https://github.com/au1bhi/NoteLLM/blob/master/docs/evaluation/latest-results.md).

  Source-level Recall@5 measures whether the expected source appears among the top five chunks; citation-to-source match measures whether an answer has at least one validated citation from the expected source. These are synthetic-set metrics, not answer accuracy or general-domain performance.

* **ETIPlus: Community Governance & WeChat Group Management Backend**<br>
  *Python & Flask | Mar 2025 – Apr 2025*<br>
  * Built a Flask backend using PostgreSQL for landlord credit scoring, rankings, and anomaly audits, and MongoDB for WeChat message storage.
  * Developed APIs for group moderation, regex nickname checks, and Excel/CSV imports; automated regression checks with Postman.

{% include cv/domjudge.md %}

* **Encrypted Overlay Network with Dual-Stack Egress Isolation**<br>
  *Personal infrastructure project | Cloudflare Workers, Linux & Python*<br>
  * Built a Cloudflare Workers service to distribute proxy connection profiles in Clash/V2Ray formats, with ISP ASN-based node selection, cached configuration, and CDN speed testing.
  * Automated VPS egress configuration using Python, routing IPv6 through WARP alongside native IPv4. Added configuration backups, repeatable deployment, connectivity checks, and regression tests for routing conflicts and preservation of existing settings.

## Competitive Programming & Awards

{% include cv/award-ccpc-fujian.md %}

{% include cv/award-icpc-kunming.md %}

{% include cv/award-lanqiao.md %}

## Leadership & Activities

{% include cv/acm-club.md %}

* **[School of International Education](https://english.qzuie.edu.cn/news-list-schoolsdepartments.html)**<br>
  *Deputy Director, Learning Department | Sep 2024 – Sep 2025*<br>
  Coordinated faculty lecture series, competition events, and student participation.

{% include cv/training-team.md %}


{% include cv/problem-setting-spring-2025.md %}

## Technical Skills

* **Languages & Algorithms**: C++, Python, Java, JavaScript, Go; algorithms and data structures, competitive programming

* **Back-End & Data**: FastAPI, Flask, RuoYi, PostgreSQL, MongoDB, MySQL, REST API design and integration

* **Systems & DevOps**: Linux, Docker, Git, SQL tooling, DOMjudge deployment, Cloudflare Workers/CDN/DNS, WARP egress routing

* **Information Retrieval & AI Systems**: Retrieval-Augmented Generation (RAG), LLM API integration, prompt design

* **Development Tools & Validation**: Codex, Claude Code, and Antigravity CLI; configure AGENTS.md / CLAUDE.md and shared Skills, decompose tasks, and coordinate subagent review. Validate changes with pytest, Ruff/type checks, Docker Compose, browser checks, and builds.

{% include cv/contest-tools.md %}