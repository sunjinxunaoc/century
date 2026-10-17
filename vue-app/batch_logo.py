from PIL import Image
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

BASE = r"C:\Users\86189\Desktop\websit\vue-app\public\images\products"
LOGO = r"C:\Users\86189\Desktop\websit\vue-app\public\images\logo\logo-horizontal-transparent.png"
OUT_DIR = r"C:\Users\86189\Desktop\画册\Facebook图片\10产品推广"
os.makedirs(OUT_DIR, exist_ok=True)

items = [
    ("01-TR414轮胎气门嘴", "tyre valves/tr414-tyre-valve001.webp"),
    ("02-TR570卡车气门嘴", "tyre valves/tr570-tr571-tr572-tr573-tr574-valve-stem001.webp"),
    ("03-PVR40-70气门嘴", "tyre valves/pvr70-pvr60-pvr50-pvr40-valve-stem001.webp"),
    ("04-9002气门芯", "tyre-valves/9002-valve-core001.webp"),
    ("05-Fe粘贴式平衡块", "Wheel Balancing Weights/Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized.webp"),
    ("06-铅制卡车平衡块", "Wheel Balancing Weights/Pb-clip-on-wheel-weight-for-Truck-CTR-PB-03C.webp"),
    ("07-TPMS-1气门嘴", "tpms/TPMS-1.webp"),
    ("08-轮胎修补胶条", "tyre string/tire-seal-string001.webp"),
    ("09-子午线轮胎补片", "TYRE PATCH/black-radial-tire-patch001.webp"),
    ("10-蘑菇钉", "Mushroom Patch Plug/Mushroom-Tire-Repair-Patch-plug001.webp"),
]

logo = Image.open(LOGO).convert("RGBA")

for out_name, rel in items:
    src = os.path.join(BASE, rel)
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    lw = int(w * 0.22)
    lh = int(logo.height * lw / logo.width)
    lg = logo.resize((lw, lh), Image.LANCZOS)
    pad = int(lw * 0.08)
    bg = Image.new("RGBA", (lw + pad * 2, lh + pad * 2), (255, 255, 255, 200))
    bg.alpha_composite(lg, (pad, pad))
    m = int(w * 0.03)
    img.alpha_composite(bg, (w - bg.width - m, h - bg.height - m))
    out = os.path.join(OUT_DIR, out_name + ".jpg")
    img.convert("RGB").save(out, quality=92)
    print("saved:", out)
