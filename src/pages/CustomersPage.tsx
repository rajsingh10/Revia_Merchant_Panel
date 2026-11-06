import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  BarChart2,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
  UserCheck,
  UserPlus,
  Star,
  Phone,
  Mail,
  Store,
  Calendar,
  Filter,
  ArrowLeft,
  ShoppingBag,
  Layers,
  Tag,
  CreditCard,
  QrCode,
  Edit2,
  X,
  Check,
  Clock,
  Gift,
  FileText,
  Lock,
  Receipt,
  MessageSquare,
  Ban,
  Download,
  Send,
  Laptop,
  Tablet
} from 'lucide-react';
import { Customer } from '../types';
import { INITIAL_WEB_CUSTOMERS, WebCustomerItem } from '../data/customersWebData';
import {
  INITIAL_TABLET_CUSTOMERS,
  TabletCustomerItem,
  TabletCustomerCampaign
} from '../data/customerTabletData';

interface CustomersPageProps {
  customers?: Customer[];
  onUpdateCustomer?: (updated: Customer) => void;
  onAddCustomer?: (newCust: Customer) => void;
  onViewCustomer?: (id: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  onViewCustomer
}) => {
  // Device mode switcher: automatically 'web' for Desktop and 'tablet' for Tablet screens
  const [deviceView, setDeviceView] = useState<'web' | 'tablet'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'tablet' || params.get('device') === 'tablet') {
        return 'tablet';
      }
      return window.innerWidth < 1024 ? 'tablet' : 'web';
    }
    return 'web';
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('view') && !params.get('device')) {
        setDeviceView(window.innerWidth < 1024 ? 'tablet' : 'web');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Customer selection for Details view
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // =========================================================================
  // WEB STATE (Desktop Table Flow from Frame 629069.png)
  // =========================================================================
  const [webCustomerList, setWebCustomerList] = useState<WebCustomerItem[]>(INITIAL_WEB_CUSTOMERS);
  const [webSearchQuery, setWebSearchQuery] = useState('');
  const [webTierFilter, setWebTierFilter] = useState<'All' | 'Gold' | 'Silver' | 'Platinum' | 'Bronze'>('All');
  const [webStatusFilter, setWebStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [webBranchFilter, setWebBranchFilter] = useState<string>('All');
  const [webCurrentPage, setWebCurrentPage] = useState(1);
  const webItemsPerPage = 5;

  const [isWebAddModalOpen, setIsWebAddModalOpen] = useState(false);
  const [isWebEditModalOpen, setIsWebEditModalOpen] = useState(false);
  const [webMenuOpenId, setWebMenuOpenId] = useState<string | null>(null);

  // Web Add Customer Form
  const [newWebName, setNewWebName] = useState('');
  const [newWebEmail, setNewWebEmail] = useState('');
  const [newWebPhone, setNewWebPhone] = useState('');
  const [newWebTier, setNewWebTier] = useState<'Gold' | 'Silver' | 'Platinum' | 'Bronze'>('Bronze');
  const [newWebBranch, setNewWebBranch] = useState('Connaught Place');
  const [newWebPoints, setNewWebPoints] = useState('100');

  // Web Edit Customer Form
  const [editWebName, setEditWebName] = useState('');
  const [editWebEmail, setEditWebEmail] = useState('');
  const [editWebPhone, setEditWebPhone] = useState('');
  const [editWebTier, setEditWebTier] = useState<'Gold' | 'Silver' | 'Platinum' | 'Bronze'>('Gold');
  const [editWebStatus, setEditWebStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editWebBranch, setEditWebBranch] = useState('Connaught Place');
  const [editWebPoints, setEditWebPoints] = useState('850');

  const [webPurchaseSearch, setWebPurchaseSearch] = useState('');

  // =========================================================================
  // TABLET STATE (iPad Pro Flow from d:\New folder (3)\UI)
  // =========================================================================
  const [tabletCustomers, setTabletCustomers] = useState<TabletCustomerItem[]>(INITIAL_TABLET_CUSTOMERS);
  const [tabletSearchQuery, setTabletSearchQuery] = useState('');
  const [tabletTierFilter, setTabletTierFilter] = useState<'All' | 'VVIP' | 'VIP' | 'Gold' | 'Silver' | 'Bronze'>('All');
  const [tabletBranchFilter, setTabletBranchFilter] = useState('All Branches');
  const [activeTabletProfileTab, setActiveTabletProfileTab] = useState<'overview' | 'campaigns' | 'activity' | 'wallet'>('overview');
  const [tabletCampaignFilter, setTabletCampaignFilter] = useState<'All' | 'Available' | 'Locked' | 'Used' | 'Expired'>('All');
  const [tabletActivityFilter, setTabletActivityFilter] = useState<'All' | 'Visits' | 'Orders' | 'Campaigns' | 'Rewards'>('All');
  const [selectedTabletCampaign, setSelectedTabletCampaign] = useState<TabletCustomerCampaign | null>(null);
  const [isTabletGiftPointsModalOpen, setIsTabletGiftPointsModalOpen] = useState(false);
  const [isTabletEditProfileModalOpen, setIsTabletEditProfileModalOpen] = useState(false);
  const [giftPointsAmount, setGiftPointsAmount] = useState('200');
  const [giftReason, setGiftReason] = useState('Birthday Gift');
  const [giftNote, setGiftNote] = useState('Thank you for being a loyal customer!');

  // Selected Customer Resolvers
  const selectedWebCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return (
      webCustomerList.find((c) => c.id === selectedCustomerId || c.memberId === selectedCustomerId) ||
      webCustomerList[0]
    );
  }, [webCustomerList, selectedCustomerId]);

  const selectedTabletCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return (
      tabletCustomers.find((c) => c.id === selectedCustomerId || c.customerId === selectedCustomerId) ||
      tabletCustomers[0]
    );
  }, [tabletCustomers, selectedCustomerId]);

  // Filtered Web Customers
  const filteredWebCustomers = useMemo(() => {
    return webCustomerList.filter((c) => {
      const q = webSearchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.memberId.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesTier = webTierFilter === 'All' || c.tier === webTierFilter;
      const matchesStatus = webStatusFilter === 'All' || c.status === webStatusFilter;
      const matchesBranch =
        webBranchFilter === 'All' || c.preferredBranch.toLowerCase().includes(webBranchFilter.toLowerCase());

      return matchesSearch && matchesTier && matchesStatus && matchesBranch;
    });
  }, [webCustomerList, webSearchQuery, webTierFilter, webStatusFilter, webBranchFilter]);

  const webTotalPages = Math.ceil(filteredWebCustomers.length / webItemsPerPage) || 1;
  const paginatedWebCustomers = filteredWebCustomers.slice(
    (webCurrentPage - 1) * webItemsPerPage,
    webCurrentPage * webItemsPerPage
  );

  // Filtered Tablet Customers
  const filteredTabletCustomers = useMemo(() => {
    return tabletCustomers.filter((c) => {
      const q = tabletSearchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.customerId.toLowerCase().includes(q);

      const matchesTier = tabletTierFilter === 'All' || c.tier === tabletTierFilter;
      const matchesBranch =
        tabletBranchFilter === 'All Branches' ||
        c.preferredBranch.toLowerCase().includes(tabletBranchFilter.toLowerCase());

      return matchesSearch && matchesTier && matchesBranch;
    });
  }, [tabletCustomers, tabletSearchQuery, tabletTierFilter, tabletBranchFilter]);

  // Handle View Details
  const handleViewCustomer = (id: string) => {
    setSelectedCustomerId(id);
    if (onViewCustomer) onViewCustomer(id);
  };

  // Open Web Edit Modal
  const handleOpenWebEditModal = (cust: WebCustomerItem) => {
    setEditWebName(cust.name);
    setEditWebEmail(cust.email);
    setEditWebPhone(cust.phone);
    setEditWebTier(cust.tier);
    setEditWebStatus(cust.status);
    setEditWebBranch(cust.preferredBranch);
    setEditWebPoints(cust.pointsBalance.toString());
    setIsWebEditModalOpen(true);
    setWebMenuOpenId(null);
  };

  // Save Web Edit
  const handleSaveWebEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebCustomer) return;

    const updated: WebCustomerItem = {
      ...selectedWebCustomer,
      name: editWebName,
      email: editWebEmail,
      phone: editWebPhone,
      tier: editWebTier,
      status: editWebStatus,
      preferredBranch: editWebBranch,
      pointsBalance: parseInt(editWebPoints, 10) || selectedWebCustomer.pointsBalance
    };

    setWebCustomerList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setIsWebEditModalOpen(false);
  };

  // Create Web Customer
  const handleCreateWebCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebName.trim()) return;

    const initials = newWebName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newCust: WebCustomerItem = {
      id: `cust-${Date.now()}`,
      name: newWebName,
      email: newWebEmail || `${newWebName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newWebPhone || '98765 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      initials: initials || 'CU',
      avatarBg: 'bg-[#EDE9FE]',
      avatarColor: 'text-[#7C3AED]',
      memberId: `LC${Math.floor(10000 + Math.random() * 90000)}`,
      memberSince: 'Today',
      tier: newWebTier,
      status: 'Active',
      offersUsed: 0,
      pointsBalance: parseInt(newWebPoints, 10) || 100,
      preferredBranch: newWebBranch,
      totalSpend: 0,
      totalOrders: 0,
      activeOffers: [],
      expiredOffers: [],
      purchaseHistory: []
    };

    setWebCustomerList((prev) => [newCust, ...prev]);
    setIsWebAddModalOpen(false);
    setNewWebName('');
    setNewWebEmail('');
    setNewWebPhone('');
  };

  // Tier Badge Renderer for Web
  const renderWebTierBadge = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]/60">
            <span>👑</span> Gold
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]/60">
            <span>⭐</span> Silver
          </span>
        );
      case 'Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF5FF] text-[#7E22CE] border border-[#D8B4FE]/60">
            <span>✨</span> Platinum
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

  /* =========================================================================
     VIEW: CUSTOMER DETAILS (Web or Tablet Mode)
     ========================================================================= */
  if (selectedCustomerId) {
    // -----------------------------------------------------------------------
    // 1. WEB CUSTOMER DETAILS (Desktop UI matching Frame 629069.png)
    // -----------------------------------------------------------------------
    if (deviceView === 'web' && selectedWebCustomer) {
      const cust = selectedWebCustomer;
      const filteredPurchases = cust.purchaseHistory.filter(
        (order) =>
          order.itemName.toLowerCase().includes(webPurchaseSearch.toLowerCase()) ||
          order.id.toLowerCase().includes(webPurchaseSearch.toLowerCase()) ||
          order.branch.toLowerCase().includes(webPurchaseSearch.toLowerCase())
      );

      return (
        <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="hover:text-[#1E1548] cursor-pointer transition-colors"
              >
                Customer Directory
              </button>
              <span>&gt;</span>
              <span className="text-[#1E1548] font-bold">Customer Details</span>
            </div>

            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
                  Customer Details
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                  View customer profile, purchase history, loyalty activity and active offers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Switcher */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-2xs">
                  <button
                    onClick={() => setDeviceView('web')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#5844A8] text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Web UI</span>
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet UI</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenWebEditModal(cust)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5844A8] text-white text-xs font-bold hover:bg-[#47368E] transition-all shadow-md shadow-[#5844A8]/20 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                  <span>Edit Customer</span>
                </button>
              </div>
            </div>

            {/* Top Row: Customer Profile Card + Customer Overview Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-purple-50 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={cust.avatar}
                      alt={cust.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-[#1E1548] tracking-tight truncate">
                          {cust.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {cust.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        <span className="font-semibold text-gray-700">{cust.memberId}</span>
                        <span className="mx-1.5">|</span>
                        <span>Member Since {cust.memberSince}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{cust.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate max-w-[150px]">{cust.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-semibold">Points Balance</div>
                      <div className="text-base font-black text-[#1E1548]">{cust.pointsBalance}</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-400 font-semibold">Branch</div>
                      <div className="text-xs font-bold text-[#1E1548] truncate">{cust.preferredBranch}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Customer Overview Stats (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-[#1E1548]">Customer Overview</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1548] bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                    <span>Last 6 Months</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[#1E1548]">₹{cust.totalSpend.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 font-semibold">Total Spend</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[#1E1548]">{cust.totalOrders}</div>
                      <div className="text-xs text-gray-400 font-semibold">Total Orders</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[#1E1548]">{cust.pointsBalance}</div>
                      <div className="text-xs text-gray-400 font-semibold">Points Balance</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8FF] border border-purple-50 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[#1E1548]">{cust.offersUsed}</div>
                      <div className="text-xs text-gray-400 font-semibold">Offers Used</div>
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
                    <span className="text-xs text-gray-500 font-semibold">({cust.activeOffers.length})</span>
                  </div>
                  <button className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cust.activeOffers.map((offer) => (
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
                    <span className="text-xs text-gray-500 font-semibold">({cust.expiredOffers.length})</span>
                  </div>
                  <button className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cust.expiredOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="border border-gray-100 rounded-xl p-3 bg-white opacity-85 hover:opacity-100 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-24 object-cover rounded-lg mb-2.5 grayscale-[30%]"
                        />
                        <h4 className="text-xs font-bold text-[#1A1615] truncate">{offer.title}</h4>
                        <p className="text-[11px] text-[#8C877D] mt-0.5 truncate">{offer.subtitle}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-gray-50">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#EF4444] bg-[#FFF1F2] px-2 py-0.5 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {offer.validity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1615]">Purchase History</h3>
                    <p className="text-xs text-[#8C877D]">View all orders and transactions made by this customer.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={webPurchaseSearch}
                      onChange={(e) => setWebPurchaseSearch(e.target.value)}
                      placeholder="Search by order ID or item..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[#5844A8] w-[220px] text-[#1E1548] font-semibold"
                    />
                  </div>

                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <span>Filter</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1548] bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                    <span>Last 6 Months</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/60">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Branch</th>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Items</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Payment Method</th>
                      <th className="py-3 px-3 text-right">Points Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredPurchases.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF8FF]/60 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-[#1E1548]">{order.id}</td>
                        <td className="py-3.5 px-3 text-gray-600">{order.branch}</td>
                        <td className="py-3.5 px-3 text-gray-600">{order.dateTime}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={order.itemImage}
                              alt={order.itemName}
                              className="w-8 h-8 rounded-lg object-cover border border-purple-50"
                            />
                            <div>
                              <div className="font-bold text-[#1E1548]">{order.itemName}</div>
                              <div className="text-[10px] text-gray-400">{order.itemCategory}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#1E1548]">₹{order.amount}</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-bold text-[#5844A8]">
                            {order.paymentMethod === 'Card' ? (
                              <CreditCard className="w-3 h-3 text-[#5844A8]" />
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
                  onClick={() => setSelectedCustomerId(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1E1548] transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Customer Directory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // 2. TABLET CUSTOMER DETAILS (iPad UI from d:\New folder (3)\UI)
    // -----------------------------------------------------------------------
    if (selectedTabletCustomer) {
      const cust = selectedTabletCustomer;

      return (
        <div className="min-h-screen bg-[#FAF8FF] pb-24 font-sans text-[#1A1615]">
          <div className="bg-white border-b border-gray-100 px-5 lg:px-8 py-3.5">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#1E1548] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center">
                  <button
                    onClick={() => setDeviceView('web')}
                    className="px-2 py-1 rounded-lg text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Web UI
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-[#2D124D] text-white cursor-pointer"
                  >
                    Tablet UI
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-5 space-y-5">
            <div className="bg-white rounded-3xl border border-[#F1EFEA] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-extrabold text-[#1A1615] tracking-tight">{cust.name}</h1>
                    {renderTabletTierBadge(cust.tier)}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-[#6B7280]">
                    <span>{cust.phone}</span>
                    <span>•</span>
                    <span>{cust.email}</span>
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] mt-1.5">
                    Member since {cust.memberSince} • Customer ID: <strong>{cust.customerId}</strong>
                  </div>
                </div>
              </div>

              <div className="md:max-w-xs w-full bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-3.5 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">{cust.note}</p>
              </div>
            </div>

            {/* Segment Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['overview', 'campaigns', 'activity', 'wallet'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTabletProfileTab(t)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer ${
                    activeTabletProfileTab === t
                      ? 'bg-[#2D124D] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tablet Content */}
            {activeTabletProfileTab === 'overview' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl border border-[#F1EFEA] p-4 shadow-2xs">
                  <div className="text-xs text-gray-400 font-semibold">Total Visits</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{cust.visits}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#F1EFEA] p-4 shadow-2xs">
                  <div className="text-xs text-gray-400 font-semibold">Lifetime Spend</div>
                  <div className="text-xl font-black text-gray-900 mt-1">₹{cust.lifetimeSpend.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#F1EFEA] p-4 shadow-2xs">
                  <div className="text-xs text-gray-400 font-semibold">Reward Points</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{cust.points} pts</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#F1EFEA] p-4 shadow-2xs">
                  <div className="text-xs text-gray-400 font-semibold">Cashback</div>
                  <div className="text-xl font-black text-gray-900 mt-1">₹{cust.cashback}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  /* =========================================================================
     VIEW: DIRECTORY (DEFAULT TO WEB DESKTOP UI, WITH TABLET UI OPTION)
     ========================================================================= */
  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span>Home</span>
          <span>&gt;</span>
          <span className="text-[#1E1548] font-bold">Customer Directory</span>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
              Customer Directory
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              View and manage your customers, their visits, purchases and loyalty activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Customer Button */}
            <button
              onClick={() => setIsWebAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5844A8]/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Add Customer</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. WEB DESKTOP FLOW */}
        {/* ========================================================================= */}
        {deviceView === 'web' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 4 Metric KPI Cards with Sparklines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span>&uarr; 12%</span>
                      <span className="text-[10px] text-gray-400 font-normal">vs last month</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold text-gray-400">Total Customers</div>
                    <div className="text-3xl font-black text-[#1E1548] mt-0.5">1,248</div>
                  </div>
                </div>
                <div className="mt-3 h-8 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M 0,22 Q 25,8 50,20 T 100,12" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span>&uarr; 8%</span>
                      <span className="text-[10px] text-gray-400 font-normal">vs last month</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold text-gray-400">Active Customers</div>
                    <div className="text-3xl font-black text-[#1E1548] mt-0.5">892</div>
                  </div>
                </div>
                <div className="mt-3 h-8 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M 0,20 Q 25,28 50,15 T 100,18" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span>&uarr; 16%</span>
                      <span className="text-[10px] text-gray-400 font-normal">vs last month</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold text-gray-400">New Customers (This Month)</div>
                    <div className="text-3xl font-black text-[#1E1548] mt-0.5">120</div>
                  </div>
                </div>
                <div className="mt-3 h-8 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M 0,22 Q 35,22 65,10 T 100,18" fill="none" stroke="#FB7185" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span>&uarr; 20%</span>
                      <span className="text-[10px] text-gray-400 font-normal">vs last month</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold text-gray-400">Highest Loyalty Tier</div>
                    <div className="text-3xl font-black text-[#1E1548] mt-0.5">318</div>
                  </div>
                </div>
                <div className="mt-3 h-8 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M 0,22 Q 30,10 65,24 T 100,14" fill="none" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar Container */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={webSearchQuery}
                    onChange={(e) => {
                      setWebSearchQuery(e.target.value);
                      setWebCurrentPage(1);
                    }}
                    placeholder="Search by name, phone number or member ID..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold text-[#1E1548] bg-white border border-gray-200 focus:outline-none focus:border-[#5844A8] rounded-xl transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="relative">
                    <select
                      value={webTierFilter}
                      onChange={(e) => {
                        setWebTierFilter(e.target.value as any);
                        setWebCurrentPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-[#1E1548] outline-none hover:border-[#5844A8] transition-colors cursor-pointer"
                    >
                      <option value="All">All Tiers</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Bronze">Bronze</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={webStatusFilter}
                      onChange={(e) => {
                        setWebStatusFilter(e.target.value as any);
                        setWebCurrentPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-[#1E1548] outline-none hover:border-[#5844A8] transition-colors cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={webBranchFilter}
                      onChange={(e) => {
                        setWebBranchFilter(e.target.value);
                        setWebCurrentPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-[#1E1548] outline-none hover:border-[#5844A8] transition-colors cursor-pointer"
                    >
                      <option value="All">All Branches</option>
                      <option value="Connaught Place">Connaught Place</option>
                      <option value="CP – Bakery">CP – Bakery</option>
                      <option value="Cyber Hub">Cyber Hub</option>
                      <option value="Indiranagar">Indiranagar</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] hover:border-[#5844A8] transition-colors cursor-pointer">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                    <span>Select Date</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-2" />
                  </div>
                </div>
              </div>

              {/* Desktop Customer Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Member ID</th>
                      <th className="py-3.5 px-4">Phone No.</th>
                      <th className="py-3.5 px-4">Tier</th>
                      <th className="py-3.5 px-4">Loyalty Status</th>
                      <th className="py-3.5 px-4 text-center">Offer Used</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {paginatedWebCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-[#FAF8FF]/60 transition-colors group cursor-pointer"
                        onClick={() => handleViewCustomer(cust.id)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${cust.avatarBg} ${cust.avatarColor} font-bold text-xs flex items-center justify-center shrink-0 border border-white shadow-xs`}
                            >
                              {cust.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                                {cust.name}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate">{cust.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#1E1548]">{cust.memberId}</td>
                        <td className="py-3.5 px-4 text-gray-600">{cust.phone}</td>
                        <td className="py-3.5 px-4">{renderWebTierBadge(cust.tier)}</td>
                        <td className="py-3.5 px-4">
                          {cust.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981]">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EF4444]">
                              <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#1E1548]">{cust.offersUsed}</td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5 text-gray-400">
                            <button
                              title="View Customer Details"
                              onClick={() => handleViewCustomer(cust.id)}
                              className="p-1.5 rounded-lg hover:text-[#5844A8] hover:bg-purple-50 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Customer Analytics"
                              onClick={() => handleViewCustomer(cust.id)}
                              className="p-1.5 rounded-lg hover:text-[#5844A8] hover:bg-purple-50 transition-colors cursor-pointer"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>
                            <button
                              title="More Options"
                              onClick={() => setWebMenuOpenId(webMenuOpenId === cust.id ? null : cust.id)}
                              className="p-1.5 rounded-lg hover:text-[#1E1548] hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                <div>
                  Showing <span className="font-semibold text-[#1E1548]">1–{paginatedWebCustomers.length}</span> of{' '}
                  <span className="font-semibold text-[#1E1548]">{filteredWebCustomers.length}</span> customers
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={webCurrentPage === 1}
                    onClick={() => setWebCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 cursor-pointer text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: webTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setWebCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                        webCurrentPage === page
                          ? 'bg-[#5844A8] text-white shadow-sm shadow-[#5844A8]/20'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={webCurrentPage === webTotalPages}
                    onClick={() => setWebCurrentPage((p) => Math.min(webTotalPages, p + 1))}
                    className="p-1.5 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 cursor-pointer text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TABLET FLOW (d:\New folder (3)\UI - iPad Pro 12.9_ - 65.png) */}
        {/* ========================================================================= */}
        {deviceView === 'tablet' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Tablet Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tabletSearchQuery}
                  onChange={(e) => setTabletSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, email or loyalty ID..."
                  className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-[#EAE6E1] focus:border-[#7C3AED] rounded-2xl outline-none shadow-2xs transition-all font-medium"
                />
              </div>
              <button
                type="button"
                className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Tablet Tier Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { label: 'All', count: '2,482' },
                { label: 'VVIP', count: '120' },
                { label: 'VIP', count: '310' },
                { label: 'Gold', count: '620' },
                { label: 'Silver', count: '820' },
                { label: 'Bronze', count: '612' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setTabletTierFilter(item.label as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    tabletTierFilter === item.label
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'bg-white text-gray-700 border border-[#EAE6E1] hover:bg-gray-50'
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>

            {/* Tablet 2-Column Customer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {filteredTabletCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => handleViewCustomer(cust.id)}
                  className="bg-white rounded-3xl border border-[#F1EFEA] p-5 shadow-2xs hover:border-[#7C3AED]/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${cust.avatarBg} ${cust.avatarColor} font-black text-sm flex items-center justify-center shrink-0 border-2 border-white shadow-2xs`}
                        >
                          {cust.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-[#1A1615]">{cust.name}</h3>
                            {renderTabletTierBadge(cust.tier)}
                          </div>
                          <div className="text-xs text-gray-400 font-medium mt-0.5">{cust.phone}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 shrink-0">
                        Last visit: {cust.lastVisit}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-gray-50 text-left">
                      <div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase">Visits</div>
                        <div className="text-sm font-black text-[#1A1615] mt-0.5">{cust.visits}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase">Lifetime Spend</div>
                        <div className="text-sm font-black text-[#1A1615] mt-0.5">₹{cust.lifetimeSpend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase">Points</div>
                        <div className="text-sm font-black text-[#1A1615] mt-0.5">{cust.points.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase">Cashback</div>
                        <div className="text-sm font-black text-[#1A1615] mt-0.5">₹{cust.cashback}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-gray-50 flex justify-end">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#2D124D]">
                      View Profile &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WEB ADD CUSTOMER MODAL */}
      {isWebAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-auto border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5844A8] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1E1548]">Add New Customer</h3>
              </div>
              <button
                onClick={() => setIsWebAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebCustomer} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sen"
                  value={newWebName}
                  onChange={(e) => setNewWebName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 98765 00000"
                    value={newWebPhone}
                    onChange={(e) => setNewWebPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ananya@example.com"
                    value={newWebEmail}
                    onChange={(e) => setNewWebEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1">Initial Tier</label>
                  <select
                    value={newWebTier}
                    onChange={(e) => setNewWebTier(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-bold cursor-pointer"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1">Initial Points</label>
                  <input
                    type="number"
                    value={newWebPoints}
                    onChange={(e) => setNewWebPoints(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1">Assigned Branch</label>
                <select
                  value={newWebBranch}
                  onChange={(e) => setNewWebBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-bold cursor-pointer"
                >
                  <option value="Connaught Place">Connaught Place</option>
                  <option value="CP – Bakery">CP – Bakery</option>
                  <option value="Cyber Hub">Cyber Hub</option>
                  <option value="Indiranagar">Indiranagar</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWebAddModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#5844A8]/20 transition-all"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WEB EDIT CUSTOMER MODAL */}
      {isWebEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto border border-purple-50">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5844A8] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1E1548]">Edit Customer Profile</h3>
              </div>
              <button
                onClick={() => setIsWebEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWebEdit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E1548] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editWebName}
                  onChange={(e) => setEditWebName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E1548] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editWebPhone}
                    onChange={(e) => setEditWebPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E1548] mb-1">Email</label>
                  <input
                    type="email"
                    value={editWebEmail}
                    onChange={(e) => setEditWebEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none text-[#1E1548] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E1548] mb-1">Tier</label>
                  <select
                    value={editWebTier}
                    onChange={(e) => setEditWebTier(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none cursor-pointer text-[#1E1548] font-bold"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1E1548] mb-1">Status</label>
                  <select
                    value={editWebStatus}
                    onChange={(e) => setEditWebStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#5844A8] outline-none cursor-pointer text-[#1E1548] font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWebEditModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#5844A8]/20 transition-all"
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
