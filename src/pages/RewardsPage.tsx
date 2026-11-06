import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Plus,
  Search,
  ChevronDown,
  Clock,
  QrCode,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  CreditCard,
  Settings,
  Lock,
  Wallet,
  Calendar,
  MoreVertical,
  Activity,
  ChevronRight,
  Target,
  Trophy
} from 'lucide-react';

export interface RewardRequest {
  id: string;
  customerName: string;
  rewardName: string;
  tier: string;
  branch: string;
  cost: string;
  timestamp: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Cancelled' | 'Fulfilled' | 'Expired';
  auditTrail: { action: string; by: string; date: string }[];
}

const mockRewardRequests: RewardRequest[] = [
  {
    id: 'REQ-8910',
    customerName: 'Elena Rostova',
    rewardName: 'Private Tasting Flight',
    tier: 'Obsidian VIP',
    branch: 'Downtown Flagship',
    cost: '12 Stamps',
    timestamp: '2 mins ago',
    status: 'Pending',
    auditTrail: [{ action: 'Request Submitted', by: 'Customer App', date: '2024-10-24 14:30' }]
  },
  {
    id: 'REQ-8909',
    customerName: 'Marcus Vance',
    rewardName: 'Artisanal Pour-Over',
    tier: 'Gold Tier',
    branch: 'Northside Mall',
    cost: '4 Stamps',
    timestamp: '1 hour ago',
    status: 'Pending',
    auditTrail: [{ action: 'Request Submitted', by: 'Customer App', date: '2024-10-24 13:30' }]
  },
  {
    id: 'REQ-8888',
    customerName: 'Sophia Chen',
    rewardName: 'VIP Pastry Box',
    tier: 'Black Tier',
    branch: 'West End Kiosk',
    cost: '8 Stamps',
    timestamp: 'Yesterday',
    status: 'Accepted',
    auditTrail: [
      { action: 'Request Submitted', by: 'Customer App', date: '2024-10-23 09:15' },
      { action: 'Accepted Request', by: 'System (Auto)', date: '2024-10-23 09:15' }
    ]
  },
  {
    id: 'REQ-8880',
    customerName: 'James Wilson',
    rewardName: 'Merchandise Tee',
    tier: 'Silver Tier',
    branch: 'Downtown Flagship',
    cost: '20 Stamps',
    timestamp: '2 days ago',
    status: 'Declined',
    auditTrail: [
      { action: 'Request Submitted', by: 'Customer App', date: '2024-10-22 11:00' },
      { action: 'Declined Request - Reason: Out of Stock', by: 'Manager (Admin)', date: '2024-10-22 11:30' }
    ]
  }
];

