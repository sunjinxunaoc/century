from PIL import Image
import glob, os, sys

sys.stdout.reconfigure(encoding='utf-8')

SRC_DIR = r"C:\Users\86189\Desktop\画册"
LOGO = r"C:\Users\86189\Desktop\websit\vue-app\public\images\logo\logo-horizontal-transparent.png"
OUT_DIR = os.path.join(SRC_DIR, "压轮_logo")
os.makedirs(OUT_DIR, exist_ok=True)

logo = Image.open(LOGO).convert("RGBA")

files = sorted(glob.glob(os.path.join(SRC_DIR, "压轮*.jpg")))
print(f"found {len(files)} images")

for f in files:
    img = Image.open(f).convert("RGBA")
    w, h = img.size
    # logo width = 22% of image width
    lw = int(w * 0.22)
    lh = int(logo.height * lw / logo.width)
    lg = logo.resize((lw, lh), Image.LANCZOS)
    # white rounded background for readability
    pad = int(lw * 0.08)
    bg = Image.new("RGBA", (lw + pad*2, lh + pad*2), (255, 255, 255, 200))
    bg.alpha_composite(lg, (pad, pad))
    # position: bottom-right with margin
    margin = int(w * 0.03)
    pos = (w - bg.width - margin, h - bg.height - margin)
    img.alpha_composite(bg, pos)
    out = os.path.join(OUT_DIR, os.path.basename(f))
    img.convert("RGB").save(out, quality=92)
    print("saved:", out)
