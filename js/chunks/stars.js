// ============================================================
//  许愿星台
// ============================================================

let currentWishType = 'love';
let pendingWish = null;

function selectWishType(type, btn) {
  currentWishType = type;
  document.querySelectorAll('#wish-types .chip-soft').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  playSound('sparkle');
}
// 许愿星台自动保存
let wishSaveTimer = null;
function saveWishDraft() {
  clearTimeout(wishSaveTimer);
  wishSaveTimer = setTimeout(() => {
    const draft = {
      type: currentWishType,
      be: document.getElementById('wish-be')?.value || '',
      do: document.getElementById('wish-do')?.value || '',
      have: document.getElementById('wish-have')?.value || '',
      sight: document.getElementById('wish-sight')?.value || '',
      sound: document.getElementById('wish-sound')?.value || '',
      touch: document.getElementById('wish-touch')?.value || '',
      feel: document.getElementById('wish-feel')?.value || '',
      firstAction: document.getElementById('wish-first-action')?.value || '',
    };
    if (!state.wishDrafts) state.wishDrafts = {};
    state.wishDrafts.current = draft;
    saveState();
  }, 500);
}

// 加载许愿草稿
function loadWishDraft() {
  if (!state.wishDrafts || !state.wishDrafts.current) return;
  const d = state.wishDrafts.current;
  if (d.be && document.getElementById('wish-be')) document.getElementById('wish-be').value = d.be;
  if (d.do && document.getElementById('wish-do')) document.getElementById('wish-do').value = d.do;
  if (d.have && document.getElementById('wish-have')) document.getElementById('wish-have').value = d.have;
  if (d.sight && document.getElementById('wish-sight')) document.getElementById('wish-sight').value = d.sight;
  if (d.sound && document.getElementById('wish-sound')) document.getElementById('wish-sound').value = d.sound;
  if (d.touch && document.getElementById('wish-touch')) document.getElementById('wish-touch').value = d.touch;
  if (d.feel && document.getElementById('wish-feel')) document.getElementById('wish-feel').value = d.feel;
  if (d.firstAction && document.getElementById('wish-first-action')) document.getElementById('wish-first-action').value = d.firstAction;
  if (d.type) {
    currentWishType = d.type;
    setTimeout(() => {
      document.querySelectorAll('#wish-types .chip-soft').forEach(b => {
        if (b.dataset.type === d.type) b.classList.add('active');
        else b.classList.remove('active');
      });
    }, 100);
  }
}

function renderStars() {
  renderSkyWishes();
  renderWishList();
  initWishStarDrag();
  loadWishDraft();
}

function createWishStar() {
  const beEl = document.getElementById('wish-be');
  const doEl = document.getElementById('wish-do');
  const haveEl = document.getElementById('wish-have');
  const be = beEl ? beEl.value.trim() : '';
  const do_ = doEl ? doEl.value.trim() : '';
  const have = haveEl ? haveEl.value.trim() : '';
  if (!be && !do_ && !have) { showToast('至少写一点愿望内容哦～'); return; }

  // P1-10: 愿望冲突与资源有限性提示
  const pendingWishes = (state.wishes || []).filter(w => !w.done);
  if (pendingWishes.length >= 5) {
    if (!confirm(`你目前已有${pendingWishes.length}个未成长的愿望。愿望太多会分散注意力和状态，建议聚焦在1-3个最重要的愿望上。确定还要添加新愿望吗？`)) {
      return;
    }
  }
  if (pendingWishes.length >= 3) {
    showToast(`💡 提示：你有${pendingWishes.length}个愿望进行中，建议先完成/放下一些，再全力成长新的～`);
  }

  const wish = {
    id: Date.now(),
    type: currentWishType,
    be, do: do_, have,
    sight: document.getElementById('wish-sight') ? document.getElementById('wish-sight').value.trim() : '',
    sound: document.getElementById('wish-sound') ? document.getElementById('wish-sound').value.trim() : '',
    touch: document.getElementById('wish-touch') ? document.getElementById('wish-touch').value.trim() : '',
    feel: document.getElementById('wish-feel') ? document.getElementById('wish-feel').value.trim() : '',
    firstAction: document.getElementById('wish-first-action') ? document.getElementById('wish-first-action').value.trim() : '',
    done: false,
    date: getTodayStr(),
    skyX: Math.random() * 70 + 15,
    skyY: Math.random() * 50 + 15,
  };

  state.wishes.unshift(wish);
  saveState();
  addEnergy(15, '许下愿望');

  const pendingEl = document.getElementById('pending-star');
  if (pendingEl) {
    pendingEl.classList.remove('hidden');
    pendingEl.style.bottom = '20px';
    pendingEl.style.left = '50%';
    pendingEl.dataset.wishId = wish.id;
  }

  renderSkyWishes();
  renderWishList();
  initWishStarDrag();
  showToast('⭐ 许愿星已生成，把它拖到天上去吧～');
  speak('你的许愿星已经生成了，把它拖到天上去吧～');
  // 自动生成小事拆解
  setTimeout(() => showMicroActionsForWish(wish.id), 600);
}

