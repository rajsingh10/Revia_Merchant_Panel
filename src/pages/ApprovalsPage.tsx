import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Gift,
  Tag,
  Coins,
  Coffee,
  ShoppingBag,
  Check,
  X,
  AlertCircle,
  User,
  Phone,
  Mail,
  Receipt,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Filter
} from 'lucide-react';

export interface ApprovalRequest {
  id: string;
  customerName: string;
  customerInitials: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatarBg: string;
  customerAvatarTextColor: string;
  timeAgo: string;
  date: string;
  time: string;
  offerType: 'Birthday Special' | 'Discount' | 'Cashback' | 'Free Item' | 'BOGO';
  offerTitle: string;
  offerSubtext: string;
  offerTag: string;
  offerIcon: 'gift' | 'tag' | 'coins' | 'coffee' | 'bag';
  offerIconBg: string;
  offerIconColor: string;
  requestContext: string;
  requestDetailBold: string;
  billAmount?: string;
  status: 'Pending' | 'Approved' | 'Declined';
  notes?: string;
}

const INITIAL_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: 'APR-8801',
    customerName: 'Aarav Sharma',
    customerInitials: 'AS',
    customerPhone: '+91 98765 43210',
    customerEmail: 'aarav.sharma@gmail.com',
    customerAvatarBg: 'bg-purple-100',
    customerAvatarTextColor: 'text-[#5844A8]',
    timeAgo: '5 min ago',
    date: '12 Apr 2025',
    time: '10:24 AM',
    offerType: 'Birthday Special',
    offerTitle: 'Birthday Special',
    offerSubtext: 'Free dessert',
    offerTag: 'Birthday-based offer',
    offerIcon: 'gift',
    offerIconBg: 'bg-rose-100',
    offerIconColor: 'text-rose-500',
    requestContext: "Customer's birthday",
    requestDetailBold: '12 Apr 2025',
    status: 'Pending'
  },
  {
    id: 'APR-8802',
    customerName: 'Priya Singh',
    customerInitials: 'PS',
    customerPhone: '+91 98765 43211',
    customerEmail: 'priya.singh@outlook.com',
    customerAvatarBg: 'bg-pink-100',
    customerAvatarTextColor: 'text-pink-700',
    timeAgo: '12 min ago',
    date: '12 Apr 2025',
    time: '09:58 AM',
    offerType: 'Discount',
    offerTitle: '20% OFF',
    offerSubtext: '20% billing discount',
    offerTag: 'First-visit offer',
    offerIcon: 'tag',
    offerIconBg: 'bg-pink-100',
    offerIconColor: 'text-pink-500',
    requestContext: 'Welcome offer request',
    requestDetailBold: 'New customer',
    billAmount: '₹680',
    status: 'Pending'
  },
  {
    id: 'APR-8803',
    customerName: 'Rohan Kapoor',
    customerInitials: 'RK',
    customerPhone: '+91 98765 43212',
    customerEmail: 'rohan.k@yahoo.com',
    customerAvatarBg: 'bg-rose-100',
    customerAvatarTextColor: 'text-rose-700',
    timeAgo: '24 min ago',
    date: '12 Apr 2025',
    time: '09:30 AM',
    offerType: 'Cashback',
    offerTitle: '₹100 Cashback',
    offerSubtext: 'Cashback reward',
    offerTag: 'Minimum bill ₹500',
    offerIcon: 'coins',
    offerIconBg: 'bg-amber-100',
    offerIconColor: 'text-amber-600',
    requestContext: 'Spent ₹560',
    requestDetailBold: 'Requesting cashback',
    billAmount: '₹560',
    status: 'Pending'
  },
  {
    id: 'APR-8804',
    customerName: 'Neha Taneja',
    customerInitials: 'NT',
    customerPhone: '+91 98765 43213',
    customerEmail: 'neha.taneja@gmail.com',
    customerAvatarBg: 'bg-emerald-100',
    customerAvatarTextColor: 'text-emerald-700',
    timeAgo: '35 min ago',
    date: '12 Apr 2025',
    time: '09:10 AM',
    offerType: 'Free Item',
    offerTitle: 'Free Coffee',
    offerSubtext: 'Free item',
    offerTag: 'Qualifying visit completed',
    offerIcon: 'coffee',
    offerIconBg: 'bg-emerald-100',
    offerIconColor: 'text-emerald-600',
    requestContext: 'Completed 5 visits',
    requestDetailBold: 'Requesting free coffee',
    status: 'Pending'
  },
  {
    id: 'APR-8805',
    customerName: 'Saira Khan',
    customerInitials: 'SK',
    customerPhone: '+91 98765 43214',
    customerEmail: 'saira.khan@loyaltycs.co',
    customerAvatarBg: 'bg-pink-100',
    customerAvatarTextColor: 'text-pink-700',
    timeAgo: '48 min ago',
    date: '12 Apr 2025',
    time: '08:45 AM',
    offerType: 'BOGO',
    offerTitle: 'Buy 1 Get 1',
    offerSubtext: 'On selected items',
    offerTag: 'Campaign offer',
    offerIcon: 'bag',
    offerIconBg: 'bg-pink-100',
    offerIconColor: 'text-pink-600',
    requestContext: 'Bill amount ₹420',
    requestDetailBold: 'Eligible for B1G1',
    billAmount: '₹420',
    status: 'Pending'
  },
  {
    id: 'APR-8806',
    customerName: 'Marcus Vance',
    customerInitials: 'MV',
    customerPhone: '+91 98765 43215',
    customerEmail: 'marcus.v@loyaltycs.co',
    customerAvatarBg: 'bg-purple-100',
    customerAvatarTextColor: 'text-purple-700',
    timeAgo: '1 hr ago',
    date: '12 Apr 2025',
    time: '08:20 AM',
    offerType: 'Discount',
    offerTitle: '15% OFF Weekend Treat',
    offerSubtext: 'Weekend special discount',
    offerTag: 'Weekend campaign',
    offerIcon: 'tag',
    offerIconBg: 'bg-pink-100',
    offerIconColor: 'text-pink-500',
    requestContext: 'Saturday dine-in order',
    requestDetailBold: 'Eligible for 15% OFF',
    billAmount: '₹750',
    status: 'Approved'
  },
  {
    id: 'APR-8807',
    customerName: 'Elena Rostova',
    customerInitials: 'ER',
    customerPhone: '+91 98765 43216',
    customerEmail: 'elena.rostova@loyaltycs.co',
    customerAvatarBg: 'bg-rose-100',
    customerAvatarTextColor: 'text-rose-700',
    timeAgo: '2 hrs ago',
    date: '12 Apr 2025',
    time: '07:30 AM',
    offerType: 'Cashback',
    offerTitle: '₹50 Flat Cashback',
    offerSubtext: 'Morning coffee perk',
    offerTag: 'Daily perk',
    offerIcon: 'coins',
    offerIconBg: 'bg-amber-100',
    offerIconColor: 'text-amber-600',
    requestContext: 'Breakfast order ₹320',
    requestDetailBold: 'Cashback credited',
    billAmount: '₹320',
    status: 'Approved'
  },
  {
    id: 'APR-8808',
    customerName: 'Kabir Das',
    customerInitials: 'KD',
    customerPhone: '+91 98765 43217',
    customerEmail: 'kabir.das@gmail.com',
    customerAvatarBg: 'bg-amber-100',
    customerAvatarTextColor: 'text-amber-700',
    timeAgo: '3 hrs ago',
    date: '12 Apr 2025',
    time: '06:45 AM',
    offerType: 'Birthday Special',
    offerTitle: 'Birthday Special',
    offerSubtext: 'Free dessert',
    offerTag: 'Birthday-based offer',
    offerIcon: 'gift',
    offerIconBg: 'bg-rose-100',
    offerIconColor: 'text-rose-500',
    requestContext: 'ID birthday mismatch',
    requestDetailBold: 'Declined: Date not matching ID',
    status: 'Declined'
  }
];

