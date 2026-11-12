#!/usr/bin/env python3
"""Export the complete bilingual profile for the website.

Reads cv-latex/variants.json (the same registry that produces the PDF
profiles) and writes _data/cv_web.json, which _includes/cv-web.html renders.
The Chinese CV page (/zh/cv/) is built from this file, so the Chinese web
page and the Chinese PDF share one source.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'cv-latex' / 'variants.json'
TARGET = ROOT / '_data' / 'cv_web.json'

# Mirrors education() in build_cv_variants.py, which holds it as LaTeX.
EDUCATION = {
    'zh': {
        'period': '2023–2027（预计）',
        'schools': [
            {'name': '泉州信息工程学院', 'degree': '软件工程（中外合作办学）', 'gpa': 'GPA: 3.10/4.00'},
            {'name': '美国宾州滑石大学（Slippery Rock University）',
             'degree': '信息系统（Information Systems），理学学士（在读，预计 2027）', 'gpa': 'GPA: 3.583/4.000'},
        ],
        'note': '中美 4+0 双学位联合培养本科项目，全程在中国完成培养，经中华人民共和国教育部正式批准认可。',
    },
    'en': {
        'period': '2023–2027 (expected)',
        'schools': [
            {'name': 'Quanzhou University of Information Engineering',
             'degree': 'Software Engineering (Sino-foreign Cooperation)', 'gpa': 'GPA: 3.10/4.00'},
            {'name': 'Slippery Rock University',
             'degree': 'Information Systems, BS (in progress; expected 2027)', 'gpa': 'GPA: 3.583/4.000'},
        ],
        'note': 'Sino-American 4+0 dual-degree program conducted in China; approved by the Ministry of Education of China.',
    },
}
HEADINGS = {
    'zh': {'profile': '个人简介', 'education': '教育经历', 'interests': '研究方向与兴趣',
           'awards': '程序设计竞赛与获奖', 'skills': '技术技能'},
    'en': {'profile': 'Profile', 'education': 'Education', 'interests': 'Research Interests',
           'awards': 'Competitive Programming & Awards', 'skills': 'Technical Skills'},
}
SEPARATORS = {'zh': '｜', 'en': ' | '}
# Links to the running services, shown on the website only. They are added
# here rather than in variants.json so the PDF layouts are not affected.
WEB_LINKS = {
    'notellm-full': {'resource': {'zh': ['在线访问', 'https://notellm.au1bhi.com'],
                                  'en': ['Live site', 'https://notellm.au1bhi.com']}},
    'domjudge': {'url': 'https://judge.au1bhi.com'},
}


def with_web_links(key, item):
    extra = WEB_LINKS.get(key)
    if not extra:
        return item
    item = dict(item)
    if 'url' in extra and 'url' not in item:
        item['url'] = extra['url']
    if 'resource' in extra:
        item['resources'] = [extra['resource']] + list(item.get('resources', []))
    return item


def entry(item, language):
    separator = SEPARATORS[language]
    title, *roles = item['title'][language].split(separator)
    meta = roles + (item['subtitle'][language].split(separator) if 'subtitle' in item else [])
    if item['date'][language]:
        meta.append(item['date'][language])
    result = {
        'title': title.strip(),
        'meta': [part.strip() for part in meta if part.strip()],
        'bullets': [{'label': bullet.get('label', {}).get(language, ''), 'text': bullet[language]}
                    for bullet in item['bullets']],
    }
    if 'url' in item:
        result['url'] = item['url'].replace('https://au1bhi.com', '')
    if 'note' in item:
        result['note'] = item['note'][language]
    if 'event_groups' in item:
        result['event_intro'] = item['event_intro'][language]
        result['event_groups'] = [{'year': group['year'], 'text': group[language]} for group in item['event_groups']]
    if 'resources' in item:
        result['resources'] = [{'label': resource[language][0], 'url': resource[language][1]}
                               for resource in item['resources']]
    return result


def profile(data, language):
    full = data['full']
    sections = [{'title': section['title'][language],
                 'entries': [entry(with_web_links(key, data['entries'][key]), language) for key in section['entries']]}
                for section in full['sections']]
    return {
        'headings': HEADINGS[language],
        'profile': full['profile'][language],
        'interests': full['interests'][language],
        'education': EDUCATION[language],
        'sections': sections,
        'awards': [award[language] for award in data['full_awards']],
        'skills': [{'label': data['skills'][key][language][0].rstrip('：:'), 'text': data['skills'][key][language][1]}
                   for key in full['skills']],
        'resources': {'title': full['resources']['title'][language],
                      'entries': [entry(data['entries'][key], language) for key in full['resources']['entries']]},
        # The same entries and skill rows by registry key, for pages that pick individual items.
        'by_key': {key.replace('-', '_'): entry(with_web_links(key, data['entries'][key]), language)
                   for section in full['sections'] for key in section['entries']},
        'skill_by_key': {key.replace('-', '_'): data['skills'][key][language][1] for key in full['skills']},
    }


def main():
    data = json.loads(SOURCE.read_text(encoding='utf-8'))
    output = {language: profile(data, language) for language in ('zh', 'en')}
    TARGET.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {TARGET.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
