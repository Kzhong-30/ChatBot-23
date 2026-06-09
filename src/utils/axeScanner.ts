import axe from 'axe-core';
import type { A11yIssue, Severity, WcagRef, ElementLocator, FixSuggestion } from '@/types';

export interface AxeViolationNode {
  target: string[];
  html: string;
  xpath?: string[];
  failureSummary?: string;
}

export interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  help: string;
  helpUrl: string;
  description: string;
  tags: string[];
  nodes: AxeViolationNode[];
}

export interface AxeRunSummary {
  version: string;
  ruleset: string;
  violations: number;
  passes: number;
  incomplete: number;
  violationTypes: string[];
  rawViolationsData: AxeViolation[];
}

export function buildProbeHtml(url: string): string {
  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return 'example.com';
    }
  })();
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Accessibility Probe - ${host}</title>
  <style>
    body { font-family: sans-serif; max-width: 720px; margin: 32px auto; color: #0f172a; line-height: 1.6; }
    .hero { padding: 24px; background: linear-gradient(135deg,#e0f2fe,#fce7f3); border-radius: 12px; }
    .no-focus { outline: none; }
    .low-contrast { color: #9ca3af; background: #f8fafc; font-size: 14px; padding: 12px; border-radius: 8px; }
    .btn-ghost { border: 1px solid #e2e8f0; background: #fff; color: #cbd5e1; padding: 8px 14px; border-radius: 6px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h4 { margin: 16px 0 4px; }
    .row { display: flex; gap: 8px; align-items: center; }
    input[type="email"], input[type="text"] { padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
    .card { padding: 16px; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 16px; }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="#home">首页</a>
      <a href="#product">产品</a>
      <a href="#support">客服</a>
    </nav>
  </header>

  <section class="hero">
    <h1>精选推荐 <span style="color:#ef4444">限时优惠</span></h1>
    <p class="low-contrast">
      这是一段对比度不足的正文文字：#9ca3af on #f8fafc，对比度约为 2.8:1，低于 WCAG AA 4.5:1 要求。
      老年人和色弱用户很难看清这段话。
    </p>
    <div class="row">
      <img src="hero-banner.jpg" class="banner-img">
      <img src="user-avatar.png" alt="">
    </div>
  </section>

  <section class="card">
    <h2>立即下单</h2>
    <div class="row">
      <input type="email" name="email" placeholder="请输入邮箱">
      <input type="text" id="same" name="dup">
      <input type="text" id="same" name="dup2">
    </div>
    <div class="row" style="margin-top:12px">
      <button class="no-focus" aria-title="点此提交">提交订单</button>
      <button class="btn-ghost">取消</button>
      <a href="/legacy" aria-hidden="true">旧版本入口</a>
    </div>
    <form>
      <div role="alertdialog" aria-title="温馨提示">
        这是一个对话框，使用了不存在的 aria-title 属性。
      </div>
    </form>
  </section>

  <section class="card">
    <h2>产品详情</h2>
    <h4>核心参数</h4>
    <p>表壳：<span style="color:#64748b">航空级钛合金</span>（h2 跳到 h4 跳过了 h3）</p>
    <table>
      <tr><td>电池续航</td><td>14 天</td></tr>
      <tr><td>重量</td><td>42g</td></tr>
    </table>
  </section>

  <footer>
    <p>© 2024 ${host}</p>
  </footer>
</body>
</html>`;
}

export async function runAxeOnProbe(url: string): Promise<AxeRunSummary> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => {
      cleanup();
      reject(new Error('axe-core probe timed out'));
    }, 8000);

    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'sandbox',
      'allow-same-origin allow-scripts'
    );
    iframe.setAttribute(
      'style',
      'position:fixed;left:-99999px;top:-99999px;width:1280px;height:800px;border:0;opacity:0;pointer-events:none;'
    );
    iframe.setAttribute('title', 'A11y probe iframe');
    iframe.setAttribute('aria-hidden', 'true');

    const cleanup = () => {
      window.clearTimeout(t);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };

    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) throw new Error('iframe document unavailable');

        const results = await axe.run(doc, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'section508', 'best-practice'],
          },
          resultTypes: ['violations', 'passes', 'incomplete'],
          xpath: true,
          elementRef: false,
        });

        cleanup();
        resolve({
          version: results.testEngine?.version ?? axe.version ?? 'unknown',
          ruleset: (results.testRunner?.name ?? 'axe-core') + '/' + (results.testEnvironment?.userAgent?.split(')')[0]?.split('(')?.[1] ?? 'browser'),
          violations: results.violations.length,
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          violationTypes: results.violations
            .slice(0, 12)
            .map((v) => `${v.id}[${v.nodes.length}]`),
          rawViolationsData: (results.violations as unknown as AxeViolation[]) ?? [],
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    iframe.onerror = () => {
      cleanup();
      reject(new Error('iframe probe failed to load'));
    };

    document.body.appendChild(iframe);
    try {
      iframe.srcdoc = buildProbeHtml(url);
    } catch {
      iframe.src =
        'data:text/html;charset=utf-8,' + encodeURIComponent(buildProbeHtml(url));
    }
  });
}

const AXE_RULE_CATEGORY: Record<string, { category: string; severity: Severity; wcag: string[]; title: string }> = {
  'object-alt':            { category: 'image',    severity: 'serious', wcag: ['1.1.1'],          title: '图片缺少 alt 属性' },
  'area-alt':              { category: 'image',    severity: 'warning', wcag: ['1.1.1'],          title: '图像映射区域缺少 alt 属性' },
  'image-redundant-alt':   { category: 'image',    severity: 'tip',     wcag: ['1.1.1'],          title: '图片替代文本冗余' },
  'input-image-alt':       { category: 'image',    severity: 'serious', wcag: ['1.1.1'],          title: '图片提交按钮缺少 alt' },
  'label':                 { category: 'form',     severity: 'serious', wcag: ['1.3.1', '3.3.2', '4.1.2'], title: '表单控件未关联标签' },
  'form-field-multiple-labels': { category: 'form', severity: 'warning', wcag: ['3.3.2', '4.1.2'], title: '表单字段标签重复或冲突' },
  'button-name':           { category: 'form',     severity: 'serious', wcag: ['4.1.2'],          title: '按钮缺少可访问名称' },
  'input-button-name':     { category: 'form',     severity: 'serious', wcag: ['4.1.2'],          title: 'input[type=button/submit] 缺少名称' },
  'contrast':              { category: 'color',    severity: 'serious', wcag: ['1.4.3', '1.4.6'], title: '正文文本颜色对比度不足' },
  'link-in-text-block':    { category: 'color',    severity: 'warning', wcag: ['1.4.1'],          title: '文本内嵌链接缺少视觉区分' },
  'color-contrast-enhanced': { category: 'color', severity: 'warning', wcag: ['1.4.6'],          title: '大文本对比度不足' },
  'focus-visible':         { category: 'focus',    severity: 'serious', wcag: ['2.4.3', '2.4.7'], title: '焦点指示器被移除' },
  'focus-order-semantics': { category: 'focus',    severity: 'warning', wcag: ['2.4.3'],          title: '可见焦点与 DOM 顺序不一致' },
  'skip-link':             { category: 'focus',    severity: 'tip',     wcag: ['2.4.1'],          title: '缺少跳转到主内容的链接' },
  'aria-allowed-attr':     { category: 'aria',     severity: 'warning', wcag: ['4.1.2'],          title: 'ARIA 属性使用错误' },
  'aria-required-attr':    { category: 'aria',     severity: 'serious', wcag: ['4.1.2'],          title: '角色缺少必需的 ARIA 属性' },
  'aria-roles':            { category: 'aria',     severity: 'warning', wcag: ['4.1.2'],          title: '使用了不存在的 ARIA 角色' },
  'aria-hidden-focus':     { category: 'aria',     severity: 'serious', wcag: ['2.1.1', '4.1.2'], title: 'aria-hidden 的元素仍可被聚焦' },
  'aria-valid-attr-value': { category: 'aria',     severity: 'warning', wcag: ['4.1.2'],          title: 'ARIA 属性值无效' },
  'aria-valid-attr':       { category: 'aria',     severity: 'warning', wcag: ['4.1.2'],          title: '存在无效的 ARIA 属性名' },
  'heading-order':         { category: 'heading',  severity: 'warning', wcag: ['1.3.1', '2.4.6'], title: '标题层级跳跃' },
  'empty-heading':         { category: 'heading',  severity: 'tip',     wcag: ['1.3.1', '2.4.6'], title: '空的标题元素' },
  'page-has-heading-one':  { category: 'heading',  severity: 'tip',     wcag: ['2.4.1'],          title: '页面缺少主标题 h1' },
  'duplicate-id-active':   { category: 'document', severity: 'warning', wcag: ['4.1.1'],          title: '可交互元素存在重复 ID' },
  'duplicate-id':          { category: 'document', severity: 'warning', wcag: ['4.1.1'],          title: '重复的 ID 属性' },
  'html-has-lang':         { category: 'document', severity: 'tip',     wcag: ['3.1.1'],          title: '文档未声明语言' },
  'html-lang-valid':       { category: 'document', severity: 'tip',     wcag: ['3.1.1'],          title: 'lang 属性值无效' },
  'meta-viewport':         { category: 'document', severity: 'tip',     wcag: ['1.4.4'],          title: '视口 meta 未设置缩放' },
  'bypass':                { category: 'focus',    severity: 'tip',     wcag: ['2.4.1'],          title: '无绕过重复内容机制' },
  'link-name':             { category: 'aria',     severity: 'warning', wcag: ['4.1.2', '2.4.4'], title: '链接缺少可访问名称' },
  'region':                { category: 'document', severity: 'tip',     wcag: ['1.3.1'],          title: '页面未使用地标区域' },
};

const WCAG_DB: Record<string, { name: string; level: 'A' | 'AA' | 'AAA'; url: string }> = {
  '1.1.1': { name: '非文本内容',           level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html' },
  '1.3.1': { name: '信息与关系',           level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
  '1.4.1': { name: '颜色用途',             level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html' },
  '1.4.3': { name: '对比（最小）',         level: 'AA',  url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
  '1.4.4': { name: '调整文本大小',         level: 'AA',  url: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html' },
  '1.4.6': { name: '对比（增强）',         level: 'AAA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html' },
  '1.4.11':{ name: '非文本对比',           level: 'AA',  url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
  '2.1.1': { name: '键盘',                 level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html' },
  '2.4.1': { name: '绕过模块',             level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html' },
  '2.4.3': { name: '焦点顺序',             level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html' },
  '2.4.4': { name: '链接目的（上下文中）', level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html' },
  '2.4.6': { name: '标题和标签',           level: 'AA',  url: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html' },
  '2.4.7': { name: '焦点可见',             level: 'AA',  url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html' },
  '3.1.1': { name: '页面语言',             level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html' },
  '3.3.2': { name: '标签或说明',           level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html' },
  '4.1.1': { name: '解析',                 level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html' },
  '4.1.2': { name: '名称、角色、值',       level: 'A',   url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
};

function buildWcagRefs(codes: string[]): WcagRef[] {
  return codes.map((c) => {
    const db = WCAG_DB[c];
    return db
      ? { code: c, name: db.name, level: db.level, url: db.url }
      : { code: c, name: 'WCAG 准则', level: 'A', url: 'https://www.w3.org/TR/WCAG21/' };
  });
}

function buildFixSteps(ruleId: string, description: string): FixSuggestion {
  const generic = [
    '对照 axe-core help 文档分析具体违规原因',
    '定位受影响元素，确认其在页面中的实际用途',
    '按 WCAG 规范修复，优先使用语义化 HTML 而非 ARIA 补丁',
    '修复后再次使用 axe-core 验证，确保违规彻底消除',
  ];
  const fixMap: Record<string, { steps: string[]; before?: string; after?: string }> = {
    'object-alt': {
      steps: ['为所有有意义的 <img> 元素添加 alt 属性，简洁描述图像内容（≤125字符）', '纯装饰图使用 alt="" 并加 role="presentation"', '复杂图表使用 aria-describedby 关联文字说明'],
      before: '<img src="hero-banner.jpg">',
      after:  '<img src="hero-banner.jpg" alt="夏季新品促销 5折起">',
    },
    'label': {
      steps: ['为每个 <input>、<select>、<textarea> 关联可见 <label> 元素', '优先使用 label for=id 方式，或用 label 包裹控件', '图标的搜索框等可加 aria-label 替代'],
      before: '<input type="email" name="email" placeholder="邮箱">',
      after:  '<label for="em">邮箱</label><input id="em" type="email" name="email">',
    },
    'contrast': {
      steps: ['使用 WebAIM Contrast Checker 测量前景/背景色对比度', '正文文本对比度 ≥ 4.5:1（AA），大文本 ≥ 3:1（AA）', '优先调整背景色或字体颜色，必要时使用阴影描边增强对比'],
      before: '<p style="color:#9ca3af;background:#f8fafc">低对比度文字</p>',
      after:  '<p style="color:#334155;background:#f8fafc">标准对比度文字</p>',
    },
    'focus-visible': {
      steps: ['移除 outline: none 或 outline: 0 样式', '为:focus-visible 提供 ≥ 2px 宽度的对比色轮廓', '可用 box-shadow 或 ring 替代浏览器默认 outline'],
      before: '.btn:focus { outline: none; }',
      after:  '.btn:focus-visible { outline: 2px solid #0d9488; outline-offset: 2px; }',
    },
    'aria-allowed-attr': {
      steps: ['查阅 https://www.w3.org/WAI/ARIA/apg/ 确认允许使用的 ARIA 属性', '删除不存在的属性名（如 aria-title 应改为 aria-label）', '用原生语义 HTML（<button>/<nav> 等）代替多余 ARIA'],
      before: '<div aria-title="提交订单">按钮</div>',
      after:  '<button aria-label="提交订单">提交</button>',
    },
    'aria-hidden-focus': {
      steps: ['对 aria-hidden="true" 的元素加 tabindex="-1" 阻止键盘聚焦', '若元素需要可聚焦则移除 aria-hidden="true"', '装饰性 SVG/图标若用 aria-hidden 需确保不可 Tab 到'],
      before: '<a href="/old" aria-hidden="true">旧入口</a>',
      after:  '<a href="/old" aria-hidden="true" tabindex="-1">旧入口</a>',
    },
    'heading-order': {
      steps: ['检查页面标题树，h2→h3→h4 逐级递增不跳级', '视觉上要小一号的标题用 CSS 调整字号而非改 h 级数', '每个区块至少有一个 h2，子标题紧跟父标题'],
      before: '<section><h2>产品</h2><h4>参数</h4></section>',
      after:  '<section><h2>产品</h2><h3>参数</h3></section>',
    },
    'duplicate-id': {
      steps: ['全局搜索重复的 id 字符串', '将重复 id 改为 class 或加前缀后缀唯一化', '<label for>、aria-labelledby 同步更新引用 ID'],
      before: '<input id="x"><input id="x">',
      after:  '<input id="x-email"><input id="x-name">',
    },
    'html-has-lang': {
      steps: ['在 <html> 根元素添加 lang 属性', '简体中文用 lang="zh-CN"，繁体用 lang="zh-TW"，英文用 lang="en"', '页面内局部语言切换用局部 lang= 覆盖'],
      before: '<!doctype html><html><head>',
      after:  '<!doctype html><html lang="zh-CN"><head>',
    },
    'skip-link': {
      steps: ['在 <body> 最顶部添加一个视觉隐藏但可聚焦的"跳到主内容"锚点链接', '主内容区设置 id="main" 作为跳转目标', '链接 :focus 时显示为可见样式'],
      before: '<body><header>…</header>',
      after:  '<body><a class="skip" href="#main">跳到主内容</a><header>…</header><main id="main">',
    },
  };
  const preset = fixMap[ruleId];
  if (preset) {
    return {
      steps: [...preset.steps, '修复后重新运行 axe-core 验证'],
      codeBefore: preset.before,
      codeAfter: preset.after,
      resources: ['https://dequeuniversity.com/rules/axe/4.10/' + ruleId],
    };
  }
  return { steps: generic, resources: ['https://dequeuniversity.com/rules/axe/4.10/' + ruleId] };
}

const IMPACT_TO_SEVERITY: Record<string, Severity> = {
  critical: 'serious',
  serious:  'serious',
  moderate: 'warning',
  minor:    'tip',
};

export function mapAxeViolationsToIssues(violations: AxeViolation[]): A11yIssue[] {
  const issues: A11yIssue[] = [];
  let seq = 0;
  for (const v of violations) {
    const rule = AXE_RULE_CATEGORY[v.id] ?? {
      category: 'aria',
      severity: (v.impact ? IMPACT_TO_SEVERITY[v.impact] : undefined) ?? 'warning',
      wcag: ['4.1.2'],
      title: v.help,
    };
    for (const node of v.nodes) {
      seq += 1;
      const selector = node.target?.[0] ?? 'unknown';
      const element: ElementLocator = {
        selector,
        html: (node.html || '').substring(0, 280),
        xpath: node.xpath?.[0],
      };
      const fix = buildFixSteps(v.id, v.description);
      issues.push({
        id: `axe-${v.id}-${seq}`,
        type: v.id,
        category: rule.category,
        severity: rule.severity,
        title: rule.title,
        description: v.help + '（' + (v.description || '') + '）',
        impact: node.failureSummary || (rule.severity === 'serious' ? '可能对部分用户造成严重的可访问性障碍。' : '对可访问性有一定影响，建议修复。'),
        wcagRefs: buildWcagRefs(rule.wcag),
        element,
        fixSuggestion: fix,
      });
      if (seq >= 16) break;
    }
    if (seq >= 16) break;
  }
  return issues;
}
