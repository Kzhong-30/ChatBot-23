import type { Severity } from '@/types';

const config: Record<Severity, { label: string; className: string; dot: string; pulse?: boolean }> = {
  serious: {
    label: '严重',
    className: 'bg-serious-bg text-serious-light border-serious/40',
    dot: 'bg-serious',
    pulse: true,
  },
  warning: {
    label: '警告',
    className: 'bg-warning-bg text-warning-light border-warning/40',
    dot: 'bg-warning',
  },
  tip: {
    label: '提示',
    className: 'bg-tip-bg text-tip-light border-tip/40',
    dot: 'bg-tip',
  },
};

export default function SeverityBadge({ severity, size = 'md' }: { severity: Severity; size?: 'sm' | 'md' | 'lg' }) {
  const c = config[severity];
  const sizing = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2';
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wider ${c.className} ${sizing}`}
    >
      <span className={`${dotSize} rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}