function renderSkyWishes() {
  const sky = document.getElementById('sky-wishes');
  if (!sky) return;
  sky.innerHTML = state.wishes.map(w => `
    <div class="absolute cursor-pointer transition-all duration-500 ${w.done ? 'animate-breath' : 'animate-twinkle'}"
      style="left:${w.skyX}%; top:${w.skyY}%; font-size:${w.done ? '26px' : '18px'}; filter:${w.done ? 'drop-shadow(0 0 10px #FCD34D)' : 'none'}"
      onclick="toggleWishDone(${w.id})" title="${w.be || w.have || '愿望'}">
      ${w.done ? '🌟' : '⭐'}
    </div>
  `).join('');
}

function renderWishList() {
  const el = document.getElementById('wish-list');
  if (!el) return;
  setText('wish-count', state.wishes.length);
  if (state.wishes.length === 0) {
    el.innerHTML = `<div class="text-center py-8">
      <div class="text-4xl mb-3">🌠</div>
      <p class="text-sm mb-4" style="color:var(--theme-text); opacity:0.6">还没有愿望呢～</p>
      <p class="text-xs mb-5" style="color:var(--theme-text); opacity:0.4">向自然下第一个订单吧，它听得见哦 ✨</p>
      <button onclick="openNewWishModal()" class="soft-btn btn-primary px-6 py-2.5 text-sm font-title">许下第一个愿望 🌟</button>
    </div>`;
    return;
  }
  const typeIcons = { love: '💖', money: '💰', beauty: '✨', heal: '🧘', life: '🏠', study: '📚' };
  el.innerHTML = state.wishes.slice(0, 10).map(w => `
    <div class="wish-card ${w.done ? 'growed' : ''}">
      <div class="flex items-start justify-between mb-2">
        <span class="text-xs px-2 py-0.5 rounded-full" style="background:rgba(255,255,255,0.6); color:var(--theme-text)">${typeIcons[w.type] || '✨'}</span>
        ${w.done ? '<span class="text-xs text-amber-600 font-medium">✨ 已成长</span>' : ''}
      </div>
      ${w.be ? `<div class="text-xs mb-1" style="color:var(--theme-text); opacity:0.7"><span style="opacity:0.5">BE：</span>${w.be.substring(0, 25)}${w.be.length > 25 ? '...' : ''}</div>` : ''}
      ${w.do ? `<div class="text-xs mb-1" style="color:var(--theme-text); opacity:0.7"><span style="opacity:0.5">DO：</span>${w.do.substring(0, 25)}${w.do.length > 25 ? '...' : ''}</div>` : ''}
      ${w.have ? `<div class="text-xs" style="color:var(--theme-text); opacity:0.7"><span style="opacity:0.5">HAVE：</span>${w.have.substring(0, 25)}${w.have.length > 25 ? '...' : ''}</div>` : ''}
      <div class="flex items-center gap-1 mt-2">
        ${!w.done ? `<button onclick="toggleWishDone(${w.id})" class="text-xs px-2 py-1 rounded-full" style="background:rgba(245,230,200,0.4); color:#B8955A">✨ 标记已成长</button>` : ''}
        ${!w.done ? `<button onclick="showMicroActionsForWish(${w.id})" class="text-xs px-2 py-1 rounded-full" style="background:rgba(232,200,122,0.25); color:#B8955A">🔧 拆解小事</button>` : ''}
        <button onclick="deleteWish(${w.id})" class="text-xs px-2 py-1 ml-auto" style="color:var(--theme-text); opacity:0.4">删除</button>
      </div>
    </div>
  `).join('');
}

