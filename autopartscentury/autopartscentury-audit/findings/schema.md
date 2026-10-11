# Schema / Structured Data Audit — AutoParts Century

- **Category score: 38 / 100**
- Scope: JSON-LD only (no Microdata/RDFa found). Injection via `@unhead/vue` `useHead()` in page components.
- Sources: `autopartscentury-audit/crawl/pages.json` (163 pages), live fetches from `http://localhost:4173`, source code in `src/pages/*` and `src/components/*`.

---

## 1. Inventory (from pages.json `jsonLdTypes`, 163 pages)

| Page type | Count | JSON-LD types emitted | Source |
|---|---|---|---|
| Home `/` | 1 | `Organization` | `src/pages/index.vue:188-205` |
| Products index `/products/` | 1 | none | `src/pages/products.vue` (no useHead script) |
| Category `/products/{sub}/` | 6 | none | `src/pages/CategoryPage.vue` (no ld+json) |
| Product `/products/{sub}/{slug}/` | 149 | `Product` | `src/pages/ProductPage.vue:199-216` |
| News index `/news/` | 1 | none | `src/pages/news.vue` |
| News article `/news/{slug}/` | 4 | none | `src/pages/NewsArticle.vue` (no ld+json) |
| About `/about/` | 1 | none | `src/pages/about.vue` |
| Contact `/contact/` | 1 | none | `src/pages/contact.vue` |
| Search `/search` | 1 | none (page is `noindex` — acceptable) | `src/pages/search.vue` |

**14 of 163 pages (8.6%) have zero structured data — including every category, news, about and contact page.** No page emits more than one schema type. No `BreadcrumbList`, `FAQPage`, `Article`, `WebSite`, or `CollectionPage`/`ItemList` anywhere on the site.

## 2. Validation of live JSON-LD

### Homepage — Organization (valid JSON, parses cleanly)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AutoParts Century",
  "url": "https://autopartscentury.com/",
  "logo": "https://autopartscentury.com/images/logo/logo-icon-transparent.png",
  "contactPoint": { "@type": "ContactPoint", "telephone": "+86-156-3363-2668", "contactType": "sales", "areaServed": "Worldwide" }
}
```

- Has `name`, `url`, `logo` (absolute URL, file exists in `public/images/logo/`), `contactPoint` — meets Google Organization minimum.
- Gaps: no `@id`, no `email` (site uses `info@centurymanufacture.com` — visible on contact page but absent from schema), no `address` (full postal address exists on contact page), no `sameAs`, no `foundingDate` ("since 2010" stated in copy), `contactPoint` missing `availableLanguage` (`en`, `zh`).
- Note: the Organization block only exists on `/`. Google only requires it on one page, but repeating it sitewide (or via a shared head plugin) strengthens entity consistency — currently `/contact/` and `/about/` have no Organization at all.

### Product page (`/products/passenger-car-light-truck-valves/tr414-snap-in-tubeless-valve/`) — Product (valid JSON)

```json
{
  "@type": "Product",
  "name": "TR414 Snap-In Tubeless Valve",
  "description": "Rubber snap-in tubeless valve TR414, ... max 65psi/4.5bar.",
  "image": "https://autopartscentury.com/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp",
  "brand": { "@type": "Brand", "name": "AutoParts Century" },
  "manufacturer": { "@type": "Organization", "name": "AutoParts Century", "url": "https://autopartscentury.com/" }
}
```

- Required `name` + `image` present, absolute URLs, no placeholder values.
- **Not eligible for Product rich results**: Google requires at least one of `offers`, `review`, or `aggregateRating` — none present. Search Console will report "Missing field 'offers'/'review'/'aggregateRating'" warnings for all 149 product pages.
- Missing recommended: `sku` or `mpn` (model number e.g. "TR414" is in `name` but not extracted), `url`, `material`, `additionalProperty` (the on-page spec table data is not surfaced in schema), `image` as array (page has a multi-image gallery; only first image is emitted).
- B2B offers guidance: quote-based pricing can still use `offers` with `@type: Offer`, `url`, `availability: https://schema.org/InStock`, `businessFunction: http://purl.org/goodrelations/v1#Sell`, and `priceSpecification` with `priceCurrency` + `price` — but a hard price is required for the merchant-listing rich result, so if prices are genuinely "on request", add the Offer without price and accept the remaining warning, or accept snippet-ineligibility knowingly. Either way, add `url`, `sku`/`mpn`, and `additionalProperty`.

