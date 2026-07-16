# 星愿花园 · 移动端体验修复总结报告

> 修复日期：2025-01-13  
> 共修复 **4 个 P1/P2 级别问题**，涉及 3 个文件

---

## 修复清单

### ✅ M1 — stars.js 星星拖拽阻断全局滚动 + 事件泄漏

- **文件**: `js/chunks/stars.js`
- **问题**: `touchmove`/`touchend` 绑定在全局 `document` 上，使用 `passive: false`，`onMove` 中调用 `e.preventDefault()`，会阻断页面滚动；且事件监听器一旦注册永不移除，造成事件泄漏。
- **修复**:
  - 将 `touchmove`/`touchend` 从 `document` 改为绑定到 `star` 元素本身
  - 在 `onStart` 中设置 `star.style.touchAction = 'none'` 禁用默认触摸行为
  - 在 `onEnd` 中恢复 `touchAction`
  - 添加 `cleanupDrag()` 函数，在星星成功拖到天空后移除所有事件监听器
- **代码变更**:
```javascript
// 之前：document.addEventListener('touchmove', onMove, { passive: false });
// 之后：star.addEventListener('touchmove', onMove, { passive: false });
// 新增 cleanupDrag() 在拖到天空后移除监听器
```

### ✅ M2 — 100vh 视口高度在移动端跳动

- **文件**: `index.html` (CSS)
- **问题**: `min-height: 100vh` 和 `calc(100vh - 140px)` 在 iOS Safari / Android Chrome 中因地址栏动态显隐导致布局跳动。
- **修复**:
  - `body`: 添加 `min-height: -webkit-fill-available` 和 `min-height: 100dvh` 后备
  - `.welcome-page`: 添加 `min-height: calc(100dvh - 140px)` 后备
- **代码变更**:
```css
body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
}
.welcome-page {
  min-height: calc(100vh - 140px);
  min-height: calc(100dvh - 140px);
}
```

### ✅ M3 — 长按系统菜单打断沉浸式体验

- **文件**: `index.html` (CSS)
- **问题**: 在 iOS Safari 上长按按钮、卡片、链接会弹出系统菜单（复制、打开、分享）。
- **修复**: 为交互元素添加 `-webkit-touch-callout: none` 和 `user-select: none`，同时允许输入框正常选择。
- **代码变更**:
```css
button, a, .soft-btn, .chip-soft, .card-hover, .mood-emoji, .step-dot, .option-card {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
input, textarea, [contenteditable] {
  -webkit-user-select: auto;
  user-select: auto;
}
```

### ✅ M4 — 软键盘弹出时输入框被遮挡

- **文件**: `app.js`
- **问题**: 移动端软键盘弹出时，底部输入框（如日记、许愿、笔记）可能被遮挡，用户需手动滚动。
- **修复**: 添加 `visualViewport` resize 监听 + `focusin` 降级方案，自动将激活的输入框滚动到可视区域中心。
- **代码变更**:
```javascript
(function initKeyboardAwareness() {
  function scrollActiveInputIntoView() {
    const active = document.activeElement;
    if (!active) return;
    if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable) {
      setTimeout(() => {
        try {
          const rect = active.getBoundingClientRect();
          const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          if (rect.bottom > viewportHeight - 80) {
            active.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (e) {}
      }, 300);
    }
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scrollActiveInputIntoView);
  }
  document.addEventListener('focusin', function(e) {
    const el = e.target;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
      setTimeout(() => scrollActiveInputIntoView(), 350);
    }
  });
})();
```

---

## 未实施项（建议下轮）

| 级别 | 问题 | 原因 |
|------|------|------|
| P2 | 横竖屏切换适配 | 当前项目无复杂横屏布局需求，且已有响应式媒体查询覆盖 360px~1024px |

---

## 验证建议

1. **stars.js 拖拽修复**: 在许愿星台页面，触摸屏幕任意位置（不触碰星星），确认页面可以正常上下滚动；拖动星星到天空后，确认页面滚动恢复正常。
2. **100vh 修复**: 在 iOS Safari 中打开欢迎页，上下滑动使地址栏显隐，确认页面无跳动。
3. **长按菜单修复**: 在 iOS Safari 上长按按钮/卡片，确认无系统菜单弹出；长按输入框内文字，确认可以正常选择。
4. **软键盘修复**: 在移动端点击底部输入框（如情绪笔记），确认软键盘弹出后输入框自动滚动到可视区域。

---

## 累计修复统计（全部六轮）

| 轮次 | 方向 | 修复数 | 关键修复 |
|------|------|--------|----------|
| 第一轮 | 静态代码审查 | 7 | 变量声明、CSS 语法、DEFAULT_STATE 缺失 |
| 第二轮 | 导出/定义验证 | 5 | chunk 导出、onclick 函数、括号匹配 |
| 第三轮 | 竞态条件排查 | 3 | 3 处异步竞态，runWhenReady 辅助函数 |
| 第四轮 | 功能逻辑审查 | 3 | addEnergy 升级检测、switchTab 防御、定时器清理 |
| 第五轮 | 数据持久化/性能 | 1+6 | __doSaveState 截断 bug + 6 个发现项 |
| 第六轮 | 移动端体验优化 | **4** | 拖拽滚动阻断、100vh 跳动、长按菜单、软键盘遮挡 |
| **合计** | | **23** | |

---

*报告结束*
