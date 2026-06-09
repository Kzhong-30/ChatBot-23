import { buildMockReport } from '@/data/mockData';
import type { ScanReport } from '@/types';
import { runAxeOnProbe, type AxeRunSummary } from './axeScanner';

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
