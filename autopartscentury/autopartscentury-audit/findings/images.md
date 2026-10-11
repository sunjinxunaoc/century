# Image SEO Audit — AutoParts Century

**Date:** 2026-10-11 · **Scope:** 163 crawled pages (2,802 `<img>` instances), 301 files in `public/images/` (19 MB), live markup sampled from home, category, product, news templates on localhost:4173.

**Category Score: 70 / 100**

Alt-text coverage is effectively perfect and filenames are strong, but performance-critical image markup is missing sitewide: no responsive images, no width/height attributes, and a 696 KB PNG logo served at 40px.

---

## What Works

- **100% alt coverage.** Of 2,802 image instances across 163 pages, zero missing `alt` attributes and zero empty alts (crawl `images[].hasAlt` / `alt` analysis).
- **Product alt text is keyword-relevant.** Pattern is `{PART#} {Type}` — e.g. "TR414 Snap-In Tubeless Valve", "V3.14.2 Swivel Valve", "PVR153-2.7 Valve Stem". 408 unique alt strings; matches how B2B buyers search.
- **News images have excellent descriptive alts.** e.g. "Buying Auto Tire Valve Stems in Bulk: Materials, MOQ and Quality Control" — full-phrase, keyword-rich.
- **Hero banners have proper alts.** e.g. "Rubber & Brass Tyre Valves for Every Vehicle", "Truck & Bus Brass Clamp-In Valves" — descriptive, not filename-like.
- **Near-universal WebP adoption.** 297/301 files are WebP. Product images are well-compressed (median well under 100 KB at 1200×1200).
- **SEO-friendly filenames.** 295/297 WebP files are lowercase kebab-case with part numbers (`tr414-snap-in-tubeless-valve001.webp`) — ideal for image search.
- **Lazy loading on below-fold images.** Product cards, gallery thumbnails, and news list covers all use `loading="lazy"`; first product image and news detail cover correctly use eager.

---

## Findings

### 1. Sitewide logo is a 696 KB PNG displayed at 40×40 px
- **Severity:** High
- **Evidence:** `public/images/logo/logo-icon-transparent.png` = 696 KB, 1024×1024 px. Rendered in `src/components/SiteHeader.vue` (`class="h-10 w-10"`, 40×40 CSS px) and `SiteFooter.vue` (`h-6 w-6`, 24×24). Loaded on every one of 163 pages as the first `<img>` in the DOM, no lazy loading, no caching-friendly format. Two additional logo files (`logo-icon.png` 595 KB, `logo-horizontal.png` 266 KB, plus transparent variant 355 KB — 1.87 MB total in `logo/`) are unreferenced in `src/` and appear unused except in JSON-LD (`index.vue` schema references the transparent PNG).
- **Recommendation:** Convert the header/footer logo to an SVG or a 80×80 (2× for retina) WebP/PNG under 5 KB. Update the schema `logo` reference to a dedicated small file. Delete or archive the three unused logo files (~1.16 MB dead weight in the deploy bundle).

### 2. No responsive images (`srcset`/`sizes`) anywhere
- **Severity:** High
- **Evidence:** Grepped rendered HTML of home, category, product, and news pages — zero `srcset` attributes. Product cards display 1200×1200 source files (e.g. `pvr32-motorcycle-valve003.webp`, 130 KB) in grid thumbnails of roughly 250–350 CSS px; mobile devices download the same 1920×640 hero banners as desktop. A category page renders ~28 product images ≈ 1.5–2 MB of imagery that could be under 400 KB with 400px variants.
- **Recommendation:** Generate 2–3 width variants per product image (e.g. 400/800/1200) at build time and emit `srcset` + `sizes` in `ProductCard`, product gallery, hero, and news card components. Highest ROI on category listing pages.

