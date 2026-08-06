# SEO优化指南

## 已完成的SEO配置

### 1. Meta标签优化
每个页面都包含：
- `title` - 唯一且描述性的标题
- `meta description` - 页面内容摘要（150-160字符）
- `meta keywords` - 相关关键词
- `canonical` - 规范URL，防止重复内容

### 2. Open Graph标签
用于社交媒体分享：
- `og:title`, `og:description`, `og:type`, `og:url`

### 3. 结构化数据 (Schema.org)
已添加JSON-LD格式的：
- Organization - 公司信息
- WebSite - 网站信息（含搜索框）

### 4. 技术文件
- `robots.txt` - 指引搜索引擎抓取
- `sitemap.xml` - 站点地图，列出所有页面

### 5. 图片优化
- 使用 `alt` 属性描述图片
- 使用 `loading="lazy"` 延迟加载
- 保持合理的图片尺寸

---

## 后续维护建议

### 1. 提交搜索引擎
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 2. 添加真实Logo
将公司Logo保存为 `images/logo.png`

### 3. 定期更新内容
- 保持产品信息最新
- 添加新的产品分类
- 更新sitemap.xml中的日期

### 4. 性能优化
- 压缩图片（目标：每图 < 100KB）
- 考虑使用CDN加速

### 5. Google Analytics
建议添加Google Analytics追踪代码到每个页面底部（`</body>`之前）：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 6. 域名绑定
域名统一为 `centurymanufacture.com`，所有 canonical URL 已更新。 