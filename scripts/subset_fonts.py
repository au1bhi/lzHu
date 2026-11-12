"""Subset the self-hosted variable fonts to Latin and rename them.

The upstream OFL fonts reserve the name "Source", so the reduced files carry
the neutral family names used in the site's CSS ("Site Serif" etc.).
"""
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = Path(sys.argv[1]); OUT = Path(sys.argv[2])
UNICODES = ('U+0020-007E,U+00A0-017F,U+02C6,U+02DA,U+02DC,U+2010-2015,U+2018-201E,U+2020-2022,'
            'U+2026,U+2030,U+2032,U+2033,U+2039,U+203A,U+2044,U+20AC,U+2122,U+2190-2193,U+2196-2199,'
            'U+2212,U+2215,U+2248,U+2260,U+2264,U+2265,U+00D7,U+00F7')
JOBS = {
    'source-serif-4-roman.woff2': ('site-serif-roman.woff2', 'Site Serif'),
    'source-code-pro-roman.woff2': ('site-mono-roman.woff2', 'Site Mono'),
}
for source, (target, family) in JOBS.items():
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = ['*']
    options.notdef_outline = True
    options.unicodes = subset.parse_unicodes(UNICODES)
    font = TTFont(SRC / source)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=options.unicodes)
    subsetter.subset(font)
    if 'fvar' in font:
        from fontTools.varLib import instancer
        low = {a.axisTag: a.minValue for a in font['fvar'].axes}['wght']
        font = instancer.instantiateVariableFont(font, {'wght': (max(low, 300), 700)})
    italic = 'italic' in source
    for record in list(font['name'].names):
        text = record.toUnicode()
        if record.nameID in (1, 16, 4, 3, 6, 21, 25):
            style = 'Italic' if italic else 'Regular'
            value = {1: family, 16: family, 4: f'{family} {style}', 3: f'{family} {style} (Latin subset)',
                     6: f'{family}-{style}'.replace(' ', ''), 21: family, 25: family.replace(' ', '')}[record.nameID]
            record.string = value
        elif 'Source' in text and record.nameID not in (0, 7, 13, 14):
            record.string = text.replace('Source Serif 4', family).replace('Source Sans 3', family).replace('Source Code Pro', family)
    font.flavor = 'woff2'
    font.save(OUT / target)
    axes = [a.axisTag for a in font['fvar'].axes] if 'fvar' in font else []
    print(f'{target}: {(SRC/source).stat().st_size//1024} KB -> {(OUT/target).stat().st_size//1024} KB, glyphs {len(font.getGlyphOrder())}, axes {axes}')
