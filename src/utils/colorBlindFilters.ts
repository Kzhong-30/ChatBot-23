import type { ColorBlindType } from '@/types';

export const ACHROMATOPSIA_MATRIX =
  '0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0';

export const colorBlindFilterMap: Record<ColorBlindType, string> = {
  normal: 'none',
  protanopia: 'url("#protanopia-filter")',
  deuteranopia: 'url("#deuteranopia-filter")',
  tritanopia: 'url("#tritanopia-filter")',
  achromatopsia: 'url("#achromatopsia-filter")',
};

export const colorBlindInfo: Record<ColorBlindType, { label: string; desc: string; percent: string }> = {
  normal: {
    label: '正常视觉',
    desc: '标准色彩感知',
    percent: '~92% 人口',
  },
  protanopia: {
    label: '红色盲（Protanopia）',
    desc: '无法感知红色光，红-绿色觉混淆',
    percent: '男性 ~1%',
  },
  deuteranopia: {
    label: '绿色盲（Deuteranopia）',
    desc: '无法感知绿色光，红-绿色觉混淆（最常见）',
    percent: '男性 ~1.2%',
  },
  tritanopia: {
    label: '蓝黄色盲（Tritanopia）',
    desc: '无法感知蓝色光，蓝-黄色觉混淆',
    percent: '0.003%',
  },
  achromatopsia: {
    label: '全色盲（Achromatopsia）',
    desc: '完全色盲，只能感知亮度差异',
    percent: '0.003%',
  },
};

export const PROTANOPIA_MATRIX =
  '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0';

export const DEUTERANOPIA_MATRIX =
  '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0';

export const TRITANOPIA_MATRIX =
  '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0';

export function getColorBlindFilter(type: ColorBlindType): string {
  return colorBlindFilterMap[type];
}
