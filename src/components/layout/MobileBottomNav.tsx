import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Megaphone,
  QrCode,
  Plus,
  Users,
  UserPlus,
  Award,
  X,
  UtensilsCrossed
} from 'lucide-react';
import { NavRoute } from '../../types';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: NavRoute) => void;
  className?: string;
}

interface NavItem {
  name: string;
  route: NavRoute;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (route: string) => boolean;
}

const LEFT_NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    route: '/dashboard',
    icon: LayoutDashboard,
    isActive: (route: string) => route === '/dashboard' || route === '/',
  },
  {
    name: 'Branches',
    route: '/branches',
    icon: Store,
    isActive: (route: string) => route === '/branches' || route.startsWith('/branches'),
  },
];

const RIGHT_NAV_ITEMS: NavItem[] = [
  {
    name: 'Campaign',
    route: '/campaigns',
    icon: Megaphone,
    isActive: (route: string) => route === '/campaigns' || route.startsWith('/campaigns') || route.startsWith('/c/'),
  },
  {
    name: 'QR Codes',
    route: '/qr-codes',
    icon: QrCode,
    isActive: (route: string) => route === '/qr-codes' || route.startsWith('/qr-codes'),
  },
];

interface ModuleAddConfig {
  type: 'branch' | 'campaign' | 'staff' | 'customer' | 'reward' | 'qrcode' | 'menu' | 'general';
  label: string;
  shortLabel: string;
  route?: NavRoute;
}

