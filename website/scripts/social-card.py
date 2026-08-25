# -*- coding: utf-8 -*-
"""Regenerate static/img/social-card.png (1200x630).

    python website/scripts/social-card.py

Needs Pillow, and downloads Poppins from Google Fonts into a temp directory
on each run - nothing is cached in the repo. Everything else comes from the
site's own tokens in src/css/tokens.css, so the card and the site cannot
drift apart by accident:

    --cw-ink        #0b0d0d      the ground
    --cw-fg         #f4f4f4      headline
    --cw-acc        #81ccc2      the teal
    --cw-grid-line  rgba(129,204,194,.045) at --cw-grid-size 34px

Change HEADLINE below and re-run. If you change the canvas size, update the
og:image:width / og:image:height tags in docusaurus.config.ts to match.
"""
import os
import sys
import tempfile
import urllib.request

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit('Pillow is required:  pip install Pillow')

HEADLINE = 'How to implement Apex Enterprise Patterns to scale your Salesforce org'
WORDMARK = 'APEX ENTERPRISE PATTERNS'
URL = 'APEX-ENTERPRISE-PATTERNS.DEV'

W, H = 1200, 630
INK = (11, 13, 13)
FG = (244, 244, 244)
ACC = (129, 204, 194)
MUTED = (172, 176, 175)
GRID_SIZE = 34
LEFT = 96

FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-%s.ttf'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'static', 'img', 'social-card.png')


def poppins(weight, size, cache={}):
    if weight not in cache:
        path = os.path.join(tempfile.gettempdir(), 'Poppins-%s.ttf' % weight)
        if not os.path.exists(path):
            urllib.request.urlretrieve(FONT_URL % weight, path)
        cache[weight] = path
    return ImageFont.truetype(cache[weight], size)


def over(rgb, alpha, ground):
    return tuple(int(round(alpha * c + (1 - alpha) * g)) for c, g in zip(rgb, ground))


img = Image.new('RGB', (W, H), INK)
d = ImageDraw.Draw(img)

# ── the blueprint ground ────────────────────────────────────────────
grid = over(ACC, 0.045, INK)
for x in range(0, W, GRID_SIZE):
    d.line([(x, 0), (x, H)], fill=grid, width=1)
for y in range(0, H, GRID_SIZE):
    d.line([(0, y), (W, y)], fill=grid, width=1)

# ── registration ticks, the motif from .cw-tick ─────────────────────
INSET, ARM = 46, 30
for cx, cy, dx, dy in ((INSET, INSET, 1, 1), (W - INSET, INSET, -1, 1),
                       (INSET, H - INSET, 1, -1), (W - INSET, H - INSET, -1, -1)):
    d.line([(cx, cy), (cx + ARM * dx, cy)], fill=ACC, width=2)
    d.line([(cx, cy), (cx, cy + ARM * dy)], fill=ACC, width=2)

wm_font = poppins('Medium', 31)
hd_font = poppins('Light', 62)
url_font = poppins('Medium', 21)


def tracked(xy, text, font, fill, tracking=0.0):
    """Pillow has no letter-spacing, so step glyph by glyph."""
    x, y = xy
    extra = tracking * font.size
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + extra


def greedy(text, font, target):
    lines, cur = [], ''
    for w in text.split():
        trial = (cur + ' ' + w).strip()
        if d.textlength(trial, font=font) <= target or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def wrap_balanced(text, font, maxw):
    """Fewest lines, then the most even split that still fits in them."""
    base = greedy(text, font, maxw)
    best = base
    for target in range(int(maxw), 200, -8):
        ls = greedy(text, font, target)
        if len(ls) != len(base):
            break
        best = ls
    return best


lines = wrap_balanced(HEADLINE, hd_font, W - LEFT * 2 - 20)

# ── measure the block, then centre it ───────────────────────────────
LH = int(hd_font.size * 1.2)
GAP_WM, GAP_RULE, GAP_URL = 74, 42, 24
last_h = d.textbbox((0, 0), lines[-1], font=hd_font)[3]
block_h = GAP_WM + LH * (len(lines) - 1) + last_h + GAP_RULE + GAP_URL + url_font.size
top = (H - block_h) // 2

# ── wordmark: .navbar__brand::before plus .navbar__title, at card scale ──
TICK = 26
d.line([(LEFT, top), (LEFT + TICK, top)], fill=ACC, width=2)
d.line([(LEFT, top), (LEFT, top + TICK)], fill=ACC, width=2)
tracked((LEFT + TICK + 22, top - 4), WORDMARK, wm_font, ACC, 0.17)

# ── headline ────────────────────────────────────────────────────────
y = top + GAP_WM
for ln in lines:
    d.text((LEFT, y), ln, font=hd_font, fill=FG)
    y += LH

# ── hairline + url ──────────────────────────────────────────────────
rule_y = d.textbbox((LEFT, y - LH), lines[-1], font=hd_font)[3] + GAP_RULE
d.line([(LEFT, rule_y), (W - LEFT, rule_y)], fill=over(ACC, 0.38, INK), width=1)
tracked((LEFT, rule_y + GAP_URL), URL, url_font, MUTED, 0.16)

img.save(OUT, 'PNG', optimize=True)
print('wrote %s  %dx%d  %d bytes' % (os.path.normpath(OUT), W, H, os.path.getsize(OUT)))
