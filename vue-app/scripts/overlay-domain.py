import os, glob
from PIL import Image, ImageDraw, ImageFont

SRC_DIR = "public/images/ecommerce"
FONT_PATH = r"C:\Windows\Fonts\arialbd.ttf"
DOMAIN = "centurymanufacture.com"
NAVY = (26, 26, 46)
ORANGE = (255, 107, 0)

font = ImageFont.truetype(FONT_PATH, 34)

def overlay(path):
    img = Image.open(path).convert("RGBA")
    W, H = img.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    text_w = d.textlength(DOMAIN, font=font)
    pad_x, pad_y = 30, 16
    dot_r = 8
    dot_gap = 16
    pill_w = int(text_w) + pad_x * 2 + dot_r * 2 + dot_gap
    pill_h = 34 + pad_y * 2
    x = (W - pill_w) // 2
    y = H - pill_h - 48
    radius = pill_h // 2

    d.rounded_rectangle([x, y, x + pill_w, y + pill_h], radius=radius, fill=NAVY + (235,))
    cy = y + pill_h // 2
    d.ellipse([x + pad_x, cy - dot_r, x + pad_x + dot_r * 2, cy + dot_r], fill=ORANGE)
    tx = x + pad_x + dot_r * 2 + dot_gap
    # vertical centring
    bbox = d.textbbox((0, 0), DOMAIN, font=font)
    ty = cy - (bbox[3] - bbox[1]) / 2 - bbox[1]
    d.text((tx, ty), DOMAIN, font=font, fill=(255, 255, 255, 255))

    out = Image.alpha_composite(img, layer).convert("RGB")
    out.save(path, "WEBP", quality=90, method=6)
    print("overlaid", os.path.basename(path))

files = sorted(glob.glob(os.path.join(SRC_DIR, "*.webp")))
for f in files:
    overlay(f)
print("done", len(files), "images")