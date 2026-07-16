# 星愿花园（显化岛）PWA 全面可用性审计报告

**审计主文件**: `C:\Users\Administrator\Documents\kimi\workspace\index.html`  |  `C:\Users\Administrator\Documents\kimi\workspace\app.js`

**HTML 页面数**: 71  | **init 函数数**: 53

---

## Step 1: 页面 ID 清单
- `<div id="page-skeleton">` (有内容)
- `<section id="page-welcome">` (有内容)
- `<section id="page-island">` (有内容)
- `<section id="page-temple">` (有内容)
- `<section id="page-tower">` (有内容)
- `<section id="page-stars">` (有内容)
- `<section id="page-cloud">` (有内容)
- `<section id="page-garden">` (有内容)
- `<section id="page-diary">` (有内容)
- `<section id="page-library">` (有内容)
- `<section id="page-wishwall">` (有内容)
- `<section id="page-sky">` (有内容)
- `<section id="page-growth">` (有内容)
- `<section id="page-tarot">` (有内容)
- `<section id="page-plans">` (有内容)
- `<section id="page-timer">` (有内容)
- `<section id="page-tools">` (有内容)
- `<section id="page-journal">` (有内容)
- `<section id="page-me">` (有内容)
- `<div id="page-left">` (有内容)
- `<div id="page-left-content">` (有内容)
- `<div id="page-right">` (有内容)
- `<div id="page-right-content">` (有内容)
- `<section id="page-challenge">` (有内容)
- `<section id="page-emotion">` (有内容)
- `<section id="page-sp">` (有内容)
- `<section id="page-wealth">` (有内容)
- `<section id="page-movies">` (有内容)
- `<section id="page-ai">` (有内容)
- `<section id="page-dreams">` (有内容)
- `<section id="page-stories">` (有内容)
- `<section id="page-sats">` (有内容)
- `<section id="page-backup">` (有内容)
- `<section id="page-vip">` (有内容)
- `<section id="page-vip-plans">` (有内容)
- `<section id="page-search">` (有内容)
- `<section id="page-reports">` (有内容)
- `<section id="page-audio">` (有内容)
- `<section id="page-bootcamp">` (有内容)
- `<section id="page-community">` (有内容)
- `<section id="page-shop">` (有内容)
- `<section id="page-coach">` (有内容)
- `<section id="page-privacy">` (有内容)
- `<section id="page-breathe">` (有内容)
- `<section id="page-voice">` (有内容)
- `<section id="page-sleep">` (有内容)
- `<section id="page-mood-chart">` (有内容)
- `<section id="page-habit-calendar">` (有内容)
- `<section id="page-placemat">` (有内容)
- `<section id="page-remember">` (有内容)
- `<section id="page-creationbox">` (有内容)
- `<section id="page-rampage">` (有内容)
- `<section id="page-vision">` (有内容)
- `<section id="page-qr-sync">` (有内容)
- `<section id="page-badge-wall">` (有内容)
- `<section id="page-about">` (有内容)
- `<section id="page-health">` (有内容)
- `<section id="page-stats">` (有内容)
- `<section id="page-cleanup">` (有内容)
- `<section id="page-369">` (有内容)
- `<section id="page-55x5">` (有内容)
- `<section id="page-signs">` (有内容)
- `<section id="page-wheel">` (有内容)
- `<section id="page-68sec">` (有内容)
- `<section id="page-prosperity">` (有内容)
- `<section id="page-emoscale">` (有内容)
- `<section id="page-pillow">` (有内容)
- `<section id="page-treasurebox">` (有内容)
- `<section id="page-timeline">` (有内容)
- `<section id="page-manifest-report">` (有内容)
- `<section id="page-affirm-loop">` (有内容)

