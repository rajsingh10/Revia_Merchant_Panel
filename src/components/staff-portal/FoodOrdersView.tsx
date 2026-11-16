import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Coffee, 
  Utensils, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FoodOrder } from './types';

interface FoodOrdersViewProps {
  orders: FoodOrder[];
  onSelectOrder: (order: FoodOrder) => void;
  onServeOrder: (order: FoodOrder) => void;
  onPingKitchen: (order: FoodOrder) => void;
}

export const FoodOrdersView: React.FC<FoodOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onServeOrder,
  onPingKitchen,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'preparing' | 'ready' | 'awaiting' | 'served'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Active', count: orders.filter(o => o.status !== 'served').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready to Serve', count: orders.filter(o => o.status === 'ready_to_serve').length },
    { id: 'awaiting', label: 'Awaiting Acceptance', count: orders.filter(o => o.status === 'awaiting_acceptance').length },
    { id: 'served', label: 'Served', count: orders.filter(o => o.status === 'served').length },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'preparing' && o.status !== 'preparing') return false;
    if (activeFilter === 'ready' && o.status !== 'ready_to_serve') return false;
    if (activeFilter === 'awaiting' && o.status !== 'awaiting_acceptance') return false;
    if (activeFilter === 'served' && o.status !== 'served') return false;
    if (activeFilter === 'all' && o.status === 'served') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTable = o.tableNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      return matchTable || matchCust || matchId;
    }

    return true;
  });

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Food Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track customer orders and food ready to serve.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-50 text-purple-900 text-xs font-bold rounded-xl border border-purple-200">
            MY BRANCH
          </span>
        </div>
      </div>

      {/* Search Bar + Filters Button */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by table, customer, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            />
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span className="font-bold uppercase tracking-wider text-gray-400">Current Orders</span>
        <span>Latest activity first</span>
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No active orders</h3>
            <p className="text-sm text-gray-500 mt-1">There are no orders in the selected queue.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'ready_to_serve';
            const isPreparing = order.status === 'preparing';
            const isAwaiting = order.status === 'awaiting_acceptance';
            const isServed = order.status === 'served';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isReady
                        ? 'bg-emerald-50 text-emerald-700'
                        : isPreparing
                        ? 'bg-purple-50 text-[#4A154B]'
                        : isAwaiting
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Utensils className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">
                          Table {order.tableNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-semibold text-gray-500">
                          #{order.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.customerName} • {order.guestsCount} guests • Sent by {order.assignedWaiter}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isReady
                      ? 'bg-emerald-100 text-emerald-800'
                      : isPreparing
                      ? 'bg-amber-100 text-amber-800'
                      : isAwaiting
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isReady
                      ? 'Ready to Serve'
                      : isPreparing
                      ? 'Preparing'
                      : isAwaiting
                      ? 'Awaiting Acceptance'
                      : 'Served'}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3.5 bg-gray-50/80 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">
                      Items
                    </span>
                    <span className="font-bold text-gray-800 line-clamp-1">
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(' • ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">
                      Running Value
                    </span>
                    <span className="font-bold text-[#4A154B]">₹{order.runningValue}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">
                      {isReady ? 'Ready Since' : 'Kitchen ETA'}
                    </span>
                    <span className="font-bold text-gray-800">
                      {isReady ? '9:36 AM' : order.kitchenEta || 'Pending'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">
                      {isReady ? 'Assigned Waiter' : 'Updated'}
                    </span>
                    <span className="font-bold text-gray-800">
                      {isReady ? order.assignedWaiter : '9:34 AM'}
                    </span>
                  </div>
                </div>

                {/* Status Notice or Offer */}
                {isReady && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Kitchen has marked all items Ready</span>
                  </div>
                )}

                {order.hasOfferPending && (
                  <div className="p-2.5 bg-purple-50/70 rounded-xl text-xs text-purple-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#4A154B]" />
                      <span>{order.offerName || 'Welcome Special'} - Pending Approval</span>
                    </span>
                    <span className="text-[10px] bg-purple-200/60 text-purple-900 px-2 py-0.5 rounded font-bold">
                      Manager Review
                    </span>
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-gray-400">
                    {order.kitchenUpdate || 'Kitchen preparing'}
                  </div>

                  <div className="flex items-center gap-2">
                    {isReady ? (
                      <button
                        onClick={() => onServeOrder(order)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Serve Order</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : isPreparing && order.tableNumber === '12' ? (
                      <button
                        onClick={() => onPingKitchen(order)}
                        className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#4A154B] border border-purple-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Ping Kitchen</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-4 py-2 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>{isAwaiting ? 'View Status' : 'Track Order'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Kitchen Info Banner */}
      <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-3 text-xs text-purple-900">
        <Info className="w-4 h-4 text-purple-700 shrink-0" />
        <span>
          Orders created by waiters and customers use the same kitchen queue. Preparation and ready status are updated in real-time by the Kitchen Display System (KDS).
        </span>
      </div>
    </div>
  );
};

