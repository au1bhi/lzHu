---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[Download CV (PDF)](/assets/pdf/Lizhong_Hu_CV.pdf){: .btn .btn--primary }

## Profile

Software Engineering undergraduate in a Sino-American dual-degree program jointly operated by Quanzhou University of Information Engineering and Slippery Rock University. Interested in algorithms, software systems, information retrieval, and reliable intelligent systems, with experience in competitive programming, back-end development, Linux/Docker infrastructure, and live sports broadcast technical operations.

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
  Architected an end-to-end verifiable RAG system using FastAPI, async SQLAlchemy, and PostgreSQL with pgvector for cosine-similarity retrieval across PDF, Markdown, and TXT materials. Designed page-aware extraction, overlapping chunking, and grounded-mode server-side citation verification against candidate text chunks to mitigate hallucinations while persisting verbatim source excerpts and page indices for full auditability. Built an automated benchmark evaluation pipeline recording 100.0% Recall@5, a 97.1% citation-source match rate, and 339 ms mean retrieval latency.

* **ETi+ Smart Community Digital Governance Platform**<br>
  *Python & Flask | Mar 2025 – Apr 2025*<br>
  Engineered a dual-database backend architecture: leveraged PostgreSQL for relational governance logic (landlord credit scoring rules, leaderboard rankings, address mapping, and anomaly audits) alongside MongoDB for high-throughput WeChat chat stream logging. Developed RESTful APIs automating community group moderation, regex nickname compliance audits, batch Excel/CSV data ingestion, and Postman automated regression testing suites.

* **EVE Online Community Back-End System**<br>
  *Java & RuoYi | Oct 2023 – Apr 2025*<br>
  Re-architected a RuoYi-based community platform and developed data-query, moderation, and workflow tools for community managers and content creators.

* **DOMjudge & Privacy-Oriented Network Infrastructure**<br>
  *Linux & Docker | Sep 2024 – Present*<br>
  Deployed a containerized DOMjudge environment and maintain it for campus training and contests. Built a Cloudflare Worker subscription generator (~1,200 lines) with ISP ASN-based routing, multi-protocol output (Clash/V2Ray), and automated CDN speed testing. Engineered a dual-stack egress architecture that routes IPv6 traffic through Cloudflare WARP while preserving native IPv4 egress, with idempotent Python deployment scripts, database-level backup/restore, and end-to-end verification tooling.

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
  *Onsite Contestant | 2024*<br>
  Represented the university at the onsite regional contest in Kunming.

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
  Coordinate university recruitment and training for ICPC and CCPC competitors; supported logistics and team selection for the The 2024 ICPC Asia Kunming Regional Contest.

* **[2025年度第六届全国大学生算法设计与编程挑战赛（春季赛）](https://new.saikr.com/vse/adpc/2025/spring)**<br>
  *Problem Setter | Spring 2025*<br>
  Contributed to problem design, solution validation, difficulty calibration, and editorial review.

## Technical Skills

* **Languages & Algorithms**: C++, Python, Java, JavaScript, Go; algorithms and data structures, competitive programming

* **Back-End & Data**: FastAPI, Flask, RuoYi, PostgreSQL, MongoDB, MySQL, REST API design and integration

* **Systems & DevOps**: Linux, Docker, Git, SQL tooling, DOMjudge deployment, Cloudflare Workers/CDN/DNS, WARP egress routing

* **Information Retrieval & AI Systems**: Retrieval-Augmented Generation (RAG), LLM API integration, prompt design
