# 星愿花园 · 显化岛 代码审查报告

## 审查范围
- `index.html`（5,722行，~378KB）
- `app.js`（~564KB，使用CR/CRLF/LF混合行尾）
- `data/*.js`（15个数据文件）
- `js/*.js`（track.js, test_runner.js）
- `sw.js`（Service Worker）

---

## 执行摘要

本次审查发现 **P0级致命问题3项**、**P1级高风险问题4项**、**P2级需要注意的问题3项**。其中 **45个HTML内联onclick引用的函数在全部JS文件中完全不存在**，是"点击没反应"现象的最直接、最根本原因。

---

## P0 - 致命问题（直接导致点击没反应）

### 1. 【致命】45个HTML引用的函数在全部JS文件中完全不存在 ⭐⭐⭐⭐⭐

**问题描述：**
在 `index.html` 的内联 `onclick` 属性中，有 **45个函数** 被直接引用，但这些函数在 `app.js`、`data/*.js`、`js/*.js` 以及项目根目录下的所有 `.js` 文件中**完全找不到定义**。点击这些按钮时会立即抛出 `ReferenceError: xxx is not defined`。

**完整缺失函数列表：**

| 功能领域 | 缺失函数 | 影响 |
|---------|---------|------|
| 塔罗占卜 | `drawTarot`, `resetTarot`, `selectTarotCat`, `selectTarotSpread` | 塔罗功能完全不可用 |
| 日记系统 | `saveDiary`, `newDiaryPrompt`, `selectDiaryTemplate`, `selectPaperSkin`, `showDiaryHistory`, `closeDiaryModal` | 日记无法保存/查看 |
| SATS冥想 | `startSATS`, `stopSATS`, `toggleSATS` | 冥想功能完全不可用 |
| 许愿系统 | `createWishStar`, `selectWishType`, `openNewWishModal`, `closeWishDetail` | 许愿功能不可用 |
| 图书馆/媒体 | `switchLibTab`, `switchMediaTab`, `toggleBookmark`, `toggleToc`, `nextPage`, `prevPage`, `openSearch`, `closeBookModal`, `closeBookReader`, `closeCourseModal` | 图书馆/媒体浏览不可用 |
| 情绪/练习 | `doEmotionPractice`, `setEmotionLevel`, `quickMDDiet`, `addMDDiet`, `addInspirationAction`, `switchAffirmCat` | 情绪记录和练习不可用 |
| 社区/反馈 | `submitCommunityPost`, `submitFeedback`¹, `showFeedbackModal`, `closeFeedbackModal` | 无法提交反馈或社区发帖 |
| 训练营 | `resetBootcamp`, `shareBootcampCertificate` | 训练营功能不可用 |
| 其他UI | `openAffirmModal`, `closeAffirmModal`, `addCustomAffirm`, `toggleNotePanel` | 弹窗和自定义功能不可用 |

> ¹ `submitFeedback` 在 `search_fns.js` 中有定义，但**未暴露到 `window`**，内联onclick仍然无法调用。

**为什么用户看到的是"点击没反应"而不是报错？**

`app.js` 开头设置了全局错误监听器：
```javascript
window.addEventListener('error', function(e) {
  window.__errorCount++;
  // 记录到 sessionStorage
  console.warn('[ErrorMonitor]', e.message, ...);
});
```

错误被捕获、静默记录到 `sessionStorage`、只在控制台打印警告，**用户界面没有任何反馈**。因此用户看到的是：点击按钮 → 没有任何反应 → 没有任何错误提示。

**修复建议（优先级：最高）：**

1. **立即补全缺失函数**：为每个缺失函数创建空壳函数（stub）暴露到 `window`，内部显示 "功能开发中" 提示，避免 ReferenceError：
   ```javascript
   function drawTarot() { showToast('塔罗功能即将上线'); }
   window.drawTarot = drawTarot;
   ```

2. **或者移除HTML中的引用**：如果这些功能确实不存在，从 `index.html` 中移除对应的 `onclick` 属性，避免用户点击无反应。

3. **暴露 `submitFeedback`**：在 `search_fns.js` 末尾或 `app.js` 的 window exposure 区域添加：
   ```javascript
   window.submitFeedback = submitFeedback;
   ```

---

### 2. 【致命】121个静默try-catch块吞噬初始化错误 ⭐⭐⭐⭐⭐

**问题描述：**
在 `app.js` 中发现了 **129个try-catch块**，其中 **121个** 的 `catch` 块为空、仅包含 `console` 调用、或长度小于30个字符。这意味着**绝大多数错误被静默吞掉**，不会阻止程序执行，但会导致后续代码逻辑断裂。

