import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthFactorGaugeProps {
  healthFactor: number;
}

export function HealthFactorGauge({ healthFactor }: HealthFactorGaugeProps) {
  // Determine health state and details
  let state: 'healthy' | 'caution' | 'danger' = 'healthy';
  let colorClass = 'text-emerald-400';
  let strokeColor = '#10B981'; // Tailwind emerald-500
  let bgGradient = 'from-emerald-500/10 to-transparent';
  let label = 'Healthy';

  if (healthFactor < 1.0) {
    state = 'danger';
    colorClass = 'text-rose-500';
    strokeColor = '#F43F5E'; // Tailwind rose-500
    bgGradient = 'from-rose-500/10 to-transparent';
    label = 'Liquidatable';
  } else if (healthFactor <= 1.5) {
    state = 'caution';
    colorClass = 'text-amber-400';
    strokeColor = '#F59E0B'; // Tailwind amber-500
    bgGradient = 'from-amber-500/10 to-transparent';
    label = 'Caution';
  }

  // Calculate percentage for SVG Gauge (0% corresponds to HF = 0, 100% corresponds to HF = 3.0+)
  const maxHFForGauge = 3.0;
  const clampedHF = Math.min(Math.max(healthFactor, 0), maxHFForGauge);
  const percentage = (clampedHF / maxHFForGauge) * 100;

  // Gauge dimensions
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-40 h-40 bg-indigo-600/10 blur-[40px] rounded-full pointer-events-none" />
      <h3 className="font-display text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
        Position Health Factor
      </h3>

      {/* SVG Circular Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-white/5"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Active indicator */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text displaying health factor */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold ${colorClass} font-display tracking-tight`}>
            {healthFactor >= 999 ? '∞' : healthFactor.toFixed(2)}
          </span>
          <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
            {label}
          </span>
        </div>
      </div>

      {/* Threshold Label & Explainer */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Liquidation Threshold:</span>
          <span className="text-amber-400 font-bold">80% LTV</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-[240px] mt-2 leading-relaxed">
          If your Health Factor drops below <span className="text-rose-500 font-semibold">1.0</span>, up to 50% of your collateral can be liquidated to cover debt.
        </p>
      </div>

      {/* Interactive Warning Banners */}
      {state === 'danger' && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-350 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-[10px]">Critical Status</span>
            Your position is liquidatable. Supply more collateral or repay debt immediately.
          </div>
        </div>
      )}

      {state === 'caution' && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-[10px]">Caution Range</span>
            Your health factor is near the liquidation boundary. Monitor closely.
          </div>
        </div>
      )}

      {state === 'healthy' && healthFactor < 999 && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-[10px]">Safe Margin</span>
            Your position is adequately collateralized and safe from liquidation.
          </div>
        </div>
      )}
    </div>
  );
}
