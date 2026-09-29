---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[English CV (PDF)](/assets/pdf/Lizhong_Hu_CV.pdf){: .btn .btn--primary }
[中文简历（PDF）](/assets/pdf/Lizhong_Hu_CV_zh.pdf){: .btn .btn--primary }

## Profile

Software Engineering undergraduate in a Sino-American dual-degree program, with experience in back-end development, RAG systems, Linux/Docker infrastructure, and live sports broadcast support.

## Research Interests

* Algorithms and Data Structures
* Software and Distributed Systems
* Information Retrieval and Retrieval-Augmented Generation
* Reliable and Intelligent Information Systems

## Education

**Quanzhou University of Information Engineering & Slippery Rock University**<br>
*Dual-Degree Sino-American Undergraduate Program, 2023–2027 (expected)*

* **Quanzhou University of Information Engineering**<br>
  Software Engineering (Sino-foreign Cooperation)<br>
  GPA: 3.1/4.0

* **Slippery Rock University**<br>
  Information Systems, Bachelor of Science (BS)<br>
  GPA: 3.583/4.000

*Four-year 4+0 joint undergraduate program conducted in China and officially recognized by the Ministry of Education of China.*

## Selected Projects

* **NoteLLM: Personal Learning Question-Answering System with Verifiable RAG**<br>
  *FastAPI & Retrieval-Augmented Generation | Ongoing (Undergraduate Thesis)*<br>
  * Built a FastAPI backend with async SQLAlchemy, PostgreSQL, and pgvector for document retrieval across PDF, Markdown, and TXT files.
  * Implemented page-aware extraction, overlapping chunking, server-side citation validation, and source excerpt storage.
  * A single baseline run on 7 synthetic documents and 34 fixed questions recorded 100% source-level Recall@5, 97.1% automatic citation-to-source match, and 339 ms mean retrieval latency. [Evaluation report](https://github.com/au1bhi/NoteLLM/blob/master/docs/evaluation/latest-results.md).

  Source-level Recall@5 measures whether the expected source appears among the top five chunks; citation-to-source match measures whether an answer has at least one validated citation from the expected source. These are synthetic-set metrics, not answer accuracy or general-domain performance.

* **ETIPlus: Community Governance & WeChat Group Management Backend**<br>
  *Python & Flask | Mar 2025 – Apr 2025*<br>
  * Built a Flask backend using PostgreSQL for landlord credit scoring, rankings, and anomaly audits, and MongoDB for WeChat message storage.
  * Developed APIs for group moderation, regex nickname checks, and Excel/CSV imports; automated regression checks with Postman.

* **EVE Online Community Back-End System**<br>
  *Java & RuoYi | Oct 2023 – Apr 2025*<br>
  * Re-architected a RuoYi-based community platform and developed data-query, moderation, and workflow tools for community managers and content creators.

* **DOMjudge Online Judge Deployment & Operations**<br>
  *Linux & Docker | Sep 2024 – Present*<br>
  * Maintain a containerized DOMjudge environment for campus training and programming contests.

* **Encrypted Overlay Network with Dual-Stack Egress Isolation**<br>
  *Personal infrastructure project | Cloudflare Workers, Linux & Python*<br>
  * Built a Cloudflare Workers service to distribute proxy connection profiles in Clash/V2Ray formats, with ISP ASN-based node selection, cached configuration, and CDN speed testing.
  * Automated VPS egress configuration using Python, routing IPv6 through WARP alongside native IPv4. Added configuration backups, repeatable deployment, connectivity checks, and regression tests for routing conflicts and preservation of existing settings.

## Technical Experience

* **[Sinotech Xinrui (Beijing) Co., Ltd.](https://www.sinotechxinrui.com/) (中科鑫睿（北京）技术有限公司)**<br>
  *TOC Operator | Gifu, Japan | 7–22 Sep 2026*<br>
  **Project:** 20th Asian Games Aichi-Nagoya 2026 — broadcast technical support for football at Gifu Nagaragawa Stadium.<br>
  **Host broadcaster:** [China Media Group-International Media Port (CMG-IMP)](https://oca.asia/news/7336-cmg-imp-outlines-broadcasting-plans-for-20th-asian-games.html).
  * Checked equipment power, intercom quality, and primary/backup broadcast feeds before matches; coordinated signal verification with the broadcast team and outside broadcast van.
  * Monitored TOC signals during matches and provided on-site technical support throughout a 16-day football broadcast assignment.
  * Helped engineers isolate a monitor-feed fault to an optical transmitter through receiver replacement and attenuation tests; the feed was restored following post-match replacement and end-to-end verification.

* **[NOI-Pre Problem Bank — Matiji](https://www.matiji.net/exam/noi)**<br>
  *Problem Tester | Jul 2024 – Oct 2024*<br>
  A collaboration between Matiji (码蹄集) and China Computer Federation (CCF) supporting informatics education.
  * Tested programming problems for the NOI-Pre problem bank on Matiji; created test cases, checked solution correctness through targeted submissions, and reported issues with test data and judge results.

## Competitive Programming & Awards

* **[2026 National Invitational of CCPC (Fujian), The 13th Fujian Collegiate Programming Contest](https://codeforces.com/gym/106565)**<br>
  *First accepted solution to Problem A | 2026*<br>
  Recorded the contest's first accepted solution to Problem A; this is a problem-level distinction, not an overall placement.

* **[The 2024 ICPC Asia Kunming Regional Contest](https://icpc.pku.edu.cn/docs/20241102162338084775.pdf)**<br>
  *Honorable Medal | 2024*<br>
  Awarded Honorable Medal at The 2024 ICPC Asia Kunming Regional Contest, representing Quanzhou University of Information Engineering.

* **[15th Lanqiao Cup](https://www.lanqiao.cn/cup-fifteen/)**<br>
  *First Prize | Fujian Provincial Round | Python Programming, University Group B | 2024*<br>
  第十五届蓝桥杯全国软件和信息技术专业人才大赛，福建省赛 Python 程序设计大学 B 组一等奖。

## Leadership & Activities

* **ACM算法社**<br>
  *Organizer | Sep 2024 – Sep 2025*<br>
  Managed day-to-day club operations and helped organize the [“国教AC杯”大学生程序设计竞赛](https://ac.nowcoder.com/acm/contest/112012) and [环海岸线联盟联合校赛](https://ac.nowcoder.com/acm/contest/130880), involving seven partner universities.

* **[School of International Education](https://english.qzuie.edu.cn/news-list-schoolsdepartments.html)**<br>
  *Deputy Director, Learning Department | Sep 2024 – Sep 2025*<br>
  Coordinated faculty lecture series, competition events, and student participation.

* **University ICPC/CCPC training team**<br>
  *Coordinator | Sep 2024 – Present*<br>
  Coordinate university recruitment and training for ICPC and CCPC competitors; supported logistics and team selection for The 2024 ICPC Asia Kunming Regional Contest.

* **[2025年度第六届大学生算法设计与编程挑战赛（春季赛）](https://new.saikr.com/vse/adpc/2025/spring)**<br>
  *Problem Setter | Spring 2025*<br>
  Contributed to problem design, solution validation, difficulty calibration, and editorial review.

## Technical Skills

* **Languages & Algorithms**: C++, Python, Java, JavaScript, Go; algorithms and data structures, competitive programming

* **Back-End & Data**: FastAPI, Flask, RuoYi, PostgreSQL, MongoDB, MySQL, REST API design and integration

* **Systems & DevOps**: Linux, Docker, Git, SQL tooling, DOMjudge deployment, Cloudflare Workers/CDN/DNS, WARP egress routing

* **Information Retrieval & AI Systems**: Retrieval-Augmented Generation (RAG), LLM API integration, prompt design

* **AI Coding Tools**: Familiar with Codex, Claude Code, and Antigravity CLI for development and debugging; configure repository instructions and shared Skills, coordinate subagents for parallel code review, and validate changes through tests, static checks, and builds. Use AGENTS.md / CLAUDE.md for project context and conventions, shared skill directories for task guidance, and pytest, Ruff/type checks, Docker Compose, and browser checks for validation.

* **Contest Authoring & Judging Tools**: Familiar with Polygon (Codeforces) and Nowcoder’s problem-setting platform for problem preparation, test-data management, and solution verification.
