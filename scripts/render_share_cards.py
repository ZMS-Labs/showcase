"""Render the 1200x630 link-preview cards in docs/assets/og/ from HTML.

The cards use the site's own stylesheet and font, so they match the pages. Each card is written as a
temporary HTML file inside docs/, served on loopback for the moment it is captured, then removed.
After rendering, update the matching entries in docs/assets/manifest.json and run
scripts/site_manifest.py --write. Needs Python's playwright package and its Chromium browser.
"""
import pathlib, shutil, argparse
parser = argparse.ArgumentParser()
parser.add_argument("--only", nargs="+", help="Render only the named cards")
args = parser.parse_args()
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright
DOCS = pathlib.Path(__file__).resolve().parents[1] / 'docs'; TMP = DOCS / 'og-src-tmp'; OUT = DOCS / 'assets/og'
TILES = '<div class="tiles" data-state="live" style="max-width:none;gap:10px">' + ''.join('<span></span>' for _ in range(28)) + '</div>'

def frame(inner, bg='night'):
    return ('<!DOCTYPE html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../site.css"><style>'
            'html,body{margin:0;width:1200px;height:630px;overflow:hidden}'
            '.card{width:1200px;height:630px;position:relative;overflow:hidden;box-sizing:border-box}'
            '.card.night{background:#0e1b21;color:#f1efe8}.card.paper{background:#f6f5f1;color:#121212}'
            '.left{position:absolute;left:64px;top:60px;bottom:56px;width:560px;display:flex;flex-direction:column}'
            '.name{font-size:84px;font-weight:680;font-stretch:80%;letter-spacing:-.04em;line-height:.92;margin-top:18px}'
            '.line{font-size:29px;line-height:1.28;letter-spacing:-.012em;margin-top:24px;max-width:22ch}'
            '.foot{margin-top:auto;display:flex;flex-direction:column;align-items:flex-start;gap:12px;font-size:18px;color:#b4c2c5}'
            '.foot .label{font-size:14px}'
            '.right{position:absolute;left:676px;top:76px;width:620px;bottom:-40px}'
            '.right img{width:100%;height:100%;object-fit:cover;object-position:top left;border-radius:10px;border:1px solid #2c4149}'
            '</style></head><body><div class="card ' + bg + '">' + inner + '</div></body></html>')

def project(name, line, label, right):
    return frame('<div class="left"><span class="kicker" style="margin:0;color:#ffac70">ZMS Labs · Independent work</span>'
                 '<div class="name">' + name + '</div><div class="line">' + line + '</div>'
                 '<div class="foot"><span class="label">' + label + '</span><span>Zach Stern · sternone.net</span></div></div>'
                 '<div class="right">' + right + '</div>')

def img(p):
    return '<img src="../assets/' + p + '" alt="">'

def box(title, sub, accent=False):
    border = '1.5px solid #ffac70' if accent else '1px solid #2c4149'
    return ('<div style="border:' + border + ';border-radius:8px;padding:16px 18px"><b style="font-size:25px">' + title +
            '</b><div style="font-size:17px;color:#b4c2c5">' + sub + '</div></div>')

stat = lambda big, small, first=False: (
    '<div style="padding:16px ' + ('20px 0 0' if first else '20px 0 20px') + ';' + ('' if first else 'border-left:1px solid #d6d4cb;') + '">'
    '<b style="font-size:34px;font-stretch:72%;font-weight:680;letter-spacing:-.03em">' + big + '</b>'
    '<div style="font-size:17px;color:#62615b;margin-top:4px">' + small + '</div></div>')

default = ('<div style="position:absolute;inset:64px 64px 56px;display:flex;flex-direction:column">'
           '<span class="kicker" style="margin:0">Commercial counsel and legal operations</span>'
           '<div style="font-size:176px;font-weight:680;font-stretch:80%;letter-spacing:-.045em;line-height:.86;margin-top:22px;margin-left:-6px">Zach Stern</div>'
           '<div style="font-size:32px;line-height:1.3;letter-spacing:-.012em;margin-top:30px;max-width:34ch;color:#2c2c29">'
           'Building at ZMS Labs.</div>'
           '<div style="margin-top:auto;display:grid;grid-template-columns:repeat(3,1fr);border-top:1.5px solid #121212">'
           + stat('Nearly 10 years', 'In-house at Dovenmuehle', True)
           + stat('7 years', 'Attorney at Tishler &amp; Wald')
           + stat('sternone.net', 'Experience and independent work')
           + '</div></div>')

panel = lambda inner: '<div class="graphic-panel" style="width:460px;height:470px;border-radius:10px;padding:34px;display:flex;flex-direction:column;gap:18px">' + inner + '</div>'

cards = {
    'og-default': frame(default, bg='paper'),
    'og-savebench': project('SaveBench', 'Can an AI design a factory that actually runs?', 'Sample data', img('savebench/savebench-workspace.png')),
    'og-interleaf': project('Interleaf', 'A contract workstation that keeps the question next to the words.', 'Archived prototype, made-up content', img('interleaf/matter-map.png')),
    'og-epistemic-skills': project('Epistemic Skills', 'Teaching AI agents to check their own work.', 'Recorded check',
        panel('<span class="kicker" style="margin:0">First publication of this showcase · September 19, 2026</span>' + TILES +
              '<div class="tiles-caption" style="max-width:none;margin-top:6px"><span><b>14 of 28</b>didn&#39;t match before the fix</span><span><b>28 of 28</b>matched after</span></div>')),

}

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

TMP.mkdir(exist_ok=True)
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(DOCS)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/og-src-tmp/'
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
        for name, html in cards.items():
            if args.only and name not in args.only: continue
            (TMP / (name + '.html')).write_text(html, encoding='utf-8')
            pg.goto(base + name + '.html', wait_until='networkidle')
            pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(150)
            pg.screenshot(path=str(OUT / (name + '.png')), clip={'x': 0, 'y': 0, 'width': 1200, 'height': 630})
            print('wrote', name)
        b.close()
finally:
    server.shutdown(); server.server_close(); shutil.rmtree(TMP, ignore_errors=True)
