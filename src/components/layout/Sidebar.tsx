import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Users,
  Star,
  QrCode,
  Receipt,
  Megaphone,
  Gift,
  BarChart2,
  Wallet,
  Bell,
  ShieldCheck,
  Award,
  Package,
  X,
  ChevronDown,
  SlidersHorizontal,
  Heart,
  Ticket,
  TrendingUp
} from 'lucide-react';
import { NavRoute } from '../../types';

interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  activeBranch: string;
  onBranchChange: (branch: string) => void;
  branches: string[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  name: string;
  route: NavRoute;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface ReportGroup {
  id: string;
  name: string;
  route: NavRoute;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  activeBranch,
  onBranchChange,
  branches,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    sales_rewards: false,
    insights_config: false,
  });

  // Navigation items matching screenshot order and requirements
  const mainNavItems: NavItem[] = [
    { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { name: 'Branches', route: '/branches', icon: Store },
    { name: 'Customers', route: '/customerlist', icon: Users },
    { name: 'Staff & Employees', route: '/staff', icon: Users },
    { name: 'Control Panel', route: '/control-panel', icon: SlidersHorizontal },
    { name: 'Campaign', route: '/campaigns', icon: Megaphone },
    { name: 'QR Codes', route: '/qr-codes', icon: QrCode },
    { name: 'Approvals', route: '/approvals', icon: Heart, badge: 2 },
    { name: 'Item Catalog', route: '/item-catalog', icon: Package },
    { name: 'Redemption rule', route: '/redemption-rules', icon: Ticket },
  ];

  const reportGroups: ReportGroup[] = [
    {
      id: 'sales_rewards',
      name: 'Sales & Rewards',
      route: '/sales-rewards',
      icon: TrendingUp,
      items: [
        { name: 'Transactions', route: '/transactions', icon: Receipt },
        { name: 'Rewards', route: '/rewards', icon: Award },
      ],
    },
    {
      id: 'insights_config',
      name: 'Insights & Config',
      route: '/insights-config',
      icon: SlidersHorizontal,
      items: [
        { name: 'Analytics & Reports', route: '/analytics', icon: BarChart2 },
        { name: 'Wallet & Credits', route: '/billing', icon: Wallet },
        { name: 'Notifications', route: '/notifications', icon: Bell },
        { name: 'Settings', route: '/settings/audit', icon: ShieldCheck },
        { name: 'Business Profile & Branding', route: '/settings/branding', icon: Store },
      ],
    },
  ];

  return (
    <aside
      className={`
        bg-white border-r border-[#EAE6E1] flex flex-col shrink-0 h-screen transition-all duration-200
        lg:static lg:w-[240px] lg:translate-x-0 lg:z-auto
        ${isMobileOpen
          ? 'fixed inset-y-0 left-0 w-[280px] max-w-[85vw] translate-x-0 shadow-2xl z-[60]'
          : 'hidden lg:flex'
        }
      `}
    >
      {/* Brand Header: Revia only with older R logo in purple colour */}
      <div className="p-4 border-b border-[#EAE6E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg className="w-8 h-8 rounded-xl shadow-xs shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reviaPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#5844A8" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#reviaPurpleGrad)" />
            <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />
            <text x="31" y="46" fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="38" fill="#FFFFFF" textAnchor="middle">R</text>
            <circle cx="47" cy="17" r="3.5" fill="#FFFFFF" />
          </svg>
          <div>
            <div className="font-extrabold text-[17px] text-[#1A1615] tracking-tight leading-none">Revia</div>
          </div>
        </div>
        {isMobileOpen && (
          <button onClick={onMobileClose} className="lg:hidden p-1 text-[#6E6A66] hover:text-[#1A1615] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {/* Main Navigation Items */}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentRoute === item.route ||
              (item.route === '/branches' && currentRoute === '/branches/new') ||
              (item.route === '/campaigns' && (currentRoute === '/campaigns/new' || currentRoute.startsWith('/campaigns')));

            return (
              <button
                key={item.name}
                onClick={() => {
                  onRouteChange(item.route);
                  if (onMobileClose) onMobileClose();
                }}
                className={`w-full flex items-center px-3 py-2 rounded-xl text-[13px] transition-all duration-150 cursor-pointer whitespace-nowrap group ${isActive
                  ? 'bg-[#2D124D] text-white font-bold shadow-xs'
                  : 'bg-transparent text-[#4A433D] hover:bg-[#FAF5FF] hover:text-[#2D124D] font-medium'
                  }`}
              >
                <div className="flex items-center justify-between w-full min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-nowrap">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#6E6A66] group-hover:text-[#2D124D]'}`} />
                    <span className="whitespace-nowrap tracking-tight font-sans">{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#5844A8] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* REPORTS Group */}
        <div className="pt-4">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
            REPORTS
          </div>
          <div className="space-y-0.5">
            {reportGroups.map((group) => {
              const isExpanded = openSubmenus[group.id] !== false;
              const GroupIcon = group.icon;
              const isGroupActive =
                currentRoute === group.route ||
                group.items.some((it) => it.route === currentRoute);

              return (
                <div key={group.id} className="mt-0.5">
                  <button
                    onClick={() => {
                      onRouteChange(group.route);
                      setOpenSubmenus(prev => ({ ...prev, [group.id]: !isExpanded }));
                      if (onMobileClose) onMobileClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all duration-150 cursor-pointer whitespace-nowrap group ${
                      isGroupActive
                        ? 'bg-[#2D124D] text-white font-bold shadow-xs'
                        : 'bg-transparent text-[#4A433D] hover:bg-[#FAF5FF] hover:text-[#2D124D] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-nowrap">
                      <GroupIcon className={`w-4 h-4 shrink-0 transition-colors ${isGroupActive ? 'text-white' : 'text-[#6E6A66] group-hover:text-[#2D124D]'}`} />
                      <span className="whitespace-nowrap tracking-tight font-sans">{group.name}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform shrink-0 ${isGroupActive ? 'text-white/80' : 'text-[#8C827A]'} ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="pl-5 space-y-0.5 mt-1 border-l-2 border-purple-200/60 ml-4">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemActive = currentRoute === item.route;

                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              onRouteChange(item.route);
                              if (onMobileClose) onMobileClose();
                            }}
                            className={`w-full flex items-center px-2.5 py-1.5 rounded-lg text-[12px] transition-all duration-150 cursor-pointer whitespace-nowrap group ${
                              isItemActive
                                ? 'bg-purple-100 text-[#2D124D] font-bold shadow-2xs'
                                : 'bg-transparent text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#2D124D] font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-nowrap">
                              <ItemIcon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isItemActive ? 'text-[#2D124D]' : 'text-[#8C827A] group-hover:text-[#2D124D]'}`} />
                              <span className="whitespace-nowrap tracking-tight font-sans">{item.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Status matching Figma: ● v2.14.0-prod  LIVE */}
      <div className="p-3 border-t border-[#EAE6E1] bg-white">
        <div className="px-2.5 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#7C746C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>v2.14.0-prod</span>
          </div>
          <span className="bg-[#ECFDF5] text-[#059669] font-bold text-[10px] px-2 py-0.5 rounded-sm tracking-wider border border-[#A7F3D0]">
            LIVE
          </span>
        </div>
      </div>
    </aside>
  );
};