## Step 2: init 函数清单
- `initAbout()`
- `initAffirmLoop()`
- `initAi()`
- `initAudio()`
- `initAudioOnce()`
- `initAudioPage()`
- `initBackup()`
- `initBadgeWall()`
- `initBatteryAwareness()`
- `initBreathe()`
- `initBreatheAudio()`
- `initBroadcastChannel()`
- `initChallenge()`
- `initCharts()`
- `initCleanup()`
- `initConnectionAwareness()`
- `initCreationBox()`
- `initDevLog()`
- `initDreams()`
- `initEmoscale()`
- `initEmotion()`
- `initExportOptions()`
- `initGestureNavigation()`
- `initGesturesAndEffects()`
- `initHabitCalendar()`
- `initHealth()`
- `initHealthMonitor()`
- `initImageLazyLoad()`
- `initManifestReport()`
- `initMediaSession()`
- `initMoodChart()`
- `initMovies()`
- `initPillow()`
- `initPlacemat()`
- `initProsperity()`
- `initRampage()`
- `initRemember()`
- `initReports()`
- `initSats()`
- `initSettingsUI()`
- `initShakeForFortune()`
- `initSleep()`
- `initSp()`
- `initStats()`
- `initStories()`
- `initTimeline()`
- `initTreasureBox()`
- `initVip()`
- `initVisionBoard()`
- `initVisionDropZone()`
- `initVoice()`
- `initWealth()`
- `initZodiacAndBirthday()`

### ⚠️ 缺失 init 函数的页面
- `page-369`
- `page-55x5`
- `page-68sec`
- `page-bootcamp`
- `page-cloud`
- `page-coach`
- `page-community`
- `page-creationbox`
- `page-diary`
- `page-garden`
- `page-growth`
- `page-island`
- `page-journal`
- `page-left`
- `page-left-content`
- `page-library`
- `page-me`
- `page-plans`
- `page-privacy`
- `page-qr-sync`
- `page-right`
- `page-right-content`
- `page-search`
- `page-shop`
- `page-signs`
- `page-skeleton`
- `page-sky`
- `page-stars`
- `page-tarot`
- `page-temple`
- `page-timer`
- `page-tools`
- `page-tower`
- `page-treasurebox`
- `page-vip-plans`
- `page-vision`
- `page-welcome`
- `page-wheel`
- `page-wishwall`

## openModule 路由调用
- `cloud`
- `tower`
- `wishwall`

### ⚠️ openModule 调用但无 HTML 页面
- `cloud`
- `tower`
- `wishwall`

## __chunkFuncMap 映射
{}

## Step 3: Chunk 懒加载映射完整


## Chunk 加载调用
- `cloud`
- `diary`
- `garden`
- `library`
- `manifest`
- `stars`
- `tarot`
- `tools`
- `wishwall`

### ⚠️ 缺失的 chunk 文件
- `cloud`
- `diary`
- `garden`
- `library`
- `manifest`
- `stars`
- `tarot`
- `tools`
- `wishwall`

## 关键功能关键词检查
- 许愿/SP 功能: 命中 `['saveWish', 'wishes', 'manifest', 'SP']`
- 情绪记录: 命中 `['saveMood', 'mood', 'emotion', 'moodHistory']`
- SATS 冥想: 命中 `['sats', 'meditation', 'satsRecord', 'satsTimer']`
- 打卡/21天挑战: 命中 `['challenge', 'streak', 'bootcamp']`
- 数据导出/导入: 命中 `['exportData', 'importData']`

## Save 函数
- `saveAiHistory()`
- `saveBirthday()`
- `saveBootcampState()`
- `saveCBTDraft()`
- `saveCBTRecord()`
- `saveChallengeState()`
- `saveCreationBoxState()`
- `saveDream()`
- `saveDreams()`
- `saveEmoscaleState()`
- `saveEmotionNote()`
- `saveEmotionNotes()`
- `saveMagicCheck()`
- `saveMoodNote()`
- `savePillowState()`
- `savePillowWish()`
- `savePlacematDay()`
- `savePlacematState()`
- `savePlanNote()`
- `saveProsperityDay()`
- `saveProsperityState()`
- `saveRampageState()`
- `saveRemember()`
- `saveRememberState()`
- `saveReminderTime()`
- `saveRevisionNote()`
- `saveSpState()`
- `saveState()`
- `saveStateSync()`
- `saveStories()`
- `saveTimelineState()`
- `saveTreasureBoxState()`
- `saveVipState()`
- `saveWealthData()`

