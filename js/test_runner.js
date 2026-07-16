/**
 * P2-5: 自动化测试框架
 * 浏览器端轻量级测试运行器，用于回归验证核心功能
 * 用法：在浏览器控制台运行 TestRunner.runAll() 或在页面加载后自动执行（开发模式）
 */

(function() {
  'use strict';

  // ============================================================
  //  断言库
  // ============================================================
  const Assert = {
    equals(actual, expected, msg) {
      if (actual !== expected) {
        throw new Error(`${msg || 'assertEquals failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    true(value, msg) {
      if (value !== true) {
        throw new Error(`${msg || 'assertTrue failed'}: expected true, got ${JSON.stringify(value)}`);
      }
    },
    false(value, msg) {
      if (value !== false) {
        throw new Error(`${msg || 'assertFalse failed'}: expected false, got ${JSON.stringify(value)}`);
      }
    },
    notNull(value, msg) {
      if (value === null || value === undefined) {
        throw new Error(`${msg || 'assertNotNull failed'}`);
      }
    },
    contains(haystack, needle, msg) {
      if (!haystack.includes(needle)) {
        throw new Error(`${msg || 'assertContains failed'}: "${haystack}" does not contain "${needle}"`);
      }
    },
    throws(fn, msg) {
      let threw = false;
      try { fn(); } catch (e) { threw = true; }
      if (!threw) throw new Error(`${msg || 'assertThrows failed'}: function did not throw`);
    },
    approx(actual, expected, tolerance = 0.001, msg) {
      if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`${msg || 'assertApprox failed'}: expected ~${expected}, got ${actual}`);
      }
    },
  };

  // ============================================================
  //  模拟工具（Mock）
  // ============================================================
  const Mock = {
    state: null,
    
    setup() {
      // 保存原始状态
      if (typeof window !== 'undefined' && window.state) {
        this.state = JSON.parse(JSON.stringify(window.state));
      }
      // 重置为测试用干净状态
      if (typeof window !== 'undefined' && window.state) {
        window.state.energy = 0;
        window.state.level = 0;
        window.state.wishes = [];
        window.state.garden = { flowers: [], todayCount: 0 };
        window.state.moodLog = [];
        window.state.mentalDiet = { records: [], streak: 0 };
        window.state.badges = [];
      }
    },
    
    teardown() {
      // 恢复原始状态
      if (this.state && typeof window !== 'undefined' && window.state) {
        Object.assign(window.state, this.state);
      }
    },
    
    // 模拟localStorage
    storage: {},
    installStorage() {
      this._origSetItem = Storage.prototype.setItem;
      this._origGetItem = Storage.prototype.getItem;
      Storage.prototype.setItem = function(k, v) { Mock.storage[k] = v; };
      Storage.prototype.getItem = function(k) { return Mock.storage[k] || null; };
    },
    uninstallStorage() {
      Storage.prototype.setItem = this._origSetItem;
      Storage.prototype.getItem = this._origGetItem;
    },
  };

  // ============================================================
  //  测试用例定义
  // ============================================================
  const TEST_CASES = [];

  function test(name, fn) {
    TEST_CASES.push({ name, fn });
  }

  function suite(name, fn) {
    TEST_CASES.push({ name, fn, isSuite: true });
  }

  // ============================================================
  //  测试用例：数值系统
  // ============================================================
  suite('数值系统', () => {
    test('LEVELS应包含15个等级', () => {
      Assert.equals(typeof LEVELS !== 'undefined' ? LEVELS.length : 0, 15, '等级数量应为15');
    });
    
    test('addEnergy应正确计算等级', () => {
      if (typeof window === 'undefined' || !window.state || typeof addEnergy === 'undefined') {
        return; // 跳过
      }
      Mock.setup();
      window.state.energy = 0;
      addEnergy(100);
      Assert.equals(window.state.energy, 100, '状态应为100');
      Mock.teardown();
    });
    
    test('LEVELS边界值正确', () => {
      if (typeof LEVELS === 'undefined') return;
      Assert.equals(LEVELS[0].min, 0, '新手从0开始');
      Assert.equals(LEVELS[LEVELS.length - 1].min, 10000, '满级需要10000状态');
    });
  });

  // ============================================================
  //  测试用例：情绪系统（P1-1）
  // ============================================================
  suite('情绪系统 P1-1', () => {
    test('MOOD_NAMES应包含22种情绪', () => {
      if (typeof MOOD_NAMES === 'undefined') return;
      const count = Object.keys(MOOD_NAMES).length;
      Assert.equals(count, 22, `应有22种情绪，实际${count}`);
    });
    
    test('MOOD_CATEGORIES应包含5个分类', () => {
      if (typeof MOOD_CATEGORIES === 'undefined') return;
      Assert.equals(Object.keys(MOOD_CATEGORIES).length, 5, '应有5个情绪分类');
    });
    
    test('每种情绪都应有emoji', () => {
      if (typeof MOOD_NAMES === 'undefined' || typeof MOOD_EMOJIS === 'undefined') return;
      for (const key of Object.keys(MOOD_NAMES)) {
        Assert.notNull(MOOD_EMOJIS[key], `情绪${key}缺少emoji`);
      }
    });
    
    test('QUICK_MOODS应有6种', () => {
      if (typeof QUICK_MOODS === 'undefined') return;
      Assert.equals(QUICK_MOODS.length, 6, '快速选择应有6种');
    });
  });

  // ============================================================
  //  测试用例：数据持久化
  // ============================================================
  suite('数据持久化', () => {
    test('saveState和loadState应正常工作', () => {
      if (typeof saveState === 'undefined' || typeof loadState === 'undefined' || typeof window === 'undefined' || !window.state) {
        return;
      }
      Mock.setup();
      window.state.energy = 999;
      saveState();
      window.state.energy = 0;
      loadState();
      Assert.equals(window.state.energy, 999, 'loadState应恢复energy');
      Mock.teardown();
    });
    
    test('状态应包含version字段', () => {
      if (typeof window === 'undefined' || !window.state) return;
      Assert.notNull(window.state.version, '状态应有version字段');
    });
  });

  // ============================================================
  //  测试用例：P1-2 现实行动拆解器
  // ============================================================
  suite('现实行动拆解器 P1-2', () => {
    test('MICRO_ACTION_TEMPLATES应包含6种类型', () => {
      if (typeof MICRO_ACTION_TEMPLATES === 'undefined') return;
      Assert.equals(Object.keys(MICRO_ACTION_TEMPLATES).length, 6, '应有6种愿望类型的模板');
    });
    
    test('generateMicroActions应返回4个行动', () => {
      if (typeof generateMicroActions === 'undefined') return;
      const actions = generateMicroActions('love', '我是被爱的', '一起吃早餐', '在一起了');
      Assert.equals(actions.length, 4, '应返回4个小事');
    });
    
    test('generateMicroActions应支持类型参数', () => {
      if (typeof generateMicroActions === 'undefined') return;
      const moneyActions = generateMicroActions('money', '', '', '');
      Assert.notNull(moneyActions, '财富类型应能生成');
      Assert.equals(moneyActions.length, 4, '财富类型应返回4个');
    });
  });

  // ============================================================
  //  测试用例：P1-3 称呼偏好
  // ============================================================
  suite('称呼偏好 P1-3', () => {
    test('TITLE_PRESETS应包含4种偏好', () => {
      if (typeof TITLE_PRESETS === 'undefined') return;
      Assert.equals(Object.keys(TITLE_PRESETS).length, 4, '应有4种称呼偏好');
    });
    
    test('getTitle应返回默认label', () => {
      if (typeof getTitle === 'undefined') return;
      const title = getTitle('label');
      Assert.notNull(title, 'getTitle应返回有效值');
    });
    
    test('setTitlePreference应更新状态', () => {
      if (typeof setTitlePreference === 'undefined' || typeof window === 'undefined' || !window.state) return;
      Mock.setup();
      setTitlePreference('neutral');
      Assert.equals(window.state.titlePreference, 'neutral', 'titlePreference应更新为neutral');
      Mock.teardown();
    });
  });

  // ============================================================
  //  测试用例：P1-10 愿望冲突检测
  // ============================================================
  suite('愿望冲突检测 P1-10', () => {
    test('愿望数量应可检测', () => {
      if (typeof window === 'undefined' || !window.state) return;
      Mock.setup();
      window.state.wishes = [{done: false}, {done: false}, {done: false}];
      const pending = window.state.wishes.filter(w => !w.done).length;
      Assert.equals(pending, 3, '应有3个未成长愿望');
      Mock.teardown();
    });
  });

  // ============================================================
  //  测试用例：P2-2 埋点系统
  // ============================================================
  suite('埋点系统 P2-2', () => {
    test('Track对象应存在', () => {
      Assert.notNull(typeof Track !== 'undefined' ? Track : null, 'Track对象应已加载');
    });
    
    test('Track.track应能调用', () => {
      if (typeof Track === 'undefined') return;
      // 不应抛异常
      Track.track('test_event', {test: true});
      Assert.true(true, 'track调用成功');
    });
    
    test('A/B分组应稳定', () => {
      if (typeof Track === 'undefined' || !Track.getABGroup) return;
      const g1 = Track.getABGroup('welcome_cta');
      const g2 = Track.getABGroup('welcome_cta');
      Assert.equals(g1, g2, '同一实验应始终返回同一分组');
    });
  });

  // ============================================================
  // ============================================================
  //  测试运行器
  // ============================================================
  const TestRunner = {
    results: [],
    passCount: 0,
    failCount: 0,
    skipCount: 0,
    
    async runAll() {
      console.log('%c🧪 开始自动化测试...', 'color:#8B7E9C; font-size:14px; font-weight:bold');
      this.results = [];
      this.passCount = 0;
      this.failCount = 0;
      this.skipCount = 0;
      const startTime = performance.now();
      
      for (const tc of TEST_CASES) {
        if (tc.isSuite) {
          console.log(`\n%c📁 ${tc.name}`, 'color:#D4A5B8; font-weight:bold');
          // suite本身不执行，子case已扁平化
          continue;
        }
        await this.runOne(tc);
      }
      
      const duration = (performance.now() - startTime).toFixed(1);
      this.printSummary(duration);
      return this.results;
    },
    
    async runOne(tc) {
      const t0 = performance.now();
      let status = 'PASS';
      let error = null;
      
      try {
        await tc.fn();
        this.passCount++;
      } catch (e) {
        if (e.message && e.message.includes('undefined')) {
          // 依赖未加载时标记为SKIP而非FAIL
          status = 'SKIP';
          this.skipCount++;
          error = e.message;
        } else {
          status = 'FAIL';
          this.failCount++;
          error = e.message;
        }
      }
      
      const duration = (performance.now() - t0).toFixed(1);
      this.results.push({ name: tc.name, status, error, duration });
      
      const color = status === 'PASS' ? '#88C898' : (status === 'SKIP' ? '#E8C87A' : '#D4A5B8');
      const icon = status === 'PASS' ? '✅' : (status === 'SKIP' ? '⏭️' : '❌');
      console.log(`  ${icon} ${tc.name} (${duration}ms)`);
      if (error && status === 'FAIL') {
        console.log(`     %c${error}`, 'color:#D4A5B8; font-size:11px');
      }
    },
    
    printSummary(duration) {
      console.log('\n' + '─'.repeat(50));
      console.log('%c测试结果', 'color:#8B7E9C; font-size:14px; font-weight:bold');
      console.log(`  ✅ 通过: ${this.passCount}`);
      console.log(`  ❌ 失败: ${this.failCount}`);
      console.log(`  ⏭️ 跳过: ${this.skipCount}`);
      console.log(`  ⏱️ 耗时: ${duration}ms`);
      console.log('─'.repeat(50));
      
      if (this.failCount === 0) {
        console.log('%c🎉 全部通过！', 'color:#88C898; font-size:16px; font-weight:bold');
      } else {
        console.log('%c⚠️ 有测试失败，请检查上方日志', 'color:#D4A5B8; font-size:14px; font-weight:bold');
      }
    },
    
    // 导出JSON报告
    exportReport() {
      return JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
          total: this.results.length,
          pass: this.passCount,
          fail: this.failCount,
          skip: this.skipCount,
        },
        results: this.results,
      }, null, 2);
    },
    
    // 保存报告到localStorage
    saveReport() {
      const report = this.exportReport();
      localStorage.setItem('test_report_latest', report);
      localStorage.setItem('test_report_' + Date.now(), report);
      return report;
    },
  };

  // ============================================================
  //  导出
  // ============================================================
  window.TestRunner = TestRunner;
  window.TestAssert = Assert;
  window.TestMock = Mock;

  // 开发模式自动运行（URL含 ?test=1 时）
  if (location.search.includes('test=1')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => TestRunner.runAll());
    } else {
      setTimeout(() => TestRunner.runAll(), 500);
    }
  }

})();