### News article (`/news/choosing-a-tyre-valves-manufacturer/`) — **no JSON-LD at all**

Page has everything Article schema needs in data (`src/data/news.js`: `title`, `date: "2026-09-18"` ISO, `image`, `desc`, `sections`, plus 5 FAQs) but emits nothing.

### Contact page `/contact/` — **no JSON-LD at all**

Page displays phone, email, full postal address, working hours — none of it structured. `ContactPage` + `Organization`/`LocalBusiness` with `address` (`PostalAddress`), `email`, `openingHours` would fit.

### Category page `/products/truck-bus-valves/` — **no JSON-LD at all**

Renders a visual breadcrumb and a 2-item FAQ section, but no `BreadcrumbList`, `FAQPage`, or `CollectionPage`/`ItemList`.

## 3. Errors found

| # | Severity | Issue |
|---|---|---|
| E1 | Low | No invalid JSON — all emitted blocks parse cleanly. |
| E2 | Low | No relative URLs in JSON-LD — all `image`/`url`/`logo` values are absolute. |
| E3 | Info | Logo file `logo-icon-transparent.png` is 713 KB — works, but heavy for a logo reference; consider a smaller dedicated logo asset (recommended, not an error). |
| E4 | Low | `areaServed: "Worldwide"` — accepted as text, though `"Worldwide"` is non-standard; harmless. |
| E5 | Info | `BreadcrumbNav.vue` renders visual breadcrumbs on every page but no `BreadcrumbList` — markup/structured-data mismatch (Google can infer breadcrumbs from links, but explicit markup is the reliable path). |

No wrong-nesting or placeholder-value problems detected in the two block types that exist. The problem is **coverage**, not correctness.

## 4. Missing high-value schema (B2B manufacturer)

1. **BreadcrumbList — all 163 pages.** Visual breadcrumbs exist sitewide (`BreadcrumbNav.vue`); zero `BreadcrumbList` markup. Breadcrumb rich results still display in SERPs and this is the cheapest, highest-certainty win.
2. **FAQPage — home (3 FAQs), 6 category pages (2 each), 4 news articles (5 each).** `FaqSection.vue` renders accordions with no schema. Caveat: since Aug 2023 Google shows FAQ rich results only for authoritative government/health sites, so SERP real-estate gain is unlikely — value now is entity/answer extraction for AI Overviews and other LLM surfaces. Priority lowered accordingly.
3. **Article / NewsArticle — 4 news pages.** `headline`, `image`, `datePublished` (ISO dates already in data), `author` (no author field — use `Organization`), `dateModified`, `mainEntityOfPage`. Supports Discover/Top stories-adjacent surfaces and AI citations.
4. **Product completeness — 149 pages.** Add `sku`/`mpn`, `url`, `image` array, `additionalProperty` from spec table, and decide the `offers` strategy (see §2). Currently ineligible for product snippets.
5. **Organization `sameAs` + `email` + `address` + `@id`.** No social profiles exist anywhere in the codebase (grep for facebook/linkedin/etc. = 0 hits) — `sameAs` blocked until profiles are created; `email` and `address` can be added today.
6. **WebSite + SearchAction.** `/search?q={query}` exists and works. Note: Google deprecated the sitelinks search box rich result in late 2024, so this no longer yields a SERP feature — Low priority, entity-completeness value only.
7. **CollectionPage / ItemList — category pages.** Optional; lists of `Product` `itemListElement` reinforce catalog structure. Low priority.
8. **AboutPage / ContactPage types.** Trivial additions marking page purpose.

