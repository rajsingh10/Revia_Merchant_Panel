import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TransactionsPage } from './TransactionsPage';
import { RewardsPage } from './RewardsPage';
import { Receipt, Award, TrendingUp, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { NavRoute } from '../types';

interface SalesRewardsPageProps {
  onNavigate?: (route: NavRoute) => void;
  initialTab?: 'sales' | 'rewards';
}

export const SalesRewardsPage: React.FC<SalesRewardsPageProps> = ({
  onNavigate,
  initialTab = 'sales'
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'sales' | 'rewards'>(
    queryTab === 'rewards' ? 'rewards' : initialTab
  );

  useEffect(() => {
    if (queryTab === 'rewards' || queryTab === 'sales') {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tab: 'sales' | 'rewards') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col font-sans text-[#111827]">
      {/* Top Navigation Bar / Tab Switcher */}
      <div className="bg-white border-b border-purple-100 px-6 py-4 shadow-xs sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#1A1615] tracking-tight">Sales &amp; Rewards</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5844A8] border border-purple-200">
                  Module Hub
                </span>
              </div>
              <p className="text-xs text-[#716A62] font-medium">
                Live register transactions, customer stamp ledger, and reward privilege matrices.
              </p>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center bg-[#FAF8FF] border border-purple-200/80 p-1 rounded-xl shadow-inner self-start sm:self-auto">
            <button
              onClick={() => handleTabChange('sales')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-[#5844A8] text-white shadow-sm'
                  : 'text-[#716A62] hover:text-[#1A1615] hover:bg-white/60'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Sales &amp; Transactions
            </button>
            <button
              onClick={() => handleTabChange('rewards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-[#5844A8] text-white shadow-sm'
                  : 'text-[#716A62] hover:text-[#1A1615] hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Rewards &amp; Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {activeTab === 'sales' ? (
          <TransactionsPage />
        ) : (
          <RewardsPage onNavigate={onNavigate as any} />
        )}
      </div>
    </div>
  );
};
export default SalesRewardsPage;

