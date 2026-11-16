import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Coffee, 
  Info, 
  CheckSquare, 
  Square,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { FoodOrder } from './types';

interface ServeOrderViewProps {
  order: FoodOrder;
  onBack: () => void;
  onConfirmServed: (orderId: string) => void;
}

export const ServeOrderView: React.FC<ServeOrderViewProps> = ({
  order,
  onBack,
  onConfirmServed,
}) => {
  const [servingState, setServingState] = useState<'ready' | 'on_the_way' | 'served'>('ready');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleStartServing = () => {
    setServingState('on_the_way');
  };

  const handleCompleteServed = () => {
    setServingState('served');
    onConfirmServed(order.id);
  };

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Serve Order</h1>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                ORDER #{order.id}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Confirm the prepared items reach the customer.
            </p>
          </div>
        </div>
      </div>

      {/* Table Pill */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">Table {order.tableNumber}</span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                Food Ready
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {order.customerName} • {order.guestsCount} guests • Outdoor Patio
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-xl">
          Assigned: {order.assignedWaiter}
        </span>
      </div>

      {/* Green Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-900">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Kitchen confirmed all items are Ready. Verify the tray and table before marking the order Served.
        </span>
      </div>

      {/* Serving Status Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Serving Status</h3>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
            servingState === 'served'
              ? 'bg-emerald-100 text-emerald-800'
              : servingState === 'on_the_way'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {servingState === 'served' ? 'Served' : servingState === 'on_the_way' ? 'On the Way' : 'Ready to Serve'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50/80 rounded-xl text-xs">
          <div>
            <span className="text-gray-400 uppercase text-[10px] font-bold block">Kitchen Ready</span>
            <span className="font-bold text-gray-900">9:36 AM</span>
          </div>
          <div>
            <span className="text-gray-400 uppercase text-[10px] font-bold block">Table</span>
            <span className="font-bold text-gray-900">{order.tableNumber} - Outdoor Patio</span>
          </div>
          <div>
            <span className="text-gray-400 uppercase text-[10px] font-bold block">Item Types</span>
            <span className="font-bold text-gray-900">4 • 6 total units</span>
          </div>
          <div>
            <span className="text-gray-400 uppercase text-[10px] font-bold block">Waiter</span>
            <span className="font-bold text-gray-900">{order.assignedWaiter}</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Items Ready for Delivery</h3>
                <p className="text-xs text-gray-400">Check items before leaving the kitchen.</p>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md">
                All Items Ready
              </span>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(idx)}
                    className="w-full p-3.5 bg-gray-50 hover:bg-gray-100/80 rounded-xl flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <span className="font-bold text-sm text-gray-900">{item.name} ×{item.quantity}</span>
                        <p className="text-[11px] text-gray-400">Ready • Kitchen Station</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Note box */}
            <div className="p-3 bg-purple-50/50 rounded-xl text-xs text-purple-900 flex items-center gap-2 border border-purple-100">
              <Info className="w-4 h-4 text-purple-700 shrink-0" />
              <span>One order, one table visit. This screen does not process any payment or loyalty redemption.</span>
            </div>
          </div>
        </div>

        {/* Right Col: Instructions & Next Steps */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Serving Instructions</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Deliver to</span>
                <span className="font-bold text-gray-800">Table {order.tableNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Customer</span>
                <span className="font-bold text-gray-800">{order.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Dining area</span>
                <span className="font-bold text-gray-800">Outdoor Patio</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 italic">
              "Please bring the full order together when possible."
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900">What happens next?</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">1. Start serving</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded text-[11px]">
                  On the Way
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">2. Confirm delivered</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[11px]">
                  Served
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 pt-1">
              The customer and merchant see the order status update in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          Back to Orders
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartServing}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 ${
              servingState === 'on_the_way'
                ? 'bg-blue-600 text-white'
                : 'bg-[#4A154B] hover:bg-[#3d113d] text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Start Serving</span>
          </button>

          <button
            type="button"
            onClick={handleCompleteServed}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm Served</span>
          </button>
        </div>
      </div>
    </div>
  );
};

