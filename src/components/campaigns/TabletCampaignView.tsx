import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Clock,
  ArrowUpRight,
  Users,
  UserPlus,
  Star,
  Crown,
  Gem,
  Shield,
  Award,
  Store,
  ShoppingBag,
  Receipt,
  Percent,
  Gift,
  Tag,
  Coins,
  Package,
  Repeat,
  Coffee,
  Pizza,
  Utensils,
  Share2,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Smartphone,
  MessageSquare,
  Send,
  QrCode,
  Edit3,
  BarChart2,
  Home,
  Megaphone,
  Car,
  Cake,
  Building2,
  PartyPopper,
  Info,
  Sliders
} from 'lucide-react';
import { NavRoute } from '../../types';

export interface TabletCampaignViewProps {
  initialViewMode?: 'dashboard' | 'builder';
  onNavigate?: (route: string) => void;
  onToggleMobileMenu?: () => void;
}

export interface TabletCampaignItem {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  isTopPerformer?: boolean;
  image: string;
  scannedCount: number;
  redeemedCount: number;
  totalSales: number;
  type: string;
  targetAudience: string;
  validity: string;
  condition: string;
  offer: string;
  expiryDate: string;
  approvalsCount?: number;
  branches: {
    name: string;
    location: string;
    scan: number;
    redeem: number;
    sales: number;
  }[];
}

const INITIAL_CAMPAIGNS: TabletCampaignItem[] = [
  {
    id: 'camp-1',
    number: 1,
    name: 'Welcome Coffee',
    subtitle: 'First-time visitor beverage incentive',
    status: 'ACTIVE',
    isTopPerformer: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
    scannedCount: 1420,
    redeemedCount: 1420,
    totalSales: 17420,
    type: 'Welcome Offer',
    targetAudience: 'All Customers',
    validity: '1 Nov – 30 Nov 2024',
    condition: 'Billing Based: Min ₹200',
    offer: 'Buy 1 Get 1',
    expiryDate: '30 Nov 2024',
    approvalsCount: 3,
    branches: [
      { name: 'Branches1', location: 'West End', scan: 420, redeem: 168, sales: 16900 },
      { name: 'Branches2', location: 'West End', scan: 420, redeem: 168, sales: 16900 },
      { name: 'Branches3', location: 'West End', scan: 420, redeem: 168, sales: 16900 }
    ]
  },
  {
    id: 'camp-2',
    number: 2,
    name: 'Summer Special Feast',
    subtitle: '20% off on all main course pizzas',
    status: 'ACTIVE',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
    scannedCount: 1120,
    redeemedCount: 940,
    totalSales: 15800,
    type: 'Item Based Offer',
    targetAudience: 'All Customers',
    validity: '15 Sep – 30 Sep 2025',
    condition: 'Item Based: Pizza Category',
    offer: '20% Off',
    expiryDate: '30 Sep 2025',
    approvalsCount: 2,
    branches: [
      { name: 'Downtown', location: 'Main Street', scan: 380, redeem: 310, sales: 5200 },
      { name: 'Uptown', location: '5th Ave', scan: 410, redeem: 340, sales: 5800 },
      { name: 'Airport', location: 'Terminal 2', scan: 330, redeem: 290, sales: 4800 }
    ]
  },
  {
    id: 'camp-3',
    number: 3,
    name: 'Happy Hours Afternoon Boost',
    subtitle: 'Buy 1 Get 1 on all mocktails and coolers',
    status: 'DRAFT',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    scannedCount: 0,
    redeemedCount: 0,
    totalSales: 0,
    type: 'Happy Hours',
    targetAudience: 'VIP & VVIP',
    validity: '1 Nov – 30 Nov 2024',
    condition: 'Happy Hours: 2 PM – 6 PM Weekdays',
    offer: 'Buy 1 Get 1 Free',
    expiryDate: '30 Nov 2024',
    approvalsCount: 1,
    branches: [
      { name: 'Downtown Flagship', location: 'Connaught Place', scan: 0, redeem: 0, sales: 0 },
      { name: 'Cyber Hub', location: 'DLF Phase 2', scan: 0, redeem: 0, sales: 0 }
    ]
  }
];

