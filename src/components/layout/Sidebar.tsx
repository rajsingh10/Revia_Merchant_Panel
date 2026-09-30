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
  Plus,
  Package,
  ClipboardList,
  ScanLine,
  X,
  ChevronDown,
  Database
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
}

interface NavGroup {
  label: string;
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
    'MASTERS': false,
    'SALES & REWARDS': false,
    'INSIGHTS & CONFIG': false,
  });

  // Navigation groups matching Figma design screenshot exactly
  const navigationGroups: NavGroup[] = [
    {
      label: 'MAIN',
      items: [
        { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
        { name: 'Branches', route: '/branches', icon: Store },
        { name: 'Customers', route: '/customerlist', icon: Users },
        { name: 'Campaigns', route: '/campaigns', icon: Megaphone },
        { name: 'Staff & RBAC', route: '/staff', icon: ShieldCheck },
        { name: 'Loyalty Program', route: '/loyalty', icon: Gift },
        { name: 'QR Codes', route: '/qr-codes', icon: QrCode },
        { name: 'Item Catalog', route: '/item-catalog', icon: Package },
      ],
    },
    {
      label: 'MASTERS',
      items: [
        { name: 'Rule Fields', route: '/masters/rule-fields', icon: Database },
        { name: 'Tier Options', route: '/masters/tier-options', icon: Database },
        { name: 'Reward Types', route: '/masters/reward-types', icon: Package },
        { name: 'Asset Types', route: '/masters/asset-types', icon: QrCode },
      ],
    },
    // {
    //   label: 'CATALOG',
    //   items: [
    //     // { name: 'Item Catalog', route: '/item-catalog', icon: Package },
    //     // { name: 'Order Queue', route: '/orders', icon: ClipboardList },
    //   ],
    // },
    {
      label: 'SALES & REWARDS',
      items: [
        // { name: 'Customers', route: '/customerlist', icon: Users },
        { name: 'Transactions', route: '/transactions', icon: Receipt },
        // { name: 'Campaigns', route: '/campaigns', icon: Megaphone },
        // { name: 'Redemption Terminal', route: '/terminal', icon: ScanLine },
        { name: 'Rewards', route: '/rewards', icon: Award },
      ],
    },
    {
      label: 'INSIGHTS & CONFIG',
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
      {/* Brand Header matching Figma exactly: REVIA MERCHANT SUITE */}
      <div className="p-4 border-b border-[#EAE6E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white font-black text-lg flex items-center justify-center shadow-xs">
            R
          </div>
          <div>
            <div className="font-extrabold text-[15px] text-[#1A1615] tracking-tight leading-none uppercase">REVIA</div>
            <div className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase mt-0.5">MERCHANT SUITE</div>
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
        {navigationGroups.map((group, groupIndex) => {
          const isSubmenuGroup = group.label !== 'MAIN' && group.label !== 'CATALOG';
          const isExpanded = isSubmenuGroup ? openSubmenus[group.label] : true;

          return (
            <React.Fragment key={group.label}>
              {group.label && !isSubmenuGroup && (
                <div className={`px-3 pb-1 ${groupIndex > 0 ? 'mt-5' : 'mt-1'} text-[10px] font-bold text-[#8C827A] uppercase tracking-wider`}>
                  {group.label}
                </div>
              )}

              {group.label && isSubmenuGroup && (
                <button
                  onClick={() => setOpenSubmenus(prev => ({ ...prev, [group.label]: !prev[group.label] }))}
                  className={`w-full flex items-center justify-between px-3 py-2 ${groupIndex > 0 ? 'mt-2' : ''} text-[10px] font-bold text-[#8C827A] uppercase tracking-wider hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isExpanded && (
                <div className={isSubmenuGroup ? "pl-2 space-y-0.5" : "space-y-0.5"}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      currentRoute === item.route ||
                      (item.route === '/branches' && currentRoute === '/branches/new') ||
                      (item.route === '/campaigns' && currentRoute === '/campaigns/new');

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          onRouteChange(item.route);
                          if (onMobileClose) onMobileClose();
                        }}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-[13px] transition-all duration-150 cursor-pointer whitespace-nowrap ${isActive
                          ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white font-bold shadow-xs'
                          : 'bg-transparent text-[#4A433D] hover:bg-[#FAF8F5] hover:text-[#1A1615] font-medium'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-nowrap">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#6E6A66]'}`} />
                          <span className="whitespace-nowrap tracking-tight font-sans">{item.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer Status matching Figma: ● v2.14.0-prod  LIVE */}
      <div className="p-3 border-t border-[#EAE6E1] bg-white">
        <div className="px-2.5 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#7C746C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>v2.14.0-prod</span>
          </div>
          <span className="bg-[#EBF7F0] text-[#15803D] font-bold text-[10px] px-2 py-0.5 rounded-sm tracking-wider">
            LIVE
          </span>
        </div>
      </div>
    </aside>
  );
};
