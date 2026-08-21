from PIL import Image
from collections import deque
import math, shutil, os

SRC = r"C:\Users\86189\Desktop\websit\images\tire patch.webp"
BAK = r"C:\Users\86189\Desktop\websit\images\tire patch_original_backup.webp"

im = Image.open(SRC).convert("RGB")
w, h = im.size
px = im.load()

bg = (209, 206, 207)
W = (255, 255, 255)

TOL = 8          # max-channel distance that counts as background
R = 3            # spatial reach (px) from background for edge decontamination
DMAX = 30.0      # color distance at which a pixel is treated as fully foreground

def isbg(c):
    return (abs(c[0] - bg[0]) <= TOL and
            abs(c[1] - bg[1]) <= TOL and
            abs(c[2] - bg[2]) <= TOL)

# 1. background mask = every pixel whose color matches the background
#    (interior patch features are all > TOL away, so no connectivity test is needed;
#     this also catches small background-colored gaps inside the patch)
mask = [[isbg(px[x, y]) for x in range(w)] for y in range(h)]

# 2. distance transform: distance of every foreground pixel to nearest background
INF = w + h
dist = [[INF] * w for _ in range(h)]
dq = deque()
for y in range(h):
    for x in range(w):
        if mask[y][x]:
            dist[y][x] = 0
            dq.append((x, y))
while dq:
    x, y = dq.popleft()
    nd = dist[y][x] + 1
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and dist[ny][nx] > nd:
            dist[ny][nx] = nd
            dq.append((nx, ny))

def dcol(c):
    return math.sqrt(sum((c[i] - bg[i]) ** 2 for i in range(3)))

out = Image.new("RGB", (w, h))
opx = out.load()
shifted = 0
for y in range(h):
    for x in range(w):
        c = px[x, y]
        if mask[y][x]:
            opx[x, y] = W
        elif dist[y][x] <= R:
            d = dcol(c)
            if d < DMAX:
                b = 1.0 - d / DMAX
                opx[x, y] = (
                    min(255, int(round(c[0] + b * (W[0] - bg[0])))),
                    min(255, int(round(c[1] + b * (W[1] - bg[1])))),
                    min(255, int(round(c[2] + b * (W[2] - bg[2])))),
                )
                shifted += 1
            else:
                opx[x, y] = c
        else:
            opx[x, y] = c

if not os.path.exists(BAK):
    shutil.copy(SRC, BAK)
out.save(SRC, "WEBP", lossless=True)

# ---- verification ----
print("size", (w, h))
print("background pixels -> white:", sum(sum(r) for r in mask))
print("edge pixels decontaminated:", shifted)

# border must be pure white now
border_ok = True
for x in range(w):
    for y in (0, h - 1):
        if out.getpixel((x, y)) != W:
            border_ok = False
for y in range(h):
    for x in (0, w - 1):
        if out.getpixel((x, y)) != W:
            border_ok = False
print("output border fully white:", border_ok)

# deep interior (D>=6) must be untouched
diff = 0
n_deep = 0
for y in range(h):
    for x in range(w):
        if dist[y][x] >= 6:
            n_deep += 1
            if out.getpixel((x, y)) != px[x, y]:
                diff += 1
print("deep interior pixels unchanged:", n_deep - diff, "/", n_deep)
