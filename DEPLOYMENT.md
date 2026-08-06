# 网站部署指南

## 部署步骤

### 1. 上传网站文件
使用FTP工具（如 FileZilla）或云控制台上传所有文件到服务器 `www` 或 `public_html` 目录：

```
websit/
├── index.html
├── about.html
├── products.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── css/
├── js/
└── images/
```

### 2. 域名解析
在域名服务商后台添加DNS解析记录：
- **A记录**：`@` → 服务器IP
- **CNAME**：`www` → 你的域名

### 3. 安装SSL证书（启用HTTPS）
- **阿里云/腾讯云**：控制台搜索"SSL证书" → 免费申请 → 绑定域名
- 或使用 **Let's Encrypt** 免费证书

### 4. 更新网站配置

最终域名已确定为 `centurymanufacture.com`，所有文件中已统一使用此域名。

#### robots.txt（上线前修改）
```
User-agent: *
Allow: /
Sitemap: https://centurymanufacture.com/sitemap.xml
```

### 5. 提交搜索引擎
网站上线后，访问以下链接提交：
- Google: https://search.google.com/search-console
- Bing: https://www.bing.com/webmasters

---

## 常见服务器配置

### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/yourdomain.com;
    index index.html;
}
```

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 后续维护
- 定期备份网站文件
- 保持SSL证书续期
- 监控网站访问情况