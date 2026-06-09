import { useAppStore } from '@/store/useAppStore';
import { PROTANOPIA_MATRIX, DEUTERANOPIA_MATRIX, TRITANOPIA_MATRIX } from '@/utils/colorBlindFilters';
import ColorBlindSwitch, { FilterPreview } from './ColorBlindSwitch';

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
      </defs>
    </svg>
  );
}

export default function ColorBlindPreview() {
  const { colorBlindMode, setColorBlindMode } = useAppStore();

  return (
    <section className="rounded-3xl border border-dark-800 bg-dark-900/40 p-5 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">🎨 色盲视觉模拟</h3>
          <p className="mt-0.5 text-xs text-dark-400">切换不同色盲类型，预览你的页面配色对色盲用户是否友好</p>
        </div>
        <ColorBlindSwitch value={colorBlindMode} onChange={setColorBlindMode} />
      </div>
      <SvgDefs />
      <div className="grid gap-4 md:grid-cols-2">
        <FilterPreview type="normal" />
        <FilterPreview type={colorBlindMode === 'normal' ? 'deuteranopia' : colorBlindMode} />
      </div>
    </section>
  );
}
