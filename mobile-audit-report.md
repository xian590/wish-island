# 星愿花园 · 移动端体验与交互优化排查报告

> 排查日期：2025-01-13  
> 范围：`app.js`、`index.html`（CSS）、`js/chunks/stars.js`  
> 方法：静态代码审查 + 移动端交互模式分析

---

## 总览

| 级别 | 数量 | 说明 |
|------|------|------|
| **P1 (高)** | 2 | 直接影响滚动/布局体验，需立即修复 |
| **P2 (中)** | 4 | 影响交互细节，建议本轮修复 |
| **P3 (低)** | 0 | 无 |

---

## P1 级问题

### P1-1. 许愿星星拖拽阻断全局滚动

- **位置**: `js/chunks/stars.js:256-257`  
- **代码**:
```javascript
document.addEventListener('touchmove', onMove, { passive: false });
// onMove 中: e.preventDefault();  // line 215
```
- **影响**: 在许愿星台页面，全局 `document` 上注册了 `touchmove` 监听器且使用 `passive: false`。当用户拖动待放飞的星星时，`e.preventDefault()` 会阻断页面滚动。更严重的是，即使不拖动星星，只要触摸屏幕，事件监听器也会持续触发（虽然 `isDragging` 为 false 时直接返回，但事件仍在冒泡）。
- **触发条件**: 进入「许愿星台」页面后，任何触摸移动都会经过该事件监听器。
- **修复建议**: 将 `touchmove`/`touchend` 绑定到星星元素本身，而非 `document`；或改为仅在 `touchstart` 时动态添加 `touchmove`/`touchend` 监听器，拖拽结束后移除。

### P1-2. 100vh 视口高度在移动端 Safari/Chrome 跳动

- **位置**: `index.html:66`, `index.html:196`  
- **代码**:
```css
body { min-height: 100vh; }
.welcome-page { min-height: calc(100vh - 140px); }
```
- **影响**: 在 iOS Safari 和 Android Chrome 中，地址栏的显示/隐藏会动态改变 `100vh` 的计算值，导致页面内容出现明显跳动。特别是欢迎页 `calc(100vh - 140px)` 在地址栏收起时底部会出现空白。
- **修复建议**: 添加 `dvh` 和 `-webkit-fill-available` 后备:
```css
body { min-height: 100vh; min-height: -webkit-fill-available; min-height: 100dvh; }
.welcome-page { min-height: calc(100dvh - 140px); }
```

---

## P2 级问题

### P2-3. 缺少软键盘弹出布局适配

- **位置**: 全局缺失  
- **影响**: 当用户在移动端输入框（如日记、许愿、笔记）输入时，软键盘弹出会将页面向上推。如果输入框位于页面底部，可能被软键盘遮挡。用户需要手动滚动才能看到输入内容。
- **修复建议**: 添加 `visualViewport` 监听（现代浏览器支持），或降级到 `window.resize`:
```javascript
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      setTimeout(() => active.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  });
}
```

### P2-4. 缺少横竖屏切换适配

- **位置**: 全局缺失  
- **影响**: 用户从竖屏切换为横屏时，某些基于 `window.innerWidth` 的布局计算不会自动更新。例如欢迎页 `min-height: calc(100vh - 140px)` 在横屏时 `140px` 的偏移可能不再合适。
- **修复建议**: 添加 `orientationchange` 监听，必要时触发重新渲染:
```javascript
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (typeof renderLibrary === 'function') renderLibrary();
    if (typeof renderChallenge === 'function') renderChallenge();
  }, 300);
});
```

### P2-5. 缺少长按菜单禁用控制

- **位置**: 全局 CSS 缺失  
- **影响**: 在 iOS Safari 上长按按钮、卡片、链接会弹出系统菜单（复制、打开、分享），打断沉浸式体验。虽然已设置 `user-scalable=no` 和 `maximum-scale=1.0`，但长按菜单仍然会出现。
- **修复建议**: 为交互元素添加:
```css
button, a, .soft-btn, .chip-soft, .card-hover, .mood-emoji {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
/* 允许输入框和文本区域选择 */
input, textarea, [contenteditable] {
  -webkit-user-select: auto;
  user-select: auto;
}
```

### P2-6. 星星拖拽事件泄漏（未清理）

- **位置**: `js/chunks/stars.js:256-258`  
- **代码**:
```javascript
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('touchend', onEnd);
// 这些监听器一旦注册，永远不会被移除
```
- **影响**: `initWishStarDrag()` 在每次渲染时调用，但仅通过 `star._dragBound = true` 防止重复绑定。然而一旦绑定，即使星星被拖到天空（`hidden`）或页面切换，全局 `document` 上的事件监听器仍然存活。虽然 `isDragging` 为 false 时直接返回，但频繁的空函数调用仍有开销，且与 P1-1 的滚动阻断问题叠加。
- **修复建议**: 在 `onEnd` 中（当星星被成功拖到天空后），移除 `touchmove`/`touchend` 监听器；或使用更优雅的指针事件方案。

---

## 已验证的移动端优势

以下部分已在现有代码中正确实现，无需修改：

| 项目 | 状态 | 说明 |
|------|------|------|
| viewport 配置 | ✅ | `viewport-fit=cover`, `user-scalable=no` |
| 触摸高亮消除 | ✅ | `-webkit-tap-highlight-color: transparent` |
| touch-action | ✅ | `touch-action: manipulation` 在 body 上 |
| 最小点击区域 | ✅ | `@media (pointer: coarse) { min-height: 44px; min-width: 44px }` |
| hover 无设备优化 | ✅ | `@media (hover: none) { .card-hover:hover { transform: none } }` |
| 手势滑动返回 | ✅ | `app.js:10306-10326` 左边缘右滑返回，使用 `passive: true` |
| 下拉刷新 | ✅ | `app.js:10328-10352` 仅在顶部下拉时触发，使用 `passive: true` |
| 点击反馈 | ✅ | `app.js:10354-10371` 触觉 + 视觉 + 音效三重反馈 |
| 振动反馈 | ✅ | `vibrate()` / `vibrateFor()` 完整封装，支持低电量禁用 |
| 被动事件监听 | ✅ | 大部分 touch 事件使用 `{ passive: true }` |
| 响应式媒体查询 | ✅ | 360px / 768px / 1024px 三档适配 |

---

## 修复建议优先级

| 优先级 | 问题 | 预估工时 |
|--------|------|----------|
| **立即** | P1-1 星星拖拽改局部绑定 | 15 分钟 |
| **立即** | P1-2 100vh 改为 dvh | 5 分钟 |
| **本轮** | P2-6 拖拽事件清理 | 10 分钟 |
| **本轮** | P2-3 软键盘适配 | 20 分钟 |
| **本轮** | P2-5 长按菜单禁用 | 5 分钟 |
| **下轮** | P2-4 横竖屏切换 | 10 分钟 |

---

*报告结束*
