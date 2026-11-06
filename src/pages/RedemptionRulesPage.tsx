import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wallet,
  Coins,
  Ticket,
  Tag,
  Layers,
  Check,
  CheckCircle2,
  Calendar,
  Lock,
  Users,
  RefreshCw,
  Percent,
  MapPin,
  Info,
  Edit2,
  Trash2,
  Plus,
  Minus,
  Gift,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { NavRoute } from '../types';

interface RedemptionRulesPageProps {
  onNavigate?: (route: NavRoute) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

type OfferTypeKey = 'cashback' | 'reward_points' | 'free_voucher' | 'discount' | 'combo';

interface OfferTypeOption {
  key: OfferTypeKey;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

interface ComboItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  image: string;
}

interface SavedRule {
  id: string;
  name: string;
  offerType: string;
  rewardValue: string;
  eligibility: string;
  limits: string;
  status: 'Active' | 'Paused';
  redemptionsCount: number;
  lastUpdated: string;
}

const OFFER_OPTIONS: OfferTypeOption[] = [
  {
    key: 'cashback',
    title: 'Cashback',
    subtitle: 'Points or cash back on purchase',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    icon: <Wallet className="w-4 h-4 text-[#0284C7]" />,
  },
  {
    key: 'reward_points',
    title: 'Reward Points',
    subtitle: 'Customers earn points',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    icon: <Coins className="w-4 h-4 text-[#D97706]" />,
  },
  {
    key: 'free_voucher',
    title: 'Free Item / Voucher',
    subtitle: 'Redeem for a free item or voucher',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    icon: <Ticket className="w-4 h-4 text-[#16A34A]" />,
  },
  {
    key: 'discount',
    title: 'Discount Offer',
    subtitle: 'Flat or percentage discount',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    icon: <Tag className="w-4 h-4 text-[#DB2777]" />,
  },
  {
    key: 'combo',
    title: 'Combo Offer',
    subtitle: 'Redeem combo products',
    iconBg: '#F3E8FF',
    iconColor: '#5844A8',
    icon: <Layers className="w-4 h-4 text-[#5844A8]" />,
  },
];

const INITIAL_COMBO_ITEMS: ComboItem[] = [
  {
    id: 'ci-1',
    name: 'Margherita Pizza',
    size: 'Regular Size',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'ci-2',
    name: 'Garlic Bread',
    size: '1 Portion',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'ci-3',
    name: 'Cold Coffee',
    size: 'Regular',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=200',
  },
];

const INITIAL_SAVED_RULES: SavedRule[] = [
  {
    id: 'rule-01',
    name: 'Free Artisan Coffee Voucher',
    offerType: 'Free Item / Voucher',
    rewardValue: 'Free Item (Artisan Latte)',
    eligibility: 'All Customers (Min. 100 pts)',
    limits: 'Max 5 per customer • Total 100',
    status: 'Active',
    redemptionsCount: 84,
    lastUpdated: 'Today at 10:15 AM',
  },
  {
    id: 'rule-02',
    name: 'Standard Points to Cash',
    offerType: 'Reward Points',
    rewardValue: '100 pts = ₹50 discount',
    eligibility: 'Gold Reserve & Obsidian VIP',
    limits: 'Max 3 per customer • Entire Campaign',
    status: 'Active',
    redemptionsCount: 242,
    lastUpdated: 'Yesterday at 4:30 PM',
  },
  {
    id: 'rule-03',
    name: 'Weekend Combo Treat',
    offerType: 'Combo Offer',
    rewardValue: 'Margherita Pizza + Garlic Bread + Cold Coffee',
    eligibility: 'All Membership Tiers',
    limits: 'Max 1 per day • Weekend Only',
    status: 'Active',
    redemptionsCount: 119,
    lastUpdated: '3 days ago',
  },
];

export const RedemptionRulesPage: React.FC<RedemptionRulesPageProps> = ({ onNavigate }) => {
  // Step navigation
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [viewMode, setViewMode] = useState<'builder' | 'directory'>('builder');

  // Step 4 Sub-tab: 'limits' vs 'confirmation' (matches screenshot 1)
  const [step4View, setStep4View] = useState<'limits' | 'confirmation'>('limits');

  // Step 1: Offer Type state
  const [selectedOfferType, setSelectedOfferType] = useState<OfferTypeKey>('cashback');

  // Step 2: Points / Cashback Redemption state
  const [enablePointsRedemption, setEnablePointsRedemption] = useState(true);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(100);
  const [rewardValue, setRewardValue] = useState<number>(50);
  const [allowPartialRedemption, setAllowPartialRedemption] = useState(true);
  const [minPointsToRedeem, setMinPointsToRedeem] = useState<number>(50);

  // Free Voucher specific fields
  const [enableVoucherRedemption, setEnableVoucherRedemption] = useState(true);
  const [voucherType, setVoucherType] = useState<'single' | 'multi'>('single');
  const [voucherValidFor, setVoucherValidFor] = useState('30 Days');
  const [voucherOutlet, setVoucherOutlet] = useState('All Outlets');
  const [voucherCode, setVoucherCode] = useState('LOYAL50');

  // Combo Offer specific fields (matches screenshot 2)
  const [enableComboRedemption, setEnableComboRedemption] = useState(true);
  const [comboItems, setComboItems] = useState<ComboItem[]>(INITIAL_COMBO_ITEMS);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSize, setNewItemSize] = useState('Regular');

