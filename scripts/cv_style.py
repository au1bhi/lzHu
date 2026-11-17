"""Shared typography for the generated CVs (complete profiles and application CVs).

Black and white, one serif family for Latin and Chinese as on the website:
Source Serif 4 (small-text optical size, bundled in cv-latex/fonts/) with
Noto Serif CJK SC (Medium for text, Bold for headings). Two weights, no
italics; dates and secondary lines are set in grey rather than italic.
"""
import re
from pathlib import Path

CV_DIR = Path(__file__).resolve().parents[1] / 'cv-latex'

FONT_DIR = CV_DIR / 'fonts'

CONTACTS = [
    ('au1bhi.com', 'https://au1bhi.com'),
    ('admin@au1bhi.com', 'mailto:admin@au1bhi.com'),
    ('GitHub', 'https://github.com/au1bhi'),
    ('Codeforces', 'https://codeforces.com/profile/Au1Bhi'),
    ('LinkedIn', 'https://www.linkedin.com/in/lizhong-hu-686b9b34a'),
]

PREAMBLE = r'''\documentclass[10pt,a4paper]{article}

\usepackage[a4paper,top=%(top)s,bottom=%(bottom)s,left=%(side)s,right=%(side)s,footskip=8mm]{geometry}
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

\definecolor{ink}{HTML}{111111}
\definecolor{inkii}{HTML}{3A3A3A}
\definecolor{inkiii}{HTML}{6A6A6A}
\definecolor{rule}{HTML}{8C8C8C}

% Fonts are found through OPENTYPEFONTS, which scripts/compile_cv.py points
% at cv-latex/fonts/.
\setmainfont{SourceSerif4SmText-Regular.otf}[
  BoldFont=SourceSerif4SmText-Bold.otf,
  Numbers=Lining,
  ItalicFont=SourceSerif4SmText-Regular.otf]
\newfontfamily\namefont{SourceSerif4Subhead-Bold.otf}[Numbers=Lining,BoldFont=SourceSerif4Subhead-Bold.otf]
%(cjkfont)s

\hypersetup{
  colorlinks=true,
  linkcolor=ink,
  urlcolor=ink,
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
\setlist[itemize]{leftmargin=1.05em,labelsep=0.5em,itemsep=%(itemsep)s,topsep=%(topsep)s,parsep=0pt,partopsep=0pt,
  label={\raisebox{0.2em}{\rule{0.28em}{0.28em}}}}

% Section headings: bold, spaced capitals (or spaced Chinese), a grey hairline.
\titleformat{\section}{\fontsize{%(head)s}{%(headbase)s}\selectfont\bfseries}{}{0pt}{%(headfmt)s}
  [{\vspace{1pt}\color{rule}\titlerule[0.4pt]}]
\titlespacing*{\section}{0pt}{%(secbefore)s}{%(secafter)s}
\renewcommand{\arraystretch}{%(arraystretch)s}
\newcolumntype{Y}{>{\raggedright\arraybackslash}X}

% Quiet secondary text in place of italics (the site uses no italics).
\newcommand{\subtle}[1]{\leavevmode{\color{inkii}#1}}

% Entry heading: title in bold, date in grey on the right.
\newlength{\entrydatewidth}
\newcommand{\entry}[2]{%
  \par\addvspace{%(entrygap)s}%(entryneed)s\noindent
  \if\relax\detokenize{#2}\relax
    \textbf{#1}\par
  \else
    \settowidth{\entrydatewidth}{{\small #2}}\addtolength{\entrydatewidth}{1.5pt}%
    \begin{tabularx}{\textwidth}{@{}Y@{\hspace{1.2em}}>{\raggedleft\arraybackslash}p{\entrydatewidth}@{}}
      \textbf{#1} & \leavevmode{\small\color{inkii}#2}
    \end{tabularx}\par
  \fi
  \nobreak\vspace{-0.5pt}
}

%(skillrow)s

%(pagestyle)s
'''

SKILL_TABLE = r'''% Skills as a two-column table: label on the left, details on the right.
\newcommand{\skillrow}[2]{%
  \par\Needspace{2\baselineskip}\noindent
  \begin{tabularx}{\textwidth}{@{}>{\raggedright\arraybackslash}p{%(skillcol)s}@{\hspace{1em}}Y@{}}
    \textbf{#1} & #2
  \end{tabularx}\par\vspace{1pt}
}'''

# One-page CVs run each skill row on from its label to save lines.
SKILL_INLINE = r'''\newcommand{\skillrow}[2]{%
  \par\noindent\hangindent=1em\hangafter=1\textbf{#1%(colon)s}#2\par
}'''

FOOTER = r'''\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\fancyfoot[L]{\small\color{inkiii}%(author)s\enspace\textperiodcentered\enspace %(footer)s}
\fancyfoot[R]{\small\color{inkiii}\thepage\,/\,\pageref*{LastPage}}'''