export const TabletCampaignView: React.FC<TabletCampaignViewProps> = ({
  initialViewMode = 'dashboard',
  onNavigate,
  onToggleMobileMenu
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'builder'>(initialViewMode);
  const [campaignsList, setCampaignsList] = useState<TabletCampaignItem[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Bottom Nav Tab: 'home' | 'create' | 'menu' | 'report' | 'approve'
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'create' | 'menu' | 'report' | 'approve'>('create');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // BUILDER FORM STATE (6 Steps matching Figma Mobile Screens)
  // -------------------------------------------------------------
  const [builderStep, setBuilderStep] = useState<number>(1);

  // Step 1: Basic Details (Campaign- Basic Details.png)
  const [campaignName, setCampaignName] = useState('Summer Special');
  const [campaignDescription, setCampaignDescription] = useState('Get 20% off on all main course items. Valid for dine-in and takeaway.');
  const [startDate, setStartDate] = useState('15 Sep 2025');
  const [endDate, setEndDate] = useState('30 Sep 2025');
  const [timeActiveMode, setTimeActiveMode] = useState<'entire_day' | 'specific_time'>('entire_day');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [campaignStatus, setCampaignStatus] = useState<'Active' | 'Draft'>('Active');

  // Step 2: Audience Type (Campaign- Audience.png, Audience-1/2/3.png)
  const [audienceCategory, setAudienceCategory] = useState<'all' | 'new' | 'existing'>('all');
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['VVIP']);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [totalSpendLimit, setTotalSpendLimit] = useState(50000);
  const [totalVisitsLimit, setTotalVisitsLimit] = useState(50);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>(['Dine In', 'Takeaway', 'Delivery', 'All Types']);

  // Step 3: Condition Type (Campaign- Condition.png & detail screens)
  const [conditionType, setConditionType] = useState<
    'visit' | 'billing' | 'stamps' | 'item' | 'happy_hours' | 'birthday' | 'combo'
  >('billing');
  const [isConfiguringCondition, setIsConfiguringCondition] = useState<boolean>(true);

  // Billing Condition state (Campaign- Condition- Billing.png)
  const [billingTargetAmount, setBillingTargetAmount] = useState(500);
  const [billingFrequency, setBillingFrequency] = useState<'Weekly' | 'Monthly' | 'Quarterly' | 'Per Campaign'>('Monthly');
  const [allowEarlyRedemption, setAllowEarlyRedemption] = useState<'yes' | 'no'>('yes');
  const [whenToGiveOffer, setWhenToGiveOffer] = useState<'same_order' | 'next_visit'>('same_order');

  // Visit Condition state (Campaign- Condition- Visit.png)
  const [visitQualifyingCount, setVisitQualifyingCount] = useState(1);
  const [visitMinBill, setVisitMinBill] = useState('0');
  const [visitApplyTo, setVisitApplyTo] = useState<'per_bill' | 'total_spent'>('per_bill');
  const [visitAvailability, setVisitAvailability] = useState<'same_day' | 'month_end'>('same_day');

  // Happy Hours Condition state (Campaign- Condition- Happy Hours.png)
  const [happyHourStart, setHappyHourStart] = useState('10:00 AM');
  const [happyHourEnd, setHappyHourEnd] = useState('04:00 PM');
  const [happyHourDays, setHappyHourDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [happyHourItemScope, setHappyHourItemScope] = useState('All items');

  // Birthday / Anniversary state (Campaign- Condition- Birthday.png)
  const [birthdayMonth, setBirthdayMonth] = useState('Aug');
  const [specialDayMode, setSpecialDayMode] = useState<'birthday' | 'anniversary'>('birthday');
  const [birthdayDaysSpan, setBirthdayDaysSpan] = useState(3);

  // Stamps state (Campaign- Condition- Stamps.png)
  const [stampsCount, setStampsCount] = useState(5);
  const [stampItemScope, setStampItemScope] = useState('Any item');
  const [stampValidityPeriod, setStampValidityPeriod] = useState('Monthly');

  // Item Based Offers state (Campaign- Condition- Item Based Offers.png)
  const [itemOfferScope, setItemOfferScope] = useState<'specific' | 'category'>('specific');
  const [itemCategoryTab, setItemCategoryTab] = useState('Pizzas');
  const [selectedItemsForCondition, setSelectedItemsForCondition] = useState<string[]>([
    'Margherita Pizza',
    'Pasta Alfredo'
  ]);

  // Step 4: Reward Type (Campaign- Reward Type.png & Buy X Get Y Free.png)
  const [rewardType, setRewardType] = useState<
    'cashback' | 'points' | 'free_item' | 'discount' | 'nominal_item' | 'combo' | 'bogo'
  >('bogo');
  const [isConfiguringReward, setIsConfiguringReward] = useState<boolean>(true);
  const [bogoBuyQty, setBogoBuyQty] = useState(1);
  const [bogoGetFreeQty, setBogoGetFreeQty] = useState(1);
  const [bogoSelectedItems, setBogoSelectedItems] = useState<string[]>(['Margherita Pizza', 'Farmhouse Pizza']);
  const [bogoFreeRule, setBogoFreeRule] = useState<'same_item' | 'any_item_same_price'>('same_item');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [cashbackAmount, setCashbackAmount] = useState(100);

  // Step 5: Templates & Messaging Channel
  const [messageChannel, setMessageChannel] = useState<'whatsapp' | 'sms' | 'in_app'>('whatsapp');
  const [promoCode, setPromoCode] = useState('SUMMER20');
  const [messageHeadline, setMessageHeadline] = useState('Special Offer Just For You! 🎉');

  // Filtered campaigns for dashboard
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((camp) => {
      if (typeFilter !== 'All Types' && !camp.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          camp.name.toLowerCase().includes(q) ||
          camp.subtitle.toLowerCase().includes(q) ||
          camp.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [campaignsList, typeFilter, searchQuery]);

  const handleToggleSelectCampaign = (id: string) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaignIds.length === filteredCampaigns.length) {
      setSelectedCampaignIds([]);
    } else {
      setSelectedCampaignIds(filteredCampaigns.map((c) => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCampaignIds.length === 0) return;
    setCampaignsList((prev) => prev.filter((c) => !selectedCampaignIds.includes(c.id)));
    setSelectedCampaignIds([]);
    showToast('Campaign(s) deleted successfully');
  };

  const handlePauseSelected = () => {
    if (selectedCampaignIds.length === 0) return;
    setCampaignsList((prev) =>
      prev.map((c) => (selectedCampaignIds.includes(c.id) ? { ...c, status: c.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' } : c))
    );
    showToast('Campaign status toggled');
  };

  const handleLaunchCampaign = () => {
    const newCamp: TabletCampaignItem = {
      id: `camp-${Date.now()}`,
      number: campaignsList.length + 1,
      name: campaignName || 'Summer Special',
      subtitle: campaignDescription || 'Exclusive seasonal rewards',
      status: campaignStatus === 'Active' ? 'ACTIVE' : 'DRAFT',
      isTopPerformer: false,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
      scannedCount: 0,
      redeemedCount: 0,
      totalSales: 0,
      type: conditionType === 'billing' ? 'Billing Based' : conditionType === 'visit' ? 'Visit Based' : 'Special Offer',
      targetAudience: audienceCategory === 'all' ? 'All Customers' : audienceCategory === 'new' ? 'New Customers' : 'VIP Tiers',
      validity: `${startDate} – ${endDate}`,
      condition: conditionType === 'billing' ? `Billing Based: Min ₹${billingTargetAmount}` : 'Visit Based: 1 visit',
      offer: rewardType === 'bogo' ? 'Buy 1 Get 1' : `${discountPercent}% Off`,
      expiryDate: endDate,
      approvalsCount: 0,
      branches: [
        { name: 'Branches1', location: 'West End', scan: 0, redeem: 0, sales: 0 },
        { name: 'Branches2', location: 'West End', scan: 0, redeem: 0, sales: 0 }
      ]
    };
    setCampaignsList([newCamp, ...campaignsList]);
    setViewMode('dashboard');
    setBuilderStep(1);
    showToast(`Campaign "${newCamp.name}" launched successfully! 🚀`);
  };

  // -------------------------------------------------------------
  // RENDER: MOBILE & TABLET BUILDER WIZARD (Matching Figma Mobile Screens)
  // -------------------------------------------------------------
  if (viewMode === 'builder') {
    return (
      <div className="min-h-screen bg-[#FAF8FF] font-sans pb-28 text-[#1A1615]">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#5844A8] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Mobile / Tablet Stepper Header Bar (Campaign- Basic Details.png) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F1EFEA] px-3 sm:px-6 py-3.5 shadow-2xs">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#1A1615]">9:41</span>
            </div>
            <button
              onClick={() => setViewMode('dashboard')}
              className="p-1.5 rounded-xl hover:bg-[#FAF8F5] text-[#8C877D] hover:text-[#1A1615] transition-colors cursor-pointer"
              title="Close Wizard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 6 Step Progress Indicators with Visible Labels on Mobile */}
          <div className="max-w-xl mx-auto pt-2 pb-1">
            <div className="flex items-start justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-3 sm:top-3.5 left-4 right-4 h-0.5 bg-[#E5E0D8] -z-0" />
              {[
                { step: 1, label: 'Basic Details' },
                { step: 2, label: 'Audience Type' },
                { step: 3, label: 'Conditions' },
                { step: 4, label: 'Rewards' },
                { step: 5, label: 'Templates' },
                { step: 6, label: 'Review & Launch' }
              ].map((s) => {
                const isActive = builderStep === s.step;
                const isCompleted = builderStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setBuilderStep(s.step)}
                    className="flex flex-col items-center relative z-10 cursor-pointer focus:outline-hidden max-w-[55px] sm:max-w-none"
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-2xs ${
                        isActive
                          ? 'bg-[#5844A8] text-white ring-3 ring-[#5844A8]/15'
                          : isCompleted
                          ? 'bg-[#6D28D9] text-white'
                          : 'bg-white border-2 border-[#CBD5E1] text-[#64748B]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : s.step}
                    </div>
                    <span
                      className={`text-[8px] sm:text-[9.5px] font-semibold mt-1 tracking-tight text-center leading-tight ${
                        isActive ? 'text-[#5844A8] font-bold' : 'text-[#8C877D]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wizard Form Content */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-5">
          {/* STEP 1: BASIC DETAILS (Campaign- Basic Details.png) */}
          {builderStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Basic Details</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Give your campaign a name and add a short description.
                </p>
              </div>

              {/* Campaign name */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#1A1615] mb-1.5">
                    Campaign name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Summer Special"
                    className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#5844A8]"
                  />
                </div>

                {/* Audience description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-[#1A1615]">Audience description</label>
                    <span className="text-[10px] text-[#8C877D] font-mono">
                      {campaignDescription.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Short description for your customers..."
                    className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#5844A8] resize-none"
                  />
                </div>
              </div>

              {/* Campaign Validity */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-[#1A1615]">Campaign Validity</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">Set the start and end date for your campaign.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E6A66] mb-1">Start date</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-semibold text-[#1A1615]">
                      <Calendar className="w-4 h-4 text-[#8C877D]" />
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent focus:outline-hidden w-full font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6E6A66] mb-1">End date</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-semibold text-[#1A1615]">
                      <Calendar className="w-4 h-4 text-[#8C877D]" />
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent focus:outline-hidden w-full font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* When will campaign be active */}
                <div className="pt-2 border-t border-[#F1EFEA]">
                  <span className="block text-xs font-black text-[#1A1615] mb-2.5">
                    When will this campaign be active?
                  </span>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="timeActiveMode"
                        checked={timeActiveMode === 'entire_day'}
                        onChange={() => setTimeActiveMode('entire_day')}
                        className="w-4 h-4 text-[#5844A8] accent-[#5844A8]"
                      />
                      <span className="text-xs font-semibold text-[#1A1615]">Entire day</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="timeActiveMode"
                        checked={timeActiveMode === 'specific_time'}
                        onChange={() => setTimeActiveMode('specific_time')}
                        className="w-4 h-4 text-[#5844A8] accent-[#5844A8]"
                      />
                      <span className="text-xs font-semibold text-[#1A1615]">Specific time</span>
                    </label>

                    {timeActiveMode === 'specific_time' && (
                      <div className="flex items-center gap-2 pl-7 pt-1">
                        <select
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="px-3 py-1.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-semibold"
                        >
                          {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-xs text-[#8C877D]">-</span>
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="px-3 py-1.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-semibold"
                        >
                          {['08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Status Selection */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1615]">Campaign Status</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">
                    Choose whether to start the campaign immediately or keep it as a draft
                  </p>
                </div>

                <div
                  onClick={() => setCampaignStatus('Active')}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    campaignStatus === 'Active'
                      ? 'border-[#7C3AED] bg-[#FAF5FF] shadow-xs'
                      : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] flex items-center justify-center text-[#6D28D9]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1A1615]">Active</div>
                      <div className="text-[11px] text-[#6E6A66]">Campaign will be live as soon as you save it.</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${campaignStatus === 'Active' ? 'border-[#5844A8] bg-[#5844A8]' : 'border-gray-300'}`}>
                    {campaignStatus === 'Active' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div
                  onClick={() => setCampaignStatus('Draft')}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    campaignStatus === 'Draft'
                      ? 'border-[#7C3AED] bg-[#FAF5FF] shadow-xs'
                      : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#8C877D]">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1A1615]">Draft</div>
                      <div className="text-[11px] text-[#6E6A66]">Save and activate it later.</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${campaignStatus === 'Draft' ? 'border-[#5844A8] bg-[#5844A8]' : 'border-gray-300'}`}>
                    {campaignStatus === 'Draft' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Mobile Bottom CTA (Full Width Purple Next Button) */}
              <div className="pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setBuilderStep(2)}
                  className="w-full py-3.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-sm font-bold shadow-md cursor-pointer transition-all active:scale-[0.99]"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AUDIENCE TYPE (Campaign- Audience.png, Audience-1/2/3.png) */}
          {builderStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Choose your audience</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Select who will be eligible to see and use this campaign.
                </p>
              </div>

              {/* Main Audience Category (Campaign- Audience.png) */}
              <div className="space-y-2.5">
                {[
                  { id: 'all', title: 'All customers', desc: 'Show to everyone', icon: Users, color: '#6D28D9', bg: '#FAF5FF', border: '#E9D5FF' },
                  { id: 'new', title: 'New customers only', desc: 'Only show to first time visitors.', icon: UserPlus, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
                  { id: 'existing', title: 'Existing customers only', desc: 'Show to your regular customers.', icon: Star, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
                ].map((aud) => {
                  const isSelected = audienceCategory === aud.id;
                  const Icon = aud.icon;
                  return (
                    <div
                      key={aud.id}
                      onClick={() => setAudienceCategory(aud.id as any)}
                      className={`p-3.5 sm:p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#7C3AED] bg-white ring-2 ring-[#7C3AED]/20 shadow-xs'
                          : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border shrink-0"
                          style={{ backgroundColor: aud.bg, borderColor: aud.border }}
                        >
                          <Icon className="w-5 h-5" style={{ color: aud.color }} />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-[#1A1615]">{aud.title}</div>
                          <div className="text-[11px] sm:text-xs text-[#6E6A66]">{aud.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#5844A8] bg-[#5844A8]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Tiers Filter (Campaign- Audience-1.png) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1615]">VVIP / VIP / Gold / Silver / Bronze</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">Filter by customer tier(s).</p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'VVIP', label: 'VVIP', desc: 'Our most loyal customers', icon: Crown, color: '#7E22CE', bg: '#FAF5FF', border: '#F3E8FF' },
                    { id: 'VIP', label: 'VIP', desc: 'High spending, frequent visitors', icon: Gem, color: '#9333EA', bg: '#FAF5FF', border: '#F3E8FF' },
                    { id: 'Gold', label: 'Gold', desc: 'Regular customers', icon: Award, color: '#D97706', bg: '#FFFBEB', border: '#FEF3C7' },
                    { id: 'Silver', label: 'Silver', desc: 'Occasional customers', icon: Shield, color: '#0284C7', bg: '#F0F9FF', border: '#E0F2FE' },
                    { id: 'Bronze', label: 'Bronze', desc: 'New and exploring customers', icon: Store, color: '#EA580C', bg: '#FFF7ED', border: '#FFEDD5' }
                  ].map((tier) => {
                    const isSelected = selectedTiers.includes(tier.id);
                    const Icon = tier.icon;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          setSelectedTiers((prev) =>
                            prev.includes(tier.id) ? prev.filter((t) => t !== tier.id) : [...prev, tier.id]
                          );
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#7C3AED] bg-[#FAF5FF] shadow-2xs'
                            : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
                            style={{ backgroundColor: tier.bg, borderColor: tier.border }}
                          >
                            <Icon className="w-4 h-4" style={{ color: tier.color }} />
                          </div>
                          <div>
                            <div className="text-xs font-black text-[#1A1615]">{tier.label}</div>
                            <div className="text-[10px] text-[#6E6A66]">{tier.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#5844A8] border-[#5844A8]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demographics & Sliders (Campaign- Audience-2.png) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-[#1A1615]">Demographics & Spending</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">Narrow down your audience with extra conditions.</p>
                </div>

                {/* Age Range */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1615] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6D28D9]" /> Age Range
                    </span>
                    <span className="text-[#6D28D9] font-mono">{ageRange[0]} TO {ageRange[1]}+</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={ageRange[1]}
                    onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
                    className="w-full accent-[#5844A8] cursor-pointer"
                  />
                </div>

                {/* Gender */}
                <div>
                  <div className="text-xs font-bold text-[#1A1615] mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#6D28D9]" /> Gender
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-[#FAF8FF] p-1.5 rounded-2xl border border-[#E9D5FF]">
                    {['All', 'Male', 'Female'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderFilter(g as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          genderFilter === g
                            ? 'bg-[#5844A8] text-white shadow-xs'
                            : 'text-[#6E6A66] hover:bg-white/80'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Spend */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1615] mb-2">
                    <span>Total Spend (₹)</span>
                    <span className="text-[#6D28D9] font-mono">₹0 to ₹{totalSpendLimit.toLocaleString()}+</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={5000}
                    value={totalSpendLimit}
                    onChange={(e) => setTotalSpendLimit(parseInt(e.target.value))}
                    className="w-full accent-[#5844A8] cursor-pointer"
                  />
                </div>
              </div>

              {/* Order Types Availability (Campaign- Audience-3.png) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1615]">Where will this campaign be available?</h3>
                  <p className="text-xs text-[#8C877D] mt-0.5">Choose order types where customers can use this offer.</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    { id: 'Dine In', desc: 'For dining at outlet', icon: Utensils },
                    { id: 'Takeaway', desc: 'For takeout orders', icon: ShoppingBag },
                    { id: 'Delivery', desc: 'For online orders', icon: Store },
                    { id: 'All Types', desc: 'Dine in, Takeaway & Delivery', icon: Layers }
                  ].map((ot) => {
                    const isSelected = selectedOrderTypes.includes(ot.id);
                    const Icon = ot.icon;
                    return (
                      <div
                        key={ot.id}
                        onClick={() => {
                          setSelectedOrderTypes((prev) =>
                            prev.includes(ot.id) ? prev.filter((o) => o !== ot.id) : [...prev, ot.id]
                          );
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#7C3AED] bg-[#FAF5FF] shadow-2xs'
                            : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#E9D5FF] flex items-center justify-center text-[#6D28D9]">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-[#5844A8] border-[#5844A8]' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#1A1615]">{ot.id}</div>
                          <div className="text-[9.5px] text-[#8C877D] leading-tight mt-0.5">{ot.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Back & Next Bar (Campaign- Audience.png) */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setBuilderStep(1)}
                  className="text-xs font-bold text-[#1A1615] hover:text-[#5844A8] flex items-center gap-1.5 cursor-pointer py-2.5 px-3"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderStep(3)}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONDITIONS (Campaign- Condition.png & specific condition screens) */}
          {builderStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Select Condition Type</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Choose how you want to define eligibility for this campaign.
                </p>
              </div>

              {/* Condition Options List (Campaign- Condition.png) */}
              <div className="space-y-2">
                {[
                  { id: 'visit', title: 'Visit', desc: 'Qualifying no of visits', icon: Car, color: '#DC2626', bg: '#FEF2F2', border: '#FECDD3' },
                  { id: 'billing', title: 'Billing', desc: 'Target amount / frequency', icon: Receipt, color: '#7C3AED', bg: '#FAF5FF', border: '#F3E8FF' },
                  { id: 'stamps', title: 'Stamps', desc: 'Qualifying item / no of stamps', icon: Star, color: '#D97706', bg: '#FFFBEB', border: '#FEF3C7' },
                  { id: 'item', title: 'Item based offers', desc: 'Specific items or categories', icon: ShoppingBag, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
                  { id: 'happy_hours', title: 'Happy Hours', desc: 'Time + day based', icon: Clock, color: '#EA580C', bg: '#FFF7ED', border: '#FFEDD5' },
                  { id: 'birthday', title: 'Birthday / Anniversary', desc: 'Special day based', icon: Cake, color: '#DB2777', bg: '#FDF2F8', border: '#FCE7F3' },
                  { id: 'combo', title: 'Combo offers', desc: 'Qualifying item / combo', icon: Package, color: '#6D28D9', bg: '#FAF5FF', border: '#E9D5FF' }
                ].map((cond) => {
                  const isSelected = conditionType === cond.id;
                  const Icon = cond.icon;
                  return (
                    <div
                      key={cond.id}
                      onClick={() => {
                        setConditionType(cond.id as any);
                        setIsConfiguringCondition(true);
                      }}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#FAF5FF] shadow-xs ring-2 ring-[#7C3AED]/20'
                          : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shrink-0"
                          style={{ backgroundColor: cond.bg, borderColor: cond.border }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: cond.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#1A1615]">{cond.title}</div>
                          <div className="text-[10px] text-[#6E6A66]">{cond.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C877D]" />
                    </div>
                  );
                })}
              </div>

              {/* SPECIFIC CONDITION DETAILS: BILLING (Campaign- Condition- Billing.png) */}
              {conditionType === 'billing' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#1A1615]">Billing Rule</h3>
                    <p className="text-xs text-[#8C877D] mt-0.5">Set the spend target required to avail this campaign.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#1A1615]">Target Amount</label>
                      <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md">Required</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                      <span className="text-2xl font-black text-[#1A1615]">₹ {billingTargetAmount}</span>
                      <span className="text-xs font-bold text-[#6D28D9]">INR ₹</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2.5">
                      {[250, 500, 1000, 2500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setBillingTargetAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            billingTargetAmount === amt
                              ? 'bg-[#5844A8] text-white shadow-xs'
                              : 'bg-[#FAF8FF] border border-[#E9D5FF] text-[#1A1615]'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1615] mb-1.5">Frequency (Optional)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Weekly', 'Monthly', 'Quarterly', 'Per Campaign'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setBillingFrequency(freq as any)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            billingFrequency === freq
                              ? 'bg-[#6D28D9] text-white shadow-xs'
                              : 'bg-[#FAF8FF] border border-[#E9D5FF] text-[#6E6A66]'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rule Preview */}
                  <div className="p-3 bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      i
                    </div>
                    <div className="text-xs text-[#581C87]">
                      <span className="font-bold">Rule Preview: </span>
                      Customer will be eligible after spending <span className="font-bold">₹{billingTargetAmount}</span> in a <span className="font-bold">{billingFrequency.toLowerCase()}</span>.
                    </div>
                  </div>

                  {/* Allow Early Redemption */}
                  <div className="pt-3 border-t border-[#F1EFEA] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#1A1615]">Allow Early Redemption</span>
                      <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Required</span>
                    </div>
                    <p className="text-[11px] text-[#8C877D]">Can customer redeem before the period ends if required bill amount is met?</p>
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div
                        onClick={() => setAllowEarlyRedemption('yes')}
                        className={`p-3 rounded-xl border cursor-pointer ${
                          allowEarlyRedemption === 'yes' ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#1A1615]">Yes</div>
                        <div className="text-[10px] text-[#8C877D] mt-0.5">Allow early redemption</div>
                      </div>
                      <div
                        onClick={() => setAllowEarlyRedemption('no')}
                        className={`p-3 rounded-xl border cursor-pointer ${
                          allowEarlyRedemption === 'no' ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#1A1615]">No</div>
                        <div className="text-[10px] text-[#8C877D] mt-0.5">Wait till period ends</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC CONDITION DETAILS: VISIT (Campaign- Condition- Visit.png) */}
              {conditionType === 'visit' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#1A1615]">Visit Rule</h3>
                    <p className="text-xs text-[#8C877D] mt-0.5">Set the number of visits required to avail this campaign.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#1A1615]">Qualifying no of visits</span>
                      <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Mandatory</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setVisitQualifyingCount(Math.max(1, visitQualifyingCount - 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-[#E5E0D8] font-bold text-sm"
                      >
                        -
                      </button>
                      <div className="text-center">
                        <div className="text-xl font-black text-[#1A1615]">{visitQualifyingCount}</div>
                        <div className="text-[10px] text-[#8C877D]">visit</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVisitQualifyingCount(visitQualifyingCount + 1)}
                        className="w-9 h-9 rounded-xl bg-[#5844A8] text-white font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1615] mb-1">Minimum bill amount</label>
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-bold">
                      <span>₹ {visitMinBill}</span>
                      <span className="text-[#8C877D]">INR</span>
                    </div>
                  </div>

                  {/* Rule Preview */}
                  <div className="p-3 bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      i
                    </div>
                    <div className="text-xs text-[#581C87]">
                      <span className="font-bold">Rule Preview: </span>
                      Customer needs to visit your restaurant at least <span className="font-bold">{visitQualifyingCount} time</span> to be eligible.
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC CONDITION DETAILS: HAPPY HOURS (Campaign- Condition- Happy Hours.png) */}
              {conditionType === 'happy_hours' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl">
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Peak Traffic Strategy
                    </div>
                    <div className="text-base font-black mt-1">Afternoon Boost</div>
                    <div className="text-xs text-purple-200 mt-0.5">Drive 3.4x weekday footfall during slow hours</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#1A1615] mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6D28D9]" /> Time range
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-bold text-center">
                        {happyHourStart}
                      </div>
                      <span className="text-xs text-[#8C877D]">→</span>
                      <div className="flex-1 px-3 py-2 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-xs font-bold text-center">
                        {happyHourEnd}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#1A1615] mb-2">Days of the week (5)</div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const isDayActive = happyHourDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setHappyHourDays((prev) =>
                                prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                              );
                            }}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isDayActive
                                ? 'bg-[#5844A8] text-white shadow-xs'
                                : 'bg-[#FAF8FF] text-[#8C877D] border border-[#E9D5FF]'
                            }`}
                          >
                            {day.slice(0, 1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC CONDITION DETAILS: BIRTHDAY / ANNIVERSARY (Campaign- Condition- Birthday.png) */}
              {conditionType === 'birthday' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#1A1615]">Birthday / Anniversary Offer Rule</h3>
                    <p className="text-xs text-[#8C877D] mt-0.5">Automated surprise perks on special milestones.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-[#FAF8FF] p-1.5 rounded-2xl border border-[#E9D5FF]">
                    <button
                      type="button"
                      onClick={() => setSpecialDayMode('birthday')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        specialDayMode === 'birthday' ? 'bg-[#5844A8] text-white' : 'text-[#6E6A66]'
                      }`}
                    >
                      <Cake className="w-3.5 h-3.5" /> Birthday
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecialDayMode('anniversary')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        specialDayMode === 'anniversary' ? 'bg-[#5844A8] text-white' : 'text-[#6E6A66]'
                      }`}
                    >
                      <PartyPopper className="w-3.5 h-3.5" /> Anniversary
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#1A1615] mb-1.5">Select Month</div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setBirthdayMonth(m)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                            birthdayMonth === m ? 'bg-[#5844A8] text-white' : 'bg-[#FAF8FF] text-[#6E6A66] border border-[#E9D5FF]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                    <div className="text-xs font-bold text-[#1A1615] mb-2">Days before (Flexible Window)</div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setBirthdayDaysSpan(Math.max(0, birthdayDaysSpan - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-base font-black text-[#1A1615]">{birthdayDaysSpan} days span</span>
                      <button
                        type="button"
                        onClick={() => setBirthdayDaysSpan(birthdayDaysSpan + 1)}
                        className="w-8 h-8 rounded-lg bg-[#5844A8] text-white font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC CONDITION DETAILS: STAMPS (Campaign- Condition- Stamps.png) */}
              {conditionType === 'stamps' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#1A1615]">Stamps Rule</h3>
                    <p className="text-xs text-[#8C877D] mt-0.5">Collect digital stamps to unlock reward.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                    <div className="text-xs font-bold text-[#1A1615] mb-2">Target number of stamps</div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStampsCount(Math.max(1, stampsCount - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-lg font-black text-[#1A1615]">{stampsCount} stamps</span>
                      <button
                        type="button"
                        onClick={() => setStampsCount(stampsCount + 1)}
                        className="w-8 h-8 rounded-lg bg-[#5844A8] text-white font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stamp Card Preview with 4 checks and 1 gift box */}
                  <div className="p-3.5 bg-white border border-[#F1EFEA] rounded-2xl">
                    <div className="text-[11px] font-bold text-[#8C877D] mb-2">Customer Pass Preview</div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-9 h-9 rounded-xl bg-[#5844A8] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ))}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#FB7185] text-white flex items-center justify-center shadow-xs">
                        <Gift className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC CONDITION DETAILS: ITEM BASED (Campaign- Condition- Item Based Offers.png) */}
              {conditionType === 'item' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-[#1A1615]">Item Based Offer Rules</h3>
                    <p className="text-xs text-[#8C877D] mt-0.5">Select specific menu items to trigger this reward.</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Margherita Pizza', price: '₹299', tag: 'Bestseller' },
                      { name: 'Pasta Alfredo', price: '₹349', tag: 'Chef Choice' },
                      { name: 'Caesar Salad', price: '₹249', tag: 'Fresh' },
                      { name: 'Cold Coffee', price: '₹149', tag: 'Drink' }
                    ].map((it) => {
                      const isSel = selectedItemsForCondition.includes(it.name);
                      return (
                        <div
                          key={it.name}
                          onClick={() => {
                            setSelectedItemsForCondition((prev) =>
                              prev.includes(it.name) ? prev.filter((x) => x !== it.name) : [...prev, it.name]
                            );
                          }}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                            isSel ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA] bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSel ? 'bg-[#5844A8] border-[#5844A8]' : 'border-gray-300'}`}>
                              {isSel && <Check className="w-3 h-3 text-white stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#1A1615]">{it.name}</div>
                              <span className="text-[9px] text-[#8C877D]">{it.tag}</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#1A1615] font-mono">{it.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile Bottom Bar (Change condition on left, Next on right) */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setIsConfiguringCondition(false)}
                  className="text-xs font-bold text-[#1A1615] hover:text-[#5844A8] cursor-pointer py-2.5 px-3"
                >
                  Change condition
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderStep(4)}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REWARD TYPE (Campaign- Reward Type.png & Buy X Get Y Free.png) */}
          {builderStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Choose Reward Type</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Choose how you want to reward your customers when they meet the condition.
                </p>
              </div>

              {/* Reward Options List (Campaign- Reward Type.png) */}
              <div className="space-y-2">
                {[
                  { id: 'cashback', title: 'Cashback', badge: 'High Retention', desc: 'Get a % or fixed amount back on eligible orders', icon: Coins, color: '#7E22CE', bg: '#FAF5FF', border: '#F3E8FF' },
                  { id: 'points', title: 'Reward Points', badge: 'Tiered', desc: 'Earn points on every purchase. Redeem for future orders.', icon: Star, color: '#D97706', bg: '#FFFBEB', border: '#FEF3C7' },
                  { id: 'free_item', title: 'Free Item', badge: 'Basket Booster', desc: 'Offer complimentary item from your menu.', icon: Gift, color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
                  { id: 'discount', title: 'Discount', badge: 'Most Popular', desc: 'Get a % or fixed amount discount on eligible orders.', icon: Tag, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                  { id: 'nominal_item', title: 'Nominal Priced Item', badge: 'Add-on', desc: 'Offer select items at an irresistible low price like ₹19.', icon: Receipt, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                  { id: 'combo', title: 'Combo Offers', badge: 'Bundle', desc: 'Curate or offer fixed & custom item bundles.', icon: Package, color: '#EA580C', bg: '#FFF7ED', border: '#FFEDD5' },
                  { id: 'bogo', title: 'Buy X Get Y Free', badge: 'BOGO', desc: 'Complimentary item on purchasing qualifying quantity.', icon: ShoppingBag, color: '#7C3AED', bg: '#FAF5FF', border: '#E9D5FF' }
                ].map((rew) => {
                  const isSelected = rewardType === rew.id;
                  const Icon = rew.icon;
                  return (
                    <div
                      key={rew.id}
                      onClick={() => setRewardType(rew.id as any)}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#FAF5FF] ring-2 ring-[#7C3AED]/20 shadow-xs'
                          : 'border-[#F1EFEA] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shrink-0"
                          style={{ backgroundColor: rew.bg, borderColor: rew.border }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: rew.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#1A1615]">{rew.title}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE6DF] text-[#6E6A66]">
                              {rew.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#6E6A66] mt-0.5 leading-tight">{rew.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C877D]" />
                    </div>
                  );
                })}
              </div>

              {/* SPECIFIC CONFIG: BUY X GET Y FREE (Campaign- Reward Type- Buy X get Y free.png) */}
              {rewardType === 'bogo' && (
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                      <div className="text-[10px] font-bold text-[#6E6A66] uppercase mb-1">Buy Quantity</div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setBogoBuyQty(Math.max(1, bogoBuyQty - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="text-base font-black text-[#1A1615]">{bogoBuyQty}</span>
                        <button
                          type="button"
                          onClick={() => setBogoBuyQty(bogoBuyQty + 1)}
                          className="w-8 h-8 rounded-lg bg-[#5844A8] text-white font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8FF] border border-[#E9D5FF] rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#6E6A66] uppercase">Get Free</span>
                        <span className="text-[8.5px] text-rose-500 font-bold bg-rose-50 px-1 py-0.5 rounded-100% OFF">100% OFF</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setBogoGetFreeQty(Math.max(1, bogoGetFreeQty - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="text-base font-black text-[#1A1615]">{bogoGetFreeQty}</span>
                        <button
                          type="button"
                          onClick={() => setBogoGetFreeQty(bogoGetFreeQty + 1)}
                          className="w-8 h-8 rounded-lg bg-[#5844A8] text-white font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#1A1615]">Select items for this offer</span>
                      <span className="text-[11px] text-[#6D28D9] font-bold cursor-pointer">Select all</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[
                        { name: 'Margherita Pizza', price: '₹299' },
                        { name: 'Farmhouse Pizza', price: '₹349' },
                        { name: 'Paneer Tikka Pizza', price: '₹399' },
                        { name: 'Veggie Burger', price: '₹249' },
                        { name: 'Chicken Burger', price: '₹299' }
                      ].map((item) => {
                        const isChecked = bogoSelectedItems.includes(item.name);
                        return (
                          <div
                            key={item.name}
                            onClick={() => {
                              setBogoSelectedItems((prev) =>
                                prev.includes(item.name)
                                  ? prev.filter((i) => i !== item.name)
                                  : [...prev, item.name]
                              );
                            }}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                              isChecked ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA] bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                  isChecked ? 'bg-[#5844A8] border-[#5844A8]' : 'border-gray-300'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </div>
                              <span className="text-xs font-bold text-[#1A1615]">{item.name}</span>
                            </div>
                            <span className="text-xs font-black text-[#1A1615] font-mono">{item.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Free Item Rule */}
                  <div>
                    <span className="block text-xs font-black text-[#1A1615] mb-2">
                      Free item rule
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setBogoFreeRule('same_item')}
                        className={`p-3 rounded-2xl border cursor-pointer ${
                          bogoFreeRule === 'same_item' ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#1A1615]">Same item</div>
                        <div className="text-[9.5px] text-[#8C877D] mt-0.5">Get same item free</div>
                      </div>

                      <div
                        onClick={() => setBogoFreeRule('any_item_same_price')}
                        className={`p-3 rounded-2xl border cursor-pointer ${
                          bogoFreeRule === 'any_item_same_price' ? 'border-[#7C3AED] bg-[#FAF5FF]' : 'border-[#F1EFEA]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#1A1615]">Any item same price</div>
                        <div className="text-[9.5px] text-[#8C877D] mt-0.5">Choose item of same value</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Back & Next Bar (Campaign- Reward Type.png) */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setBuilderStep(3)}
                  className="text-xs font-bold text-[#1A1615] hover:text-[#5844A8] flex items-center gap-1.5 cursor-pointer py-2.5 px-3"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderStep(5)}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TEMPLATES & NOTIFICATION */}
          {builderStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Notification & Template</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Preview how your offer will appear on customer phones.
                </p>
              </div>

              {/* Channel Selector */}
              <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-[#F1EFEA]">
                {[
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'sms', label: 'SMS' },
                  { id: 'in_app', label: 'In-App' }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setMessageChannel(ch.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      messageChannel === ch.id
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'text-[#6E6A66] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* Live Smartphone Preview */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-md max-w-sm mx-auto">
                <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EAE6DF] space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5844A8] text-white flex items-center justify-center font-bold text-xs">
                      L
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1A1615]">Loyalitics Rewards</div>
                      <div className="text-[10px] text-[#8C877D]">Official Merchant Offer</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#F1EFEA] space-y-2">
                    <div className="text-xs font-black text-[#1A1615]">{messageHeadline}</div>
                    <p className="text-[11px] text-[#6E6A66] leading-relaxed">
                      Hey there! Visit us and enjoy <span className="font-bold text-[#5844A8]">{campaignName}</span>: {campaignDescription}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#F1EFEA]">
                      <span className="text-[10px] font-bold text-[#8C877D]">USE CODE</span>
                      <span className="text-xs font-black text-[#6D28D9] font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {promoCode}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold cursor-pointer">
                    Claim Offer Now
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setBuilderStep(4)}
                  className="text-xs font-bold text-[#1A1615] hover:text-[#5844A8] flex items-center gap-1.5 cursor-pointer py-2.5 px-3"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderStep(6)}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & LAUNCH */}
          {builderStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Review & Launch</h1>
                <p className="text-xs text-[#6E6A66] mt-1 font-medium">
                  Review all details before publishing this campaign to your outlets.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F1EFEA] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1EFEA]">
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#1A1615]">{campaignName}</h2>
                    <p className="text-[11px] text-[#8C877D] mt-0.5">{campaignDescription}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    {campaignStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-[#E9D5FF]">
                    <span className="text-[10px] text-[#8C877D] font-bold uppercase">Audience</span>
                    <div className="font-bold text-[#1A1615] mt-0.5">
                      {audienceCategory === 'all' ? 'All Customers' : 'Targeted Tier'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-[#E9D5FF]">
                    <span className="text-[10px] text-[#8C877D] font-bold uppercase">Validity</span>
                    <div className="font-bold text-[#1A1615] mt-0.5">{startDate} - {endDate}</div>
                  </div>

                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-[#E9D5FF]">
                    <span className="text-[10px] text-[#8C877D] font-bold uppercase">Condition</span>
                    <div className="font-bold text-[#1A1615] mt-0.5">
                      {conditionType === 'billing' ? `Min ₹${billingTargetAmount} Spend` : 'Qualifying visits'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8FF] rounded-xl border border-[#E9D5FF]">
                    <span className="text-[10px] text-[#8C877D] font-bold uppercase">Reward</span>
                    <div className="font-bold text-[#6D28D9] mt-0.5">
                      {rewardType === 'bogo' ? 'Buy 1 Get 1 Free' : `${discountPercent}% Discount`}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#6D28D9] shrink-0" />
                  <div className="text-xs text-[#581C87]">
                    <span className="font-bold">Projected Reach: </span>
                    Estimated <span className="font-black text-[#5844A8]">~1,420 customers</span> eligible across all branches.
                  </div>
                </div>
              </div>

              {/* Launch CTA */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setBuilderStep(5)}
                  className="text-xs font-bold text-[#1A1615] hover:text-[#5844A8] flex items-center gap-1.5 cursor-pointer py-2.5 px-3"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-lg cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Launch Campaign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: DASHBOARD VIEW (Campaign Dashboard.png on Mobile & Tablet)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF8FF] font-sans pb-28 text-[#1A1615] overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#5844A8] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER: Loyalitics Star Logo + Emma Rostova Profile */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#F1EFEA] px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#E11D48] to-[#FB7185] flex items-center justify-center text-white shadow-xs shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#1A1615] leading-none">Loyalitics</h1>
              <p className="text-[9.5px] sm:text-[10px] text-[#8C877D] font-semibold mt-1">Rewards • Engage • Grow</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-1 rounded-2xl hover:bg-[#FAF8F5] transition-colors cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Emma Rostova"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#E5E0D8]"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#1A1615] flex items-center gap-1">
                  Emma Rostova <ChevronDown className="w-3 h-3 text-[#8C877D]" />
                </div>
                <div className="text-[10px] text-[#8C877D]">General Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-5 space-y-4 sm:space-y-5">
        {/* 4 SUMMARY KPI CARDS (Campaign Dashboard.png) */}
        {/* Responsive: 2 cols on mobile, 4 cols on tablet */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          {/* Card 1: Total Campaigns */}
          <div className="bg-white border border-[#F1EFEA] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FDF2F8] border border-[#FCE7F3] flex items-center justify-center text-[#DB2777] shrink-0">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9.5px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                ↑ 12%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-lg sm:text-2xl font-black text-[#1A1615] tracking-tight">24</div>
              <div className="text-[10px] sm:text-xs text-[#8C877D] font-semibold truncate mt-0.5">
                Total Campaigns
              </div>
            </div>
          </div>

          {/* Card 2: Total Active sales */}
          <div className="bg-white border border-[#F1EFEA] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F3E8FF] border border-[#E9D5FF] flex items-center justify-center text-[#7C3AED] shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9.5px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                ↑ 8%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-lg sm:text-2xl font-black text-[#1A1615] tracking-tight">18</div>
              <div className="text-[10px] sm:text-xs text-[#8C877D] font-semibold truncate mt-0.5">
                Total Active sales
              </div>
            </div>
          </div>

          {/* Card 3: Total Redemptions */}
          <div className="bg-white border border-[#F1EFEA] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D48] shrink-0">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9.5px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                ↑ 24%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-lg sm:text-2xl font-black text-[#1A1615] tracking-tight">12,480</div>
              <div className="text-[10px] sm:text-xs text-[#8C877D] font-semibold truncate mt-0.5">
                Total Redemptions
              </div>
            </div>
          </div>

          {/* Card 4: Total Scan QR */}
          <div className="bg-white border border-[#F1EFEA] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center text-[#CA8A04] shrink-0">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9.5px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                ↑ 16%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-lg sm:text-2xl font-black text-[#1A1615] tracking-tight">5,320</div>
              <div className="text-[10px] sm:text-xs text-[#8C877D] font-semibold truncate mt-0.5">
                Total Scan QR
              </div>
            </div>
          </div>
        </div>

        {/* CAMPAIGN PERFORMANCE CHART CARD */}
        <div className="bg-white border border-[#F1EFEA] rounded-3xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-base font-black text-[#1A1615]">Campaign Performance</h2>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877D]">Weekly Insights</span>
          </div>

          {/* 8-bar column chart */}
          <div className="grid grid-cols-8 gap-1.5 sm:gap-4 items-end h-28 sm:h-32 pt-2 px-1">
            {[
              { day: 'Mon', height: '40%' },
              { day: 'Tue', height: '55%' },
              { day: 'Wed', height: '90%' },
              { day: 'Wed', height: '85%' },
              { day: 'Thu', height: '60%' },
              { day: 'Fri', height: '50%' },
              { day: 'Sat', height: '95%' },
              { day: 'Sun', height: '90%' }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full max-w-[22px] sm:max-w-[28px] h-full bg-[#FAF5FF] rounded-full flex flex-col justify-end p-0.5">
                  <div
                    className="w-full bg-[#6D28D9] group-hover:bg-[#581C87] rounded-full transition-all duration-300"
                    style={{ height: col.height }}
                  />
                </div>
                <span className="text-[9px] sm:text-xs font-semibold text-[#8C877D] mt-1.5 sm:mt-2 group-hover:text-[#1A1615]">
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH & + ADD NEW + BAR */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C877D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Campaign"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5E0D8] rounded-2xl text-xs font-medium text-[#1A1615] placeholder-[#8C877D] focus:outline-hidden focus:border-[#5844A8] shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setViewMode('builder');
              setBuilderStep(1);
            }}
            className="px-3.5 sm:px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.99] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New +</span>
          </button>
        </div>

        {/* FILTER & BATCH ACTION BAR (Campaign Dashboard.png) */}
        <div className="bg-white border border-[#F1EFEA] rounded-2xl p-2.5 sm:p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Checkbox & Type Dropdown */}
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#1A1615]">
              <input
                type="checkbox"
                checked={selectedCampaignIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded text-[#5844A8] accent-[#5844A8]"
              />
              <span className="text-[11px] sm:text-xs">Select All</span>
            </label>

            {/* Type dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8FF] border border-[#E9D5FF] rounded-xl text-[11px] sm:text-xs font-bold text-[#1A1615] cursor-pointer"
              >
                <span>{typeFilter}</span>
                <ChevronDown className="w-3 h-3 text-[#8C877D]" />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-[#E5E0D8] rounded-xl shadow-lg z-40 py-1 text-xs font-semibold">
                  {['All Types', 'Welcome Offer', 'Item Based Offer', 'Happy Hours', 'Billing Based'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTypeFilter(t);
                        setIsTypeDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FAF8F5] text-[#1A1615]"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E0D8] rounded-xl text-[11px] font-bold text-[#1A1615]">
              <Shield className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span className="hidden sm:inline">Approval</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-mono">
                3
              </span>
            </div>

            <button
              type="button"
              onClick={handlePauseSelected}
              className="p-1.5 bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-xl text-[#6E6A66] cursor-pointer"
              title="Pause selected"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-[11px] font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Campaign share link copied to clipboard')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* CAMPAIGN CARDS LIST (Matching Campaign Dashboard.png) */}
        <div className="space-y-4">
          {filteredCampaigns.map((camp) => {
            const isSelected = selectedCampaignIds.includes(camp.id);
            return (
              <div
                key={camp.id}
                className="bg-white border border-[#F1EFEA] rounded-3xl overflow-hidden shadow-2xs hover:shadow-xs transition-all"
              >
                {/* Top Banner Row: Campaign #, Status, Scanned, Redeem, Sales */}
                <div className="bg-[#FAF8FF] border-b border-[#F1EFEA] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#1A1615]">Campaign #{camp.number}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : camp.status === 'DRAFT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          camp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {camp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] sm:text-[11px]">
                    <div className="px-2 py-0.5 bg-white border border-[#E9D5FF] rounded-lg text-[#6D28D9] font-bold">
                      SCANNED: <span className="font-black">{camp.scannedCount.toLocaleString()}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-white border border-[#E9D5FF] rounded-lg text-[#6D28D9] font-bold">
                      REDEEM: <span className="font-black">{camp.redeemedCount.toLocaleString()}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-white border border-[#E9D5FF] rounded-lg text-[#6D28D9] font-bold">
                      SALES: <span className="font-black">₹{camp.totalSales.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-3.5 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                    {/* Left: Checkbox + Thumbnail + Title */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCampaign(camp.id)}
                        className="w-4 h-4 rounded text-[#5844A8] accent-[#5844A8] cursor-pointer shrink-0"
                      />

                      <div className="relative shrink-0">
                        <img
                          src={camp.image}
                          alt={camp.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-[#E5E0D8]"
                        />
                        {camp.isTopPerformer && (
                          <div className="absolute -bottom-2 -left-1 bg-amber-50 border border-amber-200 text-amber-800 text-[8px] font-black px-1.5 py-0.2 rounded shadow-2xs whitespace-nowrap">
                            ★ Top
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-[#1A1615] truncate">{camp.name}</h3>
                        <p className="text-[11px] text-[#8C877D] font-medium truncate mt-0.5">{camp.subtitle}</p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E0D8] rounded-xl text-[11px] font-bold text-[#1A1615]">
                        <Shield className="w-3.5 h-3.5 text-[#6D28D9]" />
                        <span>Approval</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-mono">
                          {camp.approvalsCount || 1}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCampaignsList((prev) =>
                            prev.map((c) =>
                              c.id === camp.id
                                ? { ...c, status: c.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' }
                                : c
                            )
                          );
                          showToast('Campaign status updated');
                        }}
                        className="p-1.5 bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-xl text-[#6E6A66] cursor-pointer"
                        title="Pause / Resume"
                      >
                        {camp.status === 'PAUSED' ? (
                          <Play className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Pause className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCampaignName(camp.name);
                          setCampaignDescription(camp.subtitle);
                          setViewMode('builder');
                          setBuilderStep(1);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-xl text-[11px] font-bold text-[#1A1615] cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-[#6D28D9]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => showToast(`Share link for "${camp.name}" copied!`)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold cursor-pointer shadow-2xs"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Information Pills (3 columns x 2 rows on tablet, 2 cols on mobile) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2.5 border-t border-[#F1EFEA]">
                    {/* TYPE */}
                    <div className="p-2 sm:p-2.5 bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#A855F7] uppercase tracking-wider">TYPE</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#581C87] mt-0.5 truncate">{camp.type}</div>
                    </div>

                    {/* TARGET AUDIENCE */}
                    <div className="p-2 sm:p-2.5 bg-[#FDF2F8] border border-[#FCE7F3] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#EC4899] uppercase tracking-wider">TARGET AUDIENCE</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#9D174D] mt-0.5 truncate">{camp.targetAudience}</div>
                    </div>

                    {/* VALIDITY */}
                    <div className="p-2 sm:p-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#8C877D] uppercase tracking-wider">VALIDITY</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#1A1615] mt-0.5 truncate">{camp.validity}</div>
                    </div>

                    {/* CONDITION */}
                    <div className="p-2 sm:p-2.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#0284C7] uppercase tracking-wider">CONDITION</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#0369A1] mt-0.5 truncate">{camp.condition}</div>
                    </div>

                    {/* OFFER */}
                    <div className="p-2 sm:p-2.5 bg-[#FFF1F2] border border-[#FFE4E6] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#E11D48] uppercase tracking-wider">OFFER</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#BE123C] mt-0.5 truncate">{camp.offer}</div>
                    </div>

                    {/* EXPIRY DATE */}
                    <div className="p-2 sm:p-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl sm:rounded-2xl">
                      <div className="text-[9px] font-black text-[#8C877D] uppercase tracking-wider">EXPIRY DATE</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#1A1615] mt-0.5 truncate">{camp.expiryDate}</div>
                    </div>
                  </div>
                </div>

                {/* Branch Breakdown Row (Pink bar from Campaign Dashboard.png) */}
                <div className="bg-[#FCE7F3]/40 border-t border-[#FBCFE8] p-2.5 px-3.5 sm:px-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {camp.branches.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-[#1A1615]">
                          <Store className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span className="text-[11px] sm:text-xs">{b.name}</span>
                          <span className="text-[9px] font-semibold text-[#8C877D] bg-white px-1.5 py-0.5 rounded-md">
                            {b.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono">
                          <span className="text-[#6E6A66]">Scan <b className="text-[#1A1615]">{b.scan}</b></span>
                          <span className="text-[#6E6A66]">Redeem <b className="text-[#1A1615]">{b.redeem}</b></span>
                          <span className="text-[#6D28D9] font-black">₹{b.sales.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR FOR MOBILE & TABLET (cd_strip_4.png) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F1EFEA] py-2 px-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('home');
              if (onNavigate) onNavigate('/dashboard');
            }}
            className="flex flex-col items-center gap-1 text-[#8C877D] hover:text-[#5844A8] cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9.5px] font-bold">Home</span>
          </button>

          {/* Create Campaign */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('create');
              setViewMode('builder');
              setBuilderStep(1);
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              activeNavTab === 'create' ? 'text-[#5844A8]' : 'text-[#8C877D]'
            }`}
          >
            <Megaphone className="w-5 h-5" />
            <span className="text-[9.5px] font-bold">Create Campaign</span>
          </button>

          {/* Center Elevated Floating Menu Button */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('menu');
                if (onToggleMobileMenu) onToggleMobileMenu();
                else showToast('Merchant Menu');
              }}
              className="w-12 h-12 rounded-full bg-[#5844A8] text-white flex items-center justify-center shadow-lg ring-4 ring-white hover:bg-[#47368E] transition-transform active:scale-95 cursor-pointer"
              title="Menu"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
            <span className="text-[9.5px] font-bold text-[#8C877D] mt-0.5">Menu</span>
          </div>

          {/* Report */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('report');
              if (onNavigate) onNavigate('/analytics');
            }}
            className="flex flex-col items-center gap-1 text-[#8C877D] hover:text-[#5844A8] cursor-pointer"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[9.5px] font-bold">Report</span>
          </button>

          {/* Approve campaign */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('approve');
              if (onNavigate) onNavigate('/approvals');
            }}
            className="flex flex-col items-center gap-1 text-[#8C877D] hover:text-[#5844A8] cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9.5px] font-bold">Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabletCampaignView;
