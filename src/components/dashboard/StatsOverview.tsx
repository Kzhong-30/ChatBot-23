import ScoreRing from './ScoreRing';
import StatCard from './StatCard';
import { useAppStore } from '@/store/useAppStore';
import { Clock, Globe, FileCheck } from 'lucide-react';

export default function StatsOverview() {
  const { currentReport, compareMode, previousReport } = useAppStore();
  if (!currentReport) return null;
  const r = currentReport;
  const p = previousReport;

  const delta = (key: 'serious' | 'warning' | 'tip' | 'passed' | 'total') =>
    compareMode && p ? r.stats[key] - p.stats[key] : undefined;

  return (
    <div className="animate-fade-in rounded-3xl border border-dark-800 bg-dark-900/40 p-5 backdrop-blur">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-dark-800 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-dark-400">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span className="font-mono truncate max-w-[280px]">{r.url}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {r.scanTime}
          </span>
          <span className="flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5" /> 用时 {(r.duration / 1000).toFixed(2)}s
          </span>
        </div>
        {compareMode && (
          <span className="rounded-full border border-primary-700/50 bg-primary-900/30 px-3 py-1 text-xs font-semibold text-primary-300">
            ⚡ 对比模式
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px,1fr]">
        <ScoreRing score={r.score} prevScore={p?.score} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard severity="serious" label="严重问题" value={r.stats.serious} delta={delta('serious')} />
          <StatCard severity="warning" label="警告项" value={r.stats.warning} delta={delta('warning')} />
          <StatCard severity="tip" label="优化提示" value={r.stats.tip} delta={delta('tip')} />
          <StatCard severity="passed" label="通过规则数" value={r.stats.passed} delta={delta('passed')} />
        </div>
      </div>
    </div>
  );
}
