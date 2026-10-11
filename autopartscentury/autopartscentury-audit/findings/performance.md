# Performance Audit — AutoParts Century

**Date:** 2026-10-11
**Scope:** Research-only audit of the static build (`dist\`), served via `vite preview` on `http://localhost:4173`.
**Category score: 72 / 100**

> **Environment caveat:** `vite preview` sends **no gzip/brotli compression** and `Cache-Control: no-cache` on every response (verified via `curl -I`). All transfer sizes below are uncompressed bytes; TTFB is localhost. The production host almost certainly compresses text assets (~70% smaller) and sets cache headers — re-measure there before quoting absolute numbers. The structural findings (eager images, bundle composition, missing attributes) are host-independent.

---

## What works

- **Route-level code splitting exists and is granular.** Every route is its own chunk: `ProductPage` 7.8KB, `CategoryPage` 2.5KB, `contact` 6.6KB, `about` 4.0KB, `search` 2.9KB, `news` 2.1KB, `NotFound` 0.8KB, plus shared component chunks (`ProductCard` 1.0KB, `FaqSection` 0.9KB, `CtaSection` 1.1KB, `BreadcrumbNav` 0.7KB). No single page forces a megabyte of JS.
- **Images are 98.7% WebP** (297 of 301 files). The only PNGs are 4 logo files.
- **Hero banners are well-compressed** for their size: 1920x640 WebP at 69.6–92.9KB.
- **Lazy loading is broadly applied**: 57/68 `<img>` on the homepage, 154/156 on `/products/`, 13/16 on a product page.
- **Zero third-party scripts.** No analytics, no tag manager, no font CDNs. The WhatsApp float is a plain `<a href="https://api.whatsapp.com/send?...">` link (`src/components/WhatsAppFloat.vue:3`) — zero JS cost.
- **Zero webfonts.** `src/styles/main.css:11` uses a system font stack; no `@font-face` anywhere in the built CSS, so no font-display/FOIT concerns.
- **Prerendered SSG HTML** on all 163 crawled pages (status 200, real content in first response).
- **Small CSS payload**: 23.2KB for the whole site.
- **`modulepreload` hints present** for the homepage's 4 secondary chunks.

## Lab measurements (localhost, uncompressed)

| Metric | Homepage `/` | Product page |
|---|---|---|
| HTML bytes | 82,534 | 28,304 |
| TTFB (5 runs) | 0.205–0.232s | 0.205–0.218s |
| `<img>` count | 68 | 16 |
| Eager images | 4 (logo + 3 hero slides) | 3 (logo, main product, footer logo) |

Eager first-load payload on the homepage (uncompressed): ~937KB images (logo 696.3KB + heroes 92.9+69.6+78.3KB) + ~373KB JS + 23.2KB CSS + 82.5KB HTML ≈ **1.42MB before any lazy image loads**.

---

## Findings

### 1. Oversized logo PNG downloaded eagerly on every page — 696KB for a 40px icon
- **Severity: Critical**
- **Evidence:** `dist\images\logo\logo-icon-transparent.png` is **696.3KB at 1024x1024**, rendered at 40x40px in the header (`src/components/SiteHeader.vue:21`, `class="h-10 w-10"`) and 24x24px in the footer (`src/components/SiteFooter.vue:55`). It is eager (no `loading` attr), appears in the crawl data for all 163 pages, and is also the Organization schema/OG logo. It is the single largest byte on the homepage — bigger than all three hero banners combined. Three more logo PNGs sit in `dist\images\logo\` (595.5KB, 354.5KB, 266.3KB) totaling 1.9MB of the 19MB image payload.
- **Impact:** ~690KB of avoidable data on every first visit; directly delays LCP by competing with the hero image for bandwidth.
- **Recommendation:** Export a right-sized version: 80x80 (1x) / 160x160 (2x) WebP or PNG-8, expected ~2–6KB. Keep a separate full-res file only for schema/OG if needed. Delete or relocate unused logo variants from `public\images`.

### 2. All three hero carousel slides load eagerly; LCP image gets no priority
- **Severity: High**
- **Evidence:** `src/components/HeroSlider.vue:9` renders every slide as `<img :src="slide.image" class="absolute inset-0 h-full w-full object-cover">` with **no `loading` attribute and no `fetchpriority`**. Homepage HTML confirms: 3 hero `<img>` tags, `fetchpriority` count = 0, `loading="eager"` count = 0, `rel="preload"` count = 0 in `<head>`. Combined hero weight ≈ 240.8KB, all requested immediately alongside the 696KB logo and 373KB of JS.
- **Impact:** The LCP element (first slide, `hero-banner-valve-family.webp`, 92.9KB) competes with ~930KB of other eager imagery. On a mid-tier mobile connection this pushes LCP into the 2.5–4s range where it could otherwise be ~1.5–2s.
- **Recommendation:** Add `fetchpriority="high"` to the first slide's img and `loading="lazy"` (or skip rendering until active) to slides 2–3. Add `<link rel="preload" as="image" href="/images/hero-banner-valve-family.webp">` to the homepage head.

### 3. Entire 298KB product catalog ships inside the main JS bundle on every page
- **Severity: High**
- **Evidence:** `src/data/products.js` is **297.8KB of raw data**. It is imported by `SiteHeader.vue:98`, `SiteFooter.vue:66` and `SearchBar.vue:44` — global layout components — so Vite hoists it into the entry chunk: `app-BIYBrJNK.js` is **356.6KB raw / 71.3KB gzip** (measured), and string probing confirms catalog content inside (465 occurrences of "products", 41 of "TR414"). Every one of the 163 pages downloads it, including static ones like `/about/` and `/contact/`. Framework code (Vue + router + unhead) accounts for only ~50–60KB gzip of the bundle; most of the remainder is catalog data.
- **Impact:** ~25–30KB gzip of avoidable JS on non-catalog pages; delays hydration/INP readiness site-wide; defeats the otherwise good route-level splitting.
- **Recommendation:** Move header/footer mega-menu data to a small derived file (names + slugs only, a few KB). Load `allProducts` in `SearchBar` via dynamic `import()` on first focus/keystroke. Keep full product data in the route chunks that need it.

### 4. No `width`/`height` attributes on any image
- **Severity: Medium**
- **Evidence:** Homepage: 0/68 imgs have width/height; product page: 0/16; `/products/`: 0/156. CLS risk is currently **mitigated** by fixed-height CSS containers (hero uses `h-[300px] sm:h-[380px] lg:h-[460px]`, `HeroSlider.vue:8`; cards use `h-40`, `ProductCard.vue:3`), so expected CLS is low — but it depends entirely on every parent keeping a fixed height. Any future template change (or the news cards, `h-full` inside grid) can reintroduce layout shift.
- **Recommendation:** Add intrinsic `width`/`height` (hero: 1920/640; products: 1200/1200; news: 1200/630) alongside the existing CSS sizing. Zero-risk change, protects CLS permanently.

### 5. `/products/` index page is a 140KB HTML document rendering 156 images
- **Severity: Medium**
- **Evidence:** Crawl data: `/products/` = 140,340 bytes, 156 `<img>` tags (154 lazy). All 156 cards render in the DOM at once; the page is also the heaviest hydration target (large DOM + 156 Vue `ProductCard` component instances from the 356KB bundle).
- **Impact:** Large DOM (>1500 nodes) raises hydration cost and INP risk on low-end devices; HTML alone is ~140KB uncompressed.
- **Recommendation:** Paginate or virtualize the grid (e.g., 24–48 items per view), or group by subcategory with collapsible sections. Keep lazy loading.

### 6. Thumbnail images are 1200x1200 masters displayed at ~160px
- **Severity: Medium**
- **Evidence:** Product-card grids (`ProductCard.vue:3`, container `h-40` ≈ 160px) and homepage category cards serve the same 1200x1200 WebP masters used on detail pages. `dist\images\products\tyre-valves\` totals **16.3MB across 288 files**; the 15 largest product images run 97–130KB each (e.g. `pvr32-motorcycle-valve003.webp` 130KB). Natural:displayed pixel ratio is ~7.5x in cards.
- **Impact:** Each grid image is ~3–5x heavier than needed. With ~50 products below the fold on the homepage, lazy loading caps the damage, but scrolling users still pull megabytes.
- **Recommendation:** Generate a 400x400 (or 320x320) derivative set for cards (`*-thumb.webp`, est. 8–15KB each) and reference via `srcset`. `public\images` and `dist\images` are identical (301 files / 19.0MB both) — there is no optimization step in the pipeline; `vite build` copies `public\` verbatim. Add an image-resize script (sharp) to the build.

### 7. No resource hints or preloads anywhere
- **Severity: Low**
- **Evidence:** Homepage `<head>`: 0 `rel="preload"`, 0 `rel="preconnect"`, only 4 `modulepreload` (for secondary chunks — the entry chunk itself is a render-blocking `<script type="module">` + 23.2KB CSS, both acceptable).
- **Recommendation:** Preload the LCP hero (see #2). Preconnect is unnecessary — there are no third-party origins.

### 8. Compression and caching headers absent (environment caveat)
- **Severity: Low (verify on production)**
- **Evidence:** `curl -I` on `/` and `/assets/app-BIYBrJNK.js` returns `Cache-Control: no-cache`, no `Content-Encoding`. This is expected from `vite preview`, not necessarily a production defect.
- **Recommendation:** On the real host confirm: brotli/gzip for HTML/CSS/JS, `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (filenames are content-hashed), and a shorter policy for HTML/images.

### 9. INP risk from full-page hydration is real but bounded
- **Severity: Low**
- **Evidence:** vite-ssg hydrates each prerendered page as a full Vue app. Product spec tables are static prerendered HTML (good), but `/products/` hydrates 156 `ProductCard` instances and the homepage hydrates 68 images + slider + FAQ + search.
- **Recommendation:** After fixing #3 (smaller entry chunk), re-evaluate. If INP regresses, consider lazy-hydrating below-the-fold sections or converting pure-display grids to non-interactive markup.

---

## CWV risk summary

| Metric | Risk | Driver |
|---|---|---|
| **LCP** | **High** | First hero slide (92.9KB) competes with 696KB logo + 163KB other slides + 373KB JS; no preload, no fetchpriority. Fix #1+#2 → est. LCP under 2s on cable, ~2.5s on 4G. |
| **CLS** | **Low–Medium** | Zero width/height attributes, but fixed-height containers currently reserve space. Fix #4 to make it robust. |
| **INP** | **Medium** | 356KB entry chunk (mostly catalog data) parsed/hydrated on every page; heaviest on `/products/` (156 components). Fix #3. |

## Quick wins ranked by effort/impact

1. **Resize the logo** (10 min, saves ~690KB/page) — Critical
2. **`fetchpriority="high"` on slide 1 + lazy slides 2–3 + hero preload** (30 min) — High
3. **Split catalog data out of the layout components** (2–4h) — High
4. **Add width/height attributes** (1h, mechanical) — Medium
5. **Generate 400px card thumbnails via srcset** (half day) — Medium