## Load 函数
- `loadAiHistory()`
- `loadBirthday()`
- `loadBootcampState()`
- `loadCBTDraft()`
- `loadChallengeState()`
- `loadChunk()`
- `loadDarkMode()`
- `loadDataScript()`
- `loadDreams()`
- `loadEmotionNotes()`
- `loadPlanNote()`
- `loadReportData()`
- `loadSpState()`
- `loadState()`
- `loadStories()`
- `loadVipState()`
- `loadWealthData()`

## Render 函数
- `renderAboutStats()`
- `renderAffirmLoop()`
- `renderAiChat()`
- `renderAudioScenes()`
- `renderBadgeWall()`
- `renderBreathe()`
- `renderCBTRecords()`
- `renderCardCollection()`
- `renderChallenge()`
- `renderCheckIn()`
- `renderCleanupList()`
- `renderCreationBox()`
- `renderDataOverview()`
- `renderDreamHistory()`
- `renderDreamSymbols()`
- `renderEmoscale()`
- `renderEmotionHistory()`
- `renderFortune()`
- `renderGrowth()`
- `renderHabitCalendar()`
- `renderHabitCalendarDetailed()`
- `renderHabits()`
- `renderHeatmap()`
- `renderIncomeLogs()`
- `renderJournalTab()`
- `renderMagicChecks()`
- `renderManifestReport()`
- `renderMeTab()`
- `renderMonthlyReport()`
- `renderMoodReport()`
- `renderMovies()`
- `renderPalaceAffirmations()`
- `renderPalaceBadges()`
- `renderPalaceFlowerGrid()`
- `renderPalaceInfo()`
- `renderPalaceStats()`
- `renderPersonalSky()`
- `renderPillow()`
- `renderPlacemat()`
- `renderPlanTasks()`
- `renderPlans()`
- `renderProgress()`
- `renderProsperity()`
- `renderPurifyStats()`
- `renderRampage()`
- `renderRemember()`
- `renderSatsScenes()`
- `renderSatsStep()`
- `renderSky()`
- `renderSmartRecommendations()`
- `renderSpAffirmations()`
- `renderSpScenes()`
- `renderStories()`
- `renderTasks()`
- `renderTemple()`
- `renderTestQ()`
- `renderTimeline()`
- `renderTimer()`
- `renderToolsTab()`
- `renderTower()`
- `renderTreasureBox()`
- `renderVisionCards()`
- `renderVoiceRecordings()`
- `renderWealthAffirmations()`
- `renderWealthSymbols()`
- `renderYearlySummary()`
- `renderZodiacCard()`

## State 持久化键 (sample)
- `activeCategory`
- `affirmTime`
- `animation`
- `autoplay`
- `cards`
- `cbtDrafts`
- `cbtRecords`
- `currentLevel`
- `currentWish`
- `dailyAffirm`
- `darkMode`
- `darkModeAuto`
- `diaries`
- `emotionHistory`
- `emotionLevel`
- `favorites`
- `habitCat`
- `habitFreq`
- `habitWeekdays`
- `habits`
- `lastDailyReset`
- `mainPersona`
- `manualWeather`
- `meditationTime`
- `memories`
- `mentalDiet`
- `moodHistory`
- `musicOn`
- `myTasks`
- `nickname`
- `notes`
- `notifications`
- `password`
- `passwordEnabled`
- `planNotes`
- `plans`
- `rampages`
- `remindCheckin`
- `revisionCount`
- `revisionNotes`

