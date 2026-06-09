import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, Search } from 'lucide-react';
import IssueCard from './IssueCard';

export default function IssueList() {
  const { currentReport, activeFilters } = useAppStore();
  if (!currentReport) return null;

  const filtered = useMemo(() => {
    return currentReport.issues.filter((issue) => {
      if (activeFilters.severity.length && !activeFilters.severity.includes(issue.severity)) return false;
      if (activeFilters.categories.length && !activeFilters.categories.includes(issue.category)) return false;
      return true;
    });
  }, [currentReport.issues, activeFilters]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark-200">
          问题列表
          <span className="ml-2 text-xs font-medium text-dark-500">
            {filtered.length} / {currentReport.issues.length}
          </span>
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-dark-500">
          <Search className="h-3.5 w-3.5" />
          展开卡片查看完整修复建议与 WCAG 引用
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-dark-700 bg-dark-900/40 p-12 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-900/30">
            <AlertTriangle className="h-8 w-8 text-primary-400" />
          </div>
          <p className="font-medium text-dark-200">没有匹配的问题</p>
          <p className="mt-1 text-xs text-dark-500">尝试清除筛选条件查看全部结果</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
