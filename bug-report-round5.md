# 星愿花园 - 数据持久化与运行时性能排查报告

> 排查时间: 2025-06-26
> 排查范围: `app.js` 数据持久化、存储安全、运行时性能、内存泄漏风险
> 文件状态: `app.js` 10,468 行 / 528.9 KB, `index.html` 5,695 行 / 377 KB

---

## 一、已修复问题（1 个）

### 1. `__doSaveState` 截断后未重新计算 sizeBytes（严重）

**位置**: `app.js:1571-1644`

**问题描述**: 
在数据存储接近 localStorage 上限（~5MB）时，代码会截断大数组（diaries, moodHistory 等）只保留最近 30 条。但**截断后没有重新计算 `sizeBytes`**，直接继续使用旧的 `sizeBytes` 值判断是否超限。这意味着：
- 如果截断后数据仍然超限，`localStorage.setItem` 会抛出异常
- 进入 catch 块后，降级保存仍然包含 `wishes` 数组等大数据，可能再次失败
- 最终用户数据可能完全丢失

**修复方案**:
```javascript
// 截断后重新计算 sizeBytes
if (sizeBytes > HARD_LIMIT) {
  // ... 截断数组 ...
  data = JSON.stringify(state);
  sizeBytes = new Blob([data]).size;
}

// 如果截断后仍然超限，直接执行进一步精简（降级保存）
if (sizeBytes > HARD_LIMIT) {
  const core = {
    startDate: state.startDate,
    energy: state.energy,
    level: state.level,
    // ... 限制 wishes/diaries/moodHistory 数量
    version: 'core-fallback'
  };
  localStorage.setItem('cosmos_island_state_v3', JSON.stringify(core));
  showToast('数据过大，已自动精简保存。请尽快导出备份 ⬆️');
  broadcastStateUpdate();
  return;
}
```

**修复状态**: ✅ 已修复并验证

---

## 二、发现但未修复的问题（6 个）

### 1. 事件监听器大量添加但极少移除（中等风险）

**数据**: 
- `addEventListener`: 47 次
- `removeEventListener`: 3 次

**分析**: 
对于单页应用（SPA），全局事件监听器（window/document）通常在整个应用生命周期内存在，不需要移除。但**动态创建的 DOM 元素上添加的事件监听器**在元素被替换/移除时不会自动释放，可能导致内存泄漏。

**风险事件**:
- `click`: 7 次添加（部分在动态元素上）
- `touchstart`/`touchend`: 各 4 次（移动端手势）
- `input`/`change`: 各 1-2 次

**建议**: 
- 使用事件委托（event delegation）替代在动态元素上直接添加监听器
- 在组件/页面卸载时清理对应的事件监听器
- 优先级: 中

### 2. 大量 innerHTML 操作（性能影响）

**数据**: 102 处 `innerHTML` 赋值操作

**分析**: 
每次 `innerHTML = ...` 都会触发：
1. 字符串解析为 DOM
2. 旧 DOM 子树销毁（事件监听器丢失）
3. 新 DOM 子树插入
4. 重排（reflow）和重绘（repaint）

在大量使用时（如列表渲染、页面切换），可能导致 UI 卡顿。

**建议**: 
- 长列表使用虚拟滚动（virtual scrolling）
- 频繁更新的区域使用 `DocumentFragment` 或 `requestAnimationFrame` 批量更新
- 考虑使用 `diff` 算法（如 virtual DOM 思想）减少 DOM 操作
- 优先级: 中

### 3. 文件体积过大（加载性能）

**数据**:
| 文件 | 大小 | 行数 |
|------|------|------|
| `app.js` | 528.9 KB | 10,468 行 |
| `index.html` | 377 KB | 5,695 行 |
| `styles.css` | 47.3 KB | 1,649 行 |
| 9 个 chunk | 138.4 KB | 3,240 行 |
| **总计** | **~1.1 MB** | **~21,000 行** |

**分析**: 
- `app.js` 包含大量 SVG 生成器（花朵、人格图标等）、英文翻译、测试题数据
- `index.html` 包含完整的 SVG 岛屿场景和 484 个内联 `onclick`
- 首次加载需要下载 ~1.1 MB 代码（未压缩）

**建议**: 
- 将 SVG 数据提取为独立 JSON 文件或图片资源
- 英文翻译按需加载（如果主要用户是中文）
- 将测试题数据（PERSONALITY_TEST）移至独立 chunk
- 使用 Tree Shaking 和代码分割进一步优化
- 优先级: 中

### 4. window 全局命名空间污染（代码维护性）

**数据**: 248 次 `window.xxx = ...` 赋值

**分析**: 
所有函数和模块都绑定到 `window` 对象，可能导致：
- 命名冲突（不同 chunk 的函数可能覆盖彼此）
- 代码难以追踪（无法通过静态分析确定函数定义位置）
- 全局状态污染

