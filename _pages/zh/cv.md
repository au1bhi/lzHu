---
layout: archive
title: "简历"
permalink: /zh/cv/
lang: zh
translation: /cv/
classes: cv
toc: true
lead: "教育、项目、技术实践、竞赛获奖与技术技能，并提供中英文完整介绍下载。"
---

{% include base_path %}
{% comment %}
  The body below is rendered from _data/cv_web.json (python3 scripts/export_cv_web.py),
  the same bilingual registry as the PDF profiles. Do not write CV facts here.
{% endcomment %}

<h2 id="download">完整介绍下载</h2>

<p>中英文完整介绍覆盖网站中的教育、研究方向、项目、技术实践、竞赛获奖、组织活动、技术技能与竞赛资料链接，按内容自然分页，不限制一页 A4。</p>

<div class="download-grid">
  <a class="download-card" href="{{ base_path }}/assets/pdf/full/Lizhong_Hu_CV_zh.pdf">
    <span class="download-card__badge">PDF</span>
    <span class="download-card__body">
      <span class="download-card__title">中文完整介绍</span>
      <span class="download-card__note">简体中文 · A4 多页</span>
    </span>
    <span class="download-card__icon">{% include icon.html name="download" %}</span>
  </a>
  <a class="download-card" href="{{ base_path }}/assets/pdf/full/Lizhong_Hu_CV_en.pdf">
    <span class="download-card__badge">PDF</span>
    <span class="download-card__body">
      <span class="download-card__title">Complete Profile in English</span>
      <span class="download-card__note">English · Multi-page A4</span>
    </span>
    <span class="download-card__icon">{% include icon.html name="download" %}</span>
  </a>
</div>

{% include cv-web.html lang="zh" order="1,0,2" %}
