import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, ChevronDown, Wallet } from 'lucide-react';

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 cursor-pointer"
                  >
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-sm font-medium cursor-pointer"
                  >
                    <Shield size={15} />
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2.5">
                  {/* Network Indicator Button */}
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all text-xs font-medium text-slate-300 cursor-pointer"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 14, height: 14 }}
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                    <ChevronDown size={12} className="opacity-60" />
                  </button>

                  {/* Connected Account Details */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800 transition-all text-sm font-medium text-slate-100 shadow-md cursor-pointer"
                  >
                    {account.ensAvatar ? (
                      <img
                        src={account.ensAvatar}
                        alt="ENS Avatar"
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-400" />
                    )}
                    <span>{account.displayName}</span>
                    {account.displayBalance && (
                      <span className="hidden md:inline text-xs text-slate-400 border-l border-slate-800 pl-2">
                        {account.displayBalance}
                      </span>
                    )}
                    <ChevronDown size={14} className="opacity-60" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
