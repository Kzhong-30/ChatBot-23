import { AlertTriangle, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { Severity } from '@/types';

interface Props {
  severity: Severity | 'passed';
  label: string;
  value: number;
  delta?: number;
}

const cfg = {
  serious: {
    icon: AlertTriangle,
    bg: 'from-serious/10 to-serious-bg/60',
    border: 'border-serious/30',
    iconBg: 'bg-serious/15 text-serious',
    valueCls: 'text-serious-light',
    labelCls: 'text-serious-light/70',
  },
  warning: {
    icon: AlertCircle,
    bg: 'from-warning/10 to-warning-bg/60',
    border: 'border-warning/30',
    iconBg: 'bg-warning/15 text-warning',
    valueCls: 'text-warning-light',
    labelCls: 'text-warning-light/70',
  },
  tip: {
    icon: Lightbulb,
    bg: 'from-tip/10 to-tip-bg/60',
    border: 'border-tip/30',
    iconBg: 'bg-tip/15 text-tip',
    valueCls: 'text-tip-light',
    labelCls: 'text-tip-light/70',
  },
  passed: {
    icon: CheckCircle2,
    bg: 'from-primary-500/10 to-primary-900/30',
    border: 'border-primary-700/30',
    iconBg: 'bg-primary-500/15 text-primary-400',
    valueCls: 'text-primary-300',
    labelCls: 'text-primary-300/70',
  },
};

export default function StatCard({ severity, label, value, delta }: Props) {
  const c = cfg[severity];
  const Icon = c.icon;
  const improved = typeof delta === 'number' && delta !== 0;
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${c.bg} ${c.border} p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        {improved && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              (delta as number) < 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {(delta as number) < 0 ? '' : '+'}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className={`text-3xl font-bold tabular-nums ${c.valueCls}`}>{value}</div>
        <div className={`mt-1 text-xs font-medium ${c.labelCls}`}>{label}</div>
      </div>
    </div>
  );
}