export const ApprovalsPage: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Declined'>('Pending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Feedback Toast
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Review Modal State
  const [reviewModalRequest, setReviewModalRequest] = useState<ApprovalRequest | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Counts
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const declinedCount = requests.filter(r => r.status === 'Declined').length;

  // Filtered List
  const filteredRequests = requests.filter((r) => {
    const matchesTab = r.status === activeTab;
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.offerTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === 'All' || r.offerType === typeFilter;

    return matchesTab && matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Actions
  const handleAccept = (req: ApprovalRequest) => {
    setRequests(prev =>
      prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r)
    );
    setSelectedIds(prev => prev.filter(id => id !== req.id));
    if (reviewModalRequest?.id === req.id) {
      setReviewModalRequest(null);
    }
    showToast(`Approved ${req.offerTitle} for ${req.customerName}`);
  };

  const handleDecline = (req: ApprovalRequest) => {
    setRequests(prev =>
      prev.map(r => r.id === req.id ? { ...r, status: 'Declined' } : r)
    );
    setSelectedIds(prev => prev.filter(id => id !== req.id));
    if (reviewModalRequest?.id === req.id) {
      setReviewModalRequest(null);
    }
    showToast(`Declined request for ${req.customerName}`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedRequests.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAccept = () => {
    setRequests(prev =>
      prev.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Approved' } : r)
    );
    showToast(`Successfully accepted ${selectedIds.length} approval requests.`);
    setSelectedIds([]);
  };

  const handleBulkDecline = () => {
    setRequests(prev =>
      prev.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Declined' } : r)
    );
    showToast(`Declined ${selectedIds.length} requests.`);
    setSelectedIds([]);
  };

  const renderOfferIcon = (icon: ApprovalRequest['offerIcon']) => {
    switch (icon) {
      case 'gift':
        return <Gift className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'coins':
        return <Coins className="w-4 h-4" />;
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'bag':
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span>Home</span>
          <span>&gt;</span>
          <span className="text-[#1E1548] font-bold">Approvals</span>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
              Approvals Directory
              <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              Manage your approvals request across all branches and venues.
            </p>
          </div>
        </div>

        {/* 3 Top Stat Cards (Matching Figma Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Pending */}
          <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5844A8] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-600">Pending</span>
            </div>
            <div>
              <div className="text-3xl font-black text-[#1E1548]">14</div>
              <div className="text-xs text-gray-400 font-medium mt-1">+2 this month</div>
            </div>
          </div>

          {/* Card 2: Approved Today */}
          <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-600">Approved Today</span>
            </div>
            <div>
              <div className="text-3xl font-black text-[#1E1548]">18</div>
              <div className="text-xs text-emerald-600 font-bold mt-1">86%</div>
            </div>
          </div>

          {/* Card 3: Declined Today */}
          <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-600">Declined Today</span>
            </div>
            <div>
              <div className="text-3xl font-black text-[#1E1548]">2</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Awaiting response</div>
            </div>
          </div>
        </div>

        {/* Main Card: Approvals List */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
          {/* Top Control Bar: Tabs on Left, Search & Dropdowns on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Pending');
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Pending'
                    ? 'bg-[#1E1548] text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pending ({pendingCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('Approved');
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Approved'
                    ? 'bg-[#1E1548] text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Approved ({approvedCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('Declined');
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Declined'
                    ? 'bg-[#1E1548] text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Declined ({declinedCount})
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[260px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer name, offer, or ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-bold text-[#1E1548] appearance-none cursor-pointer focus:outline-none focus:border-[#5844A8]"
                >
                  <option value="All">All Types</option>
                  <option value="Birthday Special">Birthday Special</option>
                  <option value="Discount">Discount</option>
                  <option value="Cashback">Cashback</option>
                  <option value="Free Item">Free Item</option>
                  <option value="BOGO">BOGO</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Time Filter */}
              <div className="relative">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-[#1E1548]">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 mr-2 pointer-events-none" />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#1E1548] appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
              <span className="font-bold text-[#5844A8]">
                {selectedIds.length} request{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkDecline}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 font-bold bg-white hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  Decline Selected
                </button>
                <button
                  type="button"
                  onClick={handleBulkAccept}
                  className="px-4 py-1.5 rounded-xl bg-[#5844A8] text-white font-bold hover:bg-[#47368E] cursor-pointer shadow-xs transition-colors"
                >
                  Accept Selected
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto -mx-6 lg:-mx-8">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400">
                  <th className="py-3 px-6 lg:px-8 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedRequests.length > 0 && selectedIds.length === paginatedRequests.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#5844A8] focus:ring-[#5844A8] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Offer / Reward</th>
                  <th className="py-3 px-4">Request Details</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-6 lg:px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                      No approval requests found for this filter.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((req) => {
                    const isChecked = selectedIds.includes(req.id);
                    return (
                      <tr
                        key={req.id}
                        className={`hover:bg-[#FAF8FF]/60 transition-colors ${
                          isChecked ? 'bg-purple-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-6 lg:px-8">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(req.id)}
                            className="rounded border-gray-300 text-[#5844A8] focus:ring-[#5844A8] cursor-pointer"
                          />
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${req.customerAvatarBg} ${req.customerAvatarTextColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                              {req.customerInitials}
                            </div>
                            <div>
                              <div className="font-bold text-[#1E1548]">{req.customerName}</div>
                              <div className="text-[11px] text-gray-400 font-medium">{req.timeAgo}</div>
                            </div>
                          </div>
                        </td>

                        {/* Offer / Reward */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl ${req.offerIconBg} ${req.offerIconColor} flex items-center justify-center shrink-0`}>
                              {renderOfferIcon(req.offerIcon)}
                            </div>
                            <div>
                              <div className="font-bold text-[#1E1548]">{req.offerTitle}</div>
                              <div className="text-[11px] text-gray-500 font-medium">{req.offerSubtext}</div>
                              <div className="text-[10px] text-gray-400 font-normal">{req.offerTag}</div>
                            </div>
                          </div>
                        </td>

                        {/* Request Details */}
                        <td className="py-4 px-4">
                          <div className="text-gray-500 font-medium text-[11px]">
                            {req.requestContext}
                          </div>
                          <div className="font-bold text-[#1E1548] text-xs mt-0.5">
                            {req.requestDetailBold}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4">
                          <div className="text-gray-700 font-medium text-xs">
                            {req.date}
                          </div>
                          <div className="text-gray-400 text-[11px] mt-0.5 font-medium">
                            {req.time}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 lg:px-8 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setReviewModalRequest(req)}
                              className="px-4 py-1.5 bg-white border border-gray-200 text-[#1E1548] text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer shadow-2xs transition-colors"
                            >
                              Review
                            </button>

                            {req.status === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => handleAccept(req)}
                                className="px-4 py-1.5 bg-[#5844A8] text-white text-xs font-bold rounded-xl hover:bg-[#47368E] cursor-pointer shadow-xs transition-colors"
                              >
                                Accept
                              </button>
                            ) : req.status === 'Approved' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <X className="w-3 h-3" /> Declined
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} approval requests
            </span>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages || 1 }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#5844A8] text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW DETAILS MODAL */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-purple-50 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#5844A8]" />
                <h3 className="text-base font-bold text-[#1E1548]">Review Approval Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalRequest(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Header Box */}
            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-full ${reviewModalRequest.customerAvatarBg} ${reviewModalRequest.customerAvatarTextColor} flex items-center justify-center font-black text-sm shrink-0 shadow-xs`}>
                {reviewModalRequest.customerInitials}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1E1548]">{reviewModalRequest.customerName}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-0.5">
                  <span>{reviewModalRequest.customerPhone}</span>
                  <span>•</span>
                  <span>{reviewModalRequest.customerEmail}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-[#5844A8]">
                ID: {reviewModalRequest.id}
              </span>
            </div>

            {/* Offer Summary Box */}
            <div className="p-4 rounded-2xl border border-gray-100 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Reward &amp; Campaign Information
              </span>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${reviewModalRequest.offerIconBg} ${reviewModalRequest.offerIconColor} flex items-center justify-center shrink-0`}>
                  {renderOfferIcon(reviewModalRequest.offerIcon)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#1E1548]">{reviewModalRequest.offerTitle}</h5>
                  <p className="text-[11px] text-gray-500 font-medium">{reviewModalRequest.offerSubtext}</p>
                  <p className="text-[10px] text-purple-700 font-semibold">{reviewModalRequest.offerTag}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-medium">Trigger Context</span>
                  <div className="font-bold text-[#1E1548]">{reviewModalRequest.requestContext}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Validation Value</span>
                  <div className="font-bold text-[#1E1548]">{reviewModalRequest.requestDetailBold}</div>
                </div>
              </div>

              {reviewModalRequest.billAmount && (
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">Associated Bill Amount</span>
                  <span className="font-black text-[#5844A8]">{reviewModalRequest.billAmount}</span>
                </div>
              )}
            </div>

            {/* Validation Checklist */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                POS Automated Verification Passed
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                Customer eligibility criteria and branch redemption thresholds have been cross-checked against the merchant rule engine.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleDecline(reviewModalRequest)}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Decline Request
              </button>

              <button
                type="button"
                onClick={() => handleAccept(reviewModalRequest)}
                className="px-6 py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#5844A8]/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Accept Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

