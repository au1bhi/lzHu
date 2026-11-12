#!/usr/bin/env python3
"""Build the site's Chinese serif webfont from the characters the site uses.

Collects every CJK character found in the site's sources and subsets Noto Serif
CJK SC (Medium for text, Bold for headings) to exactly those characters, so all
visitors see the same Chinese serif at a sturdy weight instead of whatever
their system offers. Characters that are not in the subset fall back to the
system font, so re-run this after adding Chinese text:

    python3 scripts/subset_cjk_font.py            # writes into assets/fonts/

Requires fonttools and brotli, and the Noto Serif CJK font collection files
(Debian/Ubuntu: fonts-noto-cjk-extra). The two output files are written
directly; nothing else is created in the repository.
"""
import argparse
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTCollection

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ['_pages', '_includes', '_layouts', '_data', '_portfolio', 'assets/js', '_config.yml']
SUFFIXES = {'.md', '.html', '.yml', '.yaml', '.json', '.js', ''}
SKIP = {'main.min.js', 'theme.js', 'cv.json', 'ui-text.yml'}
WEIGHTS = {'Medium': 'site-song-medium.woff2', 'Bold': 'site-song-bold.woff2'}
FAMILY = 'Site Song'


def is_cjk(char):
    code = ord(char)
    return (0x4E00 <= code <= 0x9FFF or 0x3400 <= code <= 0x4DBF or 0x3000 <= code <= 0x303F
            or 0xFF00 <= code <= 0xFFEF)


def collect():
    chars = set()
    for source in SOURCES:
        path = ROOT / source
        files = [path] if path.is_file() else [p for p in path.rglob('*') if p.is_file()]
        for file in files:
            if file.suffix not in SUFFIXES or file.name in SKIP:
                continue
            try:
                chars.update(char for char in file.read_text(encoding='utf-8') if is_cjk(char))
            except UnicodeDecodeError:
                continue
    # Punctuation and digits likely to appear in future text.
    chars.update('，。、；：？！（）《》〈〉【】「」『』—…·～％＋－／０１２３４５６７８９年月日')
    # Characters that arrive in live data rather than in the sources (status-page node names).
    chars.update('优选节点线路原生香港日本新加坡美国台湾韩国英国德国')
    return chars


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--fonts', type=Path, default=Path('/usr/share/fonts/opentype/noto'),
                        help='directory containing NotoSerifCJK-Medium.ttc and NotoSerifCJK-Bold.ttc')
    parser.add_argument('--output', type=Path, default=ROOT / 'assets' / 'fonts')
    args = parser.parse_args()

    chars = collect()
    print(f'{len(chars)} Chinese characters and symbols in use')
    for weight, target in WEIGHTS.items():
        collection = TTCollection(args.fonts / f'NotoSerifCJK-{weight}.ttc')
        font = next((f for f in collection.fonts if 'CJK SC' in (f['name'].getDebugName(1) or '')), None)
        if font is None:
            sys.exit(f'No Simplified Chinese face in NotoSerifCJK-{weight}.ttc')
        options = subset.Options()
        options.flavor = 'woff2'
        options.layout_features = []          # plain glyphs only; keeps the files small
        options.name_IDs = [0, 1, 2, 3, 4, 6, 13, 14]
        options.notdef_outline = True
        options.desubroutinize = True
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=[ord(char) for char in chars])
        subsetter.subset(font)
        for record in font['name'].names:
            value = {1: FAMILY, 4: f'{FAMILY} {weight}', 3: f'{FAMILY} {weight} (site subset)',
                     6: f'SiteSong-{weight}'}.get(record.nameID)
            if value:
                record.string = value
        font.flavor = 'woff2'
        font.save(args.output / target)
        print(f'{target}: {(args.output / target).stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
