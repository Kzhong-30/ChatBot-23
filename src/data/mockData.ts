import type { A11yIssue, ScanReport } from '@/types';

export const ISSUE_CATEGORIES = [
  { key: 'images', label: '图片', icon: 'Image' },
  { key: 'forms', label: '表单', icon: 'FormInput' },
  { key: 'contrast', label: '颜色对比度', icon: 'Palette' },
  { key: 'keyboard', label: '键盘焦点', icon: 'Focus' },
  { key: 'aria', label: 'ARIA 属性', icon: 'Code2' },
  { key: 'headings', label: '标题层级', icon: 'Heading' },
  { key: 'structure', label: '文档结构', icon: 'FileText' },
];

const wcagLib: Record<string, { name: string; level: 'A' | 'AA' | 'AAA'; url: string }> = {
  '1.1.1': { name: '非文本内容', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html' },
  '1.3.1': { name: '信息和关系', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
  '1.4.1': { name: '颜色的使用', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html' },
  '1.4.3': { name: '对比度（最低）', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
  '1.4.6': { name: '对比度（增强）', level: 'AAA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html' },
  '1.4.11': { name: '非文本对比度', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
  '2.1.1': { name: '键盘', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html' },
  '2.4.1': { name: '绕过模块', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html' },
  '2.4.3': { name: '焦点顺序', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html' },
  '2.4.6': { name: '标题和标签', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html' },
  '2.4.7': { name: '焦点可见', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html' },
  '3.1.1': { name: '页面语言', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html' },
  '3.3.2': { name: '标签或说明', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html' },
  '4.1.1': { name: '解析', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html' },
  '4.1.2': { name: '名称、角色、值', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
};

export const makeWcag = (codes: string[]) =>
  codes.map((code) => ({
    code,
    ...wcagLib[code],
  }));

export const MOCK_ISSUES: A11yIssue[] = [
  {
    id: 'issue-001',
    type: 'image-alt-missing',
    category: 'images',
    severity: 'serious',
    title: '图片缺少 alt 属性',
    description: '页面中的图像元素未提供 alt（替代文本）属性，导致屏幕阅读器无法向视障用户传达图像内容。',
    impact: '视障用户完全无法了解图像传达的信息，内容可理解性严重受损。电商产品图、信息图表等缺失 alt 会造成关键信息丢失。',
    wcagRefs: makeWcag(['1.1.1']),
    element: {
      selector: 'main > section.hero img.banner-img',
      html: '<img class="banner-img" src="hero-product.jpg">',
      xpath: '/html/body/main/section[1]/img[1]',
    },
    fixSuggestion: {
      steps: [
        '为所有有意义的 <img> 元素添加 alt 属性',
        'alt 文本应简洁描述图像内容和目的（125 字符以内）',
        '对于纯装饰性图片，使用 alt="" 并添加 role="presentation"',
        '复杂图表使用 aria-describedby 关联详细说明',
      ],
      codeBefore: '<img class="banner-img" src="hero-product.jpg">',
      codeAfter: '<img class="banner-img" src="hero-product.jpg" alt="2024 春季新款智能手表，钛合金表壳搭配蓝色表带">',
      resources: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#alt', 'https://www.w3.org/WAI/tutorials/images/'],
    },
  },
  {
    id: 'issue-002',
    type: 'image-alt-missing-2',
    category: 'images',
    severity: 'warning',
    title: '头像图片缺少替代文本',
    description: '用户头像区域的图片缺少 alt 属性，头像通常与用户名关联但仍需提供适当的替代标识。',
    impact: '屏幕阅读器会读出图片文件名或通用"图像"字样，用户体验不佳。',
    wcagRefs: makeWcag(['1.1.1']),
    element: {
      selector: '.user-profile > .avatar img',
      html: '<img class="avatar" src="/uploads/user_42.png">',
    },
    fixSuggestion: {
      steps: ['为头像添加 alt 属性，内容通常为用户名', '如果旁边已有用户名显示，可考虑 alt="" 避免重复朗读'],
      codeBefore: '<img class="avatar" src="/uploads/user_42.png">',
      codeAfter: '<img class="avatar" src="/uploads/user_42.png" alt="张三的头像">',
    },
  },
  {
    id: 'issue-003',
    type: 'form-label-missing',
    category: 'forms',
    severity: 'serious',
    title: '表单控件未关联标签',
    description: '输入框、复选框等表单控件没有关联的 <label> 元素，屏幕阅读器无法朗读控件用途。',
    impact: '键盘和屏幕阅读器用户完全无法理解表单字段的用途，无法正常填写表单。严重影响登录、注册、购物结算等关键流程。',
    wcagRefs: makeWcag(['1.3.1', '3.3.2', '4.1.2']),
    element: {
      selector: 'form.login input[type="email"]',
      html: '<input type="email" name="user_email" placeholder="请输入邮箱">',
    },
    fixSuggestion: {
      steps: [
        '使用 <label for="id"> 与控件 id 属性显式关联',
        '或将控件包裹在 <label> 标签内部',
        '占位符 placeholder 不能替代 label，但可作为补充提示',
        '视觉上隐藏的 label 可使用 sr-only 样式',
      ],
      codeBefore: '<input type="email" name="user_email" placeholder="请输入邮箱">',
      codeAfter: '<label for="login-email" class="sr-only">邮箱地址</label>\n<input type="email" id="login-email" name="user_email" placeholder="请输入邮箱">',
      resources: ['https://www.w3.org/WAI/tutorials/forms/labels/'],
    },
  },
  {
    id: 'issue-004',
    type: 'color-contrast-low',
    category: 'contrast',
    severity: 'serious',
    title: '正文文本颜色对比度不足',
    description: '正文文本（小于 18pt 或小于 14pt 粗体）与其背景的对比度低于 4.5:1 的 WCAG AA 最低要求。',
    impact: '视力障碍用户（尤其是色弱和老年人）难以阅读文字内容，可读性严重下降。',
    wcagRefs: makeWcag(['1.4.3', '1.4.6']),
    element: {
      selector: '.article-content p',
      html: '<p class="text-gray-400 leading-relaxed">产品介绍正文内容...</p>',
    },
    fixSuggestion: {
      steps: [
        '使用对比度检测工具验证配色（如 Stark、WebAIM Contrast Checker）',
        '正文至少达到 4.5:1（AA），推荐 7:1（AAA）',
        '大文本（≥18pt 或 ≥14pt 粗体）至少 3:1（AA）',
        '避免依赖颜色单独传达信息',
      ],
      codeBefore: '<p class="text-gray-400 leading-relaxed">正文内容 (#9CA3AF on #FFF = 2.9:1)</p>',
      codeAfter: '<p class="text-gray-700 leading-relaxed">正文内容 (#374151 on #FFF = 7.1:1) ✅</p>',
    },
  },
  {
    id: 'issue-005',
    type: 'focus-indicator-missing',
    category: 'keyboard',
    severity: 'serious',
    title: '焦点指示器被移除',
    description: '使用 outline: none 或类似样式移除了浏览器默认的焦点轮廓，但未提供替代的自定义焦点样式。',
    impact: '纯键盘操作的用户无法看到当前聚焦在哪个元素上，Tab 键导航完全失去方向感。',
    wcagRefs: makeWcag(['2.4.3', '2.4.7']),
    element: {
      selector: 'button.btn-primary',
      html: '<button class="btn-primary" style="outline:none">提交订单</button>',
    },
    fixSuggestion: {
      steps: [
        '绝对不要只写 outline: none; 必须提供焦点替代样式',
        '使用 :focus-visible 仅对键盘用户显示焦点环（推荐）',
        '可使用 box-shadow、outline-offset、边框变色等实现自定义焦点样式',
        '焦点环对比度需达到 3:1',
      ],
      codeBefore: '.btn-primary { outline: none; }',
      codeAfter: '.btn-primary:focus-visible {\n  outline: 3px solid #0D9488;\n  outline-offset: 2px;\n  border-radius: 4px;\n}',
    },
  },
  {
    id: 'issue-006',
    type: 'aria-invalid-attr',
    category: 'aria',
    severity: 'warning',
    title: 'ARIA 属性使用错误',
    description: '使用了不存在的 ARIA 属性名称，或将 ARIA 属性用在了不正确的元素/角色上。',
    impact: '屏幕阅读器可能忽略无效属性或产生误读，导致可访问性树不完整。',
    wcagRefs: makeWcag(['4.1.2']),
    element: {
      selector: '.modal-dialog',
      html: '<div class="modal-dialog" role="alertdialog" aria-title="提示">',
    },
    fixSuggestion: {
      steps: [
        '使用有效的 ARIA 属性：aria-label / aria-labelledby（非 aria-title）',
        '参考 ARIA Specification 验证属性与角色的合法组合',
        '优先使用原生语义元素，而非 ARIA（例如 <button> 优于 role="button"）',
      ],
      codeBefore: '<div role="alertdialog" aria-title="提示">',
      codeAfter: '<div role="alertdialog" aria-labelledby="dialog-title">\n  <h2 id="dialog-title">系统提示</h2>',
    },
  },
  {
    id: 'issue-007',
    type: 'aria-hidden-focusable',
    category: 'aria',
    severity: 'serious',
    title: 'aria-hidden 的元素仍可被聚焦',
    description: '被标记 aria-hidden="true" 的元素依然可以被键盘 Tab 聚焦到，造成屏幕阅读器焦点与实际朗读内容不一致。',
    impact: '屏幕阅读器用户遇到"幽灵焦点"——焦点到达某元素但不朗读内容，造成困惑。',
    wcagRefs: makeWcag(['2.1.1', '4.1.2']),
    element: {
      selector: '.decorative-icon-wrapper a',
      html: '<a href="/old" aria-hidden="true"><svg>...</svg></a>',
    },
    fixSuggestion: {
      steps: ['同时添加 tabindex="-1" 防止键盘聚焦', '对于链接/按钮，若要完全隐藏也建议移除 href/禁用'],
      codeBefore: '<a href="/old" aria-hidden="true">旧入口</a>',
      codeAfter: '<a href="/old" aria-hidden="true" tabindex="-1">旧入口</a>\n或：使用 CSS 隐藏并移除语义节点',
    },
  },
  {
    id: 'issue-008',
    type: 'heading-skipped',
    category: 'headings',
    severity: 'warning',
    title: '标题层级跳跃',
    description: '页面标题从 <h2> 直接跳到 <h4>，跳过了 <h3>，造成标题结构断层。',
    impact: '屏幕阅读器用户依赖标题层级导航（例如按 H 键跳转），跳跃会让内容结构不可预测，影响内容理解效率。',
    wcagRefs: makeWcag(['1.3.1', '2.4.6']),
    element: {
      selector: 'main section:nth-child(3) h4',
      html: '<h4 class="subsection-title">产品参数</h4>',
    },
    fixSuggestion: {
      steps: [
        '页面只能有一个 <h1>（通常是主标题/Logo）',
        '标题层级必须依次递增，不能跳过（h1 → h2 → h3，不要越级）',
        '不要用标题来设置字体大小，样式用 CSS class',
        '使用 W3C HTML Outliner 检查标题结构',
      ],
      codeBefore: '<h2>产品详情</h2>\n<h4>产品参数</h4>',
      codeAfter: '<h2>产品详情</h2>\n<h3>产品参数</h3>',
    },
  },
  {
    id: 'issue-009',
    type: 'contrast-button',
    category: 'contrast',
    severity: 'warning',
    title: '按钮非文本对比度不足',
    description: '按钮边框与其背景色的对比度未达到 3:1 的非文本对比度要求，边界不清晰。',
    impact: '视力不佳用户难以识别按钮边界，与周围内容融合。',
    wcagRefs: makeWcag(['1.4.11']),
    element: {
      selector: '.secondary-action',
      html: '<button class="secondary-action">取消</button>',
    },
    fixSuggestion: {
      steps: ['按钮/控件与周围背景的边界对比度需至少 3:1', '可使用深色边框、阴影或与背景反差更大的填充色'],
    },
  },
  {
    id: 'issue-010',
    type: 'no-skip-link',
    category: 'keyboard',
    severity: 'tip',
    title: '缺少跳转到主内容的链接',
    description: '页面未提供"跳到主内容"（skip to main content）链接，键盘用户每次加载页面都必须 Tab 穿过整个导航菜单。',
    impact: '每次页面跳转都需要大量额外按键，长期使用会造成物理负担（重复性劳损）。',
    wcagRefs: makeWcag(['2.4.1']),
    element: {
      selector: 'body > header',
      html: '<header>（skip link 缺失）</header>',
    },
    fixSuggestion: {
      steps: [
        '在 <body> 最开头添加一个锚点链接指向 <main id="main">',
        '该链接默认视觉隐藏，获得焦点时显示（:focus）',
      ],
      codeAfter: '<a href="#main" class="skip-link">跳到主内容</a>\n<main id="main">...</main>',
    },
  },
  {
    id: 'issue-011',
    type: 'lang-missing',
    category: 'structure',
    severity: 'tip',
    title: '文档未声明语言',
    description: '<html> 根元素缺少 lang 属性，屏幕阅读器无法自动切换发音语言。',
    impact: '中英混合网站如果未声明语言，屏幕阅读器会用默认发音朗读，造成严重听不清。',
    wcagRefs: makeWcag(['3.1.1']),
    element: {
      selector: 'html',
      html: '<html>',
    },
    fixSuggestion: {
      steps: ['在 <html> 添加 lang="zh-CN"（或对应语言码）', '页面中段落级别的语言变化也使用 lang 属性局部声明'],
      codeAfter: '<html lang="zh-CN">',
    },
  },
  {
    id: 'issue-012',
    type: 'duplicate-id',
    category: 'structure',
    severity: 'warning',
    title: '重复的 ID 属性',
    description: '页面中存在重复的 id 属性值，可能导致 <label for>、aria-labelledby 等引用失效。',
    impact: '与 ID 关联的可访问性特征（标签关联、描述关联、跳跃锚点）随机失效。',
    wcagRefs: makeWcag(['4.1.1']),
    element: {
      selector: '#product-card',
      html: '2 个元素均带 id="product-card"',
    },
    fixSuggestion: {
      steps: ['确保页面所有 id 属性值唯一', '循环生成元素时使用 index 或唯一数据 ID 拼接'],
    },
  },
];

export function buildMockReport(url: string, improved = false): ScanReport {
  const baseIssues = improved ? MOCK_ISSUES.slice(4) : MOCK_ISSUES;
  const serious = baseIssues.filter((i) => i.severity === 'serious').length;
  const warning = baseIssues.filter((i) => i.severity === 'warning').length;
  const tip = baseIssues.filter((i) => i.severity === 'tip').length;
  const total = serious + warning + tip;
  const baseScore = 100 - serious * 8 - warning * 3 - tip * 1;
  const score = Math.max(0, Math.min(100, baseScore));
  const checkedPassed = 156;

  return {
    id: Math.random().toString(36).slice(2),
    url,
    scanTime: new Date().toLocaleString('zh-CN'),
    duration: 1873 + Math.floor(Math.random() * 800),
    score,
    stats: {
      serious,
      warning,
      tip,
      total,
      passed: checkedPassed,
    },
    issues: baseIssues,
    pageTitle: improved ? url + '（修复后）' : url,
  };
}
