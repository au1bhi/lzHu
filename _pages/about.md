---
permalink: /
title: ""
layout: home
translation: /zh/
eyebrow: "Software Engineering · Algorithms · Information Retrieval"
hero_title: "Hi, I’m Lizhong Hu."
lead: "Software Engineering undergraduate working on algorithms, back-end systems, and verifiable retrieval-augmented generation."
highlights:
  - value: "Asian Games 2026"
    label: "On-site broadcast technical support, 20th Asian Games Aichi-Nagoya"
    note: "TOC Operator for football broadcasts · 16 days in Gifu, Japan"
    url: "/cv/#technical-experience"
  - value: "First Prize"
    label: "15th Lanqiao Cup, Fujian Provincial Round"
    note: "Python Programming, University Group B · 2024"
    url: "https://www.lanqiao.cn/cup-fifteen/"
  - value: "First to Solve"
    label: "Problem A, 2026 National Invitational of CCPC (Fujian)"
    note: "A problem-level distinction, not an overall placement"
    url: "https://codeforces.com/gym/106565"
  - value: "Contest Organizer"
    label: "Principal organizer and problem setter, ISCPC-AC Cup"
    note: "Problem setter for three contests · joint contest with seven partner universities"
    url: "/portfolio/#problem-setting--organizing"
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Projects online</h2>
  <div class="home-section__body">
    <article class="project">
      <header class="project__head">
        <p class="card__kicker">Undergraduate thesis · Ongoing · <a href="https://notellm.au1bhi.com" rel="noopener">notellm.au1bhi.com</a></p>
        <h3 class="project__title">NoteLLM: Personal Learning Question-Answering System with Verifiable RAG</h3>
        <p class="project__text">A FastAPI backend with async SQLAlchemy, PostgreSQL, and pgvector for document retrieval across PDF, Markdown, and TXT files, with page-aware extraction, overlapping chunking, server-side citation validation, and source excerpt storage.</p>
      </header>
      <dl class="project__metrics">
        <div><dt>Source-level Recall@5</dt><dd data-count="100" data-suffix="%">100%</dd></div>
        <div><dt>Automatic citation-to-source match</dt><dd data-count="97.1" data-decimals="1" data-suffix="%">97.1%</dd></div>
        <div><dt>Mean retrieval latency</dt><dd data-count="339" data-suffix=" ms">339 ms</dd></div>
      </dl>
      <p class="project__caveat">A single baseline run on 7 synthetic documents and 34 fixed questions. These are synthetic-set metrics, not answer accuracy or general-domain performance.</p>
      <p class="project__links">
        <a class="btn btn--small btn--primary" href="https://notellm.au1bhi.com" rel="noopener">Open NoteLLM {% include icon.html name="arrow-up-right" %}</a>
        <a class="btn btn--small" href="https://github.com/au1bhi/NoteLLM" rel="noopener">{% include icon.html name="github" %} Source code</a>
        <a class="btn btn--small" href="https://github.com/au1bhi/NoteLLM/blob/master/docs/evaluation/latest-results.md" rel="noopener">Evaluation report {% include icon.html name="arrow-up-right" %}</a>
      </p>
    </article>
    <a class="service" href="https://judge.au1bhi.com" rel="noopener">
      <span class="service__state"><span class="live-dot" aria-hidden="true"></span>Online</span>
      <span class="service__body">
        <span class="service__title">DOMjudge Online Judge</span>
        <span class="service__text">A containerized DOMjudge environment I maintain for campus training and programming contests.</span>
      </span>
      <span class="service__host">judge.au1bhi.com {% include icon.html name="arrow-up-right" %}</span>
    </a>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Experience</h2>
  <div class="home-section__body">
    <ol class="timeline">
      <li>
        <span class="timeline__date">September 2026 · Gifu, Japan</span>
        <p><strong>Broadcast technical support at the 20th Asian Games Aichi-Nagoya 2026.</strong> I completed a 16-day TOC Operator assignment with <a href="https://www.sinotechxinrui.com/">Sinotech Xinrui (Beijing) Co., Ltd.</a>, supporting football broadcast operations at Gifu Nagaragawa Stadium: pre-match signal checks, live-feed monitoring, and assisting engineers with optical-link troubleshooting.</p>
      </li>
      <li>
        <span class="timeline__date">September 2024 – September 2026</span>
        <p><strong>Contest organizing, problem setting, and team coordination.</strong> Principal organizer and problem setter of the <a href="https://ac.nowcoder.com/acm/contest/112012">ISCPC-AC Cup</a>; helped organize the <a href="https://ac.nowcoder.com/acm/contest/130880">coastal alliance joint contest</a> involving seven partner universities; coordinated the university ICPC/CCPC training team and its participation in eight contests. Details are in the <a href="{{ base_path }}/portfolio/">contest archive</a>.</p>
      </li>
      <li>
        <span class="timeline__date">July – October 2024</span>
        <p><strong>Volunteer problem tester for the <a href="https://www.matiji.net/exam/noi">Matiji NOI-Pre Problem Bank</a>,</strong> a collaboration between Matiji (码蹄集) and China Computer Federation (CCF): created test cases, checked solution correctness through targeted submissions, and reported issues with test data and judge results.</p>
      </li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">About</h2>
  <div class="home-section__body">
    <p class="home-about">I am a Software Engineering undergraduate in a Sino-American dual-degree program jointly operated by Quanzhou University of Information Engineering and Slippery Rock University. My interests include algorithms, software systems, information retrieval, and reliable intelligent systems.</p>
    <ol class="focus-list">
      <li>Algorithms and data structures</li>
      <li>Software and distributed systems</li>
      <li>Information retrieval and retrieval-augmented generation</li>
      <li>Reliable and intelligent information systems</li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">What you’ll find here</h2>
  <div class="home-section__body card-grid">
    <a class="card" href="{{ base_path }}/cv/">
      <span class="card__kicker">CV</span>
      <h3 class="card__title">Complete profile</h3>
      <p class="card__text">A complete bilingual profile covering education, projects, technical experience, awards, and skills.</p>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
    <a class="card" href="{{ base_path }}/portfolio/">
      <span class="card__kicker">Archive</span>
      <h3 class="card__title">Contest archive</h3>
      <p class="card__text">Selected contest materials.</p>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
    <a class="card" href="{{ base_path }}/codeforces/">
      <span class="card__kicker"><span class="live-dot" aria-hidden="true"></span>Live</span>
      <h3 class="card__title">Codeforces dashboard</h3>
      <p class="card__text">A live dashboard built from public contest data.</p>
      <div class="cf-mini" data-cf-mini="Au1Bhi" data-label="Current rating" data-snapshot="{{ '/assets/data/codeforces.json' | relative_url }}?v={{ site.time | date: '%s' }}" hidden>
        <p class="cf-mini__figure"><span class="cf-mini__value" data-cf-rating></span><span class="cf-mini__rank" data-cf-rank></span></p>
        <svg class="cf-mini__spark" viewBox="0 0 240 56" preserveAspectRatio="none" role="img" aria-label="Codeforces rating history"><path class="cf-mini__area" d=""/><path class="cf-mini__line" d=""/></svg>
      </div>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Contact and code</h2>
  <div class="home-section__body">
    <p>For collaboration or questions, write to <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>. Public code is available on <a href="https://github.com/{{ site.author.github }}">GitHub</a>.</p>
  </div>
</section>
