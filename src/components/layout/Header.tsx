import { Accessibility, Github, Moon, Sun, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-dark-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/50">
            <Accessibility className="h-6 w-6 text-white" strokeWidth={2.2} />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] text-black">
              <ShieldCheck className="h-3 w-3" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              A11y<span className="text-primary-400">Scan</span>
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-dark-400">
              Web Accessibility Auditor
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <a className="rounded-lg px-3 py-1.5 text-sm text-dark-300 transition hover:bg-dark-800 hover:text-white" href="#">
            功能介绍
          </a>
          <a className="rounded-lg px-3 py-1.5 text-sm text-dark-300 transition hover:bg-dark-800 hover:text-white" href="#">
            WCAG 标准
          </a>
          <a className="rounded-lg px-3 py-1.5 text-sm text-dark-300 transition hover:bg-dark-800 hover:text-white" href="#">
            使用文档
          </a>
          <div className="mx-2 h-6 w-px bg-dark-700" />
          <button className="rounded-lg p-2 text-dark-400 transition hover:bg-dark-800 hover:text-white" aria-label="切换主题">
            <Moon className="h-4 w-4" />
          </button>
          <a
            href="#"
            className="ml-1 flex items-center gap-1.5 rounded-lg border border-dark-700 px-3 py-1.5 text-sm text-dark-300 transition hover:border-dark-600 hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
