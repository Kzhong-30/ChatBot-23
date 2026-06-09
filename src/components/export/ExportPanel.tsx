import { useAppStore } from '@/store/useAppStore';
import { FileText, FileCode, Download, GitCompare } from 'lucide-react';

export default function ExportPanel() {
  const { currentReport, exportReport, enterCompareMode, compareMode, previousReport } = useAppStore();

  if (!currentReport) {
    return (
      <section className="rounded-2xl border border-dashed border-dark-700 bg-dark-900/30 p-6 text-center backdrop-blur">
        <p className="text-sm text-dark-500">执行检测后可在此导出报告</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-dark-800 bg-dark-900/40 p-5 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">📄 报告导出 & 对比</h3>
          <p className="mt-0.5 text-xs text-dark-400">下载专业无障碍检测报告，或进入对比模式追踪修复进展</p>
        </div>
        <button
          onClick={enterCompareMode}
          disabled={compareMode}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
            compareMode
              ? 'cursor-not-allowed border-primary-700/50 bg-primary-900/40 text-primary-300'
              : 'border-dark-700 bg-dark-800/50 text-dark-200 hover:border-primary-700 hover:bg-primary-950/30 hover:text-primary-300'
          }`}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {compareMode ? (previousReport ? '对比模式已开启' : '进入对比模式') : '开启对比模式'}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={() => exportReport('pdf')}
          className="group flex items-center gap-4 rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 to-dark-800 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-serious/40 hover:shadow-xl hover:shadow-serious/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-serious/20 to-serious-bg ring-1 ring-serious/30">
            <FileText className="h-6 w-6 text-serious-light" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-white">
              PDF 报告 <Download className="h-3.5 w-3.5 text-dark-400 group-hover:text-serious-light" />
            </div>
            <p className="mt-0.5 text-xs text-dark-400">包含评分、问题清单、修复建议的标准审计 PDF</p>
          </div>
        </button>
        <button
          onClick={() => exportReport('html')}
          className="group flex items-center gap-4 rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 to-dark-800 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-950 ring-1 ring-primary-500/30">
            <FileCode className="h-6 w-6 text-primary-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-white">
              HTML 报告 <Download className="h-3.5 w-3.5 text-dark-400 group-hover:text-primary-400" />
            </div>
            <p className="mt-0.5 text-xs text-dark-400">
              可独立打开的交互式 HTML 报告{previousReport ? '（含对比视图）' : ''}
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
