import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckSquare,
  Plus,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Coffee,
  CheckCircle2,
  MoreVertical,
  X,
  ChevronDown
} from 'lucide-react';
import { NavRoute } from '../types';

export type OrderStatus = 'Incoming' | 'Queued' | 'Brewing' | 'Ready' | 'Settled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  options?: string[];
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedStaff?: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-8901',
    customerName: 'Sarah Jenkins',
    status: 'Incoming',
    items: [
      { id: '1', name: 'Cascara Fizz Botanic Mocktail', quantity: 1, price: 8.00, options: ['Less Ice'] },
      { id: '2', name: 'Almond Croissant', quantity: 1, price: 5.50 }
    ],
    total: 13.50,
    createdAt: new Date(Date.now() - 1000 * 45), // 45 seconds ago
    updatedAt: new Date(Date.now() - 1000 * 45),
  },
  {
    id: 'ORD-8902',
    customerName: 'Michael Chen',
    status: 'Queued',
    items: [
      { id: '3', name: 'Pour Over - Ethiopian Yirgacheffe', quantity: 2, price: 12.00 }
    ],
    total: 24.00,
    createdAt: new Date(Date.now() - 1000 * 180), // 3 mins ago
    updatedAt: new Date(Date.now() - 1000 * 120),
  },
  {
    id: 'ORD-8903',
    customerName: 'Emily Watson',
    status: 'Brewing',
    items: [
      { id: '4', name: 'Oat Milk Latte', quantity: 1, price: 6.50, options: ['Extra Hot', 'Vanilla Syrup'] }
    ],
    total: 6.50,
    createdAt: new Date(Date.now() - 1000 * 300), // 5 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60),
  },
  {
    id: 'ORD-8904',
    customerName: 'David Rodriguez',
    status: 'Ready',
    items: [
      { id: '5', name: 'Cold Brew', quantity: 1, price: 5.00 }
    ],
    total: 5.00,
    createdAt: new Date(Date.now() - 1000 * 480), // 8 mins ago
    updatedAt: new Date(Date.now() - 1000 * 30),
  }
];

