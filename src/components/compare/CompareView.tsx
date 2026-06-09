import { useAppStore } from '@/store/useAppStore';
import { GitCompare, Play, ArrowRightLeft, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import StatsOverview from '../dashboard/StatsOverview';
import IssueList from '../issues/IssueList';
import type { ScanReport } from '@/types';

const SECTION_STYLE = 'rounded-2xl border border-dark-800 bg-dark-900/30 p-4';

function DiffStat({ before, after, label }: { before: number; after: number; label: string }) {
  const diff = after - before;
  const arrow =
    diff < 0 ? (
      <span className="flex items-center gap-0.5 text-green-400">
        <TrendingDown className="h-3.5 w-3.5" />
        {diff}
      </span>
    ) : diff > 0 ? (
      <span className="flex items-center gap-0.5 text-serious-light">
        <TrendingUp className="h-3.5 w-3.5" /> +{diff}
      </span>
    ) : (
      <span className="flex items-center gap-0.5 text-dark-400">
        <Minus className="h-3.5 w-3.5" /> 0
      </span>
    );
  return (
    <div className={SECTION_STYLE}>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-dark-500">{label}</div>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-dark-300 line-through decoration-serious decoration-2">{before}</span>
          <ArrowRightLeft className="h-4 w-4 text-dark-600" />
          <span className="text-2xl font-bold text-white">{after}</span>
        </div>
        {arrow}
      </div>
    </div>
  );
}

export default function CompareView() {
  const { previousReport, currentReport, compareMode, exitCompareMode, runImprovedScan, isScanning } = useAppStore();

  if (!compareMode || !previousReport || !currentReport) {
    return (
      <section className="rounded-3xl border border-dashed border-dark-700 bg-dark-900/30 p-8 text-center backdrop-blur">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900/30">
          <GitCompare className="h-7 w-7 text-primary-400" />
        </div>
        <h3 className="text-base font-semibold text-white">对比模式</h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-dark-400">
          进入对比模式可对比修复前后的两次检测结果，直观展示无障碍改进情况。先执行一次检测，然后点击下方按钮。
        </p>
      </section>
    );
  }

  const p = previousReport as ScanReport;
  const n = currentReport;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-800/40 bg-gradient-to-r from-primary-950/60 via-dark-900 to-primary-950/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/30">
            <GitCompare className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">修复前后对比分析</h3>
            <p className="text-xs text-dark-400">对比两次检测的改进情况，量化无障碍优化成果</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={runImprovedScan}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-900/40 transition hover:from-primary-400 hover:to-teal-400 disabled:opacity-60"
          >
            <Play className="h-4 w-4" /> 模拟"修复后"检测
          </button>
          <button
            onClick={exitCompareMode}
            className="rounded-xl border border-dark-700 bg-dark-900/60 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-800"
          >
            退出对比
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <DiffStat before={p.score} after={n.score} label="综合评分" />
        <DiffStat before={p.stats.serious} after={n.stats.serious} label="严重问题" />
        <DiffStat before={p.stats.warning} after={n.stats.warning} label="警告项" />
        <DiffStat before={p.stats.tip} after={n.stats.tip} label="优化提示" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-serious-bg px-3 py-1 text-xs font-bold text-serious-light">修复前</span>
            <span className="text-xs font-mono text-dark-500">{p.scanTime}</span>
          </div>
          <div className="space-y-5 pr-2">
            <div className="pointer-events-none opacity-80">
              <StatsOverview />
            </div>
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-primary-900/50 px-3 py-1 text-xs font-bold text-primary-300">修复后</span>
            <span className="text-xs font-mono text-dark-500">{n.scanTime}</span>
          </div>
          <div className="pl-2">
            <IssueList />
          </div>
        </div>
      </div>
    </section>
  );
}
