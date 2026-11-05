import React, { useState, useMemo } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Check,
  X,
  ChevronDown,
  Search,
  Plus,
  Eye,
  MoreVertical,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  Users,
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  Edit2,
  BarChart2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Utensils
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';
import { INITIAL_WEB_BRANCHES, WebBranchItem } from '../data/branchesWebData';

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
  onAddBranch,
  selectedOutletId,
  onSelectOutletId
}) => {
  // View mode: 'list' (Branch Overview Web Table) | 'details' (Branch Details Web Screen)
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // Master branches data
  const [branches, setBranches] = useState<WebBranchItem[]>(INITIAL_WEB_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<WebBranchItem>(INITIAL_WEB_BRANCHES[0]);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Operating Hours Modal
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [editingHours, setEditingHours] = useState(selectedBranch.operatingHoursList);

  // Edit Branch Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: selectedBranch.name,
    type: selectedBranch.type,
    address: selectedBranch.fullAddress,
    description: selectedBranch.description
  });

  // Calculate top KPI numbers
  const totalCount = branches.length;
  const activeCount = branches.filter((b) => b.status === 'Active').length;
  const inactiveCount = branches.filter((b) => b.status === 'Inactive').length;

  // Filtered branches list
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      // Tab filter
      if (activeTab === 'active' && b.status !== 'Active') return false;
      if (activeTab === 'inactive' && b.status !== 'Inactive') return false;

      // City filter
      if (cityFilter !== 'All Cities' && b.city !== cityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(query) ||
          b.location.toLowerCase().includes(query) ||
          b.code.toLowerCase().includes(query) ||
          b.city.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [branches, activeTab, cityFilter, searchQuery]);

  // Available cities for filter dropdown
  const cities = useMemo(() => {
    const list = Array.from(new Set(branches.map((b) => b.city)));
    return ['All Cities', ...list];
  }, [branches]);

  // Paginated slice
  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(start, start + itemsPerPage);
  }, [filteredBranches, currentPage]);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage) || 1;

  // Open Details View for a specific branch
  const handleOpenDetails = (branch: WebBranchItem) => {
    setSelectedBranch(branch);
    setEditingHours(branch.operatingHoursList);
    setEditForm({
      name: branch.name,
      type: branch.type,
      address: branch.fullAddress,
      description: branch.description
    });
    setViewMode('details');
    if (onBranchSelect) {
      onBranchSelect(branch.name);
    }
    if (onSelectOutletId) {
      onSelectOutletId(branch.id);
    }
  };

  // Toggle Operating Hours day status
  const handleToggleDay = (index: number) => {
    const updated = [...editingHours];
    updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
    setEditingHours(updated);
  };

  // Save Operating Hours
  const handleSaveHours = () => {
    const updatedBranches = branches.map((b) => {
      if (b.id === selectedBranch.id) {
        return {
          ...b,
          operatingHoursList: editingHours
        };
      }
      return b;
    });
    setBranches(updatedBranches);
    setSelectedBranch({
      ...selectedBranch,
      operatingHoursList: editingHours
    });
    setIsHoursModalOpen(false);
  };

  // Save Edit Branch Info
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...selectedBranch,
      name: editForm.name,
      type: editForm.type,
      fullAddress: editForm.address,
      location: editForm.address.split(',')[0] || editForm.address,
      description: editForm.description
    };
    setSelectedBranch(updated);
    setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16 font-sans text-[#1A1615]">
      {/* ======================================================== */}
      {/* VIEW 1: WEB BRANCH OVERVIEW TABLE VIEW */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold tracking-tight text-[#1A1615]">
                <span className="text-[#8B5CF6]">✦</span>
                <h1>Branch Overview</h1>
                <span className="text-[#8B5CF6]">✦</span>
              </div>
              <p className="text-xs text-[#6E6A66] font-medium mt-0.5">
                Manage your branch, update items and keep your offerings fresh.
              </p>
            </div>

            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/branches/new' as any);
                }
              }}
              className="bg-[#2D124D] hover:bg-[#3E1A68] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Add New Branch</span>
            </button>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Branches */}
            <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="text-[11px] text-[#6E6A66] font-medium">Total Branches</div>
                <div className="text-2xl font-bold tracking-tight text-[#1A1615] mt-0.5">{totalCount}</div>
                <div className="text-[10px] text-[#8C877D] font-medium mt-0.5">+2 this month</div>
              </div>
            </div>

            {/* Active Branches */}
            <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-[#16A34A] stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[11px] text-[#6E6A66] font-medium">Active Branches</div>
                <div className="text-2xl font-bold tracking-tight text-[#1A1615] mt-0.5">{activeCount}</div>
                <div className="text-[10px] text-[#16A34A] font-bold mt-0.5">86%</div>
              </div>
            </div>

            {/* Total Footfall */}
            <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#0284C7]" />
              </div>
              <div>
                <div className="text-[11px] text-[#6E6A66] font-medium">Total Footfall</div>
                <div className="text-2xl font-bold tracking-tight text-[#1A1615] mt-0.5">24,789</div>
                <div className="text-[10px] text-[#0284C7] font-semibold mt-0.5 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 14.2% vs last 30 days
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FFF5F5] border border-[#FFE4E6] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
              </div>
              <div>
                <div className="text-[11px] text-[#6E6A66] font-medium">Total Revenue</div>
                <div className="text-2xl font-bold tracking-tight text-[#1A1615] mt-0.5">₹8,89,900</div>
                <div className="text-[10px] text-[#15803D] font-bold mt-0.5 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 12.6% vs last 30 days
                </div>
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs overflow-hidden">
            {/* Table Filter Tabs & Search Header */}
            <div className="p-4 sm:p-5 border-b border-[#F1EFEA] flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Tabs */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1A1615] mr-1">All Branches</span>
                <button
                  onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'text-[#6E6A66] hover:bg-[#FAF8F5]'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'active'
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'text-[#6E6A66] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => { setActiveTab('inactive'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'inactive'
                      ? 'bg-[#2D124D] text-white shadow-2xs'
                      : 'text-[#6E6A66] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Inactive ({inactiveCount})
                </button>
              </div>

              {/* Right: Search & City Filter */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8C877D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by branch name or location..."
                    className="pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] placeholder-[#8C877D] focus:outline-hidden focus:border-[#2D124D] w-56 sm:w-64"
                  />
                </div>

                {/* City Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#2D124D] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1A1615] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <span>{cityFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C877D]" />
                  </button>

                  {isCityDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-1 z-20 text-xs">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCityFilter(city);
                            setIsCityDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 font-medium hover:bg-[#FAF8F5] cursor-pointer ${
                            cityFilter === city ? 'bg-[#FAF5FF] text-[#2D124D] font-bold' : 'text-[#1A1615]'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1615]">
                <thead className="bg-[#FAF8F5] text-[#8C877D] font-bold text-[11px] uppercase tracking-wider border-b border-[#F1EFEA]">
                  <tr>
                    <th className="py-3.5 px-5">Branch Name ⇕</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Orders</th>
                    <th className="py-3.5 px-4 text-center">Footfall</th>
                    <th className="py-3.5 px-4 text-right">Revenue</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFEA]">
                  {paginatedBranches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#8C877D]">
                        No branches match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedBranches.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => handleOpenDetails(b)}
                        className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        {/* Branch Photo & Name */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={b.image}
                              alt={b.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E5E0D8] shrink-0"
                            />
                            <div>
                              <div className="font-bold text-sm text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                                {b.name}
                              </div>
                              <div className="text-[10px] text-[#8C877D] font-mono mt-0.5">{b.code}</div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 max-w-[280px]">
                          <div className="flex items-center gap-1.5 text-[#6E6A66] truncate font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#8C877D] shrink-0" />
                            <span className="truncate">{b.location}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              b.status === 'Active'
                                ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                                : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                b.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                              }`}
                            />
                            {b.status}
                          </span>
                        </td>

                        {/* Orders */}
                        <td className="py-3.5 px-4 text-center font-bold font-mono">{b.orders}</td>

                        {/* Footfall */}
                        <td className="py-3.5 px-4 text-center font-bold font-mono">{b.footfall.toLocaleString()}</td>

                        {/* Revenue */}
                        <td className="py-3.5 px-4 text-right font-bold font-mono text-[#1A1615]">
                          {b.revenueFormatted}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetails(b);
                            }}
                            className="p-1.5 text-[#8C877D] hover:text-[#2D124D] hover:bg-white rounded-lg border border-transparent hover:border-[#E5E0D8] transition-colors cursor-pointer"
                            title="View Branch Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="p-4 border-t border-[#F1EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8C877D]">
              <div>
                Showing 1-{Math.min(itemsPerPage, filteredBranches.length)} of {filteredBranches.length} branches
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-md border border-[#E5E0D8] text-[#6E6A66] hover:bg-[#FAF8F5] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#2D124D] text-white shadow-2xs'
                        : 'border border-[#E5E0D8] text-[#1A1615] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-md border border-[#E5E0D8] text-[#6E6A66] hover:bg-[#FAF8F5] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: WEB SINGLE BRANCH DETAILS VIEW */}
      {/* ======================================================== */}
      {viewMode === 'details' && selectedBranch && (
        <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#8C877D]">
            <button
              onClick={() => setViewMode('list')}
              className="hover:text-[#1A1615] transition-colors cursor-pointer"
            >
              Branches
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C877D]" />
            <span className="text-[#1A1615] font-bold">Branch Details</span>
          </div>

          {/* Title Header with Edit and View Performance Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-1.5 -ml-1.5 rounded-lg border border-[#E5E0D8] bg-white text-[#1A1615] hover:bg-[#FAF8F5] cursor-pointer"
                title="Back to Branches"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1615]">
                    {selectedBranch.name}
                  </h1>
                  <span className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {selectedBranch.status}
                  </span>
                </div>
                <p className="text-xs text-[#8C877D] font-mono mt-0.5">STORE ID: {selectedBranch.storeId}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="p-2 bg-white border border-[#E5E0D8] rounded-xl text-[#6E6A66] hover:bg-[#FAF8F5] cursor-pointer shadow-2xs"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] text-[#1A1615] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#8C877D]" />
                <span>Edit Branch</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('/analytics' as any)}
                className="bg-[#2D124D] hover:bg-[#3E1A68] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-white/90" />
                <span>View Performance</span>
              </button>
            </div>
          </div>

          {/* 2-Column Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Gallery & Branch Information */}
            <div className="lg:col-span-7 space-y-6">
              {/* Photo Gallery Card */}
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-4 shadow-2xs space-y-3">
                {/* Main Banner */}
                <div className="w-full h-72 rounded-xl overflow-hidden border border-[#E5E0D8]">
                  <img
                    src={selectedBranch.image}
                    alt={selectedBranch.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2.5">
                  {selectedBranch.galleryImages.map((img, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-[#E5E0D8]">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="h-20 rounded-lg border-2 border-dashed border-[#D4CFC6] hover:border-[#2D124D] flex flex-col items-center justify-center text-[#8C877D] hover:text-[#2D124D] transition-colors cursor-pointer bg-[#FAF8F5]"
                  >
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                  </button>
                </div>
              </div>

              {/* Branch Information Card */}
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1EFEA]">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#8B5CF6]" />
                    <h2 className="text-sm font-bold text-[#1A1615]">Branch Information</h2>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs text-[#2D124D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8C877D] block mb-0.5">Branch Name</span>
                    <span className="font-bold text-[#1A1615]">{selectedBranch.name}</span>
                  </div>

                  <div>
                    <span className="text-[#8C877D] block mb-0.5">Branch Code</span>
                    <span className="font-mono font-bold text-[#1A1615]">{selectedBranch.code}</span>
                  </div>

                  <div>
                    <span className="text-[#8C877D] block mb-0.5">Branch Type</span>
                    <span className="font-bold text-[#1A1615]">{selectedBranch.type}</span>
                  </div>

                  <div>
                    <span className="text-[#8C877D] block mb-0.5">Address</span>
                    <span className="font-semibold text-[#1A1615] leading-relaxed">
                      {selectedBranch.fullAddress}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-[#F1EFEA]">
                    <span className="text-[#8C877D] block mb-0.5">Description</span>
                    <p className="text-[#6E6A66] leading-relaxed">{selectedBranch.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 KPI Cards, Operating Hours, Branch Info, Recent Activity */}
            <div className="lg:col-span-5 space-y-4">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Orders */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl p-3.5 shadow-2xs text-center">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center mx-auto mb-1.5 text-[#8B5CF6]">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] text-[#8C877D] font-medium">Orders</div>
                  <div className="text-lg font-bold text-[#1A1615] mt-0.5">{selectedBranch.orders}</div>
                  <div className="text-[9px] text-[#15803D] font-bold">{selectedBranch.ordersGrowth}</div>
                </div>

                {/* Footfall */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl p-3.5 shadow-2xs text-center">
                  <div className="w-7 h-7 rounded-lg bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center mx-auto mb-1.5 text-[#0284C7]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] text-[#8C877D] font-medium">Footfall</div>
                  <div className="text-lg font-bold text-[#1A1615] mt-0.5">{selectedBranch.footfall}</div>
                  <div className="text-[9px] text-[#0284C7] font-bold">{selectedBranch.footfallGrowth}</div>
                </div>

                {/* Revenue */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl p-3.5 shadow-2xs text-center">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF5F5] border border-[#FFE4E6] flex items-center justify-center mx-auto mb-1.5 text-[#E11D48]">
                    <span className="font-bold text-xs">₹</span>
                  </div>
                  <div className="text-[10px] text-[#8C877D] font-medium">Revenue</div>
                  <div className="text-lg font-bold text-[#1A1615] mt-0.5">{selectedBranch.revenueFormatted}</div>
                  <div className="text-[9px] text-[#15803D] font-bold">{selectedBranch.revenueGrowth}</div>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div
                onClick={() => setIsHoursModalOpen(true)}
                className="bg-white border border-[#EBE7DF] hover:border-[#2D124D] rounded-2xl p-4 shadow-2xs transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                      Operating Hours
                    </div>
                    <div className="text-[11px] text-[#8C877D] mt-0.5">{selectedBranch.operatingHours}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C877D] group-hover:text-[#2D124D] transition-colors" />
              </div>

              {/* Branch Setup & License Card */}
              <div className="bg-white border border-[#EBE7DF] hover:border-[#2D124D] rounded-2xl p-4 shadow-2xs transition-all cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#6E6A66]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1615] group-hover:text-[#2D124D] transition-colors">
                      Branch Info
                    </div>
                    <div className="text-[11px] text-[#8C877D] mt-0.5">License, tables, kitchen setups</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C877D] group-hover:text-[#2D124D] transition-colors" />
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white border border-[#EBE7DF] rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1A1615]">Recent Activity</h3>
                  <button
                    onClick={() => onNavigate?.('/settings/audit' as any)}
                    className="text-[11px] text-[#2D124D] font-bold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedBranch.recentActivity.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#F1EFEA] last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            act.type === 'order'
                              ? 'bg-[#10B981]'
                              : act.type === 'campaign'
                              ? 'bg-[#8B5CF6]'
                              : 'bg-[#DB2777]'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-[#1A1615]">{act.title}</div>
                          <div className="text-[11px] text-[#8C877D] mt-0.5">{act.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8C877D] font-mono shrink-0">{act.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPERATING HOURS MODAL (MATCHING FIGMA SCREEN 4) */}
      {/* ======================================================== */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E5E0D8] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#F1EFEA] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1615]">Operating Hours</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">Set the operating hours for this branch.</p>
                </div>
              </div>
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="text-[#8C877D] hover:text-[#1A1615] p-1.5 cursor-pointer rounded-lg hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Days Rows */}
            <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
              {editingHours.map((row, idx) => (
                <div key={row.day} className="flex items-center justify-between text-xs py-1">
                  <div className="w-24 font-bold text-[#1A1615]">{row.day}</div>

                  <div className="flex items-center gap-3">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleDay(idx)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        row.isOpen ? 'bg-[#2D124D]' : 'bg-[#E5E0D8]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                          row.isOpen ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>

                    {row.isOpen ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#8C877D] text-[11px]">Open</span>
                        <select
                          value={row.openTime}
                          onChange={(e) => {
                            const updated = [...editingHours];
                            updated[idx].openTime = e.target.value;
                            setEditingHours(updated);
                          }}
                          className="px-2 py-1 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] font-semibold text-[11px] text-[#1A1615] focus:outline-hidden"
                        >
                          {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <span className="text-[#8C877D] text-[11px]">Close</span>
                        <select
                          value={row.closeTime}
                          onChange={(e) => {
                            const updated = [...editingHours];
                            updated[idx].closeTime = e.target.value;
                            setEditingHours(updated);
                          }}
                          className="px-2 py-1 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] font-semibold text-[11px] text-[#1A1615] focus:outline-hidden"
                        >
                          {['08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM'].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="w-6 h-6 rounded-lg border border-[#E5E0D8] bg-white flex items-center justify-center text-[#8C877D] hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-[#8C877D] w-48 text-left pl-3">Closed</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Special Hours / Holidays Card */}
              <div className="mt-4 p-3.5 bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#8B5CF6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center text-[#8B5CF6]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1615]">Set Special Hours / Holidays</div>
                    <div className="text-[10px] text-[#8C877D]">
                      Add different timings for special days, holidays or events.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C877D]" />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-[#F1EFEA] flex items-center justify-end gap-2.5 bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setIsHoursModalOpen(false)}
                className="px-4 py-2 bg-white border border-[#E5E0D8] hover:bg-[#F5F2EC] rounded-xl text-xs font-bold text-[#6E6A66] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHours}
                className="px-5 py-2 bg-[#2D124D] hover:bg-[#3E1A68] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT BRANCH MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E5E0D8] animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-[#F1EFEA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1615]">Edit Branch Information</h3>
                <p className="text-xs text-[#8C877D] mt-0.5">{selectedBranch.name}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#8C877D] hover:text-[#1A1615] p-1.5 cursor-pointer rounded-lg hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6E6A66] uppercase mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase mb-1">Branch Type</label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase mb-1">Full Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6E6A66] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                />
              </div>

              <div className="pt-3 border-t border-[#F1EFEA] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold text-[#6E6A66] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D124D] hover:bg-[#3E1A68] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
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

export default BranchesPage;
