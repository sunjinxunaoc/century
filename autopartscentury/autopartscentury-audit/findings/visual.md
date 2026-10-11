# Visual / UX Audit — AutoPartsCentury.com

Date: 2026-10-11
Method: Playwright full-page + above-fold screenshots, desktop 1440x900 and mobile 390x844, plus DOM overflow measurement (`scrollWidth - clientWidth`) on 7 key pages. Screenshots in `../screenshots/`.

## Category Score: 82 / 100

Strong B2B catalog design: clear value proposition, consistent product imagery, persistent CTAs, complete contact/trust info. Docked points for a real mobile horizontal-overflow bug on product detail pages and recurring WhatsApp-fab content occlusion on mobile.

## What Works

- **Above-fold clarity (desktop home)**: kicker ("Tyre Valve Manufacturer"), H1, sub-copy, and dual CTAs (Browse Products / Get Quote) all visible without scroll; search bar with model-number placeholder ("e.g. TR414") speaks buyer language. (`home-desktop-fold.png`)
- **Trust signals above fold**: dark top bar with "Since 2010", email, phone on every page; 6-item capability strip (OEM/ODM, Bulk Supply, Size Charts, Leak Tested, Fast Quote, Global Export) directly under hero.
- **Mobile nav**: hamburger opens full-screen menu with search + indented category tree + all top-level links; clean, no truncation. (`home-mobile-menu.png`)
- **Product page (desktop)**: image gallery with thumbnails, spec checklist, MOQ / Packaging / Lead Time info boxes, dual CTA (Request Quote + WhatsApp Inquiry), breadcrumbs. Best-in-class for a B2B catalog. (`product-tr414-desktop-fold.png`)
- **Image consistency**: all product shots share white background, same angle/lighting, "CENTURY" watermark — looks like one coherent catalog, not scraped miscellany.
- **Footer**: full NAP (address, phone, email, hours), product/company link columns, big phone number, Send Inquiry button. Zero missing-info complaints.
- **No broken images, no layout shifts, no overlapping elements** observed on desktop across all 7 pages. Horizontal overflow = 0px on every page except product detail (below).

## Findings

### 1. Product detail pages overflow horizontally on mobile (170px)
- **Severity**: High
- **Evidence**: `product-tr414-mobile.png` — content column renders narrower than the canvas with dead space at right; the "Lead Time / 7-20 days" info box is pushed outside the card boundary. DOM check: `scrollWidth - clientWidth = 170px` on `/products/passenger-car-light-truck-valves/tr414-snap-in-tubeless-valve/` (all other pages = 0px). Likely the MOQ/Packaging/Lead Time 3-column row not collapsing to 1 column at 390px.
- **Recommendation**: Make the info-box grid responsive (`grid-cols-1 sm:grid-cols-3`) and add `min-w-0`/word-wrap on the product title block. Verify with the same overflow check across all product templates — this template likely affects every SKU page.

### 2. WhatsApp floating button occludes content on mobile
- **Severity**: Medium
- **Evidence**: `products-mobile-fold.png` (covers "View All →" link and category description text), `product-tr414-mobile.png` (covers description line "core 9... / ...ax 65psi"), `home-mobile-fold.png` (covers "Global Export" card corner), `about-mobile-fold.png` (covers body text mid-paragraph).
- **Recommendation**: Add bottom-safe padding to page content on mobile (`pb-20` or similar), or move the fab lower/right with a smaller footprint; ensure `z-index` layering never covers interactive links.

### 3. Mobile hero ghost CTA overlaps carousel pagination dots
- **Severity**: Low
- **Evidence**: `home-mobile-fold.png` — "Get Quote" outline button sits directly on top of the 3 carousel dots, making dots unreadable/unclickable.
- **Recommendation**: Increase hero bottom padding on mobile or reposition dots below the CTA row.

### 4. Desktop hero carousel prev-arrow collides with category sidebar
- **Severity**: Low
- **Evidence**: `home-desktop-fold.png` — the "<" arrow sits exactly on the seam between the dark CATEGORIES sidebar and the hero image, visually colliding with the "Agricultural & Off-Road >" row.
- **Recommendation**: Offset the arrow inside the hero bounds (e.g. `left-4` relative to hero, not the wrapper).

### 5. Mobile product H1 touches card edge
- **Severity**: Low (partly symptom of #1)
- **Evidence**: `product-tr414-mobile-fold.png` — "TR414 Snap-In Tubeless Valve" runs flush to the right edge of its container.
- **Recommendation**: Confirm horizontal padding on the product info column at small breakpoints; re-test after fixing #1.

### 6. Trust is text-only — no certification/standards badges
- **Severity**: Low (opportunity, not a defect)
- **Evidence**: All trust signals ("100% Leak Tested", "50+ countries", "Since 2010") are plain text/icon cards. No ISO 9001, DOT, or ETRTO-standard imagery anywhere in the visual sweep.
- **Recommendation**: If certifications exist, add badge images to the About page "By the Numbers" block and footer; if not, a factory/production-line photo strip on About would strengthen E-E-A-T visually (About currently uses one stock-style building hero).

## Notes

- News dates read 2026-09/10 — consistent with current date, not a stale-content issue.
- SSG-rendered pages: no CLS observed between fold and full-page captures.
