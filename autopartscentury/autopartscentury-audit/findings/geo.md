# GEO Audit — AutoParts Century (autopartscentury.com)

Generative Engine Optimization readiness for AI search (ChatGPT, Perplexity, Google AI Overviews).
Research only. Sources: live fetches against http://localhost:4173, `autopartscentury-audit/crawl/pages.json` (163 pages).

## Category Score: 72 / 100

Strong technical foundation (fully pre-rendered HTML, good llms.txt, real spec tables) held back by missing schema types on most page types, absent certification/trust content, and thin buyer-logistics answers on product pages.

---

## What Works

- **Fully pre-rendered HTML.** All product, category, news, about and contact content is present in the raw HTML served to curl (SSR/`data-server-rendered`). No JS execution needed — every AI crawler (including non-rendering ones like GPTBot) sees full text.
- **llms.txt exists and largely follows the llmstxt.org spec.** H1 (`# AutoParts Century`), blockquote summary with founding year/location/scope, `## Products` section with descriptive link text per category, `## Key Models`, `## Contact` (email/phone/address), `## Pages` including all 4 news articles. Genuinely useful as an LLM site briefing.
- **Real HTML `<table>` spec tables on product detail pages.** TR414 page contains a `<table>` (62 table elements) with Model / A / B / Rim Hole / Core / Max Pressure for 9 SKUs — exactly the structured format LLMs prefer to quote.
- **Answer-first product descriptions.** e.g. "The TR414 rubber snap-in tubeless tyre valve is the most widely used passenger car valve, fitting the standard 11.5mm rim hole with A=38mm and B=48mm..." — a self-contained, citable passage.
- **Visible FAQ Q&A text in raw HTML.** Homepage (3 Q&As), category pages (2 Q&As each) and news articles (4+ Q&As) render questions and answers in the served HTML. Accordion uses `display:none` for collapsed items but text is in the DOM, so raw-HTML crawlers still read it.
- **Organization + Product JSON-LD in static HTML** on homepage and 148 product detail pages (verified in raw HTML, e.g. TR414 has `Product` schema with brand/manufacturer).
- **Consistent NAP.** Address (No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou, Hebei), phone +86 156 3363 2668 and email are identical across footer (all pages), contact page and llms.txt. "Since 2010" (header) vs "15+ Years of Manufacturing" (about) and copyright "© 2010-2026" are internally consistent.
- **News content contains concrete, citable numbers.** Wholesale guide FAQ states MOQs (10,000 pcs snap-in, 2,000–5,000 clamp-in, 30–50 SKU mixed containers), storage life (3–5 years EPDM), 80/20 snap-in/clamp-in volume split — high-value citation material.

---

## Findings

### 1. FAQPage schema missing despite visible FAQs on nearly every page
- **Severity:** High
- **Evidence:** Homepage, both category pages fetched, and the news article all render "Frequently Asked Questions" sections in HTML, but `Select-String` for `application/ld+json` on `prod1`, `prod2`, `news1`, `about`, `contact` returns NONE. Only homepage (`Organization`) and product detail pages (`Product`) carry JSON-LD (149/163 pages have schema per crawl).
- **Impact:** AI engines already do passage-level extraction, but FAQPage markup both reinforces Q&A pairing for LLMs and remains a rich-result eligibility factor. Free win left on the table.
- **Recommendation:** Emit `FAQPage` JSON-LD matching each page's visible Q&A set (home, all 6 category pages, all 4 news articles).

### 2. No Article/NewsArticle, AboutPage, ContactPage or CollectionPage schema
- **Severity:** High
- **Evidence:** `/news/tubeless-tire-valves-wholesale-guide/` (2,000+ word dated guide, 2026-09-25) has zero JSON-LD. About and contact pages have none. Category listing pages have none.
- **Impact:** News guides are the site's best citable assets; without Article schema (headline, datePublished, author, publisher) LLMs and AI Overviews get weaker freshness/authorship signals, and E-E-A-T attribution is harder.
- **Recommendation:** Add `Article` (with datePublished/dateModified/author=Organization) to news pages, `CollectionPage`+`ItemList` to category pages, `AboutPage`/`ContactPage` to respective pages.

