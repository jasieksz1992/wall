#!/usr/bin/env python3
"""Embed raster PNG construction visuals as base64 data URIs.

The landing page uses bitmap-like photo scenes without storing image files in
``public/``.  This script generates PNG bytes with the Python standard library,
base64-encodes them, and writes the resulting ``data:image/png;base64,...``
strings into ``public/site-config.json``.
"""
from __future__ import annotations

import base64
import json
import math
import random
import struct
import zlib
from pathlib import Path

CONFIG_PATH = Path('public/site-config.json')
GENERATED_IMAGE_DIR = Path('public/images/generated')
LOGICAL_W = 1200
LOGICAL_H = 760
W = 480
H = 304
ORANGE = (255, 77, 22)
INK = (7, 10, 14)
BRICK = (166, 72, 38)
MORTAR = (214, 198, 181)
CREAM = (247, 239, 229)

Color = tuple[int, int, int]
Point = tuple[int, int]


def clamp(v: float) -> int:
    return max(0, min(255, int(v)))


def mix(a: Color, b: Color, t: float) -> Color:
    return tuple(clamp(a[i] * (1 - t) + b[i] * t) for i in range(3))  # type: ignore[return-value]


class Canvas:
    def __init__(self, width: int = W, height: int = H, seed: int = 1, indoor: bool = False) -> None:
        self.w = width
        self.h = height
        self.sx = width / LOGICAL_W
        self.sy = height / LOGICAL_H
        self.px = bytearray(width * height * 3)
        self.random = random.Random(seed)
        self.background(indoor)

    def background(self, indoor: bool = False) -> None:
        sky_a = (220, 234, 242) if not indoor else (215, 208, 200)
        sky_b = (130, 154, 168) if not indoor else (120, 109, 100)
        ground = (116, 104, 91) if not indoor else (90, 77, 67)
        for y in range(self.h):
            t = y / (self.h - 1)
            base = mix(sky_a, sky_b, min(1, t * 1.35)) if y < int(510 * self.sy) else ground
            for x in range(self.w):
                sun = max(0, 1 - math.hypot((x - 930 * self.sx) / (460 * self.sx), (y - 110 * self.sy) / (260 * self.sy)))
                c = mix(base, (255, 238, 190), sun * 0.26)
                n = self.random.randint(-10, 10)
                self.set_pixel(x, y, (clamp(c[0] + n), clamp(c[1] + n), clamp(c[2] + n)))

    def set_pixel(self, x: int, y: int, c: Color, alpha: float = 1.0) -> None:
        if x < 0 or y < 0 or x >= self.w or y >= self.h:
            return
        i = (y * self.w + x) * 3
        if alpha >= 1:
            self.px[i:i + 3] = bytes(c)
            return
        self.px[i] = clamp(self.px[i] * (1 - alpha) + c[0] * alpha)
        self.px[i + 1] = clamp(self.px[i + 1] * (1 - alpha) + c[1] * alpha)
        self.px[i + 2] = clamp(self.px[i + 2] * (1 - alpha) + c[2] * alpha)

    def _scale_box(self, x: int, y: int, w: int, h: int) -> tuple[int, int, int, int]:
        return (int(round(x * self.sx)), int(round(y * self.sy)), max(1, int(round(w * self.sx))), max(1, int(round(h * self.sy))))

    def _scale_point(self, x: int, y: int) -> Point:
        return (int(round(x * self.sx)), int(round(y * self.sy)))

    def rect_px(self, x: int, y: int, w: int, h: int, c: Color, alpha: float = 1.0) -> None:
        x0, y0 = max(0, x), max(0, y)
        x1, y1 = min(self.w, x + w), min(self.h, y + h)
        for yy in range(y0, y1):
            for xx in range(x0, x1):
                self.set_pixel(xx, yy, c, alpha)

    def rect(self, x: int, y: int, w: int, h: int, c: Color, alpha: float = 1.0) -> None:
        self.rect_px(*self._scale_box(x, y, w, h), c, alpha)

    def gradient_rect(self, x: int, y: int, w: int, h: int, top: Color, bottom: Color, alpha: float = 1.0) -> None:
        px, py, pw, ph = self._scale_box(x, y, w, h)
        for yy in range(max(0, py), min(self.h, py + ph)):
            t = (yy - py) / max(1, ph - 1)
            c = mix(top, bottom, t)
            for xx in range(max(0, px), min(self.w, px + pw)):
                self.set_pixel(xx, yy, c, alpha)

    def circle_px(self, cx: int, cy: int, r: int, c: Color, alpha: float = 1.0) -> None:
        rr = r * r
        for y in range(cy - r, cy + r + 1):
            for x in range(cx - r, cx + r + 1):
                if (x - cx) ** 2 + (y - cy) ** 2 <= rr:
                    self.set_pixel(x, y, c, alpha)

    def circle(self, cx: int, cy: int, r: int, c: Color, alpha: float = 1.0) -> None:
        px, py = self._scale_point(cx, cy)
        self.circle_px(px, py, max(1, int(round(r * (self.sx + self.sy) / 2))), c, alpha)

    def line(self, x0: int, y0: int, x1: int, y1: int, c: Color, width: int = 1, alpha: float = 1.0) -> None:
        x0, y0 = self._scale_point(x0, y0)
        x1, y1 = self._scale_point(x1, y1)
        width = max(1, int(round(width * (self.sx + self.sy) / 2)))
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        r = max(0, width // 2)
        while True:
            if width <= 1:
                self.set_pixel(x0, y0, c, alpha)
            else:
                self.circle_px(x0, y0, r, c, alpha)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def polygon(self, points: list[Point], c: Color, alpha: float = 1.0) -> None:
        points = [self._scale_point(x, y) for x, y in points]
        if not points:
            return
        min_y = max(0, min(y for _, y in points))
        max_y = min(self.h - 1, max(y for _, y in points))
        for y in range(min_y, max_y + 1):
            nodes: list[int] = []
            j = len(points) - 1
            for i, (xi, yi) in enumerate(points):
                xj, yj = points[j]
                if (yi < y <= yj) or (yj < y <= yi):
                    nodes.append(int(xi + (y - yi) / (yj - yi) * (xj - xi)))
                j = i
            nodes.sort()
            for a, b in zip(nodes[0::2], nodes[1::2]):
                for x in range(max(0, a), min(self.w, b + 1)):
                    self.set_pixel(x, y, c, alpha)
    def shadow_rect(self, x: int, y: int, w: int, h: int) -> None:
        for i in range(14, 0, -3):
            self.rect(x - i, y + i, w + i * 2, h + i, (0, 0, 0), 0.012)

    def brick_wall(self, x: int, y: int, w: int, h: int, scale: int = 44, alpha: float = 1.0) -> None:
        self.shadow_rect(x, y, w, h)
        self.rect(x, y, w, h, MORTAR, alpha)
        brick_h = max(15, int(scale * 0.42))
        brick_w = max(38, scale)
        mortar = max(3, scale // 12)
        colors = [BRICK, (185, 87, 47), (147, 65, 31), (195, 101, 54), (132, 57, 32)]
        row = 0
        yy = y + mortar
        while yy < y + h - mortar:
            offset = -brick_w // 2 if row % 2 else mortar
            xx = x + offset
            while xx < x + w:
                bw = min(brick_w - mortar, x + w - xx - mortar)
                if bw > 8:
                    col = colors[(row + xx // brick_w) % len(colors)]
                    self.gradient_rect(xx + mortar, yy, bw, min(brick_h, y + h - yy - mortar), mix(col, (230, 140, 92), 0.10), mix(col, (70, 35, 25), 0.18), alpha)
                xx += brick_w
            yy += brick_h + mortar
            row += 1

    def wall_mark(self, x: int, y: int, s: float = 1.0) -> None:
        blocks = [(0, 0), (56, 0), (112, 0), (0, 30), (112, 30), (56, 60)]
        for bx, by in blocks:
            self.rect(x + int(bx * s), y + int(by * s), int(44 * s), int(28 * s), ORANGE)

    def worker(self, x: int, y: int) -> None:
        self.circle(x, y, 14, (225, 165, 86))
        self.polygon([(x - 20, y + 18), (x + 20, y + 18), (x + 14, y + 75), (x - 14, y + 75)], ORANGE)
        self.line(x - 12, y + 34, x - 48, y + 78, INK, 8)
        self.line(x + 12, y + 34, x + 48, y + 78, INK, 8)
        self.line(x - 8, y + 72, x - 26, y + 132, INK, 8)
        self.line(x + 8, y + 72, x + 30, y + 132, INK, 8)

    def logo_panel(self, x: int, y: int, s: float = 1.0, light: bool = False) -> None:
        self.wall_mark(x, y, s * 0.7)
        color = CREAM if light else INK
        # Block-letter approximation of WALL.
        base_x = x + int(120 * s)
        self.rect(base_x, y + int(12 * s), int(14 * s), int(48 * s), color)
        self.rect(base_x + int(20 * s), y + int(28 * s), int(14 * s), int(32 * s), color)
        self.rect(base_x + int(40 * s), y + int(12 * s), int(14 * s), int(48 * s), color)
        self.rect(base_x + int(72 * s), y + int(12 * s), int(16 * s), int(48 * s), color)
        self.rect(base_x + int(88 * s), y + int(12 * s), int(34 * s), int(14 * s), color)
        self.rect(base_x + int(88 * s), y + int(36 * s), int(30 * s), int(12 * s), color)
        self.rect(base_x + int(128 * s), y + int(12 * s), int(16 * s), int(48 * s), color)
        self.rect(base_x + int(144 * s), y + int(12 * s), int(34 * s), int(14 * s), color)
        self.rect(base_x + int(144 * s), y + int(36 * s), int(30 * s), int(12 * s), color)
        self.rect(base_x + int(184 * s), y + int(12 * s), int(16 * s), int(48 * s), color)
        self.rect(base_x + int(200 * s), y + int(46 * s), int(32 * s), int(14 * s), color)
        self.rect(base_x + int(238 * s), y + int(12 * s), int(16 * s), int(48 * s), color)
        self.rect(base_x + int(254 * s), y + int(46 * s), int(32 * s), int(14 * s), color)

    def crane(self, x: int = 830, y: int = 62) -> None:
        col = (50, 58, 64)
        self.line(x, y, x, 585, col, 10, 0.65)
        self.line(x - 520, y + 38, x + 260, y + 24, col, 8, 0.65)
        for i in range(0, 500, 42):
            self.line(x - 32, y + i, x + 32, y + i + 34, col, 3, 0.55)
            self.line(x + 32, y + i, x - 32, y + i + 34, col, 3, 0.55)
        self.line(x - 190, y + 35, x - 190, 330, col, 4, 0.72)
        self.rect(x - 212, 330, 44, 36, ORANGE, 0.96)

    def suv(self, x: int, y: int, s: float = 1.0) -> None:
        def p(px: int, py: int) -> Point:
            return (x + int(px * s), y + int(py * s))
        self.polygon([p(42, 148), p(90, 72), p(248, 48), p(392, 76), p(458, 144), p(436, 202), p(58, 202)], (5, 6, 8))
        self.polygon([p(96, 82), p(228, 82), p(208, 136), p(72, 136)], (32, 49, 60))
        self.polygon([p(244, 76), p(364, 76), p(408, 136), p(230, 136)], (32, 49, 60))
        self.rect(p(125, 142)[0], p(125, 142)[1], int(190 * s), int(48 * s), ORANGE, 0.92)
        self.circle(p(112, 205)[0], p(112, 205)[1], int(44 * s), (6, 6, 6))
        self.circle(p(112, 205)[0], p(112, 205)[1], int(22 * s), (70, 70, 70))
        self.circle(p(372, 205)[0], p(372, 205)[1], int(44 * s), (6, 6, 6))
        self.circle(p(372, 205)[0], p(372, 205)[1], int(22 * s), (70, 70, 70))
        self.wall_mark(p(190, 148)[0], p(190, 148)[1], 0.25 * s)
        self.rect(p(258, 154)[0], p(258, 154)[1], int(94 * s), int(26 * s), CREAM)
        self.rect(p(35, 162)[0], p(35, 162)[1], int(34 * s), int(16 * s), (242, 243, 233))

    def panels(self, x: int, y: int) -> None:
        for i in range(4):
            xx = x + i * 170
            yy = y + (i % 2) * 20
            self.brick_wall(xx, yy, 140, 250, 36, 0.98)
            self.rect(xx + 38, yy + 70, 70, 92, (39, 57, 67))

    def png_bytes(self) -> bytes:
        def chunk(tag: bytes, data: bytes) -> bytes:
            return struct.pack('!I', len(data)) + tag + data + struct.pack('!I', zlib.crc32(tag + data) & 0xFFFFFFFF)
        raw = bytearray()
        row_bytes = self.w * 3
        for y in range(self.h):
            raw.append(0)
            start = y * row_bytes
            raw.extend(self.px[start:start + row_bytes])
        data = b'\x89PNG\r\n\x1a\n'
        data += chunk(b'IHDR', struct.pack('!IIBBBBB', self.w, self.h, 8, 2, 0, 0, 0))
        data += chunk(b'IDAT', zlib.compress(bytes(raw), 6))
        data += chunk(b'IEND', b'')
        return data

    def data_uri(self) -> str:
        encoded = base64.b64encode(self.png_bytes()).decode('ascii')
        return f'data:image/png;base64,{encoded}'


def scene(kind: str, seed: int, title: str) -> Canvas:
    c = Canvas(seed=seed, indoor=kind == 'interior')
    if kind in {'hero', 'crane', 'house'}:
        c.crane()
        c.polygon([(95, 365), (305, 270), (570, 330), (825, 258), (1040, 350), (1030, 390), (95, 390)], (48, 57, 64), 0.72)
        c.brick_wall(135, 305, 610, 250)
        c.brick_wall(275, 225, 470, 130, 38, 0.95)
        c.worker(250, 520)
        c.worker(560, 535)
        c.worker(725, 512)
        if kind == 'hero':
            c.logo_panel(72, 76, 1.15)
            c.suv(650, 465, 0.82)
    elif kind == 'project':
        c.shadow_rect(110, 105, 730, 500)
        c.rect(110, 105, 730, 500, (247, 248, 246))
        c.rect(150, 150, 650, 405, (223, 233, 238))
        for i in range(8):
            c.line(180, 210 + i * 48, 780, 178 + i * 40, (50, 98, 122), 3, 0.75)
        c.brick_wall(905, 190, 170, 370, 40)
        c.worker(800, 555)
    elif kind == 'ai':
        c.shadow_rect(95, 90, 725, 515)
        c.rect(95, 90, 725, 515, (23, 35, 50))
        for i in range(12):
            c.line(130, 140 + i * 42, 790, 120 + i * 38, (74, 166, 207), 3, 0.6)
        c.brick_wall(215, 310, 340, 140, 34)
        c.logo_panel(870, 145, 0.78)
    elif kind == 'production':
        c.gradient_rect(70, 160, 1060, 48, (238, 242, 243), (37, 43, 48), 0.75)
        c.panels(145, 250)
        c.worker(310, 545)
        c.worker(610, 545)
        c.worker(900, 545)
    elif kind == 'transport':
        c.suv(110, 380, 1.65)
        c.panels(700, 245)
        c.logo_panel(850, 90, 0.82)
    elif kind == 'system':
        c.brick_wall(155, 175, 780, 420)
        c.rect(452, 300, 210, 225, (36, 51, 59))
        c.rect(708, 235, 225, 300, (37, 56, 66))
        c.worker(1010, 560)
    elif kind == 'detail':
        c.brick_wall(92, 76, 1000, 585, 50)
        c.rect(420, 270, 305, 340, (38, 57, 67))
        c.line(420, 270, 725, 610, ORANGE, 12, 0.9)
        c.line(725, 270, 420, 610, ORANGE, 12, 0.9)
    elif kind == 'interior':
        c.brick_wall(0, 0, 1200, 430, 52, 0.78)
        c.rect(0, 392, 1200, 368, (90, 77, 67))
        c.rect(122, 190, 360, 275, (34, 50, 58))
        c.rect(610, 180, 450, 330, (233, 228, 220))
        c.rect(650, 220, 370, 250, (48, 72, 82))
        c.wall_mark(70, 70, 0.65)
    return c


ASSETS = {
    'hero-construction-photo.png': ('hero', 'Budowa domu z prefabrykatów WALL'),
    'process-project-photo.png': ('project', 'Analiza projektu budowlanego WALL'),
    'process-ai-photo.png': ('ai', 'AI i prefabrykacja ścian WALL'),
    'process-production-photo.png': ('production', 'Produkcja prefabrykowanych elementów WALL'),
    'process-transport-photo.png': ('transport', 'Transport prefabrykatów i samochód firmowy WALL'),
    'process-crane-photo.png': ('crane', 'Montaż prefabrykatów z dźwigiem'),
    'wall-system-photo.png': ('system', 'System ścienny z cegły WALL'),
    'ai-blueprint-photo.png': ('ai', 'Cyfrowy blueprint i analiza AI'),
    'realization-production-photo.png': ('production', 'Realizacja produkcyjna WALL'),
    'realization-transport-car-photo.png': ('transport', 'Samochód firmowy WALL w transporcie'),
    'realization-crane-photo.png': ('crane', 'Realizacja montażu dźwigiem'),
    'realization-house-photo.png': ('house', 'Gotowa konstrukcja domu WALL'),
    'realization-detail-photo.png': ('detail', 'Detal połączenia prefabrykatów'),
    'interior-photo.png': ('interior', 'Wnętrze domu po montażu konstrukcji'),
}


def build_data_uris() -> dict[str, str]:
    return {
        name: scene(kind, 100 + index * 17, title).data_uri()
        for index, (name, (kind, title)) in enumerate(ASSETS.items(), start=1)
    }


def remove_generated_image_files() -> None:
    if not GENERATED_IMAGE_DIR.exists():
        return

    for image_file in GENERATED_IMAGE_DIR.glob('*-photo.*'):
        image_file.unlink()

    try:
        GENERATED_IMAGE_DIR.rmdir()
    except OSError:
        pass


def embed_images(config: dict, data_uris: dict[str, str]) -> None:
    config['hero']['image'] = data_uris['hero-construction-photo.png']

    benefit_images = [
        'wall-system-photo.png',
        'process-crane-photo.png',
        'process-ai-photo.png',
        'realization-detail-photo.png',
        'process-production-photo.png',
        'realization-house-photo.png',
    ]
    for benefit, image_name in zip(config['benefits'], benefit_images):
        benefit['image'] = data_uris[image_name]

    process_images = [
        'process-project-photo.png',
        'process-ai-photo.png',
        'process-production-photo.png',
        'process-transport-photo.png',
        'process-crane-photo.png',
    ]
    for step, image_name in zip(config['processSteps'], process_images):
        step['image'] = data_uris[image_name]

    config['systemsSection']['image'] = data_uris['wall-system-photo.png']
    config['aiSection']['image'] = data_uris['ai-blueprint-photo.png']

    realization_images = [
        'realization-production-photo.png',
        'realization-transport-car-photo.png',
        'realization-crane-photo.png',
        'realization-house-photo.png',
        'realization-detail-photo.png',
    ]
    for realization, image_name in zip(config['realizations'], realization_images):
        realization['image'] = data_uris[image_name]

    config['interiorSection']['image'] = data_uris['interior-photo.png']


def main() -> None:
    data_uris = build_data_uris()
    config = json.loads(CONFIG_PATH.read_text(encoding='utf-8'))
    embed_images(config, data_uris)
    CONFIG_PATH.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    remove_generated_image_files()
    print(f'Embedded {len(data_uris)} base64 PNG data URIs in {CONFIG_PATH}')


if __name__ == '__main__':
    main()
