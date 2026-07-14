import { usePoolInfo } from '../hooks/usePoolInfo';
import { useUserPosition } from '../hooks/useUserPosition';
import { HealthFactorGauge } from './HealthFactorGauge';
import { TrendingUp, ArrowDownLeft, Landmark, Zap, BarChart3, HelpCircle, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: 'supply' | 'borrow' | 'liquidation') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const {
    totalSupplied,
    totalBorrowed,
    availableLiquidity,
    utilizationRate,
    supplyApy,
    borrowApy,
    isPending: isPoolPending,
  } = usePoolInfo();

  const {
    isConnected,
    supplied,
    collateral,
    debt,
    healthFactor,
  } = useUserPosition();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Primary Protocol APY Metrics & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Supplied Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-[-100px] right-[-100px] w-40 h-40 bg-emerald-600/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Supplied</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {supplyApy.toFixed(2)}% APY
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-display tracking-tight">
            {totalSupplied > 0 ? totalSupplied.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">USDC supplied across pool</span>
        </div>

        {/* Total Borrowed Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-[-100px] right-[-100px] w-40 h-40 bg-indigo-600/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Borrowed</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              {borrowApy.toFixed(2)}% APY
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-display tracking-tight">
            {totalBorrowed > 0 ? totalBorrowed.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">USDC borrowed across pool</span>
        </div>

        {/* Available Liquidity Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-[-100px] right-[-100px] w-40 h-40 bg-blue-600/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Available Liquidity</span>
            <Landmark className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white font-display tracking-tight">
            {availableLiquidity > 0 ? availableLiquidity.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">USDC available to borrow</span>
        </div>

        {/* Utilization Rate Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-[-100px] right-[-100px] w-40 h-40 bg-emerald-600/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Utilization Rate</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-display tracking-tight">
            {utilizationRate.toFixed(2)}%
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-500"
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Personal Position & Health Factor Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User position summary */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display text-base font-bold text-slate-100">Your Positions</h3>
            </div>

            {!isConnected ? (
              <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <p className="text-sm text-slate-400 font-medium mb-3">Connect your Web3 wallet to view personal supplied, debt, and health positions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {/* Supplied */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Supplied</span>
                      <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">{supplied.toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-2">USDC Asset</span>
                  </div>

                  {/* Collateral */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Collateral</span>
                      <p className="text-lg font-bold text-amber-400 mt-1 font-mono">{collateral.toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-2">EURC Token</span>
                  </div>

                  {/* Borrowed */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Borrowed</span>
                      <p className="text-lg font-bold text-rose-400 mt-1 font-mono">{debt.toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-2">USDC Debt</span>
                  </div>
                </div>

                {/* Info and Navigation block */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Outstanding Debt (with Interest)</span>
                    <span className="font-bold text-rose-300 font-mono">{debt.toFixed(6)} USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Borrow Limit Utilization</span>
                    <span className="font-bold text-slate-250">
                      {collateral > 0 ? `${((debt / (collateral * 1.08)) * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 border-t border-white/5 pt-4">
            <button
              onClick={() => onNavigate('supply')}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer text-center"
            >
              Go to Supply Vault
            </button>
            <button
              onClick={() => onNavigate('borrow')}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer text-center"
            >
              Go to Borrow Vault
            </button>
          </div>
        </div>

        {/* Health Gauge */}
        <div className="lg:col-span-5">
          <HealthFactorGauge healthFactor={isConnected ? healthFactor : 999} />
        </div>

      </div>

      {/* 3. Educational Liquidation Explainer Strip */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-40 h-40 bg-amber-600/10 blur-[40px] rounded-full pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-100">Liquidation Protection & LTV Limits</h4>
            <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
              At Gripe, we require a maximum LTV of 70% and threshold of 80% to ensure protocol stability. If the euro-to-dollar exchange rate shifts, your health factor can change. Take a moment to understand our parameters.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('liquidation')}
          className="relative z-10 py-2.5 px-4 bg-white hover:bg-slate-200 text-black font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
        >
          Read Liquidation Guide
        </button>
      </div>
    </div>
  );
}