## showPage 调用
- `369`
- `55x5`
- `68sec`
- `about`
- `affirm-loop`
- `ai`
- `audio`
- `backup`
- `badge-wall`
- `bootcamp`
- `breathe`
- `challenge`
- `cleanup`
- `cloud`
- `coach`
- `community`
- `creationbox`
- `diary`
- `dreams`
- `emoscale`
- `emotion`
- `garden`
- `growth`
- `health`
- `island`
- `library`
- `manifest-report`
- `movies`
- `pillow`
- `placemat`
- `privacy`
- `prosperity`
- `rampage`
- `remember`
- `reports`
- `sats`
- `search`
- `shop`
- `signs`
- `sleep`
- `sp`
- `stars`
- `stats`
- `stories`
- `tarot`
- `timeline`
- `treasurebox`
- `vip`
- `vip-plans`
- `voice`
- `wealth`
- `welcome`
- `wheel`
- `wishwall`

### ⚠️ showPage 调用但无 HTML 页面
- `369`
- `55x5`
- `68sec`
- `about`
- `affirm-loop`
- `ai`
- `audio`
- `backup`
- `badge-wall`
- `bootcamp`
- `breathe`
- `challenge`
- `cleanup`
- `cloud`
- `coach`
- `community`
- `creationbox`
- `diary`
- `dreams`
- `emoscale`
- `emotion`
- `garden`
- `growth`
- `health`
- `island`
- `library`
- `manifest-report`
- `movies`
- `pillow`
- `placemat`
- `privacy`
- `prosperity`
- `rampage`
- `remember`
- `reports`
- `sats`
- `search`
- `shop`
- `signs`
- `sleep`
- `sp`
- `stars`
- `stats`
- `stories`
- `tarot`
- `timeline`
- `treasurebox`
- `vip`
- `vip-plans`
- `voice`
- `wealth`
- `welcome`
- `wheel`
- `wishwall`

### ⚠️ 未被路由引用的页面 (死代码/骨架)
- `page-369`
- `page-55x5`
- `page-68sec`
- `page-about`
- `page-affirm-loop`
- `page-ai`
- `page-audio`
- `page-backup`
- `page-badge-wall`
- `page-bootcamp`
- `page-breathe`
- `page-challenge`
- `page-cleanup`
- `page-cloud`
- `page-coach`
- `page-community`
- `page-creationbox`
- `page-diary`
- `page-dreams`
- `page-emoscale`
- `page-emotion`
- `page-garden`
- `page-growth`
- `page-habit-calendar`
- `page-health`
- `page-island`
- `page-journal`
- `page-left`
- `page-left-content`
- `page-library`
- `page-manifest-report`
- `page-me`
- `page-mood-chart`
- `page-movies`
- `page-pillow`
- `page-placemat`
- `page-plans`
- `page-privacy`
- `page-prosperity`
- `page-qr-sync`
- `page-rampage`
- `page-remember`
- `page-reports`
- `page-right`
- `page-right-content`
- `page-sats`
- `page-search`
- `page-shop`
- `page-signs`
- `page-skeleton`
- `page-sky`
- `page-sleep`
- `page-sp`
- `page-stars`
- `page-stats`
- `page-stories`
- `page-tarot`
- `page-temple`
- `page-timeline`
- `page-timer`
- `page-tools`
- `page-tower`
- `page-treasurebox`
- `page-vip`
- `page-vip-plans`
- `page-vision`
- `page-voice`
- `page-wealth`
- `page-welcome`
- `page-wheel`
- `page-wishwall`

### ⚠️ 可能的空内容容器
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

## 页面覆盖清单

