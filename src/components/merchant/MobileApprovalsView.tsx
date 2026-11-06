import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  Home,
  Calendar,
  ShoppingBag,
  Menu as MenuIcon,
  FileText,
  ChevronRight,
  Gift,
  Tag,
  Coins,
  Coffee,
  AlertCircle
} from 'lucide-react';

interface Props {
  onNavigate?: (route: string) => void;
  onRequestAction?: (id: string, action: 'accept' | 'decline') => void;
}

interface MobileApprovalItem {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  timeAgo: string;
  status: 'Pending' | 'Approved' | 'Declined';
  offerTitle: string;
  offerSubtext: string;
  offerTag: string;
  image: string;
  icon: 'gift' | 'tag' | 'coins' | 'coffee';
}

const INITIAL_ITEMS: MobileApprovalItem[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    initials: 'AS',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-[#5844A8]',
    timeAgo: '5 min ago',
    status: 'Pending',
    offerTitle: 'Birthday Special',
    offerSubtext: 'Free dessert',
    offerTag: 'Birthday-based offer',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80',
    icon: 'gift'
  },
  {
    id: '2',
    name: 'Priya Singh',
    initials: 'PS',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-[#5844A8]',
    timeAgo: '12 min ago',
    status: 'Pending',
    offerTitle: '20% OFF',
    offerSubtext: '20% billing discount',
    offerTag: 'First-visit offer',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80',
    icon: 'tag'
  },
  {
    id: '3',
    name: 'Rohan Kapoor',
    initials: 'RK',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-[#5844A8]',
    timeAgo: '24 min ago',
    status: 'Pending',
    offerTitle: '₹100 Cashback',
    offerSubtext: 'Cashback reward',
    offerTag: 'Minimum bill ₹500',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80',
    icon: 'coins'
  },
  {
    id: '4',
    name: 'Neha Taneja',
    initials: 'NT',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-[#5844A8]',
    timeAgo: '35 min ago',
    status: 'Pending',
    offerTitle: 'Free Coffee',
    offerSubtext: 'Free item',
    offerTag: 'Qualifying visit completed',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    icon: 'coffee'
  }
];

export const MobileApprovalsView: React.FC<Props> = ({ onNavigate, onRequestAction }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [items, setItems] = useState<MobileApprovalItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAction = (id: string, action: 'accept' | 'decline') => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: action === 'accept' ? 'Approved' : 'Declined' } : it))
    );
    onRequestAction?.(id, action);
    showToast(action === 'accept' ? 'Reward request approved!' : 'Reward request declined.');
  };

  const pendingItems = items.filter((i) => i.status === 'Pending');
  const approvedItems = items.filter((i) => i.status === 'Approved');
  const declinedItems = items.filter((i) => i.status === 'Declined');

  const currentList =
    activeTab === 'pending'
      ? pendingItems
      : activeTab === 'approved'
      ? approvedItems
      : declinedItems;

  const filteredList = currentList.filter(
    (it) =>
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.offerTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF8FF] text-[#1E1548] font-sans flex flex-col overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[120] bg-[#1E1548] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-purple-500/30 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Status Bar Simulation */}
      <div className="pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-gray-700 bg-transparent shrink-0">
        <span className="font-bold text-sm tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5 text-gray-700">
          <span className="text-[11px]">📶</span>
          <span className="text-[11px]">⚡</span>
          <div className="w-5 h-2.5 rounded-xs border border-gray-700 flex items-center p-0.5">
            <div className="h-full w-3 bg-gray-700 rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-24 space-y-4">
        {/* Header Title */}
        <div className="px-1">
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Approvals</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Review customer reward requests</p>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Pending Card */}
          <div className="bg-[#FAF5FF] border border-purple-100/70 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#5844A8]">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-black">12</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 mt-1">Pending</span>
          </div>

          {/* Approved Card */}
          <div className="bg-[#ECFDF5] border border-emerald-100 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-sm font-black">18</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 mt-1">Approved Today</span>
          </div>

          {/* Declined Card */}
          <div className="bg-[#FFF1F2] border border-rose-100 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1.5 text-rose-500">
              <XCircle className="w-3.5 h-3.5" />
              <span className="text-sm font-black">{declinedItems.length > 0 ? declinedItems.length : 2}</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 mt-1">Declined Today</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'pending'
                ? 'bg-[#1E1548] text-white shadow-purple-900/10'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:border-purple-200'
            }`}
          >
            Pending ({pendingItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'approved'
                ? 'bg-[#1E1548] text-white shadow-purple-900/10'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:border-purple-200'
            }`}
          >
            Approved ({approvedItems.length > 0 ? approvedItems.length : 18})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('declined')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'declined'
                ? 'bg-[#1E1548] text-white shadow-purple-900/10'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:border-purple-200'
            }`}
          >
            Declined ({declinedItems.length > 0 ? declinedItems.length : 2})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name or offer..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-gray-200/90 text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 shadow-2xs"
            />
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200/90 flex items-center justify-center text-gray-500 hover:text-[#5844A8] hover:border-purple-200 shadow-2xs cursor-pointer transition"
            title="Filter options"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-1">
          {activeTab === 'declined' && filteredList.length === 0 && declinedItems.length === 0 ? (
            /* Empty State for Declined */
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-purple-50 shadow-2xs">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-100/70 to-pink-100/70 flex items-center justify-center relative">
                <div className="w-16 h-20 bg-white rounded-2xl shadow-sm border border-purple-100/80 flex flex-col justify-center items-center gap-1.5 p-2">
                  <div className="w-8 h-1.5 bg-purple-200 rounded-full" />
                  <div className="w-10 h-1.5 bg-purple-100 rounded-full" />
                  <div className="w-9 h-1.5 bg-purple-100 rounded-full" />
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-[#1E1548]">No declined requests</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Requests will appear here when available.</p>
              </div>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-purple-100/70 shadow-2xs space-y-3 hover:border-purple-200 transition"
              >
                {/* Customer Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full ${item.avatarBg} ${item.avatarText} flex items-center justify-center text-xs font-black shadow-2xs`}
                    >
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E1548]">{item.name}</h4>
                      <span className="text-[10px] font-semibold text-gray-400">
                        {activeTab === 'approved'
                          ? `Approved ${item.timeAgo}`
                          : activeTab === 'declined'
                          ? `Declined ${item.timeAgo}`
                          : item.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {activeTab === 'pending' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/70">
                      Pending
                    </span>
                  ) : activeTab === 'approved' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Approved
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-200/70 flex items-center gap-1">
                      <X className="w-2.5 h-2.5" /> Declined
                    </span>
                  )}
                </div>

                {/* Offer Details with Thumbnail */}
                <div className="flex items-center justify-between gap-3 bg-[#FAF8FF] p-2.5 rounded-2xl border border-purple-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      {item.icon === 'gift' && <Gift className="w-4 h-4" />}
                      {item.icon === 'tag' && <Tag className="w-4 h-4" />}
                      {item.icon === 'coins' && <Coins className="w-4 h-4" />}
                      {item.icon === 'coffee' && <Coffee className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-[#1E1548] truncate">{item.offerTitle}</h5>
                      <p className="text-[10px] font-semibold text-gray-600 truncate">{item.offerSubtext}</p>
                      <p className="text-[9px] text-gray-400 truncate">{item.offerTag}</p>
                    </div>
                  </div>

                  <img
                    src={item.image}
                    alt={item.offerTitle}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs border border-white"
                  />
                </div>

                {/* Action Buttons */}
                {activeTab === 'pending' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'decline')}
                      className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#1E1548] cursor-pointer shadow-2xs transition active:scale-98"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, 'accept')}
                      className="flex-1 py-2.5 rounded-xl bg-[#2D1A47] hover:bg-[#3D255E] text-white text-xs font-bold cursor-pointer shadow-md shadow-purple-950/20 transition active:scale-98"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => showToast(`Viewing details for ${item.name}`)}
                    className="w-full py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#1E1548] cursor-pointer shadow-2xs transition active:scale-98"
                  >
                    Details
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Items matching mockup) */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-purple-100/80 px-4 flex items-center justify-between z-[110] shadow-lg">
        {/* Home */}
        <button
          type="button"
          onClick={() => onNavigate?.('/dashboard')}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-gray-600 flex-1 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Campaigns */}
        <button
          type="button"
          onClick={() => onNavigate?.('/campaigns')}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-gray-600 flex-1 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Campaigns</span>
        </button>

        {/* Center Circular FAB */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            type="button"
            onClick={() => onNavigate?.('/qr-codes')}
            className="w-12 h-12 rounded-full bg-[#1E1548] text-white flex items-center justify-center shadow-lg shadow-purple-950/30 cursor-pointer active:scale-95 transition"
            title="Generate QR Codes"
          >
            <MenuIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Approvals (Active) */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className="flex flex-col items-center justify-center gap-0.5 text-[#5844A8] font-bold flex-1 cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#5844A8]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-black">Approvals</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={() => onNavigate?.('/branches')}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-gray-600 flex-1 cursor-pointer"
        >
          <MenuIcon className="w-4 h-4" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </div>
  );
};

