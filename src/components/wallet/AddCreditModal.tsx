import React, { useState } from 'react';
import { X, Wallet as WalletIcon, Check, Sparkles, Shield } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const AddCreditModal: React.FC = () => {
  const { wallet, isTopUpModalOpen, closeTopUpModal, topUpWallet } = useWallet();

  const [selectedPreset, setSelectedPreset] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod] = useState<'razorpay'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isTopUpModalOpen) return null;

  const presets = [500, 1000, 5000, 10000];

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    if (val) {
      setSelectedPreset(0);
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedPreset;

  const handleConfirmTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const methodLabel = 'Razorpay';

      topUpWallet(finalAmount, methodLabel);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-[#EAE6E1] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6E1] flex items-center justify-between bg-[#FAF8F5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-[#2D124D] to-[#4A154B] flex items-center justify-center text-white shadow-xs shrink-0">
              <WalletIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[17px] font-extrabold text-[#1A1615] tracking-tight">Add Credits to Wallet</h2>
              <p className="text-[11px] sm:text-[12px] text-[#6E6A66]">Instant balance refill for setup & campaigns</p>
            </div>
          </div>
          <button
            onClick={closeTopUpModal}
            className="p-1.5 text-[#6E6A66] hover:text-[#1A1615] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleConfirmTopUp} className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Current Balance Snapshot */}
          <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[12px] sm:text-[13px] font-medium text-[#6E6A66]">Current Wallet Balance</span>
            <div className="flex items-center gap-2">
              <span className={`text-[15px] sm:text-[16px] font-extrabold ${wallet.balance < wallet.lowBalanceThreshold ? 'text-amber-600' : 'text-[#1A1615]'}`}>
                {wallet.balance.toLocaleString()} credits
              </span>
              {wallet.balance < wallet.lowBalanceThreshold && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                  Low
                </span>
              )}
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-[11px] sm:text-[12px] font-bold text-[#4A433D] uppercase tracking-wider mb-1.5">
              Select Credit Amount
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((amount) => {
                const isSelected = selectedPreset === amount && !customAmount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleSelectPreset(amount)}
                    className={`px-3 py-2.5 rounded-xl border text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#8B5CF6] bg-[#FAF5FF] text-[#2D124D] shadow-xs'
                        : 'border-[#EAE6E1] bg-white text-[#1A1615] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>+{amount.toLocaleString()} credits</span>
                    {isSelected && <Check className="w-4 h-4 text-[#7C3AED]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-[11px] font-medium text-[#6E6A66] mb-1">Or enter custom credits</label>
            <input
              type="number"
              min="10"
              placeholder="e.g. 2500"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE6E1] rounded-xl text-[13px] font-bold text-[#1A1615] outline-none focus:border-[#2D124D] transition-colors"
            />
          </div>

          {/* Payment Method - Razorpay Only */}
          <div>
            <label className="block text-[11px] sm:text-[12px] font-bold text-[#4A433D] uppercase tracking-wider mb-1.5">
              Payment Gateway
            </label>
            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 border-[#8B5CF6] bg-[#FAF5FF] cursor-default">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#072654] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
                  <path d="M6 8L10 4L14 12L18 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20H14L18 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] sm:text-[14px] font-extrabold text-[#1A1615] flex items-center gap-1.5">
                  Razorpay
                  <Check className="w-3.5 h-3.5 text-[#7C3AED]" />
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#6E6A66]">
                  UPI · Cards · Net Banking · Wallets
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-semibold shrink-0">
                <Shield className="w-3 h-3" />
                Secure
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={finalAmount <= 0 || isProcessing}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2D124D] to-[#4A154B] hover:bg-[#3E1A68] text-white rounded-xl font-bold text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Add {finalAmount.toLocaleString()} Credits</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