| 页面ID | 有HTML | 有init | 被路由引用 | 状态 |
|--------|--------|--------|------------|------|
| `page-skeleton` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-welcome` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-island` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-temple` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-tower` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-stars` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-cloud` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-garden` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-diary` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-library` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-wishwall` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-sky` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-growth` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-tarot` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-plans` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-timer` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-tools` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-journal` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-me` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-left` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-left-content` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-right` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-right-content` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-challenge` | ✅ | ✅ | ❌ | ✅ |
| `page-emotion` | ✅ | ✅ | ❌ | ✅ |
| `page-sp` | ✅ | ✅ | ❌ | ✅ |
| `page-wealth` | ✅ | ✅ | ❌ | ✅ |
| `page-movies` | ✅ | ✅ | ❌ | ✅ |
| `page-ai` | ✅ | ✅ | ❌ | ✅ |
| `page-dreams` | ✅ | ✅ | ❌ | ✅ |
| `page-stories` | ✅ | ✅ | ❌ | ✅ |
| `page-sats` | ✅ | ✅ | ❌ | ✅ |
| `page-backup` | ✅ | ✅ | ❌ | ✅ |
| `page-vip` | ✅ | ✅ | ❌ | ✅ |
| `page-vip-plans` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-search` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-reports` | ✅ | ✅ | ❌ | ✅ |
| `page-audio` | ✅ | ✅ | ❌ | ✅ |
| `page-bootcamp` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-community` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-shop` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-coach` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-privacy` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-breathe` | ✅ | ✅ | ❌ | ✅ |
| `page-voice` | ✅ | ✅ | ❌ | ✅ |
| `page-sleep` | ✅ | ✅ | ❌ | ✅ |
| `page-mood-chart` | ✅ | ✅ | ❌ | ✅ |
| `page-habit-calendar` | ✅ | ✅ | ❌ | ✅ |
| `page-placemat` | ✅ | ✅ | ❌ | ✅ |
| `page-remember` | ✅ | ✅ | ❌ | ✅ |
| `page-creationbox` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-rampage` | ✅ | ✅ | ❌ | ✅ |
| `page-vision` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-qr-sync` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-badge-wall` | ✅ | ✅ | ❌ | ✅ |
| `page-about` | ✅ | ✅ | ❌ | ✅ |
| `page-health` | ✅ | ✅ | ❌ | ✅ |
| `page-stats` | ✅ | ✅ | ❌ | ✅ |
| `page-cleanup` | ✅ | ✅ | ❌ | ✅ |
| `page-369` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-55x5` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-signs` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-wheel` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-68sec` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-prosperity` | ✅ | ✅ | ❌ | ✅ |
| `page-emoscale` | ✅ | ✅ | ❌ | ✅ |
| `page-pillow` | ✅ | ✅ | ❌ | ✅ |
| `page-treasurebox` | ✅ | ❌ | ❌ | 💀 死页面 |
| `page-timeline` | ✅ | ✅ | ❌ | ✅ |
| `page-manifest-report` | ✅ | ✅ | ❌ | ✅ |
| `page-affirm-loop` | ✅ | ✅ | ❌ | ✅ |
| `cloud` | ❌ | ? | ✅ | ⚠️ 路由无HTML |
| `tower` | ❌ | ? | ✅ | ⚠️ 路由无HTML |
| `wishwall` | ❌ | ? | ✅ | ⚠️ 路由无HTML |

## 优先级问题汇总