export const OrderQueuePage: React.FC<{ onNavigate?: (route: NavRoute) => void }> = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');
  const [openAssignDropdownId, setOpenAssignDropdownId] = useState<string | null>(null);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemPrice, setManualItemPrice] = useState('');

  // Update timers every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const moveOrder = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const handleBatchSettle = () => {
    setOrders(prev => prev.map(order =>
      order.status === 'Ready'
        ? { ...order, status: 'Settled', updatedAt: new Date() }
        : order
    ));
  };

  const submitManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(manualItemPrice) || 0;
    const newOrder: Order = {
      id: `ORD-890${orders.length + 1}`,
      customerName: manualCustomerName || 'Walk-in Customer',
      items: [{ id: Date.now().toString(), name: manualItemName || 'Custom Item', quantity: 1, price }],
      total: price,
      status: 'Incoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
    setIsManualModalOpen(false);
    setManualCustomerName('');
    setManualItemName('');
    setManualItemPrice('');
  };

  const assignStaff = (orderId: string, staffName: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, assignedStaff: staffName, updatedAt: new Date() }
        : order
    ));
  };

  const getElapsedTime = (date: Date) => {
    const seconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const columns: { title: OrderStatus; color: string; bg: string }[] = [
    { title: 'Incoming', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Queued', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Brewing', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Ready', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Settled', color: 'text-gray-600', bg: 'bg-gray-50' }
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col min-h-full bg-[#FAF8FF] w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <div className="flex items-center text-sm text-[#8C827A] mb-1">
            <span className="hover:text-[#1A1615] cursor-pointer">Downtown Flagship</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium text-[#1A1615]">Operations</span>
          </div> */}
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">Order Queue</h1>
          <p className="text-[13px] text-[#6E6A66] max-w-2xl leading-relaxed mt-1.5">
            Monitor live incoming orders, track preparation times, and manage fulfillment workflow across all active channels.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-4 text-sm bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#EAE6E1]">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Wifi className="w-4 h-4" />
              <span>Mesh Connected</span>
            </div>
            <div className="w-px h-4 bg-[#EAE6E1]" />
            <div className="flex items-center gap-2 text-[#8C827A]">
              <span>4ms</span>
            </div>
            <div className="w-px h-4 bg-[#EAE6E1]" />
            <button 
              onClick={() => setChimeEnabled(!chimeEnabled)}
              className="flex items-center gap-2 text-[#1A1615] font-medium hover:text-[#B38637] transition-colors"
            >
              {chimeEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span>Chime {chimeEnabled ? 'On' : 'Off'}</span>
            </button>
          </div> */}

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleBatchSettle}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#EAE6E1] text-[#1A1615] text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#F2EFE9] transition-colors shadow-sm whitespace-nowrap"
            >
              <CheckSquare className="w-4 h-4" />
              Batch Settle
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white text-xs sm:text-sm font-bold rounded-lg hover:opacity-95 transition-opacity shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              Manual Order Entry
            </button>
          </div>
        </div>
      </div>

      <div className=" md:px-0  flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {[
            { label: 'Active Pipeline', value: orders.filter(o => o.status !== 'Settled').length, icon: Activity, trend: '+2', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Avg Prep Speed', value: '4m 12s', icon: Clock, trend: '-15s', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Peak Hour Load', value: '85%', icon: TrendingUp, trend: '+5%', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Awaiting Acceptance', value: orders.filter(o => o.status === 'Incoming').length, icon: AlertCircle, trend: 'Action Needed', color: 'text-red-600', bg: 'bg-red-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#EAE6E1] shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#8C827A] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-[#1A1615]">{stat.value}</h3>
                  <span className={`text-xs font-semibold ${stat.trend.startsWith('+') || stat.trend.startsWith('-') ? (stat.trend.startsWith('-') ? 'text-green-600' : 'text-red-600') : 'text-orange-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 pb-2 overflow-x-auto custom-scrollbar shrink-0">
          {['All', ...columns.map(c => c.title)].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as OrderStatus | 'All')}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap cursor-pointer ${activeFilter === f
                ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white border-transparent shadow-sm'
                : 'bg-white text-[#4A433D] border-[#EAE6E1] hover:bg-[#FAF8F5] hover:text-[#1A1615]'
                }`}
            >
              {f === 'Ready' ? 'Ready / Served' : f}
            </button>
          ))}
        </div>

        {/* Order Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pb-4">
          {orders
            .filter(o => activeFilter === 'All' || o.status === activeFilter)
            .map(order => {
              const column = columns.find(c => c.title === order.status) || columns[0];
              return (
                <div key={order.id} className="bg-white p-4 rounded-xl border border-[#EAE6E1] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#9E9A93] tracking-widest">{order.id}</span>
                    <div className="shrink-0">
                      {order.assignedStaff ? (
                        <button
                          onClick={() => assignStaff(order.id, '')}
                          className="text-[10px] font-bold tracking-wider uppercase text-[#8C827A] hover:text-red-600 transition-colors underline"
                        >
                          Unassign
                        </button>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setOpenAssignDropdownId(openAssignDropdownId === order.id ? null : order.id)}
                            className="flex items-center gap-1 text-[10px] font-bold tracking-wider bg-white border border-[#EAE6E1] rounded px-2 py-1 outline-none hover:border-[#D4A753] cursor-pointer text-[#1A1615]"
                          >
                            Assign Staff...
                            <ChevronDown className={`w-3 h-3 transition-transform ${openAssignDropdownId === order.id ? 'rotate-180' : ''}`} />
                          </button>
                          {openAssignDropdownId === order.id && (
                            <>
                              <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setOpenAssignDropdownId(null); }} />
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#EFECE6] rounded-md shadow-xl z-[60] overflow-hidden text-left">
                                {['Elena Rostova', 'John Doe', 'Sarah Smith'].map(staff => (
                                  <button
                                    key={staff}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      assignStaff(order.id, staff);
                                      setOpenAssignDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[10px] font-bold text-[#1A1615] cursor-pointer hover:bg-[#FAF8F5]"
                                  >
                                    {staff}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 border ${order.status === 'Incoming' ? 'bg-white text-blue-500 border-blue-200' :
                      order.status === 'Queued' ? 'bg-white text-orange-500 border-orange-200' :
                        order.status === 'Brewing' ? 'bg-white text-[#D4A753] border-[#F0E6D2]' :
                          order.status === 'Ready' ? 'bg-white text-green-500 border-green-200' :
                            'bg-white text-[#8C827A] border-[#EAE6E1]'
                      }`}>
                      <Clock className="w-3 h-3" />
                      {getElapsedTime(order.createdAt)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-bold text-[#1A1615] text-[15px]">{order.customerName}</h4>
                    {order.assignedStaff && (
                      <div className="text-[10px] font-bold text-blue-600 mt-1 flex items-center gap-1 uppercase tracking-wider">
                        <Users className="w-3 h-3" />
                        {order.assignedStaff}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex gap-2 min-w-0">
                          <span className="font-bold text-[#B38637] shrink-0">{item.quantity}x</span>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1A1615] break-words">{item.name}</p>
                            {item.options && (
                              <p className="text-xs text-[#8C827A] mt-0.5 break-words">{item.options.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-[#1A1615] shrink-0 ml-2">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EAE6E1] gap-2 flex-wrap">
                    <div className="text-sm font-bold text-[#1A1615]">Total: ${order.total.toFixed(2)}</div>

                    <div className="flex gap-2 flex-wrap justify-end">
                      {order.status === 'Incoming' && (
                        <>
                          <button onClick={() => moveOrder(order.id, 'Settled')} className="px-3 py-1.5 text-sm font-bold text-[#8C827A] bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">Decline</button>
                          <button onClick={() => moveOrder(order.id, 'Queued')} className="px-3 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-[#D4A753] to-[#9E782F] rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer">Accept</button>
                        </>
                      )}
                      {order.status === 'Queued' && (
                        <button onClick={() => moveOrder(order.id, 'Brewing')} className="px-4 py-1.5 text-sm font-bold text-[#8C827A] bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg hover:bg-[#1A1615] hover:text-white transition-colors">Start Brew</button>
                      )}
                      {order.status === 'Brewing' && (
                        <button onClick={() => moveOrder(order.id, 'Ready')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#B38637] rounded-lg hover:bg-[#966D29] transition-colors shadow-sm flex items-center gap-1.5">
                          <Coffee className="w-4 h-4" /> Mark Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button onClick={() => moveOrder(order.id, 'Settled')} className="px-4 py-1.5 text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Settle & Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          {orders.filter(o => activeFilter === 'All' || o.status === activeFilter).length === 0 && (
            <div className="col-span-full h-32 flex items-center justify-center text-[#8C827A] text-sm font-medium border-2 border-dashed border-[#EAE6E1] rounded-xl bg-white/50">
              No orders found
            </div>
          )}
        </div>
      </div>

      {/* Bottom Operational Status Bar */}
      {/* <div className="bg-[#1A1615] text-[#FAF8F5] px-6 py-2.5 flex justify-between items-center text-xs font-medium shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/> POS Terminals: Online</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/> KDS Sync: Active</span>
          <span className="text-[#8C827A]">Last Sync: Just now</span>
        </div>
        <div className="text-[#8C827A]">
          Revia Merchant Suite v2.4.1
        </div>
      </div> */}

      {/* Manual Order Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-4 py-4 border-b border-[#EAE6E1] flex justify-between items-center bg-[#FAF8F5]">
              <h2 className="text-xl font-bold text-[#1A1615] font-serif">Manual Order Entry</h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#8C827A] hover:text-[#1A1615] transition-colors p-2 rounded-xl hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitManualOrder} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-[#1A1615] mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualCustomerName}
                  onChange={e => setManualCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl outline-none focus:border-[#B38637] focus:ring-1 focus:ring-[#B38637] transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1615] mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  value={manualItemName}
                  onChange={e => setManualItemName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl outline-none focus:border-[#B38637] focus:ring-1 focus:ring-[#B38637] transition-all"
                  placeholder="e.g. Oat Milk Latte"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1615] mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={manualItemPrice}
                  onChange={e => setManualItemPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl outline-none focus:border-[#B38637] focus:ring-1 focus:ring-[#B38637] transition-all"
                  placeholder="e.g. 5.50"
                />
              </div>

              <div className="flex gap-3 pt-4 mt-2 border-t border-[#EAE6E1]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-[#EAE6E1] text-[#1A1615] font-bold rounded-xl hover:bg-[#FAF8F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-b from-[#D4A753] to-[#9E782F] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Add Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
