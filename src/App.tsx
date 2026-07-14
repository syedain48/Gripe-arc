import { useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { SupplyCard } from './components/SupplyCard';
import { BorrowCard } from './components/BorrowCard';
import { LiquidationInfo } from './components/LiquidationInfo';

import { LayoutGrid, TrendingUp, ShieldAlert, CreditCard } from 'lucide-react';

const queryClient = new QueryClient();

function MainLayout() {
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow' | 'dashboard' | 'liquidation'>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-slate-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Navbar */}
      <Navbar activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab)} />

      {/* Main Body Stage */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'supply' && (
          <div className="max-w-xl mx-auto animate-fade-in space-y-4">
            <SupplyCard />
          </div>
        )}
        {activeTab === 'borrow' && (
          <div className="max-w-xl mx-auto animate-fade-in space-y-4">
            <BorrowCard />
          </div>
        )}
        {activeTab === 'liquidation' && <LiquidationInfo />}
      </main>

      {/* Mobile Sticky Bottom Navigation (Displays only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050608]/90 border-t border-white/10 backdrop-blur-md px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('supply')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'supply' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={18} />
            <span className="text-[10px] font-bold">Supply</span>
          </button>
          <button
            onClick={() => setActiveTab('borrow')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'borrow' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard size={18} />
            <span className="text-[10px] font-bold">Borrow</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'dashboard' ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={18} />
            <span className="text-[10px] font-bold">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'liquidation' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert size={18} />
            <span className="text-[10px] font-bold">Rules</span>
          </button>
        </div>
      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#10B981', // emerald-500
            accentColorForeground: '#020617', // slate-950
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <MainLayout />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