function toggleWishDone(id) {
  const w = state.wishes.find(x => x.id === id);
  if (!w) return;
  if (!w.done) {
    const review = prompt('写下你的星愿复盘吧～（选填）');
    w.done = true;
    w.review = review || '';
    addEnergy(100, '星愿成真');
    triggerConfetti();
    playSound('bloom');
    showToast(`🎉 恭喜${getTitle('label')}星愿成真！`);
    speak(`恭喜${getTitle('label')}星愿成真，你真棒！`);
  } else {
    w.done = false;
    showToast('已取消标记');
  }
  saveState();
  renderSkyWishes();
  renderWishList();
  checkBadges();
}

function deleteWish(id) {
  if (!confirm('确定要删除这个愿望吗？')) return;
  state.wishes = state.wishes.filter(w => w.id !== id);
  saveState();
  renderSkyWishes();
  renderWishList();
  showToast('已删除');
}

// 拖动星星
function initWishStarDrag() {
  const star = document.getElementById('pending-star');
  const sky = document.getElementById('wish-sky');
  if (!star || !sky || star.classList.contains('hidden')) return;
  if (star._dragBound) return;
  star._dragBound = true;

  let isDragging = false;
  let startX, startY, origX, origY;

  const onStart = (e) => {
    isDragging = true;
    const rect = star.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();
    origX = rect.left - skyRect.left;
    origY = rect.top - skyRect.top;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    star.style.transition = 'none';
    star.style.touchAction = 'none'; // 拖拽时禁用默认触摸行为
    e.preventDefault();
  };
  const onMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    star.style.left = (origX + dx) + 'px';
    star.style.top = (origY + dy) + 'px';
    star.style.bottom = 'auto';
    star.style.transform = 'rotate(15deg)';
    e.preventDefault();
  };
  const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    star.style.transition = '';
    star.style.transform = '';
    star.style.touchAction = ''; // 恢复默认触摸行为
    const starRect = star.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();
    const starCenterX = starRect.left + starRect.width / 2;
    const starCenterY = starRect.top + starRect.height / 2;

    if (starCenterX > skyRect.left && starCenterX < skyRect.right &&
        starCenterY > skyRect.top && starCenterY < skyRect.bottom) {
      const wishId = parseInt(star.dataset.wishId);
      const w = state.wishes.find(x => x.id === wishId);
      if (w) {
        w.skyX = ((starCenterX - skyRect.left) / skyRect.width * 100);
        w.skyY = ((starCenterY - skyRect.top) / skyRect.height * 100);
        saveState();
      }
      createSkyRipple(starCenterX - skyRect.left, starCenterY - skyRect.top);
      playSound('ding');
      star.classList.add('hidden');
      renderSkyWishes();
      speak('你的愿望已经被自然稳稳接住啦，会慢慢实现的💫');
      showToast('⭐ 愿望已送上星空！');
      ['wish-be', 'wish-do', 'wish-have', 'wish-sight', 'wish-sound', 'wish-touch', 'wish-feel', 'wish-first-action'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      // M1: 成功拖到天空后清理全局事件监听器
      cleanupDrag();
    } else {
      star.style.left = '';
      star.style.top = '';
      star.style.bottom = '20px';
    }
  };

  function cleanupDrag() {
    star.removeEventListener('mousedown', onStart);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    star.removeEventListener('touchstart', onStart);
    star.removeEventListener('touchmove', onMove);
    star.removeEventListener('touchend', onEnd);
    star._dragBound = false;
  }

  star.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  star.addEventListener('touchstart', onStart, { passive: false });
  // M1: touchmove/touchend 绑定到 star 元素而非 document，避免阻断页面滚动
  star.addEventListener('touchmove', onMove, { passive: false });
  star.addEventListener('touchend', onEnd);
}
function initWishStarDrag() {
  const star = document.getElementById('pending-star');
  const sky = document.getElementById('wish-sky');
  if (!star || !sky || star.classList.contains('hidden')) return;
  if (star._dragBound) return;
  star._dragBound = true;

  let isDragging = false;
  let startX, startY, origX, origY;

  const onStart = (e) => {
    isDragging = true;
    const rect = star.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();
    origX = rect.left - skyRect.left;
    origY = rect.top - skyRect.top;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    star.style.transition = 'none';
    e.preventDefault();
  };
  const onMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    star.style.left = (origX + dx) + 'px';
    star.style.top = (origY + dy) + 'px';
    star.style.bottom = 'auto';
    star.style.transform = 'rotate(15deg)';
    e.preventDefault();
  };
  const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    star.style.transition = '';
    star.style.transform = '';
    const starRect = star.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();
    const starCenterX = starRect.left + starRect.width / 2;
    const starCenterY = starRect.top + starRect.height / 2;

    if (starCenterX > skyRect.left && starCenterX < skyRect.right &&
        starCenterY > skyRect.top && starCenterY < skyRect.bottom) {
      const wishId = parseInt(star.dataset.wishId);
      const w = state.wishes.find(x => x.id === wishId);
      if (w) {
        w.skyX = ((starCenterX - skyRect.left) / skyRect.width * 100);
        w.skyY = ((starCenterY - skyRect.top) / skyRect.height * 100);
        saveState();
      }
      createSkyRipple(starCenterX - skyRect.left, starCenterY - skyRect.top);
      playSound('ding');
      star.classList.add('hidden');
      renderSkyWishes();
      speak('你的愿望已经被自然稳稳接住啦，会慢慢实现的💫');
      showToast('⭐ 愿望已送上星空！');
      ['wish-be', 'wish-do', 'wish-have', 'wish-sight', 'wish-sound', 'wish-touch', 'wish-feel', 'wish-first-action'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    } else {
      star.style.left = '';
      star.style.top = '';
      star.style.bottom = '20px';
    }
  };

  star.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  star.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

