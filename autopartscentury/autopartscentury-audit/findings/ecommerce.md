# E-commerce SEO Audit — Product Catalog (B2B / RFQ)

**Site:** autopartscentury.com | **Scope:** 148 product pages, 6 subcategories | **Date:** 2026-10-11

## Category Score: 72 / 100

Strong catalog fundamentals (100% spec-table coverage, unique model-first titles, Product JSON-LD on every page) held back by incomplete schema (no offers/mpn → no rich results), zero internal linking inside spec tables, and near-duplicate descriptions between series siblings.

## What Works

- **Model-number targeting is excellent.** Sampled 12 products across all 6 subcategories: model number (TR414, PVR153-3.2, V3.12.1, EXJ224ML, TR623A…) leads the H1, seoTitle and slug in every case. All 148 titles unique, 0 duplicate. Crawl confirms 148/148 pages have exactly one H1 matching the product name.
- **100% data completeness on core fields:** 148/148 products have description (>50 chars), full spec table, seoTitle, keywords, ≥3 feature bullets.
- **Spec tables render as real HTML `<table>`** with model + dimensions (A/B/C mm, rim hole, PSI) — exactly the format B2B buyers and Google dataset-style extraction like.
- **Product JSON-LD present and valid on all 148 pages** (name, description, image, brand, manufacturer), rendered server-side in raw HTML.
- **Breadcrumbs with correct hierarchy** (Home → Tyre Valves → Subcategory → Product) and self-referencing canonicals on every page.
- **Good content volume:** product pages 404–582 words (median 466); category pages 493–1033 words with unique intro copy, highlights and FAQs.
- **RFQ CTAs well executed:** prominent Request Quote + pre-filled WhatsApp inquiry (includes product name) + MOQ/Packaging/Lead-time strip — appropriate for no-cart B2B.
- Images all WebP, all with alt text; gallery with thumbnails + autoplay.

## Findings

### 1. Product schema missing offers/mpn — ineligible for rich results
- **Severity:** High
- **Evidence:** Rendered JSON-LD for `/products/passenger-car-light-truck-valves/tr414-snap-in-tubeless-valve/` contains only `name, description, image, brand, manufacturer`. No `offers`, `aggregateRating` or `review` (Google requires ≥1 for Product rich results → page gets a GSC warning, no price/availability snippet). Also missing `sku`/`mpn`, `category`, `additionalProperty` (specs).
- **Recommendation:** B2B-no-price is a solved problem: add an `Offer` with `priceCurrency:"USD"`, `availability:"InStock"`, `businessFunction:"http://purl.org/goodrelations/v1#Sell"`, `url` = page URL, and either an indicative `priceSpecification` range or omit price (Offer without price still validates and signals B2B inquiry). Critically, add `mpn`/`sku` = model number (TR414 etc.) — this directly reinforces model-number queries. Map spec rows to `additionalProperty` (PropertyValue) for dimension snippets.

### 2. Spec tables contain 508 unlinked references to sibling product pages
- **Severity:** High
- **Evidence:** 628 spec rows match a model number that has its own page; 508 of those point to *other* products (e.g., TR412 page lists TR413/TR414/TR415 as plain `<td>` text). SpecTable.vue:11 renders `{{ cell }}` — zero `<a>` tags in rendered table HTML (verified in fetched page).
- **Recommendation:** In SpecTable, detect cells matching a product model in the same subcategory and render `router-link` to that product. Instant +508 highly relevant, exact-match-anchor internal links — the single highest-leverage change on the site.

### 3. Near-duplicate descriptions between series siblings (cannibalization risk)
- **Severity:** High
- **Evidence:** 343 of 1,998 within-subcategory description pairs share >0.75 word-set similarity. Worst: valve-accessories 157/325 pairs, valve-extensions 95/528, truck-bus 56/595. Example: PVR153-2.3/-2.7/-3.2 pages differ only by "60/70/80mm" in otherwise identical ~310-char descriptions, and each page's spec table lists all three.
- **Recommendation:** Keep per-model pages (each model has distinct search demand — correct to avoid merging into series pages), but differentiate the ~40% most similar pages: add 1–2 unique sentences per model covering its specific use case (e.g., "the 80mm variant suits deep-dish commercial rims"), typical applications, and a "Compare PVR153 sizes" line linking siblings. Prioritize valve-accessories and valve-extensions.

### 4. Category FAQs rendered without FAQPage schema; no ItemList/BreadcrumbList anywhere
- **Severity:** Medium
- **Evidence:** All 6 category pages show a visible FAQ section (FaqSection.vue) but crawl shows `jsonLdTypes: []` on every category page. Product pages have Product only — no BreadcrumbList despite visible breadcrumbs.
- **Recommendation:** Emit FAQPage JSON-LD from the existing `sub.faqs` data (trivial — data already structured), BreadcrumbList on all pages, and ItemList (with itemListElement → product URLs) on category pages for carousel-style treatment.