ZH = {
    'cjk': r'\usepackage[AutoFakeBold=false]{xeCJK}',
    # The SC family name selects Simplified Chinese glyph forms. (The PDF lists
    # the font as "NotoSerifCJKjp" because the collection shares one CFF table.)
    'cjkfont': r'''\setCJKmainfont{Noto Serif CJK SC Medium}[BoldFont={Noto Serif CJK SC Bold}]
\xeCJKsetup{CJKecglue={\hskip 0.2em plus 0.08em minus 0.04em}}
\newcommand{\spaced}[1]{\xeCJKsetup{CJKglue={\hskip 0.14em}}#1}''',
    'headfmt': r'\spaced', 'author': '胡力中',
}
EN = {'cjk': '', 'cjkfont': '', 'author': 'Lizhong Hu',
      'headfmt': r'\addfontfeatures{LetterSpace=8}\MakeUppercase'}

# Complete profiles: generous multi-page reading layout.
FULL = {
    'en': {'size': '10.3', 'baseline': '14', 'small': '9', 'smallbase': '12',
           'head': '10.3', 'headbase': '13', 'skillcol': '0.3\\textwidth'},
    'zh': {'size': '10.3', 'baseline': '16.2', 'small': '8.8', 'smallbase': '13.4',
           'head': '10.8', 'headbase': '14', 'skillcol': '0.17\\textwidth'},
    'common': {'top': '17mm', 'bottom': '19mm', 'side': '19mm', 'itemsep': '1.6pt',
               'topsep': '2.5pt', 'secbefore': '11pt', 'secafter': '5pt',
               'arraystretch': '1.12', 'entrygap': '6pt',
               'entryneed': r'\Needspace{4\baselineskip}',
               'namesize': '25', 'namebase': '29'},
}


def fill(template, values):
    return re.sub(r'%\((\w+)\)s', lambda match: values[match[1]], template)


def preamble(language, layout, title, subject, footer=None):
    values = dict(ZH if language == 'zh' else EN)
    values.update(layout)
    values.update(title=title, subject=subject, footer=footer or '')
    values['pagestyle'] = fill(FOOTER, values) if footer else r'\pagestyle{empty}'
    values['colon'] = '：' if language == 'zh' else ': '
    values['skillrow'] = fill(SKILL_TABLE if 'skillcol' in layout else SKILL_INLINE, values)
    return fill(PREAMBLE, values)


def header(language, layout, focus=None):
    name = '胡力中' if language == 'zh' else 'Lizhong Hu'
    contacts = r'\enspace\textperiodcentered\enspace '.join(
        r'\href{' + url + '}{' + label + '}' for label, url in CONTACTS)
    # The English documents load no CJK font, so only the Chinese one shows both names.
    second = (r'\hspace{0.6em}{\fontsize{13}{16}\selectfont\color{inkiii}Lizhong Hu}'
              if language == 'zh' else '')
    lines = ['{\\namefont\\bfseries\\fontsize{' + layout['namesize'] + '}{' + layout['namebase'] + '}\\selectfont '
             + name + '}' + second + '\\par\n',
             '\\vspace{' + layout.get('contactgap', '5pt') + '}{\\small\\color{inkii}' + contacts + '}\\par\n']
    if focus:
        lines.append('\\vspace{3pt}{\\small\\bfseries ' + focus + '}\\par\n')
    lines.append('\\vspace{' + layout.get('rulegap', '6pt') + '}{\\color{ink}\\rule{\\textwidth}{0.7pt}}\\par\n'
                 '\\vspace{' + layout.get('afterrule', '-4pt') + '}\n')
    return ''.join(lines)


def restyle_body(source, keep_together=True):
    """Adapt the body produced by build_cv_variants.render to this style."""
    source = source.split(r'\begin{document}', 1)[1]
    # Drop the generator's centred header; header() replaces it.
    source = re.sub(r'\\begin\{center\}.*?\\end\{center\}\n\\vspace\{-4pt\}\n', '', source, count=1, flags=re.S)
    source = source.replace(r'\textit{', r'\subtle{')
    source = source.replace(r'{\footnotesize\itshape ', r'\par\vspace{2pt}{\footnotesize\color{inkiii}')
    # Skill labels sit in their own column, so the trailing colon is redundant.
    source = re.sub(r'\\skillrow\{(.*?)[:：]\}', r'\\skillrow{\1}', source)
    if keep_together:
        # An evaluation caveat stays on the same page as the metrics it qualifies.
        source = re.sub(r'(\n  \\item (?:(?!\n  \\item ).)*\n\\end\{itemize\}\n\{\\small (?!\\href))',
                        lambda match: '\n\\Needspace{9\\baselineskip}' + match[1], source)
        # Headings keep their first lines with them.
        source = source.replace(r'\section{', '\\Needspace{6\\baselineskip}\n\\section{')
    return source


def document(preamble_text, header_text, body_text, generator):
    setup = '\\setlength{\\emergencystretch}{1em}\n'
    body_text = body_text.replace(setup, setup + header_text, 1)
    return (f'% Generated by {generator} from cv-latex/variants.json.\n'
            '% Edit the bilingual content source, then regenerate.\n'
            + preamble_text + '\n\\begin{document}' + body_text)
