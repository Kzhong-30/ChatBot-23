import { buildMockReport } from '@/data/mockData';
import type { ScanReport } from '@/types';

export async function simulateScan(
  url: string,
  onProgress: (p: number) => void,
  improved = false
): Promise<ScanReport> {
  const stages = [
    { label: '解析 DOM 结构', progress: 20 },
    { label: '检查图片替代文本', progress: 40 },
    { label: '扫描表单与 ARIA', progress: 60 },
    { label: '分析颜色对比度', progress: 78 },
    { label: '验证键盘与焦点', progress: 90 },
    { label: '生成报告', progress: 100 },
  ];

  for (const stage of stages) {
    await new Promise((r) => setTimeout(r, 280 + Math.random() * 200));
    onProgress(stage.progress);
  }

  return buildMockReport(url, improved);
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
