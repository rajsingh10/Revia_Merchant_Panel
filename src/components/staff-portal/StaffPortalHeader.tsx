import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Sparkles, LayoutGrid, ShoppingBag, UtensilsCrossed, ArrowLeft, Check, Store } from 'lucide-react';
import { StaffPortalTab } from './types';

interface Props {
  branchName?: string;
  waiterName?: string;
  activeTab?: StaffPortalTab;
  onTabChange?: (tab: StaffPortalTab) => void;
  pendingRequestsCount?: number;
  readyOrdersCount?: number;
  onOpenNotifications?: () => void;
  onOpenBranchPicker?: () => void;
  onOpenProfile?: () => void;
  onExitToMerchant?: () => void;
  branches?: string[];
  onSelectBranch?: (branch: string) => void;
}

export const StaffPortalHeader: React.FC<Props> = ({
  branchName = 'Downtown Flagship',
  waiterName = 'Rohan Singh',
  activeTab = 'tables',
  onTabChange,
  pendingRequestsCount = 4,
  readyOrdersCount = 1,
  onOpenNotifications,
  onOpenBranchPicker,
  onOpenProfile,
  onExitToMerchant,
  branches = ['Downtown Flagship', 'Northside Mall', 'West End Kiosk', 'Noida - Sector 18'],
  onSelectBranch
}) => {
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-[#EAE6E1] select-none shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Main Navigation Header */}
      <div className="px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        {/* Brand & Exit to Merchant Panel */}
        <div className="flex items-center gap-3 shrink-0">
          {onExitToMerchant && (
            <button
              type="button"
              onClick={onExitToMerchant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE6E1] bg-[#FAF8F5] hover:bg-white hover:border-[#5844A8]/40 text-xs font-bold text-[#1A1615] transition shadow-2xs cursor-pointer group"
              title="Return to Merchant Panel Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8C877D] group-hover:text-[#5844A8] transition-colors" />
              <span className="hidden sm:inline">Merchant Suite</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#5844A8]/20 ring-2 ring-white">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-[#1A1615] tracking-tight leading-none">Revia</h1>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5844A8] bg-[#5844A8]/10 px-2 py-0.5 rounded-md border border-[#5844A8]/20">
                  Staff
                </span>
              </div>
              <p className="text-[11px] text-[#8C877D] font-medium mt-0.5">Floor &amp; Table Service</p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (Visible on Desktop >= 1024px) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#EAE6E1] shadow-2xs">
          <button
            type="button"
            onClick={() => onTabChange?.('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6E6A66] hover:text-[#1A1615] hover:bg-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tables</span>
            <span className={`w-2 h-2 rounded-full ${activeTab === 'tables' ? 'bg-pink-300' : 'bg-gray-300'}`} />
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'requests'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6E6A66] hover:text-[#1A1615] hover:bg-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black leading-none">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6E6A66] hover:text-[#1A1615] hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            {readyOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6E6A66] hover:text-[#1A1615] hover:bg-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Staff Menu</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Branch Selector Dropdown */}
          <div className="relative" ref={branchDropdownRef}>
            <button
              type="button"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#EAE6E1] hover:border-[#5844A8]/40 text-xs font-bold text-[#1A1615] shadow-2xs transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-none">{branchName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-[#EAE6E1] py-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-[#8C877D] uppercase tracking-wider">
                  Select Floor Venue
                </div>
                {branches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      onSelectBranch?.(b);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left transition hover:bg-[#FAF8F5] cursor-pointer ${
                      b === branchName ? 'text-[#5844A8] bg-[#5844A8]/5 font-black' : 'text-[#1A1615]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Store className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{b}</span>
                    </div>
                    {b === branchName && <Check className="w-3.5 h-3.5 text-[#5844A8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications with Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE6E1] hover:border-[#5844A8]/40 text-[#6E6A66] flex items-center justify-center relative shadow-2xs cursor-pointer transition hover:text-[#5844A8]"
            title="Service Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Staff Profile Pill */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 border-l border-gray-200/80 hover:opacity-85 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              RS
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-black text-[#1A1615] block leading-tight">{waiterName}</span>
              <span className="text-[10px] text-[#8C877D] font-semibold block leading-tight">Floor Waiter</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

