import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Search, 
  CheckCircle2, 
  Send,
  Utensils,
  Receipt,
  Sparkles
} from 'lucide-react';
import { FoodOrder, FoodOrderItem } from './types';
import { MOCK_MENU_ITEMS } from './mockData';

interface AddItemsViewProps {
  order: FoodOrder;
  onBack: () => void;
  onConfirmAddItems: (orderId: string, newItems: FoodOrderItem[]) => void;
}

export const AddItemsView: React.FC<AddItemsViewProps> = ({
  order,
  onBack,
  onConfirmAddItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Beverages');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addonBasket, setAddonBasket] = useState<{ item: typeof MOCK_MENU_ITEMS[0]; quantity: number }[]>([
    { item: MOCK_MENU_ITEMS[2], quantity: 2 }, // Cold Coffee x2 (180x2 = 360)
  ]);
  const [addonNote, setAddonNote] = useState<string>('Serve along with main food');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const categories = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts', 'Breads'];

  const addonSubtotal = addonBasket.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const projectedTotal = order.runningValue + addonSubtotal;

  const handleAddItem = (item: typeof MOCK_MENU_ITEMS[0]) => {
    setAddonBasket((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setAddonBasket((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  const handleSendAddon = () => {
    const newItems: FoodOrderItem[] = addonBasket.map((b) => ({
      name: b.item.name,
      quantity: b.quantity,
      price: b.item.price,
      ready: false,
    }));
    onConfirmAddItems(order.id, newItems);
  };

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Items to Order</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Active ticket #{order.id} • Table {order.tableNumber} • {order.customerName}
            </p>
          </div>
        </div>

        <div className="text-xs text-right">
          <span className="text-gray-400 block font-bold uppercase text-[10px]">Current Bill</span>
          <span className="font-bold text-gray-900 text-sm">₹{order.runningValue}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Menu Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food, beverages, desserts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#4A154B] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {MOCK_MENU_ITEMS.filter((item) => {
              if (activeCategory !== 'All' && item.category !== activeCategory) return false;
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
              }
              return true;
            }).map((item) => {
              const inBasket = addonBasket.find((b) => b.item.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                      <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-0.5">
                      {item.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
                    {inBasket ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm text-gray-900 px-1">
                          {inBasket.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddItem(item)}
                          className="w-7 h-7 rounded-lg bg-[#4A154B] hover:bg-[#3d113d] text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddItem(item)}
                        className="px-3.5 py-1.5 bg-gray-50 hover:bg-purple-50 text-[#4A154B] hover:text-[#3d113d] border border-gray-200 hover:border-purple-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Add-on Basket */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-5 flex flex-col justify-between h-fit sticky top-24">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Add-on Ticket</h3>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {addonBasket.reduce((acc, curr) => acc + curr.quantity, 0)} new items
              </span>
            </div>

            {/* Existing order items note */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <span className="font-semibold text-gray-700 block">Existing Active Order:</span>
              <p>{order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</p>
            </div>

            {/* New Addon Items */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {addonBasket.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Select items to add to this order.
                </div>
              ) : (
                addonBasket.map((b) => (
                  <div
                    key={b.item.id}
                    className="flex items-center justify-between p-2.5 bg-purple-50/40 rounded-xl border border-purple-100"
                  >
                    <div className="flex-1 pr-2">
                      <p className="text-xs font-bold text-purple-900">{b.item.name}</p>
                      <p className="text-[10px] text-gray-400">
                        ₹{b.item.price} × {b.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(b.item.id)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-600"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-900">{b.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleAddItem(b.item)}
                        className="w-6 h-6 rounded-md bg-[#4A154B] text-white flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                      <span className="text-xs font-bold text-gray-900 ml-2 w-12 text-right">
                        ₹{b.item.price * b.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Add-on Note for Kitchen
              </label>
              <input
                type="text"
                value={addonNote}
                onChange={(e) => setAddonNote(e.target.value)}
                placeholder="e.g. Rush beverages first"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            {/* Financials */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Existing Order Value</span>
                <span>₹{order.runningValue}</span>
              </div>
              <div className="flex justify-between text-purple-900 font-semibold">
                <span>Add-on Total</span>
                <span>+₹{addonSubtotal}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                <span>Projected New Total</span>
                <span className="text-[#4A154B]">₹{projectedTotal}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              type="button"
              disabled={addonBasket.length === 0}
              onClick={() => setShowReviewModal(true)}
              className="w-full py-2.5 bg-[#4A154B] hover:bg-[#3d113d] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Review Add-on Ticket</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Review Addon Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Confirm Add-on Ticket</h3>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                Table {order.tableNumber}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              This will send a complementary ticket to the kitchen station linked to Order #{order.id}.
            </p>

            <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-gray-800 block">Items to add:</span>
              {addonBasket.map((b) => (
                <div key={b.item.id} className="flex justify-between">
                  <span>{b.item.name} ×{b.quantity}</span>
                  <span className="font-semibold">₹{b.item.price * b.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                <span>New Total Value:</span>
                <span className="text-[#4A154B]">₹{projectedTotal}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  handleSendAddon();
                }}
                className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Add-on</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

