# 星愿花园 · 显化岛 PWA Bug 排查报告

> 生成时间：2025-07-09
> 工作目录：`C:\Users\Administrator\Documents\kimi\manifestation-island`
> 排查范围：index.html, index-manifestation.html, app.js, styles.css, js/chunks/*.js

---

## 一、P0 级别（必须修复）

### 1. HTML 模板字符串泄漏 — 浏览器不会解析 `${...}`

| 文件 | 行号 | 问题描述 | 修复建议 |
|------|------|----------|----------|
| `index-manifestation.html` | 2773 | `onclick="toggleDistortion(${i}, this)"` 和 `data-index="${i}"` — CBT 认知歪曲选项使用 JS 模板字符串 | 改为 JS 动态生成这些元素，或在 HTML 中使用静态占位符后由 JS 填充 |
| `index-manifestation.html` | 2774 | `${d.name}` — 认知歪曲名称 | 同上 |
| `index-manifestation.html` | 2775 | `${d.desc}` — 认知歪曲描述 | 同上 |
| `index-manifestation.html` | 2776 | `${d.example \|\| ''}` — 认知歪曲示例 | 同上 |
| `index-manifestation.html` | 3701 | `onclick="toggleHabitWeekday(${i}, this)"` 和 `${d}` — 习惯星期按钮 | 改为静态 HTML 或由 JS 渲染 |
| `index-manifestation.html` | 3880 | `${HEALING_CARDS.length}` — 疗愈卡计数器 | 改为 JS 动态更新 DOM 元素 |

**影响分析**：这些模板字符串出现在纯 HTML 中（不在 `<script>` 标签内），浏览器会直接将其渲染为原始文本 `${...}`，导致：
- CBT 认知歪曲选项点击无响应（onclick 参数无效）
- 习惯星期按钮显示异常且无法切换
- 疗愈卡计数显示为 `${HEALING_CARDS.length}` 而非实际数字

### 2. 文件架构说明

- `index-manifestation.html`（977KB）为**单文件自包含版本**，所有 JS 内联在 HTML 中，未引用外部 `app.js`
- `index.html`（385KB）引用外部 `app.js` 和 `styles.css`，为**分文件版本**
- 两个版本需分别维护，内容可能不同步

**建议**：确认生产环境使用哪个版本，并在部署前对目标版本做最终验证。

---

## 二、P1 级别（建议修复）

### 3. 定时器清理机制缺失

| 文件 | 问题 | 修复建议 |
|------|------|----------|
| `app.js` | 检测到 `setInterval`/`setTimeout` 使用，但缺少统一的 `clearAllTimers` 或 `cleanupTimers` 函数 | 在 `showPage`/`__doShowPage` 页面切换时调用定时器清理，避免内存泄漏和回调错乱 |

### 4. innerHTML 模板字符串注入风险

| 文件 | 数量 | 问题 | 修复建议 |
|------|------|------|----------|
| `app.js` | 约 40+ 处 | `element.innerHTML = \`...${userInput}...\`` 模式，若数据来自用户输入可导致 XSS | 对用户输入做转义，或改用 `textContent` + `document.createElement` 拼接 |

**风险评估**：当前数据主要来源于本地 `localStorage` 和用户本机输入，XSS 风险为中低。但若未来接入社区分享等跨用户功能，此问题将升级为高危。

---

## 三、P2 级别（可优化）

### 5. CSS 变量冗余

| 文件 | 变量名 | 状态 |
|------|--------|------|
| `styles.css` | `--bg-color` | 已定义，未在 HTML/JS 中使用 |
| `styles.css` | `--theme-bg` | 已定义，未在 HTML/JS 中使用 |
| `styles.css` | `--theme-secondary` | 已定义，未在 HTML/JS 中使用 |

**建议**：清理未使用变量以减小 CSS 体积，但保留也无功能影响。

### 6. 括号/花括号计数偏差

| 文件 | 发现 | 说明 |
|------|------|------|
| `app.js` | `(` 7762 个，`)` 7763 个 | 差异极小，可能为正则表达式或字符串字面量中的括号，不一定是语法错误 |
| `app.js` | `{` 4112 个，`}` 4113 个 | 同上 |

**建议**：用 ESLint/JSHint 做一次正式语法检查以确认是否存在真正的未闭合问题。

---

## 四、正常项确认（无需修复）

| 检查项 | 状态 | 说明 |
|--------|------|------|
| `showPage` / `__doShowPage` | ✅ 存在 | 页面切换核心函数正常 |
| `saveState` / `loadState` | ✅ 存在 | 数据持久化闭环完整（基于 `localStorage`） |
| `__chunkFuncMap` | ✅ 存在 | Chunk 懒加载占位机制正常 |
| 所有 chunk 文件 `window.xxx` 挂载 | ✅ 全部已挂载 | 9 个 chunk 文件均有正确的 window 暴露 |
| CSS 变量引用一致性 | ✅ 无未定义变量 | 所有 `var(--xxx)` 均已在 styles.css 中定义 |
| HTML onclick 函数对应 | ✅ 基本完整 | 无实质缺失的全局函数（唯一例外 `console.log` 为内置对象） |

---

## 五、修复优先级总结

1. **立即修复（P0）**：`index-manifestation.html` 中的 8 处 HTML 模板字符串 `${...}` 泄漏。这是导致功能完全失效的最严重问题。
2. **本周修复（P1）**：添加统一的定时器清理函数；评估 innerHTML 注入风险并做输入过滤。
3. **排期优化（P2）**：清理冗余 CSS 变量；运行 ESLint 确认括号匹配。

---
*报告由自动化脚本生成，仅供参考，建议人工复核 P0 级别问题。*
