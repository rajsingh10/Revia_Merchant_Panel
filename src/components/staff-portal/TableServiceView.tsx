import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  Coffee,
  ShoppingBag,
  Bell,
  Utensils,
  Share2,
  Sparkles,
  ArrowRight,
  Send,
  Check,
  Tag,
  LayoutGrid,
  Store,
  MapPin,
  Flame,
  Printer,
  MessageSquare,
  Users,
  ExternalLink,
  FileText,
  X,
  ChevronRight
} from 'lucide-react';
import { DiningTable, FoodOrder, ServiceRequestItem } from './types';

interface Props {
  tables?: DiningTable[];
  orders?: FoodOrder[];
  requests?: ServiceRequestItem[];
  onStartOrder?: (tableId: string) => void;
  onAddItems?: (tableId: string) => void;
  onNewRequest?: (tableId: string) => void;
  onServeOrder?: (orderId: string) => void;
  onPingKitchen?: (tableId: string) => void;
  onShareHandoff?: (tableId: string) => void;
  onViewRequestTask?: (requestId: string) => void;
  onClaimRequest?: (requestId: string) => void;
  onAssignRequest?: (requestId: string) => void;
  onEscalateRequest?: (requestId: string) => void;
  onNewReservation?: () => void;
  onAddCustomerNote?: (tableId: string) => void;
  onSelectTable?: (table: DiningTable) => void;
  onCreateOrder?: (table?: DiningTable) => void;
  onCreateRequest?: (table?: DiningTable) => void;
}

// Floor section definitions for the interactive 2D table layout
interface FloorZone {
  name: string;
  tag: string;
  tableNumbers: string[];
}

const FLOOR_ZONES: FloorZone[] = [
  { name: 'Indoor Window Section', tag: 'WINDOW', tableNumbers: ['01', '02', '05'] },
  { name: 'Main Dining Hall', tag: 'MAIN', tableNumbers: ['03', '04', '06', '07', '08'] },
  { name: 'Outdoor Garden Patio', tag: 'PATIO', tableNumbers: ['09', '10'] },
  { name: 'VIP & Chef Dining', tag: 'VIP', tableNumbers: ['11', '12'] }
];