## 5. Recommendations (priority order)

### P1 — BreadcrumbList sitewide (High)
Emit from `BreadcrumbNav.vue` (single component change covers all pages). Example for the TR414 product page:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://autopartscentury.com/" },
    { "@type": "ListItem", "position": 2, "name": "Tyre Valves", "item": "https://autopartscentury.com/products/" },
    { "@type": "ListItem", "position": 3, "name": "Passenger Car & Light Truck Valves", "item": "https://autopartscentury.com/products/passenger-car-light-truck-valves/" },
    { "@type": "ListItem", "position": 4, "name": "TR414 Snap-In Tubeless Valve" }
  ]
}
```

### P2 — Product schema completeness (High)
In `ProductPage.vue:202-214` add: `url` (canonical), `sku` (model token, e.g. `TR414`), `image` as array of gallery images, `additionalProperty` (`PropertyValue` entries from `product.spec`), and an `offers` block (`Offer` with `url`, `availability`, `itemCondition: NewCondition`, `businessFunction`) — include `priceSpecification` only if a publishable price exists; otherwise accept the "price" warning as a deliberate B2B trade-off.

### P3 — Article schema on news pages (Medium)
In `NewsArticle.vue` add `NewsArticle` with `headline` (= `title`), `image` (absolute), `datePublished` (= `date`, already ISO), `dateModified`, `author: { "@type": "Organization", "name": "AutoParts Century" }`, `publisher` (Organization with `logo`), `mainEntityOfPage` (canonical).

### P4 — Organization enrichment + reuse (Medium)
Add `@id: "https://autopartscentury.com/#org"`, `email: "info@centurymanufacture.com"`, `address` (`PostalAddress`, from contact page), `foundingDate: "2010"`, `contactPoint.availableLanguage: ["en", "zh"]`. Move the block into a shared head config so it appears sitewide; reference it via `@id` from Product `manufacturer` and Article `publisher`. Add `sameAs` once social profiles exist.

### P5 — FAQPage where FAQs render (Medium-Low — no SERP rich result since Aug 2023; AI-surface value only)
Emit `FAQPage` with `mainEntity` of `Question`/`acceptedAnswer` pairs from the same `faqs` prop inside `FaqSection.vue` (one change covers home, category, and news pages).

### P6 — Contact page LocalBusiness/Organization + ContactPage (Low)
`ContactPage` type plus `Organization` (or `LocalBusiness`/`Manufacturer` is not a schema type — use `Organization` with `PostalAddress`, `openingHours: "Mo-Sa 08:00-18:00"`, `telephone`, `email`).

### P7 — WebSite + SearchAction (Low — rich result deprecated by Google in 2024)
`WebSite` with `url`, `name`, `publisher` @id ref, and `potentialAction: SearchAction` targeting `https://autopartscentury.com/search?q={search_term_string}`. Entity-completeness only.

### P8 — Category pages: CollectionPage + ItemList (Low)
`CollectionPage` with `ItemList` of the category's products (name + url per `ListItem`). Reinforces catalog hierarchy.

---

## Summary

- **Score: 38/100** — the two schema blocks that exist (Organization, Product) are syntactically valid with absolute URLs, but coverage is the failure: no BreadcrumbList, FAQPage, Article, or WebSite anywhere; 14/163 pages (all category/news/about/contact) have zero structured data.
- **Criticals: 0** (no invalid JSON, no broken nesting, no placeholders).
- **Highs: 2** — (1) BreadcrumbList missing sitewide despite visual breadcrumbs on every page; (2) Product schema on all 149 product pages ineligible for rich results (no offers/review/aggregateRating, no sku/mpn).
- **Most important fix:** add BreadcrumbList emission inside `BreadcrumbNav.vue` — one component change instantly covers all 163 pages with a live SERP-visible rich result.
