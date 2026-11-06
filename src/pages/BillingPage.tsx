import React, { useState, useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { WalletActionCategory } from '../types/wallet';
import { CreditCard, CheckCircle2, Zap, ShieldCheck, ArrowRight, ReceiptText, Search, Download, ChevronRight, LockKeyhole, WalletCards, Users, Server, FileText, Bell, CalendarDays, Building2, MoreVertical, PlusCircle, AlertTriangle, PieChart, Settings2, History, Filter, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronDown } from 'lucide-react';

const MobileBillingPage: React.FC = () => {
  const invoices = [
    ['Nov 1, 2024', '₹429.00', 'Enterprise + 2 POS Node Add-on'],
    ['Oct 1, 2024', '₹429.00', 'Enterprise + 2 POS Node Add-on'],
    ['Sep 1, 2024', '₹389.00', 'Enterprise Base Subscription'],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF6F1] px-4 pb-7 pt-3 text-[#211C19] sm:px-5">
      <div className="mx-auto w-full max-w-[430px]">


        <div className="pt-3"><div className="flex items-center justify-between gap-2"><div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#756D65]">Administration &amp; Quotas</div><span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#B9F1CF] px-3 py-1 text-[11px] font-bold text-[#08734B]"><span className="h-1.5 w-1.5 rounded-full bg-[#0D9A63]" />Active</span></div><div className="mt-2 flex items-center justify-between gap-3"><h1 className="min-w-0 whitespace-nowrap text-2xl sm:text-[28px] font-bold leading-none tracking-tight text-[#1A1615]">Subscription &amp; Billing</h1><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8EEDC] text-[#98701F]"><ShieldCheck className="h-5 w-5" /></span></div><p className="mt-1 text-[14px] text-[#756D65]">Downtown Flagship &amp; Unified Venues</p></div>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"><div className="flex justify-between text-xs font-medium text-[#7C746C]"><span>Current Plan</span><CreditCard className="h-4 w-4 text-[#C99B42]" /></div><div className="mt-3 text-2xl font-bold leading-none tracking-tight">₹389<span className="ml-1 text-[12px] font-normal tracking-normal text-[#756D65]">/mo</span></div><div className="mt-1 text-[11px] font-bold text-[#A8761C]">Enterprise Atelier</div></div>
          <div className="rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"><div className="flex justify-between text-xs font-medium text-[#7C746C]"><span>Next Cycle</span><CalendarDays className="h-4 w-4 text-[#C99B42]" /></div><div className="mt-4 text-2xl font-bold tracking-tight">Dec 1, 2025</div><div className="mt-1 text-[11px] text-[#756D65]"><span className="text-[#087B55]">✓</span> Auto-pay enabled</div></div>
          <div className="rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"><div className="flex justify-between text-xs font-medium text-[#7C746C]"><span>Licensed Venues</span><Building2 className="h-4 w-4 text-[#C99B42]" /></div><div className="mt-3 text-2xl font-bold leading-none tracking-tight">3<span className="ml-1 text-[12px] font-normal text-[#756D65]">/ 5 nodes</span></div><div className="mt-2 h-1.5 rounded-full bg-[#EEE7DF]"><div className="h-full w-3/5 rounded-full bg-[#5844A8]" /></div></div>
          <div className="rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"><div className="flex justify-between text-xs font-medium text-[#7C746C]"><span>Scan Volume</span><Zap className="h-4 w-4 text-[#C99B42]" /></div><div className="mt-3 text-2xl font-bold leading-none tracking-tight">14.2k<span className="ml-1 text-[12px] font-normal text-[#756D65]">/ 25k</span></div><div className="mt-2 h-1.5 rounded-full bg-[#EEE7DF]"><div className="h-full w-[57%] rounded-full bg-[#087B55]" /></div></div>
        </section>

        <section className="mt-7 rounded-[13px] bg-white p-5 shadow-[0_4px_15px_rgba(60,38,20,0.04)]"><div className="flex items-start justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5844A8]">Tier Architecture</div><h2 className="mt-2 text-[23px] font-bold leading-none tracking-[-0.04em]">Enterprise Atelier</h2></div><span className="rounded-[9px] bg-[#F4EEE8] p-2.5 text-[#211C19]"><ShieldCheck className="h-5 w-5" /></span></div><div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold"><span className="rounded-[7px] bg-[#FAF5FF] px-2 py-1.5">✓ 5 Venues Included</span><span className="rounded-[7px] bg-[#FAF5FF] px-2 py-1.5">✓ 20 Mesh Nodes</span><span className="rounded-[7px] bg-[#FAF5FF] px-2 py-1.5">✓ VIP Pass Portal</span><span className="rounded-[7px] bg-[#FAF5FF] px-2 py-1.5">✓ SOC-2 Audit Log</span></div><div className="mt-6 space-y-3 text-[12px]"><div><div className="flex justify-between"><span>Branch Locations</span><span className="text-[#756D65]">3 of 5 used (60%)</span></div><div className="mt-1 h-1.5 rounded-full bg-[#EEE7DF]"><div className="h-full w-3/5 rounded-full bg-[#5844A8]" /></div></div><div><div className="flex justify-between"><span>Active POS Mesh Nodes</span><span className="text-[#756D65]">12 of 20 used (60%)</span></div><div className="mt-1 h-1.5 rounded-full bg-[#EEE7DF]"><div className="h-full w-3/5 rounded-full bg-[#5844A8]" /></div></div><div><div className="flex justify-between"><span>Monthly Scan Transactions</span><span className="text-[#756D65]">14,240 / 25,000 (57%)</span></div><div className="mt-1 h-1.5 rounded-full bg-[#EEE7DF]"><div className="h-full w-[57%] rounded-full bg-[#087B55]" /></div></div></div><button type="button" className="mt-6 w-full rounded-[11px] bg-gradient-to-r from-[#7C3AED] to-[#5844A8] py-3 text-[13px] font-bold text-white"><ArrowRight className="mr-1 inline h-4 w-4" />Upgrade Plan Quota</button></section>

        <section className="mt-7"><div className="flex items-center justify-between"><h2 className="text-[19px] font-bold">Payment Sources</h2><button type="button" className="text-[10px] font-bold uppercase text-[#A8761C]">Manage</button></div><div className="mt-3 rounded-[13px] bg-white p-4 shadow-[0_4px_15px_rgba(60,38,20,0.04)]"><div className="flex items-center gap-3 rounded-[8px] bg-[#FAF5FF] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#211C19] text-[12px] font-bold text-white">MC</span><div className="min-w-0 flex-1"><div className="text-[13px] font-semibold">Mastercard •••• 8814 <span className="ml-1 rounded bg-[#FFE0A2] px-1.5 py-0.5 text-[9px]">DEFAULT</span></div><div className="text-[11px] text-[#756D65]">Expires 08/27 • Atelier Corporate Debit</div></div><MoreVertical className="h-4 w-4 text-[#756D65]" /></div><div className="mt-3 flex items-center gap-3 rounded-[8px] bg-[#F4F0EC] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-white text-[#756D65]"><Building2 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="text-[13px] font-semibold">ACH Direct Debit •••• 4109</div><div className="text-[11px] text-[#756D65]">J.P. Morgan Chase • Secondary backup</div></div><MoreVertical className="h-4 w-4 text-[#756D65]" /></div></div></section>

        <section className="mt-7"><div className="flex items-center justify-between"><h2 className="text-[19px] font-bold">Billing Ledger</h2><span className="text-[10px] font-bold uppercase text-[#756D65]">Last 3 Quarters</span></div><div className="mt-3 space-y-2">{invoices.map(([date, amount, detail]) => <div key={date} className="flex items-center gap-3 rounded-[13px] bg-white p-4 shadow-[0_4px_15px_rgba(60,38,20,0.04)]"><span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#B9F1CF] text-[#087B55]"><ReceiptText className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="text-[13px] font-semibold">{date} <span className="text-[#087B55]">✓ Paid</span></div><div className="truncate text-[11px] text-[#756D65]">{detail}</div><div className="text-[19px] font-bold">{amount}</div></div><button type="button" aria-label={`Download invoice for ${date}`} className="rounded-[8px] bg-[#F4F0EC] p-2"><Download className="h-4 w-4" /><span className="block text-[8px] font-bold">PDF</span></button></div>)}</div></section>

        <section className="mt-7 rounded-[13px] bg-white p-4 shadow-[0_4px_15px_rgba(60,38,20,0.04)]"><div className="flex gap-3"><span className="rounded-[8px] bg-[#F4F0EC] p-2 text-[#A8761C]"><FileText className="h-5 w-5" /></span><div><div className="text-[10px] font-bold uppercase text-[#756D65]">Registered Legal Entity</div><div className="mt-1 text-[14px] font-bold">Revia Hospitality Atelier Group LLC</div><div className="text-[11px] text-[#756D65]">EIN: 84-2910492 • Del. Division of Corps</div></div></div><div className="mt-3 rounded-[8px] bg-[#FAF5FF] p-3 text-[11px] text-[#756D65]"><div className="flex justify-between"><span>Billing Recipient:</span><b className="text-[#211C19]">Elena Vance</b></div><div className="mt-1 flex justify-between"><span>Dispatch Email:</span><b className="text-[#211C19]">billing@revia.hospitality.com</b></div></div><button type="button" className="mt-3 w-full rounded-[8px] bg-[#F4F0EC] py-2.5 text-[12px] font-semibold"><ReceiptText className="mr-1 inline h-4 w-4 text-[#A8761C]" />Export Annual Tax Dossier (CSV/PDF)</button></section>
      </div>
    </div>
  );
};

export const BillingPage: React.FC = () => {
  const { wallet, usableBalance, transactions, costRules, openTopUpModal, updateCostRule } = useWallet();

  // Ledger Filter & Pagination States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Admin Cost Rules edit state
  const [editingRule, setEditingRule] = useState<WalletActionCategory | null>(null);
  const [newCostInput, setNewCostInput] = useState<string>('');

  const isLowBalance = wallet.balance < wallet.lowBalanceThreshold;

  // Category labels and display configs
  const categoryConfig: Record<WalletActionCategory, { label: string; color: string }> = {
    topup: { label: 'Credit Top-Up', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    branch_setup: { label: 'Branch Setup', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    staff_invite: { label: 'Staff Invitation', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    loyalty_setup: { label: 'Loyalty Program Setup', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    qr_generation: { label: 'QR / Stand Generation', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    campaign_creation: { label: 'Campaign Creation', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    redemption_commission: { label: 'Redemption Commission', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    admin_adjustment: { label: 'Admin Adjustment', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  };

  // Compute Usage Breakdown per Category dynamically from transactions
  const usageBreakdown = useMemo(() => {
    const categories: WalletActionCategory[] = [
      'branch_setup',
      'staff_invite',
      'loyalty_setup',
      'qr_generation',
      'campaign_creation',
      'redemption_commission'
    ];

    return categories.map((cat) => {
      const catTxs = transactions.filter((t) => t.category === cat && t.type === 'debit');
      const totalSpent = catTxs.reduce((sum, t) => sum + t.amount, 0);
      const count = catTxs.length;
      return {
        category: cat,
        label: categoryConfig[cat].label,
        totalSpent,
        count,
      };
    });
  }, [transactions]);

  const grandTotalSpent = useMemo(() => {
    return usageBreakdown.reduce((sum, item) => sum + item.totalSpent, 0);
  }, [usageBreakdown]);

  // Filter & Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            tx.description.toLowerCase().includes(q) ||
            tx.id.toLowerCase().includes(q) ||
            (tx.relatedEntityId && tx.relatedEntityId.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, selectedCategory, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // CSV Export for Transaction Ledger
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Description', 'Category', 'Type', 'Amount (Credits)', 'Balance After'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.createdAt,
      `"${t.description.replace(/"/g, '""')}"`,
      categoryConfig[t.category]?.label || t.category,
      t.type.toUpperCase(),
      t.type === 'credit' ? `+${t.amount}` : `-${t.amount}`,
      t.balanceAfter
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revia-wallet-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveCostRule = (action: WalletActionCategory) => {
    const val = parseInt(newCostInput, 10);
    if (!isNaN(val) && val >= 0) {
      updateCostRule(action, val);
    }
    setEditingRule(null);
    setNewCostInput('');
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5 text-[#1A1615]">
      
      {/* Page Header (Matching Dashboard & Branches header structure exactly) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
              Wallet &amp; Credits
            </h1>
          </div>
          <p className="text-xs text-[#7C746C] mt-1 max-w-2xl leading-relaxed">
            Pay-as-you-go credit engine for branch expansion, staff seats, campaign launches, and redemption commissions.
          </p>
        </div>

        <button
          onClick={openTopUpModal}
          className="bg-gradient-to-r from-[#7C3AED] to-[#5844A8] hover:opacity-95 text-white rounded-lg px-4 py-2 text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Add Credit</span>
        </button>
      </div>

      {/* Top Wallet Balance Summary Card */}
      <div className={`rounded-xl p-5 border transition-all shadow-2xs ${
        isLowBalance
          ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-amber-300'
          : 'bg-white border-[#EAE6E1]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Balance Display */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8C827A] uppercase tracking-wider">
                CURRENT WALLET BALANCE
              </span>
              {isLowBalance ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-700" /> Low Balance Notice
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Healthy Balance
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isLowBalance ? 'text-amber-700' : 'text-[#1A1615]'
              }`}>
                {wallet.balance.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-[#6E6A66]">credits total</span>
            </div>

            <div className="bg-[#FAF8FF] border border-[#EAE6E1] px-3 py-2 rounded-lg inline-block mt-2">
              <div className="text-[11px] text-[#6E6A66]">
                <strong className="text-[#1A1615]">{usableBalance.toLocaleString()} credits</strong> usable for actions.
                (250 credits are locked for system provisioning).
              </div>
            </div>

            <p className="text-[11px] text-[#6E6A66] leading-normal pt-1.5 mt-1">
              Your first 250 credits (the initial setup grant) are locked and cannot be spent. You must explicitly buy credits to perform actions. A warning banner triggers automatically when your usable balance drops below <strong className="text-[#1A1615]">{wallet.lowBalanceThreshold - 250} credits</strong>.
            </p>
          </div>

          {/* Right Summary Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-5 bg-[#FAF8FF] border border-[#EAE6E1] p-3.5 sm:p-4 rounded-xl shrink-0">
            <div className="flex-1 min-w-[110px]">
              <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">Total Spent</div>
              <div className="text-[17px] sm:text-[18px] font-extrabold text-[#1A1615] mt-0.5">{grandTotalSpent.toLocaleString()}</div>
            </div>
            <div className="w-px bg-[#EAE6E1] hidden sm:block" />
            <div className="flex-1 min-w-[110px]">
              <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">Cost Rules</div>
              <div className="text-[17px] sm:text-[18px] font-extrabold text-[#1A1615] mt-0.5">{costRules.length} Categories</div>
            </div>
            <div className="w-px bg-[#EAE6E1] hidden sm:block" />
            <div className="flex-1 min-w-[110px]">
              <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">Ledger History</div>
              <div className="text-[17px] sm:text-[18px] font-extrabold text-[#1A1615] mt-0.5">{transactions.length} Events</div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Section: Usage Breakdown & Action Cost Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Usage Breakdown Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#5844A8]" />
              <h2 className="text-[15px] font-bold text-[#1A1615] tracking-tight">
                Usage Breakdown by Action Category
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#6E6A66]">
              All-Time Spending
            </span>
          </div>

          <div className="space-y-3">
            {usageBreakdown.map((item) => {
              const percentage = grandTotalSpent > 0 ? Math.round((item.totalSpent / grandTotalSpent) * 100) : 0;
              return (
                <div key={item.category} className="p-3 rounded-lg border border-[#EAE6E1] bg-[#FAF8FF] space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${categoryConfig[item.category].color}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#1A1615]">{item.totalSpent} credits</span>
                      <span className="text-[11px] text-[#9E9A93] ml-2 font-medium">
                        ({item.count} {item.count === 1 ? 'event' : 'events'})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#EAE6E1] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#7C3AED] to-[#5844A8] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(percentage, item.totalSpent > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Cost Matrix Card (1 Column) */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#5844A8]" />
                <h2 className="text-[15px] font-bold text-[#1A1615] tracking-tight">
                  Action Cost Matrix
                </h2>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FAF5FF] text-[#5844A8] px-2 py-0.5 rounded border border-[#EAE6E1]">
                Admin Editable
              </span>
            </div>

            <div className="space-y-2">
              {costRules.map((rule) => {
                const isEditing = editingRule === rule.action;
                return (
                  <div
                    key={rule.action}
                    className="p-2.5 bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <div className="font-bold text-[#1A1615]">{rule.label}</div>
                      <div className="text-[10px] text-[#9E9A93] capitalize">{rule.costType} cost per action</div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={newCostInput}
                          onChange={(e) => setNewCostInput(e.target.value)}
                          className="w-14 px-2 py-1 bg-white border border-[#5844A8] rounded text-[11px] font-bold outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveCostRule(rule.action)}
                          className="px-2 py-1 bg-[#5844A8] text-white rounded font-bold text-[10px] cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1A1615] bg-white border border-[#EAE6E1] px-2 py-0.5 rounded">
                          {rule.cost} credits
                        </span>
                        <button
                          onClick={() => {
                            setEditingRule(rule.action);
                            setNewCostInput(String(rule.cost));
                          }}
                          className="text-[10px] font-bold text-[#5844A8] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#EAE6E1]">
            <p className="text-[10px] text-[#6E6A66] leading-relaxed">
              * Cost changes update immediately across the merchant panel gating functions.
            </p>
          </div>
        </div>

      </div>

      {/* Transaction Ledger Card */}
      <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs space-y-4">
        
        {/* Ledger Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#EAE6E1] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#5844A8]" />
            <div>
              <h2 className="text-[15px] font-bold text-[#1A1615] tracking-tight">
                Transaction Ledger
              </h2>
              <p className="text-[11px] text-[#6E6A66]">
                Complete audit trail of credit additions, setup fees, and redemption commissions
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:items-end w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:min-w-[280px]">
              <Search className="w-3.5 h-3.5 text-[#9E9A93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search description or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg text-[12px] font-medium text-[#1A1615] outline-none focus:border-[#5844A8]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Category Filter */}
              <div className="flex-1 sm:flex-none flex items-center gap-1 bg-[#FAF8FF] border border-[#EAE6E1] px-2.5 py-1.5 rounded-lg text-[12px] relative" ref={categoryDropdownRef}>
                <Filter className="w-3.5 h-3.5 text-[#6E6A66] shrink-0" />
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="bg-transparent border-none text-[#1A1615] font-bold outline-none cursor-pointer flex items-center gap-1 w-full justify-between sm:min-w-[140px]"
                >
                  <span className="truncate">
                    {{
                      'all': 'All Categories',
                      'topup': 'Credit Top-Up',
                      'branch_setup': 'Branch Setup',
                      'staff_invite': 'Staff Invitation',
                      'loyalty_setup': 'Loyalty Program Setup',
                      'qr_generation': 'QR / Stand Generation',
                      'campaign_creation': 'Campaign Creation',
                      'redemption_commission': 'Redemption Commission'
                    }[selectedCategory as string] || 'All Categories'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-[#9E9A93] transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {categoryDropdownOpen && (
                  <div className="absolute top-full right-0 sm:left-0 mt-1 w-[200px] sm:w-52 bg-white border border-[#EFECE6] rounded-md shadow-xl z-50 overflow-hidden text-left">
                    {[
                      { value: 'all', label: 'All Categories' },
                      { value: 'topup', label: 'Credit Top-Up' },
                      { value: 'branch_setup', label: 'Branch Setup' },
                      { value: 'staff_invite', label: 'Staff Invitation' },
                      { value: 'loyalty_setup', label: 'Loyalty Program Setup' },
                      { value: 'qr_generation', label: 'QR / Stand Generation' },
                      { value: 'campaign_creation', label: 'Campaign Creation' },
                      { value: 'redemption_commission', label: 'Redemption Commission' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedCategory(opt.value);
                          setCurrentPage(1);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FAF8FF] cursor-pointer ${selectedCategory === opt.value ? 'bg-[#FAF8FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FAF8FF] border border-[#EAE6E1] hover:bg-[#EAE6E1] text-[#1A1615] rounded-lg font-bold text-[13px] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#6E6A66] shrink-0" />
                <span className="truncate">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EAE6E1] bg-[#FAF8FF] text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
                <th className="py-2.5 px-3">Date &amp; ID</th>
                <th className="py-2.5 px-3">Event Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6E1] text-[12px]">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#6E6A66]">
                    No transactions matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const catCfg = categoryConfig[tx.category] || { label: tx.category, color: 'bg-gray-100 text-gray-800 border-gray-200' };
                  const isCredit = tx.type === 'credit';
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAF8FF] transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="font-bold text-[#1A1615]">{tx.createdAt}</div>
                        <div className="text-[10px] text-[#9E9A93]">{tx.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#1A1615]">{tx.description}</div>
                        {tx.relatedEntityId && (
                          <div className="text-[10px] text-[#6E6A66] font-mono">Ref: {tx.relatedEntityId}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${catCfg.color}`}>
                          {catCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isCredit ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <ArrowDownLeft className="w-3.5 h-3.5" /> Credit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Debit
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-black whitespace-nowrap">
                        <span className={isCredit ? 'text-emerald-700' : 'text-rose-700'}>
                          {isCredit ? '+' : '-'}{tx.amount} credits
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#1A1615] whitespace-nowrap">
                        {tx.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Pagination */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#EAE6E1]">
          <div className="text-[11px] text-[#6E6A66]">
            Showing <strong className="text-[#1A1615]">{filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-[#1A1615]">{Math.min(currentPage * pageSize, filteredTransactions.length)}</strong> of{' '}
            <strong className="text-[#1A1615]">{filteredTransactions.length}</strong> transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#EAE6E1] text-[#6E6A66] hover:text-[#1A1615] hover:bg-[#FAF8FF] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-[#1A1615]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#EAE6E1] text-[#6E6A66] hover:text-[#1A1615] hover:bg-[#FAF8FF] disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