const getModuleAddConfig = (route: string): ModuleAddConfig => {
  if (route.startsWith('/item-catalog') || route.startsWith('/menu')) {
    return {
      type: 'menu',
      label: 'Upload / Update Menu',
      shortLabel: 'Menu',
    };
  }
  if (route.startsWith('/branches')) {
    return {
      type: 'branch',
      label: 'Add Branch',
      shortLabel: 'Add Branch',
    };
  }
  if (route.startsWith('/campaigns')) {
    return {
      type: 'campaign',
      label: 'New Campaign',
      shortLabel: 'New',
      route: '/campaigns/new',
    };
  }
  if (route.startsWith('/qr-codes')) {
    return {
      type: 'qrcode',
      label: 'Generate QR Code',
      shortLabel: 'Generate',
    };
  }
  if (route.startsWith('/staff-portal')) {
    return {
      type: 'general',
      label: 'Quick Actions',
      shortLabel: 'Create',
    };
  }
  if (route.startsWith('/staff')) {
    return {
      type: 'staff',
      label: 'Invite Staff',
      shortLabel: 'Invite',
    };
  }
  if (route.startsWith('/customerlist')) {
    return {
      type: 'customer',
      label: 'Add Customer',
      shortLabel: 'Add',
    };
  }
  if (route.startsWith('/rewards')) {
    return {
      type: 'reward',
      label: 'Create Reward',
      shortLabel: 'Reward',
      route: '/rewards/new',
    };
  }
  if (route === '/dashboard' || route === '/') {
    return {
      type: 'campaign',
      label: 'Create Campaign',
      shortLabel: 'Create',
      route: '/campaigns/new',
    };
  }
  return {
    type: 'general',
    label: 'Quick Add',
    shortLabel: 'Add',
  };
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
  className = '',
}) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const addConfig = getModuleAddConfig(currentRoute);

  const handleCenterAddClick = () => {
    // 1. Module-specific direct actions
    if (addConfig.type === 'branch') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'branch' } }));
      return;
    }
    if (addConfig.type === 'campaign') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'campaign' } }));
      if (!currentRoute.startsWith('/campaigns')) {
        onNavigate('/campaigns/new');
      }
      return;
    }
    if (addConfig.type === 'staff') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'staff' } }));
      return;
    }
    if (addConfig.type === 'customer') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'customer' } }));
      return;
    }
    if (addConfig.type === 'reward') {
      onNavigate('/rewards/new');
      return;
    }
    if (addConfig.type === 'qrcode') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'qrcode' } }));
      return;
    }
    if (addConfig.type === 'menu') {
      window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'menu' } }));
      return;
    }

    // 2. Fallback on other pages: open Quick Add drawer
    setIsQuickAddOpen(true);
  };

  const handleQuickAddOption = (type: 'branch' | 'campaign' | 'staff' | 'customer' | 'reward' | 'menu') => {
    setIsQuickAddOpen(false);
    if (type === 'menu') {
      onNavigate('/item-catalog');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'menu' } }));
      }, 100);
    } else if (type === 'branch') {
      onNavigate('/branches');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'branch' } }));
      }, 100);
    } else if (type === 'campaign') {
      onNavigate('/campaigns/new');
    } else if (type === 'staff') {
      onNavigate('/staff');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'staff' } }));
      }, 100);
    } else if (type === 'customer') {
      onNavigate('/customerlist');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('revia:add-action', { detail: { type: 'customer' } }));
      }, 100);
    } else if (type === 'reward') {
      onNavigate('/rewards/new');
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`${className || 'lg:hidden'} fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE6E1] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom,0px),0px)] select-none`}
      >
        <div className="flex items-center justify-around h-16 max-w-lg md:max-w-2xl mx-auto px-1 sm:px-3">
          {/* Left Nav: Dashboard & Branches */}
          {LEFT_NAV_ITEMS.map((item) => {
            const active = item.isActive(currentRoute);
            const Icon = item.icon;

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer group active:scale-95 ${
                  active ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#5844A8]/10 text-[#5844A8] scale-105'
                      : 'text-[#8C877D] group-hover:text-[#1A1615] group-hover:bg-gray-100/60'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span
                  className={`text-[11px] leading-tight mt-0.5 tracking-tight transition-colors ${
                    active
                      ? 'font-bold text-[#5844A8]'
                      : 'font-semibold text-[#8C877D] group-hover:text-[#1A1615]'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* Center Elevated Floating Add Button (Module-Specific Action) */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-5 relative">
            <button
              type="button"
              onClick={handleCenterAddClick}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-[#5844A8]/30 ring-4 ring-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              title={addConfig.label}
              aria-label={addConfig.label}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[10px] font-bold text-[#5844A8] mt-0.5 leading-none truncate max-w-[62px] text-center">
              {addConfig.shortLabel}
            </span>
          </div>

          {/* Right Nav: Campaign & QR Codes */}
          {RIGHT_NAV_ITEMS.map((item) => {
            const active = item.isActive(currentRoute);
            const Icon = item.icon;

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer group active:scale-95 ${
                  active ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#5844A8]/10 text-[#5844A8] scale-105'
                      : 'text-[#8C877D] group-hover:text-[#1A1615] group-hover:bg-gray-100/60'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span
                  className={`text-[11px] leading-tight mt-0.5 tracking-tight transition-colors ${
                    active
                      ? 'font-bold text-[#5844A8]'
                      : 'font-semibold text-[#8C877D] group-hover:text-[#1A1615]'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Add Bottom Sheet (Fallback for pages without inline modals) */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsQuickAddOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-gray-100 animate-in slide-in-from-bottom duration-200 z-10 pb-[max(env(safe-area-inset-bottom,0px),16px)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-[#1A1615]">Quick Add</h3>
                <p className="text-xs text-[#8C877D]">Select an action to create or register</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickAddOption('branch')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-purple-900">Add Branch</div>
                  <div className="text-[10px] text-[#8C877D]">New location outlet</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddOption('campaign')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-purple-900">New Campaign</div>
                  <div className="text-[10px] text-[#8C877D]">Loyalty promo surge</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddOption('staff')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5844A8] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-purple-900">Invite Staff</div>
                  <div className="text-[10px] text-[#8C877D]">Team member & roles</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddOption('customer')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-indigo-900">Add Customer</div>
                  <div className="text-[10px] text-[#8C877D]">Register member</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddOption('reward')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-amber-900">Create Reward</div>
                  <div className="text-[10px] text-[#8C877D]">Stamp & point reward</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddOption('menu')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5844A8] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1615] group-hover:text-purple-900">Upload Menu</div>
                  <div className="text-[10px] text-[#8C877D]">Items &amp; categories</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
