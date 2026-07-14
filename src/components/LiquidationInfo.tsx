import { ShieldAlert, BookOpen, Scale, Percent, Zap, AlertTriangle } from 'lucide-react';

export function LiquidationInfo() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Introduction Banner */}
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-40 h-40 bg-indigo-600/10 blur-[40px] rounded-full pointer-events-none" />
        <div className="absolute top-[-100px] right-[-100px] w-40 h-40 bg-amber-600/5 blur-[40px] rounded-full pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">LTV & Liquidation Safety Parameters</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              DeFi lending platforms use collateral to guarantee loans. When asset prices move, these balances must remain within safe ratios. Below is a detailed explanation of the safety ratios implemented on Gripe.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan-To-Value */}
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-3">
            <Percent className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-slate-200">1. Loan-to-Value (LTV) Limit</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Loan-to-Value (LTV) ratio defines the maximum amount of debt you can borrow against your locked collateral. At Gripe, the maximum LTV for EURC is <span className="text-amber-450 font-bold">70%</span>.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">LTV Formula</p>
            <p className="text-slate-200 font-bold">Max Borrowable = Collateral Value &times; 70%</p>
            <p className="text-slate-400 mt-2">Example: Lock $1,000 USD of EURC collateral &rarr; Borrow up to $700 of USDC debt.</p>
          </div>
        </div>

        {/* Liquidation Threshold */}
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-3">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-slate-200">2. Liquidation Threshold</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Liquidation Threshold is the debt-to-collateral ratio at which a position is considered under-collateralized. At Gripe, the threshold is <span className="text-emerald-405 font-bold">80%</span>.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Threshold Formula</p>
            <p className="text-slate-200 font-bold">Liquidation Point = Collateral Value &times; 80%</p>
            <p className="text-slate-400 mt-2">If your debt exceeds $800 on a $1,000 collateral deposit, the position becomes liquidatable.</p>
          </div>
        </div>
      </div>

      {/* Health Factor Deep Dive */}
      <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-slate-200">3. The Health Factor Index</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          The Health Factor is a single numeric indicator reflecting how close your borrow position is to liquidation. It is calculated by comparing your collateral valuation against your total borrow debt.
        </p>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 font-mono text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Health Factor Calculation</span>
          <p className="text-slate-100 font-bold text-sm md:text-base leading-relaxed">
            Health Factor = (Collateral Value &times; Liquidation Threshold) / Borrowed Debt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center">
            <span className="text-lg font-bold text-emerald-400 block font-mono">&gt; 1.5</span>
            <span className="text-xs font-bold text-slate-200 block mt-1">Healthy & Safe</span>
            <p className="text-[10px] text-slate-400 mt-2">Adequate collateral. Highly insulated from sudden price drops.</p>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center">
            <span className="text-lg font-bold text-amber-400 block font-mono">1.0 to 1.5</span>
            <span className="text-xs font-bold text-slate-200 block mt-1">Caution Margin</span>
            <p className="text-[10px] text-slate-400 mt-2">Approaching thresholds. Monitor rates or add more collateral.</p>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center">
            <span className="text-lg font-bold text-rose-400 block font-mono">&lt; 1.0</span>
            <span className="text-xs font-bold text-slate-200 block mt-1">Liquidatable</span>
            <p className="text-[10px] text-slate-400 mt-2">Under-collateralized. Eligible for liquidation by keepers.</p>
          </div>
        </div>
      </div>

      {/* Critical What Happens Next block */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row gap-5 items-start">
        <div className="absolute top-[-100px] left-[-100px] w-40 h-40 bg-rose-600/10 blur-[40px] rounded-full pointer-events-none" />
        <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/15 shrink-0 relative z-10">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="font-display text-base font-bold text-white">What happens during a liquidation event?</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            If your Health Factor drops below <span className="text-rose-400 font-semibold">1.0</span>, smart contract keepers can pay off up to 50% of your USDC debt. In return, the keeper claims your EURC collateral at a discounted rate, plus a liquidation penalty fee (typically 5%).
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400 pt-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Always monitor your positions during high volatility. Keep your Health Factor above 1.5.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
