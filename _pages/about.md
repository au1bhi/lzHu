---
permalink: /
title: ""
layout: home
translation: /zh/
eyebrow: "Software Engineering · Algorithms · Information Retrieval"
hero_title: "Hi, I’m Lizhong Hu."
lead: "Software Engineering undergraduate working on algorithms, back-end systems, and verifiable retrieval-augmented generation."
highlights:
  - value: "Honorable Medal"
    label: "The 2024 ICPC Asia Kunming Regional Contest"
    note: "Representing Quanzhou University of Information Engineering"
    url: "https://icpc.pku.edu.cn/docs/20241102162338084775.pdf"
  - value: "First Prize"
    label: "15th Lanqiao Cup, Fujian Provincial Round"
    note: "Python Programming, University Group B · 2024"
    url: "https://www.lanqiao.cn/cup-fifteen/"
  - value: "First to Solve"
    label: "Problem A, 2026 National Invitational of CCPC (Fujian)"
    note: "A problem-level distinction, not an overall placement"
    url: "https://codeforces.com/gym/106565"
  - value: "16 days"
    label: "TOC Operator, 20th Asian Games Aichi-Nagoya 2026"
    note: "Football broadcast technical support in Gifu, Japan"
    url: "/cv/#technical-experience"
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<section class="home-section" data-reveal>
  <h2 class="home-section__label">About</h2>
  <div class="home-section__body">
    <p class="home-about">I am a Software Engineering undergraduate in a Sino-American dual-degree program jointly operated by Quanzhou University of Information Engineering and Slippery Rock University. My interests include algorithms, software systems, information retrieval, and reliable intelligent systems.</p>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Focus</h2>
  <div class="home-section__body">
    <ol class="focus-list">
      <li>Algorithms and data structures</li>
      <li>Software and distributed systems</li>
      <li>Information retrieval and retrieval-augmented generation</li>
      <li>Reliable and intelligent information systems</li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Featured project</h2>
  <div class="home-section__body">
    <article class="project">
      <header class="project__head">
        <p class="card__kicker">Undergraduate thesis · Ongoing</p>
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
        <a class="btn btn--small" href="https://github.com/au1bhi/NoteLLM" rel="noopener">{% include icon.html name="github" %} Source code</a>
        <a class="btn btn--small" href="https://github.com/au1bhi/NoteLLM/blob/master/docs/evaluation/latest-results.md" rel="noopener">Evaluation report {% include icon.html name="arrow-up-right" %}</a>
      </p>
    </article>
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
  <h2 class="home-section__label">Recent highlights</h2>
  <div class="home-section__body">
    <ol class="timeline">
      <li>
        <span class="timeline__date">September 2026</span>
        <p>I completed a 16-day TOC Operator assignment with <a href="https://www.sinotechxinrui.com/">Sinotech Xinrui (Beijing) Co., Ltd.</a>, supporting football broadcast operations at the 20th Asian Games Aichi-Nagoya 2026. At Gifu Nagaragawa Stadium, I carried out pre-match signal checks, monitored live feeds, and assisted engineers with optical-link troubleshooting. See my <a href="{{ base_path }}/cv/">CV</a> for details.</p>
      </li>
      <li>
        <span class="timeline__date">2026</span>
        <p>At the <a href="https://codeforces.com/gym/106565">2026 National Invitational of CCPC (Fujian), The 13th Fujian Collegiate Programming Contest</a>, I recorded the contest’s first accepted solution to Problem A.</p>
      </li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">Contact and code</h2>
  <div class="home-section__body">
    <p>For collaboration or questions, write to <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>. Public code is available on <a href="https://github.com/{{ site.author.github }}">GitHub</a>.</p>
  </div>
</section>