### 3. No `width`/`height` attributes on content images (CLS risk)
- **Severity:** High
- **Evidence:** Sampled `<img>` tags on product, category, home, and news pages — none carry `width`/`height`. Sizing is CSS-only (`h-full w-full object-contain`) inside aspect-ratio-less containers, so the browser cannot reserve space before fetch. News detail cover (`mb-8 w-full`) and product gallery main image are the largest CLS contributors.
- **Recommendation:** Add explicit `width`/`height` (or `aspect-ratio` on the wrapper) matching intrinsic dimensions: 1200×1200 products, 1920×640 heroes, 1200×630 news covers. Zero-cost change, directly improves Core Web Vitals.

### 4. Product gallery alt text degrades to numbered suffixes
- **Severity:** Medium
- **Evidence:** Product page gallery emits `alt="TR414 Snap-In Tubeless Valve 1"` … `"… Valve 4"` for the 2nd–4th views of the same product. Numbered suffixes add no information and dilute the otherwise strong alt pattern.
- **Recommendation:** Use descriptive view alts where distinguishable (e.g. "TR414 Snap-In Tubeless Valve — side view / valve core detail"), or repeat the base product name. Avoid bare incrementing numbers.

### 5. Hero slider ships 3 un-lazy, un-prioritized 1920px images
- **Severity:** Medium
- **Evidence:** Home page renders all three hero banners (`hero-banner-valve-family.webp` 93 KB, `hero-banner-tyre-valve.webp` 70 KB, `hero-banner-heavy-duty.webp` 78 KB) as non-lazy `<img>` with no `fetchpriority`. The visible LCP hero competes with the two hidden slides for bandwidth.
- **Recommendation:** Add `fetchpriority="high"` to the first/active hero slide and `loading="lazy"` to non-active slides. Add `srcset` with a ~768px mobile variant per Task-2 work.

### 6. Two product images break the kebab-case filename convention
- **Severity:** Low
- **Evidence:** `public/images/products/tyre-valves/Valves-Trj650-03-Trj651-03-Large-Bore-Swivel-Type001.webp` (and `…Type002.webp`) use PascalCase segments; the other 295 files are clean lowercase kebab-case.
- **Recommendation:** Rename to `valves-trj650-03-trj651-03-large-bore-swivel-type001.webp` (and update references) for consistency and to avoid case-sensitivity issues on some CDNs/servers.

### 7. 288 filenames end in an opaque 3-digit sequence
- **Severity:** Low
- **Evidence:** Pattern `…valve001.webp` … `…valve004.webp` across the catalog. Not harmful — base names are descriptive — but the suffix carries no meaning and `002`/`003`/`004` variants of the same product are near-duplicates for image search.
- **Recommendation:** Optional. If images show genuinely different angles, rename with view descriptors (`-side`, `-detail`, `-installed`). Otherwise leave as-is; low priority.

### 8. Largest product images approach or exceed 100 KB
- **Severity:** Low
- **Evidence:** 15 largest files include `pvr32-motorcycle-valve003.webp` (130 KB), `trsp2-valve-spud001.webp` (118 KB), `v3-20-1-clamp-in-valve001.webp` (107 KB), `gt-valve-cap001.webp` (107 KB); news covers run 114–150 KB at 1200×630. Acceptable, but the tail is heavy relative to the ~40–60 KB median.
- **Recommendation:** Re-encode outliers at quality ~75 (or use `cwebp -q 75 -m 6`); target ≤80 KB for 1200×1200 product shots. Combine with Task-2 resizing so thumbnails never ship these full files.

---

## Summary Table

| # | Finding | Severity |
|---|---------|----------|
| 1 | 696 KB PNG logo at 40px sitewide | High |
| 2 | No `srcset`/responsive images | High |
| 3 | No `width`/`height` attrs (CLS) | High |
| 4 | Gallery alts degrade to "… 2/3/4" | Medium |
| 5 | Hero slider: no fetchpriority/lazy split | Medium |
| 6 | 2 PascalCase filenames | Low |
| 7 | Opaque 3-digit filename suffixes | Low |
| 8 | Heavy tail of 100–150 KB images | Low |
