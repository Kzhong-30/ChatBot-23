import { scoreGrade } from '@/utils/scanSimulator';

export default function ScoreRing({ score, prevScore }: { score: number; prevScore?: number }) {
  const grade = scoreGrade(score);
  const radius = 72;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const improved = typeof prevScore === 'number';
  const delta = improved ? score - (prevScore as number) : 0;

  const getStroke = (s: number) => {
    if (s >= 85) return 'url(#scoreGradientG)';
    if (s >= 60) return 'url(#scoreGradientY)';
    return 'url(#scoreGradientR)';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 to-dark-800 p-6">
      <div className="mb-3 flex items-center justify-between text-xs font-medium">
        <span className="text-dark-400 uppercase tracking-wider">综合评分</span>
        <span className={`rounded-md px-2 py-0.5 font-bold text-white ${grade.color.replace('text-', 'bg-').replace('400', '600')}`}>
          Grade {grade.label}
        </span>
      </div>
      <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="scoreGradientG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="scoreGradientY" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="scoreGradientR" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={getStroke(score)}
            strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-black tabular-nums tracking-tight ${grade.color}`}>{score}</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-dark-500">
            / 100
          </div>
          {improved && delta !== 0 && (
            <div
              className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                delta > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} 分
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
