#!/usr/bin/env python3
"""Generate text-only SVG construction visuals for the WALL landing page.

The project cannot carry binary image files in PRs, so these assets are SVG
files with photo-inspired gradients, textures, construction scenes, the WALL
mark, and the branded company vehicle.
"""
from __future__ import annotations

import os
from pathlib import Path

OUT = Path('public/images/generated')
W = 1200
H = 760
ORANGE = '#ff4d16'
INK = '#070a0e'
BRICK = '#a64826'
MORTAR = '#d4c6b5'


def svg_shell(title: str, body: str, *, indoor: bool = False) -> str:
    sky_a = '#dceaf2' if not indoor else '#d7d0c8'
    sky_b = '#98aebb' if not indoor else '#786d64'
    ground = '#75685b' if not indoor else '#5a4d43'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">Brandowana scena WALL: prefabrykowane elementy z cegły, budowa, transport i realizacja.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{sky_a}"/><stop offset="1" stop-color="{sky_b}"/></linearGradient>
    <radialGradient id="sun" cx="78%" cy="16%" r="30%"><stop stop-color="#fff1c7" stop-opacity=".92"/><stop offset="1" stop-color="#fff1c7" stop-opacity="0"/></radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .18"/></feComponentTransfer></filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity=".28"/></filter>
    <pattern id="brickPattern" width="96" height="44" patternUnits="userSpaceOnUse">
      <rect width="96" height="44" fill="{MORTAR}"/><rect x="2" y="2" width="44" height="18" rx="1" fill="{BRICK}"/><rect x="50" y="2" width="44" height="18" rx="1" fill="#b9572f"/><rect x="-22" y="24" width="44" height="18" rx="1" fill="#93411f"/><rect x="26" y="24" width="44" height="18" rx="1" fill="{BRICK}"/><rect x="74" y="24" width="44" height="18" rx="1" fill="#c36536"/>
    </pattern>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef2f3"/><stop offset=".45" stop-color="#66727a"/><stop offset="1" stop-color="#252b30"/></linearGradient>
  </defs>
  <rect width="1200" height="760" fill="url(#sky)"/>
  <rect width="1200" height="760" fill="url(#sun)"/>
  <rect y="500" width="1200" height="260" fill="{ground}"/>
  {body}
  <rect width="1200" height="760" filter="url(#grain)" opacity=".7"/>
