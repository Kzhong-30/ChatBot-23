import { buildMockReport } from '@/data/mockData';
import type { ScanReport, A11yIssue } from '@/types';
import { runAxeOnProbe, type AxeRunSummary, mapAxeViolationsToIssues } from './axeScanner';

function mergeAxeIssuesIntoReport(report: ScanReport, axeIssues: A11yIssue[]): ScanReport {
  if (axeIssues.length === 0) return report;
  const seenCats = new Map<string, number>();
  for (const ai of axeIssues) {
    seenCats.set(ai.category, (seenCats.get(ai.category) ?? 0) + 1);
  }
  const merged: A11yIssue[] = [];
  const usedTypes = new Set<string>();
  for (const ai of axeIssues) {
    usedTypes.add(ai.type);
    merged.push(ai);
    if (merged.length >= 12) break;
  }
  if (merged.length < 12) {
    for (const mi of report.issues) {
      if (!usedTypes.has(mi.type)) {
        merged.push(mi);
        if (merged.length >= 12) break;
      }
    }
  }
  const stats = { serious: 0, warning: 0, tip: 0 };
  for (const it of merged) stats[it.severity] += 1;
  report.issues = merged;
  report.stats = {
    ...report.stats,
    ...stats,
    total: merged.length,
    passed: Math.max(0, report.stats.passed - (merged.length - report.stats.total)),
  };
  const total = stats.serious + stats.warning + stats.tip;
  const weighted = stats.serious * 5 + stats.warning * 2 + stats.tip * 1;
  report.score = total === 0 ? 100 : Math.max(30, Math.round(100 - (weighted / (total * 5)) * 65));
  return report;
}

export async function simulateScan(
  url: string,
  onProgress: (p: number) => void,
  improved = false
): Promise<ScanReport> {
  const stages = [
    { label: '解析 DOM 结构', progress: 18 },
    { label: '检查图片替代文本', progress: 34 },
    { label: '扫描表单与 ARIA 属性', progress: 50 },
    { label: '启动 axe-core 规则引擎', progress: 62, hook: 'axe' as const },
    { label: '分析颜色对比度与焦点', progress: 80 },
    { label: '应用 Mock 覆盖层', progress: 92 },
    { label: '生成检测报告', progress: 100 },
  ];

  let axeSummary: AxeRunSummary | null = null;

  for (const stage of stages) {
    await new Promise((r) => setTimeout(r, 260 + Math.random() * 220));
    if (stage.hook === 'axe') {
      try {
        axeSummary = await Promise.race<Promise<AxeRunSummary | null>>([
          runAxeOnProbe(url),
          new Promise<null>((r) => setTimeout(() => r(null), 2500)),
        ]);
      } catch {
        axeSummary = null;
      }
    }
    onProgress(stage.progress);
  }

  const report = buildMockReport(url, improved);
  if (axeSummary) {
    report.engineMeta = {
      axeVersion: axeSummary.version,
      engine: 'axe-core-mock',
      ruleset: axeSummary.ruleset,
      rawViolations: axeSummary.violations,
      rawPasses: axeSummary.passes,
      rawIncomplete: axeSummary.incomplete,
    };
    const axeIssues = mapAxeViolationsToIssues(axeSummary.rawViolationsData ?? []);
    mergeAxeIssuesIntoReport(report, axeIssues);
  }
  return report;
}

export function groupIssuesByCategory(report: ScanReport) {
  const groups: Record<string, typeof report.issues> = {};
  for (const issue of report.issues) {
    if (!groups[issue.category]) groups[issue.category] = [];
    groups[issue.category].push(issue);
  }
  return groups;
}

export function scoreGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'A', color: 'text-primary-400' };
  if (score >= 75) return { label: 'B', color: 'text-green-400' };
  if (score >= 60) return { label: 'C', color: 'text-yellow-400' };
  if (score >= 40) return { label: 'D', color: 'text-warning' };
  return { label: 'F', color: 'text-serious' };
}
