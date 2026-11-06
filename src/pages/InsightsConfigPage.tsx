import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalyticsPage } from './AnalyticsPage';
import { BillingPage } from './BillingPage';
import { NotificationPage } from './NotificationPage';
import { AuditLogPage } from './AuditLogPage';
import { BrandingPage } from './BrandingPage';
import { MOCK_AUDIT_LOGS } from '../data/mockData';
import {
  BarChart2,
  Wallet,
  Bell,
  ShieldCheck,
  Store,
  Sliders,
  Sparkles
} from 'lucide-react';
import { NavRoute } from '../types';

interface InsightsConfigPageProps {
  onNavigate?: (route: NavRoute) => void;
  initialTab?: 'analytics' | 'billing' | 'notifications' | 'settings' | 'branding';
}

export const InsightsConfigPage: React.FC<InsightsConfigPageProps> = ({
  onNavigate,
  initialTab = 'analytics'
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab') as any;

  const validTabs = ['analytics', 'billing', 'notifications', 'settings', 'branding'];
  const [activeTab, setActiveTab] = useState<'analytics' | 'billing' | 'notifications' | 'settings' | 'branding'>(
    validTabs.includes(queryTab) ? queryTab : initialTab
  );

  useEffect(() => {
    if (validTabs.includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tab: 'analytics' | 'billing' | 'notifications' | 'settings' | 'branding') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart2 },
    { id: 'billing', label: 'Wallet & Credits', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings & Security', icon: ShieldCheck },
    { id: 'branding', label: 'Brand & Identity', icon: Store },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col font-sans text-[#111827]">
      {/* Top Navigation Bar / Tab Switcher */}
      <div className="bg-white border-b border-purple-100 px-6 py-4 shadow-xs sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#1A1615] tracking-tight">Insights &amp; Configuration</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5844A8] border border-purple-200">
                  Command Hub
                </span>
              </div>
              <p className="text-xs text-[#716A62] font-medium">
                Customer retention intelligence, SMS wallet balance, security audit logs, and brand personalization.
              </p>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto bg-[#FAF8FF] border border-purple-200/80 p-1 rounded-xl shadow-inner scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'text-[#716A62] hover:text-[#1A1615] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'billing' && <BillingPage />}
        {activeTab === 'notifications' && <NotificationPage />}
        {activeTab === 'settings' && <AuditLogPage logs={MOCK_AUDIT_LOGS} />}
        {activeTab === 'branding' && <BrandingPage onNavigate={onNavigate as any} />}
      </div>
    </div>
  );
};
export default InsightsConfigPage;

