# 星愿花园（显化岛）PWA 全面可用性审计报告

**审计主文件**: `C:\Users\Administrator\Documents\kimi\workspace\index.html`  |  `C:\Users\Administrator\Documents\kimi\workspace\app.js`

- HTML 页面节点数: 71
- init 函数数: 53
- openModule 路由数: 3
- showPage 路由数: 54
- chunk 文件数: 9

---

## 页面覆盖清单

| 页面ID | 标签 | 有init | 被showPage | 被openModule | 状态 |
|--------|------|--------|------------|--------------|------|
| `page-369` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-55x5` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-68sec` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-about` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-affirm-loop` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-ai` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-audio` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-backup` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-badge-wall` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-bootcamp` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-breathe` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-challenge` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-cleanup` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-cloud` | section | ❌ | ✅ | ✅ | ❌ 缺失 init (P0) |
| `page-coach` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-community` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-creationbox` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-diary` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-dreams` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-emoscale` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-emotion` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-garden` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-growth` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-habit-calendar` | section | ✅ | ❌ | ❌ | 💀 死页面 (有init但无路由) |
| `page-health` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-island` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-journal` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-left` | div | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-left-content` | div | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-library` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-manifest-report` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-me` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-mood-chart` | section | ✅ | ❌ | ❌ | 💀 死页面 (有init但无路由) |
| `page-movies` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-pillow` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-placemat` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-plans` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-privacy` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-prosperity` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-qr-sync` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-rampage` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-remember` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-reports` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-right` | div | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-right-content` | div | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-sats` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-search` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-shop` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-signs` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-skeleton` | div | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-sky` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-sleep` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-sp` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-stars` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-stats` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-stories` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-tarot` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-temple` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-timeline` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-timer` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-tools` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-tower` | section | ❌ | ❌ | ✅ | ❌ 缺失 init (P0) |
| `page-treasurebox` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-vip` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-vip-plans` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-vision` | section | ❌ | ❌ | ❌ | ⚠️ 未引用骨架 |
| `page-voice` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-wealth` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-welcome` | section | ❌ | ✅ | ❌ | ❌ 缺失 init (P0) |
| `page-wheel` | section | ✅ | ✅ | ❌ | ✅ 完整 |
| `page-wishwall` | section | ✅ | ✅ | ✅ | ✅ 完整 |

## 缺失 init 函数的页面 (P0)

- `page-cloud` -> 无对应 init 函数
- `page-diary` -> 无对应 init 函数
- `page-garden` -> 无对应 init 函数
- `page-journal` -> 无对应 init 函数
- `page-left` -> 无对应 init 函数
- `page-left-content` -> 无对应 init 函数
- `page-library` -> 无对应 init 函数
- `page-me` -> 无对应 init 函数
- `page-plans` -> 无对应 init 函数
- `page-qr-sync` -> 无对应 init 函数
- `page-right` -> 无对应 init 函数
- `page-right-content` -> 无对应 init 函数
- `page-skeleton` -> 无对应 init 函数
- `page-sky` -> 无对应 init 函数
- `page-stars` -> 无对应 init 函数
- `page-tarot` -> 无对应 init 函数
- `page-temple` -> 无对应 init 函数
- `page-timer` -> 无对应 init 函数
- `page-tools` -> 无对应 init 函数
- `page-tower` -> 无对应 init 函数
- `page-vision` -> 无对应 init 函数
- `page-welcome` -> 无对应 init 函数

## Chunk 懒加载检查

`__chunkFuncMap` 映射: {}

- 映射函数全部在 chunk 中定义 ✅
- 所有 chunk 文件存在 ✅

## 关键功能闭环检查

- 许愿/SP 功能: 命中 `['saveWish', 'wishes', 'manifest', 'SP', 'saveWish']`
- 情绪记录: 命中 `['saveMood', 'mood', 'emotion', 'moodHistory']`
- SATS 冥想: 命中 `['sats', 'meditation', 'satsRecord', 'satsTimer']`
- 打卡/21天挑战: 命中 `['challenge', 'streak', 'bootcamp']`
- 数据导出/导入: 命中 `['exportData', 'importData']`

**Save 函数**: ['saveAiHistory', 'saveBirthday', 'saveBootcampState', 'saveCBTDraft', 'saveCBTRecord', 'saveChallengeState', 'saveCreationBoxState', 'saveDream', 'saveDreams', 'saveEmoscaleState', 'saveEmotionNote', 'saveEmotionNotes', 'saveMagicCheck', 'saveMoodNote', 'savePillowState', 'savePillowWish', 'savePlacematDay', 'savePlacematState', 'savePlanNote', 'saveProsperityDay', 'saveProsperityState', 'saveRampageState', 'saveRemember', 'saveRememberState', 'saveReminderTime', 'saveRevisionNote', 'saveSpState', 'saveState', 'saveStateSync', 'saveStories', 'saveTimelineState', 'saveTreasureBoxState', 'saveVipState', 'saveWealthData']

**Load 函数**: ['loadAiHistory', 'loadBirthday', 'loadBootcampState', 'loadCBTDraft', 'loadChallengeState', 'loadChunk', 'loadDarkMode', 'loadDataScript', 'loadDreams', 'loadEmotionNotes', 'loadPlanNote', 'loadReportData', 'loadSpState', 'loadState', 'loadStories', 'loadVipState', 'loadWealthData']

**Render 函数**: ['renderAboutStats', 'renderAffirmLoop', 'renderAiChat', 'renderAudioScenes', 'renderBadgeWall', 'renderBreathe', 'renderCBTRecords', 'renderCardCollection', 'renderChallenge', 'renderCheckIn', 'renderCleanupList', 'renderCreationBox', 'renderDataOverview', 'renderDreamHistory', 'renderDreamSymbols', 'renderEmoscale', 'renderEmotionHistory', 'renderFortune', 'renderGrowth', 'renderHabitCalendar', 'renderHabitCalendarDetailed', 'renderHabits', 'renderHeatmap', 'renderIncomeLogs', 'renderJournalTab', 'renderMagicChecks', 'renderManifestReport', 'renderMeTab', 'renderMonthlyReport', 'renderMoodReport', 'renderMovies', 'renderPalaceAffirmations', 'renderPalaceBadges', 'renderPalaceFlowerGrid', 'renderPalaceInfo', 'renderPalaceStats', 'renderPersonalSky', 'renderPillow', 'renderPlacemat', 'renderPlanTasks', 'renderPlans', 'renderProgress', 'renderProsperity', 'renderPurifyStats', 'renderRampage', 'renderRemember', 'renderSatsScenes', 'renderSatsStep', 'renderSky', 'renderSmartRecommendations', 'renderSpAffirmations', 'renderSpScenes', 'renderStories', 'renderTasks', 'renderTemple', 'renderTestQ', 'renderTimeline', 'renderTimer', 'renderToolsTab', 'renderTower', 'renderTreasureBox', 'renderVisionCards', 'renderVoiceRecordings', 'renderWealthAffirmations', 'renderWealthSymbols', 'renderYearlySummary', 'renderZodiacCard']

**State 持久化键 (sample)**: ['activeCategory', 'affirmTime', 'animation', 'autoplay', 'cards', 'cbtDrafts', 'cbtRecords', 'currentLevel', 'currentWish', 'dailyAffirm', 'darkMode', 'darkModeAuto', 'diaries', 'emotionHistory', 'emotionLevel', 'favorites', 'habitCat', 'habitFreq', 'habitWeekdays', 'habits', 'lastDailyReset', 'mainPersona', 'manualWeather', 'meditationTime', 'memories', 'mentalDiet', 'moodHistory', 'musicOn', 'myTasks', 'nickname']


## 死页面 (HTML 存在但无路由引用)

- `page-habit-calendar`
- `page-journal`
- `page-left`
- `page-left-content`
- `page-me`
- `page-mood-chart`
- `page-plans`
- `page-qr-sync`
- `page-right`
- `page-right-content`
- `page-skeleton`
- `page-sky`
- `page-temple`
- `page-timer`
- `page-tools`
- `page-vision`

## 可能的空内容容器

- `#bg-stars-container`
- `#sky-wishes`
- `#sats-text`
- `#md-progress`
- `#md-neg-text`
- `#md-pos-text`
- `#md-calendar`
- `#affirm-subcats`
- `#affirm-list`
- `#garden-badges`
- `#course-list`
- `#bookshelf`
- `#methods-list`
- `#guide-list`
- `#lib-plans-list`
- `#media-content`
- `#wish-detail-content`
- `#tarot-card-name`
- `#tarot-card-pos`
- `#tarot-card-front`

## 优先级问题汇总

### P0 阻断 (用户会看到空白或报错)

- `page-cloud`: 有路由但无 init，页面打开后空白
- `page-diary`: 有路由但无 init，页面打开后空白
- `page-garden`: 有路由但无 init，页面打开后空白
- `page-library`: 有路由但无 init，页面打开后空白
- `page-stars`: 有路由但无 init，页面打开后空白
- `page-tarot`: 有路由但无 init，页面打开后空白
- `page-tower`: 有路由但无 init，页面打开后空白
- `page-welcome`: 有路由但无 init，页面打开后空白

### P1 重要 (功能缺失)


### P2 增强 (清理优化)

- 死页面 16 个，建议清理或补路由
- 空容器候选 38 个

## 建议修复顺序

1. **P0**: 为所有被路由引用但缺失 init 的页面补充 init 函数。
2. **P0**: 补充 openModule 缺失的 HTML section，或从路由中移除。
3. **P1**: 修复 chunk 映射和缺失文件问题。
4. **P2**: 清理死页面和空容器，减少维护负担。
