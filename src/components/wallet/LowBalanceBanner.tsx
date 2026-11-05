import React from 'react';
import { AlertTriangle, PlusCircle, X } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const LowBalanceBanner: React.FC = () => {
  const { wallet, isBannerDismissed, dismissBanner, openTopUpModal } = useWallet();

  const isLowBalance = wallet.balance < wallet.lowBalanceThreshold;

  if (!isLowBalance || isBannerDismissed) {
    return null;
  }

  return (
    <div className="bg-[#FAF5FF] border-b border-[#F3E8FF] px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[#2D124D] transition-all duration-200 z-30 shrink-0">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-6 h-6 rounded-full bg-[#EDE9FE] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-[#7C3AED]" />
        </div>
        <p className="text-xs sm:text-[13px] font-medium tracking-tight text-[#2D124D]">
          <span className="font-bold text-[#2D124D]">Low Wallet Balance</span> —{' '}
          <strong className="font-extrabold text-[#7C3AED]">{wallet.balance} credits</strong> remaining. Add credit to keep actions running.
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={openTopUpModal}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#2D124D] hover:bg-[#3E1A68] text-white rounded-lg text-[12px] font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5 text-white/90" />
          Add Credit
        </button>

        <button
          onClick={dismissBanner}
          title="Dismiss for current session"
          className="p-1 text-[#8C877D] hover:text-[#2D124D] rounded-md hover:bg-[#F3E8FF] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
