# Technical SEO Audit — AutoParts Century

**Site:** AutoParts Century (Hebei Century Auto Parts Co., Ltd.) — B2B tyre valve manufacturer catalog, English, export buyers
**Stack:** Vue 3 + vite-ssg (fully pre-rendered static HTML)
**Audited:** `http://localhost:4173` (vite preview serving production `dist/` build) + 163-page crawl (`autopartscentury-audit/crawl/pages.json`)
**Date:** 2026-10-11
**Category score: 78 / 100**

Scoring rationale: the *site code* is in excellent shape — perfect canonical coverage, valid sitemap, correct noindex on search, clean URLs, zero mixed content, solid mobile markup. The score is dragged down by the *serving layer*: every unknown or non-trailing-slash URL returns HTTP 200 with homepage content (soft 404s + duplicates), there is no static `404.html` in `dist/`, and sitemap `lastmod` dates are uniform build-date stamps. Some server items are vite-preview artifacts, but the missing `404.html` is a real build gap that will follow the site to production.

---

## What works

- **Canonicals are flawless.** 163/163 crawled pages carry a self-referencing canonical on `https://autopartscentury.com` with matching trailing slashes. Zero mismatches, zero `http://`, zero wrong-domain canonicals. Verified live on homepage, category (`/products/truck-bus-valves/`), product (`/products/truck-bus-valves/v3-20-4/`) and news pages.
- **robots.txt is correct and minimal.** `User-agent: * / Allow: /` plus a `Sitemap:` directive pointing at the production domain (`https://autopartscentury.com/sitemap.xml`).
- **Sitemap is well-formed and complete.** 163 `<url>` entries = 163 crawled pages, all absolute `https://autopartscentury.com` URLs, all trailing-slash-consistent, sensible `changefreq`/`priority` hierarchy (1.0 home → 0.9 products → 0.6 about). Served as `Content-Type: text/xml`.
- **`/search/` is correctly de-indexed.** `dist/search/index.html` ships `<meta name="robots" content="noindex, follow">` and its own title (`Product Search - AutoParts Century`). Exactly right for a utility page.
- **Zero mixed content.** All `og:image` URLs, image srcs, canonicals and schema URLs in the crawl use `https://` on the production domain. A regex scan of rendered product-page HTML found no `http://` asset references.
- **Clean URL architecture.** All 163 URLs lowercase, hyphenated, trailing-slash, zero query parameters, max depth 3 (`/products/<category>/<slug>/`). Depth distribution: 1×root, 4×level-1, 10×level-2, 148×level-3.
- **Mobile fundamentals are right.** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present; Tailwind responsive grids (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`); spec tables wrapped in `overflow-x-auto` with `min-w-[560px]` so wide size charts scroll horizontally instead of breaking layout; fixed-width elements (mega menu `w-[660px]`, sidebar `w-[224px]`) are desktop-only via `lg:block`/hover visibility.
- **`<html lang="en">` present.** Single-language site, so no hreflang required — correctly absent (self-referencing hreflang on a one-language site adds nothing).
- **llms.txt exists and is genuinely good.** Structured markdown with brand summary, six product-category links with model-number detail (TR412–TR438, PVR series, V3-20 series, etc.). A real GEO asset most competitors lack.
- **Structured data coverage.** `Product` JSON-LD on all 148 product pages, `Organization` (with telephone ContactPoint) on homepage.
- **Client-side 404 UX exists** (`src/pages/NotFound.vue` with catch-all route `/:pathMatch(.*)*` in `src/router.js:11`) — the design is there; only the HTTP status is missing (see F1).

---

## Findings

### F1 — Soft 404s: unknown URLs return HTTP 200 with homepage content
**Severity: Critical**

**Evidence:** `curl -s -o NUL -w "%{http_code}" http://localhost:4173/nonexistent-page-xyz` → **200**. The response body is the full homepage HTML (title `Tyre Valves Manufacturer | …`, canonical `https://autopartscentury.com/`). `dist/` contains **no `404.html`**, so any static host without an explicit error-page rule will do the same. Google treats these as soft 404s: they waste crawl budget, pollute the index with homepage duplicates, and can suppress real pages. Root cause: the build never emits a static 404 document — the SPA fallback serves `index.html` for everything, and the 404 UI only appears after client-side Vue Router boots (invisible to crawlers that don't render JS, and the status is wrong even when they do).

**Recommendation:** Add a static `404.html` to the build (vite-ssg: include the catch-all route in the SSG route list and output it as `404.html`, or drop a hand-built `404.html` into `public/`). Then configure the production host to serve it **with a 404 status** — Netlify/Cloudflare Pages do this automatically when `404.html` exists; Nginx needs `error_page 404 /404.html;`; S3/CloudFront needs a custom error response mapping 404 → `/404.html` with status 404. Verify post-deploy with `curl -sI https://autopartscentury.com/nonexistent-xyz | head -1` expecting `HTTP/2 404`.

### F2 — Non-trailing-slash URLs return 200 duplicates (serving homepage, not even the right page)
**Severity: High**

**Evidence:** `curl http://localhost:4173/about` (no slash) → **200** with the *homepage* document — not a 301 to `/about/`, not even the about page. Same for `/search`. So every one of the 163 pages is reachable at a second URL that serves duplicate homepage content. Canonicals on the real pages mitigate indexing of the *slash* versions, but the non-slash variants carry the homepage canonical while being linked by nothing — pure crawl-budget waste and a soft-404 farm of 163 extra URLs. This is server behavior (vite preview SPA fallback), but most static hosts replicate it unless configured.

**Recommendation:** Enforce a trailing-slash policy at the host: 301 `/about` → `/about/` (Netlify: `pretty_urls` / edge rule; Cloudflare: Bulk Redirect or Transform Rule; Nginx: `rewrite ^([^.]*[^/])$ $1/ permanent;`). Never serve content at both variants. Fixing F1's 404 handling does **not** fix this — both are needed.

### F3 — Sitemap `lastmod` is a uniform build-date stamp on all 163 URLs
**Severity: Medium**

**Evidence:** Every one of the 163 `<lastmod>` values is `2026-10-11` (build day). When all lastmods update in lockstep on every deploy, the signal says "everything changed" every time — Google explicitly discounts lastmod values it judges unreliable, so the tag becomes noise and real content updates (e.g., a revised product page) lose a genuine freshness signal.

**Recommendation:** Derive per-page `lastmod` from the content source — file mtime or last git commit date of each page's data file at build time (the sitemap is clearly build-generated already; wire it to per-route dates). If that's not feasible, drop `<lastmod>` entirely rather than shipping a uniform stamp — an absent lastmod is neutral, a junk one is negative.

### F4 — No production HTTP security/caching headers
**Severity: Medium (server config — vite preview is dev-grade; verify on production host)**

**Evidence:** `curl -sI http://localhost:4173/` returns only `Vary: Origin`, `Content-Type`, `Cache-Control: no-cache`, `ETag`. Missing: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Content-Security-Policy`, `Permissions-Policy`. Also no evidence of long-lived caching for the content-hashed `/assets/*` bundles (hashed filenames like `index-DA-GP-ga.js` are *designed* for immutable caching).

**Recommendation:** Configure at the production host (these cannot be fixed in site code):
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN          # or CSP frame-ancestors 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'
```
Plus cache rules: HTML → `Cache-Control: public, max-age=0, must-revalidate`; `/assets/*` (hashed) → `Cache-Control: public, max-age=31536000, immutable`. Start CSP in `Report-Only` mode — inline modulepreload and JSON-LD are fine, but the Vue bundle may need `script-src 'self'` verification.

### F5 — No response compression
**Severity: Low (server config)**

**Evidence:** Request with `Accept-Encoding: gzip, br` returns no `Content-Encoding` — vite preview does not compress. The homepage is 82 KB of HTML and sitemap.xml is 34 KB; brotli would cut transfer ~75%.

**Recommendation:** Enable brotli/gzip at the host (automatic on Netlify/Cloudflare; `gzip on`/`brotli on` on Nginx). No site-code change needed. Re-verify on production rather than against vite preview.

### F6 — News articles ship no Article structured data
**Severity: Low** (borderline schema-category, flagged here as technical markup)

**Evidence:** Crawl `jsonLdTypes` distribution: `Organization: 1, Product: 148` — the 14 `/news/*` article pages carry no `Article`/`NewsArticle` JSON-LD despite being dated editorial content.

**Recommendation:** Add `Article` JSON-LD (headline, datePublished, dateModified, author → Organization, image) in `src/pages/NewsArticle.vue`'s `useHead`. Supports rich-result eligibility and gives AI engines clean citation metadata — pairs well with the existing llms.txt.

### F7 — Obsolete `<meta name="keywords">` on homepage
**Severity: Low**

**Evidence:** Homepage head carries a 17-term keywords meta (`tyre valves, tyre valve, tyre valve dimensions, TR414, …`). No search engine has used this tag for ranking since 2009; it only exposes the target-keyword list to competitors.

**Recommendation:** Delete the tag from the head config. Zero SEO value, minor information leak.

### F8 — Hreflang: correctly absent (confirmation, no action)
**Severity: Info**

**Evidence:** `<html lang="en">`; no hreflang annotations anywhere in the crawl. Single-language (English) site — hreflang is not required and adding self-referencing tags would add nothing. If a Chinese or Spanish version is ever added, implement bidirectional hreflang at that time.

### F9 — Trailing-slash redirect behavior must be verified on the production host
**Severity: Info**

**Evidence:** All internal links, canonicals and sitemap URLs are consistently slash-suffixed (163/163) — the site itself never links to a non-slash variant. But per F1/F2, the *server* answers non-slash and unknown URLs with 200 instead of 301/404. On Netlify/Cloudflare Pages, directory-index serving usually 301s non-slash → slash automatically; on S3 + CloudFront or a naive Nginx config it won't. This is a deployment checklist item, not a code defect.

**Recommendation:** After go-live, run: `curl -sI https://autopartscentury.com/about` (expect 301 → `/about/`), `curl -sI https://autopartscentury.com/ABOUT/` (expect 301 → lowercase or 404), and `curl -sI https://autopartscentury.com/junk-xyz` (expect 404). Treat any 200 in those responses as a launch blocker.

---

## Priority summary

| # | Finding | Severity | Effort | Where fixed |
|---|---------|----------|--------|-------------|
| F1 | Soft 404s (200 + homepage for unknown URLs) | Critical | Low | Build (emit `404.html`) + host error-page config |
| F2 | Non-slash URLs return 200 duplicates | High | Low | Host redirect rule |
| F3 | Uniform sitemap lastmod | Medium | Low | Sitemap generator |
| F4 | Missing security/cache headers | Medium | Low | Host config |
| F5 | No compression | Low | Trivial | Host config |
| F6 | No Article schema on news | Low | Low | `NewsArticle.vue` |
| F7 | Obsolete meta keywords | Low | Trivial | Head config |

**Single most important fix:** ship a static `404.html` and configure the production host to return real 404 statuses for unknown paths (with 301s for non-slash variants). Everything else on this site is already at or near best practice.
