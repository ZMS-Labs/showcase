#!/usr/bin/env python3
"""Rebuild the public showcase mastheads. Requires fonttools only."""
# SPDX-License-Identifier: GPL-3.0-only
# Drawing helper adapted from ZMS-Labs/epistemic-skills.
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent
INK, PAPER, ORANGE, MUTED, LINE = '#152c35', '#f5f3ed', '#ffac70', '#b7c8cc', '#68848f'


@lru_cache(maxsize=12)
def face(weight=500, width=100):
    return instantiateVariableFont(TTFont(ROOT / 'fonts/Archivo.ttf'),
                                   {'wght': weight, 'wdth': width}, inplace=True)


class Drawing:
    def __init__(self, width, height, title, description, background=INK):
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
                      f'<title id="title">{escape(title)}</title>',
                      f'<desc id="desc">{escape(description)}</desc>',
                      f'<rect width="{width}" height="{height}" fill="{background}"/>']

    def path(self, d, color=LINE, stroke=2, fill='none', extra=''):
        self.parts.append(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{stroke}" {extra}/>')

    def rect(self, x, y, w, h, fill, rx=0):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>')

    def circle(self, x, y, r, fill, stroke='none', sw=0):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def text(self, text, x, y, size=24, color=PAPER, weight=500, width=100):
        font = face(weight, width)
        glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
        scale = size / font['head'].unitsPerEm
        pen = SVGPathPen(glyphs)
        cursor = 0
        from fontTools.pens.transformPen import TransformPen
        for char in text:
            name = cmap[ord(char)]
            glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, cursor, 0)))
            cursor += font['hmtx'][name][0]
        self.parts.append(f'<path d="{pen.getCommands()}" transform="translate({x} {y}) scale({scale} {-scale})" fill="{color}"/>')
        return cursor * scale

    def save(self, name):
        # newline='\n' keeps the SVGs byte-stable when rebuilt on Windows.
        (ROOT / name).write_text('\n'.join(self.parts) + '\n</svg>\n', encoding='utf-8', newline='\n')


def mastheads():
    d = Drawing(1280, 500, 'ZMS Labs — thoughtful tools, work you can inspect',
                'Independent work in AI-assisted software, reasoning methods, and tools for complex work. Abstract lines connect reasoning, tools, and development; this is conceptual artwork.')
    d.text('ZMS', 62, 174, 162, weight=760, width=93)
    end = d.text('LABS', 65, 286, 108, weight=650, width=93)
    d.rect(65 + end + 21, 265, 20, 20, ORANGE)
    d.text('Thoughtful tools.', 66, 358, 37, weight=580)
    d.text('Work you can inspect.', 66, 403, 29, MUTED)
    # Three areas connect conceptually, without implying a mandatory sequence.
    d.path('M808 125 H896 Q936 125 936 165 V233', LINE, 2)
    d.path('M808 337 H896 Q936 337 936 297 V241', LINE, 2)
    d.path('M750 237 H932', ORANGE, 3)
    d.path('M941 237 H1117', ORANGE, 3)
    d.circle(808, 125, 7, INK, MUTED, 2)
    d.circle(808, 337, 7, INK, MUTED, 2)
    d.circle(750, 237, 10, INK, ORANGE, 3)
    d.circle(936, 237, 10, ORANGE)
    d.circle(1124, 237, 12, ORANGE)
    d.text('Reasoning', 762, 98, 25, PAPER)
    d.text('Tools', 774, 377, 25, PAPER)
    d.text('Development', 1048, 285, 25, PAPER)
    d.path('M66 438 H1214', LINE, 1)
    d.text('Independent exploration / Public work', 66, 466, 18, MUTED)
    d.save('zms-labs.svg')
    m = Drawing(640, 540, 'ZMS Labs — thoughtful tools, work you can inspect',
                'Independent work in AI-assisted software, reasoning methods, and tools for complex work. A compact version of the conceptual masthead; the diagram reduces to connecting dots.')
    m.text('ZMS', 42, 147, 139, weight=760, width=93)
    end = m.text('LABS', 44, 252, 100, weight=650, width=93)
    m.rect(44+end+18, 233, 18, 18, ORANGE)
    m.text('Thoughtful tools.', 44, 323, 37, weight=580)
    m.text('Work you can inspect.', 44, 368, 29, MUTED)
    m.path('M50 435 H209 M50 466 H209 Q238 466 238 437 H555', LINE, 2)
    m.path('M50 435 H555', ORANGE, 2)
    m.circle(50, 435, 7, INK, ORANGE, 2)
    m.circle(238, 435, 7, ORANGE)
    m.circle(555, 435, 9, ORANGE)
    m.text('Independent exploration / Public work', 44, 511, 19, MUTED)
    m.save('zms-labs-mobile.svg')


if __name__ == '__main__':
    mastheads()
    print('Rendered desktop and mobile showcase mastheads.')
