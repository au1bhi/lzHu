---
layout: archive
title: "竞赛资料"
ghost: "竞赛"
permalink: /zh/portfolio/
lang: zh
translation: /portfolio/
classes: cv
toc: true
lead: "竞赛获奖、命题与组织、验题和带队参赛记录，以及部分竞赛参考材料。文件仅作参考，不是学术出版物，也不能替代官方题面或规则。"
---

{% include base_path %}
{% comment %}
  Entries are rendered from _data/cv_web.json (python3 scripts/export_cv_web.py),
  the bilingual registry behind the PDF profiles. Do not write facts here.
{% endcomment %}
{% assign cv = site.data.cv_web.zh %}

<h2 id="awards">{{ cv.headings.awards }}</h2>
<ul>
  {% for award in cv.awards %}<li>{{ award }}</li>{% endfor %}
</ul>

<h2 id="organizing">命题与组织</h2>
<ul>
  {% include cv-web-entry.html item=cv.by_key.club_full %}
  {% include cv-web-entry.html item=cv.by_key.setter %}
</ul>

<h2 id="materials">竞赛参考材料</h2>
{% for post in site.portfolio %}
<div class="archive__files">{{ post.content }}</div>
{% endfor %}

<h2 id="team">集训队与带队参赛</h2>
<ul>
  {% include cv-web-entry.html item=cv.by_key.training_full %}
</ul>

<h2 id="testing">验题</h2>
<ul>
  {% include cv-web-entry.html item=cv.by_key.tester %}
</ul>

<h2 id="tools">评测工具与基础设施</h2>
<ul>
  {% include cv-web-entry.html item=cv.by_key.domjudge %}
  <li><strong>命题与评测平台</strong><br>{{ cv.skill_by_key.contest }}</li>
</ul>

<p>完整经历见<a href="{{ base_path }}/zh/cv/">简历</a>，实时竞赛数据见 <a href="{{ base_path }}/zh/codeforces/">Codeforces 看板</a>。</p>
