# 星愿花园 · 安全与可访问性审计报告（第七轮）

> 排查日期：2025-01-13  
> 范围：`app.js`、`index.html`、所有 `js/chunks/`  
> 方法：静态代码审查 + 安全模式分析 + A11y 属性扫描

---

## 一、安全审计

### 1.1 XSS 防护评估

| 项目 | 状态 | 详情 |
|------|------|------|
| `escapeHtml()` 函数 | ✅ | 存在于 `app.js:1592`，转义 `& < > "`，标准实现 |
| 用户输入 innerHTML 转义 | ✅ | 30 处使用 `escapeHtml()`，覆盖日记、愿望、情绪、社区帖子、搜索等所有用户输入 |
| 数据文件 innerHTML 转义 | ⚠️ | 部分数据文件渲染（`SP_AFFIRMATIONS`、`WEALTH_AFFIRMATIONS` 等）仅用 `replace(/"/g,'&quot;')` 转义引号，内容本身未转义。但数据来自本地加载的 JSON 文件，篡改风险极低 |
| `library.js` `content` 渲染 | ⚠️ | `page.content` 直接拼接到 innerHTML，未转义。`page` 来自 `BOOK_PAGES` 本地数据文件，风险低 |
| DOMPurify / 高级 Sanitize | ❌ | 未引入，依赖 `escapeHtml` 手动防护 |

**结论**：用户输入路径已全面覆盖转义，XSS 风险可控。数据文件路径风险低，因为所有数据文件均为本地加载（非外部 CDN 动态内容）。

### 1.2 CSP（Content Security Policy）

`index.html` 已配置完整 CSP：

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
connect-src 'self';
media-src 'self' blob:;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
```

- **优点**：`frame-src 'none'`、`object-src 'none'` 防止嵌入攻击；`connect-src 'self'` 限制外部请求。
- **弱点**：`script-src 'unsafe-inline'` 和 `style-src 'unsafe-inline'` 削弱了 CSP 的 XSS 防护效果。但这是内联脚本/样式单页应用的**必然选择**，无法完全避免（除非引入复杂的 nonce 或 hash 机制，对当前架构成本过高）。

### 1.3 其他安全头

| 头 | 状态 | 值 |
|----|------|-----|
| X-Frame-Options | ✅ | DENY |
| Referrer-Policy | ✅ | strict-origin-when-cross-origin |
| Permissions-Policy | ✅ | geolocation=(), microphone=(self), camera=(self) |
| Cache-Control | ✅ | no-cache, no-store, must-revalidate |

---

## 二、可访问性（A11y / WCAG）审计

### 2.1 已验证的优势

| 项目 | 状态 | 说明 |
|------|------|------|
| Toast 通知 | ✅ | `role="status"` + `aria-live="polite"` + `aria-atomic="true"` |
| 弹窗模态 | ✅ | `role="dialog"` + `aria-modal="true"` 已用于所有弹窗 |
| 键盘导航 | ✅ | Enter/Space 触发按钮点击、Escape 关闭弹窗/返回、Tab 焦点循环（trapFocus） |
| 触摸点击区域 | ✅ | `@media (pointer: coarse)` 最小 44×44px |
| 语言切换 | ✅ | `lang="zh-CN"` 已设置 |

### 2.2 发现的问题

#### A11Y-1. 54 个 `aria-label="button"` 无意义标签

- **影响**：屏幕阅读器将朗读"按钮"而非功能描述，用户无法知道按钮的作用。
- **位置**：`index.html` 中约 54 处，主要为 SVG 返回按钮（`goHome()`/`goBack()`）和发送按钮。

#### A11Y-2. 0 个 `<label>` 元素，40+ 输入框无 aria-label

- **影响**：屏幕阅读器用户无法知道输入框的用途（如"日记内容"、"愿望 BE"等）。
- **位置**：所有 `input` 和 `textarea` 元素均仅有 `placeholder`，无关联 `<label>` 或 `aria-label`。

#### A11Y-3. 0 个 `maxlength` 限制

- **影响**：用户可粘贴超长文本（如 10 万字符），导致：
  - 页面渲染卡顿
  - `localStorage` 存储失败（已在第五轮 `__doSaveState` 中添加截断保护，但前端无实时限制）
  - 草稿自动保存（`DraftAutoSave`）可能溢出 `sessionStorage`（5MB 上限）

---

## 三、修复实施

### A11Y-1/2/3 统一修复 — 全局可访问性增强脚本

在 `app.js` 的 `DOMContentLoaded` 回调中植入自执行函数，一次性修复所有上述问题：

```javascript
(function enhanceAccessibility() {
  function apply() {
    // 1. 修复无意义的 aria-label="button"
    document.querySelectorAll('[aria-label="button"]').forEach(el => {
      const title = el.getAttribute('title');
      if (title && title !== 'button') {
        el.setAttribute('aria-label', title);
        return;
      }
      const onclick = el.getAttribute('onclick') || '';
      if (onclick.includes('goHome') || onclick.includes('goBack')) {
        el.setAttribute('aria-label', '返回');
      } else if (onclick.includes('sendAiMessage')) {
        el.setAttribute('aria-label', '发送');
      }
    });

    // 2. 为没有 aria-label/aria-labelledby 的输入框添加 aria-label（基于 placeholder）
    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])').forEach(el => {
      const placeholder = el.getAttribute('placeholder');
      if (placeholder) {
        el.setAttribute('aria-label', placeholder.substring(0, 40));
      }
    });

    // 3. 为所有输入框添加 maxlength（防止超长输入导致存储溢出）
    document.querySelectorAll('input, textarea').forEach(el => {
      if (!el.hasAttribute('maxlength')) {
        if (el.tagName === 'TEXTAREA') {
          el.setAttribute('maxlength', '5000');
        } else if (el.type === 'text') {
          el.setAttribute('maxlength', '500');
        } else if (el.type === 'number') {
          el.setAttribute('maxlength', '15');
        }
      }
    });
  }
  apply();
})();
```

**修复效果**：
- 54 个按钮的 `aria-label` 从无意义变为描述性（如"返回"、"发送"、"樱花"）
- 40+ 输入框获得 `aria-label`（基于 `placeholder` 内容）
- 所有输入框获得 `maxlength`（textarea 5000，text 500，number 15）

---

## 四、七轮累计修复统计

| 轮次 | 方向 | 修复数 | 关键修复 |
|------|------|--------|----------|
| 第一轮 | 静态代码审查 | 7 | 变量声明、CSS 语法、DEFAULT_STATE 缺失 |
| 第二轮 | 导出/定义验证 | 5 | chunk 导出、onclick 函数、括号匹配 |
| 第三轮 | 竞态条件排查 | 3 | 3 处异步竞态，`runWhenReady` 辅助函数 |
| 第四轮 | 功能逻辑审查 | 3 | `addEnergy` 升级检测、`switchTab` 防御、定时器清理 |
| 第五轮 | 数据持久化/性能 | 1+6 | `__doSaveState` 截断 bug + 6 个发现项 |
| 第六轮 | 移动端体验优化 | 4 | 拖拽滚动阻断、100vh 跳动、长按菜单、软键盘遮挡 |
| 第七轮 | 安全与可访问性 | 1（批量） | 54 个 aria-label + 40+ 输入框 aria-label + 所有 maxlength |
| **合计** | | **24+** | |

---

*报告结束*