### 5. No application/fitment data on any product
- **Severity:** Medium
- **Evidence:** 0/148 products have applications/compatibility/fits fields (checked via node import). For valves, "fits 11.5mm rim hole / passenger cars" lives only in prose, not structured or scannable form.
- **Recommendation:** Add an `applications` array per product (vehicle types, rim hole, pressure class) and render as a "Fits / Applications" block. This is the #1 content differentiator vs. competitor catalogs and feeds finding #3 (unique content per sibling).

### 6. "Related Products" is static and same-subcategory only — no cross-selling
- **Severity:** Medium
- **Evidence:** ProductPage.vue:184-187 — `sub.products.filter(p => p.slug !== current).slice(0, 5)`: every product in a subcategory shows the same first-5 items. A TR414 valve page never links to valve extensions, caps or cores it pairs with. Uniform 34 internal links/page (mostly nav/footer).
- **Recommendation:** Add explicit cross-subcategory cross-sell: valve → matching extension + cap + core; extension → compatible truck valve. Either curate in data or derive from shared attributes (rim hole, thread 8V1). This builds the accessory attach-rate funnel and distributes PageRank beyond the first 5 SKUs.

### 7. Request Quote CTA loses product context
- **Severity:** Medium
- **Evidence:** ProductPage.vue:65 — plain `<router-link to="/contact">`. contact.vue:55 has a product select and a message box asking users to "include model numbers", but the model isn't passed. WhatsApp CTA *does* pre-fill the product name — inconsistent.
- **Recommendation:** Link to `/contact?product=<slug>` (or pre-fill message with model number + spec row). Reduces RFQ friction and improves lead quality attribution per SKU.

### 8. Image gaps: all 26 valve-accessories products are single-image
- **Severity:** Medium-Low
- **Evidence:** Node analysis: valve-accessories multiImg=0/26; passenger-car 11/27 single-image; motorcycle 6/8 single-image. Gallery UI (`v-if="gallery.length > 1"`) collapses to a static image.
- **Recommendation:** Add angle/detail shots (thread close-up, cap/core detail, packaging) for accessories first — caps/cores are visual, low-consideration items where images carry the snippet. Minimum 2–3 per product.

### 9. Snippet-length hygiene: all titles >60 chars; 131/148 meta descriptions <120 chars
- **Severity:** Low
- **Evidence:** Crawl: 148/148 titles 61–91 chars (e.g., "TR414 Snap-In Tubeless Valve | 11.5mm Rim Hole, A=38mm B=48mm - AutoParts Century" truncates before "AutoParts Century" — acceptable since model is front-loaded, but specs get cut). 131 descriptions are the raw ~100-char tagline.
- **Recommendation:** Trim titles to ~"MODEL Type | Key Spec — AutoParts Century" (~60). Expand meta descriptions to 140–155 chars by appending MOQ/OEM angle ("Factory direct, OEM/ODM, bulk supply.") — data already exists in `desc`.

### 10. Category H1 omits the "valves" keyword
- **Severity:** Low
- **Evidence:** Category H1s are "Passenger Car & Light Truck", "Truck & Bus" etc., while titles target "...Tyre Valves". H1/title keyword mismatch on the 6 highest-authority catalog pages.
- **Recommendation:** H1 → "Passenger Car & Light Truck Tyre Valves" etc. Matches title intent and internal anchors.

### 11. No filters or sorting on category grids
- **Severity:** Low
- **Evidence:** CategoryPage.vue renders a flat 5-col grid of up to 35 products; no filter by rim hole, length, material or pressure. No faceted URLs.
- **Recommendation:** For UX, add client-side filters (rim hole, material) — no indexable facets needed (avoid parameter-URL bloat). Do *not* create indexable filter pages; the subcategory structure already covers the demand.

### 12. No downloadable datasheets
- **Severity:** Low
- **Evidence:** Grep for pdf/datasheet/download across `src/`: zero. B2B buyers often need a spec sheet to attach to an RFQ internally.
- **Recommendation:** Optional: PDF datasheet per subcategory (auto-generated from spec data) — earns links/ bookmarks from procurement users and adds a crawlable document asset.

## Series-level pages verdict (Task 6)

**Correctly avoided as separate indexable pages** — each series' full size matrix already lives in every member page's spec table, so a series page would duplicate that content and compete with its own members. The per-model strategy is right because model numbers (TR414, TR413) carry the query volume. However, the current implementation pays a price: sibling pages are near-identical (finding #3) and don't link to each other (finding #2), so Google sees N similar pages with no relational signals. Fix those two findings and per-model becomes unambiguously correct — no consolidation needed. If resources are short, merge only the lowest-traffic 2–3 sibling groups in valve-accessories rather than building series pages.
