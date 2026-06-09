import { Globe2, Sparkles, History, Loader2, Scan } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const DEMO_URLS = [
  'https://www.example-shop.com/products/smartwatch-2024',
  'https://demo-blog.tech/2024/react-best-practices',
  'https://admin.dashboard.io/reports/sales-q1',
  'https://news.example.org/articles/climate-summit-2024',
];

export default function UrlInput() {
  const { currentUrl, setUrl, isScanning, scanProgress, startScan, setQuickDemo } = useAppStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startScan();
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-800 bg-gradient-to-br from-dark-900 via-dark-900 to-primary-950/40 p-8 md:p-10">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#e11d48]/10 blur-3xl" />
      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-700/50 bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-300">
            <Sparkles className="h-3 w-3" /> 基于 axe-core · WCAG 2.1 AA
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dark-700 bg-dark-800/60 px-3 py-1 text-xs font-medium text-dark-300">
            6 大检测维度 · 200+ 规则
          </span>
        </div>

        <h2 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          检测你的网页
          <span className="bg-gradient-to-r from-primary-400 via-teal-300 to-primary-500 bg-clip-text text-transparent">
            {' '}无障碍问题
          </span>
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-dark-400 md:text-base">
          输入网址，一键分析图片 alt、表单标签、颜色对比度、焦点可见性、ARIA 用法、标题结构等问题，获取详细修复建议和专业报告。
        </p>

        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex flex-col gap-3 rounded-2xl border border-dark-700 bg-dark-950/70 p-2 shadow-2xl shadow-black/40 backdrop-blur md:flex-row md:items-center">
            <div className="relative flex-1">
              <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" />
              <input
                value={currentUrl}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                placeholder="https://example.com/page-to-audit"
                required
                className="h-14 w-full rounded-xl border border-transparent bg-dark-900/60 pl-12 pr-4 font-mono text-sm text-white placeholder:text-dark-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !currentUrl}
              className="group relative h-14 overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-7 text-sm font-semibold text-white shadow-lg shadow-primary-900/40 transition hover:from-primary-400 hover:to-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isScanning ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  检测中 {scanProgress}%
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Scan className="h-4 w-4 transition-transform group-hover:scale-110" />
                  开始检测
                </span>
              )}
            </button>
          </div>

          {isScanning && (
            <div className="mt-4 overflow-hidden rounded-full bg-dark-800">
              <div
                className="h-2 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-dark-500">
          <History className="h-3.5 w-3.5" />
          <span className="mr-2">快速示例：</span>
          {DEMO_URLS.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setUrl(url)}
              className="truncate rounded-lg border border-dark-700 bg-dark-800/50 px-3 py-1.5 font-mono text-[11px] text-dark-300 transition hover:border-primary-700 hover:bg-primary-900/20 hover:text-primary-300"
              style={{ maxWidth: 320 }}
            >
              {url.replace(/^https?:\/\//, '')}
            </button>
          ))}
          <button
            onClick={() => {
              setQuickDemo(true);
              setUrl('https://demo-accessibility-site.com/landing');
              setTimeout(() => startScan(), 80);
            }}
            className="ml-2 flex items-center gap-1 rounded-lg border border-primary-700/40 bg-primary-900/30 px-3 py-1.5 text-primary-300 hover:bg-primary-900/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            一键演示
          </button>
        </div>
      </div>
    </section>
  );
}
