import type { A11yIssue, Severity } from '@/types';
import SeverityBadge from './SeverityBadge';
import { X } from 'lucide-react';

export default function IssueDetail({ issue, onClose }: { issue: A11yIssue | null; onClose: () => void }) {
  if (!issue) return null;

  const sevCls: Record<Severity, string> = {
    serious: 'border-serious',
    warning: 'border-warning',
    tip: 'border-tip',
  };

  return (
    <aside
      className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md animate-slide-in flex-col border-l border-dark-800 bg-dark-950 shadow-2xl shadow-black/60"
      role="dialog"
      aria-label="问题详情"
    >
      <div className={`flex items-start justify-between border-b border-dark-800 p-5 ${sevCls[issue.severity]}`}>
        <div>
          <SeverityBadge severity={issue.severity} />
          <h2 className="mt-2 text-lg font-bold text-white">{issue.title}</h2>
          <p className="mt-1 font-mono text-[11px] text-dark-500">{issue.id}</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 text-dark-400 hover:bg-dark-800 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">描述</h3>
          <p className="text-sm leading-relaxed text-dark-200">{issue.description}</p>
        </section>
        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">影响</h3>
          <p className="text-sm leading-relaxed text-dark-300">{issue.impact}</p>
        </section>
        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">WCAG 引用</h3>
          <div className="space-y-1.5">
            {issue.wcagRefs.map((ref) => (
              <a
                key={ref.code}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-dark-700 px-3 py-2 text-xs text-dark-200 hover:border-primary-700 hover:bg-primary-950/20"
              >
                <span>
                  <span className="font-mono font-bold text-primary-400">{ref.code}</span> {ref.name}
                </span>
                <span className="rounded bg-dark-800 px-1.5 text-[10px] font-bold text-dark-300">{ref.level}</span>
              </a>
            ))}
          </div>
        </section>
        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">影响元素</h3>
          <div className="rounded-lg border border-dark-700 bg-dark-900 p-3">
            <p className="mb-2 truncate font-mono text-[11px] text-primary-400">{issue.element.selector}</p>
            <pre className="overflow-x-auto rounded bg-dark-950 p-2 font-mono text-[11px] text-[#a78bfa]">
              {issue.element.html}
            </pre>
          </div>
        </section>
        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">修复建议</h3>
          <ol className="space-y-2">
            {issue.fixSuggestion.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-dark-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-900/50 text-[10px] font-bold text-primary-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
        {issue.fixSuggestion.codeBefore && (
          <section className="mb-5 space-y-2">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">代码对比</h3>
            <div>
              <div className="text-[10px] font-medium text-serious-light/80">修复前</div>
              <pre className="overflow-x-auto rounded border border-dark-700 bg-dark-900 p-2.5 font-mono text-[11px] text-serious-light/90">
                {issue.fixSuggestion.codeBefore}
              </pre>
            </div>
            {issue.fixSuggestion.codeAfter && (
              <div>
                <div className="text-[10px] font-medium text-primary-400">修复后</div>
                <pre className="overflow-x-auto rounded border border-dark-700 bg-dark-900 p-2.5 font-mono text-[11px] text-primary-300/90">
                  {issue.fixSuggestion.codeAfter}
                </pre>
              </div>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
