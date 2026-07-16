/**
 * P2-2: A/B测试与埋点框架
 * 轻量级事件追踪系统，支持A/B分组和核心事件上报
 */

(function() {
  'use strict';

  // ============================================================
  //  配置
  // ============================================================
  const TRACK_CONFIG = {
    version: '1.0',
    enabled: true,           // 总开关
    sampling: 1.0,           // 采样率（1.0=100%）
    bufferSize: 100,         // 本地缓冲条数上限
    flushInterval: 30000,    // 自动上报间隔(ms)
    endpoint: null,        // 服务端上报地址（如有）
    debug: false,          // 控制台打印日志
  };

  // ============================================================
  //  A/B 实验分组
  // ============================================================
  const AB_EXPERIMENTS = {
    // 实验ID: { groups: ['control', 'variant'], weight: [0.5, 0.5] }
    'welcome_cta': {
      name: '欢迎页CTA文案',
      groups: ['control', 'variant_a'],
      weights: [0.5, 0.5],
      // control: 原文案 "开始测试"
      // variant_a: 新文案 "3分钟找到你的花公主身份"
    },
    'mood_picker': {
      name: '情绪选择器样式',
      groups: ['control', 'expanded'],
      weights: [0.5, 0.5],
      // control: 快速6选
      // expanded: 直接展开全部分类
    },
    'micro_action_prompt': {
      name: '小事拆解提示时机',
      groups: ['after_wish', 'on_garden_visit'],
      weights: [0.5, 0.5],
    },
  };

  // ============================================================
  //  状态
  // ============================================================
  let _buffer = [];
  let _flushTimer = null;
  let _abAssignments = {};
  let _sessionId = null;

  // ============================================================
  //  工具函数
  // ============================================================
  function generateId() {
    return 'tr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function getSessionId() {
    if (!_sessionId) {
      _sessionId = sessionStorage.getItem('track_session') || generateId();
      sessionStorage.setItem('track_session', _sessionId);
    }
    return _sessionId;
  }

  function getDeviceInfo() {
    return {
      ua: navigator.userAgent.slice(0, 120),
      lang: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      touch: 'ontouchstart' in window,
      online: navigator.onLine,
    };
  }

  // ============================================================
  //  A/B 分组逻辑
  // ============================================================
  function assignABGroup(experimentId) {
    if (_abAssignments[experimentId]) return _abAssignments[experimentId];
    
    const exp = AB_EXPERIMENTS[experimentId];
    if (!exp) return null;

    // 基于用户ID的哈希分组（保证同一用户始终同一组）
    const userId = (typeof window !== 'undefined' && window.state && window.state.uuid) || localStorage.getItem('track_uuid') || 'anonymous';
    const hash = cyrb53(userId + ':' + experimentId);
    const r = (hash % 1000) / 1000;
    
    let cumulative = 0;
    let group = exp.groups[0];
    for (let i = 0; i < exp.groups.length; i++) {
      cumulative += exp.weights[i];
      if (r <= cumulative) {
        group = exp.groups[i];
        break;
      }
    }
    
    _abAssignments[experimentId] = group;
    localStorage.setItem('ab_' + experimentId, group);
    
    // 自动记录分组事件
    track('ab_assigned', {
      experiment_id: experimentId,
      experiment_name: exp.name,
      group: group,
      hash: hash,
    });
    
    return group;
  }

  function getABGroup(experimentId) {
    // 优先从本地缓存读取，保证会话内一致
    if (_abAssignments[experimentId]) return _abAssignments[experimentId];
    const cached = localStorage.getItem('ab_' + experimentId);
    if (cached) {
      _abAssignments[experimentId] = cached;
      return cached;
    }
    return assignABGroup(experimentId);
  }

  // 简单字符串哈希
  function cyrb53(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  // ============================================================
  //  核心追踪 API
  // ============================================================
  function track(eventName, properties = {}) {
    if (!TRACK_CONFIG.enabled) return;
    if (Math.random() > TRACK_CONFIG.sampling) return;

    const payload = {
      id: generateId(),
      event: eventName,
      timestamp: Date.now(),
      session_id: getSessionId(),
      user_id: (typeof window !== 'undefined' && window.state && window.state.uuid) || localStorage.getItem('track_uuid') || null,
      version: TRACK_CONFIG.version,
      page: location.pathname + location.hash,
      referrer: document.referrer.slice(0, 200),
      device: getDeviceInfo(),
      ab_groups: {..._abAssignments},
      properties: properties,
    };

    _buffer.push(payload);
    
    if (TRACK_CONFIG.debug) {
      console.log('[Track]', eventName, properties);
    }

    // 重要事件立即尝试上报（非阻塞）
    if (['purchase', 'vip_click', 'test_complete', 'first_wish'].includes(eventName)) {
      flush();
    }

    // 缓冲满时自动flush
    if (_buffer.length >= TRACK_CONFIG.bufferSize) {
      flush();
    }
  }

  // ============================================================
  //  上报逻辑
  // ============================================================
  function flush() {
    if (_buffer.length === 0) return;
    
    const batch = _buffer.splice(0, _buffer.length);
    
    // 1. 发送到服务端（如有配置）
    if (TRACK_CONFIG.endpoint && navigator.onLine) {
      fetch(TRACK_CONFIG.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ batch }),
        keepalive: true,
      }).catch(() => {
        // 网络失败时回写到buffer（保留最近50条）
        _buffer = batch.concat(_buffer).slice(-50);
      });
    }
    
    // 2. 本地持久化（用于离线分析）
    try {
      const stored = JSON.parse(localStorage.getItem('track_queue') || '[]');
      const merged = stored.concat(batch).slice(-500); // 保留最近500条
      localStorage.setItem('track_queue', JSON.stringify(merged));
    } catch (e) {
      // storage满时静默失败
    }
  }

  // 启动定时flush
  function start() {
    if (_flushTimer) clearInterval(_flushTimer);
    _flushTimer = setInterval(flush, TRACK_CONFIG.flushInterval);
    
    // 页面 unload 时尝试发送
    window.addEventListener('beforeunload', () => flush());
    
    // 初始化用户ID
    if (!localStorage.getItem('track_uuid')) {
      localStorage.setItem('track_uuid', generateId());
    }
    
    // 自动追踪基础事件
    track('session_start', { url: location.href });
    
    // 恢复A/B分组
    Object.keys(AB_EXPERIMENTS).forEach(id => {
      const cached = localStorage.getItem('ab_' + id);
      if (cached) _abAssignments[id] = cached;
    });
  }

  // ============================================================
  //  快捷追踪函数（业务层直接调用）
  // ============================================================
  function trackPageView(pageName) {
    track('page_view', { page_name: pageName });
  }

  function trackFeatureUse(featureName, detail = {}) {
    track('feature_use', { feature: featureName, ...detail });
  }

  function trackFunnel(stepName, stepNumber, extra = {}) {
    track('funnel', { step_name: stepName, step_number: stepNumber, ...extra });
  }

  function trackConversion(eventName, value = 0, currency = 'CNY') {
    track('conversion', { event: eventName, value, currency });
  }

  function trackError(errorType, message, source = '') {
    track('error', { error_type: errorType, message: message.slice(0, 200), source });
  }

  function trackPerformance(metric, value, unit = 'ms') {
    track('performance', { metric, value, unit });
  }

  // ============================================================
  //  导出
  // ============================================================
  window.Track = {
    config: TRACK_CONFIG,
    track,
    flush,
    start,
    getABGroup,
    assignABGroup,
    pageView: trackPageView,
    featureUse: trackFeatureUse,
    funnel: trackFunnel,
    conversion: trackConversion,
    error: trackError,
    performance: trackPerformance,
    getQueue: () => JSON.parse(localStorage.getItem('track_queue') || '[]'),
    clearQueue: () => localStorage.removeItem('track_queue'),
  };

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
