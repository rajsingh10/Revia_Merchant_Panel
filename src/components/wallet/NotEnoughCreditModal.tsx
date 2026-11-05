import React from 'react';
import { AlertOctagon, PlusCircle, X } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const NotEnoughCreditModal: React.FC = () => {
  const { blockedActionModal, closeBlockedActionModal, openTopUpModal } = useWallet();

  if (!blockedActionModal.isOpen) return null;

  const { requiredCost, currentBalance, usableBalance, actionName } = blockedActionModal;
  const shortfall = requiredCost - usableBalance;

  const handleOpenTopUp = () => {
    closeBlockedActionModal();
    openTopUpModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-[#EAE6E1] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6E1] flex items-center justify-between bg-red-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[17px] font-extrabold text-[#1A1615] tracking-tight">Not Enough Credit</h2>
              <p className="text-[11px] sm:text-[12px] text-red-700 font-medium">Action blocked due to insufficient wallet balance</p>
            </div>
          </div>
          <button
            onClick={closeBlockedActionModal}
            className="p-1.5 text-[#6E6A66] hover:text-[#1A1615] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          <p className="text-[13px] sm:text-[14px] text-[#4A433D] leading-relaxed">
            <strong className="text-[#1A1615]">{actionName}</strong> requires{' '}
            <span className="font-extrabold text-[#1A1615]">{requiredCost} credits</span>. Your current usable balance is{' '}
            <span className="font-extrabold text-amber-700">{usableBalance} credits</span>.
          </p>

          <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[12px] sm:text-[13px]">
              <span className="text-[#6E6A66]">Total Balance:</span>
              <span className="font-bold text-[#1A1615]">{currentBalance} credits</span>
            </div>
            <div className="flex items-center justify-between text-[12px] sm:text-[13px]">
              <span className="text-[#6E6A66]">System Provisioning Lock:</span>
              <span className="font-bold text-[#6E6A66]">-250 credits</span>
            </div>
            <div className="flex items-center justify-between text-[12px] sm:text-[13px] border-t border-[#EAE6E1] pt-2">
              <span className="text-[#1A1615] font-bold">Usable Balance:</span>
              <span className="font-extrabold text-amber-700">{usableBalance} credits</span>
            </div>
            <div className="flex items-center justify-between text-[12px] sm:text-[13px] border-t border-[#EAE6E1] pt-2">
              <span className="text-[#1A1615] font-bold">Required Credits:</span>
              <span className="font-bold text-[#1A1615]">{requiredCost} credits</span>
            </div>
            <div className="border-t border-[#EAE6E1] pt-2 flex items-center justify-between text-[12px] sm:text-[13px]">
              <span className="font-bold text-red-700">Shortfall:</span>
              <span className="font-extrabold text-red-600">-{shortfall} credits</span>
            </div>
          </div>

          <p className="text-[11px] sm:text-[12px] text-[#6E6A66]">
            Add credit now to complete your action immediately.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeBlockedActionModal}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-[#EAE6E1] text-[#6E6A66] hover:text-[#1A1615] hover:bg-[#FAF8F5] text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer"
            >
              Cancel Action
            </button>

            <button
              type="button"
              onClick={handleOpenTopUp}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#2D124D] to-[#4A154B] hover:bg-[#3E1A68] text-white rounded-xl text-[12px] sm:text-[13px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Credit & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
