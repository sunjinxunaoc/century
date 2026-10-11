# AutoParts Century — Full SEO Audit Report

- **Date**: 2026-10-11
- **Target**: http://localhost:4173 (production `dist` build via vite preview)
- **Site type**: B2B manufacturer product catalog (tyre valves, export/RFQ, English)
- **Pages crawled**: 163/163 OK (sitemap URLs)
- **Overall SEO Health Score: 71/100**

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 78 |
| Content Quality | 23% | 74 |
| On-Page & Search Experience | 20% | 77 |
| Schema / Structured Data | 10% | 38 |
| Performance (CWV) | 10% | 72 |
| AI Search Readiness (GEO) | 10% | 72 |
| Images | 5% | 70 |

> Note: audited against a local preview of the production build. Server-level items (compression, security headers, real-field CWV, backlinks/indexation) must be re-verified on the live host. No Google/Moz credentials were configured, so backlink and GSC data are absent from this audit.

## Top Critical Issues

1. **Soft 404s site-wide** — unknown URLs return HTTP 200 + homepage content; no `404.html` in `dist/`. (Technical)
2. **696KB logo PNG (1024×1024) displayed at 40×40**, loaded eagerly on all 163 pages — largest single byte cost site-wide. (Performance/Images)

## Top High Issues

1. Non-trailing-slash URLs return 200 duplicates instead of 301. (Technical)
2. No `BreadcrumbList` JSON-LD despite visual breadcrumbs on all 163 pages. (Schema)
3. `Product` schema lacks `offers`/`sku`/`mpn` → ineligible for rich results. (Schema/Ecommerce)
4. Mobile product-page info grid (MOQ/Packaging/Lead Time) overflows 170px on every SKU page. (Visual/UX)
5. Hero carousel: all 3 banners eager, no `fetchpriority`/preload — LCP risk. (Performance)
6. 298KB `products.js` inside main bundle, downloaded on every page. (Performance)
7. Near-duplicate sibling product copy (29 groups, ~60–70 of 148 product pages). (Content)
8. 508 unlinked sibling-model references inside spec tables. (Ecommerce/Internal linking)
9. 14/163 pages with zero JSON-LD (all category, news, about, contact). (Schema)
10. Zero certification (ISO/IATF) and buyer-question (MOQ/lead-time/OEM/shipping) content. (GEO/Content)

## Top Quick Wins

1. Resize logo → ~160px WebP (~5KB). 10 minutes, saves ~690KB per first visit.
2. Emit `BreadcrumbList` from `BreadcrumbNav.vue` — one component, 163 pages covered.
3. Emit `FAQPage` from `FaqSection.vue` — content already rendered on home + 6 categories + 4 news.
4. `fetchpriority="high"` + preload on first hero slide only; lazy-load slides 2–3.
5. Link spec-table model cells to sibling product pages (+508 exact-match internal links).
6. `grid-cols-1 sm:grid-cols-3` on the product info-box grid (mobile overflow fix).

## Category Summaries

### Technical SEO — 78
Site code is strong: perfect canonicals on all 163 pages, valid sitemap, `/search/` correctly noindex, zero mixed content, clean URLs. The serving layer is the problem: soft 404s (Critical), non-slash duplicates (High), identical lastmod stamps (Medium), no security/cache headers (host config, Medium).
→ Details: `findings/technical.md`

### Content Quality — 74
No thin product pages (404–582 words), no duplicate/missing titles, natural spec-driven copy, strong ~2,200-word articles. Issues: near-duplicate sibling descriptions (29 groups), homepage renders 3 H1s (hero carousel), 161/163 titles >60 chars, news lacks authors and product links, About lacks certifications.
→ Details: `findings/content.md`

### On-Page & Search Experience — 77
Intent mapping is clean; model-first titles match buyer queries; Quote CTA and breadcrumbs present sitewide. Issues: mobile info-grid overflow on all SKU pages (High), 508 unlinked model references (High), subcategory pages lack consolidated comparison tables — biggest featured-snippet opportunity (High), WhatsApp FAB overlaps content on mobile (Medium), 11 pages missing og:image (Low).
→ Details: `findings/sxo.md`, `findings/ecommerce.md`, `findings/visual.md`

### Schema / Structured Data — 38 (weakest area)
Existing blocks (Organization on home, Product on 148 product pages) are valid with absolute URLs, but coverage fails: no BreadcrumbList anywhere, Product ineligible for rich results (no offers/mpn), 14 pages with zero JSON-LD, visible FAQs without FAQPage markup, news without Article schema.
→ Details: `findings/schema.md`

### Performance (CWV) — 72
Strengths: route-level code splitting, 98.7% WebP, zero webfonts/third-party scripts, broad lazy loading, prerendered SSG. Issues: 696KB logo (Critical), eager hero carousel without fetchpriority (High), 298KB products.js in main bundle (High), no srcset/width/height (Medium). Localhost TTFB ~0.21s is lab-only; no compression on vite preview — re-measure on real host.
→ Details: `findings/performance.md`

### AI Search Readiness (GEO) — 72
Strengths: fully pre-rendered HTML, spec-compliant llms.txt, real HTML spec tables, consistent NAP. Gaps: zero certification content, missing MOQ/lead-time/payment/shipping answers (AI engines cannot cite the site for top buyer questions), robots.txt has no explicit AI-crawler policy, FAQ/Article schema absent.
→ Details: `findings/geo.md`

### Images — 70
100% alt coverage across 2,802 images with keyword-rich alts; 98.7% WebP; SEO-friendly filenames. Issues: oversized logo PNG (High), zero srcset (High), no width/height attributes → CLS risk (Medium).
→ Details: `findings/images.md`

## Prioritized Action Plan

### Phase 1 — Critical Fixes (Week 1)
- Emit `404.html`; configure host for real 404 status + non-slash→slash 301s.
- Resize logo to small WebP.
- Fix mobile product info-grid overflow; single H1 in hero; fetchpriority on first slide.

### Phase 2 — High-Impact (Weeks 2–3)
- BreadcrumbList JSON-LD (BreadcrumbNav.vue).
- Product schema: add mpn/brand/Offer.
- FAQPage JSON-LD (FaqSection.vue); CollectionPage + Article schema for category/news.
- Link spec-table model cells to sibling pages.
- Split search index out of main bundle (dynamic import).
- Differentiating copy for the 29 near-duplicate sibling groups.

### Phase 3 — Content & Authority (Month 2)
- Certifications/QA content (About + homepage block).
- MOQ/lead-time/OEM/shipping content (product FAQs + guide article).
- Consolidated comparison tables on 6 subcategory pages.
- News author bylines + internal links to products; trim over-long titles.

### Phase 4 — Monitoring (Ongoing)
- Re-audit on live host (headers, compression, real CWV); capture drift baseline.
- Per-page lastmod in sitemap; responsive srcset pipeline.
