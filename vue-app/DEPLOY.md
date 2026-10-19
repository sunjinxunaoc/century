# 部署指南（自有服务器）

站点为纯静态站（vite-ssg 预渲染），所有页面都是真实 HTML，无需 Node / PHP / 数据库。

## 🚀 推荐：一键增量部署（`deploy.ps1`）

不再手动整传，本地一条命令搞定：**自动构建 → 只上传变更文件 → 自动校验 robots.txt**。

### 首次配置（一次性）
1. 复制 `deploy-config.example.json` 为 `deploy-config.json`，填入：
   - `host`：服务器 IP/域名
   - `user`：SSH 用户名
   - `port`：SSH 端口（默认 22）
   - `remote_dir`：服务器网站根目录（如 `/www/wwwroot/centurymanufacture.com`）
   - `identity_file`：SSH 私钥路径（留空用默认 `~/.ssh/id_*`）
2. 确保服务器支持 **SSH 密钥免密登录**（本机能直接 `ssh user@host` 进服务器，不需输密码）。

> `deploy-config.json` 和 `deploy-manifest.json` 已被 `.gitignore` 忽略；模板保留在 `deploy-config.example.json`。

### 日常部署
```powershell
.\deploy.ps1          # 构建 + 增量上传（只传变化文件）
.\deploy.ps1 -Full    # 强制全量重传
.\deploy.ps1 -SkipBuild   # 不重新构建，只同步（dist 已是最新时更快）
```

- 增量靠本地 `deploy-manifest.json` 记录每个文件的 大小+时间戳；没变化的文件（尤其 images/ 大图）**不会重传**。
- 脚本只操作 `vue-app/dist/`，**绝不触碰 `websit/` 父目录**。
- 上传完自动抓线上 `robots.txt` 校验是 `Allow: /`（防止误传父目录 Disallow 版本）。

### 前提
- 本机有 OpenSSH（`ssh` / `scp`，Windows 10/11 自带）。
- 无需服务器装任何额外软件。

---

## ⚠️ 防误传锁定（必读）

**只允许上传 `vue-app/dist/` 内的内容，严禁上传 `websit/` 父目录的任何文件。**

| 位置 | 状态 | 后果 |
|---|---|---|
| `websit/robots.txt`（父目录旧版） | 🔴 内容为 `Disallow: /` | 误传会让 Google 全站屏蔽，前功尽弃 |
| `websit/vue-app/dist/robots.txt` | ✅ 内容为 `Allow: /` | 唯一允许上传的版本 |
| `websit/index.html`、`about.html` 等（父目录旧版） | 🔴 旧版静态站残留 | 误传会覆盖新站 |

**上传前自检清单（每次部署必查）：**
- [ ] 确认 zip 来源是 `vue-app/dist/`，不是 `websit/` 根目录
- [ ] 解压后第一件事：打开 `robots.txt` 确认是 `Allow: /`
- [ ] 检查 `sitemap.xml` 中的 URL 都是 trailing-slash 形式（`/products/.../`），不是 `.html`
- [ ] 服务器上保留的 `.htaccess` 不要带 `Disallow` 规则

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
