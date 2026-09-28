import React, { useState, useEffect } from 'react';
import {
  Store,
  Users,
  Banknote,
  Activity,
  Radio,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronDown,
  Search,
  Download,
  Plus,
  MoreVertical,
  Sliders,
  Edit2,
  X,
  Printer,
  ShieldCheck,
  Coffee,
  Laptop,
  QrCode,
  Sparkles,
  Table as TableIcon,
  Map,
  Check,
  Trash2,
  RotateCw,
  Wine,
  Tent,
  Phone,
  Mail
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';
import { INITIAL_OUTLETS } from '../data/outletsData';
import apiClient from '../api/apiClient';

interface BranchesPageProps {
  onNavigate?: (route: NavRoute) => void;
  onBranchSelect?: (branchName: string) => void;
  outlets?: OutletsData[];
  onAddBranch?: (branch: OutletsData) => void;
  selectedOutletId?: string;
  onSelectOutletId?: (id: string) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = ({
  onNavigate,
  onBranchSelect,
  outlets: externalOutlets,
  onAddBranch: externalOnAddBranch,
  selectedOutletId: externalSelectedOutletId,
  onSelectOutletId: externalOnSelectOutletId,
}) => {
  const [internalOutlets, setInternalOutlets] = useState<OutletsData[]>(externalOutlets || INITIAL_OUTLETS);
  const outlets = internalOutlets;
  const setOutlets = (newOutlets: OutletsData[]) => {
    setInternalOutlets(newOutlets);
  };

  const [internalSelectedOutletId, setInternalSelectedOutletId] = useState<string>('downtown');
  const selectedOutletId = externalSelectedOutletId || internalSelectedOutletId;
  const setSelectedOutletId = (id: string) => {
    if (externalOnSelectOutletId) {
      externalOnSelectOutletId(id);
    }
    setInternalSelectedOutletId(id);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All West Coast');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'revenue-desc' | 'revenue-asc' | 'name-asc' | 'name-desc'>('revenue-desc');
  const [activeDropdown, setActiveDropdown] = useState<'region' | 'status' | 'sort' | null>(null);

  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await apiClient.get('merchant/branches');
        const branchList = response.data.data?.data || response.data.data || response.data;
        if (Array.isArray(branchList)) {
          const mappedOutlets: OutletsData[] = branchList.map((branch: any) => ({
            id: branch.id?.toString() || `branch-${Date.now()}`,
            name: branch.name || '',
            shortName: branch.code || branch.name?.split(' ')[0] || '',
            type: (branch.status === 'active' ? 'Active' : 'Active') as 'Active',
            address: branch.address || 'No Address',
            manager: branch.manager?.name || (branch.manager_id ? `Manager ${branch.manager_id}` : 'Unassigned'),
            managerAvatar: branch.manager?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            terminalsActive: 2,
            membersLinked: '0 Linked',
            volume30d: '₹0',
            hours: 'Mon–Sat 9:00 AM – 5:00 PM',
            timezone: branch.timezone || 'UTC',
            currency: 'INR ($)',
            taxProfile: 'Default',
            contactEmail: branch.contact_email || '',
            contactPhone: branch.contact_phone || '',
            dailyFootfall: branch.daily_footfall || branch.operating_details?.footfall || 0,
            hardware: [],
            loyaltyRules: {
              baseMultiplier: '1.0× (Standard)',
              specialRuleName: 'Welcome Month Bonus',
              specialRuleTime: 'All day during launch',
              specialRuleBadge: 'Active Now',
              specialMultiplier: '2.0× Double',
              exclusivePerk: 'Complimentary Single Origin upgrade',
            },
          }));
          setOutlets(mappedOutlets);
          if (mappedOutlets.length > 0 && !externalSelectedOutletId) {
            setInternalSelectedOutletId(mappedOutlets[0].id);
          }
        }
      } catch (error) {
        // Fallback to initial if fail
      }
    };
    
    loadBranches();
  }, [externalSelectedOutletId]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inspectorVisible, setInspectorVisible] = useState(true);

  // New Branch Form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newManager, setNewManager] = useState('');

  const [editBranchName, setEditBranchName] = useState('SoHo Roastery & Tasting Salon');
  const [editOutletCode, setEditOutletCode] = useState('REV-NYC-04');
  const [editVenueProfile, setEditVenueProfile] = useState<'roastery' | 'boutique' | 'tasting' | 'popup'>('roastery');
  const [editStreetAddress, setEditStreetAddress] = useState('482 Broome Street, Floor 1');
  const [editCity, setEditCity] = useState('New York');
  const [editState, setEditState] = useState('NY');
  const [editZipCode, setEditZipCode] = useState('10013');
  const [editCountry, setEditCountry] = useState('United States');
  const [editSelectedDays, setEditSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [editOpenTime, setEditOpenTime] = useState('07:30 AM');
  const [editCloseTime, setEditCloseTime] = useState('08:00 PM');
  const [editPhone, setEditPhone] = useState('+1 (212) 555-0198');
  const [editEmail, setEditEmail] = useState('soho.roastery@revia.coffee');

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleEditDay = (day: string) => {
    if (editSelectedDays.includes(day)) {
      if (editSelectedDays.length > 1) {
        setEditSelectedDays(editSelectedDays.filter((d) => d !== day));
      }
    } else {
      setEditSelectedDays([...editSelectedDays, day]);
    }
  };

  const handleEditRegenerateCode = () => {
    const prefixes = ['NYC', 'SOHO', 'MANH', 'BKLYN', 'WST'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = String(Math.floor(Math.random() * 90) + 10);
    setEditOutletCode(`REV-${randomPrefix}-${randomNum}`);
  };

  const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  // Populate edit modal state when opened
  useEffect(() => {
    if (isEditModalOpen && selectedOutlet) {
      setEditBranchName(selectedOutlet.name);
      setEditOutletCode(selectedOutlet.id || 'REV-NYC-04');
      setEditVenueProfile('roastery');
      const parts = selectedOutlet.address.split(', ');
      setEditStreetAddress(parts[0] || '');
      setEditCity(parts[1] || '');
      const stateZip = (parts[2] || '').split(' ');
      setEditState(stateZip[0] || '');
      setEditZipCode(stateZip[1] || '');
      setEditCountry('United States');
      
      setEditEmail(selectedOutlet.contactEmail || 'soho.roastery@revia.coffee');
      setEditPhone(selectedOutlet.contactPhone || '+1 (212) 555-0198');
    }
  }, [isEditModalOpen, selectedOutlet]);

  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [isDeletingBranch, setIsDeletingBranch] = useState(false);

  const handleDeleteBranch = async (id: string) => {
    setIsDeletingBranch(true);
    try {
      await apiClient.delete(`merchant/branches/${id}`);
      setOutlets(outlets.filter(o => o.id !== id));
      if (selectedOutletId === id) {
        const remaining = outlets.filter(o => o.id !== id);
        if (remaining.length > 0) {
          setSelectedOutletId(remaining[0].id);
        } else {
          setInspectorVisible(false);
        }
      }
      setBranchToDelete(null);
      showToast('Branch deleted successfully.');
    } catch (error: any) {
      showToast(`Error: ${error.response?.data?.message || 'Failed to delete branch'}`);
    } finally {
      setIsDeletingBranch(false);
    }
  };

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredOutlets = outlets.filter((outlet) => {
    const matchesSearch =
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.manager.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      regionFilter === 'All West Coast' ||
      outlet.address.toLowerCase().includes(regionFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && (outlet.type === 'Active' || outlet.type === 'Primary Hub')) ||
      outlet.type.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesRegion && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else {
      const parseRev = (rev: string) => parseFloat(rev.replace(/[^0-9.-]+/g, ''));
      const revA = parseRev(a.volume30d);
      const revB = parseRev(b.volume30d);
      return sortBy === 'revenue-desc' ? revB - revA : revA - revB;
    }
  });

  const handleSelectOutlet = (id: string, name: string) => {
    setSelectedOutletId(id);
    setInspectorVisible(true);
    if (onBranchSelect) {
      onBranchSelect(name);
    }
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    try {
      const response = await apiClient.post('merchant/branches', {
        name: newName,
        code: newName.substring(0, 5).toUpperCase(),
        address: newAddress || 'N/A',
        contact_email: 'new@branch.com',
        contact_phone: '0000000000',
        timezone: 'UTC',
        status: 'active'
      });
      const data = response.data.data || response.data;

      const newBranch: OutletsData = {
        id: data.id?.toString() || `branch-${Date.now()}`,
        name: data.name || newName,
        shortName: data.code || newName.split(' ')[0],
        type: (data.status === 'active' ? 'Active' : 'Active') as 'Active',
        address: data.address || newAddress || '',
        manager: newManager || 'Alex Rivera',
        managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        terminalsActive: 2,
        membersLinked: '0 Linked',
        volume30d: '₹0',
        hours: 'Mon–Sat 9:00 AM – 5:00 PM',
        timezone: data.timezone || 'UTC',
        currency: 'INR ($)',
        taxProfile: 'Default',
        contactEmail: data.contact_email || 'new@branch.com',
        contactPhone: data.contact_phone || '0000000000',
        dailyFootfall: data.daily_footfall || 0,
        hardware: [],
        loyaltyRules: {
          baseMultiplier: '1.0× (Standard)',
          specialRuleName: 'Welcome Month Bonus',
          specialRuleTime: 'All day during launch',
          specialRuleBadge: 'Active Now',
          specialMultiplier: '2.0× Double',
          exclusivePerk: 'Complimentary Single Origin upgrade',
        },
      };

      if (externalOnAddBranch) {
        externalOnAddBranch(newBranch);
      } else {
        setOutlets([...outlets, newBranch]);
      }
      setSelectedOutletId(newBranch.id);
      setIsAddModalOpen(false);
      setNewName('');
      setNewAddress('');
      setNewManager('');
      showToast('Branch added successfully.');
    } catch (error: any) {
      showToast(`Error adding branch: ${error.response?.data?.message || error.message}`);
    }
  };

  // Calculate dynamic metrics
  const activeCount = outlets.length;
  const totalFootfall = outlets.reduce((sum, o) => sum + (o.dailyFootfall || 0), 0);
  
  const totalRevenue = outlets.reduce((sum, o) => {
    const val = parseFloat(o.volume30d.replace(/[^0-9.-]+/g, '')) || 0;
    return sum + val;
  }, 0);
  const avgRevenue = activeCount > 0 ? Math.round(totalRevenue / activeCount) : 0;
  const totalTerminals = outlets.reduce((sum, o) => sum + (o.terminalsActive || 0), 0);

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5 text-[#1A1615]">
      {/* Bottom Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
            Branch &amp; Outlets Management
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Export Ledger button */}
          <button
            onClick={() => showToast('Generating cryptographic ledger snapshot (CSV / PDF)...')}
            className="bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] text-[#1A1615] rounded-lg px-4 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#5C554E]" />
            <span>Export Ledger</span>
          </button>

          {/* + Add New Branch button (brand gold gradient) */}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('/branches/new');
              } else {
                setIsAddModalOpen(true);
              }
            }}
            className="bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg px-4 py-2 text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ACTIVE OUTLETS */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              ACTIVE OUTLETS
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] border border-[#E5D7BE] flex items-center justify-center text-[#B38637]">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1A1615] tracking-tight">{outlets.length}</span>
              <span className="text-sm font-medium text-[#7C746C]">Operating</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F5F2EC] flex items-center justify-between text-[11px]">
              <span className="text-[#7C746C] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B38637]" />
                {activeCount === 0 ? 'No active outlets' : 'All setup complete'}
              </span>
              <span className="text-[#B38637] font-semibold">{activeCount > 0 ? '+1 planned' : 'Plan your first'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: TOTAL DAILY FOOTFALL */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              TOTAL DAILY FOOTFALL
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F0] border border-[#CEEBD9] flex items-center justify-center text-[#15803D]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1A1615] tracking-tight">{totalFootfall.toLocaleString()}</span>
              <span className="text-sm font-medium text-[#7C746C]">visits</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F5F2EC] flex items-center justify-between text-[11px]">
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${totalFootfall > 0 ? 'bg-[#EBF7F0] text-[#15803D]' : 'bg-neutral-100 text-neutral-500'}`}>
                {totalFootfall > 0 ? '↑ +14.2%' : '0%'}
              </span>
              <span className="text-[#7C746C]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Card 3: NETWORK GROSS REVENUE */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              NETWORK GROSS REVENUE
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] border border-[#E5D7BE] flex items-center justify-center text-[#B38637]">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#1A1615] tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F5F2EC] flex items-center justify-between text-[11px]">
              <span className="text-[#7C746C]">Avg. ₹{avgRevenue.toLocaleString()} / outlet</span>
              <span className="font-bold text-[#1A1615]">30D Window</span>
            </div>
          </div>
        </div>

        {/* Card 4: POS & SCANNER HEALTH */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              POS &amp; SCANNER HEALTH
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F0] border border-[#CEEBD9] flex items-center justify-center text-[#15803D]">
              <Radio className="w-4 h-4 text-[#15803D]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#15803D] tracking-tight">{activeCount > 0 ? '100%' : '0%'}</span>
              <span className="text-sm font-medium text-[#7C746C]">{activeCount > 0 ? 'Online' : 'No Data'}</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F5F2EC] flex items-center justify-between text-[11px]">
              <span className="text-[#7C746C] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                {totalTerminals}/{totalTerminals} Terminals connected
              </span>
              <span className="text-[#15803D] font-medium ml-2">0 latency drops</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
          <input
            type="text"
            placeholder="Filter outlets by name, city, or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] placeholder:text-[#8C827A] focus:outline-none focus:border-[#B38637] transition-colors shadow-2xs"
          />
        </div>

        {/* Right: Dropdowns and View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'region' ? null : 'region'); }}
              className="flex items-center justify-between w-full sm:w-auto bg-white border border-[#EAE6E1] rounded-lg px-4 py-2 text-[13px] font-medium text-[#1A1615] shadow-2xs hover:border-[#D4A753] min-w-[150px] cursor-pointer"
            >
              <span>{`Region: ${regionFilter}`}</span>
              <ChevronDown className={`w-4 h-4 text-[#8C827A] transition-transform ${activeDropdown === 'region' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'region' && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-[#EFECE6] rounded-md shadow-xl z-50 overflow-hidden text-left">
                {[
                  { value: 'All West Coast', label: 'Region: All West Coast' },
                  { value: 'Los Angeles', label: 'Region: Los Angeles' },
                  { value: 'San Francisco', label: 'Region: San Francisco' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegionFilter(opt.value);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FAF8F5] cursor-pointer ${regionFilter === opt.value ? 'bg-[#FAF8F5] font-bold text-[#1A1615]' : 'font-medium text-[#1A1615]'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'status' ? null : 'status'); }}
              className="flex items-center justify-between w-full sm:w-auto bg-white border border-[#EAE6E1] rounded-lg px-4 py-2 text-[13px] font-medium text-[#1A1615] shadow-2xs hover:border-[#D4A753] min-w-[150px] cursor-pointer"
            >
              <span>{statusFilter === 'All' ? 'Status: All' : statusFilter === 'Active' ? `Status: Active (${outlets.length})` : 'Status: Maintenance'}</span>
              <ChevronDown className={`w-4 h-4 text-[#8C827A] transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'status' && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-[#EFECE6] rounded-md shadow-xl z-50 overflow-hidden text-left">
                {[
                  { value: 'All', label: 'Status: All' },
                  { value: 'Active', label: `Status: Active (${outlets.length})` },
                  { value: 'Maintenance', label: 'Status: Maintenance' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusFilter(opt.value);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FAF8F5] cursor-pointer ${statusFilter === opt.value ? 'bg-[#FAF8F5] font-bold text-[#1A1615]' : 'font-medium text-[#1A1615]'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'sort' ? null : 'sort'); }}
              className="flex items-center justify-between w-full sm:w-auto bg-white border border-[#EAE6E1] rounded-lg px-4 py-2 text-[13px] font-medium text-[#1A1615] shadow-2xs hover:border-[#D4A753] min-w-[180px] cursor-pointer"
            >
              <span>{
                sortBy === 'revenue-desc' ? 'Sort by: Revenue (High to Low)' :
                  sortBy === 'revenue-asc' ? 'Sort by: Revenue (Low to High)' :
                    sortBy === 'name-asc' ? 'Sort by: Name (A-Z)' :
                      'Sort by: Name (Z-A)'
              }</span>
              <Sliders className="w-4 h-4 text-[#8C827A]" />
            </button>
            {activeDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-56 bg-white border border-[#EFECE6] rounded-md shadow-xl z-50 overflow-hidden text-left">
                {[
                  { value: 'revenue-desc', label: 'Sort by: Revenue (High to Low)' },
                  { value: 'revenue-asc', label: 'Sort by: Revenue (Low to High)' },
                  { value: 'name-asc', label: 'Sort by: Name (A-Z)' },
                  { value: 'name-desc', label: 'Sort by: Name (Z-A)' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortBy(opt.value as any);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FAF8F5] cursor-pointer ${sortBy === opt.value ? 'bg-[#FAF8F5] font-bold text-[#1A1615]' : 'font-medium text-[#1A1615]'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          {/* <div className="flex items-center border border-[#EAE6E1] bg-white rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list'
                ? 'bg-[#FAF8F5] text-[#1A1615] font-semibold'
                : 'text-[#8C827A] hover:text-[#1A1615]'
                }`}
              title="List View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setViewMode('map');
                showToast('Interactive Map View: 3 Outlets mapped across Southern California.');
              }}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'map'
                ? 'bg-[#FAF8F5] text-[#1A1615] font-semibold'
                : 'text-[#8C827A] hover:text-[#1A1615]'
                }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Configured Outlets + Velocity Chart (8 cols or 7 cols) */}
        <div className={`${inspectorVisible ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-1.5 sm:gap-0">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Store className="w-4 h-4 text-[#B38637] shrink-0" />
              <h2 className="text-sm font-bold text-[#1A1615]">Configured Outlets</h2>
              <span className="bg-[#FAF8F5] text-[#7C746C] text-[10px] font-bold px-2 py-0.5 rounded border border-[#EAE6E1] whitespace-nowrap">
                {filteredOutlets.length} Visible
              </span>
            </div>
            <span className="text-[11px] text-[#8C827A]">
              Tap branch to inspect details
            </span>
          </div>

          {/* Branch Cards List */}
          <div className="space-y-3">
            {filteredOutlets.map((outlet) => {
              const isSelected = outlet.id === selectedOutletId;

              return (
                <div
                  key={outlet.id}
                  onClick={() => handleSelectOutlet(outlet.id, outlet.shortName)}
                  className={`bg-white border rounded-xl p-4 sm:p-5 transition-all cursor-pointer shadow-2xs ${isSelected
                    ? 'border-[#B38637] ring-1 ring-[#B38637]/30 shadow-xs'
                    : 'border-[#EAE6E1] hover:border-[#D4A753]'
                    }`}
                >
                  {/* Top Header of Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Left icon square */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${outlet.id === 'downtown'
                          ? 'bg-[#1A1615] text-[#D4A753]'
                          : outlet.id === 'northside'
                            ? 'bg-[#FAF8F5] border border-[#EAE6E1] text-[#1A1615]'
                            : 'bg-[#FAF8F5] border border-[#EAE6E1] text-[#1A1615]'
                          }`}
                      >
                        {outlet.id === 'westend' ? (
                          <Laptop className="w-5 h-5" />
                        ) : (
                          <Coffee className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-[#1A1615] truncate">
                            {outlet.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${outlet.type === 'Primary Hub'
                              ? 'bg-[#FAF6EE] text-[#9E782F] border border-[#E5D7BE]'
                              : 'bg-[#EBF7F0] text-[#15803D] border border-[#CEEBD9]'
                              }`}
                          >
                            {outlet.type}
                          </span>
                        </div>
                        <p className="text-xs text-[#7C746C] flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8C827A] shrink-0" />
                          <span className="truncate">{outlet.address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Top Right Action button */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBranchToDelete(outlet.id);
                        }}
                        className="bg-white hover:bg-[#FEE2E2] border border-[#EAE6E1] hover:border-[#DC2626] text-[#DC2626] p-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isSelected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOutlet(outlet.id, outlet.shortName);
                          }}
                          className="bg-[#B38637] hover:bg-[#A37837] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOutlet(outlet.id, outlet.shortName);
                          }}
                          className="bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] text-[#1A1615] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Stats Grid in Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3.5 border-t border-[#F5F2EC] text-xs">
                    {/* Manager */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                        MANAGER
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <img
                          src={outlet.managerAvatar}
                          alt={outlet.manager}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-[#EAE6E1]"
                        />
                        <span className="font-semibold text-[#1A1615] truncate">
                          {outlet.manager}
                        </span>
                      </div>
                    </div>

                    {/* Terminals */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                        TERMINALS
                      </span>
                      <div className="font-semibold text-[#1A1615] flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        <span>{outlet.terminalsActive} Active POS</span>
                      </div>
                    </div>

                    {/* Members */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                        MEMBERS
                      </span>
                      <div className="font-semibold text-[#1A1615] mt-1">
                        {outlet.membersLinked}
                      </div>
                    </div>

                    {/* 30D Volume */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C827A] block">
                        30D VOLUME
                      </span>
                      <div className="font-bold text-[#B38637] font-mono mt-1">
                        {outlet.volume30d}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Card: MULTI-UNIT DISTRIBUTION / Realtime Footfall Velocity */}
          <div className="bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block">
                  MULTI-UNIT DISTRIBUTION
                </span>
                <h3 className="text-base font-bold text-[#1A1615] mt-0.5">
                  Realtime Footfall Velocity
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7C746C]">
                <span className="w-2 h-2 rounded-full bg-[#B38637] animate-pulse" />
                <span>Live Telemetry</span>
              </div>
            </div>

            {/* Timestamps Row */}
            <div className="flex justify-between text-[11px] font-mono text-[#7C746C] px-2 pt-2">
              <span>07:00 AM</span>
              <span className="text-[#B38637] font-bold">11:30 AM (Peak Rush)</span>
              <span>03:30 PM</span>
              <span>08:00 PM</span>
            </div>

            {/* Smooth Wave Area Chart */}
            <div className="h-32 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A753" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#D4A753" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M 0 100 Q 120 95, 180 60 T 260 25 T 340 70 T 450 15 T 550 50 L 600 100 L 600 120 L 0 120 Z"
                  fill="url(#goldGradient)"
                />
                {/* Stroke Line */}
                <path
                  d="M 0 100 Q 120 95, 180 60 T 260 25 T 340 70 T 450 15 T 550 50 L 600 100"
                  fill="none"
                  stroke="#A37837"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Peak Rush Marker Dot at 11:30 AM */}
                <circle cx="260" cy="25" r="4.5" fill="#A37837" stroke="#FFF" strokeWidth="2" />
              </svg>
            </div>

            {/* Legend at bottom */}
            <div className="pt-2 border-t border-[#F5F2EC] flex flex-wrap items-center gap-5 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B38637]" />
                <span className="text-[#5C554E]">Downtown: <strong>812 visits</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                <span className="text-[#5C554E]">Northside: <strong>620 visits</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D3732]" />
                <span className="text-[#5C554E]">West End: <strong>410 visits</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: INSPECTING OUTLET Panel (5 cols) */}
        {inspectorVisible && selectedOutlet && (
          <div className="lg:col-span-5 bg-white border border-[#EAE6E1] rounded-xl p-5 shadow-2xs space-y-4 sticky top-16">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#F5F2EC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] border border-[#E5D7BE] flex items-center justify-center text-[#B38637]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block">
                    INSPECTING OUTLET
                  </span>
                  <h3 className="text-base font-bold text-[#1A1615]">
                    {selectedOutlet.shortName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] text-xs font-semibold px-2.5 py-1.5 rounded-lg text-[#1A1615] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-[#5C554E]" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setInspectorVisible(false)}
                  className="p-1.5 text-[#8C827A] hover:text-[#1A1615] rounded-lg hover:bg-[#FAF8F5] cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Box 1: OPERATIONAL SNAPSHOT */}
            <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block">
                OPERATIONAL SNAPSHOT
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8C827A] text-[11px] block">Hours</span>
                  <span className="font-semibold text-[#1A1615] mt-0.5 block leading-tight">
                    {selectedOutlet.hours}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C827A] text-[11px] block">Timezone</span>
                  <span className="font-semibold text-[#1A1615] mt-0.5 block leading-tight truncate">
                    {selectedOutlet.timezone}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C827A] text-[11px] block">Primary Currency</span>
                  <span className="font-semibold text-[#1A1615] mt-0.5 block">
                    {selectedOutlet.currency}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C827A] text-[11px] block">Tax Profile</span>
                  <span className="font-semibold text-[#1A1615] mt-0.5 block leading-tight">
                    {selectedOutlet.taxProfile}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: HARDWARE & DYNAMIC BEACONS (3) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
                  HARDWARE &amp; DYNAMIC BEACONS ({selectedOutlet.hardware.length})
                </span>
                {/* <span className="text-[11px] text-[#15803D] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  All Healthy
                </span> */}
              </div>

              <div className="space-y-2">
                {selectedOutlet.hardware.map((hw, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-[#EAE6E1] rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] flex items-center justify-center text-[#B38637] shrink-0">
                        {hw.icon === 'beacon' ? (
                          <QrCode className="w-4 h-4" />
                        ) : hw.icon === 'pos' ? (
                          <Laptop className="w-4 h-4" />
                        ) : (
                          <Coffee className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1615] truncate">
                            {hw.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${hw.badge === 'Square'
                              ? 'bg-[#EBF7F0] text-[#15803D]'
                              : hw.badge === 'Clover'
                                ? 'bg-neutral-100 text-neutral-700'
                                : 'bg-[#FAF6EE] text-[#9E782F]'
                              }`}
                          >
                            {hw.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7C746C] truncate mt-0.5">
                          {hw.detail}
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: LOCALIZED LOYALTY RULES */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block">
                LOCALIZED LOYALTY RULES
              </span>

              <div className="space-y-2 text-xs">
                {/* Row 1 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#1A1615]">Base Stamp Multiplier</div>
                    <div className="text-[10px] text-[#7C746C] mt-0.5">
                      Applied to all orders at this register node
                    </div>
                  </div>
                  <div className="bg-white border border-[#EAE6E1] px-2.5 py-1 rounded-lg text-xs font-bold text-[#1A1615] shrink-0 shadow-2xs">
                    {selectedOutlet.loyaltyRules.baseMultiplier}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#1A1615]">
                      {selectedOutlet.loyaltyRules.specialRuleName}
                    </div>
                    <div className="text-[10px] text-[#7C746C] mt-0.5">
                      {selectedOutlet.loyaltyRules.specialRuleTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="bg-[#EBF7F0] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedOutlet.loyaltyRules.specialRuleBadge}
                    </span>
                    <span className="bg-[#CEEBD9] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded">
                      {selectedOutlet.loyaltyRules.specialMultiplier}
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#1A1615]">Exclusive Branch Perk</div>
                    <div className="text-[10px] text-[#7C746C] italic mt-0.5">
                      &quot;{selectedOutlet.loyaltyRules.exclusivePerk}&quot;
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#B38637] shrink-0" />
                </div>
              </div>
            </div>

            {/* Bottom Button: Generate QR Stand Pack */}
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/qr-codes');
                } else {
                  showToast(`Downloading Printable QR Stands Pack for ${selectedOutlet.shortName}...`);
                }
              }}
              className="w-full mt-2 bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] text-[#1A1615] px-4 py-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#7C746C]" />
              <span>Generate QR Stand Pack</span>
            </button>
          </div>
        )}
      </div>

      {/* Add New Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#EAE6E1] p-5 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1615]">Deploy New Outlet Node</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBranch} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Outlet Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arts District Roastery"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 S Santa Fe Ave, Los Angeles, CA"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Assigned Store Manager
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam Thorn"
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-[13px] text-[#7C746C] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-[13px] font-semibold bg-[#B38637] text-white rounded-lg hover:bg-[#A37837] cursor-pointer"
                >
                  Provision Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {isEditModalOpen && selectedOutlet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#EAE6E1] p-0 w-full max-w-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* The form from AddNewBranchPage */}
            <div className="bg-white rounded-xl overflow-hidden border-l-4 border-l-[#B38637]">
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">

                      <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer sm:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="text-base font-bold text-[#1A1615]">
                      Basic Identity &amp; Location
                    </h2>
                    <p className="text-xs text-[#7C746C] mt-0.5">
                      Establish venue registry, physical geography, and guest contact points.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#EAE6E1] px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-[#5C554E] shrink-0">
                      <span>CODE: {editOutletCode}</span>
                      <button
                        onClick={handleEditRegenerateCode}
                        title="Generate new outlet code"
                        className="p-0.5 hover:text-[#1A1615] transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3 text-[#8C827A]" />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer hidden sm:block ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 space-y-1.5">
                    <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                      Branch Display Name <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={editBranchName}
                      onChange={(e) => setEditBranchName(e.target.value)}
                      placeholder="e.g. SoHo Roastery & Tasting Salon"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                    />
                  </div>

                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-xs font-semibold text-[#3D3732]">
                      Outlet Identifier
                    </label>
                    <div className="flex items-center px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#5C554E] font-mono font-medium">
                      <span className="text-[#8C827A] mr-1">#</span>
                      <span>{editOutletCode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#3D3732] block">
                    Venue Classification Profile
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditVenueProfile('roastery')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${editVenueProfile === 'roastery'
                        ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                        : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                        }`}
                    >
                      <Coffee className={`w-4 h-4 mb-2 ${editVenueProfile === 'roastery' ? 'text-white' : 'text-[#8C827A]'}`} />
                      <div className="text-xs font-bold leading-tight">Flagship Roastery</div>
                      <div className={`text-[10px] mt-0.5 ${editVenueProfile === 'roastery' ? 'text-white/80' : 'text-[#7C746C]'}`}>Full production</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditVenueProfile('boutique')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${editVenueProfile === 'boutique'
                        ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                        : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                        }`}
                    >
                      <Store className={`w-4 h-4 mb-2 ${editVenueProfile === 'boutique' ? 'text-white' : 'text-[#8C827A]'}`} />
                      <div className="text-xs font-bold leading-tight">Boutique Cafe</div>
                      <div className={`text-[10px] mt-0.5 ${editVenueProfile === 'boutique' ? 'text-white/80' : 'text-[#7C746C]'}`}>Express format</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditVenueProfile('tasting')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${editVenueProfile === 'tasting'
                        ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                        : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                        }`}
                    >
                      <Wine className={`w-4 h-4 mb-2 ${editVenueProfile === 'tasting' ? 'text-white' : 'text-[#8C827A]'}`} />
                      <div className="text-xs font-bold leading-tight">Tasting Room</div>
                      <div className={`text-[10px] mt-0.5 ${editVenueProfile === 'tasting' ? 'text-white/80' : 'text-[#7C746C]'}`}>Invitation only</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditVenueProfile('popup')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${editVenueProfile === 'popup'
                        ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                        : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                        }`}
                    >
                      <Tent className={`w-4 h-4 mb-2 ${editVenueProfile === 'popup' ? 'text-white' : 'text-[#8C827A]'}`} />
                      <div className="text-xs font-bold leading-tight">Pop-Up Kiosk</div>
                      <div className={`text-[10px] mt-0.5 ${editVenueProfile === 'popup' ? 'text-white/80' : 'text-[#7C746C]'}`}>Seasonal space</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-[#3D3732] block">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={editStreetAddress}
                    onChange={(e) => setEditStreetAddress(e.target.value)}
                    placeholder="Street Address, Suite / Floor"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                    />
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      placeholder="State"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                    />
                    <input
                      type="text"
                      value={editZipCode}
                      onChange={(e) => setEditZipCode(e.target.value)}
                      placeholder="Zip Code"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                    />
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      placeholder="Country"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B38637]" />
                      <span className="text-xs font-bold text-[#1A1615]">
                        Standard Operating Hours &amp; Sync Window
                      </span>
                    </div>
                    <span className="text-xs text-[#7C746C]">
                      Timezone: Eastern Daylight (UTC-4)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {DAYS.map((day) => {
                      const isSelected = editSelectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleEditDay(day)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${isSelected
                            ? 'bg-[#B38637] text-white'
                            : 'bg-white text-[#7C746C] border border-[#EAE6E1] hover:bg-[#F5F2EC]'
                            }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#7C746C]">Open:</span>
                      <input
                        type="text"
                        value={editOpenTime}
                        onChange={(e) => setEditOpenTime(e.target.value)}
                        className="text-xs font-bold text-[#1A1615] w-20 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#7C746C]">Close:</span>
                      <input
                        type="text"
                        value={editCloseTime}
                        onChange={(e) => setEditCloseTime(e.target.value)}
                        className="text-xs font-bold text-[#1A1615] w-20 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#3D3732] block">
                      Concierge &amp; Order Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#3D3732] block">
                      Dedicated Outlet Mailbox
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-[13px] text-[#7C746C] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await apiClient.patch(`merchant/branches/${selectedOutletId}`, {
                          name: editBranchName,
                          code: editOutletCode,
                          address: `${editStreetAddress}, ${editCity}, ${editState} ${editZipCode}`,
                          contact_phone: editPhone,
                          contact_email: editEmail,
                          status: 'active'
                        });
                        
                        const updatedOutlets = outlets.map(o => o.id === selectedOutletId ? {
                          ...o,
                          name: editBranchName,
                          shortName: editOutletCode,
                          address: `${editStreetAddress}, ${editCity}, ${editState} ${editZipCode}`,
                        } : o);
                        setOutlets(updatedOutlets);
                        
                        setIsEditModalOpen(false);
                        showToast('Branch details updated successfully.');
                      } catch (error: any) {
                        showToast(`Error updating branch: ${error.response?.data?.message || error.message}`);
                      }
                    }}
                    className="px-4 py-2 text-[13px] font-semibold bg-[#B38637] text-white rounded-lg hover:bg-[#A37837] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#1A1615] mb-2">Delete Branch</h3>
            <p className="text-sm text-[#6E6A66] mb-6">
              Are you sure you want to delete this branch? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-[#1A1615] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeletingBranch}
                onClick={() => handleDeleteBranch(branchToDelete)}
                className="px-4 py-2 text-sm font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-70 flex items-center gap-2"
              >
                {isDeletingBranch && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeletingBranch ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