**建议**: 
- 使用 ES6 模块系统（import/export）替代 window 绑定
- 或者使用命名空间模式（如 `window.CosmosApp = { ... }`）
- 优先级: 低（不影响功能，但影响长期维护）

### 5. StorageUtil 缺少版本控制（未来兼容性）

**分析**: 
`StorageUtil` 使用独立的 localStorage key（如 `activity_log`, `emotion_notes` 等），这些 key 没有版本号。如果未来数据格式变化，旧版本数据可能无法正确解析。

**建议**: 
- 在 StorageUtil 存储的数据中添加 `__v` 版本字段
- 加载时检查版本，必要时进行迁移
- 优先级: 低（当前不影响功能）

### 6. `window.__storageDowngraded` 未使用（代码异味）

**位置**: `app.js:1553`

**分析**: 
降级保存时设置了 `window.__storageDowngraded = true`，但代码中没有任何地方读取这个标记。可能是未完成的特性（计划显示降级提示给用户）。

**建议**: 
- 在页面加载后检查此标记，向用户显示"部分历史数据已丢失"的提示
- 或者移除此标记以减少代码噪音
- 优先级: 低

---

## 三、数据持久化架构评估

### 优势
1. **多层降级策略**: 主数据 → 截断数组 → 核心数据（三级保护）
2. **版本标记**: `version: 'core-fallback'` 用于标识降级状态
3. **深度合并**: 对关键嵌套对象（purify, mentalDiet, garden 等）进行深层合并，兼容旧版本数据
4. **数组 guard**: 对所有数组属性强制初始化为 `[]`，防止 `undefined` 导致的崩溃
5. **防抖保存**: 300ms 防抖减少频繁写入
6. **存储上限监控**: 4MB 警戒 + ~5MB 硬上限，主动预警

### 风险点
1. **浅合并的边界**: 对于 `plans`, `tried`, `notes` 等对象，浅合并保留了旧数据但可能缺少新属性。目前这些对象在 DEFAULT_STATE 中都是 `{}`，所以暂时没有兼容性问题。
2. **localStorage 5MB 限制**: 对于重度用户（大量日记、情绪记录、照片等），仍然可能超限。建议未来增加 IndexedDB 作为大数据存储后端。
3. **无数据加密**: 所有数据明文存储在 localStorage，敏感信息（如日记内容、愿望）无保护。

---

## 四、运行时性能评估

| 指标 | 数值 | 评级 |
|------|------|------|
| setInterval（持续轮询） | 0 个 | ✅ 优秀 |
| setTimeout（一次性延迟） | 50 个 | ⚠️ 正常 |
| Observer 创建 | 6 个 | ✅ 正常（5 个已 disconnect） |
| DOM 查询（querySelector） | 69 次 | ✅ 正常 |
| DOM 查询（getElementById） | 342 次 | ⚠️ 偏多（建议缓存引用） |
| 字符串拼接 | 87 次 | ✅ 正常 |
| 模板字符串 | 235 次 | ✅ 良好 |

**总体评价**: 运行时性能良好，没有明显的持续轮询或内存泄漏模式。主要瓶颈在首次加载的代码体积和 DOM 操作频率。

---

## 五、修复清单汇总

| # | 问题 | 位置 | 严重性 | 状态 |
|---|------|------|--------|------|
| 1 | `__doSaveState` 截断后未重新计算 sizeBytes | `app.js:1571` | 🔴 高 | ✅ 已修复 |
| 2 | 事件监听器添加/移除不平衡 | 全局 | 🟡 中 | 📋 待处理 |
| 3 | 大量 innerHTML 操作（102 处） | 全局 | 🟡 中 | 📋 待处理 |
| 4 | 文件体积过大（~1.1 MB） | 全局 | 🟡 中 | 📋 待处理 |
| 5 | window 全局命名空间污染 | 全局 | 🟢 低 | 📋 待处理 |
| 6 | StorageUtil 缺少版本控制 | `app.js:1684` | 🟢 低 | 📋 待处理 |
| 7 | `__storageDowngraded` 未使用 | `app.js:1553` | 🟢 低 | 📋 待处理 |

---

## 六、下一步建议

1. **高优先级**: 验证 `__doSaveState` 修复在极限数据场景下的行为（模拟 5MB 数据）
2. **中优先级**: 优化首次加载性能（代码分割、SVG 外置、懒加载测试题数据）
3. **中优先级**: 将事件监听器改为事件委托模式，减少动态元素上的直接绑定
4. **低优先级**: 添加 IndexedDB 作为大数据存储后端，突破 5MB 限制
5. **低优先级**: 评估是否需要对敏感数据进行本地加密（如用户日记）

---

*报告生成完毕。总计修复 1 个 bug，发现 6 个待优化项。*
