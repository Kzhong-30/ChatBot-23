import { ChevronRight, Code2, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import type { A11yIssue } from '@/types';
import SeverityBadge from './SeverityBadge';
import { useState } from 'react';
import { ISSUE_CATEGORIES } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function IssueCard({ issue, index }: { issue: A11yIssue; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const [copied, setCopied] = useState(false);
  const { selectIssue, selectedIssueId } = useAppStore();
  const category = ISSUE_CATEGORIES.find((c) => c.key === issue.category);
  const isSelected = selectedIssueId === issue.id;

  const copySelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(issue.element.selector);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`group animate-fade-in overflow-hidden rounded-2xl border bg-dark-900/70 transition-all ${
        isSelected ? 'border-primary-500 ring-1 ring-primary-500/40' : ''
      } ${open ? 'border-dark-600 shadow-xl shadow-black/20' : 'border-dark-800 hover:border-dark-700'}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-start gap-4 p-5 text-left"
        aria-expanded={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
            issue.severity === 'serious'
              ? 'bg-serious/15 text-serious-light'
              : issue.severity === 'warning'
                ? 'bg-warning/15 text-warning-light'
                : 'bg-tip/15 text-tip-light'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={issue.severity} size="sm" />
            <span className="rounded-md bg-dark-800 px-2 py-0.5 text-[10px] font-medium text-dark-400 uppercase">
              {category?.label ?? issue.category}
            </span>
            {issue.wcagRefs.slice(0, 2).map((ref) => (
              <span key={ref.code} className="rounded-md border border-dark-700 px-2 py-0.5 text-[10px] font-mono text-dark-400">
                WCAG {ref.code} {ref.level}
              </span>
            ))}
          </div>
          <h3 className="mb-1 font-semibold text-white">{issue.title}</h3>
          <p className="line-clamp-2 text-xs text-dark-400">{issue.description}</p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              selectIssue(issue.id);
            }}
            aria-label="查看详情"
            title="在右侧抽屉中查看完整详情"
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
              isSelected
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-dark-300 hover:bg-dark-800 hover:text-primary-400'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>查看完整详情</span>
          </button>
          <ChevronRight
            className={`h-5 w-5 text-dark-500 transition-transform duration-300 ${
              open ? 'rotate-90 text-primary-400' : ''
            }`}
          />
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-dark-800 bg-dark-950/50 p-5">
          <div className="grid gap-5 lg:grid-cols-[1.4fr,1fr]">
            <div className="space-y-4">
              <div>
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-dark-500">问题描述</h4>
                <p className="text-sm leading-relaxed text-dark-200">{issue.description}</p>
              </div>
              <div>
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-dark-500">用户影响</h4>
                <p className="text-sm leading-relaxed text-dark-300">{issue.impact}</p>
              </div>
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">修复步骤</h4>
                <ol className="space-y-1.5">
                  {issue.fixSuggestion.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-dark-200">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-900/50 text-[10px] font-bold text-primary-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              {issue.fixSuggestion.codeBefore && (
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-[10px] font-medium uppercase text-serious/70">❌ 修复前</div>
                    <pre className="overflow-x-auto rounded-lg border border-dark-700 bg-dark-950 p-3 font-mono text-[11px] text-serious-light/90">
                      {issue.fixSuggestion.codeBefore}
                    </pre>
                  </div>
                  {issue.fixSuggestion.codeAfter && (
                    <div>
                      <div className="mb-1 text-[10px] font-medium uppercase text-primary-400/80">✅ 修复后</div>
                      <pre className="overflow-x-auto rounded-lg border border-primary-900/50 bg-dark-950 p-3 font-mono text-[11px] text-primary-300/90">
                        {issue.fixSuggestion.codeAfter}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">WCAG 标准</h4>
                <div className="space-y-2">
                  {issue.wcagRefs.map((ref) => (
                    <a
                      key={ref.code}
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-3 rounded-xl border border-dark-700 bg-dark-900/70 p-3 text-xs transition hover:border-primary-700 hover:bg-primary-950/20"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-900/40 font-mono font-bold text-primary-400">
                        {ref.code}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-dark-100">
                          <span className="font-medium">{ref.name}</span>
                          <span className="rounded bg-dark-800 px-1.5 py-0.5 text-[9px] font-bold text-dark-300">
                            Level {ref.level}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[10px] text-dark-500">{ref.url}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-dark-500">影响元素</h4>
                  <button
                    onClick={copySelector}
                    className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-dark-400 hover:bg-dark-800 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-3 w-3 text-primary-400" /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> 复制选择器
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-dark-700 bg-dark-900/60 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[10px] text-dark-500">
                    <Code2 className="h-3 w-3" />
                    <span className="font-mono truncate">{issue.element.selector}</span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-dark-950 p-2.5 font-mono text-[11px] leading-relaxed text-[#a78bfa]">
                    {issue.element.html}
                  </pre>
                </div>
              </div>

              {issue.fixSuggestion.resources && issue.fixSuggestion.resources.length > 0 && (
                <div>
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">参考资源</h4>
                  <ul className="space-y-1">
                    {issue.fixSuggestion.resources.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r}
                          className="block truncate rounded-md px-2 py-1.5 text-xs text-primary-400 hover:bg-primary-900/20"
                          target="_blank"
                          rel="noreferrer"
                        >
                          → {r}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 border-t border-dark-800 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectIssue(issue.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-primary-900/30 text-primary-300 hover:bg-primary-900/50 hover:text-primary-200'
                  }`}
                >
                  <span>在右侧抽屉查看完整详情（含修复代码 Diff）</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