**最危险的try-catch：**

```javascript
// app.js 中（经CR规范化后）
try { init(); } catch(e) { console.error('init() 调用失败:', e); }
```

如果 `init()` 函数内部的任何一步出错（例如 `localStorage` 访问被拒绝、DOM元素未找到、某个依赖库未加载），整个初始化流程被中断，但页面会继续加载。结果是：
- 所有页面切换逻辑未绑定
- 所有动态内容未渲染
- 所有事件监听器未注册
- 用户点击任何按钮都**没有任何反应**

**修复建议：**
1. 在 `init()` 的 try-catch 中添加**用户可见的错误提示**：
   ```javascript
   try { init(); } catch(e) {
     console.error('init() 调用失败:', e);
     document.body.innerHTML = '<div style="padding:20px">初始化失败，请刷新页面重试</div>';
   }
   ```
2. 在关键路径的try-catch中（如localStorage读写、DOM操作）添加更详细的日志和降级处理。

---

### 3. 【致命】app.js 使用纯CR行尾（旧Mac格式）⭐⭐⭐⭐

**问题描述：**
`app.js` 使用 **纯 `\r`（CR，旧Mac OS 9格式）** 作为行尾分隔符，同时混杂了 `\n`（LF）和 `\r\n`（CRLF）。这导致：
- 许多代码编辑器和diff工具无法正确显示行号
- 本次审查中，Read工具显示文件只有68行（实际约11,000行逻辑），严重阻碍调试
- 某些旧版浏览器或特定环境下的JavaScript解析器可能处理异常
- 开发者在浏览器DevTools中看到的代码可能全部挤在一行，无法设置断点

**修复建议：**
使用工具统一转换为LF格式：
```bash
# 在Git Bash中
dos2unix app.js
# 或
sed -i 's/\r$//' app.js
```

---

## P1 - 高风险问题

### 4. 【高风险】Service Worker缓存URL不匹配 ⭐⭐⭐

**问题描述：**
`sw.js` 缓存的核心资源列表包含 `./app.js`（无查询参数），但 `index.html` 实际加载的是 `app.js?v=7`。

```javascript
// sw.js
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',      // ← 缓存这个
  // ...
];
```

```html
<!-- index.html -->
<script type="module" src="app.js?v=7"></script>  <!-- ← 请求这个 -->
```

当网络不可用时，Service Worker 的 `fetch` 回退到 `caches.match(e.request)`，由于 URL 不完全匹配（`?v=7` vs 无参数），可能无法命中缓存，导致 `app.js` 加载失败，整个应用无法运行。

**修复建议：**
1. 在 `sw.js` 的 `fetch` 处理器中，对带查询参数的JS请求进行规范化匹配：
   ```javascript
   e.respondWith(
     caches.match(e.request).catch(() => {
       return caches.match(new URL(e.request.url).pathname);
     })
   );
   ```
2. 或者将 `./app.js?v=7` 也加入 `CORE_ASSETS` 缓存列表。

---

### 5. 【高风险】24个模态框没有默认display:none（但CSS有opacity:0）⭐⭐⭐

**问题描述：**
HTML中有24个 `<div class="modal-backdrop">` 元素，它们都没有内联的 `hidden` 或 `style="display:none"` 属性。虽然CSS规则提供了默认隐藏：

```css
.modal-backdrop:not(.show) {
  opacity: 0;
  pointer-events: none;
}
```

但这依赖于：
1. CSS文件必须成功加载
2. 浏览器必须支持 `:not()` 伪类（现代浏览器都支持）
3. `show` 类不能被错误地残留

如果CSS加载失败（例如CDN阻塞、网络问题），或者JavaScript在初始化时错误地给所有modal-backdrop添加了`show`类，**24个全屏遮罩层会同时覆盖页面**，阻止所有点击事件。

**修复建议：**
在HTML中为每个modal-backdrop添加内联的默认隐藏：
```html
<div id="wish-detail-modal" class="modal-backdrop" style="display:none">
```
或者通过CSS添加：
```css
.modal-backdrop { display: none; }
.modal-backdrop.show { display: block; opacity: 1; }
```

---

### 6. 【高风险】模块顶层直接访问DOM ⭐⭐⭐

**问题描述：**
`app.js` 作为 ES Module 在模块顶层（非函数内部）直接访问了：
- `document.documentElement`（字符位置14136）
- `document.body`（字符位置14181）
- `document.head`（字符位置150521）