export const TableServiceView: React.FC<Props> = ({
  tables = [],
  orders = [],
  requests = [],
  onStartOrder,
  onAddItems,
  onNewRequest,
  onServeOrder,
  onPingKitchen,
  onShareHandoff,
  onViewRequestTask,
  onClaimRequest,
  onAssignRequest,
  onEscalateRequest,
  onNewReservation,
  onAddCustomerNote,
  onSelectTable,
  onCreateOrder,
  onCreateRequest
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [viewMode, setViewMode] = useState<'cards' | 'floor_map'>('cards');
  const [filterChip, setFilterChip] = useState<'all' | 'needs_attention' | 'no_order' | 'preparing' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || 'tbl-05');
  const [isMobileConsoleOpen, setIsMobileConsoleOpen] = useState(false);

  // Counts
  const myTablesCount = (tables || []).length;
  const pendingRequestsCount = (requests || []).filter(r => r.status !== 'Completed' && r.status !== 'completed').length;
  const readyOrdersCount = (orders || []).filter(o => o.status === 'Ready to Serve' || o.status === 'ready_to_serve').length;
  const needsAttentionCount = (tables || []).filter(t => t.status === 'Needs Attention').length;

  // Filter logic
  const filteredTables = useMemo(() => {
    return (tables || []).filter(t => {
      const tableNum = String(t.number || t.tableNumber || '');
      const custName = String(t.customerName || '');
      const orderId = String(t.activeOrderId || '');
      const matchesSearch =
        tableNum.includes(searchQuery) ||
        custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterChip === 'needs_attention') return t.status === 'Needs Attention';
      if (filterChip === 'no_order') return t.orderStatus === 'Not started';
      if (filterChip === 'preparing') return t.orderStatus === 'Preparing';
      if (filterChip === 'ready') return t.status === 'Food Ready' || t.orderStatus === 'Ready to Serve';

      return true;
    });
  }, [tables, searchQuery, filterChip]);

  // Selected table object
  const activeSelectedTable = useMemo(() => {
    const found = tables.find(t => t.id === selectedTableId || t.number === selectedTableId || t.tableNumber === selectedTableId);
    return found || tables[0];
  }, [tables, selectedTableId]);

  // Matching food order for active selected table
  const activeTableOrder = useMemo(() => {
    if (!activeSelectedTable) return orders[0];
    const found = orders.find(o => o.tableNumber === activeSelectedTable.number || o.tableNumber === activeSelectedTable.tableNumber);
    return found || orders[0];
  }, [orders, activeSelectedTable]);

  // Matching pending requests for active selected table
  const activeTableRequests = useMemo(() => {
    if (!activeSelectedTable) return [];
    return requests.filter(r => {
      const tNum = activeSelectedTable.number || activeSelectedTable.tableNumber;
      return r.tableNumber === tNum && r.status !== 'completed' && r.status !== 'Completed';
    });
  }, [requests, activeSelectedTable]);

  const handleSelectTable = (tbl: DiningTable) => {
    setSelectedTableId(tbl.id);
    onSelectTable?.(tbl);
    if (window.innerWidth < 1024) {
      setIsMobileConsoleOpen(true);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-7 pb-28 sm:pb-32 lg:pb-12 max-w-[1600px] mx-auto w-full">
      {/* 1. Page Header & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight">
              Table Service
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5844A8]/10 text-[#5844A8] border border-[#5844A8]/20">
              <Sparkles className="w-3 h-3" /> Floor Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B657E] font-medium max-w-2xl leading-relaxed">
            Real-time table occupancy, kitchen tickets, customer service requests, and instantaneous floor dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#1E1548] bg-white px-4 py-2.5 rounded-2xl border border-[#EFEAF7] shadow-2xs self-start sm:self-auto shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Shift • {myTablesCount} Assigned Tables</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards (4 Revia Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {/* Card 1: MY TABLES */}
        <div className="bg-white border border-[#EFEAF7] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-2xs hover:border-[#5844A8]/30 transition group">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8C84A0]">
              MY TABLES
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#5844A8] border border-purple-100 whitespace-nowrap">
              Assigned
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mt-3 sm:mt-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1548] tracking-tight">
              0{myTablesCount}
            </span>
            <span className="text-[11px] font-semibold text-[#8C84A0]">4 of 12 occupied</span>
          </div>
        </div>

        {/* Card 2: PENDING REQUESTS */}
        <div className="bg-white border border-[#EFEAF7] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-2xs hover:border-rose-300 transition group">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8C84A0]">
              PENDING REQUESTS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" /> Needs Action
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mt-3 sm:mt-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-600 tracking-tight">
              0{pendingRequestsCount}
            </span>
            <span className="text-[11px] font-semibold text-[#8C84A0]">Avg. wait 6 min</span>
          </div>
        </div>

        {/* Card 3: READY ORDERS */}
        <div className="bg-white border border-[#EFEAF7] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-2xs hover:border-emerald-300 transition group">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8C84A0]">
              READY ORDERS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
              Pick Up Now
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mt-3 sm:mt-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight">
              0{readyOrdersCount}
            </span>
            <span className="text-[11px] font-semibold text-[#8C84A0]">Table 09 fresh</span>
          </div>
        </div>

        {/* Card 4: NEEDS ATTENTION */}
        <div className="bg-white border border-[#EFEAF7] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition group">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8C84A0]">
              NEEDS ATTENTION
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
              Repeated Pings
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mt-3 sm:mt-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-600 tracking-tight">
              0{needsAttentionCount}
            </span>
            <span className="text-[11px] font-semibold text-[#8C84A0]">Table 12 • 4 pings</span>
          </div>
        </div>
      </div>

      {/* 3. Search Bar, View Mode Switcher, & Action Controls */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#EFEAF7] shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8C84A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table number, customer name, reservation or order ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#EFEAF7] text-xs font-semibold text-[#1E1548] placeholder:text-[#9890A8] focus:outline-none focus:border-[#5844A8] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Switcher & Action CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Toggle: Cards vs Floor Map */}
            <div className="flex items-center p-1 rounded-xl bg-[#FAF8FF] border border-[#EFEAF7] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#5844A8] shadow-xs font-extrabold'
                    : 'text-[#6B657E] hover:text-[#1E1548]'
                }`}
                title="Cards Feed View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards Feed</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('floor_map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'floor_map'
                    ? 'bg-white text-[#5844A8] shadow-xs font-extrabold'
                    : 'text-[#6B657E] hover:text-[#1E1548]'
                }`}
                title="Interactive Floor Map"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Floor Map</span>
              </button>
            </div>

            {/* New Reservation Action Button */}
            <button
              type="button"
              onClick={onNewReservation}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-[#EFEAF7]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Active tables scope */}
            <div className="flex items-center gap-1.5 sm:pr-3 sm:border-r sm:border-[#EFEAF7] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('my')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  activeTab === 'my'
                    ? 'bg-[#1E1548] text-white shadow-2xs'
                    : 'bg-[#FAF8FF] text-[#6B657E] hover:bg-[#F3EFFB] border border-[#EFEAF7]'
                }`}
              >
                My Tables ({myTablesCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#1E1548] text-white shadow-2xs'
                    : 'bg-[#FAF8FF] text-[#6B657E] hover:bg-[#F3EFFB] border border-[#EFEAF7]'
                }`}
              >
                All Tables (12)
              </button>
            </div>

            {/* Filter tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {[
                { id: 'all', label: `All (${tables.length})` },
                { id: 'needs_attention', label: `🚨 Needs Attention (${needsAttentionCount})` },
                { id: 'preparing', label: '🍳 Preparing (2)' },
                { id: 'ready', label: '🍽️ Ready to Serve (1)' },
                { id: 'no_order', label: '⏳ Waiting to Order (1)' }
              ].map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setFilterChip(chip.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    filterChip === chip.id
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : 'bg-[#FAF8FF] text-[#6B657E] hover:text-[#1E1548] hover:bg-[#F3EFFB] border border-[#EFEAF7]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#8C84A0] hidden md:block shrink-0">
            Showing {filteredTables.length} of {tables.length} tables
          </div>
        </div>
      </div>

      {/* 4. MAIN DESKTOP 12-COLUMN SPLIT LAYOUT */}
      <div className="lg:grid lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* LEFT SECTION (Col-span 7): Cards Feed OR Floor Map */}
        <div className="lg:col-span-7 space-y-4">
          {/* VIEW MODE A: Cards Feed */}
          {viewMode === 'cards' && (
            <div className="space-y-4 sm:space-y-5">
              {filteredTables.length === 0 ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EFEAF7] p-10 sm:p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8FF] text-[#8C84A0] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#1E1548]">No tables match your filter</h3>
                  <p className="text-xs text-[#8C84A0]">Try clearing search keywords or switching filters</p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setFilterChip('all'); }}
                    className="px-4 py-2 bg-[#5844A8] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTables.map(tbl => {
                  const isSelected = selectedTableId === tbl.id;
                  const isNeedsAttention = tbl.status === 'Needs Attention';
                  const isFoodReady = tbl.status === 'Food Ready';

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => handleSelectTable(tbl)}
                      className={`rounded-2xl sm:rounded-3xl border bg-white shadow-2xs transition-all cursor-pointer p-4 sm:p-5 lg:p-6 relative ${
                        isSelected
                          ? 'border-[#5844A8] ring-2 ring-[#5844A8]/25 shadow-md bg-purple-50/10'
                          : isNeedsAttention
                          ? 'border-rose-300 ring-2 ring-rose-100 hover:border-rose-400'
                          : 'border-[#EFEAF7] hover:border-[#5844A8]/40 hover:shadow-sm'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute -left-0.5 top-4 bottom-4 w-1.5 bg-[#5844A8] rounded-r-md hidden lg:block" />
                      )}

                      {/* Card Top Row: Table #, Status Pill, Bill Amount */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-extrabold text-[#1A1615] tracking-tight">
                            TABLE #{tbl.number || tbl.tableNumber}
                          </span>

                          {/* Status Pill */}
                          {isNeedsAttention ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                              Needs Attention ({tbl.pingsCount || 4} pings)
                            </span>
                          ) : isFoodReady ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> FOOD READY
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#5844A8]/10 text-[#5844A8] border border-[#5844A8]/20 flex items-center gap-1">
                              ● Occupied
                            </span>
                          )}

                          {tbl.isWalkIn ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              WALK-IN
                            </span>
                          ) : tbl.reservationId ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-[#6E6A66] border border-gray-200">
                              {tbl.reservationId}
                            </span>
                          ) : null}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-[#8C877D] uppercase tracking-wider block">Running Total</span>
                          <span className="text-sm font-extrabold text-[#1A1615]">
                            {tbl.runningValue > 0 ? `₹${tbl.runningValue.toLocaleString('en-IN')}` : '₹0 (No items)'}
                          </span>
                        </div>
                      </div>

                      {/* Card Middle: Customer, Area, Order status */}
                      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {tbl.customerName?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-[#1A1615] text-[13px]">{tbl.customerName}</h4>
                              <span className="text-[10px] text-[#8C877D] font-medium">
                                • {tbl.guestsCount} guests
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6E6A66] mt-0.5">
                              {tbl.area || 'Indoor Dining'} • {tbl.reservationTime || 'Walk-in visit'}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-[#1A1615] block">
                            {tbl.activeOrderId || 'Waiting for order'}
                          </span>
                          <span className={`text-[11px] font-bold ${
                            isFoodReady ? 'text-emerald-600' : tbl.orderStatus === 'Preparing' ? 'text-[#5844A8]' : 'text-amber-600'
                          }`}>
                            {tbl.itemsOrderedSummary || (tbl.orderStatus === 'Not started' ? 'No food ticket yet' : tbl.orderStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Card Pending Requests Bar (if any) */}
                      {tbl.activeRequests && tbl.activeRequests.length > 0 && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 text-rose-700 font-bold">
                            <Bell className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                            <span>{tbl.activeRequests[0].title}</span>
                          </div>
                          <span className="text-[10px] font-black text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-100">
                            {tbl.activeRequests[0].waitingMinutes ? `${tbl.activeRequests[0].waitingMinutes}m wait` : 'Urgent'}
                          </span>
                        </div>
                      )}

                      {/* Card Bottom Quick Actions Row */}
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {isFoodReady ? (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onServeOrder?.('ORD-1036'); }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Utensils className="w-3.5 h-3.5" /> Serve Order
                            </button>
                          ) : tbl.orderStatus === 'Not started' ? (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onStartOrder ? onStartOrder(tbl.id) : onCreateOrder?.(tbl); }}
                              className="px-3 py-1.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Utensils className="w-3.5 h-3.5" /> + Take Order
                            </button>
                          ) : isNeedsAttention ? (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onViewRequestTask?.('SR-1001'); }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Bell className="w-3.5 h-3.5" /> Handle Request
                            </button>
                          ) : null}

                          {tbl.orderStatus !== 'Not started' && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onAddItems?.(tbl.id); }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE6E1] hover:border-[#5844A8]/40 text-xs font-bold text-[#1A1615] shadow-2xs transition cursor-pointer"
                            >
                              + Add Items
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onNewRequest ? onNewRequest(tbl.id) : onCreateRequest?.(tbl); }}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE6E1] hover:border-[#5844A8]/40 text-xs font-bold text-[#1A1615] shadow-2xs transition cursor-pointer"
                          >
                            + Request
                          </button>

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onShareHandoff?.(tbl.id); }}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE6E1] hover:border-[#5844A8]/40 text-xs font-bold text-[#6E6A66] shadow-2xs transition cursor-pointer flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3" /> Handoff
                          </button>
                        </div>

                        {/* View Details desktop shortcut */}
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#5844A8] ml-auto">
                          <span>{isSelected ? 'Selected Active' : 'Select'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW MODE B: Interactive 2D Restaurant Floor Map */}
          {viewMode === 'floor_map' && (
            <div className="bg-white rounded-2xl border border-[#EFECE6] p-4 sm:p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1A1615]">Floor Plan Layout</h3>
                  <p className="text-xs text-[#8C877D]">Click any table to inspect ticket &amp; dispatch service</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Food Ready
                  </span>
                  <span className="flex items-center gap-1 text-rose-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Needs Action
                  </span>
                  <span className="flex items-center gap-1 text-[#5844A8]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5844A8]" /> Occupied
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Available
                  </span>
                </div>
              </div>

              {/* Render 4 Zones */}
              <div className="space-y-6">
                {FLOOR_ZONES.map((zone) => (
                  <div key={zone.tag} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#1A1615] uppercase tracking-wider">
                        {zone.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#8C877D]">
                        {zone.tag}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {zone.tableNumbers.map((numStr) => {
                        const tableData = tables.find(t => t.number === numStr || t.tableNumber === numStr);
                        const isSelected = activeSelectedTable?.number === numStr || activeSelectedTable?.tableNumber === numStr;
                        const isOccupied = !!tableData;
                        const isNeedsAttn = tableData?.status === 'Needs Attention';
                        const isReady = tableData?.status === 'Food Ready';

                        return (
                          <div
                            key={numStr}
                            onClick={() => {
                              if (tableData) handleSelectTable(tableData);
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between min-h-[105px] ${
                              isSelected
                                ? 'bg-purple-50 border-[#5844A8] ring-2 ring-[#5844A8]/40 shadow-sm'
                                : isNeedsAttn
                                ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
                                : isReady
                                ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400'
                                : isOccupied
                                ? 'bg-white border-[#EFECE6] hover:border-[#5844A8]/30 shadow-2xs'
                                : 'bg-[#FAF8F5] border-dashed border-gray-300 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-extrabold text-[#1A1615]">T-{numStr}</span>
                              {isNeedsAttn ? (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                              ) : isReady ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              ) : isOccupied ? (
                                <span className="w-2 h-2 rounded-full bg-[#5844A8]" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                              )}
                            </div>

                            <div>
                              {isOccupied ? (
                                <>
                                  <p className="text-xs font-bold text-[#1A1615] truncate">{tableData.customerName}</p>
                                  <p className="text-[10px] text-[#8C877D] font-medium">{tableData.guestsCount} guests • {tableData.orderStatus}</p>
                                </>
                              ) : (
                                <p className="text-xs text-gray-400 font-medium">Available (Open)</p>
                              )}
                            </div>

                            <div className="text-[10px] font-extrabold flex items-center justify-between pt-1 border-t border-gray-100">
                              <span className="text-[#8C877D]">{isOccupied ? `₹${tableData.runningValue}` : 'Empty'}</span>
                              {isSelected && <span className="text-[#5844A8]">● Active</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION (Col-span 5): Desktop Sticky Live Table Console */}
        <div className="hidden lg:block lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-[#EFECE6] shadow-sm overflow-hidden flex flex-col">
            {/* Header: Table ID, Area & Live Status */}
            <div className="p-4 sm:p-5 border-b border-[#EFECE6] bg-[#FAF8F5]/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#1A1615] tracking-tight">
                    TABLE #{activeSelectedTable?.number || activeSelectedTable?.tableNumber || '05'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeSelectedTable?.status === 'Needs Attention'
                      ? 'bg-rose-100 text-rose-700'
                      : activeSelectedTable?.status === 'Food Ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#5844A8]/10 text-[#5844A8]'
                  }`}>
                    {activeSelectedTable?.status || 'Occupied'}
                  </span>
                </div>
                <p className="text-xs text-[#8C877D] font-medium mt-0.5">
                  {activeSelectedTable?.area || 'Indoor Dining'} • Waiter: {activeSelectedTable?.assignedStaff || 'Rohan Singh'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#8C877D] uppercase tracking-wider block">Duration</span>
                <span className="text-xs font-extrabold text-[#1A1615] flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-emerald-600" /> Seated 42m
                </span>
              </div>
            </div>

            {/* Guest Profile Card */}
            <div className="p-4 sm:p-5 border-b border-[#EFECE6] bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                    {activeSelectedTable?.customerName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-[#1A1615]">
                        {activeSelectedTable?.customerName || 'Priya Sharma'}
                      </h4>
                      <span className="px-2 py-0.2 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">
                        VIP GOLD
                      </span>
                    </div>
                    <p className="text-xs text-[#8C877D] font-medium mt-0.5">
                      {activeSelectedTable?.guestsCount || 4} Guests • {activeSelectedTable?.reservationId || 'Walk-in Visit'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddCustomerNote?.(activeSelectedTable?.id || '')}
                  className="p-1.5 rounded-lg border border-[#EAE6E1] text-[#8C877D] hover:text-[#5844A8] hover:bg-[#FAF8F5] transition cursor-pointer"
                  title="Add Guest Note"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] text-xs text-[#6E6A66] font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#5844A8] shrink-0" />
                <span className="truncate">Window table requested • Celebrating wedding anniversary</span>
              </div>
            </div>

            {/* Active Kitchen Food Order Ticket */}
            <div className="p-4 sm:p-5 border-b border-[#EFECE6] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#1A1615] uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#5844A8]" />
                    ACTIVE FOOD TICKET ({activeTableOrder?.id || activeSelectedTable?.activeOrderId || '#ORD-1048'})
                  </h4>
                  <p className="text-[11px] text-[#8C877D] mt-0.5">
                    {activeTableOrder?.kitchenUpdate || 'Kitchen preparing dishes • 80% complete'}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#1A1615]">
                  ₹{activeSelectedTable?.runningValue?.toLocaleString('en-IN') || 1240}
                </span>
              </div>

              {/* Order Items list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeSelectedTable?.orderedItems && activeSelectedTable.orderedItems.length > 0 ? (
                  activeSelectedTable.orderedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5844A8] font-bold text-[10px] flex items-center justify-center">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-[#1A1615]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8C877D]">₹{item.price}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-500">
                          {item.timeAgo}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center rounded-xl bg-gray-50 text-xs text-gray-500">
                    No items on order yet. Tap Take Order below to create tickets.
                  </div>
                )}
              </div>

              {/* Fast Kitchen Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAddItems?.(activeSelectedTable?.id || '')}
                  className="py-2 px-3 rounded-xl bg-white border border-[#EAE6E1] hover:border-[#5844A8] text-xs font-bold text-[#1A1615] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#5844A8]" /> Add Items
                </button>
                <button
                  type="button"
                  onClick={() => onPingKitchen?.(activeSelectedTable?.id || '')}
                  className="py-2 px-3 rounded-xl bg-white border border-[#EAE6E1] hover:border-amber-400 text-xs font-bold text-amber-700 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Ping Kitchen
                </button>
              </div>
            </div>

            {/* Service Requests Box */}
            <div className="p-4 sm:p-5 border-b border-[#EFECE6] bg-[#FAF8F5]/50 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-extrabold text-[#1A1615] uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-rose-500" />
                  FLOOR REQUESTS ({activeTableRequests.length})
                </h4>
                {activeTableRequests.length > 0 && (
                  <span className="text-[10px] font-bold text-rose-600">Pending Action</span>
                )}
              </div>

              {activeTableRequests.length > 0 ? (
                activeTableRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-rose-600">{req.title}</span>
                      <span className="text-[10px] font-bold text-gray-500">{req.waitingMinutes}m ago</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onClaimRequest?.(req.id)}
                        className="flex-1 py-1 px-2 rounded-lg bg-[#5844A8] text-white text-[11px] font-bold transition hover:bg-[#47368E] cursor-pointer"
                      >
                        Claim Task
                      </button>
                      <button
                        type="button"
                        onClick={() => onEscalateRequest?.(req.id)}
                        className="py-1 px-2.5 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center rounded-xl bg-white border border-gray-200/60 text-xs text-gray-400 font-medium">
                  ✓ No pending service requests for Table #{activeSelectedTable?.number}
                </div>
              )}
            </div>

            {/* Quick Floor Desk Actions Footer */}
            <div className="p-4 sm:p-5 bg-white space-y-2">
              <button
                type="button"
                onClick={() => onServeOrder?.(activeTableOrder?.id || 'ORD-1036')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Mark Order Delivered &amp; Served</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onShareHandoff?.(activeSelectedTable?.id || '')}
                  className="py-2 px-3 rounded-xl bg-white border border-[#EAE6E1] hover:border-gray-300 text-xs font-bold text-[#1A1615] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Handoff</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNewRequest?.(activeSelectedTable?.id || '')}
                  className="py-2 px-3 rounded-xl bg-white border border-[#EAE6E1] hover:border-gray-300 text-xs font-bold text-[#1A1615] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#5844A8]" />
                  <span>New Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mobile Slide-up Console Drawer (< 1024px) */}
      {isMobileConsoleOpen && activeSelectedTable && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsMobileConsoleOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl p-5 shadow-2xl border-t border-gray-100 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#1A1615]">
                  TABLE #{activeSelectedTable.number} • Floor Console
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5844A8]/10 text-[#5844A8]">
                  {activeSelectedTable.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileConsoleOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] text-xs">
                <div>
                  <span className="font-extrabold text-[#1A1615] block">{activeSelectedTable.customerName}</span>
                  <span className="text-[#8C877D]">{activeSelectedTable.guestsCount} guests • {activeSelectedTable.area}</span>
                </div>
                <span className="font-extrabold text-sm text-[#1A1615]">
                  ₹{activeSelectedTable.runningValue?.toLocaleString('en-IN') || 0}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileConsoleOpen(false);
                    onAddItems?.(activeSelectedTable.id);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#5844A8] text-white text-xs font-bold text-center"
                >
                  + Add Food Items
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileConsoleOpen(false);
                    onNewRequest?.(activeSelectedTable.id);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#EAE6E1] text-xs font-bold text-[#1A1615] text-center"
                >
                  + Service Request
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileConsoleOpen(false);
                  onServeOrder?.('ORD-1036');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center"
              >
                ✓ Mark Order Served
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
