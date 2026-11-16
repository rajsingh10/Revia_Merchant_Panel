import React, { useState } from 'react';
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
  Tag
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
  const [filterChip, setFilterChip] = useState<'all' | 'needs_attention' | 'no_order' | 'preparing' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const myTablesCount = (tables || []).length;
  const pendingRequestsCount = (requests || []).filter(r => r.status !== 'Completed' && r.status !== 'completed').length;
  const readyOrdersCount = (orders || []).filter(o => o.status === 'Ready to Serve' || o.status === 'ready_to_serve').length;
  const needsAttentionCount = (tables || []).filter(t => t.status === 'Needs Attention').length;

  // Filter logic
  const filteredTables = (tables || []).filter(t => {
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

  return (
    <div className="space-y-6 pb-28">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight">Table Service</h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Manage customer visits, food orders and service requests in one place.
        </p>
      </div>

      {/* 2. Top Metric KPI Cards (4 Cards matching mockup 1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: MY TABLES */}
        <div className="bg-[#FAF8FF] border border-purple-100 rounded-3xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-[#5844A8]">
            <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-black">#</span>
            </div>
            <span className="text-[11px] font-black tracking-wider uppercase text-[#5844A8]">MY TABLES</span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-[#1E1548]">04</span>
            <span className="text-[11px] font-bold text-[#5844A8] bg-purple-100/70 px-2 py-0.5 rounded-full">Assigned</span>
          </div>
        </div>

        {/* Card 2: PENDING REQUESTS */}
        <div className="bg-[#FFF5F5] border border-rose-100 rounded-3xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-[11px] font-black tracking-wider uppercase text-rose-600">PENDING REQUESTS</span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-rose-600">04</span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Needs action</span>
          </div>
        </div>

        {/* Card 3: READY ORDERS */}
        <div className="bg-[#F0FDF4] border border-emerald-100 rounded-3xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-600">READY ORDERS</span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-emerald-600">01</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Ready to serve</span>
          </div>
        </div>

        {/* Card 4: NEEDS ATTENTION */}
        <div className="bg-[#FFFBEB] border border-amber-100 rounded-3xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[11px] font-black tracking-wider uppercase text-amber-700">NEEDS ATTENTION</span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-amber-600">01</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Repeated pings</span>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & New Reservation Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table, customer, reservation or order ID..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#5844A8] shadow-2xs"
          />
        </div>
        <button
          type="button"
          onClick={onNewReservation}
          className="px-5 py-3 rounded-2xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* 4. Tab Selector & Filter Chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Toggle between My Tables and All Tables */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer shadow-2xs flex items-center gap-1.5 ${
              activeTab === 'my'
                ? 'bg-[#1E1548] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-200'
            }`}
          >
            <span>My Tables ({myTablesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer shadow-2xs flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#1E1548] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-200'
            }`}
          >
            <span>All Active Tables (12)</span>
          </button>
        </div>

        {/* Filter chips & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All (${tables.length})` },
            { id: 'needs_attention', label: `Needs Attention (${needsAttentionCount})` },
            { id: 'no_order', label: 'No Order Yet (1)' },
            { id: 'preparing', label: 'Preparing (2)' },
            { id: 'ready', label: 'Ready to Serve (1)' }
          ].map(chip => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterChip(chip.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs ${
                filterChip === chip.id
                  ? 'bg-[#1E1548] text-white'
                  : 'bg-white text-gray-500 border border-gray-200/90 hover:border-purple-200'
              }`}
            >
              {chip.label}
            </button>
          ))}

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs cursor-pointer ml-auto sm:ml-0">
            <span>Priority First</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 font-medium">
        Your assigned tables • Each card covers one active table visit • For sample situations shown
      </p>

      {/* 5. TABLE CARDS LIST */}
      <div className="space-y-6">
        {filteredTables.map(tbl => {
          const isNeedsAttention = tbl.status === 'Needs Attention';
          const isFoodReady = tbl.status === 'Food Ready';

          return (
            <div
              key={tbl.id}
              className={`rounded-3xl border bg-white shadow-sm overflow-hidden transition-all ${
                isNeedsAttention
                  ? 'border-rose-300 ring-2 ring-rose-100 shadow-rose-900/5'
                  : 'border-purple-100/70 hover:border-purple-200'
              }`}
            >
              {/* Card Header Bar */}
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#FAF8FF]/60 to-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-base sm:text-lg font-black text-[#1E1548]">TABLE #{tbl.number || tbl.tableNumber}</span>

                  {/* Status badge */}
                  {isNeedsAttention ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500" /> Needs Attention
                    </span>
                  ) : isFoodReady ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> FOOD READY TO SERVE
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      ● Occupied
                    </span>
                  )}

                  {tbl.isWalkIn ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                      WALK-IN VISIT
                    </span>
                  ) : tbl.reservationId ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-[#5844A8] border border-purple-100">
                      {tbl.reservationId}
                    </span>
                  ) : null}
                </div>

                {/* Right Quick Header Actions */}
                <div className="flex items-center gap-2">
                  {isFoodReady ? (
                    <button
                      type="button"
                      onClick={() => onServeOrder?.('ORD-1036')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-900/10 active:scale-98 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Utensils className="w-3.5 h-3.5" /> Serve Order
                    </button>
                  ) : tbl.orderStatus === 'Not started' ? (
                    <button
                      type="button"
                      onClick={() => (onStartOrder ? onStartOrder(tbl.id) : onCreateOrder?.(tbl))}
                      className="px-4 py-2 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Utensils className="w-3.5 h-3.5" /> Create Food Order
                    </button>
                  ) : isNeedsAttention ? (
                    <button
                      type="button"
                      onClick={() => onViewRequestTask?.('SR-1001')}
                      className="px-4 py-2 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" /> Handle Requests
                    </button>
                  ) : null}

                  {tbl.orderStatus !== 'Not started' && (
                    <button
                      type="button"
                      onClick={() => onAddItems?.(tbl.id)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
                    >
                      + Add Items
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => (onNewRequest ? onNewRequest(tbl.id) : onCreateRequest?.(tbl))}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
                  >
                    + New Request
                  </button>

                  {isNeedsAttention && (
                    <button
                      type="button"
                      onClick={() => onPingKitchen?.(tbl.id)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer"
                    >
                      Ping Kitchen
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onShareHandoff?.(tbl.id)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-[#1E1548] shadow-2xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gray-500" /> Share / Handoff
                  </button>
                </div>
              </div>

              {/* Customer Row */}
              <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5844A8] flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">{tbl.customerName}</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {tbl.guestsCount} guests • {tbl.area} • Table {tbl.number}
                    </p>
                  </div>
                </div>

                <div>
                  {tbl.orderStatus === 'Not started' ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                      No food order yet • Waiting to order
                    </span>
                  ) : isFoodReady ? (
                    <div className="text-right">
                      <span className="text-xs font-black text-[#1E1548]">{tbl.activeOrderId}</span>
                      <span className="text-xs text-emerald-600 font-bold block">{tbl.itemsOrderedSummary}</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs font-black text-[#1E1548]">{tbl.activeOrderId}</span>
                      <span className={`text-xs font-bold block ${isNeedsAttention ? 'text-rose-600' : 'text-[#5844A8]'}`}>
                        {tbl.itemsOrderedSummary}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5-Column Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 px-5 sm:px-6 py-4 border-b border-gray-100 bg-[#FAF8FF]/30 text-xs">
                {/* 1. RESERVATION */}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">RESERVATION</span>
                  <p className="font-bold text-[#1E1548] mt-1">{tbl.reservationTime || 'Walk-in'}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{tbl.isWalkIn ? 'No advance res' : `${tbl.guestsCount} guests`}</p>
                </div>

                {/* 2. RUNNING VALUE */}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">RUNNING VALUE</span>
                  <p className="font-bold text-[#1E1548] mt-1">₹{tbl.runningValue.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{tbl.runningValue > 0 ? 'Subtotal' : 'Awaiting items'}</p>
                </div>

                {/* 3. ORDER STATUS */}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">ORDER STATUS</span>
                  <p className={`font-bold mt-1 ${isFoodReady ? 'text-emerald-600' : tbl.orderStatus === 'Preparing' ? 'text-[#5844A8]' : 'text-gray-500'}`}>
                    {tbl.orderStatus}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {isFoodReady ? 'All items ready' : tbl.orderStatus === 'Preparing' ? 'In kitchen' : 'Awaiting customer'}
                  </p>
                </div>

                {/* 4. OLDEST WAIT */}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">OLDEST WAIT</span>
                  <p className={`font-bold mt-1 ${tbl.oldestWaitMinutes ? 'text-rose-600 font-black' : 'text-gray-400'}`}>
                    {tbl.oldestWaitMinutes ? `${tbl.oldestWaitMinutes} minutes` : '—'}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {tbl.pingsCount ? `${tbl.pingsCount} pings` : 'No pending pings'}
                  </p>
                </div>

                {/* 5. STAFF */}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">STAFF</span>
                  <p className="font-bold text-[#1E1548] mt-1">{tbl.assignedStaff}</p>
                  <p className={`text-[11px] font-bold ${tbl.staffStatus.includes('follow-up') ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {tbl.staffStatus}
                  </p>
                </div>
              </div>

              {/* Items Ordered / Empty Order Box */}
              <div className="p-5 sm:p-6 space-y-4">
                {tbl.number === '05' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#1E1548] uppercase tracking-wider">ITEMS ORDERED (3)</h4>
                      <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                        Eligible Offer: Welcome Special
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-[#1E1548]">Paneer Tikka</p>
                          <p className="text-[11px] text-gray-500 font-medium">Qty ×1 • ₹240</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">🕒 12m ago</span>
                      </div>

                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-[#1E1548]">Garlic Bread</p>
                          <p className="text-[11px] text-gray-500 font-medium">Qty ×2 • ₹180</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">🕒 10m ago</span>
                      </div>

                      <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-[#1E1548]">Cold Coffee</p>
                          <p className="text-[11px] text-gray-500 font-medium">Qty ×2 • ₹220</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">🕒 8m ago</span>
                      </div>
                    </div>
                  </div>
                )}

                {(tbl.number === '07' || tbl.tableNumber === '07') && (
                  <div className="p-5 bg-purple-50/40 border border-purple-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#1E1548]">No items added yet</h4>
                        <p className="text-[11px] text-gray-400 font-medium">Scan table QR code or take food order directly</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => (onStartOrder ? onStartOrder(tbl.id) : onCreateOrder?.(tbl))}
                        className="px-4 py-2 bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
                      >
                        + Start Order
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddCustomerNote?.(tbl.id)}
                        className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-purple-200 rounded-xl shadow-2xs cursor-pointer transition"
                      >
                        Add Customer Note
                      </button>
                    </div>
                  </div>
                )}

                {tbl.number === '09' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#1E1548] uppercase tracking-wider">ITEMS ORDERED (4)</h4>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ✓ Kitchen: All Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'Margherita Pizza', price: 'Qty ×1 • ₹520' },
                        { name: 'Veg Biryani', price: 'Qty ×2 • ₹760' },
                        { name: 'Cold Coffee', price: 'Qty ×2 • ₹400' },
                        { name: 'Brownie', price: 'Qty ×1 • ₹180' }
                      ].map((it, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-[#1E1548]">{it.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{it.price}</p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-100">
                            ✓ Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tbl.number === '12' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#1E1548] uppercase tracking-wider">ITEMS ORDERED (5)</h4>
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                        2 Kitchen Tickets
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { name: 'Tandoori Platter', price: 'Qty ×1 • ₹580', time: '18m' },
                        { name: 'Dal Makhani', price: 'Qty ×2 • ₹420', time: '16m' },
                        { name: 'Butter Naan', price: 'Qty ×4 • ₹320', time: '15m' },
                        { name: 'Mango Lassi', price: 'Qty ×3 • ₹390', time: '14m' },
                        { name: 'Gulab Jamun', price: 'Qty ×2 • ₹220', time: '14m' }
                      ].map((it, idx) => (
                        <div key={idx} className="p-2.5 bg-amber-50/40 border border-amber-100 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#1E1548] truncate">{it.name}</p>
                            <p className="text-[10px] text-gray-400">{it.price}</p>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded-md border border-gray-100 shrink-0">
                            {it.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Service Requests Subsection */}
                <div className="pt-2">
                  {(tbl.number === '05' || tbl.tableNumber === '05') && (
                    <div className="bg-[#FFF5F7] border border-rose-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-rose-600 flex items-center gap-1.5">
                          ● CUSTOMER SERVICE REQUESTS (2)
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewRequestTask?.('SR-1042')}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          View All &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-rose-600">Extra tissues ×2 • Pinged 3 times</p>
                            <p className="text-[10px] text-gray-400 font-medium">Waiting 8 min • Not yet assigned</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onClaimRequest?.('SR-1042')}
                              className="px-3 py-1 bg-[#1E1548] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Claim
                            </button>
                            <button
                              type="button"
                              onClick={() => onAssignRequest?.('SR-1042')}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg cursor-pointer hover:border-purple-200"
                            >
                              Assign
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-gray-800">Drinking water ×1</p>
                            <p className="text-[10px] text-gray-400 font-medium">In Progress • Meera Joshi</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onViewRequestTask?.('SR-1024')}
                            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg cursor-pointer hover:border-purple-200"
                          >
                            View Task
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(tbl.number === '07' || tbl.tableNumber === '07') && (
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>CUSTOMER SERVICE REQUESTS (0): No active requests for this table. Staff can create one if needed.</span>
                      <button
                        type="button"
                        onClick={() => onNewRequest?.(tbl.id)}
                        className="text-[11px] font-bold text-gray-600 hover:text-black cursor-pointer"
                      >
                        View History &rarr;
                      </button>
                    </div>
                  )}

                  {(tbl.number === '09' || tbl.tableNumber === '09') && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>CUSTOMER SERVICE REQUESTS (0 PENDING) • Completed at 7:52 PM by Rohan Singh</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        ✓ Completed
                      </span>
                    </div>
                  )}

                  {(tbl.number === '12' || tbl.tableNumber === '12') && (
                    <div className="bg-[#FFF5F7] border border-rose-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-rose-600 flex items-center gap-1.5">
                          ● CUSTOMER SERVICE REQUESTS (2 URGENT)
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewRequestTask?.('SR-1001')}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          View All &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-rose-600">Bring the bill • Pinged 4 times</p>
                            <p className="text-[10px] text-gray-400 font-medium">Waiting 15 min • Assigned to you</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onViewRequestTask?.('SR-1001')}
                              className="px-3 py-1 bg-[#1E1548] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Start
                            </button>
                            <button
                              type="button"
                              onClick={() => onEscalateRequest?.('SR-1001')}
                              className="px-3 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-rose-700"
                            >
                              Escalate
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <p className="text-xs font-black text-rose-600">Extra napkins ×1 • 2 pings</p>
                            <p className="text-[10px] text-gray-400 font-medium">Waiting 6 min • Not assigned</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onClaimRequest?.('SR-1051')}
                              className="px-3 py-1 bg-[#1E1548] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Claim
                            </button>
                            <button
                              type="button"
                              onClick={() => onAssignRequest?.('SR-1051')}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg cursor-pointer hover:border-purple-200"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 font-medium gap-2 border-t border-gray-100">
        <span>Showing all 4 assigned tables • Values are illustrative for layout review</span>
        <span>Staff Portal • No billing or payment processing</span>
      </div>
    </div>
  );
};