const RewardRequestsView: React.FC<{
  requests: RewardRequest[];
  setRequests: React.Dispatch<React.SetStateAction<RewardRequest[]>>;
  showToast: (msg: string) => void;
}> = ({ requests, setRequests, showToast }) => {
  const handleAccept = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequests(prev => prev.map(r => r.id === id ? {
      ...r, status: 'Accepted', auditTrail: [...r.auditTrail, { action: 'Accepted Request', by: 'Manager (Admin)', date: new Date().toLocaleString() }]
    } : r));
    showToast(`Request ${id} Accepted`);
  };

  const handleDecline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequests(prev => prev.map(r => r.id === id ? {
      ...r, status: 'Declined', auditTrail: [...r.auditTrail, { action: 'Declined Request - Reason: Admin Action', by: 'Manager (Admin)', date: new Date().toLocaleString() }]
    } : r));
    showToast(`Request ${id} Declined`);
  };

  return (
    <div className="space-y-6">
      {/* List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
           <div className="p-8 text-center text-[#6E6A66] font-semibold">No requests found.</div>
        ) : (
          requests.map(r => (
            <div key={r.id} className="bg-white border border-[#EFECE6] rounded-xl p-4 sm:p-5 shadow-sm hover:border-[#D1CDC7] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FAF8FF] rounded-full flex items-center justify-center border border-[#EFECE6] shrink-0 mt-0.5 sm:mt-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#5844A8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === 'Accepted' ? 'bg-[#E6F4ED] text-[#0D7A53]' : 
                      r.status === 'Declined' ? 'bg-[#FEE2E2] text-[#DC2626]' : 
                      'bg-purple-50 text-[#5844A8]'
                    }`}>{r.status}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#9E9A93] uppercase whitespace-nowrap">{r.id} • {r.timestamp}</span>
                  </div>
                  <h4 className="text-[13px] sm:text-[15px] font-bold text-[#1A1615] leading-snug break-words">{r.customerName} <span className="text-[#6E6A66] font-normal">requested</span> {r.rewardName}</h4>
                  <div className="text-[10px] sm:text-xs font-semibold text-[#8C827A] mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-3">
                    <span>{r.tier}</span>
                    <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                    <span>{r.branch}</span>
                    <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                    <span className="text-[#5844A8]">{r.cost}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                {r.status === 'Pending' && (
                  <>
                    <button onClick={(e) => handleDecline(r.id, e)} className="flex-1 sm:flex-none px-4 py-2 text-[13px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FEE2E2] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer text-center">Decline</button>
                    <button onClick={(e) => handleAccept(r.id, e)} className="flex-1 sm:flex-none px-4 py-2 text-[13px] font-bold text-white bg-[#0D7A53] hover:bg-[#065F3E] rounded-lg transition-colors cursor-pointer text-center">Accept Request</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const RewardsPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All Rewards (18)');
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>(mockRewardRequests);
  
  const [dynamicQR, setDynamicQR] = useState(true);
  const [pinOverride, setPinOverride] = useState(true);

  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Status: Active');

  const [tierFilterDropdownOpen, setTierFilterDropdownOpen] = useState(false);
  const [categoryFilterDropdownOpen, setCategoryFilterDropdownOpen] = useState(false);
  const [statusFilterDropdownOpen, setStatusFilterDropdownOpen] = useState(false);
  const tierFilterRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tierFilterRef.current && !tierFilterRef.current.contains(event.target as Node)) {
        setTierFilterDropdownOpen(false);
      }
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target as Node)) {
        setCategoryFilterDropdownOpen(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setStatusFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [availabilityWindow, setAvailabilityWindow] = useState('60 Days');
  const [selectedMatrixTier, setSelectedMatrixTier] = useState<string | null>(null);

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [deletedCards, setDeletedCards] = useState<string[]>([]);

  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherCost, setNewVoucherCost] = useState('4 Stamps');
  const [newVoucherTier, setNewVoucherTier] = useState('Silver & Up');
  const [newCards, setNewCards] = useState<any[]>([]);

  const isVisible = (id: string, title: string, tier: string[], category: string, status: string, tabs: string[]) => {
    if (deletedCards.includes(id)) return false;
    if (activeTab !== 'All Rewards (18)' && !tabs.includes(activeTab)) return false;
    if (tierFilter !== 'All Tiers' && !tier.includes(tierFilter)) return false;
    if (categoryFilter !== 'All Categories' && category !== categoryFilter) return false;
    if (statusFilter !== 'Status: Active' && `Status: ${status}` !== statusFilter) return false;
    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase()) && !id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  };

  const [showQRPreview, setShowQRPreview] = useState<string | null>(null);
  const [showManageSlots, setShowManageSlots] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-6 relative">
      {/* Modals */}
      {showQRPreview && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowQRPreview(null)} className="absolute top-4 right-4 text-[#9E9A93] hover:text-[#1A1615] transition-colors cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#1A1615] mb-2">QR Preview</h3>
              <p className="text-[13px] text-[#6E6A66] mb-8">Scan to preview voucher <strong className="text-[#1A1615]">{showQRPreview}</strong></p>
              <div className="bg-[#FAF8FF] w-56 h-56 mx-auto rounded-2xl flex items-center justify-center border border-[#EFECE6] mb-8 shadow-inner">
                <QrCode className="w-32 h-32 text-[#1A1615]" />
              </div>
              <button onClick={() => setShowQRPreview(null)} className="w-full px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {showManageSlots && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowManageSlots(null)} className="absolute top-4 right-4 text-[#9E9A93] hover:text-[#1A1615] transition-colors cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div>
              <h3 className="text-xl font-bold text-[#1A1615] mb-2 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#5844A8]" /> Manage Slots</h3>
              <p className="text-[13px] text-[#6E6A66] mb-6">Configure availability for VIP experience <strong className="text-[#1A1615]">{showManageSlots}</strong></p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-4 border border-[#EFECE6] rounded-xl bg-[#FAF8FF] shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1A1615]">Friday, Oct 24</span>
                    <span className="text-[11px] text-[#6E6A66]">19:00 - 21:00</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#5844A8] bg-[#FAF5FF] px-3 py-1 rounded-full border border-[#E9D5FF]">4/4 Booked</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-[#EFECE6] rounded-xl bg-white shadow-sm hover:border-[#D1CDC7] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1A1615]">Saturday, Oct 25</span>
                    <span className="text-[11px] text-[#6E6A66]">19:00 - 21:00</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#0D7A53] bg-[#E6F4ED] px-3 py-1 rounded-full border border-[#BCE3D1]">2/4 Available</span>
                </div>
              </div>
              <button onClick={() => setShowManageSlots(null)} className="w-full px-4 py-2 bg-[#1A1615] hover:bg-black text-white rounded-lg text-[13px] font-bold transition-colors cursor-pointer">Done</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowEdit(null)} className="absolute top-4 right-4 text-[#9E9A93] hover:text-[#1A1615] transition-colors cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div>
              <h3 className="text-xl font-bold text-[#1A1615] mb-2 flex items-center gap-2"><Edit2 className="w-5 h-5 text-[#5844A8]" /> Edit Reward</h3>
              <p className="text-[13px] text-[#6E6A66] mb-6">Modifying details for <strong className="text-[#1A1615]">{showEdit}</strong></p>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Title</label>
                  <input type="text" defaultValue={showEdit} className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Cost</label>
                    <input type="text" defaultValue="10 Stamps" className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Status</label>
                    <select className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer">
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Paused</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEdit(null)} className="flex-1 px-4 py-2 bg-[#FAF8FF] hover:bg-[#EFECE6] text-[#1A1615] border border-[#EFECE6] rounded-lg text-[13px] font-bold transition-colors cursor-pointer">Cancel</button>
                <button onClick={() => { setShowEdit(null); showToast('Reward updated successfully!'); }} className="flex-1 px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedbackToast && (
        <div className="fixed bottom-4 right-4 bg-[#1A1615] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-full bg-[#0D7A53]/20 flex items-center justify-center text-[#0D7A53]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{feedbackToast}</p>
          </div>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-8">
        <div className="flex-1 max-w-3xl">
          {/* <div className="flex items-center gap-2 text-xs font-bold text-[#9E9A93] mb-2 uppercase tracking-wider">
            Home <ChevronRight className="w-3 h-3" /> CRM & Activity <ChevronRight className="w-3 h-3" /> <span className="text-[#1A1615]">Rewards Catalog & Perks</span>
          </div> */}

          {/* <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FAF5FF] text-[#5844A8] text-[10px] font-bold uppercase tracking-widest rounded">
              ATELIER LOYALTY ARCHITECTURE
            </span>
            <span className="text-[#9E9A93] text-[10px] font-bold uppercase tracking-widest">• Engine v4.2</span>
          </div> */}

          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615] leading-tight">
            Rewards Catalog & Tier Perks Manager
          </h1>
          <p className="text-sm text-[#6E6A66] mt-2 font-medium leading-relaxed">
            Configure redeemable guest vouchers, tier exclusivity thresholds, perk fulfillment rules, and digital wallet redemption limits for Revia hospitality venues.
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 mt-2 lg:mt-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1615]">
            {/* <span className="w-2 h-2 rounded-full bg-[#0D7A53] animate-pulse"></span>
            REALTIME WALLET SYNC: ACTIVE */}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#EAE6E1] text-[#1A1615] text-[13px] font-bold rounded-lg shadow-xs hover:bg-[#FAF5FF] transition-colors cursor-pointer">
              <Download className="w-4 h-4" /> Export Matrix (CSV)
            </button>
            <button onClick={() => onNavigate?.('/rewards/new')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white text-[13px] font-bold rounded-lg shadow-xs hover:opacity-95 transition-opacity cursor-pointer">
              <Plus className="w-4 h-4 text-white" /> Create New Reward
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">ACTIVE REWARD<br />CATALOG</h3>
            <span className="bg-[#FAF5FF] text-[#5844A8] text-[9px] font-bold uppercase px-2 py-1 rounded">Across 4<br />Tiers</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[32px] font-bold text-[#1A1615] leading-none">18</span>
            <span className="text-[14px] font-bold text-[#5844A8]">Live Perks</span>
          </div>
          <div className="text-[11px] font-bold text-[#6E6A66] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#5844A8]" /> 6 auto-replenishing, 12 static
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">30-DAY REDEMPTIONS</h3>
            <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full">+18.4%</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-[#1A1615] leading-none">1,420</span>
              <span className="text-[13px] font-bold text-[#6E6A66]">Vouchers</span>
            </div>
            <span className="text-[14px] font-bold text-[#0D7A53]">₹14,850</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold text-[#9E9A93]">
            <span>Total redeemed</span>
            <span></span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">HIGHEST VELOCITY</h3>
            <span className="bg-[#FAF8FF] border border-[#EFECE6] text-[#6E6A66] text-[10px] font-bold px-2 py-0.5 rounded">412 claimed</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] font-bold text-[#1A1615]">Specialty Flight</span>
            <span className="text-[11px] font-bold text-[#5844A8]">Gold/Obsidian</span>
          </div>
          <div className="text-[11px] font-bold text-[#6E6A66] flex items-center gap-1.5 mt-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7A53]" /> 98.2% positive rating
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">LIABILITY / ESCROW</h3>
            <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full">Sealed</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-[#1A1615] leading-none">₹4,120</span>
              <span className="text-[13px] font-bold text-[#6E6A66]">Escrow</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold text-[#9E9A93]">
            <span>Avg cost / unlock</span>
            <span className="text-[#1A1615]">₹2.90</span>
          </div>
        </div>
      </div>

      {/* Filters & Navigation */}
      <div className="flex flex-col gap-4">
        {/* Tabs Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFECE6] pb-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All Rewards (18)', 'Reward Requests', 'Vouchers & Items (10)', 'VIP & Tier Perks (5)', 'Flash & Happy Hour (3)', 'Archived'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[13px] font-bold whitespace-nowrap rounded-t-lg transition-colors cursor-pointer ${activeTab === tab
                  ? 'bg-[#1A1615] text-white'
                  : 'bg-[#FAF8FF] text-[#6E6A66] hover:bg-[#EFECE6]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold bg-[#FAF8FF] border border-[#EFECE6] px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-[#5844A8]" />
            <span className="text-[#1A1615]">Velocity:</span>
            <span className="text-[#6E6A66]">47 today</span>
            <span className="w-1 h-1 rounded-full bg-[#D1CDC7] mx-1"></span>
            <span className="text-[#6E6A66]">Peak: 8:00 - 10:30 AM</span>
          </div>
        </div>

        {/* Search & Select Row */}
        {activeTab !== 'Reward Requests' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rewards, perks, SKU..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EFECE6] rounded-full text-xs font-bold text-[#1A1615] placeholder:text-[#9E9A93] focus:outline-none focus:border-[#5844A8]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div ref={tierFilterRef} className="relative min-w-[240px]">
              <button
                type="button"
                onClick={() => setTierFilterDropdownOpen(!tierFilterDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border border-[#EFECE6] rounded-lg pl-4 pr-3 py-2.5 text-xs font-semibold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{tierFilter === 'All Tiers' ? 'All Tiers (Silver, Gold, Black, Obsidian)' : tierFilter}</span>
                <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${tierFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {tierFilterDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5">
                  {['All Tiers', 'Silver Tier', 'Gold Tier', 'Black Tier', 'Obsidian VIP'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => { 
                        setTierFilter(tier); 
                        setTierFilterDropdownOpen(false); 
                        showToast(`Filter applied: ${tier}`); 
                      }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs hover:bg-[#F5F1EA] ${tierFilter === tier ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {tier === 'All Tiers' ? 'All Tiers (Silver, Gold, Black, Obsidian)' : tier}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div ref={categoryFilterRef} className="relative min-w-[140px]">
              <button
                type="button"
                onClick={() => setCategoryFilterDropdownOpen(!categoryFilterDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border border-[#EFECE6] rounded-lg pl-4 pr-3 py-2.5 text-xs font-semibold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{categoryFilter}</span>
                <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${categoryFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryFilterDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5">
                  {['All Categories', 'Beverages', 'Pastries', 'Merchandise'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { 
                        setCategoryFilter(cat); 
                        setCategoryFilterDropdownOpen(false); 
                        showToast(`Category selected: ${cat}`); 
                      }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs hover:bg-[#F5F1EA] ${categoryFilter === cat ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div ref={statusFilterRef} className="relative min-w-[140px]">
              <button
                type="button"
                onClick={() => setStatusFilterDropdownOpen(!statusFilterDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border border-[#EFECE6] rounded-lg pl-4 pr-3 py-2.5 text-xs font-semibold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{statusFilter}</span>
                <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${statusFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {statusFilterDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5">
                  {['Status: Active', 'Status: Draft', 'Status: Paused'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => { 
                        setStatusFilter(status); 
                        setStatusFilterDropdownOpen(false); 
                        showToast(`Status filter: ${status}`); 
                      }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs hover:bg-[#F5F1EA] ${statusFilter === status ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'Reward Requests' ? (
        <RewardRequestsView
          requests={rewardRequests}
          setRequests={setRewardRequests}
          showToast={showToast}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Column - Reward List */}
        <div className="xl:col-span-8 space-y-4">

          {/* Dynamically created cards */}
          {newCards.filter(c => isVisible(c.id, c.title, [c.tier], 'Beverages', 'Active', ['Vouchers & Items (10)', 'All Rewards (18)'])).map(card => (
            <div key={card.id} className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group">
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#FAF8FF] flex items-center justify-center border border-[#EFECE6]">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">{card.id}</div>
                <div className="w-10 h-10 rounded bg-[#FAF5FF] flex items-center justify-center border border-[#E9D5FF]">
                  <Zap className="w-5 h-5 text-[#5844A8]" />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF8FF] border border-[#EFECE6] text-[#6E6A66] text-[10px] font-bold px-2 py-0.5 rounded-full">{card.tier}</span>
                    <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">{card.cost}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1A1615] mb-1">{card.title}</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">Newly created custom voucher reward.</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span>Availability: <strong className="text-[#1A1615]">{card.availability}</strong></span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                    <Clock className="w-3.5 h-3.5" /> Just Added
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowQRPreview(card.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[13px] font-bold rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer"><QrCode className="w-4 h-4" /> QR Preview</button>
                    <button onClick={() => setShowEdit(card.title)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, card.id])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Card 1 */}
          {isVisible('#REV-041', 'Complimentary Specialty Flight & Pastry', ['Gold Tier', 'Black Tier'], 'Beverages', 'Active', ['VIP & Tier Perks (5)', 'All Rewards (18)']) && (
            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group">
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#1A1615] flex items-center justify-center">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">#REV-041</div>
                <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=300" alt="Specialty Flight" className="w-full h-full object-cover opacity-80" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF5FF] text-[#5844A8] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E9D5FF]">Gold & Black Tier</span>
                    <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">10 Stamps <span className="text-[#9E9A93] font-medium text-xs">or 500 Pts</span></div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A1615] mb-1">Complimentary Specialty Flight & Pastry</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">
                  Signature three-origin pour-over tasting flight paired with any morning bake from...
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#5844A8]" /> Velocity: <strong className="text-[#1A1615]">412 (Hot)</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Venues: <strong className="text-[#1A1615]">All 3 Venues</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Guest Limit: <strong className="text-[#1A1615]">1 / day</strong></span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                    <Clock className="w-3.5 h-3.5" /> 30 Days expiry
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowQRPreview('#REV-041')} className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[13px] font-bold rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer">
                      <QrCode className="w-4 h-4" /> QR Preview
                    </button>
                    <button onClick={() => setShowEdit('Complimentary Specialty Flight & Pastry')} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, '#REV-041'])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 2 */}
          {isVisible('#REV-108', '₹10 Off Any Roasted Bean Bag (250g)', ['Silver Tier', 'Gold Tier', 'Black Tier', 'Obsidian VIP'], 'Merchandise', 'Active', ['Vouchers & Items (10)', 'All Rewards (18)']) && (
            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group">
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#FAF8FF] flex items-center justify-center border border-[#EFECE6]">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">#REV-108</div>
                <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=300" alt="Bean Bag" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF8FF] border border-[#EFECE6] text-[#6E6A66] text-[10px] font-bold px-2 py-0.5 rounded-full">All Tiers (Silver+)</span>
                    <span className="bg-[#E0F9ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Auto-Replenish
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">8 Stamps <span className="text-[#9E9A93] font-medium text-xs">or 400 Pts</span></div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A1615] mb-1">₹10 Off Any Roasted Bean Bag (250g)</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">
                  Single-Origin Micro-lots or Reserve Geisha. In-store POS barcode scan or pre-order.
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span>Redemptions: <strong className="text-[#1A1615]">289</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Channel: <strong className="text-[#1A1615]">POS & Mobile</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Inventory: <strong className="text-[#1A1615]">Auto-Deducted</strong></span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                    <Calendar className="w-3.5 h-3.5" /> Continuous Season
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowQRPreview('#REV-108')} className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[13px] font-bold rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer">
                      <QrCode className="w-4 h-4" /> QR Preview
                    </button>
                    <button onClick={() => setShowEdit('₹10 Off Any Roasted Bean Bag (250g)')} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, '#REV-108'])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 3 - VIP */}
          {isVisible('#VIP-001', 'Revia Obsidian Private Tasting Tour', ['Obsidian VIP'], 'Beverages', 'Active', ['VIP & Tier Perks (5)', 'All Rewards (18)']) && (
            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1A1615]"></div>
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#1A1615] flex items-center justify-center">
                <div className="absolute top-2 left-2 bg-[#1A1615]/90 backdrop-blur-md text-[#5844A8] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#5844A8]/30 z-10">VIP EXCLUSIVE</div>
                <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300" alt="VIP Tour" className="w-full h-full object-cover opacity-70" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1A1615] text-[#5844A8] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#332e2d]">Obsidian VIP Exclusive</span>
                    <span className="bg-[#FAF5FF] text-[#5844A8] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E9D5FF]">Milestone Unlock</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">Zero Pts</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A1615] mb-1">Revia Obsidian Private Tasting Tour</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">
                  Private after-hours cupping and sensory flight led by Head of Roasting.
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span>Quota: <strong className="text-[#1A1615]">4 Guests / Session</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Days: <strong className="text-[#1A1615]">Fri & Sat Only</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Claimed: <strong className="text-[#5844A8]">18 (8 Left)</strong></span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5844A8]">
                    <Trophy className="w-3.5 h-3.5" /> Concierge RSVP Required
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowManageSlots('Revia Obsidian Private Tasting Tour')} className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1615] text-[#5844A8] border border-[#332e2d] text-[13px] font-bold rounded-lg hover:bg-black transition-colors cursor-pointer">
                      <Calendar className="w-4 h-4" /> Manage Slots
                    </button>
                    <button onClick={() => setShowEdit('Revia Obsidian Private Tasting Tour')} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, '#VIP-001'])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 4 */}
          {isVisible('#REV-012', 'Artisanal Single-Origin Pour-Over Upgrade', ['Silver Tier', 'Gold Tier', 'Black Tier', 'Obsidian VIP'], 'Beverages', 'Active', ['Vouchers & Items (10)', 'All Rewards (18)']) && (
            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group">
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#FAF8FF] flex items-center justify-center border border-[#EFECE6]">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">#REV-012</div>
                <div className="w-10 h-10 rounded bg-[#FAF5FF] flex items-center justify-center border border-[#E9D5FF]">
                  <svg className="w-5 h-5 text-[#5844A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /></svg>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF8FF] border border-[#EFECE6] text-[#6E6A66] text-[10px] font-bold px-2 py-0.5 rounded-full">Silver Tier & Above</span>
                    <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">4 Stamps <span className="text-[#9E9A93] font-medium text-xs">or 150 Pts</span></div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A1615] mb-1">Artisanal Single-Origin Pour-Over Upgrade</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">
                  Upgrade any standard drip brew or Americano to rotating single-origin bar brew.
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span>Daily Velocity: <strong className="text-[#1A1615]">654</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Venues: <strong className="text-[#1A1615]">Downtown & Roastery</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Sync: <strong className="text-[#0D7A53]">Instant</strong></span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                    <Activity className="w-3.5 h-3.5" /> Recurring Weekly
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowQRPreview('#REV-012')} className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[13px] font-bold rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer">
                      <QrCode className="w-4 h-4" /> QR Preview
                    </button>
                    <button onClick={() => setShowEdit('Artisanal Single-Origin Pour-Over Upgrade')} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, '#REV-012'])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 5 */}
          {isVisible('#REV-077', 'Reserve Cold Brew Growler Refill (50% Off)', ['Gold Tier', 'Black Tier', 'Obsidian VIP'], 'Beverages', 'Active', ['Flash & Happy Hour (3)', 'All Rewards (18)']) && (
            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:border-[#D1CDC7] transition-colors group">
              <div className="w-full md:w-[160px] h-[120px] rounded-lg relative overflow-hidden shrink-0 bg-[#FAF8FF] flex items-center justify-center border border-[#EFECE6]">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">#REV-077</div>
                <div className="w-10 h-10 rounded bg-[#FAF5FF] flex items-center justify-center border border-[#E9D5FF]">
                  <svg className="w-4 h-5 text-[#5844A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M8 6h8" /><path d="M7 6v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" /></svg>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF5FF] border border-[#E9D5FF] text-[#5844A8] text-[10px] font-bold px-2 py-0.5 rounded-full">Gold Exclusive</span>
                    <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#5844A8]">6 Stamps</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A1615] mb-1">Reserve Cold Brew Growler Refill (50% Off)</h3>
                <p className="text-xs text-[#6E6A66] mb-3 leading-relaxed">
                  Valid for 32oz or 64oz amber glass growler refilled with nitrogen-infused Kyoto style...
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#9E9A93] bg-[#FAF8FF] px-3 py-2 rounded-lg mb-3 border border-[#EFECE6]">
                  <span>Redemptions: <strong className="text-[#1A1615]">142</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Venues: <strong className="text-[#1A1615]">All 3 Venues</strong></span>
                  <span className="w-1 h-1 rounded-full bg-[#D1CDC7]"></span>
                  <span>Type: <strong className="text-[#1A1615]">Direct Discount</strong></span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                    <Clock className="w-3.5 h-3.5" /> Weekend Refresh
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowQRPreview('#REV-077')} className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[13px] font-bold rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer">
                      <QrCode className="w-4 h-4" /> QR Preview
                    </button>
                    <button onClick={() => setShowEdit('Reserve Cold Brew Growler Refill (50% Off)')} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF5FF] hover:text-[#1A1615] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletedCards([...deletedCards, '#REV-077'])} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Side Panels */}
        <div className="xl:col-span-4 space-y-6">

          {/* Tier Privilege Matrix */}
          <div className="bg-[#FAF8FF] border border-[#EFECE6] rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#1A1615] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#5844A8]" /> Tier Privilege Matrix
              </h3>
              <button className="text-[10px] font-bold text-[#5844A8] uppercase tracking-wider hover:text-[#5844A8] transition-colors cursor-pointer">
                Reconfigure
              </button>
            </div>
            <p className="text-[11px] text-[#6E6A66] mb-5 font-medium">
              Autonomous milestones unlocked on digital wallet passes.
            </p>

            <div className="space-y-4">
              {/* Silver */}
              <div onClick={() => setSelectedMatrixTier('Silver')} className={`border rounded-lg p-3 shadow-sm cursor-pointer transition-all ${selectedMatrixTier === 'Silver' ? 'bg-[#FAF5FF] border-[#5844A8]' : 'bg-white border-[#EFECE6] hover:border-[#D1CDC7]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D1CDC7]"></span>
                    <span className="text-xs font-bold text-[#1A1615]">Silver Tier</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#9E9A93] uppercase tracking-widest">Entry Level</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#6E6A66] font-medium ml-4">
                  <li>Free welcome espresso or batch brew</li>
                  <li>Birthday double stamps celebration</li>
                </ul>
              </div>

              {/* Gold */}
              <div onClick={() => setSelectedMatrixTier('Gold')} className={`border rounded-lg p-3 shadow-sm cursor-pointer transition-all ${selectedMatrixTier === 'Gold' ? 'bg-[#FAF5FF] border-[#5844A8]' : 'bg-white border-[#EFECE6] hover:border-[#D1CDC7]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5844A8]"></span>
                    <span className="text-xs font-bold text-[#1A1615]">Gold Tier</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#5844A8] uppercase tracking-widest">5+ Visits / mo</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#5844A8] font-medium ml-4">
                  <li>10% off bagged beans & merch</li>
                  <li>Priority mobile pickup lane routing</li>
                </ul>
              </div>

              {/* Black */}
              <div onClick={() => setSelectedMatrixTier('Black')} className={`border rounded-lg p-3 shadow-sm cursor-pointer transition-all ${selectedMatrixTier === 'Black' ? 'bg-[#FAF5FF] border-[#5844A8]' : 'bg-white border-[#EFECE6] hover:border-[#D1CDC7]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1615]"></span>
                    <span className="text-xs font-bold text-[#1A1615]">Black Tier</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#1A1615] uppercase tracking-widest">15+ Visits / mo</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#6E6A66] font-medium ml-4">
                  <li>Complimentary monthly tasting flight</li>
                  <li>Downtown Flagship table reservations</li>
                </ul>
              </div>

              {/* Obsidian */}
              <div onClick={() => setSelectedMatrixTier('Obsidian')} className={`border rounded-lg p-3 shadow-sm relative overflow-hidden cursor-pointer transition-all ${selectedMatrixTier === 'Obsidian' ? 'bg-[#1A1615] border-[#5844A8]' : 'bg-[#1A1615] border-[#332e2d] hover:border-[#4a4342]'}`}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#7C3AED]/20 to-transparent rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5844A8]"></span>
                    <span className="text-xs font-bold text-[#5844A8]">Obsidian VIP</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#5844A8] uppercase tracking-widest">₹2.5K / Invite</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#D1CDC7] font-medium ml-4 relative z-10">
                  <li>Private cupping with Master Roaster</li>
                  <li>Bespoke digital concierge VIP pass</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Redemption Security */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1615] flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-[#0D7A53]" /> Redemption Security
            </h3>
            <p className="text-[11px] text-[#6E6A66] mb-5 font-medium">
              Active fraud mitigation across terminal endpoints.
            </p>

            <div className="space-y-4 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A1615]">Dynamic QR Rotation</div>
                  <div className="text-[10px] text-[#9E9A93]">Rotates hash every 45s to block screenshots.</div>
                </div>
                <button
                  onClick={() => setDynamicQR(!dynamicQR)}
                  className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${dynamicQR ? 'bg-[#0D7A53]' : 'bg-[#D1CDC7]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${dynamicQR ? 'left-4.5' : 'left-0.5'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A1615]">PIN Override ({'>'}₹25)</div>
                  <div className="text-[10px] text-[#9E9A93]">Supervisor PIN required for rare lots.</div>
                </div>
                <button
                  onClick={() => setPinOverride(!pinOverride)}
                  className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${pinOverride ? 'bg-[#0D7A53]' : 'bg-[#D1CDC7]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${pinOverride ? 'left-4.5' : 'left-0.5'}`}></span>
                </button>
              </div>
            </div>

            <div className="bg-[#FAF8FF] border border-[#EFECE6] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#5844A8]" />
                <div>
                  <div className="text-[11px] font-bold text-[#1A1615]">Apple & Google Wallet</div>
                  <div className="text-[10px] text-[#9E9A93]">Sync badge instant</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0D7A53]">99.98% Live</span>
            </div>
          </div>

          {/* Quick Create Voucher */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1A1615] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#5844A8]" /> Quick Create Voucher
              </h3>
              <span className="text-[10px] font-bold text-[#5844A8] bg-[#FAF5FF] px-2 py-0.5 rounded border border-[#E9D5FF]">Fast Wizard</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1.5">Perk Title</label>
                <input
                  type="text"
                  value={newVoucherTitle}
                  onChange={(e) => setNewVoucherTitle(e.target.value)}
                  placeholder="e.g. Cascara Fizz Voucher"
                  className="w-full px-3 py-2 bg-[#FAF8FF] border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1.5">Cost</label>
                  <div className="relative">
                    <select value={newVoucherCost} onChange={(e) => setNewVoucherCost(e.target.value)} className="w-full appearance-none px-3 py-2 bg-[#FAF8FF] border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] cursor-pointer">
                      <option>4 Stamps</option>
                      <option>10 Stamps</option>
                      <option>Zero Pts</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9A93] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1.5">Tier</label>
                  <div className="relative">
                    <select value={newVoucherTier} onChange={(e) => setNewVoucherTier(e.target.value)} className="w-full appearance-none px-3 py-2 bg-[#FAF8FF] border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] cursor-pointer">
                      <option>Silver Tier</option>
                      <option>Gold Tier</option>
                      <option>Black Tier</option>
                      <option>Obsidian VIP</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9A93] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Availability Window</label>
                <div className="flex bg-[#FAF8FF] border border-[#EFECE6] rounded-lg p-1">
                  <button onClick={() => setAvailabilityWindow('30 Days')} className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${availabilityWindow === '30 Days' ? 'text-[#1A1615] bg-white shadow-sm border border-[#EFECE6]' : 'text-[#6E6A66] hover:bg-[#EFECE6]'}`}>30 Days</button>
                  <button onClick={() => setAvailabilityWindow('60 Days')} className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${availabilityWindow === '60 Days' ? 'text-[#1A1615] bg-white shadow-sm border border-[#EFECE6]' : 'text-[#6E6A66] hover:bg-[#EFECE6]'}`}>60 Days</button>
                  <button onClick={() => setAvailabilityWindow('Permanent')} className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${availabilityWindow === 'Permanent' ? 'text-[#1A1615] bg-white shadow-sm border border-[#EFECE6]' : 'text-[#6E6A66] hover:bg-[#EFECE6]'}`}>Permanent</button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newVoucherTitle) { showToast('Please enter a Perk Title'); return; }
                const newId = `#REV-${Date.now().toString().slice(-3)}`;
                setNewCards([{ id: newId, title: newVoucherTitle, cost: newVoucherCost, tier: newVoucherTier, availability: availabilityWindow }, ...newCards]);
                setNewVoucherTitle('');
                showToast('Voucher created and deployed to wallet!');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#7C3AED] to-[#5844A8] text-white rounded-lg text-[13px] font-bold shadow-md hover:opacity-95 transition-opacity border border-[#5844A8] cursor-pointer"
            >
              <ArrowUpFromWalletIcon className="w-4 h-4" /> Save & Deploy to Wallet
            </button>
          </div>
        </div>

        </div>
      )}

    </div>
  );
};

function ArrowUpFromWalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.5" />
      <path d="M7 15h0" />
      <path d="M7 11h0" />
      <path d="M16 22v-6" />
      <path d="m13 19 3-3 3 3" />
    </svg>
  );
}