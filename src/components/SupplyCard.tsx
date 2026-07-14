import { useState } from 'react';
import { useUserPosition } from '../hooks/useUserPosition';
import { usePoolInfo } from '../hooks/usePoolInfo';
import { useSupply } from '../hooks/useSupply';
import { USDC } from '../config/tokens';
import { TxModal } from './TxModal';
import { Wallet, Info, PlusCircle, ArrowUpRight, TrendingUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function SupplyCard() {
  const {
    isConnected,
    usdcBalance,
    usdcAllowanceRaw,
    supplied,
    liveSupplied,
    refetchAll,
  } = useUserPosition();

  const { totalSupplied } = usePoolInfo();
  const { supply, withdraw, status, txHash, errorMsg, currentStep, reset } = useSupply();

  const [activeSubTab, setActiveSubTab] = useState<'supply' | 'withdraw'>('supply');
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalActionType, setModalActionType] = useState<'supply' | 'withdraw'>('supply');

  const handleMax = () => {
    if (activeSubTab === 'supply') {
      setAmount(usdcBalance.toString());
    } else {
      setAmount(supplied.toString());
    }
  };

  const handleAction = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setModalActionType(activeSubTab);
    setIsModalOpen(true);
  };

  const handleConfirmTx = async () => {
    if (modalActionType === 'supply') {
      await supply(amount, usdcAllowanceRaw);
    } else {
      await withdraw(amount);
    }
    // Refetch state after completion/error
    refetchAll();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setAmount('');
    refetchAll();
  };

  const isInvalidAmount = !amount || isNaN(Number(amount)) || Number(amount) <= 0;
  const isInsufficientBalance = activeSubTab === 'supply' 
    ? Number(amount) > usdcBalance 
    : Number(amount) > supplied;

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Visual background gradient accent */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">USDC Lending</h2>
            <p className="text-xs text-slate-400">Earn dynamic interest on supplied capital</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Supply APY</span>
          <span className="text-xl font-bold text-emerald-400 font-display tracking-tight">5.00%</span>
        </div>
      </div>

      {/* Internal Sub-Tabs from Theme spec */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
        <button
          onClick={() => { setActiveSubTab('supply'); setAmount(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            activeSubTab === 'supply'
              ? 'bg-white text-black shadow-xl shadow-white/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Supply
        </button>
        <button
          onClick={() => { setActiveSubTab('withdraw'); setAmount(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            activeSubTab === 'withdraw'
              ? 'bg-white text-black shadow-xl shadow-white/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Main Form Area */}
      <div className="space-y-4">
        {/* Supplied Position Counter */}
        {isConnected && supplied > 0 && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Your Supplied Position</span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {liveSupplied.toFixed(6)}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">USDC</span>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 focus-within:border-emerald-500/40 transition-all">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Amount to {activeSubTab === 'supply' ? 'Supply' : 'Withdraw'}</span>
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              {activeSubTab === 'supply' ? 'Wallet: ' : 'Supplied: '}
              <span className="font-semibold font-mono text-slate-300">
                {activeSubTab === 'supply' ? usdcBalance.toFixed(2) : supplied.toFixed(2)}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected}
              className="w-2/3 bg-transparent border-0 p-0 text-3xl font-bold font-display text-white placeholder-slate-700 focus:outline-none focus:ring-0 disabled:opacity-50"
            />
            <div className="flex items-center gap-2 shrink-0">
              {isConnected && (
                <button
                  onClick={handleMax}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded uppercase border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/30 transition-all"
                >
                  Max
                </button>
              )}
              <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
                <img src={USDC.logo} alt="USDC Logo" className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white text-sm">USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic button state */}
        {!isConnected ? (
          <div className="text-center p-4 text-xs bg-white/5 rounded-2xl border border-white/5 text-slate-400">
            Connect wallet above to access lending functions
          </div>
        ) : (
          <button
            onClick={handleAction}
            disabled={isInvalidAmount || isInsufficientBalance}
            className={`w-full py-5 rounded-2xl font-bold text-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer ${
              isInvalidAmount
                ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                : isInsufficientBalance
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 cursor-not-allowed'
                : activeSubTab === 'supply'
                ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.2)]'
                : 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(244,63,94,0.2)]'
            }`}
          >
            {isInvalidAmount
              ? 'Enter Amount'
              : isInsufficientBalance
              ? 'Insufficient Balance'
              : activeSubTab === 'supply'
              ? usdcAllowanceRaw === 0n
                ? 'Approve & Supply USDC'
                : 'Supply USDC'
              : 'Withdraw USDC'}
          </button>
        )}
      </div>

      {/* Pool-wide info */}
      <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Total Pool Deposited:</span>
        </div>
        <span className="font-bold text-slate-200 font-mono">
          {totalSupplied > 0 ? `${totalSupplied.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC` : '0.00 USDC'}
        </span>
      </div>

      {/* Interactive TxModal */}
      <TxModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        actionType={modalActionType}
        tokenSymbol="USDC"
        amount={amount}
        status={status}
        txHash={txHash}
        errorMsg={errorMsg}
        currentStep={currentStep}
        onConfirm={handleConfirmTx}
      />
    </div>
  );
}