// ============================================================
//  🔧 现实行动拆解器 - 把BE-DO-HAVE变成「小事」
// ============================================================

const MICRO_ACTION_TEMPLATES = {
  love: [
    '给自己买一杯喜欢的饮品，像「被爱着的人」那样好好享受 ☕',
    '把社交头像换成你喜欢的风格，因为「我喜欢」 💅',
    '发一条动态，分享今天的一件开心小事，像「有人在关注我」那样 📝',
    '睡前整理床铺，想象这是「两个人一起睡」的温馨场景 🛏️',
    '写一句积极宣言：「TA今天也在想我」，念3遍 ✨',
    '涂一点喜欢的香水/护手霜，像「要去约会」那样精心对待自己 💐',
    '听一首情歌，想象这是TA推荐给你的 🎵',
    '清理手机里一张旧照片，为新的甜蜜记忆腾出空间 📱',
  ],
  money: [
    '整理钱包/零钱，让钱有个整洁的家 👛',
    '记账10分钟，清楚知道钱流向哪里 📊',
    '清理桌面/抽屉3件不需要的东西，腾出满足的空间 🗑️',
    '给自己买一束花或一株小绿植，体验「我付得起」的感觉 🌷',
    '查看一个理财知识短视频，扩展财富认知 📺',
    '写一句积极宣言：「钱从四面八方流向我」，念3遍 💰',
    '数一数目前拥有的物品，对每一件说「谢谢」 🙏',
    '把账户余额截图设为背景（金额打码），培养熟悉感 📱',
  ],
  beauty: [
    '敷一张面膜或涂一点护手霜，照顾自己的身体 💆',
    '穿上最喜欢的一套衣服，像「今天有重要约会」那样出门 👗',
    '对镜子里的自己说一句：「你真好看，我喜欢你」 🪞',
    '整理化妆台/护肤品，像「精致的人」那样对待生活 💄',
    '拍一张自己满意的照片，存在「美好瞬间」相册里 📸',
    '做5分钟拉伸/深呼吸，感受身体被照顾的感觉 🧘',
    '写一句积极宣言：「我每天都在变得更美更自信」，念3遍 ✨',
    '换一个新的手机壁纸，选一张让你心情变好的图 🖼️',
  ],
  heal: [
    '做5分钟呼吸练习，只关注一呼一吸 🌬️',
    '写下3件今天感谢的小事，培养满足感 📝',
    '听一首让你放松的歌，闭上眼睛感受 🎵',
    '泡一杯热茶/热可可，双手捧杯感受温暖 ☕',
    '把烦恼写在纸上，然后撕掉/揉成一团丢掉 🗑️',
    '给自己发一条语音消息：「我允许自己慢慢来」 🎙️',
    '整理床铺或房间一个角落，让环境支持你的心境 🛏️',
    '写一句积极宣言：「我正在愈合，每一天都比昨天更好」 🌱',
  ],
  study: [
    '整理书桌5分钟，只留最重要的东西在桌上 📚',
    '翻开课本/资料看5分钟，不给自己压力，只是看看 📖',
    '做一道练习题，做完就停下，庆祝这个小完成 ✅',
    '列一个「今天能做的最小学习计划」 📝',
    '给自己买一支好看的笔或一个喜欢的本子，体验被支持的感觉 ✏️',
    '写一句积极宣言：「我学得很快，考试会顺利通过」 🌟',
    '在书桌旁放一张鼓励自己的小卡片 💌',
    '搜一个学习相关的小视频，只看5分钟 📺',
  ],
  life: [
    '整理房间一个角落，感受「新空间」带来的清爽 🧹',
    '换一套新床品或整理床铺，像「住在新家」那样用心 🛏️',
    '种一盆小绿植或给现有植物浇水，照顾生命的感觉 🌱',
    '做一顿自己喜欢的饭/泡一碗喜欢的面，像「美食家」那样品尝 🍜',
    '规划一次短途出行/周末安排，让期待感升起 🗺️',
    '写一句积极宣言：「我的生活正在变得越来越好」 ✨',
    '整理手机相册，保存美好回忆，删除不再需要的 📱',
    '打开窗帘，让阳光进来，深呼吸3次 ☀️',
  ],
};

