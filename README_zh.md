<p align="center">
  <a href="./README_zh.md"><b>中文</b></a> · <a href="./README.md">English</a>
</p>

# Century Auto Parts — 官方网站

**Hebei Century Auto Parts Co., Ltd.** 官方公司网站与产品目录源码,一家自 2010 年起专业制造和出口轮胎维修产品的厂商。

🔗 官网: **https://centurymanufacture.com**

---

## 📂 仓库结构

本仓库包含网站的源码(基于 Vue 3 的静态生成站点)。

| 路径 | 说明 |
|------|------|
| `vue-app/` | 当前官方网站源码(Vue 3 + Vite + vite-ssg) |
| 根目录文件(`index.html` 等) | 早期静态网页版本(历史遗留) |

> 当前线上站点使用 `vue-app/` 内的构建产物。详见 [`vue-app/DEPLOY.md`](./vue-app/DEPLOY.md)。

## 🛠 技术栈(`vue-app/`)

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (`<script setup>`) |
| 构建 / SSG | Vite + [vite-ssg](https://github.com/antfu/vite-ssg)(全静态、预渲染 HTML) |
| 路由 | Vue Router |
| SEO / 元信息 | @unhead/vue(逐页 title、description、OG、canonical、JSON-LD schema) |
| 样式 | Tailwind CSS |

## ✨ 功能(`vue-app/`)

- 静态站点生成 — 118+ 个预渲染页面,可直接部署到任意静态主机
- 完整 SEO 配置 — `sitemap.xml`、`robots.txt`、`llms.txt`、结构化数据(Organization、WebSite、Product、BreadcrumbList、Article)、canonical 与 Open Graph
- 产品目录 — 按分类/子分类组织,含图片轮播、放大、规格表
- 全局导航 — 桌面/移动端菜单、面包屑、相关产品、分页
- 线索获取 — Request Quote 表单与 WhatsApp 直达链接

## 🚀 本地运行

```bash
cd vue-app
npm install
npm run dev          # → http://localhost:5173
npm run gen-seo      # 重新生成 sitemap.xml + llms.txt
npm run build        # 生产构建(输出到 dist/,自动执行 gen-seo)
npm run preview      # 预览生产构建
```

## 📦 部署

纯静态站点,`dist/` 构建产物可部署到任意静态主机或自有服务器(Nginx/Apache/cPanel),无需服务端运行时。上传 `dist/` 的**内容**到网站根目录即可,详见 [`vue-app/DEPLOY.md`](./vue-app/DEPLOY.md)。

## 🗺 产品分类

- 平衡块(Wheel Balancing Weights)
- 气门嘴(Tyre Valves — 乘用车、卡车巴士、农机)
- TPMS(胎压监测系统)
- 补胎条(Tyre Seal String)
- 补胎片(Tyre Patch — 美式与欧式)
- 蘑菇钉(Mushroom Patch Plug)

## 📫 联系方式

- **官网:** https://centurymanufacture.com
- **邮箱:** info@centurymanufacture.com
- **电话 / WhatsApp:** +86 15633632668

---

© Hebei Century Auto Parts Co., Ltd. All Rights Reserved.
