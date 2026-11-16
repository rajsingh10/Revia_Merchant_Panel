import React from 'react';
import { Home, Bell, UtensilsCrossed, LayoutGrid, ShoppingBag } from 'lucide-react';
import { StaffPortalTab } from './types';

interface Props {
  activeTab: StaffPortalTab;
  onTabChange: (tab: StaffPortalTab) => void;
  pendingRequestsCount?: number;
  requestsCount?: number;
  readyOrdersCount?: number;
  onOpenQuickMenu?: () => void;
}

export const StaffPortalBottomNav: React.FC<Props> = ({
  activeTab,
  onTabChange,
  pendingRequestsCount,
  requestsCount,
  readyOrdersCount = 1,
  onOpenQuickMenu
}) => {
  const effectiveRequestsCount = requestsCount !== undefined ? requestsCount : (pendingRequestsCount ?? 4);
  return (
    <nav className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] h-16 bg-white/95 backdrop-blur-md border-t sm:border border-purple-100/80 sm:rounded-3xl px-4 sm:px-6 flex items-center justify-between z-40 shadow-lg sm:shadow-2xl select-none lg:hidden">
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer transition ${
          activeTab === 'home' ? 'text-[#5844A8] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      {/* 2. Requests */}
      <button
        type="button"
        onClick={() => onTabChange('requests')}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer transition relative ${
          activeTab === 'requests' ? 'text-[#5844A8] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {effectiveRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
              {effectiveRequestsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold">Requests</span>
      </button>

      {/* 3. Center Circular Floating Action Button (Menu) */}
      <div className="flex-1 flex justify-center -mt-6">
        <button
          type="button"
          onClick={onOpenQuickMenu || (() => onTabChange('menu'))}
          className="w-13 h-13 rounded-full bg-[#1E1548] text-white flex items-center justify-center shadow-xl shadow-purple-950/30 cursor-pointer active:scale-95 transition hover:bg-[#2D1F63]"
          title="Floor Action Menu"
        >
          <UtensilsCrossed className="w-6 h-6 text-white stroke-[2.2]" />
        </button>
      </div>

      {/* 4. Tables */}
      <button
        type="button"
        onClick={() => onTabChange('tables')}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer transition ${
          activeTab === 'tables' ? 'text-[#5844A8] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Tables</span>
      </button>

      {/* 5. Orders */}
      <button
        type="button"
        onClick={() => onTabChange('orders')}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer transition relative ${
          activeTab === 'orders' ? 'text-[#5844A8] font-bold' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {readyOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          )}
        </div>
        <span className="text-[10px] font-semibold">Orders</span>
      </button>
    </nav>
  );
};

