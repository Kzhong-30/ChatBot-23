import type { ScanReport } from '@/types';

const severityLabelMap = {
  serious: { zh: '严重', en: 'Serious' },
  warning: { zh: '警告', en: 'Warning' },
  tip: { zh: '提示', en: 'Tip' },
} as const;

function formatIssueRows(report: ScanReport) {
  return report.issues
    .map(
      (issue) => `
    <div class="issue-block sev-${issue.severity}">
      <div class="issue-header">
        <span class="badge badge-${issue.severity}">${severityLabelMap[issue.severity].zh}</span>
        <h3>${issue.title}</h3>
        <p class="code">${issue.element.selector}</p>
      </div>
      <p><strong>描述：</strong>${issue.description}</p>
      <p><strong>影响：</strong>${issue.impact}</p>
      <p><strong>WCAG：</strong>${issue.wcagRefs
        .map((r) => `${r.code} (Level ${r.level}) ${r.name}`)
        .join('；')}</p>
      <details>
        <summary>修复建议</summary>
        <ol>${issue.fixSuggestion.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
        ${
          issue.fixSuggestion.codeBefore
            ? `<pre><code>BEFORE:\n${issue.fixSuggestion.codeBefore}\n\nAFTER:\n${issue.fixSuggestion.codeAfter || ''}</code></pre>`
            : ''
        }
      </details>
      <details>
        <summary>问题元素</summary>
        <pre><code>${issue.element.html}</code></pre>
      </details>
    </div>`
    )
    .join('\n');
}

export function generateHtmlReport(report: ScanReport, reportB?: ScanReport): string {
  const compare = !!reportB;
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>无障碍检测报告 - ${report.url}</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0f172a;color:#e2e8f0;max-width:1200px;margin:0 auto;padding:32px 24px;line-height:1.7}
    h1{color:#34d399;margin:0 0 8px;font-size:28px}
    .meta{color:#94a3b8;margin-bottom:24px}
    .grid{display:grid;grid-template-columns:${compare ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)'};gap:16px;margin:24px 0 32px}
    .card{background:#1e293b;padding:20px;border-radius:12px;border:1px solid #334155}
    .score-ring{width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:700;color:#fff;margin:0 auto 12px;background:conic-gradient(#0d9488 ${report.score * 3.6}deg, #334155 0deg)}
    .badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600}
    .badge-serious{background:#4c0519;color:#fda4af}
    .badge-warning{background:#451a03;color:#fcd34d}
    .badge-tip{background:#1e3a8a;color:#93c5fd}
    .stat{font-size:32px;font-weight:700;margin:4px 0}
    .issue-block{background:#1e293b;border-radius:12px;padding:20px;margin-bottom:16px;border-left:4px solid #334155}
    .issue-block.sev-serious{border-left-color:#e11d48}
    .issue-block.sev-warning{border-left-color:#f59e0b}
    .issue-block.sev-tip{border-left-color:#3b82f6}
    .issue-header h3{margin:8px 0}
    .code{font-family:ui-monospace,Menlo,monospace;background:#0f172a;padding:4px 8px;border-radius:6px;color:#a78bfa;font-size:13px;word-break:break-all}
    pre{background:#0f172a;padding:12px;border-radius:8px;overflow-x:auto;color:#a78bfa;font-family:ui-monospace,Menlo,monospace;font-size:13px}
    details{margin-top:12px}
    summary{cursor:pointer;color:#64748b}
    ol{padding-left:20px}
  </style>
</head>
<body>
  <h1>♿ 网页无障碍检测报告</h1>
  <div class="meta">
    <p><strong>检测地址：</strong><a href="${report.url}" style="color:#38bdf8">${report.url}</a></p>
    <p><strong>检测时间：</strong>${report.scanTime}　<strong>耗时：</strong>${(report.duration / 1000).toFixed(2)}s</p>
  </div>
  <div class="grid">
    <div class="card" style="text-align:center">
      <div class="score-ring">${report.score}</div>
      <div style="color:#94a3b8">综合评分</div>
    </div>
    <div class="card">
      <div class="badge badge-serious">严重</div>
      <div class="stat" style="color:#fda4af">${report.stats.serious}</div>
      <div style="color:#94a3b8">个问题</div>
    </div>
    <div class="card">
      <div class="badge badge-warning">警告</div>
      <div class="stat" style="color:#fcd34d">${report.stats.warning}</div>
      <div style="color:#94a3b8">个问题</div>
    </div>
    <div class="card">
      <div class="badge badge-tip">提示</div>
      <div class="stat" style="color:#93c5fd">${report.stats.tip}</div>
      <div style="color:#94a3b8">个优化项</div>
    </div>
  </div>
  ${
    compare && reportB
      ? `<div style="background:#115e59;padding:20px;border-radius:12px;margin-bottom:24px">
           <h2 style="margin:0 0 8px;color:#6ee7b7">📊 对比改进分析</h2>
           <p>修复后评分：<strong style="color:#34d399">${reportB.score}</strong>（提升了 <strong>${reportB.score - report.score}</strong> 分）　·　严重问题减少：${reportB.stats.serious}（减少 ${report.stats.serious - reportB.stats.serious}）
           ·　警告减少：${reportB.stats.warning}（减少 ${report.stats.warning - reportB.stats.warning}）</p>
         </div>`
      : ''
  }
  <h2 style="color:#64748b;border-bottom:1px solid #334155;padding-bottom:8px">检测问题清单（共 ${report.stats.total} 项）</h2>
  ${formatIssueRows(report)}
</body>
</html>`;
  return html;
}

export function downloadHtml(report: ScanReport, reportB?: ScanReport) {
  const html = generateHtmlReport(report, reportB);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `a11y-report-${report.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export async function downloadPdf(report: ScanReport) {
  const html = generateHtmlReport(report);
  const printWindow = window.open(
    '',
    `a11y-report-${report.id}`,
    'width=1200,height=900,left=80,top=40,menubar=no,toolbar=no'
  );
  if (!printWindow) {
    throw new Error('无法创建打印窗口，请检查浏览器弹窗拦截设置');
  }
  const printCss = `
    @page { size: A4; margin: 18mm 14mm; }
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .issue-block { page-break-inside: avoid; break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
    }
  `;
  const injectHtml = html.replace(
    '</head>',
    `<style>${printCss}</style></head>`
  );
  printWindow.document.open();
  printWindow.document.write(injectHtml);
  printWindow.document.close();
  await new Promise<void>((resolve) => {
    printWindow.onload = () => resolve();
  });
  await new Promise<void>((r) => setTimeout(r, 400));
  printWindow.focus();
  printWindow.print();
  printWindow.addEventListener(
    'afterprint',
    () => {
      try { printWindow.close(); } catch {}
    },
    { once: true }
  );
}
