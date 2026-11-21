# Link-preview images (WhatsApp, social): one fixed 1200x630 JPG per section, placed as
# Next.js "opengraph-image.jpg" files (inherited by sub-pages unless a page sets its own).
# Nov 2026. Run: python3 scripts/_make-og-images.py
import io, os, urllib.request
from PIL import Image, ImageOps, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = '/mnt/c/Users/DELL/OneDrive/Documents/CREA/EXPOS/Batx-2026/fonts/'
SAN = 'https://cdn.sanity.io/images/pyibu0t8/production/'
def load(src):
    if src.startswith('http'): return Image.open(io.BytesIO(urllib.request.urlopen(src + '?w=2400&fm=jpg&q=90').read())).convert('RGB')
    return ImageOps.exif_transpose(Image.open(os.path.join(R, src))).convert('RGB')
def cover(im, cx=.5, cy=.5, W=1200, H=630):
    s = max(W / im.width, H / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = round((im.width - W) * cx); y = round((im.height - H) * cy); return im.crop((x, y, x + W, y + H))
def save(im, folder, alt):
    d = os.path.join(R, folder); os.makedirs(d, exist_ok=True)
    im.save(os.path.join(d, 'opengraph-image.jpg'), quality=84, optimize=True, progressive=True)
    open(os.path.join(d, 'opengraph-image.alt.txt'), 'w', encoding='utf-8').write(alt)
    print(folder, os.path.getsize(os.path.join(d, 'opengraph-image.jpg')) // 1024, 'KB')

# default (home, about, consulting, contact...): portrait + name
p = load('public/images/armelle-paola-guigou.jpg')
card = Image.new('RGB', (1200, 630), (20, 20, 20))
ph = cover(p, .5, .25, 520, 630); card.paste(ph, (680, 0))
d = ImageDraw.Draw(card)
name = ImageFont.truetype(F + 'Cormorant-500.ttf', 76); sub = ImageFont.truetype(F + 'Jakarta-500.ttf', 20)
d.text((80, 230), 'Armelle', font=name, fill=(240, 236, 228)); d.text((80, 310), 'Boussidan', font=name, fill=(240, 236, 228))
d.line((82, 420, 152, 420), fill=(201, 169, 97), width=2)
x = 82
for ch in 'ART  ·  CONSULTING': d.text((x, 446), ch, font=sub, fill=(201, 169, 97)); x += d.textlength(ch, font=sub) + 4
save(card, 'app', 'Armelle Boussidan, artist and consultant')

save(cover(load(SAN + '70739312aac0acdd0ce0422775356bb910556a36-7971x4200.jpg')), 'app/[locale]/art', 'Triptych Sol del Corazón, Armelle Boussidan')
save(cover(load(SAN + '92c650006659c4ef8a6758becb9800d9dac8f5d3-3911x2407.jpg')), 'app/[locale]/art/paintings', 'Prismatic Love, Armelle Boussidan')
save(cover(load('public/images/paintings/creative-path/journey/chumbera-full.jpg')), 'app/[locale]/art/creative-path', 'Creative path, Armelle Boussidan')
save(cover(load(SAN + '9a07166c4b4d01af365ffea227299a5342b44c10-3630x2938.jpg')), 'app/[locale]/art/available', 'Anthesis, available work by Armelle Boussidan')
save(cover(load('public/images/paintings/creative-path/journey/transforma-exhibition.jpg'), .5, .45), 'app/[locale]/art/exhibitions', 'Transforma exhibition, Órgiva, 2020')
save(cover(load(SAN + '1a98ea0a2e1e93d3acaf2c1c2dbc3ea8f432a359-1376x774.jpg')), 'app/[locale]/art/in-homes', 'Art in homes: Hippomundus, Colmar')
save(cover(load('public/shop/pillow-espiritudeplanta.jpg')), 'app/[locale]/art/shop', 'Shop: paintings printed on everyday objects')
