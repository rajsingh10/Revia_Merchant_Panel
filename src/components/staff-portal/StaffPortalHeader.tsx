import React from 'react';
import { Bell, ChevronDown, Sparkles, LayoutGrid, ShoppingBag, UtensilsCrossed } from 'lucide-react';
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
}

export const StaffPortalHeader: React.FC<Props> = ({
  branchName = 'Sector 18',
  waiterName = 'Rohan Singh',
  activeTab = 'tables',
  onTabChange,
  pendingRequestsCount = 4,
  readyOrdersCount = 1,
  onOpenNotifications,
  onOpenBranchPicker,
  onOpenProfile
}) => {
  return (
    <header className="bg-white border-b border-purple-100/70 select-none shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Main Navigation Header */}
      <div className="px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5844A8] to-[#1E1548] text-white flex items-center justify-center shadow-md shadow-purple-950/20">
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-[#1E1548] tracking-tight leading-none">Loyaltics</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md border border-pink-100">Staff</span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Floor Service</p>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (Visible on Desktop >= 1024px) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#FAF8FF] p-1.5 rounded-2xl border border-purple-100/80 shadow-2xs">
          <button
            type="button"
            onClick={() => onTabChange?.('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-[#1E1548] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1E1548] hover:bg-white/80'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tables</span>
            <span className={`w-2 h-2 rounded-full ${activeTab === 'tables' ? 'bg-pink-400' : 'bg-gray-300'}`} />
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'requests'
                ? 'bg-[#1E1548] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1E1548] hover:bg-white/80'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#1E1548] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1E1548] hover:bg-white/80'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            {readyOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#1E1548] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1E1548] hover:bg-white/80'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Staff Menu</span>
          </button>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Branch Pill */}
          <button
            type="button"
            onClick={onOpenBranchPicker}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF8FF] border border-purple-100 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate max-w-[90px] sm:max-w-none">{branchName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {/* Notifications with Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-purple-200 text-gray-600 flex items-center justify-center relative shadow-2xs cursor-pointer transition hover:text-[#5844A8]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
              {pendingRequestsCount > 0 ? pendingRequestsCount : 1}
            </span>
          </button>

          {/* Staff Profile Pill */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 border-l border-gray-200/80 hover:opacity-80 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5844A8] font-black text-xs flex items-center justify-center border border-purple-200 shadow-2xs shrink-0">
              RS
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-black text-[#1E1548] block leading-tight">{waiterName}</span>
              <span className="text-[10px] text-gray-400 font-semibold block leading-tight">Waiter</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

