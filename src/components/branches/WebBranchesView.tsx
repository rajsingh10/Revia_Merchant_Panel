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
import { NavRoute, OutletsData } from '../../types';
import { INITIAL_WEB_BRANCHES, WebBranchItem } from '../../data/branchesWebData';

interface WebBranchesViewProps {
  onNavigate?: (route: NavRoute) => void;
  onBranchSelect?: (branchName: string) => void;
  outlets?: OutletsData[];
  onAddBranch?: (branch: OutletsData) => void;
  selectedOutletId?: string;
  onSelectOutletId?: (id: string) => void;
}

export const WebBranchesView: React.FC<WebBranchesViewProps> = ({
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
    <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
      {/* ======================================================== */}
      {/* VIEW 1: WEB BRANCH OVERVIEW TABLE VIEW */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#1E1548] font-bold">Branch Management</span>
          </div>

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
                Branch Overview
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                Manage your branch, update items and keep your offerings fresh.
              </p>
            </div>

            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/branches/new' as any);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5844A8]/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Add New Branch</span>
            </button>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Branches */}
            <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400">Total Branches</span>
                <div className="text-3xl font-black text-[#1E1548] mt-0.5">{totalCount}</div>
                <div className="text-[11px] text-[#5844A8] font-semibold mt-0.5">+2 this month</div>
              </div>
            </div>

            {/* Active Branches */}
            <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400">Active Branches</span>
                <div className="text-3xl font-black text-[#1E1548] mt-0.5">{activeCount}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">86%</div>
              </div>
            </div>

            {/* Total Footfall */}
            <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400">Total Footfall</span>
                <div className="text-3xl font-black text-[#1E1548] mt-0.5">24,789</div>
                <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 14.2% vs last 30 days
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400">Total Revenue</span>
                <div className="text-3xl font-black text-[#1E1548] mt-0.5">₹8,89,900</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 12.6% vs last 30 days
                </div>
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            {/* Table Filter Tabs & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100">
              {/* Left Tabs */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1E1548] mr-2">All Branches</span>
                <button
                  onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#5844A8] text-white shadow-md shadow-[#5844A8]/20'
                      : 'text-gray-500 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'active'
                      ? 'bg-[#5844A8] text-white shadow-md shadow-[#5844A8]/20'
                      : 'text-gray-500 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => { setActiveTab('inactive'); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'inactive'
                      ? 'bg-[#5844A8] text-white shadow-md shadow-[#5844A8]/20'
                      : 'text-gray-500 hover:text-[#1E1548] hover:bg-purple-50/60'
                  }`}
                >
                  Inactive ({inactiveCount})
                </button>
              </div>

              {/* Right: Search & City Filter */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by branch name or location..."
                    className="pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8] w-56 sm:w-64"
                  />
                </div>

                {/* City Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="bg-white border border-gray-200 hover:border-[#5844A8] px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1548] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <span>{cityFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {isCityDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-20 text-xs">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCityFilter(city);
                            setIsCityDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3.5 py-2 font-medium hover:bg-purple-50/60 transition-colors cursor-pointer ${
                            cityFilter === city ? 'bg-purple-50 text-[#5844A8] font-bold' : 'text-[#1E1548]'
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
              <table className="w-full text-left text-xs text-[#1E1548]">
                <thead className="bg-gray-50/60 text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
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
                <tbody className="divide-y divide-gray-100">
                  {paginatedBranches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-gray-400">
                        No branches match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedBranches.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => handleOpenDetails(b)}
                        className="hover:bg-[#FAF8FF]/60 transition-colors cursor-pointer group"
                      >
                        {/* Branch Photo & Name */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={b.image}
                              alt={b.name}
                              className="w-10 h-10 rounded-xl object-cover border border-purple-50 shadow-2xs shrink-0"
                            />
                            <div>
                              <div className="font-bold text-sm text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                                {b.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">{b.code}</div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 max-w-[280px]">
                          <div className="flex items-center gap-1.5 text-gray-600 truncate font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{b.location}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              b.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                : 'bg-rose-50 text-rose-500 border border-rose-200/60'
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
                        <td className="py-3.5 px-4 text-right font-bold font-mono text-[#1E1548]">
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
                            className="p-1.5 text-gray-400 hover:text-[#5844A8] hover:bg-purple-50 rounded-xl border border-transparent hover:border-purple-100 transition-colors cursor-pointer"
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
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
              <div>
                Showing 1-{Math.min(itemsPerPage, filteredBranches.length)} of {filteredBranches.length} branches
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#5844A8] text-white shadow-sm shadow-[#5844A8]/20'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
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
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <button
              onClick={() => setViewMode('list')}
              className="hover:text-[#1E1548] transition-colors cursor-pointer"
            >
              Branches
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#1E1548] font-bold">Branch Details</span>
          </div>

          {/* Title Header with Edit and View Performance Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-xl border border-gray-200 bg-white text-[#1E1548] hover:bg-gray-50 cursor-pointer shadow-2xs"
                title="Back to Branches"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1548]">
                    {selectedBranch.name}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {selectedBranch.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">STORE ID: {selectedBranch.storeId}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer shadow-2xs"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-[#1E1548] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#5844A8]" />
                <span>Edit Branch</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('/analytics' as any)}
                className="bg-[#5844A8] hover:bg-[#47368E] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5844A8]/20 transition-all cursor-pointer"
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
              <div className="bg-white border border-purple-50 rounded-3xl p-5 shadow-sm space-y-3">
                {/* Main Banner */}
                <div className="w-full h-72 rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={selectedBranch.image}
                    alt={selectedBranch.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2.5">
                  {selectedBranch.galleryImages.map((img, i) => (
                    <div key={i} className="h-20 rounded-xl overflow-hidden border border-gray-100">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="h-20 rounded-xl border-2 border-dashed border-purple-200 hover:border-[#5844A8] flex flex-col items-center justify-center text-gray-400 hover:text-[#5844A8] transition-colors cursor-pointer bg-purple-50/40"
                  >
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                  </button>
                </div>
              </div>

              {/* Branch Information Card */}
              <div className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#5844A8]" />
                    <h2 className="text-sm font-bold text-[#1E1548]">Branch Information</h2>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs text-[#5844A8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Branch Name</span>
                    <span className="font-bold text-[#1E1548]">{selectedBranch.name}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Branch Code</span>
                    <span className="font-mono font-bold text-[#1E1548]">{selectedBranch.code}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Branch Type</span>
                    <span className="font-bold text-[#1E1548]">{selectedBranch.type}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Address</span>
                    <span className="font-semibold text-[#1E1548] leading-relaxed">
                      {selectedBranch.fullAddress}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-400 font-semibold block mb-0.5">Description</span>
                    <p className="text-gray-600 leading-relaxed">{selectedBranch.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 KPI Cards, Operating Hours, Branch Info, Recent Activity */}
            <div className="lg:col-span-5 space-y-4">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Orders */}
                <div className="bg-white border border-purple-50 rounded-2xl p-4 shadow-sm text-center">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center mx-auto mb-1.5">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold">Orders</div>
                  <div className="text-lg font-black text-[#1E1548] mt-0.5">{selectedBranch.orders}</div>
                  <div className="text-[9px] text-emerald-600 font-bold">{selectedBranch.ordersGrowth}</div>
                </div>

                {/* Footfall */}
                <div className="bg-white border border-purple-50 rounded-2xl p-4 shadow-sm text-center">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold">Footfall</div>
                  <div className="text-lg font-black text-[#1E1548] mt-0.5">{selectedBranch.footfall}</div>
                  <div className="text-[9px] text-blue-600 font-bold">{selectedBranch.footfallGrowth}</div>
                </div>

                {/* Revenue */}
                <div className="bg-white border border-purple-50 rounded-2xl p-4 shadow-sm text-center">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-1.5">
                    <span className="font-bold text-xs">₹</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold">Revenue</div>
                  <div className="text-lg font-black text-[#1E1548] mt-0.5">{selectedBranch.revenueFormatted}</div>
                  <div className="text-[9px] text-emerald-600 font-bold">{selectedBranch.revenueGrowth}</div>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div
                onClick={() => setIsHoursModalOpen(true)}
                className="bg-white border border-purple-50 hover:border-[#5844A8] rounded-2xl p-4 shadow-sm transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Operating Hours
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{selectedBranch.operatingHours}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#5844A8] transition-colors" />
              </div>

              {/* Branch Setup & License Card */}
              <div className="bg-white border border-purple-50 hover:border-[#5844A8] rounded-2xl p-4 shadow-sm transition-all cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                      Branch Info
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">License, tables, kitchen setups</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#5844A8] transition-colors" />
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white border border-purple-50 rounded-3xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1E1548]">Recent Activity</h3>
                  <button
                    onClick={() => onNavigate?.('/settings/audit' as any)}
                    className="text-[11px] text-[#5844A8] font-bold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedBranch.recentActivity.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 last:border-b-0 last:pb-0"
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
                          <div className="font-bold text-[#1E1548]">{act.title}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{act.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">{act.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPERATING HOURS MODAL */}
      {/* ======================================================== */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-purple-50 animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1548]">Operating Hours</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Set the operating hours for this branch.</p>
                </div>
              </div>
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="text-gray-400 hover:text-[#1E1548] p-1.5 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
              {editingHours.map((row, idx) => (
                <div key={row.day} className="flex items-center justify-between text-xs py-1">
                  <div className="w-24 font-bold text-[#1E1548]">{row.day}</div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(idx)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        row.isOpen ? 'bg-[#5844A8]' : 'bg-gray-200'
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
                        <span className="text-gray-400 text-[11px]">Open</span>
                        <select
                          value={row.openTime}
                          onChange={(e) => {
                            const updated = [...editingHours];
                            updated[idx].openTime = e.target.value;
                            setEditingHours(updated);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white font-semibold text-[11px] text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        >
                          {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <span className="text-gray-400 text-[11px]">Close</span>
                        <select
                          value={row.closeTime}
                          onChange={(e) => {
                            const updated = [...editingHours];
                            updated[idx].closeTime = e.target.value;
                            setEditingHours(updated);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white font-semibold text-[11px] text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        >
                          {['08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM'].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-gray-400 w-48 text-left pl-3">Closed</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#5844A8] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-[#5844A8]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1548]">Set Special Hours / Holidays</div>
                    <div className="text-[10px] text-gray-400">
                      Add different timings for special days, holidays or events.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2.5 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsHoursModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHours}
                className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold shadow-md shadow-[#5844A8]/20 cursor-pointer transition-all"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-purple-50 animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Edit Branch Information</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedBranch.name}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-[#1E1548] p-1.5 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E1548] mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E1548] mb-1">Branch Type</label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E1548] mb-1">Full Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E1548] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold shadow-md shadow-[#5844A8]/20 cursor-pointer transition-all"
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

