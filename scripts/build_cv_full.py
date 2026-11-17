#!/usr/bin/env python3
"""Generate complete bilingual website profiles with readable multi-page layout.

The complete profiles share their content (and the body renderer) with the
application CVs, but use their own typography so they read like the website:
one serif family for Latin and Chinese, warm ink, a restrained teal accent for
headings and links, and a brass detail colour for dates and small marks.
Application layouts and their one-page limit are unaffected.
"""
import argparse
import json
import re
import shutil
from pathlib import Path

from build_cv_variants import ROOT, CV_DIR, render
from compile_cv import compiled_cv

FULL_DIR = CV_DIR / 'full'
PDF_DIR = ROOT / 'assets' / 'pdf' / 'full'

# The order a first-time reader cares about: the Asian Games assignment and
# other experience lead, as on the website CV.
SECTION_ORDER = ['Technical Experience', 'Projects', 'Leadership & Activities']

PREAMBLE = r'''\documentclass[10pt,a4paper]{article}

\usepackage[a4paper,top=17mm,bottom=19mm,left=19mm,right=19mm,footskip=9mm]{geometry}
\usepackage{fontspec}
%(cjk)s
\usepackage{xcolor}
\usepackage[protrusion=true]{microtype}
\usepackage{ragged2e}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{tabularx}
\usepackage{array}
\usepackage{needspace}
\usepackage{fancyhdr}
\usepackage{lastpage}
\usepackage{hyperref}

% Colours follow the website's light theme.
\definecolor{ink}{HTML}{171614}
\definecolor{inkii}{HTML}{3F3C37}
\definecolor{inkiii}{HTML}{6B675F}
\definecolor{rule}{HTML}{D0CBBE}
\definecolor{accent}{HTML}{0F665B}
\definecolor{brass}{HTML}{8A6A3B}

\setmainfont{TeX Gyre Pagella}[Numbers=Lining]
%(cjkfont)s

\hypersetup{
  colorlinks=true,
  linkcolor=ink,
  urlcolor=accent,
  pdftitle={%(title)s},
  pdfauthor={%(author)s},
  pdfsubject={%(subject)s},
  pdfcreator={XeLaTeX}
}

\renewcommand{\normalsize}{\fontsize{%(size)s}{%(baseline)s}\selectfont}
\renewcommand{\small}{\fontsize{%(small)s}{%(smallbase)s}\selectfont}
\renewcommand{\footnotesize}{\fontsize{%(small)s}{%(smallbase)s}\selectfont}
\normalsize
\AtBeginDocument{\color{ink}}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\setlist[itemize]{leftmargin=1.1em,labelsep=0.5em,itemsep=1.6pt,topsep=2.5pt,parsep=0pt,partopsep=0pt,
  label={\raisebox{0.18em}{\color{brass}\rule{0.32em}{0.32em}}}}

% Section headings: accent colour, spaced capitals (or spaced Chinese), hairline.
\titleformat{\section}{\fontsize{%(head)s}{%(headbase)s}\selectfont\bfseries\color{accent}}{}{0pt}{%(headfmt)s}
  [{\vspace{1.5pt}\color{rule}\titlerule[0.5pt]}]
\titlespacing*{\section}{0pt}{11pt}{5pt}
\renewcommand{\arraystretch}{1.12}
\newcolumntype{Y}{>{\raggedright\arraybackslash}X}

% Quiet secondary text in place of italics (the site uses no italics).
\newcommand{\subtle}[1]{\leavevmode{\color{inkii}#1}}

% Entry heading: title in bold, date in brass on the right.
\newlength{\entrydatewidth}
\newcommand{\entry}[2]{%
  \par\addvspace{6pt}\Needspace{4\baselineskip}\noindent
  \if\relax\detokenize{#2}\relax
    {\hypersetup{urlcolor=ink}\textbf{#1}}\par
  \else
    \settowidth{\entrydatewidth}{{\small #2}}%
    \begin{tabularx}{\textwidth}{@{}Y@{\hspace{1.2em}}>{\raggedleft\arraybackslash}p{\entrydatewidth}@{}}
      {\hypersetup{urlcolor=ink}\textbf{#1}} & \leavevmode{\small\color{brass}#2}
    \end{tabularx}\par
  \fi
  \nobreak\vspace{-0.5pt}
}

% Skills as a two-column table: label on the left, details on the right.
\newcommand{\skillrow}[2]{%
  \par\Needspace{2\baselineskip}\noindent
  \begin{tabularx}{\textwidth}{@{}>{\raggedright\arraybackslash}p{%(skillcol)s}@{\hspace{1em}}Y@{}}
    \textbf{#1} & #2
  \end{tabularx}\par\vspace{1pt}
}

% Footer: name and page count in quiet ink.
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\fancyfoot[L]{\small\color{inkiii}%(author)s\enspace\textperiodcentered\enspace %(footer)s}
\fancyfoot[R]{\small\color{inkiii}\thepage\,/\,\pageref*{LastPage}}
'''