虽然 ES Module 默认带有 `defer` 行为（DOMContentLoaded之后执行），但如果HTML中存在某些延迟加载的资源或解析阻塞，这些访问仍可能在DOM未完全就绪时执行。虽然概率较低，但这是一个潜在的竞态条件。

**修复建议：**
将所有顶层DOM访问包装在 `if (document.readyState === 'loading')` 检查中，或确保只在DOMContentLoaded之后执行。

---

### 7. 【中风险】js/track.js 和 js/test_runner.js 在 app.js 之后加载 ⭐⭐

**问题描述：**
```html
<script type="module" src="app.js?v=7"></script>
<script src="js/track.js"></script>
<script src="js/test_runner.js"></script>
```

如果 `app.js` 的初始化逻辑依赖于这两个脚本（例如 `track.js` 需要初始化某个全局配置），但它们的加载顺序在 app.js 之后，当 app.js 执行时这两个文件可能尚未加载完成。

从代码内容看，这两个脚本使用 IIFE 封装，不直接依赖 app.js 的导出。但反过来，如果 app.js 需要它们提供的全局变量，就会出错。

**修复建议：**
确认 app.js 是否依赖 `track.js` / `test_runner.js` 的任何全局变量。如果依赖，将这两个 `<script>` 标签移到 `app.js` 之前。如果不依赖，当前顺序是安全的。

---

## P2 - 需要注意的问题

### 8. pointer-events 使用合理但需确认 ⭐

`pointer-events: none` 在7个地方使用：
- `.pointer-events-none` 工具类（合理）
- 装饰性渐变遮罩层（合理）
- 涟漪动画元素（合理）

没有发现全屏透明遮罩阻挡点击的情况。**此项无严重问题。**

---

### 9. localStorage 有充分保护 ⭐

- 23个 `localStorage.getItem`，19个 `setItem`，3个 `removeItem`，1个 `clear`
- 大多数被包裹在 try-catch 中
- 如果 localStorage 被禁用或已满，错误会被静默捕获，但功能可能降级

**建议：** 在关键读写失败时向用户显示提示（如 "浏览器存储已满，请清理数据"），而不是静默失败。

---

### 10. CSP配置正确 ⭐

`Content-Security-Policy` 包含 `'unsafe-inline'` 和 `'self'`，允许内联脚本和事件处理器正常工作。不会导致点击事件被CSP阻止。

---

## 修复优先级总表

| 优先级 | 问题 | 修复工作量 | 影响范围 |
|-------|------|----------|---------|
| **P0-1** | 45个缺失函数 | 大（需补全或移除HTML引用） | 塔罗、日记、冥想、许愿、社区、图书馆等核心功能 |
| **P0-2** | 静默try-catch吞噬init错误 | 中（添加错误提示和降级） | 整个应用初始化 |
| **P0-3** | CR行尾格式 | 小（运行dos2unix） | 开发调试、代码维护 |
| **P1-1** | Service Worker缓存不匹配 | 小（修改sw.js匹配逻辑） | 离线/弱网环境 |
| **P1-2** | Modal-backdrop默认隐藏 | 小（添加style="display:none"） | 所有弹窗功能 |
| **P1-3** | 模块顶层DOM访问 | 小（添加ready检查） | 初始化稳定性 |
| **P1-4** | 脚本加载顺序 | 小（确认依赖后调整） | 追踪和测试框架 |

---

## 结论

**"点击没反应"现象的根本原因是：**

1. **45个核心功能函数在JavaScript中完全不存在**，用户点击这些按钮时抛出 `ReferenceError`，被全局错误监听器静默捕获，用户界面没有任何反馈。

2. **121个静默try-catch块**导致任何初始化错误（包括localStorage异常、DOM查找失败、依赖库缺失）都被吞掉，如果 `init()` 失败，整个应用的事件绑定和页面渲染被跳过，用户面对的是"活着但无法交互"的页面。

3. **app.js 的CR行尾格式**导致开发调试极其困难，行号错乱，断点无法设置，进一步掩盖了上述问题。

**建议立即执行：**
1. 运行 `dos2unix app.js` 修复行尾格式
2. 为45个缺失函数创建空壳函数并暴露到 `window`，或从HTML中移除对应引用
3. 在 `init()` 的try-catch中添加用户可见的错误提示
4. 修复Service Worker缓存URL匹配

---

*报告生成时间：基于对 manifestation-island 项目的完整代码审查*
