# 部署指南（自有服务器）

站点为纯静态站（vite-ssg 预渲染），所有页面都是真实 HTML，无需 Node / PHP / 数据库。

## 部署内容

使用构建产物 `dist/` 文件夹。（已打包为 `deploy.zip`，解压后内容等同 `dist/`。）

`dist/` 内的可部署内容：
```
index.html            → 首页
about/  contact/  news/  products/   → 各页面（每个都有 index.html）
assets/              → JS/CSS（文件名带 hash，可长缓存）
images/              → 图片
404.html             → 404 错误页
robots.txt           → 让搜索引擎抓取
sitemap.xml          → 站点地图
llms.txt             → 供 AI/LLM 读取
ctr.svg              → 站点图标
```

`.vite/` 目录（ssr-manifest）是构建内部文件，**可以不上传**（或上传也无害）。

## 上传步骤

1. 用 FTP/SFTP（如 FileZilla）连接服务器。
2. 把 `deploy.zip` 解压到网站的**根目录**（如 `public_html/` 或 nginx 的 root 指向的目录）。
   - 注意：上传的是 `dist/` 的**内容**，不是 `dist` 文件夹本身。
   - 例如最终服务器上应为 `public_html/index.html`、`public_html/products/...`。
3. 清空并替换旧的网站文件（保留 `.htaccess` 如无必要可重建）。

## 服务器配置建议

### Nginx root 指向（示例）
```
root /var/www/centuryautoparts;   # 该目录下就是 index.html
index index.html;
```

### 缓存策略（可选）
- 对 `assets/` 下带 hash 的静态资源设置长期缓存（`max-age=31536000`）。
- 对 `images/`、`index.html` 设置适中缓存。
- `index.html`、`sitemap.xml`、`robots.txt`、`llms.txt`、`404.html`：`no-cache` 或短缓存，便于更新后及时生效。

### 404
由于是纯静态且所有有效 URL 都有真实文件，无需 SPA 回退。`404.html` 会自动被 Nginx/Apache 用作错误页。

### HTTPS
在服务器上为域名签发并启用 SSL 证书（Let's Encrypt / 面板自带）。

## 重新部署
1. 本地运行 `npm run build`（会自动先重新生成 sitemap/llms）。
2. 重新打包 `dist/` 并上传覆盖。

---

若需要我生成一份 Nginx 完整配置示例（含 gzip / 缓存 / 安全头），告诉我你的服务器系统和 Nginx 配置文件位置。
