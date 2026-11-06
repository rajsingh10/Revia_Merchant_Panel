import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Search, Menu, LogOut, Settings, Heart, ShoppingBag, Store, ChevronDown, MapPin, Globe } from 'lucide-react';

import { MainTab } from '../../types';

interface Props {
  onNavigate?: (route: string) => void;
  onMenuClick?: () => void;
  tabs?: { id: MainTab; label: string; Icon: React.ElementType; badge?: React.ReactNode }[];
  activeTab?: MainTab;
  setTab?: (t: MainTab) => void;
  cartCount?: number;
  onNotificationsClick?: () => void;
  selectedMerchant?: string;
  setSelectedMerchant?: (merchant: string) => void;
  selectedBranch?: string;
  setSelectedBranch?: (branch: string) => void;
}

export const CustomerDashboardHeader: React.FC<Props> = ({ 
  onNavigate, onMenuClick, tabs = [], activeTab, setTab, cartCount, onNotificationsClick,
  selectedMerchant = 'All Merchants',
  setSelectedMerchant,
  selectedBranch = 'All Branches',
  setSelectedBranch
}) => {


  // Separate primary tabs from secondary ("More") tabs
  const primaryTabs = tabs.slice(0, 4);
  const moreTabs = tabs.slice(4);

  const [isMerchantOpen, setIsMerchantOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  
  const merchantRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (merchantRef.current && !merchantRef.current.contains(event.target as Node)) {
        setIsMerchantOpen(false);
      }
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setIsBranchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[70px] bg-white border-b border-[#E6E6E6] flex items-center px-4 lg:px-8 sticky top-0 z-50 shrink-0">
      
      {/* Left Section: Mobile Logo and Hamburger (Hidden on Desktop) */}
      <div className="flex items-center gap-2 md:hidden flex-1">
        {onMenuClick && (
          <button onClick={onMenuClick} className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F8F6] text-[#222]">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => onNavigate?.('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-7 h-7 bg-[#C89B3C] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-black text-base leading-none">R</span>
          </div>
          <span className="text-lg font-black tracking-[0.2em] uppercase text-[#222]">REVIA</span>
        </button>
      </div>

      {/* Spacer for Desktop (Since logo is in sidebar) */}
      <div className="hidden md:block flex-1" />
      {/* Navigation moved to DesktopSidebar */}

      {/* Right Section: Icons and Profile */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">

        {/* Merchant Dropdown */}
        <div className="relative hidden sm:block" ref={merchantRef}>
          <button 
            onClick={() => { setIsMerchantOpen(!isMerchantOpen); setIsBranchOpen(false); }}
            className="cursor-pointer flex items-center gap-2 bg-[#F8F8F6] border border-[#E6E6E6] text-[#222] text-sm font-bold rounded-xl px-4 py-2 hover:bg-[#F0F0F0] transition-colors whitespace-nowrap"
          >
            <Store className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="truncate">{selectedMerchant === 'All Merchants' ? 'Switch Store' : selectedMerchant}</span>
            <ChevronDown className={`w-4 h-4 text-[#666] shrink-0 transition-transform ${isMerchantOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMerchantOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-[#E6E6E6] rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 flex flex-col">
              <button 
                onClick={() => {
                  setSelectedMerchant?.('All Merchants');
                  setSelectedBranch?.('All Branches');
                  setIsMerchantOpen(false);
                }}
                className={`cursor-pointer text-left px-4 py-3 flex items-center gap-3 transition-colors ${selectedMerchant === 'All Merchants' ? 'text-[#222] bg-[#F8F8F6]' : 'text-[#222] hover:bg-[#F8F8F6]'}`}
              >
                <Store className="w-5 h-5 shrink-0" />
                <span className="font-black truncate">My Global Wallet</span>
              </button>
              
              <div className="h-[1px] bg-[#E6E6E6] mx-4 my-2 shrink-0" />
              
              {['Grand Café', 'Artisan Bakers', 'Urban Eats'].map(merchant => (
                <button
                  key={merchant}
                  onClick={() => {
                    setSelectedMerchant?.(merchant);
                    setSelectedBranch?.('All Branches');
                    setIsMerchantOpen(false);
                  }}
                  className={`cursor-pointer text-left px-4 py-2.5 text-sm font-bold mx-2 rounded-xl transition-colors truncate ${
                    selectedMerchant === merchant 
                      ? 'bg-[#FFF8F0] text-[#C89B3C]' 
                      : 'bg-white text-[#666] hover:bg-[#F8F8F6]'
                  }`}
                >
                  {merchant}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch Dropdown (Visible only when a specific merchant is selected) */}
        {selectedMerchant !== 'All Merchants' && (
          <div className="relative hidden sm:block" ref={branchRef}>
            <button 
              onClick={() => { setIsBranchOpen(!isBranchOpen); setIsMerchantOpen(false); }}
              className="cursor-pointer flex items-center gap-2 bg-[#F8F8F6] border border-[#E6E6E6] text-[#222] text-sm font-bold rounded-xl px-4 py-2 hover:bg-[#F0F0F0] transition-colors whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
              <span className="truncate">{selectedBranch}</span>
              <ChevronDown className={`w-4 h-4 text-[#666] shrink-0 transition-transform ${isBranchOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBranchOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white border border-[#E6E6E6] rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 flex flex-col">
                <button 
                  onClick={() => {
                    setSelectedBranch?.('All Branches');
                    setIsBranchOpen(false);
                  }}
                  className={`cursor-pointer text-left px-4 py-3 flex items-center gap-3 transition-colors ${selectedBranch === 'All Branches' ? 'text-[#222] bg-[#F8F8F6]' : 'text-[#222] hover:bg-[#F8F8F6]'}`}
                >
                  <Globe className="w-5 h-5 shrink-0" />
                  <span className="font-black truncate">All Branches</span>
                </button>
                
                <div className="h-[1px] bg-[#E6E6E6] mx-4 my-2 shrink-0" />
                
                {['Downtown', 'Northside Mall', 'West End Kiosk'].map(branch => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch?.(branch);
                      setIsBranchOpen(false);
                    }}
                    className={`cursor-pointer text-left px-4 py-2.5 text-sm font-bold mx-2 rounded-xl transition-colors truncate ${
                      selectedBranch === branch 
                        ? 'bg-[#FFF8F0] text-[#C89B3C]' 
                        : 'bg-white text-[#666] hover:bg-[#F8F8F6]'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button 
          onClick={onNotificationsClick}
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F8F6] text-[#666] transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#D32F2F] rounded-full border border-white" />
        </button>

        <div className="h-6 w-[1px] bg-[#E6E6E6] mx-1 sm:mx-2 hidden sm:block"></div>

        <div className="relative group">
          <button
            onClick={() => onNavigate?.('/customer/profile')}
            className="cursor-pointer flex items-center gap-3 hover:bg-[#F8F8F6] p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-[#E6E6E6]"
          >
            <div className="w-8 h-8 rounded-full bg-[#F3EFE7] border border-[#E6E6E6] flex items-center justify-center overflow-hidden shrink-0">
              <User className="w-4 h-4 text-[#C89B3C]" />
            </div>
            <span className="text-xs font-bold text-[#222] hidden sm:block">Rohit Sharma</span>
          </button>

          {/* Profile Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E6E6E6] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col p-2">
            <div className="px-4 py-3 border-b border-[#E6E6E6] mb-2">
              <p className="text-sm font-black text-[#222]">Rohit Sharma</p>
              <p className="text-xs text-[#666]">rohit@example.com</p>
            </div>
            
            <button 
              onClick={() => { setTab?.('profile'); onNavigate?.('/customer/profile'); }}
              className="cursor-pointer w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#666] hover:bg-[#F8F8F6] hover:text-[#222] transition-colors flex items-center gap-3"
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button 
              onClick={() => setTab?.('rewards')}
              className="cursor-pointer w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#666] hover:bg-[#F8F8F6] hover:text-[#222] transition-colors flex items-center gap-3"
            >
              <Heart className="w-4 h-4" />
              Saved Rewards
            </button>
            {/* Settings button removed */}
            <div className="h-[1px] bg-[#E6E6E6] my-1" />
            <button 
              onClick={() => {
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer');
                if (!localStorage.getItem('user')) {
                  localStorage.removeItem('token');
                }
                window.location.href = '/';
              }}
              className="cursor-pointer w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#D32F2F] hover:bg-[#FFF0F0] transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