### 3. No certification claims anywhere on the site (ISO 9001 / IATF 16949 absent)
- **Severity:** High
- **Evidence:** Grep for `ISO|IATF|certificate|certification` across home, about, both category pages and TR414 detail returned zero matches. Only trust claims are "100% Leak Tested" and "Quality Assured".
- **Impact:** "ISO certified tyre valve manufacturer China" and similar qualification queries are unanswerable from this site; competitors with certs will be cited instead. For B2B buyers this is a first-filter question.
- **Recommendation:** If certifications exist, state them explicitly on About + a Quality page with standard numbers and scope. If not, describe the actual QC regime (leak test method, aging test standard per the news article's own advice) in citable prose.

### 4. Product pages answer MOQ as "Negotiable" — no concrete numbers
- **Severity:** Medium
- **Evidence:** TR414 detail page spec sidebar: `MOQ Negotiable`, `Packaging Custom / Bulk`, `Lead Time 7-20 days`. Concrete MOQs (10,000/2,000–5,000 pcs) exist only inside one news article's FAQ.
- **Impact:** "What is the MOQ for TR414 valves?" — a top buyer question — gets a non-answer on the exact page an AI would land on. Lead time (7–20 days) is good and should be kept.
- **Recommendation:** Publish typical MOQ ranges per product family on category/detail pages (align with news article figures), plus sample availability and payment terms (T/T, LC) in a compact "Ordering" block.

### 5. No shipping, Incoterms, payment or sample-policy pages
- **Severity:** Medium
- **Evidence:** Grep for `FOB|payment|T/T|sample|warranty` found matches only inside news articles. No dedicated shipping/ordering FAQ page exists; footer claims "Global Shipping 50+ countries" without detail.
- **Impact:** Queries like "tyre valve supplier China shipping terms FOB" cannot be answered with a citable page. News prose covers freight practicalities but isn't structured as reference answers.
- **Recommendation:** Add a Shipping & Ordering FAQ page (Incoterms offered, ports, container volumes, payment methods, sample policy, warranty/claims) and link it from llms.txt and the footer.

### 6. robots.txt has no explicit AI-crawler rules
- **Severity:** Low
- **Evidence:** `User-agent: * / Allow: /` + sitemap only. No GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot or OAI-SearchBot entries.
- **Impact:** Nothing is blocked — all AI crawlers are allowed under the wildcard. This is functionally fine; explicit `Allow` rules per AI agent are increasingly used as a discoverability/intent signal and make policy auditable.
- **Recommendation:** Optionally add explicit allow blocks for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended to document intent. Not urgent.

### 7. Product schema is minimal
- **Severity:** Low
- **Evidence:** TR414 `Product` JSON-LD contains only name, description, image, brand, manufacturer. No `additionalProperty` (rim hole, A/B lengths, max pressure), no `material`, no `category`, no `url`.
- **Impact:** The same specs already exist as an HTML table (good), but structured `additionalProperty` would let AI engines align spec values with the entity more reliably.
- **Recommendation:** Extend Product schema with `url`, `category`, and `additionalProperty` entries mirroring the spec table.

### 8. About page is thin for an entity page (≈400 words)
- **Severity:** Low
- **Evidence:** Crawl `wordCount` for /about/ = 402. Content covers range, "By the Numbers" stats and commitments, but no factory details, history narrative, team, certifications or export-process description.
- **Impact:** Entity disambiguation and "who is AutoParts Century" answers are shallow; LLMs have little corroborating detail to build the brand entity from.
- **Recommendation:** Expand to 800+ words: founding story (2010), facility/capacity, QC process, export markets, OEM workflow. Reinforce with `AboutPage` schema (see finding 2).

### 9. Email domain mismatch with site domain
- **Severity:** Low
- **Evidence:** Contact email `info@centurymanufacture.com` vs site `autopartscentury.com`, used consistently everywhere including llms.txt.
- **Impact:** Minor entity-graph friction — LLMs reconciling brand identity across domains see two domains for one company. Consistent usage mitigates most of the risk.
- **Recommendation:** Note the relationship explicitly on About/Contact ("AutoParts Century is the export brand of Century Manufacture...") so the connection is stated in citable text.

### 10. llms.txt minor spec gaps
- **Severity:** Low
- **Evidence:** `/llms.txt` has H1, summary, sections and links (strong), but links point only to category-level product URLs — none of the 148 product detail pages; news links lack dates; no `## Optional` section.
- **Impact:** Category-level coverage is a reasonable size trade-off, but LLMs given llms.txt can't directly reach the spec-table pages (the most citable content).
- **Recommendation:** Add a short `## Optional` section linking the top 10–15 highest-volume model pages (TR414, TR413, V3-20-4, PVR series) — the pages with tables LLMs would quote.

---

## Citability Scores (per-page, 0–100)

| Page | Score | Evidence |
|---|---|---|
| /products/.../tr414-snap-in-tubeless-valve/ | 82 | Answer-first description, real HTML spec table (9 SKUs), MOQ/packaging/lead-time fields, Product schema. Deductions: "MOQ Negotiable" non-answer, no FAQ on detail page. |
| /products/passenger-car-light-truck-valves/ | 74 | Clear H1 + summary + checkmark list, 27 products with one-line specs, visible FAQ with direct answers. Deductions: only 2 FAQs, no schema, no MOQ numbers. |
| /news/tubeless-tire-valves-wholesale-guide/ | 88 | ~2,500 words, 14 descriptive H2s, concrete numbers (MOQs, 80/20 split, 3–5yr shelf life), FAQ with numeric answers. Deductions: H2s are statements not questions, no Article schema. |

## Top Missing Answer-Content (buyer questions AI can't answer from the site)

1. **Certifications** — "Is this factory ISO 9001 / IATF 16949 certified?" (absent everywhere)
2. **Concrete MOQ per model** — numbers exist only in one news FAQ, not on product/category pages
3. **Payment terms** — T/T, LC, PayPal, deposits: nothing
4. **Sample policy** — free samples? courier cost? lead time for samples?
5. **Shipping terms** — FOB/CIF/EXW, departure port, container capacity per valve model
6. **Warranty / claims process** — defective-rate handling, replacement policy