function generateMicroActions(wishType, be, do_, have) {
  const templates = MICRO_ACTION_TEMPLATES[wishType] || MICRO_ACTION_TEMPLATES.life;
  // 从模板中随机选4个，但保持一定多样性（避免重复）
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);
  
  // 尝试从用户输入中提取关键词，做简单个性化
  const inputText = (be + ' ' + do_ + ' ' + have).toLowerCase();
  const personalized = [];
  
  if (inputText.includes('咖啡') || inputText.includes('茶')) {
    personalized.push('像「已经实现愿望的你」那样，用最喜欢的杯子泡一杯饮品 ☕');
  }
  if (inputText.includes('衣服') || inputText.includes('穿')) {
    personalized.push('拿出一件你最喜欢的衣服，像「TA约你出门」那样搭配好 👗');
  }
  if (inputText.includes('消息') || inputText.includes('微信') || inputText.includes('发')) {
    personalized.push('发一条给自己的消息：「亲爱的，今天也要开心哦」 💬');
  }
  if (inputText.includes('钱') || inputText.includes('富') || inputText.includes('收')) {
    personalized.push('查看账户余额，对数字说「谢谢，欢迎更多朋友来」 💰');
  }
  if (inputText.includes('家') || inputText.includes('房') || inputText.includes('住')) {
    personalized.push('像「已经住在梦想之家」那样，把现在的家收拾一个角落 🏠');
  }
  if (inputText.includes('考试') || inputText.includes('学') || inputText.includes('书')) {
    personalized.push('把课本翻开到你想看的那一页，只看3分钟 📖');
  }
  if (inputText.includes('工作') || inputText.includes('事业') || inputText.includes('升职')) {
    personalized.push('整理工作桌面，像「已经是那个职位的你」那样有条理 💼');
  }
  
  // 如果有个性化结果，替换掉第一个模板项
  if (personalized.length > 0) {
    selected[0] = personalized[0];
  }
  
  return selected;
}

