import { useAppStore } from '@/store/useAppStore';
import type { Severity } from '@/types';
import { ISSUE_CATEGORIES } from '@/data/mockData';
import { Filter, X, Image, FormInput, Palette, Focus, Code2, Heading, FileText, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

const ICON_MAP: Record<string, LucideIcon> = {
  Image,
  FormInput,
  Palette,
  Focus,
  Code2,
  Heading,
  FileText,
};

const SEVERITY_OPTIONS: { key: Severity; label: string }[] = [
  { key: 'serious', label: '严重' },
  { key: 'warning', label: '警告' },
  { key: 'tip', label: '提示' },
];

export default function FilterBar() {
  const { activeFilters, toggleSeverityFilter, toggleCategoryFilter, clearFilters, currentReport } = useAppStore();
  const hasFilters = activeFilters.severity.length > 0 || activeFilters.categories.length > 0;

  useEffect(() => {
    const iconKeys = Object.keys(ICON_MAP);
    const rows = ISSUE_CATEGORIES.map((cat) => {
      const iconInMap = Object.prototype.hasOwnProperty.call(ICON_MAP, cat.icon);
      const strictMatch = iconKeys.some((k) => k === cat.icon);
      const caseInsensitiveMatch = iconKeys.find((k) => k.toLowerCase() === cat.icon.toLowerCase());
      const resolved = ICON_MAP[cat.icon] ?? Circle;
      return {
        category: cat.key,
        categoryLabel: cat.label,
        cat_icon_name: cat.icon,
        ICON_MAP_key_exists: iconInMap,
        strict_equality_match: strictMatch,
        case_mismatch_but_fuzzy: !strictMatch && Boolean(caseInsensitiveMatch),
        fuzzy_match_key: caseInsensitiveMatch ?? null,
        resolved_icon_name: resolved.displayName ?? resolved.name ?? 'unknown',
        will_fallback_to_Circle: !iconInMap,
      };
    });
    console.table(rows);
    console.log('[FilterBar] ICON_MAP 注册 keys:', iconKeys);
    for (const cat of ISSUE_CATEGORIES) {
      const isExact = iconKeys.includes(cat.icon);
      if (!isExact) {
        console.warn(
          `[FilterBar] ⚠ 分类 ${cat.key} 的 icon="${cat.icon}" 与 ICON_MAP key 不全等匹配，请修正大小写`,
        );
      }
    }
  }, []);

  if (!currentReport) return null;

  return (
    <div className="rounded-2xl border border-dark-800 bg-dark-900/60 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-dark-300">
          <Filter className="h-4 w-4" /> 筛选
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-dark-400 transition hover:bg-dark-800 hover:text-white"
          >
            <X className="h-3 w-3" /> 清除
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">严重程度</div>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((opt) => {
              const active = activeFilters.severity.includes(opt.key);
              const counts = {
                serious: currentReport.stats.serious,
                warning: currentReport.stats.warning,
                tip: currentReport.stats.tip,
              };
              const baseClass =
                opt.key === 'serious'
                  ? active
                    ? 'bg-serious-bg border-serious text-serious-light'
                    : 'border-dark-700 text-dark-400 hover:border-serious/50 hover:text-serious-light'
                  : opt.key === 'warning'
                    ? active
                      ? 'bg-warning-bg border-warning text-warning-light'
                      : 'border-dark-700 text-dark-400 hover:border-warning/50 hover:text-warning-light'
                    : active
                      ? 'bg-tip-bg border-tip text-tip-light'
                      : 'border-dark-700 text-dark-400 hover:border-tip/50 hover:text-tip-light';
              return (
                <button
                  key={opt.key}
                  onClick={() => toggleSeverityFilter(opt.key)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${baseClass}`}
                >
                  {opt.label}
                  <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px]">{counts[opt.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-500">问题分类</div>
          <div className="flex flex-wrap gap-2">
            {ISSUE_CATEGORIES.map((cat) => {
              const active = activeFilters.categories.includes(cat.key);
              const Icon = ICON_MAP[cat.icon] ?? Circle;
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategoryFilter(cat.key)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-primary-500 bg-primary-900/40 text-primary-300'
                      : 'border-dark-700 text-dark-400 hover:border-dark-600 hover:text-dark-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
