import React, { useState, useMemo } from 'react';
import {
  Store,
  Building2,
  MapPin,
  Clock,
  Check,
  X,
  ChevronDown,
  Search,
  Download,
  Plus,
  Edit3,
  Phone,
  Mail,
  QrCode,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Sun,
  Sunset,
  Moon,
  Trophy,
  ArrowUpRight,
  Users,
  ShoppingBag,
  Receipt,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Utensils
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';
import {
  BRANCH_HIERARCHY_DATA,
  StateData,
  CityData,
  BranchItem,
  CampaignStat
} from '../data/branchHierarchyData';

interface BranchesPageProps {
  onNavigate?: (route: NavRoute) => void;
  onBranchSelect?: (branchName: string) => void;
  outlets?: OutletsData[];
  onAddBranch?: (branch: OutletsData) => void;
  selectedOutletId?: string;
  onSelectOutletId?: (id: string) => void;
}

// Lightweight SVG Donut for Gender Breakdown
const GenderDonut: React.FC<{
  male: number;
  female: number;
  other: number;
  size?: number;
  strokeWidth?: number;
  centerText?: { main: string; sub: string };
}> = ({ male, female, other, size = 52, strokeWidth = 7, centerText }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const maleDash = (male / 100) * circumference;
  const femaleDash = (female / 100) * circumference;
  const otherDash = (other / 100) * circumference;

  const maleOffset = 0;
  const femaleOffset = -maleDash;
  const otherOffset = -(maleDash + femaleDash);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background / Base Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#F1EFEA"
          strokeWidth={strokeWidth}
        />
        {/* Female (magenta/pink) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#DB2777"
          strokeWidth={strokeWidth}
          strokeDasharray={`${femaleDash} ${circumference}`}
          strokeDashoffset={femaleOffset}
        />
        {/* Male (blue/cyan) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#0284C7"
          strokeWidth={strokeWidth}
          strokeDasharray={`${maleDash} ${circumference}`}
          strokeDashoffset={maleOffset}
        />
        {/* Other (slate/grey) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#CBD5E1"
          strokeWidth={strokeWidth}
          strokeDasharray={`${otherDash} ${circumference}`}
          strokeDashoffset={otherOffset}
        />
      </svg>
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-sm font-bold text-[#1A1615] leading-none">{centerText.main}</span>
          <span className="text-[8px] text-[#8C877D] font-medium mt-0.5">{centerText.sub}</span>
        </div>
      )}
    </div>
  );
};

export const BranchesPage: React.FC<BranchesPageProps> = ({
  onNavigate,
  onBranchSelect,
  onAddBranch,
  selectedOutletId,
  onSelectOutletId
}) => {
  // Navigation Level: 'states' (Level 1) | 'cities' (Level 2) | 'branches' (Level 3) | 'details' (Level 4)
  const [level, setLevel] = useState<'states' | 'cities' | 'branches' | 'details'>('states');

  // Active selections
  const [hierarchyData, setHierarchyData] = useState<StateData[]>(BRANCH_HIERARCHY_DATA);
  const [selectedStateId, setSelectedStateId] = useState<string>('uttar-pradesh');
  const [selectedCityId, setSelectedCityId] = useState<string>('noida');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('noida-sec-18');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Tab inside Level 4 (Branch Details)
  const [detailTab, setDetailTab] = useState<'overview' | 'performance' | 'campaigns' | 'settings'>('overview');

  // Modals
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(false);

  // New Branch Form state
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    address: '',
    manager: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Current selections
  const currentState = useMemo(() => {
    return hierarchyData.find((s) => s.id === selectedStateId) || hierarchyData[0];
  }, [hierarchyData, selectedStateId]);

  const currentCity = useMemo(() => {
    return currentState.cities.find((c) => c.id === selectedCityId) || currentState.cities[0] || {
      id: 'city-empty',
      name: 'No City',
      state: currentState.name,
      branchesCount: 0,
      activeCount: 0,
      inactiveCount: 0,
      revenue: 0,
      revenueFormatted: '₹0',
      totalOrders: 0,
      avgOrdersPerBranch: 0,
      morningOrders: 0,
      afternoonOrders: 0,
      eveningOrders: 0,
      genderRatio: { male: 50, female: 45, other: 5 },
      topCampaigns: [],
      branches: []
    };
  }, [currentState, selectedCityId]);

  const currentBranch = useMemo(() => {
    // Look in currentCity or anywhere in the hierarchy
    for (const state of hierarchyData) {
      for (const city of state.cities) {
        const found = city.branches.find((b) => b.id === selectedBranchId);
        if (found) return found;
      }
    }
    return currentCity.branches[0] || null;
  }, [hierarchyData, selectedBranchId, currentCity]);

  // Overall Global Stats for Level 1
  const overallStats = useMemo(() => {
    let totalBranches = 0;
    let activeBranches = 0;
    let inactiveBranches = 0;
    let totalRev = 0;

    hierarchyData.forEach((s) => {
      totalBranches += s.branchesCount;
      activeBranches += s.activeCount;
      inactiveBranches += s.inactiveCount;
      totalRev += s.revenue;
    });

    return {
      totalBranches: 21, // matching Figma visual: 21
      activeBranches: 16, // matching Figma visual: 16
      inactiveBranches: 5, // matching Figma visual: 5
      revenueFormatted: '₹16,86,700' // matching Figma visual
    };
  }, [hierarchyData]);

  // Handlers for Drilldown Navigation
  const handleSelectState = (state: StateData) => {
    setSelectedStateId(state.id);
    if (state.cities && state.cities.length > 0) {
      setSelectedCityId(state.cities[0].id);
    }
    setLevel('cities');
    setSearchQuery('');
  };

  const handleSelectCity = (city: CityData) => {
    setSelectedCityId(city.id);
    if (city.branches && city.branches.length > 0) {
      setSelectedBranchId(city.branches[0].id);
    }
    setLevel('branches');
    setSearchQuery('');
  };

  const handleSelectBranch = (branch: BranchItem) => {
    setSelectedBranchId(branch.id);
    setLevel('details');
    if (onBranchSelect) {
      onBranchSelect(branch.shortName);
    }
    if (onSelectOutletId) {
      onSelectOutletId(branch.id);
    }
  };

  // Download Report action
  const handleDownloadReport = () => {
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 3000);
  };

  // Handle Add Branch submission
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchForm.name.trim()) return;

    const newBranch: BranchItem = {
      id: `branch-${Date.now()}`,
      name: newBranchForm.name,
      shortName: newBranchForm.name.split('—')[1]?.trim() || newBranchForm.name,
      city: newBranchForm.city,
      state: newBranchForm.state,
      status: newBranchForm.status,
      address: newBranchForm.address || `${newBranchForm.city}`,
      fullAddress: newBranchForm.address || `${newBranchForm.name}, ${newBranchForm.city}, ${newBranchForm.state}`,
      manager: newBranchForm.manager || 'Assigned Manager',
      phone: newBranchForm.phone || '+91 98765 00000',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      revenue: 0,
      revenueFormatted: '₹0',
      revenueGrowth: 'New Outlet',
      totalOrders: 0,
      ordersGrowth: '0%',
      avgOrderValue: 0,
      avgOrderValueTarget: 'Target ₹500',
      footfall: 0,
      footfallGrowth: 'Just launched',
      morningOrders: 0,
      afternoonOrders: 0,
      eveningOrders: 0,
      genderRatio: { male: 50, female: 45, other: 5 },
      topCampaigns: [
        { id: 'c1', name: 'Welcome Special', discount: '20% Off', redemptions: 0, impact: 'Ready', barColor: '#8B5CF6' }
      ],
      activeQrCodes: 1,
      tables: 4,
      counters: 1,
      operatingHours: '10:00 AM - 10:00 PM',
      recentActivity: [
        { type: 'customer', title: 'Branch created in Merchant Suite', timeAgo: 'Just now' }
      ]
    };

    setHierarchyData((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === newBranchForm.state.toLowerCase()) {
          const updatedCities = s.cities.map((c) => {
            if (c.name.toLowerCase() === newBranchForm.city.toLowerCase()) {
              return {
                ...c,
                branchesCount: c.branchesCount + 1,
                activeCount: c.activeCount + (newBranch.status === 'Active' ? 1 : 0),
                inactiveCount: c.inactiveCount + (newBranch.status === 'Inactive' ? 1 : 0),
                branches: [newBranch, ...c.branches]
              };
            }
            return c;
          });
          return {
            ...s,
            branchesCount: s.branchesCount + 1,
            activeCount: s.activeCount + (newBranch.status === 'Active' ? 1 : 0),
            inactiveCount: s.inactiveCount + (newBranch.status === 'Inactive' ? 1 : 0),
            cities: updatedCities
          };
        }
        return s;
      })
    );

    setIsAddBranchModalOpen(false);
    setSelectedBranchId(newBranch.id);
    setLevel('details');
  };

  // Filtered lists by search query
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return hierarchyData;
    return hierarchyData.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cities.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [hierarchyData, searchQuery]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return currentState.cities;
    return currentState.cities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [currentState, searchQuery]);

  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return currentCity.branches;
    return currentCity.branches.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentCity, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16 font-sans text-[#1A1615]">
      {/* Toast Notification for Report Download */}
      {reportDownloaded && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#2D124D] text-white px-4 py-3 rounded-xl shadow-lg border border-purple-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Branch Analytics Report generated & downloaded successfully!
        </div>
      )}

      {/* TOP BAR / HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-[#E8E4DD] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {level === 'details' ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLevel('branches')}
                  className="p-1.5 -ml-1.5 rounded-lg text-[#1A1615] hover:bg-[#FAF8F5] border border-[#E5E0D8] transition-colors cursor-pointer"
                  title="Back to Branches"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1A1615]" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[#1A1615]">Branch Details</h1>
                  <p className="text-xs text-[#6E6A66] font-medium mt-0.5">
                    {currentCity.name} • {currentBranch?.shortName || currentBranch?.name}
                  </p>
                </div>
              </div>
            ) : level === 'branches' ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => setLevel('cities')}
                    className="text-xs font-semibold text-[#8C877D] hover:text-[#1A1615] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Cities in {currentState.name}
                  </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1615]">Branches</h1>
                <p className="text-xs text-[#6E6A66] font-medium">
                  {currentCity.name}, {currentState.name} — city branch performance
                </p>
              </div>
            ) : level === 'cities' ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => setLevel('states')}
                    className="text-xs font-semibold text-[#8C877D] hover:text-[#1A1615] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> All States
                  </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1615]">Cities</h1>
                <p className="text-xs text-[#6E6A66] font-medium">
                  {currentState.name} — branch performance by city
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1615]">Branches</h1>
                <p className="text-xs text-[#6E6A66] font-medium">View performance across all your locations</p>
              </div>
            )}
          </div>

          {/* Action Buttons & Dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Timeframe Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="bg-white border border-[#E5E0D8] hover:border-[#D4A753] text-[#1A1615] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#8C877D]" />
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C877D]" />
              </button>
              {isTimeDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-1 z-40 text-xs">
                  {['Last 7 Days', 'Last 30 Days', 'This Month', 'Last Quarter', 'Year to Date'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimeRange(t);
                        setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 font-medium hover:bg-[#FAF8F5] cursor-pointer transition-colors ${
                        timeRange === t ? 'text-[#2D124D] font-bold bg-[#FAF5FF]' : 'text-[#1A1615]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Get/Download Report Button */}
            <button
              type="button"
              onClick={handleDownloadReport}
              className="bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] hover:border-[#D4A753] text-[#1A1615] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8C877D]" />
              <span>{level === 'details' ? 'Download Report' : 'Get Report'}</span>
            </button>

            {/* Add or Edit Branch Button */}
            {level === 'details' ? (
              <button
                type="button"
                onClick={() => setIsEditBranchModalOpen(true)}
                className="bg-[#2D124D] hover:bg-[#3E1A68] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-white/90" />
                <span>Edit Branch</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('/branches/new' as any);
                  } else {
                    setIsAddBranchModalOpen(true);
                  }
                }}
                className="bg-[#2D124D] hover:bg-[#3E1A68] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white/90" />
                <span>Add Branch</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* LEVEL 1: ALL STATES VIEW */}
        {/* ======================================================== */}
        {level === 'states' && (
          <>
            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Branches */}
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FAF5FF] border border-[#EBE3FC] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#6D28D9]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#1A1615]">{overallStats.totalBranches}</div>
                  <div className="text-[11px] text-[#6E6A66] font-medium">Total Branches</div>
                </div>
              </div>

              {/* Active Branches */}
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#BBF7D0] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#16A34A] stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#15803D]">{overallStats.activeBranches}</div>
                  <div className="text-[11px] text-[#166534] font-medium">Active Branches</div>
                </div>
              </div>

              {/* Inactive Branches */}
              <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#FECDD3] flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-[#E11D48] stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#BE123C]">{overallStats.inactiveBranches}</div>
                  <div className="text-[11px] text-[#9F1239] font-medium">Inactive Branches</div>
                </div>
              </div>

              {/* Reported Revenue */}
              <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center shrink-0">
                  <span className="text-[#6D28D9] font-bold text-lg">₹</span>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#581C87]">{overallStats.revenueFormatted}</div>
                  <div className="text-[11px] text-[#6B21A8] font-medium">Reported Revenue</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C877D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search states..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] placeholder-[#8C877D] focus:outline-hidden focus:border-[#2D124D] shadow-2xs"
                />
              </div>
              <button
                type="button"
                className="p-2.5 bg-white border border-[#E5E0D8] rounded-xl text-[#6E6A66] hover:bg-[#FAF8F5] shadow-2xs"
                title="Grid layout active"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* State Cards Grid (2 columns on md/lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStates.map((state) => (
                <div
                  key={state.id}
                  onClick={() => handleSelectState(state)}
                  className="bg-white border border-[#EBE7DF] hover:border-[#D4A753] hover:shadow-md rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3.5 border-b border-[#F1EFEA]">
                      <div>
                        <h2 className="text-base font-bold text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                          {state.name}
                        </h2>
                        <span className="text-xs text-[#8C877D] font-medium">{state.branchesCount} branches</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#FAF8F5] group-hover:bg-[#FAF5FF] flex items-center justify-center text-[#8C877D] group-hover:text-[#2D124D] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Quick Stats Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3.5">
                      <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-lg px-2.5 py-1 text-xs font-bold text-[#581C87] flex items-center gap-1.5">
                        <span className="text-[10px] text-[#7E22CE]">₹</span> {state.revenueFormatted}
                        <span className="text-[9px] font-semibold text-[#A855F7] tracking-wider uppercase ml-1">
                          REVENUE
                        </span>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1A1615] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8C877D]" /> {state.branchesCount}
                        <span className="text-[9px] font-semibold text-[#8C877D] tracking-wider uppercase ml-1">
                          TOTAL BRANCHES
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto text-xs font-semibold">
                        <span className="flex items-center gap-1 text-[#15803D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> {state.activeCount} Active
                        </span>
                        <span className="flex items-center gap-1 text-[#BE123C]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" /> {state.inactiveCount} Inactive
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Top 3 Campaigns & Orders by Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#F1EFEA]">
                      {/* Left: Top 3 Campaigns */}
                      <div>
                        <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2.5">
                          <Trophy className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>Top 3 Campaigns</span>
                          <span className="text-[10px] text-[#8C877D] font-normal">(completed redemptions)</span>
                        </div>
                        <div className="space-y-1.5">
                          {state.topCampaigns.map((camp, idx) => (
                            <div key={camp.id} className="flex items-center justify-between text-xs py-0.5">
                              <span className="text-[#6E6A66] font-medium flex items-center gap-1.5">
                                <span className="text-[10px] text-[#DB2777] font-bold">{idx + 1}</span>
                                {camp.name}
                              </span>
                              <span className="font-bold text-[#1A1615] font-mono">{camp.redemptions}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Orders by Time of Day */}
                      <div>
                        <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2.5">
                          <Clock className="w-3.5 h-3.5 text-[#6D28D9]" />
                          <span>Orders by Time of Day</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-[#FBF5FF] border border-[#F3E8FF] rounded-xl p-2 text-center">
                            <Sun className="w-3.5 h-3.5 text-[#7E22CE] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{state.morningOrders}</div>
                            <div className="text-[9px] text-[#7E22CE] font-medium">Morning</div>
                          </div>
                          <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-2 text-center">
                            <Sunset className="w-3.5 h-3.5 text-[#EA580C] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{state.afternoonOrders}</div>
                            <div className="text-[9px] text-[#C2410C] font-medium">Afternoon</div>
                          </div>
                          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-2 text-center">
                            <Moon className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{state.eveningOrders}</div>
                            <div className="text-[9px] text-[#0369A1] font-medium">Evening</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Visitor Gender */}
                  <div className="mt-4 pt-4 border-t border-[#F1EFEA]">
                    <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2">
                      <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Visitor Gender</span>
                      <span className="text-[10px] text-[#8C877D] font-normal">(all recorded visits)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <GenderDonut
                        male={state.genderRatio.male}
                        female={state.genderRatio.female}
                        other={state.genderRatio.other}
                        size={48}
                        strokeWidth={6}
                      />
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-[#0284C7]">
                          <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Male {state.genderRatio.male}%
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#DB2777]">
                          <span className="w-2 h-2 rounded-full bg-[#DB2777]" /> Female {state.genderRatio.female}%
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#64748B]">
                          <span className="w-2 h-2 rounded-full bg-[#94A3B8]" /> Other {state.genderRatio.other}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* LEVEL 2: CITIES VIEW FOR SELECTED STATE */}
        {/* ======================================================== */}
        {level === 'cities' && (
          <>
            {/* Horizontal State Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {hierarchyData.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStateId(st.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                    st.id === selectedStateId
                      ? 'bg-[#2D124D] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#6E6A66] border border-[#E5E0D8]'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            {/* 4 Summary Metric Cards for this State */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FAF5FF] border border-[#EBE3FC] flex items-center justify-center shrink-0">
                  <span className="text-[#6D28D9] font-bold text-lg">₹</span>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#1A1615]">{currentState.revenueFormatted}</div>
                  <div className="text-[11px] text-[#6E6A66] font-medium">Total Revenue</div>
                </div>
              </div>

              <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#6D28D9]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#581C87]">
                    {currentState.cities.length || 8}
                  </div>
                  <div className="text-[11px] text-[#6B21A8] font-medium">Total Cities</div>
                </div>
              </div>

              <div className="bg-[#FFF5F5] border border-[#FFE4E6] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#FECDD3] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#BE123C]">1,620</div>
                  <div className="text-[11px] text-[#9F1239] font-medium">Total Orders</div>
                </div>
              </div>

              <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#0369A1]">202</div>
                  <div className="text-[11px] text-[#0284C7] font-medium">Avg Orders per Branch</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C877D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] placeholder-[#8C877D] focus:outline-hidden focus:border-[#2D124D] shadow-2xs"
                />
              </div>
              <button
                type="button"
                className="p-2.5 bg-white border border-[#E5E0D8] rounded-xl text-[#6E6A66] hover:bg-[#FAF8F5] shadow-2xs"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* City Cards Grid (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className="bg-white border border-[#EBE7DF] hover:border-[#D4A753] hover:shadow-md rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3.5 border-b border-[#F1EFEA]">
                      <div>
                        <h2 className="text-base font-bold text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                          {city.name}
                        </h2>
                        <span className="text-xs text-[#8C877D] font-medium">{city.branchesCount} branches</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#FAF8F5] group-hover:bg-[#FAF5FF] flex items-center justify-center text-[#8C877D] group-hover:text-[#2D124D] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Stats chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3.5">
                      <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-lg px-2.5 py-1 text-xs font-bold text-[#581C87] flex items-center gap-1.5">
                        <span className="text-[10px] text-[#7E22CE]">₹</span> {city.revenueFormatted}
                        <span className="text-[9px] font-semibold text-[#A855F7] tracking-wider uppercase ml-1">
                          REVENUE
                        </span>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1A1615] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8C877D]" /> {city.branchesCount}
                        <span className="text-[9px] font-semibold text-[#8C877D] tracking-wider uppercase ml-1">
                          TOTAL BRANCHES
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto text-xs font-semibold">
                        <span className="flex items-center gap-1 text-[#15803D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> {city.activeCount} Active
                        </span>
                        <span className="flex items-center gap-1 text-[#BE123C]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" /> {city.inactiveCount} Inactive
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Top 3 Campaigns & Orders by Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#F1EFEA]">
                      {/* Left: Top 3 Campaigns */}
                      <div>
                        <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2.5">
                          <Trophy className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>Top 3 Campaigns</span>
                          <span className="text-[10px] text-[#8C877D] font-normal">(completed redemptions)</span>
                        </div>
                        <div className="space-y-1.5">
                          {(city.topCampaigns && city.topCampaigns.length > 0
                            ? city.topCampaigns
                            : currentState.topCampaigns
                          ).map((camp, idx) => (
                            <div key={camp.id} className="flex items-center justify-between text-xs py-0.5">
                              <span className="text-[#6E6A66] font-medium flex items-center gap-1.5">
                                <span className="text-[10px] text-[#DB2777] font-bold">{idx + 1}</span>
                                {camp.name}
                              </span>
                              <span className="font-bold text-[#1A1615] font-mono">{camp.redemptions}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Orders by Time of Day */}
                      <div>
                        <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2.5">
                          <Clock className="w-3.5 h-3.5 text-[#6D28D9]" />
                          <span>Orders by Time of Day</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-[#FBF5FF] border border-[#F3E8FF] rounded-xl p-2 text-center">
                            <Sun className="w-3.5 h-3.5 text-[#7E22CE] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{city.morningOrders}</div>
                            <div className="text-[9px] text-[#7E22CE] font-medium">Morning</div>
                          </div>
                          <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-2 text-center">
                            <Sunset className="w-3.5 h-3.5 text-[#EA580C] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{city.afternoonOrders}</div>
                            <div className="text-[9px] text-[#C2410C] font-medium">Afternoon</div>
                          </div>
                          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-2 text-center">
                            <Moon className="w-3.5 h-3.5 text-[#0284C7] mx-auto mb-1" />
                            <div className="text-xs font-bold text-[#1A1615]">{city.eveningOrders}</div>
                            <div className="text-[9px] text-[#0369A1] font-medium">Evening</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Visitor Gender */}
                  <div className="mt-4 pt-4 border-t border-[#F1EFEA]">
                    <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2">
                      <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Visitor Gender</span>
                      <span className="text-[10px] text-[#8C877D] font-normal">(all recorded visits)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <GenderDonut
                        male={city.genderRatio.male}
                        female={city.genderRatio.female}
                        other={city.genderRatio.other}
                        size={48}
                        strokeWidth={6}
                      />
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-[#0284C7]">
                          <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Male {city.genderRatio.male}%
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#DB2777]">
                          <span className="w-2 h-2 rounded-full bg-[#DB2777]" /> Female {city.genderRatio.female}%
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#64748B]">
                          <span className="w-2 h-2 rounded-full bg-[#94A3B8]" /> Other {city.genderRatio.other}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* LEVEL 3: CITY BRANCHES VIEW */}
        {/* ======================================================== */}
        {level === 'branches' && (
          <>
            {/* Horizontal City Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {currentState.cities.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setSelectedCityId(ct.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                    ct.id === selectedCityId
                      ? 'bg-[#2D124D] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#6E6A66] border border-[#E5E0D8]'
                  }`}
                >
                  {ct.name}, {currentState.name}
                </button>
              ))}
            </div>

            {/* 4 Summary Cards for this City */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FAF5FF] border border-[#EBE3FC] flex items-center justify-center shrink-0">
                  <span className="text-[#6D28D9] font-bold text-lg">₹</span>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#1A1615]">{currentCity.revenueFormatted}</div>
                  <div className="text-[11px] text-[#6E6A66] font-medium">Total Revenue</div>
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#BBF7D0] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#15803D]">
                    {currentCity.branches.length || currentCity.branchesCount}
                  </div>
                  <div className="text-[11px] text-[#166534] font-medium">Total Branches</div>
                </div>
              </div>

              <div className="bg-[#FFF5F5] border border-[#FFE4E6] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#FECDD3] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#BE123C]">{currentCity.totalOrders}</div>
                  <div className="text-[11px] text-[#9F1239] font-medium">Total Orders</div>
                </div>
              </div>

              <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5 text-[#6D28D9]" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[#581C87]">
                    {currentCity.avgOrdersPerBranch}
                  </div>
                  <div className="text-[11px] text-[#6B21A8] font-medium">Avg Orders per Branch</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C877D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search branches or managers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] placeholder-[#8C877D] focus:outline-hidden focus:border-[#2D124D] shadow-2xs"
                />
              </div>
              <button
                type="button"
                className="p-2.5 bg-white border border-[#E5E0D8] rounded-xl text-[#6E6A66] hover:bg-[#FAF8F5] shadow-2xs"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Branch Cards (Full-Width Horizontal Cards) */}
            <div className="space-y-4">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch)}
                  className="bg-white border border-[#EBE7DF] hover:border-[#D4A753] hover:shadow-md rounded-2xl p-5 transition-all cursor-pointer group space-y-4"
                >
                  {/* Top: Photo, Name, Manager, Status */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E5E0D8]">
                        <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white p-0.5 rounded-sm">
                          <Store className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                            {branch.name}
                          </h2>
                        </div>
                        <p className="text-xs text-[#6E6A66] font-medium mt-0.5">
                          {branch.address} • Manager: <span className="text-[#1A1615] font-semibold">{branch.manager}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                          branch.status === 'Active'
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                            : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            branch.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                          }`}
                        />
                        {branch.status}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#FAF8F5] group-hover:bg-[#FAF5FF] flex items-center justify-center text-[#8C877D] group-hover:text-[#2D124D] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* 5 Metric Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {/* Revenue */}
                    <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7E22CE]">
                        <span>₹</span> Revenue
                      </div>
                      <div className="text-sm font-bold text-[#1A1615] mt-0.5">{branch.revenueFormatted}</div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-[#F0F7FF] border border-[#E0F0FE] rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0369A1]">
                        <ShoppingBag className="w-3 h-3" /> Total Orders
                      </div>
                      <div className="text-sm font-bold text-[#1A1615] mt-0.5">{branch.totalOrders}</div>
                    </div>

                    {/* Morning */}
                    <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7E22CE]">
                        <Sun className="w-3 h-3" /> Morning
                      </div>
                      <div className="text-sm font-bold text-[#1A1615] mt-0.5">{branch.morningOrders}</div>
                    </div>

                    {/* Afternoon */}
                    <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#C2410C]">
                        <Sunset className="w-3 h-3" /> Afternoon
                      </div>
                      <div className="text-sm font-bold text-[#1A1615] mt-0.5">{branch.afternoonOrders}</div>
                    </div>

                    {/* Evening */}
                    <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl px-3 py-2 col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0284C7]">
                        <Moon className="w-3 h-3" /> Evening
                      </div>
                      <div className="text-sm font-bold text-[#1A1615] mt-0.5">{branch.eveningOrders}</div>
                    </div>
                  </div>

                  {/* Bottom: Top 3 Campaigns & Visitor Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#F1EFEA]">
                    {/* Left: Top 3 Campaigns */}
                    <div>
                      <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2">
                        <Trophy className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Top 3 Campaigns</span>
                        <span className="text-[10px] text-[#8C877D] font-normal">(completed redemptions)</span>
                      </div>
                      <div className="space-y-1">
                        {branch.topCampaigns.map((camp, idx) => (
                          <div key={camp.id} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-[#6E6A66] font-medium flex items-center gap-1.5">
                              <span className="text-[10px] text-[#DB2777] font-bold">{idx + 1}</span>
                              {camp.name}
                            </span>
                            <span className="font-bold text-[#1A1615] font-mono">{camp.redemptions}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Visitor Gender */}
                    <div>
                      <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5 mb-2">
                        <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Visitor Gender</span>
                        <span className="text-[10px] text-[#8C877D] font-normal">(all recorded visits)</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <GenderDonut
                          male={branch.genderRatio.male}
                          female={branch.genderRatio.female}
                          other={branch.genderRatio.other}
                          size={46}
                          strokeWidth={6}
                        />
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="bg-[#F0F9FF] border border-[#E0F2FE] text-[#0284C7] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                            ♂ Male {branch.genderRatio.male}%
                          </span>
                          <span className="bg-[#FDF2F8] border border-[#FCE7F3] text-[#DB2777] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                            ♀ Female {branch.genderRatio.female}%
                          </span>
                          <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                            ⚪ Other {branch.genderRatio.other}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* LEVEL 4: BRANCH DETAILS VIEW */}
        {/* ======================================================== */}
        {level === 'details' && currentBranch && (
          <div className="space-y-6">
            {/* Top Hero Card */}
            <div className="bg-white border border-[#EBE7DF] rounded-3xl p-5 sm:p-6 shadow-2xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Photo Banner */}
                <div className="lg:col-span-4 h-48 rounded-2xl overflow-hidden border border-[#E5E0D8] relative group">
                  <img
                    src={currentBranch.image}
                    alt={currentBranch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-sm">
                    <Store className="w-3.5 h-3.5" />
                    <span>{currentBranch.mall || currentBranch.shortName}</span>
                  </div>
                </div>

                {/* Branch Info / Meta */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-[#1A1615]">{currentBranch.shortName}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        currentBranch.status === 'Active'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                          : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentBranch.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}
                      />
                      {currentBranch.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#6E6A66]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8C877D] shrink-0" />
                      <span>{currentBranch.fullAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#8C877D] shrink-0" />
                      <span>
                        Manager: <strong className="text-[#1A1615]">{currentBranch.manager}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#8C877D] shrink-0" />
                      <span>{currentBranch.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Map Preview Card */}
                <div className="lg:col-span-3 bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#D4A753] rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between h-full min-h-[140px]">
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-full bg-[#2D124D] text-white flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C877D] group-hover:text-[#2D124D] transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1615] line-clamp-2">{currentBranch.fullAddress}</div>
                    <div className="text-[10px] text-[#8C877D] font-medium mt-1 flex items-center gap-1">
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Overview, Performance, Campaigns, Settings) */}
            <div className="flex items-center gap-2 border-b border-[#E8E4DD] pb-3">
              {(['overview', 'performance', 'campaigns', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    detailTab === tab
                      ? 'bg-[#2D124D] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#6E6A66] border border-[#E5E0D8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {detailTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Reported Revenue */}
                  <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center">
                        <span className="text-[#6D28D9] font-bold text-sm">₹</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C877D]" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold tracking-tight text-[#1A1615]">
                        {currentBranch.revenueFormatted}
                      </div>
                      <div className="text-[11px] text-[#6E6A66] font-medium mt-0.5">Reported Revenue</div>
                      <div className="text-[10px] text-[#15803D] font-bold mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> {currentBranch.revenueGrowth || '+12.4% vs last mo'}
                      </div>
                    </div>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C877D]" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold tracking-tight text-[#1A1615]">{currentBranch.totalOrders}</div>
                      <div className="text-[11px] text-[#6E6A66] font-medium mt-0.5">Total Orders</div>
                      <div className="text-[10px] text-[#15803D] font-bold mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> {currentBranch.ordersGrowth || '+8.1% vs last mo'}
                      </div>
                    </div>
                  </div>

                  {/* Avg. Order Value */}
                  <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF5F5] border border-[#FFE4E6] flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-[#E11D48]" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C877D]" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold tracking-tight text-[#1A1615]">
                        ₹{currentBranch.avgOrderValue}
                      </div>
                      <div className="text-[11px] text-[#6E6A66] font-medium mt-0.5">Avg. Order Value</div>
                      <div className="text-[10px] text-[#6D28D9] font-bold mt-1.5">
                        {currentBranch.avgOrderValueTarget || 'Stable • ₹500 target'}
                      </div>
                    </div>
                  </div>

                  {/* Customer Footfall */}
                  <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#0284C7]" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C877D]" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold tracking-tight text-[#1A1615]">{currentBranch.footfall}</div>
                      <div className="text-[11px] text-[#6E6A66] font-medium mt-0.5">Customer Footfall</div>
                      <div className="text-[10px] text-[#0284C7] font-bold mt-1.5">
                        {currentBranch.footfallGrowth || '+15 new guests'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders by Time of Day */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#6D28D9]" />
                      <h3 className="text-sm font-bold text-[#1A1615]">Orders by Time of Day</h3>
                    </div>
                    <span className="text-xs text-[#8C877D] font-medium bg-[#FAF8F5] border border-[#E5E0D8] px-2.5 py-1 rounded-lg">
                      {timeRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 text-center">
                      <Sun className="w-5 h-5 text-[#7E22CE] mx-auto mb-1.5" />
                      <div className="text-xl font-bold text-[#1A1615]">{currentBranch.morningOrders}</div>
                      <div className="text-xs font-semibold text-[#6E6A66] mt-0.5">Morning orders</div>
                      <div className="text-[10px] text-[#7E22CE] font-bold mt-1">
                        {currentBranch.morningPct || 37}% of total
                      </div>
                    </div>

                    <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-4 text-center">
                      <Sunset className="w-5 h-5 text-[#EA580C] mx-auto mb-1.5" />
                      <div className="text-xl font-bold text-[#1A1615]">{currentBranch.afternoonOrders}</div>
                      <div className="text-xs font-semibold text-[#6E6A66] mt-0.5">Afternoon orders</div>
                      <div className="text-[10px] text-[#C2410C] font-bold mt-1">
                        {currentBranch.afternoonPct || 34}% of total
                      </div>
                    </div>

                    <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-4 text-center">
                      <Moon className="w-5 h-5 text-[#0284C7] mx-auto mb-1.5" />
                      <div className="text-xl font-bold text-[#1A1615]">{currentBranch.eveningOrders}</div>
                      <div className="text-xs font-semibold text-[#6E6A66] mt-0.5">Evening orders</div>
                      <div className="text-[10px] text-[#0284C7] font-bold mt-1">
                        {currentBranch.eveningPct || 28}% of total
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top 3 Campaigns Card with progress bars */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#B45309]" />
                      <h3 className="text-sm font-bold text-[#1A1615]">Top 3 Campaigns</h3>
                      <span className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Active
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate?.('/campaigns' as any)}
                      className="text-xs text-[#2D124D] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#8C877D]">Completed redemptions & impact</p>

                  <div className="space-y-4 pt-1">
                    {currentBranch.topCampaigns.map((camp, idx) => {
                      const maxRedemptions = 100;
                      const pct = Math.min(100, Math.round((camp.redemptions / maxRedemptions) * 100));
                      return (
                        <div key={camp.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-[#FAF5FF] text-[#DB2777] font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-[#1A1615]">{camp.name}</span>
                              {camp.discount && (
                                <span className="bg-[#F0FDF4] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {camp.discount}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[#1A1615] font-mono">{camp.redemptions} used</span>
                              {camp.impact && (
                                <span className="text-[10px] text-[#15803D] font-medium ml-2">({camp.impact})</span>
                              )}
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#F1EFEA]">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: camp.barColor || (idx === 1 ? '#F43F5E' : '#8B5CF6')
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2-Column Bottom Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Visitor Gender & QR Codes */}
                  <div className="space-y-6">
                    {/* Visitor Gender with Center Text */}
                    <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[#1A1615]">Visitor Gender</h3>
                          <p className="text-xs text-[#8C877D]">All recorded visits</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8C877D]" />
                      </div>

                      <div className="flex items-center justify-around py-2">
                        <GenderDonut
                          male={currentBranch.genderRatio.male}
                          female={currentBranch.genderRatio.female}
                          other={currentBranch.genderRatio.other}
                          size={110}
                          strokeWidth={14}
                          centerText={{
                            main: currentBranch.footfall.toString(),
                            sub: 'Total Visits'
                          }}
                        />

                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                            <span className="font-medium text-[#6E6A66]">Male:</span>
                            <span className="font-bold text-[#1A1615]">
                              {currentBranch.genderRatio.male}% ({currentBranch.genderRatio.maleCount || 84})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#DB2777]" />
                            <span className="font-medium text-[#6E6A66]">Female:</span>
                            <span className="font-bold text-[#1A1615]">
                              {currentBranch.genderRatio.female}% ({currentBranch.genderRatio.femaleCount || 93})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                            <span className="font-medium text-[#6E6A66]">Other / Unknown:</span>
                            <span className="font-bold text-[#1A1615]">
                              {currentBranch.genderRatio.other}% ({currentBranch.genderRatio.otherCount || 9})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR Codes & Tables */}
                    <div
                      onClick={() => onNavigate?.('/qr-codes' as any)}
                      className="bg-white border border-[#EBE7DF] hover:border-[#D4A753] rounded-2xl p-5 shadow-2xs space-y-4 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A1615] group-hover:text-[#2D124D]">
                          QR Codes & Tables
                        </h3>
                        <ChevronRight className="w-4 h-4 text-[#8C877D] group-hover:text-[#2D124D]" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-[#E9D5FF] flex items-center justify-center shrink-0">
                            <QrCode className="w-5 h-5 text-[#6D28D9]" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#1A1615]">{currentBranch.activeQrCodes || 3}</div>
                            <div className="text-[10px] text-[#6E6A66] font-medium">Active QR Codes</div>
                          </div>
                        </div>

                        <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center shrink-0">
                            <Utensils className="w-5 h-5 text-[#8C877D]" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#1A1615]">{currentBranch.tables || 12} Tables</div>
                            <div className="text-[10px] text-[#6E6A66] font-medium">
                              {currentBranch.counters || 2} counters
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Branch Info & Recent Activity */}
                  <div className="space-y-6">
                    {/* Branch Information */}
                    <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A1615]">Branch Information</h3>
                        <ChevronRight className="w-4 h-4 text-[#8C877D]" />
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-start justify-between pb-2 border-b border-[#F1EFEA]">
                          <span className="text-[#6E6A66] font-medium">Address</span>
                          <span className="font-semibold text-[#1A1615] text-right max-w-[240px]">
                            {currentBranch.fullAddress}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1EFEA]">
                          <span className="text-[#6E6A66] font-medium">Operating Hours</span>
                          <span className="font-semibold text-[#1A1615]">
                            {currentBranch.operatingHours || '11:00 AM - 11:00 PM'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1EFEA]">
                          <span className="text-[#6E6A66] font-medium">Branch Manager</span>
                          <span className="font-semibold text-[#1A1615]">
                            {currentBranch.manager} • {currentBranch.phone}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[#6E6A66] font-medium">Location Node</span>
                          <span className="bg-[#FAF5FF] text-[#6D28D9] border border-[#E9D5FF] px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                            {currentBranch.shortName}, {currentBranch.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A1615]">Recent Activity</h3>
                        <button
                          onClick={() => onNavigate?.('/settings/audit' as any)}
                          className="text-xs text-[#2D124D] font-bold hover:underline cursor-pointer"
                        >
                          View All &gt;
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        {(currentBranch.recentActivity || [
                          { type: 'redemption', title: 'Welcome Special redeemed', timeAgo: '2 hours ago' },
                          { type: 'order', title: 'Order #320 placed', timeAgo: '4 hours ago' },
                          { type: 'customer', title: 'Customer registered via QR', timeAgo: '6 hours ago' }
                        ]).map((act, i) => (
                          <div key={i} className="flex items-center justify-between pb-2 border-b border-[#F1EFEA] last:border-b-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  act.type === 'redemption'
                                    ? 'bg-[#10B981]'
                                    : act.type === 'order'
                                    ? 'bg-[#EF4444]'
                                    : 'bg-[#6366F1]'
                                }`}
                              />
                              <span className="font-bold text-[#1A1615] capitalize">{act.type}:</span>
                              <span className="text-[#6E6A66] font-medium">{act.title}</span>
                            </div>
                            <span className="text-[10px] text-[#8C877D] font-mono">{act.timeAgo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PERFORMANCE */}
            {detailTab === 'performance' && (
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1A1615]">Monthly Performance Trends</h3>
                    <p className="text-xs text-[#6E6A66]">Comparing revenue, transactions, and repeat customers</p>
                  </div>
                  <span className="text-xs bg-[#FAF5FF] text-[#6D28D9] font-bold px-3 py-1.5 rounded-xl border border-[#F3E8FF]">
                    Year: 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                    <div className="text-xs text-[#6E6A66] font-semibold">Total Revenue (YTD)</div>
                    <div className="text-xl font-bold text-[#1A1615] mt-1">₹14,80,000</div>
                    <div className="text-[10px] text-[#15803D] font-bold mt-1">+18.5% YoY</div>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                    <div className="text-xs text-[#6E6A66] font-semibold">Average Basket Size</div>
                    <div className="text-xl font-bold text-[#1A1615] mt-1">₹507</div>
                    <div className="text-[10px] text-[#0284C7] font-bold mt-1">Healthy Conversion</div>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                    <div className="text-xs text-[#6E6A66] font-semibold">Retention Rate</div>
                    <div className="text-xl font-bold text-[#1A1615] mt-1">68.2%</div>
                    <div className="text-[10px] text-[#6D28D9] font-bold mt-1">Top Tier Branch</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CAMPAIGNS */}
            {detailTab === 'campaigns' && (
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1A1615]">Active Campaigns at {currentBranch.shortName}</h3>
                  <button
                    onClick={() => onNavigate?.('/campaigns/new' as any)}
                    className="text-xs bg-[#2D124D] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#3E1A68]"
                  >
                    + Assign Campaign
                  </button>
                </div>
                <div className="space-y-3">
                  {currentBranch.topCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#1A1615]">{camp.name}</div>
                        <div className="text-xs text-[#6E6A66] mt-0.5">
                          Discount: <strong className="text-[#1A1615]">{camp.discount || 'Special Offer'}</strong> • Status: Active
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#1A1615]">{camp.redemptions} Redemptions</div>
                        <div className="text-[10px] text-[#15803D] font-bold">{camp.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SETTINGS */}
            {detailTab === 'settings' && (
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 shadow-2xs space-y-6">
                <h3 className="text-base font-bold text-[#1A1615]">Branch Configuration & Hardware</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#E5E0D8] space-y-2">
                    <span className="font-bold text-[#1A1615]">POS & Hardware Enclave</span>
                    <p className="text-[#6E6A66]">Connected to POS terminal node #01 with live sync.</p>
                    <div className="pt-2">
                      <span className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-1 rounded-md font-bold text-[10px]">
                        ● 4 POS Terminals Online
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#E5E0D8] space-y-2">
                    <span className="font-bold text-[#1A1615]">Operating Schedule</span>
                    <p className="text-[#6E6A66]">{currentBranch.operatingHours || '11:00 AM - 11:00 PM (Mon-Sun)'}</p>
                    <button
                      onClick={() => setIsEditBranchModalOpen(true)}
                      className="text-xs text-[#2D124D] font-bold hover:underline"
                    >
                      Update Schedule &gt;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD BRANCH */}
      {/* ======================================================== */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E0D8] animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-[#E5E0D8] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A1615]">Add New Branch</h3>
                <p className="text-xs text-[#6E6A66]">Register an outlet into your merchant hierarchy.</p>
              </div>
              <button
                onClick={() => setIsAddBranchModalOpen(false)}
                className="text-[#8C877D] hover:text-[#1A1615] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Noida — Sector 18"
                  value={newBranchForm.name}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">State</label>
                  <select
                    value={newBranchForm.state}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, state: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#1A1615] focus:outline-hidden"
                  >
                    {hierarchyData.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.city}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="e.g. Shop 12, Logix Mall, Sector 18, Noida"
                  value={newBranchForm.address}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Manager Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rohit Mehta"
                    value={newBranchForm.manager}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, manager: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newBranchForm.phone}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5E0D8] text-[#6E6A66] font-bold rounded-xl hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D124D] hover:bg-[#3E1A68] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT BRANCH */}
      {/* ======================================================== */}
      {isEditBranchModalOpen && currentBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E5E0D8] animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-[#E5E0D8] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A1615]">Edit Branch Details</h3>
                <p className="text-xs text-[#6E6A66]">{currentBranch.name}</p>
              </div>
              <button
                onClick={() => setIsEditBranchModalOpen(false)}
                className="text-[#8C877D] hover:text-[#1A1615] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Branch Name</label>
                <input
                  type="text"
                  defaultValue={currentBranch.name}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Manager</label>
                <input
                  type="text"
                  defaultValue={currentBranch.manager}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Contact Phone</label>
                <input
                  type="text"
                  defaultValue={currentBranch.phone}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase tracking-wider mb-1">Operating Hours</label>
                <input
                  type="text"
                  defaultValue={currentBranch.operatingHours || '11:00 AM - 11:00 PM'}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditBranchModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5E0D8] text-[#6E6A66] font-bold rounded-xl hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditBranchModalOpen(false)}
                  className="px-5 py-2 bg-[#2D124D] hover:bg-[#3E1A68] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesPage;
