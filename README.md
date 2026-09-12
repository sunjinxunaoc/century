<p align="center">
  <a href="./README_zh.md">中文</a> · <a href="./README.md"><b>English</b></a>
</p>

# Century Auto Parts — Official Website

Source code for the official company website of **Hebei Century Auto Parts Co., Ltd.**, a professional manufacturer and exporter of tire repair products since 2010.

🔗 Live website: **https://centurymanufacture.com**

---

## 📂 Repository Structure

This repository contains the source code of the website (a static site generated with Vue 3).

| Path | Description |
|------|-------------|
| `vue-app/` | Current official website source (Vue 3 + Vite + vite-ssg) |
| Root files (`index.html`, etc.) | Early static web pages (legacy) |

> The live website uses the build output from `vue-app/`. See [`vue-app/DEPLOY.md`](./vue-app/DEPLOY.md) for details.

## 🛠 Tech Stack (`vue-app/`)

| Layer | Tech |
|-------|------|
| Framework | Vue 3 (`<script setup>`) |
| Build / SSG | Vite + [vite-ssg](https://github.com/antfu/vite-ssg) (fully static, pre-rendered HTML) |
| Routing | Vue Router |
| SEO / Meta | @unhead/vue (per-page title, description, OG tags, canonical, JSON-LD schema) |
| Styling | Tailwind CSS |

## ✨ Features (`vue-app/`)

- Static site generation — 118+ pre-rendered pages for any static host
- Complete SEO setup — `sitemap.xml`, `robots.txt`, `llms.txt`, structured data (Organization, WebSite, Product, BreadcrumbList, Article), canonical & Open Graph tags
- Product catalogue — organized by category/subcategory with image galleries, zoom and spec tables
- Global navigation — desktop & mobile menus, breadcrumbs, related products, pagination
- Lead capture — Request Quote form and WhatsApp deep links

## 🚀 Getting Started

```bash
cd vue-app
npm install
npm run dev          # → http://localhost:5173
npm run gen-seo      # regenerates sitemap.xml + llms.txt
npm run build        # production build → dist/ (auto-runs gen-seo)
npm run preview      # preview the production build
```

## 📦 Deployment

A completely static site — the build output in `dist/` can be deployed to any static host or your own server (Nginx / Apache / cPanel) with no server-side runtime. Upload the **contents** of `dist/` to your web root. See [`vue-app/DEPLOY.md`](./vue-app/DEPLOY.md).

## 🗺 Product Categories

- Wheel Balancing Weights
- Tyre Valves (Passenger, Truck & Bus, Agricultural)
- TPMS (Tire Pressure Monitoring System)
- Tyre Seal String
- Tyre Patch (US & EU Style)
- Mushroom Patch Plug

## 📫 Contact

- **Website:** https://centurymanufacture.com
- **Email:** info@centurymanufacture.com
- **Phone / WhatsApp:** +86 15633632668

---

© Hebei Century Auto Parts Co., Ltd. All Rights Reserved.
