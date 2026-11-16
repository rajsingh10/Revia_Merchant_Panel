import React from 'react';
import { Bell, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  branchName?: string;
  waiterName?: string;
  onOpenNotifications?: () => void;
  onOpenBranchPicker?: () => void;
  onOpenProfile?: () => void;
}

export const StaffPortalHeader: React.FC<Props> = ({
  branchName = 'Noida - Sector 18',
  waiterName = 'Rohan Singh',
  onOpenNotifications,
  onOpenBranchPicker,
  onOpenProfile
}) => {
  return (
    <header className="bg-white border-b border-purple-100/70 select-none shrink-0 sticky top-0 z-30 shadow-xs">
      {/* 1. iPad Status Bar Simulation */}
      <div className="px-6 pt-2 pb-1 flex items-center justify-between text-xs font-semibold text-gray-700 bg-white">
        <span className="font-bold text-[13px] tracking-tight text-gray-900">9:41 Mon 28 Oct</span>
        <div className="flex items-center gap-2">
          {/* WiFi icon */}
          <span className="text-[12px] text-gray-800">📶</span>
          {/* Battery */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-gray-800">100%</span>
            <div className="w-5 h-2.5 rounded-xs border border-gray-800 flex items-center p-0.5">
              <div className="h-full w-full bg-gray-800 rounded-2xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Tablet Navigation Header */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-[#1E1548] tracking-tight leading-none">Loyaltics</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md border border-pink-100">Staff</span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Staff Portal • Floor Service</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Branch Pill */}
          <button
            type="button"
            onClick={onOpenBranchPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8FF] border border-purple-100 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{branchName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
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
              1
            </span>
          </button>

          {/* Staff Profile Pill */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 border-l border-gray-200/80 hover:opacity-80 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5844A8] font-black text-xs flex items-center justify-center border border-purple-200 shadow-2xs">
              RS
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-black text-[#1E1548] block leading-tight">{waiterName}</span>
              <span className="text-[10px] text-gray-400 font-semibold block leading-tight">Waiter</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

