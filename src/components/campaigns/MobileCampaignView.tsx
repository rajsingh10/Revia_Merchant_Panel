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
  Sliders,
  DollarSign,
  FileText,
  Heart,
  Flame,
  CheckCheck,
  Volume2
} from 'lucide-react';
import { NavRoute } from '../../types';

export interface MobileCampaignViewProps {
  initialViewMode?: 'dashboard' | 'builder';
  onNavigate?: (route: string) => void;
  onToggleMobileMenu?: () => void;
}

export interface MobileCampaignItem {
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

const INITIAL_CAMPAIGNS: MobileCampaignItem[] = [
  {
    id: 'camp-1',
    number: 1,
    name: 'Summer Cashback',
    subtitle: '10% cashback on all beverages for regular visitors',
    status: 'ACTIVE',
    isTopPerformer: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
    scannedCount: 1420,
    redeemedCount: 890,
    totalSales: 45000,
    type: 'Cashback',
    targetAudience: 'All Customers',
    validity: '15 Sep - 30 Sep',
    condition: 'Min bill ₹250',
    offer: '10% Cashback',
    expiryDate: '30 Sep 2026',
    approvalsCount: 5,
    branches: [
      { name: 'Connaught Place', location: 'Delhi', scan: 620, redeem: 410, sales: 21000 },
      { name: 'Cyber Hub', location: 'Gurgaon', scan: 480, redeem: 310, sales: 15500 },
      { name: 'Indiranagar', location: 'Bangalore', scan: 320, redeem: 170, sales: 8500 }
    ]
  },
  {
    id: 'camp-2',
    number: 2,
    name: 'Lunch Discount',
    subtitle: '20% off on main course items during lunch hours',
    status: 'ACTIVE',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    scannedCount: 980,
    redeemedCount: 640,
    totalSales: 32500,
    type: 'Discount',
    targetAudience: 'VIP & Gold Tiers',
    validity: '01 Oct - 15 Oct',
    condition: 'Main Course item',
    offer: '20% Off',
    expiryDate: '15 Oct 2026',
    branches: [
      { name: 'Connaught Place', location: 'Delhi', scan: 450, redeem: 300, sales: 16000 },
      { name: 'Cyber Hub', location: 'Gurgaon', scan: 530, redeem: 340, sales: 16500 }
    ]
  },
  {
    id: 'camp-3',
    number: 3,
    name: 'Monsoon Chai & Bites',
    subtitle: 'Seasonal afternoon rush multiplier',
    status: 'PAUSED',
    isTopPerformer: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=80',
    scannedCount: 450,
    redeemedCount: 220,
    totalSales: 11200,
    type: 'Cashback',
    targetAudience: 'All Registered',
    validity: '10 Aug - 10 Sep',
    condition: 'Visits >= 3',
    offer: '₹100 Cashback',
    expiryDate: '10 Sep 2026',
    branches: [
      { name: 'Indiranagar', location: 'Bangalore', scan: 450, redeem: 220, sales: 11200 }
    ]
  }
];

export const MobileCampaignView: React.FC<MobileCampaignViewProps> = ({
  initialViewMode = 'dashboard',
  onNavigate,
  onToggleMobileMenu
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'builder'>(initialViewMode);

  // ---------------------------------------------------------------------------
  // DASHBOARD STATE
  // ---------------------------------------------------------------------------
  const [campaignsList, setCampaignsList] = useState<MobileCampaignItem[]>(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [bottomNavTab, setBottomNavTab] = useState<'home' | 'create' | 'menu' | 'report' | 'approve'>('create');

  // ---------------------------------------------------------------------------
  // WIZARD STATE (Matching Mobile Figma Screens 1-5)
  // ---------------------------------------------------------------------------
  // Step 0: Campaign Count Selector ("How many campaigns do you want to create?")
  const [campaignCreationMode, setCampaignCreationMode] = useState<'single' | 'multiple'>('single');
  const [creationSetupStep, setCreationSetupStep] = useState<'choose_type' | 'configure_multiple' | 'wizard'>('choose_type');
  const [multipleCampaignsList, setMultipleCampaignsList] = useState<
    { id: string; name: string; status: 'Active' | 'Scheduled' | 'Draft'; type: string; desc: string; dates: string }[]
  >([
    {
      id: 'mc-1',
      name: 'Summer Cashback',
      status: 'Active',
      type: 'Cashback',
      desc: '10% cashback on all beverages',
      dates: '15 Sep 2025\n30 Sep 2025'
    },
    {
      id: 'mc-2',
      name: 'Lunch Discount',
      status: 'Scheduled',
      type: 'Discount',
      desc: '20% off on main course',
      dates: '01 Oct 2025\n15 Oct 2025'
    }
  ]);

  // Main 6-Step Wizard:
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [audienceSubStep, setAudienceSubStep] = useState<'audience_type' | 'order_types' | 'tiers' | 'sliders'>('audience_type');

  // Step 1: Basic Details
  const [campaignName, setCampaignName] = useState('Summer Special');
  const [audienceDesc, setAudienceDesc] = useState(
    'Get 20% off on all main course items. Valid for dine-in and takeaway.'
  );
  const [startDate, setStartDate] = useState('15 Sep 2025');
  const [endDate, setEndDate] = useState('30 Sep 2025');
  const [isActiveAllDay, setIsActiveAllDay] = useState(true);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [campaignStatus, setCampaignStatus] = useState<'active' | 'draft'>('active');

  // Step 2: Audience
  const [audienceCategory, setAudienceCategory] = useState<'all' | 'new' | 'existing'>('all');
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>(['Dine In', 'Takeaway', 'Delivery', 'All Types']);
  const [selectedTier, setSelectedTier] = useState<string>('VVIP');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [totalSpendLimit, setTotalSpendLimit] = useState(50000);
  const [totalVisitsLimit, setTotalVisitsLimit] = useState(50);

  // Step 3: Condition
  const [conditionType, setConditionType] = useState<
    'visit' | 'billing' | 'stamps' | 'item' | 'happy_hours' | 'birthday' | 'anniversary' | 'combo'
  >('visit');
  const [isConfiguringCondition, setIsConfiguringCondition] = useState<boolean>(true);

  // Condition 1: Visit
  const [visitQualifyingCount, setVisitQualifyingCount] = useState(1);
  const [visitMinBill, setVisitMinBill] = useState('0');
  const [visitApplyTo, setVisitApplyTo] = useState<'per_bill' | 'total_spent'>('per_bill');
  const [visitAvailability, setVisitAvailability] = useState<'same_day' | 'month_end'>('same_day');

  // Condition 2: Billing
  const [billingTargetAmount, setBillingTargetAmount] = useState(500);
  const [billingFrequency, setBillingFrequency] = useState<'Weekly' | 'Monthly' | 'Quarterly' | 'Per Campaign'>('Monthly');
  const [allowEarlyRedemption, setAllowEarlyRedemption] = useState<'yes' | 'no'>('yes');
  const [whenToGiveOffer, setWhenToGiveOffer] = useState<'same_order' | 'next_visit'>('same_order');

  // Condition 3: Stamps
  const [stampsCount, setStampsCount] = useState(5);
  const [stampItemScope, setStampItemScope] = useState('Any Item');
  const [stampValidityPeriod, setStampValidityPeriod] = useState('Monthly');

  // Condition 4: Item Based Offers
  const [itemTimeStart, setItemTimeStart] = useState('10:00 AM');
  const [itemTimeEnd, setItemTimeEnd] = useState('04:00 PM');
  const [itemOfferScope, setItemOfferScope] = useState<'specific' | 'category'>('specific');
  const [itemCategoryTab, setItemCategoryTab] = useState('Pizzas');
  const [selectedItemsForCondition, setSelectedItemsForCondition] = useState<string[]>([
    'Margherita Pizza',
    'Pasta Alfredo'
  ]);

  // Condition 5: Happy Hours
  const [happyHourStart, setHappyHourStart] = useState('10:00 AM');
  const [happyHourEnd, setHappyHourEnd] = useState('04:00 PM');
  const [happyHourDays, setHappyHourDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);
  const [happyHourScope, setHappyHourScope] = useState('All items');

  // Condition 6 & 7: Birthday / Anniversary
  const [birthdayMonth, setBirthdayMonth] = useState('Aug');
  const [specialDayMode, setSpecialDayMode] = useState<'birthday' | 'anniversary'>('birthday');
  const [birthdayDaysSpan, setBirthdayDaysSpan] = useState(3);
  const [birthdayValidFor, setBirthdayValidFor] = useState('All registered members');

  // Condition 8: Combo Offers
  const [comboMode, setComboMode] = useState<'fixed' | 'custom'>('custom');
  const [comboTimeStart, setComboTimeStart] = useState('10:00 AM');
  const [comboTimeEnd, setComboTimeEnd] = useState('04:00 PM');
  const [selectedFixedCombos, setSelectedFixedCombos] = useState<string[]>([
    'Margherita Pizza + Cold Coffee',
    'Pasta + Garlic Bread'
  ]);
  const [customComboName, setCustomComboName] = useState('Weekend Duo Special');
  const [customComboPrice, setCustomComboPrice] = useState('399');
  const [customComboSelectedTag, setCustomComboSelectedTag] = useState('Weekend Duo Special');

  // Step 4: Rewards
  const [rewardType, setRewardType] = useState<
    'cashback' | 'points' | 'free_item' | 'discount' | 'nominal_item' | 'combo' | 'bogo'
  >('bogo');
  const [isConfiguringReward, setIsConfiguringReward] = useState<boolean>(true);
  const [bogoBuyQty, setBogoBuyQty] = useState(1);
  const [bogoGetFreeQty, setBogoGetFreeQty] = useState(1);
  const [bogoSelectedItems, setBogoSelectedItems] = useState<string[]>(['Margherita Pizza', 'Pasta Alfredo']);
  const [bogoFreeRule, setBogoFreeRule] = useState<'same_item' | 'any_item_same_price'>('same_item');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [cashbackAmount, setCashbackAmount] = useState(100);

  // Step 5: Templates & Messaging
  const [messageChannel, setMessageChannel] = useState<'whatsapp' | 'sms' | 'in_app'>('whatsapp');
  const [promoCode, setPromoCode] = useState('SUMMER20');
  const [messageHeadline, setMessageHeadline] = useState('Special Offer Just For You! 🎉');

  // Filtered campaigns for mobile dashboard
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

  const stepLabels = [
    { num: 1, label: 'Basic Details' },
    { num: 2, label: 'Audience Type' },
    { num: 3, label: 'Conditions' },
    { num: 4, label: 'Rewards' },
    { num: 5, label: 'Templates' },
    { num: 6, label: 'Review & Launch' }
  ];

  // ===========================================================================
  // RENDER: MOBILE DASHBOARD VIEW
  // ===========================================================================
  if (viewMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF9FE] via-[#FFFDFE] to-[#FBF8FD] pb-24 font-sans text-[#1A102F]">
        {/* Mobile Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0EBF5] px-4 py-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-black text-sm shadow-xs">
                ★
              </div>
              <div>
                <div className="text-sm font-black text-[#1A102F] leading-tight">Loyalitics</div>
                <div className="text-[10px] text-gray-400 font-medium">Rewards • Engage • Grow</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCreationSetupStep('choose_type');
                  setViewMode('builder');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#2D0F55] text-white text-xs font-bold hover:bg-[#3D1472] transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-purple-200"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Main Content */}
        <div className="p-4 space-y-4">
          {/* Top Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-[#1A102F] tracking-tight">Campaigns</h1>
              <p className="text-xs text-gray-500">Monitor active promotions and customer response</p>
            </div>
          </div>

          {/* 4 Summary KPI Cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">24</div>
              <div className="text-[11px] text-gray-400 font-medium">Total Campaigns</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">18</div>
              <div className="text-[11px] text-gray-400 font-medium">Active Sales</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-amber-600 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+24%</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">12,480</div>
              <div className="text-[11px] text-gray-400 font-medium">Redemptions</div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Scans</span>
              </div>
              <div className="text-2xl font-black text-[#1A102F] mt-2">5,320</div>
              <div className="text-[11px] text-gray-400 font-medium">Total Scan QR</div>
            </div>
          </div>

          {/* Weekly Campaign Performance Chart */}
          <div className="bg-white rounded-3xl p-4 border border-[#F0EBF5] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#1A102F]">Campaign Performance</h3>
                <p className="text-[10px] text-gray-400">Weekly scanned vs redeemed ratio</p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                This Week
              </span>
            </div>
            <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
              {[
                { day: 'Mon', h1: '40%', h2: '65%' },
                { day: 'Tue', h1: '55%', h2: '80%' },
                { day: 'Wed', h1: '35%', h2: '50%' },
                { day: 'Thu', h1: '70%', h2: '90%' },
                { day: 'Fri', h1: '85%', h2: '100%' },
                { day: 'Sat', h1: '95%', h2: '100%' },
                { day: 'Sun', h1: '60%', h2: '85%' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-20">
                    <div style={{ height: bar.h1 }} className="w-2.5 bg-purple-200 rounded-t-sm" />
                    <div style={{ height: bar.h2 }} className="w-2.5 bg-[#2D0F55] rounded-t-sm" />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Add New CTA */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#EAE6E1] rounded-2xl text-xs outline-none focus:border-[#7C3AED] shadow-2xs font-medium"
              />
            </div>
            <button
              onClick={() => {
                setCreationSetupStep('choose_type');
                setViewMode('builder');
              }}
              className="px-4 py-2.5 bg-[#2D0F55] text-white rounded-2xl text-xs font-bold hover:bg-[#3D1472] transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              + Add New +
            </button>
          </div>

          {/* Batch Actions & Filters Bar */}
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-1.5 font-bold text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCampaignIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                onChange={handleSelectAll}
                className="w-3.5 h-3.5 rounded accent-[#2D0F55]"
              />
              <span className="text-[11px]">Select All</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                5 Pending
              </span>
              <button className="p-1.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-purple-700 shadow-2xs">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Campaign Cards List */}
          <div className="space-y-3.5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl border border-[#F0EBF5] overflow-hidden shadow-2xs"
              >
                {/* Status Bar */}
                <div className="bg-[#2D0F55] text-white px-4 py-2.5 flex items-center justify-between text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCampaignIds.includes(camp.id)}
                      onChange={() => handleToggleSelectCampaign(camp.id)}
                      className="w-3.5 h-3.5 rounded accent-white"
                    />
                    <span>Campaign #{camp.number}</span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ● {camp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-purple-200">
                    <span>Scanned {camp.scannedCount}</span>
                    <span>•</span>
                    <span>Redeem {camp.redeemedCount}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Title & Food Image */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={camp.image}
                        alt={camp.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-xs"
                      />
                      {camp.isTopPerformer && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                          ★ Top
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#1A102F] truncate">{camp.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{camp.subtitle}</p>
                      <div className="text-[11px] font-black text-emerald-700 mt-1">
                        Total Sales: ₹{camp.totalSales.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 4 Info Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-[10px]">
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Type:</span>
                      <span className="font-bold text-[#1A102F]">{camp.type}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Target:</span>
                      <span className="font-bold text-[#1A102F]">{camp.targetAudience}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Validity:</span>
                      <span className="font-bold text-[#1A102F]">{camp.validity}</span>
                    </div>
                    <div className="bg-[#FAF8FD] p-2 rounded-xl border border-[#F1EBF5]">
                      <span className="text-gray-400 font-semibold block">Condition:</span>
                      <span className="font-bold text-[#1A102F]">{camp.condition}</span>
                    </div>
                  </div>

                  {/* Branch Breakdown Strip */}
                  <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-2.5 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-pink-900">Branch Performance</span>
                    <span className="text-pink-700 font-bold">3 Outlets Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F0EBF5] px-4 py-2 z-50 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setBottomNavTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'home' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setBottomNavTab('create');
              setCreationSetupStep('choose_type');
              setViewMode('builder');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'create' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campaign</span>
          </button>

          {/* Elevated Center Menu Button */}
          <div className="-mt-6">
            <button
              onClick={() => {
                setCreationSetupStep('choose_type');
                setViewMode('builder');
              }}
              className="w-12 h-12 rounded-full bg-[#2D0F55] text-white flex items-center justify-center shadow-lg shadow-purple-950/30 hover:bg-[#3D1472] transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => setBottomNavTab('report')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'report' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Report</span>
          </button>

          <button
            onClick={() => setBottomNavTab('approve')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              bottomNavTab === 'approve' ? 'text-[#2D0F55]' : 'text-gray-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: MOBILE BUILDER WIZARD FLOW (Matching Figma Images 1-5)
  // (NO fake phone status bars like 9:41 or battery)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // STEP 0A: "How many campaigns do you want to create?" (Image 2)
  // ---------------------------------------------------------------------------
  if (creationSetupStep === 'choose_type') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between p-6 font-sans text-[#1A102F]">
        {/* Top Spacer / Back */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => setViewMode('dashboard')}
            className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-5" />
        </div>

        {/* Center Illustration & Options */}
        <div className="space-y-6 my-auto pt-2 pb-6 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <h1 className="text-[26px] font-black text-[#1A102F] tracking-tight leading-tight">
              How many campaigns<br />
              do you want to <span className="text-[#6D28D9]">create?</span>
            </h1>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Choose whether you want to create a single campaign or multiple campaigns at once.
            </p>
          </div>

          {/* Cute SVG Character Illustration (Desk, Girl with Laptop, Checklist, Plant) */}
          <div className="flex justify-center py-2">
            <div className="relative w-64 h-44 flex items-center justify-center">
              {/* Hanging lamp */}
              <div className="absolute top-0 left-20 flex flex-col items-center">
                <div className="w-0.5 h-10 bg-gray-200" />
                <div className="w-4 h-2.5 bg-amber-100 rounded-b-md border border-amber-200 shadow-2xs" />
              </div>

              {/* Plant in pot */}
              <div className="absolute bottom-2 left-6 flex flex-col items-center">
                <div className="text-2xl -mb-1">🪴</div>
                <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-[10px] text-pink-500 shadow-2xs">
                  ♥
                </div>
              </div>

              {/* Coffee Cup */}
              <div className="absolute bottom-2 left-16">
                <div className="w-5 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-[8px] text-purple-400 shadow-2xs">
                  ♥
                </div>
              </div>

              {/* Girl with laptop */}
              <div className="flex flex-col items-center relative z-10">
                {/* Speech bubble with lightbulb */}
                <div className="absolute -top-7 right-2 bg-white rounded-full p-1.5 shadow-sm border border-amber-100 flex items-center justify-center text-xs">
                  💡
                </div>
                {/* Head */}
                <div className="w-12 h-12 rounded-full bg-[#FFE4D6] border border-[#F3C5B2] flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="absolute top-0 inset-x-0 h-6 bg-[#2B1B43] rounded-t-full" />
                  <div className="text-xs mt-2 font-bold">👩🏻</div>
                </div>
                {/* Torso */}
                <div className="w-14 h-9 bg-purple-100 rounded-t-xl -mt-1 border border-purple-200" />
                {/* Purple Laptop with Star */}
                <div className="w-20 h-12 rounded-t-lg bg-[#5B21B6] border border-purple-400 shadow-sm flex items-center justify-center text-white text-xs font-black -mt-4">
                  ★
                </div>
                <div className="w-24 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Clipboard Checklist */}
              <div className="absolute bottom-2 right-8 bg-white border border-purple-300 rounded-xl p-2 w-14 h-18 shadow-xs flex flex-col justify-between">
                <div className="w-6 h-1.5 bg-purple-200 rounded-full mx-auto" />
                <div className="text-[7px] font-black text-purple-900 text-center">Campaign</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold">✓ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold">✓ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-400">▢ <div className="w-5 h-0.5 bg-gray-200 rounded" /></div>
                </div>
              </div>

              {/* Desk Line */}
              <div className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DDD6FE]" />
            </div>
          </div>

          {/* Radio Cards */}
          <div className="space-y-3">
            <div
              onClick={() => setCampaignCreationMode('single')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                campaignCreationMode === 'single'
                  ? 'border-[#6D28D9] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                  : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] text-[#6D28D9] flex items-center justify-center shrink-0">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A102F]">Single Campaign</div>
                  <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                    Create one campaign with a single offer and condition.
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  campaignCreationMode === 'single' ? 'border-[#6D28D9]' : 'border-gray-300'
                }`}
              >
                {campaignCreationMode === 'single' && <div className="w-3 h-3 rounded-full bg-[#6D28D9]" />}
              </div>
            </div>

            <div
              onClick={() => setCampaignCreationMode('multiple')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                campaignCreationMode === 'multiple'
                  ? 'border-[#6D28D9] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                  : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-pink-600 flex items-center justify-center shrink-0 relative">
                  <div className="absolute inset-0 rounded-2xl bg-purple-100/60 translate-x-1 translate-y-1 -z-10" />
                  <Volume2 className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A102F]">Multiple Campaigns</div>
                  <div className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                    Create multiple campaigns with different offers, conditions or time periods.
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  campaignCreationMode === 'multiple' ? 'border-[#6D28D9]' : 'border-gray-300'
                }`}
              >
                {campaignCreationMode === 'multiple' && <div className="w-3 h-3 rounded-full bg-[#6D28D9]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBF5] max-w-sm mx-auto w-full">
          <button
            onClick={() => setViewMode('dashboard')}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button
            onClick={() => {
              if (campaignCreationMode === 'multiple') {
                setCreationSetupStep('configure_multiple');
              } else {
                setCreationSetupStep('wizard');
              }
            }}
            className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STEP 0B: "Create Multiple Campaigns" (Image 1)
  // ---------------------------------------------------------------------------
  if (creationSetupStep === 'configure_multiple') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between p-6 font-sans text-[#1A102F]">
        <div className="space-y-4 max-w-sm mx-auto w-full">
          {/* Top Title with 3D Megaphone Graphic */}
          <div className="flex items-start justify-between pt-1">
            <div className="space-y-1">
              <h1 className="text-[22px] font-black text-[#1A102F] leading-tight">Create Multiple<br />Campaigns</h1>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Add and configure multiple campaigns with different offers, conditions or time periods.
              </p>
            </div>
            {/* 3D Clipboard & Megaphone icon container */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center shrink-0 shadow-sm relative">
              <span className="text-2xl">📋</span>
              <span className="absolute -top-1 -right-1 text-sm">✨</span>
            </div>
          </div>

          {/* Info Banner with Target/Pin Icon */}
          <div className="bg-[#F5F0FF] border border-[#DDD6FE]/60 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0 text-[#6D28D9] font-black text-xs">
              🎯
            </div>
            <p className="text-xs text-[#4C1D95] font-medium leading-relaxed">
              You can add multiple campaigns. Each campaign can have a different offer type, validity and conditions.
            </p>
          </div>

          {/* Campaigns Count and + Add Campaign Pill */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-black text-[#1A102F]">
              Campaigns ({multipleCampaignsList.length})
            </h2>
            <button
              onClick={() => {
                const newId = `mc-${Date.now()}`;
                setMultipleCampaignsList((prev) => [
                  ...prev,
                  {
                    id: newId,
                    name: `Campaign #${prev.length + 1}`,
                    status: 'Scheduled',
                    type: 'Discount',
                    desc: 'Flat 15% off main course',
                    dates: '15 Oct 2025\n30 Oct 2025'
                  }
                ]);
              }}
              className="px-4 py-1.5 rounded-full border border-[#6D28D9] text-[#6D28D9] text-xs font-bold hover:bg-[#F5F0FF] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+</span>
              <span>Add Campaign</span>
            </button>
          </div>

          {/* Campaign Cards List (Matching Image 1) */}
          <div className="space-y-3">
            {multipleCampaignsList.map((mc, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={mc.id}
                  className="bg-white rounded-3xl border border-[#F1EBF5] p-4 shadow-xs space-y-3"
                >
                  {/* Top Row: Number pill, Title, Status badge, Edit, Trash */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-white font-black text-xs flex items-center justify-center ${
                          isFirst ? 'bg-[#5B21B6]' : 'bg-[#3B82F6]'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-black text-[#1A102F]">{mc.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          mc.status === 'Active'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#F3E8FF] text-[#7E22CE]'
                        }`}
                      >
                        {mc.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer" />
                      <Trash2
                        onClick={() => setMultipleCampaignsList((p) => p.filter((x) => x.id !== mc.id))}
                        className="w-4 h-4 text-[#F43F5E] hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Category Icon, Description, Date Pill */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      {isFirst ? (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] text-white flex items-center justify-center shadow-xs shrink-0 text-xl">
                          💳
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#F43F5E] text-white flex items-center justify-center shadow-xs shrink-0 text-xl">
                          🏷️
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#1A102F]">{mc.type}</div>
                        <div className="text-[11px] text-[#64748B] truncate">{mc.desc}</div>
                      </div>
                    </div>

                    {/* Right-aligned Calendar Date Pill */}
                    <div className="bg-[#FAF8FD] border border-[#EAE6F0] px-3 py-1.5 rounded-2xl flex items-center gap-2 text-[10px] font-bold text-[#475569] shrink-0">
                      <Calendar className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <div className="whitespace-pre-line text-[10px] leading-tight">
                        {mc.dates}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBF5] max-w-sm mx-auto w-full">
          <button
            onClick={() => setCreationSetupStep('choose_type')}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button
            onClick={() => setCreationSetupStep('wizard')}
            className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6-STEP WIZARD CONTAINER WITH PROGRESS BAR (NO fake phone status bar!)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8FD] via-[#FFF9FA] to-[#FAF8FD] flex flex-col justify-between pb-6 font-sans text-[#1A102F]">
      {/* Top Header with 6-Step Connected Progress Stepper (Matching Image 3 & 4) */}
      <div className="px-5 pt-3 pb-3 border-b border-[#F0EBF5] bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-end mb-1">
          <button
            onClick={() => setViewMode('dashboard')}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected Step Indicator */}
        <div className="flex items-center justify-between relative px-2">
          {/* Horizontal connecting background line */}
          <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 -z-0" />
          <div
            className="absolute left-6 h-0.5 bg-[#5B21B6] -z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 5) * 88}%` }}
          />

          {stepLabels.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#5B21B6] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span
                  className={`text-[8.5px] font-bold text-center leading-tight max-w-[45px] ${
                    isCurrent
                      ? 'text-[#5B21B6]'
                      : isCompleted
                      ? 'text-[#5B21B6]'
                      : 'text-gray-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="flex-1 p-5 max-w-sm mx-auto w-full">
        {/* ===================================================================== */}
        {/* STEP 1: BASIC DETAILS (Image 3) */}
        {/* ===================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Basic Details</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Give your campaign a name and add a short description.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1A102F] mb-1.5">Campaign name *</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Special"
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none focus:border-[#6D28D9] shadow-2xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-[#1A102F]">Audience description</label>
                  <span className="text-[10px] text-gray-400 font-bold">{audienceDesc.length}/200</span>
                </div>
                <textarea
                  value={audienceDesc}
                  onChange={(e) => setAudienceDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-medium text-[#1A102F] outline-none focus:border-[#6D28D9] shadow-2xs resize-none leading-relaxed"
                />
              </div>

              {/* Campaign Validity */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F]">Campaign Validity</h3>
                <p className="text-[10px] text-[#64748B] mb-2">Set the start and end date for your campaign.</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block mb-1">Start date</span>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block mb-1">End date</span>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-[#1A102F] outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* When will this campaign be active? */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F] mb-2">When will this campaign be active?</h3>
                <div className="space-y-2">
                  <label
                    onClick={() => setIsActiveAllDay(true)}
                    className="flex items-center gap-2.5 text-xs text-[#1A102F] font-bold cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isActiveAllDay ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {isActiveAllDay && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                    </div>
                    <span>Entire day</span>
                  </label>

                  <label
                    onClick={() => setIsActiveAllDay(false)}
                    className="flex items-center gap-2.5 text-xs text-[#1A102F] font-bold cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        !isActiveAllDay ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {!isActiveAllDay && <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />}
                    </div>
                    <span>Specific time</span>
                  </label>

                  {!isActiveAllDay && (
                    <div className="grid grid-cols-2 gap-2 pt-1 pl-6">
                      <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign Status (Matching Image 3) */}
              <div className="pt-1">
                <h3 className="text-xs font-black text-[#1A102F]">Campaign Status</h3>
                <p className="text-[10px] text-[#64748B] mb-2">Choose whether to start the campaign immediately or keep it as a draft</p>
                <div className="space-y-2.5">
                  <div
                    onClick={() => setCampaignStatus('active')}
                    className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      campaignStatus === 'active'
                        ? 'border-[#5B21B6] bg-white shadow-xs ring-2 ring-purple-100'
                        : 'border-[#E2E8F0] bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F5F0FF] text-[#6D28D9] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#1A102F]">Active</div>
                        <div className="text-[10px] text-[#64748B]">Campaign will be live as soon as you save it.</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        campaignStatus === 'active' ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {campaignStatus === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setCampaignStatus('draft')}
                    className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      campaignStatus === 'draft'
                        ? 'border-[#5B21B6] bg-white shadow-xs ring-2 ring-purple-100'
                        : 'border-[#E2E8F0] bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] text-gray-500 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#1A102F]">Draft</div>
                        <div className="text-[10px] text-[#64748B]">Save and activate it later.</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        campaignStatus === 'draft' ? 'border-[#5B21B6]' : 'border-gray-300'
                      }`}
                    >
                      {campaignStatus === 'draft' && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 2: AUDIENCE (Image 4 + Sub-screens) */}
        {/* ===================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* SUB-STEP 2A: Choose your audience (Image 4) */}
            {audienceSubStep === 'audience_type' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Choose your audience</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Select who will be eligible to see and use this campaign.</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'all',
                      title: 'All customers',
                      desc: 'Show to everyone',
                      icon: <Users className="w-5 h-5 text-[#6D28D9]" />
                    },
                    {
                      id: 'new',
                      title: 'New customers only',
                      desc: 'Only show to first time visitors.',
                      icon: <UserPlus className="w-5 h-5 text-gray-500" />
                    },
                    {
                      id: 'existing',
                      title: 'Existing customers only',
                      desc: 'Show to your regular customers.',
                      icon: <Star className="w-5 h-5 text-gray-500" />
                    }
                  ].map((aud) => {
                    const isSelected = audienceCategory === aud.id;
                    return (
                      <div
                        key={aud.id}
                        onClick={() => setAudienceCategory(aud.id as any)}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#7C3AED] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                            : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#F5F0FF]' : 'bg-[#F8FAFC]'
                            }`}
                          >
                            {aud.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A102F]">{aud.title}</div>
                            <div className="text-xs text-[#64748B] mt-0.5">{aud.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#5B21B6]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-3 h-3 rounded-full bg-[#5B21B6]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-STEP 2B: Where will this campaign be available? */}
            {audienceSubStep === 'order_types' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Where will this campaign be available?</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Choose the order types where customers can use this offer.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Dine In', title: 'Dine In', desc: 'For customers dining at your outlet', icon: '🍽️' },
                    { id: 'Takeaway', title: 'Takeaway', desc: 'For takeaway orders at your outlet', icon: '🛍️' },
                    { id: 'Delivery', title: 'Delivery', desc: 'For online delivery orders', icon: '🛵' },
                    { id: 'All Types', title: 'All Types', desc: 'Dine in, Takeaway & Delivery', icon: '✨' }
                  ].map((ord) => {
                    const isSelected = selectedOrderTypes.includes(ord.id);
                    return (
                      <div
                        key={ord.id}
                        onClick={() => {
                          if (ord.id === 'All Types') {
                            setSelectedOrderTypes(['Dine In', 'Takeaway', 'Delivery', 'All Types']);
                          } else {
                            setSelectedOrderTypes((prev) =>
                              prev.includes(ord.id) ? prev.filter((x) => x !== ord.id) : [...prev, ord.id]
                            );
                          }
                        }}
                        className={`p-4 rounded-3xl border-2 flex flex-col justify-between h-36 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#7C3AED] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                            : 'border-[#F1EBF5] bg-white shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl">{ord.icon}</span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#5B21B6]' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#1A102F]">{ord.title}</div>
                          <div className="text-[10px] text-[#64748B] line-clamp-2 mt-0.5">{ord.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-STEP 2C: Customer Tiers */}
            {audienceSubStep === 'tiers' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">VVIP / VIP / Gold / Silver / Bronze</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Filter by customer tiers.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'VVIP', label: 'VVIP', desc: 'Our most loyal customers', color: 'bg-purple-600', icon: '👑' },
                    { id: 'VIP', label: 'VIP', desc: 'High spending, frequent visitors', color: 'bg-pink-600', icon: '💎' },
                    { id: 'Gold', label: 'Gold', desc: 'Regular customers', color: 'bg-amber-500', icon: '🥇' },
                    { id: 'Silver', label: 'Silver', desc: 'Occasional customers', color: 'bg-slate-500', icon: '🥈' },
                    { id: 'Bronze', label: 'Bronze', desc: 'New and exploring customers', color: 'bg-orange-700', icon: '🥉' }
                  ].map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        selectedTier === tier.id
                          ? 'border-[#7C3AED] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                          : 'border-[#F1EBF5] bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${tier.color} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                          {tier.icon}
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#1A102F]">{tier.label}</div>
                          <div className="text-[10px] text-[#64748B]">{tier.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTier === tier.id ? 'border-[#5B21B6]' : 'border-gray-300'
                        }`}
                      >
                        {selectedTier === tier.id && <div className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-STEP 2D: Demographic Sliders */}
            {audienceSubStep === 'sliders' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Narrow down your audience</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">With more conditions (optional).</p>
                </div>

                <div className="space-y-4 bg-white rounded-3xl p-4 border border-[#F1EBF5] shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#1A102F] mb-1">
                      <span>🎂 Age Range</span>
                      <span className="text-[#5B21B6]">{ageRange[0]} - {ageRange[1]}+</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={70}
                      value={ageRange[1]}
                      onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
                      className="w-full accent-[#5B21B6] cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#1A102F] block mb-1.5">🚻 Gender</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['All', 'Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGenderFilter(g as any)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            genderFilter === g
                              ? 'bg-[#2D0F55] text-white shadow-xs'
                              : 'bg-[#FAF8FD] text-gray-600 border border-[#EAE6F0]'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#1A102F] mb-1">
                      <span>₹ Total Spend (₹)</span>
                      <span className="text-[#5B21B6]">Up to ₹{totalSpendLimit.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={totalSpendLimit}
                      onChange={(e) => setTotalSpendLimit(parseInt(e.target.value))}
                      className="w-full accent-[#5B21B6] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#1A102F] mb-1">
                      <span>🛍️ Total Visits</span>
                      <span className="text-[#5B21B6]">Up to {totalVisitsLimit}+</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={totalVisitsLimit}
                      onChange={(e) => setTotalVisitsLimit(parseInt(e.target.value))}
                      className="w-full accent-[#5B21B6] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 3: CONDITIONS */}
        {/* ===================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {!isConfiguringCondition ? (
              <div className="space-y-3">
                <div>
                  <h1 className="text-[22px] font-black text-[#1A102F]">Select Condition Type</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">Choose how you want to define eligibility for this campaign.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'visit', title: 'Visit', desc: 'Qualifying no of visits', icon: '🚗' },
                    { id: 'billing', title: 'Billing', desc: 'Target amount / frequency', icon: '🧾' },
                    { id: 'stamps', title: 'Stamps', desc: 'Qualifying item / no of stamps', icon: '⭐' },
                    { id: 'item', title: 'Item based offers', desc: 'Specific items or categories', icon: '🛍️' },
                    { id: 'happy_hours', title: 'Happy Hours', desc: 'Time + day based', icon: '⏰' },
                    { id: 'birthday', title: 'Birthday / Anniversary', desc: 'Special day based', icon: '🎂' },
                    { id: 'combo', title: 'Combo offers', desc: 'Qualifying item / combo', icon: '🎁' }
                  ].map((cond) => (
                    <div
                      key={cond.id}
                      onClick={() => {
                        setConditionType(cond.id as any);
                        setIsConfiguringCondition(true);
                      }}
                      className="p-4 rounded-3xl border border-[#F1EBF5] bg-white hover:border-[#7C3AED] transition-all cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{cond.icon}</span>
                        <div>
                          <div className="text-sm font-black text-[#1A102F]">{cond.title}</div>
                          <div className="text-[11px] text-[#64748B]">{cond.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. VISIT */}
                {conditionType === 'visit' && (
                  <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚗</span>
                        <span className="text-xs font-black text-[#1A102F]">Visit Rule</span>
                      </div>
                      <button
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-bold text-[#6D28D9]"
                      >
                        Change condition
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-black text-[#1A102F] mb-1">
                        <span>Qualifying no of visits</span>
                        <span className="text-red-500 text-[10px]">Mandatory</span>
                      </div>
                      <div className="flex items-center justify-between bg-[#FAF8FD] p-2.5 rounded-2xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setVisitQualifyingCount((c) => Math.max(1, c - 1))}
                          className="w-8 h-8 rounded-xl bg-white border border-gray-200 font-bold text-sm shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-[#1A102F]">{visitQualifyingCount} visit</span>
                        <button
                          type="button"
                          onClick={() => setVisitQualifyingCount((c) => c + 1)}
                          className="w-8 h-8 rounded-xl bg-[#2D0F55] text-white font-bold text-sm shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-black text-[#1A102F] mb-1">
                        <span>Minimum bill amount</span>
                        <span className="text-red-500 text-[10px]">Mandatory</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">₹</span>
                        <input
                          type="text"
                          value={visitMinBill}
                          onChange={(e) => setVisitMinBill(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8FD] border border-gray-200 rounded-2xl text-xs font-black text-[#1A102F]"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#1A102F] block mb-1">Apply to</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setVisitApplyTo('per_bill')}
                          className={`p-2.5 rounded-2xl border text-left cursor-pointer ${
                            visitApplyTo === 'per_bill'
                              ? 'border-[#5B21B6] bg-purple-50 text-[#5B21B6] font-black'
                              : 'border-gray-200 bg-white text-gray-600'
                          }`}
                        >
                          Per bill
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisitApplyTo('total_spent')}
                          className={`p-2.5 rounded-2xl border text-left cursor-pointer ${
                            visitApplyTo === 'total_spent'
                              ? 'border-[#5B21B6] bg-purple-50 text-[#5B21B6] font-black'
                              : 'border-gray-200 bg-white text-gray-600'
                          }`}
                        >
                          Total money spent
                        </button>
                      </div>
                    </div>

                    {/* Rule Preview */}
                    <div className="bg-[#F5F0FF] rounded-2xl p-3 border border-purple-100 flex items-start gap-2 text-[11px] text-[#4C1D95]">
                      <Info className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                      <span>Customer needs to visit your restaurant at least {visitQualifyingCount} time to be eligible.</span>
                    </div>
                  </div>
                )}

                {/* 2. BILLING */}
                {conditionType === 'billing' && (
                  <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧾</span>
                        <span className="text-xs font-black text-[#1A102F]">Billing Rule</span>
                      </div>
                      <button
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-bold text-[#6D28D9]"
                      >
                        Change condition
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#1A102F] block mb-1">Target Amount</span>
                      <div className="text-2xl font-black text-[#1A102F] mb-2">₹ {billingTargetAmount}</div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[250, 500, 1000, 2500].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setBillingTargetAmount(amt)}
                            className={`py-2 rounded-xl text-xs font-black cursor-pointer ${
                              billingTargetAmount === amt
                                ? 'bg-[#2D0F55] text-white shadow-xs'
                                : 'bg-[#FAF8FD] text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#F5F0FF] rounded-2xl p-3 border border-purple-100 flex items-start gap-2 text-[11px] text-[#4C1D95]">
                      <Info className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                      <span>Customer will be eligible after spending ₹{billingTargetAmount} in a {billingFrequency.toLowerCase()}.</span>
                    </div>
                  </div>
                )}

                {/* 3. STAMPS */}
                {conditionType === 'stamps' && (
                  <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        <span className="text-xs font-black text-[#1A102F]">Stamps Rule</span>
                      </div>
                      <button
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-bold text-[#6D28D9]"
                      >
                        Change condition
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#1A102F] block mb-1">Target Stamps</span>
                      <div className="flex items-center justify-between bg-[#FAF8FD] p-2.5 rounded-2xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setStampsCount((c) => Math.max(1, c - 1))}
                          className="w-8 h-8 rounded-xl bg-white border border-gray-200 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-[#1A102F]">{stampsCount} stamps</span>
                        <button
                          type="button"
                          onClick={() => setStampsCount((c) => c + 1)}
                          className="w-8 h-8 rounded-xl bg-[#2D0F55] text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#1A102F] block mb-2">Customer Pass Preview</span>
                      <div className="bg-[#FAF8FD] p-3.5 rounded-3xl border border-gray-200 flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                          <div key={s} className="w-8 h-8 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            ✓
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          🎁
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ITEM / HAPPY HOURS / COMBO / BIRTHDAY */}
                {conditionType !== 'visit' && conditionType !== 'billing' && conditionType !== 'stamps' && (
                  <div className="bg-white rounded-3xl p-4 border border-[#F1EBF5] space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs font-black text-[#1A102F]">{conditionType.toUpperCase()} Rule</span>
                      <button
                        onClick={() => setIsConfiguringCondition(false)}
                        className="text-xs font-bold text-[#6D28D9]"
                      >
                        Change condition
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Configure parameters for {conditionType}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 4: REWARDS */}
        {/* ===================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Choose Reward Type</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Select what reward customers will receive upon qualifying.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'cashback', title: 'Cashback', desc: 'Direct wallet balance', icon: '💰' },
                { id: 'points', title: 'Reward Points', desc: 'Loyalty points added', icon: '⭐' },
                { id: 'free_item', title: 'Free Item', desc: 'Complimentary catalog item', icon: '🎁' },
                { id: 'discount', title: 'Discount', desc: 'Percentage off on bill', icon: '🏷️' },
                { id: 'nominal_item', title: 'Nominal Price Item', desc: 'Fixed special price', icon: '🪙' },
                { id: 'combo', title: 'Combo Offers', desc: 'Packaged food & drink deals', icon: '🍔' },
                { id: 'bogo', title: 'Buy X Get Y Free', desc: 'Buy 1 get 1 or custom quantity', icon: '🍕' }
              ].map((rew) => {
                const isSelected = rewardType === rew.id;
                return (
                  <div
                    key={rew.id}
                    onClick={() => setRewardType(rew.id as any)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#7C3AED] bg-white shadow-md shadow-purple-500/5 ring-2 ring-purple-100'
                        : 'border-[#F1EBF5] bg-white shadow-2xs hover:border-[#DDD6FE]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{rew.icon}</span>
                      <div>
                        <div className="text-sm font-black text-[#1A102F]">{rew.title}</div>
                        <div className="text-[11px] text-[#64748B]">{rew.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 5: TEMPLATES & MESSAGING */}
        {/* ===================================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Templates & Messaging</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Preview customer notification before launching.</p>
            </div>

            {/* Channels */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                { id: 'sms', label: 'SMS', icon: '📱' },
                { id: 'in_app', label: 'In-App', icon: '🔔' }
              ].map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setMessageChannel(ch.id as any)}
                  className={`py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                    messageChannel === ch.id
                      ? 'bg-[#2D0F55] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <span className="mr-1">{ch.icon}</span> {ch.label}
                </button>
              ))}
            </div>

            {/* Smartphone Pass Preview */}
            <div className="bg-gradient-to-tr from-[#2D0F55] to-[#581C87] text-white rounded-3xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs text-purple-200 font-bold">
                <span>LOYALITICS REWARD PASS</span>
                <span>Active</span>
              </div>
              <div className="text-xl font-black">{campaignName}</div>
              <p className="text-xs text-purple-100 leading-relaxed">{audienceDesc}</p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center justify-between border border-white/20">
                <div>
                  <div className="text-[10px] text-purple-200 font-bold">PROMO CODE</div>
                  <div className="text-base font-mono font-black tracking-widest">{promoCode}</div>
                </div>
                <button className="px-4 py-1.5 bg-white text-purple-950 rounded-xl text-xs font-black shadow-xs">
                  Redeem
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 6: REVIEW & LAUNCH */}
        {/* ===================================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h1 className="text-[22px] font-black text-[#1A102F]">Review & Launch</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Verify your campaign parameters before publishing.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#F1EBF5] space-y-3 shadow-2xs text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold">Campaign Name:</span>
                <span className="font-black text-[#1A102F]">{campaignName}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold">Target Audience:</span>
                <span className="font-black text-[#1A102F]">{selectedTier} • {audienceCategory}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold">Condition:</span>
                <span className="font-black text-[#1A102F]">{conditionType.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold">Reward:</span>
                <span className="font-black text-[#1A102F]">{rewardType.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold">Validity:</span>
                <span className="font-black text-emerald-700">{startDate} - {endDate}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Campaign launched successfully on mobile!');
                setViewMode('dashboard');
              }}
              className="w-full py-4 bg-gradient-to-r from-[#2D0F55] to-[#6D28D9] text-white rounded-2xl text-sm font-black shadow-lg shadow-purple-950/20 hover:opacity-95 transition-all cursor-pointer"
            >
              🚀 Launch Campaign
            </button>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION BUTTONS (For Steps 1 to 5) */}
      {currentStep < 6 && (
        <div className="px-5 pt-3 border-t border-[#F0EBF5] bg-white/90 backdrop-blur-md flex items-center justify-between max-w-sm mx-auto w-full">
          <button
            onClick={() => {
              if (currentStep === 1) {
                setCreationSetupStep(campaignCreationMode === 'multiple' ? 'configure_multiple' : 'choose_type');
              } else if (currentStep === 2) {
                if (audienceSubStep === 'sliders') setAudienceSubStep('tiers');
                else if (audienceSubStep === 'tiers') setAudienceSubStep('order_types');
                else if (audienceSubStep === 'order_types') setAudienceSubStep('audience_type');
                else setCurrentStep(1);
              } else {
                setCurrentStep((s) => Math.max(1, s - 1));
              }
            }}
            className="text-xs font-black text-[#1A102F] hover:text-[#6D28D9] flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <button
            onClick={() => {
              if (currentStep === 2) {
                if (audienceSubStep === 'audience_type') setAudienceSubStep('order_types');
                else if (audienceSubStep === 'order_types') setAudienceSubStep('tiers');
                else if (audienceSubStep === 'tiers') setAudienceSubStep('sliders');
                else setCurrentStep(3);
              } else {
                setCurrentStep((s) => Math.min(6, s + 1));
              }
            }}
            className="px-8 py-3 bg-[#2D0F55] hover:bg-[#3D1472] text-white rounded-2xl text-xs font-black shadow-md shadow-purple-950/20 cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileCampaignView;
