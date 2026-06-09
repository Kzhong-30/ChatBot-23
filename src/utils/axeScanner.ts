import axe from 'axe-core';

export interface AxeRunSummary {
  version: string;
  ruleset: string;
  violations: number;
  passes: number;
  incomplete: number;
  violationTypes: string[];
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
