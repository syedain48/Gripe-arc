import { useState } from 'react';
import { useUserPosition } from '../hooks/useUserPosition';
import { usePoolInfo } from '../hooks/usePoolInfo';
import { useBorrow } from '../hooks/useBorrow';
import { USDC, EURC } from '../config/tokens';
import { TxModal } from './TxModal';
import { Wallet, Info, ArrowDownLeft, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export function BorrowCard() {
  const {
    isConnected,
    usdcBalance,
    eurcBalance,
    usdcAllowanceRaw,
    eurcAllowanceRaw,
    collateral,
    debt,
    liveDebt,
    maxBorrowable,
    refetchAll,
  } = useUserPosition();

  const { totalBorrowed, borrowApy } = usePoolInfo();
  const { addCollateral, removeCollateral, borrowUSDC, repayUSDC, status, txHash, errorMsg, currentStep, reset } = useBorrow();

  const [activeTab, setActiveTab] = useState<'collateral' | 'borrow' | 'repay'>('collateral');
  // Sub-state for collateral tab: add or remove
  const [collateralSubTab, setCollateralSubTab] = useState<'add' | 'remove'>('add');
  
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalActionType, setModalActionType] = useState<'addCollateral' | 'removeCollateral' | 'borrow' | 'repay'>('addCollateral');

  const handleMax = () => {
    if (activeTab === 'collateral') {
      if (collateralSubTab === 'add') {
        setAmount(eurcBalance.toString());
      } else {
        setAmount(collateral.toString());
      }
    } else if (activeTab === 'borrow') {
      const availableToBorrow = Math.max(maxBorrowable - debt, 0);
      setAmount(availableToBorrow.toString());
    } else if (activeTab === 'repay') {
      // Repay MAX is the full debt or wallet balance, whichever is smaller (but allow setting full debt)
      setAmount(debt.toString());
    }
  };

  const handleAction = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    let actionType: typeof modalActionType = 'addCollateral';
    if (activeTab === 'collateral') {
      actionType = collateralSubTab === 'add' ? 'addCollateral' : 'removeCollateral';
    } else if (activeTab === 'borrow') {
      actionType = 'borrow';
    } else if (activeTab === 'repay') {
      actionType = 'repay';
    }

    setModalActionType(actionType);
    setIsModalOpen(true);
  };

  const handleConfirmTx = async () => {
    if (modalActionType === 'addCollateral') {
      await addCollateral(amount, eurcAllowanceRaw);
    } else if (modalActionType === 'removeCollateral') {
      await removeCollateral(amount);
    } else if (modalActionType === 'borrow') {
      await borrowUSDC(amount);
    } else if (modalActionType === 'repay') {
      await repayUSDC(amount, usdcAllowanceRaw);
    }
    refetchAll();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setAmount('');
    refetchAll();
  };

  // Input limits checking
  const isInvalidAmount = !amount || isNaN(Number(amount)) || Number(amount) <= 0;
  
  let isInsufficientBalance = false;
  if (activeTab === 'collateral') {
    isInsufficientBalance = collateralSubTab === 'add' 
      ? Number(amount) > eurcBalance 
      : Number(amount) > collateral;
  } else if (activeTab === 'borrow') {
    // Cannot borrow more than Max Borrowable - current debt
    isInsufficientBalance = Number(amount) > Math.max(maxBorrowable - debt, 0);
  } else if (activeTab === 'repay') {
    // Cannot repay more than wallet USDC balance
    isInsufficientBalance = Number(amount) > usdcBalance;
  }

  // Active token info based on tab
  const activeToken = activeTab === 'collateral' ? EURC : USDC;

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Visual background gradient accent */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <ArrowDownLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Borrow & Collateral</h2>
            <p className="text-xs text-slate-400">Lock EURC collateral to borrow USDC</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Borrow Rate</span>
          <span className="text-xl font-bold text-amber-400 font-display tracking-tight">8.00% APY</span>
        </div>
      </div>

      {/* Internal Navigation Tabs (3-way) */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
        <button
          onClick={() => { setActiveTab('collateral'); setAmount(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'collateral'
              ? 'bg-white text-black shadow-xl shadow-white/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Collateral
        </button>
        <button
          onClick={() => { setActiveTab('borrow'); setAmount(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'borrow'
              ? 'bg-white text-black shadow-xl shadow-white/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Borrow
        </button>
        <button
          onClick={() => { setActiveTab('repay'); setAmount(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'repay'
              ? 'bg-white text-black shadow-xl shadow-white/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Repay
        </button>
      </div>

      {/* Sub-selectors and positions */}
      <div className="space-y-4">
        {/* Collateral sub-tab (add/remove) selector */}
        {activeTab === 'collateral' && (
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl max-w-[180px] border border-white/5 mb-2">
            <button
              onClick={() => { setCollateralSubTab('add'); setAmount(''); }}
              className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                collateralSubTab === 'add'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => { setCollateralSubTab('remove'); setAmount(''); }}
              className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                collateralSubTab === 'remove'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Remove
            </button>
          </div>
        )}

        {/* Live Positions Info Displays */}
        {isConnected && (
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Your Collateral</span>
              <span className="text-sm font-bold text-slate-100 font-mono">{collateral.toFixed(2)} EURC</span>
            </div>
            <div>
              <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Your Debt</span>
              <span className="text-sm font-bold text-rose-400 font-mono">{liveDebt.toFixed(6)} USDC</span>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 focus-within:border-amber-500/40 transition-all">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>
              {activeTab === 'collateral'
                ? collateralSubTab === 'add'
                  ? 'Add EURC Collateral'
                  : 'Remove EURC Collateral'
                : activeTab === 'borrow'
                ? 'Borrow USDC Amount'
                : 'Repay USDC Debt'}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              {activeTab === 'collateral'
                ? collateralSubTab === 'add'
                  ? `Wallet: ${eurcBalance.toFixed(2)}`
                  : `Locked: ${collateral.toFixed(2)}`
                : activeTab === 'borrow'
                ? `Max Borrowable: ${Math.max(maxBorrowable - debt, 0).toFixed(2)}`
                : `Wallet: ${usdcBalance.toFixed(2)}`}
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
                <img src={activeToken.logo} alt={`${activeToken.symbol} Logo`} className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white text-sm">{activeToken.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Borrowing Limit Alert / Helper */}
        {activeTab === 'borrow' && isConnected && maxBorrowable > 0 && (
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>Current Collateral Value</span>
              <span className="text-slate-200 font-semibold">${(collateral * 1.08).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Max Borrowable (70% LTV)</span>
              <span className="text-amber-400 font-semibold">${maxBorrowable.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5">
              <span>Projected LTV with this borrow</span>
              <span className="font-mono text-emerald-400">
                {collateral > 0
                  ? (((debt + Number(amount || 0)) / (collateral * 1.08)) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
          </div>
        )}

        {/* Dynamic button state */}
        {!isConnected ? (
          <div className="text-center p-4 text-xs bg-white/5 rounded-2xl border border-white/5 text-slate-400">
            Connect wallet above to access borrowing functions
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
                : activeTab === 'collateral'
                ? collateralSubTab === 'add'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(245,158,11,0.2)]'
                  : 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(244,63,94,0.1)]'
                : activeTab === 'borrow'
                ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.2)]'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(59,130,246,0.2)]'
            }`}
          >
            {isInvalidAmount
              ? 'Enter Amount'
              : isInsufficientBalance
              ? activeTab === 'borrow' ? 'LTV Borrow limit reached' : 'Insufficient Balance'
              : activeTab === 'collateral'
              ? collateralSubTab === 'add'
                ? eurcAllowanceRaw === 0n
                  ? 'Approve & Lock EURC'
                  : 'Add EURC Collateral'
                : 'Remove EURC Collateral'
              : activeTab === 'borrow'
              ? 'Borrow USDC'
              : usdcAllowanceRaw === 0n
              ? 'Approve & Repay USDC'
              : 'Repay USDC Debt'}
          </button>
        )}
      </div>

      {/* Pool-wide info */}
      <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Total Pool Borrowed:</span>
        </div>
        <span className="font-bold text-slate-200 font-mono">
          {totalBorrowed > 0 ? `${totalBorrowed.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC` : '0.00 USDC'}
        </span>
      </div>

      {/* Interactive TxModal */}
      <TxModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        actionType={modalActionType}
        tokenSymbol={activeToken.symbol}
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
