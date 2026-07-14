import { WalletButton } from './WalletButton';
import { Shield, Coins, TrendingUp, HelpCircle, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'supply' | 'borrow' | 'dashboard' | 'liquidation';
  onNavigate: (tab: 'supply' | 'borrow' | 'dashboard' | 'liquidation') => void;
}

export function Navbar({ activeTab, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo & Wordmark */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Custom logo box from design theme */}
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/>
              <path d="M12 22V12"/>
              <path d="M12 12l8.5-4.7"/>
              <path d="M12 12L3.5 7.3"/>
            </svg>
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-white block leading-none">
              Gripe<span className="text-emerald-400">.</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5">
              Secure Liquidity
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Text Links with dynamic underbars) */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('supply')}
            className={`text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              activeTab === 'supply'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Supply
          </button>
          <button
            onClick={() => onNavigate('borrow')}
            className={`text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              activeTab === 'borrow'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Borrow
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('liquidation')}
            className={`text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              activeTab === 'liquidation'
                ? 'text-slate-200 border-slate-200'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Liquidation
          </button>
        </nav>

        {/* Right side interactions */}
        <div className="flex items-center gap-4">
          
          {/* Network Status Indicator */}
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_#10b981]"></span>
            <span className="text-xs font-mono text-slate-300">Arc Testnet</span>
          </div>

          {/* Web3 wallet connect button */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
