#!/usr/bin/env python3
"""Generate complete bilingual website profiles with readable multi-page layout.

The complete profiles share their content (and the body renderer) with the
application CVs and the typography in scripts/cv_style.py; this script adds
the multi-page layout: larger type, footer page numbers, and headings and
entries kept together across page breaks.
"""
import argparse
import json
import shutil
from pathlib import Path

from build_cv_variants import ROOT, CV_DIR, render
from compile_cv import compiled_cv
import cv_style

FULL_DIR = CV_DIR / 'full'
PDF_DIR = ROOT / 'assets' / 'pdf' / 'full'

# The order a first-time reader cares about: the Asian Games assignment and
# other experience lead, as on the website CV.
SECTION_ORDER = ['Technical Experience', 'Projects', 'Leadership & Activities']

TEXT = {
    'en': {'title': 'Lizhong Hu - Complete Profile', 'subject': 'Complete profile', 'footer': 'Complete Profile'},
    'zh': {'title': '胡力中 - 完整介绍', 'subject': '完整介绍', 'footer': '完整介绍'},
}


def render_full(data, language):
    full = dict(data['full'])
    order = {title: index for index, title in enumerate(SECTION_ORDER)}
    full['sections'] = sorted(full['sections'], key=lambda s: order.get(s['title']['en'], len(order)))
    render_data = dict(data, variants={'full': full}, awards=data['full_awards'])
    layout = dict(cv_style.FULL['common'], **cv_style.FULL[language])
    text = TEXT[language]
    return cv_style.document(
        cv_style.preamble(language, layout, text['title'], text['subject'], footer=text['footer']),
        cv_style.header(language, layout),
        cv_style.restyle_body(render(render_data, 'full', language)),
        'scripts/build_cv_full.py')


def main():
    parser = argparse.ArgumentParser(description=__doc__.split('\n', 1)[0])
    parser.add_argument('--compile', action='store_true')
    parser.add_argument('--language', choices=['en', 'zh'])
    parser.add_argument('--preview', type=Path,
                        help='Compile into this native directory instead of publishing to assets/pdf')
    args = parser.parse_args()
    data = json.loads((CV_DIR / 'variants.json').read_text())
    FULL_DIR.mkdir(parents=True, exist_ok=True)
    for language in ([args.language] if args.language else ['zh', 'en']):
        stem = f'cv-{language}'
        (FULL_DIR / f'{stem}.tex').write_text(render_full(data, language))
        if args.preview:
            with compiled_cv(FULL_DIR / f'{stem}.tex', language) as pdf:
                args.preview.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(pdf, args.preview / f'full-{stem}.pdf')
            print(f'Previewed {args.preview / ("full-" + stem + ".pdf")}', flush=True)
        elif args.compile:
            with compiled_cv(FULL_DIR / f'{stem}.tex', language) as pdf:
                PDF_DIR.mkdir(parents=True, exist_ok=True)
                target = PDF_DIR / f'Lizhong_Hu_CV_{language}.pdf'
                shutil.copyfile(pdf, target)
            # Existing public URLs remain aliases of the complete profiles.
            aliases = ['Lizhong_Hu_CV.pdf'] if language == 'en' else ['Lizhong_Hu_CV_zh.pdf', '胡力中_简历.pdf']
            for alias in aliases:
                shutil.copyfile(target, PDF_DIR.parent / alias)
            print(f'Built {target.relative_to(ROOT)}', flush=True)
        else:
            print(f'Generated {(FULL_DIR / (stem + ".tex")).relative_to(ROOT)}')


if __name__ == '__main__':
    main()
