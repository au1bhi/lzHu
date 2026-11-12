---
permalink: /zh/
title: "胡力中"
layout: home
lang: zh
translation: /
eyebrow: "软件工程 · 算法 · 信息检索"
hero_title: "你好，我是胡力中。"
lead: "软件工程本科生，关注算法、后端系统与可验证的检索增强生成。"
excerpt: "胡力中的个人网站：简历、竞赛资料与 Codeforces 数据。"
highlights:
  - value: "2026 亚运会"
    label: "第20届亚洲运动会（爱知·名古屋）现场转播技术支持"
    note: "TOC Operator，足球转播 · 日本岐阜 16 天"
    url: "/zh/cv/#section-1"
  - value: "一等奖"
    label: "第十五届蓝桥杯全国软件和信息技术专业人才大赛"
    note: "福建省赛 Python 程序设计大学 B 组 · 2024"
    url: "https://www.lanqiao.cn/cup-fifteen/"
  - value: "最快解题奖"
    label: "A 题，2026 CCPC 全国邀请赛（福建）暨第十三届 CCPC 福建省赛"
    note: "单题奖项，不代表总排名"
    url: "https://codeforces.com/gym/106565"
  - value: "竞赛组织与命题"
    label: "“国教AC杯”大学生程序设计竞赛主要组织者、出题人"
    note: "为三场比赛出题 · 联合校赛涉及七所合作高校"
    url: "/zh/portfolio/#organizing"
---

{% include base_path %}
{% comment %} Chinese homepage. Facts and wording follow the zh text in cv-latex/variants.json. {% endcomment %}
{% assign cv = site.data.cv_web.zh %}
{% assign notellm = cv.sections[0].entries[0] %}

<section class="home-section" data-reveal>
  <h2 class="home-section__label">在线项目</h2>
  <div class="home-section__body">
    <article class="project">
      <header class="project__head">
        <p class="card__kicker">{{ notellm.meta | join: " · " }} · <a href="https://notellm.au1bhi.com" rel="noopener">notellm.au1bhi.com</a></p>
        <h3 class="project__title">{{ notellm.title }}</h3>
        <p class="project__text">{{ notellm.bullets[0].text }}{{ notellm.bullets[1].text }}{{ notellm.bullets[2].text }}</p>
      </header>
      <dl class="project__metrics">
        <div><dt>来源级 Recall@5</dt><dd data-count="100" data-suffix="%">100%</dd></div>
        <div><dt>自动引用来源匹配率</dt><dd data-count="97.1" data-decimals="1" data-suffix="%">97.1%</dd></div>
        <div><dt>平均检索耗时</dt><dd data-count="339" data-suffix=" ms">339 ms</dd></div>
      </dl>
      <p class="project__caveat">7 份合成资料、34 道固定问题的单次基线测试。结果仅衡量该合成测试集的检索与引用来源匹配，不代表答案准确率或通用场景性能。</p>
      <p class="project__links">
        {% for resource in notellm.resources %}<a class="btn btn--small{% if forloop.first %} btn--primary{% endif %}" href="{{ resource.url }}" rel="noopener">{% if resource.url contains "github.com" and forloop.index == 2 %}{% include icon.html name="github" %} {% endif %}{{ resource.label }}{% unless forloop.index == 2 %} {% include icon.html name="arrow-up-right" %}{% endunless %}</a>{% endfor %}
      </p>
    </article>
    {% assign judge = cv.by_key.domjudge %}
    <a class="service" href="{{ judge.url }}" rel="noopener">
      <span class="service__state"><span class="live-dot" aria-hidden="true"></span>运行中</span>
      <span class="service__body">
        <span class="service__title">{{ judge.title }}</span>
        <span class="service__text">{{ judge.bullets[0].text }}</span>
      </span>
      <span class="service__host">judge.au1bhi.com {% include icon.html name="arrow-up-right" %}</span>
    </a>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">主要经历</h2>
  <div class="home-section__body">
    <ol class="timeline">
      {% assign toc = cv.by_key.toc_full %}{% assign club = cv.by_key.club_full %}{% assign team = cv.by_key.training_full %}{% assign tester = cv.by_key.tester %}
      <li>
        <span class="timeline__date">{{ toc.meta | last }} · 日本岐阜</span>
        <p><strong>第20届亚洲运动会（2026/爱知·名古屋）足球转播现场技术支持。</strong>在<a href="{{ toc.url }}">{{ toc.title }}</a>担任 TOC Operator。{{ toc.bullets[1].text }}{{ toc.bullets[2].text }}{{ toc.bullets[3].text }}</p>
      </li>
      <li>
        <span class="timeline__date">{{ team.meta | last }}</span>
        <p><strong>竞赛组织、命题与集训队协调。</strong>{{ club.bullets[1].text }}{{ club.bullets[0].text }}{{ team.bullets[0].text }}详见<a href="{{ base_path }}/zh/portfolio/">竞赛资料</a>。</p>
      </li>
      <li>
        <span class="timeline__date">{{ tester.meta | last }}</span>
        <p><strong><a href="{{ tester.url }}">{{ tester.title }}</a>志愿者验题成员。</strong>{{ tester.bullets[0].text }}{{ tester.bullets[1].text }}</p>
      </li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">简介</h2>
  <div class="home-section__body">
    <p class="home-about">{{ cv.profile }}</p>
    <ol class="focus-list">
      <li>算法与数据结构</li>
      <li>软件与分布式系统</li>
      <li>信息检索与可验证的检索增强生成</li>
      <li>可靠智能信息系统</li>
    </ol>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">网站内容</h2>
  <div class="home-section__body card-grid">
    <a class="card" href="{{ base_path }}/zh/cv/">
      <span class="card__kicker">简历</span>
      <h3 class="card__title">完整个人介绍</h3>
      <p class="card__text">中英文完整介绍：教育、项目、技术实践、竞赛获奖与技术技能。</p>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
    <a class="card" href="{{ base_path }}/zh/portfolio/">
      <span class="card__kicker">资料</span>
      <h3 class="card__title">竞赛资料</h3>
      <p class="card__text">竞赛获奖、命题与组织、验题记录和部分参考材料。</p>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
    <a class="card" href="{{ base_path }}/zh/codeforces/">
      <span class="card__kicker"><span class="live-dot" aria-hidden="true"></span>实时</span>
      <h3 class="card__title">Codeforces 看板</h3>
      <p class="card__text">基于公开数据的个人竞赛看板。</p>
      <div class="cf-mini" data-cf-mini="Au1Bhi" data-label="{{ site.data.i18n.zh.rating_label }}" data-snapshot="{{ '/assets/data/codeforces.json' | relative_url }}?v={{ site.time | date: '%s' }}" hidden>
        <p class="cf-mini__figure"><span class="cf-mini__value" data-cf-rating></span><span class="cf-mini__rank" data-cf-rank></span></p>
        <svg class="cf-mini__spark" viewBox="0 0 240 56" preserveAspectRatio="none" role="img" aria-label="Codeforces rating 走势"><path class="cf-mini__area" d=""/><path class="cf-mini__line" d=""/></svg>
      </div>
      {% include icon.html name="arrow-up-right" class="card__arrow" %}
    </a>
  </div>
</section>

<section class="home-section" data-reveal>
  <h2 class="home-section__label">联系方式</h2>
  <div class="home-section__body">
    <p>合作或咨询请发邮件至 <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>。公开代码见 <a href="https://github.com/{{ site.author.github }}">GitHub</a>。</p>
  </div>
</section>
