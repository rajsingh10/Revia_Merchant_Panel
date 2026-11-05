import React, { useState, useEffect } from 'react';
import { NavRoute, Customer } from '../types';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Store,
  Calendar,
  Gift,
  Clock,
  Tag,
  Star,
  ShoppingBag,
  CreditCard,
  Edit2,
  X,
  Receipt,
  UserCheck,
  Ban,
  Download,
  Send,
  MessageSquare,
  Lock,
  Sparkles,
  FileText,
  Search,
  Layers,
  QrCode
} from 'lucide-react';
import {
  INITIAL_TABLET_CUSTOMERS,
  TabletCustomerItem,
  TabletCustomerCampaign,
  TabletCustomerWalletTx
} from '../data/customerTabletData';
import {
  INITIAL_WEB_CUSTOMERS,
  WebCustomerItem
} from '../data/customersWebData';

interface CustomerDetailPageProps {
  onNavigate: (route: NavRoute) => void;
  customer?: Customer;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ onNavigate }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const targetId = searchParams.get('id');

  // Device mode detection: Web desktop vs Tablet iPad Pro
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'tablet' || params.get('device') === 'tablet') {
        return true;
      }
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('view') && !params.get('device')) {
        setIsTablet(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // =========================================================================
  // WEB STATE & LOGIC (media_1793882598220_59c5d257.jpg)
  // =========================================================================
  const initialWebCust =
    INITIAL_WEB_CUSTOMERS.find((c) => c.id === targetId || c.memberId === targetId) ||
    INITIAL_WEB_CUSTOMERS[0];

  const [webCust, setWebCust] = useState<WebCustomerItem>(initialWebCust);
  const [webPurchaseSearch, setWebPurchaseSearch] = useState('');
  const [isWebEditModalOpen, setIsWebEditModalOpen] = useState(false);

  // Edit Web Customer Form state
  const [editWebName, setEditWebName] = useState(webCust.name);
  const [editWebEmail, setEditWebEmail] = useState(webCust.email);
  const [editWebPhone, setEditWebPhone] = useState(webCust.phone);
  const [editWebTier, setEditWebTier] = useState(webCust.tier);
  const [editWebStatus, setEditWebStatus] = useState(webCust.status);
  const [editWebBranch, setEditWebBranch] = useState(webCust.preferredBranch);
  const [editWebPoints, setEditWebPoints] = useState(webCust.pointsBalance.toString());

  const handleOpenWebEditModal = () => {
    setEditWebName(webCust.name);
    setEditWebEmail(webCust.email);
    setEditWebPhone(webCust.phone);
    setEditWebTier(webCust.tier);
    setEditWebStatus(webCust.status);
    setEditWebBranch(webCust.preferredBranch);
    setEditWebPoints(webCust.pointsBalance.toString());
    setIsWebEditModalOpen(true);
  };

  const handleSaveWebEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setWebCust((prev) => ({
      ...prev,
      name: editWebName,
      email: editWebEmail,
      phone: editWebPhone,
      tier: editWebTier,
      status: editWebStatus,
      preferredBranch: editWebBranch,
      pointsBalance: parseInt(editWebPoints, 10) || prev.pointsBalance
    }));
    setIsWebEditModalOpen(false);
  };

  const filteredPurchases = webCust.purchaseHistory.filter(
    (order) =>
      order.itemName.toLowerCase().includes(webPurchaseSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(webPurchaseSearch.toLowerCase()) ||
      order.branch.toLowerCase().includes(webPurchaseSearch.toLowerCase())
  );

  // =========================================================================
  // TABLET STATE & LOGIC (d:\New folder (3)\UI - iPad Pro)
  // =========================================================================
  const initialTabletCust =
    INITIAL_TABLET_CUSTOMERS.find((c) => c.id === targetId || c.customerId === targetId) ||
    INITIAL_TABLET_CUSTOMERS[0];

  const [cust, setCust] = useState<TabletCustomerItem>(initialTabletCust);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'campaigns' | 'activity' | 'wallet'>('overview');
  const [campaignFilter, setCampaignFilter] = useState<'All' | 'Available' | 'Locked' | 'Used' | 'Expired'>('All');
  const [activitySubFilter, setActivitySubFilter] = useState<'All' | 'Visits' | 'Orders' | 'Campaigns' | 'Rewards'>('All');

  const [selectedCampaign, setSelectedCampaign] = useState<TabletCustomerCampaign | null>(null);
  const [isGiftPointsModalOpen, setIsGiftPointsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Gift points form state
  const [giftPointsAmount, setGiftPointsAmount] = useState('200');
  const [giftReason, setGiftReason] = useState('Birthday Gift');
  const [giftNote, setGiftNote] = useState('Thank you for being a loyal customer!');

  const handleGiftPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pointsNum = parseInt(giftPointsAmount, 10) || 0;
    const newTx: TabletCustomerWalletTx = {
      id: `tx-gift-${Date.now()}`,
      title: 'Gifted Reward Points',
      subtitle: `By Merchant (${giftReason}) • Today`,
      value: `+${pointsNum} pts`,
      isPositive: true,
      type: 'points'
    };

    setCust((prev) => ({
      ...prev,
      points: prev.points + pointsNum,
      walletTransactions: [newTx, ...prev.walletTransactions]
    }));
    setIsGiftPointsModalOpen(false);
  };

  // Tier Badge Renderer for Web
  const renderWebTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
            <span>💎</span> Platinum
          </span>
        );
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]">
            <span>👑</span> Gold
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
            <span>🥈</span> Silver
          </span>
        );
      case 'Bronze':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]/60">
            <span>🎖</span> Bronze
          </span>
        );
    }
  };

  // Tier Badge Renderer for Tablet
  const renderTabletTierBadge = (tier: string) => {
    switch (tier) {
      case 'VVIP':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF5FF] text-[#7C3AED] border border-[#DDD6FE]">
            VVIP
          </span>
        );
      case 'VIP':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#E11D48] border border-[#FECDD3]">
            VIP
          </span>
        );
      case 'Gold':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]">
            Gold
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
            Silver
          </span>
        );
      case 'Bronze':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]">
            Bronze
          </span>
        );
    }
  };

  // =========================================================================
  // RENDER: WEB DESKTOP CUSTOMER DETAILS (Frame 629069.png / media_1793882598220_59c5d257.jpg)
  // =========================================================================
  if (!isTablet) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pb-16 font-sans text-[#1A1615]">
        {/* Main Web Header */}
        <div className="bg-white border-b border-[#EAE6E1] px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/customerlist' as any)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C877D] hover:text-[#1A1615] transition-colors cursor-pointer mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Directory</span>
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-2xl font-bold text-[#1A1615] tracking-tight">
                  Customer Details
                </h1>
                <span className="text-[#A855F7] text-lg font-bold">✦</span>
              </div>
              <p className="text-xs text-[#8C877D] mt-0.5">
                View customer profile, purchase history, loyalty activity and active offers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenWebEditModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D124D] text-white text-sm font-semibold hover:bg-[#3B1864] transition-all shadow-sm cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-white" />
                <span>Edit Customer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 pt-6 space-y-6">
          {/* Top Row: Customer Profile Card + Customer Overview Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F3F4F6] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={webCust.avatar}
                    alt={webCust.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-[#1A1615] tracking-tight truncate">
                        {webCust.name}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        {webCust.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#8C877D] mt-0.5">
                      <span className="font-semibold text-gray-700">{webCust.memberId}</span>
                      <span className="mx-1.5">|</span>
                      <span>Member Since {webCust.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#8C877D]" />
                        <span>{webCust.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#8C877D]" />
                        <span className="truncate max-w-[150px]">{webCust.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="bg-[#FAF8F5] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-[#CA8A04]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8C877D] font-medium">Points Balance</div>
                    <div className="text-base font-bold text-[#1A1615]">{webCust.pointsBalance}</div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#8C877D] font-medium">Branch</div>
                    <div className="text-xs font-bold text-[#1A1615] truncate">{webCust.preferredBranch}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Customer Overview Stats (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F3F4F6] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#1A1615]">Customer Overview</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-gray-200">
                  <span>Last 6 Months</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#1A1615]">₹{webCust.totalSpend.toLocaleString()}</div>
                    <div className="text-xs text-[#8C877D] font-medium">Total Spend</div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#1A1615]">{webCust.totalOrders}</div>
                    <div className="text-xs text-[#8C877D] font-medium">Total Orders</div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-[#CA8A04]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#1A1615]">{webCust.pointsBalance}</div>
                    <div className="text-xs text-[#8C877D] font-medium">Points Balance</div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#1A1615]">{webCust.offersUsed}</div>
                    <div className="text-xs text-[#8C877D] font-medium">Offers Used</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active & Expired Offers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1A1615]">Active Offers</h3>
                  <span className="text-xs text-gray-500 font-semibold">({webCust.activeOffers.length})</span>
                </div>
                <button className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {webCust.activeOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-gray-100 rounded-xl p-3 bg-white hover:border-[#7C3AED]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-24 object-cover rounded-lg mb-2.5"
                      />
                      <h4 className="text-xs font-bold text-[#1A1615] truncate">{offer.title}</h4>
                      <p className="text-[11px] text-[#8C877D] mt-0.5 truncate">{offer.subtitle}</p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-gray-50">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7C3AED] bg-[#FAF5FF] px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3" />
                        {offer.validity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1A1615]">Expired Offers</h3>
                  <span className="text-xs text-gray-500 font-semibold">({webCust.expiredOffers.length})</span>
                </div>
              </div>

              <div className="space-y-3">
                {webCust.expiredOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-xl opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-12 h-12 rounded-lg object-cover grayscale shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1A1615] truncate">{offer.title}</h4>
                      <p className="text-[11px] text-[#8C877D] truncate">{offer.subtitle}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{offer.validity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#1A1615]">Purchase History</h3>
                <p className="text-xs text-[#8C877D] mt-0.5">Recent purchases and points earned by customer.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={webPurchaseSearch}
                  onChange={(e) => setWebPurchaseSearch(e.target.value)}
                  placeholder="Search orders by item or ID..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-[#8C877D] uppercase tracking-wider">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Branch</th>
                    <th className="py-3 px-3">Date &amp; Time</th>
                    <th className="py-3 px-3">Items Purchased</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3 text-right">Points Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredPurchases.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[#1A1615]">{order.id}</td>
                      <td className="py-3.5 px-3 text-[#6E6A66]">{order.branch}</td>
                      <td className="py-3.5 px-3 text-[#6E6A66]">{order.dateTime}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.itemImage}
                            alt={order.itemName}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                          />
                          <div>
                            <div className="font-semibold text-[#1A1615]">{order.itemName}</div>
                            <div className="text-[10px] text-[#8C877D]">{order.itemCategory}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#1A1615]">₹{order.amount}</td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-gray-200 text-[11px] font-medium text-gray-700">
                          {order.paymentMethod === 'Card' ? (
                            <CreditCard className="w-3 h-3 text-[#7C3AED]" />
                          ) : (
                            <QrCode className="w-3 h-3 text-[#059669]" />
                          )}
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#10B981]">+{order.pointsEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100">
              <button
                onClick={() => onNavigate('/customerlist' as any)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#EAE6E1] bg-white rounded-xl text-xs font-semibold text-[#6E6A66] hover:bg-[#FAF8F5] hover:text-[#1A1615] transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Customer Directory</span>
              </button>
            </div>
          </div>
        </div>

        {/* WEB EDIT CUSTOMER MODAL (z-[100] covers sticky header completely) */}
        {isWebEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#7C3AED]" />
                  <h3 className="text-base font-bold text-[#1A1615]">Edit Customer Profile</h3>
                </div>
                <button
                  onClick={() => setIsWebEditModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWebEdit} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editWebName}
                    onChange={(e) => setEditWebName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editWebPhone}
                      onChange={(e) => setEditWebPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editWebEmail}
                      onChange={(e) => setEditWebEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tier</label>
                    <select
                      value={editWebTier}
                      onChange={(e) => setEditWebTier(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Status</label>
                    <select
                      value={editWebStatus}
                      onChange={(e) => setEditWebStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Preferred Branch</label>
                    <input
                      type="text"
                      value={editWebBranch}
                      onChange={(e) => setEditWebBranch(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Points Balance</label>
                    <input
                      type="number"
                      value={editWebPoints}
                      onChange={(e) => setEditWebPoints(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsWebEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2D124D] text-white rounded-xl text-xs font-bold hover:bg-[#3B1864] cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER: TABLET CUSTOMER DETAILS (iPad Pro Flow from d:\New folder (3)\UI)
  // =========================================================================
  const filteredCampaigns = cust.campaigns.filter((c) => {
    if (campaignFilter === 'All') return true;
    return c.status.toLowerCase() === campaignFilter.toLowerCase();
  });

  const filteredActivity = cust.activities.filter((a) => {
    if (activitySubFilter === 'All') return true;
    if (activitySubFilter === 'Visits') return a.title.toLowerCase().includes('visit');
    if (activitySubFilter === 'Orders') return a.title.toLowerCase().includes('bill') || a.title.toLowerCase().includes('order');
    if (activitySubFilter === 'Campaigns') return a.title.toLowerCase().includes('campaign') || a.title.toLowerCase().includes('redeemed');
    if (activitySubFilter === 'Rewards') return a.title.toLowerCase().includes('reward') || a.title.toLowerCase().includes('points');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBF9FD] pb-24 font-sans text-[#1A1615]">
      {/* Top Tablet Navigation Bar */}
      <div className="bg-white border-b border-[#F1EFEA] px-5 lg:px-8 py-3.5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/customerlist' as any)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6E6A66] hover:text-[#1A1615] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Profile Body */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-5 space-y-5">
        {/* Hero Profile Header (Matching iPad Pro 12.9_ - 66.png) */}
        <div className="bg-white rounded-3xl border border-[#F1EFEA] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={cust.avatar}
                alt={cust.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#2D124D] text-white flex items-center justify-center shadow-xs cursor-pointer"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-[#1A1615] tracking-tight">
                  {cust.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#E11D48] border border-[#FECDD3]">
                  👑 {cust.tier} Member
                </span>
              </div>

              <div className="flex items-center gap-4 mt-1.5 text-xs text-[#6B7280] flex-wrap">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cust.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cust.email}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#9CA3AF] mt-1.5 flex items-center gap-3">
                <span>Member since {cust.memberSince}</span>
                <span>•</span>
                <span>Customer ID: <strong className="text-gray-700">{cust.customerId}</strong></span>
              </div>
            </div>
          </div>

          {/* Note Box */}
          <div className="md:max-w-xs w-full bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-3.5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                {cust.note}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Tablet Metric Cards (Matching iPad Pro 12.9_ - 66.png) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Visits</div>
              <div className="text-2xl font-black text-[#1A1615] mt-1">{cust.visits}</div>
              <div className="text-[11px] text-gray-400 mt-1">Last: {cust.lastVisit}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Lifetime Spend</div>
              <div className="text-2xl font-black text-[#1A1615] mt-1">₹{cust.lifetimeSpend.toLocaleString()}</div>
              <div className="text-[11px] text-gray-400 mt-1">Avg: ₹{cust.avgBillValue} / order</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Reward Points</div>
              <div className="text-2xl font-black text-[#1A1615] mt-1">{cust.points.toLocaleString()}</div>
              <div className="text-[11px] text-[#059669] font-medium mt-1">Worth ₹{(cust.points * 0.25).toFixed(0)} value</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-[#CA8A04]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Wallet Balance</div>
              <div className="text-2xl font-black text-[#1A1615] mt-1">₹{cust.cashback}</div>
              <div className="text-[11px] text-gray-400 mt-1">Instant redeemable</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 4 Tabs Navigation (Overview, Campaigns, Activity, Wallet) */}
        <div className="flex items-center gap-2 border-b border-gray-200/80 pb-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'campaigns', label: `Campaigns (${cust.campaigns.length})` },
            { id: 'activity', label: 'Activity' },
            { id: 'wallet', label: 'Wallet & Points' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeProfileTab === tab.id
                  ? 'bg-[#2D124D] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-[#F1EFEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeProfileTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8 space-y-5">
              <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#1A1615]">Recent Orders</h3>
                  <button
                    onClick={() => setActiveProfileTab('activity')}
                    className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {cust.activities
                    .filter((a) => a.type === 'order')
                    .map((o) => (
                      <div key={o.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs shrink-0">
                            <Receipt className="w-4 h-4 text-[#7C3AED]" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A1615]">{o.title}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{o.subtitle}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-[#1A1615]">{o.value}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-5">
              <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs">
                <h3 className="text-sm font-black text-[#1A1615] mb-3">Customer Actions</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsGiftPointsModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7C3AED] transition-colors font-bold text-xs cursor-pointer border border-[#E9D5FF]"
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      <span>Gift Points / Reward</span>
                    </div>
                    <span>&rarr;</span>
                  </button>
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 transition-colors font-bold text-xs cursor-pointer border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Customer Profile</span>
                    </div>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPAIGNS */}
        {activeProfileTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Available', 'Locked', 'Used', 'Expired'].map((f) => (
                <button
                  key={f}
                  onClick={() => setCampaignFilter(f as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    campaignFilter === f
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'bg-white text-gray-600 border border-[#F1EFEA]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className="bg-white rounded-3xl border border-[#F1EFEA] p-4 shadow-2xs hover:border-[#7C3AED]/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <img src={camp.image} alt={camp.title} className="w-full h-32 object-cover rounded-2xl mb-3" />
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-[#1A1615] truncate">{camp.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5FF] text-[#7C3AED]">
                        {camp.tag || camp.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{camp.desc}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">{camp.validity}</span>
                    <span className="font-bold text-[#7C3AED]">View offer &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY */}
        {activeProfileTab === 'activity' && (
          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Visits', 'Orders', 'Campaigns', 'Rewards'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActivitySubFilter(f as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activitySubFilter === f
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-gray-600 border border-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="divide-y divide-gray-100">
              {filteredActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-[#1A1615]">{act.title}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{act.subtitle}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#059669]">{act.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WALLET */}
        {activeProfileTab === 'wallet' && (
          <div className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-[#1A1615]">Wallet &amp; Points Ledger</h3>
            <div className="divide-y divide-gray-100">
              {cust.walletTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-[#1A1615]">{tx.title}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{tx.subtitle}</div>
                  </div>
                  <div className={`text-sm font-black ${tx.isPositive ? 'text-[#059669]' : 'text-[#EF4444]'}`}>
                    {tx.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GIFT POINTS MODAL (z-[100] covers sticky header completely) */}
      {isGiftPointsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative my-auto border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="text-base font-bold text-[#1A1615]">Gift Reward Points</h3>
              </div>
              <button
                onClick={() => setIsGiftPointsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGiftPointsSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Points to Gift</label>
                <input
                  type="number"
                  value={giftPointsAmount}
                  onChange={(e) => setGiftPointsAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason</label>
                <select
                  value={giftReason}
                  onChange={(e) => setGiftReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                >
                  <option value="Birthday Gift">Birthday Gift</option>
                  <option value="Apology Credit">Apology Credit</option>
                  <option value="VIP Appreciation">VIP Appreciation</option>
                  <option value="Custom Incentive">Custom Incentive</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Personal Note</label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsGiftPointsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D124D] text-white rounded-xl text-xs font-bold hover:bg-[#3B1864] cursor-pointer shadow-xs"
                >
                  Gift Points Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAMPAIGN DETAIL MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FAF5FF] text-[#7C3AED]">
                {selectedCampaign.tag || selectedCampaign.status}
              </span>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-3">
              <img
                src={selectedCampaign.image}
                alt={selectedCampaign.title}
                className="w-full h-40 object-cover rounded-2xl"
              />
              <div>
                <h3 className="text-base font-extrabold text-[#1A1615]">{selectedCampaign.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{selectedCampaign.desc}</p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-gray-100 text-xs">
                <div>
                  <div className="text-gray-400 font-medium">Valid until</div>
                  <div className="font-bold text-gray-800 mt-0.5">{selectedCampaign.validity}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Redemption status</div>
                  <div className="font-bold text-[#7C3AED] mt-0.5 capitalize">{selectedCampaign.status}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('Applied discount offer to current bill queue!');
                    setSelectedCampaign(null);
                  }}
                  className="px-5 py-2 bg-[#2D124D] text-white rounded-xl text-xs font-bold hover:bg-[#3B1864] cursor-pointer shadow-xs"
                >
                  Apply to Current Bill →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1A1615]">Edit Profile &amp; Notes</h3>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditProfileModalOpen(false);
              }}
              className="space-y-4 pt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Customer Note</label>
                <textarea
                  rows={3}
                  defaultValue={cust.note}
                  onChange={(e) => {
                    cust.note = e.target.value;
                  }}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    defaultValue={cust.phone}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tier</label>
                  <select
                    defaultValue={cust.tier}
                    onChange={(e) => {
                      cust.tier = e.target.value as any;
                    }}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:bg-white focus:border-[#7C3AED] outline-none"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D124D] text-white rounded-xl text-xs font-bold hover:bg-[#3B1864] cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