  // Step 3: Eligibility state
  const [customerSegment, setCustomerSegment] = useState<'all' | 'specific' | 'new'>('all');
  const [minEligibilityPoints, setMinEligibilityPoints] = useState<number>(100);
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['All Tiers']);
  const [applicableOrderType, setApplicableOrderType] = useState('Entire Order');

  // Step 4: Limits state (matches screenshot 2 of limits)
  const [enableRedemptionLimit, setEnableRedemptionLimit] = useState(true);
  const [limitType, setLimitType] = useState<'customer' | 'campaign'>('customer');
  const [maxPerCustomer, setMaxPerCustomer] = useState<number>(5);
  const [membershipTierLimit, setMembershipTierLimit] = useState('All Tiers');
  const [totalRedemptionLimit, setTotalRedemptionLimit] = useState<number>(100);
  const [limitDuration, setLimitDuration] = useState('Entire Campaign');

  // Step 4: Confirmation state (matches screenshot 1: Enable Redemption Confirmation)
  const [enableConfirmation, setEnableConfirmation] = useState(true);
  const [showConfirmationCheckbox, setShowConfirmationCheckbox] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState(
    'Are you sure you want to redeem 100 points for a $50 discount?'
  );

  // Saved rules directory state
  const [savedRules, setSavedRules] = useState<SavedRule[]>(INITIAL_SAVED_RULES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const generateRandomVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'REV-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setVoucherCode(code);
    showToast(`Generated new voucher code: ${code}`);
  };

  // Update combo item quantity
  const updateComboQuantity = (id: string, delta: number) => {
    setComboItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  // Remove combo item
  const removeComboItem = (id: string) => {
    setComboItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed item from combo offer');
  };

  // Add combo item
  const handleAddComboItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ComboItem = {
      id: 'ci-' + Date.now(),
      name: newItemName.trim(),
      size: newItemSize || 'Regular',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
    };
    setComboItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setIsAddItemModalOpen(false);
    showToast(`Added ${newItem.name} to combo!`);
  };

  // Handle Complete & Save
  const handleSaveAndActivate = () => {
    const offerTitle = OFFER_OPTIONS.find((o) => o.key === selectedOfferType)?.title || 'Cashback';
    let rewardSummary = `${pointsToRedeem} pts = ₹${rewardValue} discount`;
    if (selectedOfferType === 'free_voucher') {
      rewardSummary = `Free Item Voucher (${voucherCode})`;
    } else if (selectedOfferType === 'combo') {
      rewardSummary = comboItems.map((i) => `${i.quantity}x ${i.name}`).join(' + ');
    }

    const newRule: SavedRule = {
      id: 'rule-' + Date.now().toString().slice(-4),
      name: `${offerTitle} Rule - ${limitDuration}`,
      offerType: offerTitle,
      rewardValue: rewardSummary,
      eligibility:
        customerSegment === 'all'
          ? `All Customers (Min. ${minEligibilityPoints} pts)`
          : `Selected Tiers (${selectedTiers.join(', ')})`,
      limits: `Max ${maxPerCustomer} per customer • Total ${totalRedemptionLimit}`,
      status: 'Active',
      redemptionsCount: 0,
      lastUpdated: 'Just now',
    };

    setSavedRules((prev) => [newRule, ...prev]);
    showToast('🎉 Reward redemption rule activated successfully!');
    setViewMode('directory');
  };

  const getStepTitle = (step: Step) => {
    switch (step) {
      case 1:
        return 'Offer Type';
      case 2:
        return 'Redemption Rules';
      case 3:
        return 'Eligibility';
      case 4:
        return 'Limits';
      case 5:
        return 'Review';
    }
  };

  const currentOfferOption = OFFER_OPTIONS.find((o) => o.key === selectedOfferType) || OFFER_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#FAF8FF] font-sans pb-16 flex flex-col justify-between">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[80] bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-purple-500/30 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Item to Combo Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Add Item to Combo</h3>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Chocolate Brownie"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#5844A8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Portion / Size</label>
                <input
                  type="text"
                  value={newItemSize}
                  onChange={(e) => setNewItemSize(e.target.value)}
                  placeholder="e.g. 1 Scoop / Medium"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#5844A8]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComboItem}
                className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 lg:px-12 pt-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
        <div>
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => onNavigate && onNavigate('/campaigns')}
              >
                Campaigns
              </span>
              <span>&gt;</span>
              <span
                className="hover:text-gray-700 cursor-pointer"
                onClick={() => onNavigate && onNavigate('/campaigns/new')}
              >
                Create Campaign
              </span>
              <span>&gt;</span>
              <span className="text-[#111827] font-bold">Reward Redemption Rules</span>
            </div>

            {/* Toggle Builder vs Directory View */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-xl shadow-2xs">
              <button
                onClick={() => setViewMode('builder')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'builder'
                    ? 'bg-[#5844A8] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rule Builder
              </button>
              <button
                onClick={() => setViewMode('directory')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'directory'
                    ? 'bg-[#5844A8] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active Rules ({savedRules.length})
              </button>
            </div>
          </div>

          {viewMode === 'builder' && (
            <>
              {/* Header Title Section */}
              <div className="flex items-start gap-4 mb-6">
                <button
                  onClick={() => {
                    if (currentStep === 4 && step4View === 'confirmation') {
                      setStep4View('limits');
                    } else if (currentStep > 1) {
                      setCurrentStep((prev) => (prev - 1) as Step);
                    }
                  }}
                  className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-2xs cursor-pointer shrink-0 mt-0.5 transition-colors"
                  title="Previous Step"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                    Set Reward Redemption Rules
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Define how customers can redeem this offer.
                  </p>
                </div>
              </div>

              {/* 5-Step Stepper Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-2xl">
                  {([1, 2, 3, 4, 5] as Step[]).map((stepNum, idx) => {
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;
                    return (
                      <React.Fragment key={stepNum}>
                        <div
                          onClick={() => {
                            setCurrentStep(stepNum);
                            if (stepNum === 4) setStep4View('limits');
                          }}
                          className="flex items-center gap-2 cursor-pointer group select-none"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-[#5844A8] text-white ring-4 ring-purple-100 shadow-xs'
                                : isCompleted
                                ? 'bg-[#5844A8] text-white'
                                : 'border border-gray-300 text-gray-400 bg-white group-hover:border-purple-300'
                            }`}
                          >
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                          </div>
                          <span
                            className={`text-xs font-bold whitespace-nowrap transition-colors ${
                              isActive
                                ? 'text-[#111827]'
                                : isCompleted
                                ? 'text-gray-700'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          >
                            {getStepTitle(stepNum)}
                          </span>
                        </div>
                        {idx < 4 && (
                          <div
                            className={`flex-1 h-0.5 mx-3 transition-colors ${
                              currentStep > stepNum ? 'bg-[#5844A8]' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================== */}
              {/* STEP 1: OFFER TYPE                                             */}
              {/* ============================================================== */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Illustrated Card */}
                  <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center justify-center min-h-[380px]">
                    <div className="relative mb-6">
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center shadow-inner">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5844A8] to-[#7C3AED] text-white flex items-center justify-center shadow-lg relative transform -rotate-3 hover:rotate-0 transition-transform">
                          <Gift className="w-9 h-9 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-400 absolute top-1 -left-2" />
                      <span className="w-2 h-2 rounded-full bg-purple-400 absolute -bottom-1 -right-2" />
                    </div>

                    <h3 className="text-lg font-bold text-[#111827] mb-2">
                      Reward Your Customers
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                      Configure flexible rules for how points convert into gifts, items, and loyalty vouchers.
                    </p>
                  </div>

                  {/* Right Options List */}
                  <div className="lg:col-span-7 space-y-3">
                    {OFFER_OPTIONS.map((opt) => {
                      const isSelected = selectedOfferType === opt.key;
                      return (
                        <div
                          key={opt.key}
                          onClick={() => setSelectedOfferType(opt.key)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                            isSelected
                              ? 'border-[#5844A8] shadow-sm ring-2 ring-purple-100/70'
                              : 'border-gray-100 hover:border-purple-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                              style={{ backgroundColor: opt.iconBg }}
                            >
                              {opt.icon}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#111827]">{opt.title}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{opt.subtitle}</p>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#5844A8] bg-[#5844A8]' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 2: REDEMPTION RULES                                        */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div className="max-w-3xl space-y-5">
                  {/* Option Switcher banner */}
                  <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-3 shadow-2xs text-xs">
                    <span className="text-gray-500">
                      Configuring rules for: <span className="font-bold text-[#5844A8]">{currentOfferOption.title}</span>
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                    >
                      Change Offer Type
                    </button>
                  </div>

                  {/* 1. Combo Offer Mode (matches screenshot 2) */}
                  {selectedOfferType === 'combo' ? (
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-base font-bold text-[#111827]">
                            Enable Combo Offer Redemption
                          </h3>
                        </div>
                        <button
                          onClick={() => setEnableComboRedemption(!enableComboRedemption)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            enableComboRedemption ? 'bg-[#5844A8]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              enableComboRedemption ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Combo Offer Details</h4>
                          <p className="text-xs text-gray-400 mt-0.5">Select items to include in the combo offer.</p>
                        </div>

                        {/* Combo Items List */}
                        <div className="space-y-3">
                          {comboItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-2xs hover:border-purple-200 transition-all"
                            >
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100 shadow-2xs"
                                />
                                <div>
                                  <h5 className="text-xs font-bold text-gray-900">{item.name}</h5>
                                  <p className="text-[11px] text-gray-400">{item.size}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Quantity Stepper */}
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60">
                                  <button
                                    type="button"
                                    onClick={() => updateComboQuantity(item.id, -1)}
                                    className="px-2.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 text-xs font-bold text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateComboQuantity(item.id, 1)}
                                    className="px-2.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Trash Action */}
                                <button
                                  type="button"
                                  onClick={() => removeComboItem(item.id)}
                                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Item Button */}
                        <button
                          type="button"
                          onClick={() => setIsAddItemModalOpen(true)}
                          className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#5844A8] rounded-2xl text-xs font-bold text-[#5844A8] bg-[#FAF8FF] hover:bg-purple-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add Item</span>
                        </button>
                      </div>
                    </div>
                  ) : selectedOfferType === 'free_voucher' ? (
                    /* 2. Free Item / Voucher Configuration (matches screenshot 4) */
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-base font-bold text-[#111827]">
                            Enable Free Item / Voucher Redemption
                          </h3>
                        </div>
                        <button
                          onClick={() => setEnableVoucherRedemption(!enableVoucherRedemption)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            enableVoucherRedemption ? 'bg-[#5844A8]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              enableVoucherRedemption ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            VOUCHER TYPE
                          </label>
                          <div className="grid grid-cols-2 bg-gray-50 p-1 rounded-xl border border-gray-200 max-w-md">
                            <button
                              type="button"
                              onClick={() => setVoucherType('single')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                voucherType === 'single'
                                  ? 'bg-[#2D124D] text-white shadow-xs'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Single Use
                            </button>
                            <button
                              type="button"
                              onClick={() => setVoucherType('multi')}
                              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                voucherType === 'multi'
                                  ? 'bg-[#2D124D] text-white shadow-xs'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Multi Use
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            VALID FOR
                          </label>
                          <div className="relative">
                            <select
                              value={voucherValidFor}
                              onChange={(e) => setVoucherValidFor(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:border-[#5844A8] cursor-pointer"
                            >
                              <option value="15 Days">15 Days</option>
                              <option value="30 Days">30 Days</option>
                              <option value="60 Days">60 Days</option>
                              <option value="90 Days">90 Days</option>
                              <option value="Never Expires">Never Expires</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            APPLICABLE OUTLETS
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                              value={voucherOutlet}
                              onChange={(e) => setVoucherOutlet(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:border-[#5844A8] cursor-pointer"
                            >
                              <option value="All Outlets">All Outlets</option>
                              <option value="Downtown Flagship">Downtown Flagship</option>
                              <option value="Northside Mall">Northside Mall</option>
                              <option value="West End Kiosk">West End Kiosk</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            VOUCHER CODE (optional)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={voucherCode}
                              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 tracking-wider uppercase focus:outline-none focus:border-[#5844A8]"
                              placeholder="e.g. LOYAL50"
                            />
                            <button
                              type="button"
                              onClick={generateRandomVoucherCode}
                              title="Generate Random Code"
                              className="p-1.5 text-gray-400 hover:text-[#5844A8] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 3. Points / Cashback Configuration (matches screenshot 5) */
                    <div className="space-y-5">
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => setCurrentStep(1)}
                              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h3 className="text-base font-bold text-[#111827]">
                              Enable Points Redemption
                            </h3>
                          </div>
                          <button
                            onClick={() => setEnablePointsRedemption(!enablePointsRedemption)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                              enablePointsRedemption ? 'bg-[#5844A8]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                enablePointsRedemption ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                              Points to Redeem
                            </label>
                            <div className="relative">
                              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold">
                                ⭐
                              </div>
                              <input
                                type="number"
                                value={pointsToRedeem}
                                onChange={(e) => setPointsToRedeem(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full pl-12 pr-16 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                              />
                              <span className="text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                                points
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                              Reward Value
                            </label>
                            <div className="relative">
                              <span className="text-xs font-black text-gray-500 absolute left-4 top-1/2 -translate-y-1/2">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={rewardValue}
                                onChange={(e) => setRewardValue(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full pl-8 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl flex items-center gap-2.5 text-xs text-purple-900">
                            <Info className="w-4 h-4 text-[#5844A8] shrink-0" />
                            <p>
                              When a customer redeems{' '}
                              <span className="font-bold text-[#5844A8]">{pointsToRedeem} points</span>, they will
                              get a <span className="font-bold text-[#5844A8]">₹ {rewardValue}</span> discount on
                              their order.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Allow Partial Redemption Card */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#5844A8]">
                              <Ticket className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#111827]">Allow Partial Redemption</h4>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Customers can redeem partial points for this offer.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setAllowPartialRedemption(!allowPartialRedemption)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                              allowPartialRedemption ? 'bg-[#5844A8]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                allowPartialRedemption ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {allowPartialRedemption && (
                          <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Minimum Points to Redeem
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={minPointsToRedeem}
                                  onChange={(e) => setMinPointsToRedeem(parseInt(e.target.value) || 0)}
                                  className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                                />
                                <span className="text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                                  points
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                CONVERSION RATE
                              </label>
                              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-800">
                                <span>1 point = ₹ {(rewardValue / Math.max(1, pointsToRedeem)).toFixed(2)}</span>
                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: ELIGIBILITY                                            */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div className="max-w-3xl space-y-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-5">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h3 className="text-base font-bold text-[#111827]">Customer Eligibility</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Specify who is allowed to claim this redemption reward.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          TARGET AUDIENCE
                        </label>
                        <div className="grid grid-cols-3 gap-2.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                          {[
                            { id: 'all', label: 'All Customers' },
                            { id: 'specific', label: 'Specific Tiers' },
                            { id: 'new', label: 'New Members' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setCustomerSegment(t.id as any)}
                              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                customerSegment === t.id
                                  ? 'bg-[#2D124D] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Minimum Loyalty Points Required
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={minEligibilityPoints}
                            onChange={(e) => setMinEligibilityPoints(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                          />
                          <span className="text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                            pts
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          Eligible Membership Tiers
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['All Tiers', 'Obsidian VIP', 'Gold Reserve', 'Standard'].map((tier) => {
                            const isSelected = selectedTiers.includes(tier);
                            return (
                              <button
                                key={tier}
                                type="button"
                                onClick={() => {
                                  if (tier === 'All Tiers') {
                                    setSelectedTiers(['All Tiers']);
                                  } else {
                                    const filtered = selectedTiers.filter((t) => t !== 'All Tiers');
                                    if (filtered.includes(tier)) {
                                      const next = filtered.filter((t) => t !== tier);
                                      setSelectedTiers(next.length === 0 ? ['All Tiers'] : next);
                                    } else {
                                      setSelectedTiers([...filtered, tier]);
                                    }
                                  }
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#5844A8] text-white shadow-xs'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {tier}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Applicable On
                        </label>
                        <div className="relative">
                          <select
                            value={applicableOrderType}
                            onChange={(e) => setApplicableOrderType(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:border-[#5844A8] cursor-pointer"
                          >
                            <option value="Entire Order">Entire Order</option>
                            <option value="Selected Categories Only">Selected Categories Only</option>
                            <option value="Dine-in Only">Dine-in Only</option>
                            <option value="Takeaway Only">Takeaway Only</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: LIMITS & CONFIRMATION                                  */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div className="max-w-3xl space-y-6">
                  {/* Step 4 Sub-Tabs for Limits vs Confirmation (matches screenshot 1 & 2) */}
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <button
                      type="button"
                      onClick={() => setStep4View('limits')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        step4View === 'limits'
                          ? 'bg-[#5844A8] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Redemption Limits
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep4View('confirmation')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        step4View === 'confirmation'
                          ? 'bg-[#5844A8] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Redemption Confirmation Message
                    </button>
                  </div>

                  {step4View === 'limits' ? (
                    /* 4A: Limits Form (matches screenshot 2) */
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#5844A8]">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#111827]">Enable Redemption Limit</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Set limit restrictions on how often this offer can be claimed.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setEnableRedemptionLimit(!enableRedemptionLimit)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            enableRedemptionLimit ? 'bg-[#5844A8]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              enableRedemptionLimit ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {enableRedemptionLimit && (
                        <div className="space-y-5 animate-in fade-in">
                          {/* Row 1 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-2">
                                Redemption Limit Type
                              </label>
                              <div className="grid grid-cols-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => setLimitType('customer')}
                                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    limitType === 'customer'
                                      ? 'bg-[#2D124D] text-white shadow-xs'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  Per Customer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLimitType('campaign')}
                                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    limitType === 'campaign'
                                      ? 'bg-[#2D124D] text-white shadow-xs'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  Campaign Total
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-2">
                                Maximum Redemption per Customer
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={maxPerCustomer}
                                  onChange={(e) => setMaxPerCustomer(parseInt(e.target.value) || 1)}
                                  className="w-full px-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                                />
                                <span className="text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                                  times
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-2">
                                Membership Tier
                              </label>
                              <div className="relative">
                                <select
                                  value={membershipTierLimit}
                                  onChange={(e) => setMembershipTierLimit(e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:border-[#5844A8] cursor-pointer"
                                >
                                  <option value="All Tiers">All Tiers</option>
                                  <option value="Obsidian VIP">Obsidian VIP</option>
                                  <option value="Gold Reserve">Gold Reserve</option>
                                  <option value="Standard">Standard</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-2">
                                Total Redemption Limit (Optional)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={totalRedemptionLimit}
                                  onChange={(e) => setTotalRedemptionLimit(parseInt(e.target.value) || 0)}
                                  className="w-full px-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5844A8]"
                                />
                                <span className="text-xs text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 font-semibold">
                                  total redemptions
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                              Limit Duration
                            </label>
                            <div className="relative max-w-md">
                              <select
                                value={limitDuration}
                                onChange={(e) => setLimitDuration(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:border-[#5844A8] cursor-pointer"
                              >
                                <option value="Entire Campaign">Entire Campaign</option>
                                <option value="Daily Refresh">Daily Refresh</option>
                                <option value="Weekly Refresh">Weekly Refresh</option>
                                <option value="Monthly Refresh">Monthly Refresh</option>
                              </select>
                              <Calendar className="w-4 h-4 text-purple-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* 4B: Enable Redemption Confirmation (matches screenshot 1 e7b98546) */
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setStep4View('limits')}
                            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-base font-bold text-[#111827]">
                            Enable Redemption Confirmation
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnableConfirmation(!enableConfirmation)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            enableConfirmation ? 'bg-[#5844A8]' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              enableConfirmation ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {enableConfirmation && (
                        <div className="space-y-6 animate-in fade-in">
                          {/* Redemption Confirmation Checkbox */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-gray-900">Redemption Confirmation</h4>
                            <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={showConfirmationCheckbox}
                                onChange={(e) => setShowConfirmationCheckbox(e.target.checked)}
                                className="w-4 h-4 rounded text-[#5844A8] accent-[#5844A8] cursor-pointer"
                              />
                              <span>Show confirmation message before redeeming</span>
                            </label>
                          </div>

                          {/* Confirmation Message Textarea */}
                          <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5">
                              Confirmation Message
                            </label>
                            <div className="relative">
                              <textarea
                                value={confirmationMessage}
                                onChange={(e) => setConfirmationMessage(e.target.value.slice(0, 200))}
                                rows={3}
                                className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#5844A8] resize-none"
                                placeholder="Enter custom message..."
                              />
                              <span className="text-[11px] text-gray-400 absolute right-3 bottom-2 font-mono">
                                {confirmationMessage.length}/200
                              </span>
                            </div>
                          </div>

                          {/* Live Preview Box */}
                          <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">
                              Preview
                            </label>
                            <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-2xl flex items-center justify-center">
                              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 max-w-lg w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 shrink-0">
                                    <img
                                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"
                                      alt="Reward preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs font-medium text-gray-800 leading-snug">
                                    {confirmationMessage || 'Are you sure you want to redeem your points for this reward?'}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                  <button
                                    type="button"
                                    className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="px-4 py-1.5 bg-[#111827] hover:bg-[#2D124D] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                                  >
                                    Redeem
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 5: REVIEW (matches screenshot 3)                          */}
              {/* ============================================================== */}
              {currentStep === 5 && (
                <div className="max-w-3xl space-y-4">
                  {/* Card 1: REWARD VALUE */}
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#5844A8]">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          REWARD VALUE
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-0.5">
                          {currentOfferOption.title}
                        </h4>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#EBF7F0] text-[#15803D] border border-[#CEEBD9] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                      Enabled
                    </span>
                  </div>

                  {/* Card 2: ELIGIBILITY */}
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#5844A8]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          ELIGIBILITY
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-0.5">
                          {customerSegment === 'all' ? 'All Customers' : 'Specific Tiers'}
                        </h4>
                        <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                          <p>Min. {minEligibilityPoints} pts</p>
                          <p>{selectedTiers.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Card 3: LIMITS */}
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          LIMITS
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-0.5">
                          Max {maxPerCustomer} redemptions per customer
                        </h4>
                        <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                          <p>Total limit: {totalRedemptionLimit}</p>
                          <p>Duration: {limitDuration}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentStep(4);
                        setStep4View('limits');
                      }}
                      className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Card 4: REDEMPTION VALUE */}
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          REDEMPTION VALUE
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-0.5">
                          {selectedOfferType === 'combo'
                            ? comboItems.map((i) => `${i.quantity}x ${i.name}`).join(' + ')
                            : selectedOfferType === 'free_voucher'
                            ? `Free Item Voucher (${voucherCode})`
                            : `Flat ₹${rewardValue} discount`}
                        </h4>
                        <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                          <p>Applicable on: {applicableOrderType}</p>
                          <p>Combined offers: Allowed</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ============================================================== */}
          {/* DIRECTORY VIEW: ACTIVE REDEMPTION RULES                        */}
          {/* ============================================================== */}
          {viewMode === 'directory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#111827]">Active Redemption Rules</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Manage and monitor operational redemption limits and customer vouchers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setViewMode('builder');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Rule</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-5 bg-white border border-gray-100 rounded-3xl shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#5844A8] border border-purple-100">
                          {rule.offerType}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          {rule.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#111827]">{rule.name}</h3>
                      <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                        <p>
                          <span className="font-semibold text-gray-700">Reward:</span> {rule.rewardValue}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Eligibility:</span> {rule.eligibility}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Limits:</span> {rule.limits}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#5844A8]">
                        {rule.redemptionsCount} claimed
                      </span>
                      <button
                        onClick={() => {
                          setSavedRules((prev) => prev.filter((r) => r.id !== rule.id));
                          showToast(`Rule "${rule.name}" removed.`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer for Builder */}
        {viewMode === 'builder' && (
          <div className="pt-8 pb-4 border-t border-gray-100 flex items-center justify-between mt-8">
            <button
              onClick={() => {
                if (currentStep === 4 && step4View === 'confirmation') {
                  setStep4View('limits');
                } else if (currentStep > 1) {
                  setCurrentStep((prev) => (prev - 1) as Step);
                } else if (onNavigate) {
                  onNavigate('/campaigns');
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep === 4 && step4View === 'limits' ? (
              <button
                onClick={() => setStep4View('confirmation')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep((prev) => (prev + 1) as Step)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSaveAndActivate}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <span>Activate Rule</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
