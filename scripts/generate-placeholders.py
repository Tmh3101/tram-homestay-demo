#!/usr/bin/env python3
"""
Generate placeholder WebP images for Tràm Homestay Tam Đảo
Uses Pillow (PIL) - no font dependencies
"""
from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

# Room configurations
rooms = [
    {'id': 'deluxe-mountain', 'name': 'Deluxe View Nui', 'type': 'Deluxe', 'color': '#2D5A3D', 'view': 'MOUNTAIN'},
    {'id': 'family-suite', 'name': 'Family Suite 2PN', 'type': 'Family', 'color': '#2D5A3D', 'view': 'MOUNTAIN'},
    {'id': 'standard-garden', 'name': 'Standard Garden', 'type': 'Standard', 'color': '#4A7C4A', 'view': 'GARDEN'},
    {'id': 'deluxe-balcony', 'name': 'Deluxe Balcony', 'type': 'Deluxe', 'color': '#2D5A3D', 'view': 'MOUNTAIN'},
    {'id': 'premium-suite', 'name': 'Premium Suite', 'type': 'Deluxe', 'color': '#1A2D1A', 'view': 'MOUNTAIN'},
    {'id': 'standard-twin', 'name': 'Standard Twin', 'type': 'Standard', 'color': '#4A7C4A', 'view': 'GARDEN'},
    {'id': 'deluxe-garden', 'name': 'Deluxe Garden', 'type': 'Deluxe', 'color': '#2D5A3D', 'view': 'GARDEN'},
    {'id': 'family-deluxe', 'name': 'Family Deluxe', 'type': 'Family', 'color': '#2D5A3D', 'view': 'GARDEN'},
    {'id': 'standard-mountain', 'name': 'Standard Mountain', 'type': 'Standard', 'color': '#4A7C4A', 'view': 'MOUNTAIN'},
    {'id': 'deluxe-twin', 'name': 'Deluxe Twin', 'type': 'Deluxe', 'color': '#2D5A3D', 'view': 'MOUNTAIN'},
    {'id': 'honeymoon-suite', 'name': 'Honeymoon Suite', 'type': 'Deluxe', 'color': '#1A2D1A', 'view': 'MOUNTAIN'},
    {'id': 'standard-budget', 'name': 'Standard Budget', 'type': 'Standard', 'color': '#6B7280', 'view': 'GARDEN'},
]