</svg>
'''


def wall_mark(x: int, y: int, s: float = 1.0) -> str:
    return f'''<g transform="translate({x} {y}) scale({s})" fill="{ORANGE}">
      <rect width="44" height="30" rx="3"/><rect x="56" width="44" height="30" rx="3"/><rect x="112" width="44" height="30" rx="3"/>
      <rect y="30" width="44" height="30" rx="3"/><rect x="112" y="30" width="44" height="30" rx="3"/><rect x="56" y="60" width="44" height="24" rx="3"/>
    </g>'''


def logo(x: int, y: int, s: float = 1.0, light: bool = False) -> str:
    fill = '#f7efe5' if light else INK
    return f'''<g transform="translate({x} {y}) scale({s})">
      {wall_mark(0, 0, .7)}
      <text x="120" y="54" font-family="Arial Black, Impact, sans-serif" font-size="66" font-weight="900" fill="{fill}" letter-spacing="-4">WALL</text>
      <text x="124" y="84" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="{fill}" opacity=".78" letter-spacing="2">WHEN STRENGTH MATTERS</text>
    </g>'''


def crane(x: int = 830, y: int = 62) -> str:
    return f'''<g opacity=".6" stroke="#343a40" stroke-linecap="round">
      <line x1="{x}" y1="{y}" x2="{x}" y2="585" stroke-width="10"/><line x1="{x-520}" y1="{y+38}" x2="{x+260}" y2="{y+24}" stroke-width="8"/>
      {''.join(f'<line x1="{x-32}" y1="{y+i}" x2="{x+32}" y2="{y+i+34}" stroke-width="3"/><line x1="{x+32}" y1="{y+i}" x2="{x-32}" y2="{y+i+34}" stroke-width="3"/>' for i in range(0, 500, 42))}
      <line x1="{x-190}" y1="{y+35}" x2="{x-190}" y2="330" stroke-width="4"/>
      <rect x="{x-212}" y="330" width="44" height="36" rx="6" fill="{ORANGE}" stroke="none" opacity=".95"/>
    </g>'''


def brick_wall(x: int, y: int, w: int, h: int, *, opacity: float = 1) -> str:
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="url(#brickPattern)" opacity="{opacity}" filter="url(#shadow)"/>'


def worker(x: int, y: int) -> str:
    return f'''<g transform="translate({x} {y})"><circle cx="0" cy="0" r="13" fill="#e6a342"/><path d="M-20 16h40l-6 54h-28z" fill="{ORANGE}"/><path d="M-13 30l-35 42M13 30l35 42M-8 68l-18 64M8 68l22 64" stroke="#111" stroke-width="8" stroke-linecap="round"/></g>'''


def suv(x: int, y: int, s: float = 1.0) -> str:
    return f'''<g transform="translate({x} {y}) scale({s})" filter="url(#shadow)">
      <path d="M42 148 90 72 248 48 392 76 458 144 436 202H58z" fill="#050608"/><path d="M96 82h132l-20 54H72zM244 76h120l44 60H230z" fill="#20313c"/>
      <path d="M125 142h190v48H115zM318 138l120 14-10 38H315z" fill="{ORANGE}" opacity=".9"/>
      {wall_mark(190, 148, .25)}<text x="248" y="180" fill="#f7efe5" font-family="Arial Black, Impact" font-size="34" font-weight="900">WALL</text>
      <circle cx="112" cy="205" r="44" fill="#060606"/><circle cx="112" cy="205" r="22" fill="#444"/><circle cx="372" cy="205" r="44" fill="#060606"/><circle cx="372" cy="205" r="22" fill="#444"/>
      <rect x="35" y="162" width="34" height="16" fill="#f2f3e9"/><rect x="438" y="155" width="22" height="28" fill="#d51d14"/>
    </g>'''


def panels(x: int, y: int) -> str:
    return ''.join(brick_wall(x + i * 170, y + (i % 2) * 20, 140, 250, opacity=.98) + f'<rect x="{x+i*170+38}" y="{y+70+(i%2)*20}" width="70" height="92" fill="#273943"/>' for i in range(4))


def scene(kind: str, title: str) -> str:
    base = ''
    if kind in {'hero', 'crane', 'house'}:
        base = crane() + '<path d="M95 365 305 270 570 330 825 258 1040 350 1030 390H95z" fill="#303940" opacity=".72"/>' + brick_wall(135, 305, 610, 250) + brick_wall(275, 225, 470, 130, opacity=.95) + worker(250, 520) + worker(560, 535) + worker(725, 512)
        if kind == 'hero':
            base += logo(72, 76, 1.15) + suv(650, 465, .82)
    elif kind == 'project':
        base = '<rect x="110" y="105" width="730" height="500" rx="26" fill="#f7f8f6" filter="url(#shadow)"/><rect x="150" y="150" width="650" height="405" fill="#dfe9ee"/>' + ''.join(f'<path d="M180 {210+i*48} 780 {178+i*40}" stroke="#32627a" stroke-width="3" opacity=".75"/>' for i in range(8)) + brick_wall(905, 190, 170, 370) + worker(800, 555)
    elif kind == 'ai':
        base = '<rect x="95" y="90" width="725" height="515" rx="30" fill="#172332" filter="url(#shadow)"/>' + ''.join(f'<path d="M130 {140+i*42} 790 {120+i*38}" stroke="#4aa6cf" stroke-width="3" opacity=".6"/>' for i in range(12)) + brick_wall(215, 310, 340, 140) + logo(870, 145, .78)
    elif kind == 'production':
        base = '<rect x="70" y="160" width="1060" height="48" rx="8" fill="url(#metal)" opacity=".75"/>' + panels(145, 250) + worker(310, 545) + worker(610, 545) + worker(900, 545)
    elif kind == 'transport':
        base = suv(110, 380, 1.65) + panels(700, 245) + logo(850, 90, .82)
    elif kind == 'system':
        base = brick_wall(155, 175, 780, 420) + '<rect x="452" y="300" width="210" height="225" fill="#24333b"/><rect x="708" y="235" width="225" height="300" fill="#253842"/>' + worker(1010, 560)
    elif kind == 'detail':
        base = brick_wall(92, 76, 1000, 585) + '<rect x="420" y="270" width="305" height="340" fill="#263943"/><path d="M420 270 725 610M725 270 420 610" stroke="' + ORANGE + '" stroke-width="12" opacity=".9"/>'
    elif kind == 'interior':
        return svg_shell(title, brick_wall(0, 0, 1200, 430, opacity=.78) + '<rect y="392" width="1200" height="368" fill="#5a4d43"/><rect x="122" y="190" width="360" height="275" fill="#22323a"/><rect x="610" y="180" width="450" height="330" rx="16" fill="#e9e4dc"/><rect x="650" y="220" width="370" height="250" fill="#304852"/>' + wall_mark(70, 70, .65), indoor=True)
    return svg_shell(title, base)


ASSETS = {
    'hero-construction-photo.svg': ('hero', 'Budowa domu z prefabrykatów WALL'),
    'process-project-photo.svg': ('project', 'Analiza projektu budowlanego WALL'),
    'process-ai-photo.svg': ('ai', 'AI i prefabrykacja ścian WALL'),
    'process-production-photo.svg': ('production', 'Produkcja prefabrykowanych elementów WALL'),
    'process-transport-photo.svg': ('transport', 'Transport prefabrykatów i samochód firmowy WALL'),
    'process-crane-photo.svg': ('crane', 'Montaż prefabrykatów z dźwigiem'),
    'wall-system-photo.svg': ('system', 'System ścienny z cegły WALL'),
    'ai-blueprint-photo.svg': ('ai', 'Cyfrowy blueprint i analiza AI'),
    'realization-production-photo.svg': ('production', 'Realizacja produkcyjna WALL'),
    'realization-transport-car-photo.svg': ('transport', 'Samochód firmowy WALL w transporcie'),
    'realization-crane-photo.svg': ('crane', 'Realizacja montażu dźwigiem'),
    'realization-house-photo.svg': ('house', 'Gotowa konstrukcja domu WALL'),
    'realization-detail-photo.svg': ('detail', 'Detal połączenia prefabrykatów'),
    'interior-photo.svg': ('interior', 'Wnętrze domu po montażu konstrukcji'),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (kind, title) in ASSETS.items():
        (OUT / name).write_text(scene(kind, title), encoding='utf-8')
    print(f'Generated {len(ASSETS)} SVG assets in {OUT}')


if __name__ == '__main__':
    main()
