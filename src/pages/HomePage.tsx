import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import UrlInput from '@/components/scan/UrlInput';
import StatsOverview from '@/components/dashboard/StatsOverview';
import FilterBar from '@/components/issues/FilterBar';
import IssueList from '@/components/issues/IssueList';
import ColorBlindPreview from '@/components/colorblind/ColorBlindPreview';
import ExportPanel from '@/components/export/ExportPanel';
import CompareView from '@/components/compare/CompareView';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Zap, ListChecks, Palette, Braces, Scroll, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Palette, title: '颜色对比度', desc: '自动检测文本、控件、边界对比度是否符合 WCAG 标准' },
  { icon: Scroll, title: '替代文本检查', desc: '识别缺失 alt 的图像、按钮、图标等非文本内容' },
  { icon: Braces, title: 'ARIA 语义校验', desc: '验证 ARIA 属性、角色和状态的正确使用方式' },
  { icon: ListChecks, title: '标题结构', desc: '检测标题层级跳跃、重复 H1 等结构问题' },
  { icon: Zap, title: '键盘可访问', desc: '检查焦点顺序、跳过链接、焦点可见性等' },
  { icon: CheckCircle2, title: '表单标签', desc: '确保所有表单控件均有关联标签和说明' },
];

export default function HomePage() {
  const { currentReport, compareMode } = useAppStore();
  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10">
        <Header />
        <main className="pt-6">
          <Container>
            <div className="space-y-6">
              <UrlInput />

              {!currentReport && !compareMode && (
                <section className="animate-fade-in grid gap-4 md:grid-cols-3">
                  {FEATURES.slice(0, 6).map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.title}
                        className="group relative overflow-hidden rounded-2xl border border-dark-800 bg-dark-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-dark-600 hover:bg-dark-900/80"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/5 transition-all group-hover:bg-primary-500/10" />
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900/40 text-primary-400 ring-1 ring-primary-500/20 transition-all group-hover:bg-primary-500 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="mb-1 text-sm font-semibold text-white">{f.title}</h4>
                        <p className="text-xs leading-relaxed text-dark-400">{f.desc}</p>
                      </div>
                    );
                  })}
                </section>
              )}

              {!currentReport && (
                <section className="animate-fade-in rounded-3xl border border-dark-800 bg-gradient-to-br from-dark-900/60 via-dark-950 to-primary-950/30 p-6 backdrop-blur">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">检测覆盖范围</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { level: 'A', items: 30, color: 'from-red-500 to-rose-600' },
                      { level: 'AA', items: 20, color: 'from-amber-500 to-orange-600' },
                      { level: 'AAA', items: 28, color: 'from-primary-500 to-teal-600' },
                    ].map((lv) => (
                      <div key={lv.level} className="rounded-2xl border border-dark-700 bg-dark-950/60 p-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-dark-500">WCAG Level</div>
                            <div className={`bg-gradient-to-br ${lv.color} bg-clip-text text-4xl font-black text-transparent`}>
                              {lv.level}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold tabular-nums text-white">{lv.items}+</div>
                            <div className="text-[10px] text-dark-500">检测规则</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {currentReport && (
                <>
                  {compareMode ? (
                    <CompareView />
                  ) : (
                    <>
                      <StatsOverview />
                      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-5">
                          <FilterBar />
                          <IssueList />
                        </div>
                        <div className="space-y-5">
                          <ExportPanel />
                          <ColorBlindPreview />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {currentReport && compareMode && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <ColorBlindPreview />
                  <ExportPanel />
                </div>
              )}
            </div>

            <footer className="mt-16 border-t border-dark-800 pt-8 pb-6 text-center">
              <p className="text-xs text-dark-500">
                Built with ♿ React 18 + TypeScript + axe-core · Web Accessibility Scanner
              </p>
              <p className="mt-1 text-[10px] text-dark-600">
                本工具为演示用途，检测结果基于 Mock 数据。生产环境建议接入真实 axe-core 浏览器端检测。
              </p>
            </footer>
          </Container>
        </main>
      </div>
    </div>
  );
}
