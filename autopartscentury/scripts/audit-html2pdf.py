import sys
from playwright.sync_api import sync_playwright

src = r"C:\Users\86189\Desktop\websit\autopartscentury\autopartscentury-audit\Google-SEO-Report-autopartscentury.com-full.html"
out = r"C:\Users\86189\Desktop\websit\autopartscentury\autopartscentury-audit\Google-SEO-Report-autopartscentury.com-full.pdf"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto("file:///" + src.replace("\\", "/"), wait_until="networkidle")
    pg.pdf(path=out, format="A4", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
    b.close()
print("PDF written:", out)
