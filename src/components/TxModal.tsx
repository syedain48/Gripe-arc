import { Loader2, CheckCircle2, XCircle, ExternalLink, ArrowRight, Wallet, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TxModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'supply' | 'withdraw' | 'addCollateral' | 'removeCollateral' | 'borrow' | 'repay';
  tokenSymbol: string;
  amount: string;
  status: 'idle' | 'approving' | 'submitting' | 'pending' | 'success' | 'error';
  txHash: `0x${string}` | undefined;
  errorMsg: string | null;
  currentStep: string;
  onConfirm: () => void;
}

export function TxModal({
  isOpen,
  onClose,
  actionType,
  tokenSymbol,
  amount,
  status,
  txHash,
  errorMsg,
  currentStep,
  onConfirm,
}: TxModalProps) {
  if (!isOpen) return null;

  // Pretty title generators
  const getActionName = () => {
    switch (actionType) {
      case 'supply': return 'Supply (Lend) Asset';
      case 'withdraw': return 'Withdraw Supplied Asset';
      case 'addCollateral': return 'Add EURC Collateral';
      case 'removeCollateral': return 'Remove EURC Collateral';
      case 'borrow': return 'Borrow USDC Asset';
      case 'repay': return 'Repay USDC Debt';
    }
  };

  const getActionVerb = () => {
    switch (actionType) {
      case 'supply': return 'Supplying';
      case 'withdraw': return 'Withdrawing';
      case 'addCollateral': return 'Adding Collateral';
      case 'removeCollateral': return 'Removing Collateral';
      case 'borrow': return 'Borrowing';
      case 'repay': return 'Repaying';
    }
  };

  const getActionButtonLabel = () => {
    switch (actionType) {
      case 'supply': return 'Confirm Supply';
      case 'withdraw': return 'Confirm Withdraw';
      case 'addCollateral': return 'Confirm Add Collateral';
      case 'removeCollateral': return 'Confirm Remove Collateral';
      case 'borrow': return 'Confirm Borrow';
      case 'repay': return 'Confirm Repayment';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status === 'idle' || status === 'success' || status === 'error' ? onClose : undefined}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
            <h3 className="text-lg font-bold tracking-tight text-emerald-400">
              {getActionName()}
            </h3>
            {(status === 'idle' || status === 'success' || status === 'error') && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Core Content */}
          <div className="min-h-[160px] flex flex-col justify-center">
            {status === 'idle' && (
              <div className="space-y-4">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                      Transaction Amount
                    </span>
                    <span className="text-2xl font-black text-slate-100">
                      {amount} <span className="text-emerald-400 text-lg font-normal">{tokenSymbol}</span>
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-slate-400 shadow">
                    {tokenSymbol}
                  </div>
                </div>

                {/* Additional context based on transaction */}
                <div className="text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Protocol Gas Asset</span>
                    <span className="text-emerald-400 font-semibold">USDC (Arc Native)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network</span>
                    <span className="text-emerald-400 font-semibold">Arc Testnet</span>
                  </div>
                  {actionType === 'supply' && (
                    <div className="flex justify-between">
                      <span>Accrual Rate (Supply APY)</span>
                      <span className="text-emerald-400 font-semibold">5% APY</span>
                    </div>
                  )}
                  {actionType === 'borrow' && (
                    <div className="flex justify-between">
                      <span>Debt Rate (Borrow APY)</span>
                      <span className="text-amber-400 font-semibold">8% APY</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={onConfirm}
                  className="w-full mt-6 py-3 px-5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                >
                  {getActionButtonLabel()}
                </button>
              </div>
            )}

            {(status === 'approving' || status === 'submitting' || status === 'pending') && (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="font-bold text-lg text-slate-200">
                    {status === 'approving' ? 'Approving Token Spend' : getActionVerb()}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {currentStep || 'Confirming transactions in your wallet...'}
                  </p>
                </div>
                {txHash && (
                  <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 mt-2 flex items-center gap-1.5 text-slate-400">
                    <span>Hash:</span>
                    <a
                      href={`https://testnet.arcscan.app/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                <div className="space-y-1">
                  <p className="font-bold text-xl text-slate-100">Transaction Successful</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    You have successfully {actionType === 'supply' ? 'supplied' : actionType === 'withdraw' ? 'withdrawn' : actionType === 'addCollateral' ? 'added collateral' : actionType === 'removeCollateral' ? 'removed collateral' : actionType === 'borrow' ? 'borrowed' : 'repaid'} {amount} {tokenSymbol}!
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full mt-4">
                  {txHash && (
                    <a
                      href={`https://testnet.arcscan.app/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 text-xs text-slate-300 font-medium bg-slate-950/60 hover:bg-slate-850 transition-all cursor-pointer"
                    >
                      View on Arcscan
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <XCircle className="w-16 h-16 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
                <div className="space-y-1">
                  <p className="font-bold text-xl text-slate-100">Transaction Failed</p>
                  <p className="text-xs text-rose-300/90 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-pre-wrap max-h-[120px] overflow-y-auto font-mono text-left">
                    {errorMsg || 'An unknown error occurred during transaction submission.'}
                  </p>
                </div>

                <div className="flex gap-2 w-full mt-4">
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
