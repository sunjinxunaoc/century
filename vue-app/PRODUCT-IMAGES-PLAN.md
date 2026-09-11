# 产品图统一化实施方案

> 目标：把来源杂、风格/质量/尺寸不一的图，统一成一套与站点风格一致的产品图。
> 站点：Century Auto Parts（Vue 3 + Vite + Tailwind + vite-ssg，源码在 `vue-app/`）

## 一、图片规范（统一模板）

| 项 | 规范 |
|---|---|
| 背景 | 浅灰 `#F1F3F5`（与卡片 `bg-gray-100` / 占位图一致） |
| 比例 | 4:3，输出 800×600 |
| 构图 | 产品居中、四周统一留白、轻微投影 |
| 格式 | WebP，单张 <80KB |
| 命名 | 按产品 slug：`public/images/products/<slug>.webp` |

## 二、技术选型

- 抠图：`pip install rembg`（AI 抠图，处理杂乱/实拍背景）
- 合成/裁切/投影/压缩：Python Pillow（已装 12.3.0）
- ⚠️ 风险：Python 3.14 较新，rembg 依赖的 `onnxruntime` 可能无对应 wheel
  - 兜底 A：改用 Node `@imgly/background-removal-node`（纯 JS，Node 24 支持好）
  - 兜底 B：纯色背景图用 Pillow 色差法（沿用 `replace_bg.py` 思路）

## 三、执行顺序

1. 装依赖（rembg，失败走兜底）
2. 输出 slug 清单 → 用户把图按 slug 命名放入 `raw/`
3. 写批处理脚本 → 跑图
4. 改 `src/data/products.js`（加 `image` 字段 + 回退函数）
5. 改 `ProductCard.vue` / `ProductPage.vue`（传图）
6. `npm run build` 重新生成 `dist/`
7. 抽检图片引用无 404

## 四、批处理脚本（`scripts/process-images.mjs`）

对 `raw/` 每张图：抠背景 → 合成 `#F1F3F5` → 居中留边距 → 裁 4:3 / 800×600 → 投影 → WebP(q82)
输出到 `public/images/products/`，并出报告：缺失 slug、短边<400px 的模糊图。

## 五、数据接入（`src/data/products.js`）

- 新增 `typeImages` 类型图映射表（见下表 14 张）
- 每个产品加 `image` 字段（有专属图写 `products/<slug>.webp`，缺的写类型图）
- 新增 `getProductImage()` 回退链：
  **产品图 → 类型图 → 分类图（现有 6 张 webp）→ placeholder.svg**

## 六、组件接入

- `ProductCard.vue`：已有 `image` prop，调用处传入即可
- `ProductPage.vue` 三处：
  - 产品详情主图（约 L139，现硬编码 placeholder）
  - 相关产品 `:image="r.image"`
  - 子分类网格 `:image="p.image"`

## 七、类型图兜底映射（14 张）

| 类型图 | 覆盖产品 |
|---|---|
| 粘贴钢配重块 | FE-01A / FE-02A |
| 粘贴铅配重块 | PB-01A / PB-02A |
| 卡扣钢配重块 | FE-01C ~ FE-04C |
| 卡扣铅配重块 | PB-01C ~ PB-03C |
| 橡胶卡入式气门嘴 | TR412/413/414/415 系列 |
| 黄铜压入式气门嘴 | TR570~572、V3-20、58MS、MS70-7 |
| 摩托 PVR 气门嘴 | PVR40~70 |
| 农用高压气门嘴 | TR618A / TRJ650 / TR1175A |
| 补胎胶条 | CTR-TS 系列 |
| 圆形补片 | 通用圆/方补片 |
| 子午线补片 | 径向/斜交补片 |
| 内胎补片 | 内胎/向日葵/自行车补片 |
| TPMS 传感器 | tpms 分类 |
| 蘑菇钉 | mushroom 分类 |

## 八、产品 slug 清单（43 个，供命名用）

### wheel-balancing-weights（11）
```
fe-adhesive-wheel-weight-ctr-fe-01a
steel-adhesive-wheel-weight-ctr-fe-02a
fe-clip-on-wheel-weight-alloy-rims-ctr-fe-01c
fe-clip-on-wheel-weight-fn-series-car-rims-ctr-fe-02c
fe-clip-on-wheel-weight-steel-rims-ctr-fe-03c
fe-clip-on-wheel-weight-alloy-rims-ctr-fe-04c
pb-adhesive-wheel-weight-ctr-pb-01a
lead-adhesive-wheel-weight-ctr-pb-02a
pb-clip-on-wheel-weight-steel-rims-ctr-pb-01c
pb-clip-on-wheel-weight-alloy-rims-ctr-pb-02c
pb-clip-on-wheel-weight-truck-ctr-pb-03c
```

### tyre-valves（21）
```
tr414-tyre-valve
tyre-valve-stem-tr414-tr412-tr413-tr415
tr413-tr414-valve
tr412-tr413-tr415-tr414-tyre-valve-stem
tr414c-tyre-valve-stem
pvr70-pvr60-pvr50-pvr40-valve-stem
pvr70-pvr60-pvr50-pvr40-ventil
valvula-pvr40-pvr50-pvr60-pvr70
v3-20-4-valve-stem
v3-20-4n-valve-stem
v3-20-6-valve-stem
58ms-valve
tr570-valve-stem
tr571-valve-stem
tr572-valve-stem
tr571c-valve-stem
tr572c-valve-stem
ms70-7-valve-stem
tr618a-tubeless-valve
trj650-02-03-large-bore-swivel-valve
tr1175a-tire-valve
```

### tyre-seal-string（2）
```
tire-repair-strings-rubber-strips
tire-seal-string
```

### tyre-patch（9）
```
all-purpose-repair-patch-round
radial-tire-patch-sidewall
black-radial-tire-patch
bias-ply-tire-patch
eu-style-radial-tire-patch
eu-style-bias-ply-tire-patch
all-purpose-repair-patch-round-patch
inner-tire-patch-sunflower-oval
bicycle-repair-patch
```

> 注：tpms 与 mushroom-patch-plug 无独立产品页（仅分类卡片），复用分类图即可。