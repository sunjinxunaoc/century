# Claude SEO 技能使用指南

> 来源:`AgriciDaniel/claude-seo`(MIT 协议,作者 agricidaniel)
> 版本:v2.2.5 · 安装位置:`C:\Users\86189\.config\opencode\skills\`
> 本文档说明如何在 **opencode(Windows)** 环境中使用这个 SEO 技能。

---

## 1. 这是什么

Claude SEO 是一套面向"任意类型网站"的通用 SEO 分析技能集合,包含 **25 个子技能**(seo + 24 个 seo-* )和 **18 个分析子代理**,覆盖:

- 技术型 SEO(抓取、索引、性能 Core Web Vitals)
- 内容质量与 E-E-A-T
- Schema 结构化数据
- AI Overviews / GEO(AI 搜索优化)
- 外链分析(免费:Moz / Bing / Common Crawl;付费:DataForSEO)
- 本地 SEO、地图情报(Maps Intelligence)
- 语义聚类、电商 SEO、国际化 SEO(hreflang)
- Google 官方 API(Search Console、PageSpeed、CrUX、GA4、Indexing)
- PDF / Excel 报告生成

所有命令通过 AI 助手(本工具)执行,你只需要用自然语言或 `/seo` 命令下指令即可。

---

## 2. 已安装的内容

| 项目 | 位置 |
|------|------|
| 技能说明文件(25 个 SKILL.md) | `C:\Users\86189\.config\opencode\skills\seo*` |
| Python 脚本库(scripts/) | `...\skills\seo\scripts\` |
| 参考文档 / 模板(references、schema、pdf、data) | `...\skills\seo\` 相应子目录 |
| Windows 启动器 | `...\skills\seo\bin\claude-seo.cmd` |
| 隔离的 Python 虚拟环境 + Chromium | `...\skills\seo\.venv`(自动创建) |

**说明**:技能说明文件此前已存在于你的 opencode,本次补充了真正可运行的 Python 运行时(scripts、依赖、Chromium)并升级到 v2.2.5,让技能可以真正执行分析,而不只是给出建议。

---

## 3. 快速开始(三步)

### 第 1 步:确认运行时就绪

在 opencode 对话里直接输入:

```
/seo doctor
```

期望输出(类似):

```
Runtime: ready
Install mode: manual
Python: 3.14
Chromium: ready
```

如果显示 `setup required`,运行:

```
/seo setup
```

这会自动创建隔离环境、安装依赖和 Chromium,通常一次即可。

### 第 2 步:做一次完整站点审计(最常用)

```
/seo audit https://你的网站.com
```

技能会自动:
1. 识别业务类型(SaaS / 本地服务 / 电商 / 内容站 / 代理)
2. 并行派出多个子代理(技术、内容、Schema、性能、GEO、搜索体验等)
3. 汇总生成 **SEO 健康分(0–100)** 与分层行动清单(Critical / High / Medium / Low)
4. 分析完会询问是否生成 PDF 报告

### 第 3 步:看更多细分结果

单项命令见下节表。

---

## 4. 常用命令速查表

| 命令 | 作用 |
|------|------|
| `/seo audit <url>` | 全站完整审计(并行子代理 + 综合评分) |
| `/seo page <url>` | 单页深度分析 |
| `/seo technical <url>` | 技术 SEO 审计(9 大类:抓取、索引、安全、性能、URL、移动、结构化数据、JS 渲染、IndexNow) |
| `/seo content <url>` | E-E-A-T 与内容质量分析 |
| `/seo content-brief <主题或url>` | 生成详细 SEO 内容简报(关键词、大纲、内链) |
| `/seo schema <url>` | 检测 / 校验 / 生成 Schema.org 结构化数据 |
| `/seo sitemap <url or generate>` | 分析或生成 XML 站点地图 |
| `/seo images <url or optimize>` | 图片 SEO:页内审计、SERP、文件压缩优化 |
| `/seo technical` 相关性能 | 见 CWV(Core Web Vitals)单项 |
| `/seo geo <url>` | AI Overviews / 生成式引擎优化(GEO) |
| `/seo plan <行业类型>` | 整体 SEO 战略规划 |
| `/seo programmatic [url|plan]` | 程序化 SEO 分析与规划 |
| `/seo competitor-pages [url|generate]` | 竞品对比页生成 |
| `/seo local <url>` | 本地 SEO(Google 商家、引用、评论、地图包) |
| `/seo maps [command] [args]` | 地图情报(geo-grid、GBP 审计、评论、竞品半径) |
| `/seo hreflang [url]` | hreflang / 国际化 SEO 审计与生成 |
| `/seo google [command] [url]` | Google 官方 API 数据(GSC、PSI、CrUX、GA4、Indexing) |
| `/seo backlinks <url>` | 外链画像(免费 CSS/Moz/Bing;付费 DataForSEO) |
| `/seo cluster <种子关键词>` | SERP 语义聚类与内容架构 |
| `/seo sxo <url>` | 搜索体验优化(页型匹配、用户故事、人设评分) |
| `/seo drift baseline <url>` | 建立 SEO 基准(用于变化监控) |
| `/seo drift compare <url>` | 对比当前与历史基准 |
| `/seo drift history <url>` | 查看漂移历史 |
| `/seo ecommerce <url>` | 电商 SEO(商品 Schema、市场情报) |
| `/seo flow [stage] [url|topic]` | FLOW 框架(Find→Leverage→Optimize→Win)41 个 AI 提示词 |
| `/seo setup` | 手动重建隔离运行时 + Chromium |
| `/seo doctor` | 检查运行时是否就绪(不改动系统) |

---

## 5. 可直接对话的自然语言触发

技能说明中还内置了关键词触发,不一定要用 `/seo`:

- "帮我审计我的网站" → 触发完整审计
- "检查这个页面的 SEO" → 单页分析
- "分析一下 backlinks / 外链" → 外链分析
- "生成站点地图" → sitemap
- "做本地 SEO 分析" → local
- "这个页面怎么没排名 / 搜索体验怎么样" → sxo
- "AI 搜索可见度" → geo

你不确定用哪个命令时,直接描述你的场景和网址即可。

---

## 6. 可选扩展(需要时才开启,非必需)

以下功能需要额外安装可选扩展,本次**未安装**(不影响核心使用):

- **Firecrawl**:全站抓取与站点地图。安装 `...\skills\seo\extensions\firecrawl\...`
- **DataForSEO**:实时 SERP / 关键词 / 外链 / 本地数据(需 API Key)
- **image-gen**:AI 图片生成(Gemini,需 banana 扩展)
- **Ahrefs / Bing / ProFound / SERanking / Unlighthouse** 等

如需这些,在此文档对应技能目录的 `extensions/` 下找到各自的 `install` 脚本按说明执行。

---

## 7. 需要凭据(Token/API Key)的功能

大部分分析(审计、技术 SEO、Schema、Sitemap、内容、GEO 等)**无需任何 Key** 即可运行。以下功能需要配置后才有数据:

| 功能 | 需要的凭据 |
|------|-----------|
| `/seo google`(Search Console / GA4 / Indexing) | Google OAuth 客户端凭据 |
| `/seo backlinks`(实时外链) | Moz 或 Bing Webmaster API Key |
| `/seo dataforseo` | DataForSEO API Key + MCP |
| `/seo maps` 增强模式 | DataForSEO |

没有这些 Key 时,技能会检测到并只用免费数据源跑,不会报错中断。

---

## 8. 报表输出

- 每次完整分析默认生成 **SEO 健康分(0–100)** 和分层行动清单。
- 支持生成 **PDF 报告**(`/seo google report full` 或分析完按提示)。需 Python 依赖 weasyprint,已随 setup 装好。
- 支持 **Excel 导出**(openpyxl,用于数据类结果)。

---

## 9. 常见问题

**Q1:运行时提示 `setup required`?**
运行 `/seo setup` 一次即可完成环境创建。

**Q2:Windows 下 `claude-seo` 命令找不到?**
本环境已改用 `claude-seo.cmd` 启动器,技能脚本里的命令引用已被改写指向该启动器,无需手动加 PATH。若想手动调用:
```
& "$env:USERPROFILE\.config\opencode\skills\seo\bin\claude-seo.cmd" run <脚本名>
```

**Q3:URL 无法访问?**
技能会如实报告,不会猜测内容,请确认网址可公开访问。

**Q4:分析中断在某子技能?**
会展示其余成功部分的结结果,并提示单独重跑失败的子技能(如 `/seo technical <url>`)。

**Q5:FAQ / HowTo 结构化数据?**
技能遵循最新规则:不再推荐 HowTo Schema(2023 已废弃);FAQ 富结果已于 2026-05-07 全面停用,不再为 Google SERP 新建 FAQPage。

---

## 10. 使用建议(经验)

1. **先 `doctor` 后 `setup`**:新环境建议先确认运行时,必要时 setup。
2. **用 `audit` 打总,用单项追细节**:审计给出整体,再对问题项用 `technical` / `content` / `schema` 深入。
3. **结合自己的业务**:本地商户用 `local` + `maps`,电商用 `ecommerce`,出海站用 `hreflang`,内容站用 `cluster` + `content-brief`。
4. **长期监控**:用 `drift baseline` 建基线,之后定期 `drift compare` 看是否回退。
5. **输出到文件/报告**:需要留档时让技能生成 PDF/Excel 报告。

---

*文档由安装时自动生成,与所装技能版本(v2.2.5)一一对应。*