public_dir = Path(__file__).parent.parent / 'public' / 'images'


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def create_gradient(width, height, color1, color2):
    """Create a vertical gradient image"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    for y in range(height):
        ratio = y / height
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img


def get_fonts(size_large=28, size_small=18):
    font_paths = [
        '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    font_path_regular = [p.replace('-Bold', '') for p in font_paths]

    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()
    for path in font_paths:
        if Path(path).exists():
            try:
                font_large = ImageFont.truetype(path, size_large)
                break
            except Exception:
                pass
    for path in font_path_regular:
        if Path(path).exists():
            try:
                font_small = ImageFont.truetype(path, size_small)
                break
            except Exception:
                pass
    return font_large, font_small


def draw_text_centered(draw, text, width, height, font, fill=(255, 255, 255), y_offset=0):
    """Draw multi-line text centered on canvas"""
    lines = text.split('\n')
    line_heights = []
    for line in lines:
        bbox = font.getbbox(line)
        line_heights.append(bbox[3] - bbox[1])
    total_height = sum(line_heights) + (len(lines) - 1) * 10
    start_y = (height - total_height) // 2 + y_offset

    y = start_y
    for i, line in enumerate(lines):
        bbox = font.getbbox(line)
        text_w = bbox[2] - bbox[0]
        x = (width - text_w) // 2
        draw.text((x, y), line, font=font, fill=fill)
        y += line_heights[i] + 10


def generate_room_image(output_path, width, height, bg_color, room_name, label):
    """Generate one room WebP placeholder"""
    rgb = hex_to_rgb(bg_color)
    darker = tuple(max(0, c - 40) for c in rgb)
    img = create_gradient(width, height, rgb, darker)
    draw = ImageDraw.Draw(img)

    # Decorative border
    margin = 20
    draw.rectangle(
        [(margin, margin), (width - margin, height - margin)],
        outline=(255, 255, 255, 60),
        width=2
    )

    font_large, font_small = get_fonts(26, 16)
    cream = (245, 240, 225)
    white_dim = (220, 220, 220)

    draw_text_centered(draw, room_name, width, height, font_large, cream, y_offset=-20)
    draw_text_centered(draw, label, width, height, font_small, white_dim, y_offset=30)

    img.save(output_path, 'WEBP', quality=85, method=6)


def generate_hero():
    output_path = public_dir / 'hero.webp'
    print('  hero.webp...')
    img = create_gradient(1920, 1080, hex_to_rgb('#243D24'), hex_to_rgb('#0F180F'))
    draw = ImageDraw.Draw(img)
    font_title, font_sub = get_fonts(72, 36)
    cream = (245, 240, 225)
    draw_text_centered(draw, 'TRAM HOMESTAY', 1920, 1080, font_title, cream, y_offset=-60)
    draw_text_centered(draw, 'Tam Dao  Vinh Phuc', 1920, 1080, font_sub, cream, y_offset=40)
    img.save(output_path, 'WEBP', quality=85, method=6)


def generate_og_image():
    output_path = public_dir / 'og-image.webp'
    print('  og-image.webp...')
    img = create_gradient(1200, 630, hex_to_rgb('#243D24'), hex_to_rgb('#1A2D1A'))
    draw = ImageDraw.Draw(img)
    font_title, font_sub = get_fonts(56, 28)
    cream = (245, 240, 225)
    draw_text_centered(draw, 'Tram Homestay Tam Dao', 1200, 630, font_title, cream, y_offset=-40)
    draw_text_centered(draw, 'Dat phong online - Thanh toan VietQR', 1200, 630, font_sub, cream, y_offset=50)
    img.save(output_path, 'WEBP', quality=85, method=6)


def generate_bank_logos():
    banks = [
        {'code': 'vcb', 'name': 'Vietcombank', 'color': '#E60012', 'short': 'VCB'},
        {'code': 'tcb', 'name': 'Techcombank', 'color': '#003399', 'short': 'TCB'},
        {'code': 'bidv', 'name': 'BIDV', 'color': '#0066CC', 'short': 'BIDV'},
        {'code': 'mb', 'name': 'MB Bank', 'color': '#00A651', 'short': 'MB'},
        {'code': 'vpb', 'name': 'VPBank', 'color': '#0066CC', 'short': 'VPB'},
        {'code': 'acb', 'name': 'ACB', 'color': '#E60012', 'short': 'ACB'},
    ]
    bank_dir = public_dir / 'banks'
    bank_dir.mkdir(parents=True, exist_ok=True)
    for bank in banks:
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="16" fill="{bank['color']}"/>
  <text x="60" y="68" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">{bank['short']}</text>
  <text x="60" y="96" font-family="Arial,sans-serif" font-size="11" fill="white" text-anchor="middle" opacity="0.9">{bank['name']}</text>
</svg>'''
        (bank_dir / f"{bank['code']}.svg").write_text(svg)
        print(f"  banks/{bank['code']}.svg")


def verify_all():
    print('\n--- Verify ---')
    missing = []
    for f in ['hero.webp', 'og-image.webp']:
        if not (public_dir / f).exists():
            missing.append(f)
    for room in rooms:
        for i in range(1, 6):
            p = public_dir / 'rooms' / room['id'] / f'{i}.webp'
            if not p.exists():
                missing.append(str(p.relative_to(public_dir)))
    for bank in ['vcb', 'tcb', 'bidv', 'mb', 'vpb', 'acb']:
        if not (public_dir / 'banks' / f'{bank}.svg').exists():
            missing.append(f'banks/{bank}.svg')

    webp_count = len(list(public_dir.rglob('*.webp')))
    svg_count = len(list(public_dir.rglob('*.svg')))

    if missing:
        print(f'MISSING ({len(missing)}):')
        for m in missing:
            print(f'  - {m}')
    else:
        print(f'All OK! {webp_count} WebP + {svg_count} SVG = {webp_count + svg_count} files total')


if __name__ == '__main__':
    print('Generating placeholder images...\n')

    print('[1/4] Hero + OG images')
    generate_hero()
    generate_og_image()

    print('\n[2/4] Room images (12 rooms x 5 images)')
    labels = ['Main Image', 'Bedroom', 'Bathroom', 'Balcony / View', 'Amenities']
    for room in rooms:
        room_dir = public_dir / 'rooms' / room['id']
        room_dir.mkdir(parents=True, exist_ok=True)
        for i, label in enumerate(labels, 1):
            out = room_dir / f'{i}.webp'
            generate_room_image(out, 800, 600, room['color'], room['name'], label)
        print(f"  {room['id']}: 5 images OK")

    print('\n[3/4] Bank logos (SVG)')
    generate_bank_logos()

    print('\n[4/4] Verification')
    verify_all()

    print('\nDone!')
