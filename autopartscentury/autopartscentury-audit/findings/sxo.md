# SXO Audit — Search Experience & Intent Match

**Site:** AutoParts Century (autopartscentury.com) — B2B tyre valve manufacturer catalog
**Scope:** 163 crawled pages + live inspection of home, /products/, subcategory, product, news, about, contact
**Date:** 2026-10-11
**Category score: 76 / 100**

---

## What Works

- **Model-number-first title architecture.** Every one of the 148 product titles leads with the exact string buyers type (`TR414 Snap-In Tubeless Valve | 11.5mm Rim Hole…`). No brand-first titles anywhere. Subcategory titles front-load model clusters (`TR412 TR413 TR414 TR415 Snap-In Tyre Valves`). This is exactly right for a parts catalog.
- **Intent-to-page-type mapping is clean** (see table below). No obvious page-type mismatches — product queries land on product pages, wholesale/guide queries land on 2,200-word buyer guides, brand queries land on a proper manufacturer homepage.
- **Spec tables on product pages.** Real `<table>` markup with Model / A / B / Rim Hole / Core / Max Pressure — the single most valuable SERP-feature and AI-citation asset a parts site can have, and it's already there.
- **Conversion path is complete.** "Request Quote" CTA (3–4 instances), phone, WhatsApp and mailto on every page type sampled (home, /products/, subcategory, product, news). Contact page has full street address, working hours, and an inquiry form with product-category dropdown. Visual breadcrumb nav (`aria-label="Breadcrumb"`) on product and subcategory pages. Related-products block (4 links) on product pages; subcategories list all 8–35 products.
- **Homepage passes the 5-second test.** Hero H1 "Rubber & Brass Tyre Valves for Every Vehicle" + subline naming vehicle types + "Browse Products / Get Quote" CTAs above the fold; trust signals (since 2010, 50+ countries, 100% leak tested) and contact info in header. What/products/why-trust/how-to-contact all answerable in one viewport.
- **/products/ serves browse-catalog intent well:** 154 unique product links, category sections, 3,513 words, and a client-side search box ("Search tyre valves, e.g. TR414").
- **Zero missing meta descriptions, zero missing canonicals, zero images without alt, all 163 pages return 200.** News titles match real wholesale buyer queries ("Tubeless Tire Valves Wholesale | Complete Bulk Buyer's Guide 2026").

## Intent Mapping by Page Type

| Page type | Dominant intent it should serve | Match? | Evidence |
|---|---|---|---|
| Home | Commercial investigation: "tyre valves manufacturer", brand/navigational | Yes | Title "Tyre Valves Manufacturer \| Rubber Snap-In & Brass Clamp-In Valve Stems", Organization schema with contactPoint, 6 category entry points |
| /products/ | Browse catalog: "tyre valve types", "all tyre valves" | Yes (minor gap: no spec filters) | 154 product links + search input; but no filter by rim hole/length/vehicle |
| Subcategory (6) | Commercial: "snap-in tyre valves", "truck valve stems" | Yes (weakened by missing size-comparison tables — F2) | Category h1, product grid, FAQ block, quote CTA |
| Product (148) | Transactional/spec lookup: "TR414", "V3.14.2 dimensions" | Strong yes | Model-first title, spec table, Product schema, related products |
| News (4 guides) | Informational B2B: "tubeless tire valves wholesale", "how to choose manufacturer" | Yes | 2,240–2,259 words, 16 h2s per article; no Article schema (F5) |
| About / Contact | Legitimacy verification | Yes (thin — F7) | Address, since-2010, by-the-numbers; but 402/256 words, no certifications |

## Persona Scores (0–10)

| Persona | Score | What they get | What's missing |
|---|---|---|---|
| (a) Distributor comparing suppliers | 7.5 | Manufacturer positioning, full range visibility, 4 deep buyer guides (MOQ, QC, pricing tiers), OEM/ODM messaging | No certifications (ISO 9001 / IATF 16949), no factory capacity or lead-time figures on category pages, no MOQ per product, no downloadable catalog |
| (b) Mechanic looking up a model spec | 8 | Model-number titles, spec table with rim hole + A/B lengths + pressure, breadcrumb to category | No OE/cross-reference numbers, no vehicle fitment info, no installation torque, no PDF datasheet, no "TR414 vs TR414L" explainer at product level |
| (c) Importer checking legitimacy | 7 | Physical address, phone/WhatsApp, working hours, "since 2010", 50+ countries, 24h-quote promise | No company registration number, no certifications, no factory photos/tour, no audit/inspection info, About page only 402 words, no staff or export-documentation detail |

