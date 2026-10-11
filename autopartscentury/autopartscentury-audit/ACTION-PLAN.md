# Action Plan — AutoParts Century SEO Audit (2026-10-11)

Health score: **71/100**. Severity: Critical > High > Medium > Low.

## Critical (fix immediately)
| # | Issue | Effort | Where |
|---|-------|--------|-------|
| C1 | Soft 404: unknown URLs return 200 + homepage; no 404.html | S (code) + host config | vite.config/router + host |
| C2 | 696KB logo PNG shown at 40×40 on all pages | 10 min | public/images/logo/ |

## High (fix within 1 week)
| # | Issue | Effort | Where |
|---|-------|--------|-------|
| H1 | Non-trailing-slash URLs 200-duplicate instead of 301 | host config | host |
| H2 | No BreadcrumbList JSON-LD (163 pages have visual crumbs) | ~30 min | BreadcrumbNav.vue |
| H3 | Product schema missing offers/sku/mpn | ~1 h | ProductPage.vue |
| H4 | Mobile product info-grid overflows 170px | ~15 min | ProductPage.vue |
| H5 | Hero carousel eager + no fetchpriority | ~20 min | HeroSlider.vue |
| H6 | 298KB products.js in main bundle | ~2 h | SearchBar/SiteHeader imports → dynamic import |
| H7 | Near-duplicate sibling copy (29 groups) | content work | products.js descriptions |
| H8 | 508 unlinked sibling models in spec tables | ~1 h | SpecTable component |
| H9 | 14 pages with zero JSON-LD (category/news/about/contact) | ~2 h | CategoryPage/NewsArticle/about/contact |
| H10 | No certifications + no MOQ/lead-time/OEM/shipping content | content work | About + product FAQs |
| H11 | Zero srcset; missing width/height on images | ~2 h | img components + build step |

## Medium (within 1 month)
- All 163 sitemap lastmods identical → per-page change dates in gen-sitemap.mjs
- Security/cache headers on production host
- 161/163 titles >60 chars → trim patterns
- Homepage 3 H1s (hero carousel) → keep one (also Phase 1 quick fix)
- News: author bylines + Article schema + links to products
- About page thin (402 words), no certifications
- FAQ sections lack FAQPage markup (AI-surface value)
- WhatsApp FAB overlaps mobile content
- robots.txt: explicit AI-crawler allow policy
- Consolidated model/size comparison tables on 6 subcategory pages (biggest featured-snippet win)

## Low (backlog)
- 11 pages missing og:image → default fallback
- Φ symbol rendering mismatch (font) on some spec tables
- Hero CTA overlaps carousel dots on mobile; desktop arrow/sidebar collision
- FAQ rich results & WebSite SearchAction deprecated by Google — low priority, keep for AI surfaces

## Re-audit triggers
- After deploying to the real host (headers/compression/real CWV)
- After Phase 1–2 land (expect score 71 → mid-80s)
