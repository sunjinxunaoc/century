# Content Quality Audit — AutoParts Century

**Site:** autopartscentury.com (B2B tyre valve manufacturer catalog, EN, export B2B)
**Crawl:** 163 pages, all HTTP 200 (`autopartscentury-audit/crawl/pages.json`)
**Sources reviewed:** pages.json (all 163 pages), 3 rendered product pages (TR414, VC-8, TR1075A), `src/data/products.js`, `src/data/news.js`, `src/pages/about.vue`, `src/pages/contact.vue`, `src/pages/NewsArticle.vue`

## Category Score: 74 / 100

## What Works

- **No thin product pages.** All 148 product pages fall between 404–582 words (median 466). Every product has a unique H1, a spec table with real dimensional data (rim hole, effective length, ETRTO numbers), bullet highlights, MOQ/packaging/lead-time box, and 5 related products.
- **Zero duplicate titles, zero missing titles/meta descriptions** across all 163 pages.
- **Natural, spec-driven copy.** Product descriptions are not keyword-stuffed; they read as genuine catalog copy ("The TR414 rubber snap-in tubeless tyre valve is the most widely used passenger car valve, fitting the standard 11.5mm rim hole…"). Keyword targeting by model number (TR414, TR1075A, VC-8, PVR153) is exactly right for B2B part-number search intent.
- **Heading structure is clean except the homepage**: every one of the other 162 pages has exactly 1 H1 and ≥1 H2. News articles carry 16 H2s each — excellent scannability.
- **Healthy internal linking with no orphans.** Average 35.7 internal links/page; the lowest-linked page is /contact/ at 25. Related-products modules use rich descriptive anchors (full product name + spec summary, e.g. "TR623A Clamp-In Valve 65° bent brass clamp-in tubeless valve…"), not bare "click here".
- **News content is genuinely deep.** 4 articles at ~2,200–2,260 words each with 14 H2 sections, containing specific, non-generic detail (H62/H65 brass grades, leak-testing procedure, MOQ/mixed-container policy, Hebei factory cluster context). This is clearly above commodity AI filler.
- **Contact page has complete NAP** (full street address in Yanshan County, Cangzhou, Hebei; phone/WhatsApp +86 156 3363 2668; email; working hours) — a real trust signal for export B2B.
- **Product schema on all 148 product pages**, Organization schema on home; canonicals consistent (trailing slash everywhere).

## Findings

### 1. Near-duplicate body copy across sibling products
- **Severity:** High
- **Evidence:** Normalizing model numbers/dimensions in `src/data/products.js` reveals **29 near-duplicate description groups**. Examples: TR412 vs TR413 differ only in A/B dimensions ("…is designed for passenger cars and light trucks, fitting the standard 11.5mm rim hole with A=22mm and B=34mm…" vs "…A=32mm and B=42mm…"); the VC-8 cap family (VC-8, VC-8SJ, VC-8R, VC-8G, VC-8B — 5 pages) is identical except one color word ("black finish" → "red finish"); PVR153-2.3/2.7/3.2 identical except stem length. Meta descriptions mirror this (e.g. the three PVR153 metas are identical but for "80mm/70mm/60mm"). Roughly 60–70 of 148 product pages are in a near-dup group.
- **Impact:** Google may cluster/ canonicalize these pages or pick one sibling and filter the rest, weakening long-tail model-number rankings — the exact queries this site should win.
- **Recommendation:** Add 1–2 sentences of genuinely differentiating copy per sibling: typical vehicle applications, which markets buy it, compatibility notes, packaging units. Prioritize high-volume families (TR41x snap-ins, VC-8 caps, PVR153, TR-EX extensions).

### 2. Homepage has 3 H1 headings
- **Severity:** High
- **Evidence:** `/` h1s = ["Rubber & Brass Tyre Valves for Every Vehicle", "Tyre Valve Manufacturing You Can Trust", "Truck & Bus Brass Clamp-In Valves"] — three hero carousel slides each render an `<h1>`.
- **Recommendation:** Keep the first slide's heading as the sole H1; demote slides 2–3 to `<p>`/`<div>` styled identically, or H2.

### 3. Duplicate meta description: homepage = /products/
- **Severity:** Medium
- **Evidence:** Both `/` and `/products/` use "Rubber & metal tyre valves for passenger cars, light trucks, trucks, buses, agricultural machinery and off-road vehicles. Full size charts for TR, PVR, V3 and TR57 series…" (211 chars). This is the sitewide category intro reused verbatim.
- **Recommendation:** Write a distinct /products/ meta emphasizing the 148-product catalog breadth and subcategory navigation; keep the brand/positioning angle for the homepage.

### 4. 161 of 163 titles exceed 60 characters
- **Severity:** Medium
- **Evidence:** Every product page title is 64–97 chars (median 80), e.g. "TR414 Snap-In Tubeless Valve | 11.5mm Rim Hole, A=38mm B=48mm - AutoParts Century" (81). Home = 90. The " - AutoParts Century" suffix (~20 chars) will be truncated or dropped in SERPs.
- **Mitigating factor:** Model number and key spec are front-loaded, so truncation cuts the brand, not the keyword. For B2B part-number queries this still functions.
- **Recommendation:** Trim the pattern, e.g. "TR414 Snap-In Tubeless Valve | 11.5mm Rim Hole – AutoParts Century" (~67) or drop dimension strings that duplicate the meta description. At minimum shorten the suffix to "| AutoParts Century" or remove on product pages.

