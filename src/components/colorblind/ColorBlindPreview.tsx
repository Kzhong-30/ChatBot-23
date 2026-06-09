import { useAppStore } from '@/store/useAppStore';
import {
  PROTANOPIA_MATRIX,
  DEUTERANOPIA_MATRIX,
  TRITANOPIA_MATRIX,
  ACHROMATOPSIA_MATRIX,
  colorBlindInfo,
  getColorBlindFilter,
} from '@/utils/colorBlindFilters';
import type { ColorBlindType } from '@/types';
import ColorBlindSwitch from './ColorBlindSwitch';
import { Info } from 'lucide-react';

function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="protanopia-filter">
          <feColorMatrix type="matrix" values={PROTANOPIA_MATRIX} />
        </filter>
        <filter id="deuteranopia-filter">
          <feColorMatrix type="matrix" values={DEUTERANOPIA_MATRIX} />
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix type="matrix" values={TRITANOPIA_MATRIX} />
        </filter>
        <filter id="achromatopsia-filter">
          <feColorMatrix type="matrix" values={ACHROMATOPSIA_MATRIX} />
        </filter>
      </defs>
    </svg>
  );
}

function MockShopPage() {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-white text-gray-900">
      <header className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-[11px] font-black">S</div>
          <span className="text-xs font-bold">SmartWatch Mall</span>
        </div>
        <nav className="flex items-center gap-3 text-[11px]">
          <span className="rounded-full bg-red-500 px-2 py-0.5 font-bold text-white">限时 50% OFF</span>
          <span className="opacity-90">首页</span>
          <span className="opacity-90">分类</span>
          <span className="opacity-90">订单</span>
        </nav>
      </header>
      <div className="p-3">
        <h1 className="mb-1.5 text-[15px] font-bold leading-tight">
          2024 新款智能手表 · <span className="text-emerald-600">钛合金旗舰版</span>
        </h1>
        <div className="mb-2 flex items-center gap-1.5 text-[10px] text-gray-500">
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-700">★ 4.9</span>
          <span>(8,432 条评价)</span>
          <span className="text-gray-400">· 已售 12,300+</span>
        </div>

        <div className="mb-3 grid grid-cols-[120px,1fr] gap-3">
          <div className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-sky-200 to-blue-500 text-white">
            <div className="relative z-10 h-16 w-16 rounded-[22px] border-4 border-white/80 bg-gray-900 shadow-xl">
              <div className="absolute inset-1.5 rounded-[14px] bg-gradient-to-br from-green-400 via-teal-500 to-emerald-700" />
            </div>
            <div className="absolute left-0 top-0 rounded-br-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black text-white">
              NEW
            </div>
            <div className="absolute right-0 bottom-0 rounded-tl-md bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">
              HOT
            </div>
          </div>
          <div className="flex flex-col justify-between py-0.5">
            <div>
              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="rounded-sm bg-red-50 px-1 py-0.5 text-[10px] font-bold text-red-600">直降 400</span>
                <span className="text-[11px] text-gray-400 line-through">￥1,599</span>
              </div>
              <div className="mb-1.5 flex items-baseline gap-1">
                <span className="text-[11px] text-red-600">￥</span>
                <span className="text-2xl font-black leading-none text-red-600">1,199</span>
              </div>
              <div className="mb-1.5 flex items-center gap-1 text-[10px]">
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">● 现货</span>
                <span className="text-gray-500">顺丰包邮 · 24h 内发货</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 rounded-md bg-emerald-500 px-2 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-600">
                立即购买
              </button>
              <button className="flex-1 rounded-md border border-blue-500 bg-blue-50 px-2 py-1.5 text-[11px] font-bold text-blue-600">
                加入购物车
              </button>
              <button className="rounded-md border border-gray-300 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-600 hover:bg-gray-100">
                取消
              </button>
            </div>
          </div>
        </div>

        <div className="mb-2 rounded-md border border-gray-200 bg-gray-50 p-2 text-[11px] leading-relaxed text-gray-700">
          <h3 className="mb-0.5 font-bold text-gray-900">产品介绍</h3>
          采用 <span className="font-bold text-indigo-600">航空级钛合金表壳</span>，
          蓝宝石玻璃镜面支持 <span className="font-bold text-orange-600">血压监测、血氧检测、睡眠追踪</span>，
          续航长达 <span className="font-bold text-emerald-700">14 天</span>，
          <a className="ml-0.5 text-blue-600 underline">查看完整参数 →</a>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="mb-1 text-[10px] font-medium text-gray-600">注册邮箱（无 label）</div>
            <input
              type="email"
              placeholder="请输入邮箱地址"
              className="w-full rounded border border-gray-300 px-2 py-1 text-[11px]"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-gray-600">
              颜色
              <span className="text-[9px] text-rose-500">*仅支持 1 项</span>
            </div>
            <div className="flex gap-1">
              {['#1e293b', '#f97316', '#10b981', '#e11d48'].map((c) => (
                <div
                  key={c}
                  className="h-5 w-5 rounded-full border-2 border-white ring-1 ring-gray-300"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideBySidePreview({ type }: { type: ColorBlindType }) {
  const info = colorBlindInfo[type];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-dark-700 bg-dark-900/50 p-2.5">
        <div className="mb-2 flex items-center justify-between px-1">
          <div>
            <div className="text-[11px] font-bold text-white">正常视觉</div>
            <div className="text-[10px] text-dark-500">Reference · 标准色彩</div>
          </div>
          <span className="rounded-full bg-dark-800 px-2 py-0.5 text-[10px] font-bold text-dark-300">
            参考
          </span>
        </div>
        <div
          className="h-[380px] overflow-hidden rounded-lg"
          style={{ filter: getColorBlindFilter('normal') }}
        >
          <MockShopPage />
        </div>
      </div>
      <div className="rounded-xl border border-primary-800/50 bg-primary-950/20 p-2.5 ring-1 ring-primary-500/20">
        <div className="mb-2 flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
              {info.label}
              {type !== 'normal' && <Info className="h-3 w-3 text-primary-400" />}
            </div>
            <div className="text-[10px] text-dark-400">{info.desc}</div>
          </div>
          <span className="rounded-full bg-primary-900/60 px-2 py-0.5 text-[10px] font-bold text-primary-300">
            {info.percent}
          </span>
        </div>
        <div
          className="h-[380px] overflow-hidden rounded-lg ring-2 ring-primary-500/30"
          style={{ filter: getColorBlindFilter(type) }}
        >
          <MockShopPage />
        </div>
      </div>
    </div>
  );
}

function SwatchGrid({ type, accent }: { type: ColorBlindType; accent: string }) {
  const swatches = [
    { c: '#ef4444', n: '红' }, { c: '#f59e0b', n: '橙' }, { c: '#eab308', n: '黄' }, { c: '#22c55e', n: '绿' },
    { c: '#06b6d4', n: '青' }, { c: '#3b82f6', n: '蓝' }, { c: '#8b5cf6', n: '紫' }, { c: '#ec4899', n: '粉' },
  ];
  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900/40 p-3">
      <div className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${accent}`}>
        色卡参考 · {colorBlindInfo[type].label.split('（')[0]}
      </div>
      <div
        className="grid h-20 grid-cols-8 gap-1 rounded-lg bg-dark-800 p-1"
        style={{ filter: getColorBlindFilter(type) }}
      >
        {swatches.map((s) => (
          <div
            key={s.c}
            title={`${s.n}: ${s.c}`}
            className="relative flex items-end justify-center rounded-md"
            style={{ backgroundColor: s.c }}
          >
            <span className="mb-0.5 rounded bg-black/40 px-1 text-[8px] font-bold text-white/90">
              {s.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorBlindPreview() {
  const { colorBlindMode, setColorBlindMode } = useAppStore();
  const previewMode = colorBlindMode === 'normal' ? 'deuteranopia' : colorBlindMode;

  return (
    <section className="rounded-3xl border border-dark-800 bg-dark-900/40 p-5 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">🎨 色盲视觉模拟</h3>
          <p className="mt-0.5 text-xs text-dark-400">
            并排查看同一页面在正常视觉与色盲视觉下的呈现差异，验证配色是否对色盲用户友好。
          </p>
        </div>
        <ColorBlindSwitch value={colorBlindMode} onChange={setColorBlindMode} />
      </div>

      <SvgDefs />

      <SideBySidePreview type={previewMode} />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SwatchGrid type="normal" accent="text-dark-300" />
        <SwatchGrid type={previewMode} accent="text-primary-300" />
      </div>

      {colorBlindMode === 'normal' && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary-800/40 bg-primary-950/30 p-3 text-[11px] text-dark-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
          <span>
            当前模式为 <strong className="text-white">正常视觉</strong>，上方自动对比参考了
            <strong className="text-primary-300"> 绿色盲（Deuteranopia）</strong>
            ，这是用户中比例最高的色盲类型（约 1.2% 男性）。切换色盲模式即可查看对应类型的实时模拟。
          </span>
        </div>
      )}
    </section>
  );
}
