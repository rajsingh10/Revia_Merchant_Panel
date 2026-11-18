import React from 'react';
import {
  Home,
  Megaphone,
  QrCode,
  ClipboardCheck,
  Users,
  User,
  Store,
  Laptop,
  ChefHat,
  UtensilsCrossed,
  SlidersHorizontal,
  Ticket,
  TrendingUp,
  BarChart2,
  ChevronRight,
  X
} from 'lucide-react';
import { NavRoute } from '../../types';

interface MobileMenuSheetProps {
  isOpen: boolean;
  currentRoute: string;
  onClose: () => void;
  onNavigate: (route: NavRoute) => void;
}

interface MobileMenuItem {
  label: string;
  route: NavRoute;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  match?: (route: string) => boolean;
}

const PRIMARY_MENU_ITEMS: MobileMenuItem[] = [
  {
    label: 'Home',
    route: '/dashboard',
    icon: Home,
    iconBg: 'bg-[#EDE4FF]',
    iconColor: 'text-[#7C3AED]',
    match: (r) => r === '/dashboard' || r === '/',
  },
  {
    label: 'Campaign',
    route: '/campaigns',
    icon: Megaphone,
    iconBg: 'bg-[#FEF0C7]',
    iconColor: 'text-[#1E1548]',
    match: (r) => r === '/campaigns' || r.startsWith('/campaigns/'),
  },
  {
    label: 'QR Code',
    route: '/qr-codes',
    icon: QrCode,
    iconBg: 'bg-[#FEF0C7]',
    iconColor: 'text-[#160C2E]',
    match: (r) => r === '/qr-codes' || r.startsWith('/qr-codes/'),
  },
  {
    label: 'Approvals',
    route: '/approvals',
    icon: ClipboardCheck,
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#059669]',
    match: (r) => r === '/approvals',
  },
  {
    label: 'Customer Directory',
    route: '/customerlist',
    icon: Users,
    iconBg: 'bg-[#FFE4E6]',
    iconColor: 'text-[#E11D48]',
    match: (r) => r === '/customerlist' || r.startsWith('/customerlist/'),
  },
  {
    label: 'Staff Directory',
    route: '/staff',
    icon: User,
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
    match: (r) => r === '/staff',
  },
  {
    label: 'Branches',
    route: '/branches',
    icon: Store,
    iconBg: 'bg-[#EDE4FF]',
    iconColor: 'text-[#6D28D9]',
    match: (r) => r === '/branches' || r.startsWith('/branches/'),
  },
  {
    label: 'Staff Portal',
    route: '/staff-portal' as NavRoute,
    icon: Laptop,
    iconBg: 'bg-[#FFEDD5]',
    iconColor: 'text-[#EA580C]',
    match: (r) => r === '/staff-portal' || r.startsWith('/staff-portal/'),
  },
  {
    label: 'Kitchen Portal',
    route: '/orders',
    icon: ChefHat,
    iconBg: 'bg-[#EDE4FF]',
    iconColor: 'text-[#7C3AED]',
    match: (r) => r === '/orders',
  },
];

const SECONDARY_MENU_ITEMS: MobileMenuItem[] = [
  {
    label: 'Menu',
    route: '/item-catalog',
    icon: UtensilsCrossed,
    iconBg: 'bg-[#F3E8FF]',
    iconColor: 'text-[#7C3AED]',
    match: (r) => r === '/item-catalog' || r === '/menu',
  },
  {
    label: 'Control Panel',
    route: '/control-panel',
    icon: SlidersHorizontal,
    iconBg: 'bg-[#E0E7FF]',
    iconColor: 'text-[#4F46E5]',
    match: (r) => r === '/control-panel',
  },
  {
    label: 'Redemption Rules',
    route: '/redemption-rules',
    icon: Ticket,
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#D97706]',
    match: (r) => r === '/redemption-rules',
  },
  {
    label: 'Sales & Rewards',
    route: '/sales-rewards',
    icon: TrendingUp,
    iconBg: 'bg-[#DCFCE7]',
    iconColor: 'text-[#16A34A]',
    match: (r) => r === '/sales-rewards' || r === '/transactions' || r === '/rewards',
  },
  {
    label: 'Insights & Config',
    route: '/insights-config',
    icon: BarChart2,
    iconBg: 'bg-[#F1F5F9]',
    iconColor: 'text-[#475569]',
    match: (r) =>
      r === '/insights-config' ||
      r === '/analytics' ||
      r === '/billing' ||
      r === '/notifications' ||
      r.startsWith('/settings/'),
  },
];

export const MobileMenuSheet: React.FC<MobileMenuSheetProps> = ({
  isOpen,
  currentRoute,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const allItems = [...PRIMARY_MENU_ITEMS, ...SECONDARY_MENU_ITEMS];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="md:hidden fixed inset-x-0 bottom-0 z-[85] max-h-[88vh] flex flex-col rounded-t-[32px] bg-gradient-to-b from-[#F1E8FF] via-[#FAF7FF] to-white shadow-[0_-12px_40px_rgba(22,12,46,0.22)] animate-in slide-in-from-bottom duration-250 overflow-hidden"
    >
      {/* Top Drag Handle */}
      <div className="pt-3 pb-1 flex justify-center shrink-0">
        <div className="w-14 h-1.5 rounded-full bg-[#A855F7]/75" />
      </div>

      {/* Header Row */}
      <div className="px-5 pt-2 pb-4 flex items-start justify-between shrink-0">
        <div>
          <h2 className="text-[22px] font-black text-[#160C2E] tracking-tight leading-tight">
            Menu
          </h2>
          <p className="text-xs font-medium text-[#7C748C] mt-0.5">
            Navigate and manage your platform
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-9 h-9 rounded-full bg-[#ECE3FF]/85 hover:bg-[#E1D4FF] text-[#160C2E] flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Scrollable Navigation Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-[max(env(safe-area-inset-bottom,0px),24px)] space-y-2.5">
        {allItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match ? item.match(currentRoute) : currentRoute === item.route;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onNavigate(item.route);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[20px] border transition-all active:scale-[0.985] cursor-pointer text-left ${
                isActive
                  ? 'bg-[#F4EEFF] border-[#E6DBFF] shadow-2xs'
                  : 'bg-white border-[#F2EEF8] shadow-[0_2px_10px_rgba(22,12,46,0.035)] hover:border-[#E4D8FF]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-[14px] ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5 stroke-[1.9]" />
                </div>
                <div className="w-px h-6 bg-[#EFEAF7] shrink-0" />
                <span className="text-[15px] font-bold text-[#160C2E] truncate">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#160C2E]/70 shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
