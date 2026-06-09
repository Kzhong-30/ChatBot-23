import type { ColorBlindType } from '@/types';
import { colorBlindInfo, getColorBlindFilter } from '@/utils/colorBlindFilters';
import { Eye } from 'lucide-react';

const options: ColorBlindType[] = ['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

export default function ColorBlindSwitch({ value, onChange }: { value: ColorBlindType; onChange: (v: ColorBlindType) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-dark-700 bg-dark-900/60 p-1.5">
      <span className="flex items-center gap-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-dark-500">
        <Eye className="h-3.5 w-3.5" /> 色盲模拟
      </span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            title={colorBlindInfo[opt].desc}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              active
                ? 'bg-primary-500/20 text-primary-300 shadow-inner shadow-primary-900/40 ring-1 ring-primary-500/40'
                : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
            }`}
          >
            {colorBlindInfo[opt].label.split('（')[0]}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPreview({ type }: { type: ColorBlindType }) {
  const info = colorBlindInfo[type];
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-900/40 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-white">{info.label}</h4>
          <p className="mt-0.5 text-xs text-dark-400">{info.desc}</p>
        </div>
        <span className="rounded-full bg-dark-800 px-2.5 py-1 text-[10px] font-bold text-dark-300">
          {info.percent}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-dark-700">
        <div
          className="grid h-60 grid-cols-4 gap-px bg-dark-700 transition-all duration-500"
          style={{ filter: getColorBlindFilter(type) }}
        >
          {[
            ['#ef4444', '红'], ['#f59e0b', '橙'], ['#eab308', '黄'], ['#22c55e', '绿'],
            ['#06b6d4', '青'], ['#3b82f6', '蓝'], ['#8b5cf6', '紫'], ['#ec4899', '粉'],
            ['#1e293b', '深蓝'], ['#334155', '暗灰'], ['#94a3b8', '中灰'], ['#e2e8f0', '浅灰'],
            ['#f97316', '橘红'], ['#84cc16', '青柠'], ['#14b8a6', '深青'], ['#a855f7', '紫罗兰'],
          ].map(([c, n], i) => (
            <div key={i} className="relative flex items-end justify-center bg-[var(--c)] pb-2 text-xs font-bold text-black/80" style={{ ['--c' as string]: c as string }}>
              <span className="rounded bg-white/40 px-1.5 py-0.5 backdrop-blur-sm">{n}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-mono text-white backdrop-blur">
          {type === 'normal' ? '正常色彩感知' : `滤镜: ${type.toUpperCase()}`}
        </div>
      </div>
    </div>
  );
}
