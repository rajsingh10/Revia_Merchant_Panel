import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LayoutGrid, ShoppingBag, UtensilsCrossed, ArrowLeft, Check, Store, Menu } from 'lucide-react';
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
  onToggleMobileMenu?: () => void;
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
  onToggleMobileMenu,
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
    <header className="bg-white border-b border-[#EFEAF7] select-none shrink-0 sticky top-0 z-30">
      {/* Main Navigation Header matching Merchant Panel Header */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 max-w-[1600px] mx-auto w-full">
        {/* Left: Mobile Menu Button + Merchant Suite Back Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg border border-[#EAE6E1] text-[#6E6A66] hover:bg-[#FAF8FF] cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {onExitToMerchant && (
            <button
              type="button"
              onClick={onExitToMerchant}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#EFEAF7] bg-[#FAF8FF] hover:bg-white hover:border-[#5844A8]/40 text-xs font-bold text-[#1E1548] transition shadow-2xs cursor-pointer group"
              title="Return to Merchant Panel Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8C84A0] group-hover:text-[#5844A8] transition-colors" />
              <span>Merchant Suite</span>
            </button>
          )}
        </div>

        {/* Center: Tablet & Desktop Navigation Bar (Visible on >= 768px) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-[#FAF8FF] p-1 lg:p-1.5 rounded-2xl border border-[#EFEAF7] shadow-2xs">
          <button
            type="button"
            onClick={() => onTabChange?.('tables')}
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'tables'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6B657E] hover:text-[#1E1548] hover:bg-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>Tables</span>
            <span className={`w-2 h-2 rounded-full ${activeTab === 'tables' ? 'bg-pink-300' : 'bg-gray-300'}`} />
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('requests')}
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition cursor-pointer relative whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6B657E] hover:text-[#1E1548] hover:bg-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
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
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition cursor-pointer relative whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6B657E] hover:text-[#1E1548] hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>Orders</span>
            {readyOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('menu')}
            className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#5844A8] text-white shadow-sm'
                : 'text-[#6B657E] hover:text-[#1E1548] hover:bg-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden lg:inline">Staff Menu</span>
            <span className="lg:hidden">Menu</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0 ml-auto md:ml-0">
          {/* Branch Selector Dropdown */}
          <div className="relative" ref={branchDropdownRef}>
            <button
              type="button"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#5844A8]/40 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[180px]">{branchName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] shrink-0" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-[#EFEAF7] py-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 border-b border-[#EFEAF7] text-[10px] font-bold text-[#8C84A0] uppercase tracking-wider">
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
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left transition hover:bg-[#FAF8FF] cursor-pointer ${
                      b === branchName ? 'text-[#5844A8] bg-[#5844A8]/5 font-black' : 'text-[#1E1548]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Store className="w-3.5 h-3.5 text-[#8C84A0]" />
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#EFEAF7] hover:border-[#5844A8]/40 text-[#6B657E] flex items-center justify-center relative shadow-2xs cursor-pointer transition hover:text-[#5844A8] shrink-0"
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
            className="flex items-center gap-2 pl-2 border-l border-[#EFEAF7] hover:opacity-85 transition cursor-pointer text-left shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              RS
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-black text-[#1E1548] block leading-tight">{waiterName}</span>
              <span className="text-[10px] text-[#8C84A0] font-semibold block leading-tight">Floor Waiter</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