function renderMicroActions(wishId) {
  const el = document.getElementById('micro-actions-area');
  if (!el) return;
  
  const w = state.wishes.find(x => x.id === wishId);
  if (!w) { el.classList.add('hidden'); return; }
  
  const actions = generateMicroActions(w.type, w.be, w.do, w.have);
  
  el.innerHTML = `
    <div class="p-4 rounded-xl mb-3" style="background:linear-gradient(to right, rgba(232,200,122,0.15), rgba(240,213,224,0.1))">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs font-medium" style="color:#B8955A">🔧 现实行动拆解：今天就能做的「小事」</div>
        <button onclick="renderMicroActions(${wishId})" class="text-[10px] px-2 py-1 rounded-full" style="background:rgba(255,255,255,0.5); color:#B8955A">换一组</button>
      </div>
      <div class="space-y-2">
        ${actions.map((a, i) => `
          <div class="flex items-center gap-2 p-2 rounded-lg" style="background:rgba(255,255,255,0.4)">
            <span class="text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style="background:rgba(232,200,122,0.3); color:#B8955A">${i+1}</span>
            <span class="text-xs flex-1" style="color:var(--theme-text)">${escapeHtml(a)}</span>
            <button onclick="addMicroActionToGarden('${escapeHtml(a).replace(/'/g, "\'")}', '${w.type}')" class="text-[10px] px-2 py-1 rounded-full whitespace-nowrap" style="background:rgba(136,200,152,0.25); color:#5A9C6A">+ 花田</button>
          </div>
        `).join('')}
      </div>
      <p class="text-[10px] mt-2" style="color:var(--theme-text); opacity:0.45">💡 选一件小事现在就做，做完点「+ 花田」种下它～</p>
    </div>
  `;
  el.classList.remove('hidden');
}

function addMicroActionToGarden(text, type) {
  if (!state.garden) state.garden = {};
  if (!state.garden.flowers) state.garden.flowers = [];
  const action = { id: Date.now(), text, type: type || 'life', done: false, feel: '', date: getTodayStr() };
  state.garden.flowers.unshift(action);
  saveState();
  showToast('🌱 已种到灵感行动花田！');
  // 如果用户在花园页面，刷新花园
  if (typeof renderActionList === 'function') renderActionList();
  if (typeof renderFlowerGrid === 'function') renderFlowerGrid();
}

function showMicroActionsForWish(wishId) {
  const area = document.getElementById('micro-actions-area');
  if (!area) return;
  renderMicroActions(wishId);
}

// ============================================================

// Chunk exports

window.selectWishType = selectWishType;
window.saveWishDraft = saveWishDraft;
window.loadWishDraft = loadWishDraft;
window.renderStars = renderStars;
window.createWishStar = createWishStar;
window.renderSkyWishes = renderSkyWishes;
window.renderWishList = renderWishList;
window.toggleWishDone = toggleWishDone;
window.deleteWish = deleteWish;
window.initWishStarDrag = initWishStarDrag;
window.generateMicroActions = generateMicroActions;
window.renderMicroActions = renderMicroActions;
window.addMicroActionToGarden = addMicroActionToGarden;
window.showMicroActionsForWish = showMicroActionsForWish;
