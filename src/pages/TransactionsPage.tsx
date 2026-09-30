import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchTransactions, addTransaction } from '../store/slices/transactionSlice';
import {
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Download,
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle2,
  MoreVertical,
  Activity,
  MapPin,
  Wifi,
  Zap,
  Coffee,
  Check,
  X
} from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions);
  
  const [fastEntryMode, setFastEntryMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All Branches (Downtown)');
  const [paymentFilter, setPaymentFilter] = useState('Payment: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [receiptModalTx, setReceiptModalTx] = useState<any>(null);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [fastPosModalOpen, setFastPosModalOpen] = useState(false);
  const [counterSearch, setCounterSearch] = useState('#REV-8924');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  
  const [fcCounter, setFcCounter] = useState('Counter 1 (Main)');
  const [fcEntryType, setFcEntryType] = useState('Sale');
  const [fcPaymentMethod, setFcPaymentMethod] = useState('Cash');
  const [fcPaymentStatus, setFcPaymentStatus] = useState('Paid');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const [selectedStampsAction, setSelectedStampsAction] = useState<number>(2);
  const [customStamps, setCustomStamps] = useState<string>('');
  const [orderValue, setOrderValue] = useState<string>('$18.50');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = (tx.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.guestName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.items || '').toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter !== 'Status: All') {
      matchesStatus = statusFilter.includes('Completed') ? tx.status === 'Completed' : tx.status === 'Verified';
    }

    let matchesCategory = true;
    if (categoryFilter === 'Purchases') matchesCategory = (tx.type || '').toLowerCase().includes('purchase') || (tx.type || '').toLowerCase().includes('flight') || (tx.amount || '').includes('$');
    if (categoryFilter === 'Stamps Only') matchesCategory = (tx.type || '').toLowerCase().includes('stamp earn');
    if (categoryFilter === 'Redemptions') matchesCategory = (tx.type || '').toLowerCase().includes('redemption');

    let matchesBranch = true;
    if (branchFilter !== 'All Branches (Downtown)') {
      if (branchFilter.includes('Northside')) matchesBranch = (tx.channel || '').includes('POS-02') || (tx.channel || '').includes('POS-03');
      if (branchFilter.includes('West End')) matchesBranch = (tx.channel || '').includes('POS-04');
    }

    let matchesPayment = true;
    if (paymentFilter !== 'Payment: All') {
      if (paymentFilter.includes('Credit Card')) matchesPayment = (tx.amount || '').includes('$');
      if (paymentFilter.includes('Voucher')) matchesPayment = (tx.type || '').includes('Voucher');
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesBranch && matchesPayment;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, branchFilter, paymentFilter, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const DropdownSelect = ({ id, value, options, onChange, fullWidth = false }: { id: string, value: string, options: string[], onChange: (v: string) => void, fullWidth?: boolean }) => (
    <div className={`relative w-full ${!fullWidth ? 'sm:w-auto' : ''}`} ref={openDropdown === id ? dropdownRef : null}>
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className={`flex items-center justify-between gap-1.5 px-3 py-2 bg-white border border-[#EFECE6] rounded-lg ${fullWidth ? 'text-sm' : 'text-xs'} font-semibold text-[#1A1615] hover:bg-[#FAF8F5] transition-colors cursor-pointer w-full ${!fullWidth ? 'sm:w-auto' : ''}`}
      >
        <span className="truncate">{value}</span> <ChevronDown className="w-3.5 h-3.5 text-[#9E9A93] shrink-0" />
      </button>
      {openDropdown === id && (
        <div className={`absolute top-full mt-1 left-0 ${!fullWidth ? 'sm:left-auto sm:right-0' : ''} w-full min-w-[160px] bg-white border border-[#EFECE6] rounded-lg shadow-lg z-50 py-1 overflow-hidden`}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={(e) => { e.preventDefault(); onChange(opt); setOpenDropdown(null); }}
              className={`w-full text-left px-3 py-2 ${fullWidth ? 'text-sm' : 'text-xs'} hover:bg-[#FAF8F5] transition-colors ${value === opt ? 'font-bold text-[#1A1615] bg-[#FAF8F5]' : 'font-medium text-[#6E6A66]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'BLACK TIER':
        return <span className="px-1.5 py-0.5 rounded bg-[#1A1615] text-white text-[9px] font-bold tracking-wider uppercase">BLACK TIER</span>;
      case 'RESERVE':
        return <span className="px-1.5 py-0.5 rounded bg-[#FDF8EB] text-[#9E782F] text-[9px] font-bold tracking-wider uppercase border border-[#F3E5C8]">RESERVE</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-[#F5F4F0] text-[#6E6A66] text-[9px] font-bold tracking-wider uppercase">NON-MEMBER</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]"></span> Verified
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#1A1615]">
        {/* Bottom Toast Feedback */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            <span>{feedbackToast}</span>
          </div>
        )}

        <div className="p-4 lg:p-6 space-y-6 flex-1 max-w-[1600px] mx-auto w-full">

          {/* MAIN SECTION HEADER & TOP METRICS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                {/* <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight">Transactions &amp; POS Counter Entry</h1> */}
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight">Transactions</h1>
                <span className="w-fit px-2.5 py-1 text-[10px] font-bold bg-[#FDF8EB] text-[#9E782F] rounded-full uppercase tracking-wider border border-[#F3E5C8]">
                  Live Terminal Feed
                </span>
              </div>
              <p className="text-sm text-[#6E6A66] max-w-2xl">
                Live register stream, counter check-ins, customer stamp logging.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shrink-0 mt-2 md:mt-0">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] rounded-lg transition-colors shadow-sm cursor-pointer">
                <Download className="w-4 h-4 text-[#6E6A66]" />
                Export Ledger CSV
              </button>
              <button
                onClick={() => setFastPosModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-white" />
                Fast Counter Entry
              </button>
            </div>
          </div>

          {/* Stat Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="bg-white rounded-xl border border-[#EAE6E1] p-4 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Today Revenue</div>
              </div>
              <div className="text-[24px] font-bold text-[#1A1615] mb-1">₹8,420</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">142 total register events</div>
            </div>

            <div className="bg-white rounded-xl border border-[#EAE6E1] p-4 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Stamps Issued Today</div>
              </div>
              <div className="text-[24px] font-bold text-[#1A1615] mb-1">384</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">+42 stamps vs yesterday peak</div>
            </div>

            <div className="bg-white rounded-xl border border-[#EAE6E1] p-4 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Redemptions Completed</div>
              </div>
              <div className="text-[24px] font-bold text-[#1A1615] mb-1">28</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">Free items redeemed</div>
            </div>

            <div className="bg-white rounded-xl border border-[#EAE6E1] p-4 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Avg Transaction Speed</div>
              </div>
              <div className="text-[24px] font-bold text-[#1A1615] mb-1">1.8s</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">Zero offline queue drops</div>
            </div>

            <div className="bg-white rounded-xl border border-[#EAE6E1] p-4 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Total Commission</div>
              </div>
              <div className="text-[24px] font-bold text-[#D93025] mb-1">-842</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">10% debit on today's revenue</div>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

            {/* 4. LEFT SECTION: LIVE TRANSACTION LEDGER & FILTER BAR */}
            <div className="xl:col-span-12 bg-white rounded-xl border border-[#EFECE6] shadow-sm flex flex-col overflow-hidden">

              {/* Filter & Category Tabs */}
              <div className="p-4 border-b border-[#EFECE6] bg-[#FAF8F5]/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCategoryFilter('All')}
                      className={`px-3 py-1.5 shadow-sm rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${categoryFilter === 'All' ? 'bg-white border border-[#EFECE6] text-[#1A1615]' : 'bg-transparent border border-transparent text-[#6E6A66] hover:bg-[#EFECE6]'}`}>
                      All ({transactions.length})
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Purchases')}
                      className={`px-3 py-1.5 shadow-sm rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${categoryFilter === 'Purchases' ? 'bg-white border border-[#EFECE6] text-[#1A1615]' : 'bg-transparent border border-transparent text-[#6E6A66] hover:bg-[#EFECE6]'}`}>
                      Purchases
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Stamps Only')}
                      className={`px-3 py-1.5 shadow-sm rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${categoryFilter === 'Stamps Only' ? 'bg-white border border-[#EFECE6] text-[#1A1615]' : 'bg-transparent border border-transparent text-[#6E6A66] hover:bg-[#EFECE6]'}`}>
                      Stamps Only
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Redemptions')}
                      className={`px-3 py-1.5 shadow-sm rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${categoryFilter === 'Redemptions' ? 'bg-white border border-[#EFECE6] text-[#1A1615]' : 'bg-transparent border border-transparent text-[#6E6A66] hover:bg-[#EFECE6]'}`}>
                      Redemptions
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F4ED] text-[#0D7A53] rounded border border-[#BCE3D1] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53] animate-pulse"></span>
                    Live Stream (Updated 10s ago)
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9A93]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by Member ID, Order ID..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs focus:outline-none focus:border-[#D4A753] text-[#1A1615] placeholder:text-[#9E9A93] font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <DropdownSelect id="branch" value={branchFilter} options={['All Branches (Downtown)', 'Northside Mall', 'West End Kiosk']} onChange={setBranchFilter} />
                    <DropdownSelect id="payment" value={paymentFilter} options={['Payment: All', 'Payment: Credit Card', 'Payment: Mobile Pay', 'Payment: Voucher']} onChange={setPaymentFilter} />
                    <DropdownSelect id="status" value={statusFilter} options={['Status: All', 'Status: Completed', 'Status: Verified']} onChange={setStatusFilter} />
                  </div>
                </div>
              </div>

              {/* Ledger Data Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EFECE6]">
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] w-[18%]">Order / Stamp ID</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] w-[18%]">Guest / Member</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] w-[25%]">Type &amp; Items</th>
                      <th className="py-3 px-3 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Channel / Terminal</th>
                      <th className="py-3 px-3 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Time</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Amount</th>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Commission</th>
                      <th className="py-3 px-3 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Status</th>
                      <th className="py-3 px-3 text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6]">
                    {currentTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-xs font-mono font-bold text-[#D4A753]">{tx.id.split(' ')[0]}</div>
                          <div className="text-[10px] font-semibold text-[#9E9A93] mt-0.5">{tx.id.split(' ')[1]}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#EFECE6] border border-[#D1CDC7] flex items-center justify-center text-[10px] font-bold text-[#6E6A66] shrink-0">
                              {tx.avatar}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#1A1615] leading-tight">{tx.guestName}</div>
                              <div className="mt-0.5">{getTierBadge(tx.tier)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-bold text-[#1A1615]">{tx.type}</div>
                          <div className="text-[10px] font-semibold text-[#6E6A66] mt-0.5">{tx.items}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[11px] font-semibold text-[#6E6A66]">{tx.channel}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#1A1615]">
                            <Clock className="w-3 h-3 text-[#9E9A93]" /> {tx.time}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-bold text-[#1A1615]">{tx.amount}</div>
                          <div className={`text-[10px] font-bold mt-0.5 ${(tx.stamps || '').includes('+') ? 'text-[#D4A753]' : (tx.stamps || '').includes('-') ? 'text-[#0D7A53]' : 'text-[#9E9A93]'}`}>
                            {tx.stamps}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-bold text-[#1A1615]">{tx.commission || '₹0.00'}</div>
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-3 px-3 text-right relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === tx.id ? null : tx.id); }}
                            className="p-1.5 text-[#9E9A93] hover:text-[#1A1615] rounded bg-white hover:bg-[#EFECE6] transition-colors cursor-pointer border border-transparent hover:border-[#D1CDC7]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openDropdown === tx.id && (
                            <>
                              <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} />
                              <div className={`absolute right-0 w-40 bg-white border border-[#EFECE6] rounded-xl shadow-xl z-[60] overflow-hidden text-left ${idx >= currentTransactions.length - 2 && currentTransactions.length > 2 ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); setReceiptModalTx(tx); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A1615] cursor-pointer hover:bg-[#FAF8F5]">View Receipt</button>
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); showToast('Refunding transaction...'); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#DC2626] cursor-pointer hover:bg-[#FEE2E2]">Refund</button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Expandable List */}
              <div className="md:hidden flex flex-col">
                {currentTransactions.map((tx, idx) => {
                  const isExpanded = expandedTxId === tx.id;

                  return (
                    <div key={idx} className="border-b border-[#EFECE6] last:border-b-0 overflow-hidden">
                      <button
                        onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                        className="w-full p-4 flex items-start justify-between transition-colors cursor-pointer bg-white hover:bg-[#FAF8F5]"
                      >
                        <div className="flex gap-3 text-left">
                          <div className="w-8 h-8 mt-1 rounded-full bg-[#EFECE6] border border-[#D1CDC7] flex items-center justify-center text-[10px] font-bold text-[#6E6A66] shrink-0">
                            {tx.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1A1615] mb-1">
                              {tx.guestName}
                            </div>
                            <div className="text-xs font-mono font-bold text-[#D4A753]">
                              {(tx.id || '').split(' ')[0]}
                            </div>
                            <div className="text-[10px] font-semibold text-[#9E9A93] mt-0.5">
                              {(tx.id || '').split(' ')[1]}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(tx.status)}
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[#8C827A]" />
                            )}
                          </div>
                          <div className="text-xs font-bold text-[#1A1615]">{tx.amount}</div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 grid grid-cols-2 gap-4 border-t border-[#EFECE6] bg-[#FAF8F5]/50">
                          <div className="col-span-2">
                            <div className="text-[9px] uppercase font-bold text-[#9E9A93] mb-1 tracking-wider">Type &amp; Items</div>
                            <div className="text-xs font-bold text-[#1A1615]">{tx.type}</div>
                            <div className="text-[10px] font-semibold text-[#6E6A66] mt-0.5">{tx.items}</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-bold text-[#9E9A93] mb-1 tracking-wider">Channel / Terminal</div>
                            <div className="text-[11px] font-semibold text-[#6E6A66]">{tx.channel}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] uppercase font-bold text-[#9E9A93] mb-1 tracking-wider">Time</div>
                            <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-[#1A1615]">
                              <Clock className="w-3 h-3 text-[#9E9A93]" /> {tx.time}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-bold text-[#9E9A93] mb-1 tracking-wider">Stamps</div>
                            <div className={`text-[11px] font-bold ${(tx.stamps || '').includes('+') ? 'text-[#D4A753]' : (tx.stamps || '').includes('-') ? 'text-[#0D7A53]' : 'text-[#1A1615]'}`}>
                              {tx.stamps}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-bold text-[#9E9A93] mb-1 tracking-wider">Commission</div>
                            <div className="text-[11px] font-bold text-[#1A1615]">{tx.commission || '₹0.00'}</div>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-[#EFECE6] flex justify-end gap-2 mt-2">
                            <button onClick={(e) => { e.stopPropagation(); setReceiptModalTx(tx); }} className="px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-white border border-[#EFECE6] rounded-lg shadow-sm hover:bg-[#FAF8F5]">View Receipt</button>
                            <button onClick={(e) => { e.stopPropagation(); showToast('Refunding transaction...'); }} className="px-4 py-2 text-[13px] font-semibold text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] rounded-lg shadow-sm hover:bg-[#FCA5A5]">Refund</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Table Footer Pagination */}
              <div className="px-5 py-4 border-t border-[#EFECE6] bg-[#FAF8F5] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6E6A66]">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTransactions.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 font-bold transition-colors cursor-pointer ${currentPage === 1 ? 'text-[#D1CDC7] cursor-not-allowed' : 'text-[#9E9A93] hover:text-[#1A1615]'}`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 flex items-center justify-center rounded font-bold transition-colors cursor-pointer ${currentPage === page
                        ? 'bg-gradient-to-b from-[#D4A753] to-[#9E782F] text-white shadow-xs'
                        : 'bg-white border border-[#EFECE6] text-[#6E6A66] hover:text-[#1A1615]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 font-bold transition-colors cursor-pointer ${currentPage === totalPages ? 'text-[#D1CDC7] cursor-not-allowed' : 'text-[#1A1615] hover:text-[#D4A753]'}`}
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Fast POS Entry Modal */}
      {fastPosModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setFastPosModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#EFECE6] bg-[#1A1615] text-white flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-[15px] font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4A753]" />Fast Counter Entry
              </h2>
              <div className="flex items-center gap-3">
                {/* <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">QUICK MODE</span>
                  <button
                    onClick={() => setFastEntryMode(!fastEntryMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${fastEntryMode ? 'bg-[#0D7A53]' : 'bg-[#4A4441]'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${fastEntryMode ? 'translate-x-4.5' : 'translate-x-1'}`} />
                  </button>
                </div> */}
                <button onClick={() => setFastPosModalOpen(false)} className="text-[#9E9A93] hover:text-white transition-colors cursor-pointer ml-1 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6 bg-[#FDFBF7]">

              {/* 1. Transaction Details */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 border-b border-[#EFECE6] pb-1">1. Transaction Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Entry Date &amp; Time</label>
                    <input type="text" readOnly defaultValue={new Date().toLocaleString()} className="w-full px-3 py-2 bg-[#EFECE6] border border-[#D1CDC7] rounded-lg text-sm font-semibold text-[#6E6A66] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Staff / Cashier</label>
                    <input type="text" readOnly defaultValue="Logged-in Staff" className="w-full px-3 py-2 bg-[#EFECE6] border border-[#D1CDC7] rounded-lg text-sm font-semibold text-[#6E6A66] focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Counter</label>
                    <DropdownSelect id="fc-counter" value={fcCounter} options={['Counter 1 (Main)', 'Counter 2 (Takeaway)', 'Counter 3 (Drive-thru)']} onChange={setFcCounter} fullWidth={true} />
                  </div>
                </div>
              </div>

              {/* 2. Customer Details */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 border-b border-[#EFECE6] pb-1">2. Customer Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Customer Name (Optional)</label>
                    <input type="text" placeholder="e.g. John Doe" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Customer Phone (Optional)</label>
                    <input type="text" placeholder="+1 555-0000" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                </div>
              </div>

              {/* 3. Transaction */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 border-b border-[#EFECE6] pb-1">3. Transaction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Entry Type</label>
                    <DropdownSelect id="fc-type" value={fcEntryType} options={['Sale', 'Service', 'Other']} onChange={setFcEntryType} fullWidth={true} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Description / Item</label>
                    <input type="text" placeholder="Item details..." className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Amount *</label>
                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Discount</label>
                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Tax</label>
                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A1615] mb-1">Final Amount</label>
                    <input type="text" readOnly placeholder="0.00" className="w-full px-3 py-2 bg-[#EFECE6] border border-[#D1CDC7] rounded-lg text-sm font-bold text-[#1A1615] focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* 4. Payment */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 border-b border-[#EFECE6] pb-1">4. Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Payment Method</label>
                    <DropdownSelect id="fc-payment-method" value={fcPaymentMethod} options={['Cash', 'Card', 'UPI', 'Other']} onChange={setFcPaymentMethod} fullWidth={true} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Payment Status</label>
                    <DropdownSelect id="fc-payment-status" value={fcPaymentStatus} options={['Paid', 'Pending']} onChange={setFcPaymentStatus} fullWidth={true} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Reference No. (Optional)</label>
                    <input type="text" placeholder="Transaction ID / UPI Ref" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                  </div>
                </div>
              </div>

              {/* 5. Additional */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 border-b border-[#EFECE6] pb-1">5. Additional</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#6E6A66] mb-1">Notes (Optional)</label>
                  <textarea rows={2} placeholder="Add any extra notes here..." className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] resize-none"></textarea>
                </div>
              </div>

            </div>

            {/* Section 6: Primary Submission Button */}
            <div className="p-5 border-t border-[#EFECE6] bg-white mt-auto sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <button
                onClick={() => {
                  const newTx = {
                    id: `#ORD-${Math.floor(10000 + Math.random() * 90000)} (FAST-COUNTER)`,
                    guestName: 'Walk-in Customer',
                    avatar: 'WC',
                    tier: 'NON-MEMBER',
                    type: 'Manual Sale',
                    items: 'Counter Transaction',
                    channel: 'Counter 1 (Main)',
                    time: 'Just now',
                    amount: '₹0.00',
                    commission: '0.00',
                    stamps: '0 Stamps',
                    status: 'Completed',
                  };
                  dispatch(addTransaction(newTx));
                  showToast('Transaction submitted successfully.');
                  setFastPosModalOpen(false);
                }}
                className="w-full px-4 py-2 bg-gradient-to-b from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg text-[13px] font-bold transition-opacity shadow-md cursor-pointer flex justify-center items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Transaction
              </button>
            </div>

            {/* Section 6: Counter Hotkeys Footer */}
            {/* <div className="px-5 py-3 border-t border-[#EFECE6] bg-[#FAF8F5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1615]">Counter Hotkeys</span>
                <span className="px-2 py-0.5 bg-white border border-[#EFECE6] rounded text-[9px] font-bold text-[#9E9A93] uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-2.5 h-2.5 text-[#0D7A53]" /> Keyboard enabled
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6E6A66]">
                  <span>Quick Stamp +1</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#EFECE6] rounded shadow-xs font-mono font-bold text-[#1A1615]">Ctrl + 1</kbd>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6E6A66]">
                  <span>Focus Search/Scan</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#EFECE6] rounded shadow-xs font-mono font-bold text-[#1A1615]">Ctrl + K</kbd>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#6E6A66]">
                  <span>Process Order</span>
                  <kbd className="px-1.5 py-0.5 bg-[#1A1615] text-white border border-[#1A1615] rounded shadow-xs font-mono font-bold">Enter ↵</kbd>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {receiptModalTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setReceiptModalTx(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] flex justify-between items-center bg-[#FAF8F5]">
              <h2 className="text-[15px] font-bold text-[#1A1615]">Transaction Receipt</h2>
              <button onClick={() => setReceiptModalTx(null)} className="p-1 text-[#9E9A93] hover:text-[#1A1615] rounded transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-[#1A1615]">{receiptModalTx.amount}</div>
                <div className="text-xs font-mono text-[#6E6A66] mt-1">{receiptModalTx.id}</div>
                <div className={`text-[10px] font-bold mt-2 inline-block px-2 py-1 rounded uppercase tracking-wider ${receiptModalTx.status === 'Completed' ? 'bg-[#E6F4ED] text-[#0D7A53]' : 'bg-[#E0F2FE] text-[#0369A1]'}`}>
                  {receiptModalTx.status}
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#6E6A66] font-semibold">Guest</span>
                  <span className="text-[#1A1615] font-bold">{receiptModalTx.guestName}</span>
                </div>
                <div className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#6E6A66] font-semibold">Type</span>
                  <span className="text-[#1A1615] font-bold text-right">{receiptModalTx.type}</span>
                </div>
                <div className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#6E6A66] font-semibold">Items</span>
                  <span className="text-[#1A1615] font-bold text-right max-w-[60%]">{receiptModalTx.items}</span>
                </div>
                <div className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#6E6A66] font-semibold">Terminal</span>
                  <span className="text-[#1A1615] font-bold text-right">{receiptModalTx.channel}</span>
                </div>
                <div className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#6E6A66] font-semibold">Time</span>
                  <span className="text-[#1A1615] font-bold">{receiptModalTx.time}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#6E6A66] font-semibold">Stamps Applied</span>
                  <span className={`font-bold ${receiptModalTx.stamps.includes('+') ? 'text-[#D4A753]' : receiptModalTx.stamps.includes('-') ? 'text-[#0D7A53]' : 'text-[#1A1615]'}`}>
                    {receiptModalTx.stamps}
                  </span>
                </div>
              </div>

              <button onClick={() => { setReceiptModalTx(null); showToast('Receipt printed'); }} className="w-full mt-6 px-4 py-2 bg-[#FAF8F5] border border-[#EFECE6] hover:bg-[#EFECE6] text-[#1A1615] rounded-lg text-[13px] font-bold shadow-sm transition-colors cursor-pointer">
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
