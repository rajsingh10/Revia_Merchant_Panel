import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Plus, 
  ChefHat, 
  Sparkles, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { FoodOrder } from './types';

interface OrderTrackingViewProps {
  order: FoodOrder;
  onBack: () => void;
  onAddItems: (order: FoodOrder) => void;
  onPingKitchen: (order: FoodOrder) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  order,
  onBack,
  onAddItems,
  onPingKitchen,
}) => {
  const steps = [
    { label: 'New', time: '9:30 AM', status: 'done' },
    { label: 'Accepted', time: '9:32 AM', status: 'done' },
    { label: 'Preparing', time: 'In Kitchen', status: order.status === 'awaiting_acceptance' ? 'pending' : 'active' },
    { label: 'Ready', time: 'Est 9:53 AM', status: order.status === 'ready_to_serve' || order.status === 'served' ? 'done' : 'pending' },
    { label: 'Served', time: '--', status: order.status === 'served' ? 'done' : 'pending' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Order #{order.id}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {order.status === 'ready_to_serve' ? 'Ready to Serve' : order.status === 'awaiting_acceptance' ? 'Awaiting Acceptance' : 'Preparing'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Table {order.tableNumber} • {order.customerName} ({order.guestsCount} guests)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddItems(order)}
            className="px-3.5 py-2 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Items</span>
          </button>
          <button
            onClick={() => onPingKitchen(order)}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-gray-500" />
            <span>Ping Kitchen</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Kitchen Tracker Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#4A154B]" />
            <span className="font-bold text-sm text-gray-900">Kitchen Progress Live Status</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>ETA: {order.kitchenEta || '9:53 AM'}</span>
          </div>
        </div>

        {/* Horizontal Tracker Steps */}
        <div className="grid grid-cols-5 gap-2 relative">
          {steps.map((s, idx) => {
            const isDone = s.status === 'done';
            const isActive = s.status === 'active';

            return (
              <div key={s.label} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-[#4A154B] text-white ring-4 ring-[#4A154B]/20 animate-pulse'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isActive ? 'text-[#4A154B]' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{s.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Station Info Box */}
        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-bold text-gray-800">Station 2 (Tandoor & Grill):</span>
            <span>Chef Manoj handling tickets</span>
          </div>
          <span className="text-purple-900 font-semibold">Priority #2 in queue</span>
        </div>
      </div>

      {/* Items in Order */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Ordered Items ({order.items.length})
          </h3>
          <span className="text-xs font-bold text-[#4A154B]">
            Total Value: ₹{order.runningValue}
          </span>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">{item.name}</span>
                <span className="text-gray-400 ml-2">×{item.quantity}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Preparing
                </span>
                <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Offer Pending Alert */}
        {order.hasOfferPending && (
          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4A154B]" />
              <div>
                <span className="font-bold text-purple-900">{order.offerName}</span>
                <p className="text-[11px] text-purple-700">10% discount awaits manager authorization</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
              Pending Approval
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