### 5. 12 meta descriptions exceed 160 characters
- **Severity:** Medium
- **Evidence:** `/` and `/products/` (211), `/about/` (171), `/news/` (161), all 4 news articles (183–190), `/products/passenger-car-light-truck-valves/` (209), `/products/motorcycle-bicycle-valves/` (190), `/products/truck-bus-valves/` (172), `/products/valve-accessories/` (174). Product-page metas are well-sized (88–136).
- **Recommendation:** Cut these to 150–160 chars, keeping the primary keyword + one differentiator.

### 6. News articles lack author bylines and Article schema
- **Severity:** Medium
- **Evidence:** `src/data/news.js` has 0 author fields; articles render only a date (2026-09-18 etc.) above the H1 (`NewsArticle.vue:7`). No author name, bio, or reviewer. All 5 news pages have **no JSON-LD at all** (only Organization on home and Product on product pages exist sitewide).
- **Impact:** For "tyre valves manufacturer"-type informational queries, E-E-A-T signals (who wrote this, why trust them) and Article structured data (eligible for rich display, clear publish date for freshness) are both absent.
- **Recommendation:** Add an author (e.g. a named product/engineering lead with 1-line bio) to each article; add `Article`/`BlogPosting` JSON-LD with headline, datePublished, author, image.

### 7. News articles contain no internal links to products/categories
- **Evidence:** Article bodies in `src/data/news.js` are plain-text paragraph strings — no inline links. Crawl shows article pages have only 28 internal links each, all from nav/footer/related modules, none contextual. A 2,200-word "Tubeless Tire Valves Wholesale" guide that never links to the TR414 or truck valve category pages wastes its best ranking-assist asset.
- **Recommendation:** Support markdown/HTML links in article paragraphs; add 3–6 contextual links per article to relevant subcategory and product pages with descriptive anchors.

### 8. Weak E-E-A-T depth on About page for a manufacturer
- **Severity:** Medium
- **Evidence:** `/about/` is 402 words: location (Cangzhou, Hebei), since 2010, product line coverage, 4 stats (15+ years, 50+ countries, 17 lines, 100% leak tested), one factory banner image. **No certifications** (ISO 9001 / IATF 16949 — table stakes for auto-parts B2B), no named people, no factory/equipment detail, no export/compliance documentation mentions, no verifiable company registration.
- **Impact:** Distributors vetting a Chinese supplier specifically look for certs and factory substantiation; both users and Google's quality raters find little to verify.
- **Recommendation:** Add certification claims (if held — do not fabricate), factory floor/equipment photos, QC process description (the "100% leak tested" claim should be substantiated with method), company registration/legal name, and export experience specifics. Target 800+ words.

### 9. Product pages lack mid-funnel trust/differentiation content
- **Severity:** Low
- **Evidence:** Rendered TR414/VC-8/TR1075A pages share an identical template block: "MOQ Negotiable / Packaging Custom / Lead Time 7-20 days" + a 6-item trust bar ("Factory Direct, 100% leak tested…"). Unique copy per page is ~80–100 words; the rest is shared boilerplate, so **content-to-template ratio is low** even though raw word count passes.
- **Recommendation:** Add a per-subcategory FAQ block (FAQPage schema), application/fitment notes, or a materials/QC paragraph that varies by family. Also consider adding `mpn` (model number) and `brand` granularity to Product schema; no `offers`/`aggregateRating` is correct for a quote-based B2B catalog — keep it that way.

### 10. /contact/ is the only page under 300 words
- **Severity:** Low
- **Evidence:** 256 words, 25 internal links. Acceptable for a contact page, but it ranks for nothing.
- **Recommendation:** Optional: add a short "What to include in your RFQ" block (model numbers, quantities, destination port) — adds utility and indexable copy.

### 11. Subcategory page depth is uneven
- **Severity:** Low
- **Evidence:** Word counts range from 493 (`/products/motorcycle-bicycle-valves/`) to 1,033 (`/products/truck-bus-valves/`); others 715–913. The motorcycle page is the weakest of the money pages.
- **Recommendation:** Bring motorcycle-bicycle to ~800 words: PVR series application guidance, rim-hole sizing table explanation, 45°/90° bend selection.

### 12. Only 4 news articles total
- **Severity:** Info
- **Evidence:** /news/ lists 4 articles (382 words on the hub page). All 4 target closely-related buyer-guide keywords ("tyre valves manufacturer", "tubeless tire valves wholesale", "auto tire valve stems bulk/supplier") — there is mild keyword overlap between articles 3 and 4 ("auto tire valve stems bulk" vs "auto tire valve stems supplier").
- **Recommendation:** Expand toward support content that links to money pages: sizing guides ("TR412 vs TR413 vs TR414"), material guides, per-vehicle fitment. Watch cannibalization between the two "valve stems" articles; differentiate intent (MOQ/QC vs supplier vetting) or consolidate.

## Score Rationale

Strong foundations: no missing/duplicate titles, no thin product pages, natural copy, clean heading structure on 162/163 pages, real spec data, genuinely substantive news articles, solid internal-link architecture with descriptive anchors. Deductions concentrate on: sibling-page near-duplication at scale (~40% of catalog), sitewide title-length issue, the homepage multi-H1, missing E-E-A-T apparatus (no authors, no certifications, no Article schema), and news articles that don't link back to the catalog. Nothing found blocks indexing or constitutes a critical error.
