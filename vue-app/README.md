# Century Auto Parts — Official Website

Official company website and product catalogue for **Hebei Century Auto Parts Co., Ltd.**, a professional manufacturer and exporter of tire repair products since 2010.

🔗 Live website: **https://centurymanufacture.com**

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Vue 3 (`<script setup>`) |
| Build / SSG | Vite + [vite-ssg](https://github.com/antfu/vite-ssg) (fully static, pre-rendered HTML) |
| Routing | Vue Router |
| SEO / Meta | @unhead/vue (per-page title, description, OG tags, canonical, JSON-LD schema) |
| Styling | Tailwind CSS |
| Icons | Inline SVG |

## ✨ Features

- **Static site generation** — 118+ pre-rendered pages with real HTML, ready for any static host
- **Complete SEO setup** — `sitemap.xml`, `robots.txt`, `llms.txt`, structured data (Organization, WebSite, Product, BreadcrumbList, Article), canonical & Open Graph tags
- **Product catalogue** — products organized by category and subcategory with image galleries, zoom and specs tables
- **Global navigation** — desktop + mobile menus, breadcrumbs, related products, pagination
- **Lead capture** — Request Quote form and WhatsApp deep links

## 🚀 Getting Started

```bash
# install dependencies
npm install

# run dev server
npm run dev          # → http://localhost:5173

# generate sitemap.xml + llms.txt
npm run gen-seo

# production build (runs gen-seo automatically, outputs to dist/)
npm run build

# preview the production build
npm run preview
```

## 📦 Deployment

This is a **completely static** site. The build output in `dist/` can be deployed to any static host or your own server (Nginx / Apache / cPanel) with no server-side runtime.

Upload the **contents** of `dist/` to your web root. See [`DEPLOY.md`](./DEPLOY.md) for details.

## 🗺 Product Categories

- Wheel Balancing Weights
- Tyre Valves (Passenger, Truck & Bus, Agricultural)
- TPMS (Tire Pressure Monitoring System)
- Tyre Seal String
- Tyre Patch
- Mushroom Patch Plug

## 📫 Contact

- **Website:** https://centurymanufacture.com
- **Email:** info@centurymanufacture.com
- **Phone / WhatsApp:** +86 15633632668

---

© Hebei Century Auto Parts Co., Ltd. All Rights Reserved.
