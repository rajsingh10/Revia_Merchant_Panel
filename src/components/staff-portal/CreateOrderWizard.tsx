import React, { useState } from 'react';
import { 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  Camera, 
  RotateCcw, 
  Edit3, 
  User, 
  Users, 
  Plus, 
  Minus, 
  Search, 
  Trash2, 
  Sparkles, 
  Check, 
  Clock, 
  Send,
  AlertCircle
} from 'lucide-react';
import { DiningTable, FoodOrderItem, FoodOrder } from './types';
import { MOCK_MENU_ITEMS, MOCK_CUSTOMERS } from './mockData';

interface CreateOrderWizardProps {
  initialTable?: DiningTable;
  onBack: () => void;
  onOrderCreated: (newOrder: FoodOrder) => void;
}

export const CreateOrderWizard: React.FC<CreateOrderWizardProps> = ({
  initialTable,
  onBack,
  onOrderCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Table State
  const [selectedTableNum, setSelectedTableNum] = useState<string>(initialTable?.tableNumber || '07');
  const [qrVerified, setQrVerified] = useState<boolean>(true);
  const [manualTableInput, setManualTableInput] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // Step 2: Customer State
  const [isExistingCustomer, setIsExistingCustomer] = useState<boolean>(true);
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [walkinName, setWalkinName] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(initialTable?.guestsCount || 2);
  const [visitNotes, setVisitNotes] = useState<string>('Anniversary celebration, prefers quiet corner');

  // Step 3: Menu & Basket State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [basket, setBasket] = useState<{ item: typeof MOCK_MENU_ITEMS[0]; quantity: number }[]>([
    { item: MOCK_MENU_ITEMS[0], quantity: 1 }, // Paneer Tikka
    { item: MOCK_MENU_ITEMS[1], quantity: 2 }, // Garlic Bread
  ]);
  const [kitchenInstructions, setKitchenInstructions] = useState<string>('Make Paneer Tikka medium spicy');

  // Step 4: Loyalty Offer & Review
  const [applyOffer, setApplyOffer] = useState<boolean>(true);
  const [offerApprovalRequired, setOfferApprovalRequired] = useState<boolean>(true);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('ORD-1072');

  const categories = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts', 'Breads'];

  // Calculations
  const subtotal = basket.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const discountAmount = applyOffer ? Math.round(subtotal * 0.10) : 0;
  const grandTotal = subtotal - discountAmount;

  const handleAddItem = (item: typeof MOCK_MENU_ITEMS[0]) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  const handleSendOrder = () => {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedOrderNumber(newOrderId);

    const orderItems: FoodOrderItem[] = basket.map((b) => ({
      name: b.item.name,
      quantity: b.quantity,
      price: b.item.price,
      ready: false,
    }));

    const newOrder: FoodOrder = {
      id: newOrderId,
      tableNumber: selectedTableNum,
      customerName: isExistingCustomer ? selectedCustomer.name : walkinName || 'Walk-in Guest',
      guestsCount: partySize,
      assignedWaiter: 'Rohan Singh',
      status: 'awaiting_acceptance',
      items: orderItems,
      runningValue: grandTotal,
      kitchenEta: '9:53 AM',
      kitchenUpdate: 'New ticket sent to kitchen',
      hasOfferPending: applyOffer,
      offerName: applyOffer ? 'Welcome Special 10%' : undefined,
    };

    setShowSuccessModal(true);
    // Don't call onOrderCreated immediately, let user click Return to Table Service
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else onBack();
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Food Order</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Verify the physical table before taking the customer's order.
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          STEP {currentStep} OF 4
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between max-w-3xl mx-auto">
        {[
          { step: 1, label: 'Scan QR' },
          { step: 2, label: 'Customer' },
          { step: 3, label: 'Menu' },
          { step: 4, label: 'Review' },
        ].map((item, idx) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;

          return (
            <React.Fragment key={item.step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-purple-800 text-white'
                      : isActive
                      ? 'bg-[#4A154B] text-white ring-4 ring-[#4A154B]/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isActive ? 'text-[#4A154B]' : isDone ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {idx < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-3" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: SCAN QR */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* QR Viewfinder Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5 flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-gray-900 text-base">Scan Table QR</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-800 rounded-lg flex items-center gap-1.5 border border-purple-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                Scanned successfully
              </span>
            </div>
            <p className="text-xs text-gray-500 -mt-2">
              Point the camera at the QR displayed on the table.
            </p>

            {/* Viewfinder Graphic */}
            <div className="relative w-64 h-64 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-purple-300 p-4">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#4A154B] rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#4A154B] rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#4A154B] rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#4A154B] rounded-br-lg" />

              <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <span className="text-[10px] font-bold text-purple-900 mb-1">Loyaltics</span>
                <span className="text-[8px] text-gray-400 mb-2">Scan to identify this table</span>
                <QrCode className="w-24 h-24 text-[#4A154B]" />
                <span className="text-xs font-bold text-gray-800 mt-2">TABLE {selectedTableNum}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Table QR found. Verify the location before continuing.
            </p>

            <button
              onClick={() => {
                setQrVerified(true);
              }}
              className="w-full py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Again</span>
            </button>
          </div>

          {/* Table Identified Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-bold text-gray-900 text-base">Table Identified</span>
              <p className="text-xs text-gray-500 -mt-2">
                Use this table for the new food order.
              </p>

              {/* Table Pill */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center font-bold">
                    T{selectedTableNum}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Table {selectedTableNum}</h3>
                    <p className="text-xs text-gray-500">Indoor Dining • Noida Sector 18</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Table QR verified
                </span>
              </div>

              {/* Specs table */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Current visit</span>
                  <span className="font-semibold text-gray-800">Walk-in • Occupied</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Guests seated</span>
                  <span className="font-semibold text-gray-800">2 guests</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Table service</span>
                  <span className="font-semibold text-[#4A154B]">Rohan Singh (You)</span>
                </div>
              </div>

              {/* Tip info */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 text-xs text-gray-600 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>The table QR confirms where food will be served. Customer details are linked in the next step.</span>
              </div>

              {/* Manual Override Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualMode(!isManualMode)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Enter Table Manually</span>
                </button>

                {isManualMode && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 05, 07, 09, 12"
                      value={manualTableInput}
                      onChange={(e) => setManualTableInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (manualTableInput.trim()) {
                          setSelectedTableNum(manualTableInput.trim());
                          setIsManualMode(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#4A154B] text-white text-xs font-semibold rounded-lg"
                    >
                      Set
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Step Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Back to Table Service
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue to Customer</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CUSTOMER INFORMATION */}
      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Customer & Party Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Link a customer to earn loyalty points and redeem exclusive offers.
            </p>
          </div>

          {/* Existing vs Walk-in toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsExistingCustomer(true)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isExistingCustomer
                  ? 'border-[#4A154B] bg-purple-50/40 text-purple-900 ring-2 ring-[#4A154B]/20 font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#4A154B]" />
                <span className="text-sm">Existing Customer</span>
              </div>
              <p className="text-[11px] text-gray-500 font-normal">Registered member with rewards</p>
            </button>

            <button
              type="button"
              onClick={() => setIsExistingCustomer(false)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                !isExistingCustomer
                  ? 'border-[#4A154B] bg-purple-50/40 text-purple-900 ring-2 ring-[#4A154B]/20 font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#4A154B]" />
                <span className="text-sm">Walk-in / New Guest</span>
              </div>
              <p className="text-[11px] text-gray-500 font-normal">Take direct food order</p>
            </button>
          </div>

          {isExistingCustomer ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Select Customer from Active Venue
              </label>
              <select
                value={selectedCustomer.id}
                onChange={(e) => {
                  const cust = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                  if (cust) setSelectedCustomer(cust);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
              >
                {MOCK_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone} • {c.loyaltyTier})
                  </option>
                ))}
              </select>

              {/* Customer Profile Pill */}
              <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-md">
                    {selectedCustomer.loyaltyTier}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{selectedCustomer.visitsCount} previous visits</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Guest Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          )}

          {/* Party Size Stepper */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <span className="text-sm font-bold text-gray-900">Party Size</span>
              <p className="text-xs text-gray-500">Number of guests seated at Table {selectedTableNum}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-gray-900 text-base">{partySize}</span>
              <button
                type="button"
                onClick={() => setPartySize(partySize + 1)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Visit Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Visit Notes & Preferences
            </label>
            <input
              type="text"
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="e.g. Birthday, anniversary, allergies, window seat preference..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Back to Scan QR
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Menu</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DIGITAL MENU & ORDER BASKET */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Catalog (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              {/* Search & Category Pills */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search food, beverages, desserts..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
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
                if (menuSearchQuery.trim()) {
                  const q = menuSearchQuery.toLowerCase();
                  return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
                }
                return true;
              }).map((item) => {
                const inBasket = basket.find((b) => b.item.id === item.id);
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

          {/* Right Column: Order Basket */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-5 flex flex-col justify-between h-fit sticky top-24">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Basket • Table {selectedTableNum}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isExistingCustomer ? selectedCustomer.name : 'Walk-in'} ({partySize} guests)
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full">
                  {basket.reduce((acc, curr) => acc + curr.quantity, 0)} items
                </span>
              </div>

              {/* Basket Items List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {basket.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    Basket is empty. Select items from the menu.
                  </div>
                ) : (
                  basket.map((b) => (
                    <div
                      key={b.item.id}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-bold text-gray-800">{b.item.name}</p>
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

              {/* Special Instructions for Kitchen */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kitchen Ticket Notes
                </label>
                <textarea
                  rows={2}
                  value={kitchenInstructions}
                  onChange={(e) => setKitchenInstructions(e.target.value)}
                  placeholder="e.g. Less salt, extra spicy, sauce on the side..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
                />
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Welcome Offer (10%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-dashed border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#4A154B]">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="button"
                disabled={basket.length === 0}
                onClick={() => setCurrentStep(4)}
                className="w-full py-2.5 bg-[#4A154B] hover:bg-[#3d113d] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Review</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                Back to Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SEND ORDER */}
      {currentStep === 4 && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Review & Send Order</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Verify table, items, and loyalty offers before firing ticket to kitchen.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              Awaiting Acceptance
            </span>
          </div>

          {/* Table & Guest Summary Header */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Location
              </span>
              <span className="font-bold text-gray-900 text-sm">Table {selectedTableNum}</span>
              <p className="text-[11px] text-gray-500">Indoor Dining</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Customer
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {isExistingCustomer ? selectedCustomer.name : 'Walk-in Guest'}
              </span>
              <p className="text-[11px] text-gray-500">{partySize} guests</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Taking Order
              </span>
              <span className="font-bold text-purple-900 text-sm">Rohan Singh (You)</span>
              <p className="text-[11px] text-gray-500">Floor Service</p>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Items</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
              {basket.map((b) => (
                <div key={b.item.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{b.item.name}</span>
                    <span className="text-gray-400 ml-2">×{b.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{b.item.price * b.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Offer Banner */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4A154B]" />
                <div>
                  <h4 className="font-bold text-sm text-purple-900">Welcome Special 10% Off</h4>
                  <p className="text-xs text-purple-700">Eligible loyalty perk for Aarav Gupta</p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyOffer}
                  onChange={(e) => setApplyOffer(e.target.checked)}
                  className="rounded text-[#4A154B] focus:ring-[#4A154B]"
                />
                Apply Offer
              </label>
            </div>

            {applyOffer && (
              <div className="p-2.5 bg-white/80 rounded-xl text-xs text-purple-900 flex items-center justify-between">
                <span>Manager Approval Required for Discount</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                  Requires Manager Review
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({basket.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            {applyOffer && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Welcome Special Discount (10%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Payable Total</span>
              <span className="text-[#4A154B]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Back to Menu
            </button>
            <button
              type="button"
              onClick={handleSendOrder}
              className="px-6 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Order to Kitchen</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900">Order Sent to Kitchen!</h3>
              <p className="text-xs text-gray-500">
                Ticket <span className="font-bold text-purple-900">#{createdOrderNumber}</span> for Table {selectedTableNum} has been created and sent to the KDS kitchen queue.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl text-xs text-gray-600 space-y-1.5 text-left border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-400">Items:</span>
                <span className="font-semibold">{basket.map(b => `${b.item.name} ×${b.quantity}`).join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Value:</span>
                <span className="font-semibold text-[#4A154B]">₹{grandTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="font-semibold text-amber-700">Awaiting Acceptance</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                onOrderCreated({
                  id: createdOrderNumber,
                  tableNumber: selectedTableNum,
                  customerName: isExistingCustomer ? selectedCustomer.name : 'Walk-in Guest',
                  guestsCount: partySize,
                  assignedWaiter: 'Rohan Singh',
                  status: 'awaiting_acceptance',
                  items: basket.map((b) => ({
                    name: b.item.name,
                    quantity: b.quantity,
                    price: b.item.price,
                    ready: false,
                  })),
                  runningValue: grandTotal,
                  kitchenEta: '9:53 AM',
                  kitchenUpdate: 'New ticket sent to kitchen',
                  hasOfferPending: applyOffer,
                  offerName: applyOffer ? 'Welcome Special 10%' : undefined,
                });
              }}
              className="w-full py-3 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Return to Table Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

