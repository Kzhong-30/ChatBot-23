import { create } from 'zustand';
import type { ActiveFilters, ColorBlindType, ScanReport, Severity } from '@/types';
import { simulateScan } from '@/utils/scanSimulator';
import { downloadHtml, downloadPdf } from '@/utils/reportGenerator';

interface AppState {
  currentUrl: string;
  isScanning: boolean;
  scanProgress: number;
  currentReport: ScanReport | null;
  previousReport: ScanReport | null;
  compareMode: boolean;
  selectedIssueId: string | null;
  activeFilters: ActiveFilters;
  colorBlindMode: ColorBlindType;
  quickDemoMode: boolean;

  setUrl: (url: string) => void;
  startScan: (improved?: boolean) => Promise<void>;
  selectIssue: (id: string | null) => void;
  toggleSeverityFilter: (s: Severity) => void;
  toggleCategoryFilter: (c: string) => void;
  clearFilters: () => void;
  setColorBlindMode: (m: ColorBlindType) => void;
  enterCompareMode: () => void;
  exitCompareMode: () => void;
  runImprovedScan: () => Promise<void>;
  exportReport: (format: 'pdf' | 'html') => void;
  setQuickDemo: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUrl: 'https://www.example-shop.com/products/smartwatch-2024',
  isScanning: false,
  scanProgress: 0,
  currentReport: null,
  previousReport: null,
  compareMode: false,
  selectedIssueId: null,
  activeFilters: {
    severity: [],
    categories: [],
  },
  colorBlindMode: 'normal',
  quickDemoMode: false,

  setUrl: (url) => set({ currentUrl: url }),

  startScan: async (improved = false) => {
    const { currentUrl, compareMode, currentReport } = get();
    if (!currentUrl) return;

    if (compareMode && currentReport && !improved) {
      set({ previousReport: currentReport });
    }

    set({ isScanning: true, scanProgress: 0, selectedIssueId: null });

    try {
      const report = await simulateScan(
        currentUrl,
        (progress) => set({ scanProgress: progress }),
        improved
      );
      set({ currentReport: report, isScanning: false });
    } catch (e) {
      set({ isScanning: false });
    }
  },

  selectIssue: (id) => set({ selectedIssueId: id }),

  toggleSeverityFilter: (s) =>
    set((state) => {
      const has = state.activeFilters.severity.includes(s);
      return {
        activeFilters: {
          ...state.activeFilters,
          severity: has ? state.activeFilters.severity.filter((x) => x !== s) : [...state.activeFilters.severity, s],
        },
      };
    }),

  toggleCategoryFilter: (c) =>
    set((state) => {
      const has = state.activeFilters.categories.includes(c);
      return {
        activeFilters: {
          ...state.activeFilters,
          categories: has
            ? state.activeFilters.categories.filter((x) => x !== c)
            : [...state.activeFilters.categories, c],
        },
      };
    }),

  clearFilters: () =>
    set({
      activeFilters: { severity: [], categories: [] },
    }),

  setColorBlindMode: (m) => set({ colorBlindMode: m }),

  enterCompareMode: () => {
    const { currentReport } = get();
    if (!currentReport) return;
    set({ compareMode: true, previousReport: currentReport });
  },

  exitCompareMode: () => set({ compareMode: false, previousReport: null }),

  runImprovedScan: async () => {
    await get().startScan(true);
  },

  exportReport: (format) => {
    const { currentReport, previousReport, compareMode } = get();
    if (!currentReport) return;
    if (format === 'html') {
      downloadHtml(currentReport, compareMode ? (previousReport ?? undefined) : undefined);
    } else {
      void downloadPdf(currentReport);
    }
  },

  setQuickDemo: (v) => set({ quickDemoMode: v }),
}));
