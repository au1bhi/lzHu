---
layout: archive
title: "Contest Archive"
permalink: /portfolio/
translation: /zh/portfolio/
classes: cv
toc: true
lead: "Contest awards, problem setting and organizing, team coordination, and selected contest materials. These files are reference materials, not academic publications, and are not substitutes for official contest statements or rules."
---

{% include base_path %}
{% comment %} Entries below are shared with _pages/cv.md through _includes/cv/; edit them there. {% endcomment %}

## Awards

{% include cv/award-ccpc-fujian.md %}

{% include cv/award-icpc-kunming.md %}

{% include cv/award-lanqiao.md %}

## Problem setting & organizing

{% include cv/acm-club.md %}

{% include cv/problem-setting-spring-2025.md %}

## Contest materials

{% for post in site.portfolio %}
<div class="archive__files">{{ post.content }}</div>
{% endfor %}

## Team participation

{% include cv/training-team.md %}

## Problem testing

{% include cv/matiji.md %}

## Judging tools & infrastructure

{% include cv/domjudge.md %}

{% include cv/contest-tools.md %}

See the [CV](/cv/) for the full record, and the live [Codeforces dashboard](/codeforces/) for current contest statistics.
