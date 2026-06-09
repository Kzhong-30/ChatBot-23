import type { ScanReport } from '@/types';
import { jsPDF } from 'jspdf';

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
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 40;
  const contentWidth = pageWidth - 2 * marginX;
  let y = 50;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 50) {
      pdf.addPage();
      y = 50;
    }
  };

  const drawRoundedRect = (
    x: number,
    yp: number,
    w: number,
    h: number,
    r: number,
    fill: [number, number, number]
  ) => {
    pdf.setFillColor(...fill);
    pdf.roundedRect(x, yp, w, h, r, r, 'F');
  };

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(13, 148, 136);
  pdf.text('Web Accessibility Audit Report', marginX, y);
  y += 14;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text(`URL: ${report.url}`, marginX, y);
  y += 14;
  pdf.text(
    `Time: ${report.scanTime}  ·  Duration: ${(report.duration / 1000).toFixed(2)}s`,
    marginX,
    y
  );
  if (report.engineMeta) {
    y += 14;
    pdf.text(
      `Engine: axe-core ${report.engineMeta.axeVersion} (ruleset: ${report.engineMeta.ruleset})`,
      marginX,
      y
    );
    y += 14;
    pdf.text(
      `Axe raw: ${report.engineMeta.rawViolations} violations, ${report.engineMeta.rawPasses} passes, ${report.engineMeta.rawIncomplete} incomplete`,
      marginX,
      y
    );
  }
  y += 20;

  const drawStatBlock = (
    label: string,
    value: number | string,
    color: [number, number, number],
    offset: number,
    width = 118
  ) => {
    drawRoundedRect(marginX + offset * (width + 12), y, width, 72, 8, [30, 41, 59]);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...color);
    pdf.text(String(value), marginX + offset * (width + 12) + 16, y + 34);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text(label, marginX + offset * (width + 12) + 16, y + 54);
  };

  drawStatBlock('Score', report.score, [52, 211, 153], 0);
  drawStatBlock('Serious', report.stats.serious, [225, 29, 72], 1);
  drawStatBlock('Warning', report.stats.warning, [245, 158, 11], 2);
  drawStatBlock('Tip', report.stats.tip, [59, 130, 246], 3);
  y += 92;

  const severityRgb: Record<string, [number, number, number]> = {
    serious: [225, 29, 72],
    warning: [245, 158, 11],
    tip: [59, 130, 246],
  };
  const severityBg: Record<string, [number, number, number]> = {
    serious: [76, 5, 25],
    warning: [69, 26, 3],
    tip: [30, 58, 138],
  };
  const severityLabel: Record<string, string> = {
    serious: 'SERIOUS',
    warning: 'WARNING',
    tip: 'TIP',
  };

  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Detected Issues (${report.stats.total} items)`, marginX, y);
  y += 8;
  pdf.setDrawColor(51, 65, 85);
  pdf.setLineWidth(0.5);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 18;

  for (let idx = 0; idx < report.issues.length; idx++) {
    const issue = report.issues[idx];
    const sevColor = severityRgb[issue.severity] ?? severityRgb.tip;
    const sevBg = severityBg[issue.severity] ?? severityBg.tip;
    const label = severityLabel[issue.severity] ?? 'TIP';

    ensureSpace(260);

    const blockStartY = y;
    pdf.setFillColor(...sevColor);
    pdf.roundedRect(marginX, blockStartY, 10, 22, 4, 4, 'F');
    pdf.roundedRect(marginX, blockStartY, 10, 22, 4, 4, 'F');

    const issueTitleMax = contentWidth - 110;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(226, 232, 240);
    const titleLines = pdf.splitTextToSize(
      `#${idx + 1}  ${issue.title.substring(0, 120)}`,
      issueTitleMax
    );
    pdf.text(titleLines, marginX + 22, blockStartY + 16);

    pdf.setFillColor(...sevBg);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...sevColor);
    const badgeX = pageWidth - marginX - 70;
    pdf.roundedRect(badgeX, blockStartY + 2, 70, 18, 6, 6, 'F');
    pdf.text(label, badgeX + 10, blockStartY + 14);
    y = blockStartY + 32;

    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(marginX, y, contentWidth, 10, 4, 4, 'F');
    const blockInnerStartY = y + 6;
    let by = blockInnerStartY + 10;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Selector: ${issue.element.selector}`, marginX + 12, by);
    by += 14;

    pdf.setFontSize(10);
    pdf.setTextColor(203, 213, 225);
    const descLines = pdf.splitTextToSize(issue.description, contentWidth - 24);
    pdf.text(descLines, marginX + 12, by);
    by += descLines.length * 13 + 10;

    ensureSpace(180);

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...sevColor);
    pdf.text('WCAG REFERENCES:', marginX + 12, by);
    by += 12;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    const wcagText = issue.wcagRefs
      .map((r) => `WCAG ${r.code} (Level ${r.level}) - ${r.name}`)
      .join('    ');
    const wcagLines = pdf.splitTextToSize(wcagText, contentWidth - 24);
    pdf.text(wcagLines, marginX + 12, by);
    by += wcagLines.length * 12 + 10;

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(52, 211, 153);
    pdf.text('FIX STEPS:', marginX + 12, by);
    by += 12;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(203, 213, 225);
    issue.fixSuggestion.steps.forEach((step, i) => {
      ensureSpace(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(13, 148, 136);
      pdf.text(`${i + 1}.`, marginX + 12, by);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(203, 213, 225);
      const stepLines = pdf.splitTextToSize(step, contentWidth - 42);
      pdf.text(stepLines, marginX + 28, by);
      by += Math.max(12, stepLines.length * 12) + 4;
    });
    by += 8;

    ensureSpace(150);

    if (issue.fixSuggestion.codeBefore) {
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(225, 29, 72);
      pdf.text('CODE BEFORE:', marginX + 12, by);
      by += 12;
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(250, 204, 21);
      pdf.setFillColor(15, 23, 42);
      const beforeLines = pdf.splitTextToSize(issue.fixSuggestion.codeBefore, contentWidth - 24);
      const codeBlockH1 = Math.max(28, beforeLines.length * 11 + 16);
      pdf.roundedRect(marginX + 12, by - 6, contentWidth - 24, codeBlockH1, 4, 4, 'F');
      pdf.text(beforeLines, marginX + 20, by + 5);
      by += codeBlockH1 + 8;
    }

    ensureSpace(150);

    if (issue.fixSuggestion.codeAfter) {
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(52, 211, 153);
      pdf.text('CODE AFTER:', marginX + 12, by);
      by += 12;
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(167, 243, 208);
      pdf.setFillColor(15, 23, 42);
      const afterLines = pdf.splitTextToSize(issue.fixSuggestion.codeAfter, contentWidth - 24);
      const codeBlockH2 = Math.max(28, afterLines.length * 11 + 16);
      pdf.roundedRect(marginX + 12, by - 6, contentWidth - 24, codeBlockH2, 4, 4, 'F');
      pdf.text(afterLines, marginX + 20, by + 5);
      by += codeBlockH2 + 8;
    }

    by += 14;
    y = by;
  }

  pdf.save(`a11y-report-${report.id}.pdf`);
}