ZH_CJK = r'\usepackage[AutoFakeBold=false]{xeCJK}'
# The SC family name selects Simplified Chinese glyph forms. (The PDF lists
# the font as "NotoSerifCJKjp" because the collection shares one CFF table.)
ZH_CJK_FONT = r'''\setCJKmainfont{Noto Serif CJK SC}[BoldFont={Noto Serif CJK SC Bold}]
\xeCJKsetup{CJKecglue={\hskip 0.2em plus 0.08em minus 0.04em}}'''

LANG = {
    'en': {'cjk': '', 'cjkfont': '', 'title': 'Lizhong Hu - Complete Profile',
           'author': 'Lizhong Hu', 'subject': 'Complete profile', 'footer': 'Complete Profile',
           'size': '10.4', 'baseline': '14', 'small': '9', 'smallbase': '12',
           'head': '10.4', 'headbase': '13', 'headfmt': r'\addfontfeatures{LetterSpace=9}\MakeUppercase',
           'skillcol': '0.3\\textwidth'},
    'zh': {'cjk': ZH_CJK, 'cjkfont': ZH_CJK_FONT, 'title': '胡力中 - 完整介绍',
           'author': '胡力中', 'subject': '完整介绍', 'footer': '完整介绍',
           'size': '10.4', 'baseline': '16.4', 'small': '9', 'smallbase': '13.6',
           'head': '11', 'headbase': '14', 'headfmt': r'\spaced',
           'skillcol': '0.17\\textwidth'},
}

CONTACTS = [
    ('au1bhi.com', 'https://au1bhi.com'),
    ('admin@au1bhi.com', 'mailto:admin@au1bhi.com'),
    ('GitHub', 'https://github.com/au1bhi'),
    ('Codeforces', 'https://codeforces.com/profile/Au1Bhi'),
    ('LinkedIn', 'https://www.linkedin.com/in/lizhong-hu-686b9b34a'),
]


def header(language):
    name = '胡力中' if language == 'zh' else 'Lizhong Hu'
    other = 'Lizhong Hu' if language == 'zh' else '胡力中'
    contacts = r'\enspace{\color{brass}\textperiodcentered}\enspace '.join(
        r'\href{' + url + '}{' + label + '}' for label, url in CONTACTS)
    # The English profile has no CJK font loaded, so it omits the Chinese name.
    second = (r'\hspace{0.6em}{\fontsize{13}{16}\selectfont\color{inkiii}' + other + '}'
              if language == 'zh' else '')
    return ('{\\fontsize{25}{29}\\selectfont\\bfseries ' + name + '}' + second + '\\par\n'
            '\\vspace{5pt}{\\small\\color{inkii}' + contacts + '}\\par\n'
            '\\vspace{6pt}{\\color{brass}\\rule{2.2em}{0.8pt}}\\par\n\\vspace{-2pt}\n')


def body(data, language):
    full = dict(data['full'])
    order = {title: index for index, title in enumerate(SECTION_ORDER)}
    full['sections'] = sorted(full['sections'], key=lambda s: order.get(s['title']['en'], len(order)))
    render_data = dict(data, variants={'full': full}, awards=data['full_awards'])
    source = render(render_data, 'full', language)
    source = source.split(r'\begin{document}', 1)[1]
    # Replace the application-style centred header.
    source = re.sub(r'\\begin\{center\}.*?\\end\{center\}\n\\vspace\{-4pt\}\n', '', source, count=1, flags=re.S)
    source = source.replace(r'\textit{', r'\subtle{')
    source = source.replace(r'{\footnotesize\itshape ', r'\par\vspace{2pt}{\footnotesize\color{inkiii}')
    # Skill labels sit in their own column, so the trailing colon is redundant.
    source = re.sub(r'\\skillrow\{(.*?)[:：]\}', r'\\skillrow{\1}', source)
    # An evaluation caveat stays on the same page as the metrics it qualifies.
    source = re.sub(r'(\n  \\item (?:(?!\n  \\item ).)*\n\\end\{itemize\}\n\{\\small (?!\\href))',
                    lambda match: '\n\\Needspace{9\\baselineskip}' + match[1], source)
    # Headings keep their first lines with them.
    source = source.replace(r'\section{', '\\Needspace{6\\baselineskip}\n\\section{')
    return source


def render_full(data, language):
    values = dict(LANG[language])
    preamble = re.sub(r'%\((\w+)\)s', lambda match: values[match[1]], PREAMBLE)
    if language == 'zh':
        preamble += r'''
% Spaced section titles in Chinese.
\newcommand{\spaced}[1]{\xeCJKsetup{CJKglue={\hskip 0.14em}}#1}
'''
    document = body(data, language)
    setup = '\\setlength{\\emergencystretch}{1em}\n'
    document = document.replace(setup, setup + header(language), 1)
    return ('% Generated by scripts/build_cv_full.py from cv-latex/variants.json.\n'
            '% Edit the bilingual content source, then regenerate.\n'
            + preamble + '\n\\begin{document}' + document)


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
                shutil.copyfile(pdf, args.preview / f'{stem}.pdf')
            print(f'Previewed {args.preview / (stem + ".pdf")}', flush=True)
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
