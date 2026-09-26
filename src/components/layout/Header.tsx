import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, ChevronDown, X, Radio, Gift, Check, XCircle, Clock, User, Tag, Sparkles, Wallet, CreditCard } from 'lucide-react';
import { NavRoute } from '../../types';
import { useWallet } from '../../context/WalletContext';

interface RedeemRequest {
  id: string;
  customerName: string;
  customerAvatar: string;
  campaignName: string;
  rewardTitle: string;
  stampsUsed: number;
  requestedAt: string;
  branch: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_REDEEM_REQUESTS: RedeemRequest[] = [
  {
    id: 'rr-001',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    campaignName: 'Summer Loyalty Surge',
    rewardTitle: 'Free Artisan Latte',
    stampsUsed: 8,
    requestedAt: '2m ago',
    branch: 'Downtown Flagship',
    status: 'pending',
  },
  {
    id: 'rr-002',
    customerName: 'Sophia Chen',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    campaignName: 'VIP Double Points',
    rewardTitle: '20% Off Next Order',
    stampsUsed: 12,
    requestedAt: '8m ago',
    branch: 'Northside Café',
    status: 'pending',
  },
  {
    id: 'rr-003',
    customerName: 'James Patterson',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    campaignName: 'Weekend Brunch Boost',
    rewardTitle: 'Free Pastry Combo',
    stampsUsed: 5,
    requestedAt: '15m ago',
    branch: 'Eastside Hub',
    status: 'pending',
  },
];

interface HeaderProps {
  currentRoute: NavRoute;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onOpenSearch,
  onToggleMobileMenu,
  onNavigate,
}) => {
  const { wallet, usableBalance } = useWallet();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>(INITIAL_REDEEM_REQUESTS);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const redeemDropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  const pendingCount = redeemRequests.filter(r => r.status === 'pending').length;

  const handleAccept = (id: string) => {
    setRedeemRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const handleReject = (id: string) => {
    setRedeemRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (redeemDropdownRef.current && !redeemDropdownRef.current.contains(event.target as Node)) {
        setRedeemOpen(false);
      }
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setWalletOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (profileDropdownOpen || redeemOpen || walletOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, redeemOpen, walletOpen, notificationsOpen]);

  // Dynamic breadcrumb matching current route and Figma specs
  const getBreadcrumbs = () => {
    switch (currentRoute) {
      case '/branches/new':
        return {
          category: 'Outlets & Infrastructure',
          parentPage: 'Branches',
          parentRoute: '/branches' as NavRoute,
          page: 'Add New Branch'
        };
      case '/branches':
        return { category: 'Outlets & Infrastructure', page: 'Branch Management' };
      case '/staff':
        return { category: 'Team & Security', page: 'Staff & RBAC' };
      case '/loyalty':
        return { category: 'Loyalty Engine', page: 'Loyalty Program Rules' };
      case '/qr-codes':
        return { category: 'Hardware & Beacons', page: 'Dynamic QR Codes' };
      case '/customerlist':
        return { category: 'CRM & Audience', page: 'Customer Directory' };
      case '/transactions':
        return { category: 'POS Ledger', page: 'Transactions' };
      case '/campaigns':
        return { category: 'Growth & Automation', page: 'Campaign & Loyalty Management' };
      case '/campaigns/new':
        return {
          category: 'Growth & Automation',
          parentPage: 'Campaigns',
          parentRoute: '/campaigns' as NavRoute,
          page: 'Campaign Builder'
        };
      case '/rewards':
        return { category: 'Rewards Engine', page: 'Perks Catalog' };
      case '/rewards/new':
        return { category: 'Rewards Catalog', page: 'Create New Reward' };
      case '/analytics':
        return { category: 'Intelligence', page: 'Analytics & Reports' };
      case '/billing':
        return { category: 'Merchant Account', page: 'Wallet & Credits' };
      case '/notifications':
        return { category: 'Activity Stream', page: 'Notifications' };
      case '/settings/audit':
        return { category: 'Governance', page: 'Settings & Audit Log' };
      case '/settings/branding':
        return { category: 'Governance', page: 'Business Profile & Branding' };
      case '/item-catalog':
        return { category: 'Catalog', page: 'Item Catalog' };
      case '/orders':
        return { category: 'Orders', page: 'Order Queue' };
      case '/dashboard':
      default:
        return { category: 'Merchant Portal', page: 'Dashboard Overview' };
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#EAE6E1] px-4 lg:px-6 py-2.5 flex items-center gap-4 lg:gap-6">
      {/* Left: Mobile hamburger & Clean Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg border border-[#EAE6E1] text-[#6E6A66] hover:bg-[#FAF8F5] cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Clean Breadcrumbs matching Figma design */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#7C746C]">
          <span
            className="hover:text-[#1A1615] cursor-pointer transition-colors"
            onClick={() => onNavigate('/dashboard')}
          >
            Home
          </span>
          <span className="text-[#A8A29E]">&gt;</span>
          <span className="text-[#1A1615] font-semibold">
            {breadcrumbs.page}
          </span>
        </div>
      </div>

      {/* Middle: Removed Search Bar per user request */}
      <div className="flex-1" />

      {/* Right: Redeem Requests, Notification Bell, Profile Info */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Wallet Widget */}
        <div className="relative" ref={walletDropdownRef}>
          <button
            onClick={() => { setWalletOpen(!walletOpen); setNotificationsOpen(false); setRedeemOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9A94E]/40 bg-[#FAF8F5] hover:bg-[#FDF8EB] transition-colors cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-[#D9A94E]" />
            <span className="text-xs font-bold text-[#3D3732]">{usableBalance.toLocaleString()} <span className="font-normal text-[#8C827A]">CR</span></span>
          </button>

          {walletOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#EAE6E1] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              <div className="p-4 border-b border-[#EAE6E1] bg-gradient-to-r from-[#FAF8F5] to-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1A1615]">
                    <Wallet className="w-4 h-4 text-[#D9A94E]" />
                    Merchant Wallet
                  </div>
                  <button onClick={() => setWalletOpen(false)} className="text-[#9E9A93] hover:text-[#1A1615] cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#1A1615]">{usableBalance.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-[#8C827A]">Usable Credits</span>
                </div>
                <div className="text-[10px] text-[#8C827A] mt-1">
                  Total Balance: <strong>{wallet.balance.toLocaleString()}</strong> (250 reserved for system config)
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">Recent Activity</div>
                <div className="p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#1A1615]">Initial Setup Grant</div>
                      <div className="text-[9px] text-[#8C827A]">System Provisioning</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600">+250 CR</div>
                </div>
                <div className="p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center">
                      <CreditCard className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#1A1615]">SMS Campaign 001</div>
                      <div className="text-[9px] text-[#8C827A]">1,200 Recipients</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-[#1A1615]">-120 CR</div>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-[#EAE6E1] bg-[#FAF8F5]/50">
                <button
                  onClick={() => {
                    setWalletOpen(false);
                    onNavigate('/billing');
                  }}
                  className="w-full text-center text-[11px] font-semibold text-[#A37837] hover:underline cursor-pointer"
                >
                  Manage Wallet &amp; Buy Credits →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Redeem Requests Button with Badge */}
        <div className="relative" ref={redeemDropdownRef}>
          <button
            onClick={() => { setRedeemOpen(!redeemOpen); setNotificationsOpen(false); }}
            className="p-2 rounded-lg text-[#5C554E] hover:bg-[#FAF8F5] relative transition-colors cursor-pointer"
            aria-label="Redeem Requests"
          >
            <Gift className="w-4 h-4 text-[#5C554E]" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D9A94E] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {pendingCount}
              </span>
            )}
          </button>

          {redeemOpen && (
            <div className="absolute right-0 sm:right-0 mt-2 w-[320px] sm:w-[380px] bg-white border border-[#EAE6E1] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAE6E1] bg-gradient-to-r from-[#FAF8F5] to-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D9A94E] to-[#A37837] flex items-center justify-center">
                    <Gift className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1615]">Redeem Requests</div>
                    <div className="text-[10px] text-[#8C827A]">{pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <button
                  onClick={() => setRedeemOpen(false)}
                  className="text-[#9E9A93] hover:text-[#1A1615] cursor-pointer p-1 rounded-md hover:bg-[#FAF8F5] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Request List */}
              <div className="max-h-[360px] overflow-y-auto py-2 px-2 space-y-2">
                {redeemRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`rounded-xl border p-3 transition-all duration-300 ${
                      request.status === 'approved'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : request.status === 'rejected'
                        ? 'bg-red-50/50 border-red-200 opacity-60'
                        : 'bg-[#FAF8F5] border-[#EAE6E1] hover:border-[#D9A94E]/40 hover:shadow-sm'
                    }`}
                  >
                    {/* Customer Row */}
                    <div className="flex items-start gap-2.5">
                      <img
                        src={request.customerAvatar}
                        alt={request.customerName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#1A1615] truncate">{request.customerName}</span>
                          <span className="text-[9px] text-[#8C827A] flex items-center gap-0.5 flex-shrink-0 ml-1">
                            <Clock className="w-2.5 h-2.5" />
                            {request.requestedAt}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#7C746C] mt-0.5 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-[#A37837]" />
                          {request.campaignName}
                        </div>
                      </div>
                    </div>

                    {/* Reward Detail */}
                    <div className="mt-2 flex items-center justify-between bg-white/80 rounded-lg px-2.5 py-1.5 border border-[#EAE6E1]/60">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#D9A94E]" />
                        <span className="text-[10px] font-semibold text-[#3D3732]">{request.rewardTitle}</span>
                      </div>
                      <span className="text-[9px] text-[#8C827A] bg-[#FAF8F5] px-1.5 py-0.5 rounded-md font-medium">
                        {request.stampsUsed} stamps
                      </span>
                    </div>

                    <div className="text-[9px] text-[#8C827A] mt-1.5 pl-0.5">
                      📍 {request.branch}
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D9A94E] to-[#A37837] text-white text-[10px] font-bold hover:shadow-md hover:brightness-110 transition-all cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#EAE6E1] text-[#7C746C] text-[10px] font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Status Badge */}
                    {request.status === 'approved' && (
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-emerald-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        Approved — Customer can redeem now
                      </div>
                    )}

                    {request.status === 'rejected' && (
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-red-500">
                        <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                          <X className="w-2.5 h-2.5 text-white" />
                        </div>
                        Rejected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#EAE6E1] bg-[#FAF8F5]/50">
                <button
                  onClick={() => {
                    setRedeemOpen(false);
                    onNavigate('/rewards');
                  }}
                  className="w-full text-center text-[11px] font-semibold text-[#A37837] hover:underline cursor-pointer"
                >
                  View All Rewards & History →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell with Badge */}
        <div className="relative" ref={notificationsDropdownRef}>
          <button
            onClick={() => { setNotificationsOpen(!notificationsOpen); setRedeemOpen(false); }}
            className="p-2 rounded-lg text-[#5C554E] hover:bg-[#FAF8F5] relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#5C554E]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D32F2F] ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 sm:right-0 mt-2 w-[290px] sm:w-80 bg-white border border-[#EAE6E1] rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6E1]">
                <div className="text-xs font-bold text-[#1A1615] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#A37837]" /> Notifications (3 active)
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#9E9A93] hover:text-[#1A1615] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] space-y-0.5">
                  <div className="font-semibold text-[#1A1615] flex items-center justify-between text-[11px]">
                    <span>VIP Stamp Redeemed</span>
                    <span className="text-[10px] text-[#8C827A]">4m ago</span>
                  </div>
                  <p className="text-[11px] text-[#7C746C]">
                    Marcus Vance redeemed stamp #8 at Downtown Flagship.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] space-y-0.5">
                  <div className="font-semibold text-[#1A1615] flex items-center justify-between text-[11px]">
                    <span>Voucher Claimed</span>
                    <span className="text-[10px] text-[#8C827A]">11m ago</span>
                  </div>
                  <p className="text-[11px] text-[#7C746C]">
                    Elena Rostova claimed Free Cold Brew &amp; Pastry at Northside.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] space-y-0.5">
                  <div className="font-semibold text-[#1A1615] flex items-center justify-between text-[11px]">
                    <span>Mesh Status Online</span>
                    <span className="text-[10px] text-[#8C827A]">25m ago</span>
                  </div>
                  <p className="text-[11px] text-[#7C746C]">
                    All 12 POS scanner stands operating at 100% telemetry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigate('/notifications');
                }}
                className="w-full mt-1 text-center py-1.5 text-[11px] font-semibold text-[#A37837] hover:underline cursor-pointer"
              >
                View all Notifications →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Card: Elena Rostova, Regional Director (matching Figma design) */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-1 py-1 pr-1.5 hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#EAE6E1] bg-[#FAF8F5]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-[#1A1615]">
                Elena Rostova
              </div>
              <div className="text-[10px] text-[#7C746C]">
                General Manager
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C827A] hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-[#EAE6E1] rounded-xl shadow-lg z-50 py-1 text-xs">
              <div className="px-3 py-2 border-b border-[#EAE6E1]">
                <div className="font-bold text-[#1A1615]">Elena Rostova</div>
                <div className="text-[10px] text-[#7C746C]">elena.rostova@bluebottle.com</div>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('/settings/audit');
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#3D3732] cursor-pointer"
              >
                Merchant Profile
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('/branches');
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#3D3732] cursor-pointer"
              >
                Branch Management
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('/staff');
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#3D3732] cursor-pointer"
              >
                Manage Staff &amp; RBAC
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('/settings/audit');
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#3D3732] cursor-pointer"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('/login');
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#D32F2F] font-semibold border-t border-[#EAE6E1] cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