### P0 阻断 (用户会看到空白/报错)
- page-369
- page-55x5
- page-68sec
- page-bootcamp
- page-cloud
- page-coach
- page-community
- page-creationbox
- page-diary
- page-garden
- page-growth
- page-island
- page-journal
- page-left
- page-left-content
- page-library
- page-me
- page-plans
- page-privacy
- page-qr-sync
- page-right
- page-right-content
- page-search
- page-shop
- page-signs
- page-skeleton
- page-sky
- page-stars
- page-tarot
- page-temple
- page-timer
- page-tools
- page-tower
- page-treasurebox
- page-vip-plans
- page-vision
- page-welcome
- page-wheel
- page-wishwall
- showPage 无HTML: 369
- showPage 无HTML: 55x5
- showPage 无HTML: 68sec
- showPage 无HTML: about
- showPage 无HTML: affirm-loop
- showPage 无HTML: ai
- showPage 无HTML: audio
- showPage 无HTML: backup
- showPage 无HTML: badge-wall
- showPage 无HTML: bootcamp
- showPage 无HTML: breathe
- showPage 无HTML: challenge
- showPage 无HTML: cleanup
- showPage 无HTML: cloud
- showPage 无HTML: coach
- showPage 无HTML: community
- showPage 无HTML: creationbox
- showPage 无HTML: diary
- showPage 无HTML: dreams
- showPage 无HTML: emoscale
- showPage 无HTML: emotion
- showPage 无HTML: garden
- showPage 无HTML: growth
- showPage 无HTML: health
- showPage 无HTML: island
- showPage 无HTML: library
- showPage 无HTML: manifest-report
- showPage 无HTML: movies
- showPage 无HTML: pillow
- showPage 无HTML: placemat
- showPage 无HTML: privacy
- showPage 无HTML: prosperity
- showPage 无HTML: rampage
- showPage 无HTML: remember
- showPage 无HTML: reports
- showPage 无HTML: sats
- showPage 无HTML: search
- showPage 无HTML: shop
- showPage 无HTML: signs
- showPage 无HTML: sleep
- showPage 无HTML: sp
- showPage 无HTML: stars
- showPage 无HTML: stats
- showPage 无HTML: stories
- showPage 无HTML: tarot
- showPage 无HTML: timeline
- showPage 无HTML: treasurebox
- showPage 无HTML: vip
- showPage 无HTML: vip-plans
- showPage 无HTML: voice
- showPage 无HTML: wealth
- showPage 无HTML: welcome
- showPage 无HTML: wheel
- showPage 无HTML: wishwall
- openModule 无HTML: cloud
- openModule 无HTML: tower
- openModule 无HTML: wishwall

### P1 重要 (功能缺失或不可用)
- 缺失 chunk 文件: `cloud`
- 缺失 chunk 文件: `diary`
- 缺失 chunk 文件: `garden`
- 缺失 chunk 文件: `library`
- 缺失 chunk 文件: `manifest`
- 缺失 chunk 文件: `stars`
- 缺失 chunk 文件: `tarot`
- 缺失 chunk 文件: `tools`
- 缺失 chunk 文件: `wishwall`

### P2 增强 (清理/优化)
- 死页面 (未使用): `page-369`, `page-55x5`, `page-68sec`, `page-about`, `page-affirm-loop`, `page-ai`, `page-audio`, `page-backup`, `page-badge-wall`, `page-bootcamp`, `page-breathe`, `page-challenge`, `page-cleanup`, `page-cloud`, `page-coach`, `page-community`, `page-creationbox`, `page-diary`, `page-dreams`, `page-emoscale`, `page-emotion`, `page-garden`, `page-growth`, `page-habit-calendar`, `page-health`, `page-island`, `page-journal`, `page-left`, `page-left-content`, `page-library`, `page-manifest-report`, `page-me`, `page-mood-chart`, `page-movies`, `page-pillow`, `page-placemat`, `page-plans`, `page-privacy`, `page-prosperity`, `page-qr-sync`, `page-rampage`, `page-remember`, `page-reports`, `page-right`, `page-right-content`, `page-sats`, `page-search`, `page-shop`, `page-signs`, `page-skeleton`, `page-sky`, `page-sleep`, `page-sp`, `page-stars`, `page-stats`, `page-stories`, `page-tarot`, `page-temple`, `page-timeline`, `page-timer`, `page-tools`, `page-tower`, `page-treasurebox`, `page-vip`, `page-vip-plans`, `page-vision`, `page-voice`, `page-wealth`, `page-welcome`, `page-wheel`, `page-wishwall`
- 空内容容器: `#bg-stars-container`, `#sky-wishes`, `#sats-text`, `#md-progress`, `#md-neg-text`, `#md-pos-text`, `#md-calendar`, `#affirm-subcats`, `#affirm-list`, `#garden-badges`

## 建议修复顺序

1. **P0**: 为缺失 init 的页面补充基础 init 函数，确保 showPage/openModule 后 DOM 有内容。
2. **P0**: 补充缺失的 HTML section 或移除无效路由映射。
3. **P1**: 修复 chunk 懒加载映射和缺失文件。
4. **P2**: 清理死页面和空容器，减少维护负担。
