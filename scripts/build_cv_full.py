#!/usr/bin/env python3
"""Generate complete bilingual website profiles with readable multi-page layout."""
import argparse
import json
import shutil
from pathlib import Path

from build_cv_variants import ROOT, CV_DIR, render
from compile_cv import compiled_cv

FULL_DIR = CV_DIR / 'full'
PDF_DIR = ROOT / 'assets' / 'pdf' / 'full'


def render_full(data, language):
    render_data = dict(data, variants={'full': data['full']}, awards=data['full_awards'])
    source = render(render_data, 'full', language)
    source = source.replace('scripts/build_cv_variants.py', 'scripts/build_cv_full.py')
    source = source.replace(r'\documentclass[10pt,a4paper]', r'\documentclass[11pt,a4paper]')
    source = source.replace('margin=0.5in', 'margin=0.7in')
    source = source.replace(r'\pagestyle{empty}', r'\pagestyle{plain}')
    source = source.replace('itemsep=0.5pt,topsep=1pt', 'itemsep=2pt,topsep=3pt')
    source = source.replace('itemsep=0.6pt,topsep=1.2pt', 'itemsep=2pt,topsep=3pt')
    source = source.replace(r'\linespread{1.04}\selectfont', r'\linespread{1.08}\selectfont')
    source = source.replace(r'\usepackage{titlesec}', '\\usepackage{titlesec}\n\\usepackage{needspace}')
    source = source.replace(r'\par\addvspace{2pt}\noindent', r'\par\addvspace{4pt}\Needspace{4\baselineskip}\noindent')
    source = source.replace(r'\par\addvspace{3pt}\noindent', r'\par\addvspace{4pt}\Needspace{4\baselineskip}\noindent')
    source = source.replace(r'\begin{document}', '\\begin{document}\n\\microtypesetup{protrusion=false}\n\\linespread{1.08}\\selectfont')
    # Make section headings start with enough room for the first entry.
    source = source.replace(r'\section{', '\\Needspace{7\\baselineskip}\n\\section{')
    # Keep page topics coherent in the complete reference profile.
    # Application layouts and their one-page limit are unaffected.
    for heading in (['技术实践', '程序设计竞赛与获奖'] if language == 'zh'
                    else ['Technical Experience', r'Competitive Programming \& Awards']):
        marker = '\\Needspace{7\\baselineskip}\n\\section{' + heading + '}'
        source = source.replace(marker, '\\clearpage\n' + marker)
    # Skills and archive headings must stay with their complete first row.
    source = source.replace(r'\skillrow{', '\\Needspace{4\\baselineskip}\n\\skillrow{')
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--compile', action='store_true')
    parser.add_argument('--language', choices=['en', 'zh'])
    args = parser.parse_args()
    data = json.loads((CV_DIR / 'variants.json').read_text())
    FULL_DIR.mkdir(parents=True, exist_ok=True)
    for language in ([args.language] if args.language else ['zh', 'en']):
        stem = f'cv-{language}'
        (FULL_DIR / f'{stem}.tex').write_text(render_full(data, language))
        if args.compile:
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
