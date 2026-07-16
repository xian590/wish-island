# ShowPage 路由分析

| showPage参数 | HTML ID | 有HTML | 后续函数 | 状态 | 候选函数 |
|-------------|---------|--------|----------|------|----------|
| `search` | `page-search` | ✅ | `initSearch` | ✅ | ['initSearch', 'preventDefault', 'querySelector', 'trapFocus', 'initDevLog'] |
| `island` | `page-island` | ✅ | `updateTimeAndWeather` | ✅ | ['updateTimeAndWeather', 'updateNavActive', 'initGestureNavigation'] |
| `tarot` | `page-tarot` | ✅ | `renderTarot` | ✅ | ['renderTarot', 'showPage', 'renderGarden', 'showPage', 'renderDiary'] |
| `garden` | `page-garden` | ✅ | `renderGarden` | ✅ | ['renderGarden', 'showPage', 'renderDiary', 'showPage', 'switchTab'] |
| `diary` | `page-diary` | ✅ | `renderDiary` | ✅ | ['renderDiary', 'showPage', 'switchTab', 'renderLibrary', 'showPage'] |
| `library` | `page-library` | ✅ | `switchTab` | ✅ | ['switchTab', 'renderLibrary', 'showPage', 'renderCloud', 'showPage'] |
| `cloud` | `page-cloud` | ✅ | `renderCloud` | ✅ | ['renderCloud', 'showPage', 'renderStars', 'showPage', 'renderWishwall'] |
| `stars` | `page-stars` | ✅ | `renderStars` | ✅ | ['renderStars', 'showPage', 'renderWishwall', 'showPage', 'init369'] |
| `wishwall` | `page-wishwall` | ✅ | `showPage` | ✅ | ['renderWishwall', 'showPage', 'init369', 'showPage', 'renderCommunityFeed'] |
| `369` | `page-369` | ✅ | `init369` | ✅ | ['init369', 'showPage', 'renderCommunityFeed', 'showToast', 'openModule'] |
| `community` | `page-community` | ✅ | `renderCommunityFeed` | ✅ | ['renderCommunityFeed', 'showToast', 'openModule', 'showPage', 'initAudio'] |
| `health` | `page-health` | ✅ | `initHealth` | ✅ | ['initHealth', 'showPage', 'initStats', 'showPage', 'initCleanup'] |
| `stats` | `page-stats` | ✅ | `initStats` | ✅ | ['initStats', 'showPage', 'initCleanup', 'showPage', 'initAbout'] |
| `cleanup` | `page-cleanup` | ✅ | `initCleanup` | ✅ | ['initCleanup', 'showPage', 'initAbout', 'loadChunk', 'then'] |
| `about` | `page-about` | ✅ | `initAbout` | ✅ | ['initAbout', 'loadChunk', 'then', 'showPage', 'init369'] |
| `55x5` | `page-55x5` | ✅ | `init55x5` | ✅ | ['init55x5', 'loadChunk', 'then', 'showPage', 'initSigns'] |
| `signs` | `page-signs` | ✅ | `initSigns` | ✅ | ['initSigns', 'loadChunk', 'then', 'showPage', 'initWheel'] |
| `wheel` | `page-wheel` | ✅ | `initWheel` | ✅ | ['initWheel', 'loadChunk', 'then', 'showPage', 'init68sec'] |
| `68sec` | `page-68sec` | ✅ | `init68sec` | ✅ | ['init68sec', 'showPage', 'initProsperity', 'showPage', 'initEmoscale'] |
| `prosperity` | `page-prosperity` | ✅ | `initProsperity` | ✅ | ['initProsperity', 'showPage', 'initEmoscale', 'showPage', 'initPillow'] |
| `emoscale` | `page-emoscale` | ✅ | `initEmoscale` | ✅ | ['initEmoscale', 'showPage', 'initPillow', 'showPage', 'initPlacemat'] |
| `pillow` | `page-pillow` | ✅ | `initPillow` | ✅ | ['initPillow', 'showPage', 'initPlacemat', 'showPage', 'initRemember'] |
| `placemat` | `page-placemat` | ✅ | `initPlacemat` | ✅ | ['initPlacemat', 'showPage', 'initRemember', 'showPage', 'initCreationBox'] |
| `remember` | `page-remember` | ✅ | `initRemember` | ✅ | ['initRemember', 'showPage', 'initCreationBox', 'showPage', 'initRampage'] |
| `creationbox` | `page-creationbox` | ✅ | `initCreationBox` | ✅ | ['initCreationBox', 'showPage', 'initRampage', 'loadDataScript', 'then'] |
| `rampage` | `page-rampage` | ✅ | `initRampage` | ✅ | ['initRampage', 'loadDataScript', 'then', 'showPage', 'initTreasureBox'] |
| `treasurebox` | `page-treasurebox` | ✅ | `initTreasureBox` | ✅ | ['initTreasureBox', 'showPage', 'initTimeline', 'showPage', 'initManifestReport'] |
| `timeline` | `page-timeline` | ✅ | `initTimeline` | ✅ | ['initTimeline', 'showPage', 'initManifestReport', 'showPage', 'initAffirmLoop'] |
| `manifest-report` | `page-manifest-report` | ✅ | `initManifestReport` | ✅ | ['initManifestReport', 'showPage', 'initAffirmLoop', 'scrollTo', 'renderToolsTab'] |
| `affirm-loop` | `page-affirm-loop` | ✅ | `initAffirmLoop` | ✅ | ['initAffirmLoop', 'scrollTo', 'renderToolsTab', 'Date', 'getDay'] |
| `growth` | `page-growth` | ✅ | `updateNavActive` | ✅ | ['updateNavActive', 'setTimeout', 'renderGrowth', 'initCharts', 'renderGrowth'] |
| `welcome` | `page-welcome` | ✅ | `goHome` | ✅ | ['goHome', 'getItem', 'setTimeout', 'startTutorial'] |
| `challenge` | `page-challenge` | ✅ | `initChallenge` | ✅ | ['initChallenge', 'loadDataScript', 'then', 'showPage', 'initEmotion'] |
| `emotion` | `page-emotion` | ✅ | `initEmotion` | ✅ | ['initEmotion', 'showPage', 'initSp', 'showPage', 'initWealth'] |
| `sp` | `page-sp` | ✅ | `initSp` | ✅ | ['initSp', 'showPage', 'initWealth', 'showPage', 'initMovies'] |
| `wealth` | `page-wealth` | ✅ | `initWealth` | ✅ | ['initWealth', 'showPage', 'initMovies', 'showPage', 'initAi'] |
| `movies` | `page-movies` | ✅ | `initMovies` | ✅ | ['initMovies', 'showPage', 'initAi', 'showPage', 'initDreams'] |
| `ai` | `page-ai` | ✅ | `initAi` | ✅ | ['initAi', 'showPage', 'initDreams', 'showPage', 'initStories'] |
| `dreams` | `page-dreams` | ✅ | `initDreams` | ✅ | ['initDreams', 'showPage', 'initStories', 'showPage', 'initSats'] |
| `stories` | `page-stories` | ✅ | `initStories` | ✅ | ['initStories', 'showPage', 'initSats', 'showPage', 'initBackup'] |
| `sats` | `page-sats` | ✅ | `initSats` | ✅ | ['initSats', 'showPage', 'initBackup', 'openModule'] |
| `backup` | `page-backup` | ✅ | `initBackup` | ✅ | ['initBackup', 'openModule'] |
| `vip-plans` | `page-vip-plans` | ✅ | `startOfferTimer` | ✅ | ['startOfferTimer', 'renderCheckIn', 'getElementById', 'Date', 'toLocaleDateString'] |
| `vip` | `page-vip` | ✅ | `initVip` | ✅ | ['initVip', 'scrollTo', 'unlockWithCrystals', 'showToast', 'showPage'] |
| `audio` | `page-audio` | ✅ | `initAudioPage` | ✅ | ['initAudioPage', 'setTimeout', 'showPage', 'initChallenge', 'setTimeout'] |
| `reports` | `page-reports` | ✅ | `initReports` | ✅ | ['initReports', 'replaceState', 'addEventListener'] |
| `breathe` | `page-breathe` | ✅ | `initBreathe` | ✅ | ['initBreathe', 'push', 'showPage', 'push'] |
| `sleep` | `page-sleep` | ✅ | `showPage` | ✅ | ['push', 'showPage', 'initEmotion', 'push', 'showPage'] |
| `badge-wall` | `page-badge-wall` | ✅ | `initBadgeWall` | ✅ | ['initBadgeWall', 'initMoodChart', 'getElementById', 'get', 'Date'] |
| `bootcamp` | `page-bootcamp` | ✅ | `initBootcamp` | ✅ | ['initBootcamp', 'showPage', 'showPage', 'showPage', 'loadChunk'] |
| `shop` | `page-shop` | ✅ | `showPage` | ✅ | ['showPage', 'showPage', 'loadChunk', 'then', 'showPage'] |
| `coach` | `page-coach` | ✅ | `showPage` | ✅ | ['showPage', 'loadChunk', 'then', 'showPage', 'initSearch'] |
| `privacy` | `page-privacy` | ✅ | `loadChunk` | ✅ | ['loadChunk', 'then', 'showPage', 'initSearch', 'showPage'] |
| `voice` | `page-voice` | ✅ | `initVoice` | ✅ | ['initVoice', 'showPage', 'initSleep', '__originalOpenModule'] |

## openModule 路由分析

| openModule参数 | HTML ID | 有HTML | 后续函数 | 候选函数 |
|---------------|---------|--------|----------|----------|
| `cloud` | `page-cloud` | ✅ | `showModal` | ['showModal', 'playSound', 'openAffirmRadio', 'keys', 'getElementById'] |
| `tower` | `page-tower` | ✅ | `speak` | ['speak', 'round'] |
| `cloud` | `page-cloud` | ✅ | `speak` | ['speak', 'addEnergy', 'checkBadges', 'updateTopbar', 'renderTemple', 'updateTimeAndWeather', 'setHTML'] |
| `tower` | `page-tower` | ✅ | `showPage` | ['showPage', 'init369', 'showPage', 'init68sec', 'showPage'] |
| `wishwall` | `page-wishwall` | ✅ | `` | ['reverse', 'forEach', 'Date', 'toLocaleDateString'] |

## 大小写不一致检查

- ❌ `renderWishwall` 未定义，但 app.js:3072 调用了它
- `renderWishWall` 在 chunk wishwall.js 中定义 ✅

## SATS 冥想记录保存

- ❌ 未在 app.js 中发现 `state.satsRecords.push/unshift`，冥想记录可能未保存