## SERP Feature Readiness

- **Product pages:** spec tables already in clean `<table>` format — eligible for table snippets and highly citable by AI Overviews. Product JSON-LD present (name/description/image/brand/manufacturer). Gaps: no BreadcrumbList, no offers/additionalProperty for structured spec extraction.
- **Subcategory pages:** the biggest missed opportunity. Queries like "TR412 vs TR413 vs TR414 difference" or "snap-in valve size chart" are snippet gold, and the site already has the data (it's in per-product tables) but no consolidated comparison table at category level. No JSON-LD at all on these 6 pages.
- **FAQ blocks** exist on home, /products/, and all 6 subcategories (real Q&A content, e.g. "What pressure do these valves handle?") but are plain `<div>`s — no FAQPage schema, questions not in h3/summary elements.
- **News guides:** strong heading structure (16 h2s) but zero tables despite covering MOQ, pricing tiers, and rim-hole standards — all table-shaped content. No Article/author/datePublished markup.

## Conversion Path

- Request Quote CTA: present on home (3), /products/ (3), subcategory (3), product (4), news (3). PASS.
- Breadcrumbs: visual breadcrumb present on product/subcategory pages; **no BreadcrumbList schema anywhere** (F3).
- Related products: 4-item block on product pages; subcategories interlink fully; /products/ hub links all 148 products. PASS.
- Quote destination is /contact with a category-aware form — acceptable; embedding the RFQ form on product pages would shorten the path by one click.

## Homepage 5-Second Test — PASS

What: rubber & brass tyre valves for all vehicle types (hero H1 + subline). Main products: 6 category cards immediately below hero. Why trust: "Tyre Valve Manufacturing You Can Trust", since 2010, 50+ countries, 100% leak tested. How to contact: phone + email in top bar, Get Quote CTA in hero.

---

## Findings

### F1 — Soft 404: invalid URLs return HTTP 200 with full homepage content
**Severity:** Critical
**Evidence:** `/products/definitely-not-a-real-product-xyz/` and `/nonexistent-page-abc/` both return **HTTP 200, 82,462 bytes, homepage title and H1s**. The SPA has a client-side NotFound route (`src/router.js:11`, `src/pages/NotFound.vue`) but the server never sends a 404 status. Any malformed/outdated URL (e.g. after a slug change) becomes a live duplicate of the homepage; Google Search Console will classify these as soft 404s, wasting crawl budget and diluting signals. Infinite URL space × 200 status also pollutes index coverage reports.
**Recommendation:** Configure the host to return a real 404 status for unknown paths (or at minimum for unknown `/products/*` slugs); keep the styled NotFound page for users. Verify in production, not just the preview server.

### F2 — Subcategory pages lack size-comparison tables (featured-snippet gap)
**Severity:** High
**Evidence:** `/products/truck-bus-valves/` and `/products/passenger-car-light-truck-valves/` contain **0 `<table>` elements**. The high-intent query pattern for this niche is comparative ("TR412 vs TR413 vs TR414", "snap-in valve size chart", "V3-20 series dimensions"). The per-product tables already contain every data point needed.
**Recommendation:** Add a consolidated comparison table (model, A, B, rim hole, pressure) at the top of each of the 6 subcategory pages. This simultaneously serves distributor-scanning intent, wins table snippets, and strengthens internal linking (each row links to its product).

### F3 — Structured data gaps: no BreadcrumbList, ItemList, or Article; subcategories have zero JSON-LD
**Severity:** High
**Evidence:** `/products/` and all 6 subcategory pages return **0 JSON-LD blocks**. Product pages have Product schema only; home has Organization only; news articles have none. Visual breadcrumbs render in HTML (`aria-label="Breadcrumb"`) but are invisible to rich-result eligibility.
**Recommendation:** Add BreadcrumbList on all product/subcategory pages (matches existing visual breadcrumbs), ItemList on /products/ and subcategories, Article (with author, datePublished, dateModified) on the 4 news guides.

### F4 — FAQ content published without FAQPage schema or semantic question markup
**Severity:** Medium
**Evidence:** FAQ blocks on home, /products/, and all 6 subcategories (e.g. "Which TR valve do I need?", "What pressure do these valves handle?") are plain divs — no FAQPage JSON-LD, questions not wrapped in h3/details/summary. Crawl confirms `jsonLdTypes: []` on every FAQ-bearing page except home (Organization only).
**Recommendation:** Mark up existing Q&A with FAQPage schema and semantic headings. Even with reduced FAQ rich-result eligibility, this feeds AI Overviews/LLM citation extraction — a channel this B2B niche should care about.

### F5 — Buyer-guide articles lack E-E-A-T signals (author, date, Article schema)
**Severity:** Medium
**Evidence:** All 4 news articles (2,240+ words, targeting "wholesale"/"bulk buying" queries) contain **zero occurrences** of author, datePublished, or "updated" in HTML, and no Article JSON-LD. These pages target the highest-volume informational keywords on the site.
**Recommendation:** Add byline (real name + role, e.g. "Export Manager, 10 yrs in valve manufacturing"), publish/review dates, and Article schema. This directly supports the importer-legitimacy persona too.

### F6 — All 148 product titles exceed 60 characters; 109 exceed 75
**Severity:** Medium
**Evidence:** Product title length min 64 / median 80 / max 97 chars (e.g. `6002 Tyre Valve Core | High/Low Temperature Resistant Long Spring, -54~+150°C - AutoParts Century` = 97). The "- AutoParts Century" suffix alone costs 20 chars. Model + first spec survive truncation, so impact is softened — but trailing specs and the brand vanish in SERPs.
**Recommendation:** Trim secondary specs from titles on the worst offenders (>75 chars); keep `Model | Type, Rim Hole` pattern. Consider shortening the suffix to "- APC" is **not** recommended (brand trust matters) — instead cut mid-title spec clutter.

### F7 — Near-duplicate product variant pages (~99.6–100% body-text similarity)
**Severity:** Medium
**Evidence:** TR412 vs TR413 pages: body-text similarity **1.000**; PVR153-2.3 vs PVR153-2.7: **0.996**. Unique value is carried almost entirely by the title and spec-table row; surrounding copy is identical across size variants (site chrome dominates, ~400–580 words each).
**Recommendation:** Add 1–2 unique sentences per variant (typical applications for that length, vehicle/rim examples, "choose this length when…"). Low effort, templatable, reduces doorway-page risk across 148 URLs.

### F8 — About page thin for legitimacy-check intent
**Severity:** Low
**Evidence:** /about/ is 402 words with "By the Numbers" stats but no certifications, no factory imagery, no registration/license details, no export-documentation or QC-process specifics — the exact items persona (c) checks before wiring money.
**Recommendation:** Expand with certifications (or a roadmap statement), factory photos, QC/leak-test process, export experience by region. Target 800+ words.

### F9 — Φ (Greek phi) used for diameter in titles/specs instead of ø or "Dia"
**Severity:** Low
**Evidence:** Titles like `V3.14.2 Swivel Valve | Φ26 Base, … Φ15.7 Rim Hole`. Buyers type "rim hole 15.7" or "diameter 26", not "Φ26" — a minor keyword-form mismatch. (Crawl-data "��" mojibake was verified as a crawl-tool decoding artifact — charset meta is present and correct on the live site; no action needed there.)
**Recommendation:** Keep Φ for engineering credibility in body copy, but ensure a plain-text form ("15.7mm rim hole") also appears — it already does in most titles, so this is polish, not a fix.

### F10 — 11 pages missing og:image
**Severity:** Low
**Evidence:** `ogImage: null` on 11 of 163 pages in crawl data (including home). Weakens link-sharing CTR when buyers/distributors share pages in WhatsApp/email — a real channel for B2B parts trade.
**Recommendation:** Set a default og:image (hero or logo card) site-wide; product pages should use their product image.

---

*Verification scripts used: autopartscentury-audit/check_*.py (read-only requests against localhost:4173).*
